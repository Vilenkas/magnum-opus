/**
 * The motor nerves of the eye: which muscle each one moves (Testut t. III pp. 64–126) and what each muscle does
 * (Moore 8.ª pp. 903–905). A palsy is derived, never written by hand:
 * - at rest, the paralysed muscles stop pulling, so the eye drifts by the sum of their pulls, reversed;
 * - in each direction of gaze, the eye follows unless the muscle that alone moves it there is paralysed, and then
 *   the two eyes no longer point together: double vision.
 */

export type NerveId = 'III' | 'IV' | 'VI' | 'sympathetic'

export type MuscleId = 'rectus-lat' | 'rectus-med' | 'rectus-sup' | 'rectus-inf' | 'obliquus-sup' | 'obliquus-inf' | 'levator' | 'sphincter' | 'ciliary' | 'dilator' | 'tarsal'

/** A pull from the primary position: abduction (+) / adduction (−), elevation (+) / depression (−), intorsion (+) / extorsion (−). */
export type Pull = [abd: number, elev: number, intor: number]

export interface Muscle {
  id: MuscleId
  /** Testut's name, and today's. */
  name: string
  today: string
  nerve: NerveId
  /** Testut's branch of the nerve. */
  branch?: string
  /** Extrinsic muscles of the globe have a pull; the rest act on the lid or the pupil. */
  pull?: Pull
}

/** Main action 1, secondary actions 0.35 (Moore: the superior and inferior recti also adduct and rotate; the obliques also abduct and elevate or depress). */
const S = 0.35

export const MUSCLES: Muscle[] = [
  { id: 'rectus-lat', name: 'Recto externo', today: 'Recto lateral', nerve: 'VI', pull: [1, 0, 0] },
  { id: 'rectus-med', name: 'Recto interno', today: 'Recto medial', nerve: 'III', branch: 'rama inferior', pull: [-1, 0, 0] },
  { id: 'rectus-sup', name: 'Recto superior', today: 'Recto superior', nerve: 'III', branch: 'rama superior', pull: [-S, 1, S] },
  { id: 'rectus-inf', name: 'Recto inferior', today: 'Recto inferior', nerve: 'III', branch: 'rama inferior', pull: [-S, -1, -S] },
  { id: 'obliquus-sup', name: 'Oblicuo mayor', today: 'Oblicuo superior', nerve: 'IV', pull: [S, -S, 1] },
  { id: 'obliquus-inf', name: 'Oblicuo menor', today: 'Oblicuo inferior', nerve: 'III', branch: 'rama inferior', pull: [S, S, -1] },
  { id: 'levator', name: 'Elevador del párpado superior', today: 'Elevador del párpado superior', nerve: 'III', branch: 'rama superior' },
  { id: 'sphincter', name: 'Esfínter del iris', today: 'Esfínter de la pupila', nerve: 'III', branch: 'ganglio oftálmico' },
  { id: 'ciliary', name: 'Músculo ciliar', today: 'Músculo ciliar', nerve: 'III', branch: 'ganglio oftálmico' },
  { id: 'dilator', name: 'Dilatador del iris', today: 'Dilatador de la pupila', nerve: 'sympathetic' },
  { id: 'tarsal', name: 'Fibras lisas del elevador', today: 'Músculo tarsal superior', nerve: 'sympathetic' },
]

export const NERVES: { id: NerveId; name: string; today: string }[] = [
  { id: 'III', name: 'Motor ocular común', today: 'Nervio oculomotor' },
  { id: 'IV', name: 'Patético', today: 'Nervio troclear' },
  { id: 'VI', name: 'Motor ocular externo', today: 'Nervio abducens' },
  { id: 'sympathetic', name: 'Simpático cervical', today: 'Tronco simpático cervical' },
]

export const muscleOf = (id: MuscleId) => MUSCLES.find((m) => m.id === id)!

const paralysed = (nerve: NerveId | null) => (m: Muscle) => nerve !== null && m.nerve === nerve

/** Where the eye drifts at rest: the unopposed pull of the muscles that still work, i.e. minus what the paralysed ones gave. */
export function restingDeviation(nerve: NerveId | null): Pull {
  const d: Pull = [0, 0, 0]
  for (const m of MUSCLES.filter(paralysed(nerve))) if (m.pull) for (let i = 0; i < 3; i++) d[i] -= m.pull[i]
  return d
}

/** Directions of gaze, as [horizontal: −1 adducted … +1 abducted, vertical: −1 down … +1 up] for the eye considered. */
export type Gaze = [h: -1 | 0 | 1, v: -1 | 0 | 1]

/**
 * The muscles that alone take the eye there (Moore): abducted, the recti elevate and depress; adducted, the
 * obliques; straight up or down needs the two elevators or the two depressors together.
 */
export function moversOf([h, v]: Gaze): MuscleId[] {
  const horizontal: MuscleId[] = h > 0 ? ['rectus-lat'] : h < 0 ? ['rectus-med'] : []
  let vertical: MuscleId[] = []
  if (v > 0) vertical = h > 0 ? ['rectus-sup'] : h < 0 ? ['obliquus-inf'] : ['rectus-sup', 'obliquus-inf']
  if (v < 0) vertical = h > 0 ? ['rectus-inf'] : h < 0 ? ['obliquus-sup'] : ['rectus-inf', 'obliquus-sup']
  return [...horizontal, ...vertical]
}

/** Can the eye reach that gaze? Straight up or down still works, weakly, with one of its two muscles left. */
export function reaches(nerve: NerveId | null, gaze: Gaze): boolean {
  const movers = moversOf(gaze).map(muscleOf)
  const lost = movers.filter(paralysed(nerve))
  if (gaze[0] === 0 && gaze[1] !== 0) return lost.length < 2
  return lost.length === 0
}

/**
 * Double vision when looking somewhere, with the palsy on the right eye. The gaze is given for the person: x +1 is
 * to their right, which abducts the right eye. The left eye is healthy and always follows.
 */
export function diplopia(nerve: NerveId | null, gaze: Gaze): boolean {
  if (nerve === null || nerve === 'sympathetic') return false
  if (!reaches(nerve, gaze)) return true
  // A marked drift at rest (horizontal or vertical) keeps the eyes apart, unless the gaze goes that very way.
  const dev = restingDeviation(nerve)
  return [0, 1].some((i) => Math.abs(dev[i]) >= MARKED && gaze[i] !== Math.sign(dev[i]))
}

/** A drift at rest this large is a squint seen at a glance; the secondary pulls alone stay below it. */
export const MARKED = 0.5

export interface Signs {
  ptosis: 'none' | 'partial' | 'complete'
  pupil: 'normal' | 'dilated' | 'constricted'
  accommodation: boolean
}

/** Lid and pupil: the levator is the III's, the tarsal fibres the sympathetic's; the pupil is a balance of the two irises' muscles. */
export function signsOf(nerve: NerveId | null): Signs {
  const lost = new Set(MUSCLES.filter(paralysed(nerve)).map((m) => m.id))
  return {
    ptosis: lost.has('levator') ? 'complete' : lost.has('tarsal') ? 'partial' : 'none',
    pupil: lost.has('sphincter') ? 'dilated' : lost.has('dilator') ? 'constricted' : 'normal',
    accommodation: !lost.has('ciliary'),
  }
}
