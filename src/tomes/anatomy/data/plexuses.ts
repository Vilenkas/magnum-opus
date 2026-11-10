/**
 * The brachial and lumbosacral plexuses as graphs from the roots to the nerves, and what a lesion anywhere along them
 * takes away (Testut t. III pp. 197–356; levels and signs after Moore 8.ª). Nothing is listed by hand: every muscle,
 * patch of skin and reflex names the nerve that serves it, the roots whose fibres it receives and where along the
 * nerve its branch leaves; a fibre survives if it can still climb from that branch to its root without crossing the
 * lesion. A muscle that loses all its fibres is paralysed, one that loses some is weak (each muscle has several roots
 * and each root many muscles: Thornburn, Forgue). Skin is anaesthetic only when it loses all its fibres: one root
 * alone never anaesthetises (Sherrington), its neighbours overlap it. Signs are predicates over what was lost.
 */

export type NodeKind = 'root' | 'trunk' | 'division' | 'cord' | 'nerve'

export interface PlexusNode {
  id: string
  name: string
  kind: NodeKind
  /** Where its fibres come from; roots have none. */
  from: string[]
  /** Position in the plate's diagram, as fractions of its width and height. */
  x: number
  y: number
  /** For a nerve that leaves another nerve: where along its parent it leaves (same scale as `Supply.at`). */
  branch?: number
}

/** One nerve's share of a structure: the roots of its fibres and where along the nerve its branch leaves. */
export interface Supply {
  nerve: string
  roots: string[]
  /** 0 at the plexus, then along the limb (the plexus fixes the meaning of each step in `levels`). */
  at: number
}

export interface Muscle {
  id: string
  name: string
  region: string
  supply: Supply[]
}

export interface SkinArea {
  id: string
  name: string
  supply: Supply[]
}

export interface Reflex {
  id: string
  name: string
  muscle: string
  roots: string[]
  /** The root without which the reflex is gone, not just weaker (Moore: S1 for the Achilles). */
  main?: string
}

export type Status = 'ok' | 'weak' | 'lost'

export interface Outcome {
  lesion: Lesion
  muscles: Map<string, Status>
  skin: Map<string, Status>
  reflexes: Map<string, Status>
}

export interface Sign {
  id: string
  name: string
  text: string
  when: (o: Outcome) => boolean
}

export interface Lesion {
  id: string
  name: string
  /** The nodes cut. */
  nodes: string[]
  /** For a lesion along one nerve: where (same scale as `Supply.at`); the branches leaving before it are spared. */
  at?: number
  cause: string
}

export interface Plexus {
  id: string
  caption: string
  roots: string[]
  nodes: PlexusNode[]
  muscles: Muscle[]
  skin: SkinArea[]
  reflexes: Reflex[]
  signs: Sign[]
  lesions: Lesion[]
  /** What one root alone covers on the skin, shown when the lesion takes single roots. */
  dermatomes: Record<string, string>
  levels: { at: number; name: string }[]
}

const s = (nerve: string, roots: string[], at: number): Supply => ({
  nerve,
  roots,
  at,
})

// ---------------------------------------------------------------------------------------------------------------
// Brachial plexus: C5–T1 (Testut pp. 259–301; Moore 8.ª pp. 189–200).
// Levels along a nerve: 0 axilla · 1 upper arm · 1.5 radial groove · 2 lower arm · 2.5 elbow · 3 upper forearm ·
// 3.5 mid forearm · 3.8 lower forearm · 4.2 wrist (carpal tunnel, Guyon) · 4.5 hand.
// ---------------------------------------------------------------------------------------------------------------

const ROOTS_UL = ['C5', 'C6', 'C7', 'C8', 'T1']
const rootY = (i: number, n: number, top: number, bottom: number) => top + (i * (bottom - top)) / (n - 1)

