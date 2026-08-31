const PREFIX = '[苍玄界DOM]'

export function logDiagnostic(event: string, details: Record<string, unknown> = {}) {
    console.info(`${PREFIX} ${event} ${JSON.stringify(details)}`)
}
