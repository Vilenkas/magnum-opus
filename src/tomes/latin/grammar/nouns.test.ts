import { describe, expect, it } from 'vitest'
import { nounById, nouns } from '../data/nouns'
import { analyze, CASES, decline, dictionaryEntry, NUMBERS, stemOf, withoutMacrons, type Case } from './nouns'

const forms = (id: string) => {
  const p = decline(nounById.get(id)!)
  const row = (n: 'sg' | 'pl') => CASES.map((c) => p[n][c].form)
  return { sg: row('sg'), pl: row('pl') }
}

// Reference paradigms in Spanish school order: N, V, Ac, G, D, Ab.
const REFERENCE: Record<string, { sg: string[]; pl: string[] }> = {
  rosa: {
    sg: ['rosa', 'rosa', 'rosam', 'rosae', 'rosae', 'rosā'],
    pl: ['rosae', 'rosae', 'rosās', 'rosārum', 'rosīs', 'rosīs'],
  },
  agricola: {
    sg: ['agricola', 'agricola', 'agricolam', 'agricolae', 'agricolae', 'agricolā'],
    pl: ['agricolae', 'agricolae', 'agricolās', 'agricolārum', 'agricolīs', 'agricolīs'],
  },
  dominus: {
    sg: ['dominus', 'domine', 'dominum', 'dominī', 'dominō', 'dominō'],
    pl: ['dominī', 'dominī', 'dominōs', 'dominōrum', 'dominīs', 'dominīs'],
  },
  filius: {
    sg: ['fīlius', 'fīlī', 'fīlium', 'fīliī', 'fīliō', 'fīliō'],
    pl: ['fīliī', 'fīliī', 'fīliōs', 'fīliōrum', 'fīliīs', 'fīliīs'],
  },
  puer: {
    sg: ['puer', 'puer', 'puerum', 'puerī', 'puerō', 'puerō'],
    pl: ['puerī', 'puerī', 'puerōs', 'puerōrum', 'puerīs', 'puerīs'],
  },
  ager: {
    sg: ['ager', 'ager', 'agrum', 'agrī', 'agrō', 'agrō'],
    pl: ['agrī', 'agrī', 'agrōs', 'agrōrum', 'agrīs', 'agrīs'],
  },
  bellum: {
    sg: ['bellum', 'bellum', 'bellum', 'bellī', 'bellō', 'bellō'],
    pl: ['bella', 'bella', 'bella', 'bellōrum', 'bellīs', 'bellīs'],
  },
  rex: {
    sg: ['rēx', 'rēx', 'rēgem', 'rēgis', 'rēgī', 'rēge'],
    pl: ['rēgēs', 'rēgēs', 'rēgēs', 'rēgum', 'rēgibus', 'rēgibus'],
  },
  corpus: {
    sg: ['corpus', 'corpus', 'corpus', 'corporis', 'corporī', 'corpore'],
    pl: ['corpora', 'corpora', 'corpora', 'corporum', 'corporibus', 'corporibus'],
  },
  civis: {
    sg: ['cīvis', 'cīvis', 'cīvem', 'cīvis', 'cīvī', 'cīve'],
    pl: ['cīvēs', 'cīvēs', 'cīvēs', 'cīvium', 'cīvibus', 'cīvibus'],
  },
  nox: {
    sg: ['nox', 'nox', 'noctem', 'noctis', 'noctī', 'nocte'],
    pl: ['noctēs', 'noctēs', 'noctēs', 'noctium', 'noctibus', 'noctibus'],
  },
  mare: {
    sg: ['mare', 'mare', 'mare', 'maris', 'marī', 'marī'],
    pl: ['maria', 'maria', 'maria', 'marium', 'maribus', 'maribus'],
  },
  animal: {
    sg: ['animal', 'animal', 'animal', 'animālis', 'animālī', 'animālī'],
    pl: ['animālia', 'animālia', 'animālia', 'animālium', 'animālibus', 'animālibus'],
  },
  manus: {
    sg: ['manus', 'manus', 'manum', 'manūs', 'manuī', 'manū'],
    pl: ['manūs', 'manūs', 'manūs', 'manuum', 'manibus', 'manibus'],
  },
  cornu: {
    sg: ['cornū', 'cornū', 'cornū', 'cornūs', 'cornū', 'cornū'],
    pl: ['cornua', 'cornua', 'cornua', 'cornuum', 'cornibus', 'cornibus'],
  },
  res: {
    sg: ['rēs', 'rēs', 'rem', 'reī', 'reī', 'rē'],
    pl: ['rēs', 'rēs', 'rēs', 'rērum', 'rēbus', 'rēbus'],
  },
  dies: {
    sg: ['diēs', 'diēs', 'diem', 'diēī', 'diēī', 'diē'],
    pl: ['diēs', 'diēs', 'diēs', 'diērum', 'diēbus', 'diēbus'],
  },
}

