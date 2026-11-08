/**
 * The arterial circle of Willis and the territories of the cerebral arteries (Testut t. II pp. 1195–1224).
 *
 * The circle is a graph: four sources (the two internal carotids and the two vertebrals), the vessels of
 * the circle between them, and the terminal arteries that leave it. An occluded vessel is removed; a
 * terminal artery is perfused if blood can still reach its origin by any path, in any direction. That
 * is all the circle does: it lets one trunk supply another's domain (pp. 1195–1196). Beyond it, the
 * terminal arteries have no useful substitute: their occlusion softens their territory (pp. 1215–1216).
 *
 * The cortical territories are drawn on the faces of `gyri.ts` (same 600 × 380 coordinates), after
 * Testut's figs. 1009 and 1010 of the left hemisphere; which gyri each one takes is read off the geometry.
 */
import { centroid, gyri, inside, outlines, type Face, type Gyrus, type Pt } from './gyri'

export type Side = 'left' | 'right'
export type NodeId = 'icaL' | 'icaR' | 'acaL' | 'acaR' | 'pcaL' | 'pcaR' | 'basilarTop' | 'basilarFoot' | 'carotidL' | 'carotidR' | 'vertebralL' | 'vertebralR'

/** Where blood comes from: the vessels that enter the skull. */
export const SOURCES: NodeId[] = ['carotidL', 'carotidR', 'vertebralL', 'vertebralR']

/** Seen from below, front up: the patient's left is on the viewer's right. Coordinates in a 300 × 330 box. */
export const NODES: Record<NodeId, Pt> = {
  carotidL: [214, 150],
  carotidR: [86, 150],
  icaL: [192, 118],
  icaR: [108, 118],
  acaL: [163, 72],
  acaR: [137, 72],
  pcaL: [186, 204],
  pcaR: [114, 204],
  basilarTop: [150, 218],
  basilarFoot: [150, 282],
  vertebralL: [172, 326],
  vertebralR: [128, 326],
}

export type VesselKind = 'trunk' | 'circle' | 'communicating' | 'terminal'

export interface Vessel {
  id: string
  name: string
  kind: VesselKind
  /** Terminal arteries have no second end on the circle: `to` is where they leave the drawing. */
  from: NodeId
  to: NodeId | Pt
  /** Terminal arteries: which territory they supply. */
  territory?: Artery
  side?: Side
}

export type Artery = 'aca' | 'mca' | 'pca' | 'acha'

export const ARTERY_NAME: Record<Artery, string> = {
  aca: 'Cerebral anterior',
  mca: 'Cerebral media o silviana',
  pca: 'Cerebral posterior',
  acha: 'Coroidea anterior',
}

const sided = (side: Side) => (side === 'left' ? 'izquierda' : 'derecha')
const L = (s: Side, l: NodeId, r: NodeId) => (s === 'left' ? l : r)
const mirror = ([x, y]: Pt, s: Side): Pt => (s === 'left' ? [x, y] : [300 - x, y])

