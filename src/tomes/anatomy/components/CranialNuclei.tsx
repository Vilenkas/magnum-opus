import { useMemo, useState } from 'react'
import {
  FACIAL_LOOP,
  LEVELS,
  MODERN_COLUMNS,
  NERVES,
  NUCLEI,
  TESTUT_COLUMNS,
  columnOf,
  isEfferent,
  nervesOf,
  nucleiOf,
  nucleus,
  stretchOf,
  type Mode,
  type ModernColumn,
  type NerveId,
  type Nucleus,
  type TestutColumn,
} from '../data/cranial-nuclei'
import plate from './skeleton/plate.module.css'
import styles from './CranialNuclei.module.css'

const TESTUT_COLOR: Record<TestutColumn, string> = {
  'anterior-base': '#b8322a',
  'anterior-head': '#d9762b',
  'lateral-horn': '#c9a227',
  'posterior-base': '#3b5a92',
  'posterior-head': '#6f97c2',
}
const MODERN_COLOR: Record<ModernColumn, string> = {
  GSE: '#b8322a',
  SVE: '#d9762b',
  GVE: '#c9a227',
  VA: '#5f8a3a',
  SSA: '#3b5a92',
  GSA: '#7a5fa0',
}
const colorOf = (n: Nucleus, mode: Mode) => (mode === 'testut' ? TESTUT_COLOR[n.testut] : MODERN_COLOR[n.modern])

/** Units per mm, wider than tall so the columns can be told apart; below the bulb the cord is squeezed so that the XI can reach C5. */
const K = 16
const KY = 9
const SQUEEZE_FROM = 78
const sy = (y: number) => KY * (y <= SQUEEZE_FROM ? y : SQUEEZE_FROM + (y - SQUEEZE_FROM) * 0.12)

/** Half width of the brainstem seen from behind, schematic, [half width, y] in mm. */
const OUTLINE: [number, number][] = [
  [7, -1], [8.5, 5], [8.2, 12], [6.2, 16], [6.4, 19], [8.5, 24], [9.5, 28], [11.5, 38], [12.5, 46], [10.5, 52],
  [8.2, 57], [7, 62], [6.2, 68], [5.8, 74], [5.8, 130],
]
const outlinePath = () => {
  const right = OUTLINE.map(([w, y]) => `${K * w} ${sy(y)}`)
  const left = [...OUTLINE].reverse().map(([w, y]) => `${-K * w} ${sy(y)}`)
  return `M${right.join(' L')} L${left.join(' L')} Z`
}

const FLOOR = `M0 ${sy(LEVELS.ventricleTop)} L${K * 8} ${sy(LEVELS.lateralAngles)} L0 ${sy(LEVELS.calamus)} L${-K * 8} ${sy(LEVELS.lateralAngles)} Z`

/** Where a nucleus sits on screen: efferent ones on the left half, afferent ones on the right. */
function box(n: Nucleus, mode: Mode, y: [number, number] = n.y) {
  const left = isEfferent(n, mode)
  const x0 = left ? -K * n.x[1] : K * n.x[0]
  return { x: x0, y: sy(y[0]), w: K * (n.x[1] - n.x[0]), h: sy(y[1]) - sy(y[0]), left }
}

/** Spread labels vertically so they don't overlap (min gap in svg units). */
function spread(ys: number[], gap = 22) {
  const out = [...ys]
  for (let k = 0; k < 40; k++)
    for (let i = 1; i < out.length; i++)
      if (out[i] - out[i - 1] < gap) {
        const push = (gap - (out[i] - out[i - 1])) / 2
        out[i - 1] -= push
        out[i] += push
      }
  return out
}

const REGIONS: { name: string; y: [number, number] }[] = [
  { name: 'Mesencéfalo', y: [0, LEVELS.pons] },
  { name: 'Protuberancia', y: [LEVELS.pons, LEVELS.lateralAngles] },
  { name: 'Bulbo', y: [LEVELS.lateralAngles, LEVELS.cord] },
  { name: 'Médula cervical', y: [LEVELS.cord, LEVELS.c5] },
]

