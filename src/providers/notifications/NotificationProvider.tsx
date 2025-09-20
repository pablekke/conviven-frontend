import { useCallback, useMemo, type ReactNode } from 'react'
import { Toaster, toast } from 'sonner'

import {
  NotificationContext,
  type NotificationContextValue,
  type NotificationOptions,
} from './notificationContext'

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notify = useCallback((options: NotificationOptions) => {
    const { type = 'info', title, description } = options

    const payload = { description }

    switch (type) {
      case 'success':
        toast.success(title, payload)
        break
      case 'error':
        toast.error(title, payload)
        break
      case 'warning':
        toast.warning(title, payload)
        break
      default:
        toast(title, payload)
        break
    }
  }, [])

  const value = useMemo<NotificationContextValue>(() => ({ notify }), [notify])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </NotificationContext.Provider>
  )
}
