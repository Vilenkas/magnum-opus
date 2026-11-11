/**
 * The arteries and lymphatics of the stomach (Testut t. IV pp. 212–233, 246–251; Moore 8 p. 460).
 *
 * Arteries. Every gastric artery comes from the coeliac trunk, directly or through its branches, and they make a
 * continuous circle along the two curvatures: the left gastric (Testut's coronaria estomáquica) and the right gastric
 * (his pilórica) meet along the lesser curvature, the two gastroepiploics along the greater, and the short gastrics
 * reach the fundus. The trunks join other territories too: the gastroduodenal by the pancreaticoduodenal arcades to the
 * superior mesenteric, the cardioesophageal branches to the oesophageal arteries, the inferior phrenic to the cardia.
 * Inside the wall the anastomoses are innumerable (p. 251).
 *
 * A ligature removes a vessel. A zone of the stomach is fed directly if one of its arteries is still reached along the
 * normal course of the blood; by collaterals if it is reached only through an anastomosis or against the stream; through
 * the wall if none of its arteries is reached but a neighbouring zone is fed; lost otherwise. Nothing is written per
 * ligature.
 *
 * Lymphatics. Each zone belongs to one of Testut's three territories (fig. 244); each territory drains along its own
 * chain of nodes to the coeliac nodes.
 */

export type NodeId =
  | 'aorta'
  | 'thoracicAorta'
  | 'celiac'
  | 'leftGastric'
  | 'commonHepatic'
  | 'properHepatic'
  | 'gastroduodenal'
  | 'rightGastric'
  | 'rightGastroepiploic'
  | 'splenic'
  | 'leftGastroepiploic'
  | 'shortGastrics'
  | 'sma'
  | 'oesophageal'
  | 'phrenic'

export const SOURCES: NodeId[] = ['aorta', 'thoracicAorta']

export interface Vessel {
  id: string
  /** Testut's name; today's, when it differs. */
  name: string
  today?: string
  /** Normal flow goes from `from` to `to`. */
  from: NodeId
  to: NodeId
  /** An anastomosis: blood may go either way and it cannot be tied here. */
  anastomosis?: boolean
  /** The plate draws it along this polyline. */
  path: [number, number][]
}

export const VESSELS: Vessel[] = [
  {
    id: 'celiacTrunk',
    name: 'Tronco celíaco',
    from: 'aorta',
    to: 'celiac',
    path: [
      [150, 36],
      [150, 52],
    ],
  },
  {
    id: 'leftGastric',
    name: 'Arteria coronaria estomáquica',
    today: 'gástrica izquierda',
    from: 'celiac',
    to: 'leftGastric',
    path: [
      [150, 52],
      [186, 40],
      [206, 68],
    ],
  },
  {
    id: 'commonHepatic',
    name: 'Arteria hepática',
    today: 'hepática común',
    from: 'celiac',
    to: 'commonHepatic',
    path: [
      [150, 52],
      [92, 60],
    ],
  },
  {
    id: 'properHepatic',
    name: 'Arteria hepática (al hígado)',
    today: 'hepática propia',
    from: 'commonHepatic',
    to: 'properHepatic',
    path: [
      [92, 60],
      [62, 30],
    ],
  },
  {
    id: 'rightGastric',
    name: 'Arteria pilórica',
    today: 'gástrica derecha',
    from: 'properHepatic',
    to: 'rightGastric',
    path: [
      [72, 40],
      [100, 120],
      [124, 180],
    ],
  },
  {
    id: 'gastroduodenal',
    name: 'Arteria gastroduodenal',
    from: 'commonHepatic',
    to: 'gastroduodenal',
    path: [
      [92, 60],
      [92, 240],
    ],
  },
  {
    id: 'rightGastroepiploic',
    name: 'Arteria gastroepiploica derecha',
    today: 'gastroomental derecha',
    from: 'gastroduodenal',
    to: 'rightGastroepiploic',
    path: [
      [92, 240],
      [140, 290],
      [210, 308],
    ],
  },
  {
    id: 'splenic',
    name: 'Arteria esplénica',
    from: 'celiac',
    to: 'splenic',
    path: [
      [150, 52],
      [240, 64],
      [330, 54],
      [386, 92],
    ],
  },
  {
    id: 'leftGastroepiploic',
    name: 'Arteria gastroepiploica izquierda',
    today: 'gastroomental izquierda',
    from: 'splenic',
    to: 'leftGastroepiploic',
    path: [
      [386, 92],
      [374, 170],
      [352, 234],
    ],
  },
  {
    id: 'shortGastrics',
    name: 'Vasos cortos',
    today: 'arterias gástricas cortas',
    from: 'splenic',
    to: 'shortGastrics',
    path: [
      [382, 88],
      [340, 52],
      [302, 40],
    ],
  },
  {
    id: 'sma',
    name: 'Arteria mesentérica superior',
    from: 'aorta',
    to: 'sma',
    path: [
      [150, 90],
      [122, 250],
      [86, 296],
    ],
  },
  {
    id: 'pancreaticoduodenal',
    name: 'Arcadas pancreaticoduodenales',
    from: 'sma',
    to: 'gastroduodenal',
    anastomosis: true,
    path: [
      [86, 296],
      [98, 268],
      [92, 240],
    ],
  },
  {
    id: 'oesophageal',
    name: 'Arterias esofágicas (de la aorta torácica)',
    from: 'thoracicAorta',
    to: 'oesophageal',
    path: [
      [228, 0],
      [222, 44],
    ],
  },
  {
    id: 'cardioesophageal',
    name: 'Ramas cardioesofágicas',
    from: 'oesophageal',
    to: 'leftGastric',
    anastomosis: true,
    path: [
      [222, 44],
      [206, 68],
    ],
  },
  {
    id: 'phrenic',
    name: 'Diafragmática inferior izquierda',
    today: 'frénica inferior izquierda',
    from: 'aorta',
    to: 'phrenic',
    path: [
      [150, 28],
      [250, 22],
      [262, 44],
    ],
  },
  {
    id: 'lesserArc',
    name: 'Arco de la curvatura menor',
    from: 'leftGastric',
    to: 'rightGastric',
    anastomosis: true,
    path: [
      [206, 68],
      [194, 140],
      [176, 180],
      [124, 180],
    ],
  },
  {
    id: 'greaterArc',
    name: 'Arco de la curvatura mayor',
    from: 'leftGastroepiploic',
    to: 'rightGastroepiploic',
    anastomosis: true,
    path: [
      [352, 234],
      [300, 304],
      [210, 308],
    ],
  },
]

