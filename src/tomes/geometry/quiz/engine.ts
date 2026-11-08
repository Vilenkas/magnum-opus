import { pickWeighted, type PracticeStats, type Rng } from '@/forge/practice'
import { GEOMETRY_QUESTIONS } from './questions'
import type { GeometryQuestion, QuestionAnswer, QuizRoundResult, QuizSettings } from './types'

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  topic: 'all',
  difficulty: 'all',
  count: 5,
}

export function filterQuestions(
  pool: GeometryQuestion[] = GEOMETRY_QUESTIONS,
  settings: Pick<QuizSettings, 'topic' | 'difficulty'> = DEFAULT_QUIZ_SETTINGS,
): GeometryQuestion[] {
  return pool.filter((q) => {
    if (settings.topic !== 'all' && q.topic !== settings.topic) {
      return false
    }
    if (settings.difficulty !== 'all' && q.difficulty !== settings.difficulty) {
      return false
    }
    return true
  })
}

/**
 * Creates a round of questions using weighted sampling based on past error rates.
 */
export function createQuizRound(
  settings: QuizSettings = DEFAULT_QUIZ_SETTINGS,
  stats: PracticeStats = {},
  pool: GeometryQuestion[] = GEOMETRY_QUESTIONS,
  rng: Rng = Math.random,
): GeometryQuestion[] {
  const filtered = filterQuestions(pool, settings)
  if (filtered.length === 0) {
    return []
  }

  const requestedCount = Math.min(settings.count, filtered.length)
  const pickedIds = pickWeighted(filtered, stats, requestedCount, rng)

  const byId = new Map(filtered.map((q) => [q.id, q]))
  return pickedIds.map((id) => byId.get(id)!).filter(Boolean)
}

export function evaluateAnswer(
  question: GeometryQuestion,
  selectedOption: number,
): boolean {
  return selectedOption === question.correctIndex
}

export function summarizeRound(answers: QuestionAnswer[]): QuizRoundResult {
  const total = answers.length
  const correct = answers.filter((a) => a.isCorrect).length

  return {
    total,
    correct,
    answers,
    completedAt: Date.now(),
  }
}

export interface MasteryAssessment {
  scorePercent: number
  rating: 'master' | 'proficient' | 'developing' | 'novice'
  headline: string
  advice: string
}

export function assessMastery(correct: number, total: number): MasteryAssessment {
  if (total === 0) {
    return {
      scorePercent: 0,
      rating: 'novice',
      headline: 'Sin respuestas registradas',
      advice: 'Inicia el examen para evaluar tu comprensión de Lehmann.',
    }
  }

  const scorePercent = Math.round((correct / total) * 100)

  if (scorePercent === 100) {
    return {
      scorePercent,
      rating: 'master',
      headline: 'Dominio magistral de Lehmann',
      advice: 'Demuestras un conocimiento riguroso de los teoremas analíticos, fórmulas canónicas y deducciones cartesianas.',
    }
  }

  if (scorePercent >= 80) {
    return {
      scorePercent,
      rating: 'proficient',
      headline: 'Excelente comprensión analítica',
      advice: 'Tienes bases muy firmes en los métodos de Lehmann. Revisa únicamente los ejercicios donde erraste para perfeccionar el cálculo.',
    }
  }

  if (scorePercent >= 60) {
    return {
      scorePercent,
      rating: 'developing',
      headline: 'Comprensión en desarrollo',
      advice: 'Identificas los conceptos principales, pero es conveniente repasar la aplicación de signos, razones de división y discriminantes de cónicas.',
    }
  }

  return {
    scorePercent,
    rating: 'novice',
    headline: 'Requiere estudio detenido',
    advice: 'Te sugerimos volver a consultar los artículos referenciados de Geometría analítica de Lehmann para afianzar las definiciones fundamentales.',
  }
}
