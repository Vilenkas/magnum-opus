import { useState } from 'react'
import plate from './skeleton/plate.module.css'
import styles from './VenousValves.module.css'

type Mode = 'flow' | 'reflux' | 'squeeze'
type SegmentFlow = 'up' | 'still'

/** Valves from the bottom (capillaries) up (heart), one fundamental distance D apart. */
const VALVES = [340, 250, 160, 70]
const LEFT = 90
const RIGHT = 150
const MID = (LEFT + RIGHT) / 2
/** Segment i runs from bounds[i] (bottom) to bounds[i + 1] (top). */
const BOUNDS = [414, ...VALVES, 22]
/** The segment the muscle squeezes: between the second and third valves. */
const SQUEEZED = 2

interface State {
  closed: boolean[]
  flows: SegmentFlow[]
  /** Segments whose blood presses down on the valve below them. */
  pressing: number[]
  text: string
}

const modes: Record<Mode, { label: string } & State> = {
  flow: {
    label: 'Corriente normal',
    closed: [false, false, false, false],
    flows: ['up', 'up', 'up', 'up', 'up'],
    pressing: [],
    text: 'La sangre sube de los capilares hacia el corazón: las válvulas se levantan y se aplican contra la pared, borradas, para dejarla pasar.',
  },
  reflux: {
    label: 'Reflujo',
    closed: [true, true, true, true],
    flows: ['still', 'still', 'still', 'still', 'still'],
    pressing: [1, 2, 3, 4],
    text: 'Si la sangre tiende a volver hacia los capilares, por su peso o por una presión de arriba, las válvulas se llenan, se tienden y cierran la luz. Sus senos, distendidos, dan a la vena el aspecto nudoso de las venas llenas.',
  },
  squeeze: {
    label: 'Contracción muscular',
    closed: [false, true, false, false],
    flows: ['still', 'still', 'up', 'up', 'up'],
    pressing: [SQUEEZED],
    text: 'Un músculo que se contrae comprime el tramo de vena que lo atraviesa: la válvula de abajo se cierra, la de arriba se abre, y la sangre sólo puede ir hacia el corazón.',
  },
}

const segmentY = (i: number) => ({ bottom: BOUNDS[i], top: BOUNDS[i + 1] })

/** Lámina: a vein opened lengthwise (after Testut's fig. 306 B), its valves working. */
export function VenousValves() {
  const [mode, setMode] = useState<Mode>('flow')
  const state = modes[mode]

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · Las válvulas de las venas</figcaption>

      <div className={plate.chipBar} role="tablist" aria-label="Estado de la vena">
        {(Object.keys(modes) as Mode[]).map((m) => (
          <button key={m} role="tab" aria-selected={m === mode} className={plate.chip} data-active={m === mode} onClick={() => setMode(m)}>
            {modes[m].label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 250 440" className={styles.svg} role="img" aria-label={`Vena abierta a lo largo, con cuatro pares de válvulas: ${state.label.toLowerCase()}`}>
          <text x={MID} y="13" className={styles.end}>
            hacia el corazón ↑
          </text>
          <text x={MID} y="434" className={styles.end}>
            desde los capilares
          </text>

          {/* Muscle bellies that squeeze the vein between two valves. */}
          {[-1, 1].map((side) => (
            <ellipse
              key={side}
              cx={MID + side * 66}
              cy={(BOUNDS[SQUEEZED] + BOUNDS[SQUEEZED + 1]) / 2}
              rx="24"
              ry="52"
              className={styles.muscle}
              data-on={mode === 'squeeze'}
              style={{ ['--shift' as string]: `${-side * 20}px` }}
            />
          ))}

          {BOUNDS.slice(0, -1).map((_, i) => {
            const { bottom, top } = segmentY(i)
            const squeezed = mode === 'squeeze' && i === SQUEEZED
            return (
              <g key={i} className={styles.segment} data-squeezed={squeezed} style={{ transformOrigin: `${MID}px ${(top + bottom) / 2}px` }}>
                <rect x={LEFT} y={top} width={RIGHT - LEFT} height={bottom - top} className={styles.lumen} />
                <path d={`M${LEFT} ${top} V${bottom} M${RIGHT} ${top} V${bottom}`} className={styles.wall} />
                {state.flows[i] === 'up' && <path d={`M${MID} ${bottom - 4} V${top + 4}`} className={styles.flow} />}
                {state.pressing.includes(i) && (
                  <path d={`M${MID - 8} ${bottom - 22} l8 8 l8 -8 M${MID - 8} ${bottom - 32} l8 8 l8 -8`} className={styles.press} />
                )}
              </g>
            )
          })}

          {VALVES.map((y, v) => {
            const closed = state.closed[v]
            return (
              <g key={y} data-closed={closed} className={styles.valve}>
                {/* The sinus behind each cusp bulges when it fills. */}
                <path d={`M${LEFT} ${y} C${LEFT - 14} ${y - 6} ${LEFT - 12} ${y - 30} ${LEFT} ${y - 34}`} className={styles.sinus} style={{ transformOrigin: `${LEFT}px ${y}px` }} />
                <path d={`M${RIGHT} ${y} C${RIGHT + 14} ${y - 6} ${RIGHT + 12} ${y - 30} ${RIGHT} ${y - 34}`} className={styles.sinus} style={{ transformOrigin: `${RIGHT}px ${y}px` }} />
                <g transform={`translate(${LEFT} ${y})`}>
                  <path d="M0 0 C7 -8 7 -22 3 -32" className={styles.cusp} />
                </g>
                <g transform={`translate(${RIGHT} ${y}) scale(-1 1)`}>
                  <path d="M0 0 C7 -8 7 -22 3 -32" className={styles.cusp} />
                </g>
              </g>
            )
          })}

          {/* Bardeleben's fundamental distance between consecutive valves. */}
          <g className={styles.spacing}>
            {VALVES.slice(0, -1).map((y, v) => (
              <g key={y}>
                <path d={`M206 ${y} h6 V${VALVES[v + 1]} h-6`} />
                <text x="222" y={(y + VALVES[v + 1]) / 2 + 5}>
                  D
                </text>
              </g>
            ))}
          </g>
        </svg>

        <div className={styles.text} aria-live="polite">
          <p className={plate.kicker}>Válvulas venosas</p>
          <p className={plate.title}>{state.label}</p>
          <p>{state.text}</p>
          <p className={styles.aside}>
            <span className={styles.letter}>D</span> la distancia fundamental de Bardeleben: dos válvulas consecutivas
            distan siempre D, o un múltiplo de D cuando entre ellas ha desaparecido alguna.
          </p>
        </div>
      </div>
    </figure>
  )
}
