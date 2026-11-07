/**
 * The midbrain in two sections (Testut t. II pp. 858–891; figs. 719, 721, 741 and 742): through the
 * anterior (superior) colliculus, with the oculomotor nucleus and the red nucleus, and through the
 * posterior (inferior) colliculus, with the trochlear nucleus and the decussation of the superior
 * cerebellar peduncles. Each section has three floors: the tectum (the colliculi), the tegmentum
 * (calota) and, beyond the substantia nigra, the base (pie), divided in three segments.
 *
 * Geometry in the plate's viewBox, dorsal side up, midline x = 200. Paired structures are given
 * for the right half (dx from the midline); median ones have dx = 0. The pes and the nigra are arcs
 * of a ring centred on PES_CENTRE, angle 0 pointing ventrally.
 */

export type LevelId = 'superior' | 'inferior'

export interface Level {
  id: LevelId
  name: string
  /** The colliculus the section passes through. */
  colliculus: string
}

export const levels: Level[] = [
  { id: 'superior', name: 'Por el tubérculo anterior', colliculus: 'tubérculo cuadrigémino anterior' },
  { id: 'inferior', name: 'Por el tubérculo posterior', colliculus: 'tubérculo cuadrigémino posterior' },
]

/** The outline of the section, an ellipse. */
export const OUTLINE = { cx: 200, cy: 140, rx: 125, ry: 105 }
export const PES_CENTRE = { x: 200, y: 118 }
/** Radii and angles (degrees) of the ring: the substantia nigra inside, the pes outside. */
export const NIGRA = { r0: 76, r1: 86 }
export const PES = { r0: 88, r1: 118 }
export const ARC = { from: 8, to: 76 }

export type Floor = 'tectum' | 'tegmentum' | 'base'

export interface Structure {
  id: string
  name: string
  modern?: string
  floor: Floor
  levels: LevelId[]
  /** Ellipse for the right half; dx = 0 is a median structure, drawn once. */
  dx: number
  cy: number
  rx: number
  ry: number
  description: string
}

