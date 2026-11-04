import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { hardest, pickWeighted, type PracticeStats } from '@/forge/practice'
import { CASE_INFO, describeForm, NUMBER_NAME } from '../grammar/cases'
import { CASES, decline, dictionaryEntry, NUMBERS, type Declension } from '../grammar/nouns'
import {
  analyzePool,
  checkAnalysis,
  checkDeclined,
  declinePool,
  drillStats,
  readingKey,
  type AnalyzeItem,
  type AnalyzeVerdict,
  type DeclineItem,
  type DeclineVerdict,
  type DrillItem,
  type DrillMode,
  type Reading,
} from '../practice/declension-drill'
import plates from './plates.module.css'
import styles from './DeclensionDrill.module.css'

const ROUND = 10
const DECLENSIONS: Declension[] = [1, 2, 3, 4, 5]

const MODES: { id: DrillMode; name: string; description: string }[] = [
  { id: 'decline', name: 'Declina', description: 'Te doy palabra y caso: escribe la forma.' },
  { id: 'analyze', name: 'Analiza', description: 'Te doy una forma: marca todos los casos que puede ser.' },
]

type Result =
  | { item: DeclineItem; input: string; verdict: DeclineVerdict }
  | { item: AnalyzeItem; selected: string[]; verdict: AnalyzeVerdict }

type Phase = 'setup' | 'playing' | 'results'

const readingsText = (readings: Reading[]) => readings.map((r) => describeForm(r.case, r.number)).join(', ')