const BRACHIAL_NODES: PlexusNode[] = [
  ...ROOTS_UL.map((r, i): PlexusNode => ({
    id: r,
    name: r,
    kind: 'root',
    from: [],
    x: 0.03,
    y: rootY(i, 5, 0.14, 0.78),
  })),
  {
    id: 'upper',
    name: 'Tronco superior',
    kind: 'trunk',
    from: ['C5', 'C6'],
    x: 0.17,
    y: 0.22,
  },
  {
    id: 'middle',
    name: 'Tronco medio',
    kind: 'trunk',
    from: ['C7'],
    x: 0.17,
    y: 0.46,
  },
  {
    id: 'lower',
    name: 'Tronco inferior',
    kind: 'trunk',
    from: ['C8', 'T1'],
    x: 0.17,
    y: 0.7,
  },
  {
    id: 'antUpper',
    name: 'División anterior',
    kind: 'division',
    from: ['upper'],
    x: 0.31,
    y: 0.17,
  },
  {
    id: 'postUpper',
    name: 'División posterior',
    kind: 'division',
    from: ['upper'],
    x: 0.31,
    y: 0.3,
  },
  {
    id: 'antMiddle',
    name: 'División anterior',
    kind: 'division',
    from: ['middle'],
    x: 0.31,
    y: 0.42,
  },
  {
    id: 'postMiddle',
    name: 'División posterior',
    kind: 'division',
    from: ['middle'],
    x: 0.31,
    y: 0.52,
  },
  {
    id: 'antLower',
    name: 'División anterior',
    kind: 'division',
    from: ['lower'],
    x: 0.31,
    y: 0.78,
  },
  {
    id: 'postLower',
    name: 'División posterior',
    kind: 'division',
    from: ['lower'],
    x: 0.31,
    y: 0.64,
  },
  {
    id: 'lateral',
    name: 'Fascículo lateral',
    kind: 'cord',
    from: ['antUpper', 'antMiddle'],
    x: 0.5,
    y: 0.25,
  },
  {
    id: 'posterior',
    name: 'Fascículo posterior',
    kind: 'cord',
    from: ['postUpper', 'postMiddle', 'postLower'],
    x: 0.5,
    y: 0.5,
  },
  {
    id: 'medial',
    name: 'Fascículo medial',
    kind: 'cord',
    from: ['antLower'],
    x: 0.5,
    y: 0.78,
  },
  // Collaterals from the roots and the upper trunk.
  {
    id: 'dorsalScapular',
    name: 'N. del romboides',
    kind: 'nerve',
    from: ['C5'],
    x: 0.12,
    y: 0.02,
  },
  {
    id: 'longThoracic',
    name: 'N. del serrato mayor',
    kind: 'nerve',
    from: ['C5', 'C6', 'C7'],
    x: 0.24,
    y: 0.98,
  },
  {
    id: 'suprascapular',
    name: 'N. supraescapular',
    kind: 'nerve',
    from: ['upper'],
    x: 0.4,
    y: 0.04,
  },
  // From the cords.
  {
    id: 'lateralPectoral',
    name: 'N. del pectoral mayor',
    kind: 'nerve',
    from: ['lateral'],
    x: 0.76,
    y: 0.03,
  },
  {
    id: 'musculocutaneous',
    name: 'Musculocutáneo',
    kind: 'nerve',
    from: ['lateral'],
    x: 0.76,
    y: 0.13,
  },
  {
    id: 'median',
    name: 'Mediano',
    kind: 'nerve',
    from: ['lateral', 'medial'],
    x: 0.76,
    y: 0.23,
  },
  {
    id: 'subscapular',
    name: 'N. subescapulares',
    kind: 'nerve',
    from: ['posterior'],
    x: 0.76,
    y: 0.35,
  },
  {
    id: 'thoracodorsal',
    name: 'N. del dorsal ancho',
    kind: 'nerve',
    from: ['posterior'],
    x: 0.76,
    y: 0.43,
  },
  {
    id: 'axillary',
    name: 'Circunflejo',
    kind: 'nerve',
    from: ['posterior'],
    x: 0.76,
    y: 0.51,
  },
  {
    id: 'radial',
    name: 'Radial',
    kind: 'nerve',
    from: ['posterior'],
    x: 0.76,
    y: 0.6,
  },
  // Testut: the radial divides near the elbow into a superficial, sensory branch and a deep, motor one.
  {
    id: 'radialDeep',
    name: 'Rama profunda del radial',
    kind: 'nerve',
    from: ['radial'],
    x: 0.9,
    y: 0.67,
    branch: 2.8,
  },
  {
    id: 'medialPectoral',
    name: 'N. del pectoral menor',
    kind: 'nerve',
    from: ['medial'],
    x: 0.76,
    y: 0.75,
  },
  {
    id: 'ulnar',
    name: 'Cubital',
    kind: 'nerve',
    from: ['medial'],
    x: 0.76,
    y: 0.84,
  },
  {
    id: 'medialCutaneous',
    name: 'Braquial cutáneo interno',
    kind: 'nerve',
    from: ['medial'],
    x: 0.76,
    y: 0.93,
  },
]

