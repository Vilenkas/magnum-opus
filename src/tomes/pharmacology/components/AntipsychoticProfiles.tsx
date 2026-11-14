import { useState } from 'react'
import { drugById, isWithin } from '../data/catalog'
import { levelWord, PROPERTIES, profiles, sortedBy, type Property } from '../data/antipsychotic-profiles'
import { DrugLink } from './links'
import { Plate } from './Plate'
import styles from './AntipsychoticProfiles.module.css'

/** Lámina: Katzung's cuadro 29-1 as a heat map, sortable by any column. */
export function AntipsychoticProfiles({ numeral = 'I' }: { numeral?: string }) {
  const [sort, setSort] = useState<Property | null>(null)
  const rows = sort ? sortedBy(sort) : profiles
  return (
    <Plate
      numeral={numeral}
      title="El perfil de cada antipsicótico"
      caption="Según Katzung, cuadro 29-1. Ordena por una columna: los que más prefieren D2 sobre 5-HT2A son los típicos y los de más efectos extrapiramidales; el aripiprazol, agonista parcial, es la excepción."
    >
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.drugHead}>Fármaco</th>
              {PROPERTIES.map((p) => (
                <th key={p.id} title={p.hint}>
                  <button
                    type="button"
                    className={`${styles.sort} ${sort === p.id ? styles.on : ''}`}
                    aria-pressed={sort === p.id}
                    onClick={() => setSort(sort === p.id ? null : p.id)}
                  >
                    {p.title}
                    <span aria-hidden>{sort === p.id ? ' ▼' : ''}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const typical = isWithin(drugById.get(r.id)!.classes[0], 'ap-typical')
              return (
                <tr key={r.id}>
                  <th scope="row" className={styles.drug}>
                    <DrugLink id={r.id} />
                    <span className={typical ? styles.tagTypical : styles.tagAtypical}>{typical ? 'típico' : 'atípico'}</span>
                  </th>
                  {PROPERTIES.map((p) => {
                    const v = r.levels[p.id]
                    return (
                      <td key={p.id} className={styles.cell} style={{ ['--v' as string]: v / 4 }} title={levelWord(v)}>
                        {levelWord(v)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Plate>
  )
}
