import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const CONTAINER_ID = 'tavern-cangxuanjie-root'

function mount() {
    let container = document.getElementById(CONTAINER_ID)

    if (!container) {
        container = document.createElement('div')
        container.id = CONTAINER_ID
        document.body.appendChild(container)
    }

    const root = createRoot(container)
    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
} else {
    mount()
}
