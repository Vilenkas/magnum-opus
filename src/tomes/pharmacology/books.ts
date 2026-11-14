import type { ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'

type MdxModule = { default: ComponentType<MDXProps> }

export interface Book {
  /** URL segment inside the tome. */
  id: string
  /** The part of the treatise it belongs to. */
  part: string
  numeral: string
  title: string
  summary: string
  /** Undefined while the book hasn't been written yet. */
  load?: () => Promise<MdxModule>
}

/** The treatise, in the order of Katzung's section on the central nervous system. */
export const books: Book[] = [
  {
    id: 'cns',
    part: 'Psicofarmacología',
    numeral: 'I',
    title: 'La neurotransmisión en el SNC',
    summary: 'GABA, glutamato, serotonina, noradrenalina y dopamina: las dianas de los psicofármacos.',
  },
  {
    id: 'sedative-hypnotics',
    part: 'Psicofarmacología',
    numeral: 'II',
    title: 'Ansiolíticos y sedantes-hipnóticos',
    summary: 'Benzodiacepinas, barbitúricos, fármacos Z y los hipnóticos de la melatonina y la orexina.',
    load: () => import('./chapters/sedative-hypnotics.mdx'),
  },
  {
    id: 'antiepileptics',
    part: 'Psicofarmacología',
    numeral: 'III',
    title: 'Antiepilépticos',
    summary: 'Por su mecanismo: canales de sodio y de calcio, GABA, SV2A y glutamato.',
    load: () => import('./chapters/antiepileptics.mdx'),
  },
  {
    id: 'antipsychotics',
    part: 'Psicofarmacología',
    numeral: 'IV',
    title: 'Antipsicóticos y estabilizadores del ánimo',
    summary: 'Típicos, atípicos y agonistas parciales; el litio y los estabilizadores.',
  },
  {
    id: 'antidepressants',
    part: 'Psicofarmacología',
    numeral: 'V',
    title: 'Antidepresivos',
    summary: 'ISRS, IRSN, tricíclicos, IMAO y los antidepresivos atípicos.',
  },
]
