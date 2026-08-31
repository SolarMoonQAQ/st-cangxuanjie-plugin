import pluginCss from './index.css?inline'
import { injectBeautifyPrompt } from './beautify/content-inject.ts'
import { startContentRender } from '@/beautify/content-runtime.tsx'
import { logDiagnostic } from '@/diagnostics.ts'

const STYLE_ID = 'cangxuanjie-plugin-style'

let stopInjectBeautifyPrompt: (() => void) | null = null
let stopContentRender: (() => void) | null = null
let stopFrameRemovalObserver: (() => void) | null = null
let cleanedUp = false

function initializePlugin() {
    const tavernDocument = window.parent.document
    tavernDocument.getElementById(STYLE_ID)?.remove()

    const style = tavernDocument.createElement('style')
    style.id = STYLE_ID
    style.textContent = pluginCss
    tavernDocument.head.appendChild(style)

    stopInjectBeautifyPrompt = injectBeautifyPrompt()
    stopContentRender = startContentRender()

    const scriptFrame = window.frameElement
    const ParentMutationObserver = tavernDocument.defaultView?.MutationObserver

    if (scriptFrame && tavernDocument.body && ParentMutationObserver) {
        const observer = new ParentMutationObserver(() => {
            if (!scriptFrame.isConnected) cleanupPlugin('frame-removed')
        })

        observer.observe(tavernDocument.body, { childList: true, subtree: true })
        stopFrameRemovalObserver = () => observer.disconnect()
    }

    logDiagnostic('plugin-initialized', {
        hasScriptFrame: Boolean(scriptFrame),
        frameRemovalObserverInstalled: Boolean(stopFrameRemovalObserver),
    })

    toastr.success('苍玄界插件已加载')
}

$(() => {
    try {
        initializePlugin()
    } catch {
        toastr.error('苍玄界插件加载失败')
    }
})

function cleanupPlugin(source: string) {
    if (cleanedUp) return
    cleanedUp = true

    const tavernDocument = window.parent.document

    logDiagnostic('cleanup-start', {
        source,
        reactContentCount: tavernDocument.querySelectorAll('.cx-bg').length,
        stylePresent: Boolean(tavernDocument.getElementById(STYLE_ID)),
    })

    stopFrameRemovalObserver?.()
    stopFrameRemovalObserver = null

    stopContentRender?.()
    stopContentRender = null

    stopInjectBeautifyPrompt?.()
    stopInjectBeautifyPrompt = null

    tavernDocument.getElementById(STYLE_ID)?.remove()

    logDiagnostic('cleanup-complete', {
        source,
        reactContentCount: tavernDocument.querySelectorAll('.cx-bg').length,
        stylePresent: Boolean(tavernDocument.getElementById(STYLE_ID)),
    })
}

for (const eventName of ['pagehide', 'beforeunload', 'unload'] as const) {
    window.addEventListener(eventName, () => cleanupPlugin(eventName), { once: true })
}
