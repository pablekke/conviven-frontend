import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithAuth } from './baseQueryWithAuth'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth', 'User', 'Queue'],
  endpoints: () => ({}),
})
