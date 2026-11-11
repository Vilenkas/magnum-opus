import { describe, expect, it } from 'vitest'
import { angleDepth, climb, horizontalLength, PYLORUS, shapeAt, TONES, verticalLength } from './stomach-shapes'

const at = (id: (typeof TONES)[number]['id']) => shapeAt(TONES.find((t) => t.id === id)!.t)

describe('Schlesinger’s four stomachs (Testut pp. 188–190)', () => {
  it('lower their lowest point as the tone falls', () => {
    const ys = TONES.map((t) => shapeAt(t.t).lowest.y)
    expect([...ys].sort((a, b) => a - b)).toEqual(ys)
    for (let t = 0; t < 1; t += 0.05) expect(shapeAt(t + 0.05).lowest.y).toBeGreaterThanOrEqual(shapeAt(t).lowest.y)
  })

  it('the hypertonic horn has no separation between its two parts', () => {
    const s = at('hypertonic')
    expect(angleDepth(s)).toBeLessThanOrEqual(0.5)
    expect(climb(s)).toBeLessThan(1)
  })

  it('the orthotonic J has a vertical part at least twice the horizontal, and an angle', () => {
    const s = at('orthotonic')
    expect(verticalLength(s)).toBeGreaterThanOrEqual(2 * horizontalLength(s))
    expect(angleDepth(s)).toBeGreaterThan(0.5)
  })

  it('the hypotonic and atonic stomachs climb back up to the pylorus', () => {
    expect(climb(at('hypotonic'))).toBeGreaterThan(climb(at('orthotonic')))
    expect(climb(at('atonic'))).toBeGreaterThan(climb(at('hypotonic')))
    // The atonic stomach falls into the pelvis, below L5.
    expect(at('atonic').lowest.y).toBeGreaterThan(6)
  })
})

describe('what does not change', () => {
  it('keeps the pylorus fixed and above every lowest point', () => {
    for (const t of TONES) for (const p of ['standing', 'supine'] as const) expect(shapeAt(t.t, p).lowest.y).toBeGreaterThanOrEqual(PYLORUS.y)
  })

  it('lying down raises the lowest point by one vertebra and widens the shadow (Testut p. 189)', () => {
    for (const t of TONES.filter((x) => x.id !== 'hypertonic')) {
      const up = shapeAt(t.t, 'standing')
      const down = shapeAt(t.t, 'supine')
      expect(up.lowest.y - down.lowest.y).toBeCloseTo(1)
      expect(down.width).toBeGreaterThan(up.width)
    }
  })
})
