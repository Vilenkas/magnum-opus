import type { Ref } from './sources'

/**
 * A family or subfamily of drugs. The tome's classification follows the books (by use and
 * mechanism), not the WHO's ATC, which each card only shows as a datum.
 */
export interface DrugClass {
  id: string
  title: string
  parent?: string
  /** The treatise's book that explains the class (set on the roots). */
  book?: string
  summary: string
  /** How the class acts; inherited by its subclasses and drugs unless they bring their own. */
  mechanism?: string
  /** Adverse effects shared by the whole class, shown on every card under it. */
  adverse?: string[]
  refs?: Ref[]
}

/** Elimination half-life in hours; with `metabolites`, counting its active metabolites. */
export interface HalfLife {
  min: number
  max: number
  metabolites?: boolean
  ref: Ref
}

export interface Drug {
  /** English INN, kebab-case: the URL and the key of its molecule. */
  id: string
  /** PubChem compound id (tools/pharmacology/fetch-molecules.mjs reads it). */
  cid: number
  /** Spanish INN (DCI). */
  name: string
  /** English INN. */
  inn: string
  /** The originator's brand, only when it is known worldwide. */
  brand?: string
  /** First = main class (a leaf of the classification); the rest, other families it serves. */
  classes: string[]
  /** Withdrawn from the market, or still marketed but no longer used. */
  status?: { kind: 'withdrawn' | 'obsolete'; note: string }
  /** One line: what it is and what it is for. */
  summary: string
  /** Its own mechanism, when the class's does not describe it well enough. */
  mechanism?: string
  uses: string[]
  halfLife?: HalfLife
  kinetics?: string[]
  adverse?: string[]
  interactions?: string[]
  notes?: string[]
  refs: Ref[]
}
