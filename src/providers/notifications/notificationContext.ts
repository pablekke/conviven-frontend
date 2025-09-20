import { createContext, useContext } from 'react'

export type NotificationType = 'info' | 'success' | 'error' | 'warning'

export interface NotificationOptions {
  title: string
  description?: string
  type?: NotificationType
}

export interface NotificationContextValue {
  notify: (options: NotificationOptions) => void
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }

  return context
}
