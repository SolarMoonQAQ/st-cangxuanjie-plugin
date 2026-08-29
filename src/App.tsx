import React, { useEffect, useState } from 'react'

export default function App() {
  const [fixedText, setFixedText] = useState('这是固定替换的文本')
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) return

    const handleMessage = () => {
      const mesList = document.querySelectorAll('.mes_text')
      const latest = mesList[mesList.length - 1] as HTMLElement
      if (latest) {
        latest.innerText = fixedText
      }
    }

    // 挂载酒馆事件监听
    window.eventOn?.('CHARACTER_MESSAGE_RENDERED', handleMessage)

    return () => {
      window.eventOff?.('CHARACTER_MESSAGE_RENDERED', handleMessage)
    }
  }, [enabled, fixedText])

  return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        background: '#222',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px'
      }}>
        <label>
          <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
          />
          启用固定文本替换
        </label>
        <input
            type="text"
            value={fixedText}
            onChange={(e) => setFixedText(e.target.value)}
            style={{ display: 'block', marginTop: '5px' }}
        />
      </div>
  )
}
