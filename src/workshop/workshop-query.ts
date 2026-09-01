import { useQuery } from '@tanstack/react-query'
import {
    fetchWorkshopModules,
    type WorkshopModulePage,
} from '@/workshop/workshop-api.ts'

export const WORKSHOP_MODULES_QUERY_KEY = ['workshop', 'modules'] as const

export function useWorkshopModules(page: number, pageSize = 6) {
    return useQuery({
        queryKey: [...WORKSHOP_MODULES_QUERY_KEY, page, pageSize],
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            fetchWorkshopModules({ page, pageSize, signal }),
        staleTime: 60_000,
        placeholderData: (previousData: WorkshopModulePage | undefined) => previousData,
    })
}
