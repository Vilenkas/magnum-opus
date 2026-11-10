import { useState } from 'react'
import { LESIONS, NODES, ORGANS, SEGMENTS, node, states, type Lesion, type Way } from '../data/autonomic'
import plate from './skeleton/plate.module.css'
import styles from './AutonomicSystem.module.css'

const W = 640
const H = 540
const ORGAN_X = 170
const AXIS_X = 600
const TOP = 12
const px = (x: number) => ORGAN_X + x * (AXIS_X - 22 - ORGAN_X)
const py = (y: number) => TOP + y * (H - 2 * TOP)

/** The neuraxis: the brainstem's nuclei above, the cord's segments below. */
const NUCLEI: Record<string, number> = {
  III: 0.05,
  VII: 0.17,
  IX: 0.25,
  X: 0.31,
}
const CORD_TOP = 0.36
const segY = (s: string) => CORD_TOP + (SEGMENTS.indexOf(s) + 0.5) * ((1 - CORD_TOP) / SEGMENTS.length)
const centreY = (c: Way['centre']) => py(typeof c === 'string' ? NUCLEI[c] : (segY(c[0]) + segY(c[1])) / 2)

function wayPoints(w: Way, organY: number) {
  const pts = [{ x: AXIS_X - 8, y: centreY(w.centre) }, ...w.path.map((id) => ({ x: px(node(id).x), y: py(node(id).y) }))]
  const organ = { x: ORGAN_X + 4, y: py(organY) }
  if (w.relay === 'organ') return { pre: [...pts, organ], post: [] }
  // The relay's index in `pts` (the centre comes first): preganglionic up to it, postganglionic from it.
  const k = w.path.indexOf(w.relay) + 1
  return { pre: pts.slice(0, k + 1), post: [...pts.slice(k), organ] }
}
const d = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

