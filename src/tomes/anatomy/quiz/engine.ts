import { landmarks } from '../data/landmarks'
import { pieceById, pieces, regionById, groupById, type GroupId, type RegionId, type Side, type Tissue } from '../data/skeleton'
import { pickWeighted, shuffle, type Rng } from '@/forge/practice'
import type { QuizStats } from './stats'

export type QuizMode = 'identify' | 'locate' | 'type'

/** What is being practised: whole pieces, or the landmarks on them. */
export type Subject = 'bones' | 'landmarks'

export interface QuizSettings {
  subject: Subject
  mode: QuizMode
  region: RegionId | 'all'
  /** Include cartilages and teeth (off by default: bones only). */
  includeNonBone: boolean
  length: number
}

/** Anything the quiz can ask about: a piece, or a landmark on a piece. */
export interface QuizItem {
  id: string
  subject: Subject
  /** Display name ("Clavícula derecha", "Trocánter mayor"). */
  name: string
  /** Name without side; what typed answers are compared against. */
  base: string
  aliases: string[]
  en: string
  side?: Side
  /** The piece itself, or the piece the landmark sits on. */
  pieceId: string
  group: GroupId
  region: RegionId
  tissue: Tissue
}

const regionOfGroup = (g: GroupId) => groupById.get(g)!.region

export const boneItems: QuizItem[] = pieces.map((p) => ({
  id: p.id,
  subject: 'bones',
  name: p.name,
  base: p.base,
  aliases: p.aliases ?? [],
  en: p.en,
  side: p.side,
  pieceId: p.id,
  group: p.group,
  region: regionOfGroup(p.group),
  tissue: p.tissue ?? 'bone',
}))

export const landmarkItems: QuizItem[] = landmarks.map((l) => {
  const piece = pieceById.get(l.pieceId)!
  return {
    id: l.id,
    subject: 'landmarks',
    name: l.name,
    base: l.name,
    aliases: l.aliases,
    en: l.en,
    pieceId: l.pieceId,
    group: piece.group,
    region: regionOfGroup(piece.group),
    tissue: piece.tissue ?? 'bone',
  }
})

export const itemById = new Map([...boneItems, ...landmarkItems].map((i) => [i.id, i]))

export const itemsFor = (subject: Subject) => (subject === 'bones' ? boneItems : landmarkItems)

/** "Trocánter mayor (Fémur derecho)" for landmarks, the plain name for pieces. */
export function describeItem(item: QuizItem): string {
  return item.subject === 'landmarks' ? `${item.name} (${pieceById.get(item.pieceId)!.name})` : item.name
}

export const regionName = (id: RegionId) => regionById.get(id)!.name

export type { Rng }

export function buildPool(
  settings: Pick<QuizSettings, 'subject' | 'region' | 'includeNonBone'>,
  all: QuizItem[] = itemsFor(settings.subject),
): QuizItem[] {
  return all.filter(
    (i) =>
      (settings.includeNonBone || i.tissue === 'bone') && (settings.region === 'all' || i.region === settings.region),
  )
}

/** Weighted sampling without replacement (Efraimidis–Spirakis). */
export function pickTargets(pool: QuizItem[], stats: QuizStats, count: number, rng: Rng): string[] {
  return pickWeighted(pool, stats, count, rng)
}

/**
 * Three plausible distractors, closest first: for landmarks, others on the same bone
 * (greater trochanter vs. quadrate tubercle), then the same group, region, anything; for
 * pieces, the same group (a lunate is confused with other carpals, not the femur).
 * Names never repeat, except — for pieces — at most one contralateral twin, which tests
 * laterality.
 */
export function makeOptions(target: QuizItem, rng: Rng, all: QuizItem[] = itemsFor(target.subject)): string[] {
  const usable = all.filter((i) => i.id !== target.id && i.tissue === target.tissue)
  const differentName = usable.filter((i) => i.base !== target.base)
  const tiers = [
    ...(target.subject === 'landmarks' ? [differentName.filter((i) => i.pieceId === target.pieceId)] : []),
    differentName.filter((i) => i.pieceId !== target.pieceId && i.group === target.group),
    differentName.filter((i) => i.group !== target.group && i.region === target.region),
    differentName.filter((i) => i.region !== target.region),
  ]

  const chosen: QuizItem[] = []
  const takenNames = new Set([target.base])
  const twin =
    target.subject === 'bones' ? usable.find((i) => i.base === target.base && i.side && i.side !== target.side) : undefined
  if (twin && rng() < 0.3) chosen.push(twin)

  for (const tier of tiers) {
    for (const i of shuffle(tier, rng)) {
      if (chosen.length >= 3) break
      if (takenNames.has(i.base)) continue
      takenNames.add(i.base)
      chosen.push(i)
    }
  }
  return shuffle([target.id, ...chosen.map((i) => i.id)], rng)
}

export function createRound(settings: QuizSettings, stats: QuizStats, rng: Rng = Math.random): Question[] {
  const pool = buildPool(settings)
  return pickTargets(pool, stats, settings.length, rng).map((targetId) => ({
    targetId,
    options: settings.mode === 'identify' ? makeOptions(itemById.get(targetId)!, rng) : undefined,
  }))
}

export interface Question {
  targetId: string
  /** Identify mode: four item ids (target included), shuffled. */
  options?: string[]
}

/**
 * "Locate" for landmarks: a click counts if the landmark nearest to it (on the same piece)
 * is the target, and it isn't absurdly far — extended features (lines, surfaces) are
 * marked by a single point, so "closest landmark" is fairer than a fixed radius.
 */
export function isLandmarkHit(
  targetId: string,
  pieceId: string,
  point: [number, number, number],
  onPiece: { id: string; position: [number, number, number] }[],
  maxDistance: number,
): boolean {
  const target = itemById.get(targetId)
  if (!target || target.pieceId !== pieceId) return false
  let best: { id: string; d: number } | null = null
  for (const l of onPiece) {
    const d = Math.hypot(l.position[0] - point[0], l.position[1] - point[1], l.position[2] - point[2])
    if (!best || d < best.d) best = { id: l.id, d }
  }
  return !!best && best.id === targetId && best.d <= maxDistance
}
