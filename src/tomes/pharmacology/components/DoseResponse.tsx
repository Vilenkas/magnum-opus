import { useId, useState } from 'react'
import { drugA, drugB, MAX_DOSE, STAGES, stageAt, type StageId } from '../data/dose-response'
import { Plate } from './Plate'
import styles from './DoseResponse.module.css'

const W = 520
const H = 300
const M = { left: 86, right: 16, top: 14, bottom: 34 }
const x = (dose: number) => M.left + (dose / MAX_DOSE) * (W - M.left - M.right)
const y = (effect: number) => H - M.bottom - (effect / 100) * (H - M.top - M.bottom)

const path = (f: (d: number) => number) =>
  Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(f(i)).toFixed(1)}`).join('')

const titleOf = (s: StageId) => (s === 'none' ? 'Sin efecto apreciable' : STAGES.find((x) => x.id === s)!.title)

/** Lámina: the two dose–response curves of Katzung's fig. 22-1, with a dose to slide. */
export function DoseResponse({ numeral = 'I' }: { numeral?: string }) {
  const [dose, setDose] = useState(30)
  const sliderId = useId()
  const a = drugA(dose)
  const b = drugB(dose)
  return (
    <Plate
      numeral={numeral}
      title="Dos maneras de deprimir el SNC"
      caption="Esquema según Katzung, fig. 22-1. A: barbitúricos y alcoholes; B: benzodiacepinas y los hipnóticos que comparten su mecanismo. Unidades arbitrarias."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="Curvas de dosis y respuesta de dos sedantes-hipnóticos">
        {STAGES.map((s, i) => {
          const top = i + 1 < STAGES.length ? STAGES[i + 1].from : 100
          return (
            <g key={s.id}>
              <rect x={M.left} y={y(top)} width={W - M.left - M.right} height={y(s.from) - y(top)} className={styles[`band${i}`]} />
              <text x={M.left - 8} y={(y(s.from) + y(top)) / 2} className={styles.stage} textAnchor="end" dominantBaseline="central">
                {s.title}
              </text>
            </g>
          )
        })}
        <line x1={M.left} y1={y(0)} x2={W - M.right} y2={y(0)} className={styles.axis} />
        <line x1={M.left} y1={y(0)} x2={M.left} y2={y(100)} className={styles.axis} />
        <text x={(M.left + W - M.right) / 2} y={H - 8} className={styles.axisLabel} textAnchor="middle">
          Dosis creciente →
        </text>

        <path d={path(drugA)} className={styles.curveA} />
        <path d={path(drugB)} className={styles.curveB} />
        <text x={x(MAX_DOSE * 0.86)} y={y(drugA(MAX_DOSE * 0.86)) - 8} className={styles.tagA} textAnchor="end">
          A
        </text>
        <text x={x(MAX_DOSE)} y={y(drugB(MAX_DOSE)) - 8} className={styles.tagB} textAnchor="end">
          B
        </text>

        <line x1={x(dose)} y1={y(0)} x2={x(dose)} y2={y(100)} className={styles.cursor} />
        <circle cx={x(dose)} cy={y(a)} r={5} className={styles.dotA} />
        <circle cx={x(dose)} cy={y(b)} r={5} className={styles.dotB} />
      </svg>

      <label htmlFor={sliderId} className={styles.sliderLabel}>
        Dosis
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={MAX_DOSE}
        value={dose}
        onChange={(e) => setDose(Number(e.target.value))}
        className={styles.slider}
      />
      <div className={styles.readout} aria-live="polite">
        <p>
          <span className={styles.keyA}>A · barbitúrico</span> {titleOf(stageAt(a))}
        </p>
        <p>
          <span className={styles.keyB}>B · benzodiacepina</span> {titleOf(stageAt(b))}
        </p>
      </div>
    </Plate>
  )
}
