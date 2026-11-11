import { describe, expect, it } from 'vitest'
import { airway, failure, FAILURES, phase, spread, swallow } from './swallowing'

const none = failure('none')

describe('the crossroads at rest (Testut pp. 108–110)', () => {
  it('lets the air through from the nose to the larynx, crossing in front of the food path', () => {
    const air = airway(phase('breathing'), none)
    expect(air.has('larynx')).toBe(true)
    expect(air.has('oesophagus')).toBe(false)
  })

  it('stops breathing while the pharynx swallows', () => {
    expect(airway(phase('pharyngeal'), none).has('larynx')).toBe(false)
    expect(airway(phase('oral'), none).has('larynx')).toBe(true)
  })
})

describe('a normal swallow (Moore 8 p. 1041)', () => {
  it('keeps the bolus in the mouth in the oral phase, the fauces shut', () => {
    expect([...spread(['mouth'], phase('oral'), none)]).toEqual(['mouth'])
  })

  it('sends it only to the oesophagus in the pharyngeal phase', () => {
    const reached = spread(['oropharynx'], phase('pharyngeal'), none)
    expect(reached.has('oesophagus')).toBe(true)
    for (const c of ['nose', 'nasopharynx', 'larynx', 'mouth'] as const) expect(reached.has(c)).toBe(false)
  })

  it('ends with nothing left and nothing astray', () => {
    const { steps, outcomes } = swallow('none')
    expect(outcomes).toEqual(['swallowed'])
    expect(steps.at(-1)!.left).toEqual([])
    expect(steps.map((s) => s.breathes)).toEqual([true, false, true])
  })
})

describe('each failure, read off where the bolus goes', () => {
  it('velum: the bolus is driven up into the nose', () => {
    expect(swallow('velum').outcomes).toContain('nasal-regurgitation')
    expect(swallow('velum').outcomes).not.toContain('aspiration-during')
  })

  it('tongue and anterior pillars: the bolus slips into the open larynx before the swallow', () => {
    expect(swallow('fauces').outcomes[0]).toBe('aspiration-before')
  })

  it('larynx: the bolus goes in during the swallow, though most reaches the oesophagus', () => {
    const { steps, outcomes } = swallow('larynx')
    expect(outcomes).toEqual(['aspiration-during'])
    expect(steps[1].bolus).toContain('oesophagus')
  })

  it('upper oesophageal sphincter: the bolus stays in the pharynx and falls into the larynx after', () => {
    const { steps, outcomes } = swallow('ues')
    expect(steps[1].bolus).not.toContain('oesophagus')
    expect(outcomes).toContain('aspiration-after')
    expect(outcomes).toContain('residue')
  })

  it('every failure but none goes astray somewhere', () => {
    for (const f of FAILURES) {
      const { outcomes } = swallow(f.id)
      expect(outcomes.includes('swallowed')).toBe(f.id === 'none')
    }
  })
})
