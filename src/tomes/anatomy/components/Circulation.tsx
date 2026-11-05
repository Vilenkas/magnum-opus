import { useEffect, useRef, useState } from 'react'
import { bloodName, circuitName, stages, type Blood, type Circuit, type CirculationStage } from '../data/circulation'
import plate from './skeleton/plate.module.css'
import styles from './Circulation.module.css'

const BLOOD_RGB: Record<Blood, [number, number, number]> = { arterial: [176, 48, 42], venous: [61, 90, 138] }
/** px per second: slower where something happens (chambers, capillaries) so it can be read. */
const SPEED = { artery: 120, vein: 120, chamber: 60, capillaries: 55 } as const

type Filter = 'all' | Circuit

const rgb = ([r, g, b]: [number, number, number]) => `rgb(${r} ${g} ${b})`
const mix = (a: Blood, b: Blood, t: number) =>
  rgb(BLOOD_RGB[a].map((v, i) => Math.round(v + (BLOOD_RGB[b][i] - v) * t)) as [number, number, number])

const strokeOf = (s: CirculationStage) =>
  s.kind === 'capillaries' ? `url(#grad-${s.id})` : rgb(BLOOD_RGB[s.bloodIn])

/** Lámina: the double circulation (Testut's fig. 1), with a drop to follow around the eight. */
export function Circulation() {
  const [filter, setFilter] = useState<Filter>('all')
  const [stageIndex, setStageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const paths = useRef<(SVGPathElement | null)[]>([])
  const drop = useRef<SVGCircleElement>(null)
  // Where the drop is, kept outside React state so the animation doesn't re-render every frame.
  const position = useRef({ stage: 0, distance: 0 })

  const place = () => {
    const { stage, distance } = position.current
    const path = paths.current[stage]
    if (!path || !drop.current) return
    const length = path.getTotalLength()
    const point = path.getPointAtLength(Math.min(distance, length))
    const s = stages[stage]
    drop.current.setAttribute('cx', String(point.x))
    drop.current.setAttribute('cy', String(point.y))
    drop.current.style.fill = mix(s.bloodIn, s.bloodOut, length ? distance / length : 0)
  }

  useEffect(place, [])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const p = position.current
      p.distance += SPEED[stages[p.stage].kind] * dt
      const length = paths.current[p.stage]?.getTotalLength() ?? 0
      if (p.distance >= length) {
        p.distance -= length
        p.stage = (p.stage + 1) % stages.length
        setStageIndex(p.stage)
      }
      place()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  const jumpTo = (i: number) => {
    position.current = { stage: i, distance: 0 }
    setStageIndex(i)
    place()
  }

  const stage = stages[stageIndex]
  const dimmed = (s: CirculationStage) => filter !== 'all' && s.circuit !== filter

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina I · La doble circulación</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Circuito">
        {(['all', 'major', 'minor'] as const).map((f) => (
          <button key={f} className={plate.chip} data-active={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Los dos circuitos' : circuitName[f].split(' o ')[0]}
          </button>
        ))}
      </div>

      <svg viewBox="-20 0 640 600" className={styles.svg} role="img" aria-label="Esquema de la circulación: el corazón en el centro, los pulmones arriba y el resto del cuerpo abajo.">
        <defs>
          {stages
            .filter((s) => s.kind === 'capillaries')
            .map((s) => {
              const { x0, x1 } = s.id === 'lung-capillaries' ? { x0: 180, x1: 420 } : { x0: 450, x1: 150 }
              return (
                <linearGradient key={s.id} id={`grad-${s.id}`} gradientUnits="userSpaceOnUse" x1={x0} x2={x1} y1="0" y2="0">
                  <stop offset="0.1" stopColor={rgb(BLOOD_RGB[s.bloodIn])} />
                  <stop offset="0.9" stopColor={rgb(BLOOD_RGB[s.bloodOut])} />
                </linearGradient>
              )
            })}
        </defs>

        {/* Capillary beds: the lungs above, every other organ below. */}
        <g className={styles.bed} data-dim={filter === 'major'}>
          <ellipse cx="300" cy="92" rx="150" ry="44" />
          <path d="M190 74 C220 52 250 104 290 76 S350 52 410 76" stroke="url(#grad-lung-capillaries)" />
          <path d="M190 110 C220 88 250 140 290 112 S350 88 410 110" stroke="url(#grad-lung-capillaries)" />
          <text x="300" y="34">Pulmones</text>
        </g>
        <g className={styles.bed} data-dim={filter === 'minor'}>
          <ellipse cx="300" cy="522" rx="180" ry="44" />
          <path d="M440 504 C410 482 375 532 335 506 S265 482 225 506 S170 520 160 506" stroke="url(#grad-body-capillaries)" />
          <path d="M440 540 C410 518 375 568 335 542 S265 518 225 542 S170 556 160 540" stroke="url(#grad-body-capillaries)" />
          <text x="300" y="588">Resto del cuerpo</text>
        </g>

        {/* The heart: two halves, each an atrium over a ventricle. */}
        <g className={styles.heart}>
          <rect x="220" y="200" width="76" height="62" rx="16" />
          <rect x="304" y="200" width="76" height="62" rx="16" />
          <rect x="220" y="268" width="76" height="84" rx="20" />
          <rect x="304" y="268" width="76" height="84" rx="20" />
          <text x="240" y="221">AD</text>
          <text x="362" y="221">AI</text>
          <text x="240" y="342">VD</text>
          <text x="362" y="342">VI</text>
        </g>

        {stages.map((s, i) => (
          <g key={s.id} className={styles.stage} data-kind={s.kind} data-dim={dimmed(s)} data-current={i === stageIndex}>
            <path
              ref={(el) => {
                paths.current[i] = el
              }}
              d={s.d}
              className={styles.vessel}
              style={{ stroke: strokeOf(s) }}
            />
            <path d={s.d} className={styles.flow} />
            <path d={s.d} className={styles.hit} onClick={() => jumpTo(i)}>
              <title>{s.name}</title>
            </path>
          </g>
        ))}

        <g className={styles.labels}>
          <text x="205" y="186" textAnchor="end">Arteria pulmonar</text>
          <text x="468" y="150" textAnchor="end">Venas pulmonares</text>
          <text x="508" y="430" textAnchor="end">Aorta</text>
          <text x="92" y="430">Venas cavas</text>
        </g>

        <circle ref={drop} r="8" className={styles.drop} />
      </svg>

      <div className={plate.legend} aria-live="polite">
        <div className={styles.head}>
          <div>
            <p className={plate.kicker}>{circuitName[stage.circuit]}</p>
            <p className={plate.title}>{stage.name}</p>
            <p className={plate.meta}>
              <span className={styles.swatch} style={{ background: rgb(BLOOD_RGB[stage.bloodIn]) }} />
              {stage.bloodIn === stage.bloodOut ? (
                bloodName[stage.bloodIn]
              ) : (
                <>
                  {bloodName[stage.bloodIn]} → <span className={styles.swatch} style={{ background: rgb(BLOOD_RGB[stage.bloodOut]) }} />
                  {bloodName[stage.bloodOut].toLowerCase()}
                </>
              )}
            </p>
          </div>
          <button className={plate.buttonSolid} onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Detener' : 'Seguir una gota'}
          </button>
        </div>
        <p className={styles.description}>{stage.description}</p>
        <ol className={styles.route}>
          {stages.map((s, i) => (
            <li key={s.id}>
              <button data-active={i === stageIndex} data-circuit={s.circuit} onClick={() => jumpTo(i)}>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  )
}
