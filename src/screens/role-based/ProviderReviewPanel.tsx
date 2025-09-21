interface ProviderReviewPanelProps {
  userName?: string
}

const pendingContent = [
  {
    title: 'Guía práctica para organizar eventos comunitarios',
    type: 'Artículo',
    submittedBy: 'Laura González',
    submittedAt: 'Hace 2 horas',
    summary:
      'Incluye pasos detallados para preparar una agenda, promover la actividad y evaluar su impacto.',
  },
  {
    title: 'Plantilla de presupuesto para talleres presenciales',
    type: 'Recurso descargable',
    submittedBy: 'Daniel Ruiz',
    submittedAt: 'Hace 5 horas',
    summary:
      'Documento en formato editable para controlar gastos, proveedores y participantes.',
  },
  {
    title: 'Podcast: Comunidad sostenible en barrios urbanos',
    type: 'Podcast',
    submittedBy: 'Colectivo Raíces',
    submittedAt: 'Ayer',
    summary:
      'Conversación con especialistas en regeneración urbana y experiencias de intervención comunitaria.',
  },
]

export function ProviderReviewPanel({ userName }: ProviderReviewPanelProps) {
  const reviewer = userName ?? 'Equipo de proveedores'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8 shadow-emerald-500/10 shadow-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">
            Panel de revisión de contenidos
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Hola {reviewer}, revisa los contenidos pendientes
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
            Evalúa la calidad, vigencia y adecuación de los materiales enviados por la comunidad. Puedes aprobarlos para
            su publicación inmediata o devolverlos con comentarios.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full bg-emerald-500/20 px-4 py-2 font-semibold">
              3 contenidos en cola
            </span>
            <button
              type="button"
              className="rounded-full border border-emerald-400/60 px-4 py-2 font-semibold text-emerald-200 transition hover:border-emerald-200 hover:text-white"
            >
              Ver historial
            </button>
          </div>
        </header>

        <section className="space-y-5">
          {pendingContent.map((content) => (
            <article
              key={content.title}
              className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-6 shadow-lg shadow-black/40"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {content.type}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold text-white">{content.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{content.summary}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-xs text-slate-300">
                  <p className="font-semibold text-white">Propuesto por</p>
                  <p className="mt-1">{content.submittedBy}</p>
                  <p className="mt-1 text-emerald-200">{content.submittedAt}</p>
                </div>
              </div>
              <footer className="mt-6 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                <p className="text-slate-300">
                  Verifica la coherencia del contenido, enlaces, tono y que cumpla las guías editoriales antes de publicar.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-emerald-500/40 px-4 py-2 font-semibold text-emerald-200 transition hover:border-emerald-200 hover:text-white"
                  >
                    Solicitar ajustes
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
