import { describe, expect, it } from 'vitest'
import {
  ageAt,
  ageLabel,
  countAt,
  events,
  formula,
  PERMANENT,
  PLACES,
  placeState,
  plural,
  predecessor,
  PRIMARY,
  sliderAt,
  TIMING,
  type Place,
  type PrimaryPlace,
  type Scheme,
} from './dentition'

const SCHEMES: Scheme[] = ['testut', 'today']
const MILK: PrimaryPlace[] = ['I1', 'I2', 'C', 'PM1', 'PM2']

describe('the dental formulas (Testut p. 51)', () => {
  it('give twenty milk teeth and thirty-two permanent ones', () => {
    expect(formula('primary')).toEqual([2, 1, 0, 2])
    expect(formula('permanent')).toEqual([2, 1, 2, 3])
    expect(PRIMARY.length * 4).toBe(20)
    expect(PERMANENT.length * 4).toBe(32)
  })

  it('make twenty permanent teeth replacements and twelve new ones', () => {
    const replacing = PERMANENT.filter((t) => predecessor(t.place))
    expect(replacing.length * 4).toBe(20)
    expect(PERMANENT.filter((t) => !predecessor(t.place)).map((t) => t.place)).toEqual(['M1', 'M2', 'M3'])
    // The premolars take the place of the milk molars.
    expect(predecessor('PM1')?.kind).toBe('molar')
    expect(predecessor('PM2')?.kind).toBe('molar')
  })
})

describe('the first dentition', () => {
  it('comes out lower teeth first, then their upper fellows (Testut)', () => {
    const t = TIMING.testut.primary
    for (const p of MILK) expect(t[p].lower.from).toBeLessThanOrEqual(t[p].upper.from)
    expect(t.I1.lower.from).toBeLessThan(t.I1.upper.from)
  })

  it('in the order incisors, first molars, canines, second molars', () => {
    for (const s of SCHEMES) {
      const t = TIMING[s].primary
      const order = (['I1', 'I2', 'PM1', 'C', 'PM2'] as PrimaryPlace[]).map((p) => t[p].lower.from)
      expect([...order].sort((a, b) => a - b)).toEqual(order)
    }
  })

  it('is complete, twenty teeth, at two and a half to three years', () => {
    for (const s of SCHEMES) {
      expect(countAt(s, 3)).toEqual({ primary: 20, permanent: 0 })
      expect(countAt(s, 0.3)).toEqual({ primary: 0, permanent: 0 })
    }
  })

  it('falls in the order it came: the first out are the first to fall (Testut p. 92)', () => {
    for (const s of SCHEMES) {
      const t = TIMING[s]
      const byEruption = [...MILK].sort((a, b) => t.primary[a].lower.from - t.primary[b].lower.from)
      const fall = byEruption.map((p) => t.shedding[p].from)
      expect([...fall].sort((a, b) => a - b)).toEqual(fall)
    }
  })
})

describe('the second dentition', () => {
  it('starts with the first molar, the «muela de siete años», and ends with the wisdom tooth', () => {
    for (const s of SCHEMES) {
      const t = TIMING[s].permanent
      const first = PLACES.reduce((a, b) => (t[a].from <= t[b].from ? a : b))
      const last = PLACES.reduce((a, b) => (t[a].from >= t[b].from ? a : b))
      expect(first).toBe('M1')
      expect(last).toBe('M3')
      expect(t.M1.to).toBe(7)
    }
  })

  it('follows the order of the milk teeth it replaces (Testut p. 93)', () => {
    const t = TIMING.testut.permanent
    const order: Place[] = ['M1', 'I1', 'I2', 'PM1', 'C', 'PM2', 'M2', 'M3']
    const ages = order.map((p) => t[p].from)
    expect([...ages].sort((a, b) => a - b)).toEqual(ages)
  })

  it('goes through a mixed dentition, then leaves 28 teeth until the wisdom teeth', () => {
    for (const s of SCHEMES) {
      const mixed = countAt(s, 8.5)
      expect(mixed.primary).toBeGreaterThan(0)
      expect(mixed.permanent).toBeGreaterThan(0)
      expect(countAt(s, 12.9).primary).toBe(0)
      expect(countAt(s, TIMING[s].permanent.M3.from)).toEqual({
        primary: 0,
        permanent: 28,
      })
      expect(countAt(s, 30)).toEqual({ primary: 0, permanent: 32 })
    }
  })

  it('never shows a fallen milk tooth', () => {
    for (const s of SCHEMES)
      for (const p of MILK) {
        const st = placeState(s, 'upper', p, TIMING[s].shedding[p].to + 0.01)
        expect(st.primary).toBe(0)
      }
  })
})

describe('the plate’s helpers', () => {
  it('maps the slider both ways', () => {
    for (const a of [0, 0.5, 2.5, 3, 7, 12, 20, 30]) expect(ageAt(sliderAt(a))).toBeCloseTo(a)
    expect(ageAt(0)).toBe(0)
    expect(ageAt(1)).toBe(30)
  })

  it('writes ages and plurals in Spanish', () => {
    expect(ageLabel(0.5)).toBe('6 meses')
    expect(ageLabel(2.5)).toBe('2 años y 6 meses')
    expect(ageLabel(1)).toBe('1 año')
    expect(plural('Primer molar temporal')).toBe('primeros molares temporales')
    expect(plural('Tercer molar o muela del juicio')).toBe('terceros molares')
    expect(plural('Canino')).toBe('caninos')
  })

  it('lists the events in time order', () => {
    for (const s of SCHEMES) {
      const e = events(s)
      expect(e[0].text).toMatch(/incisivos medios temporales/)
      expect(e.at(-1)?.text).toBe('salen los terceros molares')
    }
  })
})
