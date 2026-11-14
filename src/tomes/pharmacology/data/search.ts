import { levenshtein, normalize } from '@/forge/text'
import type { Drug, DrugClass } from './types'

export type Hit = { kind: 'drug'; drug: Drug; score: number } | { kind: 'class'; cls: DrugClass; score: number }

const words = (text: string) => normalize(text).split(/[^a-z0-9]+/).filter(Boolean)

/** How well one query token matches a field: 0 none, up to 1 for the whole field. */
function tokenScore(token: string, field: string): number {
  const norm = normalize(field)
  if (!norm) return 0
  if (norm === token) return 1
  if (norm.startsWith(token)) return 0.85
  const ws = words(field)
  if (ws.some((w) => w.startsWith(token))) return 0.7
  if (token.length >= 3 && norm.includes(token)) return 0.5
  // A typo or two: «diacepam», «alprazolan», «sertralína».
  if (token.length >= 4) {
    const allowed = token.length >= 7 ? 2 : 1
    for (const w of ws) {
      // Against the whole word, or against its start while it is still being typed.
      const d = Math.min(levenshtein(token, w), levenshtein(token, w.slice(0, token.length)))
      if (d <= allowed) return 0.4 - 0.1 * d
    }
  }
  return 0
}

/** Best match of every token across the fields (each field with its weight); 0 if a token misses. */
function score(tokens: string[], fields: [string | undefined, number][]): number {
  let total = 0
  for (const t of tokens) {
    let best = 0
    for (const [field, weight] of fields) if (field) best = Math.max(best, tokenScore(t, field) * weight)
    if (!best) return 0
    total += best
  }
  return total / tokens.length
}

/**
 * Drugs by Spanish or English name and brand (and, less, by the titles along their classes);
 * classes by title. Best first. Accents and case don't matter, and small typos are forgiven.
 */
export function searchBank(query: string, drugs: Drug[], classes: DrugClass[], classText: (id: string) => string): Hit[] {
  const tokens = words(query)
  if (!tokens.length) return []
  const hits: Hit[] = []
  for (const drug of drugs) {
    const s = score(tokens, [
      [drug.name, 1],
      [drug.inn, 0.95],
      [drug.brand, 0.9],
      [drug.classes.map(classText).join(' '), 0.45],
    ])
    if (s) hits.push({ kind: 'drug', drug, score: s })
  }
  for (const cls of classes) {
    const s = score(tokens, [[cls.title, 0.9]])
    if (s) hits.push({ kind: 'class', cls, score: s })
  }
  const label = (h: Hit) => (h.kind === 'drug' ? h.drug.name : h.cls.title)
  return hits.sort((a, b) => b.score - a.score || label(a).localeCompare(label(b), 'es'))
}
