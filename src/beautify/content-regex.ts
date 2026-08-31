export const CONTENT_TAG_NAME = 'content'
export const CONTENT_OPEN_TAG = `<${CONTENT_TAG_NAME}>`
export const CONTENT_CLOSE_TAG = `</${CONTENT_TAG_NAME}>`

export const CONTENT_BLOCK_PATTERN = new RegExp(
    String.raw`<${CONTENT_TAG_NAME}\b[^>]*>([\s\S]*?)</${CONTENT_TAG_NAME}>`,
    'gi',
)

const contentDisplayRegex: TavernRegex = {
    id: 'cangxuanjie-content-host',
    script_name: '苍玄界-正文容器',
    enabled: true,

    find_regex: CONTENT_BLOCK_PATTERN.source,
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

export async function ensureContentDisplayRegex() {
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
