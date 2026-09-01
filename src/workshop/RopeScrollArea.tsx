import {
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
} from 'react'
import { ScrollArea } from '@/shared/components/ui/scroll-area.tsx'
import { cn } from '@/shared/lib/utils.ts'

type RopeScrollAreaProps = {
    children?: ReactNode
    className?: string
    contentClassName?: string
    dragLabel?: string
    resetKey?: string | number
}

const KNOT_TOP_INSET = 6
const KNOT_HEIGHT = 44
const KNOT_BOTTOM_INSET = 6

export default function RopeScrollArea({
    children,
    className,
    contentClassName,
    dragLabel = '拖动滚动内容',
    resetKey,
}: RopeScrollAreaProps) {
    const rootRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const activePointerRef = useRef<number | null>(null)
    const pointerOffsetRef = useRef(KNOT_HEIGHT / 2)
    const animationFrameRef = useRef<number | null>(null)
    const dragMetricsRef = useRef<{
        rootTop: number
        knotTravel: number
        maxScroll: number
    } | null>(null)

    const updateRopePosition = useCallback(() => {
        if (animationFrameRef.current !== null) {
            return
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = null

            const root = rootRef.current
            const viewport = viewportRef.current

            if (!root || !viewport) {
                return
            }

            const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight)
            const progress = maxScroll > 0 ? viewport.scrollTop / maxScroll : 0
            const knotTravel = Math.max(
                0,
                viewport.clientHeight - KNOT_TOP_INSET - KNOT_HEIGHT - KNOT_BOTTOM_INSET,
            )
            const knotTop = KNOT_TOP_INSET + progress * knotTravel
            const ropeScale = root.clientHeight > 0 ? (knotTop + 10) / root.clientHeight : 0

            root.style.setProperty('--c-rope-knot-offset', `${knotTop - KNOT_TOP_INSET}px`)
            root.style.setProperty('--c-rope-length-scale', String(ropeScale))
            root.dataset.ropeOverflow = String(maxScroll > 1)
        })
    }, [])

    const scrollFromPointer = useCallback(
        (clientY: number) => {
            const viewport = viewportRef.current
            const metrics = dragMetricsRef.current

            if (!viewport || !metrics) {
                return
            }

            const unclampedTop = clientY - metrics.rootTop - pointerOffsetRef.current
            const knotTop = Math.min(
                KNOT_TOP_INSET + metrics.knotTravel,
                Math.max(KNOT_TOP_INSET, unclampedTop),
            )
            const progress =
                metrics.knotTravel > 0 ? (knotTop - KNOT_TOP_INSET) / metrics.knotTravel : 0

            viewport.scrollTop = progress * metrics.maxScroll
            updateRopePosition()
        },
        [updateRopePosition],
    )

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
        if (rootRef.current?.dataset.ropeOverflow !== 'true') {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        const knotRect = event.currentTarget.getBoundingClientRect()
        const rootRect = rootRef.current.getBoundingClientRect()
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        activePointerRef.current = event.pointerId
        pointerOffsetRef.current = event.clientY - knotRect.top
        dragMetricsRef.current = {
            rootTop: rootRect.top,
            knotTravel: Math.max(
                0,
                rootRect.height - KNOT_TOP_INSET - KNOT_HEIGHT - KNOT_BOTTOM_INSET,
            ),
            maxScroll: Math.max(0, viewport.scrollHeight - viewport.clientHeight),
        }
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        if (activePointerRef.current !== event.pointerId) {
            return
        }

        event.preventDefault()
        scrollFromPointer(event.clientY)
    }

    const stopPointerDrag = (event: PointerEvent<HTMLButtonElement>) => {
        if (activePointerRef.current !== event.pointerId) {
            return
        }

        activePointerRef.current = null
        dragMetricsRef.current = null

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        const viewport = viewportRef.current

        if (!viewport || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
            return
        }

        event.preventDefault()
        viewport.scrollBy({
            top: event.key === 'ArrowDown' ? 48 : -48,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        updateRopePosition()

        const observer = new ResizeObserver(updateRopePosition)

        if (viewportRef.current) {
            observer.observe(viewportRef.current)
        }

        if (contentRef.current) {
            observer.observe(contentRef.current)
        }

        if (rootRef.current) {
            observer.observe(rootRef.current)
        }

        return () => {
            observer.disconnect()

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
        }
    }, [updateRopePosition])

    useEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        viewport.scrollTo({
            top: 0,
            behavior: reduceMotion ? 'auto' : 'smooth',
        })
        updateRopePosition()
    }, [resetKey, updateRopePosition])

    return (
        <div ref={rootRef} className={cn('c-card-rope-area', className)}>
            <ScrollArea
                className="c-card-scroll-area"
                viewportRef={viewportRef}
                onViewportScroll={updateRopePosition}
                scrollbarClassName="c-card-native-scrollbar"
                thumbClassName="c-card-native-thumb"
            >
                <div ref={contentRef} className={cn('c-card-scroll-content', contentClassName)}>
                    {children}
                </div>
            </ScrollArea>

            <div className="c-card-rope" aria-hidden="true" />
            <button
                type="button"
                className="c-card-rope-knot"
                aria-label={dragLabel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopPointerDrag}
                onPointerCancel={stopPointerDrag}
                onLostPointerCapture={() => {
                    activePointerRef.current = null
                    dragMetricsRef.current = null
                }}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}
