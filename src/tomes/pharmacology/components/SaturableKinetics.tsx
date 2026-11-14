import { useState } from 'react'
import { cssLinear, cssSaturable, THERAPEUTIC, VMAX } from '../data/saturable-kinetics'
import { Plate } from './Plate'
import styles from './SaturableKinetics.module.css'

const W = 520
const H = 300
const M = { left: 48, right: 16, top: 16, bottom: 40 }
const CMAX = 160
const x = (d: number) => M.left + (d / VMAX) * (W - M.left - M.right)
const y = (c: number) => H - M.bottom - (Math.min(c, CMAX) / CMAX) * (H - M.top - M.bottom)

const curve = (f: (d: number) => number) => {
  let path = ''
  for (let d = 0; d <= VMAX - 1; d += 1) {
    const c = f(d)
    if (c > CMAX * 1.1) break
    path += `${path ? 'L' : 'M'}${x(d).toFixed(1)},${y(c).toFixed(1)}`
  }
  return path
}

/** Lámina: phenytoin's saturable kinetics against a first-order drug (Katzung fig. 24-4). */
export function SaturableKinetics({ numeral = 'II' }: { numeral?: string }) {
  const [dose, setDose] = useState(40)
  const css = cssSaturable(dose)
  return (
    <Plate
      numeral={numeral}
      title="Por qué la fenitoína se desboca"
      caption="Concentración en equilibrio frente a la dosis. La fenitoína (verde) satura su metabolismo y se dispara cerca del máximo; un fármaco de primer orden (gris) sube en línea recta. Esquema, unidades arbitrarias."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="Cinética saturable de la fenitoína">
        <rect x={M.left} y={y(THERAPEUTIC.high)} width={W - M.left - M.right} height={y(THERAPEUTIC.low) - y(THERAPEUTIC.high)} className={styles.window} />
        <text x={W - M.right - 4} y={y(THERAPEUTIC.high) - 4} className={styles.windowLabel} textAnchor="end">
          Rango terapéutico
        </text>
        <line x1={M.left} y1={y(0)} x2={W - M.right} y2={y(0)} className={styles.axis} />
        <line x1={M.left} y1={y(0)} x2={M.left} y2={M.top} className={styles.axis} />
        <text x={(M.left + W - M.right) / 2} y={H - 8} className={styles.axisLabel} textAnchor="middle">
          Dosis diaria →
        </text>
        <text x={M.left - 8} y={M.top + 8} className={styles.axisLabel} textAnchor="end">
          Conc.
        </text>

        <path d={curve(cssLinear)} className={styles.linear} />
        <path d={curve(cssSaturable)} className={styles.saturable} />

        <line x1={x(dose)} y1={y(0)} x2={x(dose)} y2={M.top} className={styles.cursor} />
        {css <= CMAX && <circle cx={x(dose)} cy={y(css)} r={5} className={styles.dot} />}
      </svg>

      <input
        type="range"
        min={0}
        max={VMAX - 2}
        value={dose}
        onChange={(e) => setDose(Number(e.target.value))}
        className={styles.slider}
        aria-label="Dosis diaria"
      />
      <p className={styles.readout} aria-live="polite">
        {css > THERAPEUTIC.high ? (
          <>
            <strong className={styles.toxic}>Concentración tóxica.</strong> Cerca del máximo, un pequeño aumento de dosis dispara el nivel.
          </>
        ) : css >= THERAPEUTIC.low ? (
          <>
            <strong className={styles.ok}>Dentro del rango terapéutico.</strong>
          </>
        ) : (
          <>Por debajo del rango terapéutico.</>
        )}
      </p>
    </Plate>
  )
}