const BRACHIAL_MUSCLES: Muscle[] = [
  // Shoulder girdle.
  {
    id: 'rhomboids',
    name: 'Romboides y angular',
    region: 'Cintura escapular',
    supply: [s('dorsalScapular', ['C5'], 0)],
  },
  {
    id: 'serratus',
    name: 'Serrato mayor',
    region: 'Cintura escapular',
    supply: [s('longThoracic', ['C5', 'C6', 'C7'], 0)],
  },
  {
    id: 'supraspinatus',
    name: 'Supraespinoso',
    region: 'Cintura escapular',
    supply: [s('suprascapular', ['C5', 'C6'], 0)],
  },
  {
    id: 'infraspinatus',
    name: 'Infraespinoso',
    region: 'Cintura escapular',
    supply: [s('suprascapular', ['C5', 'C6'], 0.5)],
  },
  {
    id: 'pectoralis',
    name: 'Pectoral mayor',
    region: 'Cintura escapular',
    supply: [s('lateralPectoral', ['C5', 'C6', 'C7'], 0), s('medialPectoral', ['C8', 'T1'], 0)],
  },
  {
    id: 'subscapularis',
    name: 'Subescapular y redondo mayor',
    region: 'Cintura escapular',
    supply: [s('subscapular', ['C5', 'C6'], 0)],
  },
  {
    id: 'latissimus',
    name: 'Dorsal ancho',
    region: 'Cintura escapular',
    supply: [s('thoracodorsal', ['C6', 'C7', 'C8'], 0)],
  },
  {
    id: 'deltoid',
    name: 'Deltoides',
    region: 'Cintura escapular',
    supply: [s('axillary', ['C5', 'C6'], 1)],
  },
  {
    id: 'teresMinor',
    name: 'Redondo menor',
    region: 'Cintura escapular',
    supply: [s('axillary', ['C5', 'C6'], 1)],
  },
  // Arm.
  {
    id: 'coracobrachialis',
    name: 'Coracobraquial',
    region: 'Brazo',
    supply: [s('musculocutaneous', ['C5', 'C6', 'C7'], 0.5)],
  },
  {
    id: 'biceps',
    name: 'Bíceps',
    region: 'Brazo',
    supply: [s('musculocutaneous', ['C5', 'C6'], 1)],
  },
  // Testut: the musculocutaneous is its main nerve, the radial an accessory one.
  {
    id: 'brachialis',
    name: 'Braquial anterior',
    region: 'Brazo',
    supply: [s('musculocutaneous', ['C5', 'C6'], 1), s('radial', ['C5', 'C6'], 2)],
  },
  {
    id: 'triceps',
    name: 'Tríceps',
    region: 'Brazo',
    supply: [s('radial', ['C6', 'C7', 'C8'], 1)],
  },
  // Forearm, extension side.
  {
    id: 'brachioradialis',
    name: 'Supinador largo',
    region: 'Antebrazo',
    supply: [s('radial', ['C5', 'C6'], 2)],
  },
  {
    id: 'ecrl',
    name: 'Primer radial externo',
    region: 'Antebrazo',
    supply: [s('radial', ['C6', 'C7'], 2)],
  },
  {
    id: 'ecrb',
    name: 'Segundo radial externo',
    region: 'Antebrazo',
    supply: [s('radialDeep', ['C7', 'C8'], 3)],
  },
  {
    id: 'supinator',
    name: 'Supinador corto',
    region: 'Antebrazo',
    supply: [s('radialDeep', ['C6', 'C7'], 3)],
  },
  {
    id: 'extensors',
    name: 'Extensores de los dedos',
    region: 'Antebrazo',
    supply: [s('radialDeep', ['C7', 'C8'], 3.5)],
  },
  {
    id: 'ecu',
    name: 'Cubital posterior',
    region: 'Antebrazo',
    supply: [s('radialDeep', ['C7', 'C8'], 3.5)],
  },
  {
    id: 'thumbExtensors',
    name: 'Abductor largo y extensores del pulgar',
    region: 'Antebrazo',
    supply: [s('radialDeep', ['C7', 'C8'], 3.5)],
  },
  // Forearm, flexion side.
  {
    id: 'pronatorTeres',
    name: 'Pronador redondo',
    region: 'Antebrazo',
    supply: [s('median', ['C6', 'C7'], 2.5)],
  },
  {
    id: 'fcr',
    name: 'Palmar mayor y palmar menor',
    region: 'Antebrazo',
    supply: [s('median', ['C6', 'C7', 'C8'], 2.5)],
  },
  {
    id: 'fds',
    name: 'Flexor común superficial',
    region: 'Antebrazo',
    supply: [s('median', ['C7', 'C8', 'T1'], 2.5)],
  },
  {
    id: 'fdpLateral',
    name: 'Flexor profundo (índice y medio)',
    region: 'Antebrazo',
    supply: [s('median', ['C8', 'T1'], 3)],
  },
  {
    id: 'fpl',
    name: 'Flexor largo del pulgar',
    region: 'Antebrazo',
    supply: [s('median', ['C8', 'T1'], 3)],
  },
  {
    id: 'pronatorQuadratus',
    name: 'Pronador cuadrado',
    region: 'Antebrazo',
    supply: [s('median', ['C8', 'T1'], 3)],
  },
  {
    id: 'fcu',
    name: 'Cubital anterior',
    region: 'Antebrazo',
    supply: [s('ulnar', ['C8', 'T1'], 2.6)],
  },
  {
    id: 'fdpMedial',
    name: 'Flexor profundo (anular y meñique)',
    region: 'Antebrazo',
    supply: [s('ulnar', ['C8', 'T1'], 2.6)],
  },
  // Hand.
  {
    id: 'thenar',
    name: 'Abductor corto y oponente del pulgar',
    region: 'Mano',
    supply: [s('median', ['C8', 'T1'], 4.5)],
  },
  {
    id: 'lumbricals12',
    name: 'Lumbricales 1.º y 2.º',
    region: 'Mano',
    supply: [s('median', ['C8', 'T1'], 4.5)],
  },
  {
    id: 'hypothenar',
    name: 'Músculos del meñique',
    region: 'Mano',
    supply: [s('ulnar', ['C8', 'T1'], 4.5)],
  },
  {
    id: 'lumbricals34',
    name: 'Lumbricales 3.º y 4.º',
    region: 'Mano',
    supply: [s('ulnar', ['C8', 'T1'], 4.5)],
  },
  {
    id: 'interossei',
    name: 'Interóseos',
    region: 'Mano',
    supply: [s('ulnar', ['C8', 'T1'], 4.5)],
  },
  {
    id: 'adductorPollicis',
    name: 'Aductor del pulgar',
    region: 'Mano',
    supply: [s('ulnar', ['C8', 'T1'], 4.5)],
  },
]

const BRACHIAL_SKIN: SkinArea[] = [
  {
    id: 'shoulder',
    name: 'Muñón del hombro',
    supply: [s('axillary', ['C5', 'C6'], 1)],
  },
  {
    id: 'posteriorArm',
    name: 'Cara posterior del brazo',
    supply: [s('radial', ['C5', 'C6', 'C7', 'C8'], 0.5)],
  },
  {
    id: 'medialArm',
    name: 'Cara interna del brazo y del antebrazo',
    supply: [s('medialCutaneous', ['C8', 'T1'], 0.5)],
  },
  {
    id: 'lateralForearm',
    name: 'Cara externa del antebrazo',
    supply: [s('musculocutaneous', ['C5', 'C6'], 2.5)],
  },
  // Leaves the radial in its groove, just above where the humerus breaks it (Moore p. 214).
  {
    id: 'posteriorForearm',
    name: 'Cara posterior del antebrazo',
    supply: [s('radial', ['C5', 'C6', 'C7', 'C8'], 1.5)],
  },
  {
    id: 'dorsumRadial',
    name: 'Dorso de la mano, mitad externa, y del pulgar',
    supply: [s('radial', ['C6', 'C7', 'C8'], 3.5)],
  },
  // The palmar branch of the median leaves 2–3 cm above the wrist and does not enter the carpal tunnel (Testut p. 277; Moore p. 260).
  {
    id: 'palmLateral',
    name: 'Palma, mitad externa',
    supply: [s('median', ['C6', 'C7'], 3.8)],
  },
  {
    id: 'fingersMedian',
    name: 'Pulgar, índice, medio y medio anular, cara palmar',
    supply: [s('median', ['C6', 'C7', 'C8'], 4.5)],
  },
  // The dorsal cutaneous branch of the ulnar leaves in the forearm (Moore p. 253).
  {
    id: 'dorsumUlnar',
    name: 'Dorso de la mano, mitad interna',
    supply: [s('ulnar', ['C8'], 3.5)],
  },
  {
    id: 'fingersUlnar',
    name: 'Meñique y medio anular, cara palmar',
    supply: [s('ulnar', ['C8'], 4.5)],
  },
]

