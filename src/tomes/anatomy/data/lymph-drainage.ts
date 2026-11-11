/**
 * Where the lymph of each territory goes (Angiología, Lámina VI): territories → node groups → lymphatic trunks → the two
 * terminal ducts → the venous angles. A directed graph, since valves set the sense of the lymph. After Latarjet–Ruiz
 * Liard t. 2, chapter 90 (pp. 1012–1022; head, neck, thorax, pelvis, abdomen, ducts) and t. 1, chapters 61 and 69
 * (axillary nodes, pp. 598–599; inguinal nodes, pp. 797–798), with Moore 8.ª (p. 44).
 *
 * Which duct a territory ends in is never written by hand: it is what the territory reaches.
 */

export type Side = 'right' | 'left'
export type LymphKind = 'territory' | 'nodes' | 'trunk' | 'duct' | 'angle'

export interface LymphNode {
  id: string
  es: string
  kind: LymphKind
  side?: Side
}

const sides: Side[] = ['right', 'left']
const sideEs = { right: 'derecho', left: 'izquierdo' } as const
const sideEsF = { right: 'derecha', left: 'izquierda' } as const

const nodes: LymphNode[] = [
  { id: 'abdominal-viscera', es: 'Vísceras abdominales (tubo digestivo, hígado, bazo, páncreas)', kind: 'territory' },
  { id: 'pelvic-viscera', es: 'Vísceras de la pelvis', kind: 'territory' },
  { id: 'visceral-abdominal-nodes', es: 'Nodos viscerales del abdomen (celíacos, mesentéricos)', kind: 'nodes' },
  { id: 'internal-iliac-nodes', es: 'Nodos ilíacos internos', kind: 'nodes' },
  { id: 'tracheobronchial-nodes', es: 'Nodos traqueobronquiales inferiores', kind: 'nodes' },
  { id: 'intestinal-trunks', es: 'Troncos intestinales', kind: 'trunk' },
  { id: 'cisterna-chyli', es: 'Cisterna del quilo (o la red que la reemplaza)', kind: 'duct' },
  { id: 'thoracic-duct', es: 'Conducto torácico', kind: 'duct' },
  { id: 'right-lymphatic-duct', es: 'Conducto linfático derecho', kind: 'duct' },
]
for (const s of sides) {
  nodes.push(
    { id: `head-neck-${s}`, es: `Mitad ${sideEsF[s]} de la cabeza y del cuello`, kind: 'territory', side: s },
    { id: `upper-limb-${s}`, es: `Miembro superior ${sideEs[s]}`, kind: 'territory', side: s },
    { id: `breast-${s}`, es: `Mama ${sideEsF[s]}`, kind: 'territory', side: s },
    { id: `lung-${s}`, es: `Pulmón ${sideEs[s]}`, kind: 'territory', side: s },
    { id: `upper-intercostal-${s}`, es: `Pared del tórax ${sideEsF[s]}, espacios intercostales superiores`, kind: 'territory', side: s },
    { id: `lower-intercostal-${s}`, es: `Pared del tórax ${sideEsF[s]}, espacios intercostales inferiores`, kind: 'territory', side: s },
    { id: `lower-limb-${s}`, es: `Miembro inferior ${sideEs[s]} y región glútea`, kind: 'territory', side: s },
    { id: `pericranial-ring-${s}`, es: 'Anillo pericraneocervical (occipitales, mastoideos, parotídeos, submandibulares, submentonianos)', kind: 'nodes', side: s },
    { id: `deep-cervical-${s}`, es: 'Nodos cervicales laterales profundos', kind: 'nodes', side: s },
    { id: `axillary-lateral-${s}`, es: 'Nodos axilares braquiales (laterales)', kind: 'nodes', side: s },
    { id: `axillary-pectoral-${s}`, es: 'Nodos axilares pectorales (anteriores)', kind: 'nodes', side: s },
    { id: `axillary-central-${s}`, es: 'Nodos axilares centrales', kind: 'nodes', side: s },
    { id: `axillary-apical-${s}`, es: 'Nodos axilares apicales', kind: 'nodes', side: s },
    { id: `parasternal-${s}`, es: 'Nodos paraesternales (cadena torácica interna)', kind: 'nodes', side: s },
    { id: `paratracheal-${s}`, es: 'Nodos paratraqueales', kind: 'nodes', side: s },
    { id: `intercostal-nodes-${s}`, es: 'Nodos intercostales', kind: 'nodes', side: s },
    { id: `inguinal-${s}`, es: 'Nodos inguinales', kind: 'nodes', side: s },
    { id: `external-iliac-${s}`, es: 'Nodos ilíacos externos', kind: 'nodes', side: s },
    { id: `common-iliac-${s}`, es: 'Nodos ilíacos comunes', kind: 'nodes', side: s },
    { id: `lumbar-nodes-${s}`, es: 'Nodos lumbares (lateroaórticos y de la cava)', kind: 'nodes', side: s },
    { id: `jugular-trunk-${s}`, es: `Tronco yugular ${sideEs[s]}`, kind: 'trunk', side: s },
    { id: `subclavian-trunk-${s}`, es: `Tronco subclavio ${sideEs[s]}`, kind: 'trunk', side: s },
    { id: `bronchomediastinal-trunk-${s}`, es: `Tronco broncomediastínico ${sideEs[s]}`, kind: 'trunk', side: s },
    { id: `lumbar-trunk-${s}`, es: `Tronco lumbar ${sideEs[s]}`, kind: 'trunk', side: s },
    { id: `venous-angle-${s}`, es: `Ángulo venoso yugulosubclavio ${sideEs[s]}`, kind: 'angle', side: s },
  )
}
export const LYMPH_NODES = nodes
export const lymphNodeById = new Map(nodes.map((n) => [n.id, n]))

