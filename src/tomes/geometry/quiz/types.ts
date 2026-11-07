/**
 * Type definitions for the Geometry Tome exam and practice engine.
 * Based on the analytic geometry curriculum of C. H. Lehmann.
 */

export type TopicId = 'coordinates' | 'lines' | 'conics'
export type Difficulty = 'basic' | 'intermediate' | 'advanced'

export interface TopicInfo {
  id: TopicId
  name: string
  shortName: string
  description: string
  articles: string
}

export const TOPICS: Record<TopicId, TopicInfo> = {
  coordinates: {
    id: 'coordinates',
    name: 'Sistemas coordenados y puntos',
    shortName: 'Coordenadas',
    description: 'Distancia entre puntos, división de segmentos en una razón dada y áreas de polígonos.',
    articles: 'Cap. I: Art. 1–10',
  },
  lines: {
    id: 'lines',
    name: 'La recta en el plano',
    shortName: 'La recta',
    description: 'Pendiente, ángulo entre rectas, ecuaciones en diversas formas y distancia de punto a recta.',
    articles: 'Cap. II & III: Art. 13–28',
  },
  conics: {
    id: 'conics',
    name: 'Secciones cónicas',
    shortName: 'Cónicas',
    description: 'Circunferencia, parábola, elipse, hipérbola y discriminante de la ecuación general de segundo grado.',
    articles: 'Cap. IV–VIII: Art. 36–72',
  },
}

export interface LehmannReference {
  chapter: number
  article: number | string
  title: string
  page?: number
}

export interface GeometryQuestion {
  id: string
  topic: TopicId
  difficulty: Difficulty
  prompt: string
  formula?: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  lehmannRef: LehmannReference
}

export interface QuizSettings {
  topic: TopicId | 'all'
  difficulty: Difficulty | 'all'
  count: number
}

export interface QuestionAnswer {
  questionId: string
  selectedOption: number
  isCorrect: boolean
  timestamp: number
}

export interface QuizRoundResult {
  total: number
  correct: number
  answers: QuestionAnswer[]
  completedAt: number
}
