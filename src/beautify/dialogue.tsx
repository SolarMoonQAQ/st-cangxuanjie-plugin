import { createRoot, type Root } from 'react-dom/client'
import DialogueCard from './DialogueCard'

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/

type DialogueMount = {
    root: Root
    host: HTMLElement
    originalHtml: string
}

const roots = new Map<HTMLElement, DialogueMount>()

function adoptPluginStyles(shadowRoot: ShadowRoot, cssText: string) {
    const style = document.createElement('style')
    style.textContent = cssText
    shadowRoot.append(style)
}

function beautifyElement(element: HTMLElement, cssText: string) {
    const paragraphs = element.querySelectorAll<HTMLElement>('p')

    for (const paragraph of paragraphs) {
        if (roots.has(paragraph)) continue

        const match = paragraph.textContent?.trim().match(DIALOGUE_PATTERN)

        if (!match) continue

        const [, speaker, content] = match
        const host = document.createElement('span')
        host.className = 'cx-dialogue-shadow-host'

        const shadowRoot = host.attachShadow({ mode: 'open' })
        adoptPluginStyles(shadowRoot, cssText)

        const mountPoint = document.createElement('div')
        shadowRoot.append(mountPoint)

        const originalHtml = paragraph.innerHTML
        paragraph.replaceChildren(host)

        const root = createRoot(mountPoint)

        root.render(<DialogueCard speaker={speaker.trim()} content={content.trim()} />)

        roots.set(paragraph, { root, host, originalHtml })
    }
}

function beautifyMessage(messageId: number, cssText: string) {
    const element = retrieveDisplayedMessage(messageId)[0]
    if (element) beautifyElement(element, cssText)
}

function beautifyAll(cssText: string) {
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement, cssText)
    })
}

export function startBeautify(cssText: string) {
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement, cssText)
    })

    const listeners = [
        eventOn(tavern_events.CHAT_CHANGED, () => beautifyAll(cssText)),
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, (messageId) => beautifyMessage(messageId, cssText)),
        eventOn(tavern_events.MESSAGE_UPDATED, (messageId) => beautifyMessage(messageId, cssText)),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())
        roots.forEach(({ root, host, originalHtml }, paragraph) => {
            root.unmount()
            host.remove()
            paragraph.innerHTML = originalHtml
        })

        roots.clear()
    }
}
