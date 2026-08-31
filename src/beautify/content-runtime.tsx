import { parseContent } from '@/beautify/content-parser.ts'
import Content from '@/beautify/Content.tsx'
import { createRoot } from 'react-dom/client'

type StopRender = () => void

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

const CONTENT_SELECTOR = `.mes_text ${CONTENT_TAG_NAME}`
const renderStops = new Map<HTMLElement, StopRender>()

function renderContent(contentElement: HTMLElement) {
    if (renderStops.has(contentElement)) return

    const originalChildren = Array.from(contentElement.childNodes)
    const nodes = parseContent(contentElement)
    const mount = contentElement.ownerDocument.createElement('div')

    contentElement.replaceChildren(mount)

    const root = createRoot(mount)
    root.render(<Content nodes={nodes} contentHost={contentElement} />)

    renderStops.set(contentElement, () => {
        root.unmount()

        if (contentElement.isConnected && mount.parentElement === contentElement) {
            contentElement.replaceChildren(...originalChildren)
        }
    })
}

function renderContentInside(node: Node) {
    if (node.nodeType !== 1) return

    const element = node as HTMLElement

    if (element.matches(CONTENT_SELECTOR)) {
        renderContent(element)
    }

    element.querySelectorAll<HTMLElement>(CONTENT_SELECTOR).forEach(renderContent)
}

function removeDisconnectedRenders() {
    for (const [contentElement, stop] of renderStops) {
        if (contentElement.isConnected) continue

        stop()
        renderStops.delete(contentElement)
    }
}

export function startContentRender() {
    const tavernDocument = window.parent.document

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(renderContentInside)
        }

        removeDisconnectedRenders()
    })

    observer.observe(tavernDocument.body, {
        childList: true,
        subtree: true,
    })

    tavernDocument
        .querySelectorAll<HTMLElement>(CONTENT_SELECTOR)
        .forEach(renderContent)

    return () => {
        observer.disconnect()
        renderStops.forEach((stop) => stop())
        renderStops.clear()
    }
}
