import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useIsAuthenticated } from '../features/auth/hooks'

interface ProtectedRouteProps {
  redirectPath?: string
}

export function ProtectedRoute({ redirectPath = '/login' }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />
  }

  return <Outlet />
}