export const vessels: Vessel[] = [
  ...(['left', 'right'] as const).flatMap((s): Vessel[] => [
    { id: `carotid-${s}`, name: `Carótida interna ${sided(s)}`, kind: 'trunk', from: L(s, 'carotidL', 'carotidR'), to: L(s, 'icaL', 'icaR'), side: s },
    { id: `vertebral-${s}`, name: `Vertebral ${sided(s)}`, kind: 'trunk', from: L(s, 'vertebralL', 'vertebralR'), to: 'basilarFoot', side: s },
    { id: `a1-${s}`, name: `Cerebral anterior ${sided(s)}, antes de la comunicante`, kind: 'circle', from: L(s, 'icaL', 'icaR'), to: L(s, 'acaL', 'acaR'), side: s },
    { id: `p1-${s}`, name: `Cerebral posterior ${sided(s)}, antes de la comunicante`, kind: 'circle', from: 'basilarTop', to: L(s, 'pcaL', 'pcaR'), side: s },
    { id: `pcom-${s}`, name: `Comunicante posterior ${sided(s)}`, kind: 'communicating', from: L(s, 'icaL', 'icaR'), to: L(s, 'pcaL', 'pcaR'), side: s },
    { id: `aca-${s}`, name: `Cerebral anterior ${sided(s)}`, kind: 'terminal', from: L(s, 'acaL', 'acaR'), to: mirror([170, 14], s), territory: 'aca', side: s },
    { id: `mca-${s}`, name: `Silviana ${sided(s)}`, kind: 'terminal', from: L(s, 'icaL', 'icaR'), to: mirror([292, 100], s), territory: 'mca', side: s },
    { id: `acha-${s}`, name: `Coroidea anterior ${sided(s)}`, kind: 'terminal', from: L(s, 'icaL', 'icaR'), to: mirror([262, 150], s), territory: 'acha', side: s },
    { id: `pca-${s}`, name: `Cerebral posterior ${sided(s)}`, kind: 'terminal', from: L(s, 'pcaL', 'pcaR'), to: mirror([272, 262], s), territory: 'pca', side: s },
  ]),
  { id: 'acom', name: 'Comunicante anterior', kind: 'communicating', from: 'acaL', to: 'acaR' },
  { id: 'basilar', name: 'Tronco basilar', kind: 'trunk', from: 'basilarFoot', to: 'basilarTop' },
]

export const vesselById = new Map(vessels.map((v) => [v.id, v]))

export interface CircleState {
  occluded: ReadonlySet<string>
  /** False when the communicating arteries are threadlike, as they often are: they then carry no useful flow. */
  communicating: boolean
}

/** Which nodes blood reaches from the sources, through vessels that are open. */
export function reached({ occluded, communicating }: CircleState): Set<NodeId> {
  const open = vessels.filter((v) => v.kind !== 'terminal' && !occluded.has(v.id) && (communicating || v.kind !== 'communicating'))
  const seen = new Set<NodeId>(SOURCES)
  const queue = [...SOURCES]
  while (queue.length) {
    const n = queue.shift()!
    for (const v of open) {
      const other = v.from === n ? (v.to as NodeId) : v.to === n ? v.from : null
      if (other && !seen.has(other)) {
        seen.add(other)
        queue.push(other)
      }
    }
  }
  return seen
}

/** Does blood flow in this vessel? A vessel of the circle carries blood if both its ends are reached. */
export function perfused(v: Vessel, state: CircleState, nodes = reached(state)) {
  if (state.occluded.has(v.id)) return false
  if (v.kind === 'communicating' && !state.communicating) return false
  if (v.kind === 'terminal') return nodes.has(v.from)
  return nodes.has(v.from) && nodes.has(v.to as NodeId)
}

/** The territories of one hemisphere left without blood. */
export function softened(state: CircleState, side: Side = 'left'): Set<Artery> {
  const nodes = reached(state)
  return new Set(vessels.filter((v) => v.kind === 'terminal' && v.side === side && !perfused(v, state, nodes)).map((v) => v.territory!))
}

// ---------- Cortical territories (figs. 1009 and 1010, left hemisphere) ----------

/**
 * The anterior and posterior cerebral arteries' fields on each face; the middle cerebral takes the rest
 * of the face. Outer face: the anterior has the first frontal, the upper ends of both Rolandic gyri and
 * the superior parietal next to the interhemispheric fissure; the posterior, the back of the occipital
 * gyri and of the third temporal. Inner face: the anterior has all in front of the cuneus; the posterior,
 * the cuneus and the inferior face except the temporal tip (p. 1213).
 */
