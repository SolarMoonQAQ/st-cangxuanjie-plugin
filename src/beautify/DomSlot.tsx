import { useLayoutEffect, useRef } from 'react'

type DomSlotProps = {
    node: Node
    returnTo: HTMLElement
}

/**
 * 把酒馆已经渲染好的 DOM 放进 React 布局中，但不把它转换成 React children。
 * 正文中的 <插图>、图片以及其他插件生成的节点仍由 DOM 自己维护。
 */
export default function DomSlot({ node, returnTo }: DomSlotProps) {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const host = ref.current

        if (!host || !node) return

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
