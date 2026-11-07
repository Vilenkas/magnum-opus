/**
 * The floor of the fourth ventricle (Testut t. II pp. 835–846, figs. 694, 697 and 700): a rhombus
 * whose transverse axis, between the lateral angles, splits it into a lower, bulbar triangle and
 * an upper, pontine one. Its reliefs are the nuclei of the cranial nerves underneath, arranged in
 * three columns on each side: somatomotor by the midline, vegetative along the sulcus limitans,
 * sensory outside. The names Testut uses come with today's (Netter, lám. S-41) when they differ.
 *
 * Geometry: 1 unit = 0.1 mm, midline x = 0, superior angle y = 0. Shapes are given for one half
 * in [u, y], where u is the fraction of the half width of the rhombus at that height (0 at the
 * midline, 1 at the edge), so everything stays inside the floor; the plate mirrors them.
 */

/** Testut's measurements, in mm: the width between the lateral angles and the two triangles. */
export const FLOOR_MM = { width: 16, bulbar: 11, pontine: 19 }

export const HALF_WIDTH = (FLOOR_MM.width / 2) * 10
export const LATERAL_Y = FLOOR_MM.pontine * 10
export const BOTTOM_Y = (FLOOR_MM.pontine + FLOOR_MM.bulbar) * 10

/** Half width of the rhombus at height y. */
export function halfWidth(y: number) {
  if (y <= 0 || y >= BOTTOM_Y) return 0
  return y <= LATERAL_Y ? (HALF_WIDTH * y) / LATERAL_Y : (HALF_WIDTH * (BOTTOM_Y - y)) / (BOTTOM_Y - LATERAL_Y)
}

export type UY = [number, number]
export const toXY = ([u, y]: UY): [number, number] => [u * halfWidth(y), y]

export type Zone = 'somatomotor' | 'vegetative' | 'sensory' | 'other'

export const zoneName: Record<Zone, string> = {
  somatomotor: 'Zona somatomotora',
  vegetative: 'Zona vegetativa',
  sensory: 'Zona sensitiva',
  other: 'Sin núcleo propio',
}

export interface FloorRegion {
  id: string
  /** Testut's name. */
  name: string
  /** Today's name, when it differs. */
  modern?: string
  zone: Zone
  triangle: 'bulbar' | 'pontine' | 'both'
  /** One half of the shape, in [u, y]. */
  shape: UY[]
  /** What lies underneath. */
  beneath: string
}

