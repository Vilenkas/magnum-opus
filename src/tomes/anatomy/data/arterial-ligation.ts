/**
 * The arteries of the limbs as segments between their branchings, with the periarticular networks that join them, the
 * pulses and the points of compression (Angiología, Lámina IV). After Moore 8.ª (scapular anastomoses and the axillary
 * ligature, pp. 196–198; brachial clamping, p. 213; radial pulse, p. 241; femoral, pp. 716–721; popliteal, pp. 762–764;
 * posterior tibial, p. 768; dorsal artery of the foot, p. 784; subclavian compression, p. 1004).
 *
 * A ligature removes a segment. A segment still reached along the main arteries keeps its pulse; one reached only through
 * a network is alive but pulseless; one not reached at all is lost. Which ligatures are safe is derived, never listed.
 */

export type Limb = 'upper' | 'lower'

export interface Segment {
  id: string
  es: string
  limb: Limb
  /** On the plate's scheme, a polyline in the limb's own panel. */
  path: [number, number][]
}

export interface Network {
  id: string
  es: string
  limb: Limb
  /** The segments it joins. */
  ends: string[]
  via: string
  /** Where its line is drawn: one point per end, then the curve's control point. */
  anchors: [number, number][]
  control: [number, number]
}

export interface Pulse {
  id: string
  es: string
  segment: string
  /** Where it is felt. */
  where: string
  /** A point where the artery can be compressed against bone to stop a bleeding. */
  compression?: boolean
  at: [number, number]
  p: string
}

export const ROOTS: Record<Limb, string> = { upper: 'subclavian-1', lower: 'common-iliac' }

export const SEGMENTS: Segment[] = [
  // ---------- Upper limb ----------
  { id: 'subclavian-1', es: 'Subclavia, primera porción', limb: 'upper', path: [[100, 18], [100, 45]] },
  { id: 'thyrocervical', es: 'Tronco tirocervical y arteria supraescapular', limb: 'upper', path: [[100, 45], [52, 32]] },
  { id: 'subclavian-3', es: 'Subclavia, tercera porción (sobre la 1.ª costilla)', limb: 'upper', path: [[100, 45], [100, 82]] },
  { id: 'axillary-proximal', es: 'Axilar, de la 1.ª costilla a la subescapular', limb: 'upper', path: [[100, 82], [100, 122]] },
  { id: 'subscapular', es: 'Arteria subescapular', limb: 'upper', path: [[100, 122], [152, 150]] },
  { id: 'axillary-distal', es: 'Axilar, de la subescapular al borde del redondo mayor', limb: 'upper', path: [[100, 122], [100, 162]] },
  { id: 'brachial-proximal', es: 'Braquial, hasta el origen de la braquial profunda', limb: 'upper', path: [[100, 162], [100, 186]] },
  { id: 'profunda-brachii', es: 'Arteria braquial profunda y colaterales ulnares', limb: 'upper', path: [[100, 186], [146, 262]] },
  { id: 'brachial-distal', es: 'Braquial, de la profunda al pliegue del codo', limb: 'upper', path: [[100, 186], [100, 292]] },
  { id: 'radial', es: 'Arteria radial', limb: 'upper', path: [[100, 292], [70, 412]] },
  { id: 'ulnar', es: 'Arteria ulnar', limb: 'upper', path: [[100, 292], [130, 412]] },
  { id: 'palmar-arches', es: 'Arcos palmares (la mano)', limb: 'upper', path: [[70, 412], [100, 440], [130, 412]] },
  // ---------- Lower limb ----------
  { id: 'common-iliac', es: 'Ilíaca común', limb: 'lower', path: [[100, 14], [100, 40]] },
  { id: 'internal-iliac', es: 'Ilíaca interna y arteria glútea inferior', limb: 'lower', path: [[100, 40], [54, 72]] },
  { id: 'external-iliac', es: 'Ilíaca externa', limb: 'lower', path: [[100, 40], [110, 86]] },
  { id: 'femoral-proximal', es: 'Femoral, del ligamento inguinal a la femoral profunda', limb: 'lower', path: [[110, 86], [110, 118]] },
  { id: 'profunda-femoris', es: 'Femoral profunda y circunflejas', limb: 'lower', path: [[110, 118], [152, 210]] },
  { id: 'femoral-distal', es: 'Femoral, de la profunda al hiato aductor', limb: 'lower', path: [[110, 118], [104, 252]] },
  { id: 'popliteal', es: 'Arteria poplítea', limb: 'lower', path: [[104, 252], [104, 316]] },
  { id: 'anterior-tibial', es: 'Tibial anterior y dorsal del pie', limb: 'lower', path: [[104, 316], [84, 444]] },
  { id: 'posterior-tibial', es: 'Tibial posterior y plantares', limb: 'lower', path: [[104, 316], [122, 430]] },
]

