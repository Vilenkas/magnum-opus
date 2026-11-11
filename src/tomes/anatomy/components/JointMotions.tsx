import { useMemo, useState } from 'react'
import { normalize } from '@/forge/text'
import { JOINT_MOTIONS, actionsOfPiece, jointsOfPiece, type Motor, type Movement, type MovementPair, type Plane } from '../data/joint-movements'
import { sourceLabel } from '../data/descriptions/index'
import { softEntries, softName } from '../data/soft-tissues'
import plate from './skeleton/plate.module.css'
import styles from './JointMotions.module.css'

const PLANE: Record<Plane, string> = {
  sagittal: 'plano sagital · visto de lado',
  frontal: 'plano frontal · visto de frente',
  transverse: 'plano transversal · visto desde arriba',
}

/** Where a side without a stated range is drawn: far enough to read, dashed so it never passes for a measure. */
const UNSTATED = 70

const reach = (mv: Movement | undefined) => (mv ? (mv.degrees ?? UNSTATED) : 0)

/** A protractor: the neutral position down, the segment turning towards `a` (right) or `b` (left). */
function Dial({ pair, angle }: { pair: MovementPair; angle: number }) {
  const cx = 90
  const cy = 70
  const r = 56
  const point = (deg: number, radius = r): [number, number] => {
    const t = (deg * Math.PI) / 180
    return [cx + radius * Math.sin(t), cy + radius * Math.cos(t)]
  }
  const arc = (from: number, to: number) => {
    const [x0, y0] = point(from)
    const [x1, y1] = point(to)
    const large = Math.abs(to - from) > 180 ? 1 : 0
    const sweep = to < from ? 1 : 0
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} ${sweep} ${x1} ${y1} Z`
  }
  const aMax = reach(pair.a)
  const bMax = reach(pair.b)
  const [tx, ty] = point(angle, r + 4)
  return (
    <svg viewBox="0 0 180 146" className={styles.dial} role="img" aria-label={`${pair.a.es}${pair.b ? ` y ${pair.b.es}` : ''}`}>
      {aMax > 0 && <path d={arc(0, aMax)} className={styles.sector} data-side="a" data-stated={pair.a.degrees !== undefined} />}
      {pair.b && bMax > 0 && <path d={arc(0, -bMax)} className={styles.sector} data-side="b" data-stated={pair.b.degrees !== undefined} />}
      <line x1={cx} y1={cy} x2={point(0)[0]} y2={point(0)[1]} className={styles.neutral} />
      <line x1={cx} y1={cy} x2={tx} y2={ty} className={styles.segment} />
      <circle cx={cx} cy={cy} r={5} className={styles.pivot} />
      <text x={cx} y={cy + r + 14} textAnchor="middle" className={styles.zero}>
        0°
      </text>
    </svg>
  )
}

function MotorList({ movement, active }: { movement?: Movement; active: boolean }) {
  if (!movement) return <div />
  const item = (motor: Motor, role: 'prime' | 'assist') => (
    <li key={`${role}-${motor.es}`} data-role={role} title={motor.pieces.join(' · ')}>
      {motor.es}
    </li>
  )
  return (
    <div className={styles.motors} data-active={active}>
      <p className={styles.movement}>{movement.es}</p>
      <ul>
        {movement.prime.map((m) => item(m, 'prime'))}
        {(movement.assist ?? []).map((m) => item(m, 'assist'))}
      </ul>
    </div>
  )
}

function PairRow({ pair }: { pair: MovementPair }) {
  const [angle, setAngle] = useState(0)
  const aMax = reach(pair.a)
  const bMax = reach(pair.b)
  const current = angle > 0 ? pair.a : angle < 0 ? pair.b : undefined
  const stated = current?.degrees !== undefined
  return (
    <section className={styles.pair}>
      <MotorList movement={pair.b} active={angle < 0} />
      <div className={styles.center}>
        <Dial pair={pair} angle={angle} />
        <input
          type="range"
          className={styles.slider}
          min={-bMax}
          max={aMax}
          step={1}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          aria-label={pair.b ? `De ${pair.b.es.toLowerCase()} a ${pair.a.es.toLowerCase()}` : pair.a.es}
        />
        <p className={styles.plane}>{PLANE[pair.plane]}</p>
        <p className={styles.reading} aria-live="polite">
          {current ? (
            <>
              <strong>{current.es}</strong>
              {stated ? ` · ${Math.abs(angle)}°` : ''}
            </>
          ) : (
            'Posición neutra'
          )}
        </p>
      </div>
      <MotorList movement={pair.a} active={angle > 0} />
      <div className={styles.facts}>
        {current?.range && <p>{current.range}</p>}
        {!current && pair.total && <p>Amplitud total: {pair.total}</p>}
        {current?.note && <p className={styles.note}>{current.note}</p>}
        {!current && <p className={styles.note}>Arrastra el control hacia uno u otro lado: se encienden los músculos que mueven en ese sentido.</p>}
      </div>
    </section>
  )
}

/** Lámina III of Artrología: the movements of the great joints and the muscles that make them. */
export function JointMotions() {
  const [key, setKey] = useState(JOINT_MOTIONS[1].key)
  const joint = JOINT_MOTIONS.find((j) => j.key === key)!
  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · Los movimientos y sus músculos</figcaption>
      <div className={plate.chipBar} role="group" aria-label="Articulación">
        {JOINT_MOTIONS.map((j) => (
          <button key={j.key} className={plate.chip} data-active={j.key === key} aria-pressed={j.key === key} onClick={() => setKey(j.key)}>
            {j.es}
          </button>
        ))}
      </div>
      <div className={styles.head}>
        <p className={plate.kicker}>{joint.genus}</p>
        {joint.note && <p className={styles.jointNote}>{joint.note}</p>}
      </div>
      {/* Keyed by joint, so each pair starts again from the neutral position. */}
      <div key={joint.key}>
        {joint.pairs.map((pair) => (
          <PairRow key={pair.a.id} pair={pair} />
        ))}
      </div>
      <div className={plate.legend}>
        <p className={plate.hint}>
          En negrita, los motores principales; en redonda, los que ayudan. El sector lleno es la amplitud que dan las fuentes; el discontinuo, un
          movimiento que no cifran. Según {joint.sources.map(sourceLabel).join('; ')}.
        </p>
      </div>
    </figure>
  )
}

interface PieceOption {
  en: string
  es: string
  haystack: string
}

const ROLE = { prime: 'motor principal', assist: 'ayuda' } as const

/** Lámina II of Miología: what each muscle does at every joint it crosses. */
export function MuscleActions() {
  const options = useMemo<PieceOption[]>(() => {
    const seen = new Map<string, PieceOption>()
    for (const e of softEntries) {
      if (e.set !== 'muscles' || !actionsOfPiece.has(e.en) || seen.has(e.en)) continue
      const es = softName(e)
      seen.set(e.en, { en: e.en, es, haystack: normalize(`${es} ${e.en} ${e.la ?? ''}`) })
    }
    return [...seen.values()].sort((a, b) => a.es.localeCompare(b.es, 'es'))
  }, [])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('Rectus femoris muscle')
  const shown = query ? options.filter((o) => o.haystack.includes(normalize(query))) : options
  const actions = actionsOfPiece.get(selected) ?? []
  const joints = jointsOfPiece(selected)
  const name = options.find((o) => o.en === selected)?.es ?? selected

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina II · Lo que hace cada músculo</figcaption>
      <div className={styles.actions}>
        <div className={styles.picker}>
          <input
            type="search"
            className={styles.search}
            placeholder="Buscar un músculo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar un músculo"
          />
          <ul className={styles.options}>
            {shown.map((o) => (
              <li key={o.en}>
                <button className={styles.option} data-active={o.en === selected} onClick={() => setSelected(o.en)}>
                  {o.es}
                  {jointsOfPiece(o.en).length > 1 && <span className={styles.badge}>{jointsOfPiece(o.en).length}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.card} aria-live="polite">
          <p className={plate.kicker}>{joints.length > 1 ? `Cruza ${joints.length} articulaciones` : 'Actúa sobre una articulación'}</p>
          <h3 className={plate.title}>{name}</h3>
          <dl className={styles.byJoint}>
            {JOINT_MOTIONS.filter((j) => joints.includes(j.key)).map((j) => (
              <div key={j.key}>
                <dt>{j.es}</dt>
                <dd>
                  {actions
                    .filter((a) => a.joint === j)
                    .map((a) => (
                      <span key={a.movement.id} data-role={a.role}>
                        {a.movement.es} <small>({ROLE[a.role]})</small>
                      </span>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
          {joints.length > 1 && (
            <p className={styles.note}>
              Un músculo que cruza varias articulaciones no puede dar todo su efecto en todas a la vez: si se acorta en una, le queda menos recorrido
              para la otra.
            </p>
          )}
        </div>
      </div>
      <div className={plate.legend}>
        <p className={plate.hint}>
          El número junto al nombre cuenta las articulaciones que mueve. Las acciones son las de la Lámina III de Artrología, según Moore y Latarjet y
          Ruiz Liard.
        </p>
      </div>
    </figure>
  )
}
