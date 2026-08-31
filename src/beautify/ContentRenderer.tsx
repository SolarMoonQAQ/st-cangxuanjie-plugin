import DialogueCard from './DialogueCard'
import DomSlot from './DomSlot'

export type ContentBlock = {
    node: Node
    speaker?: string
}

type ContentRendererProps = {
    blocks: ContentBlock[]
    contentHost: HTMLElement
} | {
    content: string
}

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/

function PreviewRenderer({ content }: { content: string }) {
    const blocks = content
        .trim()
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)

    return (
        <div className="cx-bg">
            {blocks.map((block, index) => {
                const match = block.match(DIALOGUE_PATTERN)

                if (match) {
                    return (
                        <DialogueCard
                            key={index}
                            speaker={match[1].trim()}
                            content={match[2].trim()}
                        />
                    )
                }

                return (
                    <p key={index} className="cx-narration">
                        {block}
                    </p>
                )
            })}
        </div>
    )
}

export default function ContentRenderer(props: ContentRendererProps) {
    if ('content' in props) {
        return <PreviewRenderer content={props.content} />
    }

    const { blocks, contentHost } = props

    return (
        <div className="cx-bg">
            {blocks.map((block, index) => {
                if (block.speaker) {
                    return (
                        <DialogueCard key={index} speaker={block.speaker}>
                        </DialogueCard>
                    )
                }

                return (
                    <div key={index} className="cx-narration">
                        <DomSlot node={block.node} returnTo={contentHost} />
                    </div>
                )
            })}
        </div>
    )
}
