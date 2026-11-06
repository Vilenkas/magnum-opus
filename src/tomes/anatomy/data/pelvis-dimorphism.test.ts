import { describe, expect, it } from 'vitest'
import { MAN, WOMAN, characters, measures, paramsAt, pelvisShape } from './pelvis-dimorphism'

const man = measures(0)
const woman = measures(1)

describe('sexual characters of the pelvis', () => {
  it("lists Testut's sixteen characters in order, each for both sexes", () => {
    expect(characters.map((c) => c.n)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1))
    for (const c of characters) {
      expect(c.woman.length, c.name).toBeGreaterThan(5)
      expect(c.man.length, c.name).toBeGreaterThan(5)
    }
  })

  it('draws the subpubic arch at his angles: 70° in man, 110° in woman', () => {
    expect(man.archDeg).toBe(70)
    expect(woman.archDeg).toBe(110)
    expect(measures(0.5).archDeg).toBe(90)
  })

  it('makes the symphysis 50 mm high in man and 45 mm in woman', () => {
    expect(man.symphysisMm).toBe(50)
    expect(woman.symphysisMm).toBe(45)
  })

  it("prints Testut's inlet index: 80 in man, 81.4 in woman", () => {
    expect(man.inletIndex).toBe(80)
    expect(woman.inletIndex).toBe(81.4)
  })

  it('gives the woman a lower, wider sacrum', () => {
    expect(woman.sacrumWidth).toBeGreaterThan(man.sacrumWidth)
    expect(woman.sacrumHeight).toBeLessThan(man.sacrumHeight)
  })

  it('separates her acetabula and pubic spines more, and widens her inlet', () => {
    expect(woman.acetabula).toBeGreaterThan(man.acetabula)
    expect(woman.pubicTubercles).toBeGreaterThan(man.pubicTubercles)
    expect(woman.inletWidth).toBeGreaterThan(man.inletWidth)
  })

  it('makes her iliac wings wider and lower, with a flatter crest', () => {
    expect(WOMAN.crestX).toBeGreaterThan(MAN.crestX)
    expect(WOMAN.crestTopY).toBeGreaterThan(MAN.crestTopY)
    expect(WOMAN.crestS).toBeLessThan(MAN.crestS)
  })

  it('juts the promontory further in man (heart-shaped inlet) and rounds his obturator foramen', () => {
    expect(MAN.promontory).toBeGreaterThan(WOMAN.promontory)
    expect(MAN.obturatorRound).toBeGreaterThan(WOMAN.obturatorRound)
  })

  it('interpolates every parameter between the two sexes', () => {
    const mid = paramsAt(0.5)
    expect(mid.acetX).toBe((MAN.acetX + WOMAN.acetX) / 2)
  })

  it('produces finite, closed paths at any point between them', () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const s = pelvisShape(t)
      for (const d of [s.hipBone, s.sacrum, s.inlet, s.fossa, s.obturator]) {
        expect(d).not.toMatch(/NaN|Infinity/)
        expect(d.trim().endsWith('Z')).toBe(true)
      }
    }
  })
})
