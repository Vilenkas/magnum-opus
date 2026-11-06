import { describe, expect, it } from 'vitest'
import { apart, columns, inside, stageAt, stages } from './bulb-columns'

const at = (id: string) => stages.find((s) => s.id === id)!

describe('from the spinal cord to the medulla oblongata', () => {
  it('starts with each horn whole: head and base touching', () => {
    const c = at('cord').columns
    expect(apart(c['anterior-head'], c['anterior-base'])).toBe(false)
    expect(apart(c['posterior-head'], c['posterior-base'])).toBe(false)
  })

  it('beheads both horns at the decussations: head and base no longer touch', () => {
    const c = at('decussations').columns
    expect(at('decussations').decussation).toEqual({ motor: true, sensory: true })
    expect(apart(c['anterior-head'], c['anterior-base'])).toBe(true)
    expect(apart(c['posterior-head'], c['posterior-base'])).toBe(true)
  })

  it('keeps the four columns apart once separated', () => {
    for (const s of stages.slice(1)) {
      const c = s.columns
      for (const [a, b] of [['anterior-head', 'anterior-base'], ['posterior-head', 'posterior-base'], ['anterior-base', 'posterior-base']] as const)
        expect(apart(c[a], c[b]), `${s.id}: ${a} / ${b}`).toBe(true)
    }
  })

  it('opens the ventricle step by step, from a closed canal to the full floor', () => {
    expect(stages.map((s) => s.ventricle)).toEqual([0, 0, 0.5, 1])
  })

  it('swings the sensory columns outwards as the ventricle opens', () => {
    const x = (stage: string) => at(stage).columns['posterior-base'].x
    expect(x('opening')).toBeGreaterThan(x('decussations'))
    expect(x('ventricle')).toBeGreaterThan(x('opening'))
  })

  it('ends with the bases on the ventricular floor, motor inside and sensory outside, and the heads deep', () => {
    const s = at('ventricle')
    const c = s.columns
    expect(c['anterior-base'].x).toBeLessThan(c['posterior-base'].x)
    for (const col of columns) {
      const e = c[col.id]
      // The floor is the posterior surface left by the open ventricle: bases lie against it.
      if (col.depth === 'floor') expect(Math.abs(e.y - s.floorY), col.id).toBeLessThan(e.ry + 4)
      else expect(e.y + e.ry, col.id).toBeLessThan(s.floorY)
    }
  })

  it('keeps every column inside the section at every step', () => {
    for (let t = 0; t <= 3; t += 0.25) {
      const s = stageAt(t)
      for (const col of columns) expect(inside(s.columns[col.id], s.outline), `t=${t} ${col.id}`).toBe(true)
    }
  })

  it('gives each column its cranial nerve nuclei', () => {
    for (const c of columns) expect(c.nuclei.length).toBeGreaterThan(10)
    expect(columns.find((c) => c.id === 'anterior-base')!.nuclei).toMatch(/[Hh]ipogloso/)
    expect(columns.find((c) => c.id === 'posterior-head')!.nuclei).toMatch(/trigémino/)
  })
})
