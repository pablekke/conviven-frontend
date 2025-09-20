import test from 'node:test'
import * as assert from 'node:assert/strict'

import './setup.js'
import type { LoginRequest } from '../src/types/api/auth'

const ORIGINAL_FETCH = globalThis.fetch

function createMockResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

test('authService.login sends credentials and stores tokens', async () => {
  const originalBaseUrl = process.env.VITE_API_BASE_URL
  process.env.VITE_API_BASE_URL = 'http://auth.test'
  const authModule = await import('../src/services/authService.js')
  authModule.storeTokens(null)

  const credentials: LoginRequest = {
    email: 'user@test.com',
    password: 'secret123',
  }

  const expectedTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  }

  let requestedUrl: string | undefined
  let requestedInit: RequestInit | undefined

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    requestedUrl = typeof input === 'string' ? input : input.toString()
    requestedInit = init
    return createMockResponse(expectedTokens)
  }

  try {
    const response = await authModule.login(credentials)

    assert.equal(
      requestedUrl,
      'http://auth.test/api/auth/login',
      'login should call the auth endpoint using configured base URL',
    )

    assert.ok(requestedInit)
    assert.equal(requestedInit?.method, 'POST')
    assert.equal(requestedInit?.headers && (requestedInit.headers as Record<string, string>)['Content-Type'], 'application/json')

    const body = requestedInit?.body ? JSON.parse(requestedInit.body as string) : undefined
    assert.deepEqual(body, credentials)

    assert.deepEqual(response, expectedTokens)
    assert.deepEqual(authModule.getStoredTokens(), expectedTokens)
  } finally {
    globalThis.fetch = ORIGINAL_FETCH
    process.env.VITE_API_BASE_URL = originalBaseUrl
  }
})
