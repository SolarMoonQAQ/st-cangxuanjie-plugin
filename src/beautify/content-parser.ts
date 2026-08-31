import type { ContentNode } from './content-model'

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/

export function parseContent(holder: HTMLElement): ContentNode[] {
    return Array.from(holder.childNodes)
        .filter((node) => {
            return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())
        })
        .map((node): ContentNode => {
            const text = node.textContent?.trim() ?? ''
            const match = text.match(DIALOGUE_PATTERN)

            if (match) {
                return {
                    kind: 'dialogue',
                    data: {
                        speaker: match[1].trim(),
                        content: match[2].trim(),
                    }
                }
            }

            return {
                kind: 'narration',
                children: [createNativeDomNode(node)],
            }
        })
}

function createNativeDomNode(node: Node): ContentNode {
    return {
        kind: 'native-dom',
        data: {
            node,
        },
    }
}
