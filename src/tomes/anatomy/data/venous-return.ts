/**
 * The great veins of return as a graph: the venae cavae, the azygos system and the portal vein, with the anastomoses
 * that join them (Angiología, Lámina V). After Latarjet–Ruiz Liard t. 2, chapters 87–89 (intercaval routes, pp.
 * 1006–1007; portocaval anastomoses, pp. 1007–1008) and Moore 8.ª (portosystemic anastomoses, pp. 502–504, 513).
 *
 * An obstruction removes a vein. A territory whose blood can no longer reach the right atrium along the normal veins
 * opens every anastomosis that has one end in the veins it still fills and another end in veins that still drain
 * normally: the collateral routes, and the signs they bring, are derived, never listed by hand per lesion.
 */

export type VeinId =
  | 'bcv'
  | 'svc-upper'
  | 'svc-lower'
  | 'azygos'
  | 'portal-tributaries'
  | 'portal-trunk'
  | 'portal-left-branch'
  | 'liver'
  | 'ivc-hepatic'
  | 'ivc-renal'
  | 'ivc-infra'
  | 'iliac'
  | 'atrium'

export interface Vein {
  id: VeinId
  es: string
}

export const VEINS: Vein[] = [
  { id: 'bcv', es: 'Venas braquiocefálicas' },
  { id: 'svc-upper', es: 'Cava superior, por encima de la ácigos' },
  { id: 'svc-lower', es: 'Cava superior, desde la ácigos al corazón' },
  { id: 'azygos', es: 'Sistema ácigos' },
  { id: 'portal-tributaries', es: 'Afluentes de la porta (mesentéricas, esplénica, gástrica izquierda)' },
  { id: 'portal-trunk', es: 'Tronco de la vena porta' },
  { id: 'portal-left-branch', es: 'Rama izquierda de la porta' },
  { id: 'liver', es: 'Hígado' },
  { id: 'ivc-hepatic', es: 'Cava inferior, segmento hepático' },
  { id: 'ivc-renal', es: 'Cava inferior, a la altura de las renales' },
  { id: 'ivc-infra', es: 'Cava inferior, por debajo de las renales' },
  { id: 'iliac', es: 'Venas ilíacas' },
  { id: 'atrium', es: 'Atrio derecho' },
]

export type TerritoryId = 'head' | 'upper-limbs' | 'thoracic-wall' | 'gut' | 'kidneys' | 'lower-limbs'

export interface Territory {
  id: TerritoryId
  es: string
  /** The vein it pours into. */
  into: VeinId
}

export const TERRITORIES: Territory[] = [
  { id: 'head', es: 'Cabeza y cuello', into: 'bcv' },
  { id: 'upper-limbs', es: 'Miembros superiores', into: 'bcv' },
  { id: 'thoracic-wall', es: 'Pared del tórax', into: 'azygos' },
  { id: 'gut', es: 'Tubo digestivo abdominal y bazo', into: 'portal-tributaries' },
  { id: 'kidneys', es: 'Riñones', into: 'ivc-renal' },
  { id: 'lower-limbs', es: 'Miembros inferiores y pelvis', into: 'iliac' },
]

/** The normal veins, joined as blood runs in them (the graph is walked both ways: trunk veins have no valves). */
export const NORMAL: [VeinId, VeinId][] = [
  ['bcv', 'svc-upper'],
  ['svc-upper', 'svc-lower'],
  ['azygos', 'svc-lower'],
  ['svc-lower', 'atrium'],
  ['portal-tributaries', 'portal-trunk'],
  ['portal-trunk', 'portal-left-branch'],
  ['portal-trunk', 'liver'],
  ['portal-left-branch', 'liver'],
  ['liver', 'ivc-hepatic'],
  ['iliac', 'ivc-infra'],
  ['ivc-infra', 'ivc-renal'],
  ['ivc-renal', 'ivc-hepatic'],
  ['ivc-hepatic', 'atrium'],
]

export type CollateralId =
  | 'oesophageal'
  | 'rectal'
  | 'paraumbilical'
  | 'retroperitoneal'
  | 'paravertebral'
  | 'intravertebral'
  | 'anteromedial'
  | 'anterolateral'
  | 'upper-laterovertebral'

