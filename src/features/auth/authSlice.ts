import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthPayload, AuthTokens, UserInfo } from './auth.types'

interface AuthState {
  tokens: AuthTokens | null
  userInfo: UserInfo | null
}

const initialState: AuthState = {
  tokens: null,
  userInfo: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthPayload>) {
      state.tokens = action.payload.tokens
      state.userInfo = action.payload.userInfo
    },
    updateUserInfo(state, action: PayloadAction<UserInfo>) {
      if (!state.tokens) return
      state.userInfo = action.payload
    },
    clearSession(state) {
      state.tokens = null
      state.userInfo = null
    },
  },
})

export const { setCredentials, updateUserInfo, clearSession } = authSlice.actions

export const authReducer = authSlice.reducer
