import { normalize } from '@/forge/text'
import { facets, type FacetId } from '@/tomes/taxonomy'
import type { TomeManifest } from '@/tomes/types'
import { tomesWithFacet, trailOf, type Atlas, type AtlasNode } from './model'

export type SearchResult =
  | { kind: 'tome'; score: number; tome: TomeManifest; node?: AtlasNode }
  | { kind: 'area'; score: number; node: AtlasNode }
  | { kind: 'facet'; score: number; facet: FacetId; value: string; label: string; count: number }

/**
 * How well `text` matches every token of the query: per token, 3 for a whole
 * word, 2 for a word prefix, 1 for a substring. 0 if any token is missing, so
 * "anatomia neuro" only matches fields holding both.
 */
export function matchScore(text: string, tokens: string[]): number {
  const haystack = normalize(text)
  const words = haystack.split(' ')
  let score = 0
  for (const token of tokens) {
    if (words.includes(token)) score += 3
    else if (words.some((w) => w.startsWith(token))) score += 2
    else if (haystack.includes(token)) score += 1
    else return 0
  }
  return score
}

/** Searches tomes, areas of the map and facet values; best first. */
export function search(atlas: Atlas, query: string): SearchResult[] {
  const tokens = normalize(query).split(' ').filter(Boolean)
  if (!tokens.length) return []
  const results: SearchResult[] = []

  for (const tome of atlas.tomes) {
    const score = Math.max(
      matchScore(tome.title, tokens) * 3,
      matchScore(tome.subtitle ?? '', tokens) * 2,
      matchScore(tome.tags.join(' '), tokens) * 2,
      matchScore(tome.description, tokens),
    )
    if (score) results.push({ kind: 'tome', score, tome, node: atlas.homeOf.get(tome.id) })
  }

  for (const node of atlas.byPath.values()) {
    // A node with a tome is already found through the tome.
    if (node.tomes.length) continue
    const score = Math.max(
      matchScore(node.title, tokens) * 3,
      matchScore(trailOf(node).map((n) => n.title).join(' '), tokens),
    )
    if (score) results.push({ kind: 'area', score, node })
  }

  for (const [facet, def] of Object.entries(facets) as [FacetId, (typeof facets)[FacetId]][]) {
    for (const [value, label] of Object.entries(def.values)) {
      const score = Math.max(matchScore(label, tokens) * 3, matchScore(`${def.title} ${label}`, tokens))
      if (score) {
        const count = tomesWithFacet(atlas, facet, value).length
        results.push({ kind: 'facet', score, facet, value, label, count })
      }
    }
  }

  // Ties: written areas before unwritten ones, then shallower, then map order (stable sort).
  const unwritten = (r: SearchResult) =>
    r.kind === 'area' && (r.node.status === 'pending' || r.node.status === 'group') ? 1 : 0
  const depth = (r: SearchResult) => (r.kind === 'area' ? r.node.depth : 0)
  return results.sort((a, b) => b.score - a.score || unwritten(a) - unwritten(b) || depth(a) - depth(b))
}
