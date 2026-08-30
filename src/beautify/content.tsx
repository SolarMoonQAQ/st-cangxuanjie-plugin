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

1. 所有面向用户展示的正文内容，包括旁白、动作、环境描写、角色对话，都必须放在唯一的一对 <content> 和 </content> 标签内。
2. 除了 <content>...</content> 外，不要输出任何正文内容。
3. 不要遗漏标签，不要嵌套 content 标签。
4. 不要把标签放进 Markdown 代码块中。

格式示例：

<content>
这里是完整的正文内容。
</content>
`,
}

const CONTENT_BLOCK_PATTERN = /<content\b[^>]*>([\s\S]*?)<\/content>/i

type RenderState = {
    mesText: HTMLElement
    contentHost: HTMLElement
    mount: HTMLElement
    root: Root
    originalHtml: string
}

const renderStates = new Map<number, RenderState>()

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

    const oldState = renderStates.get(messageId)

    // 1. 如果已经在当前 DOM 树中成功挂载，直接更新 props，避免重新渲染整棵 DOM
    if (
        oldState &&
        oldState.mesText === mesText &&
        oldState.mount.isConnected &&
        mesText.contains(oldState.mount)
    ) {
        oldState.root.render(<ContentRenderer content={content} />)
        return
    }

    // 2. 清理旧状态
    if (oldState) {
        oldState.root.unmount()
        renderStates.delete(messageId)
    }

    // 3. 找到原有的 content 标签或残余结构，将其精准替换为挂载容器
    // 匹配 DOM 中可能存在的 <content...>...</content>（支持多行匹配）
    const domContentRegex = /<content\b[^>]*>[\s\S]*?<\/content>/i

    // 检查 mesText.innerHTML 中是否包含 <content> 结构
    if (!domContentRegex.test(mesText.innerHTML)) {
        // 如果 Markdown 解析器把标签解析为单个游离的 <content>，做一层 fallback
        const contentHost = mesText.querySelector<HTMLElement>('content')
        if (!contentHost) {
            console.warn(`[苍玄界] 找不到 content 节点，第 ${messageId} 楼跳过渲染`)
            return
        }
    }

    const originalHtml = mesText.innerHTML

    // 将原 HTML 中的 <content>...</content> 整体剔除并替换为挂载占位 div
    const mountPlaceholderId = `cx-mount-${messageId}-${Date.now()}`
    mesText.innerHTML = originalHtml.replace(
        domContentRegex,
        `<div id="${mountPlaceholderId}" class="cx-react-mount"></div>`,
    )

    const mount = mesText.querySelector<HTMLElement>(`#${mountPlaceholderId}`)
    if (!mount) return

    const root = createRoot(mount)
    root.render(<ContentRenderer content={content} />)

    renderStates.set(messageId, {
        mesText,
        contentHost: mount,
        mount,
        root,
        originalHtml,
    })
}

function renderAll() {
    for (let messageId = 0; messageId < SillyTavern.chat.length; messageId++) {
        renderMessage(messageId)
    }
}

export function startContentRender() {
    renderAll()

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, renderAll),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, renderMessage),
        eventOn(tavern_events.MESSAGE_EDITED, renderMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, renderMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())

        renderStates.forEach(({ root, contentHost, mount, originalHtml }) => {
            root.unmount()

            if (contentHost.isConnected && mount.parentElement === contentHost) {
                contentHost.innerHTML = originalHtml
            }
        })

        renderStates.clear()
    }
}
