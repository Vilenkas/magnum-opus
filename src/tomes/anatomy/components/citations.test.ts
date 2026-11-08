import { describe, expect, it } from 'vitest'
import { shortRef, sources } from '../data/sources'
import { figureList, pageList } from './Citations'

describe('pageList', () => {
  it('merges single pages and ranges into runs', () => {
    expect(pageList(['6', '6–7', '8', '10'])).toBe('6–8, 10')
    expect(pageList(['1', '3', '4-5', '6', '24', '20–23'])).toBe('1, 3–6, 20–24')
  })

  it('keeps a single page and non-numeric pages', () => {
    expect(pageList(['12'])).toBe('12')
    expect(pageList(['xii', '3'])).toBe('3, xii')
  })
})

describe('sources', () => {
  it('shortens references without initials', () => {
    expect(shortRef(sources['testut-1'])).toBe('Testut y Latarjet, 1975')
  })

  it('falls back to the title for works without authors or year', () => {
    expect(shortRef(sources['z-anatomy'])).toBe('Z-Anatomy')
  })

  it('states the licence of every reused model or dataset', () => {
    expect(sources['z-anatomy'].license).toBe('CC BY-SA 4.0')
    expect(sources.bodyparts3d.license).toBe('CC BY-SA 2.1 Japón')
  })
})

describe('figureList', () => {
  it('orders figures by number and lists plates after them', () => {
    expect(figureList(['fig. 12', 'fig. 3', 'lám. S-120', 'lám. S-1'])).toBe('Figs. 3, 12. Láms. S-1, S-120')
    expect(figureList(['fig. 560 bis'])).toBe('Fig. 560 bis')
    expect(figureList(['lám. S-34'])).toBe('Lám. S-34')
  })
})
