import { describe, expect, it } from 'vitest'
import { seededRng } from '@/forge/practice'
import { landmarkById, landmarksByPiece } from '../data/landmarks'
import { pieceById, pieces } from '../data/skeleton'
import { checkTyped, normalize } from './answer'
import { boneItems, buildPool, createRound, isLandmarkHit, itemById, makeOptions, pickTargets } from './engine'
import { hardestPieces, weightOf } from './stats'

const seeded = seededRng

const piece = (id: string) => {
  const p = pieceById.get(id)
  if (!p) throw new Error(`unknown piece ${id}`)
  return p
}

const item = (id: string) => {
  const i = itemById.get(id)
  if (!i) throw new Error(`unknown item ${id}`)
  return i
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
    // Every pair of pieces (~70k checks): ~25 s alone, more when the machine is busy.
  }, 90_000)

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
    const pool = buildPool({ subject: 'bones', region: 'all', includeNonBone: false })
    expect(pool.length).toBe(210)
    expect(pool.every((p) => p.tissue === 'bone')).toBe(true)
  })

  it('filters by region', () => {
    const pool = buildPool({ subject: 'bones', region: 'lower-limb', includeNonBone: false })
    expect(pool.length).toBeGreaterThan(0)
    expect(pool.every((p) => p.region === 'lower-limb')).toBe(true)
  })

  it('builds landmark pools by the region of their bone', () => {
    const pool = buildPool({ subject: 'landmarks', region: 'upper-limb', includeNonBone: false })
    expect(pool.length).toBeGreaterThan(50)
    expect(pool.every((l) => l.subject === 'landmarks' && l.region === 'upper-limb')).toBe(true)
    expect(pool.some((l) => l.id === 'greater-tubercle--humerus-r')).toBe(true)
  })
})

describe('pickTargets', () => {
  it('never repeats a piece within a round', () => {
    const ids = pickTargets(boneItems, {}, 50, seeded(1))
    expect(new Set(ids).size).toBe(50)
  })

  it('caps the round at the pool size', () => {
    const pool = buildPool({ subject: 'bones', region: 'neck', includeNonBone: false })
    expect(pickTargets(pool, {}, 10, seeded(1))).toHaveLength(pool.length)
  })

  it('favours pieces you keep missing', () => {
    const pool = buildPool({ subject: 'bones', region: 'all', includeNonBone: false })
    const stats = { 'femur-r': { seen: 20, wrong: 20, last: 0 } }
    const rng = seeded(42)
    let hits = 0
    for (let i = 0; i < 2000; i++) if (pickTargets(pool, stats, 10, rng).includes('femur-r')) hits++
    // Baseline chance is 10/210 ≈ 4.8%; a ~3x weight should roughly double it at least.
    expect(hits / 2000).toBeGreaterThan(0.1)
  })
})

describe('makeOptions', () => {
  it('returns four distinct items including the target', () => {
    for (let seed = 0; seed < 50; seed++) {
      const opts = makeOptions(item('lunate-bone-r'), seeded(seed))
      expect(opts).toHaveLength(4)
      expect(new Set(opts).size).toBe(4)
      expect(opts).toContain('lunate-bone-r')
    }
  })

  it('prefers distractors from the same group', () => {
    const opts = makeOptions(item('lunate-bone-r'), seeded(7)).map(item)
    expect(opts.filter((p) => p.group === 'carpals').length).toBeGreaterThanOrEqual(3)
  })

  it('never shows two options with the same name unless one is the contralateral twin', () => {
    for (let seed = 0; seed < 100; seed++) {
      const opts = makeOptions(item('femur-r'), seeded(seed)).map(item)
      expect(opts.filter((p) => p.base === 'Fémur').length).toBeLessThanOrEqual(2)
      const others = opts.filter((p) => p.base !== 'Fémur')
      expect(new Set(others.map((p) => p.base)).size).toBe(others.length)
    }
  })

  it('draws landmark distractors from the same bone, all with different names', () => {
    for (let seed = 0; seed < 50; seed++) {
      const opts = makeOptions(item('greater-trochanter--femur-r'), seeded(seed)).map(item)
      expect(opts).toHaveLength(4)
      expect(opts.every((o) => o.pieceId === 'femur-r')).toBe(true)
      expect(new Set(opts.map((o) => o.name)).size).toBe(4)
    }
  })

  it('falls back to related bones when a bone has few landmarks', () => {
    const sparse = [...landmarksByPiece.entries()].find(([, ls]) => ls.length === 1)
    expect(sparse).toBeDefined()
    const only = sparse![1][0]
    expect(makeOptions(item(only.id), seeded(3))).toHaveLength(4)
  })
})

describe('createRound', () => {
  it('builds options only in identify mode', () => {
    const base = { subject: 'bones', region: 'all', includeNonBone: false, length: 10 } as const
    const identify = createRound({ ...base, mode: 'identify' }, {}, seeded(3))
    const locate = createRound({ ...base, mode: 'locate' }, {}, seeded(3))
    expect(identify).toHaveLength(10)
    expect(identify.every((q) => q.options?.length === 4)).toBe(true)
    expect(locate.every((q) => q.options === undefined)).toBe(true)
  })

  it('asks about landmarks when that is the subject', () => {
    const round = createRound(
      { subject: 'landmarks', mode: 'identify', region: 'all', includeNonBone: false, length: 10 },
      {},
      seeded(5),
    )
    expect(round.every((q) => landmarkById.has(q.targetId))).toBe(true)
  })
})

describe('isLandmarkHit', () => {
  const onFemur = landmarksByPiece.get('femur-r')!
  const at = (id: string) => landmarkById.get(id)!.position
  const target = 'greater-trochanter--femur-r'

  it('accepts a click right on the target', () => {
    expect(isLandmarkHit(target, 'femur-r', at(target), onFemur, 0.05)).toBe(true)
  })

  it('rejects a click closer to another landmark', () => {
    expect(isLandmarkHit(target, 'femur-r', at('lesser-trochanter--femur-r'), onFemur, 0.05)).toBe(false)
  })

  it('rejects clicks on another bone or too far away', () => {
    expect(isLandmarkHit(target, 'femur-l', at(target), onFemur, 0.05)).toBe(false)
    const p = at(target)
    expect(isLandmarkHit(target, 'femur-r', [p[0] - 0.2, p[1], p[2]], onFemur, 0.05)).toBe(false)
  })
})

describe('checkTyped for landmarks', () => {
  it('accepts names, classical aliases and TA English', () => {
    expect(checkTyped('trocanter mayor', item('greater-trochanter--femur-r')).correct).toBe(true)
    expect(checkTyped('troquíter', item('greater-tubercle--humerus-l')).correct).toBe(true)
    expect(checkTyped('epitroclea', item('medial-epicondyle-of-humerus--humerus-r')).correct).toBe(true)
    expect(checkTyped('greater trochanter', item('greater-trochanter--femur-r')).correct).toBe(true)
  })

  it('does not confuse landmarks on the same bone', () => {
    const confusions: string[] = []
    for (const list of landmarksByPiece.values()) {
      for (const a of list) {
        for (const b of list) {
          if (a.name !== b.name && checkTyped(a.name, item(b.id)).correct) confusions.push(`${a.name} → ${b.id}`)
        }
      }
    }
    expect(confusions).toEqual([])
    // Every pair of pieces (~70k checks): ~25 s alone, more when the machine is busy.
  }, 90_000)
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
