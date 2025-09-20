import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import type { ReactNode } from 'react'

import { store, persistor } from '../app/store'
import { LocalizationProvider } from './localization/LocalizationProvider'
import { NotificationProvider } from './notifications/NotificationProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocalizationProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  )
}
