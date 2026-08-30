const DIALOGUE_PATTERN = /^【([^】\r\n]+)】\s*[：:]\s*[“"]([\s\S]*?)[”"]\s*$/

function beautifyElement(element: HTMLElement) {
    $(element)
        .find('p')
        .each(function () {
            // 已处理过的跳过，避免重复渲染
            if (this.dataset.cxBeautified) return

            const match = $(this).text().trim().match(DIALOGUE_PATTERN)
            if (!match) return

            const [, speaker, content] = match

            // 用 jQuery 构建美化后的节点，替换掉原 <p>
            const $card = $(
                '<div class="cx-dialogue-card">' +
                    '<span class="cx-speaker">' +
                    speaker.trim() +
                    '</span>' +
                    '<span class="cx-content">' +
                    content.trim() +
                    '</span>' +
                    '</div>',
            )
            $(this).replaceWith($card)
        })
}

function beautifyMessage(messageId: number) {
    const $mes = retrieveDisplayedMessage(messageId)
    if ($mes.length) beautifyElement($mes[0])
}

export function startBeautify() {
    // 已有的楼层
    $('.mes_text').each((_index, element) => {
        beautifyElement(element as HTMLElement)
    })

    // 新消息/更新时再美化
    const listeners = [
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, beautifyMessage),
        eventOn(tavern_events.MESSAGE_UPDATED, beautifyMessage),
    ]

    return () => {
        listeners.forEach((listener) => listener.stop())
    }
}
