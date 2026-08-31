import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'
import { CONTENT_HOST_CLASS, ensureContentDisplayRegex } from '@/beautify/content-regex.ts'

type StopRender = () => void

const CONTENT_HOST_SELECTOR = `.mes_text div.${CONTENT_HOST_CLASS}`
const renderStates = new Map<HTMLElement, StopRender>()

function renderContentHost(contentHost: HTMLElement) {
    if (renderStates.has(contentHost)) {
        return
    }

    const stop = renderMessage(contentHost)
    renderStates.set(contentHost, stop)
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

function renderAllMessages(tavernDocument: Document) {
    tavernDocument
        .querySelectorAll<HTMLElement>(CONTENT_HOST_SELECTOR)
        .forEach(renderContentHost)

    removeDisconnectedRenderStates()
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

    return () => observer.disconnect()
}

function renderMessage(contentHost: HTMLElement): StopRender {
    const originalChildren = Array.from(contentHost.childNodes)

    const nodes = parseContent(contentHost)

    const mount = contentHost.ownerDocument.createElement('div')
    mount.className = 'cx-react-mount'

    contentHost.replaceChildren(mount)

    const root = createRoot(mount)

    root.render(<Content nodes={nodes} contentHost={contentHost} />)

    return () => {
        root.unmount()

        if (contentHost.isConnected && mount.parentElement === contentHost) {
            contentHost.replaceChildren(...originalChildren)
        }
    }
}

export async function startContentRender() {
    const tavernDocument = window.parent.document
    const stopObserving = observeContentHosts(tavernDocument)

    try {
        renderAllMessages(tavernDocument)
        await ensureContentDisplayRegex()
        renderAllMessages(tavernDocument)
    } catch (error) {
        stopObserving()
        throw error
    }

    return () => {
        stopObserving()

        for (const [contentHost, stop] of renderStates) {
            stop()
            renderStates.delete(contentHost)
        }
    }
}
