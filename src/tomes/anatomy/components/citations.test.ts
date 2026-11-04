import { describe, expect, it } from 'vitest'
import { shortRef, sources } from '../data/sources'
import { pageList } from './Citations'

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
