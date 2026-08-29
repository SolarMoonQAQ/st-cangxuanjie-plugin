const originals = new Map<HTMLElement, string>()

const DIALOGUE_PATTERN =
    /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/


function beautifyElement(element: HTMLElement) {
    if (element.querySelector('[data-cangxuan-dialogue]')) return

    const originalHtml = element.innerHTML
    const document = element.ownerDocument

    const paragraphs = Array.from(
        element.querySelectorAll<HTMLElement>('p'),
    )

    // 有些消息没有生成 p，直接处理 mes_text 本身
    const candidates = paragraphs.length > 0
        ? paragraphs
        : [element]

    let changed = false

    for (const candidate of candidates) {
        const source = candidate.textContent?.trim() ?? ''
        const match = source.match(DIALOGUE_PATTERN)

        if (!match) continue

        const [, speaker, dialogueText] = match

        const block = document.createElement('span')
        block.dataset.cangxuanDialogue = ''
        block.style.cssText = [
            'display:block',
            'margin:0.6em 0',
            'padding:0.65em 0.8em',
            'border-left:3px solid #d2a84b',
            'border-radius:4px',
            'background:rgba(30,30,30,0.35)',
        ].join(';')

        const name = document.createElement('span')
        name.textContent = speaker.trim()
        name.style.cssText =
            'display:block;font-weight:700;color:#e5bd68;margin-bottom:0.3em'

        const content = document.createElement('span')
        content.textContent = dialogueText.trim()
        content.style.cssText =
            'display:block;white-space:pre-wrap'

        block.append(name, content)
        candidate.replaceChildren(block)

        changed = true
    }

    if (changed) {
        originals.set(element, originalHtml)
    }
}


function beautifyMessage(messageId: number) {
    setTimeout(() => {
        const element = retrieveDisplayedMessage(messageId)[0]

        if (element) {
            beautifyElement(element)
        }
    }, 0)
}


export function startBeautify() {
    const beautifyAll = () => {
        $('.mes_text').each((_index, element) => {
            beautifyElement(element as HTMLElement)
        })
    }

    setTimeout(beautifyAll, 0)

    const listeners = [
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.USER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_SWIPED, beautifyMessage),
        eventOn(tavern_events.MORE_MESSAGES_LOADED, beautifyAll),
    ]

    return () => {
        listeners.forEach(listener => listener.stop())

        for (const [element, originalHtml] of originals) {
            if (element.isConnected) {
                element.innerHTML = originalHtml
            }
        }

        originals.clear()
    }
}

