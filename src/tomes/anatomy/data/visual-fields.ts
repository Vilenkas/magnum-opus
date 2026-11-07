/**
 * The optic pathway and the visual field defects its lesions leave (Testut t. II pp. 1158–1177,
 * figs. 964, 965, 975). The fibres of each retina are grouped in four bundles, one per quadrant;
 * each bundle is a chain of two neurons drawn on the base of the brain seen from above: the
 * ganglion cell of the retina, from the eye to the lateral geniculate body, and the geniculocalcarine
 * neuron, from there to the calcarine fissure. A lesion is an ellipse on that drawing, as in the
 * plate of the great pathways: which part of the field goes blind follows only from where the
 * bundles run. Nothing is written by hand.
 *
 * Coordinates: x is the distance from the midline, negative towards the patient's left (seen from
 * above, the left is on the viewer's left); y runs backwards, from the eyes to the occipital pole.
 */

export type Side = 'left' | 'right'
export type Half = 'nasal' | 'temporal'
export type Vertical = 'upper' | 'lower'
export type Point = readonly [x: number, y: number]

export const opposite = (s: Side): Side => (s === 'left' ? 'right' : 'left')
const sign = (s: Side) => (s === 'left' ? -1 : 1)
const flip = (v: Vertical): Vertical => (v === 'upper' ? 'lower' : 'upper')

/** A quarter of one retina. */
export interface Quadrant {
  eye: Side
  half: Half
  vertical: Vertical
}

export interface Neuron {
  name: string
  points: Point[]
}

export interface Bundle extends Quadrant {
  id: string
  neurons: [Neuron, Neuron]
}

export const EYE = { x: 80, y: 38, r: 24 } as const
export const CHIASM_Y = 142
export const GENICULATE = { x: 62, y: 232 } as const

/** The hemisphere a bundle's fibres end in: the temporal half of a retina stays on its side, the nasal crosses. */
export const hemisphereOf = (q: Quadrant): Side => (q.half === 'temporal' ? q.eye : opposite(q.eye))

/**
 * Where a quadrant of the retina looks: the eye's optics invert the image, so the nasal half of the
 * retina sees the temporal half of the field, on the eye's own side of space, and the upper retina
 * sees the lower field.
 */
export const fieldOf = (q: Quadrant): { eye: Side; side: Side; vertical: Vertical } => ({
  eye: q.eye,
  side: q.half === 'nasal' ? q.eye : opposite(q.eye),
  vertical: flip(q.vertical),
})

function bundle(eye: Side, half: Half, vertical: Vertical): Bundle {
  const s = sign(eye)
  const b = sign(hemisphereOf({ eye, half, vertical }))
  // Lanes inside the nerve, positive outwards: the temporal fibres lie lateral.
  const k = { temporal: { upper: 4.5, lower: 1.5 }, nasal: { upper: -1.5, lower: -4.5 } }[half][vertical]
  // Lanes in the tract and radiations: the upper retina medial, the lower lateral.
  const t = { upper: { temporal: -4.5, nasal: -1.5 }, lower: { temporal: 1.5, nasal: 4.5 } }[vertical][half]
  const retinal: Point[] = [
    [s * (EYE.x + k), EYE.y + EYE.r + 2],
    [s * (24 + k * 0.8), 126],
    // The chiasm: the nasal fibres cross the midline, the temporal ones go straight on.
    [b * (24 + t * 0.8), 158],
    [b * (GENICULATE.x + t), GENICULATE.y],
  ]
  const radiation: Point[] =
    vertical === 'upper'
      ? // Dorsal bundle: straight back to the upper lip of the calcarine fissure.
        [[b * (GENICULATE.x + t), GENICULATE.y], [b * (84 + t * 0.8), 300], [b * (62 + t * 0.6), 395], [b * (28 + t * 0.4), 418]]
      : // Ventral bundle: forwards and outwards round the temporal horn first (Meyer's loop), to the lower lip.
        [[b * (GENICULATE.x + t), GENICULATE.y], [b * (112 + t), 206], [b * (140 + t), 250], [b * (124 + t), 350], [b * (48 + t * 0.4), 444]]
  return {
    id: `${eye}-${half}-${vertical}`,
    eye,
    half,
    vertical,
    neurons: [
      { name: 'Célula ganglionar de la retina', points: retinal },
      { name: 'Neurona geniculocalcarina', points: radiation },
    ],
  }
}

export const bundles: Bundle[] = (['right', 'left'] as const).flatMap((eye) =>
  (['temporal', 'nasal'] as const).flatMap((half) => (['upper', 'lower'] as const).map((v) => bundle(eye, half, v))),
)

/** A lesion, drawn on the patient's right (x ≥ 0); on the left it is the mirror image. */
export interface Lesion {
  id: string
  name: string
  cx: number
  cy: number
  rx: number
  ry: number
  defect: string
  text: string
  p: string
}

