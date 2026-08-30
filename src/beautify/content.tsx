import { createRoot, type Root } from 'react-dom/client'
import ContentRenderer, { type ContentBlock } from './ContentRenderer'

const CONTENT_PROMPT_ID = 'cangxuanjie-content-format'

const contentPrompt = {
    id: CONTENT_PROMPT_ID,
    position: 'in_chat' as const,
    depth: 0,
    role: 'system' as const,
    should_scan: false,
    content: `
输出时必须遵守以下格式：

1. 所有面向用户展示的正文内容，包括旁白、动作、环境描写、角色对话，都必须放在唯一的一对 <div data-cx-content> 和 </div> 标签内。
2. 除了 <div data-cx-content>...</div> 外，不要输出任何正文内容。
3. 不要遗漏标签，不要嵌套 content 标签。
4. 不要把标签放进 Markdown 代码块中。

格式示例：

<div data-cx-content>
这里是完整的正文内容。
</div>
`,
}

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/
const DIALOGUE_OPEN_PATTERN = /^【[^】\r\n]+】\s*[：:]\s*[“"]/
const DIALOGUE_CLOSE_PATTERN = /[”"]\s*$/

type RenderState = {
    mesText: HTMLElement
    contentHost: HTMLElement
    mount: HTMLElement
    root: Root
    originalHtml: string
    observer: MutationObserver
}

const renderStates = new Map<number, RenderState>()
let contentRenderActive = false

export function injectBeautifyPrompt() {
    let uninject: (() => void) | null = null

    const installPrompt = () => {
        uninject?.()

        uninject = injectPrompts([contentPrompt]).uninject
    }

    installPrompt()

    const listeners = [eventOn(tavern_events.CHAT_CHANGED, installPrompt)]

    return () => {
        listeners.forEach((listener) => listener.stop())

        uninject?.()
        uninject = null
    }
}

function getMessageText(messageId: number): HTMLElement | null {
    const displayed = retrieveDisplayedMessage(messageId)[0] as HTMLElement | undefined

    if (!displayed) return null

    return displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')
}

function getContentHost(mesText: HTMLElement): HTMLElement | null {
    return mesText.querySelector<HTMLElement>('[data-cx-content]')
}

function getMeaningfulNodes(root: HTMLElement): Node[] {
    return Array.from(root.childNodes).filter((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return Boolean(node.textContent?.trim())
        }

        return node.nodeType === Node.ELEMENT_NODE
    })
}

function isBlockElement(element: Element): boolean {
    return [
        'ADDRESS',
        'ARTICLE',
        'ASIDE',
        'BLOCKQUOTE',
        'DIV',
        'DL',
        'FIELDSET',
        'FIGURE',
        'FOOTER',
        'FORM',
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6',
        'HEADER',
        'HR',
        'LI',
        'MAIN',
        'NAV',
        'OL',
        'P',
        'PRE',
        'SECTION',
        'TABLE',
        'UL',
    ].includes(element.tagName)
}

function getRenderedNodes(contentHost: HTMLElement): Node[] {
    const source = document.createElement('div')
    source.innerHTML = contentHost.innerHTML

    const directNodes = getMeaningfulNodes(source)

    if (directNodes.length !== 1) {
        return directNodes
    }

    const onlyNode = directNodes[0]

    if (onlyNode.nodeType === Node.TEXT_NODE) {
        const text = onlyNode.textContent ?? ''

        if (!/\n{2,}/.test(text)) {
            return directNodes
        }

        return text
            .split(/\n{2,}/)
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
                const paragraph = document.createElement('p')
                paragraph.textContent = part
                return paragraph
            })
    }

    if (onlyNode instanceof HTMLElement) {
        const blockChildren = Array.from(onlyNode.children).filter(isBlockElement)

        if (blockChildren.length > 1) {
            return blockChildren
        }
    }

    return directNodes
}

function getTextNodes(root: Node): Text[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []

    while (walker.nextNode()) {
        nodes.push(walker.currentNode as Text)
    }

    return nodes
}

