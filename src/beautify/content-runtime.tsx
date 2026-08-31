import { parseContent } from '@/beautify/content-parser.ts'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

const contentDisplayRegex: TavernRegex = {
    id: 'cangxuanjie-content-host',
    script_name: '苍玄界-正文容器',
    enabled: true,

    find_regex: '/<content\\b[^>]*>([\\s\\S]*?)<\\/content>/gi',
    replace_string: '<div class="cx-content-host" markdown="1">$1</div>',

    trim_strings: [],

    source: {
        user_input: false,
        ai_output: true,
        slash_command: false,
        world_info: false,
        reasoning: false,
    },

    destination: {
        display: true,
        prompt: false,
    },

    run_on_edit: true,
    min_depth: null,
    max_depth: null,
}

const CONTENT_REGEX_SCOPE = {
    type: 'character',
    name: 'current',
} as const

async function ensureContentDisplayRegex() {
    const regexes = getTavernRegexes(CONTENT_REGEX_SCOPE)
    const existing = regexes.find((regex) => regex.id === contentDisplayRegex.id)

    if (
        existing?.enabled &&
        existing.find_regex === contentDisplayRegex.find_regex &&
        existing.replace_string === contentDisplayRegex.replace_string &&
        existing.destination.display &&
        !existing.destination.prompt
    ) {
        return
    }

    await updateTavernRegexesWith(
        (current) => [
            ...current.filter((regex) => regex.id !== contentDisplayRegex.id),
            contentDisplayRegex,
        ],
        CONTENT_REGEX_SCOPE,
    )
}

function findContentHost(messageId: number): HTMLElement | null {
    const displayed = retrieveDisplayedMessage(messageId)[0] as HTMLElement | undefined

    if (!displayed) return null

    const mesText = displayed.matches('.mes_text')
        ? displayed
        : displayed.querySelector<HTMLElement>('.mes_text')

    return mesText?.querySelector<HTMLElement>('.cx-content-host') ?? null
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

function renderMessage(contentHost: HTMLElement) {
    const originalChildren = Array.from(contentHost.childNodes)

    const nodes = parseContent(contentHost)

    const mount = document.createElement('div')
    mount.className = 'cx-react-mount'

    contentHost.replaceChildren(mount)

    const root = createRoot(mount)

    root.render(<Content nodes={nodes} contentHost={contentHost} />)

    return () => {
        root.unmount()

        if (contentHost.isConnected && mount.parentElement === contentHost) {
            contentHost.replaceChildren(...originalChildren)
        }
    }
}

export async function startContentRender() {
    await ensureContentDisplayRegex()

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
