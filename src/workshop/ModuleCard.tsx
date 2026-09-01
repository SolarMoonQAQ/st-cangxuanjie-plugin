import { type ComponentProps, type CSSProperties, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card.tsx'
import { cn } from '@/shared/lib/utils.ts'
import type { WorkshopModuleSummary } from '@/workshop/workshop-api.ts'
import { useTranslation } from 'react-i18next'
import Seal from '@/shared/components/ui/Seal.tsx'

type ModuleCardProps = Omit<ComponentProps<typeof Card>, 'children'> & {
    module?: WorkshopModuleSummary
}

const PAPER_EDGES = [
    'polygon(0.4% 0.3%, 24% 0%, 51% 0.4%, 77% 0%, 99.6% 0.5%, 100% 27%, 99.5% 54%, 100% 79%, 99.4% 99.6%, 75% 100%, 49% 99.5%, 23% 100%, 0.5% 99.4%, 0% 73%, 0.4% 48%, 0% 22%)',
    'polygon(0.7% 0%, 27% 0.5%, 52% 0%, 74% 0.4%, 100% 0.2%, 99.5% 24%, 100% 51%, 99.6% 76%, 100% 99.5%, 72% 99.7%, 47% 100%, 21% 99.4%, 0% 100%, 0.5% 78%, 0% 53%, 0.6% 26%)',
    'polygon(0% 0.5%, 22% 0%, 48% 0.3%, 73% 0%, 99.5% 0.7%, 100% 22%, 99.4% 47%, 100% 73%, 99.6% 100%, 78% 99.5%, 53% 100%, 28% 99.6%, 0.4% 100%, 0% 76%, 0.5% 50%, 0% 25%)',
] as const

type ModuleCardStyle = CSSProperties & {
    '--ws-module-rotation': string
    '--ws-module-edge': string
}

function usePaperAppearance(): ModuleCardStyle {
    const [appearance] = useState(() => ({
        rotation: `${(Math.random() * 2 - 1).toFixed(2)}deg`,
        edge: PAPER_EDGES[Math.floor(Math.random() * PAPER_EDGES.length)] ?? PAPER_EDGES[0],
    }))

    return {
        '--ws-module-rotation': appearance.rotation,
        '--ws-module-edge': appearance.edge,
    }
}

export default function ModuleCard({ module, className, style, ...props }: ModuleCardProps) {
    const { t } = useTranslation('workshop')
    const moduleStyle = usePaperAppearance()
    const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null)
    const previewUrl = module?.previewUrl
    const showPreview = Boolean(previewUrl && failedPreviewUrl !== previewUrl)

    return (
        <div className="ws-module-card-shadow" style={moduleStyle} aria-hidden={!module}>
            <span
                className={cn('ws-module-card-pin', !showPreview && 'is-empty')}
                aria-hidden="true"
            />
            <Card
                className={cn('ws-module-card', !module && 'ws-module-card-placeholder', className)}
                style={style}
                {...props}
            >
                {module ? (
                    <>
                        <Seal
                            relief="yang"
                            rotation={9}
                            backgroundOpacity={0.18}
                            className="ws-module-kind-seal"
                            text={t(`kind.${module.kind}`, {
                                defaultValue: module.kindLabel,
                            })}
                        />

                        <CardContent className="ws-module-content px-0">
                            <div className="ws-module-body">
                                <header className="ws-module-card-heading">
                                    <h3 className="ws-module-title">{module.title}</h3>
                                </header>

                                <p className="ws-module-description">{module.description}</p>

                                {module.tags.length > 0 ? (
                                    <div className="ws-module-tags">
                                        {module.tags.slice(0, 4).map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                ) : null}

                                <CardFooter className="ws-module-footer">
                                    <span>{t('module.author', { name: module.authorName })}</span>
                                    <span>
                                        {t('module.downloads', { count: module.downloadCount })}
                                    </span>
                                </CardFooter>
                            </div>

                            <div className={cn('ws-module-photo', !showPreview && 'is-empty')}>
                                {showPreview ? (
                                    <img
                                        className="ws-module-preview"
                                        src={previewUrl}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        referrerPolicy="no-referrer"
                                        onError={() => setFailedPreviewUrl(previewUrl ?? null)}
                                    />
                                ) : (
                                    <div className="ws-module-photo-fallback" aria-hidden="true">
                                        <span className="ws-module-photo-fallback-char">
                                            {module.title.trim().charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </>
                ) : null}
            </Card>
        </div>
    )
}
