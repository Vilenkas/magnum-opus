/**
 * LaTeX typeset by KaTeX inside React (the chapter's own `$…$` / `$$…$$` are typeset at build
 * time by rehype-katex; this is for the plates and the quiz).
 */
import { useMemo } from 'react'
import katex from 'katex'
import { splitMath } from '../data/math-text'
import styles from './Math.module.css'

/** One formula: inline in the text, or `block` (centred, same space above and below). */
export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(children, { displayMode: block, throwOnError: false, strict: 'ignore' }),
    [children, block],
  )
  return block ? (
    <div className={styles.block} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/** Prose with `$…$` inline math in it. */
export function MathText({ children }: { children: string }) {
  const parts = useMemo(() => splitMath(children), [children])
  return (
    <>
      {parts.map((part, i) =>
        part.kind === 'text' ? (
          <span key={i}>{part.value}</span>
        ) : part.trailing ? (
          <span key={i} className={styles.glued}>
            <Tex>{part.value}</Tex>
            {part.trailing}
          </span>
        ) : (
          <Tex key={i}>{part.value}</Tex>
        ),
      )}
    </>
  )
}

/**
 * A formula placed in an SVG plate (through foreignObject, so it is real KaTeX and scales with
 * the drawing). `x`, `y` mark the left end of its baseline, like an SVG <text>.
 */
export function SvgTex({ x, y, children, className }: { x: number; y: number; children: string; className?: string }) {
  return (
    <foreignObject x={x} y={y - 16} width={160} height={24} className={styles.svgTex} pointerEvents="none">
      <div className={className}>
        <Tex>{children}</Tex>
      </div>
    </foreignObject>
  )
}