/** Lámina: the nuclei of the cranial nerves on the brainstem, in Testut's columns and in today's. */
export function CranialNuclei() {
  const [mode, setMode] = useState<Mode>('testut')
  const [nerve, setNerve] = useState<NerveId | null>(null)
  const [selected, setSelected] = useState('ambiguus')
  const current = nucleus(selected)

  const lit = (n: Nucleus) => nerve === null || nervesOf(n, mode).includes(nerve)

  const labels = useMemo(() => {
    const shown = nerve ? NUCLEI.filter((n) => nervesOf(n, mode).includes(nerve)) : [nucleus(selected)]
    const items = shown.map((n) => {
      const ys = nerve ? stretchOf(n, nerve, mode).flat() : n.y
      const b = box(n, mode, [Math.min(...ys), Math.max(...ys)])
      return { n, b, y: b.y + b.h / 2 }
    })
    const out: typeof items[] = [items.filter((i) => i.b.left), items.filter((i) => !i.b.left)]
    return out.flatMap((side) => {
      side.sort((a, b) => a.y - b.y)
      const ys = spread(side.map((s) => s.y))
      return side.map((s, i) => ({ ...s, ly: ys[i] }))
    })
  }, [nerve, mode, selected])

  const columns = mode === 'testut' ? (Object.keys(TESTUT_COLUMNS) as TestutColumn[]) : (Object.keys(MODERN_COLUMNS) as ModernColumn[])
  const column = columnOf(current, mode)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XX · Los núcleos de los nervios craneales</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Clasificación">
        <button className={plate.chip} data-active={mode === 'testut'} onClick={() => setMode('testut')}>
          Columnas de Testut
        </button>
        <button className={plate.chip} data-active={mode === 'today'} onClick={() => setMode('today')}>
          Columnas de hoy
        </button>
      </div>
      <div className={plate.chipBar} role="group" aria-label="Nervio">
        <button className={plate.chip} data-active={nerve === null} onClick={() => setNerve(null)}>
          Todos
        </button>
        {NERVES.map((id) => (
          <button
            key={id}
            className={plate.chip}
            data-active={nerve === id}
            onClick={() => {
              setNerve(id)
              setSelected(nucleiOf(id, mode)[0].id)
            }}
          >
            {id}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox={`-420 -44 840 ${sy(LEVELS.c5) + 76}`} className={styles.svg} role="img" aria-label="Tronco del encéfalo visto por detrás con los núcleos de los nervios craneales">
          <defs>
            <pattern id="cn-deep" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="#fff" fillOpacity="0.0" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" />
            </pattern>
          </defs>

          <text x={-200} y={-22} textAnchor="middle" className={styles.side}>
            núcleos de origen (eferentes)
          </text>
          <text x={200} y={-22} textAnchor="middle" className={styles.side}>
            núcleos de terminación (aferentes)
          </text>

          <path d={outlinePath()} className={styles.stem} />
          {[-1, 1].flatMap((s) => [3.5, 10].map((y) => <ellipse key={`${s}${y}`} cx={s * 4 * K} cy={sy(y)} rx={3.4 * K} ry={2.8 * KY} className={styles.colliculus} />))}
          <line x1={0} y1={sy(-1)} x2={0} y2={sy(LEVELS.ventricleTop)} className={styles.aqueduct} />
          <path d={FLOOR} className={styles.floor} />
          <line x1={0} y1={sy(LEVELS.calamus)} x2={0} y2={sy(LEVELS.c5)} className={styles.median} />
          {/* The break in the scale of the cord. */}
          <path d={`M-110 ${sy(SQUEEZE_FROM) + 6} l27.5 -8 l27.5 16 l27.5 -16 l27.5 16 l27.5 -16 l27.5 16 l27.5 -16 l27.5 8`} className={styles.break} />

          {REGIONS.map((r) => (
            <g key={r.name} className={styles.region}>
              <line x1={-395} y1={sy(r.y[0]) + 2} x2={-395} y2={sy(r.y[1]) - 2} />
              <text x={-402} y={(sy(r.y[0]) + sy(r.y[1])) / 2} transform={`rotate(-90 -402 ${(sy(r.y[0]) + sy(r.y[1])) / 2})`} textAnchor="middle">
                {r.name}
              </text>
            </g>
          ))}
          <text x={0} y={sy(LEVELS.calamus) + 18} textAnchor="middle" className={styles.small}>
            pico del cálamo
          </text>
          <text x={0} y={sy(LEVELS.c5) + 20} textAnchor="middle" className={styles.small}>
            C5
          </text>

          <polyline
            points={FACIAL_LOOP.map(([x, y]) => `${-K * x},${sy(y)}`).join(' ')}
            className={styles.loop}
            data-lit={nerve === 'VII' || nerve === 'VI'}
          />

          {NUCLEI.map((n) => {
            const b = box(n, mode)
            const on = lit(n)
            return (
              <g key={n.id} className={styles.nucleus} data-lit={on} data-selected={n.id === selected} onClick={() => setSelected(n.id)}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} style={{ fill: colorOf(n, mode) }} />
                {n.depth === 'deep' && <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill="url(#cn-deep)" className={styles.hatch} />}
                {nerve &&
                  n.parts &&
                  stretchOf(n, nerve, mode).map((y, i) => {
                    const s = box(n, mode, y)
                    return <rect key={i} x={s.x - 2} y={s.y} width={s.w + 4} height={s.h} rx={3} className={styles.stretch} />
                  })}
                <title>{mode === 'testut' ? n.name : n.today}</title>
              </g>
            )
          })}

          {labels.map(({ n, b, ly }) => {
            const ex = b.left ? b.x : b.x + b.w
            const tx = b.left ? -225 : 225
            return (
              <g key={n.id} className={styles.label} onClick={() => setSelected(n.id)}>
                <polyline points={`${ex},${b.y + b.h / 2} ${b.left ? ex - 6 : ex + 6},${b.y + b.h / 2} ${tx},${ly}`} />
                <text x={b.left ? tx - 5 : tx + 5} y={ly + 5} textAnchor={b.left ? 'end' : 'start'}>
                  {shortName(mode === 'testut' ? n.name : n.today)}
                </text>
              </g>
            )
          })}
        </svg>

        <ul className={styles.key}>
          {columns.map((c) => {
            const info = mode === 'testut' ? TESTUT_COLUMNS[c as TestutColumn] : MODERN_COLUMNS[c as ModernColumn]
            const color = mode === 'testut' ? TESTUT_COLOR[c as TestutColumn] : MODERN_COLOR[c as ModernColumn]
            return (
              <li key={c}>
                <span className={styles.swatch} style={{ background: color }} />
                {info.name}
              </li>
            )
          })}
          <li className={styles.keyNote}>
            <span className={styles.swatch} data-deep />
            rayado: en la profundidad de la calota
          </li>
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {column.name} · {current.depth === 'floor' ? 'bajo el suelo' : 'en la profundidad'}
        </p>
        <p className={plate.title}>{mode === 'testut' ? current.name : current.today}</p>
        <p className={plate.meta}>
          {mode === 'testut' ? `Hoy, ${lower(current.today)}` : `En Testut, ${lower(current.name)}`} · {nervesLabel(current, mode)}
        </p>
        <p className={styles.text}>{current.note}</p>
        <p className={plate.hint}>
          {mode === 'testut'
            ? 'Testut deriva los núcleos de la columna gris de la médula: la base del asta anterior junto a la línea media, su cabeza en la profundidad; la base del asta posterior en el suelo, por fuera, y su cabeza en la profundidad; los vegetativos, homólogos del asta lateral.'
            : 'Hoy se ordenan por lo que hacen sus fibras, en seis columnas. Coinciden con las de Testut casi núcleo por núcleo; sólo el mesencefálico del trigémino cambia de lado, porque sus células, que él contaba con el masticador, son sensitivas.'}
        </p>
      </div>
    </figure>
  )
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/** The label beside a nucleus: drop the leading "Núcleo(s)" and anything in brackets. */
const shortName = (s: string) =>
  s
    .replace(/\s*\(.*\)$/, '')
    .replace(/^Núcleos? (del |de |)/, '')
    .replace(/^./, (c) => c.toUpperCase())

function nervesLabel(n: Nucleus, mode: Mode) {
  const ns = nervesOf(n, mode)
  return ns.length === 1 ? `nervio ${ns[0]}` : `nervios ${ns.slice(0, -1).join(', ')} y ${ns.at(-1)}`
}
