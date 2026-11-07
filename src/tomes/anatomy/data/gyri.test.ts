import { describe, expect, it } from 'vitest'
import { centroid, fissures, gyri, inside, lineXAt, lineYAt, onFace, outlines, type Face } from './gyri'

const fissure = (face: Face, id: string) => fissures[face].find((f) => f.id === id)!.points

describe('the convolutions of the hemisphere', () => {
  it('keeps every convolution inside the outline of its face', () => {
    for (const g of gyri) for (const p of g.shape) expect(inside(p, outlines[g.face]), `${g.id} ${p}`).toBe(true)
  })

  it('never lets one convolution cover another', () => {
    for (const face of ['lateral', 'medial'] as const)
      for (const a of onFace(face))
        for (const b of onFace(face)) if (a !== b) expect(inside(centroid(a.shape), b.shape), `${a.id} in ${b.id}`).toBe(false)
  })

  it('counts on the outer face Testut’s four frontal, three parietal, three temporal and three occipital convolutions', () => {
    const count = (lobe: string) => onFace('lateral').filter((g) => g.lobe === lobe).length
    expect([count('frontal'), count('parietal'), count('temporal'), count('occipital')]).toEqual([4, 3, 3, 3])
  })

  it('puts the frontal lobe in front of the fissure of Rolando and the parietal behind it', () => {
    const rolando = fissure('lateral', 'rolando')
    for (const g of onFace('lateral').filter((g) => g.lobe === 'frontal' || g.lobe === 'parietal')) {
      const [x, y] = centroid(g.shape)
      const rx = lineXAt(rolando, Math.min(Math.max(y, 29), 212))!
      if (g.lobe === 'frontal') expect(x, g.id).toBeLessThan(rx)
      else expect(x, g.id).toBeGreaterThan(rx)
    }
  })

  it('puts the temporal lobe below the fissure of Sylvius, and the rolandic convolutions above it', () => {
    const sylvius = fissure('lateral', 'sylvius')
    for (const g of onFace('lateral')) {
      const [x, y] = centroid(g.shape)
      const sy = lineYAt(sylvius, x)
      if (sy === null) continue
      if (g.lobe === 'temporal') expect(y, g.id).toBeGreaterThan(sy)
      if (g.id === 'fa' || g.id === 'pa') expect(y, g.id).toBeLessThan(sy)
    }
  })

  it('places the cuneus above the calcarine fissure and the lingual lobule below it', () => {
    const calcarine = fissure('medial', 'calcarine')
    const [cx, cy] = centroid(gyri.find((g) => g.id === 'cuneus')!.shape)
    const [lx, ly] = centroid(gyri.find((g) => g.id === 'lingual')!.shape)
    expect(cy).toBeLessThan(lineYAt(calcarine, cx)!)
    expect(ly).toBeGreaterThan(lineYAt(calcarine, lx)!)
  })

  it('makes the limbic lobe of the gyrus of the corpus callosum and the hippocampal gyrus', () => {
    expect(gyri.filter((g) => g.lobe === 'limbic').map((g) => g.id).sort()).toEqual(['cingulate', 'hippocampus'])
  })

  it('gives every convolution its synonyms, and today’s name to all but the occipital ones', () => {
    for (const g of gyri) {
      expect(g.synonyms.length, g.id).toBeGreaterThan(5)
      if (!/^o\d/.test(g.id)) expect(g.modern, g.id).toBeTruthy()
    }
    expect(gyri.find((g) => g.id === 'fa')!.modern).toBe('Giro precentral')
    expect(gyri.find((g) => g.id === 'f3')!.synonyms).toMatch(/Broca/)
  })
})
