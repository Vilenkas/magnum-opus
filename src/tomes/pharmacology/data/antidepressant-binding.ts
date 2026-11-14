/**
 * Katzung's cuadro 30-2 (p. 542): how strongly each antidepressant blocks the two monoamine
 * transporters and four receptors. Grades 0, 0/+ (0.5), +, ++, +++ (3); null where the book has
 * no data. The transporters carry the antidepressant effect; the receptors, most adverse effects.
 */

export type Target = 'sert' | 'net' | 'm' | 'a1' | 'h1' | 'ht2'

export const TRANSPORTERS: { id: Target; title: string }[] = [
  { id: 'sert', title: 'Transportador de serotonina (SERT)' },
  { id: 'net', title: 'Transportador de noradrenalina (NET)' },
]

/** Receptors, with what blocking them brings. */
export const RECEPTORS: { id: Target; title: string; effect: string }[] = [
  { id: 'm', title: 'Muscarínico', effect: 'Boca seca, estreñimiento, retención urinaria, visión borrosa' },
  { id: 'a1', title: 'α1 adrenérgico', effect: 'Hipotensión ortostática' },
  { id: 'h1', title: 'Histamínico H1', effect: 'Sedación y aumento de peso' },
  { id: 'ht2', title: 'Serotonina 5-HT2', effect: 'Efecto ansiolítico y antidepresivo propio' },
]

export interface Binding {
  /** Drug id in the bank (the first of a pair that shares a row). */
  ids: string[]
  levels: Record<Target, number | null>
}

const row = (ids: string[], m: number | null, a1: number | null, h1: number | null, ht2: number | null, net: number | null, sert: number | null): Binding => ({
  ids,
  levels: { m, a1, h1, ht2, net, sert },
})

// Columns in the book's order: ACh M, α1, H1, 5-HT2, NET, SERT.
export const bindings: Binding[] = [
  row(['amitriptyline'], 3, 3, 2, 0.5, 1, 2),
  row(['amoxapine'], 1, 2, 1, 3, 2, 1),
  row(['bupropion'], 0, 0, 0, 0, 0.5, 0),
  row(['citalopram', 'escitalopram'], 0, 0, 0, 1, 0, 3),
  row(['clomipramine'], 1, 2, 1, 0.5, 1, 3),
  row(['desipramine'], 1, 1, 1, 0.5, 3, 1),
  row(['doxepin'], 2, 3, 3, 0.5, 1, 1),
  row(['fluoxetine'], 0, 0, 0, 0, 0, 3),
  row(['fluvoxamine'], 0, 0, 0, 0.5, 0, 3),
  row(['imipramine'], 2, 1, 1, 0.5, 1, 2),
  row(['maprotiline'], 1, 1, 2, 1, 2, 0),
  row(['mirtazapine'], 0, 0, 3, 2, 1, 0),
  row(['nefazodone'], 0, 1, 0, 1, 0.5, 1),
  row(['nortriptyline'], 1, 1, 1, 0, 2, 1),
  row(['paroxetine'], 1, 0, 0, 1, 1, 3),
  row(['protriptyline'], 3, 1, 1, 0, 3, 1),
  row(['sertraline'], 0, 0, 0, 2, 0, 3),
  row(['trazodone'], 0, 2, 0.5, 0.5, 0, 1),
  row(['trimipramine'], 2, 2, 3, 0, 0, 0),
  row(['venlafaxine'], 0, 0, 0, null, 1, 2),
  row(['vortioxetine'], null, null, null, 0.5, 1, 3),
]

export function gradeWord(v: number | null): string {
  if (v === null) return 'sin datos'
  if (v === 0) return '0'
  if (v === 0.5) return '0/+'
  return '+'.repeat(v)
}

export function bindingOf(id: string): Binding | undefined {
  return bindings.find((b) => b.ids.includes(id))
}

/** The receptor effects a drug is expected to bring: those it blocks at least moderately (++). */
export function expectedEffects(b: Binding): string[] {
  return RECEPTORS.filter((r) => r.id !== 'ht2' && (b.levels[r.id] ?? 0) >= 2).map((r) => r.effect)
}
