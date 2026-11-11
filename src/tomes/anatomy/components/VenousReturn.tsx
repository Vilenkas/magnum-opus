import { useMemo, useState } from 'react'
import { COLLATERALS, LESIONS, outcomes, type CollateralId, type LesionId, type VeinId } from '../data/venous-return'
import plate from './skeleton/plate.module.css'
import styles from './VenousReturn.module.css'

type Pt = [number, number]

/** Each vein as a polyline on the scheme (the trunk seen from the front: the person's right on the viewer's left). */
const VEIN_PATHS: Record<VeinId, Pt[]> = {
  bcv: [
    [150, 70],
    [310, 70],
  ],
  'svc-upper': [
    [230, 70],
    [230, 130],
  ],
  'svc-lower': [
    [230, 130],
    [230, 192],
  ],
  azygos: [
    [330, 430],
    [330, 150],
    [240, 130],
  ],
  'portal-tributaries': [
    [80, 400],
    [120, 380],
    [165, 400],
  ],
  'portal-trunk': [
    [120, 380],
    [120, 290],
  ],
  'portal-left-branch': [
    [120, 290],
    [85, 262],
  ],
  liver: [
    [90, 250],
    [175, 250],
  ],
  'ivc-hepatic': [
    [230, 228],
    [230, 280],
  ],
  'ivc-renal': [
    [230, 280],
    [230, 330],
  ],
  'ivc-infra': [
    [230, 330],
    [230, 405],
  ],
  iliac: [
    [190, 455],
    [230, 405],
    [270, 455],
  ],
  atrium: [],
}

const COLLATERAL_AT: Record<CollateralId, Pt> = {
  oesophageal: [282, 300],
  rectal: [205, 470],
  paraumbilical: [40, 340],
  retroperitoneal: [178, 352],
  paravertebral: [300, 450],
  intravertebral: [392, 360],
  anteromedial: [430, 200],
  anterolateral: [22, 170],
  'upper-laterovertebral': [300, 100],
}

const SHORT: Record<CollateralId, string> = {
  oesophageal: 'esofágicas',
  rectal: 'rectales',
  paraumbilical: 'paraumbilicales',
  retroperitoneal: 'retroperitoneales',
  paravertebral: 'paravertebral',
  intravertebral: 'intravertebral',
  anteromedial: 'anteromedial',
  anterolateral: 'anterolateral',
  'upper-laterovertebral': 'intercostales',
}

/** The point of a vein nearest to `p`, where a collateral reaches it. */
function anchor(vein: VeinId, p: Pt): Pt {
  const pts = VEIN_PATHS[vein]
  let best: Pt = pts[0]
  let bestD = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    const dx = bx - ax
    const dy = by - ay
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy || 1)))
    const q: Pt = [ax + t * dx, ay + t * dy]
    const d = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (d < bestD) (bestD = d), (best = q)
  }
  return best
}

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')

