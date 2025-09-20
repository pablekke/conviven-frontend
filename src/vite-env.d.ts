/// <reference types="vite/client" />

declare namespace ImportMeta {
  interface Env {
    readonly VITE_API_URL?: string
    readonly VITE_AUTH_REFRESH_PATH?: string
  }
}
