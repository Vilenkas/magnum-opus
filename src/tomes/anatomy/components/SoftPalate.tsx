import { useState } from 'react'
import {
  ACTS,
  act,
  contracts,
  isParalysed,
  lesion,
  LESIONS,
  MUSCLES,
  outcome,
  signs,
  SIDES,
  type ActId,
  type LesionId,
  type Outcome,
  type Side,
} from '../data/soft-palate'
import plate from './skeleton/plate.module.css'
import styles from './SoftPalate.module.css'

const NERVE_NAME = { X: 'vago', V3: 'mandibular (V3)' }
const CLOSURE = {
  closed: 'cerrado',
  incomplete: 'entreabierto',
  open: 'abierto',
}

/** Lámina: the velum of the palate seen through the open mouth, and in a sagittal cut, in each of its acts. */
export function SoftPalate() {
  const [actId, setAct] = useState<ActId>('phonation')
  const [lesionId, setLesion] = useState<LesionId>('X-right')
  const [today, setToday] = useState(false)
  const a = act(actId)
  const l = lesion(lesionId)
  const o = outcome(actId, lesionId)
  const found = signs(actId, lesionId)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina I · El velo del paladar</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Acto">
        {ACTS.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === actId} onClick={() => setAct(x.id)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className={plate.chipBar} role="group" aria-label="Parálisis">
        {LESIONS.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === lesionId} onClick={() => setLesion(x.id)}>
            {x.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={today} aria-pressed={today} onClick={() => setToday((t) => !t)}>
          Nombres de hoy
        </button>
      </div>

      <div className={styles.body}>
        <Front o={o} sucking={actId === 'sucking'} />
        <Sagittal o={o} actId={actId} />
        <div>
          <ul className={styles.muscles}>
            <li className={styles.head}>
              <span />
              <span title="Lado derecho del sujeto">D</span>
              <span title="Lado izquierdo del sujeto">I</span>
            </li>
            {MUSCLES.map((m) => (
              <li key={m.id} className={styles.muscle}>
                <span>
                  <span className={styles.name}>{today ? m.today : m.testut}</span>
                  <span className={styles.nerve}>{NERVE_NAME[m.nerve]}</span>
                </span>
                {SIDES.map((side) => {
                  const state = isParalysed(m, side, l) ? 'paralysed' : contracts(m, side, a, l) ? 'active' : 'idle'
                  return (
                    <span
                      key={side}
                      className={styles.dot}
                      data-state={state}
                      title={
                        {
                          paralysed: 'paralizado',
                          active: 'se contrae',
                          idle: 'en reposo',
                        }[state]
                      }
                    />
                  )
                })}
              </li>
            ))}
          </ul>
          <p className={styles.key}>
            <span className={styles.dot} data-state="active" /> se contrae <span className={styles.dot} data-state="idle" /> reposo{' '}
            <span className={styles.dot} data-state="paralysed" /> paralizado
          </p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {a.name} · {l.id === 'none' ? 'sin lesión' : `parálisis del ${l.name.toLowerCase()}`} · paso nasal {CLOSURE[o.nasal]}, istmo de las fauces{' '}
          {CLOSURE[o.oral]}
        </p>
        <p className={styles.text}>{a.text}</p>
        {found.length > 0 ? (
          <ul className={styles.signs}>
            {found.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : (
          l.id !== 'none' && <p className={styles.text}>En este acto la parálisis no se nota: los músculos que perdió no trabajan en él.</p>
        )}
      </div>
    </figure>
  )
}

/** The isthmus of the fauces through the open mouth (Testut fig. 35). The viewer faces the subject: their right is on the left. */
function Front({ o, sucking }: { o: Outcome; sucking: boolean }) {
  const cx = 160 + 22 * o.deviation
  const lower = sucking ? 20 : 0
  // Each side of the arch rises with its own levator: a palsied side droops.
  const sideY = (s: Side) => 168 + lower - 90 * o.liftBySide[s]
  const yb = 112 + lower - 52 * o.lift
  const uv = 30 * (1 - 0.45 * o.uvula)
  const tip = cx + 6 * o.deviation
  // Screen x of a side: the subject's right on the viewer's left.
  const sx = (s: Side, near: number, far: number) => (s === 'right' ? 160 - far + near : 160 + far - near)
  const anterior = (s: Side) => sx(s, 30 * o.pillars.anterior[s], 92)
  const posterior = (s: Side) => sx(s, 22 * o.pillars.posterior[s], 52)
  const velum = `M10 0 L310 0 L310 ${sideY('left') - 18} Q${cx + 70} ${yb - 6} ${cx + 13} ${yb} Q${cx + 9} ${yb + uv * 0.4} ${tip + 6} ${yb + uv} Q${tip} ${yb + uv + 7} ${tip - 6} ${yb + uv} Q${cx - 9} ${yb + uv * 0.4} ${cx - 13} ${yb} Q${cx - 70} ${yb - 6} 10 ${sideY('right') - 18} Z`
  const tongueY = sucking ? 226 : 246
  return (
    <svg viewBox="0 0 320 260" className={styles.front} role="img" aria-label="El istmo de las fauces visto con la boca abierta">
      <defs>
        <clipPath id="soft-palate-mouth">
          <ellipse cx={160} cy={130} rx={128} ry={104} />
        </clipPath>
      </defs>
      <ellipse cx={160} cy={130} rx={150} ry={124} className={styles.lips} />
      <g clipPath="url(#soft-palate-mouth)">
        <rect x={0} y={0} width={320} height={260} className={styles.pharynx} />
        {/* Posterior pillars, behind the tonsils. */}
        {SIDES.map((s) => (
          <path
            key={`p${s}`}
            d={`M${s === 'right' ? cx - 12 : cx + 12} ${yb + 2} Q${posterior(s)} ${yb + 40} ${posterior(s)} 250`}
            className={styles.posteriorPillar}
          />
        ))}
        {SIDES.map((s) => (
          <ellipse key={`t${s}`} cx={(anterior(s) + posterior(s)) / 2} cy={190 + lower / 2} rx={13} ry={24} className={styles.tonsil} />
        ))}
        <path d={velum} className={styles.velum} />
        <line x1={cx} y1={8} x2={cx} y2={yb - 4} className={styles.raphe} />
        {/* Anterior pillars, in front. */}
        {SIDES.map((s) => (
          <path
            key={`a${s}`}
            d={`M${s === 'right' ? cx - 14 : cx + 14} ${yb} Q${anterior(s) + (s === 'right' ? -6 : 6)} ${yb + 30} ${anterior(s)} 250`}
            className={styles.anteriorPillar}
          />
        ))}
        <ellipse cx={160} cy={tongueY + 34} rx={112} ry={58} className={styles.tongue} />
        <path d={`M160 ${tongueY - 18} L160 ${tongueY + 20}`} className={styles.tongueGroove} />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={58 + i * 21} y={26 - Math.abs(i - 4.5) * 2.4} width={18} height={14 - Math.abs(i - 4.5)} rx={3} className={styles.tooth} />
        ))}
      </g>
      <ellipse cx={160} cy={130} rx={128} ry={104} className={styles.mouthEdge} />
      <text x={22} y={252} className={styles.sideLabel}>
        derecha
      </text>
      <text x={298} y={252} textAnchor="end" className={styles.sideLabel}>
        izquierda
      </text>
    </svg>
  )
}

