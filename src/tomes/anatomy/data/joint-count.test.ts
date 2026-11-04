import { describe, expect, it } from 'vitest'
import { countOf, divisionCount, type CountNode } from './bone-count'
import { jointCount } from './joint-count'
import { jointGenera } from './joints'

const leaves = (nodes: CountNode[]): CountNode[] => nodes.flatMap((n) => (n.children ? leaves(n.children) : [n]))
const division = (id: string) => jointCount.find((d) => d.id === id)!
const find = (nodes: CountNode[], name: string): CountNode | undefined => {
  for (const n of nodes) {
    if (n.name === name) return n
    const inner = n.children && find(n.children, name)
    if (inner) return inner
  }
}

/** Genera of the classification plate, plus the kinds it doesn't draw. */
const KINDS = new Set([
  ...jointGenera.map((g) => g.name),
  'Anfiartrosis',
  'Sutura',
  'Sindesmosis',
  'Gonfosis',
])

describe('joint count', () => {
  it('follows the four topographic groups of Testut', () => {
    expect(jointCount.map((d) => d.name)).toEqual(['Columna vertebral', 'Cabeza', 'Tórax', 'Miembros'])
  })

  it.each([
    ['spine', 52],
    ['head', 40],
    ['thorax', 45],
    ['limbs', 78],
  ])('%s adds up to %i', (id, total) => {
    expect(divisionCount(division(id))).toBe(total)
  })

  it.each([
    ['Sínfisis intervertebrales', 23],
    ['Articulaciones cigapofisarias', 23],
    ['Miembro superior', 39],
    ['Miembro inferior', 39],
    ['Mano', 22],
    ['Pie', 22],
  ])('%s has %i', (name, total) => {
    const node = jointCount.map((d) => find(d.regions, name)).find(Boolean)!
    expect(countOf(node)).toBe(total)
  })

  it('names every joint in Latin and tags it with a known genus', () => {
    const problems = jointCount
      .flatMap((d) => leaves(d.regions))
      .flatMap((l) => [
        ...(!l.latin ? [`${l.name}: no Latin`] : []),
        ...(!l.kind || !KINDS.has(l.kind) ? [`${l.name}: kind "${l.kind}"`] : []),
        ...(!l.count || l.count < 1 ? [`${l.name}: count`] : []),
      ])
    expect(problems).toEqual([])
  })

  it('keeps sibling names unique', () => {
    const dupes: string[] = []
    const walk = (nodes: CountNode[], path: string) => {
      const names = nodes.map((n) => n.name)
      for (const n of names) if (names.indexOf(n) !== names.lastIndexOf(n)) dupes.push(`${path}/${n}`)
      for (const n of nodes) if (n.children) walk(n.children, `${path}/${n.name}`)
    }
    for (const d of jointCount) walk(d.regions, d.id)
    expect([...new Set(dupes)]).toEqual([])
  })
})
