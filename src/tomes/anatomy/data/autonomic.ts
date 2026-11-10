/**
 * The vegetative system as two outflows to the same organs (Testut t. III pp. 357–440, after Purves-Stewart's fig. 331
 * and Testut's figs. 334 and 336; levels and syndromes after Moore 8.ª). Each organ names what the sympathetic and the
 * parasympathetic do to it and the way each one takes: the centre (cord segments or a cranial nucleus), the nerves and
 * the ganglion where the fibre relays. A lesion cuts a way if it lies on it. What the organ then shows is derived: the
 * other system unopposed, where both act (Testut: "funcionalmente antagonistas"), or a plain loss, where only one does.
 *
 * Testut's two laws of the parallel (p. 389) are in the geometry and checked by the tests: the sympathetic relays near
 * the cord, in the lateral chain or a prevertebral plexus, the parasympathetic near or inside the organ; so for one
 * organ the sympathetic preganglionic fibre is always the shorter and its postganglionic the longer.
 */

export type System = 'sympathetic' | 'parasympathetic'

export interface Way {
  /** The centre: a cranial nucleus ('III', 'VII', 'IX', 'X') or the first and last cord segment. */
  centre: string | [string, string]
  /** The nodes the fibres pass, from the centre outwards. */
  path: string[]
  /** The ganglion of the path where the fibres relay, or 'organ' when the relay is in the organ itself. */
  relay: string
  /** What this system does to the organ. */
  does: string
  /** What the organ shows without it. */
  without: string
}

export interface Organ {
  id: string
  name: string
  /** Position in the plate, as a fraction of its height. */
  y: number
  sympathetic?: Way
  parasympathetic?: Way
}

export interface Node {
  id: string
  name: string
  system: System
  /** In the plate: x from the organs (0) to the neuraxis (1), y as a fraction of its height. */
  x: number
  y: number
  /** A ganglion, where the fibres relay; otherwise a nerve or a root. */
  ganglion?: boolean
}

