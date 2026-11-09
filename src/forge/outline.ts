/**
 * A book's outline: its h2/h3 headings as an index to jump through. Pure logic here; the
 * DOM side is `useOutline.ts`, and every tome draws its own index.
 */
import { normalize } from './text'

export type HeadingLevel = 2 | 3

export interface RawHeading {
  level: HeadingLevel
  text: string
  /** An id the heading already has (kept as is). */
  id?: string
}

export interface OutlineEntry {
  id: string
  text: string
  level: HeadingLevel
  /** Index of the h2 entry this one belongs to (itself for an h2; -1 for an h3 before any h2). */
  section: number
}

/** "La regla de los agujeros nutricios" → "la-regla-de-los-agujeros-nutricios". */
export function slugify(text: string): string {
  return normalize(text).replace(/ /g, '-') || 'seccion'
}

/** Gives every heading a unique id (existing ids win) and links each h3 to its h2. */
export function buildOutline(headings: RawHeading[]): OutlineEntry[] {
  const taken = new Set(headings.flatMap((h) => (h.id ? [h.id] : [])))
  let section = -1
  return headings.map((h, i) => {
    let id = h.id
    if (!id) {
      const base = slugify(h.text)
      id = base
      for (let n = 2; taken.has(id); n++) id = `${base}-${n}`
      taken.add(id)
    }
    if (h.level === 2) section = i
    return { id, text: h.text.trim(), level: h.level, section }
  })
}

/** The entry being read: the last heading whose top has gone above `line` (-1 before the first). */
export function activeEntry(tops: number[], line: number): number {
  let active = -1
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= line) active = i
    else break
  }
  return active
}

/** Entries to list: every h2, and the h3s of the section being read. */
export function visibleEntries(entries: OutlineEntry[], active: number): number[] {
  const open = active >= 0 ? entries[active].section : -1
  return entries.flatMap((e, i) => (e.level === 2 || (e.section === open && open >= 0) ? [i] : []))
}