export const regions: FloorRegion[] = [
  {
    id: 'hypoglossal',
    name: 'Ala blanca interna',
    modern: 'Trígono del hipogloso',
    zone: 'somatomotor',
    triangle: 'bulbar',
    shape: [[0.04, 194], [0.34, 194], [0.34, 292], [0.04, 292]],
    beneath:
      'El núcleo de origen del hipogloso mayor, del que toma su nombre de trígono del hipogloso. Una cuña blanquecina junto al tallo del cálamo, con la base arriba; un surco la divide en un área medial y otra lateral, a veces arrugada como una pluma de ave (el área plumiforme de Retzius).',
  },
  {
    id: 'vagal',
    name: 'Ala gris',
    modern: 'Trígono del vago',
    zone: 'vegetative',
    triangle: 'bulbar',
    shape: [[0.4, 198], [0.47, 198], [0.82, 262], [0.42, 284]],
    beneath:
      'Una capa gris en la que nacen los fascículos sensitivos del neumogástrico y del glosofaríngeo: es el trígono de los dos nervios. Forma una depresión, la fóvea inferior o fóvea del vago, en el trayecto del surco limitante, y pertenece a la zona vegetativa del bulbo.',
  },
  {
    id: 'postrema',
    name: 'Área postrema',
    zone: 'other',
    triangle: 'bulbar',
    shape: [[0.5, 288], [0.86, 266], [0.95, 270], [0.6, 293]],
    beneath:
      'Una franja oscura entre el ala gris y el pedúnculo cerebeloso inferior, separada del ala gris por un cordón claro, el fasciculus separans. Su significación era para Testut todavía muy oscura.',
  },
  {
    id: 'vestibular',
    name: 'Ala blanca externa',
    modern: 'Área vestibular',
    zone: 'sensory',
    triangle: 'both',
    shape: [[0.55, 172], [0.98, 182], [0.98, 198], [0.94, 236], [0.6, 206]],
    beneath:
      'La masa gris que representa el asta posterior de la médula y en la que terminan las dos ramas del nervio auditivo: el núcleo principal del vestibular por dentro y, más afuera, bajo el tubérculo acústico, los núcleos del coclear. Ocupa a la vez las dos porciones del suelo.',
  },
  {
    id: 'teres',
    name: 'Eminencia teres',
    modern: 'Colículo facial',
    zone: 'somatomotor',
    triangle: 'pontine',
    shape: [[0.06, 158], [0.3, 154], [0.36, 168], [0.3, 182], [0.06, 184]],
    beneath:
      'Una eminencia ovoidea de unos 4 mm junto al surco medio: debajo están el núcleo del motor ocular externo y el asa que da a su alrededor el facial, la rodilla del facial. De ahí sus dos nombres: eminencia del abducens, colículo facial.',
  },
  {
    id: 'funiculus',
    name: 'Funículo teres',
    modern: 'Eminencia medial',
    zone: 'somatomotor',
    triangle: 'pontine',
    shape: [[0.04, 36], [0.16, 36], [0.16, 152], [0.04, 152]],
    beneath:
      'El cordón redondo que prolonga la eminencia teres hacia el acueducto de Silvio, adelgazándose de 3 a 2 mm. Su significación es todavía oscura; Streeter lo llamó nucleus incertus.',
  },
  {
    id: 'superior-fovea',
    name: 'Fóvea superior',
    zone: 'vegetative',
    triangle: 'pontine',
    shape: [[0.44, 136], [0.54, 136], [0.54, 176], [0.48, 176]],
    beneath:
      'Una depresión por fuera de la eminencia teres, en el trayecto del surco limitante, también llamada fóvea del trigémino por el núcleo masticador que tiene debajo. Como la inferior, pertenece a la zona vegetativa.',
  },
  {
    id: 'coeruleus',
    name: 'Locus coeruleus',
    modern: 'Locus cerúleo',
    zone: 'sensory',
    triangle: 'pontine',
    shape: [[0.56, 70], [0.84, 70], [0.84, 108], [0.56, 108]],
    beneath:
      'Una pequeña superficie gris pizarrosa, de 5 o 6 mm, por delante de la fóvea superior: su color se debe a una capa de células pigmentadas que se transparenta bajo el epéndimo. A ella va a terminar una de las raíces del trigémino.',
  },
]

/**
 * The sulcus limitans, between the motor zone and the sensory one: along the outer side of the
 * ala blanca interna, between the two white wings, then outside the eminencia teres up to the top.
 */
export const sulcusLimitans: UY[] = [
  [0.37, 286],
  [0.37, 196],
  [0.5, 186],
  [0.38, 168],
  [0.4, 136],
  [0.22, 40],
]

/** The sulcus limitans at height y, as u, interpolated along its points. */
export function sulcusAt(y: number) {
  const pts = [...sulcusLimitans].sort((a, b) => a[1] - b[1])
  if (y <= pts[0][1]) return pts[0][0]
  for (let i = 1; i < pts.length; i++) {
    const [[u0, y0], [u1, y1]] = [pts[i - 1], pts[i]]
    if (y <= y1) return u0 + ((u1 - u0) * (y - y0)) / (y1 - y0)
  }
  return pts.at(-1)![0]
}

/** Horizontal extent [min u, max u] of a shape at height y, or null if it doesn't reach it. */
export function extentAt(shape: UY[], y: number): [number, number] | null {
  const us: number[] = []
  for (let i = 0; i < shape.length; i++) {
    const [[u0, y0], [u1, y1]] = [shape[i], shape[(i + 1) % shape.length]]
    if (y0 === y1) {
      if (y0 === y) us.push(u0, u1)
    } else if ((y - y0) * (y - y1) <= 0) us.push(u0 + ((u1 - u0) * (y - y0)) / (y1 - y0))
  }
  return us.length ? [Math.min(...us), Math.max(...us)] : null
}

/** The acoustic striae, crossing the floor from the median sulcus to the lateral recess. */
export const striae: UY[][] = [
  [[0.06, 182], [0.5, 186], [1, 188]],
  [[0.06, 190], [0.5, 192], [1, 191]],
  [[0.06, 197], [0.5, 197], [0.99, 194]],
]