/** Lámina VI of Angiología: the great veins of return and the routes blood takes round an obstruction. */
export function VenousReturn() {
  const [lesionId, setLesionId] = useState<LesionId | null>('cirrhosis')
  const lesion = LESIONS.find((l) => l.id === lesionId)
  const result = useMemo(() => outcomes(lesion?.occludes ?? []), [lesion])
  const closed = new Set(lesion?.occludes ?? [])
  const congested = new Set(result.flatMap((o) => o.congested))
  const used = new Set(result.flatMap((o) => o.collaterals.map((c) => c.id)))
  const affected = result.filter((o) => !o.normal)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina VI · Las grandes venas y sus vías colaterales</figcaption>
      <div className={plate.chipBar} role="group" aria-label="Obstrucción">
        <button className={plate.chip} data-active={lesionId === null} onClick={() => setLesionId(null)}>
          Ninguna
        </button>
        {LESIONS.map((l) => (
          <button key={l.id} className={plate.chip} data-active={l.id === lesionId} aria-pressed={l.id === lesionId} onClick={() => setLesionId(l.id)}>
            {l.es}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 460 510" className={styles.scheme} role="img" aria-label="Esquema de las venas cavas, el sistema ácigos y la porta">
          {/* Collaterals under the veins. */}
          {COLLATERALS.map((c) => {
            const at = COLLATERAL_AT[c.id]
            return (
              <g key={c.id} className={styles.collateral} data-used={used.has(c.id)} data-kind={c.kind}>
                {c.ends.map((e) => {
                  const [x, y] = anchor(e, at)
                  return <path key={e} d={`M ${at[0]} ${at[1]} Q ${(at[0] + x) / 2} ${at[1]} ${x} ${y}`} />
                })}
                <circle cx={at[0]} cy={at[1]} r={4} />
                <text x={at[0]} y={at[1] - 8} textAnchor="middle">
                  {SHORT[c.id]}
                </text>
              </g>
            )
          })}

          {(Object.keys(VEIN_PATHS) as VeinId[])
            .filter((v) => v !== 'atrium' && v !== 'liver')
            .map((v) => (
              <path
                key={v}
                d={line(VEIN_PATHS[v])}
                className={styles.vein}
                data-portal={v.startsWith('portal')}
                data-closed={closed.has(v)}
                data-congested={congested.has(v) && !closed.has(v)}
              />
            ))}

          <ellipse cx={132} cy={250} rx={52} ry={26} className={styles.liver} data-closed={closed.has('liver')} data-congested={congested.has('liver')} />
          <text x={132} y={254} textAnchor="middle" className={styles.organ}>
            hígado
          </text>
          <path d="M 184 250 L 230 250" className={styles.vein} data-closed={closed.has('liver')} />
          <rect x={205} y={192} width={50} height={36} rx={10} className={styles.atrium} />
          <text x={230} y={214} textAnchor="middle" className={styles.organ}>
            atrio der.
          </text>

          {/* Closed segments get a cross. */}
          {[...closed].map((v) => {
            const pts = v === 'liver' ? ([[168, 236]] as Pt[]) : VEIN_PATHS[v]
            const [x, y] = pts.length > 1 ? [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2] : pts[0]
            return (
              <g key={v} className={styles.cross}>
                <line x1={x - 9} y1={y - 9} x2={x + 9} y2={y + 9} />
                <line x1={x - 9} y1={y + 9} x2={x + 9} y2={y - 9} />
              </g>
            )
          })}

          <text x={230} y={30} textAnchor="middle" className={styles.territory}>
            cabeza y cuello
          </text>
          <line x1={230} y1={36} x2={230} y2={68} className={styles.feeder} />
          <text x={145} y={60} textAnchor="end" className={styles.territory}>
            miembro sup.
          </text>
          <text x={315} y={60} className={styles.territory}>
            miembro sup.
          </text>
          <text x={350} y={250} className={styles.territory}>
            pared del tórax
          </text>
          <text x={122} y={432} textAnchor="middle" className={styles.territory}>
            intestino y bazo
          </text>
          <text x={262} y={334} className={styles.territory}>
            riñones
          </text>
          <text x={230} y={496} textAnchor="middle" className={styles.territory}>
            miembros inferiores y pelvis
          </text>
          <text x={340} y={170} className={styles.name}>
            ácigos
          </text>
          <text x={238} y={110} className={styles.name}>
            cava sup.
          </text>
          <text x={238} y={372} className={styles.name}>
            cava inf.
          </text>
          <text x={114} y={318} textAnchor="end" className={styles.name}>
            porta
          </text>
        </svg>

        <div className={styles.side} aria-live="polite">
          <p className={plate.kicker}>{lesion ? lesion.es : 'Sin obstrucción'}</p>
          <p className={styles.text}>
            {lesion
              ? lesion.text
              : 'Toda la sangre vuelve al atrio derecho por las dos cavas: la del intestino y el bazo, después de cruzar el hígado por la porta. Las anastomosis entre los tres sistemas existen, pero apenas llevan sangre. Elige una obstrucción.'}
          </p>
          {affected.map((o) => (
            <div key={o.territory.id} className={styles.outcome}>
              <p className={styles.territoryName}>{o.territory.es}</p>
              {o.collaterals.length ? (
                <ul>
                  {o.collaterals.map((c) => (
                    <li key={c.id} title={c.via}>
                      {c.es}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.lost}>Sin salida</p>
              )}
              {o.signs.map((s) => (
                <p key={s} className={styles.sign}>
                  {s}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={plate.legend}>
        <p className={plate.hint}>
          En rojo, la vena cerrada; en tono oscuro, las venas que se llenan sin vaciarse; resaltadas, las anastomosis que se abren (portocavas en
          verde, intercavas en azul). Las vías no se eligen a mano: se abre toda anastomosis con un extremo en las venas congestionadas y otro en venas
          que aún drenan; las portocavas sólo llevan sangre de la porta a las cavas, salvo la rectal, que también la recibe de las ilíacas. Según Latarjet y Ruiz Liard, t. 2, pp. 992, 997, 1006–1008, y Moore 8.ª, pp. 502–504, 513.
        </p>
      </div>
    </figure>
  )
}
