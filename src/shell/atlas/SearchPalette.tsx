import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { facets } from '@/tomes/taxonomy'
import { readingOf, trailOf, type Atlas } from './model'
import { plural, SearchIcon, statusText, tierLabel, tomeTarget } from './parts'
import { search, type SearchResult } from './search'

const PER_GROUP = 6

const groups: { kind: SearchResult['kind']; title: string }[] = [
  { kind: 'tome', title: 'Tomos' },
  { kind: 'area', title: 'Áreas' },
  { kind: 'facet', title: facets.system.title },
]

interface Row {
  key: string
  title: string
  detail: string
  meta: string
  highlight: boolean
  go: () => void
}

/** Ctrl+K palette over tomes, areas of the map and body systems. */
export function SearchPalette({ atlas, onClose }: { atlas: Atlas; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const sections = useMemo(() => {
    const close = <T,>(fn: () => T) => () => {
      onClose()
      fn()
    }
    const toRow = (r: SearchResult): Row => {
      switch (r.kind) {
        case 'tome':
          return {
            key: `t:${r.tome.id}`,
            title: r.tome.title,
            detail: r.node ? trailOf(r.node).slice(0, -1).map((n) => n.title).join(' › ') : (r.tome.subtitle ?? ''),
            meta: tierLabel[r.tome.tier],
            highlight: true,
            go: close(() => navigate({ to: '/tomes/$tomeId', params: { tomeId: r.tome.id } })),
          }
        case 'area': {
          // An area inside a tome opens the tome where it is read; others, their page in the index.
          const reading = readingOf(r.node)
          return {
            key: `a:${r.node.path}`,
            title: r.node.title,
            detail: trailOf(r.node).slice(0, -1).map((n) => n.title).join(' › ') || 'Dominio',
            meta: statusText(r.node),
            highlight: r.node.status !== 'pending' && r.node.status !== 'group',
            go: close(() =>
              navigate(reading ? tomeTarget(reading.tome.id, reading.path) : { to: '/', search: { view: 'index', area: r.node.path } }),
            ),
          }
        }
        case 'facet':
          return {
            key: `f:${r.value}`,
            title: r.label,
            detail: 'Todo lo escrito sobre este sistema, desde cualquier disciplina',
            meta: r.count ? plural(r.count, 'tomo', 'tomos') : 'Sin tomos aún',
            highlight: r.count > 0,
            go: close(() => navigate({ to: '/', search: { view: 'index', system: r.value } })),
          }
      }
    }
    // Empty query: every tome, as quick access.
    const results: SearchResult[] = query.trim()
      ? search(atlas, query)
      : atlas.tomes.map((tome) => ({ kind: 'tome', score: 0, tome, node: atlas.homeOf.get(tome.id) }))
    return groups
      .map((g) => ({ ...g, rows: results.filter((r) => r.kind === g.kind).slice(0, PER_GROUP).map(toRow) }))
      .filter((g) => g.rows.length)
  }, [atlas, query, navigate, onClose])

  const rows = sections.flatMap((s) => s.rows)

  useEffect(() => setActive(0), [query])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') setActive((i) => Math.min(rows.length - 1, i + 1))
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
    else if (e.key === 'Enter') rows[active]?.go()
    else return
    e.preventDefault()
  }

  let index = -1
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en la biblioteca"
        className="w-full max-w-2xl overflow-hidden rounded-md border border-line-strong bg-ink-raised shadow-[0_24px_80px_#000a]"
        onKeyDown={onKey}
      >
        <label className="flex h-15 items-center gap-3 border-b border-line px-5">
          <SearchIcon className="size-5 shrink-0 text-gold" />
          <span className="sr-only">Buscar</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un área, un tomo, un sistema…"
            role="combobox"
            aria-expanded="true"
            aria-controls="atlas-search-results"
            aria-activedescendant={rows.length ? `atlas-search-${active}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-lg text-parchment outline-none placeholder:text-muted"
          />
          <kbd className="rounded-sm border border-line-strong px-1.5 py-0.5 font-sans text-xs text-muted">Esc</kbd>
        </label>

        <div ref={listRef} id="atlas-search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {sections.map((section) => (
            <div key={section.kind} role="group" aria-label={section.title}>
              <p className="mx-3 mt-3 mb-1 text-[0.7rem] tracking-[0.3em] text-muted uppercase">
                {query.trim() ? section.title : 'Tus tomos'}
              </p>
              {section.rows.map((row) => {
                index += 1
                const i = index
                return (
                  <div
                    key={row.key}
                    id={`atlas-search-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={row.go}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded px-3 py-2.5 ${i === active ? 'bg-gold-faint' : ''}`}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className={`truncate ${row.highlight ? 'text-parchment' : 'text-muted'}`}>{row.title}</span>
                      <span className="truncate text-xs text-muted">{row.detail}</span>
                    </span>
                    <span className={`shrink-0 text-xs ${row.highlight ? 'text-gold' : 'text-muted'}`}>{row.meta}</span>
                  </div>
                )
              })}
            </div>
          ))}
          {!rows.length && <p className="px-3 py-8 text-center text-sm text-muted">Nada coincide con «{query}».</p>}
        </div>

        <div className="flex flex-wrap gap-5 border-t border-line px-5 py-3 text-xs text-muted">
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> moverse
          </span>
          <span>
            <Kbd>Enter</Kbd> abrir
          </span>
          <span>
            <Kbd>Esc</Kbd> cerrar
          </span>
        </div>
      </div>
    </div>
  )
}

const Kbd = ({ children }: { children: string }) => (
  <kbd className="rounded-sm border border-line-strong px-1.5 py-0.5 font-sans">{children}</kbd>
)
