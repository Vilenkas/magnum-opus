/**
 * How the grey column of the spinal cord becomes the grey matter of the medulla oblongata
 * (Testut t. II pp. 716–719, figs. 586–590). The motor decussation beheads the anterior horn, the
 * sensory decussation the posterior one; the opening of the fourth ventricle spreads the four
 * resulting columns out, bases on its floor and heads deep; the arcuate fibres then cut them into
 * the nuclei of the cranial nerves. Each column is drawn as an ellipse that glides through the
 * four stages; the right half is described, the plate mirrors it.
 */

type Pt = [number, number]

export type ColumnId = 'anterior-base' | 'anterior-head' | 'posterior-base' | 'posterior-head'

export interface GreyColumn {
  id: ColumnId
  name: string
  kind: 'motor' | 'sensory'
  /** In the medulla: on the floor of the fourth ventricle, or deep in the bulb. */
  depth: 'floor' | 'deep'
  /** Nuclei the column breaks into, after Testut's fig. 590. */
  nuclei: string
}

export const columns: GreyColumn[] = [
  {
    id: 'anterior-base',
    name: 'Base del asta anterior',
    kind: 'motor',
    depth: 'floor',
    nuclei: 'Hipogloso mayor y, en su prolongación hacia arriba, motor ocular externo, patético y motor ocular común.',
  },
  {
    id: 'anterior-head',
    name: 'Cabeza del asta anterior',
    kind: 'motor',
    depth: 'deep',
    nuclei: 'Núcleo ambiguo (fascículos motores del glosofaríngeo, del neumogástrico y del espinal), facial y masticador.',
  },
  {
    id: 'posterior-base',
    name: 'Base del asta posterior',
    kind: 'sensory',
    depth: 'floor',
    nuclei: 'El ala gris: fascículos sensitivos del glosofaríngeo y del neumogástrico, intermediario de Wrisberg; y los núcleos del acústico.',
  },
  {
    id: 'posterior-head',
    name: 'Cabeza del asta posterior',
    kind: 'sensory',
    depth: 'deep',
    nuclei: 'La raíz inferior del trigémino; asoma en la superficie lateral del bulbo como tubérculo ceniciento de Rolando.',
  },
]

export interface Ellipse {
  x: number
  y: number
  rx: number
  ry: number
}

export interface BulbStage {
  id: string
  name: string
  text: string
  /** Outline of the section (anterior up). */
  outline: Ellipse
  /** Depth of the ventricle cut into the posterior face: 0, a closed canal; 1, the full floor. */
  ventricle: number
  /** Where the floor of the ventricle lies (y), once it is open. */
  floorY: number
  columns: Record<ColumnId, Ellipse>
  /** Decussating bundles shown at this stage. */
  decussation: { motor: boolean; sensory: boolean }
}

