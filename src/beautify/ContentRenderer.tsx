import DialogueCard from './DialogueCard'

export type ContentBlock = {
    html: string
    speaker?: string
}

type ContentRendererProps =
    | {
        blocks: ContentBlock[]
    }
    | {
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
                        <DialogueCard key={index} speaker={match[1].trim()}>
                            {match[2].trim()}
                        </DialogueCard>
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

    const { blocks } = props

    return (
        <div className="cx-bg">
            {blocks.map((block, index) => {
                if (block.speaker) {
                    return (
                        <DialogueCard
                            key={index}
                            speaker={block.speaker}
                        >
                            <div
                                className="cx-dialogue-raw"
                                dangerouslySetInnerHTML={{ __html: block.html }}
                            />
                        </DialogueCard>
                    )
                }

                return (
                    <div
                        key={index}
                        className="cx-narration"
                        dangerouslySetInnerHTML={{ __html: block.html }}
                    />
                )
            })}
        </div>
    )
}
