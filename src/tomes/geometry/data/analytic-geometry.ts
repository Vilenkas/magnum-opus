/**
 * Pure mathematical functions for plane analytic geometry based on
 * Charles H. Lehmann, "Geometría analítica" (Limusa / Wiley).
 */

export interface Point2D {
  x: number
  y: number
}

export interface GeneralLine {
  /** Coefficients of Ax + By + C = 0 */
  a: number
  b: number
  c: number
}

/**
 * Distance between two points P1(x1, y1) and P2(x2, y2).
 * Lehmann, Cap. I, Art. 6.
 */
export function distance(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

/**
 * Division of a directed segment P1P2 in a given ratio r = P1P / PP2 (r != -1).
 * Lehmann, Cap. I, Art. 7.
 */
export function divideSegment(p1: Point2D, p2: Point2D, r: number): Point2D {
  if (Math.abs(r + 1) < 1e-9) {
    throw new Error('Ratio r cannot be -1 (point at infinity)')
  }
  return {
    x: (p1.x + r * p2.x) / (1 + r),
    y: (p1.y + r * p2.y) / (1 + r),
  }
}

/**
 * Midpoint of a segment P1P2 (ratio r = 1).
 * Lehmann, Cap. I, Art. 7, Corolario.
 */
export function midpoint(p1: Point2D, p2: Point2D): Point2D {
  return divideSegment(p1, p2, 1)
}

/**
 * Slope m of a non-vertical line passing through P1 and P2.
 * Returns null if the line is vertical (dx = 0).
 * Lehmann, Cap. I, Art. 8.
 */
export function slope(p1: Point2D, p2: Point2D): number | null {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  if (Math.abs(dx) < 1e-9) return null
  return dy / dx
}

/**
 * Inclination angle alpha of a line in radians in [0, pi).
 * Lehmann, Cap. I, Art. 8.
 */
export function inclinationAngle(p1: Point2D, p2: Point2D): number {
  const m = slope(p1, p2)
  if (m === null) return Math.PI / 2
  let angle = Math.atan(m)
  if (angle < 0) angle += Math.PI
  return angle
}

/**
 * Angle theta from line l1 (slope m1) to line l2 (slope m2) measured counterclockwise.
 * tan(theta) = (m2 - m1) / (1 + m1 * m2).
 * Lehmann, Cap. I, Art. 10.
 */
export function angleBetweenLines(m1: number | null, m2: number | null): number {
  // Both vertical -> parallel (0 rad)
  if (m1 === null && m2 === null) return 0
  // One vertical
  if (m1 === null) {
    // line 1 is x = c (angle pi/2). Angle from line 1 to line 2
    const theta2 = Math.atan(m2!)
    let diff = theta2 - Math.PI / 2
    while (diff < 0) diff += Math.PI
    return diff
  }
  if (m2 === null) {
    let diff = Math.PI / 2 - Math.atan(m1)
    while (diff < 0) diff += Math.PI
    return diff
  }

  // Perpendicular condition: 1 + m1*m2 = 0
  if (Math.abs(1 + m1 * m2) < 1e-9) {
    return Math.PI / 2
  }

  const tanTheta = (m2 - m1) / (1 + m1 * m2)
  let theta = Math.atan(tanTheta)
  if (theta < 0) theta += Math.PI
  return theta
}

/**
 * Line equation Ax + By + C = 0 passing through two distinct points.
 * Lehmann, Cap. III, Art. 24.
 */
export function lineFromTwoPoints(p1: Point2D, p2: Point2D): GeneralLine {
  const a = p1.y - p2.y
  const b = p2.x - p1.x
  const c = p1.x * p2.y - p2.x * p1.y
  return normalizeLine({ a, b, c })
}

/**
 * Line equation Ax + By + C = 0 given point and slope m.
 * If slope is null, line is vertical: x - p.x = 0.
 * Lehmann, Cap. III, Art. 23.
 */
export function lineFromPointSlope(p: Point2D, m: number | null): GeneralLine {
  if (m === null) {
    return { a: 1, b: 0, c: -p.x }
  }
  // y - y1 = m(x - x1) -> mx - y + (y1 - m x1) = 0
  return normalizeLine({
    a: m,
    b: -1,
    c: p.y - m * p.x,
  })
}

/**
 * Normalizes line coefficients so that a^2 + b^2 > 0 and if a != 0, a > 0.
 */
export function normalizeLine(line: GeneralLine): GeneralLine {
  const norm = Math.hypot(line.a, line.b)
  if (norm < 1e-9) throw new Error('Degenerate line coefficients')
  let sign = 1
  if (line.a < -1e-9 || (Math.abs(line.a) < 1e-9 && line.b < 0)) {
    sign = -1
  }
  return {
    a: (sign * line.a) / norm,
    b: (sign * line.b) / norm,
    c: (sign * line.c) / norm,
  }
}

/**
 * Perpendicular distance from a point P0(x0, y0) to line Ax + By + C = 0.
 * d = |A x0 + B y0 + C| / sqrt(A^2 + B^2).
 * Lehmann, Cap. III, Art. 30.
 */
export function distancePointToLine(p: Point2D, line: GeneralLine): number {
  const num = Math.abs(line.a * p.x + line.b * p.y + line.c)
  const den = Math.hypot(line.a, line.b)
  return num / den
}

/**
 * Classification of a second-degree general equation Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0.
 * Discriminant Delta = B^2 - 4AC.
 * Lehmann, Cap. IX, Art. 72.
 */
export type ConicType = 'ellipse' | 'parabola' | 'hyperbola' | 'circle'

export function classifyConic(a: number, b: number, c: number): ConicType {
  const delta = b * b - 4 * a * c
  if (Math.abs(delta) < 1e-9) return 'parabola'
  if (delta > 0) return 'hyperbola'
  if (Math.abs(b) < 1e-9 && Math.abs(a - c) < 1e-9) return 'circle'
  return 'ellipse'
}

/**
 * Area of a triangle with vertices P1, P2, P3.
 * Area = 1/2 | x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2) |.
 * Lehmann, Cap. III, Art. 31.
 */
export function triangleArea(p1: Point2D, p2: Point2D, p3: Point2D): number {
  return 0.5 * Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y))
}
