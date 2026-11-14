import { createContext, useContext, type ReactNode } from 'react'
import { sources, shortRef, type Ref, type Source, type SourceId } from '../data/sources'
import styles from './Citations.module.css'

/** Numbers sources in order of first citation and gathers the pages cited of each. */
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

/** `<Cita fuente="katzung" p="385" />` in a chapter: a numbered mark. */
export function Cite({ fuente, p }: { fuente: string; p?: string | number }) {
  const registry = useContext(CitationContext)
  if (!isSource(fuente)) {
    if (import.meta.env.DEV) return <span className={styles.unknown}>[fuente desconocida: {fuente}]</span>
    return null
  }
  const page = p === undefined ? undefined : String(p)
  const n = registry?.cite(fuente, page) ?? 0
  return (
    <sup className={styles.mark}>
      <a
        href={`#fuente-${n}`}
        title={`${shortRef(sources[fuente])}${page ? `, p. ${page}` : ''}`}
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

function Entry({ source, pages }: { source: Source; pages: string[] }) {
  return (
    <span className={styles.entry}>
      {source.authors && <span className={styles.author}>{source.authors}: </span>}
      <span className={styles.bookTitle}>{source.title}</span>
      {source.edition && `, ${source.edition}`}
      {source.publisher && `${source.edition?.endsWith('.') ? ' ' : '. '}${source.publisher}`}
      {source.place && `, ${source.place}`}
      {source.year && `, ${source.year}`}
      {pages.length > 0 && <span className={styles.pages}>págs. {pages.join(', ')}</span>}
      {source.note && <span className={styles.note}>{source.note}</span>}
    </span>
  )
}

/** The chapter's sources, at its end. */
export function Sources() {
  const registry = useContext(CitationContext)
  if (!registry || registry.order.length === 0) return null
  return (
    <footer className={styles.sources}>
      <h2 className={styles.title}>Fuentes</h2>
      <ol className={styles.list}>
        {registry.order.map((id, i) => (
          <li key={id} id={`fuente-${i + 1}`} className={styles.item}>
            <span className={styles.index}>{i + 1}</span>
            <Entry source={sources[id]} pages={[...(registry.pages.get(id) ?? [])]} />
          </li>
        ))}
      </ol>
    </footer>
  )
}

/** A card's sources: every ref grouped by work, pages in order. */
export function RefList({ refs }: { refs: Ref[] }) {
  const pages = new Map<SourceId, Set<string>>()
  for (const r of refs) {
    if (!pages.has(r.source)) pages.set(r.source, new Set())
    if (r.p) pages.get(r.source)!.add(r.p)
  }
  const sorted = (set: Set<string>) => [...set].sort((a, b) => parseInt(a) - parseInt(b))
  return (
    <ol className={styles.list}>
      {[...pages].map(([id, set]) => (
        <li key={id} className={styles.item}>
          <span className={styles.index}>·</span>
          <Entry source={sources[id]} pages={sorted(set)} />
        </li>
      ))}
    </ol>
  )
}
