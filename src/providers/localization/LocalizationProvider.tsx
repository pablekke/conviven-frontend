import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { formatInTimeZone } from 'date-fns-tz'
import { enUS, es } from 'date-fns/locale'
import type { Locale as DateFnsLocale } from 'date-fns'

import {
  LocalizationContext,
  type Locale,
  type LocalizationContextValue,
} from './localizationContext'

type TranslationDictionary = Record<string, string | TranslationDictionary>

const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  es: {
    auth: {
      title: 'Iniciá sesión para continuar',
      subtitle:
        'Conectate para administrar tu perfil de roomie y seguir tus matches.',
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      submit: 'Ingresar',
      loading: 'Validando credenciales…',
      success: 'Sesión iniciada correctamente',
      error: 'No pudimos validar tus datos',
      required: 'Este campo es obligatorio',
      email: 'Ingresá un correo electrónico válido',
      passwordMin: 'La contraseña debe tener al menos {length} caracteres',
    },
    navigation: {
      dashboard: 'Inicio',
      queues: 'Colas',
      logout: 'Cerrar sesión',
      toggleTheme: 'Cambiar tema',
    },
    dashboard: {
      welcome: '¡Bienvenido de nuevo, {name}! 👋',
      description:
        'Usá este panel para revisar tus matches, preferencias y mensajes pendientes.',
      emptyState:
        'Todavía no hay actividad reciente, pero mantené tus preferencias actualizadas.',
      activeMatches: 'Matches activos',
      activityTitle: 'Tu actividad',
    },
    queue: {
      title: 'Cola de revisión',
      subtitle:
        'Gestioná los perfiles que están esperando validación o seguimiento.',
      empty: 'Tu cola está vacía por ahora.',
      add: 'Agregar a la cola',
      advance: 'Avanzar estado',
      placeholder: 'Perfil pendiente de verificación',
    },
    errors: {
      unknown: 'Ocurrió un error inesperado',
    },
    notFound: {
      title: 'No encontramos lo que buscabas',
      description:
        'Revisá la URL o volvé al inicio para seguir descubriendo roommates.',
      action: 'Volver al inicio',
    },
  },
  en: {
    auth: {
      title: 'Sign in to continue',
      subtitle:
        'Access your roomie profile, manage your matches and keep the conversation going.',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      submit: 'Sign in',
      loading: 'Checking your credentials…',
      success: 'Signed in successfully',
      error: 'We could not validate your credentials',
      required: 'This field is required',
      email: 'Please provide a valid email address',
      passwordMin: 'The password must be at least {length} characters long',
    },
    navigation: {
      dashboard: 'Home',
      queues: 'Queues',
      logout: 'Log out',
      toggleTheme: 'Toggle theme',
    },
    dashboard: {
      welcome: 'Welcome back, {name}! 👋',
      description:
        'Use this dashboard to review your matches, preferences and pending conversations.',
      emptyState:
        'There is no recent activity yet, but keep your preferences fresh to find great matches.',
      activeMatches: 'Active matches',
      activityTitle: 'Your activity',
    },
    queue: {
      title: 'Review queue',
      subtitle:
        'Keep track of the profiles awaiting validation or follow-up.',
      empty: 'Your queue is empty for now.',
      add: 'Add to queue',
      advance: 'Advance status',
      placeholder: 'Profile pending validation',
    },
    errors: {
      unknown: 'Something unexpected happened',
    },
    notFound: {
      title: 'We could not find what you were looking for',
      description:
        'Double-check the URL or head back to the home page to keep discovering roommates.',
      action: 'Back to home',
    },
  },
}

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  es,
  en: enUS,
}

const DEFAULT_TIME_ZONE = 'UTC'

function resolveTranslation(
  dictionary: TranslationDictionary,
  key: string,
): string | TranslationDictionary | undefined {
  return key.split('.').reduce<TranslationDictionary | string | undefined>(
    (accumulator, part) =>
      typeof accumulator === 'object' && accumulator !== null
        ? accumulator[part]
        : undefined,
    dictionary,
  )
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')

  const translate = useCallback(
    (key: string, variables?: Record<string, string | number>) => {
      const result = resolveTranslation(TRANSLATIONS[locale], key)

      if (typeof result !== 'string') {
        return key
      }

      if (!variables) {
        return result
      }

      return Object.entries(variables).reduce((text, [variable, value]) => {
        return text.replaceAll(`{${variable}}`, String(value))
      }, result)
    },
    [locale],
  )

  const formatDate = useCallback<LocalizationContextValue['formatDate']>(
    (date, pattern, options) => {
      const normalized =
        typeof date === 'string' || typeof date === 'number'
          ? new Date(date)
          : date

      return formatInTimeZone(
        normalized,
        options?.timeZone ?? DEFAULT_TIME_ZONE,
        pattern,
        {
          locale: DATE_FNS_LOCALES[locale],
        },
      )
    },
    [locale],
  )

  const value = useMemo<LocalizationContextValue>(
    () => ({
      locale,
      setLocale,
      translate,
      formatDate,
    }),
    [formatDate, locale, translate],
  )

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}
