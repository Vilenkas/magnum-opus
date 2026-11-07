import type { ReactNode } from 'react'
import styles from './Formula.module.css'

export function Formula({
  children,
  inline = false,
}: {
  children: ReactNode
  inline?: boolean
}) {
  if (inline) {
    return <span className={styles.inline}>{children}</span>
  }
  return <div className={styles.block}>{children}</div>
}

export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className={styles.fraction}>
      <span className={styles.num}>{num}</span>
      <span className={styles.den}>{den}</span>
    </span>
  )
}
