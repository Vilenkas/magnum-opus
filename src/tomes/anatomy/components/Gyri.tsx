import { useState } from 'react'
import { areaName, centroid, corpusCallosum, diencephalon, fissures, lobeName, onFace, outlines, type Area, type Face, type Gyrus, type Lobe, type Pt } from '../data/gyri'
import plate from './skeleton/plate.module.css'
import styles from './Gyri.module.css'

/** The lobes in the colours of Testut's figs. 766 and 776. */
const LOBE_COLOR: Record<Lobe, string> = {
  frontal: '#d98c88',
  parietal: '#8fa8d4',
  temporal: '#9cc29a',
  occipital: '#e4cf7a',
  limbic: '#b59ac9',
}

/** Functions, after the colours of Testut's figs. 806 and 807. */
const AREA_COLOR: Record<Area, string> = {
  motor: '#c0504a',
  sensory: '#5b7fbf',
  visual: '#d9b23a',
  auditory: '#5f9a5c',
  language: '#9a6bb5',
  association: '#d8c7ad',
  olfactory: '#4f9c9a',
}
const NONE = '#ece3d3'

const poly = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z'
const line = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L')

/** Lámina: the convolutions of the outer and inner faces, by lobe, with Testut's names and today's. */
export function Gyri() {
  const [face, setFace] = useState<Face>('lateral')
  const [today, setToday] = useState(false)
  const [functions, setFunctions] = useState(false)
  const [selectedId, setSelectedId] = useState('f3')
  const shown = onFace(face)
  const selected: Gyrus = shown.find((g) => g.id === selectedId) ?? shown[0]
  const nameOf = (g: Gyrus) => (today && g.modern ? g.modern : g.name)
  const colorOf = (g: Gyrus) => (functions ? (g.localization ? AREA_COLOR[g.localization.area] : NONE) : LOBE_COLOR[g.lobe])
  const areas = [...new Set(shown.flatMap((g) => (g.localization ? [g.localization.area] : [])))]

  const switchFace = (f: Face) => {
    setFace(f)
    setSelectedId(onFace(f)[0].id)
  }

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IX · Las circunvoluciones cerebrales</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Cara y nomenclatura">
        <button className={plate.chip} data-active={face === 'lateral'} onClick={() => switchFace('lateral')}>
          Cara externa
        </button>
        <button className={plate.chip} data-active={face === 'medial'} onClick={() => switchFace('medial')}>
          Cara interna
        </button>
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={!today} onClick={() => setToday(false)}>
          Nombres de Testut
        </button>
        <button className={plate.chip} data-active={today} onClick={() => setToday(true)}>
          Nombres actuales
        </button>
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={!functions} onClick={() => setFunctions(false)}>
          Lóbulos
        </button>
        <button className={plate.chip} data-active={functions} onClick={() => setFunctions(true)}>
          Localizaciones
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="-30 10 660 350" className={styles.svg} role="img" aria-label={`Circunvoluciones de la ${face === 'lateral' ? 'cara externa' : 'cara interna'} del hemisferio izquierdo`}>
          <path d={poly(outlines[face])} className={styles.outline} />
          {face === 'medial' && (
            <>
              <ellipse cx={diencephalon.cx} cy={diencephalon.cy} rx={diencephalon.rx} ry={diencephalon.ry} className={styles.cut} />
              <text x={diencephalon.cx} y={diencephalon.cy + 4} className={styles.note}>
                tálamo y corte del tronco
              </text>
            </>
          )}

          {shown.map((g) => {
            const [x, y] = centroid(g.shape)
            return (
              <g key={g.id} className={styles.gyrus} data-selected={g.id === selected.id} onClick={() => setSelectedId(g.id)}>
                <path d={poly(g.shape)} style={{ fill: colorOf(g) }} />
                <text x={x} y={y + 4} className={styles.abbr}>
                  {g.abbr}
                </text>
                <title>{nameOf(g)}</title>
              </g>
            )
          })}

          {face === 'medial' && (
            <>
              <path d={poly(corpusCallosum)} className={styles.callosum} />
              <text x="305" y="146" className={styles.note}>
                cuerpo calloso
              </text>
            </>
          )}
          {fissures[face].map((f) => (
            <path key={f.id} d={line(f.points)} className={styles.fissure}>
              <title>{f.name}</title>
            </path>
          ))}

          <text x={face === 'lateral' ? 24 : 578} y={face === 'lateral' ? 214 : 200} className={styles.note} textAnchor={face === 'lateral' ? 'end' : 'start'}>
            polo frontal
          </text>
        </svg>

        <ul className={styles.key}>
          {shown.map((g) => (
            <li key={g.id}>
              <button data-active={g.id === selected.id} onClick={() => setSelectedId(g.id)}>
                <span className={styles.swatch} style={{ background: colorOf(g) }} />
                <span className={styles.abbrKey}>{g.abbr}</span>
                {nameOf(g)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>
          {lobeName[selected.lobe]} · {face === 'lateral' ? 'cara externa' : 'cara interna'}
        </p>
        <p className={plate.title}>{nameOf(selected)}</p>
        <p className={plate.meta}>
          {today ? `En Testut, ${selected.name.toLowerCase()} (${selected.abbr})` : selected.modern ? `Hoy, ${selected.modern.charAt(0).toLowerCase() + selected.modern.slice(1)} (Netter)` : 'Sin nombre propio en Netter'}
        </p>
        {functions ? (
          <>
            <p className={styles.function}>
              <span className={styles.swatch} style={{ background: selected.localization ? AREA_COLOR[selected.localization.area] : NONE }} />
              {selected.localization ? areaName[selected.localization.area] : 'Sin localización propia en Testut'}
            </p>
            {selected.localization && <p className={styles.text}>{selected.localization.text}</p>}
            <p className={styles.areas}>
              {areas.map((a) => (
                <span key={a}>
                  <span className={styles.swatch} style={{ background: AREA_COLOR[a] }} />
                  {areaName[a]}
                </span>
              ))}
            </p>
          </>
        ) : (
          <>
            <p className={styles.text}>{selected.description}</p>
            <p className={styles.synonyms}>Otros nombres: {selected.synonyms}.</p>
          </>
        )}
      </div>
    </figure>
  )
}