/** Lámina: the two outflows of the vegetative system, and what a lesion of either leaves to the other. */
export function AutonomicSystem() {
  const [id, setId] = useState<string | null>(null)
  const l: Lesion | null = id ? LESIONS.find((x) => x.id === id)! : null
  const st = states(l)
  const changed = st.filter((s) => s.state !== 'normal')

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XXIV · El simpático y el parasimpático</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Lugar de la lesión">
        <button className={plate.chip} data-active={id === null} onClick={() => setId(null)}>
          Sin lesión
        </button>
        {LESIONS.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === id} onClick={() => setId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="Los centros vegetativos del tronco del encéfalo y de la médula, sus ganglios y los órganos a los que van">
          {/* The neuraxis. */}
          <rect x={AXIS_X - 8} y={py(0.01)} width={26} height={py(CORD_TOP) - py(0.01)} rx={10} className={styles.brainstem} />
          <rect x={AXIS_X - 4} y={py(CORD_TOP)} width={18} height={py(0.995) - py(CORD_TOP)} rx={8} className={styles.cord} />
          {SEGMENTS.map((sgm) => {
            const sympathetic = SEGMENTS.indexOf(sgm) >= SEGMENTS.indexOf('T1') && SEGMENTS.indexOf(sgm) <= SEGMENTS.indexOf('L2')
            const sacral = ['S2', 'S3', 'S4'].includes(sgm)
            return (
              <g key={sgm}>
                <rect x={AXIS_X - 4} y={py(segY(sgm)) - 6} width={18} height={12} className={sympathetic ? styles.segSym : sacral ? styles.segPara : styles.seg} />
                {(sgm.endsWith('1') || sgm === 'L2' || sgm === 'S4' || sgm === 'T12') && (
                  <text x={AXIS_X + 18} y={py(segY(sgm)) + 3} className={styles.segText}>
                    {sgm}
                  </text>
                )}
              </g>
            )
          })}
          {Object.entries(NUCLEI).map(([n, y]) => (
            <g key={n}>
              <circle cx={AXIS_X + 5} cy={py(y)} r={4} className={styles.nucleus} />
              <text x={AXIS_X + 22} y={py(y) + 3} className={styles.segText}>
                {n}
              </text>
            </g>
          ))}

          {/* The ways. */}
          {st.flatMap((s) =>
            (['sympathetic', 'parasympathetic'] as const).flatMap((sys) => {
              const w = s.organ[sys]
              if (!w) return []
              const isCut = sys === 'sympathetic' ? s.cutSympathetic : s.cutParasympathetic
              const { pre, post } = wayPoints(w, s.organ.y)
              return [
                <path key={`${s.organ.id}-${sys}-pre`} d={d(pre)} className={styles.pre} data-system={sys} data-cut={isCut} />,
                post.length ? <path key={`${s.organ.id}-${sys}-post`} d={d(post)} className={styles.post} data-system={sys} data-cut={isCut} /> : null,
              ]
            }),
          )}

          {/* Ganglia and nerves. */}
          {NODES.map((n) => {
            const hit = !!l?.nodes.includes(n.id)
            return (
              <g key={n.id}>
                <title>{n.name}</title>
                {n.ganglion ? (
                  <ellipse cx={px(n.x)} cy={py(n.y)} rx={7} ry={4.5} className={styles.ganglion} data-system={n.system} />
                ) : (
                  <circle cx={px(n.x)} cy={py(n.y)} r={2.2} className={styles.dot} data-system={n.system} />
                )}
                <text x={px(n.x)} y={py(n.y) - 7} textAnchor="middle" className={styles.nodeText}>
                  {n.name}
                </text>
                {hit && (
                  <g transform={`translate(${px(n.x)} ${py(n.y)})`} className={styles.lesion}>
                    <circle r={9} />
                    <path d="M-5 -5 L5 5 M5 -5 L-5 5" />
                  </g>
                )}
              </g>
            )
          })}

          {/* The organs. */}
          {st.map((s) => (
            <g key={s.organ.id} className={styles.organ} data-state={s.state}>
              <circle cx={ORGAN_X + 4} cy={py(s.organ.y)} r={3.5} />
              <text x={ORGAN_X - 4} y={py(s.organ.y) + 3.5} textAnchor="end">
                {s.organ.name}
              </text>
            </g>
          ))}
        </svg>

        <div className={styles.side}>
          <p className={styles.key}>
            <span className={styles.keySym}>Simpático</span> · <span className={styles.keyPara}>parasimpático</span>. Trazo lleno, fibra preganglionar; punteado, posganglionar.
          </p>
          {l ? (
            changed.length ? (
              <ul className={styles.list}>
                {changed.map((s) => (
                  <li key={s.organ.id}>
                    <strong>{s.organ.name}.</strong> {s.shows}
                  </li>
                ))}
              </ul>
            ) : null
          ) : (
            <ul className={styles.list}>
              {ORGANS.map((o) => (
                <li key={o.id}>
                  <strong>{o.name}.</strong> {o.sympathetic && <span className={styles.keySym}>{o.sympathetic.does}</span>}{' '}
                  {o.parasympathetic && <span className={styles.keyPara}>{o.parasympathetic.does}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{l ? 'Lesión' : 'Las dos inervaciones'}</p>
        <p className={plate.title}>{l ? l.name : 'Cada órgano, entre dos sistemas'}</p>
        {l && <p className={styles.text}>{l.cause}</p>}
        <p className={plate.hint}>
          {l
            ? 'Donde actúan los dos sistemas, el órgano queda en manos del que sobrevive; donde actúa uno solo, lo pierde todo. Nada se escribe a mano: basta ver qué vías cruzan la lesión.'
            : 'El simpático hace relevo cerca de la médula, en la cadena o en un plexo prevertebral; el parasimpático, junto al órgano o en su pared. Por eso, para un mismo órgano, la fibra posganglionar simpática es siempre la más larga.'}
        </p>
      </div>
    </figure>
  )
}
