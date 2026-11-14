/**
 * Katzung's cuadro 29-1 (p. 514): ten antipsychotics graded on five properties. Levels are the
 * book's words on a 0–4 scale (muy baja … muy alta); «de baja a media» is 1.5.
 */

export type Property = 'ratio' | 'potency' | 'eps' | 'sedation' | 'hypotension'

export const PROPERTIES: { id: Property; title: string; hint: string }[] = [
  { id: 'ratio', title: 'D2 / 5-HT2A', hint: 'Afinidad por D2 sobre la afinidad por 5-HT2A' },
  { id: 'potency', title: 'Potencia', hint: 'Potencia clínica: alta = eficaz a dosis bajas' },
  { id: 'eps', title: 'Extrapiramidal', hint: 'Toxicidad extrapiramidal' },
  { id: 'sedation', title: 'Sedación', hint: 'Acción sedante' },
  { id: 'hypotension', title: 'Hipotensión', hint: 'Acciones hipotensivas' },
]

export const LEVEL_WORDS = ['Muy baja', 'Baja', 'Media', 'Alta', 'Muy alta'] as const

export interface Profile {
  /** Drug id in the bank. */
  id: string
  levels: Record<Property, number>
}

export const profiles: Profile[] = [
  { id: 'chlorpromazine', levels: { ratio: 3, potency: 1, eps: 2, sedation: 3, hypotension: 3 } },
  { id: 'fluphenazine', levels: { ratio: 3, potency: 3, eps: 3, sedation: 1, hypotension: 0 } },
  { id: 'thiothixene', levels: { ratio: 4, potency: 3, eps: 2, sedation: 2, hypotension: 2 } },
  { id: 'haloperidol', levels: { ratio: 2, potency: 3, eps: 4, sedation: 1, hypotension: 0 } },
  { id: 'clozapine', levels: { ratio: 0, potency: 2, eps: 0, sedation: 1, hypotension: 2 } },
  // Risperidone's low extrapyramidal toxicity holds at low doses, as the table notes.
  { id: 'risperidone', levels: { ratio: 0, potency: 3, eps: 1, sedation: 1, hypotension: 1 } },
  { id: 'olanzapine', levels: { ratio: 1, potency: 3, eps: 0, sedation: 2, hypotension: 1 } },
  { id: 'quetiapine', levels: { ratio: 1, potency: 1, eps: 0, sedation: 2, hypotension: 1.5 } },
  { id: 'ziprasidone', levels: { ratio: 1, potency: 2, eps: 0, sedation: 1, hypotension: 0 } },
  { id: 'aripiprazole', levels: { ratio: 2, potency: 3, eps: 0, sedation: 0, hypotension: 1 } },
]

export function levelWord(v: number): string {
  return Number.isInteger(v) ? LEVEL_WORDS[v] : 'De baja a media'
}

/** Profiles sorted by a property, highest first (ties keep the book's order). */
export function sortedBy(prop: Property): Profile[] {
  return [...profiles].sort((a, b) => b.levels[prop] - a.levels[prop])
}
