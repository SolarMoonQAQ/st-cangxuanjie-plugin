const originals = new Map<HTMLElement, string>()

const DIALOGUE_PATTERN =
    /【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]/g

function beautifyElement(element: HTMLElement) {
    // 避免重复处理
    if (element.querySelector('[data-cangxuan-dialogue]')) return

    const originalHtml = element.innerHTML
    const document = element.ownerDocument
    const walker = document.createTreeWalker(element, 4)
    const textNodes: Text[] = []

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text)
    }

    let changed = false

    for (const textNode of textNodes) {
        const source = textNode.data
        const matches = [...source.matchAll(DIALOGUE_PATTERN)]

        if (matches.length === 0) continue

        const fragment = document.createDocumentFragment()
        let cursor = 0

        for (const match of matches) {
            const index = match.index ?? 0
            const [, speaker, dialogueText] = match

            fragment.append(source.slice(cursor, index))

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
            content.style.cssText = 'display:block;white-space:pre-wrap'

            block.append(name, content)
            fragment.append(block)

            cursor = index + match[0].length
        }

        fragment.append(source.slice(cursor))
        textNode.replaceWith(fragment)
        changed = true
    }

    if (changed) originals.set(element, originalHtml)
}

function beautifyMessage(messageId: number) {
    const element = retrieveDisplayedMessage(messageId)[0]

    if (element) {
        beautifyElement(element)
    }
}

export function startBeautify() {
    // 处理加载插件前已经存在的消息
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement)
    })

    const listeners = [
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.USER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, beautifyMessage),
    ]

    return () => {
        listeners.forEach(listener => listener.stop())

        for (const [element, originalHtml] of originals) {
            if (element.isConnected) element.innerHTML = originalHtml
        }

        originals.clear()
    }
}
