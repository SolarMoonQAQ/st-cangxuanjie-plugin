import { useLayoutEffect, useRef } from 'react'

type DomSlotProps = {
    node: Node
    returnTo: HTMLElement
}

/**
 * 把酒馆已经完成 Markdown/正则处理的 DOM 节点放进 React 布局。
 * 节点本身不转换成 React 字符串，因此插图、图片、代码块以及其他插件
 * 生成的 HTML/CSS 都保持原节点和原有行为。
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
