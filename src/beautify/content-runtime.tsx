import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'
import {
    CONTENT_HOST_CLASS,
    CONTENT_TAG_NAME,
    ensureContentDisplayRegex,
} from '@/beautify/content-regex.ts'

type StopRender = () => void

const STYLE_ID = 'cangxuanjie-plugin-style'
const WRAPPED_HOST_SELECTOR = `.${CONTENT_HOST_CLASS}`
const RAW_HOST_SELECTOR = CONTENT_TAG_NAME
const MAIN_CONTENT_HOST_SELECTOR = [
    `.mes_text ${WRAPPED_HOST_SELECTOR}`,
    `.mes_text ${RAW_HOST_SELECTOR}`,
].join(', ')
const EMBEDDED_CONTENT_HOST_SELECTOR = [
    WRAPPED_HOST_SELECTOR,
    RAW_HOST_SELECTOR,
].join(', ')
const MESSAGE_IFRAME_SELECTOR = 'iframe[id^="TH-message--"]'
const DIAGNOSTIC_PREFIX = '[苍玄界诊断]'

const renderStates = new Map<HTMLElement, StopRender>()
const documentObserverStops = new Map<Document, StopRender>()
const iframeLoadStops = new Map<HTMLIFrameElement, StopRender>()
const iframeDocuments = new Map<HTMLIFrameElement, Document>()

let mainDocument: Document | null = null
let embeddedCss = ''

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

function getHostSelector(document: Document) {
    return document === mainDocument
        ? MAIN_CONTENT_HOST_SELECTOR
        : EMBEDDED_CONTENT_HOST_SELECTOR
}

function getIframeSnapshot(tavernDocument: Document) {
    const iframes = Array.from(
        tavernDocument.querySelectorAll<HTMLIFrameElement>(MESSAGE_IFRAME_SELECTOR),
    )
    let accessibleIframeCount = 0
    let iframeWrappedHostCount = 0
    let iframeRawHostCount = 0
    let iframeMountCount = 0
    let iframeReactCount = 0

    for (const iframe of iframes) {
        try {
            const iframeDocument = iframe.contentDocument

            if (!iframeDocument?.body) continue

            accessibleIframeCount += 1
            iframeWrappedHostCount += iframeDocument.querySelectorAll(WRAPPED_HOST_SELECTOR).length
            iframeRawHostCount += iframeDocument.querySelectorAll(RAW_HOST_SELECTOR).length
            iframeMountCount += iframeDocument.querySelectorAll('.cx-react-mount').length
            iframeReactCount += iframeDocument.querySelectorAll('.cx-bg').length
        } catch {
            // 跨源 iframe 无法读取；计数会明确显示它没有进入 accessibleIframeCount。
        }
    }

    return {
        messageIframeCount: iframes.length,
        accessibleIframeCount,
        iframeWrappedHostCount,
        iframeRawHostCount,
        iframeMountCount,
        iframeReactCount,
    }
}

function getDocumentSnapshot(tavernDocument: Document) {
    const messageElements = Array.from(
        tavernDocument.querySelectorAll<HTMLElement>('.mes_text'),
    )

    return {
        readyState: tavernDocument.readyState,
        hasBody: Boolean(tavernDocument.body),
        messageCount: messageElements.length,
        strictHostCount: tavernDocument.querySelectorAll(
            `.mes_text ${WRAPPED_HOST_SELECTOR}`,
        ).length,
        rawHostCount: tavernDocument.querySelectorAll(
            `.mes_text ${RAW_HOST_SELECTOR}`,
        ).length,
        literalContentCount: messageElements.filter((element) =>
            element.textContent?.includes('<content'),
        ).length,
        mountCount: tavernDocument.querySelectorAll('.cx-react-mount').length,
        reactCount: tavernDocument.querySelectorAll('.cx-bg').length,
        ...getIframeSnapshot(tavernDocument),
    }
}

function renderContentHost(contentHost: HTMLElement) {
    if (renderStates.has(contentHost)) {
        return
    }

    const isRawContentElement = contentHost.localName === CONTENT_TAG_NAME

    if (isRawContentElement) {
        contentHost.classList.add(CONTENT_HOST_CLASS)
    }

    diagnostic('host-found', {
        hostKind: isRawContentElement ? 'raw-content-element' : 'regex-wrapper',
        connected: contentHost.isConnected,
        childNodeCount: contentHost.childNodes.length,
        ownerIsMainDocument: contentHost.ownerDocument === mainDocument,
        parentClass: contentHost.parentElement?.className,
    })

    try {
        const stop = renderMessage(contentHost)
        renderStates.set(contentHost, stop)
    } catch (error) {
        diagnosticError('host-render-failed', error, {
            connected: contentHost.isConnected,
            hostKind: isRawContentElement ? 'raw-content-element' : 'regex-wrapper',
        })
    }
}

