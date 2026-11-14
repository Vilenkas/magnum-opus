import { describe, expect, it } from 'vitest'
import { CL, cssLinear, cssSaturable, KM, VMAX } from './saturable-kinetics'

describe('saturable kinetics (Katzung fig. 24-4)', () => {
  it('coincides with the linear drug at low dose, then bends above it', () => {
    expect(cssSaturable(20)).toBeCloseTo(cssLinear(20))
    expect(cssSaturable(60)).toBeGreaterThan(cssLinear(60))
  })

  it('runs away as the dose nears Vmax', () => {
    expect(cssSaturable(VMAX)).toBe(Infinity)
    expect(cssSaturable(95)).toBeGreaterThan(cssSaturable(80) * 2)
  })

  it('turns a small dose step near saturation into a large concentration jump', () => {
    const lowStep = cssSaturable(30) - cssSaturable(20)
    const highStep = cssSaturable(80) - cssSaturable(70)
    expect(highStep).toBeGreaterThan(lowStep * 3)
    // The linear drug steps the same amount everywhere.
    expect(cssLinear(30) - cssLinear(20)).toBeCloseTo(cssLinear(80) - cssLinear(70))
  })

  it('is convex: each equal dose step raises the concentration more than the last', () => {
    for (let d = 20; d < 80; d += 10) {
      const a = cssSaturable(d + 10) - cssSaturable(d)
      const b = cssSaturable(d) - cssSaturable(d - 10)
      expect(a).toBeGreaterThan(b)
    }
    expect(CL).toBeGreaterThan(0)
    expect(KM).toBeLessThan(VMAX)
  })
})
