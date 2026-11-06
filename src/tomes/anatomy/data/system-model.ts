import { byName, haystackOf, type IndexEntry } from './structure-index'

/**
 * A body system exported from Z-Anatomy and named from TA2 (vessels.json, nervous.json): the same
 * shape for every system, so one viewer shows them all (components/SystemViewer.tsx).
 */
export interface SystemEntry {
  /** The model the node lives in (vessels.glb, lymph.glb, nervous.glb). */
  set: string
  id: string
  /** What it is (artery, cortex, nerve…): decides its colour and its section. */
  kind: string
  side: 'left' | 'right' | null
  en: string
  la: string | null
  es: string | null
  /** TA groups from the nearest up. */
  groups: { en: string; es: string | null }[]
}

/** One line of the index: a structure, both sides together when it is paired. */
export interface SystemItem<S extends string = string> extends IndexEntry {
  key: string
  section: S
  name: string
  la: string | null
  en: string
  ids: string[]
}

export interface SystemModel<S extends string = string> {
  entries: SystemEntry[]
  byId: Map<string, SystemEntry>
  index: SystemItem<S>[]
  /** The index line a node belongs to. */
  itemOf: Map<string, SystemItem<S>>
  sectionOf: (e: SystemEntry) => S
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const unsided = (id: string) => id.replace(/-[lr]$/, '')

/**
 * Applies the hand-written names (they win over TA2, for entries and groups alike) and builds the
 * index, joining "-l" and "-r" nodes of the same structure in one line.
 */
export function buildSystem<S extends string>(
  raw: SystemEntry[],
  names: Record<string, string>,
  sectionOf: (e: SystemEntry) => S,
): SystemModel<S> {
  const entries = raw.map((e) => ({
    ...e,
    es: names[e.en] ?? e.es,
    groups: e.groups.map((g) => ({ ...g, es: names[g.en] ?? g.es })),
  }))
  const byKey = new Map<string, SystemItem<S>>()
  for (const e of entries) {
    const key = unsided(e.id)
    const known = byKey.get(key)
    if (known) {
      known.ids.push(e.id)
      continue
    }
    byKey.set(key, {
      key,
      section: sectionOf(e),
      name: capitalize(e.es ?? e.en),
      la: e.la,
      en: e.en,
      ids: [e.id],
      haystack: haystackOf(e.es, e.la, e.en),
      title: e.la ?? e.en,
    })
  }
  const index = [...byKey.values()].sort(byName)
  return {
    entries,
    byId: new Map(entries.map((e) => [e.id, e])),
    index,
    itemOf: new Map(index.flatMap((item) => item.ids.map((id) => [id, item] as const))),
    sectionOf,
  }
}
