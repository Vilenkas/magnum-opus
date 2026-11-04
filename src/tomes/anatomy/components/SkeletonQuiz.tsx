import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { landmarkById, landmarksByPiece, type Landmark } from '../data/landmarks'
import { pieceById, regionOf, regions, type BonePiece, type RegionId } from '../data/skeleton'
import { checkTyped, type TypedVerdict } from '../quiz/answer'
import {
  buildPool,
  createRound,
  describeItem,
  isLandmarkHit,
  itemById,
  type Question,
  type QuizItem,
  type QuizMode,
  type QuizSettings,
  type Subject,
} from '../quiz/engine'
import { hardestPieces, loadStats, recordAnswer, type QuizStats } from '../quiz/stats'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { SkeletonStage, type Focus, type Marker, type PieceLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './SkeletonQuiz.module.css'

type Vec3 = [number, number, number]

const SUBJECTS: { id: Subject; name: string }[] = [
  { id: 'bones', name: 'Huesos' },
  { id: 'landmarks', name: 'Accidentes óseos' },
]

const MODES: Record<Subject, { id: QuizMode; name: string; description: string }[]> = {
  bones: [
    { id: 'identify', name: 'Identifica', description: 'Se resalta una pieza: elige su nombre entre cuatro.' },
    { id: 'locate', name: 'Señala', description: 'Te doy un nombre: haz clic en la pieza.' },
    { id: 'type', name: 'Escribe', description: 'Se resalta una pieza: escribe su nombre, en español, latín o inglés.' },
  ],
  landmarks: [
    { id: 'identify', name: 'Identifica', description: 'Un pin marca un accidente: elige su nombre entre cuatro.' },
    { id: 'locate', name: 'Señala', description: 'Te doy un accidente: haz clic en su lugar sobre el hueso.' },
    { id: 'type', name: 'Escribe', description: 'Un pin marca un accidente: escribe su nombre, en español, latín o inglés.' },
  ],
}

const LENGTHS = [10, 20, 30]

/** Locate-a-landmark: a click further than this from every landmark doesn't count. */
const LANDMARK_MAX_DISTANCE = 0.06

interface Answer {
  targetId: string
  correct: boolean
  /** Item id chosen (identify/locate) or raw text (type). */
  given: string | null
  verdict?: TypedVerdict
  /** Locate-a-landmark: where the user clicked. */
  point?: Vec3
}

type Phase = 'setup' | 'playing' | 'results'

const focusOnLandmark = (l: Landmark): Focus => ({ kind: 'point', pieceId: l.pieceId, position: l.position, normal: l.normal })

function nearestLandmark(point: Vec3, onPiece: Landmark[]): Landmark | undefined {
  let best: { l: Landmark; d: number } | undefined
  for (const l of onPiece) {
    const d = Math.hypot(l.position[0] - point[0], l.position[1] - point[1], l.position[2] - point[2])
    if (!best || d < best.d) best = { l, d }
  }
  return best?.l
}

/** Lámina III: practice on the 3D skeleton. */
export function SkeletonQuiz() {
  const [settings, setSettings] = useState<QuizSettings>({
    subject: 'bones',
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
  const fullscreen = useFullscreen<HTMLElement>()

  const isLandmarks = settings.subject === 'landmarks'
  const question = questions[index]
  const target = question ? itemById.get(question.targetId)! : undefined
  const targetLandmark = target && isLandmarks ? landmarkById.get(target.id) : undefined
  const answer = phase === 'playing' ? answers[index] : undefined
  const poolSize = useMemo(() => buildPool(settings).length, [settings])

  const frameRegion = (region: RegionId | 'all'): Focus =>
    region === 'all' ? { kind: 'all' } : { kind: 'region', region }

  const frameQuestion = useCallback((q: Question, s: QuizSettings): Focus => {
    const item = itemById.get(q.targetId)!
    if (s.subject === 'landmarks') {
      // Locate shows the whole bone (the pin would give the answer away).
      return s.mode === 'locate' ? { kind: 'piece', id: item.pieceId, context: 1.2 } : focusOnLandmark(landmarkById.get(item.id)!)
    }
    return s.mode === 'locate' ? frameRegion(s.region) : { kind: 'piece', id: item.id, context: 3 }
  }, [])

  const start = (s = settings) => {
    const round = createRound(s, stats)
    if (round.length === 0) return
    setQuestions(round)
    setAnswers([])
    setIndex(0)
    setPhase('playing')
    setFocus(frameQuestion(round[0], s))
  }

  const submit = (correct: boolean, given: string | null, extra: Partial<Answer> = {}) => {
    if (!target || answer) return
    setAnswers((prev) => [...prev, { targetId: target.id, correct, given, ...extra }])
    setStats((prev) => recordAnswer(prev, target.id, correct))
    // Show where the right answer was when the user pointed elsewhere.
    if (settings.mode === 'locate') {
      setFocus(targetLandmark ? focusOnLandmark(targetLandmark) : { kind: 'piece', id: target.id, context: 3 })
    }
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

  const missed = useMemo(() => answers.filter((a) => !a.correct), [answers])
  const missedPieceIds = useMemo(() => new Set(missed.map((a) => itemById.get(a.targetId)!.pieceId)), [missed])

  const lookOf = useCallback(
    (p: BonePiece, hovered: string | null): PieceLook => {
      if (phase === 'setup') return inScope(p) ? 'base' : 'faded'
      if (phase === 'results') {
        if (isLandmarks) return inScope(p) ? 'base' : 'faded'
        return missedPieceIds.has(p.id) ? 'wrong' : inScope(p) ? 'base' : 'faded'
      }
      if (!target) return 'base'

      if (isLandmarks) {
        // The landmark's bone in a light tint; everything else barely there, so nothing hides
        // it (in close-ups of small bones a denser ghost turns into visual noise).
        return p.id === target.pieceId ? 'hover' : 'faded'
      }

      const isTarget = p.id === target.id
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
    [phase, inScope, missedPieceIds, target, settings.mode, answer, isLandmarks],
  )

  const markers = useMemo<Marker[]>(() => {
    const pin = (l: Landmark, look: Marker['look']): Marker => ({
      id: l.id,
      pieceId: l.pieceId,
      position: l.position,
      normal: l.normal,
      opening: l.opening,
      look,
    })
    if (!isLandmarks) return []
    if (phase === 'results') {
      return missed.map((a) => landmarkById.get(a.targetId)).filter((l): l is Landmark => !!l).map((l) => pin(l, 'wrong'))
    }
    if (phase !== 'playing' || !targetLandmark) return []
    if (settings.mode !== 'locate') {
      return [pin(targetLandmark, answer ? (answer.correct ? 'correct' : 'wrong') : 'active')]
    }
    if (!answer) return []
    const result = [pin(targetLandmark, 'correct')]
    if (!answer.correct && answer.point) {
      result.push({ id: 'click', pieceId: targetLandmark.pieceId, position: answer.point, normal: [0, 0, 1], look: 'wrong' })
    }
    return result
  }, [isLandmarks, phase, missed, targetLandmark, settings.mode, answer])

  // Only "locate" questions are answered by clicking; elsewhere hovering must not give hints.
  const isPickable = useCallback(
    (p: BonePiece) => {
      if (phase !== 'playing' || settings.mode !== 'locate' || answer || !target) return false
      return isLandmarks ? p.id === target.pieceId : inScope(p)
    },
    [phase, settings.mode, answer, inScope, isLandmarks, target],
  )

  const handlePick = (id: string | null) => {
    if (isLandmarks || !id || !target || settings.mode !== 'locate' || answer) return
    submit(id === target.id, id)
  }

  const handleSurfacePick = (pieceId: string, point: Vec3) => {
    if (!isLandmarks || !target || settings.mode !== 'locate' || answer) return
    const onPiece = landmarksByPiece.get(pieceId) ?? []
    const correct = isLandmarkHit(target.id, pieceId, point, onPiece, LANDMARK_MAX_DISTANCE)
    submit(correct, nearestLandmark(point, onPiece)?.id ?? null, { point })
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
  const onBone = target && isLandmarks ? pieceById.get(target.pieceId)!.name : null

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>Lámina III · Examen de osteología</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

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

      <SkeletonStage
        lookOf={lookOf}
        isPickable={isPickable}
        focus={focus}
        onPick={handlePick}
        onSurfacePick={handleSurfacePick}
        markers={markers}
      >
        {phase === 'playing' && settings.mode === 'locate' && target && !answer && (
          <div className={styles.locatePrompt}>
            Señala: <strong>{target.name}</strong>
            {onBone && <span className={styles.locateOn}> · en {onBone}</span>}
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
              <IdentifyPanel
                question={question}
                target={target}
                onBone={onBone}
                answer={answer}
                onAnswer={optionRef.current}
              />
            )}
            {settings.mode === 'locate' && <LocatePanel target={target} onBone={onBone} answer={answer} />}
            {settings.mode === 'type' && (
              <TypePanel
                key={index}
                target={target}
                onBone={onBone}
                answer={answer}
                onSubmit={(text) => {
                  const verdict = checkTyped(text, target)
                  // Empty or incomplete answers aren't graded: the user can add detail.
                  if (!verdict.correct && (verdict.reason === 'empty' || verdict.reason === 'incomplete')) {
                    return verdict.reason
                  }
                  submit(verdict.correct, text, { verdict })
                  return null
                }}
                onGiveUp={() => submit(false, null, { verdict: { correct: false, reason: 'wrong-bone' } })}
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
          <Results
            subject={settings.subject}
            answers={answers}
            stats={stats}
            onAgain={() => start()}
            onSetup={() => setPhase('setup')}
          />
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
  const hardest = hardestOf(stats, settings.subject)
  const unit = settings.subject === 'bones' ? ['pieza', 'piezas'] : ['accidente', 'accidentes']
  return (
    <div className={styles.setup}>
      <div className={styles.subjects} role="radiogroup" aria-label="Qué practicar">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={settings.subject === s.id}
            className={plate.chip}
            data-active={settings.subject === s.id}
            onClick={() => onChange({ ...settings, subject: s.id })}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className={styles.modes} role="radiogroup" aria-label="Modo">
        {MODES[settings.subject].map((m) => (
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
          {poolSize} {poolSize === 1 ? unit[0] : unit[1]} en juego
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
              {describeItem(itemById.get(id)!)} ({stat.wrong}/{stat.seen})
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

/** Hardest items of one subject (the stats store holds both). */
function hardestOf(stats: QuizStats, subject: Subject) {
  const own = Object.fromEntries(Object.entries(stats).filter(([id]) => itemById.get(id)?.subject === subject))
  return hardestPieces(own)
}

function OnBone({ name }: { name: string | null }) {
  return name ? <span className={styles.onBone}> en {name}</span> : null
}

function IdentifyPanel({
  question,
  target,
  onBone,
  answer,
  onAnswer,
}: {
  question: Question
  target: QuizItem
  onBone: string | null
  answer?: Answer
  onAnswer: (i: number) => void
}) {
  return (
    <div>
      <p className={styles.prompt}>
        {target.subject === 'landmarks' ? '¿Qué accidente marca el pin?' : '¿Qué pieza está señalada?'}
        <OnBone name={onBone} />
      </p>
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
              {itemById.get(id)!.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LocatePanel({ target, onBone, answer }: { target: QuizItem; onBone: string | null; answer?: Answer }) {
  const isLandmark = target.subject === 'landmarks'
  if (!answer) {
    return (
      <p className={styles.prompt}>
        Haz clic en <strong>{target.name}</strong>
        <OnBone name={onBone} />. Puedes girar y acercar el modelo.
      </p>
    )
  }
  const given = answer.given ? itemById.get(answer.given) : undefined
  return (
    <Feedback correct={answer.correct}>
      {answer.correct ? (
        <>Correcto: {target.name}.</>
      ) : isLandmark ? (
        <>
          Has señalado cerca de {given ? given.name : 'otra zona'} (pin rojo). {target.name} es el pin verde.
        </>
      ) : (
        <>
          Has señalado {given ? given.name : 'otra pieza'}. {target.name} es la pieza marcada en verde.
        </>
      )}
    </Feedback>
  )
}

function TypePanel({
  target,
  onBone,
  answer,
  onSubmit,
  onGiveUp,
}: {
  target: QuizItem
  onBone: string | null
  answer?: Answer
  /** Returns why the answer wasn't graded, or null once it was. */
  onSubmit: (text: string) => 'empty' | 'incomplete' | null
  onGiveUp: () => void
}) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState<'empty' | 'incomplete' | null>(null)
  const isLandmark = target.subject === 'landmarks'
  const handle = (e: FormEvent) => {
    e.preventDefault()
    setHint(onSubmit(text))
  }
  return (
    <div>
      <form className={styles.typeForm} onSubmit={handle}>
        <label className={styles.prompt} htmlFor="quiz-typed">
          {isLandmark ? '¿Cómo se llama el accidente marcado?' : '¿Cómo se llama la pieza señalada?'}
          <OnBone name={onBone} />
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
            placeholder={isLandmark ? 'p. ej. Trocánter mayor, Epitróclea…' : 'p. ej. Clavícula derecha, 5.º metatarsiano, T12…'}
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
          Vas bien, pero es incompleto: precisa más.
        </p>
      )}
      {answer?.verdict && <TypedFeedback verdict={answer.verdict} target={target} given={answer.given} />}
    </div>
  )
}

function TypedFeedback({ verdict, target, given }: { verdict: TypedVerdict; target: QuizItem; given: string | null }) {
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
          {target.aliases.length ? <> (también: {target.aliases.join(', ')})</> : null}.
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
  subject,
  answers,
  stats,
  onAgain,
  onSetup,
}: {
  subject: Subject
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
  const hardest = hardestOf(stats, subject)

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
                <strong>{describeItem(itemById.get(a.targetId)!)}</strong>
                {a.given && (
                  <span className={styles.missedGiven}>
                    {' '}
                    — respondiste {itemById.get(a.given)?.name ?? `«${a.given}»`}
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
              {describeItem(itemById.get(id)!)} ({stat.wrong}/{stat.seen})
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