export interface Collateral {
  id: CollateralId
  es: string
  kind: 'portocaval' | 'intercaval'
  /** The veins it joins. */
  ends: VeinId[]
  /** Its veins, as the sources name them. */
  via: string
  /** What appears when it carries blood; `signFrom` limits it to blood coming from that end. */
  sign?: string
  signFrom?: VeinId
  /** Opens only for blood coming from this end (the sources describe it in that sense only). */
  onlyFrom?: VeinId
}

export const COLLATERALS: Collateral[] = [
  {
    id: 'oesophageal',
    es: 'Anastomosis esofágicas',
    kind: 'portocaval',
    ends: ['portal-tributaries', 'azygos'],
    via: 'Vena gástrica izquierda y esofágicas inferiores (porta) con las esofágicas que van a las ácigos (cava superior), en la submucosa del esófago abdominal',
    sign: 'Várices esofágicas y gástricas, que pueden sangrar sin control',
    signFrom: 'portal-tributaries',
    onlyFrom: 'portal-tributaries',
  },
  {
    id: 'rectal',
    es: 'Anastomosis rectales',
    kind: 'portocaval',
    ends: ['portal-tributaries', 'iliac'],
    // The only portocaval route the sources also describe the other way: iliac blood into the portal system (p. 997).
    via: 'Rectales superiores (porta, por la mesentérica inferior) con las rectales medias e inferiores (ilíacas internas y pudendas), en la submucosa del conducto anal',
    sign: 'Várices rectales (aunque no son la causa más frecuente de hemorroides)',
    signFrom: 'portal-tributaries',
  },
  {
    id: 'paraumbilical',
    es: 'Anastomosis paraumbilicales',
    kind: 'portocaval',
    ends: ['portal-left-branch', 'iliac', 'bcv'],
    via: 'Venas paraumbilicales, a lo largo del ligamento redondo, de la rama izquierda de la porta, con las toracoepigástricas (axilar) y epigástricas superficiales (femoral)',
    sign: 'Cabeza de medusa: várices radiadas alrededor del ombligo',
    signFrom: 'portal-left-branch',
    onlyFrom: 'portal-left-branch',
  },
  {
    id: 'retroperitoneal',
    es: 'Anastomosis retroperitoneales',
    kind: 'portocaval',
    ends: ['portal-tributaries', 'ivc-infra'],
    via: 'Venas cólicas y omentales (porta) con las lumbares ascendentes y retroperitoneales (cava), en las áreas desnudas de las vísceras retroperitoneales',
    onlyFrom: 'portal-tributaries',
  },
  {
    id: 'paravertebral',
    es: 'Vía paravertebral',
    kind: 'intercaval',
    ends: ['iliac', 'azygos'],
    via: 'Vena lumbar ascendente, desde la ilíaca común, y venas ácigos y hemiácigos, hasta el arco de la ácigos',
  },
  {
    id: 'intravertebral',
    es: 'Vía intravertebral',
    kind: 'intercaval',
    ends: ['iliac', 'azygos', 'bcv'],
    via: 'Plexos venosos vertebrales internos, continuos del foramen magno al hiato sacro y unidos en cada nivel a la vía paravertebral',
  },
  {
    id: 'anteromedial',
    es: 'Vía anteromedial',
    kind: 'intercaval',
    ends: ['iliac', 'bcv'],
    via: 'Epigástrica inferior (ilíaca externa) y torácica interna (braquiocefálica), unidas por las epigástricas en la vaina del recto',
  },
  {
    id: 'anterolateral',
    es: 'Vía anterolateral',
    kind: 'intercaval',
    ends: ['iliac', 'bcv'],
    via: 'Epigástrica superficial (safena magna y femoral) con la torácica lateral (axilar), por una red subcutánea del abdomen y del tórax',
    sign: 'Red venosa subcutánea abdominal y torácica, a menudo el primer signo',
  },
  {
    id: 'upper-laterovertebral',
    es: 'Intercostales y torácicas internas hacia la ácigos',
    kind: 'intercaval',
    ends: ['bcv', 'azygos'],
    via: 'Venas intercostales superiores, pericardiofrénicas y torácicas internas, que llevan la sangre de las braquiocefálicas a la ácigos',
  },
]

export type LesionId = 'cirrhosis' | 'portal-thrombosis' | 'svc-above' | 'svc-below' | 'ivc-infra'

export interface Lesion {
  id: LesionId
  es: string
  occludes: VeinId[]
  text: string
}

