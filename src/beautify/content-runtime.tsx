import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`
export const CONTENT_HOST_OPEN_TAG = '<div data-cx-content markdown="1">'
export const CONTENT_HOST_CLOSE_TAG = '</div>'

const CONTENT_HOST_SELECTOR = 'div[data-cx-content]'

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

function findContentHost(mesText: HTMLElement): HTMLElement | null {
    return mesText.querySelector<HTMLElement>(CONTENT_HOST_SELECTOR)
}

function createLegacyContentHost(messageId: number, mesText: HTMLElement): HTMLElement | null {
    const message = SillyTavern.chat[messageId]?.mes

    if (typeof message !== 'string') {
        return null
    }

    const normalizedMessage = message.replace(
        CONTENT_BLOCK_PATTERN,
        (_block, rawContent: string) =>
            `${CONTENT_HOST_OPEN_TAG}\n${rawContent.trim()}\n${CONTENT_HOST_CLOSE_TAG}`,
    )
    const holder = document.createElement('div')

    holder.innerHTML = formatAsDisplayedMessage(normalizedMessage, {
        message_id: messageId,
    })
    mesText.replaceChildren(...holder.childNodes)

    return findContentHost(mesText)
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

    const mesText = findDisplayedMesText(messageId)

    if (!mesText) {
        stopMessageRender(messageId)
        return
    }

    stopMessageRender(messageId)

    const contentHost = findContentHost(mesText) ?? createLegacyContentHost(messageId, mesText)

    if (!contentHost) {
        return
    }

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

/**
 * 移动 `<content>` 内由酒馆和其他正则生成的真实 DOM 节点。
 * `<content>` 外的内容继续留给酒馆原样渲染。
 */
function createRenderedSource(contentHost: HTMLElement) {
    const holder = document.createElement('div')

    holder.replaceChildren(...contentHost.childNodes)

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
