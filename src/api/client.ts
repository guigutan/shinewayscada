const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'

interface ApiErrorBody {
  error?: string
}

export interface ApiEnvelope<T> {
  data: T
}

const buildUrl = (path: string, params?: Record<string, string | number>): string => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export const get = async <T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> => {
  const response = await fetch(buildUrl(path, params), {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const body = await response.json().catch((): ApiErrorBody => ({})) as ApiErrorBody
    throw new Error(body.error ?? `请求失败（HTTP ${response.status}）`)
  }

  return response.json() as Promise<T>
}
