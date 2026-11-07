import { createStatsStore, hardest, type PracticeStats } from '@/forge/practice'

export const QUIZ_STORAGE_KEY = 'geometry:quiz:stats:v1'

const store = createStatsStore(QUIZ_STORAGE_KEY)

export const loadStats = store.load
export const recordAnswer = store.record

export function getHardestQuestions(stats: PracticeStats, limit = 5) {
  return hardest(stats, limit)
}

export type { PracticeStats }
