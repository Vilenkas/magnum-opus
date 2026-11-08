import { useState, type ReactNode } from 'react'
import {
  alongRolando,
  BREGMA,
  cerebellum,
  CHIPAULT_LINE,
  FRONTOLAMBDOID,
  heightAt,
  hemisphere,
  LAMBDA,
  LANDMARKS,
  MFB_POINTS,
  OPTOSTRIATE,
  pointAtArc,
  ROLANDIC_CENTRES,
  ROLANDO,
  ROLANDO_CHAMPIONNIERE,
  ROLANDO_POIRIER,
  smooth,
  SUTURES,
  SYLVIAN,
  TEMPORAL_POLE,
  vault,
  vaultLength,
  VENTRICLE_RECT,
  type Point,
} from '../data/cranial-topography'
import plate from './skeleton/plate.module.css'
import styles from './CranialTopography.module.css'

/** Centimetres → SVG units; the head faces left, y grows upwards. */
const S = 22
const X = (x: number) => (x + 1.6) * S
const Y = (y: number) => (14.6 - y) * S
const at = ([x, y]: Point) => `${X(x)} ${Y(y)}`
const line = (pts: Point[], close = false) => `M${pts.map(at).join(' L')}${close ? ' Z' : ''}`

/** Testut's fig. 990 draws Lucas-Championnière's lines in red and Poirier's in blue. */
const RED = '#b8322a'
const BLUE = '#3b5a92'
const OCHRE = '#9a6b1f'
const PLUM = '#6d4a8a'
const GREEN = '#4c7a3d'
const CENTRE_COLOUR: Record<(typeof ROLANDIC_CENTRES)[number]['id'], string> = { leg: '#3b5a92', arm: '#4c7a3d', face: '#b07a1c' }

const STEPS = [
  { id: 'lobes', name: 'Cerebro y cerebelo' },
  { id: 'rolando', name: 'Rolando' },
  { id: 'sylvius', name: 'Silvio' },
  { id: 'centres', name: 'Centros rolándicos' },
  { id: 'deep', name: 'Núcleos y ventrículo' },
  { id: 'mfb', name: 'Marie, Foix y Bertrand' },
] as const
type StepId = (typeof STEPS)[number]['id']

const cm = (v: number) => `${v.toFixed(1).replace('.', ',')} cm`

