const CONTENT_DISPLAY_REGEX_ID = 'cangxuanjie-content-host'
const DIAGNOSTIC_PREFIX = '[苍玄界诊断]'

export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`
export const CONTENT_HOST_CLASS = 'cx-content-host'

export const CONTENT_BLOCK_PATTERN = new RegExp(
    String.raw`<${CONTENT_TAG_NAME}\b[^>]*>([\s\S]*?)</${CONTENT_TAG_NAME}>`,
    'gi',
)

const contentDisplayRegex: TavernRegex = {
    id: CONTENT_DISPLAY_REGEX_ID,
    script_name: '🤖苍玄界-正文美化',
    enabled: true,

    find_regex: `/${CONTENT_BLOCK_PATTERN.source}/${CONTENT_BLOCK_PATTERN.flags}`,
    replace_string: `<div class="${CONTENT_HOST_CLASS}" markdown="1">$1</div>`,

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

export async function ensureContentDisplayRegex() {
    const regexes = getTavernRegexes(CONTENT_REGEX_SCOPE)
    const existing = regexes.find((regex) => regex.id === contentDisplayRegex.id)
    const existingIsCurrent = Boolean(
        existing?.enabled &&
        existing.find_regex === contentDisplayRegex.find_regex &&
        existing.replace_string === contentDisplayRegex.replace_string &&
        existing.destination.display &&
        !existing.destination.prompt,
    )

    console.info(
        `${DIAGNOSTIC_PREFIX} regex-state ${JSON.stringify({
            characterRegexCount: regexes.length,
            characterRegexEnabled: isCharacterTavernRegexesEnabled(),
            exists: Boolean(existing),
            existingIsCurrent,
            index: regexes.findIndex((regex) => regex.id === contentDisplayRegex.id),
        })}`,
    )

    if (existingIsCurrent) {
        logRegexProbe()
        return
    }

    await updateTavernRegexesWith(
        (current) => [
            ...current.filter((regex) => regex.id !== contentDisplayRegex.id),
            contentDisplayRegex,
        ],
        CONTENT_REGEX_SCOPE,
    )

    logRegexProbe()
}

function logRegexProbe() {
    const input = '<content>probe</content>'
    const output = formatAsTavernRegexedString(input, 'ai_output', 'display', {
        depth: 0,
    })

    console.info(
        `${DIAGNOSTIC_PREFIX} regex-probe ${JSON.stringify({
            input,
            output,
            producedWrapper: output.includes(CONTENT_HOST_CLASS),
            retainedContentTag: /<content\b/i.test(output),
        })}`,
    )
}

export async function removeContentDisplayRegex() {
    const regexes = getTavernRegexes(CONTENT_REGEX_SCOPE)

    if (!regexes.some((regex) => regex.id === CONTENT_DISPLAY_REGEX_ID)) {
        return
    }

    await updateTavernRegexesWith(
        (current) => current.filter((regex) => regex.id !== CONTENT_DISPLAY_REGEX_ID),
        CONTENT_REGEX_SCOPE,
    )
}
