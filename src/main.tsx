import { createRoot, type Root } from 'react-dom/client'
import App from '@/App.tsx'
import pluginCss from './style/index.css?inline'
import { injectContentPrompt } from '@/content/content-inject.ts'
import { startContentRender } from '@/content/content-runtime.tsx'
import '@/shared/i18n.ts'
import { queryClient, startWorldBookWatch } from '@/shared/query.ts'
import { QueryClientProvider } from '@tanstack/react-query'

const STYLE_ID = 'cangxuanjie-plugin-style'
const APP_ROOT_ID = 'cangxuanjie-app-root'

let appRoot: Root | null = null
let appContainer: HTMLDivElement | null = null

let stopWorldBookWatch: (() => void) | null = null
let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null

function mountApp(tavernDocument: Document) {
    tavernDocument.getElementById(APP_ROOT_ID)?.remove()

    appContainer = tavernDocument.createElement('div')
    appContainer.id = APP_ROOT_ID

    Object.assign(appContainer.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: '10000',
    })

    tavernDocument.body.appendChild(appContainer)

    appRoot = createRoot(appContainer)
    appRoot.render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>,
    )
}

function initializePlugin() {
    const tavernDocument = window.parent.document

    tavernDocument.getElementById(STYLE_ID)?.remove()

    const style = tavernDocument.createElement('style')
    style.id = STYLE_ID
    style.textContent = pluginCss
    tavernDocument.head.appendChild(style)

    // 缓存
    stopWorldBookWatch?.()
    stopWorldBookWatch = startWorldBookWatch()

    // 显示插件主界面
    mountApp(tavernDocument)

    // 启动正文渲染
    stopInjectBeautifyPrompt = injectContentPrompt()
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
    stopWorldBookWatch?.()
    stopWorldBookWatch = null

    stopContentRender?.()
    stopContentRender = null

    stopInjectBeautifyPrompt?.()
    stopInjectBeautifyPrompt = null

    appRoot?.unmount()
    appRoot = null

    appContainer?.remove()
    appContainer = null

    window.parent.document.getElementById(STYLE_ID)?.remove()
})
