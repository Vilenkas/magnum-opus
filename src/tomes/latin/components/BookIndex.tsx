import { useEffect, useRef, type ReactNode } from 'react'
import { visibleEntries, type OutlineEntry } from '@/forge/outline'
import { useIndexOpen, useSheetDrag } from '@/forge/useOutline'
import { ChromeActions } from '@/shell/chrome'
import { toInscription } from '../inscription'
import styles from './BookIndex.module.css'

interface Props {
  numeral: string
  title: string
  entries: OutlineEntry[]
  active: number
  jump: (id: string | null) => void
}

/**
 * The book's index: its button sits in the chrome row, beside the shell's pill. It opens as a
 * panel under the row (beside the text on wide screens, over it on tablets) or, on phones, as a
 * sheet rising from the bottom.
 */
export function BookIndex({ numeral, title, entries, active, jump }: Props) {
  const { open, mode, setOpen, closeIfOverlay } = useIndexOpen('latin:book-index-open')
  if (!entries.length) return null

  const go = (id: string | null) => {
    closeIfOverlay()
    // After the sheet lets go of the page's scroll.
    requestAnimationFrame(() => jump(id))
  }
  const contents = <Contents numeral={numeral} title={title} entries={entries} active={active} go={go} />

  return (
    <>
      <ChromeActions>
        <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span aria-hidden>·</span> Índice <span aria-hidden>·</span>
        </button>
      </ChromeActions>
      {open &&
        (mode === 'sheet' ? (
          <Sheet close={() => setOpen(false)}>{contents}</Sheet>
        ) : (
          <nav className={styles.panel} aria-label="Índice del libro">
            {contents}
          </nav>
        ))}
    </>
  )
}

function Sheet({ close, children }: { close: () => void; children: ReactNode }) {
  const { offset, dragging, handle } = useSheetDrag(close)
  return (
    <div className={styles.sheetLayer}>
      <div className={styles.backdrop} onClick={close} aria-hidden />
      <nav
        className={styles.sheet}
        aria-label="Índice del libro"
        style={{ transform: offset ? `translateY(${offset}px)` : undefined, transition: dragging ? 'none' : undefined }}
      >
        <div className={styles.grip} {...handle}>
          <span aria-hidden />
        </div>
        <button type="button" className={styles.close} onClick={close} aria-label="Cerrar el índice">
          ×
        </button>
        {children}
      </nav>
    </div>
  )
}

function Contents({
  numeral,
  title,
  entries,
  active,
  go,
}: Omit<Props, 'jump'> & { go: (id: string | null) => void }) {
  const list = useRef<HTMLOListElement>(null)

  // Keep the current entry in sight inside the list (by hand: scrollIntoView would also stop
  // the page's own smooth scroll).
  useEffect(() => {
    const box = list.current
    const item = box?.querySelector<HTMLElement>('[aria-current]')
    if (!box || !item) return
    if (item.offsetTop < box.scrollTop || item.offsetTop + item.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = item.offsetTop - box.clientHeight / 3
    }
  }, [active])

  return (
    <>
      <button type="button" className={styles.heading} onClick={() => go(null)} title="Al principio del libro">
        <span className={styles.numeral}>Liber {numeral}</span>
        {toInscription(title)}
      </button>
      <ol ref={list} className={styles.list}>
        {visibleEntries(entries, active).map((i) => {
          const entry = entries[i]
          const inSection = i === active || (entries[active]?.section === i && entry.level === 2)
          return (
            <li key={entry.id} className={entry.level === 3 ? styles.sub : undefined}>
              <button
                type="button"
                className={styles.entry}
                aria-current={i === active ? 'location' : undefined}
                data-section={inSection || undefined}
                onClick={() => go(entry.id)}
              >
                {entry.text}
              </button>
            </li>
          )
        })}
      </ol>
    </>
  )
}