/** Segments that meet at a branching point are joined; the graph is walked both ways (a network can reverse a branch). */
const JUNCTIONS: string[][] = [
  ['subclavian-1', 'thyrocervical', 'subclavian-3'],
  ['subclavian-3', 'axillary-proximal'],
  ['axillary-proximal', 'subscapular', 'axillary-distal'],
  ['axillary-distal', 'brachial-proximal'],
  ['brachial-proximal', 'profunda-brachii', 'brachial-distal'],
  ['brachial-distal', 'radial', 'ulnar'],
  ['radial', 'palmar-arches'],
  ['ulnar', 'palmar-arches'],
  ['common-iliac', 'internal-iliac', 'external-iliac'],
  ['external-iliac', 'femoral-proximal'],
  ['femoral-proximal', 'profunda-femoris', 'femoral-distal'],
  ['femoral-distal', 'popliteal'],
  ['popliteal', 'anterior-tibial', 'posterior-tibial'],
]

export const NETWORKS: Network[] = [
  {
    id: 'scapular',
    es: 'Red arterial de la escápula',
    limb: 'upper',
    ends: ['thyrocervical', 'subscapular'],
    via: 'Supraescapular y dorsal de la escápula, de la subclavia, con la circunfleja de la escápula, rama de la subescapular, alrededor de la escápula; también las intercostales',
    anchors: [
      [52, 32],
      [152, 150],
    ],
    control: [178, 60],
  },
  {
    id: 'elbow',
    es: 'Red arterial del codo',
    limb: 'upper',
    ends: ['profunda-brachii', 'radial', 'ulnar'],
    via: 'Braquial profunda y colaterales ulnares por encima del codo, con las recurrentes radial, ulnares e interósea por debajo',
    anchors: [
      [146, 262],
      [90, 330],
      [112, 330],
    ],
    control: [160, 320],
  },
  {
    id: 'cruciate',
    es: 'Anastomosis cruzada',
    limb: 'lower',
    ends: ['internal-iliac', 'profunda-femoris'],
    via: 'Glútea inferior, de la ilíaca interna, con las circunflejas femorales medial y lateral y la primera perforante, detrás del fémur',
    anchors: [
      [54, 72],
      [140, 180],
    ],
    control: [40, 160],
  },
  {
    id: 'genicular',
    es: 'Red articular de la rodilla',
    limb: 'lower',
    ends: ['femoral-distal', 'profunda-femoris', 'popliteal'],
    via: 'Descendente de la rodilla, de la femoral, y rama descendente de la circunfleja lateral, con las geniculares de la poplítea',
    anchors: [
      [105, 230],
      [152, 210],
      [104, 292],
    ],
    control: [160, 270],
  },
]

export const PULSES: Pulse[] = [
  { id: 'subclavian', es: 'Subclavia', segment: 'subclavian-3', where: 'Presionando hondo en el triángulo omoclavicular, sobre la 1.ª costilla', compression: true, at: [100, 66], p: '1004' },
  { id: 'brachial', es: 'Braquial', segment: 'brachial-distal', where: 'En la cara medial del brazo, a mitad de su altura: el sitio del manguito y del torniquete', compression: true, at: [100, 232], p: '213' },
  { id: 'radial', es: 'Radial', segment: 'radial', where: 'En la muñeca, lateral al tendón del flexor radial del carpo, contra el radio', compression: true, at: [74, 396], p: '241' },
  { id: 'ulnar', es: 'Ulnar', segment: 'ulnar', where: 'En la muñeca, lateral al tendón del flexor ulnar del carpo', at: [126, 396], p: '241' },
  { id: 'femoral', es: 'Femoral', segment: 'femoral-proximal', where: 'Justo debajo del punto medio del ligamento inguinal, entre la espina ilíaca anterior superior y la sínfisis', compression: true, at: [110, 102], p: '716' },
  { id: 'popliteal', es: 'Poplíteo', segment: 'popliteal', where: 'Hondo, en la parte baja de la fosa poplítea, con la rodilla flexionada', at: [104, 300], p: '762' },
  { id: 'posterior-tibial', es: 'Tibial posterior', segment: 'posterior-tibial', where: 'Entre el maléolo medial y el tendón calcáneo, con el pie invertido', at: [121, 418], p: '768' },
  { id: 'dorsalis-pedis', es: 'Pedio', segment: 'anterior-tibial', where: 'En el dorso del pie, lateral al tendón del extensor largo del dedo gordo; falta de nacimiento en algunas personas sanas', at: [86, 432], p: '784' },
]

