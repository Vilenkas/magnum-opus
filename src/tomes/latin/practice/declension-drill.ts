import { createStatsStore } from '@/forge/practice'
import { nouns, type VocabNoun } from '../data/nouns'
import {
  analyze,
  CASES,
  decline,
  NUMBERS,
  withoutMacrons,
  type Case,
  type Declension,
  type GrammaticalNumber,
} from '../grammar/nouns'

export type DrillMode = 'decline' | 'analyze'

export interface Reading {
  case: Case
  number: GrammaticalNumber
}

/** "Give me the genitive plural of rosa." */
export interface DeclineItem {
  id: string
  kind: 'decline'
  noun: VocabNoun
  case: Case
  number: GrammaticalNumber
  /** Expected form, with macrons. */
  answer: string
}

/** "What can 'rosae' be?" — every reading of a form written without macrons. */
export interface AnalyzeItem {
  id: string
  kind: 'analyze'
  noun: VocabNoun
  written: string
  readings: Reading[]
}

export type DrillItem = DeclineItem | AnalyzeItem

export const readingKey = (r: Reading) => `${r.case}.${r.number}`

export const drillStats = createStatsStore('latin:declensions:v1')

const inDeclensions = (declensions: Declension[]) => nouns.filter((n) => declensions.includes(n.declension))

export function declinePool(declensions: Declension[]): DeclineItem[] {
  return inDeclensions(declensions).flatMap((noun) => {
    const p = decline(noun)
    return NUMBERS.flatMap((number) =>
      CASES.map((c) => ({
        id: `d:${noun.id}:${c}.${number}`,
        kind: 'decline' as const,
        noun,
        case: c,
        number,
        answer: p[number][c].form,
      })),
    )
  })
}

export function analyzePool(declensions: Declension[]): AnalyzeItem[] {
  return inDeclensions(declensions).flatMap((noun) => {
    const p = decline(noun)
    const written = new Set(NUMBERS.flatMap((n) => CASES.map((c) => withoutMacrons(p[n][c].form))))
    return [...written].map((w) => ({
      id: `a:${noun.id}:${w}`,
      kind: 'analyze' as const,
      noun,
      written: w,
      readings: analyze(noun, w),
    }))
  })
}

/** Typed forms are compared without macrons, case or surrounding spaces. */
const clean = (s: string) => withoutMacrons(s).trim().toLowerCase()

export interface DeclineVerdict {
  correct: boolean
  /** If wrong but it's another real form of the same noun: which case(s) it is. */
  actually: Reading[]
}

export function checkDeclined(item: DeclineItem, input: string): DeclineVerdict {
  const typed = clean(input)
  if (typed === clean(item.answer)) return { correct: true, actually: [] }
  return { correct: false, actually: typed ? analyze(item.noun, typed) : [] }
}

export interface AnalyzeVerdict {
  correct: boolean
  /** Right readings the user didn't mark. */
  missing: string[]
  /** Readings the user marked that the form can't have. */
  extra: string[]
}

export function checkAnalysis(item: AnalyzeItem, selected: Iterable<string>): AnalyzeVerdict {
  const expected = new Set(item.readings.map(readingKey))
  const chosen = new Set(selected)
  const missing = [...expected].filter((k) => !chosen.has(k))
  const extra = [...chosen].filter((k) => !expected.has(k))
  return { correct: missing.length === 0 && extra.length === 0, missing, extra }
}
