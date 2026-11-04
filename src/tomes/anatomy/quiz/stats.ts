import { createStatsStore, hardest, weightOf, type ItemStat, type PracticeStats } from '@/forge/practice'

export type PieceStat = ItemStat
export type QuizStats = PracticeStats

const store = createStatsStore('anatomy:skeleton-quiz:v1')

export const loadStats = store.load
export const recordAnswer = store.record
export { weightOf }
export const hardestPieces = hardest
