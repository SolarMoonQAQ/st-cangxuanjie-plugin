import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar.tsx'
import { Separator } from '@base-ui/react'
import { getSpeakerProfile } from '@/common/speaker-profiles.ts'
import YinSeal from '@/beautify/YinSeal.tsx'

type DialogueProps = {
    speaker: string
    content?: string
}

export default function Dialogue({ speaker, content }: DialogueProps) {
    const nameHead = speaker.charAt(0)
    const nameTail = speaker.slice(1)
    const profile = getSpeakerProfile(speaker)

    return (
        <div className="flex cx-dialogue">
            <Avatar className="h-10 w-10 shrink-0 cx-avatar">
                <AvatarImage src={profile.avatar} alt={`${speaker}头像`} />
                <AvatarFallback>👤</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center shrink-0 ml-2!">
                <div className="flex items-center h-10">
                    <span className="cx-dialogue-name-head">{nameHead}</span>
                </div>

                <Separator orientation="vertical" className="w-px! flex-1 bg-border!" />
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex items-center h-10">
                    <span className="cx-dialogue-name">{nameTail}</span>
                </div>

                <div>
                    <span>
                        <YinSeal text={nameHead}></YinSeal>
                    </span>
                    <text className="cx-dialogue-content">
                        {content}
                    </text>
                </div>
            </div>
        </div>
    )
}
