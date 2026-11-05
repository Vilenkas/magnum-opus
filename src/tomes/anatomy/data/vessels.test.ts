/// <reference types="node" />
// Node APIs only in this test: it reads the .glb files to check them against the metadata.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { indexItemOf, searchVessels, vesselEntries, vesselIndex } from './vessels'

/** Node names of a .glb, from its JSON chunk (no three.js needed). */
function glbNodeNames(file: string): string[] {
  const buf = readFileSync(fileURLToPath(new URL(`../assets/${file}`, import.meta.url)))
  const jsonLength = buf.readUInt32LE(12)
  const json = JSON.parse(buf.subarray(20, 20 + jsonLength).toString('utf8'))
  return (json.nodes as { name?: string }[]).map((n) => n.name ?? '')
}

describe('vessels', () => {
  it('uses unique ids', () => {
    const ids = vesselEntries.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each([
    ['vessels', 'vessels.glb'],
    ['lymph', 'lymph.glb'],
  ] as const)('matches the nodes of %s one to one', (set, file) => {
    const nodes = new Set(glbNodeNames(file))
    const ids = vesselEntries.filter((e) => e.set === set).map((e) => e.id)
    expect(ids.filter((id) => !nodes.has(id))).toEqual([])
    expect(nodes.size).toBe(ids.length)
  })

  it('names every structure and group in Spanish', () => {
    expect(vesselEntries.filter((e) => !e.es).map((e) => e.en)).toEqual([])
    expect(vesselEntries.flatMap((e) => e.groups.filter((g) => !g.es).map((g) => g.en))).toEqual([])
  })

  it('has the great vessels and the four chambers', () => {
    const ids = new Set(vesselEntries.map((e) => e.id))
    for (const id of ['aortic-arch', 'pulmonary-trunk', 'right-atrium', 'left-ventricle', 'superior-vena-cava'])
      expect(ids.has(id), id).toBe(true)
  })

  it('joins both sides of a paired vessel in one index line', () => {
    const ulnar = indexItemOf.get('ulnar-artery-r')!
    expect(ulnar.ids.sort()).toEqual(['ulnar-artery-l', 'ulnar-artery-r'])
    expect(vesselIndex.filter((i) => i.key === 'ulnar-artery')).toHaveLength(1)
  })

  it('finds vessels by any word, without accents, in Spanish, Latin or English', () => {
    expect(searchVessels('femoral profunda').map((i) => i.key)).toContain('deep-femoral-artery')
    expect(searchVessels('CUBITAL')[0]).toBeDefined()
    expect(searchVessels('aorta').map((i) => i.key)).toContain('abdominal-aorta')
    expect(searchVessels('zzzz')).toEqual([])
  })
})
