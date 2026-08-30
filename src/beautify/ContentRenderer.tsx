import DialogueCard from './DialogueCard'

type ContentRendererProps = {
    content: string
}

const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]$/

export default function ContentRenderer({ content }: ContentRendererProps) {
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
                    const [, speaker, dialogue] = match

                    return (
                        <DialogueCard
                            key={index}
                            speaker={speaker.trim()}
                            content={dialogue.trim()}
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
