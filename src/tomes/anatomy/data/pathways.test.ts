import { describe, expect, it } from 'vitest'
import { crossingHeights, crossings, deficits, levelAt, levels, lesions, pathways, SITES, type PathwayId, type Side } from './pathways'

const at = (id: string, side: Side = 'left') => {
  const d = deficits(lesions.find((l) => l.id === id)!, side)
  // Only what is lost, to compare whole syndromes at once.
  return Object.fromEntries(Object.entries(d).filter(([, sides]) => sides.length)) as Partial<Record<PathwayId, Side[]>>
}
const route = (id: PathwayId, i = 0) => pathways.find((p) => p.id === id)!.routes[i]

describe('the scheme', () => {
  it('stacks the levels without gaps', () => {
    for (let i = 1; i < levels.length; i++) expect(levels[i].top).toBe(levels[i - 1].bottom)
  })

  it('chains every neuron to the next: each starts where the previous one ends', () => {
    for (const p of pathways)
      for (const r of p.routes) {
        const main = r.filter((n) => !n.minor)
        for (let i = 1; i < main.length; i++) expect(main[i].points[0], `${p.id}: ${main[i].name}`).toEqual(main[i - 1].points.at(-1))
      }
  })

  it('starts the sensory pathways at the root of the side they serve, and ends the motor ones at its muscles', () => {
    for (const p of pathways)
      for (const r of p.routes) {
        if (p.kind === 'sensory') expect(r[0].points[0]).toEqual(SITES.ganglion)
        else expect(r.at(-1)!.points.at(-1)).toEqual(SITES.muscle)
      }
  })

  it('places every lesion inside its level', () => {
    for (const l of lesions) expect(levelAt(l.cy)?.id, l.id).toBe(l.level)
  })
})

describe('the crossings (Testut pp. 1119, 1126, 1133)', () => {
  it('crosses every conscious pathway once: each half of the brain feels and moves the other half of the body', () => {
    for (const id of ['lemniscal', 'pain', 'pyramidal', 'striatal'] as const) expect(crossings(route(id)), id).toBe(1)
    expect(crossings(route('touch', 0))).toBe(1)
    expect(crossings(route('touch', 1))).toBe(1)
  })

  it('leaves the direct cerebellar fascicle uncrossed', () => {
    expect(crossings(route('spinocerebellar'))).toBe(0)
  })

  it('crosses the cerebellar motor pathway three times, so it ends on the side of its cerebellar hemisphere', () => {
    expect(crossings(route('cerebellar'))).toBe(3)
    const [pons, wernekink, forel] = crossingHeights(route('cerebellar'))
    expect(levelAt(pons)?.id).toBe('pons')
    // Both in the midbrain: Wernekink's under the red nucleus, Forel's just as the rubrospinal fibres leave it.
    expect(levelAt(wernekink)?.id).toBe('peduncle')
    expect(levelAt(forel)?.id).toBe('peduncle')
    expect(forel).toBeLessThan(wernekink)
  })

  it('crosses the sensory fibres at different heights: short ones where they enter, medium ones a few segments up, long ones in the medulla', () => {
    const [pain] = crossingHeights(route('pain'))
    const [touch] = crossingHeights(route('touch', 0))
    const [lemniscus] = crossingHeights(route('lemniscal'))
    expect(Math.abs(pain - SITES.rootEntry[1])).toBeLessThan(5)
    expect(touch).toBeLessThan(pain)
    expect(levelAt(touch)?.id).toBe('lumbar')
    expect(levelAt(lemniscus)?.id).toBe('medulla')
  })

  it('crosses the pinniform decussation above the pyramidal one', () => {
    const [lemniscus] = crossingHeights(route('lemniscal'))
    const [pyramids] = crossingHeights(route('pyramidal'))
    expect(levelAt(pyramids)?.id).toBe('medulla')
    expect(lemniscus).toBeLessThan(pyramids)
  })
})

describe('the syndromes', () => {
  it('no pathway is touched by the lack of a lesion', () => {
    expect(Object.values(deficits(null, 'left')).flat()).toEqual([])
  })

  it('motor cortex: crossed paralysis, nothing else', () => {
    expect(at('cortex')).toEqual({ pyramidal: ['right'] })
  })

  it('internal capsule: crossed hemiplegia and hemianaesthesia', () => {
    expect(at('capsule')).toEqual({ pyramidal: ['right'], lemniscal: ['right'], pain: ['right'], touch: ['right'] })
  })

  it('thalamus: crossed hemianaesthesia without paralysis', () => {
    expect(at('thalamus')).toEqual({ lemniscal: ['right'], pain: ['right'], touch: ['right'] })
  })

  it('pes pedunculi: crossed paralysis without anaesthesia', () => {
    const d = at('peduncle')
    expect(d.pyramidal).toEqual(['right'])
    expect(d.lemniscal ?? d.pain ?? d.touch).toBeUndefined()
  })

  it('cerebellar hemisphere: incoordination on its own side', () => {
    expect(at('cerebellum')).toEqual({ cerebellar: ['left'], spinocerebellar: ['left'] })
    expect(at('cerebellum', 'right')).toEqual({ cerebellar: ['right'], spinocerebellar: ['right'] })
  })

  it('hemisection of the cord: Brown-Séquard, with touch spared on both sides', () => {
    const d = at('hemisection')
    expect(d.pyramidal).toEqual(['left'])
    expect(d.lemniscal).toEqual(['left'])
    expect(d.spinocerebellar).toEqual(['left'])
    expect(d.pain).toEqual(['right'])
    expect(d.touch).toBeUndefined()
  })

  it('anterolateral fascicle: crossed loss of pain and temperature only', () => {
    expect(at('anterolateral')).toEqual({ pain: ['right'] })
  })

  it('posterior horn: pain and temperature lost on the same side only', () => {
    expect(at('posteriorHorn')).toEqual({ pain: ['left'] })
  })

  it('grey commissure: pain and temperature lost on both sides, touch kept (syringomyelic dissociation)', () => {
    expect(at('commissure')).toEqual({ pain: ['left', 'right'] })
  })

  it('a lesion on the right is the mirror of one on the left', () => {
    for (const l of lesions) {
      const left = deficits(l, 'left')
      const right = deficits(l, 'right')
      for (const p of pathways) expect(right[p.id].map((s) => (s === 'left' ? 'right' : 'left')).sort(), `${l.id} ${p.id}`).toEqual([...left[p.id]].sort())
    }
  })
})
