/**
 * The nuclei of the cranial nerves III–XII on the brainstem seen from behind (Testut t. II pp. 719–724, fig. 591,
 * and t. III pp. 64–196), with the functional columns of today (Latarjet–Ruiz t. 1 pp. 256–257; Moore 8.ª p. 1064).
 *
 * Testut derives the nuclei from the grey column of the cord: the decussations behead its horns, and the bases and
 * heads of the anterior and posterior horns become four columns (see `bulb-columns.ts`); the vegetative nuclei he
 * likens to the lateral horn. Today they are sorted by what their fibres do, in six columns. The two systems are
 * almost the same partition: the tests check that they map onto each other nucleus by nucleus.
 *
 * Geometry, in mm: x from the midline outwards (efferent nuclei are drawn on the left half, afferent on the right),
 * y downwards from the upper border of the superior colliculi. Heights are Testut's where he gives them; the rest is
 * schematic, kept to his order of the nuclei from top to bottom and from the midline outwards.
 */

export type NerveId = 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X' | 'XI' | 'XII'
export const NERVES: NerveId[] = ['III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export type Mode = 'testut' | 'today'

/** Testut's columns: the four pieces of the cord's grey column, plus the lateral horn for the vegetative nuclei. */
export type TestutColumn = 'anterior-base' | 'anterior-head' | 'lateral-horn' | 'posterior-base' | 'posterior-head'

/** Today's functional columns (Latarjet–Ruiz): general somatic and special (branchial) motor, visceral motor, visceral afferent, special and general somatic afferent. */
export type ModernColumn = 'GSE' | 'SVE' | 'GVE' | 'VA' | 'SSA' | 'GSA'

export const TESTUT_COLUMNS: Record<TestutColumn, { name: string; efferent: boolean }> = {
  'anterior-base': { name: 'Base del asta anterior', efferent: true },
  'anterior-head': { name: 'Cabeza del asta anterior', efferent: true },
  'lateral-horn': { name: 'Homólogos del asta lateral', efferent: true },
  'posterior-base': { name: 'Base del asta posterior', efferent: false },
  'posterior-head': { name: 'Cabeza del asta posterior', efferent: false },
}

export const MODERN_COLUMNS: Record<ModernColumn, { name: string; efferent: boolean }> = {
  GSE: { name: 'Motora somática general', efferent: true },
  SVE: { name: 'Motora somática especial (branquial)', efferent: true },
  GVE: { name: 'Motora visceral (parasimpática)', efferent: true },
  VA: { name: 'Sensitiva visceral (y gusto)', efferent: false },
  SSA: { name: 'Sensitiva somática especial', efferent: false },
  GSA: { name: 'Sensitiva somática general', efferent: false },
}

/** A stretch of a nucleus serving one nerve (the ambiguus and the solitary serve several, one above the other). */
export interface Part {
  nerve: NerveId
  y: [number, number]
  /** Who the stretch belongs to today, when it differs (the bulbar root of the XI is the vagus's). */
  today?: NerveId
}

export interface Nucleus {
  id: string
  /** Testut's name, and today's. */
  name: string
  today: string
  nerves: NerveId[]
  parts?: Part[]
  testut: TestutColumn
  modern: ModernColumn
  /** Distance from the midline, inner and outer edge, mm. */
  x: [number, number]
  /** Upper and lower end, mm from the top of the midbrain. */
  y: [number, number]
  /** Under the floor of the ventricle (or the aqueduct), or deep in the tegmentum. */
  depth: 'floor' | 'deep'
  note: string
}

/** Landmarks on the y axis (mm). */
export const LEVELS = {
  /** Upper border of the pons, behind. */
  pons: 18,
  /** Upper (superior) angle of the fourth ventricle, at the end of the aqueduct. */
  ventricleTop: 27,
  /** The lateral angles: the floor's bulbopontine line (Testut's 19 mm pontine triangle). */
  lateralAngles: 46,
  /** The bulbopontine sulcus in front, where the VI, VII and VIII leave. */
  bulbopontine: 44.5,
  /** The tip of the calamus (obex), 11 mm below the lateral angles. */
  calamus: 57,
  /** Upper and lower end of the olive (12 to 15 mm high). */
  olive: [46, 60] as [number, number],
  /** The neck of the bulb: below it, the cervical cord. */
  cord: 74,
  /** The fifth cervical segment, where the XI's spinal nucleus ends. */
  c5: 128,
}

export const NUCLEI: Nucleus[] = [
  // ---- Base of the anterior horn: general somatic motor, beside the midline ----
  {
    id: 'oculomotor',
    name: 'Núcleo del motor ocular común',
    today: 'Núcleo del nervio oculomotor',
    nerves: ['III'],
    testut: 'anterior-base',
    modern: 'GSE',
    x: [0.4, 1.7],
    y: [2, 12],
    depth: 'floor',
    note: 'Una columna de unos 10 mm bajo el acueducto, a la altura de los tubérculos cuadrigéminos, dividida en los centros de cada músculo del ojo; por abajo toca el del patético.',
  },
  {
    id: 'edinger-westphal',
    name: 'Núcleo de Edinger-Westphal (centros fotomotor y acomodador)',
    today: 'Núcleo visceral (accesorio) del oculomotor',
    nerves: ['III'],
    testut: 'lateral-horn',
    modern: 'GVE',
    x: [0.05, 0.4],
    y: [3, 8],
    depth: 'floor',
    note: 'El núcleo vegetativo del tercer par: sus fibras hacen sinapsis en el ganglio oftálmico y cierran la pupila y acomodan el ojo.',
  },
  {
    id: 'trochlear',
    name: 'Núcleo del patético',
    today: 'Núcleo del nervio troclear',
    nerves: ['IV'],
    testut: 'anterior-base',
    modern: 'GSE',
    x: [0.5, 1.6],
    y: [12, 13.5],
    depth: 'floor',
    note: 'Un pequeño círculo de 1 a 1,5 mm a la altura de los tubérculos cuadrigéminos posteriores, prolongación de la columna del motor ocular común. Todas sus fibras se cruzan.',
  },
  {
    id: 'abducens',
    name: 'Núcleo del motor ocular externo',
    today: 'Núcleo del nervio abducens',
    nerves: ['VI'],
    testut: 'anterior-base',
    modern: 'GSE',
    x: [0.5, 1.9],
    y: [36.5, 39.5],
    depth: 'floor',
    note: 'Bajo la eminencia teres, en el triángulo protuberancial; el asa del facial lo rodea por delante, por dentro y por detrás.',
  },
  {
    id: 'hypoglossal',
    name: 'Núcleo principal del hipogloso',
    today: 'Núcleo del nervio hipogloso',
    nerves: ['XII'],
    testut: 'anterior-base',
    modern: 'GSE',
    x: [0.2, 1.5],
    y: [44.5, 59.5],
    depth: 'floor',
    note: 'Bajo el ala blanca interna, junto al rafe: 12,5 mm en el suelo del ventrículo y 2,5 por debajo del pico del cálamo. Un núcleo accesorio, por delante y por fuera, representa la cabeza del asta.',
  },
  // ---- Head of the anterior horn: branchial motor, deep in the tegmentum ----
  {
    id: 'mesencephalic-v',
    name: 'Núcleo accesorio del trigémino (células vesiculosas de Meynert)',
    today: 'Núcleo mesencefálico del nervio trigémino',
    nerves: ['V'],
    testut: 'anterior-head',
    modern: 'GSA',
    x: [2.2, 2.9],
    y: [3, 30],
    depth: 'deep',
    note: 'Una larga hilera de grandes células redondeadas que sube hasta el tubérculo cuadrigémino anterior. Testut lo cuenta con el trigémino motor, aunque sus células parezcan de ganglio espinal; hoy se sabe que son sensitivas: reciben la propiocepción de los músculos de la masticación.',
  },
  {
    id: 'motor-v',
    name: 'Núcleo masticador',
    today: 'Núcleo motor del nervio trigémino',
    nerves: ['V'],
    testut: 'anterior-head',
    modern: 'SVE',
    x: [3.0, 4.6],
    y: [29, 34],
    depth: 'deep',
    note: 'En la parte lateral de la calota protuberancial, un poco por detrás de la salida del trigémino; mueve los músculos de la masticación.',
  },
  {
    id: 'facial',
    name: 'Núcleo del facial',
    today: 'Núcleo motor del nervio facial',
    nerves: ['VII'],
    testut: 'anterior-head',
    modern: 'SVE',
    x: [3.0, 4.6],
    y: [40.5, 46],
    depth: 'deep',
    note: 'Una columna de 5,5 mm en la parte anteroexterna de la calota. Por abajo llega a la altura del extremo superior de la oliva, donde casi se confunde con el núcleo ambiguo.',
  },
  {
    id: 'ambiguus',
    name: 'Núcleo ambiguo',
    today: 'Núcleo ambiguo',
    nerves: ['IX', 'X', 'XI'],
    parts: [
      { nerve: 'IX', y: [46, 50] },
      { nerve: 'X', y: [50, 60] },
      { nerve: 'XI', y: [60, 65], today: 'X' },
    ],
    testut: 'anterior-head',
    modern: 'SVE',
    x: [3.2, 4.0],
    y: [46, 65],
    depth: 'deep',
    note: 'Una columna fusiforme de 18 a 20 mm en la formación reticular, de la parte alta del entrecruzamiento sensitivo al extremo superior de la oliva. Su parte superior da las fibras motoras del glosofaríngeo; la media, las del neumogástrico para los músculos estriados; la inferior, la raíz bulbar del espinal, que Testut tiene ya por una parte aberrante del vago, como hoy se cuenta.',
  },
  {
    id: 'spinal-xi',
    name: 'Núcleo medular del espinal',
    today: 'Núcleo espinal del nervio accesorio',
    nerves: ['XI'],
    testut: 'anterior-head',
    modern: 'GSE',
    x: [3.2, 4.2],
    y: [72, 128],
    depth: 'deep',
    note: 'Las células de la parte posteroexterna del asta anterior, desde algo por encima del primer segmento cervical hasta el quinto o el sexto. Moore lo cuenta como motor somático.',
  },
  // ---- Vegetative nuclei, likened to the lateral horn ----
  {
    id: 'lacrimal',
    name: 'Núcleo organovegetativo del VII',
    today: 'Núcleo lagrimal',
    nerves: ['VII'],
    testut: 'lateral-horn',
    modern: 'GVE',
    x: [2.0, 2.6],
    y: [38.5, 40.5],
    depth: 'floor',
    note: 'Cerca del suelo del ventrículo. Sus fibras atraviesan el ganglio geniculado sin detenerse y por el petroso superficial mayor y el vidiano llegan al ganglio esfenopalatino, y de allí a la glándula lagrimal.',
  },
  {
    id: 'superior-salivatory',
    name: 'Núcleo salival superior (organovegetativo del intermediario)',
    today: 'Núcleo salival superior',
    nerves: ['VII'],
    testut: 'lateral-horn',
    modern: 'GVE',
    x: [2.0, 2.6],
    y: [40.5, 43],
    depth: 'floor',
    note: 'Sus fibras van por el intermediario de Wrisberg, la cuerda del tímpano y el lingual a los ganglios submaxilar y sublingual, y de ellos a esas dos glándulas.',
  },
  {
    id: 'inferior-salivatory',
    name: 'Núcleo organovegetativo del IX',
    today: 'Núcleo salival inferior',
    nerves: ['IX'],
    testut: 'lateral-horn',
    modern: 'GVE',
    x: [2.0, 2.6],
    y: [43, 45.5],
    depth: 'floor',
    note: 'Sus fibras salen con el glosofaríngeo, cruzan el ganglio de Andersch y siguen por el nervio de Jacobson y el petroso menor hasta el ganglio ótico; de allí, por el auriculotemporal, a la parótida.',
  },
  {
    id: 'dorsal-vagus',
    name: 'Núcleo dorsal del vago (de Müller)',
    today: 'Núcleo dorsal del nervio vago',
    nerves: ['X'],
    testut: 'lateral-horn',
    modern: 'GVE',
    x: [1.6, 2.6],
    y: [47, 64],
    depth: 'floor',
    note: 'Bajo el ala gris. Es el centro organovegetativo del neumogástrico, el homólogo del asta lateral: sus fibras cruzan los ganglios sin detenerse y van a las fibras lisas del corazón, los pulmones y el tubo digestivo.',
  },
  // ---- Base of the posterior horn: the floor's sensory nuclei ----
  {
    id: 'solitary',
    name: 'Núcleo del fascículo solitario',
    today: 'Núcleos del tracto solitario',
    nerves: ['VII', 'IX', 'X'],
    parts: [
      { nerve: 'VII', y: [41, 46] },
      { nerve: 'IX', y: [46, 52] },
      { nerve: 'X', y: [52, 68] },
    ],
    testut: 'posterior-base',
    modern: 'VA',
    x: [2.7, 3.5],
    y: [41, 68],
    depth: 'floor',
    note: 'Las ramas descendentes de las fibras sensitivas de los nervios mixtos forman un haz, el fascículo solitario, que termina en una columnita de células: arriba las del intermediario de Wrisberg, en medio las del glosofaríngeo, abajo las del neumogástrico. Recibe el gusto.',
  },
  {
    id: 'vestibular-dorsal',
    name: 'Núcleo dorsal externo o principal del vestibular',
    today: 'Núcleo vestibular medial',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [3.6, 5.5],
    y: [38, 46],
    depth: 'floor',
    note: 'En el ala blanca externa, cerca del suelo; se extiende desde la eminencia teres hasta la parte alta del núcleo del hipogloso. Las estrías acústicas cruzan por detrás de él.',
  },
  {
    id: 'deiters',
    name: 'Núcleo de Deiters',
    today: 'Núcleo vestibular lateral',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [5.5, 7.4],
    y: [38.5, 45],
    depth: 'floor',
    note: 'Por fuera del anterior, de grandes células; de él y de los demás parten las fibras vestibuloespinales.',
  },
  {
    id: 'bechterew',
    name: 'Núcleo de Bechterew',
    today: 'Núcleo vestibular superior',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [4.6, 6.6],
    y: [33, 38.5],
    depth: 'floor',
    note: 'En el ángulo externo del cuarto ventrículo, prolongándose en el pedúnculo cerebeloso inferior; continúa por arriba al de Deiters.',
  },
  {
    id: 'vestibular-descending',
    name: 'Núcleo descendente del vestibular',
    today: 'Núcleo vestibular inferior',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [4.8, 6.4],
    y: [45, 58],
    depth: 'floor',
    note: 'Grupos de células a lo largo de la raíz descendente del vestibular, que baja hasta el extremo superior del núcleo de Goll.',
  },
  {
    id: 'acoustic-tubercle',
    name: 'Núcleo lateral o tubérculo acústico',
    today: 'Núcleo coclear posterior (dorsal)',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [7.4, 8.8],
    y: [42.5, 46.5],
    depth: 'floor',
    note: 'Una ligera eminencia en el suelo del ventrículo, donde termina la rama descendente de las fibras cocleares.',
  },
  {
    id: 'cochlear-ventral',
    name: 'Núcleo ventral o accesorio del acústico',
    today: 'Núcleo coclear anterior (ventral)',
    nerves: ['VIII'],
    testut: 'posterior-base',
    modern: 'SSA',
    x: [8.8, 10.2],
    y: [44, 48],
    depth: 'deep',
    note: 'Por delante y por fuera del extremo inferior del pedúnculo cerebeloso inferior; recibe la rama ascendente de las fibras cocleares.',
  },
  // ---- Head of the posterior horn: the trigeminal's sensory column ----
  {
    id: 'principal-v',
    name: 'Núcleo medio sensitivo pontino (de Déjerine)',
    today: 'Núcleo sensitivo principal del nervio trigémino',
    nerves: ['V'],
    testut: 'posterior-head',
    modern: 'GSA',
    x: [4.6, 6.2],
    y: [29, 34],
    depth: 'deep',
    note: 'En la protuberancia, por encima y por detrás del núcleo gelatinoso, que continúa; recibe las ramas ascendentes cortas de las fibras del trigémino.',
  },
  {
    id: 'spinal-v',
    name: 'Núcleo gelatinoso (raíz inferior o bulbar del trigémino)',
    today: 'Núcleo espinal del nervio trigémino',
    nerves: ['V'],
    testut: 'posterior-head',
    modern: 'GSA',
    x: [4.6, 6.0],
    y: [34, 84],
    depth: 'deep',
    note: 'La continuación de la cabeza del asta posterior, con la sustancia gelatinosa de Rolando: recibe la larga rama descendente de las fibras del trigémino, que baja hasta la parte alta de la médula cervical.',
  },
]

export const nucleus = (id: string) => NUCLEI.find((n) => n.id === id)!

export const columnOf = (n: Nucleus, mode: Mode) => (mode === 'testut' ? TESTUT_COLUMNS[n.testut] : MODERN_COLUMNS[n.modern])

/** Efferent nuclei go on the left half of the plate, afferent on the right; only the mesencephalic V changes sides. */
export const isEfferent = (n: Nucleus, mode: Mode) => columnOf(n, mode).efferent

/** The nerves a nucleus serves in each system (the bulbar root of the XI is the vagus's today). */
export function nervesOf(n: Nucleus, mode: Mode): NerveId[] {
  if (!n.parts) return n.nerves
  return [...new Set(n.parts.map((p) => (mode === 'today' && p.today ? p.today : p.nerve)))]
}

export function nucleiOf(nerve: NerveId, mode: Mode) {
  return NUCLEI.filter((n) => nervesOf(n, mode).includes(nerve))
}

/** The stretch of a nucleus that serves a nerve, or the whole of it. */
export function stretchOf(n: Nucleus, nerve: NerveId, mode: Mode): [number, number][] {
  if (!n.parts) return n.nerves.includes(nerve) ? [n.y] : []
  return n.parts.filter((p) => (mode === 'today' && p.today ? p.today : p.nerve) === nerve).map((p) => p.y)
}

export const height = (n: Nucleus) => n.y[1] - n.y[0]

/** The two systems mapped onto each other: Testut's column → today's. The mesencephalic V is the one disagreement. */
export const TESTUT_TO_MODERN: Record<TestutColumn, ModernColumn[]> = {
  'anterior-base': ['GSE'],
  'anterior-head': ['SVE'],
  'lateral-horn': ['GVE'],
  'posterior-base': ['VA', 'SSA'],
  'posterior-head': ['GSA'],
}

/**
 * The facial's intrabulbar course, seen from behind, on the left half (x, y in mm): from its nucleus it rises
 * towards the floor, climbs along the inner side of the VI nucleus, bends over it (the genu) and comes down
 * outside it to leave at the bulbopontine sulcus (Testut t. III pp. 128–129).
 */
export const FACIAL_LOOP: [number, number][] = [
  [3.6, 43],
  [2.6, 41.5],
  [1.2, 40.6],
  [0.25, 39],
  [0.3, 36.2],
  [1.3, 35.6],
  [2.4, 36.6],
  [2.8, 39.5],
  [5.5, 43],
  [9, LEVELS.bulbopontine],
]
