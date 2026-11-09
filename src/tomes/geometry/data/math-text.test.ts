/// <reference types="node" />
// Node APIs only in this test: it reads the tome's sources to check their mathematics.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { GEOMETRY_QUESTIONS } from '../quiz/questions'
import { splitMath, texNum } from './math-text'

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')

/** Mathematics typed by hand instead of in LaTeX: sub/superscripts, roots, relations, Greek… */
const HAND_MATH = /[₀-₉⁰-⁹√±≠≤≥⟹⟺∥⊥∞½ℝΔπθαωμ−]|[a-zA-Z]²|\d°/

/** Parses like the build does (rehype-katex with strict: 'error'). */
const typeset = (tex: string, displayMode = false) =>
  katex.renderToString(tex, { displayMode, throwOnError: true, strict: 'error' })

/** The `$$…$$` and `$…$` of an MDX chapter, and what is left once they are taken out. */
function mdxMath(source: string) {
  const blocks = [...source.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((m) => m[1])
  const withoutBlocks = source.replace(/\$\$[\s\S]+?\$\$/g, '')
  const inline = [...withoutBlocks.matchAll(/\$([^$\n]+?)\$/g)].map((m) => m[1])
  const prose = withoutBlocks.replace(/\$[^$\n]+?\$/g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  return { blocks, inline, prose }
}

describe('splitMath', () => {
  it('splits prose and inline math', () => {
    expect(splitMath('Sea $x^2$ y $y$ dados')).toEqual([
      { kind: 'text', value: 'Sea ' },
      { kind: 'math', value: 'x^2' },
      { kind: 'text', value: ' y ' },
      { kind: 'math', value: 'y' },
      { kind: 'text', value: ' dados' },
    ])
  })
  it('hands the punctuation after a formula to it, so they never part', () => {
    expect(splitMath('ecuación $y^2 = 12x$, ¿cuáles? Y $p$.')).toEqual([
      { kind: 'text', value: 'ecuación ' },
      { kind: 'math', value: 'y^2 = 12x', trailing: ',' },
      { kind: 'text', value: ' ¿cuáles? Y ' },
      { kind: 'math', value: 'p', trailing: '.' },
    ])
  })
  it('keeps an escaped dollar sign as text', () => {
    expect(splitMath('Cuesta 5 \\$')).toEqual([{ kind: 'text', value: 'Cuesta 5 $' }])
  })
  it('refuses an unclosed formula', () => {
    expect(() => splitMath('Sea $x')).toThrow()
  })
})

describe('texNum', () => {
  it('rounds, drops trailing zeros and never prints -0', () => {
    expect(texNum(2.5)).toBe('2.5')
    expect(texNum(3)).toBe('3')
    expect(texNum(1.23456, 3)).toBe('1.235')
    expect(texNum(-0.001)).toBe('0')
  })
})

describe('Geometry writes all its mathematics in LaTeX', () => {
  it('the quiz: every formula typesets and no prose carries hand-typed math', () => {
    for (const q of GEOMETRY_QUESTIONS) {
      if (q.formula) typeset(q.formula, true)
      for (const text of [q.prompt, q.explanation, q.lehmannRef.title, ...q.options]) {
        for (const part of splitMath(text)) {
          if (part.kind === 'math') typeset(part.value)
          else expect(part.value, `${q.id}: «${part.value}»`).not.toMatch(HAND_MATH)
        }
      }
    }
  })

  it('the chapter: every $…$ and $$…$$ typesets and the prose has no hand-typed math', () => {
    const { blocks, inline, prose } = mdxMath(read('../chapters/analytic-geometry.mdx'))
    expect(blocks.length).toBeGreaterThan(20)
    expect(inline.length).toBeGreaterThan(100)
    for (const tex of blocks) typeset(tex, true)
    for (const tex of inline) typeset(tex)
    for (const line of prose.split('\n')) expect(line).not.toMatch(HAND_MATH)
  })

  it('the plates: no hand-typed math in their markup', () => {
    for (const file of ['CartesianPlane.tsx', 'ConicExplorer.tsx', 'GeometryQuiz.tsx']) {
      const source = read(`../components/${file}`)
      for (const line of source.split('\n')) expect(line, file).not.toMatch(HAND_MATH)
    }
  })

  it('the plates: LaTeX goes in String.raw (a plain string eats the backslashes) and typesets', () => {
    for (const file of ['CartesianPlane.tsx', 'ConicExplorer.tsx']) {
      const source = read(`../components/${file}`)
      // Plain '…' or `…` with a backslash in them: \D, \o, \a would silently become D, o, a.
      const plain = [...source.matchAll(/(?<!String\.raw)(['`])((?:(?!\1).)*\\(?!u2212)(?:(?!\1).)*)\1/g)]
      expect(plain.map((m) => m[0]), file).toEqual([])
      for (const [, body] of source.matchAll(/String\.raw`([^`]*)`/g)) typeset(body.replace(/\$\{[^}]*\}/g, '1'))
    }
  })
})
