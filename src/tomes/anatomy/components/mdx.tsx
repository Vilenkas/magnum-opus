import { lazy, Suspense } from 'react'
import type { MDXComponents } from 'mdx/types'
import { MarginNote } from './MarginNote'
import { SkeletonBreakdown } from './SkeletonBreakdown'

// three.js is heavy: only fetched when a chapter actually renders the viewer.
const LazySkeletonViewer = lazy(() =>
  import('./SkeletonViewer').then((m) => ({ default: m.SkeletonViewer })),
)

function SkeletonViewer() {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center', fontStyle: 'italic' }}>Preparando la lámina…</p>}>
      <LazySkeletonViewer />
    </Suspense>
  )
}

/** Components available inside every anatomy MDX chapter without importing. */
export const mdxComponents: MDXComponents = {
  MarginNote,
  SkeletonBreakdown,
  SkeletonViewer,
}
