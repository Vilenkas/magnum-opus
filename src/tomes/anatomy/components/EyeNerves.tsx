import { useId, useMemo, useState } from 'react'
import { MUSCLES, NERVES, diplopia, reaches, restingDeviation, signsOf, type Gaze, type NerveId, type Signs } from '../data/eye-nerves'
import plate from './skeleton/plate.module.css'
import styles from './EyeNerves.module.css'

const TEXT: Record<NerveId, string> = {
  III: 'Sin el motor ocular común quedan sólo el recto externo y el oblicuo mayor: el ojo se va hacia fuera y algo hacia abajo. El párpado cae, porque el elevador es suyo; la pupila se dilata y el ojo ya no acomoda, porque también lo son el esfínter del iris y el músculo ciliar, a través del ganglio oftálmico.',
  IV: 'El patético mueve un solo músculo, el oblicuo mayor, el único que baja el ojo cuando está vuelto hacia dentro. Paralizado, el ojo apenas se desvía en reposo, algo hacia arriba y rotado hacia fuera, pero la visión se dobla al mirar abajo y adentro, como al bajar la vista para leer o bajar una escalera.',
  VI: 'El motor ocular externo mueve sólo el recto externo. Paralizado, el recto interno queda sin oponente y el ojo se vuelve hacia la nariz: la visión es doble en todas las miradas salvo hacia el lado opuesto, donde el ojo enfermo ya no necesita al músculo perdido.',
  sympathetic: 'El simpático cervical no mueve el globo: tira del párpado con las fibras lisas del elevador y abre la pupila con el dilatador. Interrumpido, el párpado cae un poco y la pupila se cierra, sin diplopía: es el síndrome de Horner.',
}

function Eye({ x, y, scale, dev, signs, diplo, clip }: { x: number; y: number; scale: number; dev: [number, number]; signs: Signs; diplo?: boolean; clip: string }) {
  const rx = 30 * scale
  const ry = 16 * scale
  const iris = 11 * scale
  const pupil = (signs.pupil === 'dilated' ? 6.5 : signs.pupil === 'constricted' ? 2 : 4) * scale
  const ix = x + dev[0] * 17 * scale
  const iy = y - dev[1] * 9 * scale
  const lid = signs.ptosis === 'complete' ? 2 * ry + 2 : signs.ptosis === 'partial' ? ry * 0.85 : ry * 0.35
  const id = `${clip}-${x}-${y}`
  return (
    <g data-diplopia={diplo}>
      <clipPath id={id}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} className={styles.sclera} />
      <g clipPath={`url(#${id})`}>
        <circle cx={ix} cy={iy} r={iris} className={styles.iris} />
        <circle cx={ix} cy={iy} r={pupil} className={styles.pupil} />
        <rect x={x - rx} y={y - ry - 1} width={2 * rx} height={lid} className={styles.lid} data-closed={signs.ptosis === 'complete'} />
      </g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} className={styles.outline} />
    </g>
  )
}

/** Where each eye points for a gaze given for the person (x +1 = to their right): the healthy left eye always follows; the right one only where it can. */
function eyes(nerve: NerveId | null, [gx, gv]: Gaze): { right: [number, number]; left: [number, number] } {
  const rest = restingDeviation(nerve)
  // Right eye: abduction is to the person's right (+x). Left eye: abduction is to their left.
  let rh: number = gx
  let rv: number = gv
  if (!reaches(nerve, [gx, 0])) rh = rest[0]
  if (gv !== 0 && !reaches(nerve, [gx, gv])) rv = gx === 0 ? gv * 0.5 : rest[1]
  if (gx === 0) rh = Math.abs(rest[0]) >= 0.5 ? rest[0] : 0
  if (gv === 0) rv = Math.abs(rest[1]) >= 0.5 ? rest[1] : gv
  return { right: [rh, rv], left: [-gx, gv] }
}

