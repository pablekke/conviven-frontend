class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  get length(): number {
    return this.store.size
  }
}

const storage = new MemoryStorage()

if (typeof globalThis.window === 'undefined') {
  ;(globalThis as unknown as { window: Window }).window = globalThis as unknown as Window
}

if (typeof (globalThis as Record<string, unknown>).localStorage === 'undefined') {
  ;(globalThis as unknown as { localStorage: Storage }).localStorage = storage
}

if (typeof window.localStorage === 'undefined') {
  ;(window as unknown as { localStorage: Storage }).localStorage = storage
}
