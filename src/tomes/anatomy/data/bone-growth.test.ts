import { describe, expect, it } from 'vitest'
import { BONES, canal, EVENTS, grown, hasCentre, isFused, jointEnd, length, nails, stageAt, STAGES, type BoneId, type End } from './bone-growth'

const bone = (id: BoneId) => BONES.find((b) => b.id === id)!
const other = (e: End): End => (e === 'proximal' ? 'distal' : 'proximal')

describe('the stages of fig. 21', () => {
  it('follow Testut’s order: collar, primary centre, cavity, epiphyseal centres, fusion', () => {
    const order = [EVENTS.collar, EVENTS.primary, EVENTS.cavity, EVENTS.fertileCentre, EVENTS.otherCentre, EVENTS.otherFusion, EVENTS.fertileFusion]
    expect([...order].sort((a, b) => a - b)).toEqual(order)
    expect(STAGES.map((s) => s.letter)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Adulto'])
    expect(stageAt(0).letter).toBe('A')
    expect(stageAt(1).letter).toBe('Adulto')
  })

  it('grows the bone only while its growth cartilages last', () => {
    for (const b of BONES) {
      expect(length(b, EVENTS.primary)).toBe(length(b, 0))
      expect(length(b, 0.7)).toBeGreaterThan(length(b, 0.5))
      expect(length(b, 1)).toBe(length(b, EVENTS.fertileFusion))
    }
  })
})

describe('the unequal growth of the two ends', () => {
  it('makes the end away from the elbow and towards the knee the fertile one', () => {
    for (const b of BONES) {
      const fertile = grown(b, b.fertile, 1) > grown(b, other(b.fertile), 1) ? b.fertile : other(b.fertile)
      expect(fertile === jointEnd(b)).toBe(b.limb === 'lower')
    }
  })

  it('leans the nutrient canal towards the elbow and away from the knee', () => {
    for (const b of BONES) {
      const { towards, slant } = canal(b, 0.8)
      expect(slant).toBeGreaterThan(0)
      expect(towards === jointEnd(b)).toBe(b.limb === 'upper')
    }
    expect(canal(bone('femur'), 0.8).towards).toBe('proximal')
    expect(canal(bone('humerus'), 0.8).towards).toBe('distal')
  })

  it('fuses first the epiphysis the canal points to (Bérard)', () => {
    for (const b of BONES) {
      const first = canal(b, 0.8).towards
      const t = (EVENTS.otherFusion + EVENTS.fertileFusion) / 2
      expect(isFused(b, first, t)).toBe(true)
      expect(isFused(b, other(first), t)).toBe(false)
    }
  })

  it('ossifies first the epiphysis of the fertile end, as the knee’s ends before birth', () => {
    const femur = bone('femur')
    expect(hasCentre(femur, 'distal', EVENTS.fertileCentre)).toBe(true)
    expect(hasCentre(femur, 'proximal', EVENTS.fertileCentre)).toBe(false)
  })
})

describe('Duhamel’s and Hunter’s nails', () => {
  it('keeps the two nails of the diaphysis at the same distance while the epiphyses move away', () => {
    for (const b of BONES) {
      const before = nails(b, 0.3, 0.3)
      const after = nails(b, 0.3, 0.9)
      expect(after.lowerShaft - after.upperShaft).toBe(before.lowerShaft - before.upperShaft)
      expect(after.distalEpiphysis - after.lowerShaft).toBeGreaterThan(before.distalEpiphysis - before.lowerShaft)
      expect(after.upperShaft - after.proximalEpiphysis).toBeGreaterThan(before.upperShaft - before.proximalEpiphysis)
    }
  })

  it('moves the fertile end’s nail more', () => {
    const femur = bone('femur')
    const [a, b] = [nails(femur, 0.3, 0.3), nails(femur, 0.3, 1)]
    expect(b.distalEpiphysis - a.distalEpiphysis).toBeGreaterThan(a.proximalEpiphysis - b.proximalEpiphysis)
  })
})
