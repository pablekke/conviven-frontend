import { useMemo } from 'react'

import { useLocalization } from '../../providers/localization/localizationContext'
import { useUserInfo } from '../../features/auth/hooks'
import { useAppSelector } from '../../app/hooks'

export function DashboardPage() {
  const { translate, formatDate } = useLocalization()
  const user = useUserInfo()
  const queueItems = useAppSelector((state) => state.queue.items)

  const lastActivity = useMemo(() => {
    if (queueItems.length === 0) return null
    const ordered = [...queueItems].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    )
    return ordered[0]
  }, [queueItems])

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">
          {translate('dashboard.welcome', { name: user?.fullName ?? 'Roomie' })}
        </h1>
        <p className="max-w-2xl text-sm text-secondary">
          {translate('dashboard.description')}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-base bg-surface-strong p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            {translate('dashboard.activeMatches')}
          </h2>
          <p className="mt-2 text-sm text-secondary">
            {translate('dashboard.emptyState')}
          </p>
        </article>

        <article className="rounded-2xl border border-base bg-surface-strong p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            {translate('dashboard.activityTitle')}
          </h2>
          {lastActivity ? (
            <p className="mt-2 text-sm text-secondary">
              Último movimiento el{' '}
              <span className="font-semibold text-primary">
                {formatDate(lastActivity.createdAt, "d 'de' MMMM yyyy HH:mm")}
              </span>{' '}
              para <span className="font-semibold">{lastActivity.title}</span>.
            </p>
          ) : (
            <p className="mt-2 text-sm text-secondary">
              {translate('dashboard.emptyState')}
            </p>
          )}
        </article>
      </div>
    </section>
  )
}
