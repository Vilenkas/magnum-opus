import type { TomeProps } from '../types'
import styles from './tome.module.css'

export default function __COMPONENT__Tome({ manifest }: TomeProps) {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{manifest.title}</h1>
      <p>{manifest.description}</p>
    </main>
  )
}
