/**
 * How a long bone is built (Testut t. I pp. 28–40, fig. 21): the cartilage model, the periosteal collar,
 * the primary centre, the medullary cavity, the epiphyseal centres, the two growth cartilages and their
 * fusion. Time `t` runs from 0 (cartilage model) to 1 (adult).
 *
 * The two ends grow unequally. Everything else follows from that: the nutrient foramen, fixed in the
 * diaphysis, seems to move and its canal leans towards the end that grows less (towards the elbow, away
 * from the knee); that end's cartilage is exhausted and fuses first (Bérard); and nails driven into the
 * diaphysis keep their distance while those in the epiphyses move away (Duhamel, Hunter).
 *
 * Lengths are in arbitrary units along the bone, 0 at the nutrient foramen, negative towards the proximal end.
 */

export type BoneId = 'humerus' | 'radius' | 'femur' | 'tibia'
export type End = 'proximal' | 'distal'

export interface Bone {
  id: BoneId
  name: string
  limb: 'upper' | 'lower'
  /** The end whose growth cartilage works most: away from the elbow, towards the knee. */
  fertile: End
}

export const BONES: Bone[] = [
  { id: 'humerus', name: 'Húmero', limb: 'upper', fertile: 'proximal' },
  { id: 'radius', name: 'Radio', limb: 'upper', fertile: 'distal' },
  { id: 'femur', name: 'Fémur', limb: 'lower', fertile: 'distal' },
  { id: 'tibia', name: 'Tibia', limb: 'lower', fertile: 'proximal' },
]

/** Events of the building, as fractions of the whole time (the order of fig. 21, A to G, then the adult). */
export const EVENTS = {
  /** B: a thin ring of periosteal bone round the middle of the diaphysis. */
  collar: 0.08,
  /** C: the primary (diaphyseal) centre in the cartilage. */
  primary: 0.16,
  /** E: the medullary cavity hollowed out by resorption. */
  cavity: 0.3,
  /** Growth in length by the growth cartilages starts once the diaphysis is bone. */
  growth: 0.22,
  /** The epiphyseal centre of the fertile end appears first; the other one after it. */
  fertileCentre: 0.42,
  otherCentre: 0.55,
  /** The cartilage of the other end is exhausted first (Bérard); the fertile one last. */
  otherFusion: 0.84,
  fertileFusion: 0.94,
}

/** The stages Testut letters in fig. 21, by the time they start, plus the adult. */
export const STAGES: { letter: string; t: number; text: string }[] = [
  { letter: 'A', t: 0, text: 'Esbozo cartilaginoso: el futuro hueso es una maqueta de cartílago hialino, rodeada de su pericondrio.' },
  { letter: 'B', t: EVENTS.collar, text: 'Alrededor de la parte media de la diáfisis aparece una laminilla ósea: el primer hueso es perióstico, un manguito.' },
  { letter: 'C', t: EVENTS.primary, text: 'En el centro de la diáfisis, en pleno cartílago, aparece el punto de osificación primitivo, que formará el hueso encondral.' },
  { letter: 'D', t: EVENTS.growth, text: 'Hueso perióstico y encondral avanzan hacia los extremos; el encondral tiene forma de reloj de arena. Empieza el crecimiento en longitud.' },
  { letter: 'E', t: EVENTS.cavity, text: 'La resorción excava en el centro la cavidad medular, que se llena de médula ósea.' },
  { letter: 'F', t: EVENTS.fertileCentre, text: 'Aparecen los puntos epifisarios, primero en el extremo fértil. Entre la epífisis y la diáfisis queda el cartílago de conjunción.' },
  { letter: 'G', t: EVENTS.otherCentre, text: 'Los dos cartílagos de conjunción alargan el hueso; la cavidad medular crece con él. Sólo el cartílago articular quedará como cartílago.' },
  { letter: 'Adulto', t: EVENTS.fertileFusion, text: 'Los cartílagos de conjunción se han osificado, primero el del extremo menos fértil: queda una línea epifisaria y el crecimiento ha terminado.' },
]

export const stageAt = (t: number) => [...STAGES].reverse().find((s) => t >= s.t)!

/** Half-lengths of the cartilage model on each side of the foramen. */
const MODEL = 3
/** How much each cartilage adds in the whole growth period: the fertile end about twice the other. */
const GROWTH: Record<'fertile' | 'other', number> = { fertile: 8, other: 4 }

const isFertile = (bone: Bone, end: End) => bone.fertile === end
const fusionOf = (bone: Bone, end: End) => (isFertile(bone, end) ? EVENTS.fertileFusion : EVENTS.otherFusion)
const centreOf = (bone: Bone, end: End) => (isFertile(bone, end) ? EVENTS.fertileCentre : EVENTS.otherCentre)

/** How much one growth cartilage has added by time t: linear while open, nothing after fusion. */
export function grown(bone: Bone, end: End, t: number) {
  const [a, b] = [EVENTS.growth, fusionOf(bone, end)]
  const share = Math.min(Math.max((t - a) / (b - a), 0), 1)
  return share * GROWTH[isFertile(bone, end) ? 'fertile' : 'other']
}

/** Distance from the foramen to one end of the bone. */
export const reach = (bone: Bone, end: End, t: number) => MODEL + grown(bone, end, t)
export const length = (bone: Bone, t: number) => reach(bone, 'proximal', t) + reach(bone, 'distal', t)

export const hasCentre = (bone: Bone, end: End, t: number) => t >= centreOf(bone, end)
export const isFused = (bone: Bone, end: End, t: number) => t >= fusionOf(bone, end)

/**
 * Where the nutrient canal points, from its opening inwards: towards the end that grows less. Its slant
 * grows with the inequality of growth so far (0 before any growth).
 */
export function canal(bone: Bone, t: number): { towards: End; slant: number } {
  const p = grown(bone, 'proximal', t)
  const d = grown(bone, 'distal', t)
  return { towards: p > d ? 'distal' : 'proximal', slant: Math.abs(p - d) / (p + d || 1) }
}

/** The end closer to the elbow or the knee. */
export const jointEnd = (bone: Bone): End => (bone.id === 'humerus' || bone.id === 'femur' ? 'distal' : 'proximal')

/**
 * Duhamel's and Hunter's nails, driven into a young bone at time `from`: two in the diaphysis, one in each
 * epiphysis (or at the end of the cartilage if the epiphysis has no centre yet). Their positions at time t.
 */
export function nails(bone: Bone, from: number, t: number) {
  const atEnd = (end: End) => {
    const sign = end === 'proximal' ? -1 : 1
    // A nail in the epiphysis rides with it: it moves away by what the cartilage adds after `from`.
    return sign * (reach(bone, end, from) - 0.6 + (grown(bone, end, Math.max(t, from)) - grown(bone, end, from)))
  }
  return { proximalEpiphysis: atEnd('proximal'), upperShaft: -1.2, lowerShaft: 1.2, distalEpiphysis: atEnd('distal') }
}
