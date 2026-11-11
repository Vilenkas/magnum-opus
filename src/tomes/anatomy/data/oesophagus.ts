/**
 * The oesophagus as a tube of varying calibre, measured from the dental arches (Testut t. IV pp. 150–173; Moore 8
 * p. 450).
 *
 * Distended, the oesophagus is a badly calibrated cylinder: three narrowings (cricoid, aortobronchial and diaphragmatic,
 * after Testut and Pellanda's injections) separate two spindles and a funnel, whose widths Testut gives in mm. The
 * distances from the incisors at which an endoscope meets them are Moore's; the aortobronchial narrowing is his two
 * impressions, the aortic arch and the left bronchus. Width is a function of the distance, and a swallowed body of a
 * given diameter stops at the first point narrower than itself.
 */

export type Part = 'cervical' | 'thoracic' | 'diaphragmatic' | 'abdominal'

export interface Narrowing {
  id: 'cricoid' | 'aortic' | 'bronchial' | 'diaphragmatic'
  name: string
  /** Centre, cm from the incisors. */
  at: number
  /** Length, cm. */
  length: number
  /** Width at its narrowest, mm (Testut's range and the value drawn). */
  range: [number, number]
  width: number
  /** What makes it. */
  cause: string
}

/** Width of the dilated segments between the narrowings, mm (Testut: 19 to 22). */
export const DILATED: [number, number] = [19, 22]
export const BASE = 21

export const NARROWINGS: Narrowing[] = [
  {
    id: 'cricoid',
    name: 'Estrechamiento cricoideo',
    at: 15.6,
    length: 1.3,
    range: [14, 16],
    width: 15,
    cause: 'el anillo de las fibras cricoideas del constrictor inferior, la boca del esófago de Killian (hoy, esfínter esofágico superior)',
  },
  {
    id: 'aortic',
    name: 'Estrechamiento aórtico',
    at: 22.5,
    length: 2,
    range: [15, 17],
    width: 16.5,
    cause: 'el cayado de la aorta, que cruza su lado izquierdo',
  },
  {
    id: 'bronchial',
    name: 'Estrechamiento bronquial',
    at: 27.5,
    length: 2,
    range: [15, 17],
    width: 17,
    cause: 'el bronquio principal izquierdo, que cruza su cara anterior',
  },
  {
    id: 'diaphragmatic',
    name: 'Estrechamiento diafragmático',
    at: 38.2,
    length: 1.3,
    range: [16, 19],
    width: 17.5,
    cause: 'el anillo muscular del hiato esofágico del diafragma, un verdadero esfínter',
  },
]

/** The oesophagus begins at the cricoid narrowing and ends at the cardia, cm from the incisors. */
export const START = 15
export const CARDIA = 40.5

export interface Landmark {
  at: number
  text: string
  /** Vertebral level. */
  level: string
}

export const LANDMARKS: Landmark[] = [
  { at: START, text: 'Borde inferior del cartílago cricoides: la faringe se continúa con el esófago', level: 'C6' },
  { at: 21, text: 'Horquilla esternal: termina la porción cervical (unos 6 cm) y empieza la torácica', level: 'D2' },
  { at: 22.5, text: 'Cayado de la aorta, a la izquierda', level: 'D4' },
  { at: 27.5, text: 'Bronquio principal izquierdo, por delante; debajo, la cara posterior del pericardio y la aurícula izquierda', level: 'D5' },
  { at: 38.2, text: 'Hiato esofágico del diafragma', level: 'D10' },
  { at: CARDIA, text: 'Cardias, a la izquierda de la columna', level: 'D11' },
]

export function partAt(d: number): Part | null {
  if (d < START || d > CARDIA) return null
  if (d < 21) return 'cervical'
  const hiatus = NARROWINGS.find((n) => n.id === 'diaphragmatic')!
  if (d < hiatus.at - hiatus.length / 2) return 'thoracic'
  if (d <= hiatus.at + hiatus.length / 2) return 'diaphragmatic'
  return 'abdominal'
}

export const PART_NAME: Record<Part, string> = {
  cervical: 'porción cervical',
  thoracic: 'porción torácica',
  diaphragmatic: 'porción diafragmática',
  abdominal: 'porción abdominal',
}

/** Distended width at a distance from the incisors, mm: the base minus a smooth dip at each narrowing. */
export function widthAt(d: number): number {
  let w = BASE
  for (const n of NARROWINGS) {
    const x = (d - n.at) / (n.length / 2)
    if (Math.abs(x) < 1) w = Math.min(w, BASE - (BASE - n.width) * (0.5 + 0.5 * Math.cos(Math.PI * x)))
  }
  // Below the hiatus the tube opens into the funnel of the cardia.
  if (d > 39) w += ((d - 39) / (CARDIA - 39)) * 6
  return w
}

/** Where a swallowed round body of a diameter (mm) stops, cm from the incisors; null if it reaches the stomach. */
export function stopsAt(diameter: number, step = 0.05): { at: number; narrowing?: Narrowing } | null {
  for (let d = START; d <= CARDIA; d += step) {
    if (widthAt(d) < diameter) {
      const narrowing = NARROWINGS.find((n) => Math.abs(d - n.at) <= n.length / 2)
      return { at: d, narrowing }
    }
  }
  return null
}

export const narrowingAt = (d: number) => NARROWINGS.find((n) => Math.abs(d - n.at) <= n.length / 2)

export const landmarkNear = (d: number) => LANDMARKS.reduce((a, b) => (Math.abs(b.at - d) < Math.abs(a.at - d) ? b : a))
