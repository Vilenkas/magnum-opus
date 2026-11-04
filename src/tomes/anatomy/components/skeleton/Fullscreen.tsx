import { useCallback, useEffect, useRef, useState } from 'react'
import { setWindowFullscreen } from '@/shell/desktop'
import plate from './plate.module.css'

/** Fullscreen for one element (a plate). In the desktop app the window follows along. */
export function useFullscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const sync = () => {
      const on = document.fullscreenElement === ref.current
      setActive(on)
      // Leaving with Esc only exits the element: bring the window back too.
      if (!document.fullscreenElement) void setWindowFullscreen(false)
      else if (on) void setWindowFullscreen(true)
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void ref.current?.requestFullscreen()
  }, [])

  return { ref, active, toggle, supported: typeof document !== 'undefined' && document.fullscreenEnabled }
}

export function FullscreenButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const label = active ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'
  return (
    <button className={plate.iconButton} onClick={onClick} title={label} aria-label={label}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        {active ? (
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        ) : (
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        )}
      </svg>
    </button>
  )
}
