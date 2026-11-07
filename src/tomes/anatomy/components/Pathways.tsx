import { useId, useMemo, useState } from 'react'
import { crosses, deficits, lesions, levels, pathways, pointsFor, SITES, type Lesion, type Pathway, type PathwayId, type Point, type Side } from '../data/pathways'
import plate from './skeleton/plate.module.css'
import styles from './Pathways.module.css'

/** Each half of the body gets a colour, so the eye can follow where its pathways cross. */
const HALF: Record<Side, string> = { left: '#b8322a', right: '#3b5a92' }
const SIDE_NAME: Record<Side, string> = { left: 'izquierdo', right: 'derecho' }
const HALF_NAME: Record<Side, string> = { left: 'mitad izquierda', right: 'mitad derecha' }
const SIDES = ['right', 'left'] as const

/** Seen from the front: the patient's left (positive x) is on the viewer's right. */
const X = (x: number) => 200 + x
const toPath = (pts: Point[]) => 'M' + pts.map(([x, y]) => `${X(x)} ${y}`).join(' L')

/** Half width of the brainstem and cord at height y. */
function halfWidth(y: number) {
  if (y < 190) return 38
  if (y < 250) return 38 + 8 * Math.sin(((y - 190) / 60) * Math.PI)
  if (y < 320) return 38 - ((y - 250) / 70) * 6
  if (y < 410) return 32 + 3 * Math.sin(((y - 320) / 90) * Math.PI)
  if (y < 470) return 31
  if (y < 530) return 31 + 5 * Math.sin(((y - 470) / 60) * Math.PI)
  return 31 - (y - 530) * 1.6
}

function stemPath() {
  const ys = Array.from({ length: 81 }, (_, i) => 138 + i * 5)
  const right = ys.map((y) => `${X(halfWidth(y))} ${y}`)
  const left = [...ys].reverse().map((y) => `${X(-halfWidth(y))} ${y}`)
  return `M${right.join(' L')} L${left.join(' L')} Z`
}

/** A frontal section of one hemisphere, d > 0 towards the patient's left. */
const hemisphere = (s: 1 | -1) => {
  const x = (d: number) => X(s * d)
  return `M${x(5)} 132 L${x(5)} 30 C${x(5)} 4 ${x(60)} -2 ${x(110)} 8 C${x(160)} 20 ${x(178)} 60 ${x(172)} 100 C${x(168)} 128 ${x(150)} 142 ${x(118)} 140 C${x(96)} 138 ${x(84)} 132 ${x(60)} 136 L${x(38)} 138 Z`
}

type Selection = PathwayId | 'all'

