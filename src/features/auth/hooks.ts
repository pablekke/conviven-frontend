import { useMemo } from 'react'

import { useAppSelector } from '../../app/hooks'
import type { UserRole } from './auth.types'

export function useAuthTokens() {
  return useAppSelector((state) => state.auth.tokens)
}

export function useUserInfo() {
  return useAppSelector((state) => state.auth.userInfo)
}

export function useIsAuthenticated() {
  const tokens = useAuthTokens()
  return Boolean(tokens?.accessToken)
}

export function useHasRole(role: UserRole) {
  const user = useUserInfo()
  return useMemo(() => user?.role === role, [user, role])
}
