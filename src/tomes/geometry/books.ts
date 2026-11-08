import type { ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'

type MdxModule = { default: ComponentType<MDXProps> }

export interface Book {
  /** URL segment inside the tome. */
  id: string
  numeral: string
  title: string
  subtitle?: string
  summary: string
  /** Undefined while the book hasn't been written yet. */
  load?: () => Promise<MdxModule>
}

export const books: Book[] = [
  {
    id: 'analytic-geometry',
    numeral: 'I',
    title: 'Geometría analítica',
    subtitle: 'El puente entre el álgebra y la geometría',
    summary:
      'Sistemas coordenados, la recta, las secciones cónicas y las superficies en el espacio según el método de Descartes y Fermat.',
    load: () => import('./chapters/analytic-geometry.mdx'),
  },
  {
    id: 'euclidean-geometry',
    numeral: 'II',
    title: 'Geometría euclidiana',
    subtitle: 'El método axiomático',
    summary:
      'Los Elementos: definiciones, postulados, axiomas, construcciones con regla y compás y el estudio de las figuras en el plano.',
  },
  {
    id: 'trigonometry',
    numeral: 'III',
    title: 'Trigonometría',
    subtitle: 'La medida del triángulo y el círculo',
    summary:
      'Razones trigonométricas, funciones circulares, identidades y resolución de triángulos rectángulos y oblicuángulos.',
  },
  {
    id: 'non-euclidean-geometry',
    numeral: 'IV',
    title: 'Geometrías no euclidianas',
    subtitle: 'Más allá del quinto postulado',
    summary:
      'Las geometrías hiperbólica (Lobachevski-Bolyai) y elíptica (Riemann): espacios de curvatura constante no nula.',
  },
  {
    id: 'differential-geometry',
    numeral: 'V',
    title: 'Geometría diferencial',
    subtitle: 'Curvas y superficies suaves',
    summary:
      'Cálculo aplicado a las formas: curvatura, torsión, primera y segunda formas fundamentales y el teorema de Gauss-Bonnet.',
  },
  {
    id: 'topology',
    numeral: 'VI',
    title: 'Topología',
    subtitle: 'La geometría de la continuidad',
    summary:
      'Propiedades que se conservan bajo deformaciones continuas: conjuntos abiertos, conexidad, compacidad y variedades.',
  },
]
