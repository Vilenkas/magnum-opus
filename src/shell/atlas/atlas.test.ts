import { describe, expect, it } from 'vitest'
import type { TaxonomyNode } from '@/tomes/taxonomy'
import type { TomeManifest } from '@/tomes/types'
import { descendantCount, focusLayout } from './layout'
import { buildAtlas, facetCounts, pendingLeaves, relatedTo, tomesWithFacet, tomesWithin, trailOf } from './model'
import { matchScore, search } from './search'

const tree: TaxonomyNode[] = [
  {
    id: 'health',
    title: 'Ciencias de la salud',
    children: [
      {
        id: 'basic',
        title: 'Ciencias básicas',
        children: [
          {
            id: 'anatomy',
            title: 'Anatomía',
            children: [
              { id: 'osteology', title: 'Osteología' },
              { id: 'neurology', title: 'Neurología' },
            ],
          },
          { id: 'physiology', title: 'Fisiología' },
        ],
      },
      { id: 'clinical', title: 'Medicina clínica', children: [{ id: 'neurology', title: 'Neurología clínica' }] },
    ],
  },
  { id: 'languages', title: 'Lenguas', children: [{ id: 'latin', title: 'Latín' }] },
  { id: 'mathematics', title: 'Matemáticas', children: [{ id: 'algebra', title: 'Álgebra' }] },
]

const tome = (id: string, home: string, extra: Partial<TomeManifest> = {}): TomeManifest => ({
  id,
  home,
  title: id,
  description: '',
  tier: 'scroll',
  status: 'draft',
  tags: [],
  palette: { background: '#fff', foreground: '#000', accent: '#f00' },
  createdAt: '2026-11-04',
  ...extra,
})

const anatomy = tome('anatomy', 'health/basic/anatomy', {
  title: 'Anatomía',
  subtitle: 'De humani corporis fabrica',
  tags: ['huesos'],
  facets: { system: ['skeletal'] },
})
const latin = tome('latin', 'languages/latin', { title: 'Latín', related: ['anatomy'] })
const atlas = buildAtlas([latin, anatomy], tree)
const at = (path: string) => atlas.byPath.get(path)!

describe('buildAtlas', () => {
  it('derives each node status', () => {
    expect(at('health/basic/anatomy').status).toBe('tome')
    expect(at('health/basic/anatomy/osteology').status).toBe('covered')
    expect(at('health/basic/anatomy/osteology').coveredBy).toBe(anatomy)
    expect(at('health/basic').status).toBe('path')
    expect(at('health').status).toBe('path')
    expect(at('health/basic/physiology').status).toBe('pending')
    expect(at('health/clinical').status).toBe('group')
    expect(at('mathematics').status).toBe('group')
  })

  it('counts tomes and leaves per subtree', () => {
    expect(at('health').tomeCount).toBe(1)
    expect(at('languages').tomeCount).toBe(1)
    expect(at('mathematics').tomeCount).toBe(0)
    expect(at('health').leafCount).toBe(4)
    expect(atlas.homeOf.get('latin')).toBe(at('languages/latin'))
  })

  it('walks trails, pending leaves and tomes within', () => {
    expect(trailOf(at('health/basic/anatomy/neurology')).map((n) => n.id)).toEqual([
      'health',
      'basic',
      'anatomy',
      'neurology',
    ])
    expect(pendingLeaves(at('health')).map((n) => n.path)).toEqual([
      'health/basic/physiology',
      'health/clinical/neurology',
    ])
    expect(tomesWithin(at('health'))).toEqual([anatomy])
  })

  it('finds facets and related tomes in both directions', () => {
    expect(tomesWithFacet(atlas, 'system', 'skeletal')).toEqual([anatomy])
    expect(facetCounts(atlas, 'system').find((f) => f.value === 'skeletal')?.count).toBe(1)
    expect(facetCounts(atlas, 'system').find((f) => f.value === 'nervous')?.count).toBe(0)
    expect(relatedTo(atlas, at('health/basic/anatomy'))).toEqual([latin])
    expect(relatedTo(atlas, at('languages/latin'))).toEqual([anatomy])
    expect(relatedTo(atlas, at('health/basic'))).toEqual([])
  })
})

