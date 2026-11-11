/**
 * The shape of the stomach in the living, after the tone of its wall (Testut t. IV pp. 187–190, figs. 192–195, after
 * Delort and Schlesinger; Moore 8 p. 453).
 *
 * The cardia and the pylorus are fixed (the oesophagus and the duodenum hold them); everything in between hangs and
 * follows the tone. Schlesinger's four types are points on one scale `t`, from 0 (hypertonic) to 1 (atonic): the lower
 * the tone, the lower the lowest point, the longer the vertical part and the more the horizontal part has to climb
 * back to the pylorus. Lying down, the image widens and its lowest point rises by about one vertebral body.
 *
 * Units are vertebral bodies: x from the midline, positive to the subject's left; y downwards from the top of T11.
 * The figures are schematic (Delort's shadows), not measurements.
 */

export type Posture = 'standing' | 'supine'

export interface Point {
  x: number
  y: number
}

export interface Tone {
  id: 'hypertonic' | 'orthotonic' | 'hypotonic' | 'atonic'
  name: string
  t: number
  text: string
}

export const TONES: Tone[] = [
  {
    id: 'hypertonic',
    name: 'Hipertónico',
    t: 0,
    text: 'Un cuerno de la abundancia, pequeño y alto, sin separación entre la porción vertical y la horizontal: el estómago de los atletas de tórax ancho y musculatura potente.',
  },
  {
    id: 'orthotonic',
    name: 'Ortotónico',
    t: 0.33,
    text: 'Una J mayúscula: una porción vertical a la izquierda de la línea media, al menos dos veces más larga que la horizontal, que sube luego al píloro; en el ángulo entre las dos, la incisura de la curvatura menor.',
  },
  {
    id: 'hypotonic',
    name: 'Hipotónico',
    t: 0.66,
    text: 'La porción vertical se alarga, el fondo baja mucho y la porción horizontal tiene que subir para llegar al píloro: el tipo de los individuos delgados, de tórax largo y estrecho, y el femenino.',
  },
  {
    id: 'atonic',
    name: 'Atónico',
    t: 1,
    text: 'La exageración del anterior, que Testut tiene ya por patológica: el estómago relajado cae hasta la pelvis.',
  },
]

/** The fixed points: the cardia at T11, a little left of the midline; the pylorus at L1, at the midline or a little right. */
export const CARDIA: Point = { x: 1.1, y: 0.5 }
export const PYLORUS: Point = { x: -0.5, y: 2.5 }

/** The vertebrae drawn beside the stomach, from T9 down. */
export const VERTEBRAE = ['D9', 'D10', 'D11', 'D12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2'] as const
/** y of the top of each vertebra (T11 at 0). */
export const vertebraTop = (i: number) => i - 2

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Piecewise-linear through the four types' values. */
function along(t: number, values: [number, number, number, number]): number {
  const knots = TONES.map((x) => x.t)
  if (t <= knots[0]) return values[0]
  for (let i = 1; i < knots.length; i++) if (t <= knots[i]) return lerp(values[i - 1], values[i], (t - knots[i - 1]) / (knots[i] - knots[i - 1]))
  return values[3]
}

export interface Shape {
  /** The top of the fundus, under the left dome of the diaphragm (the air bubble). */
  fundus: Point
  /** The most lateral point of the greater curvature. */
  lateral: Point
  /** The lowest point of the greater curvature (Grégoire's lower pole). */
  lowest: Point
  /** The angle of the lesser curvature; when it is at the pylorus' height there is no angle. */
  angle: Point
  /** Width of the vertical part, at its middle. */
  width: number
}

