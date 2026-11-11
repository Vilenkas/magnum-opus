import { describe, expect, it } from 'vitest'
import { JOINTS, jointIndex, jointOfPiece, jointParts, jointPieceList, jointPieces } from './joint-index'
import type { CountNode } from './bone-count'
import { jointCount } from './joint-count'
import { pieceById } from './skeleton'
import { softEntries } from './soft-tissues'

describe('joint index', () => {
  it('gives every piece of the ligaments model to one joint', () => {
    const orphans = softEntries.filter((e) => e.set === 'joints' && !jointOfPiece.has(e.id)).map((e) => e.id)
    expect(orphans).toEqual([])
  })

  it('has no empty joint, and every bone it names is in the skeleton on the right side', () => {
    for (const joint of JOINTS) {
      const { pieces, bones } = jointParts(joint, 'right')
      for (const b of bones) expect(pieceById.has(b), `${joint.key}: ${b}`).toBe(true)
      expect(new Set(joint.bones).size, joint.key).toBe(joint.bones.length)
      if (joint.groups || joint.pieces) {
        expect(pieces.length, joint.key).toBeGreaterThan(0)
        expect(pieces.every((p) => p.side !== 'left'), joint.key).toBe(true)
      } else {
        // Without pieces of its own, a joint is the meeting of at least two bones.
        expect(jointPieces.get(joint.key), joint.key).toEqual([])
        expect(bones.length, joint.key).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('has unique keys and names', () => {
    for (const field of ['key', 'es', 'en'] as const) {
      const values = JOINTS.map((j) => j[field])
      expect(values.filter((v, i) => values.indexOf(v) !== i), field).toEqual([])
    }
  })

  it('opens every joint of Lámina II, by its Latin name', () => {
    const latin = new Set(JOINTS.flatMap((j) => [j.la, ...(j.covers ?? [])]))
    const leaves = (nodes: CountNode[]): CountNode[] => nodes.flatMap((n) => (n.children ? leaves(n.children) : [n]))
    const missing = jointCount.flatMap((d) => leaves(d.regions)).filter((n) => !latin.has(n.latin!)).map((n) => `${n.name} (${n.latin})`)
    expect(missing).toEqual([])
  })

  it('shows a suture with both bones when it joins a pair, and one side when it joins two paired bones', () => {
    const sagittal = JOINTS.find((j) => j.key === 'sagittal-suture')!
    expect(jointParts(sagittal, 'right').bones).toEqual(['parietal-bone-l', 'parietal-bone-r'])
    const squamous = JOINTS.find((j) => j.key === 'squamous-suture')!
    expect(jointParts(squamous, 'left').bones).toEqual(['parietal-bone-l', 'temporal-bone-l'])
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
    expect(find('chopart').sort()).toEqual(['calcaneocuboid', 'talocalcaneonavicular'])
    expect(find('pterion').sort()).toEqual(['sphenofrontal-suture', 'sphenoparietal-suture', 'sphenosquamous-suture'])
    expect(find('odontoides')).toEqual(['median-atlanto-axial'])
  })
})
