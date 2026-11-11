import { describe, expect, it } from 'vitest'
import nervous from '../assets/nervous.json'
import soft from '../assets/soft-tissues.json'
import vessels from '../assets/vessels.json'
import { PLEXUSES, outcome } from './plexuses'
import { REGIONS } from './regions'
import { pieceById } from './skeleton'

type Named = { set?: string; en: string }
const muscleNames = new Set((soft as Named[]).filter((e) => e.set === 'muscles').map((e) => e.en))
const jointNames = new Set((soft as Named[]).filter((e) => e.set === 'joints').map((e) => e.en))
const vesselNames = new Set((vessels as Named[]).map((e) => e.en))
const nerveNames = new Set((nervous as Named[]).map((e) => e.en))
const bone = (id: string) => pieceById.has(id) || pieceById.has(`${id}-r`)

const lesionOf = (key: string) => {
  const r = REGIONS.find((x) => x.key === key)!
  const p = PLEXUSES[r.compression!.plexus]
  return { p, o: outcome(p, p.lesions.find((l) => l.id === r.compression!.lesion)!) }
}

describe('regions', () => {
  it('build every wall and content from pieces of the models', () => {
    for (const r of REGIONS) {
      expect(r.walls.length, r.key).toBeGreaterThanOrEqual(2)
      expect(r.contents.length, r.key).toBeGreaterThan(0)
      for (const w of r.walls)
        for (const part of w.parts) {
          expect((part.muscles?.length ?? 0) + (part.bones?.length ?? 0) + (part.joints?.length ?? 0), `${r.key}: ${part.es}`).toBeGreaterThan(0)
          for (const m of part.muscles ?? []) expect(muscleNames.has(m), `${r.key}: ${m}`).toBe(true)
          for (const j of part.joints ?? []) expect(jointNames.has(j), `${r.key}: ${j}`).toBe(true)
          for (const b of part.bones ?? []) expect(bone(b), `${r.key}: ${b}`).toBe(true)
        }
      for (const f of r.frame ?? []) expect(muscleNames.has(f) || bone(f), `${r.key} frame: ${f}`).toBe(true)
      for (const c of r.contents)
        for (const n of c.names) {
          const set = c.kind === 'nerve' ? nerveNames : c.kind === 'tendon' ? muscleNames : vesselNames
          expect(set.has(n), `${r.key}: ${n}`).toBe(true)
        }
    }
  })

  it('point every compression at a lesion of the plexus engine', () => {
    for (const r of REGIONS.filter((x) => x.compression)) {
      const p = PLEXUSES[r.compression!.plexus]
      expect(p.lesions.some((l) => l.id === r.compression!.lesion), r.key).toBe(true)
    }
  })

  it('spare the palm in the carpal tunnel, since the palmar branch leaves above it', () => {
    const { o } = lesionOf('carpal-tunnel')
    expect(o.skin.get('palmLateral')).toBe('ok')
    expect([...o.skin.values()]).toContain('lost')
  })

  it('take the deltoid with the quadrangular space', () => {
    const { p, o } = lesionOf('quadrangular-space')
    const deltoid = p.muscles.find((m) => /deltoides/i.test(m.name))!
    expect(o.muscles.get(deltoid.id)).toBe('lost')
  })

  it('hold the median nerve in the cubital fossa and the carpal tunnel, and the ulnar nerve in Guyon’s canal', () => {
    const nerves = (key: string) => REGIONS.find((r) => r.key === key)!.contents.filter((c) => c.kind === 'nerve').flatMap((c) => c.names)
    expect(nerves('carpal-tunnel')).toEqual(['Median nerve'])
    expect(nerves('cubital-fossa')).toContain('Median nerve')
    expect(nerves('guyon')).toEqual(['Ulnar nerve'])
    expect(nerves('guyon')).not.toContain('Median nerve')
  })
})
