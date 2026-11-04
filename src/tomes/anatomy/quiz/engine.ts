import { pieces, regionOf, type BonePiece, type RegionId } from '../data/skeleton'
import { weightOf, type QuizStats } from './stats'

export type QuizMode = 'identify' | 'locate' | 'type'

export interface QuizSettings {
  mode: QuizMode
  region: RegionId | 'all'
  /** Include cartilages and teeth (off by default: bones only). */
  includeNonBone: boolean
  length: number
}

export interface Question {
  targetId: string
  /** Identify mode: four piece ids (target included), shuffled. */
  options?: string[]
}

export type Rng = () => number

export function buildPool(settings: Pick<QuizSettings, 'region' | 'includeNonBone'>, all = pieces): BonePiece[] {
  return all.filter(
    (p) =>
      (settings.includeNonBone || (p.tissue ?? 'bone') === 'bone') &&
      (settings.region === 'all' || regionOf(p).id === settings.region),
  )
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Weighted sampling without replacement (Efraimidis–Spirakis). */
export function pickTargets(pool: BonePiece[], stats: QuizStats, count: number, rng: Rng): string[] {
  return pool
    .map((p) => ({ id: p.id, key: Math.pow(rng(), 1 / weightOf(stats[p.id])) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, Math.min(count, pool.length))
    .map((x) => x.id)
}

/**
 * Three plausible distractors: same group first (a lunate is confused with other
 * carpals, not with the femur), then same region, then anything. Names must differ
 * from the target's base name, except for at most one contralateral twin, which
 * tests laterality.
 */
export function makeOptions(target: BonePiece, rng: Rng, all = pieces): string[] {
  const usable = all.filter((p) => p.id !== target.id && (p.tissue ?? 'bone') === (target.tissue ?? 'bone'))
  const differentBone = usable.filter((p) => p.base !== target.base)
  const tiers = [
    differentBone.filter((p) => p.group === target.group),
    differentBone.filter((p) => p.group !== target.group && regionOf(p).id === regionOf(target).id),
    differentBone.filter((p) => regionOf(p).id !== regionOf(target).id),
  ]

  const chosen: BonePiece[] = []
  const takenBases = new Set([target.base])
  const twin = usable.find((p) => p.base === target.base && p.side && p.side !== target.side)
  if (twin && rng() < 0.3) chosen.push(twin)

  for (const tier of tiers) {
    for (const p of shuffle(tier, rng)) {
      if (chosen.length >= 3) break
      if (takenBases.has(p.base)) continue
      takenBases.add(p.base)
      chosen.push(p)
    }
  }
  return shuffle([target.id, ...chosen.map((p) => p.id)], rng)
}

export function createRound(settings: QuizSettings, stats: QuizStats, rng: Rng = Math.random): Question[] {
  const pool = buildPool(settings)
  const byId = new Map(pool.map((p) => [p.id, p]))
  return pickTargets(pool, stats, settings.length, rng).map((targetId) => ({
    targetId,
    options: settings.mode === 'identify' ? makeOptions(byId.get(targetId)!, rng) : undefined,
  }))
}
