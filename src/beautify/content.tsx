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

//const CONTENT_BLOCK_PATTERN = /<div\b[^>]*data-cx-content[^>]*>([\s\S]*?)<\/div>/i
const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/
const DIALOGUE_OPEN_PATTERN = /^【[^】\r\n]+】\s*[：:]\s*[“"]/
const DIALOGUE_CLOSE_PATTERN = /[”"]\s*$/

type RenderState = {
    mesText: HTMLElement
    contentHost: HTMLElement
    mount: HTMLElement
    root: Root
    blocks: ContentBlock[]
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

function getTextNodes(root: Node): Text[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []

    while (walker.nextNode()) {
        nodes.push(walker.currentNode as Text)
    }

    return nodes
}

function wrapTextFromStart(root: Node, length: number, className: string) {
    let remaining = length

    for (const textNode of getTextNodes(root)) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        const range = document.createRange()

        range.setStart(textNode, 0)
        range.setEnd(textNode, count)

        const wrapper = document.createElement('span')
        wrapper.className = className
        range.surroundContents(wrapper)

        remaining -= count
    }
}

function wrapTextFromEnd(root: Node, length: number, className: string) {
    let remaining = length

    for (const textNode of getTextNodes(root).reverse()) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        const range = document.createRange()

        range.setStart(textNode, textNode.data.length - count)
        range.setEnd(textNode, textNode.data.length)

        const wrapper = document.createElement('span')
        wrapper.className = className
        range.surroundContents(wrapper)

        remaining -= count
    }
}

/**
 * 只隐藏对话前后的格式标记，不重建正文 DOM。
 * 正文中的 <插图>、<img> 等节点仍然保持原节点和原位置。
 */
function hideDialogueMarkers(node: Node, fullText: string) {
    if (!(node instanceof HTMLElement)) return

    if (node.querySelector('.cx-dialogue-prefix, .cx-dialogue-suffix')) {
        return
    }

    const leadingLength = fullText.match(/^\s*/)?.[0].length ?? 0
    const opening = fullText.trim().match(DIALOGUE_OPEN_PATTERN)?.[0]
    const closing = fullText.match(DIALOGUE_CLOSE_PATTERN)?.[0]

    if (opening) {
        wrapTextFromStart(
            node,
            leadingLength + opening.length,
            'cx-dialogue-prefix',
        )
    }

    if (closing) {
        wrapTextFromEnd(node, closing.length, 'cx-dialogue-suffix')
    }
}

function getContentBlocks(contentHost: HTMLElement): ContentBlock[] {
    return Array.from(contentHost.childNodes)
        .filter((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return Boolean(node.textContent?.trim())
            }

            if (
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).classList.contains('cx-react-mount')
            ) {
                return false
            }

            return node.nodeType === Node.ELEMENT_NODE
        })
        .map((node) => {
            const fullText = node.textContent ?? ''
            const match = fullText.trim().match(DIALOGUE_PATTERN)

            if (!match) {
                return { node }
            }

            hideDialogueMarkers(node, fullText)

            return {
                node,
                speaker: match[1].trim(),
            }
        })
}

function cleanupState(state: RenderState) {
    const shouldRestore = state.mount.isConnected && state.contentHost.isConnected

    state.observer.disconnect()
    state.root.unmount()

    if (shouldRestore) {
        // DomSlot 的卸载会把节点放回 contentHost，这里再按原顺序整理一次。
        state.blocks.forEach(({ node }) => state.contentHost.appendChild(node))
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

    // React 不再重复渲染，避免覆盖其他插件刚修改的正文 DOM。
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

    const blocks = getContentBlocks(contentHost)

    if (blocks.length === 0) return

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'
    contentHost.append(mount)

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
        blocks,
        observer,
    }

    renderStates.set(messageId, state)
    observer.observe(mesText, { childList: true, subtree: true })

    root.render(
        <ContentRenderer blocks={blocks} contentHost={contentHost} />,
    )
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
