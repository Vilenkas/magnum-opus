import { facets, taxonomy, type FacetId, type TaxonomyNode } from '@/tomes/taxonomy'
import type { TomeManifest } from '@/tomes/types'

/**
 * How far a node of the map is written:
 * - tome:    a tome lives here.
 * - covered: an ancestor's tome covers it (e.g. osteology inside anatomy).
 * - path:    nothing here, but tomes live below.
 * - pending: a leaf nobody has written yet.
 * - group:   a branch with nothing written inside.
 */
export type NodeStatus = 'tome' | 'covered' | 'path' | 'pending' | 'group'

export interface AtlasNode {
  path: string
  id: string
  title: string
  /** 1 for a domain (a root of the map). */
  depth: number
  parent?: AtlasNode
  children: AtlasNode[]
  /** Tomes whose `home` is this node. */
  tomes: TomeManifest[]
  /** Nearest ancestor's tome, when that tome covers this node. */
  coveredBy?: TomeManifest
  /** Tomes living here or below. */
  tomeCount: number
  leafCount: number
  status: NodeStatus
}

export interface Atlas {
  roots: AtlasNode[]
  byPath: Map<string, AtlasNode>
  /** Tome id → the node it lives in. */
  homeOf: Map<string, AtlasNode>
  tomes: TomeManifest[]
}

export function buildAtlas(manifests: TomeManifest[], tree: TaxonomyNode[] = taxonomy): Atlas {
  const byPath = new Map<string, AtlasNode>()
  const homeOf = new Map<string, AtlasNode>()
  const tomes = [...manifests].sort((a, b) => a.title.localeCompare(b.title, 'es'))

  const build = (raw: TaxonomyNode, parent: AtlasNode | undefined): AtlasNode => {
    const path = parent ? `${parent.path}/${raw.id}` : raw.id
    const node: AtlasNode = {
      path,
      id: raw.id,
      title: raw.title,
      depth: parent ? parent.depth + 1 : 1,
      parent,
      children: [],
      tomes: tomes.filter((t) => t.home === path),
      coveredBy: parent ? (parent.tomes[0] ?? parent.coveredBy) : undefined,
      tomeCount: 0,
      leafCount: 0,
      status: 'pending',
    }
    byPath.set(path, node)
    for (const tome of node.tomes) homeOf.set(tome.id, node)
    node.children = (raw.children ?? []).map((child) => build(child, node))
    node.tomeCount = node.tomes.length + node.children.reduce((sum, c) => sum + c.tomeCount, 0)
    node.leafCount = node.children.length ? node.children.reduce((sum, c) => sum + c.leafCount, 0) : 1
    node.status = node.tomes.length
      ? 'tome'
      : node.coveredBy
        ? 'covered'
        : node.tomeCount
          ? 'path'
          : node.children.length
            ? 'group'
            : 'pending'
    return node
  }

  return { roots: tree.map((root) => build(root, undefined)), byPath, homeOf, tomes }
}

/**
 * Where a node is read: its own tome at the front page, or the tome covering it at the section
 * its manifest names for it (the front page if it names none). Undefined if nothing covers it.
 */
export function readingOf(node: AtlasNode): { tome: TomeManifest; path: string } | undefined {
  if (node.tomes.length) return { tome: node.tomes[0], path: '' }
  const tome = node.coveredBy
  if (!tome) return undefined
  return { tome, path: tome.sections?.[node.path.slice(tome.home.length + 1)] ?? '' }
}

/** The node and its ancestors, from the root down. */
export function trailOf(node: AtlasNode): AtlasNode[] {
  const trail: AtlasNode[] = []
  for (let n: AtlasNode | undefined = node; n; n = n.parent) trail.unshift(n)
  return trail
}

const walk = (node: AtlasNode, visit: (n: AtlasNode) => void) => {
  visit(node)
  for (const child of node.children) walk(child, visit)
}

/** Leaves below `node` that nobody has written yet, in map order. */
export function pendingLeaves(node: AtlasNode): AtlasNode[] {
  const found: AtlasNode[] = []
  walk(node, (n) => {
    if (n.status === 'pending') found.push(n)
  })
  return found
}

/** Tomes living at or below `node`, in map order. */
export function tomesWithin(node: AtlasNode): TomeManifest[] {
  const found: TomeManifest[] = []
  walk(node, (n) => found.push(...n.tomes))
  return found
}

export function tomesWithFacet(atlas: Atlas, facet: FacetId, value: string): TomeManifest[] {
  return atlas.tomes.filter((t) => (t.facets?.[facet] as readonly string[] | undefined)?.includes(value))
}

/** Every value of a facet with how many tomes carry it, in declaration order. */
export function facetCounts(atlas: Atlas, facet: FacetId) {
  return Object.entries(facets[facet].values).map(([value, label]) => ({
    value,
    label: label as string,
    count: tomesWithFacet(atlas, facet, value).length,
  }))
}

/** Tomes related to the ones living at `node`, in either direction. */
export function relatedTo(atlas: Atlas, node: AtlasNode): TomeManifest[] {
  const here = new Set(node.tomes.map((t) => t.id))
  if (!here.size) return []
  return atlas.tomes.filter(
    (t) =>
      !here.has(t.id) &&
      ((t.related ?? []).some((id) => here.has(id)) || node.tomes.some((h) => h.related?.includes(t.id))),
  )
}

export function isFacetValue(facet: FacetId, value: string | undefined): value is string {
  return value !== undefined && value in facets[facet].values
}
