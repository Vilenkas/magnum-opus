import { useEffect, useMemo, useRef, useState } from 'react'
import { columns, stageAt, stages, type ColumnId, type Ellipse } from '../data/bulb-columns'
import { greyPolygon, smoothPath } from '../data/cord-sections'
import plate from './skeleton/plate.module.css'
import styles from './BulbColumns.module.css'

const COLOR = { motor: '#b8322a', sensory: '#3b5a92' } as const

/** Lámina: the grey column of the cord turning into the medulla's four columns (Testut, fig. 589). */
export function BulbColumns() {
  const [t, setT] = useState(0)
  const [selected, setSelected] = useState<ColumnId | null>(null)
  const frame = useRef(0)

  const glideTo = (target: number) => {
    cancelAnimationFrame(frame.current)
    const from = t
    const start = performance.now()
    const step = (now: number) => {
      const k = Math.min((now - start) / 800, 1)
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      setT(from + (target - from) * eased)
      if (k < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const s = useMemo(() => stageAt(t), [t])
  const stage = stages[Math.round(t)]
  const exact = Math.abs(t - Math.round(t)) < 0.03
  // The cord's H, scaled to this section: the starting point the columns come out of.
  const cordH = useMemo(() => smoothPath(greyPolygon(0)), [])
  const column = columns.find((c) => c.id === selected)
  const o = s.outline
  // The open ventricle: a notch in the posterior face, as deep as the floor.
  const notchHalf = 70 * s.ventricle
  const ventricle = s.ventricle > 0.02 ? `M${-notchHalf} ${o.ry + 2} L${-notchHalf * 0.55} ${s.floorY} L${notchHalf * 0.55} ${s.floorY} L${notchHalf} ${o.ry + 2} Z` : ''
  const showMotor = Math.max(0, 1 - Math.abs(t - 1) * 2)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · De la médula al bulbo</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Etapa">
        {stages.map((st, i) => (
          <button key={st.id} className={plate.chip} data-active={Math.abs(t - i) < 0.03} onClick={() => glideTo(i)}>
            {i + 1}. {st.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="-100 -78 200 156" className={styles.svg} role="img" aria-label={`Corte del bulbo: ${stage.name.toLowerCase()}`}>
          <ellipse cx={o.x} cy={o.y} rx={o.rx} ry={o.ry} className={styles.outline} />
          {/* The pyramids in front, from the decussation up. */}
          <g style={{ opacity: Math.min(1, t) }}>
            <ellipse cx={-14} cy={-o.ry + 12} rx="12" ry="9" className={styles.pyramid} />
            <ellipse cx={14} cy={-o.ry + 12} rx="12" ry="9" className={styles.pyramid} />
          </g>
          {/* The olives appear on the sides of the upper medulla. */}
          <g style={{ opacity: Math.max(0, t - 2) }}>
            <path d="M-58 -30 q-14 10 0 22 q14 -4 6 -12 q8 -8 -6 -10 Z" className={styles.olive} />
            <path d="M58 -30 q14 10 0 22 q-14 -4 -6 -12 q-8 -8 6 -10 Z" className={styles.olive} />
          </g>
          {ventricle && <path d={ventricle} className={styles.ventricle} />}
          {s.ventricle <= 0.02 && <circle cx="0" cy="4" r="2" className={styles.canal} />}

          <g style={{ opacity: s.unity }}>
            <path d={cordH} className={styles.cordH} />
          </g>

          {/* The decussations that cut the horns: pyramidal fibres in front, Reil's ribbon behind. */}
          <g style={{ opacity: showMotor }} className={styles.fibres}>
            <path d="M-28 30 C-10 10 10 -20 30 -40" stroke={COLOR.motor} />
            <path d="M28 30 C10 10 -10 -20 -30 -40" stroke={COLOR.motor} />
            <path d="M-38 34 C-20 20 -8 -2 16 -10" stroke={COLOR.sensory} />
            <path d="M38 34 C20 20 8 -2 -16 -10" stroke={COLOR.sensory} />
          </g>

          {columns.map((c) => {
            const e: Ellipse = s.columns[c.id]
            const both = [e, { ...e, x: -e.x }]
            return (
              <g key={c.id} className={styles.column} data-selected={c.id === selected} onClick={() => setSelected(c.id)}>
                {both.map((q, i) => (
                  <ellipse key={i} cx={q.x} cy={q.y} rx={q.rx} ry={q.ry} fill={COLOR[c.kind]} fillOpacity={c.depth === 'floor' ? 0.55 : 0.95} />
                ))}
                <title>{c.name}</title>
              </g>
            )
          })}

          <text x="0" y={-o.ry - 6} className={styles.orient}>
            anterior
          </text>
        </svg>

        <ul className={styles.key}>
          {columns.map((c) => (
            <li key={c.id}>
              <button data-active={c.id === selected} onClick={() => setSelected(c.id)}>
                <span className={styles.swatch} style={{ background: COLOR[c.kind], opacity: c.depth === 'floor' ? 0.55 : 0.95 }} />
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{exact ? `Etapa ${Math.round(t) + 1} de 4 · Testut, fig. 589` : 'Transición'}</p>
        <p className={plate.title}>{stage.name}</p>
        <p className={styles.text}>{stage.text}</p>
        {column && (
          <div className={styles.columnCard}>
            <p className={plate.kicker}>
              {column.kind === 'motor' ? 'Columna motora' : 'Columna sensitiva'} · {column.depth === 'floor' ? 'en el suelo del ventrículo' : 'profunda'}
            </p>
            <p className={styles.columnName}>{column.name}</p>
            <p className={styles.text}>{column.nuclei}</p>
          </div>
        )}
        {!column && <p className={plate.hint}>Haz clic en una columna para ver los núcleos que dará.</p>}
      </div>
    </figure>
  )
}
