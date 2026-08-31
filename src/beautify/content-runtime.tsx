import { parseContent } from '@/beautify/content-parser.ts'
import Content from '@/beautify/Content.tsx'
import { createRoot } from 'react-dom/client'

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
const STYLE_ID = 'cangxuanjie-plugin-style'
const renderStates = new Map<HTMLElement, RenderState>()

function round(value: number) {
    return Math.round(value * 100) / 100
}

function getElementSpacing(element: Element | null, rootTop: number) {
    if (!element || element.nodeType !== 1) return null

    const view = element.ownerDocument.defaultView
    if (!view) return null

    const htmlElement = element as HTMLElement
    const rect = htmlElement.getBoundingClientRect()
    const style = view.getComputedStyle(htmlElement)

    return {
        tag: element.tagName,
        className: element.className,
        topFromRoot: round(rect.top - rootTop),
        bottomFromRoot: round(rect.bottom - rootTop),
        height: round(rect.height),
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        lineHeight: style.lineHeight,
    }
}

function getTextEdge(root: HTMLElement, fromEnd: boolean) {
    const document = root.ownerDocument
    const view = document.defaultView
    if (!view) return null

    const walker = document.createTreeWalker(root, 4)
    const textNodes: Text[] = []
    let current = walker.nextNode()

    while (current) {
        if (current.textContent?.trim()) textNodes.push(current as Text)
        current = walker.nextNode()
    }

    const candidates = fromEnd ? textNodes.reverse() : textNodes

    for (const textNode of candidates) {
        const text = textNode.textContent ?? ''
        const offset = fromEnd ? text.search(/\S(?=\s*$)/) : text.search(/\S/)
        if (offset < 0) continue

        const range = document.createRange()
        range.setStart(textNode, offset)
        range.setEnd(textNode, offset + 1)
        const rect = range.getBoundingClientRect()

        if (rect.width === 0 && rect.height === 0) continue

        const rootRect = root.getBoundingClientRect()
        return {
            text: text.slice(offset, offset + 12),
            topFromRoot: round(rect.top - rootRect.top),
            bottomFromRoot: round(rect.bottom - rootRect.top),
        }
    }

    return null
}

function logSpacing(messageElement: HTMLElement, mount: HTMLElement, contentHost: HTMLElement) {
    const root = mount.querySelector<HTMLElement>('.cx-bg')
    const view = messageElement.ownerDocument.defaultView

    if (!root || !view || !mount.isConnected) return

    const rootRect = root.getBoundingClientRect()
    const rootStyle = view.getComputedStyle(root)
    const firstChild = root.firstElementChild
    const lastChild = root.lastElementChild
    const firstParagraph = firstChild?.querySelector('.cx-dom-slot > p') ?? null
    const lastParagraph = lastChild?.querySelector('.cx-dom-slot > p') ?? null
    const renderedContent = root.querySelector(CONTENT_TAG_NAME)
    const breaks = renderedContent ? Array.from(renderedContent.querySelectorAll('br')) : []
    const pluginStyle = messageElement.ownerDocument.getElementById(STYLE_ID)

    console.info(
        `[苍玄界间距] ${JSON.stringify({
            messageId: messageElement.closest('.mes')?.getAttribute('mesid') ?? null,
            root: {
                height: round(rootRect.height),
                paddingTop: rootStyle.paddingTop,
                paddingBottom: rootStyle.paddingBottom,
                borderTop: rootStyle.borderTopWidth,
                borderBottom: rootStyle.borderBottomWidth,
            },
            firstChild: getElementSpacing(firstChild, rootRect.top),
            lastChild: getElementSpacing(lastChild, rootRect.top),
            firstParagraph: getElementSpacing(firstParagraph, rootRect.top),
            lastParagraph: getElementSpacing(lastParagraph, rootRect.top),
            firstText: getTextEdge(root, false),
            lastText: getTextEdge(root, true),
            renderedContentTag: Boolean(renderedContent),
            renderedBreaks: breaks.map((element) => {
                const rect = element.getBoundingClientRect()
                return {
                    display: view.getComputedStyle(element).display,
                    topFromRoot: round(rect.top - rootRect.top),
                    height: round(rect.height),
                }
            }),
            detachedHostStart: contentHost.innerHTML.slice(0, 240),
            pluginStyleLength: pluginStyle?.textContent?.length ?? 0,
            pluginStyleHasParagraphReset:
                pluginStyle?.textContent?.includes('.cx-narration > .cx-dom-slot > p') ?? false,
        })}`,
    )
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

    const root = createRoot(mount)
    root.render(<Content nodes={parseContent(contentHost)} contentHost={contentHost} />)

    ownerDocument.defaultView?.requestAnimationFrame(() => {
        ownerDocument.defaultView?.requestAnimationFrame(() => {
            logSpacing(messageElement, mount, contentHost)
        })
    })

    const stop = () => {
        root.unmount()

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
