import { BZD_DURATION } from '../data/classes'
import { drugsIn, durationOf, formatHalfLife } from '../data/catalog'
import { AXIS, axisPos, TICKS, tickLabel } from './HalfLifeBar'
import { DrugLink } from './links'
import { Plate } from './Plate'
import styles from './DurationChart.module.css'

const BAND = { short: styles.short, intermediate: styles.intermediate, long: styles.long }

/** Lámina: every benzodiazepine's half-life on a log axis, which sorts them into three bands. */
export function DurationChart({ numeral = 'II' }: { numeral?: string }) {
  const rows = drugsIn('benzodiazepines')
    .filter((d) => d.halfLife)
    .sort((a, b) => a.halfLife!.min + a.halfLife!.max - (b.halfLife!.min + b.halfLife!.max))
  const pct = (h: number) => `${axisPos(h) * 100}%`
  return (
    <Plate
      numeral={numeral}
      title="La duración de las benzodiacepinas"
      caption={
        <>
          Semivida de eliminación en escala logarítmica, de {AXIS.min} h a una semana. Rayado: incluye metabolitos activos. Las
          bandas son las de Goodman & Gilman: corta (&lt; {BZD_DURATION.short} h), intermedia y prolongada (&gt; {BZD_DURATION.long}{' '}
          h), por el punto medio del intervalo.
        </>
      }
    >
      <div className={styles.chart}>
        <div className={styles.bands} aria-hidden>
          <span className={styles.short} style={{ left: 0, width: pct(BZD_DURATION.short) }}>
            Corta
          </span>
          <span className={styles.intermediate} style={{ left: pct(BZD_DURATION.short), width: `calc(${pct(BZD_DURATION.long)} - ${pct(BZD_DURATION.short)})` }}>
            Intermedia
          </span>
          <span className={styles.long} style={{ left: pct(BZD_DURATION.long), right: 0 }}>
            Prolongada
          </span>
        </div>
        <ul className={styles.rows}>
          {rows.map((d) => {
            const h = d.halfLife!
            return (
              <li key={d.id} className={styles.row}>
                <DrugLink id={d.id} className={styles.name} />
                <span className={styles.track}>
                  <span
                    className={`${styles.bar} ${BAND[durationOf(h)]} ${h.metabolites ? styles.striped : ''}`}
                    style={{ left: pct(h.min), width: `max(calc(${pct(h.max)} - ${pct(h.min)}), 6px)` }}
                    title={formatHalfLife(h)}
                  />
                  {/* Near the right edge the value goes before the bar. */}
                  <span
                    className={styles.value}
                    style={axisPos(h.max) < 0.8 ? { left: `calc(${pct(h.max)} + 6px)` } : { right: `calc(100% - ${pct(h.min)} + 6px)` }}
                  >
                    {formatHalfLife(h)}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
        <div className={styles.axis} aria-hidden>
          <span className={styles.axisSpacer} />
          <span className={styles.ticks}>
            {TICKS.map((t) => (
              <span key={t} style={{ left: pct(t) }}>
                {tickLabel(t)}
              </span>
            ))}
          </span>
        </div>
      </div>
    </Plate>
  )
}
