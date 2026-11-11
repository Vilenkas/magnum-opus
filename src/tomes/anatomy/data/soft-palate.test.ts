import { describe, expect, it } from 'vitest'
import { ACTS, DEVIATES, LESIONS, MUSCLES, outcome, signs } from './soft-palate'

describe('the muscles of the velum (Testut pp. 37–49; Moore 8 p. 944)', () => {
  it('are five on each side, ten in all', () => {
    expect(MUSCLES).toHaveLength(5)
  })

  it('all answer to the vagus but the tensor, which comes from the mandibular nerve like the muscles of mastication', () => {
    expect(MUSCLES.filter((m) => m.nerve === 'V3').map((m) => m.id)).toEqual(['tensor'])
  })

  it('are suspensors (the two peristaphylines) and pillars (palatoglossus, palatopharyngeus)', () => {
    expect(MUSCLES.filter((m) => m.lift > 0).map((m) => m.id)).toEqual(['levator', 'tensor'])
    expect(MUSCLES.filter((m) => m.pillar).map((m) => [m.id, m.pillar])).toEqual([
      ['palatoglossus', 'anterior'],
      ['palatopharyngeus', 'posterior'],
    ])
  })
})

describe('the acts of the velum, with every muscle working', () => {
  it('leave both passages open at rest', () => {
    const o = outcome('rest', 'none')
    expect(o.lift).toBe(0)
    expect([o.nasal, o.oral]).toEqual(['open', 'open'])
  })

  it('shut the nasopharynx when speaking and swallowing, with the velum straight', () => {
    for (const a of ['phonation', 'swallowing'] as const) {
      const o = outcome(a, 'none')
      expect(o.nasal).toBe('closed')
      expect(o.deviation).toBe(0)
      expect(signs(a, 'none')).toEqual([])
    }
  })

  it('open both auditory tubes when swallowing', () => {
    expect(outcome('swallowing', 'none').tube).toEqual({
      right: true,
      left: true,
    })
    expect(outcome('phonation', 'none').tube).toEqual({
      right: false,
      left: false,
    })
  })

  it('shut the mouth from the pharynx when sucking, the velum resting on the tongue', () => {
    const o = outcome('sucking', 'none')
    expect(o.oral).toBe('closed')
    expect(o.lift).toBe(0)
  })
})

describe('palsies, derived from what is left', () => {
  it('of one vagus: the velum and uvula go to the healthy side (curtain sign) and the seal leaks', () => {
    const right = outcome('phonation', 'X-right')
    expect(right.deviation).toBeGreaterThan(DEVIATES)
    expect(right.nasal).toBe('incomplete')
    expect(signs('phonation', 'X-right').join(' ')).toMatch(/lado izquierdo, el sano/)
    const left = outcome('phonation', 'X-left')
    expect(left.deviation).toBeCloseTo(-right.deviation)
    expect(signs('phonation', 'X-left').join(' ')).toMatch(/lado derecho, el sano/)
  })

  it('of both vagi: the velum hangs without deviating, the voice is nasal and liquids come back through the nose', () => {
    const o = outcome('phonation', 'X-both')
    expect(o.nasal).toBe('open')
    expect(Math.abs(o.deviation)).toBeLessThan(DEVIATES)
    expect(signs('phonation', 'X-both').join(' ')).toMatch(/rinolalia abierta/)
    expect(signs('swallowing', 'X-both').join(' ')).toMatch(/refluyen por la nariz/)
    expect(outcome('sucking', 'X-both').oral).toBe('open')
  })

  it('of one mandibular nerve: the velum still seals, but that side’s tube no longer opens', () => {
    const o = outcome('swallowing', 'V3-right')
    expect(o.nasal).toBe('closed')
    expect(o.tube).toEqual({ right: false, left: true })
    const s = signs('swallowing', 'V3-right')
    expect(s).toHaveLength(1)
    expect(s[0]).toMatch(/trompa derecha/)
  })

  it('never invent a sign at rest', () => {
    for (const l of LESIONS) expect(signs('rest', l.id)).toEqual([])
  })

  it('every act and lesion gives a velum between hanging and horizontal', () => {
    for (const a of ACTS)
      for (const l of LESIONS) {
        const o = outcome(a.id, l.id)
        expect(o.lift).toBeGreaterThanOrEqual(0)
        expect(o.lift).toBeLessThanOrEqual(1)
        expect(Math.abs(o.deviation)).toBeLessThanOrEqual(1)
      }
  })
})
