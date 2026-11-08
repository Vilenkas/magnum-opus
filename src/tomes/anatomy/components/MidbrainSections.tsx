import { useState } from 'react'
import { ARC, NIGRA, OUTLINE, PES, at, levels, nigra, pesAngles, pesTestut, pesToday, ring, type LevelId, type PesSegment, type Structure } from '../data/midbrain-sections'
import plate from './skeleton/plate.module.css'
import styles from './MidbrainSections.module.css'

/** A band of the ring between two angles and two radii, on one side. */
function band(from: number, to: number, r0: number, r1: number, mirror: boolean) {
  const pts: [number, number][] = []
  const step = (to - from) / 12
  for (let a = from; a <= to + 1e-6; a += step) pts.push(ring(a, r1))
  for (let a = to; a >= from - 1e-6; a -= step) pts.push(ring(a, r0))
  return 'M' + pts.map(([x, y]) => `${(mirror ? 400 - x : x).toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z'
}

const PES_COLORS = ['#c98a2a', '#b8322a', '#3b5a92']

type Selected = { kind: 'structure'; s: Structure } | { kind: 'nigra' } | { kind: 'pes'; seg: PesSegment }

/** Lámina: the midbrain cut at its two colliculi, with the three floors and the segments of the pes (Testut, figs. 721, 741–742). */
export function MidbrainSections() {
  const [level, setLevel] = useState<LevelId>('superior')
  const [today, setToday] = useState(false)
  const [selected, setSelected] = useState<Selected>({ kind: 'structure', s: at('superior').find((s) => s.id === 'red-nucleus')! })

  const shown = at(level)
  const pes = pesAngles(today ? pesToday : pesTestut)
  const changeLevel = (l: LevelId) => {
    setLevel(l)
    if (selected.kind === 'structure' && !selected.s.levels.includes(l)) setSelected({ kind: 'nigra' })
  }
  const isSel = (id: string) => (selected.kind === 'structure' && selected.s.id === id) || (selected.kind === 'pes' && selected.seg.id === id) || (selected.kind === 'nigra' && id === 'nigra')

  const title = selected.kind === 'structure' ? selected.s.name : selected.kind === 'nigra' ? nigra.name : selected.seg.name
  const modern = selected.kind === 'structure' ? selected.s.modern : selected.kind === 'nigra' ? nigra.modern : undefined
  const kicker = selected.kind === 'pes' ? `Pie del pedúnculo · ${today ? 'hoy' : 'según Testut'}` : selected.kind === 'nigra' ? 'Entre la calota y el pie' : { tectum: 'Techo', tegmentum: 'Calota', base: 'Pie' }[selected.s.floor]
  const text = selected.kind === 'structure' ? selected.s.description : selected.kind === 'nigra' ? nigra.description : selected.seg.description

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IX · El mesencéfalo en dos cortes</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Corte">
        {levels.map((l) => (
          <button key={l.id} className={plate.chip} data-active={l.id === level} onClick={() => changeLevel(l.id)}>
            {l.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={!today} onClick={() => setToday(false)}>
          Pie según Testut
        </button>
        <button className={plate.chip} data-active={today} onClick={() => setToday(true)}>
          Pie hoy
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="60 20 280 240" className={styles.svg} role="img" aria-label={`Corte del mesencéfalo ${levels.find((l) => l.id === level)!.name.toLowerCase()}`}>
          <ellipse cx={OUTLINE.cx} cy={OUTLINE.cy} rx={OUTLINE.rx} ry={OUTLINE.ry} className={styles.outline} />
          {/* The interpeduncular space notches the ventral side between the two feet. */}
          <path d="M184 246 L200 214 L216 246 Z" className={styles.notch} />

          {[false, true].map((mirror) => (
            <g key={String(mirror)}>
              {pes.map((seg, i) => (
                <path
                  key={seg.id}
                  d={band(seg.from, seg.to, PES.r0, PES.r1, mirror)}
                  className={styles.pes}
                  style={{ fill: PES_COLORS[i] }}
                  data-selected={isSel(seg.id)}
                  onClick={() => setSelected({ kind: 'pes', seg })}
                >
                  <title>{seg.name}</title>
                </path>
              ))}
              <path d={band(ARC.from, ARC.to, NIGRA.r0, NIGRA.r1, mirror)} className={styles.nigra} data-selected={isSel('nigra')} onClick={() => setSelected({ kind: 'nigra' })}>
                <title>{nigra.name}</title>
              </path>
            </g>
          ))}

          {shown.map((s) => {
            const xs = s.dx === 0 ? [200] : [200 + s.dx, 200 - s.dx]
            return (
              <g key={s.id} className={styles.structure} data-kind={s.id} data-selected={isSel(s.id)} onClick={() => setSelected({ kind: 'structure', s })}>
                {xs.map((x) => (
                  <ellipse key={x} cx={x} cy={s.cy} rx={s.rx} ry={s.ry} />
                ))}
                <title>{s.name}</title>
              </g>
            )
          })}

          <text x="200" y="30" className={styles.orient}>
            dorsal
          </text>
          <text x="200" y="258" className={styles.orient}>
            ventral
          </text>
        </svg>

        <ul className={styles.key}>
          {shown.map((s) => (
            <li key={s.id}>
              <button data-active={isSel(s.id)} onClick={() => setSelected({ kind: 'structure', s })}>
                {s.name}
              </button>
            </li>
          ))}
          <li>
            <button data-active={isSel('nigra')} onClick={() => setSelected({ kind: 'nigra' })}>
              {nigra.name}
            </button>
          </li>
          {pes.map((seg, i) => (
            <li key={seg.id}>
              <button data-active={isSel(seg.id)} onClick={() => setSelected({ kind: 'pes', seg })}>
                <span className={styles.swatch} style={{ background: PES_COLORS[i] }} />
                {seg.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{kicker}</p>
        <p className={plate.title}>{title}</p>
        {modern && <p className={plate.meta}>Hoy, {modern}</p>}
        <p className={styles.text}>{text}</p>
        <p className={plate.hint}>
          {level === 'superior'
            ? 'A esta altura: el núcleo del motor ocular común, el núcleo rojo y las decusaciones de Meynert y de Forel.'
            : 'A esta altura: el núcleo del patético, la decusación de los pedúnculos cerebelosos superiores y la cinta de Reil lateral, que va al tubérculo.'}
        </p>
      </div>
    </figure>
  )
}
