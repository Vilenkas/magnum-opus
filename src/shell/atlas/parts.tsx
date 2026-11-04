import { Link } from '@tanstack/react-router'
import { facets } from '@/tomes/taxonomy'
import type { TomeManifest, TomeTier } from '@/tomes/types'
import { pendingLeaves, trailOf, type AtlasNode } from './model'

export const tierLabel: Record<TomeTier, string> = {
  scroll: 'Pergamino',
  codex: 'Códice',
  grimoire: 'Grimorio',
}

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** One line saying how far a node is written. */
export function statusText(node: AtlasNode): string {
  switch (node.status) {
    case 'tome':
      return node.tomes.length === 1 ? 'Tomo escrito' : plural(node.tomes.length, 'tomo', 'tomos')
    case 'covered':
      return `En el tomo ${node.coveredBy!.title}`
    case 'path':
      return plural(node.tomeCount, 'tomo', 'tomos')
    case 'pending':
      return 'Por escribir'
    case 'group':
      return plural(pendingLeaves(node).length, 'área por escribir', 'áreas por escribir')
  }
}

const facetLabels = (tome: TomeManifest) =>
  Object.entries(tome.facets ?? {}).flatMap(([facet, values]) =>
    (values ?? []).map((v) => (facets[facet as keyof typeof facets].values as Record<string, string>)[v]),
  )

/** Breadcrumb of the ancestors of `node` (not the node itself), each a link to the index. */
export function Trail({ node, from = 0, className = '' }: { node: AtlasNode; from?: number; className?: string }) {
  const ancestors = trailOf(node).slice(from, -1)
  if (!ancestors.length) return null
  return (
    <p className={`text-xs text-muted ${className}`}>
      {ancestors.map((n, i) => (
        <span key={n.path}>
          {i > 0 && ' › '}
          <Link to="/" search={{ view: 'index', area: n.path }} className="hover:text-gold">
            {n.title}
          </Link>
        </span>
      ))}
    </p>
  )
}

/** Portrait card, the tome's own palette (used by the shelves). */
export function TomeCard({ tome }: { tome: TomeManifest }) {
  const { background, foreground, accent } = tome.palette
  const labels = facetLabels(tome)
  return (
    <Link
      to="/tomes/$tomeId"
      params={{ tomeId: tome.id }}
      className="group relative flex aspect-[3/4] w-56 flex-col justify-between overflow-hidden rounded-sm border p-5 transition duration-500 hover:-translate-y-1"
      style={{ background, color: foreground, borderColor: `${accent}55` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 80px ${accent}40` }}
      />
      <div className="flex items-center justify-between text-[0.6rem] tracking-[0.3em] uppercase opacity-75">
        <span>{tierLabel[tome.tier]}</span>
        {tome.status === 'draft' && <span style={{ color: accent }}>Borrador</span>}
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold">{tome.title}</h3>
        {tome.subtitle && <p className="mt-1 text-sm italic opacity-80">{tome.subtitle}</p>}
        <div className="my-3 h-px w-10" style={{ background: accent }} />
        <p className="text-xs leading-relaxed opacity-80">{tome.description}</p>
      </div>
      <p className="text-[0.7rem] opacity-70">{(labels.length ? labels : tome.tags).join(' · ')}</p>
    </Link>
  )
}

/** Landscape card with an explicit "open" action (index and map). */
export function TomeBanner({ tome, node }: { tome: TomeManifest; node?: AtlasNode }) {
  const { background, foreground, accent } = tome.palette
  return (
    <Link
      to="/tomes/$tomeId"
      params={{ tomeId: tome.id }}
      className="group flex flex-wrap items-center gap-6 rounded-sm border px-6 py-5 transition hover:brightness-[1.03]"
      style={{ background, color: foreground, borderColor: `${accent}55` }}
    >
      <div className="min-w-0 flex-[1_1_320px]">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase opacity-75">
          {node && <span className="tracking-normal normal-case">{trailOf(node).map((n) => n.title).join(' › ')} · </span>}
          {tierLabel[tome.tier]}
          {tome.status === 'draft' && <span style={{ color: accent }}> · Borrador</span>}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold">{tome.title}</h3>
        {tome.subtitle && <p className="text-sm italic opacity-80">{tome.subtitle}</p>}
        <p className="mt-2 text-sm leading-relaxed opacity-85">{tome.description}</p>
      </div>
      <span
        className="inline-flex h-11 shrink-0 items-center rounded px-5 text-sm font-semibold"
        style={{ background: accent, color: background }}
      >
        Abrir tomo
      </span>
    </Link>
  )
}

export function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  )
}

export function SearchTrigger({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center gap-3 rounded border border-line-strong bg-ink-raised px-4 text-left text-sm text-muted transition hover:border-gold-dim ${className}`}
    >
      <SearchIcon className="size-4 shrink-0" />
      <span className="flex-1 truncate">Busca un área, un tomo, un sistema…</span>
      <kbd className="rounded-sm border border-line-strong px-1.5 py-0.5 font-sans text-xs">Ctrl K</kbd>
    </button>
  )
}