export const lesions: Lesion[] = [
  {
    id: 'nerve',
    name: 'Nervio óptico',
    cx: 52,
    cy: 95,
    rx: 12,
    ry: 12,
    defect: 'Ceguera de un ojo',
    text: 'Antes del quiasma, el nervio lleva todas las fibras de su ojo y sólo ellas: su destrucción ciega ese ojo por completo y deja intacto el otro.',
    p: '1176',
  },
  {
    id: 'chiasm',
    name: 'Centro del quiasma',
    cx: 0,
    cy: CHIASM_Y,
    rx: 7,
    ry: 10,
    defect: 'Hemianopsia bitemporal',
    text: 'En el centro del quiasma sólo pasan las fibras que se cruzan, las de las mitades nasales de las dos retinas, que miran hacia fuera. Si una lesión las interrumpe ahí, se pierden las dos mitades temporales del campo visual: el enfermo ve como entre anteojeras.',
    p: '1160–1163, 1176',
  },
  {
    id: 'tract',
    name: 'Cintilla óptica',
    cx: 43,
    cy: 195,
    rx: 11,
    ry: 9,
    defect: 'Hemianopsia homónima',
    text: 'Después del quiasma, cada cintilla lleva las fibras de dos mitades homónimas de las retinas, la temporal de su ojo y la nasal del otro, que miran ambas al lado opuesto del espacio. Su lesión suprime la mitad opuesta del campo visual en los dos ojos.',
    p: '1176',
  },
  {
    id: 'meyer',
    name: 'Asa de Meyer',
    cx: 140,
    cy: 250,
    rx: 10,
    ry: 14,
    defect: 'Cuadrantanopsia superior',
    text: 'Las fibras de las mitades inferiores de las retinas dan un rodeo hacia delante, en el lóbulo temporal, alrededor del cuerno esfenoidal del ventrículo: es la desviación de Meyer. Una lesión del lóbulo temporal puede alcanzarlas solas, y entonces borra el cuadrante superior del lado opuesto en los dos ojos.',
    p: '1171, fig. 975',
  },
  {
    id: 'dorsal',
    name: 'Fascículo dorsal',
    cx: 84,
    cy: 300,
    rx: 9,
    ry: 10,
    defect: 'Cuadrantanopsia inferior',
    text: 'El fascículo dorsal de las radiaciones lleva las mitades superiores de las retinas directamente hacia atrás, al labio superior de la cisura calcarina. Su lesión borra el cuadrante inferior del lado opuesto en los dos ojos.',
    p: '1171, fig. 975',
  },
  {
    id: 'calcarine',
    name: 'Cisura calcarina',
    cx: 38,
    cy: 432,
    rx: 22,
    ry: 20,
    defect: 'Hemianopsia homónima cortical',
    text: 'La destrucción del área calcarina de un lado anestesia las dos mitades homónimas de las retinas y borra la mitad opuesta del campo en los dos ojos. Destruidas las dos, la ceguera es cortical, y tan completa que el enfermo a menudo la ignora: no le queda nada con qué comparar.',
    p: '1176',
  },
  {
    id: 'cuneus',
    name: 'Labio superior',
    cx: 28,
    cy: 416,
    rx: 7,
    ry: 6,
    defect: 'Cuadrantanopsia inferior',
    text: 'El cuadrante superior de cada retina se proyecta en el labio superior de la cisura calcarina, en el cúneus; el inferior, en el labio inferior, en el lobulillo lingual. La lesión de un labio borra el cuadrante del campo opuesto en lado y en altura: el inferior, si es el superior.',
    p: '1172, 1176',
  },
  {
    id: 'lingual',
    name: 'Labio inferior',
    cx: 48,
    cy: 446,
    rx: 7,
    ry: 6,
    defect: 'Cuadrantanopsia superior',
    text: 'El labio inferior de la cisura calcarina, en el lobulillo lingual, recibe los cuadrantes inferiores de las retinas: su lesión borra el cuadrante superior del campo del lado opuesto en los dos ojos.',
    p: '1172, 1176',
  },
]

function inside(l: Lesion, side: Side, [x, y]: Point) {
  const cx = side === 'right' ? l.cx : -l.cx
  return ((x - cx) / l.rx) ** 2 + ((y - l.cy) / l.ry) ** 2 <= 1
}

/** Whether a neuron passes through the lesion. */
export function crosses(n: Neuron, l: Lesion, side: Side) {
  const pts = n.points
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.5))
    for (let k = 0; k <= steps; k++) {
      const t = k / steps
      if (inside(l, side, [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t])) return true
    }
  }
  return false
}

/** The bundles a lesion interrupts. */
export const cutBundles = (l: Lesion | null, side: Side) => (l ? bundles.filter((b) => b.neurons.some((n) => crosses(n, l, side))) : [])

/** A quarter of one eye's visual field, named as the patient sees it. */
export const fieldKey = (eye: Side, side: Side, vertical: Vertical) => `${eye}-${side}-${vertical}`

/** The quarters of the field, of both eyes, that a lesion blinds. */
export function blindField(l: Lesion | null, side: Side): Set<string> {
  return new Set(
    cutBundles(l, side).map((b) => {
      const f = fieldOf(b)
      return fieldKey(f.eye, f.side, f.vertical)
    }),
  )
}
