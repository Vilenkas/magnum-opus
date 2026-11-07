/**
 * The internal capsule in a horizontal section (Flechsig's cut; Testut t. II pp. 1088–1104, figs.
 * 870, 911 and 920): the white lamina between the caudate nucleus and the thalamus, inside, and the
 * lenticular nucleus, outside, folded into an angle open laterally. Its segments are the anterior
 * limb, the genu, the posterior limb, the retrolenticular segment and, below the plane, the
 * sublenticular one. Each carries its own fibres; a lesion of each takes away its own functions.
 *
 * Left hemisphere, anterior at the top, midline on the right; a 420 × 420 viewBox.
 */

export type Pt = [number, number]

export interface Nucleus {
  id: 'caudate' | 'lenticular' | 'thalamus'
  name: string
  shape: Pt[]
}

export const nuclei: Nucleus[] = [
  { id: 'caudate', name: 'Cabeza del núcleo caudado', shape: [[180, 72], [240, 48], [320, 46], [370, 88], [374, 148], [306, 170], [294, 168]] },
  { id: 'lenticular', name: 'Núcleo lenticular', shape: [[262, 192], [154, 100], [128, 150], [128, 240], [164, 292]] },
  { id: 'thalamus', name: 'Tálamo óptico', shape: [[300, 190], [360, 190], [396, 240], [392, 330], [340, 372], [252, 362], [202, 318], [292, 214]] },
]

export type SegmentId = 'anterior' | 'genu' | 'posterior' | 'retrolenticular' | 'sublenticular'

export interface Fibres {
  name: string
  /** Where they go or come from. */
  course: string
  kind: 'motor' | 'sensory' | 'sensorial' | 'association'
}

export interface Segment {
  id: SegmentId
  name: string
  /** Testut's other name for it. */
  alias?: string
  /** Between which nuclei it runs. */
  between: [Nucleus['id'], Nucleus['id']] | null
  /** Drawn in the horizontal section; the sublenticular segment lies below it. */
  shape: Pt[] | null
  fibres: Fibres[]
  lesion: string
}

export const segments: Segment[] = [
  {
    id: 'anterior',
    name: 'Brazo anterior',
    alias: 'segmento lenticulocaudado',
    between: ['caudate', 'lenticular'],
    shape: [[156, 96], [178, 76], [292, 170], [264, 190]],
    fibres: [
      { name: 'Pedúnculo anterior del tálamo', course: 'del lóbulo frontal y del opérculo rolándico al tálamo', kind: 'association' },
      { name: 'Fibras lenticulocaudadas', course: 'del núcleo caudado al lenticular, cruzando la cápsula', kind: 'association' },
    ],
    lesion: 'Sus fibras van del lóbulo frontal al tálamo y de un núcleo estriado a otro: no lleva fibras motoras ni sensitivas directas, y su lesión no produce parálisis.',
  },
  {
    id: 'genu',
    name: 'Rodilla',
    between: ['caudate', 'thalamus'],
    shape: [[264, 190], [292, 170], [300, 188], [292, 212]],
    fibres: [{ name: 'Fascículo geniculado', course: 'de la parte inferior de la frontal ascendente a los núcleos motores de los nervios craneales', kind: 'motor' }],
    lesion: 'Paraliza los músculos de la cara y de la lengua del lado opuesto: el fascículo geniculado lleva las órdenes de la cabeza.',
  },
  {
    id: 'posterior',
    name: 'Brazo posterior',
    alias: 'segmento lenticuloóptico',
    between: ['thalamus', 'lenticular'],
    shape: [[264, 194], [292, 214], [202, 318], [168, 294]],
    fibres: [
      { name: 'Vía piramidal', course: 'de la frontal ascendente a la médula, con el miembro superior delante del inferior', kind: 'motor' },
      { name: 'Pedúnculo superior del tálamo', course: 'del tálamo a la corteza parietal: la última neurona de la vía sensitiva', kind: 'sensory' },
    ],
    lesion: 'Es la hemiplejía capsular: parálisis de la mitad opuesta del cuerpo, miembro superior e inferior, sin movimientos coreicos ni atetósicos, a menudo con trastornos de la sensibilidad por las fibras talamocorticales que pasan junto a las motoras.',
  },
  {
    id: 'retrolenticular',
    name: 'Segmento retrolenticular',
    between: ['thalamus', 'lenticular'],
    shape: [[168, 296], [200, 320], [250, 364], [226, 386], [150, 326]],
    fibres: [{ name: 'Radiaciones ópticas de Gratiolet', course: 'del cuerpo geniculado externo y el pulvinar a la corteza calcarina', kind: 'sensorial' }],
    lesion: 'Corta la vía visual central: suprime la mitad del campo visual del lado opuesto en los dos ojos, una hemianopsia homónima lateral. Antiguamente se la tenía por una «encrucijada sensitiva» cuya lesión daba una hemianestesia total.',
  },
  {
    id: 'sublenticular',
    name: 'Segmento sublenticular',
    between: null,
    shape: null,
    fibres: [
      { name: 'Fascículo de Türck', course: 'de la corteza temporal al quinto externo del pie del pedúnculo y a los núcleos del puente', kind: 'motor' },
      { name: 'Fascículo temporotalámico de Arnold', course: 'del lóbulo temporal al pulvinar y al cuerpo geniculado', kind: 'association' },
      { name: 'Radiaciones auditivas', course: 'del cuerpo geniculado interno a la primera temporal', kind: 'sensorial' },
    ],
    lesion: 'Por debajo del núcleo lenticular, fuera de este corte. Lleva las fibras temporales del pie del pedúnculo y, según se admite, las de la vía auditiva central.',
  },
]

/** Somatotopy of the motor fibres, front to back: head in the genu, then upper and lower limb. */
export const somatotopy = [
  { part: 'Cabeza', segment: 'genu' as SegmentId, at: 0 },
  { part: 'Miembro superior', segment: 'posterior' as SegmentId, at: 0.35 },
  { part: 'Miembro inferior', segment: 'posterior' as SegmentId, at: 0.75 },
]

/** A point along the posterior limb, from the genu (0) to its end (1): middle of the band. */
export function alongPosterior(t: number): Pt {
  const [a, b, c, d] = segments.find((s) => s.id === 'posterior')!.shape!
  const start: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const end: Pt = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2]
  return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t]
}

export function centroid(pts: Pt[]): Pt {
  const n = pts.length
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
}

export function inside([x, y]: Pt, poly: Pt[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
