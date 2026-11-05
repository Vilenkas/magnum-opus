import { describe, expect, it } from 'vitest'
import { landmarkById } from './landmarks'
import { levers } from './levers'
import { pieceById } from './skeleton'

describe('levers', () => {
  it('has the three classical kinds', () => {
    expect(levers.map((l) => l.id)).toEqual(['first', 'second', 'third'])
  })

  it('puts the right point in the middle of each lever', () => {
    expect(levers.map((l) => l.order[1])).toEqual(['fulcrum', 'load', 'effort'])
  })

  it('places every point once, on a real landmark', () => {
    for (const lever of levers) {
      expect(lever.points.map((p) => p.role).sort()).toEqual(['effort', 'fulcrum', 'load'])
      expect([...lever.order].sort()).toEqual(['effort', 'fulcrum', 'load'])
      for (const p of lever.points) expect(landmarkById.has(p.landmark), p.landmark).toBe(true)
      for (const id of lever.pieces) expect(pieceById.has(id), id).toBe(true)
    }
  })
})
