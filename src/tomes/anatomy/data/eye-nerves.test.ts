import { describe, expect, it } from 'vitest'
import { MUSCLES, diplopia, moversOf, reaches, restingDeviation, signsOf, type Gaze } from './eye-nerves'

const ALL: Gaze[] = [-1, 0, 1].flatMap((h) => [-1, 0, 1].map((v) => [h, v] as Gaze))

describe('eye nerves: the muscles', () => {
  it('give the III five muscles of the globe and lid, the IV and the VI one each (Testut)', () => {
    const by = (n: string) => MUSCLES.filter((m) => m.nerve === n && (m.pull || m.id === 'levator')).map((m) => m.id).sort()
    expect(by('III')).toEqual(['levator', 'obliquus-inf', 'rectus-inf', 'rectus-med', 'rectus-sup'])
    expect(by('IV')).toEqual(['obliquus-sup'])
    expect(by('VI')).toEqual(['rectus-lat'])
  })

  it('balance at rest: with every muscle working, the eye looks straight ahead', () => {
    expect(restingDeviation(null)).toEqual([0, 0, 0])
    const sum = [0, 1, 2].map((i) => MUSCLES.reduce((s, m) => s + (m.pull?.[i] ?? 0), 0))
    for (const c of sum) expect(c).toBeCloseTo(0)
  })

  it('leave one muscle alone in each oblique gaze (Moore), and two straight up or down', () => {
    expect(moversOf([1, 1])).toContain('rectus-sup')
    expect(moversOf([-1, -1])).toContain('obliquus-sup')
    expect(moversOf([0, 1]).sort()).toEqual(['obliquus-inf', 'rectus-sup'])
  })
})

describe('eye nerves: the palsies', () => {
  it('turn the eye in when the VI is cut, and leave it double everywhere but looking away', () => {
    const [abd] = restingDeviation('VI')
    expect(abd).toBeLessThan(-0.5) // adducted
    expect(reaches('VI', [1, 0])).toBe(false)
    for (const g of ALL) expect(diplopia('VI', g)).toBe(g[0] !== -1) // only gaze to the opposite side is single
  })

  it('send the eye down and out, with ptosis and a dilated pupil, when the III is cut', () => {
    const [abd, elev] = restingDeviation('III')
    expect(abd).toBeGreaterThan(0.5)
    expect(elev).toBeLessThan(0)
    expect(signsOf('III')).toEqual({ ptosis: 'complete', pupil: 'dilated', accommodation: false })
  })

  it('make the IV palsy double only looking down and in, the eye up and extorted at rest', () => {
    const [, elev, intor] = restingDeviation('IV')
    expect(elev).toBeGreaterThan(0)
    expect(intor).toBeLessThan(0)
    const double = ALL.filter((g) => g[1] !== 0 || g[0] !== 0).filter((g) => diplopia('IV', g))
    expect(double).toEqual([[-1, -1]])
  })

  it('leave the globe free in a sympathetic palsy: small ptosis and a small pupil (Horner)', () => {
    expect(restingDeviation('sympathetic')).toEqual([0, 0, 0])
    expect(signsOf('sympathetic')).toEqual({ ptosis: 'partial', pupil: 'constricted', accommodation: true })
    for (const g of ALL) expect(diplopia('sympathetic', g)).toBe(false)
  })
})
