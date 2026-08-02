import { Moon, Sun, SunMoon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storeDefaults, type StoreSchema } from '../../../../shared/store'
import { HomePageButton } from '../HomePageButton'
import { store } from '../../lib/store'
import styles from './ThemeToggleButton.module.css'

type Theme = StoreSchema['theme']

const THEMES = ['system', 'light', 'dark'] as const satisfies readonly Theme[]

// 'system' is labelled the way macOS labels the same setting.
const THEME_LABELS: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }

const THEME_ICONS: Record<Theme, typeof Sun> = { system: SunMoon, light: Sun, dark: Moon }

// Cycles auto → light → dark. The choice is written to the root element as
// [data-theme]; index.css turns that into a color-scheme, and every themed
// token follows from there — nothing here needs to know about the OS
// preference, because "auto" is just the absence of an override.
export function ThemeToggleButton() {
  const [theme, setTheme] = useState<Theme>(storeDefaults.theme)
  const Icon = THEME_ICONS[theme]

  // The store lives in the main process, so the stored choice only lands after
  // an IPC round-trip. Until it does the app renders as 'system', which is also
  // what the store defaults to — only a pinned light/dark settles a beat late.
  useEffect(() => {
    store.get('theme').then(setTheme)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function cycleTheme() {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    store.set('theme', next)
  }

  return (
    <HomePageButton
      className={styles.themeToggleButton}
      icon={<Icon size={24} strokeWidth={2} />}
      aria-label={`Theme: ${THEME_LABELS[theme]}`}
      onClick={cycleTheme}
    >
      {THEME_LABELS[theme]}
    </HomePageButton>
  )
}
