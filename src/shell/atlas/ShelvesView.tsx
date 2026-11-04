import { Link } from '@tanstack/react-router'
import { pendingLeaves, tomesWithin, type Atlas, type AtlasNode } from './model'
import { plural, SearchTrigger, TomeCard, Trail } from './parts'

/** Spines shown per shelf before collapsing the rest into "+N". */
const SPINES = 6

/** One shelf per domain that has tomes; unwritten areas stand beside them as empty spines. */
export function ShelvesView({ atlas, onSearch }: { atlas: Atlas; onSearch: () => void }) {
  const shelves = atlas.roots.filter((r) => r.tomeCount > 0)
  const empty = atlas.roots.filter((r) => r.tomeCount === 0)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pt-10 pb-16 sm:px-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-xs tracking-[0.4em] text-muted uppercase">Enciclopedia personal</p>
        <h1 className="font-display text-5xl font-bold tracking-wide text-gold sm:text-7xl">Magnum Opus</h1>
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-gold-dim to-transparent" />
        <p className="text-muted">{plural(atlas.tomes.length, 'tomo', 'tomos')} en la biblioteca</p>
        <SearchTrigger onClick={onSearch} className="w-full max-w-xl" />
      </div>

      {shelves.map((domain) => (
        <Shelf key={domain.path} atlas={atlas} domain={domain} />
      ))}

      {empty.length > 0 && (
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-line pt-5 text-sm text-muted">
          <span>Dominios aún sin tomos:</span>
          {empty.map((d) => (
            <Link key={d.path} to="/" search={{ view: 'index', area: d.path }} className="text-gold hover:text-parchment">
              {d.title}
            </Link>
          ))}
        </p>
      )}
    </main>
  )
}

function Shelf({ atlas, domain }: { atlas: Atlas; domain: AtlasNode }) {
  const tomes = tomesWithin(domain)
  const pending = pendingLeaves(domain)
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <h2 className="font-display text-2xl text-gold">
          <Link to="/" search={{ view: 'index', area: domain.path }} className="hover:text-parchment">
            {domain.title}
          </Link>
        </h2>
        <p className="text-sm text-muted">
          {plural(tomes.length, 'tomo', 'tomos')} · {plural(pending.length, 'área por escribir', 'áreas por escribir')}
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {tomes.map((tome) => (
          <div key={tome.id} className="mr-3 flex flex-col gap-2">
            <ShelfTrail home={atlas.homeOf.get(tome.id)!} />
            <TomeCard tome={tome} />
          </div>
        ))}
        {pending.length > 0 && (
          <ul aria-label="Áreas por escribir" className="flex flex-wrap items-end gap-1.5">
            {pending.slice(0, SPINES).map((node) => (
              <li key={node.path}>
                <Spine node={node} />
              </li>
            ))}
            {pending.length > SPINES && (
              <li>
                <Link
                  to="/"
                  search={{ view: 'index', area: domain.path }}
                  className="flex h-60 w-16 items-center justify-center rounded-sm border border-line bg-ink-raised text-sm text-gold transition hover:border-gold-dim"
                  title="Ver todas en el índice"
                >
                  +{pending.length - SPINES}
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Where the tome sits inside its domain (the domain itself is the shelf title). */
function ShelfTrail({ home }: { home: AtlasNode }) {
  if (home.depth === 1) return <p className="text-xs text-muted">&nbsp;</p>
  return (
    <div className="flex gap-1 text-xs text-muted">
      <Trail node={home} from={1} />
      {home.depth > 2 && <span>›</span>}
      <span>{home.title}</span>
    </div>
  )
}

/** Deterministic height so the shelf looks hand-stacked but never reshuffles. */
const spineHeight = (id: string) => 224 + ([...id].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 5) * 12

function Spine({ node }: { node: AtlasNode }) {
  return (
    <Link
      to="/"
      search={{ view: 'index', area: node.path }}
      title={`${node.title} · por escribir`}
      className="flex w-10 items-center justify-center rounded-sm border border-dashed border-line-strong text-muted transition hover:border-gold-dim hover:text-parchment"
      style={{ height: spineHeight(node.id) }}
    >
      <span className="rotate-180 font-display text-[0.8rem] tracking-wider [writing-mode:vertical-rl]">{node.title}</span>
    </Link>
  )
}
