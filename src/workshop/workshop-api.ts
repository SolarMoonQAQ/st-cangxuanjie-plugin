import type { Character } from '@/shared/character.ts'
import { WORLDBOOK_NAME } from '@/shared/st.ts'
import {
    getCachedWorldBook,
} from '@/shared/query.ts'

export const WORKSHOP_API_BASE = 'https://cangxuan-workshop.cangxuanjie.workers.dev'
export const WORKSHOP_SOURCE = 'cangxuan_workshop'

export const WORKSHOP_KINDS = [
  'continent',
  'sea',
  'region',
  'settlement',
  'sect',
  'secret_realm',
  'npc',
  'encounter',
  'resource',
  'quest_seed',
] as const

export type WorkshopKind = (typeof WORKSHOP_KINDS)[number]

export type WorkshopSecondaryLogic = 'and_any' | 'and_all' | 'not_all' | 'not_any'

export type WorkshopSecondaryKeys = {
  logic: WorkshopSecondaryLogic
  keys: string[]
}

export type WorkshopEntry = {
  id: string
  kind: WorkshopKind
  label: string
  /** 世界书绿灯触发关键词。 */
  keys: string[]
  keys_secondary: WorkshopSecondaryKeys
  /** 最终写入世界书的正文。旧接口沿用 yamlText 字段名，但内容不要求必须是 YAML。 */
  yamlText: string
  tags: string[]
  customRole?: Character
}

export type WorkshopModuleContent = {
  schema: 'cultivation_world_module_v1'
  previewUrl?: string
  /** 依赖的工坊模块 ID；没有依赖时传空数组。 */
  dependencies: string[]
  entries: WorkshopEntry[]
}

export type WorkshopReviewStatus = 'pending_review' | 'approved' | 'rejected'

/** GET /api/cultivation-world/modules 返回的公开模块摘要。 */
export type WorkshopModuleSummary = {
    id: string
    version: string
    title: string
    kind: WorkshopKind
    kindLabel: string
    tags: string[]
    authorName: string
    description: string
    previewUrl?: string
    downloadCount: number
    reviewStatus: WorkshopReviewStatus
    reviewedBy?: string
    reviewedAtIso?: string
    createdAtIso?: string
    updatedAtIso: string
}

/** 下载接口返回的完整模块，额外包含可安装的世界书正文。 */
export type WorkshopModule = WorkshopModuleSummary & {
    content: WorkshopModuleContent
}

export type WorkshopModulePage = {
    modules: WorkshopModuleSummary[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/** POST /api/cultivation-world/submissions 的请求体。 */
export type WorkshopSubmission = {
  schema: 'cultivation_world_module_submission_v1'
  title: string
  kind: WorkshopKind
  previewUrl?: string
  authorName: string
  description: string
  tags: string[]
  /** 只供管理员审核时联系投稿人，不出现在公开目录。 */
  submitterContact?: string
  /** 只供管理员审核时查看。 */
  submitterNote?: string
  content: WorkshopModuleContent
}

export type WorkshopSubmissionResponse = {
  ok?: boolean
  submissionId?: string
  message?: string
}

type WorkshopModuleListPayload = {
    modules?: WorkshopModuleSummary[]
    total?: number
    page?: number
    pageSize?: number
    page_size?: number
    totalPages?: number
    total_pages?: number
    error?: string
    message?: string
}

export async function fetchWorkshopModules({
    page = 1,
    pageSize = 6,
    signal,
}: {
    page?: number
    pageSize?: number
    signal?: AbortSignal
} = {}): Promise<WorkshopModulePage> {
    const url = new URL('/api/cultivation-world/modules', WORKSHOP_API_BASE)

    url.searchParams.set('page', String(page))
    url.searchParams.set('page_size', String(pageSize))

    const response = await fetch(url, {
        signal,
        cache: 'no-store',
    })

    const data = (await response.json().catch(() => ({}))) as WorkshopModuleListPayload

    if (!response.ok) {
        throw new Error(data.error || data.message || `工坊目录加载失败：HTTP ${response.status}`)
    }

    if (!Array.isArray(data.modules)) {
        throw new Error('工坊目录响应缺少 modules 数组')
    }

    const normalizedPageSize = data.pageSize ?? data.page_size ?? pageSize

    return {
        modules: data.modules,
        total: data.total ?? data.modules.length,
        page: data.page ?? page,
        pageSize: normalizedPageSize,
        totalPages:
            data.totalPages ??
            data.total_pages ??
            Math.max(1, Math.ceil((data.total ?? data.modules.length) / normalizedPageSize)),
    }
}

export async function downloadWorkshopModule(moduleId: string): Promise<WorkshopModule> {
    const response = await fetch(
        `${WORKSHOP_API_BASE}/api/cultivation-world/modules/${encodeURIComponent(moduleId)}/download`,
        {
            cache: 'no-store',
        },
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.error || `下载失败：HTTP ${response.status}`)
    }

    return data.module || data
}

export async function uploadWorkshopSubmission(
    submission: WorkshopSubmission,
): Promise<WorkshopSubmissionResponse> {
    const apiBase = WORKSHOP_API_BASE.replace(/\/+$/, '')
    const response = await fetch(`${apiBase}/api/cultivation-world/submissions`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.error || data.message || `投稿失败：HTTP ${response.status}`)
    }

    return data
}

export async function installWorkshopModule(moduleId: string) {
    // 1. 下载工坊模块
    const workshopModule = await downloadWorkshopModule(moduleId)
    const entries = workshopModule.content.entries

    if (entries.length === 0) {
        throw new Error('该模块没有世界书条目')
    }

    // 2. 删除同一模块的旧条目
    await TavernHelper.deleteWorldbookEntries(
        WORLDBOOK_NAME,
        (entry) =>
            entry.extra?.source === WORKSHOP_SOURCE &&
            String(entry.extra?.module_id) === workshopModule.id,
        { render: 'debounced' },
    )

    // 3. 转换并写入世界书
    const worldbookEntries = entries.map((entry) => ({
        name: entry.label || workshopModule.title,
        enabled: true,

        strategy: {
            type: 'selective',
            keys: entry.keys || [],
            keys_secondary: entry.keys_secondary || {
                logic: 'and_any',
                keys: [],
            },
            scan_depth: 'same_as_global',
        },

        position: {
            type: 'before_character_definition',
            role: 'system',
            depth: 4,
            order: 100,
        },

        content: entry.yamlText || '',

        extra: {
            source: WORKSHOP_SOURCE,
            module_id: workshopModule.id,
            module_version: workshopModule.version,
            kind: entry.kind,
        },
    }))

    const result = await TavernHelper.createWorldbookEntries(WORLDBOOK_NAME, worldbookEntries, {
        render: 'immediate',
    })

    return {
        module: workshopModule,
        installedEntries: result.new_entries,
    }
}

type ModuleInstallStatus = 'not_installed' | 'installed' | 'update_available'

export async function getModuleInstallStatus(
    workshopModule: Pick<WorkshopModule, 'id' | 'version'>,
): Promise<ModuleInstallStatus> {
    const snapshot = await getCachedWorldBook()
    const versions = snapshot.installedVersions

    if (!versions.has(workshopModule.id)) {
        return 'not_installed'
    }

    const installedVersion = versions.get(workshopModule.id)

    return installedVersion === workshopModule.version ? 'installed' : 'update_available'
}
