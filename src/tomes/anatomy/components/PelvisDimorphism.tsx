import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { characters, measures, pelvisShape, type PelvisFeature, type PelvisShape } from '../data/pelvis-dimorphism'
import plate from './skeleton/plate.module.css'
import styles from './PelvisDimorphism.module.css'

const MIRROR = 'translate(400 0) scale(-1 1)'

/** Lámina: one pelvis that turns from a man's into a woman's, and Testut's sixteen characters on it. */
export function PelvisDimorphism() {
  // 0 = man, 1 = woman.
  const [t, setT] = useState(0)
  const [overlay, setOverlay] = useState(false)
  const [selected, setSelected] = useState(10)
  const frame = useRef(0)

  /** Glide to a sex instead of jumping, so the change can be followed. */
  const glideTo = (target: number) => {
    cancelAnimationFrame(frame.current)
    const from = t
    const start = performance.now()
    const step = (now: number) => {
      const k = Math.min((now - start) / 700, 1)
      const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      setT(from + (target - from) * eased)
      if (k < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const shape = useMemo(() => pelvisShape(t), [t])
  const m = useMemo(() => measures(t), [t])
  const man = useMemo(() => pelvisShape(0), [])
  const woman = useMemo(() => pelvisShape(1), [])
  const character = characters.find((c) => c.n === selected)!
  const label = t < 0.05 ? 'Hombre' : t > 0.95 ? 'Mujer' : 'Transición'

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · La pelvis del hombre y de la mujer</figcaption>

      <div className={styles.controls}>
        <button className={styles.sex} data-active={t < 0.05} onClick={() => glideTo(0)}>
          Hombre
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => {
            cancelAnimationFrame(frame.current)
            setT(Number(e.target.value))
          }}
          className={styles.slider}
          aria-label="De la pelvis del hombre a la de la mujer"
        />
        <button className={styles.sex} data-active={t > 0.95} onClick={() => glideTo(1)}>
          Mujer
        </button>
        <button className={plate.chip} data-active={overlay} aria-pressed={overlay} onClick={() => setOverlay((v) => !v)}>
          Superponer
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="-10 0 420 300" className={styles.svg} role="img" aria-label={`Pelvis vista de frente: ${label.toLowerCase()}`}>
          {overlay ? (
            <>
              <Outline shape={man} className={styles.outlineMan} />
              <Outline shape={woman} className={styles.outlineWoman} />
              <g className={styles.key}>
                <line x1="8" y1="14" x2="30" y2="14" className={styles.outlineMan} />
                <text x="36" y="18">Hombre</text>
                <line x1="8" y1="32" x2="30" y2="32" className={styles.outlineWoman} />
                <text x="36" y="36">Mujer</text>
              </g>
            </>
          ) : (
            <Bones shape={shape} />
          )}
          <Highlight feature={character.feature} shape={shape} m={m} />
          {!overlay && (
            <text x="200" y="296" className={styles.sexLabel}>
              {label}
            </text>
          )}
        </svg>

        <ol className={styles.list}>
          {characters.map((c) => (
            <li key={c.n}>
              <button data-active={c.n === selected} onClick={() => setSelected(c.n)}>
                <span className={styles.n}>{c.n}.</span> {c.name}
                {!c.feature && <span className={styles.side}>de perfil</span>}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>Carácter {character.n} de 16</p>
        <p className={plate.title}>{character.name}</p>
        <dl className={styles.compare}>
          <dt>Mujer</dt>
          <dd>{character.woman}</dd>
          <dt>Hombre</dt>
          <dd>{character.man}</dd>
        </dl>
        {!character.feature && <p className={plate.hint}>No se aprecia de frente: es un carácter de la pelvis vista de perfil.</p>}
      </div>
    </figure>
  )
}

function Bones({ shape }: { shape: PelvisShape }) {
  const a = shape.acetabulum
  const half = (
    <>
      <path d={shape.hipBone} className={styles.bone} fillRule="evenodd" />
      <circle cx={a.x} cy={a.y} r={a.r} className={styles.acetabulum} />
    </>
  )
  return (
    <g>
      <path d={shape.sacrum} className={styles.sacrum} />
      {shape.sacralForamina.map((q, i) => (
        <ellipse key={i} cx={q.x} cy={q.y} rx="4.5" ry="3" className={styles.foramen} />
      ))}
      {half}
      <g transform={MIRROR}>{half}</g>
      <rect {...shape.symphysis} className={styles.symphysis} />
      <path d={shape.inlet} className={styles.brim} />
    </g>
  )
}

function Outline({ shape, className }: { shape: PelvisShape; className: string }) {
  return (
    <g className={className}>
      <path d={shape.hipBone} fillRule="evenodd" />
      <path d={shape.hipBone} transform={MIRROR} fillRule="evenodd" />
      <path d={shape.sacrum} />
      <path d={shape.inlet} />
    </g>
  )
}

/** The selected character drawn over the pelvis, with its figure read off the geometry. */
function Highlight({ feature, shape, m }: { feature: PelvisFeature | null; shape: PelvisShape; m: ReturnType<typeof measures> }) {
  const both = (node: ReactNode) => (
    <>
      {node}
      <g transform={MIRROR}>{node}</g>
    </>
  )
  const dim = (x1: number, x2: number, y: number, text?: string) => (
    <g className={styles.dim}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
      {text && (
        <text x={(x1 + x2) / 2} y={y - 7}>
          {text}
        </text>
      )}
    </g>
  )
  const g = styles.highlight
  switch (feature) {
    case 'iliac-fossae':
      return <g className={g}>{both(<path d={shape.fossa} className={styles.area} />)}</g>
    case 'crests':
      return <g className={g}>{both(<path d={shape.crest} className={styles.line} />)}</g>
    case 'sacrum':
      return (
        <g className={g}>
          <path d={shape.sacrum} className={styles.area} />
          {dim(200 - m.sacrumWidth / 2, 200 + m.sacrumWidth / 2, 92)}
        </g>
      )
    case 'lesser-pelvis':
      return (
        <g className={g}>
          <path d={shape.inlet} className={styles.area} />
        </g>
      )
    case 'inlet': {
      const [l, r] = shape.inletWidest
      return (
        <g className={g}>
          <path d={shape.inlet} className={styles.line} />
          {dim(l[0], r[0], l[1], `índice ${m.inletIndex.toLocaleString('es')}`)}
        </g>
      )
    }
    case 'symphysis': {
      const s = shape.symphysis
      return (
        <g className={g}>
          <rect {...s} className={styles.area} />
          <text x={s.x + s.w + 8} y={s.y + s.h / 2 + 4} className={styles.dimText} textAnchor="start">
            {m.symphysisMm} mm
          </text>
        </g>
      )
    }
    case 'pubic-body': {
      const [x, y] = shape.pubicTubercle
      return (
        <g className={g}>
          {both(<circle cx={x} cy={y} r="5" className={styles.dot} />)}
          {dim(400 - x, x, y - 14)}
        </g>
      )
    }
    case 'pubic-arch': {
      const [ax, ay] = shape.arch.apex
      const [rx, ry] = shape.arch.right
      const len = 34
      const k = len / Math.hypot(rx - ax, ry - ay)
      const ex = (rx - ax) * k
      const ey = (ry - ay) * k
      return (
        <g className={g}>
          <path d={`M${ax - ex} ${ay + ey} A${len} ${len} 0 0 0 ${ax + ex} ${ay + ey}`} className={styles.line} />
          <text x={ax} y={ay + len + 18} className={styles.dimText}>
            {m.archDeg}°
          </text>
        </g>
      )
    }
    case 'ischiopubic-rami': {
      const [[x1, y1], [x2, y2]] = shape.ramus
      return <g className={g}>{both(<line x1={x1} y1={y1} x2={x2} y2={y2} className={styles.line} />)}</g>
    }
    case 'obturator':
      return <g className={g}>{both(<path d={shape.obturator} className={styles.line} />)}</g>
    case 'acetabula': {
      const a = shape.acetabulum
      return (
        <g className={g}>
          {both(<circle cx={a.x} cy={a.y} r={a.r} className={styles.line} />)}
          {dim(400 - a.x, a.x, a.y)}
        </g>
      )
    }
    default:
      return null
  }
}
