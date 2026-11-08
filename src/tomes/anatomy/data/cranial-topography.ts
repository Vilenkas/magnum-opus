/**
 * Cranioencephalic topography (Testut t. II pp. 1190–1195): how the parts of the brain are marked
 * on the skull. A lateral view of the head in centimetres, facing left: x runs backwards from the
 * nasion, y upwards from the upper border of the zygomatic arch.
 *
 * The skull is drawn to average adult measurements; every construction is then built from it with
 * Testut's own distances (Poirier, Lucas-Championnière, Chipault, Testut and Jacob, Marie, Foix and
 * Bertrand), never placed by hand. Tests check that independent methods agree with each other.
 */

export type Point = [number, number]

/** Points of the skull's side, where the constructions start. */
export const LANDMARKS = {
  nasion: [0, 3] as Point,
  glabella: [-0.45, 4.3] as Point,
  /** The external orbital process: the frontozygomatic suture, on the orbit's outer rim. */
  orbitalProcess: [1.6, 2.5] as Point,
  /** Middle of the hind border of the external orbital process. */
  retroorbital: [2.1, 2.2] as Point,
  /** The zygomatic arch, upper border: y = 0 between these two x. */
  archFront: 2.2,
  archBack: 7.2,
  /** The preauricular depression, in front of the tragus. */
  preauricular: [7.4, 0] as Point,
  meatus: [8.0, -0.5] as Point,
  mastoidTip: [9.2, -3.3] as Point,
  asterion: [12.0, 1.0] as Point,
  pterion: [3.7, 4.4] as Point,
  parietalEminence: [10.6, 9.8] as Point,
  inion: [17.7, 2.0] as Point,
}

/** The midsagittal curve of the vault, nasion → glabella → bregma → lambda → inion. */
const VAULT_CONTROL: Point[] = [
  LANDMARKS.nasion,
  LANDMARKS.glabella,
  [-0.35, 6.6],
  [0.6, 9.1],
  [2.4, 11.3],
  [4.8, 12.85],
  [7.7, 13.6],
  [10.6, 13.45],
  [13.2, 12.3],
  [15.3, 10.4],
  [17.0, 8.0],
  [17.8, 5.4],
  [18.0, 3.4],
  LANDMARKS.inion,
]

/** A Catmull-Rom curve through the points, sampled densely. */
export function smooth(pts: Point[], perSegment = 24): Point[] {
  const out: Point[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b, c, d] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]]
    for (let k = 0; k < perSegment; k++) {
      const t = k / perSegment
      const t2 = t * t
      const t3 = t2 * t
      const f = (j: 0 | 1) => 0.5 * (2 * b[j] + (-a[j] + c[j]) * t + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * t2 + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * t3)
      out.push([f(0), f(1)])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

export const vault = smooth(VAULT_CONTROL)

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1])
const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Cumulative arc length of the vault from the nasion, in cm. */
const vaultArc = vault.reduce<number[]>((acc, p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dist(vault[i - 1], p)], [])
/** The nasion–inion arc, as a tape measure laid over the midline would give it. */
export const vaultLength = vaultArc[vaultArc.length - 1]

/** The point of the midline at `s` cm from the nasion, measured along the curve. */
export function pointAtArc(s: number): Point {
  const i = vaultArc.findIndex((a) => a >= s)
  if (i <= 0) return i === 0 ? vault[0] : vault[vault.length - 1]
  return lerp(vault[i - 1], vault[i], (s - vaultArc[i - 1]) / (vaultArc[i] - vaultArc[i - 1]))
}

