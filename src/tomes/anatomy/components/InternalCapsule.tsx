import { useState } from 'react'
import { alongPosterior, centroid, nuclei, segments, somatotopy, type Fibres, type Pt, type SegmentId } from '../data/internal-capsule'
import plate from './skeleton/plate.module.css'
import styles from './InternalCapsule.module.css'

const poly = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z'

const KIND: Record<Fibres['kind'], { name: string; color: string }> = {
  motor: { name: 'motoras', color: '#b8322a' },
  sensory: { name: 'sensitivas', color: '#3b5a92' },
  sensorial: { name: 'sensoriales', color: '#c98a2a' },
  association: { name: 'de asociación', color: '#8a7a6c' },
}

/** Lámina: the internal capsule in Flechsig's horizontal cut; each segment, its fibres and its lesion (Testut, figs. 911 and 920). */
export function InternalCapsule() {
  const [selected, setSelected] = useState<SegmentId>('posterior')
  const [lesioned, setLesioned] = useState(false)
  const segment = segments.find((s) => s.id === selected)!

  const pick = (id: SegmentId) => {
    setSelected(id)
    setLesioned(false)
  }

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XIII · La cápsula interna</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Segmento">
        {segments.map((s) => (
          <button key={s.id} className={plate.chip} data-active={s.id === selected} onClick={() => pick(s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox="100 30 320 380" className={styles.svg} role="img" aria-label="Corte horizontal del hemisferio izquierdo por los núcleos grises centrales">
          {nuclei.map((n) => {
            const [x, y] = centroid(n.shape)
            return (
              <g key={n.id}>
                <path d={poly(n.shape)} className={styles.nucleus} data-nucleus={n.id} />
                <text x={x} y={y} className={styles.nucleusName}>
                  {n.name.replace('Cabeza del núcleo ', 'núcleo ').replace('Núcleo ', 'núcleo ').replace('Tálamo óptico', 'tálamo')}
                </text>
              </g>
            )
          })}

          {segments
            .filter((s) => s.shape)
            .map((s) => (
              <path
                key={s.id}
                d={poly(s.shape!)}
                className={styles.segment}
                data-selected={s.id === selected}
                data-lesioned={s.id === selected && lesioned}
                onClick={() => pick(s.id)}
              >
                <title>{s.name}</title>
              </path>
            ))}

          {/* Where the motor fibres for each part of the body pass. */}
          {somatotopy.map((p) => {
            const [x, y] = p.segment === 'genu' ? centroid(segments.find((s) => s.id === 'genu')!.shape!) : alongPosterior(p.at)
            return (
              <g key={p.part} className={styles.somato}>
                <circle cx={x} cy={y} r="4" />
                <text x={x + 30} y={y + 4} textAnchor="start">
                  {p.part}
                </text>
              </g>
            )
          })}

          <text x="410" y="210" className={styles.orient} transform="rotate(90 410 210)">
            línea media
          </text>
          <text x="260" y="40" className={styles.orient}>
            anterior
          </text>
        </svg>

        <div className={styles.side}>
          <p className={plate.kicker}>Fibras que pasan por él</p>
          <ul className={styles.fibres}>
            {segment.fibres.map((f) => (
              <li key={f.name} style={{ borderLeftColor: KIND[f.kind].color }}>
                <strong>{f.name}</strong>
                <span>
                  {KIND[f.kind].name}: {f.course}
                </span>
              </li>
            ))}
          </ul>
          <button className={plate.buttonSolid} onClick={() => setLesioned((l) => !l)}>
            {lesioned ? 'Quitar la lesión' : 'Lesionar este segmento'}
          </button>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{segment.alias ? segment.alias.charAt(0).toUpperCase() + segment.alias.slice(1) : segment.shape ? 'Cápsula interna' : 'Debajo del plano del corte'}</p>
        <p className={plate.title}>{segment.name}</p>
        {lesioned ? <p className={styles.lesion}>{segment.lesion}</p> : <p className={plate.hint}>Lesiona el segmento para ver qué se pierde.</p>}
      </div>
    </figure>
  )
}
