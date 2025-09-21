import { useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'

import { useAuth } from '../store/authContext'
import { AdminDashboard } from '../screens/role-based/AdminDashboard'
import { UserHome } from '../screens/role-based/UserHome'
import { ProviderReviewPanel } from '../screens/role-based/ProviderReviewPanel'
import { AccessDeniedScreen } from '../screens/role-based/AccessDeniedScreen'

interface AccessTokenPayload {
  roles?: unknown
}

type SupportedRole = 'ADMIN' | 'USER' | 'PROVIDER'

function normalizeRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((role) => (typeof role === 'string' ? role.trim() : ''))
      .filter((role): role is string => role.length > 0)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()]
  }

  return []
}

function isSupportedRole(value: string): value is SupportedRole {
  const normalized = value.toUpperCase()
  return normalized === 'ADMIN' || normalized === 'USER' || normalized === 'PROVIDER'
}

function extractRoleFromToken(accessToken: string): SupportedRole | null {
  try {
    const decoded = jwtDecode<AccessTokenPayload>(accessToken)
    const roles = normalizeRoles(decoded.roles)

    for (const role of roles) {
      if (isSupportedRole(role)) {
        return role.toUpperCase() as SupportedRole
      }
    }
  } catch (error) {
    console.error('No se pudo decodificar el accessToken', error)
  }

  return null
}

export function AppRouter() {
  const { tokens, currentUser } = useAuth()
  const accessToken = tokens?.accessToken ?? null

  const role = useMemo(() => {
    if (!accessToken) {
      return null
    }
    return extractRoleFromToken(accessToken)
  }, [accessToken])

  const displayName = useMemo(() => {
    if (currentUser?.name && currentUser.name.trim().length > 0) {
      return currentUser.name
    }
    if (currentUser?.email) {
      return currentUser.email
    }
    return undefined
  }, [currentUser])

  if (role === 'ADMIN') {
    return <AdminDashboard userName={displayName} />
  }

  if (role === 'USER') {
    return <UserHome userName={displayName} email={currentUser?.email ?? undefined} />
  }

  if (role === 'PROVIDER') {
    return <ProviderReviewPanel userName={displayName} />
  }

  return <AccessDeniedScreen />
}
