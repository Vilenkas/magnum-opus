import { levenshtein, normalize } from '@/forge/text'
import { landmarks } from '../data/landmarks'
import { pieces, type Side } from '../data/skeleton'

/** Anything with a name to type: a piece or a landmark. */
export interface Nameable {
  base: string
  aliases?: string[]
  en: string
  side?: Side
}

/**
 * Typed-answer checking that compares meaning, not spelling: word order, filler words,
 * ordinals written any way (quinto / 5 / 5º / V), clinical shorthand (T12, D12, pulgar…)
 * and small typos are all tolerated.
 */

export { normalize, levenshtein }

const ORDINALS: Record<string, number> = {
  // Spanish (both genders, and the apocopated forms)
  primer: 1, primero: 1, primera: 1,
  segundo: 2, segunda: 2,
  tercer: 3, tercero: 3, tercera: 3,
  cuarto: 4, cuarta: 4,
  quinto: 5, quinta: 5,
  sexto: 6, sexta: 6,
  septimo: 7, septima: 7, setimo: 7, setima: 7,
  octavo: 8, octava: 8,
  noveno: 9, novena: 9,
  decimo: 10, decima: 10,
  undecimo: 11, undecima: 11, decimoprimero: 11, decimoprimera: 11, onceavo: 11, onceava: 11,
  duodecimo: 12, duodecima: 12, decimosegundo: 12, decimosegunda: 12, doceavo: 12, doceava: 12,
  // English (Terminologia Anatomica names)
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6,
  seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12,
  // Roman numerals, common in clinical Spanish ("V metatarsiano")
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12,
}

/** Multi-word rewrites applied before tokenizing (longest phrases first). */
const PHRASES: [RegExp, string][] = [
  [/\bdedo gordo\b/g, '1 dedo pie'],
  [/\bhallux\b/g, '1 dedo pie'],
  [/\bpulgar\b/g, '1 dedo mano'],
  [/\bindice\b/g, '2 dedo'],
  [/\bdedo medio\b/g, '3 dedo'],
  [/\bdedo corazon\b/g, '3 dedo'],
  [/\banular\b/g, '4 dedo'],
  [/\bmenique\b/g, '5 dedo'],
  [/\bdorsal(es)?\b/g, 'toracica'],
  [/\btoracic[oa]s?\b/g, 'toracica'],
  [/\bcervicales\b/g, 'cervical'],
  [/\blumbares\b/g, 'lumbar'],
]

const REGION_CODE: Record<string, string> = { cervical: 'c', toracica: 't', lumbar: 'l' }

/** Vertebra shorthand → canonical code ("dorsal 12", "D 12", "12 vertebra toracica" → t12). */
function canonicalVertebrae(s: string): string {
  return s
    .replace(/\bd\s*(\d{1,2})\b/g, 't$1')
    .replace(/\b([ctl])\s+(\d{1,2})\b/g, '$1$2')
    .replace(/\b(?:vertebra\s+)?(cervical|toracica|lumbar)\s+(\d{1,2})\b/g, (_, r, n) => `vertebra ${REGION_CODE[r]}${n}`)
    .replace(/\b(\d{1,2})\s+(?:vertebra\s+)?(cervical|toracica|lumbar)\b/g, (_, n, r) => `vertebra ${REGION_CODE[r]}${n}`)
}

/** Words that never change the meaning. */
const STOP = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'of', 'the', 'bone', 'bones'])
/** Words that may be present or not ("dedo", "vertebra", "hueso" are implied by the rest). */
const OPTIONAL = new Set(['hueso', 'huesos', 'vertebra', 'dedo', 'finger'])

const SIDE_WORDS: Record<string, Side> = {
  derecho: 'right', derecha: 'right', derechos: 'right', derechas: 'right',
  der: 'right', dcho: 'right', dcha: 'right', dr: 'right', right: 'right',
  izquierdo: 'left', izquierda: 'left', izquierdos: 'left', izquierdas: 'left',
  izq: 'left', izdo: 'left', izda: 'left', iz: 'left', left: 'left',
}

interface Parsed {
  tokens: string[]
  side?: Side
}

