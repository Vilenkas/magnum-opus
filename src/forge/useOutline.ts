/**
 * The DOM side of a book's index: reads the headings of a rendered chapter (also those that
 * arrive late, as lazy MDX parts load), gives them ids, follows which one is being read, and
 * scrolls to one. Each tome draws the index itself.
 */
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { loadJSON, saveJSON } from '@/shell/storage'
import { activeEntry, buildOutline, type HeadingLevel, type OutlineEntry } from './outline'

/** The chapter's own headings, plus a closing sources section; never those inside a plate. */
const HEADINGS = ':scope > h2, :scope > h3, :scope > section > h2, :scope > footer > h2'

/** Where the reader's eye is, as a fraction of the viewport's height. */
const READING_LINE = 0.25

/** Wide enough for the index to sit beside a 42rem column, so it starts open. */
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

  const jump = useCallback((id: string | null) => {
    if (id === null) window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return { entries, active, jump }
}

function sameOutline(a: OutlineEntry[], b: OutlineEntry[]) {
  return a.length === b.length && a.every((e, i) => e.id === b[i].id && e.text === b[i].text)
}

/**
 * Whether the index is open. On wide screens it sits beside the text: open unless closed
 * there, remembered per tome. On narrow ones it is an overlay: it starts closed and closes
 * after a jump (`closeIfNarrow`).
 */
export function useIndexOpen(key: string, wide = WIDE) {
  const [open, setOpenState] = useState(() => matchMedia(wide).matches && loadJSON(key, true))
  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next)
      if (matchMedia(wide).matches) saveJSON(key, next)
    },
    [key, wide],
  )
  const closeIfNarrow = useCallback(() => {
    if (!matchMedia(wide).matches) setOpenState(false)
  }, [wide])
  return { open, setOpen, closeIfNarrow }
}