export const NODES: Node[] = [
  // Parasympathetic, cranial.
  {
    id: 'oculomotor',
    name: 'Motor ocular común',
    system: 'parasympathetic',
    x: 0.62,
    y: 0.05,
  },
  {
    id: 'ciliary',
    name: 'Ganglio oftálmico',
    system: 'parasympathetic',
    x: 0.2,
    y: 0.06,
    ganglion: true,
  },
  {
    id: 'intermediary',
    name: 'Intermediario (VII)',
    system: 'parasympathetic',
    x: 0.62,
    y: 0.17,
  },
  {
    id: 'pterygopalatine',
    name: 'Ganglio esfenopalatino',
    system: 'parasympathetic',
    x: 0.2,
    y: 0.15,
    ganglion: true,
  },
  {
    id: 'submandibular',
    name: 'Ganglio submaxilar',
    system: 'parasympathetic',
    x: 0.2,
    y: 0.2,
    ganglion: true,
  },
  {
    id: 'glossopharyngeal',
    name: 'Glosofaríngeo (Jacobson)',
    system: 'parasympathetic',
    x: 0.62,
    y: 0.25,
  },
  {
    id: 'otic',
    name: 'Ganglio ótico',
    system: 'parasympathetic',
    x: 0.2,
    y: 0.25,
    ganglion: true,
  },
  {
    id: 'vagusNeck',
    name: 'Neumogástrico en el cuello',
    system: 'parasympathetic',
    x: 0.52,
    y: 0.38,
  },
  {
    id: 'cardiacPlexus',
    name: 'Plexo cardíaco (Wrisberg)',
    system: 'parasympathetic',
    x: 0.14,
    y: 0.42,
    ganglion: true,
  },
  {
    id: 'pulmonaryPlexus',
    name: 'Plexo pulmonar',
    system: 'parasympathetic',
    x: 0.14,
    y: 0.49,
    ganglion: true,
  },
  {
    id: 'vagusAbdomen',
    name: 'Vagos en el hiato',
    system: 'parasympathetic',
    x: 0.4,
    y: 0.6,
  },
  {
    id: 'intramural',
    name: 'Plexos murales (Auerbach)',
    system: 'parasympathetic',
    x: 0.08,
    y: 0.63,
    ganglion: true,
  },
  {
    id: 'pelvicSplanchnic',
    name: 'Nervios erectores (S2–S4)',
    system: 'parasympathetic',
    x: 0.5,
    y: 0.9,
  },
  {
    id: 'pelvicGanglia',
    name: 'Ganglios yuxtaviscerales',
    system: 'parasympathetic',
    x: 0.1,
    y: 0.86,
    ganglion: true,
  },
  {
    id: 'rectalWall',
    name: 'Plexos del recto',
    system: 'parasympathetic',
    x: 0.08,
    y: 0.76,
    ganglion: true,
  },
  // Sympathetic.
  {
    id: 'T1root',
    name: 'Raíz T1 y su ramo blanco',
    system: 'sympathetic',
    x: 0.93,
    y: 0.34,
  },
  {
    id: 'stellate',
    name: 'Ganglio estrellado',
    system: 'sympathetic',
    x: 0.78,
    y: 0.31,
    ganglion: true,
  },
  {
    id: 'cervicalChain',
    name: 'Cadena cervical',
    system: 'sympathetic',
    x: 0.78,
    y: 0.2,
  },
  {
    id: 'superiorCervical',
    name: 'Ganglio cervical superior',
    system: 'sympathetic',
    x: 0.78,
    y: 0.1,
    ganglion: true,
  },
  {
    id: 'upperThoracicChain',
    name: 'Cadena torácica alta',
    system: 'sympathetic',
    x: 0.8,
    y: 0.44,
    ganglion: true,
  },
  {
    id: 'cardiacNerves',
    name: 'Nervios cardíacos',
    system: 'sympathetic',
    x: 0.55,
    y: 0.43,
  },
  {
    id: 'greaterSplanchnic',
    name: 'Esplácnico mayor',
    system: 'sympathetic',
    x: 0.7,
    y: 0.56,
  },
  {
    id: 'celiac',
    name: 'Plexo solar',
    system: 'sympathetic',
    x: 0.5,
    y: 0.62,
    ganglion: true,
  },
  {
    id: 'lumbarSplanchnic',
    name: 'Esplácnicos lumbares',
    system: 'sympathetic',
    x: 0.75,
    y: 0.73,
  },
  {
    id: 'inferiorMesenteric',
    name: 'Ganglio mesentérico inferior',
    system: 'sympathetic',
    x: 0.5,
    y: 0.76,
    ganglion: true,
  },
  {
    id: 'hypogastric',
    name: 'Nervio presacro e hipogástrico',
    system: 'sympathetic',
    x: 0.48,
    y: 0.84,
    ganglion: true,
  },
  {
    id: 'lumbarChain',
    name: 'Cadena lumbar',
    system: 'sympathetic',
    x: 0.8,
    y: 0.96,
    ganglion: true,
  },
]

const HEAD: Way['path'] = ['T1root', 'stellate', 'cervicalChain', 'superiorCervical']

