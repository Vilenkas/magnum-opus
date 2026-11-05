/// <reference types="node" />
// Node APIs only in this test: it reads the .glb files to check them against the metadata.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import soft from '../assets/soft-tissues.json'
import { pieceById } from './skeleton'

interface Entry {
  set: 'muscles' | 'joints' | 'insertions'
  id: string
  kind: string
  side: 'left' | 'right' | null
  en: string
  la: string | null
  es: string | null
  bone?: string
  musclePieces?: string[]
}

const entries = soft as Entry[]

/** Node names of a .glb, from its JSON chunk (no three.js needed). */
function glbNodeNames(file: string): string[] {
  const buf = readFileSync(fileURLToPath(new URL(`../assets/${file}`, import.meta.url)))
  const jsonLength = buf.readUInt32LE(12)
  const json = JSON.parse(buf.subarray(20, 20 + jsonLength).toString('utf8'))
  return (json.nodes as { name?: string }[]).map((n) => n.name ?? '')
}

describe('soft tissues', () => {
  it('uses unique ids', () => {
    const ids = entries.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each([
    ['muscles', 'muscles.glb'],
    ['joints', 'joints.glb'],
    ['insertions', 'insertions.glb'],
  ] as const)('matches the nodes of %s one to one', (set, file) => {
    const nodes = new Set(glbNodeNames(file))
    const ids = entries.filter((e) => e.set === set).map((e) => e.id)
    expect(ids.filter((id) => !nodes.has(id))).toEqual([])
    expect(nodes.size).toBe(ids.length)
  })

  it('places every insertion on a bone of the skeleton', () => {
    const lost = entries.filter((e) => e.set === 'insertions' && !pieceById.has(e.bone!)).map((e) => e.id)
    expect(lost).toEqual([])
  })

  it('links insertions to exported muscle pieces', () => {
    const muscles = new Set(entries.filter((e) => e.set === 'muscles').map((e) => e.id))
    const broken = entries
      .filter((e) => e.set === 'insertions')
      .flatMap((e) => (e.musclePieces ?? []).filter((p) => !muscles.has(p)).map((p) => `${e.id} -> ${p}`))
    expect(broken).toEqual([])
    // Tendons, ligaments and the unmodelled articularis genus have no muscle piece.
    const unlinked = new Set(entries.filter((e) => e.set === 'insertions' && !e.musclePieces?.length).map((e) => e.en))
    expect(unlinked.size).toBeLessThanOrEqual(6)
  })

  it('names almost everything in Spanish and Latin from TA2', () => {
    for (const set of ['muscles', 'joints'] as const) {
      const all = entries.filter((e) => e.set === set)
      const named = all.filter((e) => e.es && e.la)
      expect(named.length / all.length, set).toBeGreaterThan(0.95)
    }
  })
})
