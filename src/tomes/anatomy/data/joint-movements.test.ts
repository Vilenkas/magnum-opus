import { describe, expect, it } from 'vitest'
import { jointByKey } from './joint-index'
import { JOINT_MOTIONS, actionsOfPiece, isPolyarticular, jointsOfPiece, movementsOf } from './joint-movements'
import { softEntries } from './soft-tissues'
import { sources } from './sources'

const musclePieces = new Set(softEntries.filter((e) => e.set === 'muscles').map((e) => e.en))

describe('joint movements', () => {
  it('name only muscles of the model, and joints of the viewer', () => {
    for (const joint of JOINT_MOTIONS) {
      if (joint.joint) expect(jointByKey.has(joint.joint), joint.key).toBe(true)
      for (const mv of movementsOf(joint))
        for (const motor of [...mv.prime, ...(mv.assist ?? [])]) {
          expect(motor.pieces.length, motor.es).toBeGreaterThan(0)
          for (const piece of motor.pieces) expect(musclePieces.has(piece), `${mv.id}: ${piece}`).toBe(true)
        }
      for (const s of joint.sources) expect(sources[s.fuente], joint.key).toBeDefined()
    }
  })

  it('give every movement a prime mover and a unique id, and never list a muscle twice in one movement', () => {
    const ids = JOINT_MOTIONS.flatMap(movementsOf).map((mv) => mv.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const mv of JOINT_MOTIONS.flatMap(movementsOf)) {
      expect(mv.prime.length, mv.id).toBeGreaterThan(0)
      const prime = new Set(mv.prime.flatMap((m) => m.pieces))
      for (const piece of (mv.assist ?? []).flatMap((m) => m.pieces)) expect(prime.has(piece), `${mv.id}: ${piece}`).toBe(false)
    }
  })

  it('never make one muscle the prime mover of two opposite movements', () => {
    for (const joint of JOINT_MOTIONS)
      for (const { a, b } of joint.pairs) {
        if (!b) continue
        const ofA = new Set(a.prime.flatMap((m) => m.pieces))
        for (const piece of b.prime.flatMap((m) => m.pieces)) expect(ofA.has(piece), `${a.id}/${b.id}: ${piece}`).toBe(false)
      }
  })

  it('keep the ranges the sources give within a half turn, with the opposite of extension at 0°', () => {
    for (const mv of JOINT_MOTIONS.flatMap(movementsOf)) if (mv.degrees !== undefined) expect(mv.degrees, mv.id).toBeLessThanOrEqual(180)
    const flex = (id: string) => JOINT_MOTIONS.flatMap(movementsOf).find((mv) => mv.id === id)!
    expect(flex('knee-extension').degrees).toBe(0)
    expect(flex('plantarflexion').degrees!).toBeGreaterThan(flex('dorsiflexion').degrees!)
    expect(flex('knee-lateral-rotation').degrees!).toBeGreaterThan(flex('knee-medial-rotation').degrees!)
  })

  it('find the two-joint muscles from the data alone', () => {
    // Hamstrings cross hip and knee; the short head of the biceps only the knee.
    for (const piece of ['Semitendinosus muscle', 'Semimembranosus muscle', 'Long head of biceps femoris'])
      expect(jointsOfPiece(piece).sort(), piece).toEqual(['hip', 'knee'])
    expect(jointsOfPiece('Short head of biceps femoris')).toEqual(['knee'])
    // The rectus femoris flexes the hip as well; the vasti act only on the knee.
    expect(jointsOfPiece('Rectus femoris muscle').sort()).toEqual(['hip', 'knee'])
    for (const vastus of ['Vastus lateralis muscle', 'Vastus medialis muscle', 'Vastus intermedius muscle']) expect(jointsOfPiece(vastus)).toEqual(['knee'])
    // The gastrocnemius crosses the knee, the soleus does not.
    expect(jointsOfPiece('Medial head of gastrocnemius')).toContain('knee')
    expect(jointsOfPiece('Soleus muscle')).not.toContain('knee')
    // Biceps brachii: shoulder, elbow and forearm; brachialis only the elbow.
    expect(jointsOfPiece('Long head of biceps brachii').sort()).toEqual(['elbow', 'radio-ulnar', 'shoulder'])
    expect(jointsOfPiece('Brachialis muscle')).toEqual(['elbow'])
    expect(isPolyarticular('Long head of triceps brachii')).toBe(true)
    expect(isPolyarticular('Medial head of triceps brachii')).toBe(false)
  })

  it('know the classic antagonists', () => {
    const roles = (piece: string) => (actionsOfPiece.get(piece) ?? []).map((a) => `${a.movement.id}:${a.role}`)
    expect(roles('Iliacus muscle')).toContain('hip-flexion:prime')
    expect(roles('Gluteus maximus muscle')).toContain('hip-extension:prime')
    expect(roles('Tibialis anterior muscle')).toEqual(expect.arrayContaining(['dorsiflexion:prime', 'inversion:prime']))
    expect(roles('Fibularis longus muscle')).toEqual(expect.arrayContaining(['eversion:prime', 'plantarflexion:assist']))
    expect(roles('Supinator')).toEqual(['supination:prime'])
  })
})
