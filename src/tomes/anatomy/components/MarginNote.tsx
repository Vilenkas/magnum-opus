import type { ReactNode } from 'react'
import styles from './MarginNote.module.css'

/** A marginal annotation, like the hand-written notes in old treatises. */
export function MarginNote({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className={styles.note}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.body}>{children}</div>
    </aside>
  )
}