export const stages: BulbStage[] = [
  {
    id: 'cord',
    name: 'Médula cervical',
    text: 'Por debajo del entrecruzamiento de las pirámides, la columna gris central conserva su forma: cada asta tiene una cabeza y una base, unidas en una sola masa.',
    outline: { x: 0, y: 0, rx: 78, ry: 56 },
    ventricle: 0,
    floorY: 56,
    columns: {
      'anterior-head': { x: 24, y: -26, rx: 12, ry: 10 },
      'anterior-base': { x: 13, y: -10, rx: 9, ry: 8 },
      'posterior-base': { x: 14, y: 14, rx: 8, ry: 8 },
      'posterior-head': { x: 22, y: 27, rx: 7, ry: 9 },
    },
    decussation: { motor: false, sensory: false },
  },
  {
    id: 'decussations',
    name: 'Los dos entrecruzamientos',
    text: 'El fascículo piramidal cruzado atraviesa el asta anterior para pasar al lado opuesto y separa su cabeza de su base: la decapita. La cinta de Reil, al salir de los núcleos de Goll y de Burdach, hace lo mismo con el asta posterior. Quedan cuatro columnas grises, que ya no volverán a unirse.',
    outline: { x: 0, y: 0, rx: 72, ry: 58 },
    ventricle: 0,
    floorY: 58,
    columns: {
      'anterior-head': { x: 34, y: -22, rx: 11, ry: 9 },
      'anterior-base': { x: 10, y: -4, rx: 8, ry: 7 },
      'posterior-base': { x: 13, y: 15, rx: 7, ry: 6 },
      'posterior-head': { x: 40, y: 28, rx: 8, ry: 9 },
    },
    decussation: { motor: true, sensory: true },
  },
  {
    id: 'opening',
    name: 'El ventrículo se abre',
    text: 'El conducto del epéndimo se ensancha y se abre por detrás. Los cordones posteriores se separan de la línea media, y con ellos las columnas sensitivas, que se desvían hacia fuera.',
    outline: { x: 0, y: 0, rx: 76, ry: 60 },
    ventricle: 0.5,
    floorY: 30,
    columns: {
      'anterior-head': { x: 38, y: -10, rx: 10, ry: 9 },
      'anterior-base': { x: 10, y: 12, rx: 8, ry: 7 },
      'posterior-base': { x: 27, y: 18, rx: 8, ry: 6 },
      'posterior-head': { x: 52, y: 20, rx: 8, ry: 9 },
    },
    decussation: { motor: false, sensory: false },
  },
  {
    id: 'ventricle',
    name: 'El suelo del cuarto ventrículo',
    text: 'Abierto el ventrículo, las cuatro columnas ocupan su posición definitiva: las bases, en el suelo ventricular, la motora por dentro y la sensitiva por fuera; las cabezas, en la profundidad del bulbo. Las fibras arciformes las cortan luego en trozos superpuestos: los núcleos de los nervios craneales.',
    outline: { x: 0, y: 0, rx: 82, ry: 62 },
    ventricle: 1,
    floorY: 24,
    columns: {
      'anterior-head': { x: 26, y: -4, rx: 9, ry: 8 },
      'anterior-base': { x: 10, y: 16, rx: 8, ry: 6 },
      'posterior-base': { x: 34, y: 16, rx: 10, ry: 6 },
      'posterior-head': { x: 58, y: 8, rx: 8, ry: 10 },
    },
    decussation: { motor: false, sensory: false },
  },
]

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k

const mixEllipse = (a: Ellipse, b: Ellipse, k: number): Ellipse => ({
  x: lerp(a.x, b.x, k),
  y: lerp(a.y, b.y, k),
  rx: lerp(a.rx, b.rx, k),
  ry: lerp(a.ry, b.ry, k),
})

/** The section at any point t between stages (0 … 3). */
export function stageAt(t: number) {
  const i = Math.max(0, Math.min(stages.length - 2, Math.floor(t)))
  const k = Math.max(0, Math.min(1, t - i))
  const [a, b] = [stages[i], stages[i + 1]]
  return {
    outline: mixEllipse(a.outline, b.outline, k),
    ventricle: lerp(a.ventricle, b.ventricle, k),
    floorY: lerp(a.floorY, b.floorY, k),
    columns: Object.fromEntries(columns.map((c) => [c.id, mixEllipse(a.columns[c.id], b.columns[c.id], k)])) as Record<ColumnId, Ellipse>,
    /** The continuous H of the cord, fading out as the decussations cut it. */
    unity: Math.max(0, 1 - t),
  }
}

/** Whether two ellipses overlap, by the distance between centres against their mean radii. */
export const apart = (a: Ellipse, b: Ellipse) =>
  Math.hypot(a.x - b.x, a.y - b.y) > (a.rx + a.ry) / 2 + (b.rx + b.ry) / 2

export const inside = (e: Ellipse, o: Ellipse): boolean => {
  const edges: Pt[] = [[e.x + e.rx, e.y], [e.x, e.y + e.ry], [e.x, e.y - e.ry]]
  return edges.every(([x, y]) => ((x - o.x) / o.rx) ** 2 + ((y - o.y) / o.ry) ** 2 < 1)
}
