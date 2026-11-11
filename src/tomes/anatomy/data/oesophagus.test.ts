import { describe, expect, it } from 'vitest'
import { BASE, CARDIA, DILATED, LANDMARKS, NARROWINGS, partAt, START, stopsAt, widthAt } from './oesophagus'

describe('the oesophagus measured from the incisors', () => {
  it('starts at 15 cm (Moore, Testut), is about 25 cm long, with a cervical part of 6 cm', () => {
    expect(START).toBe(15)
    expect(CARDIA - START).toBeGreaterThanOrEqual(24)
    expect(CARDIA - START).toBeLessThanOrEqual(26)
    expect(LANDMARKS.find((l) => l.level === 'D2')!.at - START).toBe(6)
  })

  it('puts the narrowings at Moore’s distances, in order', () => {
    expect(NARROWINGS.map((n) => n.at)).toEqual([...NARROWINGS.map((n) => n.at)].sort((a, b) => a - b))
    expect(NARROWINGS.find((n) => n.id === 'aortic')!.at).toBe(22.5)
    expect(NARROWINGS.find((n) => n.id === 'bronchial')!.at).toBe(27.5)
  })

  it('draws each narrowing within Testut’s range, and the dilated segments within theirs', () => {
    for (const n of NARROWINGS) {
      expect(n.width).toBeGreaterThanOrEqual(n.range[0])
      expect(n.width).toBeLessThanOrEqual(n.range[1])
      expect(widthAt(n.at)).toBeCloseTo(n.width)
    }
    expect(BASE).toBeGreaterThanOrEqual(DILATED[0])
    expect(BASE).toBeLessThanOrEqual(DILATED[1])
    expect(widthAt(19)).toBe(BASE)
  })

  it('makes the cricoid narrowing the narrowest of all (Testut p. 153)', () => {
    let min = Infinity
    let where = 0
    for (let d = START; d <= CARDIA; d += 0.05) if (widthAt(d) < min) [min, where] = [widthAt(d), d]
    expect(partAt(where)).toBe('cervical')
  })

  it('splits the tube into its four parts', () => {
    expect([16, 30, 38.2, 40].map(partAt)).toEqual(['cervical', 'thoracic', 'diaphragmatic', 'abdominal'])
    expect(partAt(10)).toBeNull()
  })
})

describe('a swallowed body', () => {
  it('stops at the cricoid narrowing whenever it is stopped at all', () => {
    for (let mm = 15.1; mm < BASE; mm += 0.5) expect(stopsAt(mm)?.narrowing?.id).toBe('cricoid')
  })

  it('passes everywhere when thinner than every narrowing', () => {
    expect(stopsAt(14)).toBeNull()
  })

  it('a body that passes the cricoid stops at the next narrowing narrower than it', () => {
    // Thinner than the cricoid's 15 mm passes all; the order of the others matters only if the cricoid were wider.
    const sorted = [...NARROWINGS].sort((a, b) => a.width - b.width)
    expect(sorted[0].id).toBe('cricoid')
  })
})