const BRACHIAL_REFLEXES: Reflex[] = [
  { id: 'biceps', name: 'Bicipital', muscle: 'biceps', roots: ['C5', 'C6'] },
  {
    id: 'brachioradialis',
    name: 'Estilorradial',
    muscle: 'brachioradialis',
    roots: ['C5', 'C6'],
  },
  {
    id: 'triceps',
    name: 'Tricipital',
    muscle: 'triceps',
    roots: ['C6', 'C7', 'C8'],
    main: 'C7',
  },
]

const lost = (o: Outcome, ...ids: string[]) => ids.every((id) => o.muscles.get(id) === 'lost')
const kept = (o: Outcome, ...ids: string[]) => ids.every((id) => o.muscles.get(id) !== 'lost')

const BRACHIAL_SIGNS: Sign[] = [
  {
    id: 'waiter',
    name: 'Propina del camarero',
    text: 'El brazo cuelga pegado al cuerpo, en rotación interna y con el codo extendido: sin deltoides, infraespinoso ni bíceps, no se separa, no rota afuera ni se dobla.',
    when: (o) => lost(o, 'deltoid', 'infraspinatus', 'biceps'),
  },
  {
    id: 'winged',
    name: 'Escápula alada',
    text: 'Al empujar con los brazos adelante, el borde interno del omóplato se despega del tórax: el serrato ya no lo sujeta.',
    when: (o) => lost(o, 'serratus'),
  },
  {
    id: 'wristDrop',
    name: 'Mano péndula',
    text: 'La muñeca cae y los dedos no se extienden en las metacarpofalángicas: los extensores están paralizados.',
    when: (o) => lost(o, 'ecrl', 'ecrb', 'extensors'),
  },
  {
    id: 'fingerDrop',
    name: 'Caída de los dedos',
    text: 'Los dedos no se extienden, pero la muñeca sí, desviada hacia el radio: el primer radial externo sale del nervio antes de la lesión.',
    when: (o) => lost(o, 'extensors') && kept(o, 'ecrl'),
  },
  {
    id: 'benediction',
    name: 'Mano en bendición',
    text: 'Al cerrar el puño, el índice y el medio quedan extendidos y el pulgar no se dobla: sólo flexionan el anular y el meñique.',
    when: (o) => lost(o, 'fds', 'fdpLateral', 'fpl') && kept(o, 'fdpMedial'),
  },
  {
    id: 'ape',
    name: 'Mano simiesca',
    text: 'El pulgar no se opone a los otros dedos y queda en el plano de la palma; la eminencia tenar se atrofia.',
    when: (o) => lost(o, 'thenar'),
  },
  {
    id: 'ulnarClaw',
    name: 'Garra cubital',
    text: 'El anular y el meñique se extienden en la metacarpofalángica y se doblan en las interfalángicas; los dedos no se separan ni se juntan. Cuanto más baja la lesión, más marcada, porque el flexor profundo conserva su fuerza.',
    when: (o) => lost(o, 'interossei', 'lumbricals34') && kept(o, 'lumbricals12'),
  },
  {
    id: 'claw',
    name: 'Garra de toda la mano',
    text: 'Todos los dedos en garra: los músculos propios de la mano, de C8 y T1, están paralizados.',
    when: (o) => lost(o, 'interossei', 'lumbricals34', 'lumbricals12'),
  },
  {
    id: 'horner',
    name: 'Síndrome de Horner',
    text: 'Pupila pequeña, párpado algo caído y cara seca del mismo lado: la raíz T1 arrancada se lleva el ramo comunicante blanco que sube al ganglio estrellado (véase la lámina del simpático).',
    when: (o) => o.lesion.nodes.includes('T1'),
  },
]

