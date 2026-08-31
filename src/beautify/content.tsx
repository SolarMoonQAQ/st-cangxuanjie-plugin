import { createRoot, type Root } from 'react-dom/client'
import ContentRenderer from './ContentRenderer'

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

const CONTENT_BLOCK_PATTERN = /<div\b[^>]*data-cx-content[^>]*>([\s\S]*?)<\/div>/i

type RenderState = {
    mesText: HTMLElement
    contentHost: HTMLElement
    mount: HTMLElement
    root: Root
    originalHtml: string
}

const renderStates = new Map<number, RenderState>()

type PendingRender = {
    firstFrame: number
    secondFrame: number | null
}

// SillyTavern emits the message-rendered event while other extensions may
// still be applying their post-processing/regex DOM transforms. Delay our
// mutation until two paint cycles have completed, and coalesce duplicate
// events for the same message.
const pendingRenders = new Map<number, PendingRender>()
const preservedContentHosts = new Set<HTMLElement>()

function hasThirdPartyRenderedNodes(contentHost: HTMLElement) {
    // Plain message formatting normally leaves paragraphs and line breaks.
    // Any other element may belong to a regex/frontend extension (for
    // example an <inner> replacement), so React must leave this subtree alone.
    return Array.from(contentHost.querySelectorAll('*')).some((element) => {
        if (element.closest('.cx-react-mount')) return false

        return element.tagName !== 'P' && element.tagName !== 'BR'
    })
}

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

export function extractContent(messageId: number): string | null {
    const message = SillyTavern.chat[messageId]?.mes

    if (typeof message !== 'string') {
        return null
    }

    const match = message.match(CONTENT_BLOCK_PATTERN)

    if (!match) {
        return null
    }

    return match[1].trim()
}

function renderMessage(messageId: number) {
    const displayed = retrieveDisplayedMessage(messageId)[0] as HTMLElement | undefined

    if (!displayed) return

    const mesText = displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')

    if (!mesText) return

    const content = extractContent(messageId)

    if (!content) return

    const contentHost = mesText.querySelector<HTMLElement>('[data-cx-content]')

    if (!contentHost) {
        console.warn(`[苍玄界] 找不到 content 节点，第 ${messageId} 楼跳过渲染`)
        return
    }

    if (hasThirdPartyRenderedNodes(contentHost)) {
        contentHost.classList.add('cx-bg')
        preservedContentHosts.add(contentHost)
        console.info(`[苍玄界] 第 ${messageId} 楼包含其他插件生成的节点，保留原始渲染结果`)
        return
    }

    const oldState = renderStates.get(messageId)

    if (
        oldState &&
        oldState.mesText === mesText &&
        oldState.mount.isConnected &&
        oldState.mount.parentElement === contentHost
    ) {
        oldState.root.render(<ContentRenderer content={content} />)
        return
    }

    if (oldState) {
        oldState.root.unmount()
        renderStates.delete(messageId)
    }

    const originalHtml = contentHost.innerHTML

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'

    /*
     * 只替换 <content> 内部
     */
    contentHost.replaceChildren(mount)

    const root = createRoot(mount)

    root.render(<ContentRenderer content={content} />)

    renderStates.set(messageId, {
        mesText,
        contentHost,
        mount,
        root,
        originalHtml,
    })
}

function renderAll() {
    for (let messageId = 0; messageId < SillyTavern.chat.length; messageId++) {
        scheduleRenderMessage(messageId)
    }
}

function scheduleRenderMessage(messageId: number) {
    const previous = pendingRenders.get(messageId)

    if (previous) {
        cancelAnimationFrame(previous.firstFrame)

        if (previous.secondFrame !== null) {
            cancelAnimationFrame(previous.secondFrame)
        }
    }

    const pending: PendingRender = {
        firstFrame: 0,
        secondFrame: null,
    }

    pending.firstFrame = requestAnimationFrame(() => {
        pending.secondFrame = requestAnimationFrame(() => {
            pendingRenders.delete(messageId)
            renderMessage(messageId)
        })
    })

    pendingRenders.set(messageId, pending)
}

export function startContentRender() {
    renderAll()

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, renderAll),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, scheduleRenderMessage),
        eventOn(tavern_events.MESSAGE_EDITED, scheduleRenderMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, scheduleRenderMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())

        pendingRenders.forEach(({ firstFrame, secondFrame }) => {
            cancelAnimationFrame(firstFrame)

            if (secondFrame !== null) {
                cancelAnimationFrame(secondFrame)
            }
        })
        pendingRenders.clear()

        preservedContentHosts.forEach((contentHost) => {
            contentHost.classList.remove('cx-bg')
        })
        preservedContentHosts.clear()

        renderStates.forEach(({ root, contentHost, mount, originalHtml }) => {
            root.unmount()

            if (contentHost.isConnected && mount.parentElement === contentHost) {
                contentHost.innerHTML = originalHtml
            }
        })

        renderStates.clear()
    }
}
