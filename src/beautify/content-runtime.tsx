import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()
const pendingMessageIds = new Set<number>()

let flushTimer: number | null = null

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

function createFormattedHolder(rawContent: string, messageId: number): HTMLDivElement {
    const holder = document.createElement('div')

    holder.innerHTML = formatAsDisplayedMessage(rawContent, {
        message_id: messageId,
    })

    return holder
}

function findContentHost(messageId: number): HTMLElement | null {
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

    if (mesText.matches(CONTENT_TAG_NAME)) {
        return mesText
    }

    return mesText.querySelector<HTMLElement>(CONTENT_TAG_NAME)
}

function stopMessageRender(messageId: number) {
    renderStates.get(messageId)?.()
    renderStates.delete(messageId)
}

function renderOneMessage(messageId: number) {
    const contentHost = findContentHost(messageId)

    if (!contentHost) {
        return
    }

    stopMessageRender(messageId)

    const stop = renderMessage(messageId, contentHost)

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
    flushTimer = null

    const messageIds = [...pendingMessageIds]
    pendingMessageIds.clear()

    for (const messageId of messageIds) {
        renderOneMessage(messageId)
    }
}

function scheduleMessageRender(messageId: number) {
    pendingMessageIds.add(messageId)

    if (flushTimer !== null) {
        return
    }

    flushTimer = window.setTimeout(() => {
        window.requestAnimationFrame(flushPendingMessages)
    }, 0)
}

function scheduleAllMessagesRender() {
    for (const messageId of renderStates.keys()) {
        stopMessageRender(messageId)
    }

    if (flushTimer !== null) {
        window.clearTimeout(flushTimer)
        flushTimer = null
    }

    pendingMessageIds.clear()

    flushTimer = window.setTimeout(() => {
        flushTimer = null
        window.requestAnimationFrame(renderAllMessages)
    }, 0)
}

function renderMessage(messageId: number, contentHost: HTMLElement) {
    const rawContent = extractRawContent(messageId)

    if (!rawContent) {
        return
    }

    const holder = createFormattedHolder(rawContent, messageId)

    const nodes = parseContent(holder)

    const originalHtml = contentHost.innerHTML

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'

    contentHost.replaceChildren(mount)

    const root = createRoot(mount)

    root.render(<Content nodes={nodes} contentHost={contentHost} />)

    return () => {
        root.unmount()

        if (contentHost.isConnected && mount.parentElement === contentHost) {
            contentHost.innerHTML = originalHtml
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

        pendingMessageIds.clear()

        for (const messageId of renderStates.keys()) {
            stopMessageRender(messageId)
        }
    }
}
