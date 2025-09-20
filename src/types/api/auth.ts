export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type LoginResponse = AuthTokens

export interface RefreshRequest {
  refreshToken: string
}

export type RefreshResponse = AuthTokens
