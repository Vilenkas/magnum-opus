import { createContext, useContext, type ReactNode } from 'react'
import { sources, shortRef, type Source, type SourceId } from '../data/sources'
import styles from './Citations.module.css'

/**
 * Citations are numbered by first appearance in a book. Each <Cita> registers
 * while rendering; <Fuentes>, rendered after the chapter in the same pass,
 * lists what was registered. A fresh registry per provider render keeps the
 * numbering stable (re-registering the same source is idempotent).
 */
class Registry {
  readonly order: SourceId[] = []
  readonly pages = new Map<SourceId, Set<string>>()

  cite(id: SourceId, page?: string): number {
    if (!this.pages.has(id)) {
      this.order.push(id)
      this.pages.set(id, new Set())
    }
    // "475, 483" cites two places.
    for (const p of page?.split(',') ?? []) if (p.trim()) this.pages.get(id)!.add(p.trim())
    return this.order.indexOf(id) + 1
  }
}

const CitationContext = createContext<Registry | null>(null)

export function CitationProvider({ children }: { children: ReactNode }) {
  return <CitationContext.Provider value={new Registry()}>{children}</CitationContext.Provider>
}

const isSource = (id: string): id is SourceId => id in sources

/** MDX: <Cita fuente="testut-1" p="12" /> → a superscript number linking to the book's sources. */
export function Cite({ fuente, p }: { fuente: string; p?: string | number }) {
  const registry = useContext(CitationContext)
  if (!isSource(fuente)) {
    if (import.meta.env.DEV) return <span className={styles.unknown}>[fuente desconocida: {fuente}]</span>
    return null
  }
  const page = p === undefined ? undefined : String(p)
  const n = registry?.cite(fuente, page) ?? 0
  const source: Source = sources[fuente]
  return (
    <sup className={styles.mark}>
      <a
        href={`#fuente-${n}`}
        title={`${shortRef(source)}${page ? `, p. ${page}` : ''}`}
        // The router lives in the URL hash: scroll instead of navigating.
        onClick={(e) => {
          e.preventDefault()
          document.getElementById(`fuente-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }}
      >
        {n}
      </a>
    </sup>
  )
}

/** Cited pages merged into runs: {"6", "6–7", "8", "10"} → "6–8, 10". Non-numeric pages are kept as written. */
export function pageList(pages: Iterable<string>): string {
  const numbers = new Set<number>()
  const other: string[] = []
  for (const page of pages) {
    const range = page.match(/^(\d+)\s*[-–]\s*(\d+)$/)
    if (range) for (let n = +range[1]; n <= +range[2]; n++) numbers.add(n)
    else if (/^\d+$/.test(page)) numbers.add(+page)
    else other.push(page)
  }
  const sorted = [...numbers].sort((a, b) => a - b)
  const runs: string[] = []
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i]
    while (sorted[i + 1] === sorted[i] + 1) i++
    runs.push(sorted[i] === start ? `${start}` : `${start}–${sorted[i]}`)
  }
  return [...runs, ...other].join(', ')
}

/** "9.ª ed., Barcelona: Salvat, 1975", or '' for works with none of it. */
const publication = (s: Source) =>
  [s.edition, [s.place, s.publisher].filter(Boolean).join(': '), s.year].filter(Boolean).join(', ')

/** The sources cited so far in this book; renders nothing if none. */
export function Sources() {
  const registry = useContext(CitationContext)
  if (!registry?.order.length) return null
  return (
    <section className={styles.sources} aria-labelledby="fuentes">
      <h2 id="fuentes">Fuentes</h2>
      <ol>
        {registry.order.map((id, i) => {
          const s: Source = sources[id]
          const pages = registry.pages.get(id)!
          return (
            <li key={id} id={`fuente-${i + 1}`}>
              {s.authors && `${s.authors}. `}
              <cite>{s.title}</cite>
              {s.volume && `, ${s.volume}`}.{' '}
              {publication(s) && `${publication(s)}. `}
              {s.note && `${s.note} `}
              {s.license && `Licencia ${s.license}. `}
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
              {pages.size > 0 && (
                <span className={styles.pages}>
                  {' '}
                  {/^\d+$/.test(pageList(pages)) ? 'Pág.' : 'Págs.'} {pageList(pages)}.
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
