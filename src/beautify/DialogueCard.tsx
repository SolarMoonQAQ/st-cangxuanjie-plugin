import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar.tsx'
import { Separator } from '@base-ui/react'
import type { ReactNode } from 'react'
import { getSpeakerProfile } from '../common/speakerProfiles.ts'

type DialogueProps = {
    speaker: string
    children: ReactNode
}

export function YinSeal({ text = '印' }: { text?: string }) {
    return (
        <span
            className="inline-flex items-center justify-center select-none font-serif text-xs font-bold leading-none text-red-50 bg-[#9e2a2b] border border-[#7f1d1d] shadow-[0_0_0_1px_rgba(158,42,43,0.3)] rounded-[2px] px-1 py-0.5 mr-1.5 align-baseline -rotate-2 tracking-tight"
            style={{ fontFamily: '"STKaiti", "KaiTi", "SimSun", serif' }}
        >
            {text}
        </span>
    )
}

export default function DialogueCard({ speaker, children }: DialogueProps) {
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

                <div className="cx-dialogue-content">
                    <span>
                        <YinSeal text={nameHead}></YinSeal>
                    </span>
                    {children}
                </div>
            </div>
        </div>
    )
}
