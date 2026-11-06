import { describe, expect, it } from 'vitest'
import { circuits, pathEnds, pathXs, type PartKind } from './nerve-circuits'

const MIDLINE = 300

describe.each(circuits)('$name', (circuit) => {
  const { stages } = circuit

  it('is one continuous path from the stimulus to the muscle', () => {
    for (let i = 1; i < stages.length; i++)
      expect(pathEnds(stages[i].d).start, `${stages[i - 1].id} → ${stages[i].id}`).toEqual(pathEnds(stages[i - 1].d).end)
    expect(stages.at(-1)!.kind).toBe('effector')
  })

  it('runs each neuron by the law of dynamic polarization: dendrite, cell body, axon', () => {
    const order: PartKind[] = ['receptor', 'synapse', 'dendrite', 'cell', 'axon', 'effector']
    for (let n = 0; n < circuit.neurons.length; n++) {
      const kinds = stages.filter((s) => s.neuron === n).map((s) => order.indexOf(s.kind))
      expect(kinds, `neuron ${n}`).toEqual([...kinds].sort((a, b) => a - b))
      expect(stages.some((s) => s.neuron === n && s.kind === 'cell'), `neuron ${n} has a body`).toBe(true)
    }
  })

  it('passes from one neuron to the next only at a synapse, after an axon', () => {
    for (let i = 1; i < stages.length; i++) {
      if (stages[i].neuron === stages[i - 1].neuron) continue
      expect(stages[i].kind).toBe('synapse')
      expect(stages[i - 1].kind).toBe('axon')
    }
  })

  it('has two neurons, the second one the motor cell of the anterior horn', () => {
    expect(circuit.neurons).toHaveLength(2)
    expect(circuit.neurons[1].role).toMatch(/asta anterior/)
  })
})

describe('the two movements', () => {
  const [reflex, voluntary] = circuits

  it('share the final common path: the motor cell, its axon and the muscle', () => {
    const tail = (c: typeof reflex) => c.stages.slice(-3).map((s) => s.d)
    expect(tail(reflex)).toEqual(tail(voluntary))
  })

  it('keeps the reflex on one side of the cord', () => {
    for (const s of reflex.stages) expect(Math.min(...pathXs(s.d)), s.id).toBeGreaterThan(MIDLINE)
  })

  it('crosses the midline once in the voluntary path: the cortex moves the opposite side', () => {
    const [cortex] = voluntary.stages
    expect(pathEnds(cortex.d).start[0]).toBeLessThan(MIDLINE)
    expect(pathEnds(voluntary.stages.at(-1)!.d).end[0]).toBeGreaterThan(MIDLINE)
    const sides = voluntary.stages.map((s) => Math.sign(pathEnds(s.d).end[0] - MIDLINE))
    const changes = sides.filter((s, i) => i > 0 && s !== sides[i - 1]).length
    expect(changes).toBe(1)
    expect(voluntary.stages.find((s) => s.id === 'decussation')).toBeDefined()
  })
})
