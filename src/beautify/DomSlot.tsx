import { useLayoutEffect, useRef } from 'react'

type DomSlotProps = {
    node: Node
    returnTo: HTMLElement
}

/** 将酒馆已经渲染好的真实 DOM 节点放入 React 布局，不复制 HTML。 */
export default function DomSlot({ node, returnTo }: DomSlotProps) {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const host = ref.current

        if (!host) return

        host.appendChild(node)

        return () => {
            if (node.parentNode !== host) return

            if (returnTo.isConnected && host.isConnected) {
                returnTo.appendChild(node)
            } else {
                node.parentNode?.removeChild(node)
            }
        }
    }, [node, returnTo])

    return <div ref={ref} className="cx-dom-slot" />
}
