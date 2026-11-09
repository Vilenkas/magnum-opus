import { describe, expect, it } from 'vitest'
import rehypeGlueMath from './rehype-glue-math'

const katex = (cls: string) => ({ type: 'element', tagName: 'span', properties: { className: [cls] }, children: [] })
const text = (value: string) => ({ type: 'text', value })

describe('rehypeGlueMath', () => {
  it('wraps an inline formula with the punctuation after it', () => {
    const p = { type: 'element', tagName: 'p', children: [text('ecuación '), katex('katex'), text(', ¿cuáles')] }
    rehypeGlueMath()({ type: 'root', children: [p] })
    expect(p.children).toEqual([
      text('ecuación '),
      { type: 'element', tagName: 'span', properties: { className: ['math-glued'] }, children: [katex('katex'), text(',')] },
      text(' ¿cuáles'),
    ])
  })

  it('leaves display math and formulas followed by words alone', () => {
    const display = { type: 'element', tagName: 'span', properties: { className: ['katex-display'] }, children: [katex('katex')] }
    const p = { type: 'element', tagName: 'p', children: [katex('katex'), text(' y'), display, text('.')] }
    const before = JSON.stringify(p)
    rehypeGlueMath()({ type: 'root', children: [p] })
    expect(JSON.stringify(p)).toBe(before)
  })
})
