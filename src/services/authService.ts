import type {
  AuthTokens,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
} from '../types/api/auth'
import { getApiBaseUrl } from '../config/env'

const TOKEN_STORAGE_KEY = 'conviven:auth:tokens'
const apiBaseUrl = `${getApiBaseUrl()}/api`

export type StoredAuthTokens = AuthTokens

type TokenSubscriber = (tokens: StoredAuthTokens | null) => void

let inMemoryTokens: StoredAuthTokens | null = null
const subscribers = new Set<TokenSubscriber>()

function notify(tokens: StoredAuthTokens | null) {
  subscribers.forEach((listener) => {
    try {
      listener(tokens)
    } catch (error) {
      console.error('Auth token subscriber failed', error)
    }
  })
}

function readFromStorage(): StoredAuthTokens | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const tokens = JSON.parse(raw) as StoredAuthTokens
    inMemoryTokens = tokens
    return tokens
  } catch (error) {
    console.warn('Failed to parse stored auth tokens, clearing them', error)
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    return null
  }
}

function persist(tokens: StoredAuthTokens | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (tokens) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

async function parseResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  const text = await response.text()
  let data: T | undefined

  if (text) {
    try {
      data = JSON.parse(text) as T
    } catch (error) {
      console.warn('Failed to parse auth service response', error)
    }
  }

  if (!response.ok) {
    const error = new Error(
      data && typeof data === 'object' && 'message' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).message)
        : defaultMessage,
    )
    ;(error as Error & { status?: number; payload?: unknown }).status = response.status
    ;(error as Error & { status?: number; payload?: unknown }).payload = data
    throw error
  }

  if (!data) {
    const error = new Error(defaultMessage)
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  return data
}

export function getStoredTokens(): StoredAuthTokens | null {
  if (inMemoryTokens) {
    return inMemoryTokens
  }

  return readFromStorage()
}

export function getAccessToken(): string | null {
  return getStoredTokens()?.accessToken ?? null
}

export function getRefreshToken(): string | null {
  return getStoredTokens()?.refreshToken ?? null
}

export function storeTokens(tokens: StoredAuthTokens | null): StoredAuthTokens | null {
  inMemoryTokens = tokens
  persist(tokens)
  notify(tokens)
  return tokens
}

export function subscribeToTokens(listener: TokenSubscriber) {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

export function logout() {
  storeTokens(null)
}

export async function login(credentials: LoginRequest): Promise<StoredAuthTokens> {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const tokens = await parseResponse<LoginResponse>(response, 'Unable to login')
  storeTokens(tokens)
  return tokens
}

export async function refresh(providedToken?: string): Promise<StoredAuthTokens> {
  const refreshToken = providedToken ?? getRefreshToken()
  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }

  const payload: RefreshRequest = { refreshToken }
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const tokens = await parseResponse<RefreshResponse>(response, 'Unable to refresh session')
  storeTokens(tokens)
  return tokens
}