/** Lámina: how the brain is marked on the skull (Testut pp. 1190–1195, figs. 989–991). */
export function CranialTopography() {
  const [step, setStep] = useState<StepId>('rolando')
  const [brain, setBrain] = useState(true)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XVI · La topografía craneoencefálica</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Procedimiento">
        {STEPS.map((s) => (
          <button key={s.id} className={plate.chip} data-active={s.id === step} onClick={() => setStep(s.id)}>
            {s.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={brain} aria-pressed={brain} onClick={() => setBrain((b) => !b)}>
          Ver el encéfalo
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 ${X(18.7)} ${Y(-8.4)}`} className={styles.schema} role="img" aria-label={`Perfil del cráneo con el procedimiento: ${STEPS.find((s) => s.id === step)!.name}`}>
          <Skull />
          {brain && <Brain />}
          <Landmarks step={step} />
          {step === 'lobes' && <Lobes />}
          {step === 'rolando' && <Rolando />}
          {step === 'sylvius' && <Sylvius />}
          {step === 'centres' && <Centres />}
          {step === 'deep' && <Deep />}
          {step === 'mfb' && <MarieFoixBertrand />}
        </svg>
      </div>

      <div className={plate.legend} aria-live="polite">
        <Legend step={step} />
      </div>
    </figure>
  )
}

function Legend({ step }: { step: StepId }) {
  const gap = Math.abs(ROLANDO_CHAMPIONNIERE.upperArc - ROLANDO_POIRIER.upperArc)
  const texts: Record<StepId, { kicker: string; title: string; text: ReactNode }> = {
    lobes: {
      kicker: 'Testut · Chipault',
      title: 'El borde inferior del hemisferio',
      text: (
        <>
          El lóbulo frontal corre de 6 a 15 mm por encima del reborde orbitario. El temporal empieza 15 mm detrás de la apófisis orbitaria externa y 2 cm por encima del cigoma, roza el arco a la altura de la articulación temporomaxilar y sube hasta el asterion; el occipital sigue la línea curva superior. <span style={{ color: OCHRE }}>Por debajo de la línea de Chipault</span>, que va del tubérculo retroorbitario a un centímetro por encima del inion, está el cerebelo.
        </>
      ),
    },
    rolando: {
      kicker: 'Poirier · Lucas-Championnière',
      title: 'La cisura de Rolando',
      text: (
        <>
          <span style={{ color: BLUE }}>Poirier</span>: el extremo superior, a la mitad de la línea nasion–inion más 2 cm (aquí, {cm(ROLANDO_POIRIER.upperArc)} de {cm(vaultLength)}); el inferior, en la vertical de la depresión preauricular, 7 cm sobre el arco cigomático. <span style={{ color: RED }}>Lucas-Championnière</span>: el extremo superior, 5 cm detrás del punto en que el plano de los dos conductos auditivos cruza la línea media. En este cráneo medio los dos procedimientos difieren {cm(gap)}: ninguno pretende más que acercarse a la cisura.
        </>
      ),
    },
    sylvius: {
      kicker: 'Lucas-Championnière',
      title: 'La cisura de Silvio',
      text: <>La línea silviana empieza 3 cm por detrás de la apófisis orbitaria externa y corre paralela al arco cigomático, 5 cm por encima de él, hasta debajo de la eminencia parietal. El extremo inferior de Rolando queda poco por encima de ella.</>,
    },
    centres: {
      kicker: 'Sobre la línea rolándica',
      title: 'Los centros motores',
      text: (
        <>
          Trazada la cisura, los centros corticales se descubren sobre ella: los del <span style={{ color: CENTRE_COLOUR.leg }}>miembro inferior</span> en su tercio superior, los del <span style={{ color: CENTRE_COLOUR.arm }}>miembro superior</span> en el medio, por delante de la cisura, los de la <span style={{ color: CENTRE_COLOUR.face }}>cara</span> en el inferior. El centro del lenguaje articulado de Broca está por delante de estos últimos.
        </>
      ),
    },
    deep: {
      kicker: 'Poirier · Testut y Jacob',
      title: 'Núcleos optoestriados y ventrículo lateral',
      text: (
        <>
          <span style={{ color: BLUE }}>Los núcleos</span>: por delante, la vertical 18 mm detrás de la apófisis orbitaria externa; por detrás, la del extremo superior de Rolando; por arriba, una horizontal 45 mm bajo la convexidad del cráneo. <span style={{ color: PLUM }}>El ventrículo</span> se inscribe en un rectángulo: entre 2 y 5 cm sobre el arco cigomático, desde la perpendicular a la unión de su tercio anterior con los dos posteriores hasta una vertical 5 cm detrás de la punta de la mastoides.
        </>
      ),
    },
    mfb: {
      kicker: 'Marie, Foix y Bertrand',
      title: 'La línea frontolambdoidea',
      text: (
        <>
          Con hilos metálicos sobre circunvoluciones y suturas, y radiografías de muchos cerebros, se hizo un esquema medio. Su referencia es la <span style={{ color: GREEN }}>línea de la apófisis orbitaria externa al lambda</span>. El centro de Broca queda 3 o 4 cm detrás de la apófisis, algo por encima de la línea y a más de 2 cm por delante de Rolando. El pliegue curvo queda 8 mm por encima de la línea, unos 3 cm detrás del final de Silvio y casi a la misma distancia por delante del lambda.
        </>
      ),
    },
  }
  const t = texts[step]
  return (
    <>
      <p className={plate.kicker}>{t.kicker}</p>
      <p className={plate.title}>{t.title}</p>
      <p className={styles.text}>{t.text}</p>
    </>
  )
}

/** The skull in profile: vault, base, face and mandible. Only the vault is measured; the rest frames it. */
function Skull() {
  // One silhouette for cranium and upper face (vault, occiput, base behind the jaw, teeth, nasal notch), then
  // the mandible, the zygomatic bone and arch, the orbit and the ear canal laid over it.
  const outline: Point[] = [
    ...vault,
    [17.6, 0.4],
    [16.9, -1.4],
    [15.2, -2.6],
    [12.6, -3.1],
    LANDMARKS.mastoidTip,
    [8.6, -2.0],
    [7.0, -1.7],
    [5.0, -2.3],
    [4.4, -2.9],
    [2.0, -3.4],
    [0.0, -3.7],
    [-0.25, -2.7],
    [-0.65, -1.7],
    [0.0, -1.35],
    [0.25, -0.4],
    [-0.15, 0.55],
    [-0.95, 0.95],
    [-0.35, 2.2],
  ]
  const mandible: Point[] = [[7.6, -0.9], [7.4, -1.7], [7.7, -3.6], [7.5, -5.8], [6.8, -6.6], [4.8, -7.0], [2.4, -7.3], [0.5, -7.6], [-0.15, -6.9], [0.1, -5.4], [-0.05, -4.1], [1.6, -3.9], [4.2, -3.5], [5.3, -1.6], [6.0, -2.3], [6.9, -2.1], [7.6, -0.9]]
  const zygoma: Point[] = [[1.3, 1.7], [1.9, 0.6], [LANDMARKS.archFront, 0], [5, 0.05], [LANDMARKS.archBack, 0], [7.5, -0.4], [7.1, -0.85], [4.6, -0.8], [2.9, -1.4], [1.2, -1.6], [0.7, -0.5]]
  return (
    <g className={styles.skull}>
      <path d={`${line([...vault.slice(0, -1), ...smooth(outline.slice(vault.length - 1), 8)])} Z`} className={styles.bone} />
      <path d={line(smooth(mandible, 8), true)} className={styles.bone} />
      <path d={line(smooth(zygoma, 8), true)} className={styles.zygoma} />
      <ellipse cx={X(0.55)} cy={Y(1.3)} rx={0.95 * S} ry={1.35 * S} className={styles.orbit} />
      <circle cx={X(LANDMARKS.meatus[0])} cy={Y(LANDMARKS.meatus[1])} r={0.42 * S} className={styles.orbit} />
      {Object.values(SUTURES).map((s, i) => (
        <path key={i} d={line(s)} className={styles.suture} />
      ))}
    </g>
  )
}

function Brain() {
  return (
    <g className={styles.brain}>
      <path d={line(hemisphere, true)} className={styles.hemisphere} />
      <path d={line(cerebellum, true)} className={styles.cerebellum} />
    </g>
  )
}

function Dot({ p, label, dx = 6, dy = -5, anchor = 'start', colour }: { p: Point; label?: string; dx?: number; dy?: number; anchor?: 'start' | 'end' | 'middle'; colour?: string }) {
  return (
    <g>
      <circle cx={X(p[0])} cy={Y(p[1])} r={2.6} className={styles.dot} style={colour ? { fill: colour } : undefined} />
      {label && (
        <text x={X(p[0]) + dx} y={Y(p[1]) + dy} className={styles.label} textAnchor={anchor} style={colour ? { fill: colour } : undefined}>
          {label}
        </text>
      )}
    </g>
  )
}

/** The bony landmarks each step measures from; the rest are only named when they matter. */
function Landmarks({ step }: { step: StepId }) {
  const show = {
    nasion: step === 'rolando',
    inion: step === 'rolando' || step === 'lobes',
    bregma: step === 'rolando' || step === 'lobes',
    lambda: step === 'mfb' || step === 'lobes',
    asterion: step === 'lobes',
    orbital: step !== 'rolando' && step !== 'centres',
  }
  return (
    <g>
      {show.nasion && <Dot p={LANDMARKS.nasion} label="nasion" dx={-6} anchor="end" />}
      {show.inion && <Dot p={LANDMARKS.inion} label="inion" dx={7} dy={4} />}
      {show.bregma && <Dot p={BREGMA} label="bregma" dy={-7} anchor="middle" dx={0} />}
      {show.lambda && <Dot p={LAMBDA} label="lambda" dx={7} />}
      {show.asterion && <Dot p={LANDMARKS.asterion} label="asterion" dx={0} dy={14} anchor="middle" />}
      {show.orbital && <Dot p={LANDMARKS.orbitalProcess} label="apóf. orbitaria ext." dx={-5} dy={-8} anchor="end" />}
      <text x={X(4.6)} y={Y(-0.45) + 4} className={styles.boneLabel} textAnchor="middle">
        arco cigomático
      </text>
    </g>
  )
}

/** A measured distance: a thin line between two points with its value written beside it. */
function Measure({ a, b, text, colour, offset = [6, 0], anchor = 'start' }: { a: Point; b: Point; text: string; colour: string; offset?: [number, number]; anchor?: 'start' | 'end' }) {
  return (
    <g>
      <path d={line([a, b])} className={styles.measure} style={{ stroke: colour }} />
      <text x={(X(a[0]) + X(b[0])) / 2 + offset[0]} y={(Y(a[1]) + Y(b[1])) / 2 + offset[1]} className={styles.measureText} style={{ fill: colour }} textAnchor={anchor}>
        {text}
      </text>
    </g>
  )
}

function Lobes() {
  const [a, b] = CHIPAULT_LINE
  return (
    <g>
      <path d={line([a, b])} className={styles.construction} style={{ stroke: OCHRE }} />
      <Dot p={TEMPORAL_POLE} colour={OCHRE} label="polo temporal" dx={4} dy={14} />
      <Dot p={b} colour={OCHRE} label="1 cm" dx={7} dy={-2} />
      <text x={X(14)} y={Y(-1.1)} className={styles.region} textAnchor="middle">
        cerebelo
      </text>
      <text x={X(9)} y={Y(9)} className={styles.region} textAnchor="middle">
        hemisferio
      </text>
    </g>
  )
}

function Rolando() {
  const half = pointAtArc(vaultLength / 2)
  const auricular = pointAtArc(ROLANDO_CHAMPIONNIERE.auricularArc)
  const foot: Point = [LANDMARKS.preauricular[0], 0]
  const arc = (from: number, to: number) => {
    const n = 40
    return Array.from({ length: n + 1 }, (_, i) => pointAtArc(from + ((to - from) * i) / n))
  }
  return (
    <g>
      {/* Poirier, in blue: half the nasion–inion arc, then 2 cm more; the vertical 7 cm over the arch. */}
      <path d={line(arc(0, ROLANDO_POIRIER.upperArc))} className={styles.tape} style={{ stroke: BLUE }} />
      <Dot p={half} colour={BLUE} label="mitad" dx={-4} dy={-8} anchor="end" />
      <Dot p={ROLANDO_POIRIER.upper} colour={BLUE} label="+2 cm" dx={4} dy={-8} />
      <Measure a={foot} b={ROLANDO_POIRIER.lower} text="7 cm" colour={BLUE} offset={[-5, 0]} anchor="end" />
      <Dot p={foot} colour={BLUE} />
      {/* Lucas-Championnière, in red: the biauricular plane, then 5 cm back along the midline. */}
      <path d={line([LANDMARKS.meatus, auricular])} className={styles.construction} style={{ stroke: RED }} />
      <path d={line(arc(ROLANDO_CHAMPIONNIERE.auricularArc, ROLANDO_CHAMPIONNIERE.upperArc))} className={styles.tape} style={{ stroke: RED }} />
      <Dot p={auricular} colour={RED} />
      <Dot p={ROLANDO_CHAMPIONNIERE.upper} colour={RED} label="+5 cm" dx={7} dy={2} />
      <Fissure a={ROLANDO[0]} b={ROLANDO[1]} />
      <Dot p={LANDMARKS.nasion} />
      <Dot p={LANDMARKS.inion} />
    </g>
  )
}

/** The fissure itself, drawn heavier than the construction lines that find it. */
function Fissure({ a, b, label = true }: { a: Point; b: Point; label?: boolean }) {
  return (
    <g>
      <path d={line([a, b])} className={styles.fissure} />
      {label && (
        <text x={(X(a[0]) + X(b[0])) / 2 + 8} y={(Y(a[1]) + Y(b[1])) / 2 + 4} className={styles.fissureLabel}>
          Rolando
        </text>
      )}
    </g>
  )
}

function Sylvius() {
  const [a, b] = SYLVIAN
  const process = LANDMARKS.orbitalProcess
  return (
    <g>
      <Measure a={[process[0], 5]} b={a} text="3 cm" colour={RED} offset={[-10, -6]} />
      <path d={line([process, [process[0], 5]])} className={styles.construction} style={{ stroke: RED }} />
      <Measure a={[a[0] + 0.4, 0]} b={[a[0] + 0.4, a[1]]} text="5 cm" colour={RED} offset={[5, 6]} />
      <path d={line([a, b])} className={styles.fissure} />
      <text x={X((a[0] + b[0]) / 2)} y={Y(a[1]) + 14} className={styles.fissureLabel} textAnchor="middle">
        Silvio
      </text>
      <Dot p={LANDMARKS.parietalEminence} colour={RED} label="eminencia parietal" dx={7} />
      <Fissure a={ROLANDO[0]} b={ROLANDO[1]} label={false} />
    </g>
  )
}

function Centres() {
  // Testut places the arm's centres in the middle of the fissure but in front of it: drawn just ahead.
  const ahead = (p: Point, id: string): Point => (id === 'arm' ? [p[0] - 0.4, p[1]] : p)
  return (
    <g>
      <Fissure a={ROLANDO[0]} b={ROLANDO[1]} />
      {ROLANDIC_CENTRES.map((c) => {
        const a = ahead(alongRolando(c.from), c.id)
        const b = ahead(alongRolando(c.to), c.id)
        const mid = alongRolando((c.from + c.to) / 2)
        return (
          <g key={c.id}>
            <path d={line([a, b])} className={styles.centre} style={{ stroke: CENTRE_COLOUR[c.id] }} />
            <text x={X(mid[0]) + 12} y={Y(mid[1]) + 4} className={styles.centreLabel} style={{ fill: CENTRE_COLOUR[c.id] }}>
              {c.name}
            </text>
          </g>
        )
      })}
      <Dot p={MFB_POINTS.broca} colour={CENTRE_COLOUR.face} label="Broca" dx={-6} anchor="end" />
    </g>
  )
}

function Deep() {
  const { front, back, top } = OPTOSTRIATE
  const v = VENTRICLE_RECT
  const bottom = v.bottom
  return (
    <g>
      {/* Poirier gives no lower limit: the box stays open below. */}
      <path d={line([[front, bottom], [front, top], [back, top], [back, bottom]])} className={styles.box} style={{ stroke: BLUE, fill: `${BLUE}18` }} />
      <text x={X((front + back) / 2)} y={Y(top) + 14} className={styles.centreLabel} style={{ fill: BLUE }} textAnchor="middle">
        núcleos optoestriados
      </text>
      <Measure a={[(front + back) / 2, top]} b={[(front + back) / 2, top + 4.5]} text="45 mm" colour={BLUE} offset={[5, 0]} />
      <path d={line([[v.front, v.bottom], [v.front, v.top], [v.back, v.top], [v.back, v.bottom]], true)} className={styles.box} style={{ stroke: PLUM, fill: `${PLUM}22` }} />
      <text x={X((v.front + v.back) / 2)} y={Y(v.bottom) - 6} className={styles.centreLabel} style={{ fill: PLUM }} textAnchor="middle">
        ventrículo lateral
      </text>
      <path d={line([[v.back, v.bottom], [v.back, LANDMARKS.mastoidTip[1]], LANDMARKS.mastoidTip])} className={styles.construction} style={{ stroke: PLUM }} />
      <Dot p={LANDMARKS.mastoidTip} colour={PLUM} label="mastoides +5 cm" dx={0} dy={14} />
      <Dot p={ROLANDO[0]} colour={BLUE} />
      <path d={line([ROLANDO[0], [back, top]])} className={styles.construction} style={{ stroke: BLUE }} />
    </g>
  )
}

function MarieFoixBertrand() {
  const [a, b] = FRONTOLAMBDOID
  const { broca, angular } = MFB_POINTS
  return (
    <g>
      <path d={line([a, b])} className={styles.construction} style={{ stroke: GREEN, strokeDasharray: 'none' }} />
      <Dot p={broca} colour={GREEN} label="Broca" dx={-4} dy={-8} anchor="end" />
      <Measure a={[broca[0], heightAt(FRONTOLAMBDOID, broca[0])]} b={broca} text="" colour={GREEN} />
      <Dot p={angular} colour={GREEN} label="pliegue curvo" dx={-4} dy={-8} anchor="end" />
      <Measure a={[angular[0], heightAt(FRONTOLAMBDOID, angular[0])]} b={angular} text="8 mm" colour={GREEN} offset={[5, 3]} />
      <Dot p={[SYLVIAN[1][0], heightAt(FRONTOLAMBDOID, SYLVIAN[1][0])]} colour={GREEN} label="fin de Silvio" dx={0} dy={16} anchor="middle" />
      <Fissure a={ROLANDO[0]} b={ROLANDO[1]} label={false} />
    </g>
  )
}
