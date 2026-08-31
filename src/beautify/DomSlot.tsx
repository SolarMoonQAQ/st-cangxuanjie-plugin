import { useLayoutEffect, useRef } from 'react'

type DomSlotProps = {
    node: Node
    returnTo: HTMLElement
}

/**
 * 把酒馆正则处理后的真实 DOM 节点移动到 React 布局中。
 * 不复制 HTML，因此图片、插件生成的节点和原有 class 都会保留。
 */
export default function DomSlot({ node, returnTo }: DomSlotProps) {
    const slotRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const slot = slotRef.current

        if (!slot) return

        slot.appendChild(node)

        return () => {
            if (node.parentNode !== slot) return

            if (returnTo.isConnected) {
                returnTo.appendChild(node)
            } else {
                node.parentNode?.removeChild(node)
            }
        }
    }, [node, returnTo])

    return <div ref={slotRef} className="cx-dom-slot" />
}
