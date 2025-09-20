import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { RootState } from '../app/store'
import { clearSession, setCredentials } from '../features/auth/authSlice'
import type { AuthPayload } from '../features/auth/auth.types'

const DEFAULT_BASE_URL = 'http://localhost:4000/api'
const REFRESH_ENDPOINT = '/auth/refresh'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.tokens?.accessToken

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')
    return headers
  },
})

async function refreshTokens(
  api: BaseQueryApi,
): Promise<AuthPayload | undefined> {
  const refreshToken = (api.getState() as RootState).auth.tokens?.refreshToken

  if (!refreshToken) {
    return undefined
  }

  const result = await rawBaseQuery(
    {
      url: import.meta.env.VITE_AUTH_REFRESH_PATH ?? REFRESH_ENDPOINT,
      method: 'POST',
      body: { refreshToken },
    },
    api,
    {},
  )

  if (result.error || !result.data) {
    return undefined
  }

  return result.data as AuthPayload
}

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshed = await refreshTokens(api)

    if (!refreshed) {
      api.dispatch(clearSession())
      return result
    }

    api.dispatch(setCredentials(refreshed))
    result = await rawBaseQuery(args, api, extraOptions)
  }

  return result
}
