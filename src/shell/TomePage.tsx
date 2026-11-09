import { Suspense, useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { getTome } from '@/tomes/registry'
import { SearchIcon } from './atlas/parts'
import { useGlobalSearch } from './GlobalSearch'
import { BOOK_PATH, Icon, SHELVES_PATH } from './icons'
import { NotFound } from './NotFound'

export function TomePage() {
  const { tomeId, _splat } = useParams({ strict: false })
  const tome = tomeId ? getTome(tomeId) : undefined

  useEffect(() => {
    if (tome) document.title = `${tome.manifest.title} · Magnum Opus`
    return () => {
      document.title = 'Magnum Opus'
    }
  }, [tome])

  if (!tome) return <NotFound />

  const { manifest, Component } = tome
  return (
    // data-tome lets a tome scope global styles to itself if it needs to.
    <div data-tome={manifest.id} style={{ background: manifest.palette.background, minHeight: '100dvh' }}>
      <TomeChrome tomeId={manifest.id} title={manifest.title} inside={Boolean(_splat)} />
      <Suspense fallback={<TomeLoading color={manifest.palette.accent} />}>
        <Component manifest={manifest} path={_splat ?? ''} />
      </Suspense>
    </div>
  )
}

/**
 * The only shell chrome drawn on top of a tome: back to the Atlas, back to the tome's own
 * front page when deeper inside it (a book, an exam…), and the universal search.
 */
function TomeChrome({ tomeId, title, inside }: { tomeId: string; title: string; inside: boolean }) {
  const { open } = useGlobalSearch()
  const pill = 'flex h-8 items-center gap-1.5 px-3 text-white/80 transition hover:bg-black/30 hover:text-white'
  return (
    <nav
      aria-label="Magnum Opus"
      className="fixed top-4 left-4 z-50 flex items-stretch overflow-hidden rounded-full border border-white/15 bg-black/50 font-sans text-xs tracking-widest uppercase backdrop-blur"
    >
      <Link to="/" title="Volver al Atlas" className={pill}>
        <Icon path={SHELVES_PATH} className="size-4" />
        <span>Atlas</span>
      </Link>
      {inside && (
        <>
          <span aria-hidden="true" className="w-px bg-white/15" />
          <Link to="/tomes/$tomeId" params={{ tomeId }} title={`Volver al tomo: ${title}`} className={pill}>
            <Icon path={BOOK_PATH} className="size-4" />
            <span>{title}</span>
          </Link>
        </>
      )}
      <span aria-hidden="true" className="w-px bg-white/15" />
      <button type="button" onClick={open} title="Buscar (Ctrl + K)" aria-label="Buscar" className={pill}>
        <SearchIcon className="size-4" />
      </button>
    </nav>
  )
}

function TomeLoading({ color }: { color: string }) {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: color, borderTopColor: 'transparent' }} />
    </div>
  )
}
