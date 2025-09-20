const DEFAULT_BASE_URL = 'http://localhost:4000'

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>
}

export function getApiBaseUrl() {
  const viteBaseUrl =
    typeof import.meta !== 'undefined' && (import.meta as ImportMetaWithEnv).env
      ? (import.meta as ImportMetaWithEnv).env?.VITE_API_BASE_URL
      : undefined

  const nodeBaseUrl =
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as Record<string, unknown>).process === 'object'
      ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_API_BASE_URL
      : undefined

  const base = viteBaseUrl ?? nodeBaseUrl ?? DEFAULT_BASE_URL
  return base.replace(/\/$/, '')
}
