import { describe, expect, it } from 'vitest'
import { blindField, bundles, CHIASM_Y, fieldKey, fieldOf, hemisphereOf, lesions, type Side, type Vertical } from './visual-fields'

const blind = (id: string, side: Side = 'right') => [...blindField(lesions.find((l) => l.id === id)!, side)].sort()
const quarters = (eyes: Side[], sides: Side[], verticals: Vertical[] = ['upper', 'lower']) =>
  eyes.flatMap((e) => sides.flatMap((s) => verticals.map((v) => fieldKey(e, s, v)))).sort()

describe('the optic pathway', () => {
  it('has one bundle per quadrant of each retina', () => {
    expect(bundles).toHaveLength(8)
    expect(new Set(bundles.map((b) => b.id)).size).toBe(8)
  })

  it('chains the two neurons of every bundle at the lateral geniculate body', () => {
    for (const b of bundles) expect(b.neurons[1].points[0], b.id).toEqual(b.neurons[0].points.at(-1))
  })

  it('crosses only the nasal fibres, and in the chiasm (semidecussation)', () => {
    for (const b of bundles) {
      const xs = b.neurons.flatMap((n) => n.points.map(([x]) => x))
      const crossings = xs.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(xs[i])).length
      expect(crossings, b.id).toBe(b.half === 'nasal' ? 1 : 0)
      // Every bundle ends in the hemisphere it belongs to.
      expect(Math.sign(xs.at(-1)!), b.id).toBe(hemisphereOf(b) === 'left' ? -1 : 1)
      if (b.half === 'nasal') {
        const [, before, after] = b.neurons[0].points
        expect(before[1]).toBeLessThan(CHIASM_Y)
        expect(after[1]).toBeGreaterThan(CHIASM_Y)
      }
    }
  })

  it('sends the lower retina forward round the temporal horn (Meyer) and the upper one straight back', () => {
    for (const b of bundles) {
      const [lgn, next] = b.neurons[1].points
      if (b.vertical === 'lower') expect(next[1], b.id).toBeLessThan(lgn[1])
      else expect(next[1], b.id).toBeGreaterThan(lgn[1])
    }
  })

  it('inverts the image: each quadrant of the retina sees the opposite one of the field', () => {
    expect(fieldOf({ eye: 'left', half: 'nasal', vertical: 'upper' })).toEqual({ eye: 'left', side: 'left', vertical: 'lower' })
    expect(fieldOf({ eye: 'right', half: 'temporal', vertical: 'lower' })).toEqual({ eye: 'right', side: 'left', vertical: 'upper' })
  })

  it('makes each hemisphere see the opposite half of space', () => {
    for (const b of bundles) expect(fieldOf(b).side, b.id).toBe(hemisphereOf(b) === 'left' ? 'right' : 'left')
  })
})

describe('the defects (Testut p. 1176, fig. 975)', () => {
  it('optic nerve: blindness of that eye only', () => {
    expect(blind('nerve')).toEqual(quarters(['right'], ['left', 'right']))
    expect(blind('nerve', 'left')).toEqual(quarters(['left'], ['left', 'right']))
  })

  it('centre of the chiasm: bitemporal hemianopia, whichever side is chosen', () => {
    const bitemporal = [fieldKey('left', 'left', 'upper'), fieldKey('left', 'left', 'lower'), fieldKey('right', 'right', 'upper'), fieldKey('right', 'right', 'lower')].sort()
    expect(blind('chiasm', 'right')).toEqual(bitemporal)
    expect(blind('chiasm', 'left')).toEqual(bitemporal)
  })

  it('optic tract and calcarine: homonymous hemianopia of the opposite side', () => {
    expect(blind('tract')).toEqual(quarters(['left', 'right'], ['left']))
    expect(blind('calcarine')).toEqual(quarters(['left', 'right'], ['left']))
    expect(blind('tract', 'left')).toEqual(quarters(['left', 'right'], ['right']))
  })

  it("Meyer's loop: the opposite upper quadrant of both eyes", () => {
    expect(blind('meyer')).toEqual(quarters(['left', 'right'], ['left'], ['upper']))
  })

  it('dorsal bundle: the opposite lower quadrant of both eyes', () => {
    expect(blind('dorsal')).toEqual(quarters(['left', 'right'], ['left'], ['lower']))
  })

  it('a lip of the calcarine: the quadrant opposite in side and height', () => {
    expect(blind('cuneus')).toEqual(quarters(['left', 'right'], ['left'], ['lower']))
    expect(blind('lingual')).toEqual(quarters(['left', 'right'], ['left'], ['upper']))
  })
})
