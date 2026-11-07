import { describe, expect, it } from 'vitest'
import { granularity, layers, layersAt, types } from './cortex-types'

const type = (id: string) => types.find((t) => t.id === id)!

describe('the cortex and its five types', () => {
  it('has six layers in each type, whose shares fill the whole thickness', () => {
    expect(layers.map((l) => l.id)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI'])
    for (const t of types) expect(Object.values(t.shares).reduce((a, b) => a + b, 0), t.id).toBeCloseTo(1, 6)
  })

  it('takes the granular layer away from the motor cortex, which keeps Betz’s giant cells', () => {
    const a = type('agranular')
    expect(a.shares.IV).toBe(0)
    expect(a.betz).toBe(true)
    expect(types.filter((t) => t.betz).map((t) => t.id)).toEqual(['agranular'])
  })

  it('keeps all six layers in the three homotypical types', () => {
    for (const t of types.filter((t) => t.kind === 'homotypical')) for (const l of layers) expect(t.shares[l.id], `${t.id} ${l.id}`).toBeGreaterThan(0)
    expect(types.filter((t) => t.kind === 'heterotypical').map((t) => t.id)).toEqual(['agranular', 'granular'])
  })

  it('grows more granular from the agranular type to the koniocortex, in Economo’s order', () => {
    const g = types.map(granularity)
    expect(g).toEqual([...g].sort((a, b) => a - b))
    expect(type('granular').shares.IV).toBe(Math.max(...types.map((t) => t.shares.IV)))
  })

  it('thins from the motor cortex to the koniocortex, which measures 1.5 to 2 mm in the calcarine fissure', () => {
    const th = types.map((t) => t.thickness)
    expect(th).toEqual([...th].sort((a, b) => b - a))
    expect(type('granular').thickness).toBeGreaterThanOrEqual(1.5)
    expect(type('granular').thickness).toBeLessThanOrEqual(2)
    expect(Math.max(...th)).toBeLessThanOrEqual(4.5)
  })

  it('shrinks the pyramids as the grains spread', () => {
    const p = types.map((t) => t.pyramids)
    expect(p).toEqual([...p].sort((a, b) => b - a))
  })

  it('glides between types through intermediate thicknesses', () => {
    const half = layersAt(0.5).layers.find((l) => l.id === 'IV')!.mm
    expect(half).toBeGreaterThan(0)
    expect(half).toBeLessThan(type('frontal').thickness * type('frontal').shares.IV)
    expect(layersAt(4).layers.reduce((a, l) => a + l.mm, 0)).toBeCloseTo(type('granular').thickness)
  })
})
