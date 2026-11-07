import { useId, useMemo, useState } from 'react'
import { DECUSSATION_Y, interrupted, isAlternate, lesions, levels, nerves, opposite, paralysis, type Nerve, type Side, type Target } from '../data/hemiplegia'
import plate from './skeleton/plate.module.css'
import styles from './Hemiplegia.module.css'

/** Each hemisphere's fibres get a colour, so the eye can follow where they cross. */
const FIBRE: Record<Side, string> = { left: '#b8322a', right: '#3b5a92' }
const SIDE_NAME: Record<Side, string> = { left: 'izquierdo', right: 'derecho' }
const TARGET_NAME: Record<Target, string> = { III: 'Ojo (motor ocular común)', VII: 'Cara (facial)', XII: 'Lengua (hipogloso mayor)', limbs: 'Miembros' }

/** Both drawings are seen from the front: the patient's left is on the viewer's right. */
const sx = (side: Side, d: number, mid = 200) => mid + (side === 'left' ? d : -d)

/** Half width of the brainstem at height y: peduncle, the bulge of the pons, medulla, cord. */
function halfWidth(y: number) {
  if (y < 176) return 30 + (y - 104) * 0.04
  if (y < 276) return 34 + 38 * Math.sin(((y - 176) / 100) * Math.PI)
  if (y < 356) return 30 - ((y - 276) / 80) * 10
  return 20
}

function stemPath() {
  const ys = Array.from({ length: 61 }, (_, i) => 104 + i * 5)
  const right = ys.map((y) => `${200 + halfWidth(y)} ${y}`)
  const left = ys.reverse().map((y) => `${200 - halfWidth(y)} ${y}`)
  return `M${right.join(' L')} L${left.join(' L')} Z`
}

const tract = (o: Side) =>
  `M${sx(o, 70)} 34 C${sx(o, 60)} 70 ${sx(o, 16)} 80 ${sx(o, 16)} 104 L${sx(o, 16)} ${DECUSSATION_Y - 10} L${sx(opposite(o), 16)} ${DECUSSATION_Y + 10} L${sx(opposite(o), 16)} 404`
const nuclear = (o: Side, n: Nerve) => `M${sx(o, 16)} ${n.crossY - 12} L200 ${n.crossY} L${sx(opposite(o), n.dx)} ${n.nucleusY}`
const uncrossed = (o: Side, n: Nerve) => `M${sx(o, 16)} ${n.crossY - 8} L${sx(o, n.dx)} ${n.nucleusY}`

