import { useEffect, useRef, useState } from 'react'
import { circuits, kindLabel, type CircuitId, type PartKind } from '../data/nerve-circuits'
import plate from './skeleton/plate.module.css'
import styles from './NerveCircuits.module.css'

/** px per second; slower at the cell and the synapse, where something happens. */
const SPEED: Record<PartKind, number> = { receptor: 30, dendrite: 140, cell: 22, axon: 160, synapse: 30, effector: 26 }

/** Lámina: the neurons of a reflex and of a voluntary movement, with the impulse running through them. */
export function NerveCircuits() {
  const [circuitId, setCircuitId] = useState<CircuitId>('reflex')
  const [stageIndex, setStageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const circuit = circuits.find((c) => c.id === circuitId)!
  const paths = useRef<(SVGPathElement | null)[]>([])
  const spark = useRef<SVGCircleElement>(null)
  const position = useRef({ stage: 0, distance: 0 })

  const place = () => {
    const { stage, distance } = position.current
    const path = paths.current[stage]
    if (!path || !spark.current) return
    const p = path.getPointAtLength(Math.min(distance, path.getTotalLength()))
    spark.current.setAttribute('cx', String(p.x))
    spark.current.setAttribute('cy', String(p.y))
  }

  const jumpTo = (i: number) => {
    position.current = { stage: i, distance: 0 }
    setStageIndex(i)
    place()
  }

  // A new circuit starts from its first stretch.
  useEffect(() => {
    setPlaying(false)
    jumpTo(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuitId])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const p = position.current
      p.distance += SPEED[circuit.stages[p.stage].kind] * dt
      const length = paths.current[p.stage]?.getTotalLength() ?? 0
      if (p.distance >= length) {
        p.distance -= length
        // The impulse reaches the muscle and stops there; another click starts a new one.
        if (p.stage === circuit.stages.length - 1) {
          p.distance = length
          setPlaying(false)
          place()
          return
        }
        p.stage += 1
        setStageIndex(p.stage)
      }
      place()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, circuit])

  const play = () => {
    if (position.current.stage === circuit.stages.length - 1) jumpTo(0)
    setPlaying(true)
  }

  const stage = circuit.stages[stageIndex]
  const neuron = circuit.neurons[stage.neuron]
  const voluntary = circuitId === 'voluntary'

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina I · Dos neuronas para un movimiento</figcaption>

      <div className={plate.chipBar} role="tablist" aria-label="Movimiento">
        {circuits.map((c) => (
          <button key={c.id} role="tab" aria-selected={c.id === circuitId} className={plate.chip} data-active={c.id === circuitId} onClick={() => setCircuitId(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="80 20 500 560" className={styles.svg} role="img" aria-label={`Esquema del ${circuit.name.toLowerCase()}`}>
          {/* Brain (coronal), brainstem and the cord in cross-section: after Testut's figs. 471–472. */}
          <g className={styles.anatomy} data-dim={!voluntary}>
            <path d="M300 34 C230 26 160 48 146 108 C136 152 168 190 214 196 C246 200 270 196 284 200 L284 214 M300 34 C370 26 440 48 454 108 C464 152 432 190 386 196 C354 200 330 196 316 200 L316 214" className={styles.brain} />
            <path d="M300 36 L300 150" className={styles.fissure} />
            <path d="M210 70 C220 84 226 96 226 110 M390 70 C380 84 374 96 374 110" className={styles.cortex} />
            <path d="M284 200 C284 236 288 258 290 290 L292 368 M316 200 C316 236 312 258 310 290 L308 368" className={styles.stem} />
            <text x="300" y="232" className={styles.label}>
              bulbo
            </text>
          </g>
          <circle cx="300" cy="420" r="52" className={styles.cord} />
          <path
            d="M300 404 C292 392 284 380 282 368 M300 404 C308 392 316 380 318 368 M300 404 L300 432 M300 432 C288 436 272 446 270 462 C282 466 294 452 300 442 M300 432 C312 436 328 446 332 462 C318 466 306 452 300 442"
            className={styles.grey}
          />
          <text x="300" y="490" className={styles.label}>
            médula
          </text>
          {/* Roots, ganglion, skin and muscle on the right side. */}
          <path d="M346 394 C362 386 380 380 398 374 M342 452 C360 468 384 480 412 488" className={styles.root} />
          <ellipse cx="406" cy="372" rx="16" ry="10" className={styles.ganglion} />
          <path d="M530 296 C546 290 560 290 570 296 L570 318 C560 312 546 312 530 318 Z" className={styles.skin} data-dim={voluntary} />
          <text x="548" y="286" className={styles.label} data-dim={voluntary}>
            piel
          </text>
          <path d="M528 506 L568 524 L560 548 L520 530 Z" className={styles.muscle} data-active={stage.kind === 'effector'} />
          <text x="560" y="568" className={styles.label}>
            músculo
          </text>

          {circuit.stages.map((s, i) => (
            <g key={s.id} className={styles.stage} data-kind={s.kind} data-neuron={s.neuron} data-current={i === stageIndex} data-passed={i < stageIndex}>
              <path
                ref={(el) => {
                  paths.current[i] = el
                }}
                d={s.d}
                className={styles.fiber}
              />
              <path d={s.d} className={styles.hit} onClick={() => jumpTo(i)}>
                <title>{s.name}</title>
              </path>
            </g>
          ))}
          {/* Cell bodies on top of their fibres. */}
          {circuit.stages
            .filter((s) => s.kind === 'cell')
            .map((s) => {
              const n = s.d.match(/-?\d+(\.\d+)?/g)!.map(Number)
              const [x, y] = [(n[0] + n[n.length - 2]) / 2, (n[1] + n[n.length - 1]) / 2]
              return <circle key={s.id} cx={x} cy={y} r="8" className={styles.soma} data-neuron={s.neuron} />
            })}
          <circle ref={spark} r="6" className={styles.spark} />
        </svg>

        <div className={styles.side}>
          <ol className={styles.route}>
            {circuit.stages.map((s, i) => (
              <li key={s.id}>
                <button data-active={i === stageIndex} data-neuron={s.neuron} onClick={() => jumpTo(i)}>
                  {s.name}
                </button>
              </li>
            ))}
          </ol>
          <p className={styles.after}>Testut, {circuit.figure}</p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <div className={styles.head}>
          <div>
            <p className={plate.kicker}>
              {stage.kind === 'synapse' ? 'Entre las dos neuronas' : `${neuron.name} · ${neuron.role}`}
            </p>
            <p className={plate.title}>{stage.name}</p>
            <p className={plate.meta}>{kindLabel[stage.kind]}</p>
          </div>
          <button className={plate.buttonSolid} onClick={() => (playing ? setPlaying(false) : play())}>
            {playing ? 'Detener' : 'Seguir el impulso'}
          </button>
        </div>
        <p className={styles.description}>{stage.description}</p>
      </div>
    </figure>
  )
}
