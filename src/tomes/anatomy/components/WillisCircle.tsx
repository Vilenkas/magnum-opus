import { useId, useMemo, useState } from 'react'
import { ARTERY_NAME, CORTICAL, DEEP, lostGyri, NODES, perfused, reached, softened, SYNDROME, vesselById, vessels, type Artery, type Vessel } from '../data/cerebral-arteries'
import { areaName, corpusCallosum, diencephalon, fissures, onFace, outlines, type Face, type Pt } from '../data/gyri'
import plate from './skeleton/plate.module.css'
import styles from './WillisCircle.module.css'

/** Testut's figs. 1009–1011 colour the territories: anterior blue, silvian red, posterior yellow. */
const TERRITORY_COLOUR: Record<Exclude<Artery, 'acha'>, string> = { aca: '#8fa8cf', mca: '#d99a8c', pca: '#e8d27e' }

const OCCLUSIONS = ['carotid-left', 'basilar', 'a1-left', 'aca-left', 'mca-left', 'pca-left', 'acha-left'] as const

const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`
const ends = (v: Vessel): [Pt, Pt] => [NODES[v.from], Array.isArray(v.to) ? v.to : NODES[v.to]]

/** Lámina: the circle of Willis and what each occlusion softens (Testut pp. 1195–1224, figs. 992, 1009–1011). */
export function WillisCircle() {
  const [occluded, setOccluded] = useState<string | null>('carotid-left')
  const [communicating, setCommunicating] = useState(true)
  const hatch = useId()

  const state = useMemo(() => ({ occluded: new Set(occluded ? [occluded] : []), communicating }), [occluded, communicating])
  const nodes = useMemo(() => reached(state), [state])
  const lost = useMemo(() => softened(state, 'left'), [state])
  const gyriLost = useMemo(() => lostGyri(lost), [lost])
  const vessel = occluded ? vesselById.get(occluded)! : null

  const toggle = (id: string) => setOccluded((o) => (o === id ? null : id))

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XVII · El polígono de Willis y los territorios arteriales</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Oclusión">
        <button className={plate.chip} data-active={!occluded} onClick={() => setOccluded(null)}>
          Ninguna
        </button>
        {OCCLUSIONS.map((id) => (
          <button key={id} className={plate.chip} data-active={id === occluded} onClick={() => setOccluded(id)}>
            {vesselById.get(id)!.name.replace(' izquierda', '').replace(', antes de la comunicante', ' (A1)')}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={!communicating} aria-pressed={!communicating} onClick={() => setCommunicating((c) => !c)}>
          Comunicantes filiformes
        </button>
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 300 340" className={styles.circle} role="img" aria-label="El polígono de Willis visto desde abajo">
          <Base />
          {vessels.map((v) => {
            const [a, b] = ends(v)
            const on = perfused(v, state, nodes)
            const thin = v.kind === 'communicating' && !communicating
            return (
              <g key={v.id} className={styles.vessel} data-kind={v.kind} data-territory={v.territory} data-thin={thin} data-on={on} data-occluded={v.id === occluded} onClick={() => toggle(v.id)}>
                <title>{v.name}</title>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={styles.hit} />
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={styles.wall} />
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={styles.blood} />
                {v.id === occluded && <Clot at={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]} />}
              </g>
            )
          })}
          <Labels />
        </svg>

        <div className={styles.faces}>
          {(['lateral', 'medial'] as Face[]).map((face) => (
            <HemisphereFace key={face} face={face} lost={lost} hatch={hatch} />
          ))}
          <p className={plate.hint}>Hemisferio izquierdo. Pulsa un vaso del polígono para ocluirlo.</p>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{vessel ? `Oclusión: ${vessel.name.toLowerCase()}` : 'Sin oclusión'}</p>
        {lost.size === 0 ? (
          <>
            <p className={plate.title}>Nada se reblandece</p>
            <p className={styles.text}>
              {vessel
                ? vessel.kind === 'terminal'
                  ? 'El vaso cerrado es del otro hemisferio.'
                  : 'El polígono suple al tronco cerrado: la sangre de los otros llega por los vasos del círculo, en el sentido que haga falta, hasta las arterias que nacen de él.'
                : 'Cuatro troncos, las dos carótidas internas y las dos vertebrales, desembocan en un círculo cerrado por tres comunicantes. De él nacen las arterias del cerebro, que más allá ya no tienen sustituto.'}
              {!communicating && ' Con comunicantes filiformes, cada tronco queda casi solo con su dominio.'}
            </p>
          </>
        ) : (
          <>
            <p className={plate.title}>Reblandecimiento: {[...lost].map((a) => ARTERY_NAME[a].toLowerCase()).join(', ')}</p>
            {[...lost].map((a) => (
              <p key={a} className={styles.text}>
                <strong>{ARTERY_NAME[a]}.</strong> {SYNDROME[a]} En profundidad: {DEEP[a].join('; ')}.
              </p>
            ))}
            {gyriLost.length > 0 && (
              <ul className={styles.areas}>
                {gyriLost.map((g) => (
                  <li key={g.id}>
                    <span>{g.name}</span>
                    {g.localization && <em> · {areaName[g.localization.area]}</em>}
                  </li>
                ))}
              </ul>
            )}
            {vessel && vessel.kind !== 'terminal' && !communicating && <p className={styles.text}>Con comunicantes permeables, el polígono lo habría suplido.</p>}
          </>
        )}
      </div>
    </figure>
  )
}

function Clot({ at: [x, y] }: { at: Pt }) {
  return (
    <g className={styles.clot}>
      <circle cx={x} cy={y} r="6" />
      <path d={`M${x - 3.5} ${y - 3.5} L${x + 3.5} ${y + 3.5} M${x + 3.5} ${y - 3.5} L${x - 3.5} ${y + 3.5}`} />
    </g>
  )
}

/** The base of the brain under the circle: chiasm, hypophysis stalk, mammillary bodies, pons. */
function Base() {
  return (
    <g className={styles.base}>
      <path d="M118 74 L140 92 L160 92 L182 74 M140 92 L150 104 L160 92 M150 104 L130 136 M150 104 L170 136" className={styles.chiasm} />
      <circle cx="150" cy="122" r="7" className={styles.stalk} />
      <circle cx="143" cy="168" r="6" className={styles.stalk} />
      <circle cx="157" cy="168" r="6" className={styles.stalk} />
      <ellipse cx="150" cy="252" rx="58" ry="40" className={styles.pons} />
    </g>
  )
}

function Labels() {
  const t = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'start') => (
    <text x={x} y={y} textAnchor={anchor} className={styles.label}>
      {s}
    </text>
  )
  return (
    <g pointerEvents="none">
      {t(150, 9, 'delante', 'middle')}
      {t(178, 30, 'c. anterior')}
      {t(128, 70, 'com. ant.', 'end')}
      {t(236, 92, 'silviana')}
      {t(262, 166, 'coroidea ant.', 'middle')}
      {t(222, 186, 'carótida int.')}
      {t(182, 192, 'com. post.', 'end')}
      {t(226, 272, 'c. posterior')}
      {t(158, 252, 'basilar')}
      {t(184, 333, 'vertebrales')}
      {t(296, 302, 'lado izquierdo →', 'end')}
    </g>
  )
}

/** Under the corpus callosum, down to the hippocampal gyrus: septum and diencephalon, not cortex. */
const MEDIAL_CORE: Pt[] = [
  ...Array.from({ length: 19 }, (_, i): Pt => {
    const a = Math.PI + (Math.PI * i) / 18
    return [305 + 108 * Math.cos(a), 195 + 56 * Math.sin(a)]
  }),
  [432, 204],
  [424, 238],
  [380, 249],
  [300, 251],
  [230, 241],
  [182, 214],
]

/** One face of the left hemisphere with its cortical territories; a softened one is hatched. */
function HemisphereFace({ face, lost, hatch }: { face: Face; lost: ReadonlySet<Artery>; hatch: string }) {
  const clip = `${hatch}-${face}`
  const fill = (a: Exclude<Artery, 'acha'>) => (lost.has(a) ? `url(#${clip}-h)` : TERRITORY_COLOUR[a])
  return (
    <svg viewBox="0 0 600 380" className={styles.face} role="img" aria-label={face === 'lateral' ? 'Cara externa' : 'Cara interna'}>
      <defs>
        <clipPath id={clip}>
          <path d={poly(outlines[face])} />
        </clipPath>
        <pattern id={`${clip}-h`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="9" height="9" fill="#5b4a40" />
          <line x1="0" y1="0" x2="0" y2="9" stroke="#f6efe0" strokeWidth="2.4" />
        </pattern>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d={poly(outlines[face])} fill={fill('mca')} className={styles.territory} />
        <path d={poly(CORTICAL[face].aca)} fill={fill('aca')} className={styles.territory} />
        <path d={poly(CORTICAL[face].pca)} fill={fill('pca')} className={styles.territory} />
        {onFace(face).map((g) => (
          <path key={g.id} d={poly(g.shape)} className={styles.gyrus} />
        ))}
      </g>
      {face === 'medial' && (
        <g>
          <path d={poly(MEDIAL_CORE)} className={styles.core} />
          <path d={poly(corpusCallosum)} className={styles.callosum} />
          <ellipse cx={diencephalon.cx} cy={diencephalon.cy} rx={diencephalon.rx} ry={diencephalon.ry} className={styles.callosum} />
        </g>
      )}
      <path d={poly(outlines[face])} className={styles.outline} />
      {fissures[face].map((f) => (
        <path key={f.id} d={`M${f.points.map(([x, y]) => `${x} ${y}`).join(' L')}`} className={styles.fissure} />
      ))}
      <text x="300" y="374" textAnchor="middle" className={styles.faceName}>
        {face === 'lateral' ? 'Cara externa' : 'Cara interna'}
      </text>
    </svg>
  )
}