export const ORGANS: Organ[] = [
  {
    id: 'pupil',
    name: 'Pupila',
    y: 0.04,
    sympathetic: {
      centre: ['T1', 'T2'],
      path: HEAD,
      relay: 'superiorCervical',
      does: 'La dilata (músculo dilatador del iris).',
      without: 'Pupila pequeña (miosis): el esfínter queda solo.',
    },
    parasympathetic: {
      centre: 'III',
      path: ['oculomotor', 'ciliary'],
      relay: 'ciliary',
      does: 'La contrae (esfínter del iris).',
      without: 'Pupila dilatada (midriasis), que no se contrae a la luz.',
    },
  },
  {
    id: 'accommodation',
    name: 'Músculo ciliar',
    y: 0.08,
    parasympathetic: {
      centre: 'III',
      path: ['oculomotor', 'ciliary'],
      relay: 'ciliary',
      does: 'Lo contrae: el cristalino se abomba y el ojo enfoca de cerca.',
      without: 'No acomoda: ve borroso de cerca.',
    },
  },
  {
    id: 'lid',
    name: 'Músculo liso del párpado',
    y: 0.115,
    sympathetic: {
      centre: ['T1', 'T2'],
      path: HEAD,
      relay: 'superiorCervical',
      does: 'Sostiene el párpado superior (músculo de Müller).',
      without: 'El párpado cae un poco (ptosis ligera).',
    },
  },
  {
    id: 'face',
    name: 'Piel de la cara',
    y: 0.15,
    sympathetic: {
      centre: ['T1', 'T2'],
      path: HEAD,
      relay: 'superiorCervical',
      does: 'Hace sudar y cierra los vasos de la cara.',
      without: 'Esa mitad de la cara no suda y está roja y caliente.',
    },
  },
  {
    id: 'lacrimal',
    name: 'Glándula lagrimal',
    y: 0.19,
    parasympathetic: {
      centre: 'VII',
      path: ['intermediary', 'pterygopalatine'],
      relay: 'pterygopalatine',
      does: 'Segrega las lágrimas.',
      without: 'Ojo seco.',
    },
  },
  {
    id: 'submandibular',
    name: 'Glándulas submaxilar y sublingual',
    y: 0.23,
    parasympathetic: {
      centre: 'VII',
      path: ['intermediary', 'submandibular'],
      relay: 'submandibular',
      does: 'Segregan saliva fluida.',
      without: 'Menos saliva de ese lado.',
    },
  },
  {
    id: 'parotid',
    name: 'Parótida',
    y: 0.27,
    parasympathetic: {
      centre: 'IX',
      path: ['glossopharyngeal', 'otic'],
      relay: 'otic',
      does: 'Segrega saliva.',
      without: 'La parótida no segrega.',
    },
  },
  {
    id: 'arm',
    name: 'Piel y vasos del miembro superior',
    y: 0.33,
    sympathetic: {
      centre: ['T2', 'T7'],
      path: ['upperThoracicChain', 'stellate'],
      relay: 'stellate',
      does: 'Hace sudar, eriza los pelos y cierra los vasos.',
      without: 'Mano caliente, rosada y seca.',
    },
  },
  {
    id: 'heart',
    name: 'Corazón',
    y: 0.41,
    sympathetic: {
      centre: ['T1', 'T4'],
      path: ['upperThoracicChain', 'cardiacNerves'],
      relay: 'upperThoracicChain',
      does: 'Lo acelera y refuerza su latido.',
      without: 'El corazón ya no se acelera con el esfuerzo.',
    },
    parasympathetic: {
      centre: 'X',
      path: ['vagusNeck', 'cardiacPlexus'],
      relay: 'cardiacPlexus',
      does: 'Lo frena: es el cardiomoderador.',
      without: 'Taquicardia: falta el freno del vago.',
    },
  },
  {
    id: 'bronchi',
    name: 'Bronquios',
    y: 0.48,
    sympathetic: {
      centre: ['T1', 'T4'],
      path: ['upperThoracicChain'],
      relay: 'upperThoracicChain',
      does: 'Los dilata.',
      without: 'Predomina el vago: bronquios estrechos.',
    },
    parasympathetic: {
      centre: 'X',
      path: ['vagusNeck', 'pulmonaryPlexus'],
      relay: 'pulmonaryPlexus',
      does: 'Contrae su músculo y hace secretar sus glándulas.',
      without: 'Bronquios abiertos y secos.',
    },
  },
  {
    id: 'adrenal',
    name: 'Médula suprarrenal',
    y: 0.54,
    // The splanchnic ends in the gland itself: its cells stand for the postganglionic neuron.
    sympathetic: {
      centre: ['T5', 'T9'],
      path: ['greaterSplanchnic'],
      relay: 'organ',
      does: 'Vierte adrenalina en la sangre.',
      without: 'No responde con adrenalina.',
    },
  },
  {
    id: 'gut',
    name: 'Estómago e intestino',
    y: 0.62,
    sympathetic: {
      centre: ['T5', 'T9'],
      path: ['greaterSplanchnic', 'celiac'],
      relay: 'celiac',
      does: 'Frena el peristaltismo y cierra los esfínteres.',
      without: 'Predomina el vago: el tubo se mueve y segrega más.',
    },
    parasympathetic: {
      centre: 'X',
      path: ['vagusNeck', 'vagusAbdomen', 'intramural'],
      relay: 'intramural',
      does: 'Lo mueve y lo hace segregar.',
      without: 'El estómago se vacía mal y segrega menos.',
    },
  },
  {
    id: 'rectum',
    name: 'Colon descendente y recto',
    y: 0.75,
    sympathetic: {
      centre: ['L1', 'L2'],
      path: ['lumbarSplanchnic', 'inferiorMesenteric'],
      relay: 'inferiorMesenteric',
      does: 'Frena el colon y cierra el esfínter interno del ano.',
      without: 'El esfínter interno pierde su tono.',
    },
    parasympathetic: {
      centre: ['S2', 'S4'],
      path: ['pelvicSplanchnic', 'rectalWall'],
      relay: 'rectalWall',
      does: 'Contrae el colon y el recto: la defecación.',
      without: 'El recto no se vacía.',
    },
  },
  {
    id: 'bladder',
    name: 'Vejiga',
    y: 0.82,
    sympathetic: {
      centre: ['T11', 'L2'],
      path: ['lumbarSplanchnic', 'hypogastric'],
      relay: 'hypogastric',
      does: 'Cierra el cuello de la vejiga.',
      without: 'El cuello de la vejiga queda abierto.',
    },
    parasympathetic: {
      centre: ['S2', 'S4'],
      path: ['pelvicSplanchnic', 'pelvicGanglia'],
      relay: 'pelvicGanglia',
      does: 'Contrae la vejiga: la micción.',
      without: 'Retención: la vejiga no se vacía.',
    },
  },
  {
    id: 'erection',
    name: 'Órganos eréctiles',
    y: 0.87,
    parasympathetic: {
      centre: ['S2', 'S4'],
      path: ['pelvicSplanchnic', 'pelvicGanglia'],
      relay: 'pelvicGanglia',
      does: 'Dilata sus vasos: la erección.',
      without: 'No hay erección.',
    },
  },
  {
    id: 'ejaculation',
    name: 'Conductos deferentes y vesículas',
    y: 0.91,
    sympathetic: {
      centre: ['L1', 'L2'],
      path: ['lumbarSplanchnic', 'hypogastric'],
      relay: 'hypogastric',
      does: 'Los contrae: la eyaculación.',
      without: 'No hay eyaculación.',
    },
  },
  {
    id: 'leg',
    name: 'Piel y vasos del miembro inferior',
    y: 0.96,
    sympathetic: {
      centre: ['T10', 'L2'],
      path: ['lumbarChain'],
      relay: 'lumbarChain',
      does: 'Hace sudar, eriza los pelos y cierra los vasos.',
      without: 'Pie caliente, rosado y seco.',
    },
  },
]