/** Exercises on a wax tablet: declining forms and analysing ambiguous ones. */
export function DeclensionDrill() {
  const [mode, setMode] = useState<DrillMode>('decline')
  const [declensions, setDeclensions] = useState<Declension[]>([1, 2])
  const [phase, setPhase] = useState<Phase>('setup')
  const [stats, setStats] = useState<PracticeStats>(drillStats.load)
  const [items, setItems] = useState<DrillItem[]>([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<Result[]>([])

  const pool = useMemo<DrillItem[]>(
    () => (mode === 'decline' ? declinePool(declensions) : analyzePool(declensions)),
    [mode, declensions],
  )
  const item = items[index]
  const result = phase === 'playing' ? results[index] : undefined

  const toggleDeclension = (d: Declension) =>
    setDeclensions((prev) =>
      prev.includes(d) ? (prev.length > 1 ? prev.filter((x) => x !== d) : prev) : [...prev, d].sort(),
    )

  const start = () => {
    const ids = pickWeighted(pool, stats, ROUND, Math.random)
    const byId = new Map(pool.map((i) => [i.id, i]))
    setItems(ids.map((id) => byId.get(id)!))
    setResults([])
    setIndex(0)
    setPhase('playing')
  }

  const record = (r: Result) => {
    setResults((prev) => [...prev, r])
    setStats((prev) => drillStats.record(prev, r.item.id, r.verdict.correct))
  }

  const next = () => {
    if (index + 1 >= items.length) setPhase('results')
    else setIndex(index + 1)
  }

  // Enter moves on once answered (the answer forms handle Enter themselves before that).
  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    if (!result) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        nextRef.current()
      }
    }
    // Defer so the Enter that submitted the answer doesn't also skip ahead.
    const t = setTimeout(() => window.addEventListener('keydown', onKey), 0)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [result])

  const score = results.filter((r) => r.verdict.correct).length

  return (
    <figure className={plates.tablet}>
      <div className={plates.wax}>
        <figcaption className={plates.waxCaption}>EXERCITATIO</figcaption>

        {phase === 'setup' && (
          <div className={styles.setup}>
            <div className={styles.modes} role="radiogroup" aria-label="Ejercicio">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={mode === m.id}
                  className={styles.mode}
                  data-active={mode === m.id}
                  onClick={() => setMode(m.id)}
                >
                  <span className={styles.modeName}>{m.name}</span>
                  <span className={styles.modeDescription}>{m.description}</span>
                </button>
              ))}
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Declinaciones:</span>
              {DECLENSIONS.map((d) => (
                <button
                  key={d}
                  className={plates.waxChip}
                  data-active={declensions.includes(d)}
                  onClick={() => toggleDeclension(d)}
                >
                  {d}.ª
                </button>
              ))}
            </div>
            <div className={styles.row}>
              <span className={styles.dim}>{pool.length} preguntas posibles · rondas de {ROUND}</span>
              <button className={plates.waxButton} onClick={start} disabled={pool.length === 0}>
                Comenzar
              </button>
            </div>
            <Hardest stats={stats} mode={mode} />
          </div>
        )}

        {phase === 'playing' && item && (
          <>
            <div className={styles.progress}>
              <span>
                {index + 1} / {items.length}
              </span>
              <span className={styles.progressBar} aria-hidden>
                <span style={{ width: `${((index + (result ? 1 : 0)) / items.length) * 100}%` }} />
              </span>
              <span>
                {score} {score === 1 ? 'acierto' : 'aciertos'}
              </span>
            </div>
            {item.kind === 'decline' ? (
              <DeclineQuestion key={item.id} item={item} result={result} onAnswer={record} />
            ) : (
              <AnalyzeQuestion key={item.id} item={item} result={result} onAnswer={record} />
            )}
            {result && (
              <div className={styles.nextRow}>
                <button className={plates.waxButton} onClick={next} autoFocus>
                  {index + 1 >= items.length ? 'Ver resultado' : 'Siguiente'} →
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'results' && (
          <Results results={results} onAgain={start} onSetup={() => setPhase('setup')} />
        )}
      </div>
    </figure>
  )
}

function DeclineQuestion({
  item,
  result,
  onAnswer,
}: {
  item: DeclineItem
  result?: Result
  onAnswer: (r: Result) => void
}) {
  const [input, setInput] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (result || !input.trim()) return
    onAnswer({ item, input, verdict: checkDeclined(item, input) })
  }
  const verdict = result?.verdict as DeclineVerdict | undefined

  return (
    <form className={styles.question} onSubmit={submit}>
      <p className={styles.entry}>
        {dictionaryEntry(item.noun)} <span className={styles.dim}>«{item.noun.meaning}»</span>
      </p>
      <p className={styles.ask}>
        {CASE_INFO[item.case].name} <span className={styles.askNumber}>{NUMBER_NAME[item.number]}</span>
      </p>
      <div className={styles.answerRow}>
        <input
          className={plates.waxInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!!result}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder="escribe la forma…"
          aria-label={`${describeForm(item.case, item.number)} de ${item.noun.lemma}`}
        />
        {!result && (
          <button type="submit" className={plates.waxButton} disabled={!input.trim()}>
            Comprobar
          </button>
        )}
      </div>
      {verdict && (
        <p className={styles.feedback} data-correct={verdict.correct} role="status">
          {verdict.correct ? '✓ ' : '✗ '}
          <FormWithEnding item={item} />
          {!verdict.correct && verdict.actually.length > 0 && (
            <span className={styles.dim}>
              {' '}
              · «{(result as { input: string }).input.trim()}» es {readingsText(verdict.actually)}
            </span>
          )}
        </p>
      )}
    </form>
  )
}

/** The right answer with its ending picked out. */
function FormWithEnding({ item }: { item: DeclineItem }) {
  const form = decline(item.noun)[item.number][item.case]
  return (
    <span className={styles.answer}>
      {form.ending ? (
        <>
          {form.stem}
          <span className={styles.answerEnding}>{form.ending}</span>
        </>
      ) : (
        form.form
      )}
    </span>
  )
}

