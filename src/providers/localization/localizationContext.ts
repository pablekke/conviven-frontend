import { createContext, useContext } from 'react'

export type Locale = 'es' | 'en'

export interface LocalizationContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  translate: (key: string, variables?: Record<string, string | number>) => string
  formatDate: (
    date: Date | number | string,
    format: string,
    options?: { timeZone?: string },
  ) => string
}

export const LocalizationContext = createContext<
  LocalizationContextValue | undefined
>(undefined)

export function useLocalization() {
  const context = useContext(LocalizationContext)

  if (!context) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider',
    )
  }

  return context
}
