import { useState, useCallback, useMemo } from 'react'
import {
  assessMastery,
  createQuizRound,
  evaluateAnswer,
  DEFAULT_QUIZ_SETTINGS,
} from '../quiz/engine'
import { loadStats, recordAnswer, type PracticeStats } from '../quiz/stats'
import { TOPICS, type QuestionAnswer, type QuizSettings, type TopicId } from '../quiz/types'
import styles from './GeometryQuiz.module.css'

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const

export function GeometryQuiz() {
  const [settings, setSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS)
  const [stats, setStats] = useState<PracticeStats>(() => loadStats())

  // Round state
  const [questions, setQuestions] = useState(() =>
    createQuizRound(DEFAULT_QUIZ_SETTINGS, loadStats()),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQuestion = questions[currentIndex]

  const startNewRound = useCallback(
    (newSettings: QuizSettings) => {
      const nextQuestions = createQuizRound(newSettings, stats)
      setSettings(newSettings)
      setQuestions(nextQuestions)
      setCurrentIndex(0)
      setSelectedOption(null)
      setIsAnswered(false)
      setAnswers([])
      setIsCompleted(false)
    },
    [stats],
  )

  const handleSelectTopic = (topic: TopicId | 'all') => {
    const nextSettings: QuizSettings = { ...settings, topic }
    startNewRound(nextSettings)
  }

  const handleSelectCount = (count: number) => {
    const nextSettings: QuizSettings = { ...settings, count }
    startNewRound(nextSettings)
  }

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered || !currentQuestion) return

    const correct = evaluateAnswer(currentQuestion, optionIndex)
    setSelectedOption(optionIndex)
    setIsAnswered(true)

    // Record answer persistently
    const nextStats = recordAnswer(stats, currentQuestion.id, correct)
    setStats(nextStats)

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        isCorrect: correct,
        timestamp: Date.now(),
      },
    ])
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRestart = () => {
    startNewRound(settings)
  }

  const roundSummary = useMemo(() => {
    const correctCount = answers.filter((a) => a.isCorrect).length
    const assessment = assessMastery(correctCount, answers.length)
    return {
      correctCount,
      total: answers.length,
      assessment,
    }
  }, [answers])

  return (
    <section className={styles.container} aria-label="Examen de Geometría Analítica">
      <header className={styles.header}>
        <p className={styles.kicker}>Evaluación de Conocimientos</p>
        <h2 className={styles.title}>Examen de Geometría Analítica</h2>
        <p className={styles.description}>
          Ejercicios y problemas deductivos basados en el tratado de C. H. Lehmann. Practica
          coordenadas, rectas y cónicas con retroalimentación inmediata.
        </p>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.topicFilters} role="group" aria-label="Filtro por tema">
            <button
              type="button"
              className={`${styles.topicBtn} ${settings.topic === 'all' ? styles.topicBtnActive : ''}`}
              onClick={() => handleSelectTopic('all')}
            >
              Todos los temas
            </button>
            {(Object.keys(TOPICS) as TopicId[]).map((topicId) => (
              <button
                key={topicId}
                type="button"
                className={`${styles.topicBtn} ${settings.topic === topicId ? styles.topicBtnActive : ''}`}
                onClick={() => handleSelectTopic(topicId)}
              >
                {TOPICS[topicId].shortName}
              </button>
            ))}
          </div>

          <div className={styles.countSelector}>
            <label htmlFor="geo-quiz-count">Preguntas:</label>
            <select
              id="geo-quiz-count"
              className={styles.countSelect}
              value={settings.count}
              onChange={(e) => handleSelectCount(Number(e.target.value))}
            >
              <option value={5}>5 preguntas</option>
              <option value={10}>10 preguntas</option>
              <option value={20}>Todas las disponibles</option>
            </select>
          </div>
        </div>
      </header>

      {isCompleted ? (
        /* Results View */
        <div className={styles.resultsBox}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>
              {roundSummary.assessment.scorePercent}
              <span className={styles.scorePercentSign}>%</span>
            </span>
            <span className={styles.scoreRatio}>
              {roundSummary.correctCount} de {roundSummary.total}
            </span>
          </div>

          <h3 className={styles.resultHeadline}>{roundSummary.assessment.headline}</h3>
          <p className={styles.resultAdvice}>{roundSummary.assessment.advice}</p>

          <div className={styles.breakdownList}>
            {answers.map((ans, idx) => {
              const q = questions.find((item) => item.id === ans.questionId)
              if (!q) return null
              return (
                <div key={ans.questionId} className={styles.breakdownItem}>
                  <span className={styles.itemPrompt}>
                    {idx + 1}. {q.prompt}
                  </span>
                  <span className={ans.isCorrect ? styles.statusCorrect : styles.statusWrong}>
                    {ans.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                  </span>
                </div>
              )
            })}
          </div>

          <button type="button" className={styles.restartBtn} onClick={handleRestart}>
            Comenzar nuevo examen
          </button>
        </div>
      ) : currentQuestion ? (
        /* Active Question View */
        <div>
          <div className={styles.progressSection}>
            <div className={styles.progressMeta}>
              <span className={styles.questionCount}>
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <span>{Math.round(((currentIndex) / questions.length) * 100)}% completado</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.questionBox}>
            <div className={styles.badgeRow}>
              <span className={styles.topicBadge}>{TOPICS[currentQuestion.topic].name}</span>
              <span className={styles.refBadge}>
                Cap. {currentQuestion.lehmannRef.chapter} · Art. {currentQuestion.lehmannRef.article}
              </span>
            </div>

            <h3 className={styles.prompt}>{currentQuestion.prompt}</h3>

            {currentQuestion.formula && (
              <div className={styles.formulaBox}>{currentQuestion.formula}</div>
            )}

            <div className={styles.optionsGrid} role="radiogroup">
              {currentQuestion.options.map((optText, optIdx) => {
                const isSelected = selectedOption === optIdx
                const isCorrectOption = optIdx === currentQuestion.correctIndex

                let btnClass = styles.optionBtn
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnClass += ` ${styles.optionCorrect}`
                  } else if (isSelected) {
                    btnClass += ` ${styles.optionWrong}`
                  } else {
                    btnClass += ` ${styles.optionMuted}`
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={btnClass}
                    onClick={() => handleAnswer(optIdx)}
                    disabled={isAnswered}
                    aria-checked={isSelected}
                  >
                    <span className={styles.letterBadge}>{OPTION_LETTERS[optIdx]}</span>
                    <span>{optText}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback Area */}
          {isAnswered && (
            <div
              className={`${styles.feedbackBox} ${
                selectedOption === currentQuestion.correctIndex
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong
              }`}
            >
              <h4 className={styles.feedbackTitle}>
                {selectedOption === currentQuestion.correctIndex
                  ? '✓ ¡Respuesta correcta!'
                  : '✗ Respuesta incorrecta'}
              </h4>
              <p className={styles.explanation}>{currentQuestion.explanation}</p>
              <div className={styles.sourceFooter}>
                <span>Referencia:</span>
                <span className={styles.sourceBook}>
                  C. H. Lehmann, <em>Geometría analítica</em> — {currentQuestion.lehmannRef.title} (Art.{' '}
                  {currentQuestion.lehmannRef.article}
                  {currentQuestion.lehmannRef.page ? `, pág. ${currentQuestion.lehmannRef.page}` : ''})
                </span>
              </div>
            </div>
          )}

          {/* Navigation Action */}
          {isAnswered && (
            <div className={styles.footerNav}>
              <button type="button" className={styles.nextBtn} onClick={handleNext}>
                {currentIndex + 1 < questions.length
                  ? 'Siguiente pregunta →'
                  : 'Finalizar y ver resultados →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No se encontraron preguntas con los filtros seleccionados.</p>
      )}
    </section>
  )
}