export interface Lesion {
  id: string
  name: string
  nodes: string[]
  cause: string
}

export const LESIONS: Lesion[] = [
  {
    id: 'oculomotor',
    name: 'Motor ocular común',
    nodes: ['oculomotor'],
    cause: 'Un aneurisma de la comunicante posterior comprime el nervio; sus fibras pupilares, superficiales, son las primeras en sufrir.',
  },
  {
    id: 'intermediary',
    name: 'Facial en el peñasco',
    nodes: ['intermediary'],
    cause: 'Una fractura del peñasco por encima del ganglio geniculado, antes de que salgan el petroso mayor y la cuerda del tímpano.',
  },
  {
    id: 'glossopharyngeal',
    name: 'Nervio de Jacobson',
    nodes: ['glossopharyngeal'],
    cause: 'La cirugía del oído medio, en cuyo promontorio corre el nervio de Jacobson hacia el ótico.',
  },
  {
    id: 'T1root',
    name: 'Raíz T1 (Klumpke)',
    nodes: ['T1root'],
    cause: 'El arrancamiento de las raíces inferiores del plexo braquial, que se lleva el ramo comunicante blanco de T1.',
  },
  {
    id: 'cervicalChain',
    name: 'Cadena cervical',
    nodes: ['cervicalChain'],
    cause: 'Un tumor del vértice del pulmón, una herida o la cirugía del cuello.',
  },
  {
    id: 'stellate',
    name: 'Ganglio estrellado',
    nodes: ['stellate'],
    cause: 'Su bloqueo con anestesia o su extirpación (Leriche), por delante del escaleno anterior, para dilatar los vasos del brazo.',
  },
  {
    id: 'vagusNeck',
    name: 'Los vagos en el cuello',
    nodes: ['vagusNeck'],
    cause: 'La sección experimental de los dos vagos, o la atropina, que paraliza el parasimpático.',
  },
  {
    id: 'vagotomy',
    name: 'Vagotomía en el hiato',
    nodes: ['vagusAbdomen'],
    cause: 'La sección de los dos vagos junto al esófago, por debajo del corazón, que se hacía contra la úlcera de estómago.',
  },
  {
    id: 'splanchnic',
    name: 'Esplácnicos mayores',
    nodes: ['greaterSplanchnic'],
    cause: 'Su sección (Max Peet), por la resección de la undécima costilla, contra la hipertensión o el dolor del páncreas.',
  },
  {
    id: 'presacral',
    name: 'Nervio presacro',
    nodes: ['hypogastric'],
    cause: 'Su resección, la operación de Cotte, contra los dolores de la pelvis; lo describió Latarjet.',
  },
  {
    id: 'lumbarChain',
    name: 'Cadena lumbar',
    nodes: ['lumbarChain'],
    cause: 'La simpatectomía lumbar: se quitan dos o más ganglios para abrir los vasos de la pierna en la arteritis.',
  },
  {
    id: 'sacral',
    name: 'Raíces S2 a S4',
    nodes: ['pelvicSplanchnic'],
    cause: 'Una lesión del cono medular o de la cola de caballo, que toma las raíces del parasimpático pélvico.',
  },
]

