import { createRoot, type Root } from 'react-dom/client'
import App from './App.tsx'
import { startBeautify } from '@/beautify/dialogue.tsx'
import pluginCss from './index.css?inline'

const CONTAINER_ID = 'tavern-cangxuanjie-root'
const STYLE_ID = 'cangxuanjie-plugin-style'

let root: Root | null = null
let container: HTMLElement | null = null

let stopBeautify: (() => void) | null = null

$(() => {
    $(`#${CONTAINER_ID}`).remove()

    container = $('<div>').attr('id', CONTAINER_ID).appendTo('body')[0]

    root = createRoot(container)
    root.render(<App />)

    toastr.success('苍玄界插件已加载')

    $(`#${STYLE_ID}`).remove()
    $('<style>').attr('id', STYLE_ID).text(pluginCss).appendTo('head')

    stopBeautify = startBeautify()
})

$(window).on('pagehide', () => {
    root?.unmount()
    container?.remove()

    root = null
    container = null

    $(`#${STYLE_ID}`).remove()
    stopBeautify?.()
    stopBeautify = null
})
