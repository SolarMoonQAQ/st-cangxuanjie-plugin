import { createRoot, type Root } from 'react-dom/client'
import DialogueCard from './DialogueCard'

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
    mounts: HTMLElement[]
    roots: Root[]
    dialogues: Array<{ speaker: string; content: string }>
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
const styledContentHosts = new Set<HTMLElement>()

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/

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

    contentHost.classList.add('cx-bg')
    styledContentHosts.add(contentHost)

    const oldState = renderStates.get(messageId)

    const dialogues = content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .map((block) => {
            const match = block.match(DIALOGUE_PATTERN)

            return match
                ? { speaker: match[1].trim(), content: match[2].trim() }
                : null
        })
        .filter((dialogue): dialogue is { speaker: string; content: string } => dialogue !== null)

    if (
        oldState &&
        oldState.mesText === mesText &&
        oldState.mounts.length > 0 &&
        oldState.mounts.every(
            (mount) => mount.isConnected && mount.parentElement === contentHost,
        )
    ) {
        return
    }

    if (oldState) {
        oldState.roots.forEach((root) => root.unmount())
        renderStates.delete(messageId)
    }

    const originalHtml = contentHost.innerHTML

    const mounts: HTMLElement[] = []
    const roots: Root[] = []
    let dialogueIndex = 0

    // Only replace plain dialogue paragraphs. Nodes inserted by other regex
    // extensions (such as <inner>) stay in the DOM and keep their own state.
    const mountDialogue = () => {
        const dialogue = dialogues[dialogueIndex++]

        if (!dialogue) return null

        const mount = document.createElement('div')
        mount.className = 'cx-react-mount'

        const root = createRoot(mount)
        root.render(<DialogueCard speaker={dialogue.speaker} content={dialogue.content} />)

        mounts.push(mount)
        roots.push(root)

        return mount
    }

    Array.from(contentHost.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent ?? ''
            const fragment = document.createDocumentFragment()

            text.split(/\n{2,}/).forEach((block) => {
                const trimmed = block.trim()

                if (!trimmed) return

                const match = trimmed.match(DIALOGUE_PATTERN)
                const mount = match ? mountDialogue() : null

                if (mount) {
                    fragment.append(mount)
                } else {
                    const paragraph = document.createElement('p')
                    paragraph.className = 'cx-narration'
                    paragraph.textContent = trimmed
                    fragment.append(paragraph)
                }
            })

            node.replaceWith(fragment)
            return
        }

        if (!(node instanceof HTMLElement)) return

        const text = node.textContent?.trim() ?? ''
        const match = text.match(DIALOGUE_PATTERN)
        const hasNestedForeignNode = Array.from(node.children).some(
            (child) => child.tagName !== 'BR',
        )

        if (!match || hasNestedForeignNode) {
            if (match) dialogueIndex++

            if (text) node.classList.add('cx-narration')
            return
        }

        const mount = mountDialogue()

        if (mount) node.replaceWith(mount)
    })

    renderStates.set(messageId, {
        mesText,
        contentHost,
        mounts,
        roots,
        dialogues,
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

        styledContentHosts.forEach((contentHost) => {
            contentHost.classList.remove('cx-bg')
        })
        styledContentHosts.clear()
        preservedContentHosts.clear()

        renderStates.forEach(({ roots, contentHost, mounts, originalHtml }) => {
            roots.forEach((root) => root.unmount())

            if (contentHost.isConnected && mounts.some((mount) => mount.parentElement === contentHost)) {
                contentHost.innerHTML = originalHtml
            }
        })

        renderStates.clear()
    }
}