/** Lámina: where a lesion of the motor pathway lies, and which side it paralyses (Testut, fig. 634). */
export function Hemiplegia() {
  const [lesionId, setLesionId] = useState(lesions[2].id)
  const [side, setSide] = useState<Side>('left')
  const clip = useId()

  const lesion = lesions.find((l) => l.id === lesionId)!
  const p = useMemo(() => paralysis(lesion.y, side), [lesion, side])
  const cut = useMemo(() => interrupted(lesion.y), [lesion])
  const stem = useMemo(stemPath, [])
  const alternate = isAlternate(p)

  const pick = (id: string, s: Side) => {
    setLesionId(id)
    setSide(s)
  }

  /** A fibre of the injured hemisphere: solid above the lesion; degenerated below it when it is cut. */
  const fibre = (d: string, o: Side, isCut: boolean, key: string, thin = false) => {
    const width = thin ? 1.4 : 2.4
    if (o !== side || !isCut) return <path key={key} d={d} stroke={FIBRE[o]} strokeWidth={width} className={styles.fibre} />
    return (
      <g key={key}>
        <path d={d} stroke={FIBRE[o]} strokeWidth={width} className={styles.fibre} clipPath={`url(#${clip}-above)`} />
        <path d={d} strokeWidth={width} className={styles.degenerated} clipPath={`url(#${clip}-below)`} />
      </g>
    )
  }

  const lesionX = sx(side, lesion.level === 'hemisphere' ? 16 : 22)
  const nerveHit = nerves.find((n) => n.level === lesion.level && p[n.id]?.kind === 'peripheral')

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina V · Hemiplejía cruzada y alterna</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Asiento de la lesión">
        {lesions.map((l) => (
          <button key={l.id} className={plate.chip} data-active={l.id === lesionId} onClick={() => setLesionId(l.id)}>
            {l.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        {(['right', 'left'] as const).map((s) => (
          <button key={s} className={plate.chip} data-active={s === side} onClick={() => setSide(s)}>
            Lado {SIDE_NAME[s]}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 400 420" className={styles.schema} role="img" aria-label={`Vía motora con una lesión en ${lesion.name.toLowerCase()}, lado ${SIDE_NAME[side]}`}>
          <defs>
            <clipPath id={`${clip}-above`}>
              <rect x="0" y="0" width="400" height={lesion.y} />
            </clipPath>
            <clipPath id={`${clip}-below`}>
              <rect x="0" y={lesion.y} width="400" height={420 - lesion.y} />
            </clipPath>
            <pattern id={`${clip}-hatch`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="#2a2420" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#f6efe0" strokeWidth="1.2" />
            </pattern>
          </defs>

          {(['left', 'right'] as const).map((s) => (
            <path
              key={s}
              d={`M${sx(s, 6)} 104 L${sx(s, 6)} 40 C${sx(s, 6)} 2 ${sx(s, 168)} 0 ${sx(s, 170)} 86 Q${sx(s, 170)} 104 ${sx(s, 150)} 104 Z`}
              className={styles.hemisphere}
            />
          ))}
          <path d={stem} className={styles.stem} />
          <line x1="200" y1="104" x2="200" y2="404" className={styles.midline} />
          <line x1="150" y1={DECUSSATION_Y} x2="250" y2={DECUSSATION_Y} className={styles.levelLine} />

          {/* Clickable levels: each half of each level puts the lesion there. */}
          {levels.map((l) => {
            const preset = lesions.find((x) => x.level === l.id)!
            return (['left', 'right'] as const).map((s) => (
              <rect
                key={l.id + s}
                x={s === 'left' ? 200 : 200 - (l.id === 'hemisphere' ? 180 : 80)}
                y={l.id === 'hemisphere' ? 40 : l.top}
                width={l.id === 'hemisphere' ? 180 : 80}
                height={l.id === 'hemisphere' ? l.bottom - 40 : l.bottom - l.top}
                className={styles.band}
                onClick={() => pick(preset.id, s)}
              >
                <title>{`${l.name}, lado ${SIDE_NAME[s]}`}</title>
              </rect>
            ))
          })}

          {levels.slice(1).map((l) => (
            <text key={l.id} x="8" y={(l.top + l.bottom) / 2} className={styles.levelName}>
              {l.name}
            </text>
          ))}
          <text x="8" y={DECUSSATION_Y + 4} className={styles.levelName}>
            Decusación
          </text>
          <text x="8" y={DECUSSATION_Y + 14} className={styles.levelName}>
            piramidal
          </text>

          {(['left', 'right'] as const).map((o) => (
            <g key={o}>
              {fibre(tract(o), o, cut.spinal, 'spinal')}
              {nerves.map((n) => fibre(nuclear(o, n), o, cut.nuclear[n.id], n.id))}
              {nerves.filter((n) => n.bilateral).map((n) => fibre(uncrossed(o, n), o, true, n.id + 'u', true))}
            </g>
          ))}

          {nerves.map((n) =>
            (['left', 'right'] as const).map((s) => {
              const dead = nerveHit === n && s === side
              const edge = halfWidth(n.nucleusY)
              return (
                <g key={n.id + s} className={styles.nerve} data-dead={dead}>
                  <path d={`M${sx(s, n.dx)} ${n.nucleusY} L${sx(s, edge + 16)} ${n.nucleusY + 8}`} className={dead ? styles.rootDead : styles.root} />
                  <circle cx={sx(s, n.dx)} cy={n.nucleusY} r="5" className={styles.nucleus} />
                  <text x={sx(s, edge + 20)} y={n.nucleusY + 12} className={styles.nerveName} textAnchor={s === 'left' ? 'start' : 'end'}>
                    {n.id}
                  </text>
                </g>
              )
            }),
          )}

          <text x={sx('right', 16)} y="414" className={styles.limbs} textAnchor="end">
            ↓ miembros der.
          </text>
          <text x={sx('left', 16)} y="414" className={styles.limbs} textAnchor="start">
            miembros izq. ↓
          </text>

          <ellipse cx={lesionX} cy={lesion.y} rx="17" ry="7" fill={`url(#${clip}-hatch)`} className={styles.lesion} />

          <text x="100" y="12" className={styles.sideName}>
            Hemisferio derecho
          </text>
          <text x="300" y="12" className={styles.sideName}>
            Hemisferio izquierdo
          </text>
        </svg>

        <Patient paralysis={p} />
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {alternate ? 'Hemiplejía alterna' : 'Hemiplejía cruzada'} · lesión del lado {SIDE_NAME[side]}
        </p>
        <p className={plate.title}>{lesion.syndrome}</p>
        {lesion.eponym && <p className={plate.meta}>Llamada también {lesion.eponym}.</p>}
        <p className={styles.text}>{lesion.text}</p>
        <ul className={styles.findings}>
          {(['III', 'VII', 'XII', 'limbs'] as const).map((t) => {
            const q = p[t]
            return (
              <li key={t} data-same={q ? q.side === side : undefined}>
                <span>{TARGET_NAME[t]}</span>
                <span>{q ? `lado ${SIDE_NAME[q.side]}${q.side === side ? ', el de la lesión' : ''}` : 'respetado'}</span>
              </li>
            )
          })}
        </ul>
        <p className={plate.hint}>Haz clic en un nivel del tronco, a la izquierda o a la derecha, para llevar allí la lesión.</p>
      </div>
    </figure>
  )
}

/** The patient seen from the front, with what the lesion paralyses tinted. */
function Patient({ paralysis: p }: { paralysis: ReturnType<typeof paralysis> }) {
  const hit = (t: Target, s: Side) => p[t]?.side === s
  const x = (s: Side, d: number) => sx(s, d, 100)
  const sweep = (s: Side) => (s === 'left' ? 1 : 0)
  // The tongue, put out, points to the paralysed side.
  const tongueTip = p.XII ? x(p.XII.side, 7) : 100

  return (
    <svg viewBox="0 0 200 300" className={styles.patient} role="img" aria-label="El enfermo: partes paralizadas">
      {(['left', 'right'] as const).map((s) => {
        // A central facial palsy spares the forehead (bilateral supply); a peripheral one takes the whole half.
        const upper = hit('VII', s) && p.VII!.kind === 'peripheral'
        const lower = hit('VII', s)
        return (
          <g key={s}>
            <path d={`M100 10 A34 42 0 0 ${sweep(s)} ${x(s, 34)} 52 L100 52 Z`} className={styles.skin} data-hit={upper} />
            <path d={`M100 52 L${x(s, 34)} 52 A34 42 0 0 ${sweep(s)} 100 94 Z`} className={styles.skin} data-hit={lower} />
            {/* Eye; a paralysed oculomotor drops the lid and turns the eye out. */}
            <ellipse cx={x(s, 13)} cy="44" rx="6.5" ry="3.6" className={styles.eye} />
            <circle cx={x(s, hit('III', s) ? 16 : 13)} cy="44.5" r={hit('III', s) ? 2.6 : 2} className={styles.pupil} />
            {hit('III', s) && <path d={`M${x(s, 6.5)} 44 Q${x(s, 13)} 38 ${x(s, 19.5)} 44 Z`} className={styles.lid} />}
            {/* Half of the mouth: the corner drops on the paralysed side. */}
            <path d={`M100 74 Q${x(s, 8)} 75 ${x(s, 14)} ${lower ? 78 : 72}`} className={styles.mouth} />
            {/* Arm and leg. */}
            <path d={`M${x(s, 30)} 112 Q${x(s, 46)} 116 ${x(s, 50)} 140 L${x(s, 56)} 204 L${x(s, 44)} 206 L${x(s, 36)} 146 Z`} className={styles.skin} data-hit={hit('limbs', s)} />
            <path d={`M${x(s, 2)} 196 L${x(s, 28)} 196 L${x(s, 30)} 290 L${x(s, 12)} 290 Z`} className={styles.skin} data-hit={hit('limbs', s)} />
          </g>
        )
      })}
      <path d={`M95 76 Q94 84 ${tongueTip - 2} 88 Q${tongueTip} 90 ${tongueTip + 2} 88 Q106 84 105 76 Z`} className={styles.tongue} data-hit={!!p.XII} />
      <path d="M90 92 L110 92 L112 106 L88 106 Z" className={styles.skin} />
      <path d="M70 108 Q100 102 130 108 L128 198 L72 198 Z" className={styles.skin} />
      <text x="40" y="20" className={styles.sideName}>
        der.
      </text>
      <text x="160" y="20" className={styles.sideName}>
        izq.
      </text>
    </svg>
  )
}
