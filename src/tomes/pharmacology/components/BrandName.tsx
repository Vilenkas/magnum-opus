import { useEffect, useId, useRef, useState } from 'react'
import { brandPhotos } from '../figures/registry'
import { licenseLabel } from '../figures/types'
import type { Drug } from '../data/types'
import styles from './BrandName.module.css'

/**
 * The originator's brand. When `figures/private/` holds its product photos, the name opens them
 * in a floating card: on hover with a mouse, on tap with a finger. Without them, plain text.
 */
export function BrandName({ drug, className }: { drug: Drug; className?: string }) {
  const { box, pill } = brandPhotos(drug.id)
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const cardId = useId()

  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const escape = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  if (!drug.brand) return null
  if (!box && !pill) return <span className={className}>{drug.brand}</span>

  const first = (box ?? pill)!
  return (
    <span
      ref={wrap}
      className={styles.wrap}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={cardId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={className}>{drug.brand}</span>
        <span className={styles.icon} aria-hidden>
          ◫
        </span>
      </button>
      {open && (
        <span id={cardId} role="dialog" aria-label={`Producto: ${drug.brand}`} className={styles.card}>
          <span className={styles.photos}>
            {box && <img src={box.src} alt={box.title} className={styles.box} />}
            {pill && <img src={pill.src} alt={pill.title} className={styles.pill} />}
          </span>
          <span className={styles.caption}>{first.title.replace(/, (envase|forma farmacéutica)/, '')}</span>
          <span className={styles.credit}>
            {first.credit} · {licenseLabel[first.license]}
          </span>
        </span>
      )}
    </span>
  )
}
