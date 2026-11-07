import { describe, expect, it } from 'vitest'
import { SCALE, cavities, ends, flow } from './ventricles'

const cavity = (id: string) => cavities.find((c) => c.id === id)!

describe('the ventricles and the fluid', () => {
  it('runs the fluid as one continuous path', () => {
    for (let i = 1; i < flow.length; i++) expect(ends(flow[i].d).start, flow[i].id).toEqual(ends(flow[i - 1].d).end)
  })

  it('goes from the lateral ventricle through Monro, the third ventricle, the aqueduct and the fourth, then out', () => {
    const order = flow.map((s) => s.cavity)
    const seq = ['monro', 'third', 'aqueduct', 'fourth']
    const idx = seq.map((c) => order.indexOf(c as never))
    expect(idx.every((i) => i >= 0)).toBe(true)
    expect(idx).toEqual([...idx].sort((a, b) => a - b))
    expect(['frontal', 'crossroads', 'occipital', 'temporal']).toContain(order[0])
    expect(order.at(-1)).toBeNull()
  })

  it('makes the aqueduct the narrowest passage the fluid crosses', () => {
    const crossed = flow.flatMap((s) => (s.cavity ? [cavity(s.cavity)] : []))
    const narrowest = crossed.reduce((a, b) => (b.width < a.width ? b : a))
    expect(narrowest.id).toBe('aqueduct')
  })

  it('draws the aqueduct to Testut’s 15 mm', () => {
    const { start, end } = ends(cavity('aqueduct').d)
    const mm = Math.hypot(end[0] - start[0], end[1] - start[1]) / SCALE
    expect(mm).toBeGreaterThan(13)
    expect(mm).toBeLessThan(17)
  })

  it('meets the three portions of the lateral ventricle at the crossroads', () => {
    const cross = ends(cavity('crossroads').d)
    expect(ends(cavity('frontal').d).end).toEqual(cross.start)
    expect(ends(cavity('occipital').d).start).toEqual(cross.end)
    expect(ends(cavity('temporal').d).start).toEqual(cross.end)
  })

  it('joins the third ventricle to the fourth only through the aqueduct', () => {
    const a = ends(cavity('aqueduct').d)
    expect(a.end).toEqual(ends(cavity('fourth').d).start)
    expect(ends(cavity('fourth').d).end).toEqual(ends(cavity('canal').d).start)
  })
})
