/**
 * The DOM side of a book's index: reads the headings of a rendered chapter (also those that
 * arrive late, as lazy MDX parts load), gives them ids, follows which one is being read, and
 * scrolls to one. Each tome draws the index itself.
 */
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { PHONE, useMediaQuery } from '@/shell/chrome'
import { loadJSON, saveJSON } from '@/shell/storage'
import { activeEntry, buildOutline, type HeadingLevel, type OutlineEntry } from './outline'

/** The chapter's own headings, plus a closing sources section; never those inside a plate. */
const HEADINGS = ':scope > h2, :scope > h3, :scope > section > h2, :scope > footer > h2'

/** Where the reader's eye is, as a fraction of the viewport's height. */
const READING_LINE = 0.25

/** Wide enough for the index to sit beside a 42rem column, so it starts open there. */
const WIDE = '(min-width: 80rem)'

export function useOutline(container: RefObject<HTMLElement | null>) {
  const [entries, setEntries] = useState<OutlineEntry[]>([])
  const [active, setActive] = useState(-1)
  const elements = useRef<HTMLElement[]>([])

  useEffect(() => {
    const root = container.current
    if (!root) return
    let frame = 0

    const updateActive = () => {
      const tops = elements.current.map((el) => el.getBoundingClientRect().top)
      setActive(activeEntry(tops, window.innerHeight * READING_LINE))
    }

    const scan = () => {
      const els = [...root.querySelectorAll<HTMLElement>(HEADINGS)]
      const outline = buildOutline(
        els.map((el) => ({ level: Number(el.tagName[1]) as HeadingLevel, text: el.textContent ?? '', id: el.id || undefined })),
      )
      els.forEach((el, i) => (el.id = outline[i].id))
      elements.current = els
      setEntries((prev) => (sameOutline(prev, outline) ? prev : outline))
      updateActive()
    }

    const schedule = (fn: () => void) => () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fn)
    }
    const onScroll = schedule(updateActive)
    const observer = new MutationObserver(schedule(scan))
    observer.observe(root, { childList: true, subtree: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    scan()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [container])

  const cancelJump = useRef<() => void>(() => {})
  useEffect(() => () => cancelJump.current(), [])

  const jump = useCallback((id: string | null) => {
    cancelJump.current()
    if (id === null) return window.scrollTo({ top: 0, behavior: 'smooth' })
    const el = document.getElementById(id)
    if (el) cancelJump.current = scrollUntilSettled(el)
  }, [])

  return { entries, active, jump }
}

/**
 * Scrolls a heading to the top, and again each time the page comes to rest with the heading
 * elsewhere: figures and plates load lazily above it and push it down while we travel. Gives up
 * after a few tries or as soon as the reader takes over. Returns a cancel function.
 */
function scrollUntilSettled(el: HTMLElement): () => void {
  let tries = 0
  let timer = 0
  const go = () => el.scrollIntoView({ behavior: tries > 2 ? 'instant' : 'smooth', block: 'start' })
  const onScroll = () => {
    clearTimeout(timer)
    timer = window.setTimeout(settle, 150)
  }
  const settle = () => {
    const off = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
    if (Math.abs(off) > 4 && tries++ < 5) {
      go()
      onScroll() // in case it is already there and no scroll event comes
    } else stop()
  }
  const stop = () => {
    clearTimeout(timer)
    window.removeEventListener('scroll', onScroll)
    for (const type of TAKEOVER) window.removeEventListener(type, stop)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  for (const type of TAKEOVER) window.addEventListener(type, stop, { passive: true })
  go()
  onScroll()
  return stop
}

/** The reader scrolling on their own. */
const TAKEOVER = ['wheel', 'touchstart', 'keydown'] as const

function sameOutline(a: OutlineEntry[], b: OutlineEntry[]) {
  return a.length === b.length && a.every((e, i) => e.id === b[i].id && e.text === b[i].text)
}

/**
 * How a book's index shows, and whether it is open.
 * - `side` (wide screens): a panel beside the text, open unless closed there (remembered per tome).
 * - `drop` (tablets): a panel over the text, starts closed, closes after a jump.
 * - `sheet` (phones): a sheet rising from the bottom, same as `drop`; while it is open the page
 *   doesn't scroll under it.
 * Escape closes it in the two overlay modes.
 */
export function useIndexOpen(key: string, wide = WIDE) {
  const isWide = useMediaQuery(wide)
  const isPhone = useMediaQuery(PHONE)
  const mode: 'side' | 'drop' | 'sheet' = isWide ? 'side' : isPhone ? 'sheet' : 'drop'
  const [open, setOpenState] = useState(() => matchMedia(wide).matches && loadJSON(key, true))

  // Crossing into the side layout restores the remembered choice; leaving it closes the overlay.
  useEffect(() => {
    setOpenState(isWide && loadJSON(key, true))
  }, [isWide, key])

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next)
      if (matchMedia(wide).matches) saveJSON(key, next)
    },
    [key, wide],
  )
  const closeIfOverlay = useCallback(() => {
    if (!matchMedia(wide).matches) setOpenState(false)
  }, [wide])

  const overlay = open && mode !== 'side'
  useEffect(() => {
    if (!overlay) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenState(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlay])

  const locked = open && mode === 'sheet'
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const before = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = before
    }
  }, [locked])

  return { open, mode, setOpen, closeIfOverlay }
}

/**
 * Drag-to-dismiss for a bottom sheet: spread `handle` on its grip; `offset` is how far it has
 * been pulled down (px). Let go past `threshold` and it closes.
 */
export function useSheetDrag(close: () => void, threshold = 80) {
  const [offset, setOffset] = useState(0)
  const start = useRef<number | null>(null)
  const end = () => {
    if (start.current === null) return
    start.current = null
    if (offset > threshold) close()
    setOffset(0)
  }
  const handle = {
    onPointerDown(e: ReactPointerEvent<HTMLElement>) {
      start.current = e.clientY
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    onPointerMove(e: ReactPointerEvent<HTMLElement>) {
      if (start.current !== null) setOffset(Math.max(0, e.clientY - start.current))
    },
    onPointerUp: end,
    onPointerCancel: end,
  }
  return { offset, dragging: offset > 0, handle }
}