function AnalyzeQuestion({
  item,
  result,
  onAnswer,
}: {
  item: AnalyzeItem
  result?: Result
  onAnswer: (r: Result) => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const verdict = result?.verdict as AnalyzeVerdict | undefined
  const expected = new Set(item.readings.map(readingKey))

  const toggle = (key: string) => {
    if (result) return
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }
  const submit = () => {
    if (result || selected.length === 0) return
    onAnswer({ item, selected, verdict: checkAnalysis(item, selected) })
  }

  const stateOf = (key: string) => {
    const chosen = selected.includes(key)
    if (!verdict) return chosen ? 'chosen' : 'idle'
    if (expected.has(key)) return chosen ? 'right' : 'missed'
    return chosen ? 'wrong' : 'idle'
  }

  return (
    <div className={styles.question}>
      <p className={styles.written}>{item.written}</p>
      <p className={styles.entry}>
        de {dictionaryEntry(item.noun)} <span className={styles.dim}>«{item.noun.meaning}»</span>
      </p>
      <p className={styles.dim}>Marca todos los casos que puede ser (como en los textos, sin macrones).</p>

      <div className={styles.grid} role="group" aria-label="Casos posibles">
        <span />
        {NUMBERS.map((n) => (
          <span key={n} className={styles.gridHead}>
            {NUMBER_NAME[n]}
          </span>
        ))}
        {CASES.map((c) => (
          <Row key={c} label={CASE_INFO[c].name}>
            {NUMBERS.map((n) => {
              const key = `${c}.${n}`
              return (
                <button
                  key={key}
                  className={styles.cell}
                  data-state={stateOf(key)}
                  aria-pressed={selected.includes(key)}
                  onClick={() => toggle(key)}
                  disabled={!!result}
                >
                  {stateOf(key) === 'missed' ? 'faltó' : selected.includes(key) ? '✓' : ''}
                </button>
              )
            })}
          </Row>
        ))}
      </div>

      {!result ? (
        <div className={styles.nextRow}>
          <button className={plates.waxButton} onClick={submit} disabled={selected.length === 0}>
            Comprobar
          </button>
        </div>
      ) : (
        <p className={styles.feedback} data-correct={verdict!.correct} role="status">
          {verdict!.correct ? '✓ Exacto: ' : '✗ Puede ser: '}
          {readingsText(item.readings)}.
        </p>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <span className={styles.gridLabel}>{label}</span>
      {children}
    </>
  )
}

function Hardest({ stats, mode }: { stats: PracticeStats; mode: DrillMode }) {
  const prefix = mode === 'decline' ? 'd:' : 'a:'
  const own = Object.fromEntries(Object.entries(stats).filter(([id]) => id.startsWith(prefix)))
  const list = hardest(own, 4)
  if (list.length === 0) return null
  const describe = (id: string) => {
    const [, noun, rest] = id.split(':')
    if (mode === 'analyze') return `${rest}`
    const [c, n] = rest.split('.') as [keyof typeof CASE_INFO, 'sg' | 'pl']
    return `${noun} · ${describeForm(c, n)}`
  }
  return (
    <p className={styles.dim}>
      Te cuestan más: {list.map(({ id, stat }) => `${describe(id)} (${stat.wrong}/${stat.seen})`).join(' · ')}
    </p>
  )
}

function Results({ results, onAgain, onSetup }: { results: Result[]; onAgain: () => void; onSetup: () => void }) {
  const score = results.filter((r) => r.verdict.correct).length
  const missed = results.filter((r) => !r.verdict.correct)
  const ratio = results.length ? score / results.length : 0
  const verdict = ratio === 1 ? 'Optime!' : ratio >= 0.8 ? 'Bene!' : ratio >= 0.5 ? 'Satis bene.' : 'Iterum!'
  return (
    <div className={styles.results}>
      <p className={styles.score}>
        {score}/{results.length} <span className={styles.scoreWord}>{verdict}</span>
      </p>
      {missed.length > 0 && (
        <ul className={styles.missed}>
          {missed.map((r) => (
            <li key={r.item.id}>
              {r.item.kind === 'decline' ? (
                <>
                  {r.item.noun.lemma}, {describeForm(r.item.case, r.item.number)}: <strong>{r.item.answer}</strong>
                </>
              ) : (
                <>
                  <strong>{r.item.written}</strong>: {readingsText(r.item.readings)}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.nextRow}>
        <button className={plates.waxGhost} onClick={onSetup}>
          Cambiar ejercicio
        </button>
        <button className={plates.waxButton} onClick={onAgain} autoFocus>
          Otra ronda
        </button>
      </div>
    </div>
  )
}
