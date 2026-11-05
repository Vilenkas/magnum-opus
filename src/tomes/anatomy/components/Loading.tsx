import styles from './Loading.module.css'

/**
 * Suspense fallback of the anatomy tome. Not a <p>: the chapter's first paragraph gets the
 * drop cap, and a loading line must not. Shown after a short delay, so fast loads never flash.
 */
export function Loading({ label }: { label: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.ring} aria-hidden />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
