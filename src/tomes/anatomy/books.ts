import type { ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'

type MdxModule = { default: ComponentType<MDXProps> }

export interface Book {
  /** URL segment inside the tome. */
  id: string
  numeral: string
  title: string
  summary: string
  /** Undefined while the book hasn't been written yet. */
  load?: () => Promise<MdxModule>
}

/** The anatomy tome is organised in "books", like the classical treatises. */
export const books: Book[] = [
  {
    id: 'osteology',
    numeral: 'I',
    title: 'Osteología',
    summary: 'Los huesos: su forma, estructura y organización en el esqueleto.',
    load: () => import('./chapters/osteology.mdx'),
  },
  {
    id: 'arthrology',
    numeral: 'II',
    title: 'Artrología',
    summary: 'Las articulaciones y sus movimientos.',
    load: () => import('./chapters/arthrology.mdx'),
  },
  {
    id: 'myology',
    numeral: 'III',
    title: 'Miología',
    summary: 'Los músculos y su acción sobre el esqueleto.',
    load: () => import('./chapters/myology.mdx'),
  },
  {
    id: 'angiology',
    numeral: 'IV',
    title: 'Angiología',
    summary: 'El corazón y los vasos: arterias, capilares, venas y linfáticos.',
    load: () => import('./chapters/angiology.mdx'),
  },
  {
    id: 'neurology',
    numeral: 'V',
    title: 'Neurología',
    summary: 'El sistema nervioso central y periférico.',
    load: () => import('./chapters/neurology.mdx'),
  },
  {
    id: 'splanchnology',
    numeral: 'VI',
    title: 'Esplacnología',
    summary: 'Las vísceras: el aparato digestivo, el peritoneo y el aparato urogenital.',
    load: () => import('./chapters/splanchnology.mdx'),
  },
  { id: 'aesthesiology', numeral: 'VII', title: 'Estesiología', summary: 'Los órganos de los sentidos.' },
]
