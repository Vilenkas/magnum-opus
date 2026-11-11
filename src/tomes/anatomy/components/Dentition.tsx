import { useState } from 'react'
import {
  ageAt,
  ageLabel,
  countAt,
  events,
  isPrimaryPlace,
  PERMANENT,
  PLACES,
  placeState,
  PRIMARY,
  predecessor,
  sliderAt,
  TIMING,
  type Jaw,
  type Place,
  type Range,
  type Scheme,
  type Tooth,
} from '../data/dentition'
import plate from './skeleton/plate.module.css'
import styles from './Dentition.module.css'

/** Pixels per millimetre of crown width. */
const K = 4.4
const MARGIN = 20
const GUM_UP = 150
const GUM_LO = 236
const W = 2 * MARGIN + 2 * K * PERMANENT.reduce((s, t) => s + t.width, 0)
const H = 400

const TICKS = [0, 0.5, 1, 2, 3, 6, 9, 12, 18, 25, 30]

/** Crown and root heights (mm) of each kind; the milk teeth are drawn at three quarters. */
const SHAPE = {
  incisor: { crown: 10, root: 13 },
  canine: { crown: 11, root: 16 },
  premolar: { crown: 8.5, root: 14 },
  molar: { crown: 7.5, root: 12 },
}

/** Lámina: the two dentitions, the milk teeth coming and going and the permanent ones taking their place. */
export function Dentition() {
  const [scheme, setScheme] = useState<Scheme>('testut')
  const [t, setT] = useState(sliderAt(8))
  const [selected, setSelected] = useState<{
    place: Place
    primary: boolean
  } | null>(null)
  const age = ageAt(t)
  const count = countAt(scheme, age)
  const all = events(scheme)
  const next = all.filter((e) => e.age > age + 1e-6).slice(0, 2)
  const phase =
    count.permanent === 0 && count.primary === 0
      ? 'Todavía no ha salido ningún diente: están encerrados en sus alvéolos, bajo la mucosa.'
      : count.permanent === 0
        ? count.primary === 20
          ? 'La dentición temporal está completa: veinte dientes, cinco en cada mitad de cada maxilar.'
          : 'Sale la primera dentición, por parejas, cada diente a la vez a derecha e izquierda.'
        : count.primary > 0
          ? 'Dentición mixta: los dientes de leche que quedan conviven con los primeros permanentes, que se forman debajo y detrás de ellos.'
          : count.permanent < 32
            ? 'Dentición permanente: sólo faltan las muelas del juicio, que a veces no salen nunca.'
            : 'Dentición permanente completa: treinta y dos dientes.'

  // Viewer faces the subject: their right half on the left of the drawing.
  const slots: {
    place: Place
    side: 'right' | 'left'
    x: number
    width: number
  }[] = []
  let x = MARGIN
  for (const place of [...PLACES].reverse()) {
    const width = K * PERMANENT.find((p) => p.place === place)!.width
    slots.push({ place, side: 'right', x, width })
    x += width
  }
  for (const place of PLACES) {
    const width = K * PERMANENT.find((p) => p.place === place)!.width
    slots.push({ place, side: 'left', x, width })
    x += width
  }

  const info = selected && describe(scheme, selected.place, selected.primary)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina II · Las dos denticiones</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Edades">
        <button className={plate.chip} data-active={scheme === 'testut'} onClick={() => setScheme('testut')}>
          Edades de Testut
        </button>
        <button className={plate.chip} data-active={scheme === 'today'} onClick={() => setScheme('today')}>
          Edades de hoy (Moore)
        </button>
      </div>

      <div className={styles.timeline}>
        <input type="range" min={0} max={1} step={0.001} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Edad" aria-valuetext={ageLabel(age)} />
        <div className={styles.ticks}>
          {TICKS.map((a) => (
            <button key={a} className={styles.tick} style={{ left: `${sliderAt(a) * 100}%` }} onClick={() => setT(sliderAt(a))}>
              {a === 0 ? 'nacer' : a < 1 ? `${a * 12} m` : a}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img" aria-label={`Los dientes a los ${ageLabel(age)}`}>
          <text x={W / 2} y={18} textAnchor="middle" className={styles.jawLabel}>
            maxilar superior
          </text>
          <text x={W / 2} y={H - 8} textAnchor="middle" className={styles.jawLabel}>
            maxilar inferior
          </text>
          <text x={MARGIN} y={GUM_UP + (GUM_LO - GUM_UP) / 2 + 4} className={styles.sideLabel}>
            derecha
          </text>
          <text x={W - MARGIN} y={GUM_UP + (GUM_LO - GUM_UP) / 2 + 4} textAnchor="end" className={styles.sideLabel}>
            izquierda
          </text>
          {(['upper', 'lower'] as Jaw[]).map((jaw) => (
            <g key={jaw}>
              {slots.map((s) => {
                const st = placeState(scheme, jaw, s.place, age)
                const perm = PERMANENT.find((p) => p.place === s.place)!
                const milk = PRIMARY.find((p) => p.place === s.place)
                const permVisible = age >= TIMING[scheme].permanent[s.place].from - 5
                return (
                  <g key={`${s.side}${s.place}`}>
                    {permVisible && (
                      <ToothGlyph
                        tooth={perm}
                        jaw={jaw}
                        cx={s.x + s.width / 2}
                        progress={st.permanent}
                        depth={isPrimaryPlace(s.place) ? 26 : 8}
                        scale={1}
                        kind={predecessor(s.place) ? 'replacement' : 'new'}
                        selected={selected?.place === s.place && !selected.primary}
                        onSelect={() => setSelected({ place: s.place, primary: false })}
                      />
                    )}
                    {milk && st.primary > 0 && (
                      <ToothGlyph
                        tooth={milk}
                        jaw={jaw}
                        cx={s.x + s.width / 2}
                        progress={st.primary}
                        depth={4}
                        scale={0.78}
                        kind="primary"
                        fading={st.shedding}
                        selected={selected?.place === s.place && selected.primary}
                        onSelect={() => setSelected({ place: s.place, primary: true })}
                      />
                    )}
                  </g>
                )
              })}
              {/* Bone and gum over the teeth still inside it. */}
              {jaw === 'upper' ? (
                <path d={`M${MARGIN - 8} 28 L${W - MARGIN + 8} 28 L${W - MARGIN + 8} ${GUM_UP} L${MARGIN - 8} ${GUM_UP} Z`} className={styles.bone} />
              ) : (
                <path
                  d={`M${MARGIN - 8} ${GUM_LO} L${W - MARGIN + 8} ${GUM_LO} L${W - MARGIN + 8} ${H - 22} L${MARGIN - 8} ${H - 22} Z`}
                  className={styles.bone}
                />
              )}
              <line x1={MARGIN - 8} x2={W - MARGIN + 8} y1={jaw === 'upper' ? GUM_UP : GUM_LO} y2={jaw === 'upper' ? GUM_UP : GUM_LO} className={styles.gum} />
            </g>
          ))}
          <line x1={W / 2} x2={W / 2} y1={28} y2={H - 22} className={styles.midline} />
        </svg>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {age === 0 ? 'Al nacer' : `A los ${ageLabel(age)}`} · en la boca: {count.primary} temporales, {count.permanent} permanentes
        </p>
        <p className={styles.text}>{phase}</p>
        {next.length > 0 && <p className={styles.text}>Lo próximo: {next.map((e) => `${e.text} (${ageLabel(e.age)})`).join('; ')}.</p>}
        {info && <p className={styles.info}>{info}</p>}
        <p className={styles.key}>
          <span className={styles.swatch} data-kind="primary" /> temporales <span className={styles.swatch} data-kind="replacement" /> de reemplazo{' '}
          <span className={styles.swatch} data-kind="new" /> molares permanentes, sin predecesor
        </p>
      </div>
    </figure>
  )
}

const range = (r: Range) => (r.from === r.to ? ageLabel(r.from) : `de ${ageLabel(r.from)} a ${ageLabel(r.to)}`)

function describe(scheme: Scheme, place: Place, primary: boolean): string {
  const t = TIMING[scheme]
  if (primary && isPrimaryPlace(place)) {
    const tooth = PRIMARY.find((p) => p.place === place)!
    const e = t.primary[place]
    const out = e.lower.from === e.upper.from ? `sale ${range(e.lower)}` : `sale ${range(e.lower)} abajo y ${range(e.upper)} arriba`
    return `${tooth.name}: ${out}; cae ${range(t.shedding[place])}, cuando lo empuja el ${PERMANENT.find((p) => p.place === place)!.name.toLowerCase()}.`
  }
  const tooth = PERMANENT.find((p) => p.place === place)!
  const pre = predecessor(place)
  return `${tooth.name}: sale ${range(t.permanent[place])}${pre ? `, en el sitio del ${pre.name.toLowerCase()}` : ', detrás de los temporales, sin ningún diente de leche que lo preceda'}.`
}

function ToothGlyph({
  tooth,
  jaw,
  cx,
  progress,
  depth,
  scale,
  kind,
  fading = 0,
  selected,
  onSelect,
}: {
  tooth: Tooth
  jaw: Jaw
  cx: number
  progress: number
  depth: number
  scale: number
  kind: 'primary' | 'replacement' | 'new'
  fading?: number
  selected: boolean
  onSelect: () => void
}) {
  const shape = SHAPE[tooth.kind]
  const w = tooth.width * K * scale * 0.94
  const c = shape.crown * K * scale
  const r = shape.root * K * scale * (tooth.dentition === 'primary' ? 0.85 : Math.min(1, 0.35 + progress))
  // Occlusal edge: fully out, the whole crown is past the gum; inside, it waits deeper in the bone.
  const out = c * progress - (1 - progress) * (depth + 6)
  const gum = jaw === 'upper' ? GUM_UP : GUM_LO
  const y = jaw === 'upper' ? gum + out : gum - out
  const flip = jaw === 'upper' ? 1 : -1
  return (
    <g
      transform={`translate(${cx} ${y}) scale(1 ${flip})`}
      className={styles.tooth}
      data-kind={kind}
      data-selected={selected}
      style={{ opacity: 1 - 0.85 * fading }}
      onClick={onSelect}
      role="button"
      aria-label={tooth.name}
    >
      <path d={outline(tooth.kind, w, c, r, tooth.dentition === 'primary')} />
    </g>
  )
}

/** A tooth in local coordinates: occlusal edge at y = 0, crown up to −c, roots up to −c − r. */
function outline(kind: Tooth['kind'], w: number, c: number, r: number, milk: boolean): string {
  const h = w / 2
  const neck = h * 0.78
  const top = -c - r
  if (kind === 'molar') {
    // Two roots (three on the upper molars, two seen from the side); milk molars' roots spread wide.
    const spread = milk ? h * 1.05 : h * 0.8
    return `M${-h} ${-c * 0.15} Q${-h * 0.66} 0 ${-h * 0.4} ${-c * 0.12} Q${-h * 0.13} 0 0 ${-c * 0.12} Q${h * 0.13} 0 ${h * 0.4} ${-c * 0.12} Q${h * 0.66} 0 ${h} ${-c * 0.15}
      L${neck} ${-c} Q${spread} ${top + r * 0.3} ${h * 0.5} ${top} L${h * 0.28} ${top + 2} Q${h * 0.15} ${-c - r * 0.45} 0 ${-c - r * 0.35}
      Q${-h * 0.15} ${-c - r * 0.45} ${-h * 0.28} ${top + 2} L${-h * 0.5} ${top} Q${-spread} ${top + r * 0.3} ${-neck} ${-c} Z`
  }
  const apex = `Q${h * 0.45} ${top + r * 0.25} 0 ${top} Q${-h * 0.45} ${top + r * 0.25} ${-neck} ${-c}`
  if (kind === 'canine') return `M${-h} ${-c * 0.45} L0 0 L${h} ${-c * 0.45} L${neck} ${-c} ${apex} Z`
  if (kind === 'premolar') return `M${-h} ${-c * 0.2} Q${-h * 0.5} ${c * 0.05} 0 ${-c * 0.14} Q${h * 0.5} ${c * 0.05} ${h} ${-c * 0.2} L${neck} ${-c} ${apex} Z`
  return `M${-h} ${-c * 0.05} L${h} ${-c * 0.05} L${neck} ${-c} ${apex} Z`
}
