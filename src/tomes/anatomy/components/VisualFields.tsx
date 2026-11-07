import { useId, useMemo, useState } from 'react'
import { blindField, bundles, crosses, EYE, fieldKey, fieldOf, GENICULATE, lesions, type Bundle, type Lesion, type Point, type Side, type Vertical } from '../data/visual-fields'
import plate from './skeleton/plate.module.css'
import styles from './VisualFields.module.css'

/** Each eye gets a colour, so the eye can follow its fibres through the chiasm. */
const EYE_COLOUR: Record<Side, string> = { left: '#b8322a', right: '#3b5a92' }
const SIDE_NAME: Record<Side, string> = { left: 'izquierdo', right: 'derecho' }
const SIDES = ['left', 'right'] as const
const VERTICALS = ['upper', 'lower'] as const

/** Seen from above: the patient's left (negative x) is on the viewer's left. */
const X = (x: number) => 200 + x
/** A smooth curve through the points (Catmull-Rom): the bundles are drawn as fibres, not as polylines. */
function toPath(pts: Point[]) {
  const p = pts.map(([x, y]) => [X(x), y] as const)
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, e] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]]
    d += ` C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`
  }
  return d
}

const HALF_NAME = { nasal: 'nasal', temporal: 'temporal' }
const VERTICAL_NAME: Record<Vertical, string> = { upper: 'superior', lower: 'inferior' }

/** Lámina: the optic pathway on the base of the brain, and the field each lesion leaves (Testut pp. 1158–1177). */
export function VisualFields() {
  const [lesionId, setLesionId] = useState<string | null>('meyer')
  const [side, setSide] = useState<Side>('right')
  const [focus, setFocus] = useState<string | null>(null)
  const hatch = useId()

  const lesion = lesions.find((l) => l.id === lesionId) ?? null
  const blind = useMemo(() => blindField(lesion, side), [lesion, side])

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XIV · Los campos visuales</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Lesión">
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
        <svg viewBox="0 0 400 470" className={styles.schema} role="img" aria-label={`La vía óptica vista desde arriba${lesion ? `, con una lesión en ${lesion.name.toLowerCase()}` : ''}`}>
          <defs>
            <pattern id={hatch} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="#2a2420" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#f6efe0" strokeWidth="1.2" />
            </pattern>
          </defs>

          <Backdrop />

          {bundles.map((b) => (
            <BundleDrawing key={b.id} bundle={b} lesion={lesion} side={side} dim={focus !== null && focus !== b.id} />
          ))}

          {lesion && (
            <ellipse cx={X(side === 'right' ? lesion.cx : -lesion.cx)} cy={lesion.cy} rx={lesion.rx} ry={lesion.ry} fill={`url(#${hatch})`} className={styles.lesion} />
          )}
        </svg>

        <div className={styles.fields}>
          <p className={styles.fieldsTitle}>Campo visual de cada ojo</p>
          <div className={styles.fieldRow}>
            {SIDES.map((eye) => (
              <Field key={eye} eye={eye} blind={blind} onFocus={setFocus} />
            ))}
          </div>
          <p className={plate.hint}>Tal como lo ve el enfermo: la izquierda a la izquierda. Pasa el ratón por un cuadrante para ver sus fibras.</p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        {lesion ? (
          <>
            <p className={plate.kicker}>
              Lesión de {lesion.name.toLowerCase()}
              {lesion.cx !== 0 && `, lado ${SIDE_NAME[side]}`}
            </p>
            <p className={plate.title}>{lesion.defect}</p>
            <p className={styles.text}>{lesion.text}</p>
          </>
        ) : (
          <>
            <p className={plate.kicker}>Sin lesión</p>
            <p className={styles.text}>
              Cada retina da cuatro haces, uno por cuadrante. Los de la mitad nasal se cruzan en el quiasma; los de la temporal siguen en su lado. Así cada hemisferio recibe las dos mitades de retina que miran al lado opuesto del espacio.
            </p>
          </>
        )}
      </div>
    </figure>
  )
}

