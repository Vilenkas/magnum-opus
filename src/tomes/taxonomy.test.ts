import { describe, expect, it } from 'vitest'
import { facets, isWithin, nodeAt, placementProblems, taxonomy, taxonomyPaths, trail, type TaxonomyNode } from './taxonomy'
import type { TomeManifest } from './types'

const manifests = Object.values(
  import.meta.glob<{ default: TomeManifest }>('./*/manifest.ts', { eager: true }),
).map((m) => m.default)

describe('taxonomy', () => {
  it('uses English kebab-case ids and non-empty Spanish titles', () => {
    const check = (nodes: TaxonomyNode[]) => {
      for (const node of nodes) {
        expect(node.id).toMatch(/^[a-z][a-z0-9-]*$/)
        expect(node.title.trim()).not.toBe('')
        if (node.children) {
          expect(node.children.length).toBeGreaterThan(0)
          check(node.children)
        }
      }
    }
    check(taxonomy)
  })

  it('resolves paths and breadcrumbs', () => {
    expect(nodeAt('health/basic-sciences/anatomy/osteology')?.title).toBe('Osteología')
    expect(trail('mathematics/analysis/calculus/derivatives').map((n) => n.title)).toEqual([
      'Matemáticas',
      'Análisis',
      'Cálculo',
      'Derivadas',
    ])
    expect(trail('health/nowhere')).toEqual([])
    // Same id under different parents is fine: paths are the identity.
    expect(nodeAt('health/clinical/internal-medicine/neurology')).not.toBe(nodeAt('health/basic-sciences/anatomy/neurology'))
    expect(taxonomyPaths()).toContain('languages/classical/latin')
  })

  it('tests ancestry on whole segments', () => {
    expect(isWithin('health/basic-sciences/anatomy/osteology', 'health/basic-sciences')).toBe(true)
    expect(isWithin('health/basic-sciences', 'health/basic-sciences')).toBe(true)
    expect(isWithin('health/basic-sciences-extra', 'health/basic-sciences')).toBe(false)
  })

  it('reports placement problems', () => {
    const ids = new Set(['anatomy', 'latin'])
    expect(placementProblems({ id: 'anatomy', home: 'health/basic-sciences/anatomy' }, ids)).toEqual([])
    expect(
      placementProblems(
        {
          id: 'x',
          home: 'health/anatomy',
          facets: { system: ['skeletal', 'bony'], era: ['rome'] },
          related: ['x', 'ghost'],
          prereqs: ['latin'],
        },
        ids,
      ),
    ).toEqual([
      'home "health/anatomy" is not a taxonomy path',
      'unknown value "bony" for facet "system"',
      'unknown facet "era"',
      'related lists the tome itself',
      'related points to unknown tome "ghost"',
    ])
  })

  it('has Spanish labels for every facet value', () => {
    for (const facet of Object.values(facets)) {
      for (const label of Object.values(facet.values)) expect(label.trim()).not.toBe('')
    }
  })
})

describe('tome placement', () => {
  const ids = new Set(manifests.map((m) => m.id))

  it.each(manifests.map((m) => [m.id, m] as const))('%s is placed on the map', (_, manifest) => {
    expect(placementProblems(manifest, ids)).toEqual([])
  })
})
