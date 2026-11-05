import { useEffect } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { useGlobalSearch } from '@/shell/GlobalSearch'
import { Icon, SHELVES_PATH } from '@/shell/icons'
import { SearchTrigger } from './parts'
import { rememberView, resolveView, type AtlasSearch, type AtlasView } from './route'
import { IndexView } from './IndexView'
import { MapView } from './MapView'
import { ShelvesView } from './ShelvesView'

/**
 * Home of the app: the map of knowledge seen three ways (shelves, index, map),
 * all reading the same atlas. The universal search (Ctrl+K) lives in GlobalSearch, above every route.
 */
export function AtlasPage() {
  const search = useSearch({ strict: false }) as AtlasSearch
  const view = resolveView(search.view)
  const { atlas, open: openSearch } = useGlobalSearch()

  useEffect(() => {
    if (search.view) rememberView(search.view)
  }, [search.view])

  return (
    // The index view is an app layout on wide screens: fixed header, sidebar and content
    // scrolling on their own. Elsewhere (and on narrow screens) the page scrolls as a whole.
    <div className={`flex min-h-dvh flex-col ${view === 'index' ? 'lg:h-dvh lg:min-h-0' : ''}`}>
      <header className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
        {/* The shelves view carries the big title itself. */}
        {view === 'shelves' ? (
          <span />
        ) : (
          <Link to="/" search={{ view: 'shelves' }} className="font-display text-xl font-bold tracking-wide text-gold">
            Magnum Opus
          </Link>
        )}
        {view !== 'shelves' && <SearchTrigger onClick={openSearch} className="order-last w-full sm:order-none sm:w-auto sm:flex-[0_1_28rem]" />}
        <ViewSwitcher current={view} search={search} />
      </header>

      {view === 'shelves' && <ShelvesView atlas={atlas} onSearch={openSearch} />}
      {view === 'index' && <IndexView atlas={atlas} area={search.area} system={search.system} />}
      {view === 'map' && <MapView atlas={atlas} />}
    </div>
  )
}

const views: { id: AtlasView; label: string; icon: string }[] = [
  // Book spines on a shelf.
  { id: 'shelves', label: 'Estantes', icon: SHELVES_PATH },
  // A tree outline.
  { id: 'index', label: 'Índice', icon: 'M4 5h6M8 12h6M8 19h6M6 5v14M6 12h2M6 19h2M14 5h6' },
  // Nodes and links.
  { id: 'map', label: 'Mapa', icon: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 5l5.5 5.5M19 5l-5.5 5.5M12 14v6M5 5h.01M19 5h.01M12 20h.01' },
]

function ViewSwitcher({ current, search }: { current: AtlasView; search: AtlasSearch }) {
  return (
    <nav aria-label="Vista del Atlas" className="flex rounded border border-line-strong p-0.5">
      {views.map(({ id, label, icon }) => (
        <Link
          key={id}
          to="/"
          search={{ ...search, view: id }}
          aria-current={id === current ? 'page' : undefined}
          className={`flex h-10 items-center gap-2 rounded-sm px-3 text-sm transition ${
            id === current ? 'bg-gold text-ink' : 'text-muted hover:text-parchment'
          }`}
        >
          <Icon path={icon} className="size-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
