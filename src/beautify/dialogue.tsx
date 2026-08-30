import { createRoot, type Root } from 'react-dom/client'
import DialogueCard from './DialogueCard'

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/

const roots = new Map<HTMLElement, Root>()
const originalHtml = new Map<HTMLElement, string>()

function beautifyElement(element: HTMLElement) {
    const paragraphs = element.querySelectorAll<HTMLElement>('p')

    for (const paragraph of paragraphs) {
        if (roots.has(paragraph)) continue

        const match = paragraph.textContent?.trim().match(DIALOGUE_PATTERN)

        if (!match) continue

        const [, speaker, content] = match
        originalHtml.set(paragraph, paragraph.innerHTML)
        const root = createRoot(paragraph)

        root.render(<DialogueCard speaker={speaker.trim()} content={content.trim()} />)

        roots.set(paragraph, root)
    }
}

function beautifyMessage(messageId: number) {
    const element = retrieveDisplayedMessage(messageId)[0]
    if (element) beautifyElement(element)
}

function beautifyAll() {
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement)
    })
}

export function startBeautify() {
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement)
    })

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, beautifyAll),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, beautifyMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())
        roots.forEach((root, paragraph) => {
            root.unmount()

            // 复原原html文字
            const html = originalHtml.get(paragraph)
            if (html !== undefined) {
                paragraph.innerHTML = html
            }
        })

        roots.clear()
        originalHtml.clear()

    }
}
