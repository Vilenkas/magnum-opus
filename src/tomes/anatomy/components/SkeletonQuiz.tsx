import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { pieceById, regionOf, regions, type BonePiece, type RegionId } from '../data/skeleton'
import { checkTyped, type TypedVerdict } from '../quiz/answer'
import { buildPool, createRound, type Question, type QuizMode, type QuizSettings } from '../quiz/engine'
import { hardestPieces, loadStats, recordAnswer, type QuizStats } from '../quiz/stats'
import { SkeletonStage, type Focus, type PieceLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './SkeletonQuiz.module.css'

const MODES: { id: QuizMode; name: string; description: string }[] = [
  { id: 'identify', name: 'Identifica', description: 'Se resalta una pieza: elige su nombre entre cuatro.' },
  { id: 'locate', name: 'Señala', description: 'Te doy un nombre: haz clic en la pieza.' },
  { id: 'type', name: 'Escribe', description: 'Se resalta una pieza: escribe su nombre.' },
]

const LENGTHS = [10, 20, 30]

interface Answer {
  targetId: string
  correct: boolean
  /** Piece id chosen (identify/locate) or raw text (type). */
  given: string | null
  verdict?: TypedVerdict
}

type Phase = 'setup' | 'playing' | 'results'

/** Lámina III: practice on the 3D skeleton. */
export function SkeletonQuiz() {
  const [settings, setSettings] = useState<QuizSettings>({
    mode: 'identify',
    region: 'all',
    includeNonBone: false,
    length: 10,
  })
  const [phase, setPhase] = useState<Phase>('setup')
  const [stats, setStats] = useState<QuizStats>(loadStats)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })

  const question = questions[index]
  const target = question ? pieceById.get(question.targetId)! : undefined
  const answer = phase === 'playing' ? answers[index] : undefined
  const poolSize = useMemo(() => buildPool(settings).length, [settings])

  const frameRegion = (region: RegionId | 'all'): Focus =>
    region === 'all' ? { kind: 'all' } : { kind: 'region', region }

  const frameQuestion = useCallback(
    (q: Question, s: QuizSettings): Focus =>
      s.mode === 'locate' ? frameRegion(s.region) : { kind: 'piece', id: q.targetId, context: 3 },
    [],
  )

  const start = (s = settings) => {
    const round = createRound(s, stats)
    setQuestions(round)
    setAnswers([])
    setIndex(0)
    setPhase('playing')
    setFocus(frameQuestion(round[0], s))
  }

  const submit = (correct: boolean, given: string | null, verdict?: TypedVerdict) => {
    if (!target || answer) return
    setAnswers((prev) => [...prev, { targetId: target.id, correct, given, verdict }])
    setStats((prev) => recordAnswer(prev, target.id, correct))
    // Show where the right answer was when the user pointed elsewhere.
    if (settings.mode === 'locate') setFocus({ kind: 'piece', id: target.id, context: 3 })
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('results')
      setFocus(frameRegion(settings.region))
      return
    }
    setIndex(index + 1)
    setFocus(frameQuestion(questions[index + 1], settings))
  }

  const changeRegion = (region: RegionId | 'all') => {
    setSettings((s) => ({ ...s, region }))
    setFocus(frameRegion(region))
  }

  // --- 3D state ------------------------------------------------------------

  const inScope = useCallback(
    (p: BonePiece) => settings.region === 'all' || regionOf(p).id === settings.region,
    [settings.region],
  )

  const missedIds = useMemo(() => new Set(answers.filter((a) => !a.correct).map((a) => a.targetId)), [answers])

  const lookOf = useCallback(
    (p: BonePiece, hovered: string | null): PieceLook => {
      if (phase === 'setup') return inScope(p) ? 'base' : 'faded'
      if (phase === 'results') return missedIds.has(p.id) ? 'wrong' : inScope(p) ? 'base' : 'faded'

      const isTarget = p.id === target?.id
      if (settings.mode === 'locate') {
        if (answer) {
          if (isTarget) return 'correct'
          if (p.id === answer.given) return 'wrong'
        } else if (p.id === hovered) {
          return 'hover'
        }
        return inScope(p) ? 'base' : 'faded'
      }
      // identify / type: the target is marked; everything else is translucent context,
      // so deep pieces (palatine, ethmoid, ossicles) are visible through the skull.
      if (isTarget) return answer ? (answer.correct ? 'correct' : 'wrong') : 'selected'
      return 'ghost'
    },
    [phase, inScope, missedIds, target, settings.mode, answer],
  )

  // Only "locate" questions are answered by clicking; elsewhere hovering must not give hints.
  const isPickable = useCallback(
    (p: BonePiece) => phase === 'playing' && settings.mode === 'locate' && !answer && inScope(p),
    [phase, settings.mode, answer, inScope],
  )

  const handlePick = (id: string | null) => {
    if (!id || !target || settings.mode !== 'locate' || answer) return
    submit(id === target.id, id)
  }

  // --- Keyboard: 1-4 to answer, Enter to continue ---------------------------

  const nextRef = useRef(next)
  nextRef.current = next
  const optionRef = useRef<(i: number) => void>(() => {})
  optionRef.current = (i: number) => {
    const id = question?.options?.[i]
    if (id && target && !answer) submit(id === target.id, id)
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'Enter' && answer) nextRef.current()
      if (settings.mode === 'identify' && ['1', '2', '3', '4'].includes(e.key)) optionRef.current(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer, settings.mode])

  // --- Render ---------------------------------------------------------------

  const score = answers.filter((a) => a.correct).length

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · Examen de osteología</figcaption>

      {phase === 'playing' ? (
        <div className={styles.progress}>
          <span>
            Pregunta {index + 1} de {questions.length}
          </span>
          <span className={styles.progressBar} aria-hidden>
            <span style={{ width: `${((index + (answer ? 1 : 0)) / questions.length) * 100}%` }} />
          </span>
          <span>
            {score} {score === 1 ? 'acierto' : 'aciertos'}
          </span>
        </div>
      ) : (
        <div className={plate.chipBar} role="toolbar" aria-label="Región a practicar">
          <button className={plate.chip} data-active={settings.region === 'all'} onClick={() => changeRegion('all')}>
            Todo
          </button>
          {regions.map((r) => (
            <button
              key={r.id}
              className={plate.chip}
              data-active={settings.region === r.id}
              onClick={() => changeRegion(r.id)}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      <SkeletonStage lookOf={lookOf} isPickable={isPickable} focus={focus} onPick={handlePick}>
        {phase === 'playing' && settings.mode === 'locate' && target && (
          <div className={styles.locatePrompt}>
            Señala: <strong>{target.name}</strong>
          </div>
        )}
      </SkeletonStage>

      <div className={plate.legend}>
        {phase === 'setup' && (
          <Setup settings={settings} poolSize={poolSize} stats={stats} onChange={setSettings} onStart={() => start()} />
        )}
        {phase === 'playing' && target && question && (
          <>
            {settings.mode === 'identify' && (
              <IdentifyPanel question={question} target={target} answer={answer} onAnswer={optionRef.current} />
            )}
            {settings.mode === 'locate' && <LocatePanel target={target} answer={answer} />}
            {settings.mode === 'type' && (
              <TypePanel
                key={index}
                target={target}
                answer={answer}
                onSubmit={(text) => {
                  const verdict = checkTyped(text, target)
                  // Empty or incomplete answers aren't graded: the user can add detail.
                  if (!verdict.correct && (verdict.reason === 'empty' || verdict.reason === 'incomplete')) {
                    return verdict.reason
                  }
                  submit(verdict.correct, text, verdict)
                  return null
                }}
                onGiveUp={() => submit(false, null, { correct: false, reason: 'wrong-bone' })}
              />
            )}
            {answer && (
              <div className={styles.nextRow}>
                <button className={plate.buttonSolid} onClick={next} autoFocus>
                  {index + 1 >= questions.length ? 'Ver resultados' : 'Siguiente'} →
                </button>
              </div>
            )}
          </>
        )}
        {phase === 'results' && (
          <Results answers={answers} stats={stats} onAgain={() => start()} onSetup={() => setPhase('setup')} />
        )}
      </div>
    </figure>
  )
}

function Setup({
  settings,
  poolSize,
  stats,
  onChange,
  onStart,
}: {
  settings: QuizSettings
  poolSize: number
  stats: QuizStats
  onChange: (s: QuizSettings) => void
  onStart: () => void
}) {
  const hardest = hardestPieces(stats)
  return (
    <div className={styles.setup}>
      <div className={styles.modes} role="radiogroup" aria-label="Modo">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={settings.mode === m.id}
            className={styles.mode}
            data-active={settings.mode === m.id}
            onClick={() => onChange({ ...settings, mode: m.id })}
          >
            <span className={styles.modeName}>{m.name}</span>
            <span className={styles.modeDescription}>{m.description}</span>
          </button>
        ))}
      </div>

      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={settings.includeNonBone}
            onChange={(e) => onChange({ ...settings, includeNonBone: e.target.checked })}
          />
          Incluir cartílagos y dientes
        </label>
        <span className={styles.lengths}>
          Preguntas:
          {LENGTHS.map((n) => (
            <button
              key={n}
              className={plate.chip}
              data-active={settings.length === n}
              onClick={() => onChange({ ...settings, length: n })}
            >
              {n}
            </button>
          ))}
        </span>
        <span className={styles.poolSize}>
          {poolSize} {poolSize === 1 ? 'pieza' : 'piezas'} en juego
        </span>
        <button className={plate.buttonSolid} onClick={onStart} disabled={poolSize === 0}>
          Comenzar
        </button>
      </div>

      {hardest.length > 0 && (
        <p className={styles.hardest}>
          <span className={plate.kicker}>Te cuestan más</span>{' '}
          {hardest.map(({ id, stat }, i) => (
            <span key={id}>
              {i > 0 && ' · '}
              {pieceById.get(id)?.name} ({stat.wrong}/{stat.seen})
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

function IdentifyPanel({
  question,
  target,
  answer,
  onAnswer,
}: {
  question: Question
  target: BonePiece
  answer?: Answer
  onAnswer: (i: number) => void
}) {
  return (
    <div>
      <p className={styles.prompt}>¿Qué pieza está señalada?</p>
      <div className={styles.choices}>
        {question.options!.map((id, i) => {
          const state = !answer ? 'idle' : id === target.id ? 'correct' : id === answer.given ? 'wrong' : 'idle'
          return (
            <button
              key={id}
              className={styles.choice}
              data-state={state}
              disabled={!!answer}
              onClick={() => onAnswer(i)}
            >
              <span className={styles.choiceKey}>{i + 1}</span>
              {pieceById.get(id)!.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LocatePanel({ target, answer }: { target: BonePiece; answer?: Answer }) {
  if (!answer) {
    return (
      <p className={styles.prompt}>
        Haz clic en <strong>{target.name}</strong>. Puedes girar y acercar el modelo.
      </p>
    )
  }
  return (
    <Feedback correct={answer.correct}>
      {answer.correct ? (
        <>Correcto: {target.name}.</>
      ) : (
        <>
          Has señalado {answer.given ? pieceById.get(answer.given)!.name : 'otra pieza'}. {target.name} es la
          pieza marcada en verde.
        </>
      )}
    </Feedback>
  )
}

function TypePanel({
  target,
  answer,
  onSubmit,
  onGiveUp,
}: {
  target: BonePiece
  answer?: Answer
  /** Returns why the answer wasn't graded, or null once it was. */
  onSubmit: (text: string) => 'empty' | 'incomplete' | null
  onGiveUp: () => void
}) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState<'empty' | 'incomplete' | null>(null)
  const handle = (e: FormEvent) => {
    e.preventDefault()
    setHint(onSubmit(text))
  }
  return (
    <div>
      <form className={styles.typeForm} onSubmit={handle}>
        <label className={styles.prompt} htmlFor="quiz-typed">
          ¿Cómo se llama la pieza señalada?
        </label>
        <div className={styles.typeRow}>
          <input
            id="quiz-typed"
            className={styles.input}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setHint(null)
            }}
            disabled={!!answer}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="p. ej. Clavícula derecha, 5.º metatarsiano, T12…"
          />
          {!answer && (
            <>
              <button type="submit" className={plate.buttonSolid}>
                Comprobar
              </button>
              <button type="button" className={plate.button} onClick={onGiveUp}>
                No lo sé
              </button>
            </>
          )}
        </div>
      </form>
      {!answer && hint === 'incomplete' && (
        <p className={styles.hintLine} role="status">
          Vas bien, pero es incompleto: precisa más (qué número, mano o pie…).
        </p>
      )}
      {answer?.verdict && <TypedFeedback verdict={answer.verdict} target={target} given={answer.given} />}
    </div>
  )
}

function TypedFeedback({
  verdict,
  target,
  given,
}: {
  verdict: TypedVerdict
  target: BonePiece
  given: string | null
}) {
  if (!verdict.correct && given === null) {
    return <Feedback correct={false}>Era {target.name}.</Feedback>
  }
  if (verdict.correct) {
    return (
      <Feedback correct>
        {verdict.exact ? <>Correcto: {target.name}.</> : <>Correcto, aunque se escribe «{target.name}».</>}
      </Feedback>
    )
  }
  return (
    <Feedback correct={false}>
      {verdict.reason === 'wrong-side' ? (
        <>Hueso correcto, lado equivocado: es {target.name}.</>
      ) : (
        <>
          Era {target.name}
          {target.aliases?.length ? <> (también: {target.aliases.join(', ')})</> : null}.
        </>
      )}
    </Feedback>
  )
}

function Feedback({ correct, children }: { correct: boolean; children: ReactNode }) {
  return (
    <p className={styles.feedback} data-correct={correct} role="status">
      <span className={styles.feedbackMark}>{correct ? '✓' : '✗'}</span> {children}
    </p>
  )
}

function Results({
  answers,
  stats,
  onAgain,
  onSetup,
}: {
  answers: Answer[]
  stats: QuizStats
  onAgain: () => void
  onSetup: () => void
}) {
  const score = answers.filter((a) => a.correct).length
  const ratio = answers.length ? score / answers.length : 0
  const verdict =
    ratio === 1 ? 'Perfecto.' : ratio >= 0.8 ? 'Muy bien.' : ratio >= 0.5 ? 'Vas por buen camino.' : 'A repasar.'
  const missed = answers.filter((a) => !a.correct)
  const hardest = hardestPieces(stats)

  return (
    <div className={styles.results}>
      <div className={styles.score}>
        <span className={styles.scoreNumber}>
          {score}/{answers.length}
        </span>
        <span className={styles.scoreVerdict}>{verdict}</span>
      </div>

      {missed.length > 0 && (
        <div>
          <p className={plate.kicker}>Para repasar · marcados en el modelo</p>
          <ul className={styles.missed}>
            {missed.map((a) => (
              <li key={a.targetId}>
                <strong>{pieceById.get(a.targetId)!.name}</strong>
                {a.given && (
                  <span className={styles.missedGiven}>
                    {' '}
                    — respondiste {pieceById.get(a.given)?.name ?? `«${a.given}»`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hardest.length > 0 && (
        <p className={styles.hardest}>
          <span className={plate.kicker}>Historial · te cuestan más</span>{' '}
          {hardest.map(({ id, stat }, i) => (
            <span key={id}>
              {i > 0 && ' · '}
              {pieceById.get(id)?.name} ({stat.wrong}/{stat.seen})
            </span>
          ))}
        </p>
      )}

      <div className={styles.resultActions}>
        <button className={plate.button} onClick={onSetup}>
          Cambiar ajustes
        </button>
        <button className={plate.buttonSolid} onClick={onAgain} autoFocus>
          Otra ronda
        </button>
      </div>
    </div>
  )
}
