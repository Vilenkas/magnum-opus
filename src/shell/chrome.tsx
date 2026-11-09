/**
 * The layout of the chrome over a tome: one row at the top with the shell's pill and, beside it,
 * a slot where the open tome puts its own actions (`<ChromeActions>`, e.g. a book's index button).
 * The shell owns the row and where it sits; each tome still draws what it puts in the slot.
 * On phones the row hides while reading down and comes back on the way up.
 */
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Below this width the layout is a phone's: icon-only pill, hiding row, bottom sheets. */
export const PHONE = '(max-width: 47.99rem)'

const SlotContext = createContext<HTMLElement | null>(null)
export const ChromeSlotProvider = SlotContext.Provider

/** Renders its children into the chrome row, after the shell's pill. */
export function ChromeActions({ children }: { children: ReactNode }) {
  const slot = useContext(SlotContext)
  return slot ? createPortal(children, slot) : null
}

/** Whether a media query matches, kept up to date. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
  )
}

/** True while the reader scrolls down past the top; false again on the way up (or `enabled` off). */
export function useHiddenOnScrollDown(enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return
    }
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      // Some slack, so a trembling thumb doesn't flicker it.
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > 80)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])
  return hidden
}
