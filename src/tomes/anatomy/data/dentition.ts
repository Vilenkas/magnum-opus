/**
 * The two dentitions (Testut t. IV pp. 51, 72–73, 91–93; Moore 8 p. 940, tablas 8-13 A y B).
 *
 * Each half-jaw has eight places, from the midline back: two incisors, the canine, two premolars and three
 * molars. The milk teeth (incisors, canine and two milk molars) take the first five; the premolars replace the
 * milk molars, and the three permanent molars are new teeth behind them (Testut: twenty teeth of replacement,
 * twelve new ones).
 *
 * Ages are in years. A range is when the tooth comes out (or falls): the plate draws it emerging, or loosening,
 * across the range. Testut gives the milk teeth's eruption by jaw (the lower before the upper) and the permanent
 * teeth's for both jaws together; Moore, both without distinguishing the jaws.
 */

export type Jaw = 'upper' | 'lower'
export type Scheme = 'testut' | 'today'
export type Dentition = 'primary' | 'permanent'

/** The eight places of a half-jaw, from the midline back. */
export type Place = 'I1' | 'I2' | 'C' | 'PM1' | 'PM2' | 'M1' | 'M2' | 'M3'
export const PLACES: Place[] = ['I1', 'I2', 'C', 'PM1', 'PM2', 'M1', 'M2', 'M3']

export interface Range {
  from: number
  to: number
}

export interface Tooth {
  place: Place
  dentition: Dentition
  name: string
  /** Mesiodistal width of the crown, mm (upper jaw), to draw it. */
  width: number
  kind: 'incisor' | 'canine' | 'premolar' | 'molar'
}

export const PRIMARY: Tooth[] = [
  {
    place: 'I1',
    dentition: 'primary',
    name: 'Incisivo medio temporal',
    width: 6.5,
    kind: 'incisor',
  },
  {
    place: 'I2',
    dentition: 'primary',
    name: 'Incisivo lateral temporal',
    width: 5.2,
    kind: 'incisor',
  },
  {
    place: 'C',
    dentition: 'primary',
    name: 'Canino temporal',
    width: 7,
    kind: 'canine',
  },
  {
    place: 'PM1',
    dentition: 'primary',
    name: 'Primer molar temporal',
    width: 7.3,
    kind: 'molar',
  },
  {
    place: 'PM2',
    dentition: 'primary',
    name: 'Segundo molar temporal',
    width: 8.8,
    kind: 'molar',
  },
]

export const PERMANENT: Tooth[] = [
  {
    place: 'I1',
    dentition: 'permanent',
    name: 'Incisivo medio',
    width: 8.5,
    kind: 'incisor',
  },
  {
    place: 'I2',
    dentition: 'permanent',
    name: 'Incisivo lateral',
    width: 6.5,
    kind: 'incisor',
  },
  {
    place: 'C',
    dentition: 'permanent',
    name: 'Canino',
    width: 7.5,
    kind: 'canine',
  },
  {
    place: 'PM1',
    dentition: 'permanent',
    name: 'Primer premolar',
    width: 7,
    kind: 'premolar',
  },
  {
    place: 'PM2',
    dentition: 'permanent',
    name: 'Segundo premolar',
    width: 6.8,
    kind: 'premolar',
  },
  {
    place: 'M1',
    dentition: 'permanent',
    name: 'Primer molar',
    width: 10.2,
    kind: 'molar',
  },
  {
    place: 'M2',
    dentition: 'permanent',
    name: 'Segundo molar',
    width: 9,
    kind: 'molar',
  },
  {
    place: 'M3',
    dentition: 'permanent',
    name: 'Tercer molar o muela del juicio',
    width: 8.5,
    kind: 'molar',
  },
]

export const TEETH: Tooth[] = [...PRIMARY, ...PERMANENT]

const months = (from: number, to: number): Range => ({
  from: from / 12,
  to: to / 12,
})
const years = (from: number, to: number): Range => ({ from, to })

