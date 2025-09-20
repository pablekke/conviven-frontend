import { useMemo } from 'react'

import { useAuth } from '../store/AuthStore'

export function DashboardPage() {
  const { currentUser, logout } = useAuth()

  const greeting = useMemo(() => {
    if (!currentUser) {
      return 'Hola!'
    }

    if (currentUser.name && currentUser.name.trim().length > 0) {
      return `Hola ${currentUser.name}!`
    }

    return `Hola ${currentUser.email}!`
  }, [currentUser])

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">{greeting}</h1>
          <p className="text-sm text-secondary">
            Esta pantalla valida que la autenticación está funcionando correctamente.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-base px-4 py-2 text-sm font-semibold text-secondary transition hover:text-primary"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-primary">Usuario autenticado</h2>
        <pre className="rounded-xl bg-surface-strong p-4 text-sm text-primary">
          {JSON.stringify(currentUser ?? {}, null, 2)}
        </pre>
      </div>
    </section>
  )
}
