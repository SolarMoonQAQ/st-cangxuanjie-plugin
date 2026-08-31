import { cn } from '@/shared/lib/utils.ts'

export default function YinSeal({ text = '印' }: { text?: string }) {
    return (
        <div
            className={cn(
                'inline-flex items-center justify-center select-none',
                'font-serif text-xs font-bold leading-none',
                'text-red-50 bg-[#9e2a2b] border border-[#7f1d1d]',
                'shadow-[0_0_0_1px_rgba(158,42,43,0.3)]',
                'rounded-xs px-1 py-0.5 mr-1.5 align-baseline -rotate-2 tracking-tight',
            )}
            style={{ fontFamily: '"STKaiti", "KaiTi", "SimSun", serif' }}
        >
            {text}
        </div>
    )
}
