import { useState } from 'react'
import {
  airway,
  CHAMBERS,
  failure,
  FAILURES,
  gate,
  GATES,
  isShut,
  OUTCOME_TEXT,
  phase,
  PHASES,
  swallow,
  type ChamberId,
  type FailureId,
  type GateId,
  type PhaseId,
} from '../data/swallowing'
import plate from './skeleton/plate.module.css'
import styles from './Swallowing.module.css'

/** Each chamber as a box of the sagittal scheme, face to the left. */
const BOX: Record<ChamberId, { x: number; y: number; w: number; h: number; label: [number, number] }> = {
  nose: { x: 20, y: 24, w: 128, h: 56, label: [84, 56] },
  nasopharynx: { x: 156, y: 24, w: 62, h: 70, label: [187, 62] },
  mouth: { x: 20, y: 104, w: 128, h: 74, label: [84, 146] },
  oropharynx: { x: 156, y: 102, w: 62, h: 86, label: [187, 150] },
  laryngopharynx: { x: 170, y: 196, w: 62, h: 62, label: [201, 230] },
  larynx: { x: 112, y: 196, w: 50, h: 126, label: [137, 290] },
  oesophagus: { x: 170, y: 268, w: 62, h: 72, label: [201, 310] },
}

const SHORT: Record<ChamberId, string> = {
  nose: 'fosas nasales',
  nasopharynx: 'rinofaringe',
  mouth: 'boca',
  oropharynx: 'orofaringe',
  laryngopharynx: 'laringofaringe',
  larynx: 'laringe',
  oesophagus: 'esófago',
}

/** Each gate as a bar between two boxes. */
const BAR: Record<GateId, [number, number, number, number]> = {
  velum: [156, 98, 218, 98],
  fauces: [152, 106, 152, 176],
  larynx: [166, 200, 166, 254],
  ues: [170, 263, 232, 263],
}

/** Lámina: the aerodigestive crossroads, in breathing and in the three phases of swallowing. */
export function Swallowing() {
  const [phaseId, setPhase] = useState<PhaseId>('pharyngeal')
  const [failureId, setFailure] = useState<FailureId>('none')
  const p = phase(phaseId)
  const f = failure(failureId)
  const run = swallow(failureId)
  const step = run.steps.find((s) => s.phase === phaseId)
  const bolus = new Set(step?.bolus ?? [])
  const air = airway(p, f)
  const astray = (c: ChamberId) => bolus.has(c) && (c === 'nose' || c === 'larynx' || (c === 'nasopharynx' && phaseId !== 'breathing'))

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · La encrucijada aerodigestiva</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Fase">
        {PHASES.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === phaseId} onClick={() => setPhase(x.id)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className={plate.chipBar} role="group" aria-label="Fallo">
        {FAILURES.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === failureId} onClick={() => setFailure(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 244 352" className={styles.scheme} role="img" aria-label="Esquema sagital de la faringe y sus cavidades">
          <text x={20} y={14} className={styles.face}>
            ← cara
          </text>
          {CHAMBERS.map((c) => {
            const b = BOX[c.id]
            return (
              <g key={c.id}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={9}
                  className={styles.chamber}
                  data-air={air.has(c.id)}
                  data-bolus={bolus.has(c.id)}
                  data-astray={astray(c.id)}
                />
                <text x={b.label[0]} y={b.label[1]} textAnchor="middle" className={styles.label}>
                  {SHORT[c.id]}
                </text>
              </g>
            )
          })}
          {GATES.map((g) => {
            const [x1, y1, x2, y2] = BAR[g.id]
            const shut = isShut(g.id, p, f)
            return <line key={g.id} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.gate} data-shut={shut} data-failed={f.gate === g.id} />
          })}
          <text x={137} y={340} textAnchor="middle" className={styles.small}>
            tráquea ↓
          </text>
          <text x={201} y={348} textAnchor="middle" className={styles.small}>
            estómago ↓
          </text>
        </svg>

        <div className={styles.side}>
          <ul className={styles.gates}>
            {GATES.map((g) => {
              const shut = isShut(g.id, p, f)
              return (
                <li key={g.id} data-failed={f.gate === g.id}>
                  <span className={styles.dot} data-shut={shut} />
                  <span>
                    <strong>{g.name}</strong> {shut ? 'cerrado' : 'abierto'}
                    <span className={styles.by}>lo cierra {g.by}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <p className={styles.key}>
            <span className={styles.swatch} data-kind="air" /> aire <span className={styles.swatch} data-kind="bolus" /> bolo{' '}
            <span className={styles.swatch} data-kind="astray" /> bolo extraviado
          </p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {p.name} · {failureId === 'none' ? 'todo funciona' : `${f.name.toLowerCase()}: ${f.cause}`} · {air.has('larynx') ? 'se respira' : 'apnea'}
        </p>
        <p className={styles.text}>{p.text}</p>
        {phaseId !== 'breathing' && (
          <ul className={styles.outcomes}>
            {run.outcomes.map((o) => (
              <li key={o} data-good={o === 'swallowed'}>
                {OUTCOME_TEXT[o]}
              </li>
            ))}
          </ul>
        )}
        {f.gate && (
          <p className={styles.note}>
            Falla {gate(f.gate).name.toLowerCase()}: queda {f.stuck === 'open' ? 'abierto cuando debería cerrarse' : 'cerrado cuando debería abrirse'}.
          </p>
        )}
      </div>
    </figure>
  )
}