const BRACHIAL_LESIONS: Lesion[] = [
  {
    id: 'erb',
    name: 'Tronco superior (Erb-Duchenne)',
    nodes: ['upper'],
    cause: 'La cabeza separada con violencia del hombro, en un parto difícil o una caída sobre el hombro, desgarra el tronco de C5 y C6.',
  },
  {
    id: 'klumpke',
    name: 'Raíces C8 y T1 (Klumpke)',
    nodes: ['C8', 'T1'],
    cause: 'El brazo tirado hacia arriba, al agarrarse en una caída o al sacar al niño del brazo en el parto, arranca las raíces inferiores de la médula.',
  },
  {
    id: 'c6',
    name: 'Raíz C6',
    nodes: ['C6'],
    cause: 'Una hernia del disco entre C5 y C6, que comprime la raíz que sale por debajo.',
  },
  {
    id: 'c7',
    name: 'Raíz C7',
    nodes: ['C7'],
    cause: 'Una hernia del disco entre C6 y C7, la más frecuente del cuello.',
  },
  {
    id: 'longThoracic',
    name: 'Nervio del serrato mayor',
    nodes: ['longThoracic'],
    cause: 'Una herida o la cirugía de la mama y de la axila, por donde el nervio baja sobre el serrato.',
  },
  {
    id: 'axillary',
    name: 'Circunflejo',
    nodes: ['axillary'],
    cause: 'La luxación del hombro o la fractura del cuello quirúrgico, que el nervio rodea por detrás.',
  },
  {
    id: 'posteriorCord',
    name: 'Fascículo posterior',
    nodes: ['posterior'],
    cause: 'La compresión de la axila por una muleta mal apoyada.',
  },
  {
    id: 'radialGroove',
    name: 'Radial en el canal de torsión',
    nodes: ['radial'],
    at: 1.6,
    cause: 'La fractura de la diáfisis del húmero, sobre la que el nervio corre en contacto con el hueso.',
  },
  {
    id: 'radialDeep',
    name: 'Rama profunda del radial',
    nodes: ['radialDeep'],
    at: 3.2,
    cause: 'Una herida o la luxación de la cabeza del radio, donde el nervio atraviesa el supinador corto.',
  },
  {
    id: 'musculocutaneous',
    name: 'Musculocutáneo',
    nodes: ['musculocutaneous'],
    at: 0.6,
    cause: 'Una herida de la axila, donde el nervio entra en el coracobraquial.',
  },
  {
    id: 'medianElbow',
    name: 'Mediano en el codo',
    nodes: ['median'],
    at: 2.4,
    cause: 'La fractura supracondílea del húmero o una herida del pliegue del codo.',
  },
  {
    id: 'medianWrist',
    name: 'Mediano en el carpo',
    nodes: ['median'],
    at: 4.2,
    cause: 'El síndrome del túnel carpiano: el nervio comprimido bajo el ligamento anterior del carpo.',
  },
  {
    id: 'ulnarElbow',
    name: 'Cubital en el codo',
    nodes: ['ulnar'],
    at: 2.4,
    cause: 'Un golpe o una fractura del epicóndilo medial (epitróclea), detrás del cual el nervio corre bajo la piel.',
  },
  {
    id: 'ulnarWrist',
    name: 'Cubital en la muñeca',
    nodes: ['ulnar'],
    at: 4.2,
    cause: 'Una herida de la muñeca o la compresión en el canal de Guyon, junto al pisiforme.',
  },
]

// Moore 8.ª p. 163 (table 3-1, after Keegan and Garrett); Testut p. 225 for the same bands after Déjerine.
const DERMATOMES_UL: Record<string, string> = {
  C5: 'el muñón del hombro y la cara externa del brazo',
  C6: 'la cara externa del antebrazo y el pulgar',
  C7: 'el dedo medio',
  C8: 'el meñique y el borde interno de la mano',
  T1: 'la cara interna del antebrazo',
}

export const BRACHIAL: Plexus = {
  id: 'brachial',
  caption: 'Lámina XXII · Las parálisis del plexo braquial',
  roots: ROOTS_UL,
  nodes: BRACHIAL_NODES,
  muscles: BRACHIAL_MUSCLES,
  skin: BRACHIAL_SKIN,
  reflexes: BRACHIAL_REFLEXES,
  signs: BRACHIAL_SIGNS,
  lesions: BRACHIAL_LESIONS,
  dermatomes: DERMATOMES_UL,
  levels: [
    { at: 0, name: 'axila' },
    { at: 1, name: 'brazo' },
    { at: 2.5, name: 'codo' },
    { at: 3.5, name: 'antebrazo' },
    { at: 4.2, name: 'muñeca' },
    { at: 4.5, name: 'mano' },
  ],
}

// ---------------------------------------------------------------------------------------------------------------
// Lumbosacral plexus: L1–S4 (Testut pp. 307–356; Moore 8.ª pp. 696–766).
// Levels along a nerve: 0 pelvis · 0.5 groin or buttock · 1 thigh · 2 popliteal fossa · 2.5 neck of the fibula ·
// 3 leg · 3.5 ankle · 4 sole.
// ---------------------------------------------------------------------------------------------------------------

const ROOTS_LL = ['L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4']

const LUMBOSACRAL_NODES: PlexusNode[] = [
  ...ROOTS_LL.map((r, i): PlexusNode => ({
    id: r,
    name: r,
    kind: 'root',
    from: [],
    x: 0.03,
    y: rootY(i, 9, 0.06, 0.94),
  })),
  // Testut: the fourth lumbar sends a branch down to the fifth; together they are the lumbosacral trunk.
  {
    id: 'lumbosacralTrunk',
    name: 'Tronco lumbosacro',
    kind: 'trunk',
    from: ['L4', 'L5'],
    x: 0.2,
    y: 0.5,
  },
  {
    id: 'lumbarAnt',
    name: 'Divisiones anteriores lumbares',
    kind: 'division',
    from: ['L2', 'L3', 'L4'],
    x: 0.33,
    y: 0.3,
  },
  {
    id: 'lumbarPost',
    name: 'Divisiones posteriores lumbares',
    kind: 'division',
    from: ['L2', 'L3', 'L4'],
    x: 0.33,
    y: 0.2,
  },
  {
    id: 'sacralAnt',
    name: 'Divisiones anteriores sacras',
    kind: 'division',
    from: ['lumbosacralTrunk', 'S1', 'S2', 'S3'],
    x: 0.36,
    y: 0.72,
  },
  {
    id: 'sacralPost',
    name: 'Divisiones posteriores sacras',
    kind: 'division',
    from: ['lumbosacralTrunk', 'S1', 'S2'],
    x: 0.36,
    y: 0.55,
  },
  {
    id: 'abdominogenital',
    name: 'Abdominogenitales y genitocrural',
    kind: 'nerve',
    from: ['L1', 'L2'],
    x: 0.78,
    y: 0.03,
  },
  {
    id: 'psoasBranches',
    name: 'Ramos del psoas',
    kind: 'nerve',
    from: ['L1', 'L2', 'L3'],
    x: 0.2,
    y: 0.02,
  },
  {
    id: 'lateralFemoralCutaneous',
    name: 'Femorocutáneo',
    kind: 'nerve',
    from: ['lumbarPost'],
    x: 0.78,
    y: 0.1,
  },
  {
    id: 'femoral',
    name: 'Crural',
    kind: 'nerve',
    from: ['lumbarPost'],
    x: 0.78,
    y: 0.18,
  },
  {
    id: 'obturator',
    name: 'Obturador',
    kind: 'nerve',
    from: ['lumbarAnt'],
    x: 0.78,
    y: 0.28,
  },
  {
    id: 'superiorGluteal',
    name: 'Glúteo superior',
    kind: 'nerve',
    from: ['sacralPost'],
    x: 0.78,
    y: 0.38,
  },
  {
    id: 'inferiorGluteal',
    name: 'Glúteo inferior',
    kind: 'nerve',
    from: ['sacralPost'],
    x: 0.78,
    y: 0.46,
  },
  {
    id: 'peroneal',
    name: 'Ciático poplíteo externo',
    kind: 'nerve',
    from: ['sacralPost'],
    x: 0.78,
    y: 0.55,
  },
  {
    id: 'pelvitrochanteric',
    name: 'Nervios pelvitrocantéreos',
    kind: 'nerve',
    from: ['sacralAnt'],
    x: 0.78,
    y: 0.63,
  },
  {
    id: 'tibial',
    name: 'Ciático poplíteo interno',
    kind: 'nerve',
    from: ['sacralAnt'],
    x: 0.78,
    y: 0.72,
  },
  {
    id: 'posteriorFemoralCutaneous',
    name: 'Ciático menor (cutáneo posterior)',
    kind: 'nerve',
    from: ['sacralAnt'],
    x: 0.78,
    y: 0.81,
  },
  // Testut's pudendal plexus: a little of S2, most of S3, all of S4.
  {
    id: 'pudendal',
    name: 'Pudendo interno',
    kind: 'nerve',
    from: ['S2', 'S3', 'S4'],
    x: 0.78,
    y: 0.92,
  },
]

