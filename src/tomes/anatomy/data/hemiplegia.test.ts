import { describe, expect, it } from 'vitest'
import { DECUSSATION_Y, interrupted, isAlternate, lesions, levels, nerves, paralysis } from './hemiplegia'

const at = (id: string) => {
  const l = lesions.find((x) => x.id === id)!
  return paralysis(l.y, 'left')
}

describe('the hemiplegias', () => {
  it('stacks the levels without gaps, with the decussation below the medulla', () => {
    for (let i = 1; i < levels.length; i++) expect(levels[i].top).toBe(levels[i - 1].bottom)
    expect(DECUSSATION_Y).toBeGreaterThan(levels.at(-1)!.bottom)
  })

  it('crosses each corticonuclear contingent just above its nucleus, inside its level', () => {
    for (const n of nerves) {
      const level = levels.find((l) => l.id === n.level)!
      expect(n.crossY, n.id).toBeLessThan(n.nucleusY)
      expect(n.crossY, n.id).toBeGreaterThanOrEqual(level.top)
      expect(n.nucleusY, n.id).toBeLessThan(level.bottom)
    }
  })

  it('places every lesion inside its level, below the crossing of that level’s nerve', () => {
    for (const l of lesions) {
      const level = levels.find((x) => x.id === l.level)!
      expect(l.y, l.id).toBeGreaterThanOrEqual(level.top)
      expect(l.y, l.id).toBeLessThan(level.bottom)
      const nerve = nerves.find((n) => n.level === l.level)
      if (nerve) expect(l.y, l.id).toBeGreaterThanOrEqual(nerve.crossY)
    }
  })

  it('above the brainstem: face, tongue and limbs on the opposite side (common hemiplegia)', () => {
    const p = at('capsule')
    expect(p.VII).toEqual({ side: 'right', kind: 'central' })
    expect(p.XII).toEqual({ side: 'right', kind: 'central' })
    expect(p.limbs).toEqual({ side: 'right', kind: 'central' })
    expect(p.III).toBeNull() // bilateral supply
    expect(isAlternate(p)).toBe(false)
  })

  it('in the peduncle: the oculomotor on the side of the lesion, the rest opposite', () => {
    const p = at('peduncle')
    expect(p.III).toEqual({ side: 'left', kind: 'peripheral' })
    expect(p.VII?.side).toBe('right')
    expect(p.XII?.side).toBe('right')
    expect(p.limbs?.side).toBe('right')
    expect(isAlternate(p)).toBe(true)
  })

  it('in the pons: the face on the side of the lesion, the limbs opposite', () => {
    const p = at('pons')
    expect(p.VII).toEqual({ side: 'left', kind: 'peripheral' })
    expect(p.limbs?.side).toBe('right')
    expect(p.XII?.side).toBe('right')
    expect(p.III).toBeNull()
    expect(isAlternate(p)).toBe(true)
  })

  it('in the medulla: the tongue on the side of the lesion, the face spared', () => {
    const p = at('medulla')
    expect(p.XII).toEqual({ side: 'left', kind: 'peripheral' })
    expect(p.VII).toBeNull()
    expect(p.limbs?.side).toBe('right')
    expect(isAlternate(p)).toBe(true)
  })

  it('mirrors a lesion of the right side', () => {
    const p = paralysis(lesions.find((l) => l.id === 'pons')!.y, 'right')
    expect(p.VII?.side).toBe('right')
    expect(p.limbs?.side).toBe('left')
  })

  it('below the decussation, the limbs are paralysed on the side of the lesion', () => {
    expect(paralysis(DECUSSATION_Y + 10, 'left').limbs?.side).toBe('left')
  })

  it('interrupts the corticospinal fibres in the whole brainstem, and only the uncrossed corticonuclear ones', () => {
    const pons = interrupted(lesions.find((l) => l.id === 'pons')!.y)
    expect(pons.spinal).toBe(true)
    expect(pons.nuclear).toEqual({ III: false, VII: false, XII: true })
    expect(interrupted(lesions[0].y).nuclear).toEqual({ III: true, VII: true, XII: true })
  })

  it('names every alternate syndrome', () => {
    for (const l of lesions.filter((l) => isAlternate(paralysis(l.y)))) expect(l.eponym, l.id).toBeTruthy()
  })
})
