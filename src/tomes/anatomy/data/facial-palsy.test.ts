import { describe, expect, it } from 'vitest'
import { BRANCHES, LESIONS, STATIONS, deficits, lesion, type Sign } from './facial-palsy'

const FACE: Sign[] = ['forehead', 'eye', 'upperLip', 'lowerLip', 'neck']
const sorted = (s: Set<Sign>) => [...s].sort()

describe('facial palsy: the nerve', () => {
  it('gives off its branches in Testut’s order: petrosal at the geniculate, then the stapedius, then the chorda, then the terminal two', () => {
    const at = (id: string) => BRANCHES.find((b) => b.id === id)!.at
    expect(at('petrosal')).toBe(STATIONS.geniculate)
    expect(at('petrosal')).toBeLessThan(at('stapedius'))
    expect(at('stapedius')).toBeLessThan(at('chorda'))
    expect(at('chorda')).toBeLessThan(STATIONS.stylomastoid)
    expect(at('temporofacial')).toBeGreaterThan(STATIONS.stylomastoid)
  })

  it('splits the face between the two terminal branches with nothing left over', () => {
    const served = BRANCHES.filter((b) => b.id.endsWith('facial')).flatMap((b) => b.serves)
    expect(served.sort()).toEqual([...FACE].sort())
  })
})

describe('facial palsy: the levels (Moore 8.ª p. 871)', () => {
  it('takes only the muscles at the stylomastoid foramen, as Testut’s section outside the skull', () => {
    expect(sorted(deficits(lesion('stylomastoid')))).toEqual([...FACE].sort())
  })

  it('adds taste, saliva and tears near the geniculate ganglion', () => {
    const d = deficits(lesion('geniculate'))
    for (const s of [...FACE, 'taste', 'saliva', 'tears', 'hyperacusis'] as Sign[]) expect(d.has(s)).toBe(true)
  })

  it('spares only the tears between the geniculate and the chorda', () => {
    for (const id of ['tympanic', 'mastoid'] as const) {
      const d = deficits(lesion(id))
      expect(d.has('tears')).toBe(false)
      expect(d.has('taste')).toBe(true)
      expect(d.has('saliva')).toBe(true)
    }
  })

  it('makes sounds loud only when the lesion is above the nerve to the stapedius (Moore p. 1090)', () => {
    expect(deficits(lesion('tympanic')).has('hyperacusis')).toBe(true)
    expect(deficits(lesion('mastoid')).has('hyperacusis')).toBe(false)
  })

  it('catches the auditory nerve in the internal meatus, and the VI nucleus at the genu, but not the intermediary inside the pons', () => {
    const meatus = deficits(lesion('meatus'))
    expect(meatus.has('hearing')).toBe(true)
    expect(meatus.has('taste')).toBe(true)
    const nucleus = deficits(lesion('nucleus'))
    expect(nucleus.has('gaze')).toBe(true)
    expect(nucleus.has('taste')).toBe(false)
    expect(nucleus.has('tears')).toBe(false)
    for (const s of FACE) expect(nucleus.has(s)).toBe(true)
  })

  it('spares the forehead and the eye in a central palsy, which takes only the lower face (Moore p. 1090)', () => {
    expect(sorted(deficits(lesion('central')))).toEqual(['lowerLip', 'neck', 'upperLip'])
  })

  it('loses more the closer the lesion is to the brainstem, along the trunk', () => {
    const trunk = LESIONS.filter((l) => l.kind === 'trunk' && l.id !== 'nucleus').sort((a, b) => a.at - b.at)
    for (let i = 1; i < trunk.length; i++) {
      const later = deficits(trunk[i])
      for (const s of later) expect(deficits(trunk[i - 1]).has(s)).toBe(true)
    }
  })

  it('takes half the face with each terminal branch', () => {
    expect(sorted(deficits(lesion('temporofacial')))).toEqual(['eye', 'forehead', 'upperLip'])
    expect(sorted(deficits(lesion('cervicofacial')))).toEqual(['lowerLip', 'neck'])
  })
})
