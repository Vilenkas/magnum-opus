import { describe, expect, it } from 'vitest'
import { landmarksByPiece } from '../data/landmarks'
import { latinOf } from '../data/latin'
import { pieceById, pieces } from '../data/skeleton'
import { checkTyped } from './answer'
import { itemById } from './engine'

const piece = (id: string) => pieceById.get(id)!
const ok = (typed: string, id: string) => checkTyped(typed, piece(id)).correct

describe('typed answers in Latin', () => {
  it.each([
    ['os frontale', 'frontal-bone'],
    ['frontale', 'frontal-bone'],
    ['os coxae', 'hip-bone-r'],
    ['costa tertia', 'third-rib-r'],
    ['costa III', 'third-rib-l'],
    ['cartilago costalis costae septimae', 'costal-cartilage-of-seventh-rib-r'],
    ['os metacarpi primum', 'first-metacarpal-bone-r'],
    ['phalanx distalis pollicis', 'distal-phalanx-of-first-finger-of-hand-r'],
    ['phalanx media digiti anularis', 'middle-phalanx-of-fourth-finger-of-hand-l'],
    ['phalanx proximalis hallucis', 'proximal-phalanx-of-first-finger-of-foot-r'],
    ['vertebra cervicalis III', 'vertebra-c3'],
    ['vertebra thoracica XII', 'vertebra-t12'],
    ['vertebra prominens', 'vertebra-c7'],
    ['dens caninus maxillaris', 'upper-canine-r'],
    ['os coxae dextrum', 'hip-bone-r'],
    ['scapula sinistra', 'scapula-l'],
  ])('accepts "%s" for %s', (typed, id) => {
    expect(ok(typed, id)).toBe(true)
  })

  it('keeps the side rule: a wrong side is still wrong', () => {
    expect(checkTyped('os coxae dextrum', piece('hip-bone-l'))).toEqual({ correct: false, reason: 'wrong-side' })
    expect(checkTyped('humerus sinister', piece('humerus-r'))).toEqual({ correct: false, reason: 'wrong-side' })
  })

  it('tells apart members of a numbered series', () => {
    expect(ok('costa tertia', 'fourth-rib-r')).toBe(false)
    expect(ok('vertebra cervicalis III', 'vertebra-c4')).toBe(false)
    expect(ok('phalanx distalis pollicis', 'distal-phalanx-of-first-finger-of-foot-r')).toBe(false)
    expect(ok('dens caninus maxillaris', 'lower-canine-r')).toBe(false)
    expect(ok('os metacarpi primum', 'first-metatarsal-bone-r')).toBe(false)
  })

  it("accepts every piece's own Latin name", () => {
    const rejected = pieces.filter((p) => !checkTyped(latinOf(p.en)!, p).correct).map((p) => `${latinOf(p.en)} → ${p.id}`)
    expect(rejected).toEqual([])
  })

  it("never accepts one piece's Latin name for a different piece", () => {
    const confusions: string[] = []
    for (const a of pieces) {
      const latin = latinOf(a.en)!
      for (const b of pieces) {
        if (a.base === b.base) continue
        if (checkTyped(latin, b).correct) confusions.push(`"${latin}" accepted for ${b.id}`)
      }
    }
    expect(confusions).toEqual([])
  }, 120_000)

  it("accepts every landmark's Latin name and never another landmark's on the same bone", () => {
    const problems: string[] = []
    for (const list of landmarksByPiece.values()) {
      for (const a of list) {
        const latin = latinOf(a.en)!
        if (!checkTyped(latin, itemById.get(a.id)!).correct) problems.push(`rejected "${latin}" for ${a.id}`)
        for (const b of list) {
          if (a.name !== b.name && checkTyped(latin, itemById.get(b.id)!).correct) problems.push(`"${latin}" accepted for ${b.id}`)
        }
      }
    }
    expect(problems).toEqual([])
  }, 120_000)
})
