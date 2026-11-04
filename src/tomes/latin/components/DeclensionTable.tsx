import { useMemo, useState } from 'react'
import { nounById, nouns, type VocabNoun } from '../data/nouns'
import { CASE_INFO, DECLENSION_HINT, DECLENSION_NAME, GENDER_NAME } from '../grammar/cases'
import { CASES, decline, dictionaryEntry, withoutMacrons, type Case, type Declension, type Form } from '../grammar/nouns'
import plates from './plates.module.css'
import styles from './DeclensionTable.module.css'

const DECLENSIONS: Declension[] = [1, 2, 3, 4, 5]

/** Interactive paradigm of any noun: stem in ink, ending in minium. */
export function DeclensionTable({ initial = 'rosa' }: { initial?: string }) {
  const [nounId, setNounId] = useState(initial)
  const [macrons, setMacrons] = useState(true)
  const [activeCase, setActiveCase] = useState<Case | null>(null)

  const noun = nounById.get(nounId) ?? nouns[0]
  const paradigm = useMemo(() => decline(noun), [noun])
  const info = activeCase ? CASE_INFO[activeCase] : null

  return (
    <figure className={plates.slab}>
      <figcaption className={plates.caption}>TABVLA · DECLINATIONVM</figcaption>

      <div className={styles.picker} role="group" aria-label="Elegir sustantivo">
        {DECLENSIONS.map((d) => (
          <div key={d} className={styles.pickerRow}>
            <span className={styles.pickerLabel}>{d}.ª</span>
            {nouns
              .filter((n) => n.declension === d)
              .map((n) => (
                <button key={n.id} className={plates.chip} data-active={n.id === noun.id} onClick={() => setNounId(n.id)}>
                  {n.lemma}
                </button>
              ))}
          </div>
        ))}
      </div>

      <NounHeader noun={noun} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Caso</th>
            <th scope="col">Singular</th>
            <th scope="col">Plural</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => (
            <tr
              key={c}
              data-active={c === activeCase}
              onMouseEnter={() => setActiveCase(c)}
              onMouseLeave={() => setActiveCase(null)}
              onFocus={() => setActiveCase(c)}
              tabIndex={0}
            >
              <th scope="row">
                <span className={styles.caseAbbr}>{CASE_INFO[c].abbr}</span> {CASE_INFO[c].name}
              </th>
              <td>
                <FormCell form={paradigm.sg[c]} macrons={macrons} />
              </td>
              <td>
                <FormCell form={paradigm.pl[c]} macrons={macrons} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.footer}>
        <p className={styles.caseInfo} aria-live="polite">
          {info ? (
            <>
              <strong>{info.name}:</strong> {info.role}. <em>{info.question}</em>
            </>
          ) : (
            'Pasa el cursor por un caso para ver para qué sirve.'
          )}
        </p>
        <label className={styles.toggle}>
          <input type="checkbox" checked={macrons} onChange={(e) => setMacrons(e.target.checked)} />
          Macrones (vocales largas)
        </label>
      </div>
    </figure>
  )
}

function NounHeader({ noun }: { noun: VocabNoun }) {
  return (
    <div className={styles.header}>
      <p className={styles.entry}>{dictionaryEntry(noun)}</p>
      <p className={styles.meaning}>
        «{noun.meaning}» · {GENDER_NAME[noun.gender]} · {DECLENSION_NAME[noun.declension]}{' '}
        <span className={styles.hint}>({DECLENSION_HINT[noun.declension]})</span>
      </p>
      {noun.derivatives && noun.derivatives.length > 0 && (
        <p className={styles.derivatives}>En español: {noun.derivatives.join(', ')}</p>
      )}
    </div>
  )
}

function FormCell({ form, macrons }: { form: Form; macrons: boolean }) {
  const show = (s: string) => (macrons ? s : withoutMacrons(s))
  if (!form.ending) return <span className={styles.form}>{show(form.form)}</span>
  return (
    <span className={styles.form}>
      {show(form.stem)}
      <span className={plates.ending}>{show(form.ending)}</span>
    </span>
  )
}