export const vessel = (id: string) => VESSELS.find((v) => v.id === id)!

export type ZoneId = 'cardia' | 'fundus' | 'lesserUpper' | 'lesserLower' | 'greaterLeft' | 'greaterRight'

export type TerritoryId = 'lesser' | 'greater' | 'fundus'

export interface Zone {
  id: ZoneId
  name: string
  /** The arteries that bring it blood. */
  fed: NodeId[]
  /** Its lymphatic territory (Testut fig. 244). */
  territory: TerritoryId
  /** Where its label goes. */
  at: [number, number]
}

export const ZONES: Zone[] = [
  { id: 'cardia', name: 'Cardias', fed: ['leftGastric', 'oesophageal', 'phrenic'], territory: 'lesser', at: [226, 92] },
  { id: 'fundus', name: 'Tuberosidad mayor', fed: ['shortGastrics', 'phrenic'], territory: 'fundus', at: [300, 98] },
  { id: 'lesserUpper', name: 'Curvatura menor, porción vertical', fed: ['leftGastric'], territory: 'lesser', at: [238, 160] },
  { id: 'lesserLower', name: 'Antro y píloro, borde superior', fed: ['rightGastric'], territory: 'lesser', at: [168, 222] },
  { id: 'greaterLeft', name: 'Curvatura mayor, mitad izquierda', fed: ['leftGastroepiploic'], territory: 'fundus', at: [316, 184] },
  { id: 'greaterRight', name: 'Curvatura mayor, mitad derecha', fed: ['rightGastroepiploic'], territory: 'greater', at: [240, 262] },
]

/** Zones that touch: the wall network joins them. */
export const NEIGHBOURS: [ZoneId, ZoneId][] = [
  ['cardia', 'fundus'],
  ['cardia', 'lesserUpper'],
  ['fundus', 'greaterLeft'],
  ['fundus', 'lesserUpper'],
  ['lesserUpper', 'lesserLower'],
  ['lesserUpper', 'greaterLeft'],
  ['greaterLeft', 'greaterRight'],
  ['lesserLower', 'greaterRight'],
]

export type Supply = 'direct' | 'collateral' | 'wall' | 'lost'

/** Nodes reached along the normal course of the blood, and nodes reached at all. */
export function reach(tied: ReadonlySet<string>): { normal: Set<NodeId>; any: Set<NodeId> } {
  const open = VESSELS.filter((v) => !tied.has(v.id))
  const normal = new Set<NodeId>(SOURCES)
  let grew = true
  while (grew) {
    grew = false
    for (const v of open)
      if (!v.anastomosis && normal.has(v.from) && !normal.has(v.to)) {
        normal.add(v.to)
        grew = true
      }
  }
  const any = new Set<NodeId>(SOURCES)
  grew = true
  while (grew) {
    grew = false
    for (const v of open) {
      if (any.has(v.from) && !any.has(v.to)) {
        any.add(v.to)
        grew = true
      }
      if (any.has(v.to) && !any.has(v.from)) {
        any.add(v.from)
        grew = true
      }
    }
  }
  return { normal, any }
}

