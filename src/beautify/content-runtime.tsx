import { parseContent } from '@/beautify/content-parser.ts'
import Content from '@/beautify/Content.tsx'
import { logDiagnostic } from '@/diagnostics.ts'
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

function preview(value: string | null | undefined, limit = 600) {
    const text = value ?? ''
    return text.length > limit ? `${text.slice(0, limit)}…[${text.length - limit} chars]` : text
}

function describeNode(node: Node, index: number) {
    const element = node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : null

    return {
        index,
        type: node.nodeType,
        name: node.nodeName,
        className: element?.className || null,
        text: preview(node.textContent, 180),
        html: preview(element?.outerHTML, 500),
    }
}

function getRawMessageSnapshot(messageElement: HTMLElement) {
    const messageId = Number(messageElement.closest('.mes')?.getAttribute('mesid'))

    if (!Number.isInteger(messageId)) return null

    try {
        const raw = getChatMessages(messageId)[0]?.message ?? ''
        const openIndex = raw.search(/<content\b[^>]*>/i)
        const closeIndex = raw.search(/<\/content\s*>/i)

        return {
            messageId,
            length: raw.length,
            openIndex,
            closeIndex,
            aroundOpen: preview(
                openIndex >= 0 ? raw.slice(Math.max(0, openIndex - 100), openIndex + 900) : '',
                1000,
            ),
            aroundClose: preview(
                closeIndex >= 0 ? raw.slice(Math.max(0, closeIndex - 800), closeIndex + 200) : '',
                1000,
            ),
        }
    } catch {
        return { messageId, unavailable: true }
    }
}

function logMessageStructure(messageElement: HTMLElement) {
    const contentElements = Array.from(
        messageElement.querySelectorAll<HTMLElement>(CONTENT_TAG_NAME),
    )

    logDiagnostic('message-before-render', {
        raw: getRawMessageSnapshot(messageElement),
        dom: {
            childCount: messageElement.childNodes.length,
            innerHTML: preview(messageElement.innerHTML, 6000),
            children: Array.from(messageElement.childNodes)
                .slice(0, 40)
                .map(describeNode),
            contentElements: contentElements.map((element) => ({
                html: preview(element.outerHTML, 1200),
                childCount: element.childNodes.length,
                parent: element.parentElement?.tagName ?? null,
                parentClass: element.parentElement?.className || null,
                previousSibling: element.previousSibling
                    ? describeNode(element.previousSibling, -1)
                    : null,
                nextSibling: element.nextSibling
                    ? describeNode(element.nextSibling, -1)
                    : null,
            })),
        },
    })
}

function renderMessage(messageElement: HTMLElement) {
    const existing = renderStates.get(messageElement)

    if (existing?.mount.isConnected) return

    if (existing) {
        existing.stop()
        renderStates.delete(messageElement)
    }

    logMessageStructure(messageElement)

    const originalChildren = Array.from(messageElement.childNodes)
    const nodes = parseContent(messageElement)
    const mount = messageElement.ownerDocument.createElement('div')

    messageElement.replaceChildren(mount)

    const root = createRoot(mount)
    root.render(<Content nodes={nodes} contentHost={messageElement} />)

    const stop = () => {
        logDiagnostic('render-stop-start', {
            messageId: messageElement.closest('.mes')?.getAttribute('mesid') ?? null,
            messageConnected: messageElement.isConnected,
            mountConnected: mount.isConnected,
            mountIsDirectChild: mount.parentElement === messageElement,
        })

        root.unmount()

        if (messageElement.isConnected && mount.parentElement === messageElement) {
            messageElement.replaceChildren(...originalChildren)
        }

        logDiagnostic('render-stop-complete', {
            messageId: messageElement.closest('.mes')?.getAttribute('mesid') ?? null,
            restoredChildCount: messageElement.childNodes.length,
            containsReactContent: Boolean(messageElement.querySelector('.cx-bg')),
        })
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

    logDiagnostic('runtime-start', {
        markedMessageCount: tavernDocument.querySelectorAll(
            `${MESSAGE_SELECTOR}:has(${CONTENT_TAG_NAME})`,
        ).length,
    })

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
        logDiagnostic('runtime-stop-start', { renderCount: renderStates.size })
        observer.disconnect()
        renderStates.forEach(({ stop }) => stop())
        renderStates.clear()
        logDiagnostic('runtime-stop-complete')
    }
}
