import { describe, expect, it } from 'vitest'
import { pieceById, pieces, regionOf } from '../data/skeleton'
import { checkTyped, normalize } from './answer'
import { buildPool, createRound, makeOptions, pickTargets } from './engine'
import { hardestPieces, weightOf } from './stats'

/** Deterministic RNG (mulberry32) so tests are reproducible. */
function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const piece = (id: string) => {
  const p = pieceById.get(id)
  if (!p) throw new Error(`unknown piece ${id}`)
  return p
}

describe('normalize', () => {
  it('ignores accents, case and punctuation', () => {
    expect(normalize('  Fémur,  DERECHO ')).toBe('femur derecho')
    expect(normalize('Cóccix')).toBe('coccix')
  })
})

describe('checkTyped', () => {
  it('accepts the Spanish name without accents or side', () => {
    expect(checkTyped('femur', piece('femur-r'))).toEqual({ correct: true, exact: true })
  })

  it('accepts aliases and the TA English name', () => {
    expect(checkTyped('fíbula', piece('fibula-l')).correct).toBe(true)
    expect(checkTyped('Fibula', piece('fibula-l')).correct).toBe(true)
    expect(checkTyped('omóplato', piece('scapula-r')).correct).toBe(true)
  })

  it('accepts a correct side and rejects a wrong one', () => {
    expect(checkTyped('clavícula derecha', piece('clavicle-r')).correct).toBe(true)
    expect(checkTyped('clavícula izquierda', piece('clavicle-r'))).toEqual({ correct: false, reason: 'wrong-side' })
  })

  it('ignores leading articles and "hueso"', () => {
    expect(checkTyped('el hueso escafoides', piece('scaphoid-bone-l')).correct).toBe(true)
  })

  it('makes parenthesised qualifiers optional', () => {
    expect(checkTyped('atlas', piece('atlas-c1')).correct).toBe(true)
    expect(checkTyped('axis c2', piece('axis-c2')).correct).toBe(true)
  })

  it('forgives one typo on long names but flags it as inexact', () => {
    expect(checkTyped('astragalos', piece('talus-l'))).toEqual({ correct: true, exact: false })
    // Short names must be exact: "radio" vs "ratio" is not a typo worth forgiving.
    expect(checkTyped('ratio', piece('radius-r')).correct).toBe(false)
  })

  it('rejects other bones and empty answers', () => {
    expect(checkTyped('tibia', piece('fibula-r'))).toEqual({ correct: false, reason: 'wrong-bone' })
    expect(checkTyped('   ', piece('fibula-r'))).toEqual({ correct: false, reason: 'empty' })
  })
})

describe('buildPool', () => {
  it('defaults to bones only', () => {
    const pool = buildPool({ region: 'all', includeNonBone: false })
    expect(pool.length).toBe(210)
    expect(pool.every((p) => (p.tissue ?? 'bone') === 'bone')).toBe(true)
  })

  it('filters by region', () => {
    const pool = buildPool({ region: 'lower-limb', includeNonBone: false })
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((p) => regionOf(p).id === 'lower-limb')).toBe(true)
  })
})

describe('pickTargets', () => {
  it('never repeats a piece within a round', () => {
    const ids = pickTargets(pieces, {}, 50, seeded(1))
    expect(new Set(ids).size).toBe(50)
  })

  it('caps the round at the pool size', () => {
    const pool = buildPool({ region: 'neck', includeNonBone: false })
    expect(pickTargets(pool, {}, 10, seeded(1))).toHaveLength(pool.length)
  })

  it('favours pieces you keep missing', () => {
    const pool = buildPool({ region: 'all', includeNonBone: false })
    const stats = { 'femur-r': { seen: 20, wrong: 20, last: 0 } }
    const rng = seeded(42)
    let hits = 0
    for (let i = 0; i < 2000; i++) if (pickTargets(pool, stats, 10, rng).includes('femur-r')) hits++
    // Baseline chance is 10/210 ≈ 4.8%; a ~3x weight should roughly double it at least.
    expect(hits / 2000).toBeGreaterThan(0.1)
  })
})

describe('makeOptions', () => {
  it('returns four distinct pieces including the target', () => {
    for (let seed = 0; seed < 50; seed++) {
      const opts = makeOptions(piece('lunate-bone-r'), seeded(seed))
      expect(opts).toHaveLength(4)
      expect(new Set(opts).size).toBe(4)
      expect(opts).toContain('lunate-bone-r')
    }
  })

  it('prefers distractors from the same group', () => {
    const opts = makeOptions(piece('lunate-bone-r'), seeded(7)).map(piece)
    const sameGroup = opts.filter((p) => p.group === 'carpals')
    expect(sameGroup.length).toBeGreaterThanOrEqual(3)
  })

  it('never shows two options with the same name unless one is the contralateral twin', () => {
    for (let seed = 0; seed < 100; seed++) {
      const opts = makeOptions(piece('femur-r'), seeded(seed)).map(piece)
      const femurs = opts.filter((p) => p.base === 'Fémur')
      expect(femurs.length).toBeLessThanOrEqual(2)
      const others = opts.filter((p) => p.base !== 'Fémur')
      expect(new Set(others.map((p) => p.base)).size).toBe(others.length)
    }
  })
})

describe('createRound', () => {
  it('builds options only in identify mode', () => {
    const identify = createRound({ mode: 'identify', region: 'all', includeNonBone: false, length: 10 }, {}, seeded(3))
    const locate = createRound({ mode: 'locate', region: 'all', includeNonBone: false, length: 10 }, {}, seeded(3))
    expect(identify).toHaveLength(10)
    expect(identify.every((q) => q.options?.length === 4)).toBe(true)
    expect(locate.every((q) => q.options === undefined)).toBe(true)
  })
})

describe('stats', () => {
  it('weights unseen > mastered and missed > unseen', () => {
    const unseen = weightOf(undefined)
    expect(weightOf({ seen: 10, wrong: 0, last: 0 })).toBeLessThan(unseen)
    expect(weightOf({ seen: 10, wrong: 10, last: 0 })).toBeGreaterThan(unseen)
  })

  it('ranks the hardest pieces by error rate', () => {
    const ranked = hardestPieces({
      'talus-l': { seen: 4, wrong: 3, last: 0 },
      'femur-r': { seen: 4, wrong: 1, last: 0 },
      'radius-r': { seen: 1, wrong: 1, last: 0 }, // too few attempts to count
    })
    expect(ranked.map((r) => r.id)).toEqual(['talus-l', 'femur-r'])
  })
})