export type PrimaryPlace = 'I1' | 'I2' | 'C' | 'PM1' | 'PM2'

interface Timing {
  /** Eruption of the milk teeth, by jaw. */
  primary: Record<PrimaryPlace, Record<Jaw, Range>>
  /** Their fall. */
  shedding: Record<PrimaryPlace, Range>
  /** Eruption of the permanent teeth (both jaws). */
  permanent: Record<Place, Range>
}

export const TIMING: Record<Scheme, Timing> = {
  testut: {
    // Testut's table, p. 91: the lower teeth come out a little before their upper fellows.
    primary: {
      I1: { lower: months(6, 8), upper: months(7, 10) },
      I2: { lower: months(8, 16), upper: months(10, 18) },
      PM1: { lower: months(22, 24), upper: months(24, 26) },
      C: { lower: months(28, 30), upper: months(30, 34) },
      PM2: { lower: months(32, 36), upper: months(32, 36) },
    },
    // P. 92: the first to come out are the first to fall.
    shedding: {
      I1: years(7, 7.5),
      I2: years(7, 8),
      PM1: years(10, 10.5),
      C: years(10, 12),
      PM2: years(10, 12),
    },
    // P. 93.
    permanent: {
      M1: years(4, 7),
      I1: years(6, 8),
      I2: years(8, 10),
      PM1: years(9, 10),
      C: years(10, 11),
      PM2: years(11, 12),
      M2: years(12, 14),
      M3: years(19, 30),
    },
  },
  today: {
    // Moore, tabla 8-13 A (both jaws alike) and B.
    primary: {
      I1: { lower: months(6, 8), upper: months(6, 8) },
      I2: { lower: months(8, 10), upper: months(8, 10) },
      PM1: { lower: months(12, 16), upper: months(12, 16) },
      C: { lower: months(16, 20), upper: months(16, 20) },
      PM2: { lower: months(20, 24), upper: months(20, 24) },
    },
    shedding: {
      I1: years(6, 7),
      I2: years(7, 8),
      PM1: years(9, 11),
      C: years(10, 12),
      PM2: years(10, 12),
    },
    permanent: {
      M1: years(6, 7),
      I1: years(7, 8),
      I2: years(8, 9),
      PM1: years(10, 11),
      C: years(10, 12),
      PM2: years(11, 12),
      M2: years(12, 12.5),
      M3: years(13, 25),
    },
  },
}

export const isPrimaryPlace = (p: Place): p is PrimaryPlace => PRIMARY.some((t) => t.place === p)

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const progress = (r: Range, age: number) => (r.to === r.from ? (age >= r.from ? 1 : 0) : clamp01((age - r.from) / (r.to - r.from)))

export interface PlaceState {
  /** How far the milk tooth has come out (0 inside the bone, 1 in occlusion), times what is left after its fall. */
  primary: number
  /** The milk tooth is loosening (0 firm, 1 fallen). */
  shedding: number
  /** How far the permanent tooth has come out. */
  permanent: number
}

/** The state of one place of one jaw at an age. */
export function placeState(scheme: Scheme, jaw: Jaw, place: Place, age: number): PlaceState {
  const t = TIMING[scheme]
  const permanent = progress(t.permanent[place], age)
  if (!isPrimaryPlace(place)) return { primary: 0, shedding: 0, permanent }
  const shedding = progress(t.shedding[place], age)
  const erupted = progress(t.primary[place][jaw], age)
  return { primary: shedding >= 1 ? 0 : erupted, shedding, permanent }
}

/** A tooth is in the mouth once it has pierced the gum, until it falls. */
export const IN_MOUTH = 0.15

export interface Count {
  primary: number
  permanent: number
}

/** Teeth in the mouth at an age, both jaws and both sides. */
export function countAt(scheme: Scheme, age: number): Count {
  const c = { primary: 0, permanent: 0 }
  for (const jaw of ['upper', 'lower'] as Jaw[])
    for (const place of PLACES) {
      const s = placeState(scheme, jaw, place, age)
      if (s.primary >= IN_MOUTH && s.shedding < 1) c.primary += 2
      if (s.permanent >= IN_MOUTH) c.permanent += 2
    }
  return c
}