export const LESIONS: Lesion[] = [
  {
    id: 'cirrhosis',
    es: 'Cirrosis (bloqueo en el hígado)',
    occludes: ['liver'],
    text: 'La fibrosis del hígado frena la sangre de la porta: sube la presión en todo el sistema (hipertensión portal) y, como la porta y sus afluentes no tienen válvulas, la sangre del intestino vuelve atrás y busca la cava por las cuatro anastomosis portocavas.',
  },
  {
    id: 'portal-thrombosis',
    es: 'Trombosis del tronco de la porta',
    occludes: ['portal-trunk'],
    text: 'El bloqueo está antes del hígado. Las venas paraumbilicales desembocan en la rama izquierda de la porta, más allá del trombo: siguen drenando al hígado y no se forma cabeza de medusa, que sí aparece cuando el bloqueo es hepático.',
  },
  {
    id: 'svc-above',
    es: 'Cava superior, por encima de la ácigos',
    occludes: ['svc-upper'],
    text: 'La sangre de la cabeza y de los miembros superiores baja por las intercostales, pericardiofrénicas y torácicas internas hasta la ácigos, y entra en el corazón por el arco de ésta sin pasar por el segmento cerrado. La estasis da el edema en esclavina de la mitad superior del cuerpo.',
  },
  {
    id: 'svc-below',
    es: 'Cava superior, a la altura o por debajo de la ácigos',
    occludes: ['svc-lower'],
    text: 'Cerrada también la salida de la ácigos, la sangre de la mitad superior del cuerpo y de la pared del tórax refluye hacia la cava inferior, a contracorriente por la ácigos, la lumbar ascendente y los plexos vertebrales, y por la pared del abdomen.',
  },
  {
    id: 'ivc-infra',
    es: 'Cava inferior, por debajo de las renales',
    occludes: ['ivc-infra'],
    text: 'La sangre de los miembros inferiores y de la pelvis sube por los plexos vertebrales y la vía paravertebral hasta la ácigos y la cava superior, y por la pared del abdomen. Por encima de las renales, en cambio, la ligadura de la cava no es compatible con la vida.',
  },
]

export interface Outcome {
  territory: Territory
  /** Drains along the normal veins. */
  normal: boolean
  /** Collaterals it opens, if not. */
  collaterals: Collateral[]
  /** Signs those collaterals bring, for blood coming from this territory. */
  signs: string[]
  /** Veins its blood fills without draining: congested. */
  congested: VeinId[]
}

const adjacency = (pairs: [VeinId, VeinId][], closed: Set<VeinId>) => {
  const adj = new Map<VeinId, VeinId[]>()
  for (const [a, b] of pairs) {
    if (closed.has(a) || closed.has(b)) continue
    adj.set(a, [...(adj.get(a) ?? []), b])
    adj.set(b, [...(adj.get(b) ?? []), a])
  }
  return adj
}

const reach = (from: VeinId, adj: Map<VeinId, VeinId[]>, stopAt?: VeinId) => {
  const seen = new Set<VeinId>([from])
  const queue = [from]
  while (queue.length) {
    const v = queue.shift()!
    if (v === stopAt) continue
    for (const n of adj.get(v) ?? []) if (!seen.has(n)) seen.add(n), queue.push(n)
  }
  return seen
}

/** What becomes of every territory's blood with these veins closed. */
export function outcomes(closedVeins: VeinId[]): Outcome[] {
  const closed = new Set(closedVeins)
  const adj = adjacency(NORMAL, closed)
  // Veins that still reach the atrium along normal veins.
  const draining = reach('atrium', adj)
  return TERRITORIES.map((territory) => {
    if (closed.has(territory.into)) return { territory, normal: false, collaterals: [], signs: [], congested: [] }
    if (draining.has(territory.into)) return { territory, normal: true, collaterals: [], signs: [], congested: [] }
    const filled = reach(territory.into, adj)
    const used = COLLATERALS.filter((c) => {
      const open = c.ends.filter((e) => !closed.has(e))
      if (c.onlyFrom && !filled.has(c.onlyFrom)) return false
      return open.some((e) => filled.has(e)) && open.some((e) => draining.has(e))
    })
    const signs = used.filter((c) => c.sign && (!c.signFrom || filled.has(c.signFrom))).map((c) => c.sign!)
    return { territory, normal: false, collaterals: used, signs, congested: [...filled] }
  })
}

export const lesionById = new Map(LESIONS.map((l) => [l.id, l]))
