import { Suspense, useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { getTome } from '@/tomes/registry'
import { SearchIcon } from './atlas/parts'
import { ChromeSlotProvider, PHONE, useHiddenOnScrollDown, useMediaQuery } from './chrome'
import { useGlobalSearch } from './GlobalSearch'
import { BOOK_PATH, Icon, SHELVES_PATH } from './icons'
import { NotFound } from './NotFound'

export function TomePage() {
  const { tomeId, _splat } = useParams({ strict: false })
  const tome = tomeId ? getTome(tomeId) : undefined

  const [slot, setSlot] = useState<HTMLElement | null>(null)

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
      <TomeChrome tomeId={manifest.id} title={manifest.title} inside={Boolean(_splat)} slotRef={setSlot} />
      <ChromeSlotProvider value={slot}>
        <Suspense fallback={<TomeLoading color={manifest.palette.accent} />}>
          <Component manifest={manifest} path={_splat ?? ''} />
        </Suspense>
      </ChromeSlotProvider>
    </div>
  )
}

/**
 * The only shell chrome drawn on top of a tome: one row with the pill (back to the Atlas, back to
 * the tome's front page when deeper inside it, the universal search) and the tome's own actions
 * (`<ChromeActions>`). On phones the pill shows only icons and the row hides while reading down.
 */
function TomeChrome({
  tomeId,
  title,
  inside,
  slotRef,
}: {
  tomeId: string
  title: string
  inside: boolean
  slotRef: (el: HTMLElement | null) => void
}) {
  const { open } = useGlobalSearch()
  const hidden = useHiddenOnScrollDown(useMediaQuery(PHONE))
  const pill = 'flex h-9 items-center gap-1.5 px-3 text-white/80 transition hover:bg-black/30 hover:text-white sm:h-8'
  return (
    <div
      className={`fixed top-3 left-3 z-50 flex items-center gap-2 transition-transform duration-300 sm:top-4 sm:left-4 ${hidden ? '-translate-y-[calc(100%+1rem)]' : ''}`}
    >
      <nav
        aria-label="Magnum Opus"
        className="flex items-stretch overflow-hidden rounded-full border border-white/15 bg-black/50 font-sans text-xs tracking-widest uppercase backdrop-blur"
      >
        <Link to="/" title="Volver al Atlas" className={pill}>
          <Icon path={SHELVES_PATH} className="size-4" />
          <span className="max-sm:sr-only">Atlas</span>
        </Link>
        {inside && (
          <>
            <span aria-hidden="true" className="w-px bg-white/15" />
            <Link to="/tomes/$tomeId" params={{ tomeId }} title={`Volver al tomo: ${title}`} className={pill}>
              <Icon path={BOOK_PATH} className="size-4" />
              <span className="max-sm:sr-only">{title}</span>
            </Link>
          </>
        )}
        <span aria-hidden="true" className="w-px bg-white/15" />
        <button type="button" onClick={open} title="Buscar (Ctrl + K)" aria-label="Buscar" className={pill}>
          <SearchIcon className="size-4" />
        </button>
      </nav>
      {/* The open tome's own actions land here. */}
      <div ref={slotRef} className="flex items-center gap-2" />
    </div>
  )
}

function TomeLoading({ color }: { color: string }) {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: color, borderTopColor: 'transparent' }} />
    </div>
  )
}
