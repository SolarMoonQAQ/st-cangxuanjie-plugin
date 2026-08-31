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

type RenderState = {
    mesText: HTMLElement
    contentHost: HTMLElement
    mount: HTMLElement
    root: Root
    originalHtml: string
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

function findMatchingClosingTag(
    text: string,
    contentStart: number,
    tagName: string,
): number | null {
    const tagPattern = new RegExp(
        `<!--[\\s\\S]*?-->|<\\/?${tagName}\\b[^>]*>`,
        'gi',
    )
    tagPattern.lastIndex = contentStart

    let depth = 1

    for (let match = tagPattern.exec(text); match; match = tagPattern.exec(text)) {
        const token = match[0]

        if (token.startsWith('<!--')) {
            continue
        }

        if (new RegExp(`^<\\/${tagName}\\b`, 'i').test(token)) {
            depth -= 1

            if (depth === 0) {
                return match.index
            }
        } else if (!/\/\s*>$/.test(token)) {
            depth += 1
        }
    }

    return null
}

function extractRawContentFromMessage(message: string): string | null {
    const wrappers = [
        {
            tagName: 'div',
            opening: /<div\b[^>]*\bdata-cx-content\b[^>]*>/i,
        },
        {
            tagName: 'content',
            opening: /<content\b[^>]*>/i,
        },
    ]

    for (const wrapper of wrappers) {
        const opening = message.match(wrapper.opening)

        if (!opening || opening.index === undefined) {
            continue
        }

        const contentStart = opening.index + opening[0].length
        const closingIndex = findMatchingClosingTag(
            message,
            contentStart,
            wrapper.tagName,
        )

        if (closingIndex !== null) {
            return message.slice(contentStart, closingIndex)
        }
    }

    return null
}

/** 读取原始消息中的 content，不读取酒馆已经格式化过的 HTML。 */
export function extractContent(messageId: number): string | null {
    const message = SillyTavern.chat[messageId]?.mes

    if (typeof message !== 'string') {
        return null
    }

    return extractRawContentFromMessage(message)?.trim() ?? null
}

/**
 * 让酒馆先执行所有启用的原生显示正则，再把结果解析为真实 DOM。
 * React 后续只移动这些节点，不重新拼接或转义它们。
 */
function createFormattedContentHost(messageId: number): HTMLElement | null {
    const rawContent = extractContent(messageId)

    if (rawContent === null) {
        return null
    }

    try {
        const formattedHtml = formatAsDisplayedMessage(rawContent, {
            message_id: messageId,
        })
        const holder = document.createElement('div')

        holder.innerHTML = formattedHtml

        return holder
    } catch (error: unknown) {
        console.error(`[苍玄界] 第 ${messageId} 楼 content 格式化失败`, error)
        return null
    }
}

function getTextNodes(root: Node): Text[] {
    const ownerDocument = root.ownerDocument ?? document
    const walker = ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []

    while (walker.nextNode()) {
        nodes.push(walker.currentNode as Text)
    }

    return nodes
}

function wrapTextFromStart(root: Node, length: number, className: string) {
    let remaining = length
    const ownerDocument = root.ownerDocument ?? document

    for (const textNode of getTextNodes(root)) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        const range = ownerDocument.createRange()

        range.setStart(textNode, 0)
        range.setEnd(textNode, count)

        const wrapper = ownerDocument.createElement('span')
        wrapper.className = className
        range.surroundContents(wrapper)

        remaining -= count
    }
}

