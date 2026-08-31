import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'
import { CONTENT_HOST_CLASS, ensureContentDisplayRegex } from '@/beautify/content-regex.ts'

type StopRender = () => void

const CONTENT_HOST_SELECTOR = `.mes_text div.${CONTENT_HOST_CLASS}`
const DIAGNOSTIC_PREFIX = '[苍玄界诊断]'
const renderStates = new Map<HTMLElement, StopRender>()

function errorDetails(error: unknown) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        }
    }

    return { value: String(error) }
}

function diagnostic(event: string, details: Record<string, unknown> = {}) {
    console.info(`${DIAGNOSTIC_PREFIX} ${event} ${JSON.stringify(details)}`)
}

function diagnosticError(event: string, error: unknown, details: Record<string, unknown> = {}) {
    console.error(
        `${DIAGNOSTIC_PREFIX} ${event} ${JSON.stringify({
            ...details,
            error: errorDetails(error),
        })}`,
    )
}

function getDocumentSnapshot(tavernDocument: Document) {
    const messageElements = Array.from(
        tavernDocument.querySelectorAll<HTMLElement>('.mes_text'),
    )

    return {
        readyState: tavernDocument.readyState,
        hasBody: Boolean(tavernDocument.body),
        messageCount: messageElements.length,
        strictHostCount: tavernDocument.querySelectorAll(CONTENT_HOST_SELECTOR).length,
        looseHostCount: tavernDocument.querySelectorAll(`.${CONTENT_HOST_CLASS}`).length,
        contentElementCount: tavernDocument.querySelectorAll('content').length,
        literalContentCount: messageElements.filter((element) =>
            element.textContent?.includes('<content'),
        ).length,
        mountCount: tavernDocument.querySelectorAll('.cx-react-mount').length,
        reactCount: tavernDocument.querySelectorAll('.cx-bg').length,
    }
}

function renderContentHost(contentHost: HTMLElement) {
    if (renderStates.has(contentHost)) {
        return
    }

    diagnostic('host-found', {
        connected: contentHost.isConnected,
        childNodeCount: contentHost.childNodes.length,
        parentClass: contentHost.parentElement?.className,
    })

    try {
        const stop = renderMessage(contentHost)
        renderStates.set(contentHost, stop)
    } catch (error) {
        diagnosticError('host-render-failed', error, {
            connected: contentHost.isConnected,
        })
    }
}

function renderHostsInside(node: Node) {
    if (node.nodeType !== 1) {
        return
    }

    const element = node as HTMLElement

    if (element.matches(CONTENT_HOST_SELECTOR)) {
        renderContentHost(element)
    }

    element
        .querySelectorAll<HTMLElement>(CONTENT_HOST_SELECTOR)
        .forEach(renderContentHost)
}

function removeDisconnectedRenderStates() {
    for (const [contentHost, stop] of renderStates) {
        if (!contentHost.isConnected) {
            stop()
            renderStates.delete(contentHost)
        }
    }
}

function renderAllMessages(tavernDocument: Document, phase: string) {
    diagnostic(`scan:${phase}:before`, getDocumentSnapshot(tavernDocument))

    tavernDocument
        .querySelectorAll<HTMLElement>(CONTENT_HOST_SELECTOR)
        .forEach(renderContentHost)

    removeDisconnectedRenderStates()

    diagnostic(`scan:${phase}:after`, getDocumentSnapshot(tavernDocument))
}

function observeContentHosts(tavernDocument: Document) {
    const Observer = tavernDocument.defaultView?.MutationObserver

    if (!Observer || !tavernDocument.body) {
        throw new Error('无法观察酒馆聊天页面')
    }

    const observer = new Observer((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(renderHostsInside)
        }

        removeDisconnectedRenderStates()
    })

    observer.observe(tavernDocument.body, {
        childList: true,
        subtree: true,
    })

    diagnostic('observer-started', getDocumentSnapshot(tavernDocument))

    return () => {
        observer.disconnect()
        diagnostic('observer-stopped')
    }
}

function renderMessage(contentHost: HTMLElement): StopRender {
    const originalChildren = Array.from(contentHost.childNodes)

    const nodes = parseContent(contentHost)

    diagnostic('content-parsed', {
        nodeCount: nodes.length,
        nodeKinds: nodes.map((node) => node.kind),
    })

    const mount = contentHost.ownerDocument.createElement('div')
    mount.className = 'cx-react-mount'

    contentHost.replaceChildren(mount)

    diagnostic('mount-created', {
        connected: mount.isConnected,
        ownerIsParentDocument: mount.ownerDocument === window.parent.document,
    })

    const root = createRoot(mount, {
        onCaughtError(error, errorInfo) {
            diagnosticError('react-caught-error', error, {
                componentStack: errorInfo.componentStack,
            })
        },
        onUncaughtError(error, errorInfo) {
            diagnosticError('react-uncaught-error', error, {
                componentStack: errorInfo.componentStack,
            })
        },
        onRecoverableError(error, errorInfo) {
            diagnosticError('react-recoverable-error', error, {
                componentStack: errorInfo.componentStack,
            })
        },
    })

    root.render(<Content nodes={nodes} contentHost={contentHost} />)

    const checkCommit = () => {
        diagnostic('react-commit-check', {
            connected: mount.isConnected,
            childElementCount: mount.childElementCount,
            hasReactContent: Boolean(mount.querySelector('.cx-bg')),
        })
    }

    const ownerWindow = contentHost.ownerDocument.defaultView
    ownerWindow?.setTimeout(checkCommit, 0)
    ownerWindow?.setTimeout(checkCommit, 250)

    return () => {
        root.unmount()

        if (contentHost.isConnected && mount.parentElement === contentHost) {
            contentHost.replaceChildren(...originalChildren)
        }
    }
}

export async function startContentRender() {
    const tavernDocument = window.parent.document
    const ownerWindow = tavernDocument.defaultView ?? window
    const delayedScanTimers: number[] = []

    diagnostic('runtime-start', {
        iframeDocument: window.document !== tavernDocument,
        ...getDocumentSnapshot(tavernDocument),
    })

    const stopObserving = observeContentHosts(tavernDocument)

    try {
        renderAllMessages(tavernDocument, 'initial')
        diagnostic('regex-ensure-start')
        await ensureContentDisplayRegex()
        diagnostic('regex-ensure-complete')
        renderAllMessages(tavernDocument, 'after-regex')

        for (const delay of [100, 1000, 3000]) {
            delayedScanTimers.push(
                ownerWindow.setTimeout(() => {
                    renderAllMessages(tavernDocument, `delayed-${delay}ms`)
                }, delay),
            )
        }
    } catch (error) {
        delayedScanTimers.forEach((timer) => ownerWindow.clearTimeout(timer))
        stopObserving()
        diagnosticError('runtime-start-failed', error)
        throw error
    }

    return () => {
        delayedScanTimers.forEach((timer) => ownerWindow.clearTimeout(timer))
        stopObserving()

        for (const [contentHost, stop] of renderStates) {
            stop()
            renderStates.delete(contentHost)
        }

        diagnostic('runtime-stopped')
    }
}
