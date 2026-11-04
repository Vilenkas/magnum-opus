import { describe, expect, it } from 'vitest'
import { declarations, resolveFigure } from './registry'

describe('figures', () => {
  it('only ever reads the public and private folders', () => {
    for (const d of declarations) expect(['public', 'private']).toContain(d.folder)
  })

  it('keeps public figures openly licensed', () => {
    const restricted = declarations
      .filter((d) => d.folder === 'public')
      .flatMap((d) => d.figures)
      .filter((f) => f.license === 'restricted')
      .map((f) => f.id)
    expect(restricted).toEqual([])
  })

  it('declares unique ids', () => {
    const ids = declarations.flatMap((d) => d.figures.map((f) => f.id))
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('finds the file of every declared figure', () => {
    const missing = declarations.flatMap((d) =>
      d.figures.filter((f) => !d.files.includes(f.file)).map((f) => `${d.folder}/${f.file}`),
    )
    expect(missing).toEqual([])
  })

  it('credits every figure', () => {
    for (const f of declarations.flatMap((d) => d.figures)) {
      expect(f.title.trim(), f.id).not.toBe('')
      expect(f.credit.trim(), f.id).not.toBe('')
    }
  })

  it('resolves nothing for unknown ids', () => {
    expect(resolveFigure('no-such-figure')).toBeUndefined()
    expect(resolveFigure(['no-such-figure', 'nor-this'])).toBeUndefined()
  })
})