const LUMBOSACRAL_MUSCLES: Muscle[] = [
  {
    id: 'psoas',
    name: 'Psoas',
    region: 'Cadera',
    supply: [s('psoasBranches', ['L1', 'L2', 'L3'], 0)],
  },
  {
    id: 'iliacus',
    name: 'Ilíaco',
    region: 'Cadera',
    supply: [s('femoral', ['L2', 'L3'], 0)],
  },
  {
    id: 'gluteusMax',
    name: 'Glúteo mayor',
    region: 'Cadera',
    supply: [s('inferiorGluteal', ['L5', 'S1', 'S2'], 0.5)],
  },
  {
    id: 'gluteusMed',
    name: 'Glúteos mediano y menor',
    region: 'Cadera',
    supply: [s('superiorGluteal', ['L4', 'L5', 'S1'], 0.5)],
  },
  {
    id: 'tfl',
    name: 'Tensor de la fascia lata',
    region: 'Cadera',
    supply: [s('superiorGluteal', ['L4', 'L5'], 0.5)],
  },
  {
    id: 'rotators',
    name: 'Pelvitrocantéreos',
    region: 'Cadera',
    supply: [s('pelvitrochanteric', ['L5', 'S1', 'S2'], 0.5)],
  },
  {
    id: 'sartorius',
    name: 'Sartorio',
    region: 'Muslo',
    supply: [s('femoral', ['L2', 'L3'], 1)],
  },
  {
    id: 'quadriceps',
    name: 'Cuádriceps',
    region: 'Muslo',
    supply: [s('femoral', ['L2', 'L3', 'L4'], 1)],
  },
  {
    id: 'adductors',
    name: 'Aductores y recto interno',
    region: 'Muslo',
    supply: [s('obturator', ['L2', 'L3', 'L4'], 1)],
  },
  // Testut: the adductor magnus has two nerves, the obturator and the great sciatic.
  {
    id: 'adductorMagnus',
    name: 'Aductor mayor',
    region: 'Muslo',
    supply: [s('obturator', ['L2', 'L3', 'L4'], 1), s('tibial', ['L4'], 1)],
  },
  {
    id: 'hamstrings',
    name: 'Semitendinoso, semimembranoso y bíceps',
    region: 'Muslo',
    supply: [s('tibial', ['L5', 'S1', 'S2'], 1), s('peroneal', ['L5', 'S1', 'S2'], 1)],
  },
  {
    id: 'tricepsSurae',
    name: 'Tríceps sural',
    region: 'Pierna',
    supply: [s('tibial', ['S1', 'S2'], 2)],
  },
  {
    id: 'tibialisPosterior',
    name: 'Tibial posterior',
    region: 'Pierna',
    supply: [s('tibial', ['L4', 'L5'], 2.5)],
  },
  {
    id: 'toeFlexors',
    name: 'Flexores largos de los dedos',
    region: 'Pierna',
    supply: [s('tibial', ['S2', 'S3'], 2.5)],
  },
  {
    id: 'tibialisAnterior',
    name: 'Tibial anterior',
    region: 'Pierna',
    supply: [s('peroneal', ['L4', 'L5'], 3)],
  },
  {
    id: 'ehl',
    name: 'Extensor propio del dedo gordo',
    region: 'Pierna',
    supply: [s('peroneal', ['L5', 'S1'], 3)],
  },
  {
    id: 'edl',
    name: 'Extensor común de los dedos',
    region: 'Pierna',
    supply: [s('peroneal', ['L5', 'S1'], 3)],
  },
  {
    id: 'peronei',
    name: 'Peroneos laterales',
    region: 'Pierna',
    supply: [s('peroneal', ['L5', 'S1', 'S2'], 3)],
  },
  {
    id: 'footIntrinsic',
    name: 'Músculos de la planta',
    region: 'Pie',
    supply: [s('tibial', ['S2', 'S3'], 4)],
  },
  {
    id: 'perineal',
    name: 'Esfínter del ano y músculos del periné',
    region: 'Periné',
    supply: [s('pudendal', ['S2', 'S3', 'S4'], 0.5)],
  },
]

