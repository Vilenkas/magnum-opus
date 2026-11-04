import { describe, expect, it } from 'vitest'
import { boneCount, countOf, divisionCount, type CountNode } from './bone-count'
import { pieces } from './skeleton'

const division = (id: string) => boneCount.find((d) => d.id === id)!
const find = (nodes: CountNode[], name: string): CountNode | undefined => {
  for (const n of nodes) {
    if (n.name === name) return n
    const inner = n.children && find(n.children, name)
    if (inner) return inner
  }
}
const leaves = (nodes: CountNode[]): CountNode[] => nodes.flatMap((n) => (n.children ? leaves(n.children) : [n]))

describe('bone count', () => {
  it('adds up to the classical 206 = 80 axial + 126 appendicular', () => {
    expect(divisionCount(division('axial'))).toBe(80)
    expect(divisionCount(division('appendicular'))).toBe(126)
  })

  it.each([
    ['axial', 'Cráneo', 22],
    ['axial', 'Neurocráneo', 8],
    ['axial', 'Viscerocráneo', 14],
    ['axial', 'Huesecillos del oído', 6],
    ['axial', 'Columna vertebral', 26],
    ['axial', 'Vértebras cervicales', 7],
    ['axial', 'Tórax (esternón y costillas)', 25],
    ['axial', 'Costillas', 24],
    ['appendicular', 'Cintura escapular', 4],
    ['appendicular', 'Miembros superiores', 60],
    ['appendicular', 'Carpo', 16],
    ['appendicular', 'Cintura pélvica', 2],
    ['appendicular', 'Miembros inferiores', 60],
    ['appendicular', 'Tarso', 14],
  ])('%s › %s has %i bones', (id, name, expected) => {
    expect(countOf(find(division(id).regions, name)!)).toBe(expected)
  })

  it('gives every leaf a count and leaves counts off branches', () => {
    for (const d of boneCount) {
      for (const leaf of leaves(d.regions)) expect(leaf.count, leaf.name).toBeGreaterThan(0)
      const branches = (nodes: CountNode[]): CountNode[] =>
        nodes.flatMap((n) => (n.children ? [n, ...branches(n.children)] : []))
      for (const branch of branches(d.regions)) expect(branch.count, branch.name).toBeUndefined()
    }
  })

  it('names single bones as the 3D model does', () => {
    const modelNames = new Set(pieces.map((p) => p.base))
    const generic = /^(Vértebras|Verdaderas|Falsas|Flotantes|Metacarpianos|Metatarsianos|Proximales|Medias|Distales)/
    // The model splits the sternum into manubrium, body and xiphoid process.
    const composite = new Set(['Esternón'])
    const missing = boneCount
      .flatMap((d) => leaves(d.regions))
      .filter((leaf) => !generic.test(leaf.name) && !composite.has(leaf.name) && !modelNames.has(leaf.name))
      .map((leaf) => leaf.name)
    expect(missing).toEqual([])
  })
})
