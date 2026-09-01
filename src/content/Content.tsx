import type { ContentNode } from './content-model.ts'
import { Fragment, type ReactNode } from 'react'
import Dialogue from '@/content/Dialogue.tsx'
import DomSlot from '@/content/DomSlot.tsx'

type RenderContext = {
    contentHost: HTMLElement
}

function assertNever(value: never): never {
    throw new Error(`未知内容类型: ${JSON.stringify(value)}`)
}

function renderContent(node: ContentNode, { contentHost }: RenderContext): ReactNode {
    switch (node.kind) {
        case 'dialogue':
            return (
                <Dialogue {...node.data} />
            )

        case 'narration':
            return (
                <div className="ct-narration">
                    {node.children.map((child, index) => (
                        <Fragment key={index}>{renderContent(child, { contentHost })}</Fragment>
                    ))}
                </div>
            )

        case 'native-dom':
            return <DomSlot node={node.data.node} returnTo={contentHost} />

        default:
            return assertNever(node)
    }
}

type ContentRendererProps = {
    nodes: ContentNode[]
    contentHost: HTMLElement
}

export default function Content({ nodes, contentHost }: ContentRendererProps) {
    return (
        <div className="ct-bg">
            {nodes.map((node, index) => (
                <Fragment key={index}>{renderContent(node, { contentHost })}</Fragment>
            ))}
        </div>
    )
}
