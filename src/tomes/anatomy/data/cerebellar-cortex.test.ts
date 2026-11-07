import { describe, expect, it } from 'vitest'
import { chains, layerAt, layers } from './cerebellar-cortex'
import { pathEnds, type PartKind } from './nerve-circuits'

const mid = (d: string) => {
  const { start, end } = pathEnds(d)
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
}

describe.each(chains)('$name', (chain) => {
  const { stages } = chain

  it('is one continuous path', () => {
    for (let i = 1; i < stages.length; i++)
      expect(pathEnds(stages[i].d).start, `${stages[i - 1].id} → ${stages[i].id}`).toEqual(pathEnds(stages[i - 1].d).end)
  })

  it('runs each neuron by dynamic polarization, and passes between neurons only at a synapse', () => {
    const order: PartKind[] = ['receptor', 'synapse', 'dendrite', 'cell', 'axon', 'effector']
    for (let n = 0; n < chain.neurons.length; n++) {
      const kinds = stages.filter((s) => s.neuron === n).map((s) => order.indexOf(s.kind))
      expect(kinds, `neuron ${n}`).toEqual([...kinds].sort((a, b) => a - b))
    }
    for (let i = 1; i < stages.length; i++)
      if (stages[i].neuron !== stages[i - 1].neuron) {
        expect(stages[i].kind, stages[i].id).toBe('synapse')
        expect(stages[i - 1].kind).toBe('axon')
      }
  })

  it('ends in the Purkinje cell, its axon and the central nuclei: the only way out of the cortex', () => {
    const last = stages.slice(-3)
    expect(last.map((s) => s.id)).toEqual(['purkinje', 'purkinje-axon', 'nuclei'])
    expect(chain.neurons.at(-1)!.name).toBe('Célula de Purkinje')
    expect(layerAt(pathEnds(last[2].d).end[1])).toBe('medulla')
  })

  it('reaches the Purkinje cell through a synapse just before it', () => {
    const i = stages.findIndex((s) => s.id === 'purkinje')
    expect(stages.slice(0, i).some((s) => s.kind === 'synapse' && s.neuron === chain.neurons.length - 1)).toBe(true)
  })
})

describe('the layers of the cortex', () => {
  const all = chains.flatMap((c) => c.stages)
  const find = (id: string) => all.find((s) => s.id === id)!

  it('stacks the layers without gaps, the molecular outermost', () => {
    for (let i = 1; i < layers.length; i++) expect(layers[i].top).toBe(layers[i - 1].bottom)
    expect(layers[0].id).toBe('molecular')
  })

  it('places each cell body in its layer', () => {
    expect(layerAt(mid(find('purkinje').d)[1])).toBe('purkinje')
    expect(layerAt(mid(find('granule').d)[1])).toBe('granular')
    expect(layerAt(mid(find('basket-cell').d)[1])).toBe('molecular')
  })

  it('ends the mossy fibre in the granular layer, in a glomerulus', () => {
    expect(layerAt(pathEnds(find('mossy').d).start[1])).toBe('medulla')
    expect(layerAt(pathEnds(find('glomerulus').d).start[1])).toBe('granular')
  })

  it('runs the parallel fibres in the molecular layer, and the climbing fibre up the dendrites there', () => {
    for (const id of ['parallel', 'parallel-left']) {
      const { start, end } = pathEnds(find(id).d)
      expect(layerAt(start[1])).toBe('molecular')
      expect(start[1]).toBe(end[1]) // along the folium, parallel to the surface
    }
    expect(layerAt(pathEnds(find('climbing').d).start[1])).toBe('medulla')
    expect(layerAt(pathEnds(find('tendrils').d).end[1])).toBe('molecular')
  })

  it('makes the mossy pathway the indirect one: one more neuron than the climbing fibre', () => {
    const [mossy, climbing] = chains
    expect(mossy.neurons.length).toBe(climbing.neurons.length + 1)
    expect(mossy.neurons[1].name).toBe('Grano')
  })
})
