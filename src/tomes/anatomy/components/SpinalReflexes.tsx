import { useMemo, useState } from 'react'
import { indices, rangeOf, REFLEXES, SEGMENTS, segmentIndex, stateOf, type Phase, type Range, type Reflex, type State } from '../data/spinal-reflexes'
import plate from './skeleton/plate.module.css'
import styles from './SpinalReflexes.module.css'

const TOP = 26
const ROW = 19
const CORD_L = 236
const CORD_R = 284
const segY = (i: number) => TOP + i * ROW
const midY = (r: Range) => {
  const ix = indices(r)
  return (segY(ix[0]) + segY(ix[ix.length - 1] + 1)) / 2
}

const PRESETS: { name: string; lesion: Range }[] = [
  { name: 'C5–C6', lesion: ['C5', 'C6'] },
  { name: 'Sección en D6', lesion: ['D6', 'D6'] },
  { name: 'D10–D12', lesion: ['D10', 'D12'] },
  { name: 'Cono (S3–S4)', lesion: ['S3', 'S4'] },
]

/** Spread labels vertically so that none overlaps the previous one. */
function spread(items: { r: Reflex; y: number }[], gap = 15) {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  let last = -Infinity
  return sorted.map((it) => {
    const y = Math.max(it.y, last + gap)
    last = y
    return { ...it, ly: y }
  })
}

const rangeName = ([a, b]: Range) => (a === b ? a : `${a}–${b}`)

const GROUPS: State[] = ['abolished', 'diminished', 'exaggerated', 'inverted', 'released']
const GROUP_NAME: Record<State, string> = {
  normal: 'Conservados',
  abolished: 'Abolidos',
  diminished: 'Disminuidos',
  exaggerated: 'Exagerados',
  inverted: 'Invertido',
  released: 'Reaparecen, automáticos',
}

/** Lámina: the reflex centres of the cord after Dejerine (Testut fig. 566), and what a lesion does to them. */
export function SpinalReflexes() {
  const [lesion, setLesion] = useState<Range | null>(['C5', 'C6'])
  const [anchor, setAnchor] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('automatism')
  const [today, setToday] = useState(false)

  const states = useMemo(() => new Map(REFLEXES.map((r) => [r.id, stateOf(r, lesion, phase, today)])), [lesion, phase, today])
  const left = useMemo(() => spread(REFLEXES.filter((r) => r.kind === 'cutaneous').map((r) => ({ r, y: midY(rangeOf(r, today)) }))), [today])
  const right = useMemo(() => spread(REFLEXES.filter((r) => r.kind !== 'cutaneous').map((r) => ({ r, y: midY(rangeOf(r, today)) }))), [today])
  const cut = new Set(lesion ? indices(lesion) : [])

  const pick = (id: string, extend: boolean) => {
    if (extend && anchor) {
      const [a, b] = [segmentIndex(anchor), segmentIndex(id)].sort((x, y) => x - y)
      setLesion([SEGMENTS[a].id, SEGMENTS[b].id])
    } else {
      setAnchor(id)
      setLesion([id, id])
    }
  }

  const changed = REFLEXES.filter((r) => states.get(r.id) !== 'normal')

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · Los centros reflejos de la médula</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Lesión">
        <button className={plate.chip} data-active={!lesion} onClick={() => setLesion(null)}>
          Ninguna
        </button>
        {PRESETS.map((p) => (
          <button key={p.name} className={plate.chip} data-active={lesion?.[0] === p.lesion[0] && lesion?.[1] === p.lesion[1]} onClick={() => setLesion(p.lesion)}>
            {p.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={phase === 'shock'} onClick={() => setPhase('shock')}>
          Fase de choque
        </button>
        <button className={plate.chip} data-active={phase === 'automatism'} onClick={() => setPhase('automatism')}>
          Automatismo
        </button>
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={today} aria-pressed={today} onClick={() => setToday((t) => !t)}>
          Niveles de hoy
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 520 ${segY(SEGMENTS.length) + 20}`} className={styles.schema} role="img" aria-label="La médula de C1 a S5 con los centros de los reflejos">
          <text x={130} y={14} textAnchor="middle" className={styles.columnHead}>
            Reflejos cutáneos
          </text>
          <text x={390} y={14} textAnchor="middle" className={styles.columnHead}>
            Tendinosos, periósticos y centros
          </text>

          {SEGMENTS.map((s, i) => {
            const below = lesion && i > Math.max(...cut)
            return (
              <g key={s.id} className={styles.segment} data-cut={cut.has(i)} data-below={!!below} onClick={(e) => pick(s.id, e.shiftKey)}>
                <rect x={CORD_L} y={segY(i)} width={CORD_R - CORD_L} height={ROW} />
                <text x={(CORD_L + CORD_R) / 2} y={segY(i) + ROW / 2 + 4} textAnchor="middle">
                  {s.id}
                </text>
                <title>{`Segmento ${s.id}${s.region === 'D' ? ` (hoy T${s.n})` : ''}: pulsa para lesionarlo; con Mayús, extiende la lesión`}</title>
              </g>
            )
          })}

          {[...left.map((l) => ({ ...l, side: -1 })), ...right.map((l) => ({ ...l, side: 1 }))].map(({ r, y, ly, side }) => {
            const range = rangeOf(r, today)
            const [a, b] = [segY(indices(range)[0]) + 3, segY(indices(range).at(-1)! + 1) - 3]
            const edge = side < 0 ? CORD_L - 4 : CORD_R + 4
            const labelX = side < 0 ? 196 : 324
            const st = states.get(r.id)!
            return (
              <g key={r.id} className={styles.reflex} data-state={st} data-kind={r.kind}>
                <path d={`M${edge} ${a} L${edge} ${b}`} className={styles.bracket} />
                <path d={`M${edge} ${y} L${labelX + (side < 0 ? 4 : -4)} ${ly}`} className={styles.leader} />
                <text x={labelX} y={ly + 4} textAnchor={side < 0 ? 'end' : 'start'} className={styles.label}>
                  {r.name} <tspan className={styles.level}>{rangeName(range)}</tspan>
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{lesion ? `Lesión transversal de ${rangeName(lesion)}, ${phase === 'shock' ? 'en la fase de choque' : 'pasado el choque'}` : 'Sin lesión'}</p>
        {lesion ? (
          <dl className={styles.changes}>
            {GROUPS.map((st) => {
              const rs = changed.filter((r) => states.get(r.id) === st)
              return rs.length ? (
                <div key={st} data-state={st}>
                  <dt>{GROUP_NAME[st]}</dt>
                  <dd>{rs.map((r) => `${r.name} (${rangeName(rangeOf(r, today))})`).join(', ')}</dd>
                </div>
              ) : null
            })}
          </dl>
        ) : (
          <p className={styles.text}>
            Cada reflejo cierra su arco en unos segmentos de la médula. Pulsa un segmento para lesionarlo (con Mayús, para extender la lesión): los reflejos cuyo arco destruye se abolen, y su ausencia dice a qué altura está la lesión.
          </p>
        )}
        <p className={plate.hint}>
          Segmentos de Dejerine, como los da Testut; los dorsales (D) son los torácicos (T) de hoy.
          {today && ' Con «Niveles de hoy», el bicipital, el aquíleo y el rotuliano siguen a Moore, y el plantar a Pró; por debajo de la lesión, los abdominales quedan abolidos y el plantar se invierte, como en toda lesión de la vía piramidal.'}
        </p>
      </div>
    </figure>
  )
}
