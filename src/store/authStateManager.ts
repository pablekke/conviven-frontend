import type { LoginRequest } from '../types/api/auth'
import type { User } from '../types/models/user'
import {
  getStoredTokens,
  login as performLogin,
  logout as performLogout,
  subscribeToTokens,
  type StoredAuthTokens,
} from '../services/authService'
import { getCurrentUser } from '../services/userService'
import { authEventTarget, AUTH_EVENTS } from '../services/authEvents'

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error'

export interface AuthSnapshot {
  status: AuthStatus
  tokens: StoredAuthTokens | null
  currentUser: User | null
  error: string | null
}

export interface AuthStateDependencies {
  login: typeof performLogin
  logout: typeof performLogout
  getCurrentUser: typeof getCurrentUser
  getStoredTokens: typeof getStoredTokens
  subscribeToTokens: typeof subscribeToTokens
  authEventTarget: EventTarget
  sessionExpiredEvent: string
}

const defaultDependencies: AuthStateDependencies = {
  login: performLogin,
  logout: performLogout,
  getCurrentUser,
  getStoredTokens,
  subscribeToTokens,
  authEventTarget,
  sessionExpiredEvent: AUTH_EVENTS.SESSION_EXPIRED,
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (error && typeof error === 'object') {
    const payload = (error as { payload?: unknown }).payload
    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof (payload as Record<string, unknown>).message === 'string'
    ) {
      return String((payload as Record<string, unknown>).message)
    }
  }

  return fallback
}

export class AuthStateManager {
  private state: AuthSnapshot
  private readonly listeners = new Set<(snapshot: AuthSnapshot) => void>()
  private readonly dependencies: AuthStateDependencies
  private readonly unsubscribeTokens?: () => void
  private readonly sessionListener: () => void
  private hasAttemptedRestore: boolean
  private disposed = false

  constructor(dependencies: Partial<AuthStateDependencies> = {}) {
    this.dependencies = { ...defaultDependencies, ...dependencies }

    const initialTokens = this.dependencies.getStoredTokens()
    this.state = {
      status: initialTokens ? 'authenticating' : 'idle',
      tokens: initialTokens,
      currentUser: null,
      error: null,
    }

    this.hasAttemptedRestore = initialTokens ? false : true

    this.unsubscribeTokens = this.dependencies.subscribeToTokens((tokens: StoredAuthTokens | null) => {
      if (this.disposed) {
        return
      }
      this.state = {
        ...this.state,
        tokens,
        currentUser: tokens ? this.state.currentUser : null,
      }
      if (!tokens) {
        this.state = { ...this.state, status: 'idle', error: null }
      }
      this.notify()
    })

    this.sessionListener = () => {
      if (this.disposed) {
        return
      }
      this.handleSessionExpired()
    }

    this.dependencies.authEventTarget.addEventListener(
      this.dependencies.sessionExpiredEvent,
      this.sessionListener,
    )

    if (initialTokens) {
      void this.restoreSession()
    }
  }

  getState(): AuthSnapshot {
    return { ...this.state }
  }

  subscribe(listener: (snapshot: AuthSnapshot) => void) {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  dispose() {
    this.disposed = true
    this.unsubscribeTokens?.()
    this.dependencies.authEventTarget.removeEventListener(
      this.dependencies.sessionExpiredEvent,
      this.sessionListener,
    )
    this.listeners.clear()
  }

  async login(credentials: LoginRequest) {
    if (this.disposed) {
      throw new Error('AuthStateManager has been disposed')
    }

    this.hasAttemptedRestore = true
    this.setState({ status: 'authenticating', error: null })

    try {
      const tokens = await this.dependencies.login(credentials)
      this.setState({ tokens })
      const user = await this.dependencies.getCurrentUser()
      this.setState({ currentUser: user, status: 'authenticated', error: null })
      return user
    } catch (error) {
      this.dependencies.logout()
      const message = extractErrorMessage(error, 'No se pudo iniciar sesión')
      this.setState({
        status: 'error',
        currentUser: null,
        tokens: this.dependencies.getStoredTokens(),
        error: message,
      })
      throw error
    }
  }

  logout() {
    if (this.disposed) {
      return
    }
    this.dependencies.logout()
    this.setState({ tokens: null, currentUser: null, status: 'idle', error: null })
  }

  private async restoreSession() {
    if (this.hasAttemptedRestore || !this.state.tokens) {
      return
    }

    this.hasAttemptedRestore = true
    this.setState({ status: 'authenticating', error: null })

    try {
      const user = await this.dependencies.getCurrentUser()
      this.setState({ currentUser: user, status: 'authenticated', error: null })
    } catch (error) {
      this.dependencies.logout()
      const message = extractErrorMessage(error, 'No se pudo restaurar la sesión')
      this.setState({
        status: 'idle',
        currentUser: null,
        tokens: this.dependencies.getStoredTokens(),
        error: message,
      })
    }
  }

  private handleSessionExpired() {
    this.logout()
    this.setState({
      error: 'Tu sesión expiró. Por favor inicia sesión nuevamente.',
    })
  }

  private setState(partial: Partial<AuthSnapshot>) {
    this.state = { ...this.state, ...partial }
    this.notify()
  }

  private notify() {
    const snapshot = this.getState()
    this.listeners.forEach((listener) => {
      listener(snapshot)
    })
  }
}