/** A sagittal cut, face to the left: the velum swings from hanging to horizontal against the pharyngeal wall. */
function Sagittal({ o, actId }: { o: Outcome; actId: ActId }) {
  const sucking = actId === 'sucking'
  const angle = ((sucking ? 74 : 64 - 62 * o.lift) * Math.PI) / 180
  const L = 54
  const x0 = 108
  const y0 = 92
  const end = [x0 + L * Math.cos(angle), y0 + L * Math.sin(angle)]
  const mid = [x0 + (L / 2) * Math.cos(angle) + 4 * Math.sin(angle), y0 + (L / 2) * Math.sin(angle) - 4 * Math.cos(angle)]
  const tongueTop = sucking ? 116 : 132
  const leak = actId !== 'rest' && act(actId).needs === 'nasal' && o.nasal !== 'closed'
  const swallowing = actId === 'swallowing'
  return (
    <svg viewBox="0 0 220 210" className={styles.sagittal} role="img" aria-label="Corte sagital del velo y la faringe">
      <path d="M8 20 L180 20 L180 60 Q172 64 166 76 L166 205 L8 205 Z" className={styles.cavity} />
      <text x={50} y={52} className={styles.region}>
        fosas nasales
      </text>
      <text x={128} y={38} textAnchor="middle" className={styles.region}>
        nasofaringe
      </text>
      <text x={40} y={150} className={styles.region}>
        boca
      </text>
      <rect x={14} y={y0 - 4} width={x0 - 12} height={8} rx={2} className={styles.bone} />
      <text x={60} y={y0 - 8} textAnchor="middle" className={styles.small}>
        bóveda palatina
      </text>
      <path d={`M10 205 Q14 ${tongueTop} 80 ${tongueTop - 6} Q130 ${tongueTop - 6} 150 ${tongueTop + 40} L156 205 Z`} className={styles.tongue} />
      <path d={`M${x0} ${y0} Q${mid[0]} ${mid[1]} ${end[0]} ${end[1]}`} className={styles.velumSide} />
      <line x1={172} y1={30} x2={172} y2={205} className={styles.wall} />
      <text x={190} y={130} className={styles.small} transform="rotate(90 190 130)">
        pared posterior
      </text>
      {/* The auditory tube opens on the lateral wall of the nasopharynx. */}
      {(['right', 'left'] as Side[]).map((s, i) => (
        <g key={s} transform={`translate(${138 + i * 22} 66)`}>
          <ellipse rx={7} ry={o.tube[s] ? 5 : 1.2} className={styles.tube} data-open={o.tube[s]} />
          <text y={15} textAnchor="middle" className={styles.small}>
            {s === 'right' ? 'D' : 'I'}
          </text>
        </g>
      ))}
      <text x={149} y={56} textAnchor="middle" className={styles.small}>
        trompas
      </text>
      {leak && <path d={`M150 ${swallowing ? 180 : 168} Q152 130 140 104 L120 74`} className={styles.leak} markerEnd="url(#soft-palate-arrow)" />}
      <defs>
        <marker id="soft-palate-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" className={styles.arrowHead} />
        </marker>
      </defs>
      <text x={90} y={14} textAnchor="middle" className={styles.state} data-state={sucking ? o.oral : o.nasal}>
        {sucking ? `istmo de las fauces ${CLOSURE[o.oral]}` : `paso nasal ${CLOSURE[o.nasal]}`}
      </text>
    </svg>
  )
}
