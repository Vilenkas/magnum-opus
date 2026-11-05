import { normalize } from '@/forge/text'

/**
 * The searchable index beside the 3D plates: one line per structure, grouped in sections.
 * A line can stand for several model nodes (both sides of a paired vessel or muscle).
 */
export interface IndexEntry {
  key: string
  name: string
  /** Accent-free text the search matches: every name the structure goes by. */
  haystack: string
  /** Tooltip: usually the Latin name. */
  title?: string
}

export interface IndexSection<E extends IndexEntry = IndexEntry> {
  id: string
  label: string
  entries: E[]
}

/** Search text from all of a structure's names (Spanish, Latin, English, synonyms). */
export const haystackOf = (...names: (string | null | undefined)[]) => normalize(names.filter(Boolean).join(' '))

/** Entries whose names contain every word of the query, in any order and without accents. */
export function searchIndex<E extends { haystack: string }>(query: string, entries: E[]): E[] {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return entries
  return entries.filter((e) => words.every((w) => e.haystack.includes(w)))
}

/** Spanish alphabetical order, the order of the index. */
export const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'es')
