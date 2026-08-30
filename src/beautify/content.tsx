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
    blocks: ContentBlock[]
    observer: MutationObserver
}

const renderStates = new Map<number, RenderState>()
const renderTimers = new Map<number, number>()
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
    // 兼容新格式和旧消息；两者都只作为真实 DOM 的定位点。
    return mesText.querySelector<HTMLElement>('[data-cx-content], content')
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

function hideDialogueMarkers(node: Node, fullText: string): Node {
    let element: HTMLElement

    if (node instanceof HTMLElement) {
        element = node
    } else {
        element = document.createElement('span')
        node.parentNode?.replaceChild(element, node)
        element.appendChild(node)
    }

    if (element.querySelector('.cx-dialogue-prefix, .cx-dialogue-suffix')) {
        return element
    }

    const leadingLength = fullText.match(/^\s*/)?.[0].length ?? 0
    const opening = fullText.trim().match(DIALOGUE_OPEN_PATTERN)?.[0]
    const closing = fullText.match(DIALOGUE_CLOSE_PATTERN)?.[0]

    if (opening) {
        wrapTextFromStart(
            element,
            leadingLength + opening.length,
            'cx-dialogue-prefix',
        )
    }

    if (closing) {
        wrapTextFromEnd(element, closing.length, 'cx-dialogue-suffix')
    }

    return element
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

            return {
                node: hideDialogueMarkers(node, fullText),
                speaker: match[1].trim(),
            }
        })
}

function cleanupState(state: RenderState) {
    const shouldRestore = state.mount.isConnected && state.contentHost.isConnected

    state.observer.disconnect()
    state.root.unmount()

    if (shouldRestore) {
        state.blocks.forEach((block) => state.contentHost.appendChild(block.node))
    }

    state.mount.remove()
}

function disposeState(messageId: number) {
    const state = renderStates.get(messageId)

    if (!state) return

    renderStates.delete(messageId)
    cleanupState(state)
}

function scheduleRenderMessage(messageId: number, invalidate = false) {
    if (invalidate) {
        disposeState(messageId)
    }

    const previousTimer = renderTimers.get(messageId)

    if (previousTimer !== undefined) {
        window.clearTimeout(previousTimer)
    }

    const timer = window.setTimeout(() => {
        renderTimers.delete(messageId)

        // 当前事件结束后再读 DOM，确保酒馆和其他显示正则已经完成。
        window.requestAnimationFrame(() => {
            if (contentRenderActive) {
                renderMessage(messageId)
            }
        })
    }, 0)

    renderTimers.set(messageId, timer)
}

function renderMessage(messageId: number) {
    const mesText = getMessageText(messageId)

    if (!mesText) {
        disposeState(messageId)
        return
    }

    const contentHost = getContentHost(mesText)

    if (!contentHost) {
        disposeState(messageId)
        return
    }

    const oldState = renderStates.get(messageId)

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
            scheduleRenderMessage(messageId)
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
        scheduleRenderMessage(messageId)
    }
}

export function startContentRender() {
    contentRenderActive = true
    renderAll()

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, renderAll),
        eventOn(
            tavern_events.CHARACTER_MESSAGE_RENDERED,
            (messageId) => scheduleRenderMessage(messageId, true),
        ),
        eventOn(
            tavern_events.MESSAGE_EDITED,
            (messageId) => scheduleRenderMessage(messageId, true),
        ),
        eventOn(
            tavern_events.MESSAGE_UPDATED,
            (messageId) => scheduleRenderMessage(messageId, true),
        ),
    ]

    return () => {
        contentRenderActive = false

        listeners.forEach((listener) => listener.stop())

        renderTimers.forEach((timer) => window.clearTimeout(timer))
        renderTimers.clear()

        renderStates.forEach((state) => cleanupState(state))
        renderStates.clear()
    }
}
