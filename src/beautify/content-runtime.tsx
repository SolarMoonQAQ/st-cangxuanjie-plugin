import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()

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

    if (!displayed) return null

    return displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')
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
        eventOn(tavern_events.CHAT_CHANGED, renderAllMessages),
        eventOn(tavern_events.MORE_MESSAGES_LOADED, renderAllMessages),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, renderOneMessage),
        eventOn(tavern_events.MESSAGE_EDITED, renderOneMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, renderOneMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())

        for (const messageId of renderStates.keys()) {
            stopMessageRender(messageId)
        }
    }
}
