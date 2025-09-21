interface AdminDashboardProps {
  userName?: string
}

const metrics = [
  {
    label: 'Usuarios activos',
    value: '1.204',
    change: '+12% vs. semana pasada',
  },
  {
    label: 'Nuevos registros',
    value: '86',
    change: '+8% en los últimos 7 días',
  },
  {
    label: 'Reportes abiertos',
    value: '14',
    change: '-3 pendientes respecto ayer',
  },
]

const pendingApprovals = [
  {
    name: 'Carla Méndez',
    email: 'carla@conviven.com',
    role: 'Proveedor',
    status: 'Pendiente de validación',
  },
  {
    name: 'Luis Duarte',
    email: 'luis@conviven.com',
    role: 'Usuario',
    status: 'Pendiente de confirmación',
  },
  {
    name: 'Marta León',
    email: 'marta@conviven.com',
    role: 'Proveedor',
    status: 'Revisión documental',
  },
]

const configurationOptions = [
  {
    title: 'Roles y permisos',
    description:
      'Define qué acciones puede realizar cada tipo de usuario dentro de la plataforma.',
    actionLabel: 'Configurar permisos',
  },
  {
    title: 'Parámetros de seguridad',
    description:
      'Gestiona la política de contraseñas, doble factor y bloqueos automáticos.',
    actionLabel: 'Actualizar políticas',
  },
  {
    title: 'Integraciones externas',
    description:
      'Sincroniza Conviven con herramientas de analítica, CRM o mensajería.',
    actionLabel: 'Administrar integraciones',
  },
]

export function AdminDashboard({ userName }: AdminDashboardProps) {
  const displayName = userName ?? 'Administrador'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-700/50 bg-slate-900/40 p-8 shadow-xl shadow-blue-500/10 backdrop-blur">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">
              Panel administrativo
            </p>
            <h1 className="text-3xl font-semibold">Hola {displayName}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
              Gestiona la comunidad, revisa el estado de los usuarios y controla la configuración global de Conviven desde un solo lugar.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-blue-500/90 px-5 py-2 font-semibold text-white transition hover:bg-blue-500"
            >
              Invitar nuevo usuario
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-600/70 px-5 py-2 font-semibold text-slate-200 transition hover:border-slate-400"
            >
              Configurar roles
            </button>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/60"
            >
              <p className="text-xs uppercase tracking-wide text-blue-200/80">
                {metric.label}
              </p>
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-300">{metric.change}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/60">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Gestión de usuarios
                </h2>
                <p className="text-sm text-slate-300">
                  Revisa las solicitudes recientes y actualiza su estado.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-blue-300 hover:text-white"
              >
                Ver todo
              </button>
            </header>
            <div className="mt-6 space-y-4">
              {pendingApprovals.map((item) => (
                <article
                  key={item.email}
                  className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">{item.email}</p>
                    </div>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200">
                      {item.role}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-300">{item.status}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-blue-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-red-400 hover:text-red-200"
                    >
                      Rechazar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/60">
            <h2 className="text-lg font-semibold text-white">Configuración</h2>
            <p className="text-sm text-slate-300">
              Mantén la plataforma alineada con las políticas de Conviven.
            </p>
            <div className="mt-6 space-y-4">
              {configurationOptions.map((option) => (
                <article
                  key={option.title}
                  className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5"
                >
                  <h3 className="text-base font-semibold text-slate-100">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {option.description}
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/20"
                  >
                    {option.actionLabel}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
