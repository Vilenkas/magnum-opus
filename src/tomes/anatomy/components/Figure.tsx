import { licenseLabel } from '../figures/types'
import { resolveFigure } from '../figures/registry'
import { useFigureSource } from './Citations'
import styles from './Figure.module.css'

/**
 * An illustration from figures/public or figures/private, with its credit.
 * `id` may list several: the first available wins, so a private plate can
 * fall back to a public one. When none is available it renders nothing (a
 * dashed reminder in dev), so deleting figures/private never breaks a chapter.
 */
export function Figure({ id, caption, wide = false }: { id: string | string[]; caption?: string; wide?: boolean }) {
  const figure = resolveFigure(id)
  useFigureSource(figure?.source, figure?.ref)

  if (!figure) {
    if (!import.meta.env.DEV) return null
    return <p className={styles.missing}>Figura no disponible: {[id].flat().join(' / ')}</p>
  }

  const license = [licenseLabel[figure.license], figure.licenseVersion].filter(Boolean).join(' ')
  return (
    <figure className={styles.figure} data-wide={wide}>
      <img src={figure.src} alt={figure.alt ?? figure.title} loading="lazy" decoding="async" className={styles.image} />
      <figcaption className={styles.caption}>
        <span className={styles.title}>{caption ?? figure.title}</span>
        {figure.legend && <span className={styles.legend}>{figure.legend}</span>}
        <span className={styles.credit}>
          {figure.url ? (
            <a href={figure.url} target="_blank" rel="noreferrer">
              {figure.credit}
            </a>
          ) : (
            figure.credit
          )}
          {' · '}
          {license}
          {figure.changes && ` · ${figure.changes}`}
        </span>
      </figcaption>
    </figure>
  )
}