export const structures: Structure[] = [
  {
    id: 'anterior-colliculus',
    name: 'Tubérculo cuadrigémino anterior',
    modern: 'colículo superior',
    floor: 'tectum',
    levels: ['superior'],
    dx: 26,
    cy: 54,
    rx: 25,
    ry: 19,
    description:
      'Un ovoide grisáceo de 10 a 12 mm de largo por 7 u 8 de ancho. Recibe fibras de la cintilla óptica y envía otras a los núcleos motores del ojo y a la médula: es un centro de reflejos visuales, no de la visión consciente.',
  },
  {
    id: 'posterior-colliculus',
    name: 'Tubérculo cuadrigémino posterior',
    modern: 'colículo inferior',
    floor: 'tectum',
    levels: ['inferior'],
    dx: 24,
    cy: 56,
    rx: 21,
    ry: 16,
    description:
      'Más pequeño, de 8 por 6 mm, casi hemisférico y de un gris más claro. En él termina la cinta de Reil lateral, la vía acústica central: es un centro de reflejos auditivos.',
  },
  {
    id: 'grey',
    name: 'Sustancia gris central',
    modern: 'sustancia gris periacueductal',
    floor: 'tegmentum',
    levels: ['superior', 'inferior'],
    dx: 0,
    cy: 92,
    rx: 24,
    ry: 22,
    description: 'Una capa espesa de sustancia gris alrededor del acueducto, que continúa la del suelo del cuarto ventrículo y la del tercero; contiene los núcleos del motor ocular común y del patético.',
  },
  {
    id: 'aqueduct',
    name: 'Acueducto de Silvio',
    modern: 'acueducto mesencefálico',
    floor: 'tegmentum',
    levels: ['superior', 'inferior'],
    dx: 0,
    cy: 90,
    rx: 5,
    ry: 6,
    description: 'Un conducto de unos 15 mm de largo y 1 o 2 de ancho que une el cuarto ventrículo con el tercero. Su luz cambia de forma con la altura: triangular, en corazón de naipe, en rombo.',
  },
  {
    id: 'oculomotor',
    name: 'Núcleo del motor ocular común',
    floor: 'tegmentum',
    levels: ['superior'],
    dx: 9,
    cy: 117,
    rx: 7,
    ry: 5,
    description: 'Una columna de células en la parte central de la sustancia gris, delante del acueducto. Sus raíces atraviesan la cintilla longitudinal posterior, la calota y el núcleo rojo, y salen por el surco del motor ocular común.',
  },
  {
    id: 'trochlear',
    name: 'Núcleo del patético',
    floor: 'tegmentum',
    levels: ['inferior'],
    dx: 10,
    cy: 116,
    rx: 6,
    ry: 4,
    description: 'Detrás del núcleo del motor ocular común, en la parte ventral de la sustancia gris. Sus fibras dan un rodeo en herradura hacia atrás y se cruzan por completo en la válvula de Vieussens antes de salir: es el único nervio craneal que sale por la cara dorsal.',
  },
  {
    id: 'mlf',
    name: 'Cintilla longitudinal posterior',
    modern: 'fascículo longitudinal medial',
    floor: 'tegmentum',
    levels: ['superior', 'inferior'],
    dx: 15,
    cy: 128,
    rx: 6,
    ry: 4,
    description: 'El haz de asociación que une los núcleos de los nervios motores del ojo; en el pedúnculo forma un ángulo abierto hacia atrás que aloja el núcleo del motor ocular común.',
  },
  {
    id: 'red-nucleus',
    name: 'Núcleo rojo',
    floor: 'tegmentum',
    levels: ['superior'],
    dx: 30,
    cy: 166,
    rx: 16,
    ry: 15,
    description:
      'Una columna rosada de 6 a 7 mm de diámetro en la parte anterior de la calota, rodeada de una cápsula de fibras del pedúnculo cerebeloso superior. Recibe la vía del cerebelo y envía el fascículo rubroespinal: un centro de la regulación del tono, de las vías motoras extrapiramidales.',
  },
  {
    id: 'meynert',
    name: 'Decusación de Meynert',
    modern: 'decusación tegmental dorsal',
    floor: 'tegmentum',
    levels: ['superior'],
    dx: 0,
    cy: 142,
    rx: 10,
    ry: 5,
    description: 'La decusación en fuente: el entrecruzamiento de las fibras tectoespinales y tectobulbares que nacen en el tubérculo cuadrigémino anterior.',
  },
  {
    id: 'forel',
    name: 'Decusación de Forel',
    modern: 'decusación tegmental ventral',
    floor: 'tegmentum',
    levels: ['superior'],
    dx: 0,
    cy: 182,
    rx: 10,
    ry: 5,
    description: 'El entrecruzamiento de los fascículos rubroespinales, que bajan desde el núcleo rojo por el lado opuesto.',
  },
  {
    id: 'wernekink',
    name: 'Decusación de Wernekink',
    modern: 'decusación de los pedúnculos cerebelosos superiores',
    floor: 'tegmentum',
    levels: ['inferior'],
    dx: 0,
    cy: 162,
    rx: 30,
    ry: 13,
    description: 'Los dos pedúnculos cerebelosos superiores se cruzan en la línea media, en herradura, y van al núcleo rojo del lado opuesto. A esta altura el núcleo rojo todavía no aparece: en su lugar está el núcleo blanco de Stilling, el pedúnculo mismo.',
  },
  {
    id: 'medial-lemniscus',
    name: 'Cinta de Reil media',
    modern: 'lemnisco medial',
    floor: 'tegmentum',
    levels: ['superior', 'inferior'],
    dx: 52,
    cy: 146,
    rx: 12,
    ry: 8,
    description: 'La vía sensitiva principal, nacida en los núcleos de Goll y de Burdach y cruzada en el bulbo, que va al tálamo. En el pedúnculo se sitúa detrás del locus niger y se aleja del rafe.',
  },
  {
    id: 'lateral-lemniscus',
    name: 'Cinta de Reil lateral',
    modern: 'lemnisco lateral',
    floor: 'tegmentum',
    levels: ['inferior'],
    dx: 70,
    cy: 104,
    rx: 10,
    ry: 14,
    description: 'La vía acústica central, que se hace superficial en el surco lateral del istmo y termina en el tubérculo cuadrigémino posterior, y de allí en el cuerpo geniculado interno.',
  },
]

