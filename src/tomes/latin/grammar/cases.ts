import type { Case, Declension, Gender, GrammaticalNumber } from './nouns'

/** Beginner-level description of each case, for a Spanish speaker. */
export const CASE_INFO: Record<Case, { name: string; abbr: string; role: string; question: string }> = {
  nom: { name: 'Nominativo', abbr: 'N', role: 'Sujeto y atributo', question: '¿Quién hace la acción?' },
  voc: { name: 'Vocativo', abbr: 'V', role: 'Llamada o apelación', question: '¡Oh…! ¿A quién me dirijo?' },
  acc: { name: 'Acusativo', abbr: 'Ac', role: 'Complemento directo; dirección («hacia»)', question: '¿Qué / a quién?' },
  gen: { name: 'Genitivo', abbr: 'G', role: 'Complemento del nombre («de»)', question: '¿De quién?' },
  dat: { name: 'Dativo', abbr: 'D', role: 'Complemento indirecto («a, para»)', question: '¿A quién / para quién?' },
  abl: {
    name: 'Ablativo',
    abbr: 'Ab',
    role: 'Circunstancias: con qué, dónde, cuándo, desde dónde',
    question: '¿Con qué? ¿Dónde? ¿Cuándo?',
  },
}

export const NUMBER_NAME: Record<GrammaticalNumber, string> = { sg: 'singular', pl: 'plural' }

export const GENDER_NAME: Record<Gender, string> = { m: 'masculino', f: 'femenino', n: 'neutro' }

export const DECLENSION_NAME: Record<Declension, string> = {
  1: '1.ª declinación',
  2: '2.ª declinación',
  3: '3.ª declinación',
  4: '4.ª declinación',
  5: '5.ª declinación',
}

/** How to spot each declension: the genitive singular ending. */
export const DECLENSION_HINT: Record<Declension, string> = {
  1: 'genitivo en -ae',
  2: 'genitivo en -ī',
  3: 'genitivo en -is',
  4: 'genitivo en -ūs',
  5: 'genitivo en -eī / -ēī',
}

export const describeForm = (c: Case, n: GrammaticalNumber) => `${CASE_INFO[c].name.toLowerCase()} ${NUMBER_NAME[n]}`
