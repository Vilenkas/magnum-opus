/**
 * Practice engine shared by every tome: per-item stats persisted locally, and a weighted
 * pick that brings back what you keep getting wrong.
 */
import { loadJSON, saveJSON } from '@/shell/storage'

export interface ItemStat {
  seen: number
  wrong: number
  /** Epoch ms of the last time it was asked. */
  last: number
}

export type PracticeStats = Record<string, ItemStat>

export type Rng = () => number

/** A persisted stats store under its own key (e.g. "anatomy:skeleton-quiz:v1"). */
export function createStatsStore(key: string) {
  return {
    load: (): PracticeStats => loadJSON<PracticeStats>(key, {}),
    record(stats: PracticeStats, id: string, correct: boolean, now = Date.now()): PracticeStats {
      const prev = stats[id] ?? { seen: 0, wrong: 0, last: 0 }
      const next = { ...stats, [id]: { seen: prev.seen + 1, wrong: prev.wrong + (correct ? 0 : 1), last: now } }
      saveJSON(key, next)
      return next
    },
  }
}

/**
 * Selection weight from the Laplace-smoothed error rate, squared to sharpen the contrast:
 * never seen → 2.0, always missed → ~6, mastered → ~0.5 (rarer, but never zero).
 */
export function weightOf(stat: ItemStat | undefined): number {
  const seen = stat?.seen ?? 0
  const wrong = stat?.wrong ?? 0
  const errorRate = (wrong + 1) / (seen + 2)
  return 0.5 + 6 * errorRate * errorRate
}

/** Weighted sampling without replacement (Efraimidis–Spirakis). */
export function pickWeighted<T extends { id: string }>(
  pool: T[],
  stats: PracticeStats,
  count: number,
  rng: Rng,
  weight: (item: T) => number = (item) => weightOf(stats[item.id]),
): string[] {
  return pool
    .map((p) => ({ id: p.id, key: Math.pow(rng(), 1 / weight(p)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, Math.min(count, pool.length))
    .map((x) => x.id)
}

/** Items with the worst error rate, among those asked at least twice. */
export function hardest(stats: PracticeStats, limit = 5): { id: string; stat: ItemStat }[] {
  return Object.entries(stats)
    .filter(([, s]) => s.seen >= 2 && s.wrong > 0)
    .sort(([, a], [, b]) => b.wrong / b.seen - a.wrong / a.seen || b.wrong - a.wrong)
    .slice(0, limit)
    .map(([id, stat]) => ({ id, stat }))
}

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Deterministic RNG (mulberry32), for tests and reproducible rounds. */
export function seededRng(seed: number): Rng {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
