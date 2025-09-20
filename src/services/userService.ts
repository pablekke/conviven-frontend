import { httpClient } from '../config/httpClient'
import type { User } from '../types/models/user'

export function getCurrentUser() {
  return httpClient.get<User>('/users/me')
}