/** Lámina: the great pathways from end to end, and what a lesion on their way abolishes (Testut pp. 1114–1137). */
export function Pathways() {
  const [selected, setSelected] = useState<Selection>('lemniscal')
  const [lesionId, setLesionId] = useState<string | null>('hemisection')
  const [side, setSide] = useState<Side>('left')
  const hatch = useId()

  const lesion = lesions.find((l) => l.id === lesionId) ?? null
  const lost = useMemo(() => deficits(lesion, side), [lesion, side])
  const stem = useMemo(stemPath, [])
  const shown = selected === 'all' ? pathways : pathways.filter((p) => p.id === selected)
  const current = selected === 'all' ? null : pathways.find((p) => p.id === selected)!

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XIII · Las grandes vías de conducción</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Vía">
        <span className={styles.group}>Sensitivas</span>
        {pathways.filter((p) => p.kind === 'sensory').map((p) => (
          <button key={p.id} className={plate.chip} data-active={p.id === selected} onClick={() => setSelected(p.id)}>
            {p.name}
          </button>
        ))}
        <span className={styles.group}>Motoras</span>
        {pathways.filter((p) => p.kind === 'motor').map((p) => (
          <button key={p.id} className={plate.chip} data-active={p.id === selected} onClick={() => setSelected(p.id)}>
            {p.name}
          </button>
        ))}
        <button className={plate.chip} data-active={selected === 'all'} onClick={() => setSelected('all')}>
          Todas
        </button>
      </div>

      <div className={plate.chipBar} role="group" aria-label="Lesión">
        <span className={styles.group}>Lesión</span>
        <button className={plate.chip} data-active={!lesion} onClick={() => setLesionId(null)}>
          Ninguna
        </button>
        {lesions.map((l) => (
          <button key={l.id} className={plate.chip} data-active={l.id === lesionId} onClick={() => setLesionId(l.id)}>
            {l.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        {SIDES.map((s) => (
          <button key={s} className={plate.chip} data-active={s === side} disabled={lesion?.cx === 0} onClick={() => setSide(s)}>
            Lado {SIDE_NAME[s]}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 400 556" className={styles.schema} role="img" aria-label={`${current?.name ?? 'Todas las vías'}${lesion ? `, con una lesión en ${lesion.name.toLowerCase()}` : ''}`}>
          <defs>
            <pattern id={hatch} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="#2a2420" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#f6efe0" strokeWidth="1.2" />
            </pattern>
          </defs>

          <Backdrop stem={stem} />

          {shown.map((p) =>
            SIDES.map((body) => <PathwayDrawing key={p.id + body} pathway={p} body={body} lesion={lesion} side={side} thin={selected === 'all'} />),
          )}

          {lesion && (
            <ellipse
              cx={X(side === 'left' ? lesion.cx : -lesion.cx)}
              cy={lesion.cy}
              rx={lesion.rx}
              ry={lesion.ry}
              fill={`url(#${hatch})`}
              className={styles.lesion}
            />
          )}

          <text x={X(-100)} y="152" className={styles.sideName}>
            Hemisferio derecho
          </text>
          <text x={X(100)} y="152" className={styles.sideName}>
            Hemisferio izquierdo
          </text>
        </svg>

        <div className={styles.side}>
          <table className={styles.findings}>
            <thead>
              <tr>
                <th scope="col">Vía</th>
                {SIDES.map((s) => (
                  <th key={s} scope="col" style={{ color: HALF[s] }}>
                    {s === 'left' ? 'Izq.' : 'Der.'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pathways.map((p) => (
                <tr key={p.id} data-active={p.id === selected} onClick={() => setSelected(p.id)}>
                  <th scope="row">
                    <span className={styles.kind}>{p.kind === 'sensory' ? 'S' : 'M'}</span>
                    {p.name}
                  </th>
                  {SIDES.map((s) => (
                    <td key={s} data-lost={lost[p.id].includes(s)}>
                      {lost[p.id].includes(s) ? 'perdida' : '·'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={plate.hint}>Mitad del cuerpo que sirve cada vía. Haz clic en una fila para dibujarla.</p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        {lesion ? (
          <>
            <p className={plate.kicker}>
              Lesión de {lesion.name.toLowerCase()}
              {lesion.cx !== 0 && `, lado ${SIDE_NAME[side]}`}
            </p>
            <p className={plate.title}>{lesion.syndrome}</p>
            <p className={styles.text}>{lesion.text}</p>
          </>
        ) : (
          <p className={plate.kicker}>Sin lesión</p>
        )}
        {current && <Neurons pathway={current} lesion={lesion} side={side} />}
      </div>
    </figure>
  )
}

function Backdrop({ stem }: { stem: string }) {
  return (
    <g className={styles.backdrop}>
      {SIDES.map((s) => {
        const d = s === 'left' ? 1 : -1
        return (
          <g key={s}>
            <ellipse cx={X(d * 78)} cy="222" rx="42" ry="30" className={styles.cerebellum} />
            <path d={hemisphere(d)} className={styles.hemisphere} />
            <ellipse cx={X(d * 30)} cy="112" rx="17" ry="14" className={styles.nucleus} />
            <ellipse cx={X(d * 84)} cy="112" rx="15" ry="19" className={styles.nucleus} />
            <circle cx={X(d * 12)} cy="160" r="5" className={styles.red} />
            <path d={`M${X(d * 46)} 224 Q${X(d * 52)} 238 ${X(d * 60)} 226`} className={styles.dentate} />
          </g>
        )
      })}
      <path d={stem} className={styles.stem} />
      <line x1="200" y1="136" x2="200" y2="548" className={styles.midline} />
      {levels.slice(1).map((l) => (
        <g key={l.id}>
          <line x1={X(-halfWidth(l.top) - 6)} y1={l.top} x2="10" y2={l.top} className={styles.levelLine} />
          <text x="8" y={(l.top + l.bottom) / 2 + 3} className={styles.levelName}>
            {l.name}
          </text>
        </g>
      ))}
      <text x={X(30)} y="94" className={styles.label} textAnchor="middle">
        tálamo
      </text>
      <text x={X(86)} y="88" className={styles.label} textAnchor="middle">
        n. lenticular
      </text>
      <text x={X(96)} y="262" className={styles.label} textAnchor="middle">
        cerebelo
      </text>
      <text x={X(SITES.ganglion[0] + 4)} y={SITES.ganglion[1] - 8} className={styles.label}>
        raíz posterior
      </text>
      <text x={X(SITES.muscle[0] + 4)} y={SITES.muscle[1] + 10} className={styles.label}>
        raíz anterior
      </text>
    </g>
  )
}

/**
 * One pathway in one half of the body. A neuron the lesion crosses is interrupted; those after it,
 * in the direction the impulse runs, fall silent; the impulse flows only up to the cut.
 */
function PathwayDrawing({ pathway, body, lesion, side, thin }: { pathway: Pathway; body: Side; lesion: Lesion | null; side: Side; thin: boolean }) {
  return (
    <g style={{ color: HALF[body] }}>
      {pathway.routes.map((route, r) => {
        const cut = route.findIndex((n) => !n.minor && lesion && crosses(n, body, lesion, side))
        return route.map((n, i) => {
          const d = toPath(pointsFor(n, body))
          const state = cut >= 0 && i === cut ? 'cut' : cut >= 0 && i > cut ? 'silent' : 'live'
          return (
            <g key={`${r}-${i}`} data-state={state} data-minor={n.minor ?? false} className={styles.neuron}>
              <path d={d} className={styles.fibre} strokeWidth={thin ? 1.4 : n.minor ? 1.2 : 2.4} />
              {state === 'live' && !thin && !n.minor && <path d={d} className={styles.flow} strokeWidth={2.4} />}
              {!thin && !n.minor && <circle cx={X(pointsFor(n, body)[0][0])} cy={pointsFor(n, body)[0][1]} r="2.6" className={styles.soma} />}
            </g>
          )
        })
      })}
    </g>
  )
}

/** The pathway's neurons in order, with what the lesion does to each. */
function Neurons({ pathway, lesion, side }: { pathway: Pathway; lesion: Lesion | null; side: Side }) {
  return (
    <div className={styles.neurons}>
      <p className={styles.carries}>
        <strong>{pathway.name}.</strong> {pathway.carries}.
      </p>
      {pathway.routes.map((route, r) => (
        <div key={r}>
          {pathway.routes.length > 1 && <p className={styles.routeName}>{r === 0 ? 'Por el cordón anterolateral:' : 'Y por el cordón posterior:'}</p>}
          <ol className={styles.chain}>
          {route.map((n) => {
            const hit = lesion ? SIDES.filter((b) => crosses(n, b, lesion, side)) : []
            return (
              <li key={n.name} data-minor={n.minor ?? false}>
                <span className={styles.neuronName}>{n.name}</span> → {n.to}
                {hit.length > 0 && <span className={styles.hit}> · interrumpida ({hit.map((b) => HALF_NAME[b]).join(' y ')})</span>}
              </li>
            )
          })}
          </ol>
        </div>
      ))}
    </div>
  )
}
