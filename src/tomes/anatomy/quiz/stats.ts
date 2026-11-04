import { loadJSON, saveJSON } from '@/shell/storage'

export interface PieceStat {
  seen: number
  wrong: number
  /** Epoch ms of the last time it was asked. */
  last: number
}

export type QuizStats = Record<string, PieceStat>

const KEY = 'anatomy:skeleton-quiz:v1'

export const loadStats = (): QuizStats => loadJSON<QuizStats>(KEY, {})

export function recordAnswer(stats: QuizStats, id: string, correct: boolean, now = Date.now()): QuizStats {
  const prev = stats[id] ?? { seen: 0, wrong: 0, last: 0 }
  const next = { ...stats, [id]: { seen: prev.seen + 1, wrong: prev.wrong + (correct ? 0 : 1), last: now } }
  saveJSON(KEY, next)
  return next
}

/**
 * Selection weight from the Laplace-smoothed error rate, squared to sharpen the contrast:
 * never seen → 2.0, always missed → ~6, mastered → ~0.5 (rarer, but never zero).
 */
export function weightOf(stat: PieceStat | undefined): number {
  const seen = stat?.seen ?? 0
  const wrong = stat?.wrong ?? 0
  const errorRate = (wrong + 1) / (seen + 2)
  return 0.5 + 6 * errorRate * errorRate
}

/** Pieces with the worst error rate, among those asked at least twice. */
export function hardestPieces(stats: QuizStats, limit = 5): { id: string; stat: PieceStat }[] {
  return Object.entries(stats)
    .filter(([, s]) => s.seen >= 2 && s.wrong > 0)
    .sort(([, a], [, b]) => b.wrong / b.seen - a.wrong / a.seen || b.wrong - a.wrong)
    .slice(0, limit)
    .map(([id, stat]) => ({ id, stat }))
}