function removeTextFromStart(root: Node, length: number) {
    let remaining = length

    for (const textNode of getTextNodes(root)) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        textNode.deleteData(0, count)
        remaining -= count
    }
}

function removeTextFromEnd(root: Node, length: number) {
    let remaining = length

    for (const textNode of getTextNodes(root).reverse()) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        textNode.deleteData(textNode.data.length - count, count)
        remaining -= count
    }
}

function escapeHtml(text: string): string {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

function toHtml(node: Node): string {
    if (node instanceof HTMLElement) {
        return node.outerHTML
    }

    return escapeHtml(node.textContent ?? '')
}

function getContentBlocks(contentHost: HTMLElement): ContentBlock[] {
    return getRenderedNodes(contentHost).map((node) => {
        const text = node.textContent ?? ''
        const match = text.trim().match(DIALOGUE_PATTERN)

        if (!match) {
            return { html: toHtml(node) }
        }

        const clone = node.cloneNode(true)
        const leadingLength = text.match(/^\s*/)?.[0].length ?? 0
        const opening = text.trim().match(DIALOGUE_OPEN_PATTERN)?.[0]
        const closing = text.match(DIALOGUE_CLOSE_PATTERN)?.[0]

        if (opening) {
            removeTextFromStart(clone, leadingLength + opening.length)
        }

        if (closing) {
            removeTextFromEnd(clone, closing.length)
        }

        return {
            html: clone instanceof HTMLElement
                ? clone.innerHTML
                : escapeHtml(clone.textContent ?? ''),
            speaker: match[1].trim(),
        }
    })
}

function cleanupState(state: RenderState) {
    const shouldRestore = state.mount.isConnected && state.contentHost.isConnected

    state.observer.disconnect()
    state.root.unmount()

    if (shouldRestore && state.mount.parentElement === state.contentHost) {
        state.contentHost.innerHTML = state.originalHtml
    }

    state.mount.remove()
}

function scheduleRemount(messageId: number) {
    queueMicrotask(() => {
        if (!contentRenderActive) return

        const state = renderStates.get(messageId)

        if (state && state.mount.isConnected && state.contentHost.isConnected) {
            return
        }

        renderMessage(messageId)
    })
}

function renderMessage(messageId: number) {
    const mesText = getMessageText(messageId)

    if (!mesText) return

    const contentHost = getContentHost(mesText)

    if (!contentHost) {
        console.warn(`[苍玄界] 找不到 content 节点，第 ${messageId} 楼跳过渲染`)
        return
    }

    const oldState = renderStates.get(messageId)

    // 已经挂载时不重复 render，给其他插件留下修改最终 DOM 的空间。
    if (
        oldState &&
        oldState.mesText === mesText &&
        oldState.contentHost === contentHost &&
        oldState.mount.isConnected
    ) {
        return
    }

    if (oldState) {
        renderStates.delete(messageId)
        cleanupState(oldState)
    }

    const originalHtml = contentHost.innerHTML
    const blocks = getContentBlocks(contentHost)

    if (blocks.length === 0) return

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'
    contentHost.replaceChildren(mount)

    const root = createRoot(mount)
    const observer = new MutationObserver(() => {
        const state = renderStates.get(messageId)

        if (!state || !state.mount.isConnected || !state.contentHost.isConnected) {
            scheduleRemount(messageId)
        }
    })

    const state: RenderState = {
        mesText,
        contentHost,
        mount,
        root,
        originalHtml,
        observer,
    }

    renderStates.set(messageId, state)
    observer.observe(mesText, { childList: true, subtree: true })

    root.render(<ContentRenderer blocks={blocks} />)
}

function renderAll() {
    for (let messageId = 0; messageId < SillyTavern.chat.length; messageId++) {
        renderMessage(messageId)
    }
}

export function startContentRender() {
    contentRenderActive = true
    renderAll()

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, renderAll),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, renderMessage),
        eventOn(tavern_events.MESSAGE_EDITED, renderMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, renderMessage),
    ]

    return () => {
        contentRenderActive = false

        listeners.forEach((listener) => listener.stop())

        renderStates.forEach((state) => cleanupState(state))
        renderStates.clear()
    }
}
