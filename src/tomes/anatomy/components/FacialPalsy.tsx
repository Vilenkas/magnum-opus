import { useState } from 'react'
import { BRANCHES, LESIONS, SIGNS, STATIONS, cutBranches, deficits, lesion, type LesionId, type Sign } from '../data/facial-palsy'
import plate from './skeleton/plate.module.css'
import styles from './FacialPalsy.module.css'

type Action = 'rest' | 'forehead' | 'eyes' | 'teeth'
const ACTIONS: { id: Action; name: string }[] = [
  { id: 'rest', name: 'En reposo' },
  { id: 'forehead', name: 'Arrugar la frente' },
  { id: 'eyes', name: 'Cerrar los ojos' },
  { id: 'teeth', name: 'Enseñar los dientes' },
]

/**
 * One half of the face, drawn for the side `s` (−1: the person's right, on the viewer's left; +1: their left).
 * `lost` are the signs missing on that half.
 */
function Half({ s, lost, action }: { s: -1 | 1; lost: Set<Sign>; action: Action }) {
  const X = (x: number) => 120 + s * x
  const frontal = !lost.has('forehead')
  const orbicular = !lost.has('eye')
  const lifts = !lost.has('upperLip')
  const lowers = !lost.has('lowerLip')
  const neck = !lost.has('neck')

  // Brow: raised when the frontal works and is asked to; fallen when it is paralysed.
  const browY = action === 'forehead' && frontal ? 78 : frontal ? 86 : 90
  // Eye: closed if asked and the orbicular works; otherwise open, wider if paralysed; the globe rolls up (Bell).
  const closing = action === 'eyes'
  const closed = closing && orbicular
  const lowerLid = orbicular ? 109 : 112
  const irisY = closing && !orbicular ? 98 : 104
  // Mouth corner: pulled up and out in a smile by the elevators, drooping without them.
  const smile = action === 'teeth'
  const cornerX = smile && lifts ? 46 : 38
  const cornerY = smile && lifts ? 178 : lifts ? 184 : 189
  // The lower lip: its middle is shared by both halves; its side drops only if its depressors work.
  const midLow = smile ? 192 : 188
  const lowerCtrl = smile && lowers ? 198 : smile ? 190 : 189
  const upperCtrl = smile && lifts ? 176 : 181

  return (
    <g>
      {/* Forehead wrinkles. */}
      {action === 'forehead' && frontal && [56, 63, 70].map((y) => <path key={y} d={`M${X(12)} ${y} Q${X(30)} ${y - 4} ${X(50)} ${y}`} className={styles.wrinkle} />)}
      <path d={`M${X(18)} ${browY + 2} Q${X(34)} ${browY - 6} ${X(54)} ${browY + 2}`} className={styles.brow} />
      {/* Eye. */}
      {closed ? (
        <path d={`M${X(20)} 104 Q${X(36)} 110 ${X(52)} 104`} className={styles.lidLine} />
      ) : (
        <g>
          <path d={`M${X(20)} 104 Q${X(36)} 94 ${X(52)} 104 Q${X(36)} ${lowerLid + 2} ${X(20)} 104 Z`} className={styles.eyeWhite} />
          <circle cx={X(36)} cy={irisY} r={5.5} className={styles.iris} />
          <path d={`M${X(20)} 104 Q${X(36)} 94 ${X(52)} 104`} className={styles.lidLine} />
        </g>
      )}
      {/* Nasolabial fold: there only if the elevators keep their tone. */}
      {lifts && <path d={`M${X(16)} 150 Q${X(30)} 166 ${X(cornerX - 2)} ${cornerY - 4}`} className={styles.fold} />}
      {/* Lips, from the midline to the corner. */}
      {smile && <path d={`M${X(0)} 180 Q${X(cornerX / 2)} ${upperCtrl} ${X(cornerX)} ${cornerY} Q${X(cornerX / 2)} ${lowerCtrl} ${X(0)} ${midLow} Z`} className={styles.teeth} />}
      <path d={`M${X(0)} 180 Q${X(cornerX / 2)} ${upperCtrl} ${X(cornerX)} ${cornerY}`} className={styles.lip} />
      <path d={`M${X(0)} ${midLow} Q${X(cornerX / 2)} ${lowerCtrl} ${X(cornerX)} ${cornerY}`} className={styles.lip} />
      {/* The platysma's cords in the neck. */}
      {smile && neck && [44, 56].map((x) => <path key={x} d={`M${X(x - 6)} 236 Q${X(x)} 252 ${X(x + 6)} 274`} className={styles.cord} />)}
    </g>
  )
}

