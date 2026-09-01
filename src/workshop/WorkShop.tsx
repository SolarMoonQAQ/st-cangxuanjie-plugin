import { type MouseEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import MainCard from '@/workshop/MainCard.tsx'
import ModuleCard from '@/workshop/ModuleCard.tsx'
import { useWorkshopModules } from '@/workshop/workshop-query.ts'
import { useInstalledWorkshopModuleCount } from '@/shared/query.ts'
import { Button } from '@/shared/components/ui/button.tsx'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from '@/shared/components/ui/pagination.tsx'

const PAGE_SIZE = 6
const PAGINATION_STEP = 40

const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
        x: '0%',
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '-100%' : '100%',
    }),
}

export default function WorkShop() {
    const { t } = useTranslation('workshop')
    const [page, setPage] = useState(1)
    const [animatedPage, setAnimatedPage] = useState(1)
    const directionRef = useRef(1)
    const currentPageRef = useRef(page)
    const modulesQuery = useWorkshopModules(page, PAGE_SIZE)
    const installedModuleCount = useInstalledWorkshopModuleCount()
    const isLoadingPage = modulesQuery.isPending || modulesQuery.isPlaceholderData
    const isPageAnimating = animatedPage !== page
    const showPlaceholders = isLoadingPage || isPageAnimating
    const modules = modulesQuery.data?.modules ?? []
    const totalPages = modulesQuery.data?.totalPages ?? 1

    currentPageRef.current = page

    const goToPage = (nextPage: number) => {
        const safePage = Math.min(totalPages, Math.max(1, nextPage))

        if (safePage === page) {
            return
        }

        directionRef.current = safePage > page ? 1 : -1
        setPage(safePage)
    }

    const handlePageLink = (event: MouseEvent<HTMLAnchorElement>, nextPage: number) => {
        event.preventDefault()

        goToPage(nextPage)
    }

    const pagination = modules.length ? (
        <Pagination className="ws-pagination" aria-label={t('pagination.label')}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        size="icon"
                        className="ws-pagination-arrow"
                        aria-label={t('pagination.previous')}
                        aria-disabled={page <= 1}
                        onClick={(event) => handlePageLink(event, page - 1)}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem className="ws-pagination-pages-item">
                    <div className="ws-pagination-window">
                        <span className="ws-pagination-active" aria-hidden="true" />
                        <motion.ol
                            className="ws-pagination-track"
                            animate={{ x: -(page - 1) * PAGINATION_STEP }}
                            transition={{
                                type: 'tween',
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (item) => (
                                    <li key={item} className="ws-pagination-track-item">
                                        <PaginationLink
                                            isActive={item === page}
                                            className="ws-pagination-page"
                                            aria-label={t('pagination.goto', { page: item })}
                                            tabIndex={Math.abs(item - page) <= 2 ? undefined : -1}
                                            onClick={(event) => handlePageLink(event, item)}
                                        >
                                            <span className="ws-pagination-number">{item}</span>
                                        </PaginationLink>
                                    </li>
                                ),
                            )}
                        </motion.ol>
                    </div>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        size="icon"
                        className="ws-pagination-arrow"
                        aria-label={t('pagination.next')}
                        aria-disabled={page >= totalPages}
                        onClick={(event) => handlePageLink(event, page + 1)}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m9 6 6 6-6 6" />
                        </svg>
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ) : null

    return (
        <MainCard
            footer={pagination}
            scrollKey={page}
            stats={{
                total: modulesQuery.data?.total ?? 0,
                installed: installedModuleCount,
            }}
        >
            <section className="ws-catalog" aria-busy={modulesQuery.isFetching}>
                {modulesQuery.isError && !isPageAnimating ? (
                    <div className="ws-catalog-state ws-catalog-error">
                        <p>{t('catalog.error')}</p>
                        <Button
                            type="button"
                            className="ws-retry-button"
                            onClick={() => void modulesQuery.refetch()}
                        >
                            {t('catalog.retry')}
                        </Button>
                    </div>
                ) : !showPlaceholders && modules.length === 0 ? (
                    <div className="ws-catalog-state">{t('catalog.empty')}</div>
                ) : (
                    <div className="ws-module-stage">
                        <AnimatePresence initial={false} mode="sync" custom={directionRef.current}>
                            <motion.div
                                key={page}
                                className="ws-module-page"
                                custom={directionRef.current}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    type: 'tween',
                                    duration: 0.32,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                onAnimationComplete={() => {
                                    if (currentPageRef.current === page) {
                                        setAnimatedPage(page)
                                    }
                                }}
                            >
                                <div
                                    className="ws-module-list"
                                    aria-label={showPlaceholders ? t('catalog.loading') : undefined}
                                >
                                    {Array.from(
                                        {
                                            length: showPlaceholders ? PAGE_SIZE : modules.length,
                                        },
                                        (_, index) => (
                                            <ModuleCard
                                                key={`slot-${index}`}
                                                module={
                                                    showPlaceholders ? undefined : modules[index]
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </MainCard>
    )
}
