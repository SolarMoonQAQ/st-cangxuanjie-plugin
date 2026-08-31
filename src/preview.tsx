import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Content from '@/beautify/Content.tsx'
import { parseContent } from '@/beautify/content-parser.ts'
import './index.css'
import { CONTENT_SELECTOR } from '@/beautify/content-runtime'

const PREVIEW_TEXT = `
药芷若顺从地任他牵着走出内室，绛红色的长裙在青砖地上拖出轻微的声响绛红色的长裙在青砖地上拖出轻微的声响绛红色的长裙在青砖地上拖出轻微的声响绛红色的长裙在青砖地上拖出轻微的声响。

药芷若顺从地任他牵着走出内室，绛红色的长裙在青砖地上拖出轻微的声响。

穿过西六宫的琉璃照壁，外面是一条宽阔的青石长廊。

【药芷若】：“哦对了，说到内心话，元和4500年。”
`

function createPreviewContentHost(text: string): HTMLElement {
    const host = document.createElement(CONTENT_SELECTOR)

    text.trim()
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .forEach((block) => {
            const paragraph = document.createElement('p')
            paragraph.textContent = block
            host.appendChild(paragraph)
        })

    return host
}

function Preview() {
    const [contentHost] = useState(() => {
        return createPreviewContentHost(PREVIEW_TEXT)
    })

    const nodes = parseContent(contentHost)

    return (
        <main>
            <Content nodes={nodes} contentHost={contentHost} />
        </main>
    )
}

const container = document.getElementById('root')

if (container) {
    createRoot(container).render(<Preview />)
}