/** The dental formula of one half of each jaw: incisors, canines, premolars, molars. */
export function formula(d: Dentition): [number, number, number, number] {
  const teeth = d === 'primary' ? PRIMARY : PERMANENT
  return [
    teeth.filter((t) => t.kind === 'incisor').length,
    teeth.filter((t) => t.kind === 'canine').length,
    teeth.filter((t) => t.kind === 'premolar').length,
    teeth.filter((t) => t.kind === 'molar').length,
  ]
}

/** The tooth a permanent one replaces, if any. */
export const predecessor = (place: Place): Tooth | undefined => PRIMARY.find((t) => t.place === place)

/** What happens between two ages: teeth that start coming out or falling, in order. */
export interface DentalEvent {
  age: number
  text: string
}

export function events(scheme: Scheme): DentalEvent[] {
  const t = TIMING[scheme]
  const out: DentalEvent[] = []
  const jawName = { upper: 'superiores', lower: 'inferiores' }
  for (const p of PRIMARY) {
    const r = t.primary[p.place as PrimaryPlace]
    if (r.upper.from === r.lower.from) out.push({ age: r.lower.from, text: `salen los ${plural(p.name)}` })
    else
      for (const jaw of ['lower', 'upper'] as Jaw[])
        out.push({
          age: r[jaw].from,
          text: `salen los ${plural(p.name)} ${jawName[jaw]}`,
        })
    out.push({
      age: t.shedding[p.place as PrimaryPlace].from,
      text: `empiezan a caer los ${plural(p.name)}`,
    })
  }
  for (const p of PERMANENT)
    out.push({
      age: t.permanent[p.place].from,
      text: `salen los ${plural(p.name)}`,
    })
  return out.sort((a, b) => a.age - b.age)
}

/** "Incisivo medio temporal" → "incisivos medios temporales"; "Tercer molar o muela del juicio" → "terceros molares". */
export function plural(name: string): string {
  const base = name.split(' o ')[0].toLowerCase()
  return base
    .split(' ')
    .map((w) => (w === 'tercer' ? 'terceros' : w === 'primer' ? 'primeros' : /[aeiou]$/.test(w) ? `${w}s` : /[lr]$/.test(w) ? `${w}es` : w))
    .join(' ')
}

/** "2 años y 6 meses", "8 meses", "7 años". */
export function ageLabel(age: number): string {
  const total = Math.round(age * 12)
  const y = Math.floor(total / 12)
  const m = total % 12
  if (y === 0) return m === 0 ? 'al nacer' : `${m} ${m === 1 ? 'mes' : 'meses'}`
  const ys = `${y} ${y === 1 ? 'año' : 'años'}`
  return m === 0 ? ys : `${ys} y ${m} ${m === 1 ? 'mes' : 'meses'}`
}

/** The slider runs 0…1 over a broken scale: the first three years (the milk teeth) take as much room as the rest. */
const KNOTS: [number, number][] = [
  [0, 0],
  [0.4, 3],
  [0.85, 14],
  [1, 30],
]

export function ageAt(t: number): number {
  for (let i = 1; i < KNOTS.length; i++) {
    const [t0, a0] = KNOTS[i - 1]
    const [t1, a1] = KNOTS[i]
    if (t <= t1) return a0 + ((Math.max(t, t0) - t0) / (t1 - t0)) * (a1 - a0)
  }
  return KNOTS[KNOTS.length - 1][1]
}

export function sliderAt(age: number): number {
  for (let i = 1; i < KNOTS.length; i++) {
    const [t0, a0] = KNOTS[i - 1]
    const [t1, a1] = KNOTS[i]
    if (age <= a1) return t0 + ((Math.max(age, a0) - a0) / (a1 - a0)) * (t1 - t0)
  }
  return 1
}