describe('decline: reference paradigms', () => {
  for (const [id, expected] of Object.entries(REFERENCE)) {
    it(id, () => expect(forms(id)).toEqual(expected))
  }
})

describe('decline: whole vocabulary', () => {
  it('generates twelve non-empty forms for every noun', () => {
    for (const noun of nouns) {
      const p = decline(noun)
      for (const n of NUMBERS) for (const c of CASES) expect(p[n][c].form, `${noun.id} ${n} ${c}`).toMatch(/\S/)
    }
  })

  it('agrees on genitive singular with the dictionary', () => {
    for (const noun of nouns) expect(decline(noun).sg.gen.form, noun.id).toBe(noun.genitive)
  })

  it('makes neuter nominative, accusative and vocative identical', () => {
    for (const noun of nouns.filter((n) => n.gender === 'n')) {
      const p = decline(noun)
      for (const n of NUMBERS) {
        expect(p[n].acc.form, `${noun.id} ${n}`).toBe(p[n].nom.form)
        expect(p[n].voc.form, `${noun.id} ${n}`).toBe(p[n].nom.form)
      }
    }
  })

  it('has unique ids', () => {
    expect(new Set(nouns.map((n) => n.id)).size).toBe(nouns.length)
  })
})

describe('stemOf', () => {
  it('takes the stem from the genitive', () => {
    expect(stemOf(nounById.get('rex')!)).toBe('rēg')
    expect(stemOf(nounById.get('ager')!)).toBe('agr')
    expect(stemOf(nounById.get('dies')!)).toBe('di')
  })

  it('rejects a genitive that does not fit the declension', () => {
    expect(() => stemOf({ id: 'x', lemma: 'x', genitive: 'xae', gender: 'f', declension: 3 })).toThrow()
  })
})

describe('analyze', () => {
  const cases = (id: string, form: string) =>
    analyze(nounById.get(id)!, form)
      .map((a) => `${a.case}.${a.number}`)
      .sort()

  it('finds every reading of an ambiguous form, ignoring macrons', () => {
    expect(cases('rosa', 'rosae')).toEqual(['dat.sg', 'gen.sg', 'nom.pl', 'voc.pl'].sort())
    // Without macrons rosa (nom/voc) and rosā (abl) look the same.
    expect(cases('rosa', 'rosa')).toEqual(['abl.sg', 'nom.sg', 'voc.sg'].sort())
    expect(cases('dominus', 'domino')).toEqual(['abl.sg', 'dat.sg'])
    expect(cases('res', 'res')).toEqual(['acc.pl', 'nom.pl', 'nom.sg', 'voc.pl', 'voc.sg'].sort())
  })

  it('returns nothing for a form of another noun', () => {
    expect(cases('rosa', 'domini')).toEqual([])
  })
})

describe('helpers', () => {
  it('strips macrons only', () => {
    expect(withoutMacrons('rosārum fīliī')).toBe('rosarum filii')
  })

  it('writes dictionary entries the usual way', () => {
    expect(dictionaryEntry(nounById.get('rosa')!)).toBe('rosa, -ae (f.)')
    expect(dictionaryEntry(nounById.get('ager')!)).toBe('ager, agrī (m.)')
    expect(dictionaryEntry(nounById.get('rex')!)).toBe('rēx, rēgis (m.)')
    expect(dictionaryEntry(nounById.get('res')!)).toBe('rēs, -eī (f.)')
  })

  it('lists cases in Spanish school order', () => {
    expect(CASES).toEqual<Case[]>(['nom', 'voc', 'acc', 'gen', 'dat', 'abl'])
  })
})
