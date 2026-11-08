import { describe, expect, it } from 'vitest'
import { indices, REFLEXES, SEGMENTS, segmentIndex, stateOf, type Reflex } from './spinal-reflexes'

const byId = (id: string) => REFLEXES.find((r) => r.id === id)!
const state = (id: string, lesion: [string, string], phase: 'shock' | 'automatism' = 'automatism', today = false) => stateOf(byId(id), lesion, phase, today)

describe('the segments', () => {
  it('runs from C1 to S5: 8 cervical, 12 dorsal, 5 lumbar and 5 sacral', () => {
    expect(SEGMENTS).toHaveLength(30)
    expect(SEGMENTS[0].id).toBe('C1')
    expect(SEGMENTS.at(-1)!.id).toBe('S5')
    expect(segmentIndex('D1')).toBe(8)
  })

  it('gives every reflex a range read from top to bottom', () => {
    for (const r of REFLEXES) {
      expect(indices(r.range).length).toBeGreaterThan(0)
      if (r.today) expect(indices(r.today.range).length).toBeGreaterThan(0)
    }
  })
})

describe('a lesion at a level', () => {
  it('abolishes the reflexes closed wholly in it and weakens those it only takes in part', () => {
    expect(state('radial', ['C5', 'C6'])).toBe('abolished')
    expect(state('biceps', ['C5', 'C6'])).toBe('diminished')
    expect(state('diaphragm', ['C5', 'C6'])).toBe('normal')
  })

  it('locates a lesion of the lower dorsal cord by the lower abdominal reflex alone', () => {
    expect(state('abdominal-low', ['D10', 'D12'])).toBe('abolished')
    expect(state('abdominal-mid', ['D10', 'D12'])).toBe('normal')
    expect(state('epigastric', ['D10', 'D12'])).toBe('normal')
  })

  it('loses everything below during the shock, then frees the cord’s automatism', () => {
    expect(state('patellar', ['D6', 'D6'], 'shock')).toBe('abolished')
    expect(state('patellar', ['D6', 'D6'], 'automatism')).toBe('exaggerated')
    expect(state('achilles', ['D6', 'D6'], 'automatism')).toBe('exaggerated')
    expect(state('plantar', ['D6', 'D6'], 'automatism')).toBe('released')
    expect(state('biceps', ['D6', 'D6'], 'shock')).toBe('normal')
  })

  it('leaves the sacral centres of the bladder and the rectum to a lesion of the conus', () => {
    for (const id of ['bladder', 'ejaculation']) expect(state(id, ['S3', 'S4'])).toBe('abolished')
    expect(state('patellar', ['S3', 'S4'])).toBe('normal')
  })
})

describe('Testut’s levels against today’s', () => {
  const withToday = REFLEXES.filter((r): r is Reflex & Required<Pick<Reflex, 'today'>> => !!r.today)

  it('places today’s level inside Dejerine’s run of segments, never outside it', () => {
    for (const r of withToday) {
      const old = new Set(indices(r.range))
      for (const i of indices(r.today.range)) expect(old.has(i)).toBe(true)
    }
  })

  it('keeps the abdominal reflexes lost below a pyramidal lesion and inverts the plantar one (Babinski)', () => {
    expect(state('abdominal-low', ['D6', 'D6'], 'automatism', true)).toBe('abolished')
    expect(state('bulbocavernous', ['D6', 'D6'], 'automatism', true)).toBe('released')
    expect(state('plantar', ['D6', 'D6'], 'automatism', true)).toBe('inverted')
    expect(state('patellar', ['D6', 'D6'], 'automatism', true)).toBe('exaggerated')
    expect(state('bladder', ['D6', 'D6'], 'automatism', true)).toBe('released')
  })

  it('narrows the biceps and the Achilles reflexes, which a lesion then abolishes more easily', () => {
    expect(state('biceps', ['C5', 'C6'], 'automatism', true)).toBe('abolished')
    expect(state('achilles', ['S1', 'S2'], 'automatism', false)).toBe('diminished')
    expect(state('achilles', ['S1', 'S2'], 'automatism', true)).toBe('abolished')
  })
})
