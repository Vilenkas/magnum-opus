import { describe, expect, it } from 'vitest'
import { nouns } from '../data/nouns'
import { analyzePool, checkAnalysis, checkDeclined, declinePool, readingKey } from './declension-drill'

const ALL = [1, 2, 3, 4, 5] as const

describe('declinePool', () => {
  it('asks all twelve forms of every noun in the chosen declensions', () => {
    expect(declinePool([...ALL])).toHaveLength(nouns.length * 12)
    const first = declinePool([1])
    expect(first.every((i) => i.noun.declension === 1)).toBe(true)
    expect(new Set(first.map((i) => i.id)).size).toBe(first.length)
  })
})

describe('checkDeclined', () => {
  const genPl = declinePool([1]).find((i) => i.id === 'd:rosa:gen.pl')!

  it('accepts the form with or without macrons, any case', () => {
    expect(checkDeclined(genPl, 'rosārum').correct).toBe(true)
    expect(checkDeclined(genPl, ' Rosarum ').correct).toBe(true)
  })

  it('explains which case a wrong-but-real form is', () => {
    const v = checkDeclined(genPl, 'rosae')
    expect(v.correct).toBe(false)
    expect(v.actually.map(readingKey).sort()).toEqual(['dat.sg', 'gen.sg', 'nom.pl', 'voc.pl'].sort())
  })

  it('says nothing for an invented form', () => {
    expect(checkDeclined(genPl, 'rosorum')).toEqual({ correct: false, actually: [] })
  })
})

describe('analyzePool', () => {
  it('has one item per distinct written form, each with its readings', () => {
    const rosa = analyzePool([1]).filter((i) => i.noun.id === 'rosa')
    // rosa, rosam, rosae, rosarum, rosis, rosas (written without macrons).
    expect(rosa.map((i) => i.written).sort()).toEqual(['rosa', 'rosae', 'rosam', 'rosarum', 'rosas', 'rosis'])
    const total = rosa.reduce((sum, i) => sum + i.readings.length, 0)
    expect(total).toBe(12)
  })
})

describe('checkAnalysis', () => {
  const rosae = analyzePool([1]).find((i) => i.id === 'a:rosa:rosae')!

  it('requires exactly the set of possible readings', () => {
    expect(checkAnalysis(rosae, ['gen.sg', 'dat.sg', 'nom.pl', 'voc.pl']).correct).toBe(true)
  })

  it('reports what is missing and what is extra', () => {
    const v = checkAnalysis(rosae, ['gen.sg', 'acc.sg'])
    expect(v.correct).toBe(false)
    expect(v.missing.sort()).toEqual(['dat.sg', 'nom.pl', 'voc.pl'])
    expect(v.extra).toEqual(['acc.sg'])
  })
})
