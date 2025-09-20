import { authEventTarget, AUTH_EVENTS } from '../services/authEvents'
import {
  getAccessToken,
  getRefreshToken,
  refresh,
  storeTokens,
  logout,
  type StoredAuthTokens,
} from '../services/authService'
import { getApiBaseUrl } from './env'

const apiBaseUrl = `${getApiBaseUrl()}/api`

interface RequestConfig extends RequestInit {
  retry?: boolean
  skipAuthRefresh?: boolean
}

export interface HttpErrorPayload {
  message?: string
  [key: string]: unknown
}

export class HttpError extends Error {
  readonly status: number
  readonly payload?: HttpErrorPayload

  constructor(status: number, payload?: HttpErrorPayload, message?: string) {
    super(message ?? payload?.message ?? `Request failed with status ${status}`)
    this.status = status
    this.payload = payload
  }
}

let refreshPromise: Promise<StoredAuthTokens | null> | null = null

async function parseJsonSafely(response: Response): Promise<HttpErrorPayload | undefined> {
  const text = await response.text()
  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    console.warn('Failed to parse JSON response', error)
    return undefined
  }
}

async function attemptRefresh(): Promise<StoredAuthTokens | null> {
  const currentRefreshToken = getRefreshToken()
  if (!currentRefreshToken) {
    return null
  }

  if (!refreshPromise) {
    refreshPromise = refresh(currentRefreshToken)
      .then((tokens: StoredAuthTokens) => {
        refreshPromise = null
        return tokens
      })
      .catch((error: unknown) => {
        refreshPromise = null
        throw error
      })
  }

  return refreshPromise
}

function handleForcedLogout() {
  logout()
  authEventTarget.dispatchEvent(new Event(AUTH_EVENTS.SESSION_EXPIRED))
}

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const url = new URL(path, apiBaseUrl)
  const headers = new Headers(config.headers ?? {})

  if (!config.skipAuthRefresh) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  if (config.body && !(config.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  headers.set('Accept', 'application/json')

  const response = await fetch(url, { ...config, headers })

  if (response.status === 401 && !config.skipAuthRefresh && !config.retry) {
    try {
      const tokens = await attemptRefresh()

      if (!tokens) {
        handleForcedLogout()
        const payload = await parseJsonSafely(response)
        throw new HttpError(response.status, payload)
      }

      storeTokens(tokens as StoredAuthTokens)
      return request<T>(path, { ...config, retry: true })
    } catch (refreshError) {
      handleForcedLogout()
      if (refreshError instanceof HttpError) {
        throw refreshError
      }

      const payload = await parseJsonSafely(response)
      throw new HttpError(401, payload, 'Authentication expired')
    }
  }

  if (!response.ok) {
    const payload = await parseJsonSafely(response)
    throw new HttpError(response.status, payload)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await parseJsonSafely(response)
  return payload as T
}

export const httpClient = {
  get<T>(path: string, config?: RequestConfig) {
    return request<T>(path, { ...config, method: 'GET' })
  },
  post<T>(path: string, body: unknown, config?: RequestConfig) {
    const init: RequestConfig = {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...config,
    }

    return request<T>(path, init)
  },
  put<T>(path: string, body: unknown, config?: RequestConfig) {
    const init: RequestConfig = {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...config,
    }

    return request<T>(path, init)
  },
  patch<T>(path: string, body: unknown, config?: RequestConfig) {
    const init: RequestConfig = {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...config,
    }

    return request<T>(path, init)
  },
  delete<T>(path: string, config?: RequestConfig) {
    return request<T>(path, { ...config, method: 'DELETE' })
  },
}

export type HttpClient = typeof httpClient
