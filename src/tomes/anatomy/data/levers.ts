/**
 * The three kinds of lever after Testut–Latarjet (t. I, pp. 760–762, fig. 743),
 * each placed on the skeleton with its three points on real landmarks.
 * Hand-editable. Descriptions are paraphrased, not quoted.
 */

export type LeverPointRole = 'fulcrum' | 'effort' | 'load'

export interface LeverPoint {
  role: LeverPointRole
  /** Landmark id where the point sits. */
  landmark: string
  /** What it is in this lever, Spanish. */
  label: string
}

export interface Lever {
  id: string
  name: string
  aka: string
  /** Order of the three points along the lever, to draw the schematic bar. */
  order: [LeverPointRole, LeverPointRole, LeverPointRole]
  description: string
  example: string
  /** Pieces painted as the lever. */
  pieces: string[]
  points: LeverPoint[]
  view: 'front' | 'side' | 'back'
  page: string
}

export const roleName: Record<LeverPointRole, string> = {
  fulcrum: 'Punto de apoyo',
  effort: 'Potencia',
  load: 'Resistencia',
}

export const roleLetter: Record<LeverPointRole, string> = { fulcrum: 'a', effort: 'p', load: 'r' }

export const levers: Lever[] = [
  {
    id: 'first',
    name: 'Primer género',
    aka: 'Palanca interapoyo',
    order: ['effort', 'fulcrum', 'load'],
    description: 'El punto de apoyo está entre la potencia y la resistencia. Es bastante frecuente en el cuerpo.',
    example:
      'La cabeza, en equilibrio sobre la columna: se apoya en los cóndilos del occipital; su peso tiende a hacerla caer hacia delante, y los músculos de la nuca, que tiran del occipital, la mantienen erguida.',
    pieces: ['occipital-bone', 'atlas-c1', 'mandible'],
    points: [
      { role: 'fulcrum', landmark: 'occipital-condyle--occipital-bone', label: 'Articulación de los cóndilos occipitales con el atlas' },
      { role: 'effort', landmark: 'external-occipital-protuberance--occipital-bone', label: 'Músculos de la nuca, sobre el occipital' },
      { role: 'load', landmark: 'mental-protuberance--mandible', label: 'El peso de la cabeza, que la inclina hacia delante' },
    ],
    view: 'side',
    page: '761',
  },
  {
    id: 'second',
    name: 'Segundo género',
    aka: 'Palanca interresistente',
    order: ['fulcrum', 'load', 'effort'],
    description: 'La resistencia está entre el punto de apoyo y la potencia. Es muy rara en el cuerpo: en el hombre sólo hay un caso.',
    example:
      'Ponerse de puntillas: el pie se apoya en el suelo por las cabezas de los metatarsianos; el sóleo y los gemelos tiran del calcáneo, y el peso del cuerpo cae sobre la articulación del tobillo, entre ambos.',
    pieces: ['calcaneus-r', 'talus-r', 'third-metatarsal-bone-r'],
    points: [
      { role: 'fulcrum', landmark: 'head-of-metatarsal-bone--third-metatarsal-bone-r', label: 'Cabezas de los metatarsianos, en el suelo' },
      { role: 'effort', landmark: 'calcaneal-tuberosity--calcaneus-r', label: 'Sóleo y gemelos, por el tendón de Aquiles' },
      { role: 'load', landmark: 'trochlea-of-talus--talus-r', label: 'El peso del cuerpo, sobre el tobillo' },
    ],
    view: 'side',
    page: '761–762',
  },
  {
    id: 'third',
    name: 'Tercer género',
    aka: 'Palanca interpotente',
    order: ['fulcrum', 'effort', 'load'],
    description:
      'La potencia está entre el punto de apoyo y la resistencia. Es con mucho la más frecuente: la de casi todos los movimientos de flexión y extensión de los miembros.',
    example:
      'Flexionar el antebrazo sobre el brazo: el apoyo está en el codo, la resistencia es el antebrazo y la mano, y la potencia la ejercen el bíceps y el braquial anterior, que se insertan entre ambos.',
    pieces: ['radius-r', 'ulna-r', 'humerus-r', 'third-metacarpal-bone-r'],
    points: [
      { role: 'fulcrum', landmark: 'trochlea-of-humerus--humerus-r', label: 'Articulación del codo' },
      { role: 'effort', landmark: 'radial-tuberosity--radius-r', label: 'Bíceps, sobre la tuberosidad del radio' },
      { role: 'load', landmark: 'head-of-metacarpal-bone--third-metacarpal-bone-r', label: 'El antebrazo y la mano, con lo que sostengan' },
    ],
    view: 'side',
    page: '762',
  },
]