const LUMBOSACRAL_SKIN: SkinArea[] = [
  {
    id: 'groin',
    name: 'Ingle, pubis y raíz de los genitales',
    supply: [s('abdominogenital', ['L1', 'L2'], 0.5)],
  },
  {
    id: 'lateralThigh',
    name: 'Cara externa del muslo',
    supply: [s('lateralFemoralCutaneous', ['L2', 'L3'], 0.5)],
  },
  {
    id: 'anteriorThigh',
    name: 'Cara anterior del muslo',
    supply: [s('femoral', ['L2', 'L3'], 1)],
  },
  {
    id: 'medialThigh',
    name: 'Cara interna del muslo',
    supply: [s('obturator', ['L2', 'L3'], 1)],
  },
  {
    id: 'medialLeg',
    name: 'Cara interna de la pierna y del pie (safeno interno)',
    supply: [s('femoral', ['L3', 'L4'], 2)],
  },
  {
    id: 'posteriorThigh',
    name: 'Cara posterior del muslo',
    supply: [s('posteriorFemoralCutaneous', ['S1', 'S2', 'S3'], 0.5)],
  },
  {
    id: 'anterolateralLeg',
    name: 'Cara anteroexterna de la pierna y dorso del pie',
    supply: [s('peroneal', ['L4', 'L5', 'S1'], 3)],
  },
  {
    id: 'lateralFoot',
    name: 'Borde externo del pie (safeno externo)',
    supply: [s('tibial', ['S1', 'S2'], 2)],
  },
  {
    id: 'sole',
    name: 'Planta del pie',
    supply: [s('tibial', ['S1', 'S2'], 4)],
  },
  {
    id: 'saddle',
    name: 'Periné, ano y genitales (en silla de montar)',
    supply: [s('pudendal', ['S2', 'S3', 'S4'], 0.5)],
  },
]

const LUMBOSACRAL_REFLEXES: Reflex[] = [
  // Moore p. 718: the femoral nerve and L2–L4.
  {
    id: 'patellar',
    name: 'Rotuliano',
    muscle: 'quadriceps',
    roots: ['L2', 'L3', 'L4'],
  },
  // Moore p. 766: S1 and S2; without S1 it is practically absent.
  {
    id: 'achilles',
    name: 'Aquíleo',
    muscle: 'tricepsSurae',
    roots: ['S1', 'S2'],
    main: 'S1',
  },
]

const LUMBOSACRAL_SIGNS: Sign[] = [
  {
    id: 'quadriceps',
    name: 'Rodilla que cede',
    text: 'La rodilla no se extiende contra la gravedad: se dobla al apoyar el pie y no puede subir escalones.',
    when: (o) => lost(o, 'quadriceps'),
  },
  {
    id: 'trendelenburg',
    name: 'Signo de Trendelenburg',
    text: 'Al apoyarse en esa pierna, la pelvis cae del lado contrario: los glúteos mediano y menor ya no la sostienen, y la marcha se balancea.',
    when: (o) => lost(o, 'gluteusMed'),
  },
  {
    id: 'footDrop',
    name: 'Pie caído',
    text: 'La punta del pie cae y roza el suelo: el enfermo levanta la rodilla al andar (marcha en steppage). El tibial anterior y los extensores están paralizados.',
    when: (o) => lost(o, 'tibialisAnterior', 'edl', 'ehl'),
  },
  {
    id: 'tiptoe',
    name: 'No se pone de puntillas',
    text: 'Sin tríceps sural, el pie no hace la flexión plantar: el talón no se despega del suelo al dar el paso.',
    when: (o) => lost(o, 'tricepsSurae'),
  },
  {
    id: 'sphincters',
    name: 'Esfínteres y silla de montar',
    text: 'Anestesia del periné, el ano y los genitales y esfínteres paralizados: las raíces sacras bajas van juntas por la cola de caballo.',
    when: (o) => lost(o, 'perineal') && o.skin.get('saddle') === 'lost',
  },
]

const LUMBOSACRAL_LESIONS: Lesion[] = [
  {
    id: 'l4',
    name: 'Raíz L4',
    nodes: ['L4'],
    cause: 'Una hernia del disco entre L3 y L4, que comprime la raíz que sale por debajo.',
  },
  {
    id: 'l5',
    name: 'Raíz L5',
    nodes: ['L5'],
    cause: 'Una hernia del disco entre L4 y L5: la quinta raíz, la más larga y gruesa, corre en el desfiladero más estrecho.',
  },
  {
    id: 's1',
    name: 'Raíz S1',
    nodes: ['S1'],
    cause: 'Una hernia del disco entre L5 y S1, la ciática más frecuente con la de L5.',
  },
  {
    id: 'cauda',
    name: 'Raíces S2 a S4 (cola de caballo)',
    nodes: ['S2', 'S3', 'S4'],
    cause: 'Un tumor o una hernia grande en el conducto sacro, que toma las raíces bajas de la cola de caballo.',
  },
  {
    id: 'femoral',
    name: 'Crural bajo el arco',
    nodes: ['femoral'],
    at: 0.5,
    cause: 'Una herida de la ingle o un hematoma del psoas ilíaco, sobre el que el nervio corre hasta el arco crural.',
  },
  {
    id: 'obturator',
    name: 'Obturador',
    nodes: ['obturator'],
    cause: 'Un parto difícil o la cirugía de la pelvis, cuya pared lateral recorre el nervio.',
  },
  {
    id: 'superiorGluteal',
    name: 'Glúteo superior',
    nodes: ['superiorGluteal'],
    cause: 'Una inyección mal puesta en la nalga, o la cirugía de la cadera.',
  },
  {
    id: 'sciatic',
    name: 'Ciático en la nalga',
    nodes: ['tibial', 'peroneal'],
    at: 0.6,
    cause: 'Una inyección en la nalga, la luxación posterior de la cadera o una herida: el nervio baja entre el isquion y el trocánter.',
  },
  {
    id: 'peroneal',
    name: 'Ciático poplíteo externo en el cuello del peroné',
    nodes: ['peroneal'],
    at: 2.5,
    cause: 'Un golpe o la fractura del cuello del peroné, alrededor del cual el nervio se enrolla bajo la piel, o un yeso apretado.',
  },
  {
    id: 'tibial',
    name: 'Ciático poplíteo interno en el hueco poplíteo',
    nodes: ['tibial'],
    at: 1.8,
    cause: 'Una herida profunda o la luxación de la rodilla.',
  },
]

