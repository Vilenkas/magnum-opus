import type { MDXComponents } from 'mdx/types'
import { Cite } from './Citations'
import { MarginNote } from './MarginNote'
import { CartesianPlane } from './CartesianPlane'
import { ConicExplorer } from './ConicExplorer'
import { GeometryQuiz } from './GeometryQuiz'

/** Components available inside every geometry MDX chapter without importing. */
export const mdxComponents: MDXComponents = {
  Cita: Cite,
  MarginNote,
  CartesianPlane,
  ConicExplorer,
  GeometryQuiz,
  ExamenGeometria: GeometryQuiz,
}

