import { useEffect, useRef } from 'react'
import { visibleEntries, type OutlineEntry } from '@/forge/outline'
import { useIndexOpen } from '@/forge/useOutline'
import styles from './BookIndex.module.css'

interface Props {
  numeral: string
  title: string
  entries: OutlineEntry[]
  active: number
  jump: (id: string | null) => void
}

/** The book's index, under the shell's pill: every chapter, and the sections of the one being read. */
export function BookIndex({ numeral, title, entries, active, jump }: Props) {
  const { open, setOpen, closeIfNarrow } = useIndexOpen('anatomy:book-index-open')
  const list = useRef<HTMLOListElement>(null)

  // Keep the current entry in sight inside the panel (by hand: scrollIntoView would also
  // stop the page's own smooth scroll).
  useEffect(() => {
    const box = list.current
    const item = box?.querySelector<HTMLElement>('[aria-current]')
    if (!box || !item) return
    if (item.offsetTop < box.scrollTop || item.offsetTop + item.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = item.offsetTop - box.clientHeight / 3
    }
  }, [active, open])

  if (!entries.length) return null

  const go = (id: string | null) => {
    jump(id)
    closeIfNarrow()
  }

  return (
    <nav className={styles.index} aria-label="Índice del libro">
      <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span aria-hidden>☰</span> Índice
      </button>
      {open && (
        <div className={styles.panel}>
          <button type="button" className={styles.heading} onClick={() => go(null)} title="Al principio del libro">
            <span className={styles.numeral}>Libro {numeral}</span>
            {title}
          </button>
          <ol ref={list} className={styles.list}>
            {visibleEntries(entries, active).map((i) => {
              const entry = entries[i]
              const current = i === active || (entries[active]?.section === i && entry.level === 2)
              return (
                <li key={entry.id} className={entry.level === 3 ? styles.sub : undefined}>
                  <button
                    type="button"
                    className={styles.entry}
                    aria-current={i === active ? 'location' : undefined}
                    data-section={current || undefined}
                    onClick={() => go(entry.id)}
                  >
                    {entry.text}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </nav>
  )
}
