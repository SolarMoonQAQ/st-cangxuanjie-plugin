import { createRoot, type Root } from 'react-dom/client'
import pluginCss from './index.css?inline'
import { injectBeautifyPrompt } from './beautify/content-inject.ts'
import { startContentRender } from '@/beautify/content-runtime.tsx'
import { removeContentDisplayRegex } from '@/beautify/content-regex.ts'

const CONTAINER_ID = 'tavern-cangxuanjie-root'
const STYLE_ID = 'cangxuanjie-plugin-style'
const DIAGNOSTIC_PREFIX = '[苍玄界诊断]'

let root: Root | null = null
let container: HTMLElement | null = null

let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null

async function initializePlugin() {
    console.info(
        `${DIAGNOSTIC_PREFIX} initialize-start ${JSON.stringify({
            iframeDocument: window.document !== window.parent.document,
            documentReadyState: document.readyState,
            parentDocumentReadyState: window.parent.document.readyState,
        })}`,
    )

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

    console.info(
        `${DIAGNOSTIC_PREFIX} style-injected ${JSON.stringify({
            connected: style.isConnected,
            cssLength: pluginCss.length,
            ownerIsParentDocument: style.ownerDocument === tavernDocument,
        })}`,
    )

    stopInjectBeautifyPrompt = injectBeautifyPrompt()
    console.info(`${DIAGNOSTIC_PREFIX} prompt-inject-started {}`)

    stopContentRender = await startContentRender()
    console.info(`${DIAGNOSTIC_PREFIX} initialize-complete {}`)

    toastr.success('苍玄界插件已加载')
}

$(() => {
    void initializePlugin().catch((error) => {
        console.error(`${DIAGNOSTIC_PREFIX} initialize-failed`, error)
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