export interface Ligature {
  id: string
  es: string
  segment: string
  p: string
}

/** The ligatures and clampings Moore discusses, as presets of the plate. */
export const LIGATURES: Ligature[] = [
  { id: 'subclavian-compression', es: 'Compresión de la subclavia sobre la 1.ª costilla', segment: 'subclavian-3', p: '1004' },
  { id: 'axillary-high', es: 'Axilar, entre la 1.ª costilla y la subescapular', segment: 'axillary-proximal', p: '196' },
  { id: 'axillary-low', es: 'Axilar, entre la subescapular y la braquial profunda', segment: 'axillary-distal', p: '198' },
  { id: 'brachial-low', es: 'Braquial, por debajo de la braquial profunda', segment: 'brachial-distal', p: '213' },
  { id: 'femoral-high', es: 'Femoral, por encima de la femoral profunda', segment: 'femoral-proximal', p: '721' },
  { id: 'femoral-low', es: 'Femoral, por debajo de la femoral profunda', segment: 'femoral-distal', p: '764' },
  { id: 'popliteal', es: 'Poplítea (luxación de la rodilla)', segment: 'popliteal', p: '764' },
]

export type Flow = 'main' | 'collateral' | 'none'

const adjacency = (closed: Set<string>, withNetworks: boolean) => {
  const adj = new Map<string, Set<string>>()
  const link = (a: string, b: string) => {
    if (a === b || closed.has(a) || closed.has(b)) return
    if (!adj.has(a)) adj.set(a, new Set())
    if (!adj.has(b)) adj.set(b, new Set())
    adj.get(a)!.add(b)
    adj.get(b)!.add(a)
  }
  for (const j of JUNCTIONS) for (const a of j) for (const b of j) link(a, b)
  if (withNetworks) for (const n of NETWORKS) for (const a of n.ends) for (const b of n.ends) link(a, b)
  return adj
}

const reach = (root: string, adj: Map<string, Set<string>>) => {
  const seen = new Set([root])
  const queue = [root]
  while (queue.length) for (const n of adj.get(queue.shift()!) ?? []) if (!seen.has(n)) seen.add(n), queue.push(n)
  return seen
}

/** How blood reaches every segment with these segments tied. */
export function flows(closedSegments: string[]): Map<string, Flow> {
  const closed = new Set(closedSegments)
  const result = new Map<string, Flow>()
  for (const limb of ['upper', 'lower'] as Limb[]) {
    const root = ROOTS[limb]
    const main = closed.has(root) ? new Set<string>() : reach(root, adjacency(closed, false))
    const any = closed.has(root) ? new Set<string>() : reach(root, adjacency(closed, true))
    for (const s of SEGMENTS.filter((x) => x.limb === limb)) result.set(s.id, main.has(s.id) ? 'main' : any.has(s.id) ? 'collateral' : 'none')
  }
  return result
}

/** The networks that carry blood with these ties: those joining a segment fed only through networks. */
export function openNetworks(closedSegments: string[]): Network[] {
  const f = flows(closedSegments)
  const closed = new Set(closedSegments)
  return NETWORKS.filter((n) => {
    const open = n.ends.filter((e) => !closed.has(e))
    return open.some((e) => f.get(e) === 'collateral') && open.some((e) => f.get(e) === 'main')
  })
}

export const segmentById = new Map(SEGMENTS.map((s) => [s.id, s]))
