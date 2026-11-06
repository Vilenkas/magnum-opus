import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fascicles,
  fasciclePolygon,
  greyPolygon,
  levelAt,
  levels,
  mirrorPts,
  pathwayName,
  presenceAt,
  smoothPath,
  type Pathway,
} from '../data/cord-sections'
import plate from './skeleton/plate.module.css'
import styles from './CordSections.module.css'

const PATHWAY_COLOR: Record<Pathway, string> = {
  motor: '#b8322a',
  sensory: '#3b5a92',
  cerebellar: '#4f8a3c',
  association: '#a08a5c',
}

const funiculusName = { anterior: 'Cordón anterior', lateral: 'Cordón lateral', posterior: 'Cordón posterior' } as const

/** Lámina: a section of the spinal cord that glides from the cervical cord to the conus. */
export function CordSections() {
  // 0 cervical, 1 dorsal, 2 lumbar, 3 sacral.
  const [t, setT] = useState(0)
  const [showFascicles, setShowFascicles] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const frame = useRef(0)

  const glideTo = (target: number) => {
    cancelAnimationFrame(frame.current)
    const from = t
    const start = performance.now()
    const step = (now: number) => {
      const k = Math.min((now - start) / 600, 1)
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      setT(from + (target - from) * eased)
      if (k < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const { rx, ry } = levelAt(t)
  const grey = useMemo(() => smoothPath(greyPolygon(t)), [t])
  const nearest = levels[Math.round(t)]
  const fascicle = fascicles.find((f) => f.id === selected)
  const fasciclePresent = fascicle ? presenceAt(fascicle, t) > 0.05 : false

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · La médula en cortes</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Altura del corte">
        {levels.map((l, i) => (
          <button key={l.id} className={plate.chip} data-active={Math.abs(t - i) < 0.05} onClick={() => glideTo(i)}>
            {l.name}
          </button>
        ))}
        <button className={plate.chip} data-active={showFascicles} aria-pressed={showFascicles} onClick={() => setShowFascicles((v) => !v)}>
          Fascículos
        </button>
      </div>

      <div className={styles.body}>
        <CordSilhouette t={t} onPick={(v) => glideTo(v)} />

        <svg viewBox="-110 -80 220 160" className={styles.section} role="img" aria-label={`Corte de la médula: ${nearest.name.toLowerCase()}`}>
          {/* White matter, with the anterior median fissure and the posterior median septum. */}
          <ellipse cx="0" cy="0" rx={rx} ry={ry} className={styles.white} />
          {showFascicles &&
            fascicles.map((f) => {
              const presence = presenceAt(f, t)
              if (presence < 0.02) return null
              const pts = fasciclePolygon(f, t)
              return (
                <g
                  key={f.id}
                  className={styles.fascicle}
                  data-selected={f.id === selected}
                  style={{ fill: PATHWAY_COLOR[f.pathway], opacity: Math.min(1, presence * 1.5) }}
                  onClick={() => setSelected(f.id)}
                >
                  <path d={smoothPath(pts, 0.25)} />
                  <path d={smoothPath(mirrorPts(pts), 0.25)} />
                  <title>{f.name}</title>
                </g>
              )
            })}
          <path d={grey} className={styles.grey} />
          <circle cx="0" cy="0" r="2.2" className={styles.canal} />
          <path d={`M0 ${-ry} L0 ${-ry * 0.45}`} className={styles.fissure} />
          <path d={`M0 ${ry} L0 ${ry * 0.12}`} className={styles.septum} />
          <text x="0" y={-ry - 8} className={styles.orient}>
            anterior
          </text>
          <text x="0" y={ry + 14} className={styles.orient}>
            posterior
          </text>
          {nearest.diametersMm && Math.abs(t - Math.round(t)) < 0.05 && (
            <g className={styles.dims}>
              <line x1={-rx} y1={ry + 22} x2={rx} y2={ry + 22} />
              <text x={rx + 4} y={ry + 25}>
                {nearest.diametersMm.transverse} mm
              </text>
              <line x1={rx + 12} y1={-ry} x2={rx + 12} y2={ry} />
              <text x={rx + 15} y="3">
                {nearest.diametersMm.anteroposterior} mm
              </text>
            </g>
          )}
        </svg>

        {showFascicles && (
          <ul className={styles.key}>
            {(Object.keys(PATHWAY_COLOR) as Pathway[]).map((p) => (
              <li key={p}>
                <span className={styles.swatch} style={{ background: PATHWAY_COLOR[p] }} />
                {pathwayName[p]}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={plate.legend} aria-live="polite">
        {fascicle && showFascicles ? (
          <>
            <p className={plate.kicker}>
              {funiculusName[fascicle.funiculus]} · {pathwayName[fascicle.pathway]}
            </p>
            <p className={plate.title}>{fascicle.name}</p>
            <p className={styles.text}>{fascicle.role}</p>
            {!fasciclePresent && <p className={plate.hint}>No existe a esta altura de la médula.</p>}
          </>
        ) : (
          <>
            <p className={plate.kicker}>
              {nearest.segment} · {Math.abs(t - Math.round(t)) < 0.05 ? 'Testut, fig. 512' : 'entre dos cortes'}
            </p>
            <p className={plate.title}>{nearest.name}</p>
            <p className={styles.text}>{nearest.features}</p>
            {nearest.stilling && <p className={plate.meta}>Según Stilling: {nearest.stilling}</p>}
            <p className={plate.hint}>Haz clic en un fascículo para ver qué lleva.</p>
          </>
        )}
      </div>
    </figure>
  )
}

/** The cord seen from the front, with its two enlargements, and where the section is taken. */
function CordSilhouette({ t, onPick }: { t: number; onPick: (t: number) => void }) {
  // Half-width along the cord (top to bottom): cervical enlargement, dorsal, lumbar, conus.
  const ys = [8, 50, 108, 160, 196, 214]
  const ws = [6, 9.5, 6, 6, 8.5, 1]
  const right = ys.map((y, i) => `${20 + ws[i]} ${y}`)
  const left = ys.map((y, i) => `${20 - ws[i]} ${y}`).reverse()
  const d = `M${right.join(' L')} L${left.join(' L')} Z`
  // Section heights matched to the four levels (C6, D6, L4, conus).
  const at = [50, 108, 160, 205]
  const y = at[Math.floor(Math.min(t, 2.999))] + (at[Math.min(3, Math.floor(t) + 1)] - at[Math.floor(Math.min(t, 2.999))]) * (t - Math.floor(Math.min(t, 2.999)))
  return (
    <svg viewBox="0 0 40 230" className={styles.silhouette} role="img" aria-label="La médula vista de frente">
      <path d={d} className={styles.cord} />
      <line x1="20" y1="214" x2="20" y2="228" className={styles.filum} />
      {at.map((ay, i) => (
        <circle key={i} cx="20" cy={ay} r="7" className={styles.stop} onClick={() => onPick(i)} />
      ))}
      <line x1="2" y1={y} x2="38" y2={y} className={styles.cut} />
    </svg>
  )
}
