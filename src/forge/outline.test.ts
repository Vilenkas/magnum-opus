import { describe, expect, it } from 'vitest'
import { activeEntry, buildOutline, slugify, visibleEntries } from './outline'

describe('slugify', () => {
  it('drops accents and punctuation', () => {
    expect(slugify('Las células: de la célula osteógena al osteocito')).toBe('las-celulas-de-la-celula-osteogena-al-osteocito')
  })
  it('never returns an empty id', () => {
    expect(slugify('¿?')).toBe('seccion')
  })
})

describe('buildOutline', () => {
  const outline = buildOutline([
    { level: 3, text: 'Antes' },
    { level: 2, text: 'Arquitectura interior' },
    { level: 3, text: 'Huesos largos' },
    { level: 2, text: 'Otra parte' },
    { level: 3, text: 'Huesos largos' },
    { level: 2, text: 'Fuentes', id: 'fuentes' },
    { level: 2, text: 'fuentes' },
  ])

  it('keeps ids unique, existing ones first', () => {
    expect(outline.map((e) => e.id)).toEqual([
      'antes',
      'arquitectura-interior',
      'huesos-largos',
      'otra-parte',
      'huesos-largos-2',
      'fuentes',
      'fuentes-2',
    ])
  })

  it('links each h3 to its h2', () => {
    expect(outline.map((e) => e.section)).toEqual([-1, 1, 1, 3, 3, 5, 6])
  })

  it('lists every h2 and only the open section’s h3s', () => {
    expect(visibleEntries(outline, 2)).toEqual([1, 2, 3, 5, 6])
    expect(visibleEntries(outline, 3)).toEqual([1, 3, 4, 5, 6])
    expect(visibleEntries(outline, -1)).toEqual([1, 3, 5, 6])
  })
})

describe('activeEntry', () => {
  it('is the last heading above the reading line', () => {
    expect(activeEntry([-500, -10, 300, 900], 200)).toBe(1)
    expect(activeEntry([250, 900], 200)).toBe(-1)
    expect(activeEntry([-900, -500], 200)).toBe(1)
  })
})
