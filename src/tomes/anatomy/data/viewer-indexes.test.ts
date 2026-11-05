import { describe, expect, it } from 'vitest'
import { pieces } from './skeleton'
import { softById } from './soft-tissues'
import { searchIndex } from './structure-index'
import { boneIndex, boneRegionOf, tissueEntryOf, tissueIndex } from './viewer-indexes'

describe('viewer indexes', () => {
  it('lists every bone piece once, under its region', () => {
    const keys = boneIndex.flatMap((s) => s.entries.map((e) => e.key))
    expect(keys.sort()).toEqual(pieces.map((p) => p.id).sort())
    expect(boneRegionOf('femur-r')).toBe('lower-limb')
  })

  it('finds a bone by its Latin name or a synonym, without accents', () => {
    const all = boneIndex.flatMap((s) => s.entries)
    expect(searchIndex('femur derecho', all).map((e) => e.key)).toContain('femur-r')
    expect(searchIndex('dextrum femur', all).map((e) => e.key)).toEqual(['femur-r'])
  })

  it('joins both sides of a muscle in one line, and maps each side back to it', () => {
    const right = tissueEntryOf.get('pronator-quadratus-r')!
    expect(right.ids.sort()).toEqual(['pronator-quadratus-l', 'pronator-quadratus-r'])
    expect(tissueEntryOf.get('pronator-quadratus-l')).toBe(right)
  })

  it('keeps tendons, bursae and fasciae out of the muscle list', () => {
    const muscles = tissueIndex.find((s) => s.id === 'muscles')!.entries
    expect(muscles.every((e) => e.ids.every((id) => !id.endsWith('--tendon')))).toBe(true)
    const kinds = new Set(muscles.flatMap((e) => e.ids.map((id) => softById.get(id)!.kind)))
    expect([...kinds]).toEqual(['muscle'])
  })

  it('uses unique keys within each index', () => {
    for (const index of [boneIndex, tissueIndex]) {
      const keys = index.flatMap((s) => s.entries.map((e) => e.key))
      expect(new Set(keys).size).toBe(keys.length)
    }
  })
})
