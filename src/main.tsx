import { createRoot, type Root } from 'react-dom/client'
import App from './App.tsx'

const CONTAINER_ID = 'tavern-cangxuanjie-root'

let root: Root | null = null
let container: HTMLElement | null = null

$(() => {
    // `$` 操作的是酒馆主页面，适合把插件界面挂到酒馆中
    $(`#${CONTAINER_ID}`).remove()

    container = $('<div>')
        .attr('id', CONTAINER_ID)
        .appendTo('body')[0]

    root = createRoot(container)
    root.render(<App />)

    toastr.success('苍玄界插件已加载')
})

$(window).on('pagehide', () => {
    root?.unmount()
    container?.remove()

    root = null
    container = null
})