const edges: [string, string][] = [
  ['abdominal-viscera', 'visceral-abdominal-nodes'],
  ['visceral-abdominal-nodes', 'intestinal-trunks'],
  ['intestinal-trunks', 'cisterna-chyli'],
  ['pelvic-viscera', 'internal-iliac-nodes'],
  ['cisterna-chyli', 'thoracic-duct'],
  ['thoracic-duct', 'venous-angle-left'],
  ['right-lymphatic-duct', 'venous-angle-right'],
  // The right lung drains to the right; part of the left lung crosses to the right paratracheal chain.
  ['lung-right', 'paratracheal-right'],
  ['lung-left', 'paratracheal-left'],
  ['lung-left', 'tracheobronchial-nodes'],
  ['lung-right', 'tracheobronchial-nodes'],
  ['tracheobronchial-nodes', 'paratracheal-right'],
]
for (const s of sides) {
  const duct = s === 'right' ? 'right-lymphatic-duct' : 'thoracic-duct'
  edges.push(
    [`head-neck-${s}`, `pericranial-ring-${s}`],
    [`head-neck-${s}`, `deep-cervical-${s}`],
    [`pericranial-ring-${s}`, `deep-cervical-${s}`],
    [`deep-cervical-${s}`, `jugular-trunk-${s}`],
    [`upper-limb-${s}`, `axillary-lateral-${s}`],
    [`axillary-lateral-${s}`, `axillary-central-${s}`],
    [`breast-${s}`, `axillary-pectoral-${s}`],
    [`breast-${s}`, `parasternal-${s}`],
    [`axillary-pectoral-${s}`, `axillary-central-${s}`],
    [`axillary-central-${s}`, `axillary-apical-${s}`],
    [`axillary-apical-${s}`, `subclavian-trunk-${s}`],
    [`paratracheal-${s}`, `bronchomediastinal-trunk-${s}`],
    [`upper-intercostal-${s}`, `intercostal-nodes-${s}`],
    [`lower-intercostal-${s}`, `intercostal-nodes-${s}`],
    // The upper spaces drain to the bronchomediastinal trunk; the lower ones cross the diaphragm to the cisterna.
    [`intercostal-nodes-${s}`, `bronchomediastinal-trunk-${s}`],
    [`lower-limb-${s}`, `inguinal-${s}`],
    [`inguinal-${s}`, `external-iliac-${s}`],
    ['internal-iliac-nodes', `common-iliac-${s}`],
    [`external-iliac-${s}`, `common-iliac-${s}`],
    [`common-iliac-${s}`, `lumbar-nodes-${s}`],
    [`lumbar-nodes-${s}`, `lumbar-trunk-${s}`],
    [`lumbar-trunk-${s}`, 'cisterna-chyli'],
    [`jugular-trunk-${s}`, duct],
    [`subclavian-trunk-${s}`, duct],
    [`bronchomediastinal-trunk-${s}`, duct],
    [`parasternal-${s}`, duct],
  )
}
export const LYMPH_EDGES = edges