export function shapeAt(t: number, posture: Posture = 'standing'): Shape {
  const lift = posture === 'supine' ? 1 : 0
  const widen = posture === 'supine' ? 0.6 : 0
  // Lying down it rises, but never above the pylorus that holds it.
  const lowestY = Math.max(PYLORUS.y + 0.3, along(t, [3.3, 4.6, 6.2, 8]) - lift)
  const lowestX = along(t, [1.2, 0.8, 0.6, 0.4])
  return {
    fundus: { x: along(t, [2.5, 2.4, 2.3, 2.2]) + widen / 2, y: -1.5 },
    lateral: { x: along(t, [3.3, 2.9, 2.6, 2.4]) + widen, y: along(t, [0.6, 1.2, 1.8, 2.4]) },
    lowest: { x: lowestX + widen / 2, y: lowestY },
    // The lesser curvature bends down to the angle, then climbs to the pylorus; the hypertonic horn has no angle.
    angle: { x: lowestX - 0.5, y: Math.max(PYLORUS.y, lowestY - along(t, [0.6, 1.4, 1.6, 1.8])) },
    width: along(t, [1.9, 1.6, 1.4, 1.2]) + widen,
  }
}

/** Length of the vertical (descending) part, from the top of the fundus to the lowest point. */
export const verticalLength = (s: Shape) => s.lowest.y - s.fundus.y
/** Length of the horizontal (pyloric) part, from the lowest point to the pylorus. */
export const horizontalLength = (s: Shape) => Math.hypot(s.lowest.x - PYLORUS.x, s.lowest.y - PYLORUS.y)
/** How far the horizontal part climbs to reach the pylorus. */
export const climb = (s: Shape) => s.lowest.y - PYLORUS.y
/** Depth of the angle of the lesser curvature below the pylorus. */
export const angleDepth = (s: Shape) => s.angle.y - PYLORUS.y

export function toneAt(t: number): Tone {
  return TONES.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a))
}

/** The vertebra in front of which a height lies. */
export function levelOf(y: number): string {
  const i = Math.floor(y + 2)
  return VERTEBRAE[Math.max(0, Math.min(VERTEBRAE.length - 1, i))]
}

/**
 * The outline as a closed path, through the cardia, the fundus, the greater curvature, the lowest point, the pylorus
 * and back up the lesser curvature, in plate coordinates (`toX`, `toY` map the units).
 */
export function outline(s: Shape, toX: (x: number) => number, toY: (y: number) => number): string {
  const P = (p: Point) => `${toX(p.x)} ${toY(p.y)}`
  const c = CARDIA
  const py = PYLORUS
  const half = 0.42
  const pyTop: Point = { x: py.x, y: py.y - half }
  const pyBottom: Point = { x: py.x, y: py.y + half }
  const lesserTop: Point = { x: c.x - 0.15, y: c.y + 0.3 }
  return [
    `M${P(c)}`,
    // Up into the fundus and round its dome.
    `C${P({ x: c.x - 0.1, y: c.y - 1.1 })} ${P({ x: s.fundus.x - 1.1, y: s.fundus.y })} ${P(s.fundus)}`,
    `C${P({ x: s.fundus.x + 0.8, y: s.fundus.y })} ${P({ x: s.lateral.x, y: s.lateral.y - 1.2 })} ${P(s.lateral)}`,
    // Down the greater curvature to the lowest point.
    `C${P({ x: s.lateral.x, y: s.lateral.y + (s.lowest.y - s.lateral.y) * 0.6 })} ${P({ x: s.lowest.x + s.width * 0.8, y: s.lowest.y })} ${P(s.lowest)}`,
    // The horizontal part, to the pylorus.
    `C${P({ x: s.lowest.x - s.width * 0.6, y: s.lowest.y })} ${P({ x: py.x + 0.6, y: pyBottom.y + 0.1 })} ${P(pyBottom)}`,
    `L${P(pyTop)}`,
    // Back along the lesser curvature, through the angle, to the cardia.
    `C${P({ x: py.x + 0.7, y: pyTop.y })} ${P({ x: s.angle.x - 0.4, y: s.angle.y - 0.1 })} ${P(s.angle)}`,
    `C${P({ x: s.angle.x + 0.5, y: s.angle.y })} ${P({ x: lesserTop.x - 0.25, y: lesserTop.y + 1 })} ${P(lesserTop)}`,
    'Z',
  ].join(' ')
}
