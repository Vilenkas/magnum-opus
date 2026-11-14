import { describe, expect, it } from 'vitest'
import rawMolecules from '../assets/molecules.json'
import { books } from '../books'
import {
  classById,
  classes,
  childrenOf,
  classPathText,
  drugById,
  drugs,
  drugsIn,
  durationOf,
  familyOf,
  formatHalfLife,
  mechanismOf,
} from './catalog'
import { drawMolecule, formulaOf, type Molecule } from './molecule'
import { searchBank } from './search'
import { sources } from './sources'

const molecules = rawMolecules as unknown as Record<string, Molecule>

describe('classification', () => {
  it('has unique ids, existing parents and no cycles', () => {
    expect(new Set(classes.map((c) => c.id)).size).toBe(classes.length)
    for (const c of classes) {
      if (c.parent) expect(classById.has(c.parent), `${c.id} → ${c.parent}`).toBe(true)
      const seen = new Set<string>()
      for (let x = c; x.parent; x = classById.get(x.parent)!) {
        expect(seen.has(x.id), `cycle at ${c.id}`).toBe(false)
        seen.add(x.id)
      }
    }
  })

  it('gives every family a book of the treatise, and only families', () => {
    for (const c of classes) {
      if (!c.parent) expect(books.some((b) => b.id === c.book), c.id).toBe(true)
      else expect(c.book, c.id).toBeUndefined()
    }
  })
})

describe('drugs', () => {
  it('have unique kebab-case ids and Spanish names', () => {
    expect(new Set(drugs.map((d) => d.id)).size).toBe(drugs.length)
    for (const d of drugs) {
      expect(d.id).toMatch(/^[a-z][a-z0-9-]*$/)
      expect(d.name.trim()).not.toBe('')
      expect(d.uses.length, d.id).toBeGreaterThan(0)
    }
  })

  it('have a leaf as main class and existing classes otherwise', () => {
    for (const d of drugs) {
      for (const c of d.classes) expect(classById.has(c), `${d.id}: ${c}`).toBe(true)
      expect(childrenOf(d.classes[0]), `${d.id}'s main class is not a leaf`).toEqual([])
      // Extra classes name other families, not the main one again.
      for (const c of d.classes.slice(1)) expect(familyOf(c)).not.toBe(familyOf(d.classes[0]))
    }
  })

  it('cite known sources and sane half-lives', () => {
    for (const d of drugs) {
      expect(d.refs.length, d.id).toBeGreaterThan(0)
      for (const r of [...d.refs, ...(d.halfLife ? [d.halfLife.ref] : [])]) expect(r.source in sources).toBe(true)
      if (d.halfLife) {
        expect(d.halfLife.min).toBeGreaterThan(0)
        expect(d.halfLife.max).toBeGreaterThanOrEqual(d.halfLife.min)
      }
    }
  })

  it('all state a mechanism, their own or their class’s', () => {
    for (const d of drugs) expect(mechanismOf(d), d.id).toBeTruthy()
  })

  it('sort benzodiazepines by half-life as Goodman & Gilman do (< 6 h, 6-24 h, > 24 h)', () => {
    const band = { 'bzd-short': 'short', 'bzd-intermediate': 'intermediate', 'bzd-long': 'long' } as const
    for (const d of drugsIn('benzodiazepines')) {
      expect(d.halfLife, d.id).toBeDefined()
      expect(durationOf(d.halfLife!), d.id).toBe(band[d.classes[0] as keyof typeof band])
    }
    expect(drugById.get('triazolam')!.classes[0]).toBe('bzd-short')
    expect(drugById.get('diazepam')!.classes[0]).toBe('bzd-long')
  })

  it('count drugs serving another family through their extra classes', () => {
    expect(drugsIn('antiepileptics')).toEqual([])
    expect(drugsIn('antiepileptics', true).map((d) => d.id)).toEqual(
      expect.arrayContaining(['clonazepam', 'diazepam', 'phenobarbital', 'clobazam']),
    )
  })

  it('format half-lives in hours or days', () => {
    expect(formatHalfLife(drugById.get('triazolam')!.halfLife!)).toBe('2-3 h')
    expect(formatHalfLife(drugById.get('phenobarbital')!.halfLife!)).toBe('4-5 días')
    expect(formatHalfLife(drugById.get('flumazenil')!.halfLife!)).toBe('0,7-1,3 h')
  })
})

