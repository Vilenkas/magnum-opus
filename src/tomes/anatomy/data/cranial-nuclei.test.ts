import { describe, expect, it } from 'vitest'
import {
  FACIAL_LOOP,
  LEVELS,
  NERVES,
  NUCLEI,
  TESTUT_TO_MODERN,
  height,
  isEfferent,
  nervesOf,
  nucleiOf,
  nucleus,
  stretchOf,
  type ModernColumn,
  type Nucleus,
} from './cranial-nuclei'

const overlapY = (a: Nucleus, b: Nucleus) => Math.min(a.y[1], b.y[1]) - Math.max(a.y[0], b.y[0]) > 0

describe('cranial nuclei: Testut against today', () => {
  it('map Testut’s columns onto today’s nucleus by nucleus, with the mesencephalic V the one disagreement', () => {
    const off = NUCLEI.filter((n) => !TESTUT_TO_MODERN[n.testut].includes(n.modern)).map((n) => n.id)
    // Testut’s spinal XI is a head of the anterior horn; Moore counts it somatic motor, as the XII.
    expect(off.sort()).toEqual(['mesencephalic-v', 'spinal-xi'])
    expect(isEfferent(nucleus('mesencephalic-v'), 'testut')).toBe(true)
    expect(isEfferent(nucleus('mesencephalic-v'), 'today')).toBe(false)
    for (const n of NUCLEI.filter((n) => n.id !== 'mesencephalic-v')) expect(isEfferent(n, 'testut')).toBe(isEfferent(n, 'today'))
  })

  it('give the bulbar root of the XI to the vagus today, as Testut already suspected', () => {
    const amb = nucleus('ambiguus')
    expect(nervesOf(amb, 'testut')).toEqual(['IX', 'X', 'XI'])
    expect(nervesOf(amb, 'today')).toEqual(['IX', 'X'])
    expect(nucleiOf('XI', 'today').map((n) => n.id)).toEqual(['spinal-xi'])
  })

  it('leave the VIII purely sensory and the IV, VI and XII purely motor', () => {
    for (const mode of ['testut', 'today'] as const) {
      expect(nucleiOf('VIII', mode).every((n) => !isEfferent(n, mode))).toBe(true)
      for (const nerve of ['IV', 'VI', 'XII'] as const) expect(nucleiOf(nerve, mode).every((n) => isEfferent(n, mode))).toBe(true)
      // The mixed nerves have nuclei on both sides.
      for (const nerve of ['V', 'VII', 'IX', 'X'] as const) {
        const sides = new Set(nucleiOf(nerve, mode).map((n) => isEfferent(n, mode)))
        expect(sides.size).toBe(2)
      }
    }
    for (const nerve of NERVES) expect(nucleiOf(nerve, 'testut').length).toBeGreaterThan(0)
  })
})

describe('cranial nuclei: the columns on the floor', () => {
  const floorOrder: ModernColumn[] = ['GSE', 'GVE', 'VA', 'SSA']
  it('run from the midline outwards somatic motor, visceral motor | visceral sensory, special sensory (the sulcus limitans in between)', () => {
    const floor = NUCLEI.filter((n) => n.depth === 'floor' && n.y[0] >= LEVELS.ventricleTop)
    for (const a of floor)
      for (const b of floor) {
        const ia = floorOrder.indexOf(a.modern)
        const ib = floorOrder.indexOf(b.modern)
        if (ia < ib && overlapY(a, b)) expect(a.x[1], `${a.id} inside ${b.id}`).toBeLessThanOrEqual(b.x[0])
      }
  })

  it('put the branchial motor nuclei deep and outside the somatic ones, one after another down the head of the anterior horn', () => {
    const [v, vii, amb] = ['motor-v', 'facial', 'ambiguus'].map(nucleus)
    for (const n of [v, vii, amb]) expect(n.depth).toBe('deep')
    expect(v.y[1]).toBeLessThanOrEqual(vii.y[0])
    expect(vii.y[1]).toBe(amb.y[0]) // the facial’s lower end almost merges with the ambiguus
    for (const gse of NUCLEI.filter((n) => n.modern === 'GSE' && n.depth === 'floor'))
      for (const sve of [v, vii, amb]) if (overlapY(gse, sve)) expect(sve.x[0]).toBeGreaterThan(gse.x[1])
  })

  it('keep the somatic motor column in Testut’s order from the midbrain down: III, IV, VI, XII, the IV touching the III', () => {
    const [iii, iv, vi, xii] = ['oculomotor', 'trochlear', 'abducens', 'hypoglossal'].map(nucleus)
    expect(iii.y[1]).toBe(iv.y[0])
    expect(iv.y[1]).toBeLessThan(vi.y[0])
    expect(vi.y[1]).toBeLessThan(xii.y[0])
  })
})

