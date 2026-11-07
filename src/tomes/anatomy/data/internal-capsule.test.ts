import { describe, expect, it } from 'vitest'
import { alongPosterior, centroid, inside, nuclei, segments, somatotopy } from './internal-capsule'

const seg = (id: string) => segments.find((s) => s.id === id)!
const nuc = (id: string) => nuclei.find((n) => n.id === id)!

describe('the internal capsule', () => {
  it('has Testut’s five segments, four of them in the horizontal section', () => {
    expect(segments.map((s) => s.id)).toEqual(['anterior', 'genu', 'posterior', 'retrolenticular', 'sublenticular'])
    expect(segments.filter((s) => s.shape).length).toBe(4)
  })

  it('never lets a segment and a nucleus cover each other', () => {
    const shapes = [...nuclei.map((n) => n.shape), ...segments.flatMap((s) => (s.shape ? [s.shape] : []))]
    for (const a of shapes) for (const b of shapes) if (a !== b) expect(inside(centroid(a), b)).toBe(false)
  })

  it('folds into an angle open laterally: the genu is its most medial point toward the lenticular apex', () => {
    const x = (id: string) => centroid(seg(id).shape!)[0]
    expect(x('genu')).toBeGreaterThan(x('anterior'))
    expect(x('genu')).toBeGreaterThan(x('posterior'))
    expect(centroid(seg('anterior').shape!)[1]).toBeLessThan(centroid(seg('genu').shape!)[1])
    expect(centroid(seg('posterior').shape!)[1]).toBeGreaterThan(centroid(seg('genu').shape!)[1])
  })

  it('runs the anterior limb between the caudate and the lenticular, the posterior between the thalamus and the lenticular', () => {
    expect(seg('anterior').between).toEqual(['caudate', 'lenticular'])
    expect(seg('posterior').between).toEqual(['thalamus', 'lenticular'])
    // The lenticular nucleus lies laterally (smaller x) of both limbs.
    const lx = centroid(nuc('lenticular').shape)[0]
    for (const id of ['anterior', 'posterior']) expect(lx).toBeLessThan(centroid(seg(id).shape!)[0])
  })

  it('carries the head’s fibres in the genu and the limbs’ in the posterior limb, upper limb before lower', () => {
    expect(somatotopy.map((s) => s.segment)).toEqual(['genu', 'posterior', 'posterior'])
    const ats = somatotopy.map((s) => s.at)
    expect(ats).toEqual([...ats].sort((a, b) => a - b))
    for (const s of somatotopy.slice(1)) expect(inside(alongPosterior(s.at), seg('posterior').shape!), s.part).toBe(true)
  })

  it('puts the motor fibres in the genu and posterior limb, the optic radiations behind the lenticular nucleus', () => {
    expect(seg('genu').fibres.every((f) => f.kind === 'motor')).toBe(true)
    expect(seg('posterior').fibres.some((f) => /piramidal/.test(f.name))).toBe(true)
    expect(seg('retrolenticular').fibres[0].name).toMatch(/ópticas/)
    expect(seg('anterior').fibres.some((f) => f.kind === 'motor')).toBe(false)
  })
})
