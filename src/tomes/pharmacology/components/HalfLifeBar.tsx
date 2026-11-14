import { BZD_DURATION } from '../data/classes'
import type { HalfLife } from '../data/types'
import styles from './HalfLifeBar.module.css'

/** A logarithmic axis of hours: from half an hour to a week. */
export const AXIS = { min: 0.5, max: 168 }
export const TICKS = [1, 3, 6, 12, 24, 48, 96, 168]
export const axisPos = (h: number) =>
  (Math.log(Math.min(Math.max(h, AXIS.min), AXIS.max)) - Math.log(AXIS.min)) / (Math.log(AXIS.max) - Math.log(AXIS.min))
export const tickLabel = (h: number) => (h >= 48 ? `${h / 24} d` : `${h} h`)

/** A half-life range on the log axis, with the 6 h and 24 h boundaries of the duration bands. */
export function HalfLifeBar({ halfLife }: { halfLife: HalfLife }) {
  const left = axisPos(halfLife.min) * 100
  const right = axisPos(halfLife.max) * 100
  return (
    <div className={styles.scale} aria-hidden>
      <div className={styles.track}>
        {[BZD_DURATION.short, BZD_DURATION.long].map((h) => (
          <span key={h} className={styles.boundary} style={{ left: `${axisPos(h) * 100}%` }} />
        ))}
        <span
          className={`${styles.range} ${halfLife.metabolites ? styles.metabolites : ''}`}
          style={{ left: `${left}%`, width: `max(${right - left}%, 0.5rem)` }}
        />
      </div>
      <div className={styles.ticks}>
        {TICKS.map((h) => (
          <span key={h} style={{ left: `${axisPos(h) * 100}%` }}>
            {tickLabel(h)}
          </span>
        ))}
      </div>
    </div>
  )
}
