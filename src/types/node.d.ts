declare module 'node:test' {
  type TestFunction = () => unknown | Promise<unknown>
  function test(name: string, fn: TestFunction): Promise<void>
  function test(fn: TestFunction): Promise<void>
  export { test }
  export default test
}

declare module 'node:assert/strict' {
  interface Assert {
    equal(actual: unknown, expected: unknown, message?: string): void
    deepEqual(actual: unknown, expected: unknown, message?: string): void
    ok(value: unknown, message?: string): void
  }
  const assert: Assert
  export = assert
}

declare const process: {
  env: Record<string, string | undefined>
}

declare module './setup.js'
declare module '../src/services/authService.js' {
  export * from '../src/services/authService'
}

declare module '../src/store/authStateManager.js' {
  export * from '../src/store/authStateManager'
}
