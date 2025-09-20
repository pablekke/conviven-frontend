import { baseApi } from '../../services/baseApi'
import { clearSession, setCredentials } from './authSlice'
import type { AuthPayload } from './auth.types'

interface LoginRequest {
  email: string
  password: string
}

interface LogoutResponse {
  success: boolean
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthPayload, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (error) {
          console.error('Login failed', error)
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearSession())
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    profile: builder.query<AuthPayload['userInfo'], void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useProfileQuery } = authApi
