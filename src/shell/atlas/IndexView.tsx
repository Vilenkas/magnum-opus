import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { facets } from '@/tomes/taxonomy'
import {
  facetCounts,
  isFacetValue,
  relatedTo,
  tomesWithFacet,
  trailOf,
  type Atlas,
  type AtlasNode,
} from './model'
import { statusText, TomeBanner, Trail } from './parts'

/** The map as a collapsible tree on the left; the selected area (or body system) on the right. */
export function IndexView({ atlas, area, system }: { atlas: Atlas; area?: string; system?: string }) {
  const node = area ? atlas.byPath.get(area) : undefined
  const activeSystem = !node && isFacetValue('system', system) ? system : undefined
  const content = useRef<HTMLElement>(null)

  // The content scrolls on its own (wide screens): a new area starts at its top.
  useEffect(() => {
    content.current?.scrollTo({ top: 0 })
  }, [area, system])

  return (
    <div className="flex flex-1 flex-wrap lg:min-h-0 lg:flex-nowrap">
      <nav
        aria-label="Mapa del saber"
        className="max-w-full flex-[1_1_18rem] border-line bg-ink-sunken px-3 py-6 text-sm sm:border-r lg:w-72 lg:flex-none lg:overflow-y-auto"
      >
        <Link
          to="/"
          search={{ view: 'index' }}
          className={`mb-3 block px-2 text-[0.7rem] tracking-[0.3em] uppercase ${!node && !activeSystem ? 'text-gold' : 'text-muted hover:text-parchment'}`}
        >
          Mapa del saber
        </Link>
        <Tree nodes={atlas.roots} selected={node} />

        <p className="mt-8 mb-3 px-2 text-[0.7rem] tracking-[0.3em] text-muted uppercase">{facets.system.title}</p>
        <ul className="flex flex-wrap gap-1.5 px-2">
          {facetCounts(atlas, 'system').map(({ value, label, count }) => (
            <li key={value}>
              <Link
                to="/"
                search={{ view: 'index', system: value }}
                aria-current={value === activeSystem ? 'page' : undefined}
                className={`inline-flex h-8 items-center rounded-full border px-3 text-xs transition ${
                  value === activeSystem
                    ? 'border-gold bg-gold-faint text-gold'
                    : count
                      ? 'border-line-strong text-parchment hover:border-gold-dim'
                      : 'border-line text-muted hover:border-line-strong'
                }`}
              >
                {label}
                {count > 0 && <span className="ml-1.5 text-gold">{count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main ref={content} className="min-w-0 flex-[999_1_35rem] px-5 py-8 sm:px-10 lg:overflow-y-auto">
        {activeSystem ? (
          <SystemPanel atlas={atlas} value={activeSystem} />
        ) : area && !node ? (
          <p className="text-muted">
            Esa área no existe en el mapa.{' '}
            <Link to="/" search={{ view: 'index' }} className="text-gold">
              Volver al mapa
            </Link>
          </p>
        ) : (
          <AreaPanel atlas={atlas} node={node} />
        )}
      </main>
    </div>
  )
}

function Tree({ nodes, selected }: { nodes: AtlasNode[]; selected?: AtlasNode }) {
  // Branches open: the way down to the selection, plus whatever the reader toggles.
  const [open, setOpen] = useState<Set<string>>(() => new Set(selected ? trailOf(selected).map((n) => n.path) : []))
  useEffect(() => {
    if (selected) setOpen((prev) => new Set([...prev, ...trailOf(selected).map((n) => n.path)]))
  }, [selected])

  const toggle = (path: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (!next.delete(path)) next.add(path)
      return next
    })

  const render = (list: AtlasNode[]) => (
    <ul className="flex flex-col gap-0.5">
      {list.map((n) => {
        const isOpen = open.has(n.path)
        const isSelected = n === selected
        const written = n.status === 'tome' || n.status === 'path'
        return (
          <li key={n.path}>
            <div
              className={`flex min-h-9 items-center rounded-sm ${isSelected ? 'bg-gold-faint' : 'hover:bg-ink-raised'}`}
            >
              {n.children.length ? (
                <button
                  type="button"
                  onClick={() => toggle(n.path)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Plegar' : 'Desplegar'} ${n.title}`}
                  className="flex size-8 shrink-0 items-center justify-center text-muted hover:text-parchment"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-3.5 transition ${isOpen ? 'rotate-90' : ''}`} fill="currentColor">
                    <path d="M9 6l7 6-7 6z" />
                  </svg>
                </button>
              ) : (
                <span className="w-8 shrink-0" />
              )}
              <Link
                to="/"
                search={{ view: 'index', area: n.path }}
                aria-current={isSelected ? 'page' : undefined}
                className={`flex min-w-0 flex-1 items-center justify-between gap-2 py-1.5 pr-2 ${
                  isSelected ? 'font-semibold text-gold' : written ? 'text-parchment' : 'text-muted'
                } ${n.depth === 1 ? 'font-semibold' : ''}`}
              >
                <span className="truncate">{n.title}</span>
                {n.status === 'tome' ? (
                  <span aria-label="tiene tomo" className="size-2 shrink-0 rounded-full bg-gold" />
                ) : n.tomeCount > 0 ? (
                  <span className="text-xs font-normal text-muted">{n.tomeCount}</span>
                ) : null}
              </Link>
            </div>
            {n.children.length > 0 && isOpen && <div className="pl-4">{render(n.children)}</div>}
          </li>
        )
      })}
    </ul>
  )
  return render(nodes)
}

/** An area of the map, or the whole library when `node` is undefined. */
function AreaPanel({ atlas, node }: { atlas: Atlas; node?: AtlasNode }) {
  const children = node ? node.children : atlas.roots
  const related = node ? relatedTo(atlas, node) : []

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        {node ? <Trail node={node} className="text-sm" /> : <p className="text-sm text-muted">Enciclopedia personal</p>}
        <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">{node ? node.title : 'Biblioteca'}</h1>
        {node && node.status !== 'tome' && <p className="text-sm text-muted">{statusText(node)}</p>}
      </div>

      {node?.tomes.map((tome) => <TomeBanner key={tome.id} tome={tome} />)}

      {node?.coveredBy && !node.tomes.length && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">Esta área forma parte de un tomo más amplio:</p>
          <TomeBanner tome={node.coveredBy} node={atlas.homeOf.get(node.coveredBy.id)} />
        </div>
      )}

      {node?.status === 'pending' && (
        <p className="rounded-sm border border-dashed border-line-strong px-5 py-6 text-muted">
          Aún no hay un tomo para esta área.
        </p>
      )}

      {children.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">{node ? 'Contenido del área' : 'Dominios'}</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {children.map((child) => {
              const written = child.status === 'tome' || child.status === 'path' || child.status === 'covered'
              return (
                <li key={child.path}>
                  <Link
                    to="/"
                    search={{ view: 'index', area: child.path }}
                    className={`flex h-full flex-col gap-1 rounded-sm border px-4 py-3.5 transition ${
                      written
                        ? 'border-gold-dim bg-ink-raised hover:border-gold'
                        : 'border-dashed border-line-strong hover:border-gold-dim'
                    }`}
                  >
                    <span className={`font-display text-lg ${written ? 'text-parchment' : 'text-muted'}`}>{child.title}</span>
                    <span className={`text-xs ${child.status === 'tome' ? 'text-gold' : 'text-muted'}`}>
                      {child.status === 'tome' ? child.tomes.map((t) => t.title).join(', ') : statusText(child)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">Relacionados</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((tome) => {
              const home = atlas.homeOf.get(tome.id)
              return (
                <li key={tome.id}>
                  <Link
                    to="/tomes/$tomeId"
                    params={{ tomeId: tome.id }}
                    className="flex min-w-60 items-center justify-between gap-6 rounded-sm border border-line-strong px-4 py-3 transition hover:border-gold-dim"
                  >
                    <span className="flex flex-col">
                      <span className="font-display text-lg">{tome.title}</span>
                      {home && <span className="text-xs text-muted">{trailOf(home).slice(0, -1).map((n) => n.title).join(' › ')}</span>}
                    </span>
                    <span className="text-sm text-gold">Abrir</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function SystemPanel({ atlas, value }: { atlas: Atlas; value: string }) {
  const label = (facets.system.values as Record<string, string>)[value]
  const tomes = tomesWithFacet(atlas, 'system', value)
  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{facets.system.title}</p>
        <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">{label}</h1>
        <p className="text-sm text-muted">Todo lo escrito sobre este sistema, desde cualquier disciplina.</p>
      </div>
      {tomes.length ? (
        tomes.map((tome) => <TomeBanner key={tome.id} tome={tome} node={atlas.homeOf.get(tome.id)} />)
      ) : (
        <p className="rounded-sm border border-dashed border-line-strong px-5 py-6 text-muted">
          Aún no hay tomos sobre este sistema.
        </p>
      )}
    </div>
  )
}
