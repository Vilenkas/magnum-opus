/**
 * Latin noun declension (classical, with macrons for long vowels).
 *
 * A noun is defined the way dictionaries give it — nominative and genitive singular,
 * gender, declension — and every form is generated from that. The stem is the genitive
 * singular minus its ending (rosae → ros-, rēgis → rēg-, corporis → corpor-).
 */

export type Case = 'nom' | 'voc' | 'acc' | 'gen' | 'dat' | 'abl'
export type GrammaticalNumber = 'sg' | 'pl'
export type Gender = 'm' | 'f' | 'n'
export type Declension = 1 | 2 | 3 | 4 | 5

/** Spanish school order: N, V, Ac, G, D, Ab. */
export const CASES: Case[] = ['nom', 'voc', 'acc', 'gen', 'dat', 'abl']
export const NUMBERS: GrammaticalNumber[] = ['sg', 'pl']

export interface Noun {
  /** Lowercase dictionary key without macrons: "rosa", "rex". */
  id: string
  /** Nominative singular, with macrons: "rosa", "rēx". */
  lemma: string
  /** Genitive singular, with macrons: "rosae", "rēgis". */
  genitive: string
  gender: Gender
  declension: Declension
  /**
   * Third-declension i-stem: genitive plural in -ium (cīvium, urbium); neuters also take
   * ablative -ī and plural -ia (marī, maria).
   */
  iStem?: boolean
}

/** One generated form, split so the ending can be shown apart from the stem. */
export interface Form {
  stem: string
  ending: string
  /** stem + ending, or the irregular nominative/vocative when `ending` is ''. */
  form: string
}

export type Paradigm = Record<GrammaticalNumber, Record<Case, Form>>

const GENITIVE_ENDINGS: Record<Declension, string[]> = {
  1: ['ae'],
  2: ['ī'],
  3: ['is'],
  4: ['ūs'],
  5: ['ēī', 'eī'],
}

export function stemOf(noun: Noun): string {
  for (const ending of GENITIVE_ENDINGS[noun.declension]) {
    if (noun.genitive.endsWith(ending)) return noun.genitive.slice(0, -ending.length)
  }
  throw new Error(`Genitive "${noun.genitive}" doesn't fit declension ${noun.declension}`)
}

type EndingTable = Record<GrammaticalNumber, Record<Case, string>>

// Endings per declension. `null` means "the nominative itself" (3rd decl., neuters…).
const FIRST: EndingTable = {
  sg: { nom: 'a', voc: 'a', acc: 'am', gen: 'ae', dat: 'ae', abl: 'ā' },
  pl: { nom: 'ae', voc: 'ae', acc: 'ās', gen: 'ārum', dat: 'īs', abl: 'īs' },
}
const SECOND_MASC: EndingTable = {
  sg: { nom: 'us', voc: 'e', acc: 'um', gen: 'ī', dat: 'ō', abl: 'ō' },
  pl: { nom: 'ī', voc: 'ī', acc: 'ōs', gen: 'ōrum', dat: 'īs', abl: 'īs' },
}
const SECOND_NEUT: EndingTable = {
  sg: { nom: 'um', voc: 'um', acc: 'um', gen: 'ī', dat: 'ō', abl: 'ō' },
  pl: { nom: 'a', voc: 'a', acc: 'a', gen: 'ōrum', dat: 'īs', abl: 'īs' },
}
const THIRD: EndingTable = {
  sg: { nom: '', voc: '', acc: 'em', gen: 'is', dat: 'ī', abl: 'e' },
  pl: { nom: 'ēs', voc: 'ēs', acc: 'ēs', gen: 'um', dat: 'ibus', abl: 'ibus' },
}
const THIRD_NEUT: EndingTable = {
  sg: { nom: '', voc: '', acc: '', gen: 'is', dat: 'ī', abl: 'e' },
  pl: { nom: 'a', voc: 'a', acc: 'a', gen: 'um', dat: 'ibus', abl: 'ibus' },
}
const FOURTH: EndingTable = {
  sg: { nom: 'us', voc: 'us', acc: 'um', gen: 'ūs', dat: 'uī', abl: 'ū' },
  pl: { nom: 'ūs', voc: 'ūs', acc: 'ūs', gen: 'uum', dat: 'ibus', abl: 'ibus' },
}
const FOURTH_NEUT: EndingTable = {
  sg: { nom: 'ū', voc: 'ū', acc: 'ū', gen: 'ūs', dat: 'ū', abl: 'ū' },
  pl: { nom: 'ua', voc: 'ua', acc: 'ua', gen: 'uum', dat: 'ibus', abl: 'ibus' },
}
const FIFTH: EndingTable = {
  sg: { nom: 'ēs', voc: 'ēs', acc: 'em', gen: 'eī', dat: 'eī', abl: 'ē' },
  pl: { nom: 'ēs', voc: 'ēs', acc: 'ēs', gen: 'ērum', dat: 'ēbus', abl: 'ēbus' },
}

