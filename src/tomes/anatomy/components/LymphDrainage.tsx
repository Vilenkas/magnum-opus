import { useMemo, useState } from 'react'
import { LYMPH_LESIONS, TERRITORIES, anglesOf, lymphNodeById, routesOf, type LymphLesionId, type Side } from '../data/lymph-drainage'
import plate from './skeleton/plate.module.css'
import styles from './LymphDrainage.module.css'

/** The body from the front: the person's right on the viewer's left. */
const SHAPES: { territory: string; d: string }[] = [
  { territory: 'head-neck-right', d: 'M 120 14 A 26 26 0 0 0 120 66 L 120 80 L 108 80 L 108 64 Z' },
  { territory: 'head-neck-left', d: 'M 120 14 A 26 26 0 0 1 120 66 L 120 80 L 132 80 L 132 64 Z' },
  { territory: 'upper-intercostal-right', d: 'M 80 80 L 120 80 L 120 125 L 80 125 Z' },
  { territory: 'upper-intercostal-left', d: 'M 120 80 L 160 80 L 160 125 L 120 125 Z' },
  { territory: 'lower-intercostal-right', d: 'M 80 125 L 120 125 L 120 170 L 82 170 Z' },
  { territory: 'lower-intercostal-left', d: 'M 120 125 L 160 125 L 158 170 L 120 170 Z' },
  { territory: 'breast-right', d: 'M 86 125 A 14 14 0 1 0 114 125 A 14 14 0 1 0 86 125 Z' },
  { territory: 'breast-left', d: 'M 126 125 A 14 14 0 1 0 154 125 A 14 14 0 1 0 126 125 Z' },
  { territory: 'upper-limb-right', d: 'M 80 82 L 62 92 L 46 230 L 60 234 L 78 120 Z' },
  { territory: 'upper-limb-left', d: 'M 160 82 L 178 92 L 194 230 L 180 234 L 162 120 Z' },
  { territory: 'abdominal-viscera', d: 'M 82 170 L 158 170 L 160 235 L 80 235 Z' },
  { territory: 'pelvic-viscera', d: 'M 80 235 L 160 235 L 152 266 L 88 266 Z' },
  { territory: 'lower-limb-right', d: 'M 88 266 L 119 266 L 114 410 L 94 410 Z' },
  { territory: 'lower-limb-left', d: 'M 121 266 L 152 266 L 146 410 L 126 410 Z' },
]

const destination = (angles: Side[]) => (angles.length === 0 ? 'none' : angles.length === 2 ? 'both' : angles[0])

const DUCT_ES: Record<string, string> = {
  right: 'Conducto linfático derecho → ángulo venoso derecho',
  left: 'Conducto torácico → ángulo venoso izquierdo',
  both: 'A los dos conductos',
  none: 'Sin vía principal',
}

/** Lámina VII of Angiología: where the lymph of every territory goes. */
export function LymphDrainage() {
  const [selected, setSelected] = useState('lower-limb-right')
  const [lesionId, setLesionId] = useState<LymphLesionId | null>(null)
  const lesion = LYMPH_LESIONS.find((l) => l.id === lesionId)
  const removed = useMemo(() => lesion?.removes ?? [], [lesion])
  const dest = useMemo(() => new Map(TERRITORIES.map((t) => [t.id, destination(anglesOf(t.id, removed))])), [removed])
  const routes = routesOf(selected, removed)
  const normalRoutes = routesOf(selected)
  const shown = routes.length ? routes : normalRoutes
  const territory = lymphNodeById.get(selected)!

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina VII · Adónde va la linfa</figcaption>
      <div className={plate.chipBar} role="group" aria-label="Lesión">
        <button className={plate.chip} data-active={lesionId === null} onClick={() => setLesionId(null)}>
          Sin lesión
        </button>
        {LYMPH_LESIONS.map((l) => (
          <button key={l.id} className={plate.chip} data-active={l.id === lesionId} aria-pressed={l.id === lesionId} onClick={() => setLesionId(l.id)}>
            {l.es}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div>
          <svg viewBox="0 0 240 420" className={styles.figure} role="img" aria-label="El cuerpo de frente, coloreado según el conducto al que va su linfa">
            {SHAPES.map((s) => (
              <path
                key={s.territory}
                d={s.d}
                className={styles.zone}
                data-dest={dest.get(s.territory)}
                data-selected={s.territory === selected}
                onClick={() => setSelected(s.territory)}
              >
                <title>{lymphNodeById.get(s.territory)!.es}</title>
              </path>
            ))}
            <text x={60} y={20} textAnchor="middle" className={styles.side}>
              derecha
            </text>
            <text x={180} y={20} textAnchor="middle" className={styles.side}>
              izquierda
            </text>
          </svg>
          <ul className={styles.key}>
            {(['right', 'left', 'both', 'none'] as const).map((k) => (
              <li key={k} data-dest={k}>
                {DUCT_ES[k]}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panel} aria-live="polite">
          <div className={styles.picker} role="group" aria-label="Territorio">
            {TERRITORIES.map((t) => (
              <button key={t.id} className={styles.pick} data-dest={dest.get(t.id)} data-active={t.id === selected} onClick={() => setSelected(t.id)}>
                {t.es}
              </button>
            ))}
          </div>
          <p className={plate.kicker}>{DUCT_ES[dest.get(selected)!]}</p>
          <h3 className={plate.title}>{territory.es}</h3>
          {!routes.length && <p className={styles.lost}>Con esta lesión pierde su vía principal. Su recorrido normal era:</p>}
          {shown.slice(0, 3).map((route) => (
            <ol key={route.join('>')} className={styles.route}>
              {route.slice(1).map((id) => {
                const n = lymphNodeById.get(id)!
                return (
                  <li key={id} data-kind={n.kind} data-cut={removed.includes(id)}>
                    {n.es}
                  </li>
                )
              })}
            </ol>
          ))}
          {lesion && <p className={styles.text}>{lesion.text}</p>}
        </div>
      </div>

      <div className={plate.legend}>
        <p className={plate.hint}>
          El color de cada zona no está pintado a mano: es el conducto al que llegan sus caminos por los nodos y los troncos. La división es la de
          siempre, el cuadrante superior derecho contra todo lo demás, con dos excepciones que salen del recorrido: los espacios intercostales inferiores
          del lado derecho, que bajan a la cisterna del quilo, y parte del pulmón izquierdo, que cruza a la derecha. Según Latarjet y Ruiz Liard, t. 2, pp.
          1012–1022, y t. 1, pp. 598–599, 797–798; Moore 8.ª, p. 44.
        </p>
      </div>
    </figure>
  )
}