describe('molecules', () => {
  it('exist for every drug and only for them', () => {
    expect(Object.keys(molecules).sort()).toEqual(drugs.map((d) => d.id).sort())
    for (const d of drugs) expect(molecules[d.id].cid, d.id).toBe(d.cid)
  })

  it('draw exactly the formula PubChem gives', () => {
    for (const [id, m] of Object.entries(molecules)) expect(formulaOf(m.atoms), id).toBe(m.formula)
  })

  it('label heteroatoms with their hydrogens, on the side free of bonds', () => {
    const lorazepam = drawMolecule(molecules.lorazepam)
    const oh = lorazepam.labels.filter((l) => l.element === 'O' && l.h === 1)
    expect(oh).toHaveLength(1)
    const diazepam = drawMolecule(molecules.diazepam)
    expect(diazepam.labels.map((l) => l.element).sort()).toEqual(['Cl', 'N', 'N', 'O'])
    expect(diazepam.labels.every((l) => l.h === 0)).toBe(true)
    // Chloral hydrate: Cl3C–CH(OH)2.
    expect(drawMolecule(molecules['chloral-hydrate']).labels.filter((l) => l.element === 'O' && l.h === 1)).toHaveLength(2)
  })

  it('draws double bonds as two lines and keeps the drawing in its box', () => {
    const d = drawMolecule(molecules.diazepam)
    const doubles = molecules.diazepam.bonds.filter((b) => b[2] === 2).length
    const twoLines = d.bonds.filter((s) => s.kind === 'lines' && s.lines.length === 2).length
    expect(twoLines).toBe(doubles)
    for (const s of d.bonds) {
      const pts = s.kind === 'wedge' ? s.points : s.lines.flatMap((l) => [[l.x1, l.y1], [l.x2, l.y2]] as [number, number][])
      for (const [x, y] of pts) {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(d.width)
        expect(y).toBeLessThanOrEqual(d.height)
      }
    }
  })

  it('puts the inner line of a ring double bond towards the ring’s centre', () => {
    // Benzene drawn by hand: a regular hexagon of alternating bonds.
    const atoms = Array.from({ length: 6 }, (_, i) => ['C', Math.cos((i * Math.PI) / 3), Math.sin((i * Math.PI) / 3), 1] as [string, number, number, number])
    const bonds = Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6, i % 2 ? 1 : 2] as [number, number, number])
    const d = drawMolecule({ atoms, bonds })
    const cx = d.width / 2
    const cy = d.height / 2
    for (const s of d.bonds) {
      if (s.kind !== 'lines' || s.lines.length !== 2) continue
      const [outer, inner] = s.lines
      const dist = (l: (typeof s.lines)[number]) => Math.hypot((l.x1 + l.x2) / 2 - cx, (l.y1 + l.y2) / 2 - cy)
      expect(dist(inner)).toBeLessThan(dist(outer))
    }
  })
})

describe('search', () => {
  const find = (q: string) => searchBank(q, drugs, classes, classPathText)
  const first = (q: string) => {
    const h = find(q)[0]
    return h ? (h.kind === 'drug' ? h.drug.id : `class:${h.cls.id}`) : undefined
  }

  it('finds by Spanish name, English INN and brand, without accents', () => {
    expect(first('diazepam')).toBe('diazepam')
    expect(first('Zaleplón')).toBe('zaleplon')
    expect(first('zaleplon')).toBe('zaleplon')
    expect(first('valium')).toBe('diazepam')
    expect(first('Rivotril')).toBe('clonazepam')
    expect(first('chloral')).toBe('chloral-hydrate')
    expect(first('hidrato de cloral')).toBe('chloral-hydrate')
  })

  it('forgives small typos and partial words', () => {
    expect(first('diacepam')).toBe('diazepam')
    expect(first('alprazolan')).toBe('alprazolam')
    expect(first('zolpiden')).toBe('zolpidem')
    expect(first('fenobarb')).toBe('phenobarbital')
  })

  it('finds classes, and drugs through their class', () => {
    expect(first('benzodiacepinas')).toBe('class:benzodiazepines')
    expect(find('barbituricos').filter((h) => h.kind === 'drug').length).toBe(drugsIn('barbiturates').length)
    expect(find('')).toEqual([])
    expect(find('xyzzy')).toEqual([])
  })
})
