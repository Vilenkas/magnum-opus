import type { BonePiece, Side } from '../data/skeleton'

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const SIDE_WORDS: Record<string, Side> = {
  derecho: 'right',
  derecha: 'right',
  derechos: 'right',
  derechas: 'right',
  izquierdo: 'left',
  izquierda: 'left',
  izquierdos: 'left',
  izquierdas: 'left',
}

/** Words that may lead an answer without changing its meaning. */
const LEADING = /^(el|la|los|las|hueso|huesos) /

function stripLeading(s: string): string {
  let prev
  do {
    prev = s
    s = s.replace(LEADING, '')
  } while (s !== prev)
  return s
}

/** Splits a trailing side word off a normalized answer. */
function splitSide(s: string): { core: string; side?: Side } {
  const words = s.split(' ')
  const side = SIDE_WORDS[words[words.length - 1]]
  return side ? { core: words.slice(0, -1).join(' '), side } : { core: s }
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = curr
  }
  return prev[b.length]
}

export type TypedVerdict =
  | { correct: true; exact: boolean }
  | { correct: false; reason: 'empty' | 'wrong-bone' | 'wrong-side' }

/**
 * Checks a typed answer. Accepts the Spanish name, any alias or the TA English name,
 * ignoring accents/case. The side is optional, but if given it must be right.
 * One typo is forgiven on longer names (`exact: false` so the UI can show the spelling).
 */
export function checkTyped(input: string, piece: BonePiece): TypedVerdict {
  const answer = splitSide(stripLeading(normalize(input)))
  if (!answer.core) return { correct: false, reason: 'empty' }

  // Parenthesised qualifiers are optional: "Atlas (C1)" accepts "atlas" and "atlas c1".
  const candidates = [piece.base, ...(piece.aliases ?? []), piece.en].flatMap((c) =>
    [c, c.replace(/\s*\([^)]*\)/g, '')].map((v) => stripLeading(normalize(v))),
  )

  let match: 'exact' | 'typo' | null = null
  for (const c of candidates) {
    if (c === answer.core) {
      match = 'exact'
      break
    }
    if (c.length >= 7 && levenshtein(c, answer.core) <= 1) match = 'typo'
  }

  if (!match) return { correct: false, reason: 'wrong-bone' }
  if (answer.side && piece.side && answer.side !== piece.side) return { correct: false, reason: 'wrong-side' }
  return { correct: true, exact: match === 'exact' }
}