describe('cranial nuclei: Testut’s measures', () => {
  it('make the ambiguus 18 to 20 mm, ending at the top of the olive, with the IX above, the X in the middle and the XI below', () => {
    const amb = nucleus('ambiguus')
    expect(height(amb)).toBeGreaterThanOrEqual(18)
    expect(height(amb)).toBeLessThanOrEqual(20)
    expect(amb.y[0]).toBe(LEVELS.olive[0])
    const [ix] = stretchOf(amb, 'IX', 'testut')
    const [x] = stretchOf(amb, 'X', 'testut')
    const [xi] = stretchOf(amb, 'XI', 'testut')
    expect(ix[1]).toBe(x[0])
    expect(x[1]).toBe(xi[0])
  })

  it('stack the solitary fasciculus as van Gehuchten did: the VII at the top, then the IX, then the X', () => {
    const sol = nucleus('solitary')
    const tops = (['VII', 'IX', 'X'] as const).map((n) => stretchOf(sol, n, 'testut')[0][0])
    expect([...tops].sort((a, b) => a - b)).toEqual(tops)
  })

  it('give the facial nucleus 5.5 mm, the olive 12 to 15, and the hypoglossal 12.5 mm above the calamus and 2.5 below', () => {
    expect(height(nucleus('facial'))).toBeCloseTo(5.5)
    const olive = LEVELS.olive[1] - LEVELS.olive[0]
    expect(olive).toBeGreaterThanOrEqual(12)
    expect(olive).toBeLessThanOrEqual(15)
    const xii = nucleus('hypoglossal')
    expect(LEVELS.calamus - xii.y[0]).toBeCloseTo(12.5)
    expect(xii.y[1] - LEVELS.calamus).toBeCloseTo(2.5)
    expect(LEVELS.calamus - LEVELS.lateralAngles).toBe(11) // the bulbar triangle of the floor
  })

  it('send the trigeminal’s sensory column and the XI’s nucleus down into the cervical cord, the XI as far as C5', () => {
    expect(nucleus('spinal-v').y[1]).toBeGreaterThan(LEVELS.cord)
    expect(nucleus('spinal-xi').y[1]).toBe(LEVELS.c5)
  })
})

describe('cranial nuclei: the genu of the facial', () => {
  it('climbs from a nucleus lying below the VI’s and wraps it inside, above and outside before leaving at the bulbopontine sulcus', () => {
    const vi = nucleus('abducens')
    const vii = nucleus('facial')
    expect(vii.y[0]).toBeGreaterThan(vi.y[1])
    expect(LEVELS.bulbopontine).toBeGreaterThan(vi.y[1])
    expect(FACIAL_LOOP.some(([x, y]) => x < vi.x[0] && y > vi.y[0] && y < vi.y[1])).toBe(true) // inside
    expect(FACIAL_LOOP.some(([x, y]) => y < vi.y[0] && x > vi.x[0] && x < vi.x[1])).toBe(true) // above
    expect(FACIAL_LOOP.some(([x, y]) => x > vi.x[1] && y > vi.y[0] && y < vi.y[1])).toBe(true) // outside
    expect(FACIAL_LOOP.at(-1)![1]).toBe(LEVELS.bulbopontine)
  })
})
