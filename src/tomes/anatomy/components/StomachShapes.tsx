import { useState } from 'react'
import { CARDIA, climb, levelOf, outline, PYLORUS, shapeAt, toneAt, TONES, VERTEBRAE, vertebraTop, type Posture } from '../data/stomach-shapes'
import plate from './skeleton/plate.module.css'
import styles from './StomachShapes.module.css'

/** Pixels per vertebral body; the midline; T11's top. */
const K = 27
const MID = 150
const TOP = 96
const X = (x: number) => MID + x * K
const Y = (y: number) => TOP + y * K

/** Lámina: the stomach of the living in its four tones, standing or lying. */
export function StomachShapes() {
  const [t, setT] = useState(0.33)
  const [posture, setPosture] = useState<Posture>('standing')
  const s = shapeAt(t, posture)
  const tone = toneAt(t)
  const d = outline(s, X, Y)
  const clip = 'stomach-shape-clip'

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina V · Las formas del estómago</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Posición">
        <button className={plate.chip} data-active={posture === 'standing'} onClick={() => setPosture('standing')}>
          De pie
        </button>
        <button className={plate.chip} data-active={posture === 'supine'} onClick={() => setPosture('supine')}>
          Acostado
        </button>
      </div>
      <div className={styles.timeline}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => setT(+e.target.value)}
          aria-label="Tono de la pared"
          aria-valuetext={tone.name}
        />
        <div className={styles.ticks}>
          {TONES.map((x) => (
            <button key={x.id} className={styles.tick} data-active={x.id === tone.id} style={{ left: `${x.t * 100}%` }} onClick={() => setT(x.t)}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <svg
          viewBox="0 0 330 390"
          className={styles.scheme}
          role="img"
          aria-label={`Estómago ${tone.name.toLowerCase()}, ${posture === 'standing' ? 'de pie' : 'acostado'}`}
        >
          {/* The column, the lower ribs and the iliac crests, as in Delort's shadows. */}
          {VERTEBRAE.map((v, i) => (
            <g key={v}>
              <rect x={MID - 13} y={Y(vertebraTop(i)) + 2} width={26} height={K - 5} rx={4} className={styles.vertebra} />
              <text x={MID - 22} y={Y(vertebraTop(i)) + K / 2 + 3} textAnchor="end" className={styles.level}>
                {v}
              </text>
            </g>
          ))}
          <path d={`M${MID + 16} ${Y(-1.9)} Q${X(4.4)} ${Y(-1.2)} ${X(4.6)} ${Y(2.2)}`} className={styles.rib} />
          <path d={`M${MID - 16} ${Y(-1.9)} Q${X(-4.4)} ${Y(-1.2)} ${X(-4.6)} ${Y(2.2)}`} className={styles.rib} />
          <path d={`M${X(4.8)} ${Y(6.2)} Q${X(3.6)} ${Y(5.2)} ${X(2.2)} ${Y(5.9)}`} className={styles.crest} />
          <path d={`M${X(-4.8)} ${Y(6.2)} Q${X(-3.6)} ${Y(5.2)} ${X(-2.2)} ${Y(5.9)}`} className={styles.crest} />
          <line x1={X(-5)} x2={X(5)} y1={Y(5.6)} y2={Y(5.6)} className={styles.crestLine} />
          <text x={X(5)} y={Y(5.6) - 4} textAnchor="end" className={styles.small}>
            línea de las crestas
          </text>
          <path d={`M${X(-5)} ${Y(-1.6)} Q${X(0)} ${Y(-2.6)} ${X(5)} ${Y(-1.6)}`} className={styles.diaphragm} />

          <defs>
            <clipPath id={clip}>
              <path d={d} />
            </clipPath>
          </defs>
          {/* The oesophagus into the cardia, the duodenum out of the pylorus. */}
          <path d={`M${X(0.5)} ${Y(-2.6)} L${X(CARDIA.x)} ${Y(CARDIA.y)}`} className={styles.oesophagus} />
          <path d={`M${X(PYLORUS.x)} ${Y(PYLORUS.y)} L${X(PYLORUS.x - 1.6)} ${Y(PYLORUS.y + 0.2)}`} className={styles.duodenum} />
          <path d={d} className={styles.barium} />
          {/* The air in the fundus shows clear on the screen. */}
          <rect x={0} y={0} width={330} height={Y(s.fundus.y + 0.75)} clipPath={`url(#${clip})`} className={styles.air} />
          <path d={d} className={styles.outline} />
          <circle cx={X(PYLORUS.x)} cy={Y(PYLORUS.y)} r={3.2} className={styles.fixed} />
          <circle cx={X(CARDIA.x)} cy={Y(CARDIA.y)} r={3.2} className={styles.fixed} />
          <text x={X(PYLORUS.x) - 6} y={Y(PYLORUS.y) - 8} textAnchor="end" className={styles.label}>
            píloro
          </text>
          <text x={X(CARDIA.x) - 4} y={Y(CARDIA.y) - 10} textAnchor="end" className={styles.label}>
            cardias
          </text>
          <text x={X(s.fundus.x)} y={Y(s.fundus.y) + 13} textAnchor="middle" className={styles.label}>
            cámara de aire
          </text>
          <line x1={X(s.lowest.x) - 30} x2={X(s.lowest.x) + 50} y1={Y(s.lowest.y)} y2={Y(s.lowest.y)} className={styles.pole} />
          <text x={X(s.lowest.x) + 54} y={Y(s.lowest.y) + 3} className={styles.small}>
            polo inferior · {levelOf(s.lowest.y)}
          </text>
        </svg>

        <div className={styles.read}>
          <p className={plate.kicker}>
            {tone.name} · {posture === 'standing' ? 'de pie' : 'acostado'}
          </p>
          <p className={styles.text}>{tone.text}</p>
          <p className={styles.text}>
            {climb(s) < 1
              ? 'La porción horizontal casi no sube: el píloro es casi el punto más bajo.'
              : `El polo inferior está frente a ${levelOf(s.lowest.y)}, ${climb(s).toFixed(1).replace('.', ',')} cuerpos vertebrales por debajo del píloro, que la porción horizontal tiene que remontar.`}
          </p>
          {posture === 'supine' && (
            <p className={styles.text}>
              Acostado, la imagen se ensancha, se hace globulosa, y el polo inferior sube; el cardias y el píloro, bien fijados, no se mueven.
            </p>
          )}
          <p className={styles.note}>Esquemático, según las sombras radiológicas de Delort (Testut, figs. 192–195).</p>
        </div>
      </div>
    </figure>
  )
}
