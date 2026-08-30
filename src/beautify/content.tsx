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

const roots = new Map<HTMLElement, Root>()
const originalHtml = new Map<HTMLElement, string>()

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
    const displayed = retrieveDisplayedMessage(messageId)[0] as
        | HTMLElement
        | undefined

    if (!displayed) return

    const mesText = displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')

    if (!mesText) return

    const content = extractContent(messageId)

    // 没有 <content> 时，不要清空原消息
    if (!content) return

    const oldRoot = roots.get(mesText)

    if (oldRoot) {
        oldRoot.render(<ContentRenderer content={content} />)
        return
    }

    originalHtml.set(mesText, mesText.innerHTML)

    const root = createRoot(mesText)

    root.render(<ContentRenderer content={content} />)

    roots.set(mesText, root)
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
        eventOn(tavern_events.MESSAGE_UPDATED, renderMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())

        roots.forEach((root, mesText) => {
            root.unmount()

            const html = originalHtml.get(mesText)

            if (html !== undefined) {
                mesText.innerHTML = html
            }
        })

        roots.clear()
        originalHtml.clear()
    }
}
