import { parseContent } from '@/content/content-parser.ts'
import Content from '@/content/Content.tsx'
import { createRoot } from 'react-dom/client'
import { queryClient } from '@/shared/query.ts'
import { QueryClientProvider } from '@tanstack/react-query'

type StopRender = () => void
type RenderState = {
    mount: HTMLElement
    stop: StopRender
}

type RawContent = {
    messageId: number
    content: string
}

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

const MESSAGE_SELECTOR = '.mes_text'
const renderStates = new Map<HTMLElement, RenderState>()

function hideLeadingContentBreaks(contentHost: HTMLElement) {
    const contentMarker = contentHost.querySelector(CONTENT_TAG_NAME)
    const snapshots: Array<{ element: HTMLElement; value: string; priority: string }> = []

    if (!contentMarker) return () => undefined

    for (const node of contentMarker.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue
        if (node.nodeType !== Node.ELEMENT_NODE || node.nodeName !== 'BR') break

        const element = node as HTMLElement
        snapshots.push({
            element,
            value: element.style.getPropertyValue('display'),
            priority: element.style.getPropertyPriority('display'),
        })
        element.style.setProperty('display', 'none', 'important')
    }

    return () => {
        snapshots.forEach(({ element, value, priority }) => {
            if (value) {
                element.style.setProperty('display', value, priority)
            } else {
                element.style.removeProperty('display')
            }
        })
    }
}

function isMeaningfulNode(node: Node) {
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())
}

function getRawContent(messageElement: HTMLElement): RawContent | null {
    const messageId = Number(messageElement.closest('.mes')?.getAttribute('mesid'))

    if (!Number.isInteger(messageId)) return null

    try {
        const raw = getChatMessages(messageId)[0]?.message ?? ''
        const openMatch = /<content\b[^>]*>/i.exec(raw)
        const closeMatch = /<\/content\s*>/i.exec(raw)

        if (!openMatch || !closeMatch || closeMatch.index <= openMatch.index) return null

        return {
            messageId,
            content: raw.slice(openMatch.index + openMatch[0].length, closeMatch.index),
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

    return current?.parentNode === messageElement ? (current as ChildNode) : null
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

/**
 * 酒馆把 <content> 当作行内标签，会在第一个段落末尾隐式闭合它。
 * 因此用原始消息中的正文单独走一次酒馆格式化，再与现场顶层节点匹配，
 * 得到真正属于正文的连续 DOM 区间。
 */
function resolveContentRange(messageElement: HTMLElement): ChildNode[] | null {
    const rawContent = getRawContent(messageElement)
    const contentMarker = messageElement.querySelector(CONTENT_TAG_NAME)

    if (!rawContent || !contentMarker) return null

    const liveNodes = Array.from(messageElement.childNodes).filter(isMeaningfulNode)
    const startNode = getDirectMessageChild(contentMarker, messageElement)
    const startIndex = startNode ? liveNodes.indexOf(startNode) : -1

    if (!startNode || startIndex < 0) return null

    let expectedNodes: Node[]

    try {
        expectedNodes = getFormattedNodes(
            rawContent.content,
            rawContent.messageId,
            messageElement.ownerDocument,
        )
    } catch {
        return null
    }

    if (expectedNodes.length === 0) return null

    const matchedIndexes = matchFormattedContent(expectedNodes, liveNodes, startIndex)

    if (matchedIndexes.length !== expectedNodes.length || matchedIndexes[0] !== startIndex) {
        return null
    }

    const lastNode = liveNodes[matchedIndexes[matchedIndexes.length - 1]] as ChildNode
    const range: ChildNode[] = []
    let current: ChildNode | null = startNode

    while (current) {
        range.push(current)
        if (current === lastNode) return range
        current = current.nextSibling
    }

    return null
}

function renderMessage(messageElement: HTMLElement) {
    const existing = renderStates.get(messageElement)

    if (existing?.mount.isConnected) return

    if (existing) {
        existing.stop()
        renderStates.delete(messageElement)
    }

    const originalNodes = resolveContentRange(messageElement)

    if (!originalNodes?.length) return

    const ownerDocument = messageElement.ownerDocument
    const contentHost = ownerDocument.createElement('div')
    const mount = ownerDocument.createElement('div')

    messageElement.insertBefore(mount, originalNodes[0])
    originalNodes.forEach((node) => contentHost.appendChild(node))

    const restoreLeadingBreaks = hideLeadingContentBreaks(contentHost)
    const root = createRoot(mount)
    root.render(
        <QueryClientProvider client={queryClient}>
            <Content nodes={parseContent(contentHost)} contentHost={contentHost} />
        </QueryClientProvider>,
    )

    const stop = () => {
        root.unmount()
        restoreLeadingBreaks()

        if (messageElement.isConnected && mount.parentElement === messageElement) {
            mount.replaceWith(...originalNodes)
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

    tavernDocument.querySelectorAll(CONTENT_TAG_NAME).forEach((contentElement) => {
        const message = contentElement.closest<HTMLElement>(MESSAGE_SELECTOR)
        if (message) renderMessage(message)
    })

    return () => {
        observer.disconnect()
        renderStates.forEach(({ stop }) => stop())
        renderStates.clear()
    }
}
