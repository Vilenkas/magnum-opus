/**
 * The reflex centres of the spinal cord, after Dejerine's scheme in Testut t. II fig. 566 (pp. 694–696):
 * each reflex has its arc closed in a run of segments. A lesion that destroys those segments abolishes
 * it, which is how an abolished reflex locates a lesion of the cord in height. Below a transverse lesion,
 * reflexes are first lost (spinal shock), then come back and the tendinous ones are exaggerated: the cord's
 * own automatism, freed from the centres above (p. 696).
 *
 * Where a modern reference gives the level of a reflex, `today` holds it, with its source.
 */

export type Region = 'C' | 'D' | 'L' | 'S'
export interface Segment {
  id: string
  region: Region
  n: number
}

const COUNTS: Record<Region, number> = { C: 8, D: 12, L: 5, S: 5 }
/** C1 … S5, from top to bottom. Testut's D (dorsal) segments are today's T (thoracic). */
export const SEGMENTS: Segment[] = (Object.keys(COUNTS) as Region[]).flatMap((region) =>
  Array.from({ length: COUNTS[region] }, (_, i) => ({ id: `${region}${i + 1}`, region, n: i + 1 })),
)
export const segmentIndex = (id: string) => {
  const i = SEGMENTS.findIndex((s) => s.id === id)
  if (i < 0) throw new Error(`Unknown segment ${id}`)
  return i
}

/** A run of segments, inclusive: ['C5', 'C6']. */
export type Range = [string, string]
export const indices = ([a, b]: Range) => {
  const [i, j] = [segmentIndex(a), segmentIndex(b)]
  return Array.from({ length: j - i + 1 }, (_, k) => i + k)
}

export type Kind = 'cutaneous' | 'deep' | 'centre'
export interface Reflex {
  id: string
  name: string
  kind: Kind
  /** Dejerine's segments, as Testut prints them. */
  range: Range
  /** The level a modern reference gives, when it gives one. */
  today?: { range: Range; source: 'moore-8' | 'pro'; p?: string }
}

export const REFLEXES: Reflex[] = [
  // Cutaneous reflexes (left of fig. 566).
  { id: 'diaphragm', name: 'Del diafragma', kind: 'cutaneous', range: ['C3', 'C4'] },
  { id: 'scapular', name: 'Escapular', kind: 'cutaneous', range: ['C5', 'C6'] },
  { id: 'palmar', name: 'Palmar', kind: 'cutaneous', range: ['C8', 'D1'] },
  { id: 'epigastric', name: 'Epigástrico', kind: 'cutaneous', range: ['D6', 'D7'] },
  { id: 'abdominal-mid', name: 'Abdominal medio', kind: 'cutaneous', range: ['D8', 'D9'] },
  { id: 'abdominal-low', name: 'Abdominal inferior', kind: 'cutaneous', range: ['D10', 'D12'] },
  { id: 'cremasteric', name: 'Cremastérico', kind: 'cutaneous', range: ['L1', 'L2'] },
  { id: 'plantar', name: 'Plantar', kind: 'cutaneous', range: ['L5', 'S2'], today: { range: ['S2', 'S2'], source: 'pro', p: '143' } },
  { id: 'bulbocavernous', name: 'Bulbocavernoso', kind: 'cutaneous', range: ['S3', 'S3'] },
  // Tendinous and periosteal reflexes (right).
  { id: 'scm', name: 'Esternocleidomastoideo', kind: 'deep', range: ['C3', 'C4'] },
  { id: 'biceps', name: 'Bicipital', kind: 'deep', range: ['C4', 'C6'], today: { range: ['C5', 'C6'], source: 'moore-8', p: '211' } },
  { id: 'radial', name: 'Perióstico radial', kind: 'deep', range: ['C5', 'C6'] },
  { id: 'triceps', name: 'Tricipital', kind: 'deep', range: ['C6', 'C8'] },
  { id: 'ulnar', name: 'Perióstico cubital', kind: 'deep', range: ['C6', 'D1'] },
  { id: 'scapula', name: 'Del omóplato', kind: 'deep', range: ['C7', 'D1'] },
  { id: 'flexors', name: 'De los flexores', kind: 'deep', range: ['C8', 'D1'] },
  { id: 'adductors', name: 'Perióstico de los aductores', kind: 'deep', range: ['L2', 'L4'] },
  { id: 'patellar', name: 'Rotuliano', kind: 'deep', range: ['L2', 'L4'], today: { range: ['L2', 'L4'], source: 'moore-8', p: '718' } },
  { id: 'hamstrings', name: 'Perióstico del bíceps y semitendinoso', kind: 'deep', range: ['L4', 'S1'] },
  { id: 'achilles', name: 'Aquíleo', kind: 'deep', range: ['L5', 'S2'], today: { range: ['S1', 'S2'], source: 'moore-8', p: '766' } },
  // Visceral centres (bottom right).
  { id: 'erection', name: 'Centro de la erección', kind: 'centre', range: ['S2', 'S3'] },
  { id: 'ejaculation', name: 'Centro sacro de la eyaculación', kind: 'centre', range: ['S3', 'S3'] },
  { id: 'bladder', name: 'Centros rectal y vesical', kind: 'centre', range: ['S3', 'S4'] },
]

/** The cutaneous abdominal reflexes, which a pyramidal lesion abolishes (Pró p. 150). */
const ABDOMINAL = new Set(['epigastric', 'abdominal-mid', 'abdominal-low'])

export type Phase = 'shock' | 'automatism'
export type State = 'normal' | 'diminished' | 'abolished' | 'exaggerated' | 'released' | 'inverted'

/** The range a reflex is read with: Testut's, or today's where a modern reference gives one. */
export const rangeOf = (r: Reflex, today: boolean) => (today && r.today ? r.today.range : r.range)

/**
 * What a transverse lesion of the segments `lesion` does to a reflex. If the lesion takes all the
 * segments of the arc, the reflex is abolished; some of them, diminished. If the arc lies wholly below,
 * the reflex is lost during the shock, then returns: exaggerated for the tendinous ones, released (back,
 * automatic) for the others, as Testut has it. With `today`, the abdominal cutaneous reflexes below a lesion of the
 * pyramidal pathway stay abolished and the plantar one is inverted (Babinski's sign; Pró p. 150).
 * Above the lesion nothing changes.
 */
export function stateOf(r: Reflex, lesion: Range | null, phase: Phase, today = false): State {
  if (!lesion) return 'normal'
  const arc = indices(rangeOf(r, today))
  const cut = new Set(indices(lesion))
  const hit = arc.filter((i) => cut.has(i)).length
  if (hit === arc.length) return 'abolished'
  if (hit > 0) return 'diminished'
  if (Math.min(...arc) > Math.max(...cut)) {
    if (phase === 'shock') return 'abolished'
    if (r.kind === 'deep') return 'exaggerated'
    if (today && r.id === 'plantar') return 'inverted'
    if (today && ABDOMINAL.has(r.id)) return 'abolished'
    return 'released'
  }
  return 'normal'
}
