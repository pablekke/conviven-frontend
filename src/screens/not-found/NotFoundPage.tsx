import { Link } from 'react-router-dom'

import { useLocalization } from '../../providers/localization/localizationContext'

export function NotFoundPage() {
  const { translate } = useLocalization()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10 text-center">
      <h1 className="text-4xl font-semibold text-primary">
        {translate('notFound.title')}
      </h1>
      <p className="mt-4 max-w-xl text-sm text-secondary">
        {translate('notFound.description')}
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {translate('notFound.action')}
      </Link>
    </div>
  )
}