function endingsFor(noun: Noun, stem: string): EndingTable {
  const clone = (t: EndingTable): EndingTable => ({ sg: { ...t.sg }, pl: { ...t.pl } })
  switch (noun.declension) {
    case 1:
      return clone(FIRST)
    case 2:
      return clone(noun.gender === 'n' ? SECOND_NEUT : SECOND_MASC)
    case 3: {
      const t = clone(noun.gender === 'n' ? THIRD_NEUT : THIRD)
      if (noun.iStem) {
        t.pl.gen = 'ium'
        if (noun.gender === 'n') {
          t.sg.abl = 'ī'
          t.pl.nom = t.pl.voc = t.pl.acc = 'ia'
        }
      }
      return t
    }
    case 4:
      return clone(noun.gender === 'n' ? FOURTH_NEUT : FOURTH)
    case 5: {
      const t = clone(FIFTH)
      // diēī, faciēī: long ē after a vowel; reī, fideī: short e after a consonant.
      if (/[aeiouāēīōū]$/.test(stem)) t.sg.gen = t.sg.dat = 'ēī'
      return t
    }
  }
}

/** All twelve forms of a noun. */
export function decline(noun: Noun): Paradigm {
  const stem = stemOf(noun)
  const endings = endingsFor(noun, stem)
  const paradigm = { sg: {}, pl: {} } as Paradigm

  for (const n of NUMBERS) {
    for (const c of CASES) {
      paradigm[n][c] = { stem, ending: endings[n][c], form: stem + endings[n][c] }
    }
  }

  // The nominative singular is whatever the dictionary says (rēx, corpus, puer, nōmen):
  // it can't be built from the stem. Vocative follows it, except 2nd-declension -us.
  const lemma: Form = { stem: noun.lemma, ending: '', form: noun.lemma }
  paradigm.sg.nom = lemma
  const secondUs = noun.declension === 2 && noun.gender !== 'n' && noun.lemma.endsWith('us')
  if (!secondUs) {
    paradigm.sg.voc = lemma
  } else if (stem.endsWith('i')) {
    // fīlius → fīlī, Vergilius → Vergilī: -ie contracts to -ī.
    paradigm.sg.voc = { stem: stem.slice(0, -1), ending: 'ī', form: stem.slice(0, -1) + 'ī' }
  }
  // Neuters: accusative = nominative in the singular (corpus, nōmen, mare, cornū).
  if (noun.gender === 'n') paradigm.sg.acc = paradigm.sg.voc = lemma

  return paradigm
}

/** Removes macrons: "rosārum" → "rosarum". */
export const withoutMacrons = (s: string) => s.normalize('NFD').replace(/̄/g, '').normalize('NFC')

/**
 * Every case/number a written form can be (as texts are printed: without macrons).
 * "rosae" → gen sg, dat sg, nom pl, voc pl.
 */
export function analyze(noun: Noun, written: string): { case: Case; number: GrammaticalNumber }[] {
  const target = withoutMacrons(written).toLowerCase()
  const paradigm = decline(noun)
  const result: { case: Case; number: GrammaticalNumber }[] = []
  for (const n of NUMBERS) {
    for (const c of CASES) {
      if (withoutMacrons(paradigm[n][c].form).toLowerCase() === target) result.push({ case: c, number: n })
    }
  }
  return result
}

/** Dictionary entry as students write it: "rosa, -ae (f.)", "rēx, rēgis (m.)". */
export function dictionaryEntry(noun: Noun): string {
  const genEnding = GENITIVE_ENDINGS[noun.declension].find((e) => noun.genitive.endsWith(e))!
  // Short form "-ae" when the stem is visible in the lemma; full genitive otherwise.
  const stem = stemOf(noun)
  const genitive = noun.lemma.startsWith(stem) && noun.declension !== 3 ? `-${genEnding}` : noun.genitive
  return `${noun.lemma}, ${genitive} (${noun.gender}.)`
}