export const lesion = (id: string) => LESIONS.find((l) => l.id === id)!

export const node = (id: string) => NODES.find((n) => n.id === id)!

const cut = (w: Way | undefined, l: Lesion | null) => !!w && !!l && w.path.some((n) => l.nodes.includes(n))

export type State = 'normal' | 'sympathetic' | 'parasympathetic' | 'lost'

export interface OrganState {
  organ: Organ
  /** Which system is left alone ('sympathetic' = only it acts), 'lost' if the only one is gone, 'normal' otherwise. */
  state: State
  /** What the organ shows. */
  shows: string
  cutSympathetic: boolean
  cutParasympathetic: boolean
}

export function organState(o: Organ, l: Lesion | null): OrganState {
  const cs = cut(o.sympathetic, l)
  const cp = cut(o.parasympathetic, l)
  const base = { organ: o, cutSympathetic: cs, cutParasympathetic: cp }
  if (cs && cp)
    return {
      ...base,
      state: 'lost',
      shows: [o.sympathetic!.without, o.parasympathetic!.without].join(' '),
    }
  if (cs)
    return {
      ...base,
      state: o.parasympathetic ? 'parasympathetic' : 'lost',
      shows: o.sympathetic!.without,
    }
  if (cp)
    return {
      ...base,
      state: o.sympathetic ? 'sympathetic' : 'lost',
      shows: o.parasympathetic!.without,
    }
  return { ...base, state: 'normal', shows: 'Normal.' }
}

export const states = (l: Lesion | null) => ORGANS.map((o) => organState(o, l))

/** The organs a lesion changes. */
export const affected = (l: Lesion) =>
  states(l)
    .filter((s) => s.state !== 'normal')
    .map((s) => s.organ.id)

/** Cord segments in order, for the centres of the sympathetic and the sacral parasympathetic. */
export const SEGMENTS = [
  ...Array.from({ length: 8 }, (_, i) => `C${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `L${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `S${i + 1}`),
]

/** The ganglion where a way relays, or null when it relays in the organ itself. */
export const relayOf = (w: Way): Node | null => (w.relay === 'organ' ? null : node(w.relay))
