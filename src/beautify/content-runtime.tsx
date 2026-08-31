import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()
const pendingMessageIds = new Set<number>()

let flushTimer: number | null = null
let flushFrame: number | null = null

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const tagName = escapeRegExp(CONTENT_TAG_NAME)
export const CONTENT_BLOCK_PATTERN = new RegExp(
    String.raw`<${tagName}\b[^>]*>([\s\S]*?)</${tagName}>`,
    'i',
)

function extractRawContent(messageId: number): string | null {
    const message = SillyTavern.chat[messageId]?.mes

    if (typeof message !== 'string') {
        return null
    }

    const match = message.match(CONTENT_BLOCK_PATTERN)

    return match?.[1].trim() ?? null
}

function findDisplayedMesText(messageId: number): HTMLElement | null {
    const displayed = retrieveDisplayedMessage(messageId)[0] as HTMLElement | undefined

    if (!displayed) {
        return null
    }

    const mesText = displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')

    if (!mesText) {
        return null
    }

    return mesText
}

function stopMessageRender(messageId: number) {
    renderStates.get(messageId)?.()
    renderStates.delete(messageId)
}

function renderOneMessage(messageId: number) {
    const rawContent = extractRawContent(messageId)

    if (!rawContent) {
        stopMessageRender(messageId)
        return
    }

    const contentHost = findDisplayedMesText(messageId)

    if (!contentHost) {
        stopMessageRender(messageId)
        return
    }

    stopMessageRender(messageId)

    const stop = renderMessage(contentHost)

    if (stop) {
        renderStates.set(messageId, stop)
    }
}

function renderAllMessages() {
    const chatLength = SillyTavern.chat.length

    for (let messageId = 0; messageId < chatLength; messageId += 1) {
        renderOneMessage(messageId)
    }

    for (const messageId of renderStates.keys()) {
        if (messageId >= chatLength) {
            stopMessageRender(messageId)
        }
    }
}

function flushPendingMessages() {
    flushFrame = null

    const messageIds = [...pendingMessageIds]
    pendingMessageIds.clear()

    for (const messageId of messageIds) {
        renderOneMessage(messageId)
    }
}

function scheduleFlush() {
    if (flushTimer !== null || flushFrame !== null) {
        return
    }

    flushTimer = window.setTimeout(() => {
        flushTimer = null
        flushFrame = window.requestAnimationFrame(flushPendingMessages)
    }, 0)
}

function scheduleMessageRender(messageId: number) {
    pendingMessageIds.add(messageId)
    scheduleFlush()
}

function scheduleAllMessagesRender() {
    const chatLength = SillyTavern.chat.length

    pendingMessageIds.clear()

    for (let messageId = 0; messageId < chatLength; messageId += 1) {
        pendingMessageIds.add(messageId)
    }

    for (const messageId of renderStates.keys()) {
        if (messageId >= chatLength) {
            stopMessageRender(messageId)
        }
    }

    scheduleFlush()
}

/**
 * `<content>` 只作为原始消息中的格式标记。酒馆会把未知标签周围的
 * Markdown 段落拆开，因此实际渲染时接管整个 `.mes_text`，并在脱离
 * 页面后移除标记本身，保留酒馆正则已经生成的真实 DOM 节点。
 */
function createRenderedSource(contentHost: HTMLElement) {
    const holder = document.createElement('div')

    holder.replaceChildren(...contentHost.childNodes)

    const markers = Array.from(holder.querySelectorAll(CONTENT_TAG_NAME))

    for (const marker of markers) {
        marker.replaceWith(...marker.childNodes)
    }

    return holder
}

function renderMessage(contentHost: HTMLElement) {
    const holder = createRenderedSource(contentHost)
    const sourceNodes = Array.from(holder.childNodes)

    const nodes = parseContent(holder)

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'

    contentHost.appendChild(mount)

    const root = createRoot(mount)

    root.render(<Content nodes={nodes} contentHost={holder} />)

    return () => {
        root.unmount()

        if (mount.parentElement === contentHost) {
            contentHost.replaceChildren(...sourceNodes)
        }
    }
}

export function startContentRender() {
    renderAllMessages()

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, scheduleAllMessagesRender),
        eventOn(tavern_events.MORE_MESSAGES_LOADED, scheduleAllMessagesRender),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, scheduleMessageRender),
        eventOn(tavern_events.MESSAGE_EDITED, scheduleMessageRender),
        eventOn(tavern_events.MESSAGE_UPDATED, scheduleMessageRender),
        eventOn(tavern_events.MESSAGE_DELETED, scheduleAllMessagesRender),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())

        if (flushTimer !== null) {
            window.clearTimeout(flushTimer)
            flushTimer = null
        }

        if (flushFrame !== null) {
            window.cancelAnimationFrame(flushFrame)
            flushFrame = null
        }

        pendingMessageIds.clear()

        for (const messageId of renderStates.keys()) {
            stopMessageRender(messageId)
        }
    }
}
