import type { ReactNode } from 'react'
import styles from './Plate.module.css'

/** A numbered plate of the treatise: the figure, then its caption. */
export function Plate({ numeral, title, caption, children }: { numeral: string; title: string; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className={styles.plate}>
      <header className={styles.head}>
        <span className={styles.numeral}>Lámina {numeral}</span>
        <span className={styles.title}>{title}</span>
      </header>
      <div className={styles.body}>{children}</div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
