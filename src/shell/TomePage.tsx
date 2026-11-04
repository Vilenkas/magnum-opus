import { Suspense, useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { getTome } from '@/tomes/registry'
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
      <BackToAtlas />
      <Suspense fallback={<TomeLoading color={manifest.palette.accent} />}>
        <Component manifest={manifest} path={_splat ?? ''} />
      </Suspense>
    </div>
  )
}

/** The only piece of shell chrome drawn on top of a tome. */
function BackToAtlas() {
  return (
    <Link
      to="/"
      title="Volver al Atlas"
      className="fixed top-4 left-4 z-50 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-sans text-xs tracking-widest text-white/80 uppercase backdrop-blur transition hover:bg-black/70 hover:text-white"
    >
      ← Atlas
    </Link>
  )
}

function TomeLoading({ color }: { color: string }) {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: color, borderTopColor: 'transparent' }} />
    </div>
  )
}
