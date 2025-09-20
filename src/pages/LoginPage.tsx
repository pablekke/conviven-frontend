import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'

import { useAuth } from '../store/AuthStore'
import { HttpError } from '../config/httpClient'

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Ingresa un email válido'
  }

  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria'
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return errors
}

function getServerErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.payload?.message ?? 'No se pudo iniciar sesión'
  }
  if (error instanceof Error) {
    return error.message
  }
  if (
    error &&
    typeof error === 'object' &&
    'payload' in (error as Record<string, unknown>) &&
    typeof (error as { payload?: { message?: unknown } }).payload?.message === 'string'
  ) {
    return String((error as { payload?: { message?: unknown } }).payload?.message)
  }
  return 'No se pudo iniciar sesión'
}

export function LoginPage() {
  const { status, login, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formValues, setFormValues] = useState<FormState>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const isAuthenticating = status === 'authenticating'
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  useEffect(() => {
    if (authError) {
      setServerError(authError)
    }
  }, [authError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)

    const errors = validateForm(formValues)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      await login({ email: formValues.email.trim(), password: formValues.password })
    } catch (error) {
      const message = getServerErrorMessage(error)
      setServerError(message)
    }
  }

  const buttonLabel = useMemo(() => {
    if (isAuthenticating) {
      return 'Iniciando sesión...'
    }
    return 'Ingresar'
  }, [isAuthenticating])

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-primary">Bienvenido a Conviven</h1>
        <p className="text-sm text-secondary">
          Inicia sesión con tu correo electrónico para continuar
        </p>
      </header>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-base bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-blue-500"
          placeholder="usuario@conviven.com"
          value={formValues.email}
          onChange={(event) => {
            setFormValues((current) => ({ ...current, email: event.target.value }))
          }}
          disabled={isAuthenticating}
        />
        {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-base bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-blue-500"
          value={formValues.password}
          onChange={(event) => {
            setFormValues((current) => ({ ...current, password: event.target.value }))
          }}
          disabled={isAuthenticating}
        />
        {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isAuthenticating}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  )
}
