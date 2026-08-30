import { createRoot } from 'react-dom/client'
import DialogueCard from './beautify/DialogueCard'
import './index.css'

function Preview() {
    return (
        <main>
            <div className="mx-auto max-w-2xl">
                <DialogueCard
                    speaker="药芷若"
                    content={
                        '哦对了，元和4500年，沈慕徽突破元婴时走火入魔导致面部神经彻底坏死，做不出任何表情，于是借着面瘫的生理缺陷，顺水推舟套上了"无情道天才"的壳子。实际上是个内心戏极其丰富的重度话痨，但为了防止露馅，强迫自己对外只说一两个字。住在最偏僻的"月微居"，偷偷养了一只叫"小白"的普通白兔作为唯一的倾诉对象。目前没有任何人知道她的真实面目，她的秘密被完美地封存着，成为一段佳话。'
                    }
                />
            </div>
        </main>
    )
}

const container = document.getElementById('root')

if (container) {
    createRoot(container).render(<Preview />)
}
