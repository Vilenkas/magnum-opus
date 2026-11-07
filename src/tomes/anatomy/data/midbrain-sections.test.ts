import { describe, expect, it } from 'vitest'
import { ARC, NIGRA, OUTLINE, PES, PES_CENTRE, at, colliculusLinks, pesAngles, pesTestut, pesToday, ring, structures } from './midbrain-sections'

const ids = (level: 'superior' | 'inferior') => at(level).map((s) => s.id)
const get = (id: string) => structures.find((s) => s.id === id)!
const centre = (s: (typeof structures)[number]) => [200 + s.dx, s.cy] as const

describe('the midbrain in two sections', () => {
  it('has the oculomotor nucleus and the red nucleus at the anterior colliculus, the trochlear one at the posterior', () => {
    expect(ids('superior')).toEqual(expect.arrayContaining(['anterior-colliculus', 'oculomotor', 'red-nucleus', 'meynert', 'forel']))
    expect(ids('superior')).not.toContain('trochlear')
    expect(ids('inferior')).toEqual(expect.arrayContaining(['posterior-colliculus', 'trochlear', 'wernekink', 'lateral-lemniscus']))
    expect(ids('inferior')).not.toContain('red-nucleus')
    expect(ids('inferior')).not.toContain('oculomotor')
  })

  it('keeps the aqueduct, the lemniscus and the longitudinal bundle at both levels', () => {
    for (const id of ['aqueduct', 'grey', 'mlf', 'medial-lemniscus']) expect(get(id).levels).toEqual(['superior', 'inferior'])
  })

  it('stacks the floors dorsoventrally: tectum, aqueduct, motor nucleus, longitudinal bundle, red nucleus', () => {
    const ys = ['anterior-colliculus', 'aqueduct', 'oculomotor', 'mlf', 'red-nucleus'].map((id) => get(id).cy)
    expect(ys).toEqual([...ys].sort((a, b) => a - b))
  })

  it('keeps every structure inside the section, and the tegmentum behind the substantia nigra', () => {
    for (const s of structures) {
      const [x, y] = centre(s)
      const e = ((x + s.rx - OUTLINE.cx) / OUTLINE.rx) ** 2 + ((y - OUTLINE.cy) / OUTLINE.ry) ** 2
      expect(e, s.id).toBeLessThan(1)
      // Where the nigra runs (its arc of angles), the tegmentum stays inside it.
      const angle = (Math.atan2(x - PES_CENTRE.x, y - PES_CENTRE.y) * 180) / Math.PI
      if (s.floor === 'tegmentum' && angle >= ARC.from - 10 && angle <= ARC.to)
        expect(Math.hypot(x - PES_CENTRE.x, y - PES_CENTRE.y) + Math.max(s.rx, s.ry), s.id).toBeLessThan(NIGRA.r0)
    }
  })

  it('puts the pes outside the nigra and inside the section', () => {
    expect(PES.r0).toBeGreaterThan(NIGRA.r1)
    for (let a = ARC.from; a <= ARC.to; a += 4) {
      const [x, y] = ring(a, PES.r1)
      expect(((x - OUTLINE.cx) / OUTLINE.rx) ** 2 + ((y - OUTLINE.cy) / OUTLINE.ry) ** 2, `angle ${a}`).toBeLessThan(1)
    }
  })

  it('divides the pes in a fifth, three fifths and a fifth, in both descriptions', () => {
    for (const pes of [pesTestut, pesToday]) {
      expect(pes.map((s) => s.share)).toEqual([1 / 5, 3 / 5, 1 / 5])
      const arcs = pesAngles(pes)
      expect(arcs[0].from).toBe(ARC.from)
      expect(arcs.at(-1)!.to).toBeCloseTo(ARC.to)
    }
    expect(pesTestut[0].name).toMatch(/geniculado/)
    expect(pesTestut[2].name).toMatch(/Türck/)
  })

  it('joins the anterior colliculus to the external geniculate body and the posterior to the internal (AEPI)', () => {
    expect(colliculusLinks.map((l) => `${l.colliculus[0]}${l.geniculate.split(' ').at(-1)![0]}`.toUpperCase())).toEqual(['AE', 'PI'])
    expect(get('lateral-lemniscus').levels).toEqual(['inferior'])
  })
})