export const CORTICAL: Record<Face, { aca: Pt[]; pca: Pt[] }> = {
  lateral: {
    aca: [[40, 122], [95, 63], [170, 33], [260, 23], [350, 28], [440, 48], [482, 70], [462, 84], [402, 76], [345, 74], [312, 76], [278, 82], [180, 94], [82, 104], [52, 122]],
    pca: [[482, 70], [516, 92], [562, 150], [577, 210], [562, 262], [522, 302], [450, 337], [360, 352], [338, 346], [380, 328], [472, 302], [498, 244], [500, 170], [490, 108]],
  },
  medial: {
    aca: [[158, 150], [155, 47], [240, 23], [330, 20], [420, 30], [502, 63], [552, 113], [577, 175], [572, 230], [542, 272], [490, 278], [455, 252], [440, 216], [435, 198], [175, 196], [182, 214]],
    pca: [[155, 47], [150, 44], [78, 84], [38, 140], [28, 195], [38, 236], [68, 272], [118, 302], [190, 320], [280, 327], [380, 320], [410, 314], [400, 282], [400, 252], [300, 252], [230, 242], [182, 214], [158, 150]],
  },
}

/** The cortical territory a point of a face belongs to, or null outside the hemisphere. */
export function territoryAt(p: Pt, face: Face): Exclude<Artery, 'acha'> | null {
  if (!inside(p, outlines[face])) return null
  if (inside(p, CORTICAL[face].aca)) return 'aca'
  if (inside(p, CORTICAL[face].pca)) return 'pca'
  return 'mca'
}

/** Each gyrus goes to the territory of its centroid. */
export const territoryOfGyrus = (g: Gyrus) => territoryAt(centroid(g.shape), g.face)

/** The gyri a set of softened territories destroys. */
export const lostGyri = (lost: ReadonlySet<Artery>) => gyri.filter((g) => {
  const t = territoryOfGyrus(g)
  return t !== null && lost.has(t)
})

/** The corpus callosum: the anterior cerebral irrigates its front 7/8, the posterior its splenium (pp. 1203, 1210). */
export const CALLOSAL_SHARE: Record<'aca' | 'pca', number> = { aca: 7 / 8, pca: 1 / 8 }

/** The deep (central) territories, which no anastomosis can relieve (pp. 1219–1223). */
export const DEEP: Record<Artery, string[]> = {
  aca: ['la parte anteroinferior de la cabeza del núcleo caudado (arteria de Heubner)'],
  mca: ['el putamen y la parte externa del pálido', 'la cabeza (en parte) y el cuerpo del núcleo caudado', 'el brazo anterior, la rodilla y la parte alta del brazo posterior de la cápsula interna', 'la región dorsoexterna del tálamo'],
  pca: ['los dos tercios posteriores de la cara inferior del tálamo (pedículo talamogeniculado)', 'la región subóptica y el núcleo rojo', 'el esplenio del cuerpo calloso', 'la parte interna del pie del pedúnculo'],
  acha: ['la cintilla óptica y el cuerpo geniculado externo', 'la mayor parte del brazo posterior y el segmento retrolenticular de la cápsula interna', 'el núcleo interno del pálido', 'la punta del hipocampo y el núcleo amigdalino'],
}

/** What Testut and his sources say each softening produces (pp. 1204, 1207, 1210, 1212). */
export const SYNDROME: Record<Artery, string> = {
  aca: 'Una hemiplejía de predominio crural; si el cuerpo calloso está interesado, una apraxia del lado izquierdo, del tipo ideomotor.',
  mca: 'Total o superficial y extenso: hemiplejía, trastornos apráxicos, hemianopsia y afasia. Limitado a su segmento posterior (parietal posterior, pliegue curvo, temporal posterior): un síndrome hemianópsico con apraxia y afasia de Wernicke.',
  pca: 'La hemianopsia, por el área visual de la calcarina; por el pedículo talamogeniculado, el síndrome talámico de Dejerine y Roussy.',
  acha: 'Según Schiff-Wertheimer, una hemianopsia, una hemiplejía derecha sin afasia, con una invalidez acentuada del miembro inferior, y una hemianestesia derecha moderada.',
}
