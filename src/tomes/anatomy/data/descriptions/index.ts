/**
 * Written descriptions of single structures, shown by the «Descripción» button of every 3D viewer.
 * Keyed by the structure's Terminologia Anatomica English name, without side (both sides share it),
 * as the viewers' data carry it (`en`). Each region adds its file as its descriptive chapter is
 * written; a structure without one says so. Texts are paraphrased and cited like the chapters.
 */
import { sources, type SourceId } from '../sources'
import { heart } from './heart'

export interface DescriptionSource {
  fuente: SourceId
  p?: string
}

export interface Description {
  /** One or more short paragraphs, Spanish. `**bold**` and `*italic*` are allowed. */
  text: string[]
  sources: DescriptionSource[]
}

export const descriptionKey = (en: string) => en.trim().toLowerCase()

/** Every file of descriptions, by region; the tests check the keys against the models. */
export const DESCRIPTION_FILES: Record<string, Record<string, Description>> = { heart }

const all = new Map<string, Description>()
for (const file of Object.values(DESCRIPTION_FILES)) for (const [en, d] of Object.entries(file)) all.set(descriptionKey(en), d)

export function descriptionOf(en: string | null | undefined): Description | undefined {
  return en ? all.get(descriptionKey(en)) : undefined
}

/** How the chapters name each work in running text. */
const SHORT: [prefix: string, name: string][] = [
  ['testut', 'Testut'],
  ['latarjet-ruiz', 'Latarjet y Ruiz Liard'],
  ['rouviere', 'Rouvière'],
  ['moore-8', 'Moore 8.ª'],
  ['moore', 'Moore 9.ª'],
  ['pro', 'Pró'],
  ['netter', 'Netter'],
]

/** "Testut, t. II, p. 39" — the short reference printed under a description. */
export function sourceLabel({ fuente, p }: DescriptionSource): string {
  const s = sources[fuente] as { title: string; volume?: string }
  const who = SHORT.find(([prefix]) => fuente.startsWith(prefix))?.[1] ?? s.title
  const vol = s.volume?.match(/^Tomo (\w+)/)?.[1]
  return [who, vol && `t. ${vol}`, p && `p. ${p}`].filter(Boolean).join(', ')
}
