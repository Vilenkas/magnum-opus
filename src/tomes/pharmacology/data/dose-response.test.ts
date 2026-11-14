import { describe, expect, it } from 'vitest'
import { drugA, drugB, MAX_DOSE, stageAt } from './dose-response'

const doses = Array.from({ length: MAX_DOSE + 1 }, (_, i) => i)

describe('dose–response (Katzung fig. 22-1)', () => {
  it('deepens with the dose for both drugs', () => {
    for (const f of [drugA, drugB]) for (const d of doses.slice(1)) expect(f(d)).toBeGreaterThan(f(d - 1))
  })

  it('takes drug A, linear, all the way to coma', () => {
    expect(stageAt(drugA(MAX_DOSE))).toBe('coma')
  })

  it('lets drug B sedate and induce sleep, but not anaesthetise within the range', () => {
    const stages = new Set(doses.map((d) => stageAt(drugB(d))))
    expect(stages.has('sedation')).toBe(true)
    expect(stages.has('hypnosis')).toBe(true)
    expect(stages.has('anaesthesia')).toBe(false)
  })

  it('makes B’s steps beyond hypnosis much costlier than A’s', () => {
    const doseFor = (f: (d: number) => number, level: number) => doses.find((d) => f(d) >= level)!
    const extraA = doseFor(drugA, 60) - doseFor(drugA, 40)
    const extraB = doseFor(drugB, 60) - doseFor(drugB, 40)
    expect(extraB).toBeGreaterThan(2 * extraA)
  })
})