// Moore 8.ª p. 698 (fig. 7-18); Testut pp. 226–227 after Déjerine.
const DERMATOMES_LL: Record<string, string> = {
  L1: 'la ingle',
  L2: 'la parte alta del muslo por delante',
  L3: 'la parte baja del muslo y la rodilla',
  L4: 'la cara interna de la pierna',
  L5: 'la cara externa de la pierna, el dorso del pie y el dedo gordo',
  S1: 'el borde externo y la planta del pie',
  S2: 'la cara posterior del muslo y de la pierna',
  S3: 'el periné, en herradura sobre el sacro',
  S4: 'el ano y el periné',
}

export const LUMBOSACRAL: Plexus = {
  id: 'lumbosacral',
  caption: 'Lámina XXIII · Las parálisis de los plexos lumbar y sacro',
  roots: ROOTS_LL,
  nodes: LUMBOSACRAL_NODES,
  muscles: LUMBOSACRAL_MUSCLES,
  skin: LUMBOSACRAL_SKIN,
  reflexes: LUMBOSACRAL_REFLEXES,
  signs: LUMBOSACRAL_SIGNS,
  lesions: LUMBOSACRAL_LESIONS,
  dermatomes: DERMATOMES_LL,
  levels: [
    { at: 0, name: 'pelvis' },
    { at: 0.5, name: 'nalga' },
    { at: 1, name: 'muslo' },
    { at: 2, name: 'rodilla' },
    { at: 3, name: 'pierna' },
    { at: 4, name: 'pie' },
  ],
}

export const PLEXUSES = { brachial: BRACHIAL, lumbosacral: LUMBOSACRAL }

// ---------------------------------------------------------------------------------------------------------------
// The engine.
// ---------------------------------------------------------------------------------------------------------------

const byId = (p: Plexus) => new Map(p.nodes.map((n) => [n.id, n]))

/**
 * Does a fibre from `root` still reach the branch that leaves `nerve` at `at`? It climbs from the branch to the
 * root through the nodes' parents; a cut node blocks it, unless the cut is along that nerve beyond where the fibre
 * leaves it (then the fibre left before the cut).
 */
export function reaches(p: Plexus, root: string, nerve: string, at: number, lesion: Lesion | null): boolean {
  const nodes = byId(p)
  const blocked = (id: string, exit: number) => !!lesion && lesion.nodes.includes(id) && (lesion.at === undefined || exit >= lesion.at)
  const climb = (id: string, exit: number, seen: Set<string>): boolean => {
    if (blocked(id, exit)) return false
    if (id === root) return true
    const node = nodes.get(id)
    if (!node || seen.has(id)) return false
    seen.add(id)
    return node.from.some((parent) => climb(parent, node.branch ?? 0, seen))
  }
  return climb(nerve, at, new Set())
}

/** How many of a structure's fibres survive, out of how many. */
function survive(p: Plexus, supply: Supply[], lesion: Lesion | null): [alive: number, total: number] {
  let alive = 0
  let total = 0
  for (const sup of supply)
    for (const r of sup.roots) {
      total++
      if (reaches(p, r, sup.nerve, sup.at, lesion)) alive++
    }
  return [alive, total]
}

const statusOf = ([alive, total]: [number, number]): Status => (alive === total ? 'ok' : alive === 0 ? 'lost' : 'weak')

export function outcome(p: Plexus, lesion: Lesion): Outcome {
  const muscles = new Map(p.muscles.map((m) => [m.id, statusOf(survive(p, m.supply, lesion))]))
  // Skin is either felt or not: overlapping fibres keep it felt until the last one goes.
  const skin = new Map(p.skin.map((a) => [a.id, survive(p, a.supply, lesion)[0] === 0 ? ('lost' as Status) : ('ok' as Status)]))
  const reflexes = new Map(
    p.reflexes.map((r) => {
      const m = p.muscles.find((x) => x.id === r.muscle)!
      const supply = m.supply.map((sup) => ({
        ...sup,
        roots: sup.roots.filter((x) => r.roots.includes(x)),
      }))
      let st = statusOf(survive(p, supply, lesion))
      if (r.main && !supply.some((sup) => sup.roots.includes(r.main!) && reaches(p, r.main!, sup.nerve, sup.at, lesion))) st = 'lost'
      return [r.id, st]
    }),
  )
  return { lesion, muscles, skin, reflexes }
}

export const signsOf = (p: Plexus, o: Outcome) => p.signs.filter((sg) => sg.when(o))

/** The roots a lesion takes whole: those named in it. */
export const rootsCut = (p: Plexus, lesion: Lesion) => lesion.nodes.filter((n) => p.roots.includes(n))

/** Every fibre that reaches a nerve: the roots it is made of, read off the graph. */
export function rootsOf(p: Plexus, nerve: string): string[] {
  return p.roots.filter((r) => reaches(p, r, nerve, 0, null))
}
