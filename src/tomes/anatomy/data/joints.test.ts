import { describe, expect, it } from 'vitest'
import { jointClasses, jointGenera } from './joints'
import { landmarkById } from './landmarks'
import { pieceById } from './skeleton'

describe('joint classification', () => {
  it('gives every class at least one genus, and every genus a known class', () => {
    for (const c of jointClasses) expect(jointGenera.some((g) => g.class === c.id), c.id).toBe(true)
    for (const g of jointGenera) expect(jointClasses.map((c) => c.id)).toContain(g.class)
  })

  it('has the six diarthrosis genera of the classical classification', () => {
    expect(jointGenera.filter((g) => g.class === 'diarthrosis')).toHaveLength(6)
  })

  it('uses unique ids', () => {
    const ids = jointGenera.map((g) => g.id)
    const examples = jointGenera.flatMap((g) => g.examples.map((e) => e.id))
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(examples).size).toBe(examples.length)
  })

  it('builds every example from real pieces, anchored on one of them', () => {
    const problems: string[] = []
    for (const g of jointGenera) {
      expect(g.examples.length, g.id).toBeGreaterThan(0)
      for (const e of g.examples) {
        if (e.pieces.length < 2) problems.push(`${e.id}: needs two pieces`)
        for (const p of e.pieces) if (!pieceById.has(p)) problems.push(`${e.id}: unknown piece ${p}`)
        if (e.anchor) {
          const l = landmarkById.get(e.anchor)
          if (!l) problems.push(`${e.id}: unknown landmark ${e.anchor}`)
          else if (!e.pieces.includes(l.pieceId)) problems.push(`${e.id}: anchor on ${l.pieceId}, not a joint piece`)
        }
      }
    }
    expect(problems).toEqual([])
  })
})
