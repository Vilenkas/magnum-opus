import { BZD_DURATION, classes } from './classes'
import { drugs } from './drugs'
import type { Drug, DrugClass, HalfLife } from './types'

export { classes, drugs }

export const classById = new Map(classes.map((c) => [c.id, c]))
export const drugById = new Map(drugs.map((d) => [d.id, d]))

export const childrenOf = (id: string | undefined): DrugClass[] => classes.filter((c) => c.parent === id)

/** The class and its ancestors, from the root down. */
export function lineage(id: string): DrugClass[] {
  const chain: DrugClass[] = []
  for (let c = classById.get(id); c; c = c.parent ? classById.get(c.parent) : undefined) chain.unshift(c)
  return chain
}

/** Titles of the class and its ancestors, for searching. */
export const classPathText = (id: string) =>
  lineage(id)
    .map((c) => c.title)
    .join(' ')

/** The root (the family) of a class. */
export const familyOf = (id: string): DrugClass => lineage(id)[0]

/** Whether `id` is `ancestor` or lies below it. */
export const isWithin = (id: string, ancestor: string) => lineage(id).some((c) => c.id === ancestor)

/** Drugs whose main class lies in the subtree (or, with `any`, that serve it in any role). */
export function drugsIn(classId: string, any = false): Drug[] {
  return drugs.filter((d) => (any ? d.classes : d.classes.slice(0, 1)).some((c) => isWithin(c, classId)))
}

/** The drug's mechanism, or the nearest class's that states one. */
export function mechanismOf(drug: Drug): string | undefined {
  if (drug.mechanism) return drug.mechanism
  return lineage(drug.classes[0])
    .reverse()
    .find((c) => c.mechanism)?.mechanism
}

/** Adverse effects shared by the drug's main class and its ancestors, nearest first. */
export function classAdverse(drug: Drug): { cls: DrugClass; effects: string[] }[] {
  return lineage(drug.classes[0])
    .reverse()
    .filter((c) => c.adverse?.length)
    .map((c) => ({ cls: c, effects: c.adverse! }))
}

/** Siblings: other drugs with the same main class. */
export const siblingsOf = (drug: Drug): Drug[] => drugs.filter((d) => d !== drug && d.classes[0] === drug.classes[0])

export type Duration = 'short' | 'intermediate' | 'long'

/** Goodman & Gilman's bands by elimination half-life (midpoint of the range). */
export function durationOf(h: HalfLife): Duration {
  const mid = (h.min + h.max) / 2
  return mid < BZD_DURATION.short ? 'short' : mid <= BZD_DURATION.long ? 'intermediate' : 'long'
}

export function formatHours(h: number): string {
  if (h >= 72) return `${Math.round(h / 24)} días`
  return `${String(h).replace('.', ',')} h`
}

export function formatHalfLife(h: HalfLife): string {
  if (h.min === h.max) return `${formatHours(h.min)}`
  if (h.min >= 72 && h.max >= 72) return `${Math.round(h.min / 24)}-${Math.round(h.max / 24)} días`
  return `${String(h.min).replace('.', ',')}-${String(h.max).replace('.', ',')} h`
}