/** The arc length at which the midline, over the top, passes above the abscissa x. */
export function arcAbove(x: number): number {
  for (let i = 1; i < vault.length; i++) {
    const [a, b] = [vault[i - 1], vault[i]]
    if (a[1] > 8 && b[1] > 8 && (a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) return vaultArc[i - 1] + ((vaultArc[i] - vaultArc[i - 1]) * (x - a[0])) / (b[0] - a[0])
  }
  throw new Error(`The vault does not pass above x = ${x}`)
}

/** Bregma by the usual frontal arc, 12.5 cm from the nasion (adult average). */
export const BREGMA = pointAtArc(12.5)
/** Lambda by Testut's datum (p. 1191): 6 or 7 cm above the external occipital protuberance. */
export const LAMBDA = [...vault].reverse().find((p) => dist(p, LANDMARKS.inion) >= 6.5)!
export const LAMBDA_ARC = vaultArc[vault.indexOf(LAMBDA)]
/** The highest point of the vault: the convexity Poirier measures down from. */
export const VERTEX = vault.reduce((a, p) => (p[1] > a[1] ? p : a))

/** Sutures on the side of the skull, for the backdrop and for the relations of the lobes. */
export const SUTURES: Record<'coronal' | 'squamous' | 'lambdoid' | 'sphenoparietal', Point[]> = {
  coronal: smooth([BREGMA, [5.6, 10.4], [4.3, 7.2], LANDMARKS.pterion], 12),
  sphenoparietal: smooth([LANDMARKS.pterion, [5.0, 5.0]], 4),
  squamous: smooth([[5.0, 5.0], [6.9, 6.6], [9.0, 7.0], [10.9, 5.6], [11.6, 3.0], LANDMARKS.asterion], 12),
  lambdoid: smooth([LAMBDA, [14.6, 6.4], [13.0, 3.6], LANDMARKS.asterion], 12),
}

/**
 * The lower border of the hemisphere (pp. 1190–1191). Frontal lobe: from the nasofrontal angle
 * backwards, 6–15 mm above the orbital rim. Temporal lobe: from a point 15 mm behind the external
 * orbital process and 2 cm above the zygoma, down and back grazing the arch at the jaw joint, then
 * up to the asterion. Occipital lobe: along the superior curved line to the inion.
 */
const ORBITAL_RIM_Y = 3.0
export const TEMPORAL_POLE: Point = [LANDMARKS.orbitalProcess[0] + 1.5, 2]
export const lowerBorder: Point[] = smooth(
  [
    [0.35, ORBITAL_RIM_Y + 0.6],
    [1.4, ORBITAL_RIM_Y + 1.0],
    [2.4, ORBITAL_RIM_Y + 1.3],
    [3.0, 3.3],
    TEMPORAL_POLE,
    [4.8, 0.8],
    [6.6, 0.05],
    [9.4, 0.4],
    LANDMARKS.asterion,
    [15.6, 1.35],
    LANDMARKS.inion,
  ],
  10,
)

/** The vault's curve moved inwards by the thickness of bone and meninges. */
const INSET = 0.7
const insetVault: Point[] = vault.map((p, i) => {
  const a = vault[Math.max(i - 1, 0)]
  const b = vault[Math.min(i + 1, vault.length - 1)]
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const l = Math.hypot(dx, dy)
  // The curve runs clockwise seen from the left (front → top → back), so inwards is to the right.
  return [p[0] + (INSET * -dy) / l * -1, p[1] + (INSET * dx) / l * -1]
})

/** The hemisphere seen from the side: the vault's inner face above, the lower border below. */
export const hemisphere: Point[] = [...insetVault.filter((p) => p[1] > ORBITAL_RIM_Y + 0.6 && p[0] < LANDMARKS.inion[0] + 0.1 && !(p[0] > 15 && p[1] < 2.2)), ...[...lowerBorder].reverse()]

/** The cerebellum, in the posterior fossa under the occipital lobe and behind the mastoid. */
export const cerebellum: Point[] = smooth([[10.2, 0.0], [11.6, 0.5], [13.6, 0.75], [16.0, 1.05], [17.2, 0.3], [16.9, -1.3], [15.2, -2.6], [12.4, -2.7], [10.4, -1.6], [10.2, 0.0]], 8)

/** Chipault: the cerebellum lies below the line from the retroorbital tubercle to 1 cm above the inion. */
export const CHIPAULT_LINE: [Point, Point] = [LANDMARKS.retroorbital, [LANDMARKS.inion[0], LANDMARKS.inion[1] + 1]]

/** The height of a line at abscissa x. */
export function heightAt([a, b]: [Point, Point], x: number) {
  return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])
}

