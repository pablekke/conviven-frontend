interface UserHomeProps {
  userName?: string
  email?: string
}

const featuredServices = [
  {
    title: 'Conviven Spaces',
    description:
      'Accede a espacios colaborativos donde puedes reservar salas y coordinar actividades con tu comunidad.',
    badge: 'Nuevo',
  },
  {
    title: 'Conviven Market',
    description:
      'Descubre productos y servicios pensados para tus necesidades con beneficios exclusivos por tu suscripción.',
    badge: 'Destacado',
  },
  {
    title: 'Conviven Mentorías',
    description:
      'Recibe acompañamiento personalizado de mentores y expertos que te ayudarán a alcanzar tus objetivos.',
    badge: 'Popular',
  },
]

const quickActions = [
  {
    title: 'Mi perfil',
    description:
      'Actualiza tu información, preferencias y zonas de interés para recibir contenido relevante.',
    action: 'Editar perfil',
  },
  {
    title: 'Mi comunidad',
    description:
      'Explora grupos disponibles, participa de eventos y conecta con otras personas afines.',
    action: 'Ver comunidades',
  },
  {
    title: 'Centro de ayuda',
    description:
      'Accede a tutoriales, guías paso a paso y soporte humano cuando lo necesites.',
    action: 'Ir al centro de ayuda',
  },
]

export function UserHome({ userName, email }: UserHomeProps) {
  const greetingTarget = userName ?? email ?? 'Conviven'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="rounded-3xl bg-white/80 p-8 shadow-elevated">
          <p className="text-sm font-medium text-blue-600">¡Hola, {greetingTarget}!</p>
          <h1 className="mt-2 text-3xl font-semibold text-primary">
            Bienvenido a tu espacio en Conviven
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">
            Encuentra los productos, servicios y experiencias pensadas para ti. Explora el catálogo, revisa tu perfil y mantente
            al tanto de tus actividades favoritas.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Explorar servicios
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400"
            >
              Ver mi perfil
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Productos y servicios disponibles
            </h2>
            <div className="space-y-4">
              {featuredServices.map((service) => (
                <article
                  key={service.title}
                  className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm shadow-blue-100/50"
                >
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                    {service.badge}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-sm shadow-blue-100/40">
              <h2 className="text-xl font-semibold text-primary">Tu perfil</h2>
              <p className="mt-2 text-sm text-secondary">
                Mantén tus datos actualizados para aprovechar al máximo Conviven.
              </p>
              <div className="mt-4 space-y-3 text-sm text-secondary">
                <p>
                  <span className="font-semibold text-primary">Nombre:</span>{' '}
                  {userName ?? 'Completa tu nombre'}
                </p>
                <p>
                  <span className="font-semibold text-primary">Correo:</span>{' '}
                  {email ?? 'Agrega un correo de contacto'}
                </p>
                <p>
                  <span className="font-semibold text-primary">Plan activo:</span>{' '}
                  Comunidad Plus
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-sm shadow-blue-100/40">
              <h2 className="text-xl font-semibold text-primary">Acciones rápidas</h2>
              <div className="mt-4 space-y-4">
                {quickActions.map((action) => (
                  <article
                    key={action.title}
                    className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-primary">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-secondary">{action.description}</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {action.action}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
