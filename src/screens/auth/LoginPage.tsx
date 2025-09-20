import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, type Location } from 'react-router-dom'

import { useLoginMutation } from '../../features/auth/authApi'
import { useNotifications } from '../../providers/notifications/notificationContext'
import { useLocalization } from '../../providers/localization/localizationContext'
import { useIsAuthenticated } from '../../features/auth/hooks'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'auth.required' })
    .email({ message: 'auth.email' }),
  password: z
    .string()
    .min(1, { message: 'auth.required' })
    .min(8, { message: 'auth.passwordMin' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { translate } = useLocalization()
  const { notify } = useNotifications()
  const isAuthenticated = useIsAuthenticated()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap()
      notify({ type: 'success', title: translate('auth.success') })
      const from = (location.state as { from?: Location })?.from
      navigate(from?.pathname ?? '/dashboard', { replace: true })
    } catch (error) {
      console.error('Login failed', error)
      notify({
        type: 'error',
        title: translate('auth.error'),
        description: translate('errors.unknown'),
      })
    }
  }

  const getErrorMessage = (field: keyof LoginFormValues) => {
    const issue = errors[field]
    if (!issue) return undefined

    const message = issue.message as string
    if (message === 'auth.passwordMin') {
      return translate(message, { length: 8 })
    }
    return translate(message)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          {translate('auth.title')}
        </h1>
        <p className="text-sm text-secondary">{translate('auth.subtitle')}</p>
      </header>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary" htmlFor="email">
          {translate('auth.emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-base bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-blue-500"
          placeholder="roomie@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{getErrorMessage('email')}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary" htmlFor="password">
          {translate('auth.passwordLabel')}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-base bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-blue-500"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{getErrorMessage('password')}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? translate('auth.loading') : translate('auth.submit')}
      </button>
    </form>
  )
}
