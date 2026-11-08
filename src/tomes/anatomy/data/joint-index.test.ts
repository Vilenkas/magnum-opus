import { describe, expect, it } from 'vitest'
import { JOINTS, jointIndex, jointOfPiece, jointParts, jointPieceList, jointPieces } from './joint-index'
import { pieceById } from './skeleton'
import { softEntries } from './soft-tissues'

describe('joint index', () => {
  it('gives every piece of the ligaments model to one joint', () => {
    const orphans = softEntries.filter((e) => e.set === 'joints' && !jointOfPiece.has(e.id)).map((e) => e.id)
    expect(orphans).toEqual([])
  })

  it('has no empty joint, and every bone it names is in the skeleton on the right side', () => {
    for (const joint of JOINTS) {
      expect(jointPieces.get(joint.key)!.length, joint.key).toBeGreaterThan(0)
      const { pieces, bones } = jointParts(joint, 'right')
      expect(pieces.length, joint.key).toBeGreaterThan(0)
      for (const b of bones) expect(pieceById.has(b), `${joint.key}: ${b}`).toBe(true)
      expect(pieces.every((p) => p.side !== 'left'), joint.key).toBe(true)
    }
  })

  it('keeps the left side apart from the right', () => {
    const shoulder = JOINTS.find((j) => j.key === 'glenohumeral')!
    expect(jointParts(shoulder, 'left').bones).toEqual(['scapula-l', 'humerus-l'])
    expect(jointParts(shoulder, 'right').pieces.map((p) => p.id)).toContain('glenoid-labrum-r')
    // Unpaired bones are shared by both sides.
    expect(jointParts(JOINTS.find((j) => j.key === 'sternoclavicular')!, 'left').bones).toContain('manubrium-of-sternum')
  })

  it('lists the capsule first on a joint’s card', () => {
    const elbow = jointPieceList(JOINTS.find((j) => j.key === 'elbow')!)
    expect(elbow[0].kind).toBe('articular capsule')
    expect(elbow.map((e) => e.id)).toContain('annular-ligament-of-radius-r')
  })

  it('finds a joint by its pieces and its old names', () => {
    const find = (q: string) => jointIndex.flatMap((s) => s.entries).filter((e) => e.haystack.includes(q)).map((e) => e.joint.key)
    expect(find('menisco')).toContain('knee')
    expect(find('coxofemoral')).toEqual(['hip'])
    expect(find('lisfranc')).toEqual(['tarsometatarsal'])
  })
})
