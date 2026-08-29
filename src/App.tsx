import { useEffect, useState } from 'react';

export default function App() {
    const [fixedText] = useState('这是固定替换的文本');
    const [enabled] = useState(true);

    useEffect(() => {
        if (!enabled) return;

        const handleMessage = () => {
            const mesList = document.querySelectorAll('.mes_text');
            const latest = mesList[mesList.length - 1] as HTMLElement;
            if (latest) {
                latest.innerText = fixedText;
            }
        };

        // 1. 注册监听，并拿到包含 stop 方法的对象
        const listener = eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, handleMessage);

        // 2. 在 React 组件卸载或依赖更新时直接调用 stop()
        return () => {
            listener.stop();
        };
    }, [enabled, fixedText]);

    return <div>{/* UI 代码 */}</div>;
}