function Backdrop() {
  return (
    <g className={styles.backdrop}>
      {SIDES.map((s) => {
        const d = s === 'left' ? -1 : 1
        const x = (v: number) => X(d * v)
        return (
          <g key={s}>
            <path d={`M${x(4)} 92 C${x(70)} 84 ${x(150)} 110 ${x(166)} 200 C${x(178)} 300 ${x(150)} 420 ${x(70)} 462 C${x(40)} 470 ${x(10)} 466 ${x(4)} 458 Z`} className={styles.hemisphere} />
            {/* The temporal horn of the lateral ventricle, round which Meyer's loop turns. */}
            <path d={`M${x(118)} 300 C${x(128)} 270 ${x(126)} 236 ${x(116)} 222`} className={styles.horn} />
            {/* The calcarine fissure, between the cuneus (upper lip) and the lingual lobule (lower). */}
            <path d={`M${x(14)} 424 C${x(30)} 430 ${x(44)} 432 ${x(66)} 440`} className={styles.fissure} />
            <ellipse cx={x(GENICULATE.x)} cy={GENICULATE.y} rx="11" ry="7" className={styles.nucleus} />
            <circle cx={x(EYE.x)} cy={EYE.y} r={EYE.r} className={styles.eye} />
            <path d={`M${x(EYE.x - 12)} ${EYE.y - EYE.r + 4} Q${x(EYE.x)} ${EYE.y - EYE.r - 8} ${x(EYE.x + 12)} ${EYE.y - EYE.r + 4}`} className={styles.cornea} />
            <text x={x(EYE.x)} y={EYE.y + 4} className={styles.eyeName} textAnchor="middle">
              {s === 'left' ? 'O. izq.' : 'O. der.'}
            </text>
          </g>
        )
      })}
      <text x={X(0)} y="176" className={styles.label} textAnchor="middle">
        quiasma
      </text>
      <text x={X(-GENICULATE.x + 14)} y={GENICULATE.y + 4} className={styles.label} textAnchor="start">
        c. geniculado ext.
      </text>
      <text x={X(-150)} y="320" className={styles.label} textAnchor="middle">
        cuerno esfenoidal
      </text>
      <text x={X(-28)} y="412" className={styles.label} textAnchor="middle">
        cúneus
      </text>
      <text x={X(-56)} y="458" className={styles.label} textAnchor="middle">
        lingual
      </text>
      <text x={X(0)} y="466" className={styles.label} textAnchor="middle">
        polo occipital
      </text>
    </g>
  )
}

/** One bundle: its interrupted neuron dashed, the one after it silent. */
function BundleDrawing({ bundle, lesion, side, dim }: { bundle: Bundle; lesion: Lesion | null; side: Side; dim: boolean }) {
  const cut = bundle.neurons.findIndex((n) => lesion && crosses(n, lesion, side))
  return (
    <g style={{ color: EYE_COLOUR[bundle.eye] }} className={styles.bundle} data-dim={dim}>
      {bundle.neurons.map((n, i) => (
        <path
          key={i}
          d={toPath(n.points)}
          className={styles.fibre}
          data-state={cut >= 0 && i === cut ? 'cut' : cut >= 0 && i > cut ? 'silent' : 'live'}
          data-half={bundle.half}
        />
      ))}
    </g>
  )
}

/** One eye's visual field as the patient sees it, in four quarters; the blind ones dark. */
function Field({ eye, blind, onFocus }: { eye: Side; blind: Set<string>; onFocus: (id: string | null) => void }) {
  const r = 46
  const quarter = (s: Side, v: Vertical) => {
    const dx = s === 'left' ? -r : r
    const dy = v === 'upper' ? -r : r
    const sweep = (s === 'left') === (v === 'upper') ? 1 : 0
    return `M60 60 L${60 + dx} 60 A${r} ${r} 0 0 ${sweep} 60 ${60 + dy} Z`
  }
  const bundleOf = (s: Side, v: Vertical) => bundles.find((b) => b.eye === eye && fieldOf(b).side === s && fieldOf(b).vertical === v)!
  const temporal: Side = eye

  return (
    <figure className={styles.field}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`Campo visual del ojo ${SIDE_NAME[eye]}`}>
        {SIDES.map((s) =>
          VERTICALS.map((v) => {
            const b = bundleOf(s, v)
            return (
              <path
                key={s + v}
                d={quarter(s, v)}
                className={styles.quarter}
                data-blind={blind.has(fieldKey(eye, s, v))}
                onMouseEnter={() => onFocus(b.id)}
                onMouseLeave={() => onFocus(null)}
              >
                <title>{`Cuadrante ${VERTICAL_NAME[v]} ${s === temporal ? 'temporal' : 'nasal'}: retina ${HALF_NAME[b.half]} ${VERTICAL_NAME[b.vertical]}`}</title>
              </path>
            )
          }),
        )}
        <circle cx="60" cy="60" r={r} className={styles.rim} style={{ stroke: EYE_COLOUR[eye] }} />
        <line x1={60 - r} y1="60" x2={60 + r} y2="60" className={styles.cross} />
        <line x1="60" y1={60 - r} x2="60" y2={60 + r} className={styles.cross} />
        <text x={eye === 'left' ? 8 : 112} y="64" className={styles.halfName} textAnchor="middle">
          T
        </text>
        <text x={eye === 'left' ? 112 : 8} y="64" className={styles.halfName} textAnchor="middle">
          N
        </text>
      </svg>
      <figcaption style={{ color: EYE_COLOUR[eye] }}>Ojo {SIDE_NAME[eye]}</figcaption>
    </figure>
  )
}