/** Poirier's fissure of Rolando: upper end at half the nasion–inion arc plus 2 cm; lower end on the
 *  perpendicular to the arch through the preauricular depression, 7 cm above the arch. */
export const ROLANDO_POIRIER = {
  upperArc: vaultLength / 2 + 2,
  upper: pointAtArc(vaultLength / 2 + 2),
  lower: [LANDMARKS.preauricular[0], 7] as Point,
}

/** Lucas-Championnière: upper end 5 cm behind the point where the biauricular plane crosses the midline. */
export const ROLANDO_CHAMPIONNIERE = {
  auricularArc: arcAbove(LANDMARKS.meatus[0]),
  upperArc: arcAbove(LANDMARKS.meatus[0]) + 5,
  upper: pointAtArc(arcAbove(LANDMARKS.meatus[0]) + 5),
}

export const ROLANDO: [Point, Point] = [ROLANDO_POIRIER.upper, ROLANDO_POIRIER.lower]

/** The point of Rolando's line at a fraction t from its upper end. */
export const alongRolando = (t: number) => lerp(ROLANDO[0], ROLANDO[1], t)

/** Lucas-Championnière's Sylvian line: from 3 cm behind the external orbital process, parallel to the
 *  arch and 5 cm above it, as far as below the parietal eminence. */
export const SYLVIAN: [Point, Point] = [
  [LANDMARKS.orbitalProcess[0] + 3, 5],
  [LANDMARKS.parietalEminence[0], 5],
]

/** The cortical centres along Rolando's line (p. 1191): lower limb above, upper limb in the middle, face below. */
export const ROLANDIC_CENTRES = [
  { id: 'leg', name: 'Miembro inferior', from: 0, to: 1 / 3 },
  { id: 'arm', name: 'Miembro superior', from: 1 / 3, to: 2 / 3 },
  { id: 'face', name: 'Cara', from: 2 / 3, to: 1 },
] as const

/** Poirier's optostriate nuclei: front 18 mm behind the external orbital process, back on the
 *  vertical through Rolando's upper end, top 45 mm under the convexity. No lower limit is given. */
export const OPTOSTRIATE = {
  front: LANDMARKS.orbitalProcess[0] + 1.8,
  back: ROLANDO_POIRIER.upper[0],
  top: VERTEX[1] - 4.5,
}

/** Testut and Jacob's rectangle for the lateral ventricle: 2 and 5 cm above the arch; in front, the
 *  perpendicular at the junction of the arch's front third; behind, 5 cm behind the mastoid's tip. */
export const VENTRICLE_RECT = {
  bottom: 2,
  top: 5,
  front: LANDMARKS.archFront + (LANDMARKS.archBack - LANDMARKS.archFront) / 3,
  back: LANDMARKS.mastoidTip[0] + 5,
}

/** Marie, Foix and Bertrand's frontolambdoid line, from the external orbital process to the lambda. */
export const FRONTOLAMBDOID: [Point, Point] = [LANDMARKS.orbitalProcess, LAMBDA]

/** Their radiographic results (pp. 1193–1194): points read off the frontolambdoid line. */
export const MFB_POINTS = {
  /** Broca's centre: 3–4 cm behind the external orbital process, a little above the line. */
  broca: [LANDMARKS.orbitalProcess[0] + 3.5, heightAt(FRONTOLAMBDOID, LANDMARKS.orbitalProcess[0] + 3.5) + 0.5] as Point,
  /** The angular gyrus: 8 mm above the line, about 3 cm behind the end of Sylvius. */
  angular: [SYLVIAN[1][0] + 3, heightAt(FRONTOLAMBDOID, SYLVIAN[1][0] + 3) + 0.8] as Point,
}

/** Ray casting: is the point inside the polygon? */
export function inside([x, y]: Point, poly: Point[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

/** Where a polyline crosses the horizontal y (first crossing), or null. */
export function crossingAtHeight(line: Point[], y: number): number | null {
  for (let i = 1; i < line.length; i++) {
    const [a, b] = [line[i - 1], line[i]]
    if ((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1])
  }
  return null
}

export { dist }
