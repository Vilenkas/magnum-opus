import { useEffect, useRef, useState } from 'react'
import { cavities, flow, type CavityId } from '../data/ventricles'
import plate from './skeleton/plate.module.css'
import styles from './Ventricles.module.css'

const SPEED = 70

/** Lámina: the ventricles as a cast, and the cerebrospinal fluid running through them (Testut, fig. 832; Netter, S-35). */
export function Ventricles() {
  const [selected, setSelected] = useState<CavityId>('frontal')
  const [stage, setStage] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const paths = useRef<(SVGPathElement | null)[]>([])
  const drop = useRef<SVGCircleElement>(null)
  const pos = useRef({ stage: 0, distance: 0 })

  const place = () => {
    const path = paths.current[pos.current.stage]
    if (!path || !drop.current) return
    const p = path.getPointAtLength(Math.min(pos.current.distance, path.getTotalLength()))
    drop.current.setAttribute('cx', String(p.x))
    drop.current.setAttribute('cy', String(p.y))
  }

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const p = pos.current
      p.distance += SPEED * dt
      const length = paths.current[p.stage]?.getTotalLength() ?? 0
      if (p.distance >= length) {
        if (p.stage === flow.length - 1) {
          p.distance = length
          place()
          setPlaying(false)
          return
        }
        p.distance -= length
        p.stage += 1
        setStage(p.stage)
        const c = flow[p.stage].cavity
        if (c) setSelected(c)
      }
      place()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  const start = () => {
    pos.current = { stage: 0, distance: 0 }
    setStage(0)
    setSelected(flow[0].cavity!)
    place()
    setPlaying(true)
  }
  const jump = (i: number) => {
    setPlaying(false)
    pos.current = { stage: i, distance: 0 }
    setStage(i)
    const c = flow[i].cavity
    if (c) setSelected(c)
    place()
  }

  const cavity = cavities.find((c) => c.id === selected)!
  const current = stage === null ? null : flow[stage]

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XI · Los ventrículos y el líquido cefalorraquídeo</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Recorrido del líquido">
        {flow.map((s, i) => (
          <button key={s.id} className={plate.chip} data-active={stage === i} onClick={() => jump(i)}>
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="80 70 500 290" className={styles.svg} role="img" aria-label="Molde de las cavidades ventriculares, visto por la izquierda">
          {/* The thalamus, which the lateral ventricle curls around. */}
          <ellipse cx="300" cy="160" rx="52" ry="30" className={styles.thalamus} />
          <text x="300" y="164" className={styles.note}>
            tálamo
          </text>

          {/* All the walls first, then all the fills: the cast reads as one piece, without seams. */}
          {cavities.map((c) => (
            <path key={c.id} d={c.d} className={styles.wall} data-selected={c.id === selected} style={{ strokeWidth: c.width + 3 }} />
          ))}
          {cavities.map((c) => (
            <g key={c.id} className={styles.cavity} data-selected={c.id === selected} onClick={() => setSelected(c.id)}>
              <path d={c.d} className={styles.fill} style={{ strokeWidth: c.width }} />
              <title>{c.name}</title>
            </g>
          ))}

          {flow.map((s, i) => (
            <path
              key={s.id}
              ref={(el) => {
                paths.current[i] = el
              }}
              d={s.d}
              className={styles.route}
              data-passed={stage !== null && i <= stage}
            />
          ))}
          <circle ref={drop} r="5" className={styles.drop} style={{ opacity: stage === null ? 0 : 1 }} />

          <text x="110" y="180" className={styles.note}>
            polo frontal
          </text>
          <text x="520" y="260" className={styles.note}>
            espacio subaracnoideo
          </text>
        </svg>

        <ul className={styles.key}>
          {cavities.map((c) => (
            <li key={c.id}>
              <button data-active={c.id === selected} onClick={() => setSelected(c.id)}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <div className={styles.head}>
          <div>
            <p className={plate.kicker}>{current ? `Paso ${stage! + 1} de ${flow.length} · ${current.name}` : 'Las cavidades'}</p>
            <p className={plate.title}>{cavity.name}</p>
            {cavity.modern && <p className={plate.meta}>Hoy, {cavity.modern}</p>}
          </div>
          <button className={plate.buttonSolid} onClick={() => (playing ? setPlaying(false) : start())}>
            {playing ? 'Detener' : 'Seguir el líquido'}
          </button>
        </div>
        {current && <p className={styles.flowText}>{current.description}</p>}
        <p className={styles.text}>{cavity.description}</p>
      </div>
    </figure>
  )
}
