import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { LoginRequest } from '../types/api/auth'
import type { User } from '../types/models/user'
import { AuthStateManager, type AuthSnapshot } from './authStateManager'

interface AuthContextValue extends AuthSnapshot {
  login: (credentials: LoginRequest) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const managerRef = useRef<AuthStateManager | null>(null)

  if (!managerRef.current) {
    managerRef.current = new AuthStateManager()
  }

  const manager = managerRef.current!
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(manager.getState())

  useEffect(() => {
    const unsubscribe = manager.subscribe(setSnapshot)
    return unsubscribe
  }, [manager])

  useEffect(() => {
    return () => {
      manager.dispose()
    }
  }, [manager])

  const login = useCallback((credentials: LoginRequest) => manager.login(credentials), [manager])
  const logout = useCallback(() => manager.logout(), [manager])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      login,
      logout,
    }),
    [login, logout, snapshot],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { AuthStatus } from './authStateManager'
