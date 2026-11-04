import { Link } from '@tanstack/react-router'
import { listTomes } from '@/tomes/registry'
import type { TomeManifest, TomeTier } from '@/tomes/types'

const tierLabel: Record<TomeTier, string> = {
  scroll: 'Pergamino',
  codex: 'Códice',
  grimoire: 'Grimorio',
}

export function AtlasPage() {
  const tomes = listTomes()

  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-4 py-16 sm:px-8">
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.4em] text-gold-dim uppercase">Enciclopedia personal</p>
        <h1 className="font-display text-5xl font-bold tracking-wide text-gold sm:text-7xl">
          Magnum Opus
        </h1>
        <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold-dim to-transparent" />
        <p className="mt-6 text-muted">
          {tomes.length} {tomes.length === 1 ? 'tomo' : 'tomos'} en la biblioteca
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tomes.map((tome) => (
          <li key={tome.id}>
            <TomeCard tome={tome} />
          </li>
        ))}
      </ul>
    </main>
  )
}

function TomeCard({ tome }: { tome: TomeManifest }) {
  const { background, foreground, accent } = tome.palette
  return (
    <Link
      to="/tomes/$tomeId"
      params={{ tomeId: tome.id }}
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-sm border p-6 transition duration-500 hover:-translate-y-1"
      style={{ background, color: foreground, borderColor: `${accent}55` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 80px ${accent}40` }}
      />
      <div className="flex items-center justify-between text-[0.65rem] tracking-[0.3em] uppercase opacity-70">
        <span>{tierLabel[tome.tier]}</span>
        {tome.status === 'draft' && <span style={{ color: accent }}>Borrador</span>}
      </div>
      <div>
        <h2 className="font-display text-3xl font-bold">{tome.title}</h2>
        {tome.subtitle && <p className="mt-1 text-sm italic opacity-80">{tome.subtitle}</p>}
        <div className="my-4 h-px w-12" style={{ background: accent }} />
        <p className="text-sm leading-relaxed opacity-80">{tome.description}</p>
      </div>
      <ul className="flex flex-wrap gap-2 text-[0.7rem] opacity-60">
        {tome.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    </Link>
  )
}
