import { describe, expect, it } from 'vitest'
import { pathEnds, stages } from './circulation'

const next = (i: number) => stages[(i + 1) % stages.length]

describe('double circulation', () => {
  it('is one closed loop: each stretch starts where the previous one ends', () => {
    stages.forEach((s, i) => expect(pathEnds(next(i).d).start, `${s.id} → ${next(i).id}`).toEqual(pathEnds(s.d).end))
  })

  it('carries the same blood across every junction', () => {
    stages.forEach((s, i) => expect(next(i).bloodIn, `${s.id} → ${next(i).id}`).toBe(s.bloodOut))
  })

  it('changes the blood only in the capillaries', () => {
    for (const s of stages) expect(s.bloodIn !== s.bloodOut).toBe(s.kind === 'capillaries')
  })

  it('runs the major circuit from the left ventricle to the right atrium, and the minor from the right ventricle to the left atrium', () => {
    const run = (c: 'major' | 'minor') => stages.filter((s) => s.circuit === c).map((s) => s.id)
    expect(run('major')).toEqual(['lv', 'aorta', 'body-capillaries', 'venae-cavae', 'ra'])
    expect(run('minor')).toEqual(['rv', 'pulmonary-artery', 'lung-capillaries', 'pulmonary-veins', 'la'])
  })

  it('takes venous blood to the lungs in the pulmonary artery and arterial blood back in the pulmonary veins', () => {
    const byId = new Map(stages.map((s) => [s.id, s]))
    expect(byId.get('pulmonary-artery')!.bloodIn).toBe('venous')
    expect(byId.get('pulmonary-veins')!.bloodIn).toBe('arterial')
  })
})