function wrapTextFromEnd(root: Node, length: number, className: string) {
    let remaining = length
    const ownerDocument = root.ownerDocument ?? document

    for (const textNode of getTextNodes(root).reverse()) {
        if (remaining <= 0) break

        const count = Math.min(remaining, textNode.data.length)
        const range = ownerDocument.createRange()

        range.setStart(textNode, textNode.data.length - count)
        range.setEnd(textNode, textNode.data.length)

        const wrapper = ownerDocument.createElement('span')
        wrapper.className = className
        range.surroundContents(wrapper)

        remaining -= count
    }
}

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/
const DIALOGUE_OPEN_PATTERN = /^【[^】\r\n]+】\s*[：:]\s*[“"]/
const DIALOGUE_CLOSE_PATTERN = /[”"]\s*$/

function hideDialogueMarkers(node: Node, fullText: string): Node {
    const ownerDocument = node.ownerDocument ?? document
    const element =
        node.nodeType === Node.ELEMENT_NODE
            ? (node as HTMLElement)
            : ownerDocument.createElement('span')

    if (element !== node) {
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

function getContentNodes(contentHost: HTMLElement): Node[] {
    const nodes = Array.from(contentHost.childNodes).filter((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return Boolean(node.textContent?.trim())
        }

        return !(
            node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).classList.contains('cx-react-mount')
        )
    })

    // 某些 HTML 结果只有一个纯文本节点，补成段落后再识别对白。
    if (nodes.length !== 1 || nodes[0].nodeType !== Node.TEXT_NODE) {
        return nodes
    }

    const text = nodes[0].textContent ?? ''
    const parts = text
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean)

    if (parts.length <= 1) return nodes

    const ownerDocument = contentHost.ownerDocument ?? document
    const fragment = ownerDocument.createDocumentFragment()

    for (const part of parts) {
        const paragraph = ownerDocument.createElement('p')
        paragraph.textContent = part
        fragment.appendChild(paragraph)
    }

    contentHost.replaceChild(fragment, nodes[0])

    return getContentNodes(contentHost)
}

function getContentBlocks(contentHost: HTMLElement): ContentBlock[] {
    return getContentNodes(contentHost).map((node) => {
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

/** 清理热更新或重复执行留下的旧挂载点。 */
function recoverOrphanedMount(contentHost: HTMLElement) {
    const mounts = Array.from(contentHost.children).filter((element) => {
        return element.classList.contains('cx-react-mount')
    })

    for (const mount of mounts) {
        for (const slot of Array.from(mount.querySelectorAll('.cx-dom-slot'))) {
            while (slot.firstChild) {
                contentHost.appendChild(slot.firstChild)
            }
        }

        mount.remove()
    }
}

function cleanupState(state: RenderState) {
    const shouldRestore =
        state.mount.isConnected &&
        state.contentHost.isConnected &&
        state.mount.parentElement === state.contentHost

    state.root.unmount()

    if (shouldRestore) {
        state.contentHost.innerHTML = state.originalHtml
    }

    state.mount.remove()
}

function disposeState(messageId: number) {
    const state = renderStates.get(messageId)

    if (!state) return

    renderStates.delete(messageId)
    cleanupState(state)
}

function renderMessage(messageId: number) {
    const displayed = retrieveDisplayedMessage(messageId)[0] as HTMLElement | undefined

    if (!displayed) {
        disposeState(messageId)
        return
    }

    const mesText = displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')

    if (!mesText) {
        disposeState(messageId)
        return
    }

    const contentHost = mesText.querySelector<HTMLElement>(
        '[data-cx-content], content',
    )

    if (!contentHost) {
        disposeState(messageId)
        return
    }

    const oldState = renderStates.get(messageId)

    if (
        oldState &&
        oldState.mesText === mesText &&
        oldState.contentHost === contentHost &&
        oldState.mount.isConnected &&
        oldState.mount.parentElement === contentHost
    ) {
        return
    }

    if (oldState) {
        renderStates.delete(messageId)
        cleanupState(oldState)
    }

    recoverOrphanedMount(contentHost)

    const formattedHost = createFormattedContentHost(messageId)

    if (!formattedHost) return

    const blocks = getContentBlocks(formattedHost)

    if (blocks.length === 0) return

    const originalHtml = contentHost.innerHTML
    const ownerDocument = contentHost.ownerDocument ?? document
    const mount = ownerDocument.createElement('div')
    mount.className = 'cx-react-mount'

    // 只替换 content 内部，不动外面的 options、progress 等内容。
    contentHost.replaceChildren(mount)

    const root = createRoot(mount)

    renderStates.set(messageId, {
        mesText,
        contentHost,
        mount,
        root,
        originalHtml,
    })

    root.render(
        <ContentRenderer blocks={blocks} contentHost={contentHost} />,
    )
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

        window.requestAnimationFrame(() => {
            if (contentRenderActive) {
                renderMessage(messageId)
            }
        })
    }, 0)

    renderTimers.set(messageId, timer)
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
