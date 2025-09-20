import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { advance, enqueue } from '../../features/queue/queueSlice'
import { useLocalization } from '../../providers/localization/localizationContext'
import { useNotifications } from '../../providers/notifications/notificationContext'

export function QueuePage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.queue.items)
  const { translate, formatDate } = useLocalization()
  const { notify } = useNotifications()
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (!title.trim()) {
      notify({ type: 'warning', title: translate('auth.required') })
      return
    }

    dispatch(enqueue(title.trim()))
    notify({ type: 'success', title: translate('queue.add') })
    setTitle('')
  }

  const handleAdvance = (id: string) => {
    dispatch(advance(id))
    notify({ type: 'info', title: translate('queue.advance') })
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">
          {translate('queue.title')}
        </h1>
        <p className="text-sm text-secondary">{translate('queue.subtitle')}</p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="flex-1 rounded-lg border border-base bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-blue-500"
          placeholder={translate('queue.placeholder')}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {translate('queue.add')}
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-secondary">{translate('queue.empty')}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-2 rounded-2xl border border-base bg-surface-strong p-4 shadow-sm md:flex-row md:items-center"
            >
              <div>
                <h2 className="text-base font-semibold text-primary">{item.title}</h2>
                <p className="text-xs text-secondary">
                  {formatDate(item.createdAt, "d MMM yyyy HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium capitalize text-secondary">
                  {item.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdvance(item.id)}
                  className="rounded-lg border border-base px-3 py-1 text-xs font-semibold text-secondary transition hover:text-primary"
                >
                  {translate('queue.advance')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
