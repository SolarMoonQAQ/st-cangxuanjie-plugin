import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card.tsx'
import { cn } from '@/shared/lib/utils.ts'
import { motion, useDragControls } from 'motion/react'
import Seal from '@/shared/components/ui/Seal.tsx'
import RopeScrollArea from '@/workshop/RopeScrollArea.tsx'

type MainCardProps = {
    children?: ReactNode
    footer?: ReactNode
    scrollKey?: string | number
    stats?: {
        total: number
        installed: number
    }
}

export default function MainCard({ children, footer, scrollKey, stats }: MainCardProps) {
    const dragControls = useDragControls()
    const { t } = useTranslation('common')
    const { t: tws } = useTranslation('workshop')

    return (
        <motion.div
            className="c-card-drag"
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragListener={false}
        >
            <Card className="c-card">
                <CardHeader
                    className={cn('c-card-head', 'select-none touch-none')}
                    onPointerDown={(event) => dragControls.start(event)}
                >
                    <CardTitle className="c-card-title">{t('title')}</CardTitle>
                </CardHeader>
                <div className="c-card-ribbon">
                    {stats ? (
                        <>
                            <div className="c-card-plaque c-card-plaque-left">
                                {tws('stats.total', {
                                    count: stats.total,
                                })}
                            </div>
                            <div className="c-card-plaque c-card-plaque-right">
                                {tws('stats.installed', {
                                    count: stats.installed,
                                })}
                            </div>
                        </>
                    ) : null}
                    <Seal
                        variant="square"
                        text={tws('title')}
                        size={56}
                        rotation={0}
                        backgroundOpacity={0.95}
                        className="c-card-seal"
                    />
                </div>
                <CardContent className="c-card-content">
                    <RopeScrollArea dragLabel={tws('scroll.drag')} resetKey={scrollKey}>
                        {children}
                    </RopeScrollArea>
                </CardContent>
                {footer ? <CardFooter className="c-card-footer">{footer}</CardFooter> : null}
            </Card>
        </motion.div>
    )
}
