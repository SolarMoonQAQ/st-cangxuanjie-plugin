import { createRoot } from 'react-dom/client'
import './index.css'
import ContentRenderer from '@/beautify/ContentRenderer.tsx'

function Preview() {
    return (
        <main>
            <ContentRenderer
                content={`
药芷若顺从地任他牵着走出内室，绛红色的长裙在青砖地上拖出轻微的声响。守在门口的几名小妖账房见状连忙低头行礼，手里还抱着厚厚的记账符盘。

穿过西六宫的琉璃照壁，外面是一条宽阔的青石长廊。长廊顶端每隔五步就悬挂着一盏由慕海棠设计的聚灵感应灯，此时虽是白日，灵光却依然柔和地映照在红墙上。

【药芷若】：“哦对了，说到内心话，元和4500年，
沈慕徽突破元婴时走火入魔导致面部神经彻底坏死，做不出任何表情，
于是借着面瘫的生理缺陷，顺水推舟套上了"无情道天才"的壳子。
实际上是个内心戏极其丰富的重度话痨，但为了防止露馅，强迫自己对外只说一两个字。
住在最偏僻的"月微居"，偷偷养了一只叫"小白"的普通白兔作为唯一的倾诉对象。
目前没有任何人知道她的真实面目，她的秘密被完美地封存着，成为一段佳话。”

然而这是错的选择，因为你终究不是他！

【叶修】：“说的对，但是我玩原神的”
            `}
            ></ContentRenderer>
        </main>
    )
}

const container = document.getElementById('root')

if (container) {
    createRoot(container).render(<Preview />)
}