export function supply(tied: ReadonlySet<string>): Record<ZoneId, Supply> {
  const { normal, any } = reach(tied)
  const out = {} as Record<ZoneId, Supply>
  for (const z of ZONES) out[z.id] = z.fed.some((n) => normal.has(n)) ? 'direct' : z.fed.some((n) => any.has(n)) ? 'collateral' : 'lost'
  // The wall network: a zone none of whose arteries is reached lives on its fed neighbours.
  let grew = true
  while (grew) {
    grew = false
    for (const [a, b] of NEIGHBOURS)
      for (const [x, y] of [
        [a, b],
        [b, a],
      ] as const)
        if (out[x] === 'lost' && out[y] !== 'lost') {
          out[x] = 'wall'
          grew = true
        }
  }
  return out
}

/** The gastric pedicles a total devascularisation would tie: the four arteries of the curvatures and the short gastrics. */
export const PEDICLES = ['leftGastric', 'rightGastric', 'leftGastroepiploic', 'rightGastroepiploic', 'shortGastrics']

// ---------- Lymphatics ----------

export interface LymphGroup {
  id: string
  name: string
  today?: string
  at: [number, number]
}

export const LYMPH_GROUPS: LymphGroup[] = [
  { id: 'lesserCurvature', name: 'Ganglios de la curvatura menor', today: 'gástricos', at: [192, 150] },
  { id: 'paracardial', name: 'Ganglios gástricos superiores (paracardiales)', today: 'gástricos izquierdos', at: [218, 60] },
  { id: 'coronary', name: 'Cadena de la coronaria, en su hoz', today: 'gástricos izquierdos', at: [180, 50] },
  { id: 'subpyloric', name: 'Ganglios subpilóricos', today: 'gastroomentales derechos y pilóricos', at: [140, 282] },
  { id: 'retropyloric', name: 'Ganglios retropilóricos', today: 'pilóricos', at: [100, 214] },
  { id: 'hepatic', name: 'Cadena hepática', today: 'hepáticos', at: [88, 96] },
  { id: 'splenicHilum', name: 'Ganglios del hilio del bazo', today: 'esplénicos', at: [386, 132] },
  { id: 'pancreaticosplenic', name: 'Ganglios pancreaticoesplénicos', today: 'pancreatoesplénicos', at: [330, 72] },
  { id: 'celiac', name: 'Ganglios celíacos', at: [150, 64] },
]

export interface Territory {
  id: TerritoryId
  name: string
  /** The chain the lymph follows, from the stomach to the coeliac nodes. */
  chain: string[]
  text: string
}

export const TERRITORIES: Territory[] = [
  {
    id: 'lesser',
    name: 'Territorio de la curvatura menor',
    chain: ['lesserCurvature', 'paracardial', 'coronary', 'celiac'],
    text: 'El más extenso: llega por las dos caras mucho más cerca de la curvatura mayor que de la menor. Sus colectores, de ocho a diez, van a los ganglios escalonados a lo largo de la coronaria estomáquica. Es la vía linfática principal; los otros dos son accesorios.',
  },
  {
    id: 'greater',
    name: 'Territorio de la curvatura mayor',
    chain: ['subpyloric', 'retropyloric', 'hepatic', 'celiac'],
    text: 'Una franja sobre la mitad derecha de la curvatura mayor. Sus colectores, de quince a veinte, van a la cadena de la gastroepiploica derecha: los subpilóricos y, detrás del píloro y la cabeza del páncreas, los retropilóricos, que siguen con la cadena hepática hasta el hilio del hígado. Por ahí el cáncer del píloro llega al hígado.',
  },
  {
    id: 'fundus',
    name: 'Territorio de la tuberosidad mayor',
    chain: ['splenicHilum', 'pancreaticosplenic', 'celiac'],
    text: 'El resto de las dos caras de la tuberosidad mayor. Sus colectores, de cuatro a seis, van por el epiplón gastroesplénico al hilio del bazo y a los ganglios pancreaticoesplénicos, junto a la cola del páncreas.',
  },
]

export const territory = (id: TerritoryId) => TERRITORIES.find((t) => t.id === id)!
export const zone = (id: ZoneId) => ZONES.find((z) => z.id === id)!
