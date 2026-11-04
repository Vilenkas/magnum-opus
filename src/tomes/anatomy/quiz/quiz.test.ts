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
  const ok = (input: string, id: string) => expect(checkTyped(input, piece(id)).correct, input).toBe(true)
  const verdict = (input: string, id: string) => checkTyped(input, piece(id))

  it('accepts the Spanish name without accents or side', () => {
    expect(verdict('femur', 'femur-r')).toEqual({ correct: true, exact: true })
  })

  it('accepts aliases and the TA English name', () => {
    ok('fíbula', 'fibula-l')
    ok('Fibula', 'fibula-l')
    ok('omóplato', 'scapula-r')
    ok('fifth metacarpal', 'fifth-metacarpal-bone-r')
  })

  it('accepts a correct side, in any position and abbreviated', () => {
    ok('clavícula derecha', 'clavicle-r')
    ok('derecha clavícula', 'clavicle-r')
    ok('clavicula dcha', 'clavicle-r')
    expect(verdict('clavícula izq', 'clavicle-r')).toEqual({ correct: false, reason: 'wrong-side' })
  })

  it('ignores word order and filler words', () => {
    ok('el hueso escafoides', 'scaphoid-bone-l')
    ok('costilla octava', 'eighth-rib-r')
    ok('la octava costilla', 'eighth-rib-r')
  })

  it('accepts ordinals written any way', () => {
    for (const s of ['quinto metacarpiano', '5 metacarpiano', '5º metacarpiano', '5o metacarpiano', 'V metacarpiano', 'metacarpiano 5'])
      ok(s, 'fifth-metacarpal-bone-r')
    ok('1ª costilla', 'first-rib-l')
    ok('primer costilla', 'first-rib-l')
  })

  it('understands vertebral shorthand', () => {
    for (const s of ['T12', 'vértebra T12', 'D12', 'dorsal 12', 'duodécima vértebra torácica', 't 12', '12 dorsal'])
      ok(s, 'vertebra-t12')
    ok('L3', 'vertebra-l3')
    ok('c1', 'atlas-c1')
    ok('atlas', 'atlas-c1')
    expect(verdict('T11', 'vertebra-t12').correct).toBe(false)
  })

  it('understands finger names', () => {
    ok('falange distal del pulgar', 'distal-phalanx-of-first-finger-of-hand-r')
    ok('falange proximal del meñique de la mano', 'proximal-phalanx-of-fifth-finger-of-hand-l')
    ok('falange proximal del dedo gordo', 'proximal-phalanx-of-first-finger-of-foot-l')
    ok('falange media 3 dedo pie', 'middle-phalanx-of-third-finger-of-foot-r')
  })

  it('flags incomplete answers instead of failing them', () => {
    expect(verdict('falange distal', 'distal-phalanx-of-fifth-finger-of-hand-r')).toEqual({ correct: false, reason: 'incomplete' })
    expect(verdict('falange distal del meñique', 'distal-phalanx-of-fifth-finger-of-hand-r')).toEqual({ correct: false, reason: 'incomplete' })
    expect(verdict('costilla', 'eighth-rib-r')).toEqual({ correct: false, reason: 'incomplete' })
  })

  it('forgives small typos but flags them as inexact', () => {
    expect(verdict('astralago', 'talus-l')).toEqual({ correct: true, exact: false })
    expect(verdict('clavicla', 'clavicle-r')).toEqual({ correct: true, exact: false })
    expect(verdict('metacarpiamo 5', 'fifth-metacarpal-bone-r')).toEqual({ correct: true, exact: false })
  })

  it('never forgives a wrong number', () => {
    expect(verdict('séptima costilla', 'eighth-rib-r').correct).toBe(false)
    expect(verdict('4 metacarpiano', 'fifth-metacarpal-bone-r').correct).toBe(false)
  })

  it('rejects other bones, extra words and empty answers', () => {
    expect(verdict('tibia', 'fibula-r')).toEqual({ correct: false, reason: 'wrong-bone' })
    expect(verdict('falange distal del quinto dedo del pie', 'distal-phalanx-of-fifth-finger-of-hand-r').correct).toBe(false)
    expect(verdict('cuneiforme lateral', 'medial-cuneiform-bone-r').correct).toBe(false)
    expect(verdict('   ', 'fibula-r')).toEqual({ correct: false, reason: 'empty' })
  })
})

describe('checkTyped across the whole catalogue', () => {
  it("never accepts one piece's name as the answer for a different piece", () => {
    const confusions: string[] = []
    for (const a of pieces) {
      for (const b of pieces) {
        if (a.base === b.base) continue
        if (checkTyped(a.base, b).correct) confusions.push(`"${a.base}" accepted for ${b.id}`)
      }
    }
    expect(confusions).toEqual([])
  }, 30_000)

  it("accepts every piece's own name and aliases", () => {
    for (const p of pieces) {
      for (const name of [p.base, p.name, ...(p.aliases ?? []), p.en]) {
        expect(checkTyped(name, p).correct, `${name} → ${p.id}`).toBe(true)
      }
    }
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
