import { describe, expect, it } from 'vitest'
import { classById } from './catalog'
import { targets, targetsOfClass, synapticClasses } from './synapse-targets'

describe('synaptic targets (Katzung fig. 24-1)', () => {
  it('names existing antiepileptic classes', () => {
    for (const t of targets) {
      const cls = classById.get(t.classId)
      expect(cls, t.id).toBeDefined()
      expect(cls!.parent).toBe('antiepileptics')
    }
  })

  it('damps the excitatory synapse and reinforces the inhibitory one', () => {
    // Sodium channels are presynaptic on the excitatory synapse; AMPA is postsynaptic there.
    expect(targetsOfClass('ae-sodium').every((t) => t.synapse === 'excitatory' && t.site === 'pre')).toBe(true)
    const ampa = targets.find((t) => t.id === 'ampa')!
    expect(ampa.synapse).toBe('excitatory')
    expect(ampa.site).toBe('post')
    // The GABA levers sit on the inhibitory synapse.
    expect(targetsOfClass('ae-gaba').every((t) => t.synapse === 'inhibitory')).toBe(true)
    expect(targets.find((t) => t.id === 'gaba-a')!.site).toBe('post')
    expect(targets.find((t) => t.id === 'gat1')!.site).toBe('pre')
    expect(targets.find((t) => t.id === 'gaba-t')!.site).toBe('glia')
  })

  it('lists every synaptic class once', () => {
    expect(synapticClasses).toEqual(['ae-sodium', 'ae-potassium', 'ae-alpha2delta', 'ae-sv2a', 'ae-ampa', 'ae-calcium-t', 'ae-gaba'])
    expect(new Set(synapticClasses).size).toBe(synapticClasses.length)
  })
})
