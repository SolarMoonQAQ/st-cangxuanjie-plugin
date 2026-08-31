import { parseContent } from '@/beautify/content-parser.ts'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'

type StopRender = () => void

const renderStates = new Map<number, StopRender>()

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

const CONTENT_HOST_OPEN_TAG = '<div data-cx-content markdown="1">'
const CONTENT_HOST_CLOSE_TAG = '</div>'
const CONTENT_HOST_SELECTOR = 'div[data-cx-content]'
const CONTENT_DISPLAY_REGEX_ID = '780dd8cc-d6c3-4ff7-985f-280dc0d3365e'
const CONTENT_DISPLAY_REGEX_NAME = '苍玄界：content 显示容器'

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const tagName = escapeRegExp(CONTENT_TAG_NAME)
const CONTENT_DISPLAY_FIND_REGEX = String.raw`/<${tagName}\b[^>]*>([\s\S]*?)<\/${tagName}>/gi`
const CONTENT_DISPLAY_REPLACE_STRING = `\n${CONTENT_HOST_OPEN_TAG}\n$1\n${CONTENT_HOST_CLOSE_TAG}\n`

const contentDisplayRegex: TavernRegex = {
    id: CONTENT_DISPLAY_REGEX_ID,
    script_name: CONTENT_DISPLAY_REGEX_NAME,
    enabled: true,
    find_regex: CONTENT_DISPLAY_FIND_REGEX,
    replace_string: CONTENT_DISPLAY_REPLACE_STRING,
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

function isCurrentContentDisplayRegex(regex: TavernRegex, index: number) {
    return index === 0
        && regex.id === contentDisplayRegex.id
        && regex.enabled === contentDisplayRegex.enabled
        && regex.find_regex === contentDisplayRegex.find_regex
        && regex.replace_string === contentDisplayRegex.replace_string
        && regex.source.ai_output === contentDisplayRegex.source.ai_output
        && regex.destination.display === contentDisplayRegex.destination.display
        && regex.destination.prompt === contentDisplayRegex.destination.prompt
        && regex.run_on_edit === contentDisplayRegex.run_on_edit
}

async function ensureContentDisplayRegex() {
    const option = { type: 'global' as const }
    const regexes = getTavernRegexes(option)
    const existingIndex = regexes.findIndex((regex) => regex.id === CONTENT_DISPLAY_REGEX_ID)

    if (existingIndex >= 0 && isCurrentContentDisplayRegex(regexes[existingIndex], existingIndex)) {
        return
    }

    await updateTavernRegexesWith(
        (currentRegexes) => [
            contentDisplayRegex,
            ...currentRegexes.filter((regex) => regex.id !== CONTENT_DISPLAY_REGEX_ID),
        ],
        option,
    )
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
    const mesText = findDisplayedMesText(messageId)

    if (!mesText) {
        stopMessageRender(messageId)
        return
    }

    stopMessageRender(messageId)

    const contentHost = mesText.querySelector<HTMLElement>(CONTENT_HOST_SELECTOR)

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

/** 移动显示正则宿主内由酒馆和其他正则生成的真实 DOM 节点。 */
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

    flushSync(() => {
        root.render(<Content nodes={nodes} contentHost={holder} />)
    })

    return () => {
        root.unmount()

        if (mount.parentElement === contentHost) {
            contentHost.replaceChildren(...sourceNodes)
        }
    }
}

export async function startContentRender() {
    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, renderAllMessages),
        eventOn(tavern_events.MORE_MESSAGES_LOADED, renderAllMessages),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, renderOneMessage),
        eventOn(tavern_events.MESSAGE_EDITED, renderOneMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, renderOneMessage),
    ]

    await ensureContentDisplayRegex()
    renderAllMessages()

    return () => {
        listeners.forEach((listener) => listener.stop())

        for (const messageId of renderStates.keys()) {
            stopMessageRender(messageId)
        }
    }
}
