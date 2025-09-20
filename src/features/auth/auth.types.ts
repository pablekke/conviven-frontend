export type UserRole = 'roomie' | 'admin'

export interface UserInfo {
  id: string
  fullName: string
  email: string
  role: UserRole
  onboardingCompleted: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface AuthPayload {
  tokens: AuthTokens
  userInfo: UserInfo
}
