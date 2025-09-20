import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-base bg-surface-strong p-8 shadow-elevated">
        <Outlet />
      </div>
    </div>
  )
}
