export const AUTH_EVENTS = {
  SESSION_EXPIRED: 'auth:session-expired',
} as const

export type AuthEventName = (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS]

export const authEventTarget = new EventTarget()