/** Lámina: the motor nerves of the eye, and what each palsy does to the gaze. */
export function EyeNerves() {
  const [nerve, setNerve] = useState<NerveId | null>('VI')
  const [today, setToday] = useState(false)
  const clip = useId().replace(/:/g, '')
  const signs = signsOf(nerve)
  const healthy = signsOf(null)
  const rest = restingDeviation(nerve)
  const grid = useMemo(() => [1, 0, -1].flatMap((v) => [-1, 0, 1].map((x) => [x, v] as Gaze)), [])
  const nerveName = (id: NerveId) => {
    const n = NERVES.find((x) => x.id === id)!
    return today ? n.today : n.name
  }

  // Viewer faces the person: their right eye is on the viewer's left, so +x for the person is −x on screen.
  const screen = (d: [number, number]): [number, number] => [-d[0], d[1]]
  const leftScreen = (d: [number, number]): [number, number] => [d[0], d[1]]

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XIX · Los nervios motores del ojo</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Parálisis del ojo derecho">
        <button className={plate.chip} data-active={nerve === null} onClick={() => setNerve(null)}>
          Ninguna
        </button>
        {NERVES.map((n) => (
          <button key={n.id} className={plate.chip} data-active={nerve === n.id} onClick={() => setNerve(n.id)}>
            {n.id === 'sympathetic' ? nerveName(n.id) : `${n.id} · ${nerveName(n.id)}`}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={today} aria-pressed={today} onClick={() => setToday((t) => !t)}>
          Nombres de hoy
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 300 150" className={styles.face} role="img" aria-label="Los dos ojos mirando al frente">
          <text x={90} y={20} textAnchor="middle" className={styles.side}>
            ojo derecho
          </text>
          <text x={210} y={20} textAnchor="middle" className={styles.side}>
            ojo izquierdo
          </text>
          <Eye x={90} y={78} scale={1.9} dev={screen([rest[0], rest[1]])} signs={signs} clip={clip} />
          <Eye x={210} y={78} scale={1.9} dev={[0, 0]} signs={healthy} clip={clip} />
          {Math.abs(rest[2]) > 0.5 && (
            <text x={90} y={136} textAnchor="middle" className={styles.note}>
              {rest[2] < 0 ? 'rotado hacia fuera' : 'rotado hacia dentro'}
            </text>
          )}
        </svg>

        <div className={styles.side2}>
          <svg viewBox="0 0 300 168" className={styles.grid} role="img" aria-label="Las nueve direcciones de la mirada">
            {grid.map(([x, v]) => {
              const cx = 50 + (1 - x) * 100 // person's right shown on the viewer's left
              const cy = 28 + (1 - v) * 56
              const { right, left } = eyes(nerve, [x as -1 | 0 | 1, v])
              const diplo = diplopia(nerve, [x as -1 | 0 | 1, v])
              return (
                <g key={`${x}${v}`} className={styles.cell} data-diplopia={diplo}>
                  <rect x={cx - 48} y={cy - 26} width={96} height={52} rx={6} />
                  <Eye x={cx - 20} y={cy} scale={0.75} dev={screen(right)} signs={signs} clip={clip} />
                  <Eye x={cx + 20} y={cy} scale={0.75} dev={leftScreen(left)} signs={healthy} clip={clip} />
                </g>
              )
            })}
          </svg>
          <p className={styles.gridNote}>Las nueve miradas, vistas de frente; en rojo, donde se ve doble.</p>
        </div>

        <ul className={styles.muscles}>
          {MUSCLES.map((m) => (
            <li key={m.id} data-lost={nerve !== null && m.nerve === nerve}>
              <span>{today ? m.today : m.name}</span> <span className={styles.nerve}>{m.nerve === 'sympathetic' ? 'simpático' : m.nerve}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{nerve ? `Parálisis del ${nerveName(nerve).toLowerCase().replace(/^nervio /, '')} derecho` : 'Sin parálisis'}</p>
        <p className={styles.text}>
          {nerve
            ? TEXT[nerve]
            : 'Seis músculos mueven cada globo, y tres nervios se los reparten: el motor ocular común se lleva cuatro y el elevador del párpado; el patético, el oblicuo mayor; el motor ocular externo, el recto externo. Elige un nervio para paralizarlo en el ojo derecho.'}
        </p>
        <p className={plate.hint}>
          Los nervios y sus músculos, según Testut; la acción de cada músculo, según Moore. La desviación y la diplopía no se dibujan a mano: salen de los
          músculos que quedan.
        </p>
      </div>
    </figure>
  )
}
