import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { ThemeContext, type Theme, type ThemeContextValue } from './themeContext'

const THEME_STORAGE_KEY = 'conviven.theme'

const themeTokens: Record<Theme, Record<string, string>> = {
  light: {
    '--color-surface': '#f8fafc',
    '--color-surface-strong': '#ffffff',
    '--color-surface-muted': '#e2e8f0',
    '--color-border': '#cbd5f5',
    '--color-text-primary': '#0f172a',
    '--color-text-secondary': '#475569',
    '--color-brand': '#2563eb',
    '--color-brand-strong': '#1d4ed8',
    '--color-danger': '#ef4444',
    '--color-success': '#16a34a',
    '--shadow-elevation': '0 10px 25px rgba(15, 23, 42, 0.1)',
  },
  dark: {
    '--color-surface': '#0f172a',
    '--color-surface-strong': '#1e293b',
    '--color-surface-muted': '#334155',
    '--color-border': '#1e293b',
    '--color-text-primary': '#e2e8f0',
    '--color-text-secondary': '#cbd5f5',
    '--color-brand': '#60a5fa',
    '--color-brand-strong': '#3b82f6',
    '--color-danger': '#f87171',
    '--color-success': '#22c55e',
    '--shadow-elevation': '0 10px 30px rgba(15, 23, 42, 0.45)',
  },
}

function applyThemeTokens(theme: Theme) {
  const root = document.documentElement
  const tokens = themeTokens[theme]

  Object.entries(tokens).forEach(([token, value]) => {
    root.style.setProperty(token, value)
  })

  root.dataset.theme = theme
}

function loadStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'dark' || stored === 'light' ? stored : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => loadStoredTheme())

  useEffect(() => {
    applyThemeTokens(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
