import { useMemo, useState } from 'react'
import { BOTTOM_Y, HALF_WIDTH, LATERAL_Y, regions, striae, sulcusLimitans, toXY, zoneName, type UY, type Zone } from '../data/ventricle-floor'
import plate from './skeleton/plate.module.css'
import styles from './VentricleFloor.module.css'

const ZONE_COLOR: Record<Zone, string> = { somatomotor: '#b8322a', vegetative: '#c98a2a', sensory: '#3b5a92', other: '#8a7a6c' }

/** A straight edge in [u, y] is curved on the floor: sample it before mapping. */
function sample(shape: UY[], closed: boolean, steps = 8): [number, number][] {
  const out: [number, number][] = []
  const n = closed ? shape.length : shape.length - 1
  for (let i = 0; i < n; i++) {
    const [[u0, y0], [u1, y1]] = [shape[i], shape[(i + 1) % shape.length]]
    for (let k = 0; k < steps; k++) out.push(toXY([u0 + ((u1 - u0) * k) / steps, y0 + ((y1 - y0) * k) / steps]))
  }
  if (!closed) out.push(toXY(shape.at(-1)!))
  return out
}

const path = (pts: [number, number][], mirror: boolean, closed: boolean) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(mirror ? -x : x).toFixed(1)} ${y.toFixed(1)}`).join(' ') + (closed ? ' Z' : '')

type View = 'reliefs' | 'nuclei'

/** Lámina: the floor of the fourth ventricle, each relief with what lies beneath it (Testut, figs. 694 and 700). */
export function VentricleFloor() {
  const [view, setView] = useState<View>('reliefs')
  const [selected, setSelected] = useState(regions[0].id)
  const region = regions.find((r) => r.id === selected)!

  const shapes = useMemo(() => regions.map((r) => ({ ...r, pts: sample(r.shape, true) })), [])
  const sulcus = useMemo(() => sample(sulcusLimitans, false), [])
  const striaePaths = useMemo(() => striae.map((s) => sample(s, false)), [])
  const H = HALF_WIDTH
  const rhombus = `M0 0 L${H} ${LATERAL_Y} L0 ${BOTTOM_Y} L${-H} ${LATERAL_Y} Z`
  const nuclei = view === 'nuclei'

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina VII · El suelo del cuarto ventrículo</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Vista">
        <button className={plate.chip} data-active={!nuclei} onClick={() => setView('reliefs')}>
          Relieves
        </button>
        <button className={plate.chip} data-active={nuclei} onClick={() => setView('nuclei')}>
          Núcleos de debajo
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="-150 -24 300 348" className={styles.svg} role="img" aria-label="Suelo del cuarto ventrículo visto por detrás">
          {/* The lateral recesses beyond the lateral angles. */}
          <path d={`M${-H} ${LATERAL_Y} C${-H - 30} ${LATERAL_Y - 14} ${-H - 52} ${LATERAL_Y - 4} ${-H - 58} ${LATERAL_Y + 8} C${-H - 44} ${LATERAL_Y + 16} ${-H - 20} ${LATERAL_Y + 12} ${-H + 4} ${LATERAL_Y + 6} Z`} className={styles.recess} />
          <path d={`M${H} ${LATERAL_Y} C${H + 30} ${LATERAL_Y - 14} ${H + 52} ${LATERAL_Y - 4} ${H + 58} ${LATERAL_Y + 8} C${H + 44} ${LATERAL_Y + 16} ${H + 20} ${LATERAL_Y + 12} ${H - 4} ${LATERAL_Y + 6} Z`} className={styles.recess} />
          <path d={rhombus} className={styles.floor} />
          <line x1={-H} y1={LATERAL_Y} x2={H} y2={LATERAL_Y} className={styles.axis} />
          <line x1="0" y1="0" x2="0" y2={BOTTOM_Y} className={styles.median} />

          {shapes.map((r) =>
            [false, true].map((mirror) => (
              <path
                key={r.id + mirror}
                d={path(r.pts, mirror, true)}
                className={styles.region}
                data-selected={r.id === selected}
                style={{ fill: nuclei ? ZONE_COLOR[r.zone] : undefined }}
                onClick={() => setSelected(r.id)}
              >
                <title>{r.modern ? `${r.name} (${r.modern})` : r.name}</title>
              </path>
            )),
          )}

          {striaePaths.map((s, i) =>
            [false, true].map((mirror) => <path key={`${i}${mirror}`} d={path(s, mirror, false)} className={styles.stria} />),
          )}
          {nuclei && [false, true].map((mirror) => <path key={String(mirror)} d={path(sulcus, mirror, false)} className={styles.sulcus} />)}

          <text x={H + 16} y={LATERAL_Y - 70} className={styles.label}>
            triángulo
          </text>
          <text x={H + 16} y={LATERAL_Y - 60} className={styles.label}>
            protuberancial
          </text>
          <text x={H - 8} y={LATERAL_Y + 50} className={styles.label}>
            triángulo bulbar
          </text>
          <text x={-H - 58} y={LATERAL_Y + 26} className={styles.label}>
            recessus lateralis
          </text>
          <text x="0" y="-8" className={styles.label} textAnchor="middle">
            acueducto de Silvio
          </text>
          <text x="0" y={BOTTOM_Y + 16} className={styles.label} textAnchor="middle">
            óbex · pico del cálamo
          </text>
          {nuclei && (
            <text x={-H - 4} y={120} className={styles.label} textAnchor="end">
              surco limitante
            </text>
          )}
        </svg>

        <ul className={styles.key}>
          {regions.map((r) => (
            <li key={r.id}>
              <button data-active={r.id === selected} onClick={() => setSelected(r.id)}>
                <span className={styles.swatch} style={{ background: nuclei ? ZONE_COLOR[r.zone] : undefined }} />
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {zoneName[region.zone]} · triángulo {region.triangle === 'both' ? 'bulbar y protuberancial' : region.triangle === 'bulbar' ? 'bulbar' : 'protuberancial'}
        </p>
        <p className={plate.title}>{region.name}</p>
        {region.modern && <p className={plate.meta}>Hoy, {region.modern.toLowerCase()} (Netter, lám. S-41)</p>}
        <p className={styles.text}>{region.beneath}</p>
        <p className={plate.hint}>
          {nuclei
            ? 'En rojo, los núcleos somatomotores, junto a la línea media; en ocre, los vegetativos, a lo largo del surco limitante; en azul, los sensitivos, por fuera.'
            : 'Haz clic en un relieve, o pasa a «Núcleos de debajo» para ver las tres columnas.'}
        </p>
      </div>
    </figure>
  )
}
