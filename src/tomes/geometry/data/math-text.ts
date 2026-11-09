/**
 * Plain strings with LaTeX in them, as the quiz and the plates write them: prose with `$…$`
 * for inline math. A literal dollar sign is written `\$`.
 */
export type MathPart = { kind: 'text'; value: string } | { kind: 'math'; value: string; trailing?: string }

/** Punctuation that must stay on the same line as the formula before it. */
export const TRAILING_PUNCTUATION = /^[,.;:!?)\]»]+/

/**
 * Splits prose and inline math. Punctuation right after a formula is handed to it as
 * `trailing`, so the two are drawn together and a line never starts with «, ¿cuáles…».
 */
export function splitMath(text: string): MathPart[] {
  const parts: MathPart[] = []
  let buffer = ''
  let inMath = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '\\' && text[i + 1] === '$') {
      buffer += inMath ? '\\$' : '$'
      i++
    } else if (ch === '$') {
      if (buffer) parts.push({ kind: inMath ? 'math' : 'text', value: buffer })
      buffer = ''
      inMath = !inMath
    } else buffer += ch
  }
  if (inMath) throw new Error(`Unclosed $ in: ${text}`)
  if (buffer) parts.push({ kind: 'text', value: buffer })

  for (let i = 0; i < parts.length - 1; i++) {
    const math = parts[i]
    const next = parts[i + 1]
    const punct = next.kind === 'text' ? TRAILING_PUNCTUATION.exec(next.value)?.[0] : undefined
    if (math.kind !== 'math' || !punct) continue
    math.trailing = punct
    next.value = next.value.slice(punct.length)
  }
  return parts.filter((p) => p.kind === 'math' || p.value)
}

/** A number as LaTeX: fixed decimals, no trailing zeros, never $-0$ (KaTeX draws the minus sign). */
export function texNum(value: number, digits = 2): string {
  const rounded = Number(value.toFixed(digits))
  return String(Object.is(rounded, -0) ? 0 : rounded)
}
