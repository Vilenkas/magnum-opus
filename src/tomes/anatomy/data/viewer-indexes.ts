import { latinWithSide } from './latin'
import { pieces, regionOf, regions, type RegionId } from './skeleton'
import { jointKindLabel, softEntries, softName } from './soft-tissues'
import { byName, haystackOf, type IndexEntry, type IndexSection } from './structure-index'

/** Indexes of the osteology, myology and arthrology viewers (the vessels' is in vessels.ts). */

// ---------- Bones: each piece on its own line, by region ----------

export const boneIndex: IndexSection[] = regions.map((region) => ({
  id: region.id,
  label: region.name,
  entries: pieces
    .filter((p) => regionOf(p).id === region.id)
    .map((p) => {
      const latin = latinWithSide(p.en, p.side)
      return { key: p.id, name: p.name, title: latin ?? p.en, haystack: haystackOf(p.name, ...(p.aliases ?? []), latin, p.en) }
    })
    .sort(byName),
}))

export const boneRegionOf = (id: string): RegionId | undefined =>
  boneIndex.find((s) => s.entries.some((e) => e.key === id))?.id as RegionId | undefined

// ---------- Muscles and joints: both sides of a pair on one line ----------

export interface TissueIndexEntry extends IndexEntry {
  /** Model nodes the line stands for: a muscle's belly on each side, a ligament on each side. */
  ids: string[]
  set: 'muscles' | 'joints'
}

const unsided = (id: string) => id.replace(/-[lr]$/, '')
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function tissueEntries(set: 'muscles' | 'joints'): TissueIndexEntry[] {
  const byKey = new Map<string, TissueIndexEntry>()
  for (const e of softEntries) {
    // Muscles are listed by their belly; tendons, bursae, sheaths and fasciae aren't selectable.
    if (e.set !== set || (set === 'muscles' && (e.kind !== 'muscle' || e.part !== 'belly'))) continue
    const key = unsided(e.id)
    const known = byKey.get(key)
    if (known) {
      known.ids.push(e.id)
      continue
    }
    const kind = set === 'joints' ? jointKindLabel[e.kind] : undefined
    byKey.set(key, {
      key,
      set,
      ids: [e.id],
      name: capitalize(softName(e)),
      title: e.la ?? e.en,
      haystack: haystackOf(softName(e), e.la, e.en, kind),
    })
  }
  return [...byKey.values()].sort(byName)
}

export const tissueIndex: IndexSection<TissueIndexEntry>[] = [
  { id: 'muscles', label: 'Músculos', entries: tissueEntries('muscles') },
  { id: 'joints', label: 'Ligamentos y articulaciones', entries: tissueEntries('joints') },
]

export const tissueEntryOf = new Map(tissueIndex.flatMap((s) => s.entries.flatMap((e) => e.ids.map((id) => [id, e] as const))))
