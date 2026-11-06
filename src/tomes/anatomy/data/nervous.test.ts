/// <reference types="node" />
// Node APIs only in this test: it reads the .glb to check it against the metadata.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { nervous, nervousSectionOf } from './nervous'
import { searchIndex } from './structure-index'

function glbNodeNames(file: string): string[] {
  const buf = readFileSync(fileURLToPath(new URL(`../assets/${file}`, import.meta.url)))
  const jsonLength = buf.readUInt32LE(12)
  const json = JSON.parse(buf.subarray(20, 20 + jsonLength).toString('utf8'))
  return (json.nodes as { name?: string }[]).map((n) => n.name ?? '')
}

const { entries, byId, index, itemOf } = nervous

describe('nervous system', () => {
  it('matches the nodes of nervous.glb one to one, with unique ids', () => {
    const nodes = new Set(glbNodeNames('nervous.glb'))
    const ids = entries.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter((id) => !nodes.has(id))).toEqual([])
    expect(nodes.size).toBe(ids.length)
  })

  it('names every piece and group in Spanish', () => {
    expect(entries.filter((e) => !e.es).map((e) => e.en)).toEqual([])
    expect([...new Set(entries.flatMap((e) => e.groups.filter((g) => !g.es).map((g) => g.en)))]).toEqual([])
  })

  it('gives every piece a known kind', () => {
    const kinds = new Set(['frontal', 'parietal', 'temporal', 'occipital', 'limbic', 'insula', 'sulcus', 'nucleus', 'white', 'tract', 'csf', 'cerebellum', 'brainstem', 'cord-white', 'cord-grey', 'nerve', 'meninges', 'sense'])
    expect(entries.filter((e) => !kinds.has(e.kind)).map((e) => e.id)).toEqual([])
  })

  it('has the twelve cranial nerves, each with its numeral', () => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    const names = new Set(index.map((i) => i.name))
    for (const n of numerals) expect([...names].some((name) => name.endsWith(`(${n})`)), n).toBe(true)
  })

  it('sorts the lobes into the cortex and the deep nuclei inside the cerebrum', () => {
    const section = (en: string) => nervousSectionOf(entries.find((e) => e.en === en)!)
    expect(section('Precentral gyrus')).toBe('cerebrum')
    expect(section('Thalamus')).toBe('deep')
    expect(section('Putamen')).toBe('deep')
    expect(section('Nucleus of hypoglossal nerve')).toBe('brainstem')
    expect(section('Pons')).toBe('brainstem')
    expect(byId.get('thalamus-l')?.kind).toBe('nucleus')
    expect(section('Corpus callosum')).toBe('deep')
    expect(entries.find((e) => e.en === 'Corpus callosum')!.kind).toBe('tract')
  })

  it('colours the gyri by their lobe', () => {
    expect(entries.find((e) => e.en === 'Precentral gyrus')!.kind).toBe('frontal')
    expect(entries.find((e) => e.en === 'Postcentral gyrus')!.kind).toBe('parietal')
  })

  it('joins both hemispheres of a structure in one index line', () => {
    expect(itemOf.get('thalamus-l')).toBe(itemOf.get('thalamus-r'))
    expect(itemOf.get('thalamus-l')!.ids).toHaveLength(2)
  })

  it('finds structures by their Spanish, Latin or English name', () => {
    expect(searchIndex('talamo', index).map((i) => i.key)).toContain('thalamus')
    expect(searchIndex('nervio optico', index).length).toBeGreaterThan(0)
  })
})
