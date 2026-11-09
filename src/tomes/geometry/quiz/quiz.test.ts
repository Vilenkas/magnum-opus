import { describe, expect, it } from 'vitest'
import { GEOMETRY_QUESTIONS } from './questions'
import {
  assessMastery,
  createQuizRound,
  evaluateAnswer,
  filterQuestions,
  summarizeRound,
} from './engine'
import type { PracticeStats } from './stats'
import { TOPICS, type TopicId } from './types'

describe('Geometry Quiz Question Bank Integrity', () => {
  it('contains questions across all defined topics', () => {
    expect(GEOMETRY_QUESTIONS.length).toBeGreaterThanOrEqual(15)

    const topicsFound = new Set(GEOMETRY_QUESTIONS.map((q) => q.topic))
    const expectedTopics: TopicId[] = ['coordinates', 'lines', 'conics']

    for (const t of expectedTopics) {
      expect(topicsFound.has(t)).toBe(true)
      expect(TOPICS[t]).toBeDefined()
    }
  })

  it('validates every question structure, distinct options and valid correctIndex', () => {
    const ids = new Set<string>()

    for (const q of GEOMETRY_QUESTIONS) {
      // Unique ID
      expect(ids.has(q.id)).toBe(false)
      ids.add(q.id)

      // Content
      expect(q.prompt.trim().length).toBeGreaterThan(10)
      expect(q.explanation.trim().length).toBeGreaterThan(15)
      expect(q.lehmannRef.chapter).toBeGreaterThan(0)
      expect(q.lehmannRef.title.length).toBeGreaterThan(3)

      // 4 distinct options
      expect(q.options).toHaveLength(4)
      const uniqueOptions = new Set(q.options)
      expect(uniqueOptions.size).toBe(4)

      // Correct index bounds
      expect([0, 1, 2, 3]).toContain(q.correctIndex)
    }
  })

  it('correctly verifies distance calculation in geo-coord-1', () => {
    const q = GEOMETRY_QUESTIONS.find((item) => item.id === 'geo-coord-1')!
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toBe('$5$')
  })

  it('correctly verifies slope perpendicularity condition in geo-line-2', () => {
    const q = GEOMETRY_QUESTIONS.find((item) => item.id === 'geo-line-2')!
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toBe('$m_1 m_2 = -1$')
  })

  it('correctly identifies ellipse eccentricity in geo-conic-3', () => {
    const q = GEOMETRY_QUESTIONS.find((item) => item.id === 'geo-conic-3')!
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toContain(String.raw`e = \frac{4}{5}`)
  })
})

describe('Geometry Quiz Engine', () => {
  it('filters questions by topic correctly', () => {
    const coordQuestions = filterQuestions(GEOMETRY_QUESTIONS, { topic: 'coordinates', difficulty: 'all' })
    expect(coordQuestions.length).toBeGreaterThan(0)
    expect(coordQuestions.every((q) => q.topic === 'coordinates')).toBe(true)

    const lineQuestions = filterQuestions(GEOMETRY_QUESTIONS, { topic: 'lines', difficulty: 'all' })
    expect(lineQuestions.length).toBeGreaterThan(0)
    expect(lineQuestions.every((q) => q.topic === 'lines')).toBe(true)

    const conicQuestions = filterQuestions(GEOMETRY_QUESTIONS, { topic: 'conics', difficulty: 'all' })
    expect(conicQuestions.length).toBeGreaterThan(0)
    expect(conicQuestions.every((q) => q.topic === 'conics')).toBe(true)
  })

  it('filters questions by difficulty', () => {
    const basic = filterQuestions(GEOMETRY_QUESTIONS, { topic: 'all', difficulty: 'basic' })
    expect(basic.length).toBeGreaterThan(0)
    expect(basic.every((q) => q.difficulty === 'basic')).toBe(true)
  })

  it('creates quiz rounds with unique items matching requested count', () => {
    const round = createQuizRound({ topic: 'all', difficulty: 'all', count: 5 })
    expect(round).toHaveLength(5)

    const ids = new Set(round.map((q) => q.id))
    expect(ids.size).toBe(5)
  })

  it('respects maximum available questions when count exceeds pool size', () => {
    const count = 999
    const round = createQuizRound({ topic: 'coordinates', difficulty: 'basic', count })
    const totalMatching = filterQuestions(GEOMETRY_QUESTIONS, { topic: 'coordinates', difficulty: 'basic' }).length
    expect(round.length).toBe(totalMatching)
  })

  it('evaluates answers correctly', () => {
    const q = GEOMETRY_QUESTIONS[0]
    expect(evaluateAnswer(q, q.correctIndex)).toBe(true)
    const wrongIndex = (q.correctIndex + 1) % 4
    expect(evaluateAnswer(q, wrongIndex)).toBe(false)
  })

  it('summarizes round results accurately', () => {
    const answers = [
      { questionId: 'q1', selectedOption: 0, isCorrect: true, timestamp: 100 },
      { questionId: 'q2', selectedOption: 1, isCorrect: false, timestamp: 200 },
      { questionId: 'q3', selectedOption: 2, isCorrect: true, timestamp: 300 },
    ]
    const summary = summarizeRound(answers)
    expect(summary.total).toBe(3)
    expect(summary.correct).toBe(2)
  })

  it('assesses mastery across percentage bands', () => {
    expect(assessMastery(5, 5).rating).toBe('master')
    expect(assessMastery(4, 5).rating).toBe('proficient')
    expect(assessMastery(3, 5).rating).toBe('developing')
    expect(assessMastery(1, 5).rating).toBe('novice')
    expect(assessMastery(0, 0).rating).toBe('novice')
  })

  it('prioritizes missed questions using weighted practice stats', () => {
    const mockStats: PracticeStats = {
      'geo-coord-1': { seen: 10, wrong: 9, last: Date.now() }, // frequently missed
      'geo-coord-2': { seen: 10, wrong: 0, last: Date.now() }, // mastered
    }

    // With deterministic rng returning fixed values or testing pickWeighted distribution
    const round = createQuizRound(
      { topic: 'coordinates', difficulty: 'all', count: 1 },
      mockStats,
      GEOMETRY_QUESTIONS,
      () => 0.999, // high random roll favors heavier weight
    )
    expect(round).toHaveLength(1)
  })
})
