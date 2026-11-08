import { useEffect, useMemo, useRef, useState } from 'react'
import { layers, layersAt, types, type LayerId } from '../data/cortex-types'
import plate from './skeleton/plate.module.css'
import styles from './CortexTypes.module.css'

const PX_PER_MM = 88
const TOP = 24
const LEFT = 90
const WIDTH = 170

/** Fixed cell positions per layer (u across, v down the layer), so cells glide with their layer. */
const CELLS: Record<LayerId, [number, number][]> = (() => {
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const count: Record<LayerId, number> = { I: 7, II: 70, III: 34, IV: 70, V: 14, VI: 34 }
  return Object.fromEntries(layers.map((l) => [l.id, Array.from({ length: count[l.id] }, () => [rnd(), rnd()] as [number, number])])) as Record<LayerId, [number, number][]>
})()

/** Lámina: the six layers of the cortex gliding through Economo's five types (Testut, fig. 795). */
export function CortexTypes() {
  const [t, setT] = useState(1)
  const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(null)
  const frame = useRef(0)

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

  const state = useMemo(() => layersAt(t), [t])
  const type = types[Math.round(t)]
  const exact = Math.abs(t - Math.round(t)) < 0.03

  // Bands from the pia downwards.
  let y = TOP
  const bands = state.layers.map((l) => {
    const h = l.mm * PX_PER_MM
    const band = { ...l, y, h }
    y += h
    return band
  })
  const bottom = y
  const layer = layers.find((l) => l.id === selectedLayer)

  const cell = (kind: string, x: number, cy: number, v: number, key: string, id: LayerId) => {
    if (kind === 'grains') return <circle key={key} cx={x} cy={cy} r="1.5" className={styles.grain} />
    if (kind === 'sparse') return <ellipse key={key} cx={x} cy={cy} rx="3" ry="1" className={styles.sparse} />
    if (kind === 'spindles') return <ellipse key={key} cx={x} cy={cy} rx="1.3" ry="3.6" className={styles.spindle} />
    // Pyramids grow with depth in layer III, and are largest in layer V.
    const s = (id === 'V' ? 4.5 : 2 + 2.5 * v) * state.pyramids
    return <path key={key} d={`M${x} ${cy - s * 1.4} L${x + s} ${cy + s * 0.8} L${x - s} ${cy + s * 0.8} Z`} className={styles.pyramid} />
  }

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XI · Los cinco tipos de corteza</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Tipo de corteza">
        {types.map((ty, i) => (
          <button key={ty.id} className={plate.chip} data-active={Math.abs(t - i) < 0.03} onClick={() => glideTo(i)}>
            {ty.number}. {ty.name.replace('Tipo ', '').replace(' o piramidal granular', '').replace(' o coniocórtex', '')}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 330 420" className={styles.svg} role="img" aria-label={`Corte de la corteza cerebral: ${type.name.toLowerCase()}`}>
          <line x1={LEFT - 10} y1={TOP} x2={LEFT + WIDTH + 10} y2={TOP} className={styles.pia} />
          {bands.map((b) => (
            <g key={b.id}>
              <rect x={LEFT} y={b.y} width={WIDTH} height={Math.max(b.h, 0)} className={styles.band} data-layer={b.id} data-selected={b.id === selectedLayer} onClick={() => setSelectedLayer(b.id)}>
                <title>{b.name}</title>
              </rect>
              {b.h > 7 && (
                <text x={LEFT - 14} y={b.y + b.h / 2 + 4} className={styles.numeral}>
                  {b.id}
                </text>
              )}
              {b.h > 0.5 &&
                CELLS[b.id].map(([u, v], i) => cell(b.cells, LEFT + 6 + u * (WIDTH - 12), b.y + 2 + v * Math.max(b.h - 4, 0), v, `${b.id}${i}`, b.id))}
            </g>
          ))}
          {/* Betz's giant cells, in the fifth layer of the motor cortex. */}
          {state.betz > 0.02 &&
            [0.22, 0.55, 0.83].map((u) => {
              const v = bands[4]
              const x = LEFT + u * WIDTH
              const cy = v.y + v.h * 0.55
              const s = 8 * state.betz
              return <path key={u} d={`M${x} ${cy - s * 1.5} L${x + s} ${cy + s * 0.8} L${x - s} ${cy + s * 0.8} Z`} className={styles.betz} style={{ opacity: state.betz }} />
            })}
          <rect x={LEFT} y={bottom} width={WIDTH} height={Math.max(400 - bottom, 0)} className={styles.white} />
          <text x={LEFT + WIDTH / 2} y={Math.min(bottom + 22, 410)} className={styles.whiteLabel}>
            sustancia blanca
          </text>

          {/* The thickness, measured on the right. */}
          <line x1={LEFT + WIDTH + 18} y1={TOP} x2={LEFT + WIDTH + 18} y2={bottom} className={styles.ruler} />
          <text x={LEFT + WIDTH + 24} y={(TOP + bottom) / 2} className={styles.rulerLabel}>
            {(bands.reduce((a, b) => a + b.mm, 0)).toFixed(1).replace('.', ',')} mm
          </text>
        </svg>

        <ul className={styles.key}>
          {layers.map((l) => (
            <li key={l.id}>
              <button data-active={l.id === selectedLayer} onClick={() => setSelectedLayer(l.id)}>
                <span className={styles.numeralKey}>{l.id}</span>
                {l.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {exact ? `Tipo ${type.number} de Economo · ${type.kind === 'homotypical' ? 'homotípico, seis capas' : 'heterotípico'}` : 'Transición'}
        </p>
        <p className={plate.title}>{type.name}</p>
        <p className={styles.text}>{type.description}</p>
        <p className={styles.where}>
          <strong>Dónde:</strong> {type.where}
        </p>
        {layer && (
          <div className={styles.layerCard}>
            <p className={plate.kicker}>
              Capa {layer.id}
              {layer.latin ? ` · ${layer.latin}` : ''}
            </p>
            <p className={styles.layerName}>{layer.name}</p>
            <p className={styles.text}>{layer.description}</p>
          </div>
        )}
        {!layer && <p className={plate.hint}>Haz clic en una capa para ver qué células la forman.</p>}
      </div>
    </figure>
  )
}
