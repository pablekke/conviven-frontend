import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { store } from '../app/store'
import { AuthProvider } from '../store/AuthStore'
import { LocalizationProvider } from './localization/LocalizationProvider'
import { NotificationProvider } from './notifications/NotificationProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LocalizationProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </LocalizationProvider>
      </AuthProvider>
    </Provider>
  )
}
