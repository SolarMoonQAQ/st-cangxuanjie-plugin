import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_SELECTOR = CONTENT_TAG_NAME
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

// <content> 只作为 AI 原文中的标记。
// 酒馆完成 Markdown/HTML 处理后，实际由插件接管的容器使用普通 div。
const CONTENT_HOST_TAG_NAME = 'div'
const CONTENT_HOST_ATTRIBUTE = 'data-cx-content'
const CONTENT_HOST_SELECTOR = `${CONTENT_HOST_TAG_NAME}[${CONTENT_HOST_ATTRIBUTE}]`

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const tagName = escapeRegExp(CONTENT_TAG_NAME)
const CONTENT_BLOCK_PATTERN = new RegExp(
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

function normalizeContentHost(mesText: HTMLElement): HTMLElement | null {
    // 已经转换过的楼层直接复用，避免重复改写酒馆 DOM。
    const normalizedHost = mesText.querySelector<HTMLElement>(CONTENT_HOST_SELECTOR)

    if (normalizedHost) {
        return normalizedHost
    }

    const marker = mesText.matches(CONTENT_TAG_NAME)
        ? mesText
        : mesText.querySelector<HTMLElement>(CONTENT_TAG_NAME)

    if (!marker) {
        return null
    }

    // 不使用 innerHTML 替换，直接移动子节点，保留酒馆正则生成的 HTML
    // 以及其他插件附加在这些节点上的属性和事件。
    const host = document.createElement(CONTENT_HOST_TAG_NAME)
    host.setAttribute(CONTENT_HOST_ATTRIBUTE, '')

    while (marker.firstChild) {
        host.appendChild(marker.firstChild)
    }

    marker.replaceWith(host)

    return host
}

function findContentHost(messageId: number): HTMLElement | null {
    const mesText = findDisplayedMesText(messageId)

    if (!mesText) {
        return null
    }

    return normalizeContentHost(mesText)
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

// eslint-disable-next-line react-refresh/only-export-components
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
