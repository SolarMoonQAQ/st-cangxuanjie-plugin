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

function preview(value: string | null | undefined, limit = 100) {
    const text = value ?? ''
    return text.length > limit ? `${text.slice(0, limit)}…[${text.length - limit} chars]` : text
}

function isMeaningfulNode(node: Node) {
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())
}

function describeNode(node: Node, index: number) {
    const element = node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : null

    return {
        index,
        name: node.nodeName,
        className: preview(element?.className || null, 80),
        text: preview(node.textContent?.replace(/\s+/g, ' ').trim(), 120),
    }
}

function getRawMessageParts(messageElement: HTMLElement) {
    const messageId = Number(messageElement.closest('.mes')?.getAttribute('mesid'))

    if (!Number.isInteger(messageId)) return null

    try {
        const raw = getChatMessages(messageId)[0]?.message ?? ''
        const openMatch = /<content\b[^>]*>/i.exec(raw)
        const closeMatch = /<\/content\s*>/i.exec(raw)

        if (!openMatch || !closeMatch || closeMatch.index <= openMatch.index) return null

        const contentStart = openMatch.index + openMatch[0].length
        const suffixStart = closeMatch.index + closeMatch[0].length

        return {
            messageId,
            content: raw.slice(contentStart, closeMatch.index),
            suffix: raw.slice(suffixStart),
        }
    } catch {
        return null
    }
}

function getDirectMessageChild(node: Node, messageElement: HTMLElement): ChildNode | null {
    let current: Node | null = node

    while (current?.parentNode && current.parentNode !== messageElement) {
        current = current.parentNode
    }

    return current?.parentNode === messageElement ? current as ChildNode : null
}

function getFormattedNodes(text: string, messageId: number, ownerDocument: Document) {
    const holder = ownerDocument.createElement('div')
    holder.innerHTML = formatAsDisplayedMessage(text, { message_id: messageId })
    return Array.from(holder.childNodes).filter(isMeaningfulNode)
}

function normalizedText(node: Node) {
    return node.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

function nodesMatch(expected: Node, actual: Node) {
    const expectedText = normalizedText(expected)
    const actualText = normalizedText(actual)

    if (!expectedText || !actualText) return expected.nodeName === actual.nodeName
    return expectedText === actualText
}

function matchFormattedContent(expected: Node[], live: Node[], startIndex: number) {
    const matchedLiveIndexes: number[] = []
    let liveIndex = Math.max(0, startIndex)

    for (const expectedNode of expected) {
        while (liveIndex < live.length && !nodesMatch(expectedNode, live[liveIndex])) {
            liveIndex += 1
        }

        if (liveIndex >= live.length) break

        matchedLiveIndexes.push(liveIndex)
        liveIndex += 1
    }

    return matchedLiveIndexes
}

function describeEdge(nodes: Node[], count: number) {
    if (nodes.length === 0) return []

    const indexes = [
        ...nodes.slice(0, count).map((_, index) => index),
        ...nodes.slice(-count).map((_, index) => Math.max(0, nodes.length - count) + index),
    ]

    return [...new Set(indexes)].map((index) => describeNode(nodes[index], index))
}

function logBoundaryProbe(messageElement: HTMLElement) {
    const parts = getRawMessageParts(messageElement)
    const contentMarker = messageElement.querySelector(CONTENT_TAG_NAME)

    if (!parts || !contentMarker) {
        logDiagnostic('boundary-probe-unavailable')
        return
    }

    const liveNodes = Array.from(messageElement.childNodes).filter(isMeaningfulNode)
    const startNode = getDirectMessageChild(contentMarker, messageElement)
    const startIndex = startNode ? liveNodes.indexOf(startNode) : -1

    try {
        const formattedContentNodes = getFormattedNodes(
            parts.content,
            parts.messageId,
            messageElement.ownerDocument,
        )
        const formattedSuffixNodes = getFormattedNodes(
            parts.suffix,
            parts.messageId,
            messageElement.ownerDocument,
        )
        const matchedIndexes = matchFormattedContent(
            formattedContentNodes,
            liveNodes,
            startIndex,
        )

        logDiagnostic('boundary-probe', {
            messageId: parts.messageId,
            rawContentLength: parts.content.length,
            rawSuffixPreview: preview(parts.suffix.trim(), 180),
            liveNodeCount: liveNodes.length,
            startIndex,
            formattedContentNodeCount: formattedContentNodes.length,
            formattedSuffixNodeCount: formattedSuffixNodes.length,
            matchedContentNodeCount: matchedIndexes.length,
            lastMatchedLiveIndex: matchedIndexes.at(-1) ?? null,
            contentEdges: describeEdge(formattedContentNodes, 2),
            suffixEdges: describeEdge(formattedSuffixNodes, 2),
            liveEdges: describeEdge(liveNodes, 4),
        })
    } catch {
        logDiagnostic('boundary-probe-format-failed', { messageId: parts.messageId })
    }
}

function renderMessage(messageElement: HTMLElement) {
    const existing = renderStates.get(messageElement)

    if (existing?.mount.isConnected) return

    if (existing) {
        existing.stop()
        renderStates.delete(messageElement)
    }

    logBoundaryProbe(messageElement)

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
