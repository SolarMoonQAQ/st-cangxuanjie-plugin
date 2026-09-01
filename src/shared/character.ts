import { z } from 'zod'

export const characterSchema = z.object({
    name: z.string().trim().min(1, "角色名不可为空"),
    sect: z.string().trim().default('自定义'),
    avatar: z.url().optional(),
    portrait: z.url().optional(),
    profile: z.string().default(''),
})

export type Character = z.infer<typeof characterSchema>

const characterJsonModules = import.meta.glob<Character>('../assets/characters/*.json', {
    eager: true,
    import: 'default',
})

export const defaultCharacters = Object.values(characterJsonModules).reduce<
    Record<string, Character>
>((record, profile) => {
    const name = profile.name.trim()

    if (name) {
        record[name] = profile
    }

    return record
}, {})
