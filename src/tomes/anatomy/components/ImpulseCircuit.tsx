import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { kindLabel, type Circuit, type CircuitStage, type PartKind } from '../data/nerve-circuits'
import plate from './skeleton/plate.module.css'
import styles from './ImpulseCircuit.module.css'

/** px per second; slower at the cell and the synapse, where something happens. */
const SPEED: Record<PartKind, number> = { receptor: 30, dendrite: 140, cell: 22, axon: 160, synapse: 30, effector: 26 }

export type Chain = Omit<Circuit, 'id'> & { id: string }

interface Props {
  caption: string
  /** What the tabs choose between ("Movimiento", "Vía"…). */
  tabsLabel: string
  chains: readonly Chain[]
  viewBox: string
  /** One colour per neuron of a chain, in order, unless the neuron brings its own. */
  colors: readonly string[]
  /** The anatomy behind the neurons, drawn under them. */
  backdrop: (chain: Chain, stage: CircuitStage) => ReactNode
  ariaLabel: (chain: Chain) => string
}


/**
 * A plate of chains of neurons, with an impulse that runs through them stretch by stretch
 * (dendrite, cell body, axon, synapse…). Shared by the plates that follow a nervous circuit.
 */
export function ImpulseCircuit({ caption, tabsLabel, chains, viewBox, colors, backdrop, ariaLabel }: Props) {
  const [chainId, setChainId] = useState(chains[0].id)
  const [stageIndex, setStageIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const chain = chains.find((c) => c.id === chainId)!
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

  // A new chain starts from its first stretch.
  useEffect(() => {
    setPlaying(false)
    jumpTo(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const p = position.current
      p.distance += SPEED[chain.stages[p.stage].kind] * dt
      const length = paths.current[p.stage]?.getTotalLength() ?? 0
      if (p.distance >= length) {
        p.distance -= length
        // The impulse reaches the end and stops there; another click starts a new one.
        if (p.stage === chain.stages.length - 1) {
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
  }, [playing, chain])

  const play = () => {
    if (position.current.stage === chain.stages.length - 1) jumpTo(0)
    setPlaying(true)
  }

  const stage = chain.stages[stageIndex]
  const neuron = chain.neurons[stage.neuron]
  const tint = (n: number) => ({ '--neuron': chain.neurons[n].color ?? colors[n % colors.length] }) as CSSProperties

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>{caption}</figcaption>

      <div className={plate.chipBar} role="tablist" aria-label={tabsLabel}>
        {chains.map((c) => (
          <button key={c.id} role="tab" aria-selected={c.id === chainId} className={plate.chip} data-active={c.id === chainId} onClick={() => setChainId(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox={viewBox} className={styles.svg} role="img" aria-label={ariaLabel(chain)}>
          {backdrop(chain, stage)}

          {chain.stages.map((s, i) => (
            <g key={s.id} className={styles.stage} style={tint(s.neuron)} data-kind={s.kind} data-current={i === stageIndex} data-passed={i < stageIndex}>
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
          {chain.stages
            .filter((s) => s.kind === 'cell')
            .map((s) => {
              const n = s.d.match(/-?\d+(\.\d+)?/g)!.map(Number)
              const [x, y] = [(n[0] + n[n.length - 2]) / 2, (n[1] + n[n.length - 1]) / 2]
              return <circle key={s.id} cx={x} cy={y} r="8" className={styles.soma} style={tint(s.neuron)} />
            })}
          <circle ref={spark} r="6" className={styles.spark} />
        </svg>

        <div className={styles.side}>
          <ol className={styles.route}>
            {chain.stages.map((s, i) => (
              <li key={s.id}>
                <button data-active={i === stageIndex} style={tint(s.neuron)} onClick={() => jumpTo(i)}>
                  {s.name}
                </button>
              </li>
            ))}
          </ol>
          <p className={styles.after}>Testut, {chain.figure}</p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <div className={styles.head}>
          <div>
            <p className={plate.kicker}>{stage.kind === 'synapse' ? 'Entre dos neuronas' : `${neuron.name} · ${neuron.role}`}</p>
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
