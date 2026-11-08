import { createContext, useContext, type ReactNode } from 'react'
import { sources, shortRef, type Source, type SourceId } from '../data/sources'
import styles from './Citations.module.css'

class Registry {
  readonly order: SourceId[] = []
  readonly pages = new Map<SourceId, Set<string>>()

  cite(id: SourceId, page?: string): number {
    if (!this.pages.has(id)) {
      this.order.push(id)
      this.pages.set(id, new Set())
    }
    for (const p of page?.split(',') ?? []) if (p.trim()) this.pages.get(id)!.add(p.trim())
    return this.order.indexOf(id) + 1
  }
}

const CitationContext = createContext<Registry | null>(null)

export function CitationProvider({ children }: { children: ReactNode }) {
  return <CitationContext.Provider value={new Registry()}>{children}</CitationContext.Provider>
}

const isSource = (id: string): id is SourceId => id in sources

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

export function Sources() {
  const registry = useContext(CitationContext)
  if (!registry || registry.order.length === 0) return null

  return (
    <footer className={styles.sources}>
      <h2 className={styles.title}>Fuentes y referencias</h2>
      <ol className={styles.list}>
        {registry.order.map((id, i) => {
          const s: Source = sources[id]
          const pages = [...(registry.pages.get(id) ?? [])]
          return (
            <li key={id} id={`fuente-${i + 1}`} className={styles.item}>
              <span className={styles.index}>[{i + 1}]</span>
              <span className={styles.entry}>
                {s.authors && <span className={styles.author}>{s.authors}: </span>}
                <span className={styles.bookTitle}>{s.title}</span>
                {s.volume && `, ${s.volume}`}
                {s.edition && `, ${s.edition}`}
                {s.publisher && `. ${s.publisher}`}
                {s.place && `, ${s.place}`}
                {s.year && `, ${s.year}`}
                {pages.length > 0 && <span className={styles.pages}>(págs. {pages.join(', ')})</span>}
                {s.note && <span className={styles.note}>{s.note}</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </footer>
  )
}