/** Turns free text into a set of canonical meaning tokens (+ an optional side). */
export function parseAnswer(text: string): Parsed {
  let s = normalize(text)
  // "5o", "8a", "1er", "3ra" → bare numbers.
  s = s.replace(/\b(\d{1,2})(?:o|a|er|ero|era|ro|ra|do|da|to|ta|vo|va|mo|ma|no|na)\b/g, '$1')
  s = s
    .split(' ')
    .map((w) => (w in ORDINALS ? String(ORDINALS[w]) : w))
    .join(' ')
  for (const [re, to] of PHRASES) s = s.replace(re, to)
  s = canonicalVertebrae(s)

  let side: Side | undefined
  const tokens = new Set<string>()
  for (const w of s.split(' ')) {
    if (!w || STOP.has(w)) continue
    if (w in SIDE_WORDS) {
      side = SIDE_WORDS[w]
      continue
    }
    tokens.add(w)
  }
  return { tokens: [...tokens], side }
}


/** Typos tolerated in a word: none below 5 letters, 1 from 5, 2 from 9. Numbers/codes: none. */
function typoBudget(word: string): number {
  if (/\d/.test(word)) return 0
  return word.length >= 9 ? 2 : word.length >= 5 ? 1 : 0
}

/** Every meaning token in the catalogue, to keep typo-tolerance from crossing between bones. */
let vocabulary: Set<string> | null = null
function getVocabulary(): Set<string> {
  if (!vocabulary) {
    vocabulary = new Set()
    const names = [
      ...pieces.flatMap((p) => [p.base, ...(p.aliases ?? []), p.en]),
      ...landmarks.flatMap((l) => [l.name, ...l.aliases, l.en]),
    ]
    for (const name of names) {
      for (const t of parseAnswer(name).tokens) vocabulary.add(t)
    }
  }
  return vocabulary
}

/**
 * Is `typed` a misspelling of `expected`? Only if it isn't itself a real term
 * ("metacarpiano" is never a typo of "metatarsiano") and no term of another piece is as close.
 */
function isTypoOf(typed: string, expected: string, ownWords: Set<string>): boolean {
  const d = levenshtein(typed, expected)
  if (d === 0 || d > typoBudget(expected)) return false
  const vocab = getVocabulary()
  if (vocab.has(typed)) return false
  for (const w of vocab) {
    if (w !== expected && !ownWords.has(w) && levenshtein(typed, w) <= d) return false
  }
  return true
}

type Match = 'exact' | 'typo' | 'incomplete' | 'none'

function matchTokens(answer: string[], candidate: string[], ownWords: Set<string>): Match {
  const required = candidate.filter((t) => !OPTIONAL.has(t))
  const used = new Set<number>()
  let typos = false
  let missing = 0

  for (const r of required) {
    let i = answer.findIndex((a, k) => !used.has(k) && a === r)
    if (i === -1) {
      i = answer.findIndex((a, k) => !used.has(k) && isTypoOf(a, r, ownWords))
      if (i !== -1) typos = true
    }
    if (i === -1) missing++
    else used.add(i)
  }

  const extra = answer.some((a, k) => !used.has(k) && !OPTIONAL.has(a))
  if (extra) return 'none'
  if (missing === 0) return typos ? 'typo' : 'exact'
  return used.size > 0 ? 'incomplete' : 'none'
}

const RANK: Record<Match, number> = { exact: 3, typo: 2, incomplete: 1, none: 0 }

export type TypedVerdict =
  | { correct: true; exact: boolean }
  | { correct: false; reason: 'empty' | 'incomplete' | 'wrong-bone' | 'wrong-side' }

/**
 * Checks a typed answer against the Spanish name, its aliases and the TA English name.
 * The side is optional, but if given it must be right. `incomplete` means everything
 * written is right but something essential is missing ("falange distal") — the UI lets
 * the user add detail instead of failing them.
 */
export function checkTyped(input: string, piece: Nameable): TypedVerdict {
  const answer = parseAnswer(input)
  if (answer.tokens.length === 0) return { correct: false, reason: 'empty' }

  let best: Match = 'none'
  // Parenthesised qualifiers are optional: "Atlas (C1)" accepts "atlas" and "atlas c1".
  const names = [piece.base, ...(piece.aliases ?? []), piece.en].flatMap((n) => [n, n.replace(/\s*\([^)]*\)/g, '')])
  // Ties with words of this same piece (Spanish vs English name) must not block a typo fix.
  const ownWords = new Set(names.flatMap((n) => parseAnswer(n).tokens))
  for (const name of names) {
    const m = matchTokens(answer.tokens, parseAnswer(name).tokens, ownWords)
    if (RANK[m] > RANK[best]) best = m
    if (best === 'exact') break
  }

  if (best === 'none') return { correct: false, reason: 'wrong-bone' }
  if (best === 'incomplete') return { correct: false, reason: 'incomplete' }
  if (answer.side && piece.side && answer.side !== piece.side) return { correct: false, reason: 'wrong-side' }
  return { correct: true, exact: best === 'exact' }
}
