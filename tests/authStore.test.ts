import test from 'node:test'
import * as assert from 'node:assert/strict'

import './setup.js'
import { AuthStateManager, type AuthSnapshot } from '../src/store/authStateManager.js'
import type { StoredAuthTokens } from '../src/services/authService.js'
import type { LoginRequest } from '../src/types/api/auth'
import type { User } from '../src/types/models/user'

const eventTarget = new EventTarget()

function createDependencies() {
  let storedTokens: StoredAuthTokens | null = null
  const subscribers = new Set<(tokens: StoredAuthTokens | null) => void>()
  const user: User = {
    id: 'user-1',
    email: 'roomie@conviven.com',
    name: 'Conviven User',
  }
  const tokens: StoredAuthTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  }

  const dependencies = {
    login: async (credentials: LoginRequest) => {
      assert.equal(credentials.email, 'roomie@conviven.com')
      storedTokens = tokens
      subscribers.forEach((callback) => callback(tokens))
      return tokens
    },
    logout: () => {
      storedTokens = null
      subscribers.forEach((callback) => callback(null))
    },
    getCurrentUser: async () => user,
    getStoredTokens: () => storedTokens,
    subscribeToTokens: (callback: (tokens: StoredAuthTokens | null) => void) => {
      subscribers.add(callback)
      return () => {
        subscribers.delete(callback)
      }
    },
    authEventTarget: eventTarget,
    sessionExpiredEvent: 'session-expired',
  }

  return { dependencies, user, tokens }
}

test('AuthStateManager updates status on login and logout', async () => {
  const { dependencies, user, tokens } = createDependencies()
  const manager = new AuthStateManager(dependencies)
  const snapshots: AuthSnapshot[] = []

  const unsubscribe = manager.subscribe((snapshot: AuthSnapshot) => {
    snapshots.push(snapshot)
  })

  const result = await manager.login({ email: 'roomie@conviven.com', password: '12345678' })

  assert.deepEqual(result, user)

  const lastSnapshot = snapshots.at(-1)!
  assert.equal(lastSnapshot.status, 'authenticated')
  assert.deepEqual(lastSnapshot.currentUser, user)
  assert.deepEqual(lastSnapshot.tokens, tokens)

  manager.logout()

  const finalSnapshot = snapshots.at(-1)!
  assert.equal(finalSnapshot.status, 'idle')
  assert.equal(finalSnapshot.currentUser, null)
  assert.equal(finalSnapshot.tokens, null)

  unsubscribe()
  manager.dispose()
})