/** The substantia nigra: the frontier between the tegmentum and the base. */
export const nigra = {
  id: 'nigra',
  name: 'Locus niger',
  modern: 'sustancia negra',
  description:
    'Una banda negruzca en forma de media luna, de concavidad posterior, que separa la calota del pie a todo lo largo del mesencéfalo. Sus conexiones con la corteza y el cuerpo estriado hacen de él un centro motor de la vía extrapiramidal.',
}

export interface PesSegment {
  id: string
  name: string
  /** Fraction of the pes, from the midline outwards. */
  share: number
  description: string
}

/** The pes in three segments, as Testut describes them (pp. 877–878). */
export const pesTestut: PesSegment[] = [
  { id: 'geniculate', name: 'Fascículo geniculado', share: 1 / 5, description: 'El quinto interno: las fibras corticonucleares, que van a los núcleos motores de los nervios craneales. Pasan por la rodilla de la cápsula interna, de ahí su nombre.' },
  { id: 'pyramidal', name: 'Vía piramidal', share: 3 / 5, description: 'Los tres quintos medios: la vía motora voluntaria, nacida en la circunvolución frontal ascendente, que forma más abajo los fascículos piramidales directo y cruzado.' },
  { id: 'turck', name: 'Fascículo de Türck', share: 1 / 5, description: 'El quinto externo: fibras temporopontinas, de las circunvoluciones temporales a los núcleos del puente. Es la primera neurona de la vía corticopontocerebelosa.' },
]

/** The same pes as it is described today. */
export const pesToday: PesSegment[] = [
  { id: 'frontopontine', name: 'Fibras frontopontinas', share: 1 / 5, description: 'El quinto medial lo ocupan hoy fibras corticopontinas del lóbulo frontal, que van a los núcleos del puente.' },
  { id: 'corticospinal', name: 'Fibras corticoespinales y corticonucleares', share: 3 / 5, description: 'Los tres quintos medios contienen las dos vías motoras voluntarias: las corticonucleares, por dentro, y las corticoespinales, ordenadas de dentro afuera según la cabeza, el miembro superior y el inferior.' },
  { id: 'parietotemporopontine', name: 'Fibras parietotemporopontinas', share: 1 / 5, description: 'El quinto lateral: fibras corticopontinas de los lóbulos parietal, temporal y occipital. Corresponde al fascículo de Türck.' },
]

/**
 * Testut's mnemonic (fig. 735), AEPI: the anterior colliculus is joined to the external geniculate
 * body, the posterior to the internal one.
 */
export const colliculusLinks = [
  { colliculus: 'anterior-colliculus', geniculate: 'cuerpo geniculado externo', sense: 'visión' },
  { colliculus: 'posterior-colliculus', geniculate: 'cuerpo geniculado interno', sense: 'audición' },
] as const

export const at = (level: LevelId) => structures.filter((s) => s.levels.includes(level))

/** Point of the pes/nigra ring at angle (degrees, 0 ventral) and radius, on the right half. */
export function ring(angle: number, r: number): [number, number] {
  const a = (angle * Math.PI) / 180
  return [PES_CENTRE.x + r * Math.sin(a), PES_CENTRE.y + r * Math.cos(a)]
}

/** Angular limits of each pes segment, from the midline (ARC.from) outwards (ARC.to). */
export function pesAngles(segments: PesSegment[]) {
  let a = ARC.from
  return segments.map((s) => {
    const from = a
    a += s.share * (ARC.to - ARC.from)
    return { ...s, from, to: a }
  })
}
