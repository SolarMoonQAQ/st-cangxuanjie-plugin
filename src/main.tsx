import pluginCss from './index.css?inline'
import { injectBeautifyPrompt } from './beautify/content-inject.ts'
import { startContentRender } from '@/beautify/content-runtime.tsx'

const STYLE_ID = 'cangxuanjie-plugin-style'

let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null

function initializePlugin() {
    const tavernDocument = window.parent.document
    tavernDocument.getElementById(STYLE_ID)?.remove()

    const style = tavernDocument.createElement('style')
    style.id = STYLE_ID
    style.textContent = pluginCss
    tavernDocument.head.appendChild(style)

    stopInjectBeautifyPrompt = injectBeautifyPrompt()
    stopContentRender = startContentRender()

    toastr.success('苍玄界插件已加载')
}

$(() => {
    try {
        initializePlugin()
    } catch (error) {
        console.error('[苍玄界插件] 加载失败', error)
        toastr.error('苍玄界插件加载失败')
    }
})

$(window).on('pagehide', () => {
    stopContentRender?.()
    stopContentRender = null

    stopInjectBeautifyPrompt?.()
    stopInjectBeautifyPrompt = null

    window.parent.document.getElementById(STYLE_ID)?.remove()
})
