import type { ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'

type MdxModule = { default: ComponentType<MDXProps> }

export interface Book {
  /** URL segment inside the tome. */
  id: string
  numeral: string
  /** Latin title, carved on the tablet. */
  latin: string
  title: string
  summary: string
  /** Undefined while the book hasn't been written yet. */
  load?: () => Promise<MdxModule>
}

export const books: Book[] = [
  { id: 'alphabet', numeral: 'I', latin: 'Litterae', title: 'Alfabeto y pronunciación', summary: 'Las veintitrés letras y cómo sonaban en la Roma clásica.' },
  { id: 'history', numeral: 'II', latin: 'Historia', title: 'Origen e historia', summary: 'Del Lacio a las lenguas romances.' },
  {
    id: 'declensions',
    numeral: 'III',
    latin: 'Declinātiōnēs',
    title: 'Las declinaciones',
    summary: 'Los casos, las cinco declinaciones y cómo cambia cada palabra.',
    load: () => import('./chapters/declensions.mdx'),
  },
  { id: 'verbs', numeral: 'IV', latin: 'Verba', title: 'Los verbos', summary: 'Las cuatro conjugaciones y sus tiempos.' },
  { id: 'vocabulary', numeral: 'V', latin: 'Vocābula', title: 'Vocabulario', summary: 'Palabras esenciales y sus herederas en español.' },
]