const sx = (s: number) => 34 + (s - 1) * 49

/** Lámina: the facial palsies, from the cortex to the parotid. */
export function FacialPalsy() {
  const [id, setId] = useState<LesionId>('stylomastoid')
  const [action, setAction] = useState<Action>('teeth')
  const l = lesion(id)
  const lost = deficits(l)
  const cut = new Set(cutBranches(l).map((b) => b.id))
  const none = new Set<Sign>()

  const lesionX = l.kind === 'central' ? sx(1) : l.kind === 'branch' ? sx(STATIONS.parotid) + 30 : sx(l.at)
  const lesionY = l.kind === 'central' ? 62 : l.id === 'temporofacial' ? 84 : l.id === 'cervicofacial' ? 128 : 106

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XXI · Las parálisis del facial</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Lugar de la lesión">
        {LESIONS.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === id} onClick={() => setId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.facePane}>
          <svg viewBox="0 0 240 280" className={styles.face} role="img" aria-label="La cara del enfermo, con la parálisis en su mitad derecha">
            <path d="M120 22 C 62 22 36 70 38 128 C 40 182 70 226 120 230 C 170 226 200 182 202 128 C 204 70 178 22 120 22 Z" className={styles.head} />
            <path d="M84 226 L80 280 M156 226 L160 280" className={styles.neckLine} />
            <path d="M120 112 L112 150 Q120 156 128 150" className={styles.nose} />
            <Half s={-1} lost={lost} action={action} />
            <Half s={1} lost={none} action={action} />
            <text x={60} y={16} textAnchor="middle" className={styles.side}>
              lado derecho
            </text>
            <text x={180} y={16} textAnchor="middle" className={styles.side}>
              lado izquierdo
            </text>
          </svg>
          <div className={plate.chipBar} role="group" aria-label="Lo que se le pide">
            {ACTIONS.map((a) => (
              <button key={a.id} className={plate.chip} data-active={a.id === action} onClick={() => setAction(a.id)}>
                {a.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.nervePane}>
          <svg viewBox="0 0 500 200" className={styles.nerve} role="img" aria-label="El trayecto del facial, del núcleo a la parótida, con sus ramos">
            {/* Cortex and its command. */}
            <rect x={sx(1) - 26} y={10} width={52} height={18} rx={3} className={styles.box} />
            <text x={sx(1)} y={23} textAnchor="middle" className={styles.boxText}>
              corteza
            </text>
            <line x1={sx(1)} y1={28} x2={sx(1)} y2={96} className={styles.central} data-cut={l.kind === 'central'} />
            {/* The VI nucleus in the genu. */}
            <circle cx={sx(1)} cy={106} r={7} className={styles.neighbour} data-cut={lost.has('gaze')} />
            <path d={`M${sx(1) - 12} 106 A12 12 0 1 1 ${sx(1) + 12} 106`} className={styles.trunk} data-cut={l.kind === 'trunk'} />
            <text x={sx(1)} y={130} textAnchor="middle" className={styles.small}>
              núcleo del VI
            </text>
            {/* The auditory nerve alongside, as far as the meatus. */}
            <line x1={sx(2)} y1={118} x2={sx(3) + 20} y2={118} className={styles.auditory} data-cut={lost.has('hearing')} />
            <text x={sx(2) + 4} y={131} className={styles.small}>
              auditivo
            </text>
            {/* The intermediary of Wrisberg, joining at the emergence, up to the chorda. */}
            <path d={`M${sx(2) - 18} 78 Q${sx(2)} 98 ${sx(2) + 10} 100 L${sx(STATIONS.chorda)} 100`} className={styles.intermediary} />
            <text x={sx(2) - 16} y={76} className={styles.small}>
              intermediario
            </text>
            {/* The trunk. */}
            <line x1={sx(1) + 12} y1={106} x2={sx(STATIONS.parotid)} y2={106} className={styles.trunk} data-cut={l.kind === 'trunk'} />
            {[
              [STATIONS.emergence, 'emergencia', true],
              [STATIONS.meatus, 'conducto auditivo int.', true],
              [STATIONS.geniculate, 'g. geniculado', true],
              [STATIONS.tympanic, 'p. timpánica', true],
              [(STATIONS.stapedius + STATIONS.chorda) / 2, 'p. mastoidea', false],
              [STATIONS.stylomastoid, 'ag. estilomastoideo', true],
            ].map(([at, name, tick], i) => (
              <g key={String(name)}>
                {tick ? <line x1={sx(at as number)} y1={101} x2={sx(at as number)} y2={111} className={styles.tick} /> : null}
                <text x={sx(at as number)} y={i % 2 ? 62 : 48} textAnchor="middle" className={styles.station}>
                  {name}
                </text>
              </g>
            ))}
            <circle cx={sx(STATIONS.geniculate)} cy={103} r={5} className={styles.ganglion} />
            {/* Branches. */}
            {BRANCHES.map((b) => {
              const x = sx(b.at)
              const isCut = cut.has(b.id)
              if (b.id === 'temporofacial')
                return (
                  <g key={b.id}>
                    <path d={`M${x} 106 L${x + 30} 84 L${x + 40} 84`} className={styles.branch} data-cut={isCut} />
                    <text x={x + 2} y={76} className={styles.small}>
                      temporofacial
                    </text>
                  </g>
                )
              if (b.id === 'cervicofacial')
                return (
                  <g key={b.id}>
                    <path d={`M${x} 106 L${x + 30} 128 L${x + 40} 128`} className={styles.branch} data-cut={isCut} />
                    <text x={x + 2} y={144} className={styles.small}>
                      cervicofacial
                    </text>
                  </g>
                )
              const label = b.id === 'petrosal' ? 'petroso mayor · lágrimas' : b.id === 'stapedius' ? 'estribo' : 'cuerda · gusto, saliva'
              const from = b.fibres === 'intermediary' ? 100 : 106
              return (
                <g key={b.id}>
                  <line x1={x} y1={from} x2={x} y2={b.id === 'stapedius' ? 150 : 172} className={b.fibres === 'intermediary' ? styles.branchIntermediary : styles.branch} data-cut={isCut} />
                  <text x={x} y={b.id === 'stapedius' ? 162 : 184} textAnchor="middle" className={styles.small}>
                    {label}
                  </text>
                </g>
              )
            })}
            {/* The lesion. */}
            <g transform={`translate(${lesionX} ${lesionY})`} className={styles.lesion}>
              <circle r={9} />
              <path d="M-5 -5 L5 5 M5 -5 L-5 5" />
            </g>
          </svg>

          <ul className={styles.signs}>
            {SIGNS.map((s) => (
              <li key={s.id} data-lost={lost.has(s.id)}>
                <span className={styles.mark} aria-hidden>
                  {lost.has(s.id) ? '✕' : '·'}
                </span>
                {lost.has(s.id) ? s.lost : s.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{l.kind === 'central' ? 'Parálisis central' : l.kind === 'branch' ? 'Lesión de una rama terminal' : 'Parálisis periférica'}</p>
        <p className={plate.title}>{l.name}</p>
        <p className={styles.text}>{l.cause}</p>
        <p className={plate.hint}>
          {l.kind === 'central'
            ? 'La parálisis es del lado opuesto a la lesión y respeta la frente y el ojo: cada hemisferio manda la parte superior de la cara de los dos lados.'
            : 'Una lesión del tronco se lleva los ramos que salen en ella o más allá, pero sólo las fibras que ya lleva: el intermediario se le une al salir del bulbo. Nada de la lista se escribe a mano.'}
        </p>
      </div>
    </figure>
  )
}
