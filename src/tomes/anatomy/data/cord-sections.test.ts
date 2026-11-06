import { describe, expect, it } from 'vitest'
import { UNITS_PER_MM, fascicles, fasciclePolygon, greyPolygon, levelAt, levels, polygonArea, presenceAt } from './cord-sections'

const AT = { cervical: 0, dorsal: 1, lumbar: 2, sacral: 3 } as const
const ellipseArea = (t: number) => Math.PI * levelAt(t).rx * levelAt(t).ry
const greyArea = (t: number) => polygonArea(greyPolygon(t))

describe('spinal cord sections', () => {
  it("draws the outline at Testut's diameters", () => {
    for (const l of levels) {
      if (!l.diametersMm) continue
      expect(l.rx * 2, l.id).toBeCloseTo(l.diametersMm.transverse * UNITS_PER_MM, 0)
      expect(l.ry * 2, l.id).toBeCloseTo(l.diametersMm.anteroposterior * UNITS_PER_MM, 0)
    }
    // Flattened front to back everywhere, and widest at the cervical enlargement.
    for (const l of levels) expect(l.rx).toBeGreaterThan(l.ry)
    expect(Math.max(...levels.map((l) => l.rx))).toBe(levels[0].rx)
  })

  it('keeps the grey matter inside the cord at every height', () => {
    for (let t = 0; t <= 3; t += 0.25) {
      const { rx, ry } = levelAt(t)
      for (const [x, y] of greyPolygon(t)) expect((x / rx) ** 2 + (y / ry) ** 2, `t=${t} (${x}, ${y})`).toBeLessThan(1)
    }
  })

  it("follows Stilling: least grey matter in the dorsal cord, most in the lumbar enlargement", () => {
    expect(greyArea(AT.dorsal)).toBeLessThan(greyArea(AT.cervical))
    expect(greyArea(AT.dorsal)).toBeLessThan(greyArea(AT.sacral))
    expect(greyArea(AT.lumbar)).toBeGreaterThan(greyArea(AT.cervical))
  })

  it('makes the grey matter the larger share of the section towards the conus', () => {
    const share = (t: number) => greyArea(t) / ellipseArea(t)
    expect(share(AT.sacral)).toBeGreaterThan(share(AT.lumbar))
    expect(share(AT.lumbar)).toBeGreaterThan(share(AT.cervical))
    expect(share(AT.cervical)).toBeGreaterThan(share(AT.dorsal))
  })

  it('has a lateral horn only in the dorsal cord', () => {
    expect(levels.map((l) => l.grey.lateral > 0)).toEqual([false, true, false, false])
  })

  it('narrows the crossed pyramidal tract downwards and ends the direct one in the dorsal cord', () => {
    const area = (id: string, t: number) => polygonArea(fasciclePolygon(fascicles.find((f) => f.id === id)!, t))
    expect(area('crossed-pyramidal', 0)).toBeGreaterThan(area('crossed-pyramidal', 1))
    expect(area('crossed-pyramidal', 1)).toBeGreaterThan(area('crossed-pyramidal', 2))
    expect(area('crossed-pyramidal', 2)).toBeGreaterThan(area('crossed-pyramidal', 3))
    const direct = fascicles.find((f) => f.id === 'direct-pyramidal')!
    expect(presenceAt(direct, AT.lumbar)).toBe(0)
  })

  it('takes the direct cerebellar tract from the dorsal cord upwards (from the column of Clarke)', () => {
    const f = fascicles.find((x) => x.id === 'direct-cerebellar')!
    expect(f.presence.map((p) => p > 0)).toEqual([true, true, false, false])
  })

  it('keeps every fascicle inside the cord and in its half', () => {
    for (const f of fascicles) {
      for (let t = 0; t <= 3; t += 0.5) {
        const { rx, ry } = levelAt(t)
        for (const [x, y] of fasciclePolygon(f, t)) {
          expect(x, f.id).toBeGreaterThanOrEqual(-1e-9)
          expect((x / rx) ** 2 + (y / ry) ** 2, f.id).toBeLessThanOrEqual(1 + 1e-9)
        }
      }
    }
  })
})
