import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

import { useNotifications } from '../providers/notifications/notificationContext'
import { useLocalization } from '../providers/localization/localizationContext'
import { useTheme } from '../providers/theme/themeContext'
import { useAuthTokens, useUserInfo } from '../features/auth/hooks'
import { useLogoutMutation, useProfileQuery } from '../features/auth/authApi'
import { useAppDispatch } from '../app/hooks'
import { updateUserInfo } from '../features/auth/authSlice'

const baseLinkClass =
  'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors duration-150 hover:bg-slate-200/50'

export function AppLayout() {
  const dispatch = useAppDispatch()
  const { translate, locale, setLocale } = useLocalization()
  const { theme, toggleTheme } = useTheme()
  const { notify } = useNotifications()
  const tokens = useAuthTokens()
  const user = useUserInfo()
  const navigate = useNavigate()
  const [logout, { isLoading }] = useLogoutMutation()
  const { data: profileData } = useProfileQuery(undefined, {
    skip: !tokens?.accessToken,
  })

  useEffect(() => {
    if (profileData) {
      dispatch(updateUserInfo(profileData))
    }
  }, [dispatch, profileData])

  const initials = useMemo(() => {
    if (!user?.fullName) return '??'
    return user.fullName
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }, [user?.fullName])

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      notify({ type: 'info', title: translate('navigation.logout') })
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
      notify({
        type: 'error',
        title: translate('errors.unknown'),
      })
    }
  }

  const switchLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es')
  }

  return (
    <div className="flex min-h-screen bg-surface text-primary">
      <aside className="hidden w-64 flex-shrink-0 border-r border-base bg-surface-strong/60 px-6 py-8 lg:block">
        <div className="mb-8">
          <span className="text-lg font-semibold text-primary">Conviven</span>
          <p className="mt-1 text-sm text-secondary">
            {translate('dashboard.description')}
          </p>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? `${baseLinkClass} bg-blue-600 text-white shadow`
                : baseLinkClass
            }
          >
            {translate('navigation.dashboard')}
          </NavLink>
          <NavLink
            to="/queues"
            className={({ isActive }) =>
              isActive
                ? `${baseLinkClass} bg-blue-600 text-white shadow`
                : baseLinkClass
            }
          >
            {translate('navigation.queues')}
          </NavLink>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-base bg-surface-strong/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={switchLocale}
              className="rounded-lg border border-base bg-surface px-3 py-1 text-sm font-medium text-secondary hover:text-primary"
            >
              {locale.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-base bg-surface px-3 py-1 text-sm font-medium text-secondary hover:text-primary"
            >
              {translate('navigation.toggleTheme')} · {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-primary">
                {user?.fullName ?? 'Anon'}
              </span>
              <span className="text-xs text-secondary">{user?.email}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className="rounded-lg border border-base bg-surface px-3 py-1 text-sm font-medium text-secondary hover:text-primary disabled:opacity-60"
            >
              {translate('navigation.logout')}
            </button>
          </div>
        </header>
        <main className="flex-1 bg-surface px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
