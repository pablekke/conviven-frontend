export function AccessDeniedScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 text-primary">
      <div className="max-w-lg space-y-6 rounded-3xl bg-white p-10 text-center shadow-elevated">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
          !
        </div>
        <h1 className="text-2xl font-semibold">Acceso denegado</h1>
        <p className="text-sm leading-relaxed text-secondary">
          No pudimos determinar tu rol dentro de Conviven. Por favor vuelve a iniciar sesión o contacta a un administrador para
          obtener permisos de acceso.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Ir al inicio de sesión
          </a>
          <a
            href="mailto:soporte@conviven.com"
            className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400"
          >
            Contactar soporte
          </a>
        </div>
      </div>
    </div>
  )
}
