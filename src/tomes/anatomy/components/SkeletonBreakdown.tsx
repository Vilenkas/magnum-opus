import { useState } from 'react'
import styles from './SkeletonBreakdown.module.css'

interface Region {
  name: string
  count: number
}

interface Division {
  id: 'axial' | 'appendicular'
  name: string
  description: string
  regions: Region[]
}

const divisions: Division[] = [
  {
    id: 'axial',
    name: 'Esqueleto axial',
    description: 'El eje central del cuerpo: protege el encéfalo, la médula y las vísceras torácicas.',
    regions: [
      { name: 'Cráneo', count: 22 },
      { name: 'Huesecillos del oído', count: 6 },
      { name: 'Hioides', count: 1 },
      { name: 'Columna vertebral', count: 26 },
      { name: 'Tórax (esternón y costillas)', count: 25 },
    ],
  },
  {
    id: 'appendicular',
    name: 'Esqueleto apendicular',
    description: 'Los miembros y las cinturas que los unen al eje: el esqueleto del movimiento.',
    regions: [
      { name: 'Cintura escapular', count: 4 },
      { name: 'Miembros superiores', count: 60 },
      { name: 'Cintura pélvica', count: 2 },
      { name: 'Miembros inferiores', count: 60 },
    ],
  },
]

const total = (d: Division) => d.regions.reduce((sum, r) => sum + r.count, 0)
const grandTotal = divisions.reduce((sum, d) => sum + total(d), 0)

/** Interactive split of the adult skeleton into its two divisions. */
export function SkeletonBreakdown() {
  const [selected, setSelected] = useState<Division['id']>('axial')
  const active = divisions.find((d) => d.id === selected)!

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        Lámina I · Los {grandTotal} huesos del esqueleto adulto
      </figcaption>

      <div className={styles.bar} role="tablist" aria-label="División del esqueleto">
        {divisions.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === selected}
            onClick={() => setSelected(d.id)}
            className={styles.segment}
            data-active={d.id === selected}
            style={{ flexGrow: total(d) }}
          >
            <span className={styles.segmentCount}>{total(d)}</span>
            <span className={styles.segmentName}>{d.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.detail} role="tabpanel">
        <p className={styles.description}>{active.description}</p>
        <ul className={styles.regions}>
          {active.regions.map((r) => (
            <li key={r.name}>
              <span>{r.name}</span>
              <span className={styles.dots} aria-hidden />
              <span className={styles.count}>{r.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
