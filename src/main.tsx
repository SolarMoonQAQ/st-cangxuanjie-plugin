import { createRoot, type Root } from 'react-dom/client'
import pluginCss from './index.css?inline'
import { injectBeautifyPrompt } from './beautify/content-inject.ts'
import { startContentRender } from '@/beautify/content-runtime.tsx'
import { removeContentDisplayRegex } from '@/beautify/content-regex.ts'

const CONTAINER_ID = 'tavern-cangxuanjie-root'
const STYLE_ID = 'cangxuanjie-plugin-style'

let root: Root | null = null
let container: HTMLElement | null = null

let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null

async function initializePlugin() {
    $(`#${CONTAINER_ID}`).remove()

    container = $('<div>').attr('id', CONTAINER_ID).appendTo('body')[0]

    root = createRoot(container)

    $(`#${STYLE_ID}`).remove()

    const tavernDocument = window.parent.document
    tavernDocument.getElementById(STYLE_ID)?.remove()
    const style = tavernDocument.createElement('style')
    style.id = STYLE_ID
    style.textContent = pluginCss
    tavernDocument.head.appendChild(style)

    stopInjectBeautifyPrompt = injectBeautifyPrompt()

    stopContentRender = await startContentRender()

    toastr.success('苍玄界插件已加载')
}

$(() => {
    void initializePlugin().catch((error) => {
        console.error('[苍玄界插件] 加载失败', error)
        toastr.error('苍玄界插件加载失败')
    })
})

$(window).on('pagehide', () => {
    stopContentRender?.()
    stopContentRender = null

    stopInjectBeautifyPrompt?.()
    stopInjectBeautifyPrompt = null

    root?.unmount()
    container?.remove()

    root = null
    container = null

    removeContentDisplayRegex()

    $(`#${STYLE_ID}`).remove()
})
