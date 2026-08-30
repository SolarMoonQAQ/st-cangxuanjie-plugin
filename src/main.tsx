import { createRoot, type Root } from 'react-dom/client'
import pluginCss from './index.css?inline'
import { injectBeautifyPrompt, startContentRender } from './beautify/content.tsx'

const CONTAINER_ID = 'tavern-cangxuanjie-root'
const STYLE_ID = 'cangxuanjie-plugin-style'

let root: Root | null = null
let container: HTMLElement | null = null

let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null

$(() => {
    $(`#${CONTAINER_ID}`).remove()

    container = $('<div>').attr('id', CONTAINER_ID).appendTo('body')[0]

    root = createRoot(container)

    toastr.success('苍玄界插件已加载')

    $(`#${STYLE_ID}`).remove()
    $('<style>').attr('id', STYLE_ID).text(pluginCss).appendTo('head')

    stopInjectBeautifyPrompt = injectBeautifyPrompt()
    stopContentRender = startContentRender()
})

$(window).on('pagehide', () => {
    root?.unmount()
    container?.remove()

    root = null
    container = null

    $(`#${STYLE_ID}`).remove()
    stopInjectBeautifyPrompt?.()
    stopInjectBeautifyPrompt = null
    stopContentRender?.()
    stopContentRender = null
})
