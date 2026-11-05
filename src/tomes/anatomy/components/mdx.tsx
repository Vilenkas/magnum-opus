import { lazy, Suspense, type ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import { Cite } from './Citations'
import { Figure } from './Figure'
import { MarginNote } from './MarginNote'
import { JointBreakdown, SkeletonBreakdown } from './SkeletonBreakdown'

/** three.js is heavy: 3D plates are only fetched when a chapter actually renders them. */
function lazyPlate(load: () => Promise<ComponentType>) {
  const Lazy = lazy(async () => ({ default: await load() }))
  return function Plate() {
    return (
      <Suspense fallback={<p style={{ textAlign: 'center', fontStyle: 'italic' }}>Preparando la lámina…</p>}>
        <Lazy />
      </Suspense>
    )
  }
}

/** Components available inside every anatomy MDX chapter without importing. */
export const mdxComponents: MDXComponents = {
  // Spanish name in MDX, like the rest of the chapter's content.
  Figura: Figure,
  Cita: Cite,
  MarginNote,
  SkeletonBreakdown,
  JointBreakdown,
  SkeletonViewer: lazyPlate(() => import('./SkeletonViewer').then((m) => m.SkeletonViewer)),
  SkeletonQuiz: lazyPlate(() => import('./SkeletonQuiz').then((m) => m.SkeletonQuiz)),
  JointTypes: lazyPlate(() => import('./JointTypes').then((m) => m.JointTypes)),
  LeverTypes: lazyPlate(() => import('./LeverTypes').then((m) => m.LeverTypes)),
}
