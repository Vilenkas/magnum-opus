/**
 * Build-time rehype plugin for geometry's MDX, run after rehype-katex: punctuation right after an
 * inline formula is wrapped with it in a `.math-glued` span, so a line never starts with «, que…».
 * Same rule as `splitMath` gives the quiz and the plates.
 */
import { TRAILING_PUNCTUATION } from './data/math-text'

interface Node {
  type: string
  value?: string
  tagName?: string
  properties?: { className?: unknown }
  children?: Node[]
}

const isInlineKatex = (node: Node) => {
  const cls = node.properties?.className
  return node.type === 'element' && Array.isArray(cls) && cls.includes('katex')
}

function glue(parent: Node) {
  const children = parent.children
  if (!children) return
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    // Display math is .katex-display (with a .katex inside it): only inline formulas get glued.
    if (isInlineKatex(node)) {
      const next = children[i + 1]
      const punct = next?.type === 'text' ? TRAILING_PUNCTUATION.exec(next.value ?? '')?.[0] : undefined
      if (punct && next) {
        next.value = next.value!.slice(punct.length)
        const wrapper: Node = {
          type: 'element',
          tagName: 'span',
          properties: { className: ['math-glued'] },
          children: [node, { type: 'text', value: punct }],
        }
        children.splice(i, 1, wrapper)
        if (!next.value) children.splice(i + 1, 1)
      }
      continue
    }
    glue(node)
  }
}

export default function rehypeGlueMath() {
  return (tree: Node) => glue(tree)
}
