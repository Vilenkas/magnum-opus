import { useState } from 'react'
import { CARDIA, LANDMARKS, landmarkNear, NARROWINGS, narrowingAt, PART_NAME, partAt, START, stopsAt, widthAt } from '../data/oesophagus'
import plate from './skeleton/plate.module.css'
import styles from './Oesophagus.module.css'

/** Vertical scale: px per cm, from 13 cm above to the cardia. */
const TOP = 13
const K = 15
const Y = (d: number) => 20 + (d - TOP) * K
/** Horizontal scale of the widths: px per mm. */
const W = 2.6
const CX = 150
const fmt = (n: number, digits = 1) => n.toFixed(digits).replace('.', ',')

/** Lámina: the oesophagus distended, its narrowings measured from the incisors, and where a swallowed body stops. */
export function Oesophagus() {
  const [depth, setDepth] = useState(22.5)
  const [body, setBody] = useState(16)
  const stop = stopsAt(body)
  const part = partAt(depth)
  const here = narrowingAt(depth)
  const near = landmarkNear(depth)

  const samples: number[] = []
  for (let d = START; d <= CARDIA + 1e-9; d += 0.1) samples.push(d)
  const right = samples.map((d) => `${CX + (widthAt(d) * W) / 2} ${Y(d)}`)
  const left = [...samples].reverse().map((d) => `${CX - (widthAt(d) * W) / 2} ${Y(d)}`)
  const outline = `M${right.join(' L')} L${left.join(' L')} Z`
  const ballAt = stop ? stop.at - body / 20 : CARDIA + 1.4

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · Los estrechamientos del esófago</figcaption>

      <div className={styles.controls}>
        <label>
          <span>Endoscopio: {fmt(depth)} cm de los incisivos</span>
          <input type="range" min={START} max={CARDIA} step={0.1} value={depth} onChange={(e) => setDepth(+e.target.value)} />
        </label>
        <label>
          <span>Cuerpo extraño redondo de {fmt(body)} mm</span>
          <input type="range" min={10} max={22} step={0.5} value={body} onChange={(e) => setBody(+e.target.value)} />
        </label>
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 320 ${Y(CARDIA) + 50}`} className={styles.tube} role="img" aria-label="El esófago distendido con sus estrechamientos">
          {/* The ruler: cm from the incisors. */}
          {Array.from({ length: CARDIA - TOP + 1 }, (_, i) => TOP + i).map((d) => (
            <g key={d}>
              <line x1={30} x2={d % 5 === 0 ? 44 : 38} y1={Y(d)} y2={Y(d)} className={styles.tick} />
              {d % 5 === 0 && (
                <text x={26} y={Y(d) + 3.5} textAnchor="end" className={styles.cm}>
                  {d}
                </text>
              )}
            </g>
          ))}
          <text x={8} y={12} className={styles.cm}>
            cm
          </text>
          <path
            d={`M${CX - 30} ${Y(TOP)} Q${CX - 32} ${Y(START) - 4} ${CX - (widthAt(START) * W) / 2} ${Y(START)} L${CX + (widthAt(START) * W) / 2} ${Y(START)} Q${CX + 32} ${Y(START) - 4} ${CX + 30} ${Y(TOP)}`}
            className={styles.pharynx}
          />
          <text x={CX} y={Y(TOP) + 16} textAnchor="middle" className={styles.small}>
            faringe
          </text>
          <path d={outline} className={styles.wall} />
          {NARROWINGS.map((n) => (
            <g key={n.id}>
              <line x1={CX + 34} x2={CX + 44} y1={Y(n.at)} y2={Y(n.at)} className={styles.lead} />
              <text x={CX + 48} y={Y(n.at) + 3.5} className={styles.narrow}>
                {n.name.replace('Estrechamiento ', '')} · {n.width} mm
              </text>
            </g>
          ))}
          {LANDMARKS.map((l) => (
            <text key={l.at + l.level} x={CX - 54} y={Y(l.at) + 3.5} textAnchor="end" className={styles.level}>
              {l.level}
            </text>
          ))}
          <path d={`M${CX - 48} ${Y(38.2)} Q${CX} ${Y(37.6)} ${CX + 48} ${Y(38.2)}`} className={styles.diaphragm} />
          <ellipse cx={CX + 26} cy={Y(CARDIA) + 18} rx={52} ry={24} className={styles.stomach} />
          <text x={CX + 26} y={Y(CARDIA) + 24} textAnchor="middle" className={styles.small}>
            estómago
          </text>
          {/* The swallowed body. */}
          <circle cx={stop ? CX : CX + 24} cy={Y(ballAt)} r={(body * W) / 2} className={styles.ball} data-stuck={!!stop} />
          {/* The endoscope's tip. */}
          <line x1={CX} x2={CX} y1={Y(TOP)} y2={Y(depth)} className={styles.scope} />
          <circle cx={CX} cy={Y(depth)} r={3.2} className={styles.tip} />
          <line x1={46} x2={CX - 30} y1={Y(depth)} y2={Y(depth)} className={styles.depth} />
        </svg>

        <div className={styles.read}>
          <p className={styles.where}>
            {fmt(depth)} cm · {part ? PART_NAME[part] : 'fuera del esófago'} · luz de {fmt(widthAt(depth))} mm distendido
          </p>
          <p className={styles.text}>{here ? `${here.name}: ${here.cause}.` : `Segmento dilatado entre dos estrechamientos.`}</p>
          <p className={styles.text}>
            Cerca: {near.text.charAt(0).toLowerCase() + near.text.slice(1)} ({near.level}).
          </p>
          <p className={styles.stop} data-stuck={!!stop}>
            {stop
              ? `El cuerpo de ${fmt(body)} mm se detiene a ${fmt(stop.at)} cm, en el ${stop.narrowing?.name.toLowerCase() ?? 'esófago'}.`
              : `El cuerpo de ${fmt(body)} mm pasa todos los estrechamientos y llega al estómago.`}
          </p>
        </div>
      </div>
    </figure>
  )
}
