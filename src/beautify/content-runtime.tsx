import { parseContent } from '@/beautify/content-parser.ts'
import Content from '@/beautify/Content.tsx'
import { createRoot } from 'react-dom/client'

type StopRender = () => void
type RenderState = {
    mount: HTMLElement
    stop: StopRender
}

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

const MESSAGE_SELECTOR = '.mes_text'
const renderStates = new Map<HTMLElement, RenderState>()

function renderMessage(messageElement: HTMLElement) {
    const existing = renderStates.get(messageElement)

    if (existing?.mount.isConnected) return

    if (existing) {
        existing.stop()
        renderStates.delete(messageElement)
    }

    const originalChildren = Array.from(messageElement.childNodes)
    const nodes = parseContent(messageElement)
    const mount = messageElement.ownerDocument.createElement('div')

    messageElement.replaceChildren(mount)

    const root = createRoot(mount)
    root.render(<Content nodes={nodes} contentHost={messageElement} />)

    const stop = () => {
        root.unmount()

        if (messageElement.isConnected && mount.parentElement === messageElement) {
            messageElement.replaceChildren(...originalChildren)
        }
    }

    renderStates.set(messageElement, { mount, stop })
}

function renderMessagesMarkedInside(node: Node) {
    if (node.nodeType !== 1) return

    const element = node as HTMLElement
    const messages = new Set<HTMLElement>()

    if (element.matches(CONTENT_TAG_NAME)) {
        const message = element.closest<HTMLElement>(MESSAGE_SELECTOR)
        if (message) messages.add(message)
    }

    element.querySelectorAll(CONTENT_TAG_NAME).forEach((contentElement) => {
        const message = contentElement.closest<HTMLElement>(MESSAGE_SELECTOR)
        if (message) messages.add(message)
    })

    messages.forEach(renderMessage)
}

function removeDisconnectedRenders() {
    for (const [messageElement, state] of renderStates) {
        if (messageElement.isConnected && state.mount.isConnected) continue

        state.stop()
        renderStates.delete(messageElement)
    }
}

export function startContentRender() {
    const tavernDocument = window.parent.document

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(renderMessagesMarkedInside)
        }

        removeDisconnectedRenders()
    })

    observer.observe(tavernDocument.body, {
        childList: true,
        subtree: true,
    })

    tavernDocument
        .querySelectorAll(CONTENT_TAG_NAME)
        .forEach((contentElement) => {
            const message = contentElement.closest<HTMLElement>(MESSAGE_SELECTOR)
            if (message) renderMessage(message)
        })

    return () => {
        observer.disconnect()
        renderStates.forEach(({ stop }) => stop())
        renderStates.clear()
    }
}
