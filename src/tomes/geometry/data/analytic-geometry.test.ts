import { describe, expect, it } from 'vitest'
import {
  angleBetweenLines,
  classifyConic,
  distance,
  distancePointToLine,
  divideSegment,
  inclinationAngle,
  lineFromPointSlope,
  lineFromTwoPoints,
  midpoint,
  slope,
  triangleArea,
} from './analytic-geometry'

describe('analytic-geometry pure calculations (Lehmann)', () => {
  it('computes distance between two points (Cap. I, Art. 6)', () => {
    // 3-4-5 right triangle
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    expect(distance({ x: -2, y: 5 }, { x: 4, y: -3 })).toBe(10)
    expect(distance({ x: 7, y: 7 }, { x: 7, y: 7 })).toBe(0)
  })

  it('divides segment in a given ratio and calculates midpoint (Cap. I, Art. 7)', () => {
    const p1 = { x: 2, y: 3 }
    const p2 = { x: 8, y: 9 }
    // Midpoint: r = 1
    const mid = midpoint(p1, p2)
    expect(mid).toEqual({ x: 5, y: 6 })

    // Trisection closer to p1: r = 1/2 -> P divides P1P / PP2 = 1/2
    const pTrisect = divideSegment(p1, p2, 0.5)
    expect(pTrisect.x).toBeCloseTo(4)
    expect(pTrisect.y).toBeCloseTo(5)

    // External division: r = 2
    const pExt = divideSegment(p1, p2, 2)
    expect(pExt.x).toBeCloseTo(6)
    expect(pExt.y).toBeCloseTo(7)

    // Division with r = -1 should throw
    expect(() => divideSegment(p1, p2, -1)).toThrow()
  })

  it('calculates slope and inclination angle (Cap. I, Art. 8)', () => {
    // Horizontal line
    expect(slope({ x: 1, y: 2 }, { x: 5, y: 2 })).toBe(0)
    expect(inclinationAngle({ x: 1, y: 2 }, { x: 5, y: 2 })).toBeCloseTo(0)

    // 45 degree line
    expect(slope({ x: 0, y: 0 }, { x: 3, y: 3 })).toBeCloseTo(1)
    expect(inclinationAngle({ x: 0, y: 0 }, { x: 3, y: 3 })).toBeCloseTo(Math.PI / 4)

    // Vertical line
    expect(slope({ x: 2, y: 1 }, { x: 2, y: 7 })).toBeNull()
    expect(inclinationAngle({ x: 2, y: 1 }, { x: 2, y: 7 })).toBeCloseTo(Math.PI / 2)
  })

  it('computes angle between two lines (Cap. I, Art. 10)', () => {
    // Perpendicular lines: slopes 1 and -1
    expect(angleBetweenLines(1, -1)).toBeCloseTo(Math.PI / 2)
    // Parallel lines: same slope
    expect(angleBetweenLines(2, 2)).toBeCloseTo(0)
    // Vertical and horizontal lines
    expect(angleBetweenLines(null, 0)).toBeCloseTo(Math.PI / 2)
  })

  it('computes line from two points and point-slope (Cap. III)', () => {
    const p1 = { x: 1, y: 2 }
    const p2 = { x: 3, y: 6 } // y = 2x -> 2x - y = 0
    const line = lineFromTwoPoints(p1, p2)
    // Distance of p1 and p2 to the line should be 0
    expect(distancePointToLine(p1, line)).toBeCloseTo(0)
    expect(distancePointToLine(p2, line)).toBeCloseTo(0)

    const linePS = lineFromPointSlope(p1, 2)
    expect(distancePointToLine({ x: 0, y: 0 }, linePS)).toBeCloseTo(0)
  })

  it('computes perpendicular distance from point to line (Cap. III, Art. 30)', () => {
    // Line 3x + 4y - 12 = 0
    const line = { a: 3, b: 4, c: -12 }
    // Origin (0,0): d = |-12| / 5 = 2.4
    expect(distancePointToLine({ x: 0, y: 0 }, line)).toBeCloseTo(2.4)
    // Point on the line: (4, 0)
    expect(distancePointToLine({ x: 4, y: 0 }, line)).toBeCloseTo(0)
  })

  it('computes triangle area from vertices (Cap. III, Art. 31)', () => {
    // Right triangle with legs 3 and 4 -> Area = 6
    const a = { x: 0, y: 0 }
    const b = { x: 4, y: 0 }
    const c = { x: 0, y: 3 }
    expect(triangleArea(a, b, c)).toBeCloseTo(6)
  })

  it('classifies conics from general second-degree coefficients (Cap. IX, Art. 72)', () => {
    // Circle: x^2 + y^2 - 4 = 0 (A=1, B=0, C=1)
    expect(classifyConic(1, 0, 1)).toBe('circle')
    // Ellipse: 2x^2 + 3y^2 - 6 = 0 (A=2, B=0, C=3)
    expect(classifyConic(2, 0, 3)).toBe('ellipse')
    // Parabola: y^2 - 4x = 0 (A=0, B=0, C=1 -> B^2 - 4AC = 0)
    expect(classifyConic(0, 0, 1)).toBe('parabola')
    // Hyperbola: x^2 - y^2 - 1 = 0 (A=1, B=0, C=-1 -> B^2 - 4AC = 4 > 0)
    expect(classifyConic(1, 0, -1)).toBe('hyperbola')
  })
})