describe('search', () => {
  it('scores whole words over prefixes over substrings, ignoring accents', () => {
    expect(matchScore('Anatomía', ['anatomia'])).toBe(3)
    expect(matchScore('Neurología clínica', ['neuro'])).toBe(2)
    expect(matchScore('Osteología', ['logia'])).toBe(1)
    expect(matchScore('Osteología', ['logia', 'x'])).toBe(0)
  })

  it('finds areas with the same name in different branches, written ones first', () => {
    const areas = search(atlas, 'neuro').filter((r) => r.kind === 'area')
    expect(areas.map((r) => r.node.path)).toEqual(['health/basic/anatomy/neurology', 'health/clinical/neurology'])
  })

  it('narrows by the breadcrumb', () => {
    const areas = search(atlas, 'anatomia neuro').filter((r) => r.kind === 'area')
    expect(areas.map((r) => r.node.path)).toEqual(['health/basic/anatomy/neurology'])
  })

  it('reports a node with a tome as the tome, not as an area', () => {
    const results = search(atlas, 'anatomía')
    expect(results[0]).toMatchObject({ kind: 'tome', tome: anatomy, node: at('health/basic/anatomy') })
    expect(results.some((r) => r.kind === 'area' && r.node.path === 'health/basic/anatomy')).toBe(false)
  })

  it('matches tome subtitles and tags, and facet values', () => {
    expect(search(atlas, 'fabrica')[0]).toMatchObject({ kind: 'tome', tome: anatomy })
    expect(search(atlas, 'huesos')[0]).toMatchObject({ kind: 'tome', tome: anatomy })
    expect(search(atlas, 'sistema nervioso')).toContainEqual(
      expect.objectContaining({ kind: 'facet', value: 'nervous', count: 0 }),
    )
    expect(search(atlas, '   ')).toEqual([])
  })
})

describe('focusLayout', () => {
  const root = focusLayout(atlas.roots, 100)
  const point = (points: ReturnType<typeof focusLayout>, path: string) => points.find((p) => p.node.path === path)!

  it('draws only two levels around the focus', () => {
    expect(root.filter((p) => p.ring === 1).map((p) => p.node.path)).toEqual(['health', 'languages', 'mathematics'])
    expect(root.filter((p) => p.ring === 2).map((p) => p.node.path)).toEqual([
      'health/basic',
      'health/clinical',
      'languages/latin',
      'mathematics/algebra',
    ])
    expect(root.some((p) => p.node.path === 'health/basic/anatomy')).toBe(false)
  })

  it('puts the rings at one and two ring widths, the first child at the top', () => {
    for (const p of root) expect(Math.hypot(p.x, p.y)).toBeCloseTo(p.ring * 100)
    expect(point(root, 'health').angle).toBeCloseTo(-Math.PI / 2)
    expect(point(root, 'health/basic').parent).toBe(point(root, 'health'))
  })

  it('counts what lies deeper instead of drawing it', () => {
    expect(point(root, 'health/basic').hidden).toBe(4)
    expect(point(root, 'languages/latin').hidden).toBe(0)
    expect(descendantCount(at('health'))).toBe(7)
  })

  it('re-centres on any node: its children, then grandchildren', () => {
    const basic = focusLayout(at('health/basic').children, 100)
    expect(basic.filter((p) => p.ring === 1).map((p) => p.node.id)).toEqual(['anatomy', 'physiology'])
    expect(basic.filter((p) => p.ring === 2).map((p) => p.node.id)).toEqual(['osteology', 'neurology'])
  })

  it('returns nothing around a leaf', () => {
    expect(focusLayout(at('health/basic/physiology').children, 100)).toEqual([])
  })
})