function renderHostsInside(node: Node, ownerDocument: Document) {
    if (node.nodeType !== 1) {
        return
    }

    const element = node as HTMLElement
    const selector = getHostSelector(ownerDocument)

    if (element.matches(selector)) {
        renderContentHost(element)
    }

    element
        .querySelectorAll<HTMLElement>(selector)
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

function renderAllMessages(document: Document, phase: string) {
    if (document === mainDocument) {
        diagnostic(`scan:${phase}:before`, getDocumentSnapshot(document))
    }

    document
        .querySelectorAll<HTMLElement>(getHostSelector(document))
        .forEach(renderContentHost)

    removeDisconnectedRenderStates()

    if (document === mainDocument) {
        diagnostic(`scan:${phase}:after`, getDocumentSnapshot(document))
    }
}

function injectStyleIntoEmbeddedDocument(document: Document) {
    if (document === mainDocument || !document.head) return

    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null

    if (!style) {
        style = document.createElement('style')
        style.id = STYLE_ID
        document.head.appendChild(style)
    }

    if (style.textContent !== embeddedCss) {
        style.textContent = embeddedCss
    }
}

function stopObservingDocument(document: Document) {
    documentObserverStops.get(document)?.()
    documentObserverStops.delete(document)
}

function attachIframeDocument(iframe: HTMLIFrameElement) {
    try {
        const iframeDocument = iframe.contentDocument

        if (!iframeDocument?.body) {
            diagnostic('message-iframe-not-ready', { id: iframe.id })
            return
        }

        const previousDocument = iframeDocuments.get(iframe)

        if (previousDocument && previousDocument !== iframeDocument) {
            stopObservingDocument(previousDocument)
        }

        iframeDocuments.set(iframe, iframeDocument)
        injectStyleIntoEmbeddedDocument(iframeDocument)
        observeDocument(iframeDocument, `message-iframe:${iframe.id}`)
        renderAllMessages(iframeDocument, `message-iframe:${iframe.id}`)

        diagnostic('message-iframe-attached', {
            id: iframe.id,
            readyState: iframeDocument.readyState,
            wrappedHostCount: iframeDocument.querySelectorAll(WRAPPED_HOST_SELECTOR).length,
            rawHostCount: iframeDocument.querySelectorAll(RAW_HOST_SELECTOR).length,
            mountCount: iframeDocument.querySelectorAll('.cx-react-mount').length,
            reactCount: iframeDocument.querySelectorAll('.cx-bg').length,
        })
    } catch (error) {
        diagnosticError('message-iframe-inaccessible', error, { id: iframe.id })
    }
}

function watchMessageIframe(iframe: HTMLIFrameElement) {
    if (!iframeLoadStops.has(iframe)) {
        const onLoad = () => attachIframeDocument(iframe)
        iframe.addEventListener('load', onLoad)
        iframeLoadStops.set(iframe, () => iframe.removeEventListener('load', onLoad))
    }

    attachIframeDocument(iframe)
}

function watchMessageIframesInside(node: Node) {
    if (node.nodeType !== 1) return

    const element = node as HTMLElement

    if (element.matches(MESSAGE_IFRAME_SELECTOR)) {
        watchMessageIframe(element as HTMLIFrameElement)
    }

    element
        .querySelectorAll<HTMLIFrameElement>(MESSAGE_IFRAME_SELECTOR)
        .forEach(watchMessageIframe)
}

function removeDisconnectedIframeStates() {
    for (const [iframe, stopLoading] of iframeLoadStops) {
        if (iframe.isConnected) continue

        stopLoading()
        iframeLoadStops.delete(iframe)

        const iframeDocument = iframeDocuments.get(iframe)
        if (iframeDocument) {
            stopObservingDocument(iframeDocument)
            iframeDocuments.delete(iframe)
        }
    }
}

function observeDocument(document: Document, label: string) {
    if (documentObserverStops.has(document)) return

    const Observer = document.defaultView?.MutationObserver

    if (!Observer || !document.body) {
        diagnostic('observer-unavailable', { label })
        return
    }

    const observer = new Observer((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                renderHostsInside(node, document)

                if (document === mainDocument) {
                    watchMessageIframesInside(node)
                }
            })
        }

        removeDisconnectedRenderStates()

        if (document === mainDocument) {
            removeDisconnectedIframeStates()
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })

    documentObserverStops.set(document, () => observer.disconnect())
    diagnostic('observer-started', { label })
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
        ownerIsMainDocument: mount.ownerDocument === mainDocument,
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
            ownerIsMainDocument: mount.ownerDocument === mainDocument,
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

export async function startContentRender(pluginCss: string) {
    const tavernDocument = window.parent.document
    const ownerWindow = tavernDocument.defaultView ?? window
    const delayedScanTimers: number[] = []

    mainDocument = tavernDocument
    embeddedCss = pluginCss

    diagnostic('runtime-start', {
        iframeDocument: window.document !== tavernDocument,
        ...getDocumentSnapshot(tavernDocument),
    })

    observeDocument(tavernDocument, 'main-document')
    watchMessageIframesInside(tavernDocument.body)

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
                    watchMessageIframesInside(tavernDocument.body)
                }, delay),
            )
        }
    } catch (error) {
        delayedScanTimers.forEach((timer) => ownerWindow.clearTimeout(timer))
        documentObserverStops.forEach((stop) => stop())
        documentObserverStops.clear()
        diagnosticError('runtime-start-failed', error)
        throw error
    }

    return () => {
        delayedScanTimers.forEach((timer) => ownerWindow.clearTimeout(timer))

        iframeLoadStops.forEach((stop) => stop())
        iframeLoadStops.clear()

        iframeDocuments.forEach((document) => {
            document.getElementById(STYLE_ID)?.remove()
        })
        iframeDocuments.clear()

        documentObserverStops.forEach((stop) => stop())
        documentObserverStops.clear()

        for (const [contentHost, stop] of renderStates) {
            stop()
            renderStates.delete(contentHost)
        }

        mainDocument = null
        embeddedCss = ''
        diagnostic('runtime-stopped')
    }
}
