import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { drugById } from '../data/catalog'

export const TOME = 'pharmacology'

/** Navigate/Link options for a path inside the tome ('' = its front page). */
export const inTome = (path = '') =>
  path
    ? ({ to: '/tomes/$tomeId/$', params: { tomeId: TOME, _splat: path } } as const)
    : ({ to: '/tomes/$tomeId', params: { tomeId: TOME } } as const)

export const drugPath = (id: string) => `drugs/${id}`
export const classPath = (id: string) => `classes/${id}`

interface LinkProps {
  id: string
  className?: string
  children?: ReactNode
}

export function DrugLink({ id, className, children }: LinkProps) {
  return (
    <Link {...inTome(drugPath(id))} className={className}>
      {children ?? drugById.get(id)?.name ?? id}
    </Link>
  )
}

export function ClassLink({ id, className, children }: LinkProps) {
  return (
    <Link {...inTome(classPath(id))} className={className}>
      {children}
    </Link>
  )
}

/** `*text*` as italics: the only markup the data's prose uses. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part,
      )}
    </>
  )
}

/** A chemical formula with its counts as subscripts: C16H13ClN2O. */
export function Formula({ formula }: { formula: string }) {
  return (
    <>
      {formula.split(/(\d+)/).map((part, i) => (/^\d+$/.test(part) ? <sub key={i}>{part}</sub> : part))}
    </>
  )
}
