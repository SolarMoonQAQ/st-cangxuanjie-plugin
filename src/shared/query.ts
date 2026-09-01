import { QueryClient, useQuery } from '@tanstack/react-query'
import { WORLDBOOK_NAME } from '@/shared/st.ts'
import { characterSchema, defaultCharacters, type Character } from '@/shared/character.ts'
import { WORKSHOP_SOURCE } from '@/workshop/workshop-api.ts'

export const queryClient = new QueryClient()

export const WORLDBOOK_QUERY_KEY = ['worldbook', WORLDBOOK_NAME] as const

type WorldBookSnapshot = {
    entries: WorldbookEntry[]
    installedVersions: Map<string, string | null>
    characters: Record<string, Character>
}

function createWorldbookSnapshot(entries: WorldbookEntry[]): WorldBookSnapshot {
    const installedVersions = new Map<string, string | null>()

    // 默认角色 + 工坊角色按名字覆盖
    const characters: Record<string, Character> = {
        ...defaultCharacters,
    }

    for (const entry of entries) {
        if (entry.extra?.source !== WORKSHOP_SOURCE) {
            continue
        }

        const moduleId = entry.extra?.module_id
        const moduleVersion = entry.extra?.module_version

        if (typeof moduleId === 'string') {
            installedVersions.set(
                moduleId,
                typeof moduleVersion === 'string' ? moduleVersion : null,
            )
        }

        const characterResult = characterSchema.safeParse(entry.extra?.custom_role)

        if (characterResult.success) {
            const character = characterResult.data

            characters[character.name] = character
        }
    }

    return {
        entries,
        installedVersions,
        characters,
    }
}

const worldBookQuery = {
    queryKey: WORLDBOOK_QUERY_KEY,

    queryFn: async () => {
        const entries = await TavernHelper.getWorldbook(WORLDBOOK_NAME)

        return createWorldbookSnapshot(entries)
    },

    staleTime: Infinity,
    gcTime: Infinity,
}

export function getCachedWorldBook() {
    return queryClient.query(worldBookQuery)
}

export function useCachedCharacter(name: string): Character {
    const normalizedName = name.trim()

    const { data } = useQuery({
        ...worldBookQuery,

        select: (snapshot) => snapshot.characters[normalizedName],
    })

    return (
        data ??
        defaultCharacters[normalizedName] ?? {
            name: normalizedName || '未知角色',
            sect: '自定义',
            profile: '',
        }
    )
}

export function useInstalledWorkshopModuleCount(): number {
    const { data } = useQuery({
        ...worldBookQuery,

        select: (snapshot) => snapshot.installedVersions.size,
    })

    return data ?? 0
}

export function startWorldBookWatch(): () => void {
    const listener = eventOn(tavern_events.WORLDINFO_UPDATED, (name) => {
        if (name !== WORLDBOOK_NAME) {
            return
        }

        void queryClient.invalidateQueries({
            queryKey: WORLDBOOK_QUERY_KEY,
            refetchType: 'active',
        })
    })

    return listener.stop
}