/**
 * The upper intercostal spaces' nodes feed the bronchomediastinal trunk, the lower ones a collector to the cisterna:
 * the split is by territory, so the lower spaces get their own route instead of passing through the trunk.
 */
const territoryRoute: Record<string, string[]> = Object.fromEntries(
  sides.flatMap((s) => [
    [`upper-intercostal-${s}`, [`intercostal-nodes-${s}`, `bronchomediastinal-trunk-${s}`]],
    [`lower-intercostal-${s}`, [`intercostal-nodes-${s}`, 'cisterna-chyli']],
  ]),
)

export type LymphLesionId = 'thoracic-duct-neck' | 'right-duct'

export interface LymphLesion {
  id: LymphLesionId
  es: string
  removes: string[]
  text: string
}

export const LYMPH_LESIONS: LymphLesion[] = [
  {
    id: 'thoracic-duct-neck',
    es: 'Sección del conducto torácico en el cuello',
    removes: ['thoracic-duct'],
    text: 'El conducto pasa en la base del cuello por detrás de la carótida común y de la yugular interna, y puede herirse en un vaciamiento ganglionar del cuello: su fístula es grave por las pérdidas de líquido y de grasa. Todo lo que no es el cuadrante superior derecho pierde su vía principal; sin embargo, la linfa encuentra pronto otro camino por anastomosis linfaticovenosas periféricas, y la ligadura del conducto suele tener un efecto sólo transitorio.',
  },
  {
    id: 'right-duct',
    es: 'Conducto linfático derecho cerrado',
    removes: ['right-lymphatic-duct'],
    text: 'Un conducto corto, de 8 a 15 mm, entre la yugular interna y la subclavia derecha. Sus troncos pueden terminar también por separado en el confluente venoso, de modo que cerrarlo rara vez lo cierra todo; el esquema muestra el caso extremo.',
  },
]

const adjacency = (removed: Set<string>) => {
  const adj = new Map<string, string[]>()
  for (const [a, b] of edges) {
    if (removed.has(a) || removed.has(b)) continue
    adj.set(a, [...(adj.get(a) ?? []), b])
  }
  return adj
}

/** Every route from a territory to a venous angle, as lists of node ids (the territory first). */
export function routesOf(territory: string, removedIds: string[] = []): string[][] {
  const removed = new Set(removedIds)
  const adj = adjacency(removed)
  const forced = territoryRoute[territory]
  const routes: string[][] = []
  const walk = (path: string[]) => {
    const last = path[path.length - 1]
    if (lymphNodeById.get(last)!.kind === 'angle') return void routes.push(path)
    let next = adj.get(last) ?? []
    // A forced route fixes the steps right after the territory.
    if (forced) {
      const step = path.length - 1
      if (step < forced.length) next = removed.has(forced[step]) ? [] : [forced[step]]
    }
    for (const n of next) if (!path.includes(n)) walk([...path, n])
  }
  walk([territory])
  return routes
}

/** The venous angles a territory's lymph reaches. */
export const anglesOf = (territory: string, removed: string[] = []): Side[] =>
  [...new Set(routesOf(territory, removed).map((r) => lymphNodeById.get(r[r.length - 1])!.side!))].sort()

export const TERRITORIES = nodes.filter((n) => n.kind === 'territory')
