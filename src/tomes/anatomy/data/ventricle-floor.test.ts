import { describe, expect, it } from 'vitest'
import { BOTTOM_Y, FLOOR_MM, LATERAL_Y, extentAt, halfWidth, regions, sulcusAt, toXY, type UY } from './ventricle-floor'

const region = (id: string) => regions.find((r) => r.id === id)!
const heights = (shape: UY[]) => {
  const ys = shape.map((p) => p[1])
  const out: number[] = []
  for (let y = Math.ceil(Math.min(...ys)); y <= Math.floor(Math.max(...ys)); y += 2) out.push(y)
  return out
}

describe('the floor of the fourth ventricle', () => {
  it('is a rhombus with Testut’s measurements: 16 mm wide, a short bulbar triangle and a long pontine one', () => {
    expect(FLOOR_MM.width).toBe(16)
    expect(FLOOR_MM.bulbar).toBeGreaterThanOrEqual(10)
    expect(FLOOR_MM.bulbar).toBeLessThanOrEqual(12)
    expect(FLOOR_MM.pontine).toBeGreaterThanOrEqual(18)
    expect(FLOOR_MM.pontine).toBeLessThanOrEqual(20)
    expect(halfWidth(LATERAL_Y) * 2).toBe(160)
    expect(halfWidth(0)).toBe(0)
    expect(halfWidth(BOTTOM_Y)).toBe(0)
  })

  it('keeps every relief inside the floor and in its triangle', () => {
    for (const r of regions) {
      for (const [u, y] of r.shape) {
        expect(u, r.id).toBeGreaterThan(0)
        expect(u, r.id).toBeLessThanOrEqual(1)
        expect(y, r.id).toBeGreaterThan(0)
        expect(y, r.id).toBeLessThan(BOTTOM_Y)
      }
      const ys = r.shape.map((p) => p[1])
      if (r.triangle === 'bulbar') expect(Math.min(...ys), r.id).toBeGreaterThan(LATERAL_Y)
      if (r.triangle === 'pontine') expect(Math.max(...ys), r.id).toBeLessThan(LATERAL_Y)
      if (r.triangle === 'both') {
        expect(Math.min(...ys), r.id).toBeLessThan(LATERAL_Y)
        expect(Math.max(...ys), r.id).toBeGreaterThan(LATERAL_Y)
      }
    }
  })

  it('puts the motor reliefs inside the sulcus limitans, the vegetative and sensory ones outside', () => {
    for (const r of regions.filter((r) => r.zone !== 'other'))
      for (const y of heights(r.shape)) {
        const [min, max] = extentAt(r.shape, y)!
        const s = sulcusAt(y)
        if (r.zone === 'somatomotor') expect(max, `${r.id} at ${y}`).toBeLessThan(s)
        else expect(min, `${r.id} at ${y}`).toBeGreaterThan(s)
      }
  })

  it('orders the three wings from the midline out: hypoglossal, grey wing, vestibular area', () => {
    const at = (id: string, y: number) => extentAt(region(id).shape, y)!
    for (const y of [200, 204]) {
      expect(at('hypoglossal', y)[1]).toBeLessThan(at('vagal', y)[0])
      expect(at('vagal', y)[1]).toBeLessThan(at('vestibular', y)[0])
    }
  })

  it('points the white inner wing up and the grey wing down, as two opposed triangles', () => {
    const width = (id: string, y: number) => {
      const [a, b] = extentAt(region(id).shape, y)!
      return toXY([b, y])[0] - toXY([a, y])[0]
    }
    expect(width('hypoglossal', 200)).toBeGreaterThan(width('hypoglossal', 280))
    expect(width('vagal', 250)).toBeGreaterThan(width('vagal', 202))
  })

  it('gives today’s name to the reliefs Netter names differently', () => {
    expect(region('teres').modern).toBe('Colículo facial')
    expect(region('hypoglossal').modern).toBe('Trígono del hipogloso')
    expect(region('vagal').modern).toBe('Trígono del vago')
  })
})
