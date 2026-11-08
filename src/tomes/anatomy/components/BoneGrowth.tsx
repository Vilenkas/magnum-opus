import { useState } from 'react'
import { BONES, canal, EVENTS, grown, hasCentre, isFused, length, nails, reach, stageAt, STAGES, type Bone, type BoneId, type End } from '../data/bone-growth'
import plate from './skeleton/plate.module.css'
import styles from './BoneGrowth.module.css'

/** Pixels per unit of length; the foramen stays still at Y0 while the ends move away from it. */
const S = 24
const CX = 150
const SHAFT = 17
const EPI = 27
/** Length of an epiphysis, and thickness of a growth cartilage, in units. */
const E = 1.5
const PLATE = 0.28
const NAILS_FROM = 0.3

const END_NAME: Record<End, string> = { proximal: 'proximal', distal: 'distal' }

/** Lámina: the building of a long bone (Testut fig. 21), with its nutrient canal and Hunter's nails. */
export function BoneGrowth() {
  const [boneId, setBoneId] = useState<BoneId>('femur')
  const [t, setT] = useState(0.62)
  const [showNails, setShowNails] = useState(false)
  const bone = BONES.find((b) => b.id === boneId)!
  const stage = stageAt(t)
  const Y0 = 34 + reach(bone, 'proximal', 1) * S
  const height = Y0 + reach(bone, 'distal', 1) * S + 34
  const y = (u: number) => Y0 + u * S

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · La edificación de un hueso largo</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Hueso">
        {BONES.map((b) => (
          <button key={b.id} className={plate.chip} data-active={b.id === boneId} onClick={() => setBoneId(b.id)}>
            {b.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={showNails} aria-pressed={showNails} onClick={() => setShowNails((n) => !n)}>
          Clavos de Hunter
        </button>
      </div>

      <div className={styles.timeline}>
        <input type="range" min={0} max={1} step={0.005} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Tiempo, del esbozo cartilaginoso al adulto" />
        <div className={styles.stages}>
          {STAGES.map((s) => (
            <button key={s.letter} className={styles.stage} data-active={s === stage} style={{ left: `${s.t * 100}%` }} onClick={() => setT(s.t + 0.001)}>
              {s.letter}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <svg viewBox={`-60 0 400 ${height}`} className={styles.schema} role="img" aria-label={`${bone.name} en el estadio ${stage.letter}`}>
          <BoneDrawing bone={bone} t={t} y={y} />
          {showNails && t >= NAILS_FROM && <Nails bone={bone} t={t} y={y} />}
          <text x={CX} y={y(-reach(bone, 'proximal', t)) - 12} textAnchor="middle" className={styles.endLabel}>
            extremo {END_NAME.proximal}
            {bone.fertile === 'proximal' ? ' · fértil' : ''}
          </text>
          <text x={CX} y={y(reach(bone, 'distal', t)) + 22} textAnchor="middle" className={styles.endLabel}>
            extremo {END_NAME.distal}
            {bone.fertile === 'distal' ? ' · fértil' : ''}
          </text>
        </svg>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {bone.name} · {stage.letter === 'Adulto' ? 'adulto' : `estadio ${stage.letter}`} · longitud {length(bone, t).toFixed(1).replace('.', ',')} (de {length(bone, 0).toFixed(0)} al principio)
        </p>
        <p className={styles.text}>{stage.text}</p>
        {t >= EVENTS.growth && (
          <p className={styles.text}>
            El extremo {END_NAME[bone.fertile]} es el fértil: su cartílago de conjunción trabaja el doble que el otro. Por eso el conducto nutricio, fijo en la diáfisis, se inclina hacia el extremo {END_NAME[canal(bone, t).towards]} ({bone.limb === 'upper' ? 'hacia el codo' : 'lejos de la rodilla'}), y es éste el que se suelda primero (Bérard).
          </p>
        )}
        {showNails && (
          <p className={styles.text}>
            {t < NAILS_FROM
              ? 'Los clavos se clavan en el hueso joven, al empezar el estadio E: avanza el tiempo para verlos.'
              : 'Los dos clavos de la diáfisis guardan la misma distancia; los de las epífisis se alejan de ellos, más el del extremo fértil: el hueso crece por sus cartílagos de conjunción, no por la diáfisis.'}
          </p>
        )}
      </div>
    </figure>
  )
}

function BoneDrawing({ bone, t, y }: { bone: Bone; t: number; y: (u: number) => number }) {
  const top = -reach(bone, 'proximal', t)
  const bottom = reach(bone, 'distal', t)
  // Where the shaft meets each epiphysis (the growth cartilage), in units from the foramen.
  const plateAt = (end: End) => (end === 'proximal' ? top + E : bottom - E)
  // The bony shaft spreads from the primary centre to the growth cartilages, then follows them.
  const reachShaft = (end: End) => {
    if (t < EVENTS.primary) return 0
    const full = Math.abs(plateAt(end)) - PLATE / 2
    return Math.min(1, (t - EVENTS.primary) / (EVENTS.growth - EVENTS.primary)) * full
  }
  const collar = (end: End) => (t < EVENTS.collar ? 0 : Math.min(Math.abs(plateAt(end)), ((t - EVENTS.collar) / (EVENTS.growth - EVENTS.collar)) * Math.abs(plateAt(end))))
  const cavity = (end: End) => (t < EVENTS.cavity ? 0 : Math.min(0.85, (t - EVENTS.cavity) / 0.25) * (Math.abs(plateAt(end)) - 0.6))
  const outline = `M${CX - EPI} ${y(top + 0.25)} Q${CX - EPI} ${y(top)} ${CX} ${y(top)} Q${CX + EPI} ${y(top)} ${CX + EPI} ${y(top + 0.25)} L${CX + EPI} ${y(top + E)} Q${CX + SHAFT} ${y(top + E + 0.6)} ${CX + SHAFT} ${y(top + E + 1.2)} L${CX + SHAFT} ${y(bottom - E - 1.2)} Q${CX + SHAFT} ${y(bottom - E - 0.6)} ${CX + EPI} ${y(bottom - E)} L${CX + EPI} ${y(bottom - 0.25)} Q${CX + EPI} ${y(bottom)} ${CX} ${y(bottom)} Q${CX - EPI} ${y(bottom)} ${CX - EPI} ${y(bottom - 0.25)} L${CX - EPI} ${y(bottom - E)} Q${CX - SHAFT} ${y(bottom - E - 0.6)} ${CX - SHAFT} ${y(bottom - E - 1.2)} L${CX - SHAFT} ${y(top + E + 1.2)} Q${CX - SHAFT} ${y(top + E + 0.6)} ${CX - EPI} ${y(top + E)} Z`
  const clip = `bone-${bone.id}`
  const { towards, slant } = canal(bone, t)
  const dir = towards === 'proximal' ? -1 : 1
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
      </defs>
      {/* Everything not yet bone is cartilage. */}
      <path d={outline} className={styles.cartilage} />
      <g clipPath={`url(#${clip})`}>
        {/* Endochondral bone of the shaft. */}
        {t >= EVENTS.primary && <rect x={CX - SHAFT - 20} y={y(-reachShaft('proximal'))} width={2 * SHAFT + 40} height={(reachShaft('proximal') + reachShaft('distal')) * 24} className={styles.bone} />}
        {/* The epiphyseal centres, growing until they fill the epiphysis. */}
        {(['proximal', 'distal'] as End[]).map((end) => {
          if (!hasCentre(bone, end, t)) return null
          const k = Math.min(1, (t - (end === bone.fertile ? EVENTS.fertileCentre : EVENTS.otherCentre)) / 0.22)
          const cy = end === 'proximal' ? (top + plateAt(end)) / 2 : (bottom + plateAt(end)) / 2
          return <ellipse key={end} cx={CX} cy={y(cy)} rx={4 + k * (EPI - 6)} ry={(2 + k * (E * 24 / 2 - 4)) } className={styles.bone} />
        })}
        {/* After fusion, the growth cartilage is bone too, leaving an epiphyseal line. */}
        {(['proximal', 'distal'] as End[]).map((end) =>
          isFused(bone, end, t) ? <rect key={end} x={CX - EPI} y={y(end === 'proximal' ? top + 0.2 : plateAt(end) - 0.4)} width={2 * EPI} height={(E - 0.1) * 24 + 10} className={styles.bone} /> : null,
        )}
        {/* The medullary cavity. */}
        {t >= EVENTS.cavity && <rect x={CX - SHAFT + 6} y={y(-cavity('proximal'))} width={2 * SHAFT - 12} height={(cavity('proximal') + cavity('distal')) * 24} rx={8} className={styles.marrow} />}
        {/* The periosteal collar, outermost. */}
        {t >= EVENTS.collar && (
          <>
            <rect x={CX - SHAFT} y={y(-collar('proximal'))} width={5} height={(collar('proximal') + collar('distal')) * 24} className={styles.collar} />
            <rect x={CX + SHAFT - 5} y={y(-collar('proximal'))} width={5} height={(collar('proximal') + collar('distal')) * 24} className={styles.collar} />
          </>
        )}
      </g>
      {/* Growth cartilages while they last; then the epiphyseal line. */}
      {t >= EVENTS.growth &&
        (['proximal', 'distal'] as End[]).map((end) =>
          isFused(bone, end, t) ? (
            <line key={end} x1={CX - EPI + 2} x2={CX + EPI - 2} y1={y(plateAt(end))} y2={y(plateAt(end))} className={styles.epiphysealLine} />
          ) : hasCentre(bone, end, t) ? (
            <rect key={end} x={CX - EPI + 1} y={y(plateAt(end) - PLATE / 2)} width={2 * EPI - 2} height={PLATE * 24} className={styles.growthPlate} />
          ) : null,
        )}
      {/* Articular cartilage caps. */}
      <path d={`M${CX - EPI + 2} ${y(top + 0.3)} Q${CX} ${y(top - 0.05)} ${CX + EPI - 2} ${y(top + 0.3)}`} className={styles.articular} />
      <path d={`M${CX - EPI + 2} ${y(bottom - 0.3)} Q${CX} ${y(bottom + 0.05)} ${CX + EPI - 2} ${y(bottom - 0.3)}`} className={styles.articular} />
      <path d={outline} className={styles.outline} />
      {/* The nutrient artery and its canal, leaning towards the end that grows less. */}
      {t >= EVENTS.primary && (
        <g>
          <path d={`M${CX + SHAFT + 46} ${y(-dir * 0.4 * slant)} L${CX + SHAFT} ${y(0)} L${CX + 4} ${y(dir * (0.2 + 1.6 * slant))}`} className={styles.artery} />
          <circle cx={CX + SHAFT} cy={y(0)} r={2.5} className={styles.foramen} />
          <text x={CX + SHAFT + 50} y={y(-dir * 0.4 * slant) + 4} className={styles.label}>
            a. nutricia
          </text>
        </g>
      )}
      {t >= EVENTS.growth && (
        <text x={CX + EPI + 6} y={y(plateAt(bone.fertile)) + 4} className={styles.label}>
          {isFused(bone, bone.fertile, t) ? 'línea epifisaria' : `cartílago de conjunción (+${grown(bone, bone.fertile, t).toFixed(1).replace('.', ',')})`}
        </text>
      )}
    </g>
  )
}

function Nails({ bone, t, y }: { bone: Bone; t: number; y: (u: number) => number }) {
  const n = nails(bone, NAILS_FROM, t)
  const start = nails(bone, NAILS_FROM, NAILS_FROM)
  const marks: [keyof typeof n, number][] = Object.entries(n) as [keyof typeof n, number][]
  const x = CX - EPI - 34
  const fmt = (v: number) => v.toFixed(1).replace('.', ',')
  return (
    <g>
      {marks.map(([k, u]) => (
        <g key={k}>
          <line x1={CX + 10} x2={x + 4} y1={y(u)} y2={y(u)} className={styles.nail} />
          <circle cx={x + 4} cy={y(u)} r={3} className={styles.nailHead} />
        </g>
      ))}
      <Gap x={x - 6} a={y(n.proximalEpiphysis)} b={y(n.upperShaft)} text={`${fmt(n.upperShaft - n.proximalEpiphysis)} (era ${fmt(start.upperShaft - start.proximalEpiphysis)})`} />
      <Gap x={x - 6} a={y(n.upperShaft)} b={y(n.lowerShaft)} text={`${fmt(n.lowerShaft - n.upperShaft)}: igual`} />
      <Gap x={x - 6} a={y(n.lowerShaft)} b={y(n.distalEpiphysis)} text={`${fmt(n.distalEpiphysis - n.lowerShaft)} (era ${fmt(start.distalEpiphysis - start.lowerShaft)})`} />
    </g>
  )
}

function Gap({ x, a, b, text }: { x: number; a: number; b: number; text: string }) {
  return (
    <g>
      <path d={`M${x} ${a + 2} L${x - 5} ${a + 2} L${x - 5} ${b - 2} L${x} ${b - 2}`} className={styles.gap} />
      <text x={x - 9} y={(a + b) / 2 + 4} textAnchor="end" className={styles.gapLabel}>
        {text}
      </text>
    </g>
  )
}
