const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/

function beautifyElement(element: HTMLElement) {
    const paragraphs = Array.from(element.querySelectorAll<HTMLElement>('p'))
    const candidates = paragraphs.length > 0 ? paragraphs : [element]

    for (const candidate of candidates) {
        if (candidate.dataset.cangxuanDialogue !== undefined) continue

        const match = candidate.textContent?.trim().match(DIALOGUE_PATTERN)
        if (!match) continue

        const [, speaker, dialogueText] = match
        const document = candidate.ownerDocument

        const name = document.createElement('strong')
        name.textContent = speaker.trim()
        name.style.cssText = 'display:block;color:#e5bd68;margin-bottom:0.3em'

        const content = document.createElement('span')
        content.textContent = dialogueText.trim()
        content.style.cssText = 'display:block;white-space:pre-wrap'

        candidate.dataset.cangxuanDialogue = ''
        candidate.style.cssText = [
            'margin:0.6em 0',
            'padding:0.65em 0.8em',
            'border-left:3px solid #d2a84b',
            'border-radius:4px',
            'background:rgba(30,30,30,0.35)',
        ].join(';')
        candidate.replaceChildren(name, content)
    }
}

function beautifyMessage(messageId: number) {
    const element = retrieveDisplayedMessage(messageId)[0]
    if (element) beautifyElement(element)
}

export function startBeautify() {
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement)
    })

    const listeners = [
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.USER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, beautifyMessage),
    ]

    return () => listeners.forEach(listener => listener.stop())
}

