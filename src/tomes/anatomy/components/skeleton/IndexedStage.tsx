import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON } from '@/shell/storage'
import { searchIndex, type IndexEntry, type IndexSection } from '../../data/structure-index'
import styles from './IndexedStage.module.css'

export interface IndexedStageProps<E extends IndexEntry> {
  /** The stage (a <SkeletonStage>), drawn to the left of the index. */
  children: ReactNode
  sections: (IndexSection<E> & { color?: string })[]
  selectedKey: string | null
  onChoose: (entry: E) => void
  /** Remembers, per plate, whether the reader folded the index away. */
  storageKey: string
  /** "Índice de vasos". */
  label: string
}

/**
 * A 3D stage with a searchable index of its structures beside it. The index folds into a thin
 * strip; in fullscreen both fill the screen. Shared by every 3D viewer of the tome.
 */
export function IndexedStage<E extends IndexEntry>({ children, sections, selectedKey, onChoose, storageKey, label }: IndexedStageProps<E>) {
  const [collapsed, setCollapsed] = useState(() => loadJSON(`anatomy:index-collapsed:${storageKey}`, false))
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const list = useRef<HTMLDivElement>(null)

  const toggle = () =>
    setCollapsed((c) => {
      saveJSON(`anatomy:index-collapsed:${storageKey}`, !c)
      return !c
    })

  const total = useMemo(() => sections.reduce((n, s) => n + s.entries.length, 0), [sections])
  const filtered = useMemo(
    () => sections.map((s) => ({ ...s, entries: searchIndex(deferredQuery, s.entries) })).filter((s) => s.entries.length),
    [sections, deferredQuery],
  )

  // Picking on the model scrolls the index to the structure.
  useEffect(() => {
    if (!selectedKey || collapsed) return
    list.current?.querySelector(`[data-key="${CSS.escape(selectedKey)}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [selectedKey, collapsed])

  return (
    <div className={styles.body} data-stage-body data-collapsed={collapsed}>
      {children}
      <nav className={styles.index} aria-label={label} data-index>
        {collapsed ? (
          <button className={styles.unfold} onClick={toggle} title="Mostrar el índice" aria-expanded={false}>
            <SearchIcon />
            <span className={styles.unfoldLabel}>Índice</span>
          </button>
        ) : (
          <>
            <div className={styles.head}>
              <input
                type="search"
                className={styles.search}
                placeholder={`Buscar entre ${total}…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={label}
              />
              <button className={styles.fold} onClick={toggle} title="Contraer el índice" aria-expanded>
                <ChevronIcon />
              </button>
            </div>
            <div className={styles.list} ref={list}>
              {filtered.map((section) => (
                <section key={section.id}>
                  <h4 className={styles.sectionTitle} style={section.color ? { color: section.color } : undefined}>
                    {section.label} <span className={styles.count}>{section.entries.length}</span>
                  </h4>
                  <ul>
                    {section.entries.map((entry) => (
                      <li key={entry.key}>
                        <button data-key={entry.key} data-active={entry.key === selectedKey} onClick={() => onChoose(entry)} title={entry.title}>
                          {entry.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              {!filtered.length && <p className={styles.empty}>Nada coincide con «{query}».</p>}
            </div>
          </>
        )}
      </nav>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
