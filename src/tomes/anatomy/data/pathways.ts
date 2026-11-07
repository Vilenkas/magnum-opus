/**
 * The great pathways of the neuraxis followed from end to end (Testut t. II pp. 1114–1137,
 * figs. 931, 938, 942, 943): each one a chain of neurons drawn on a frontal scheme, from the
 * cortex down to the lumbar cord. A lesion is an ellipse on that scheme; every neuron that passes
 * through it is interrupted, and so is the pathway. What a lesion abolishes, and on which side,
 * comes out of where each pathway crosses the midline: no syndrome is written by hand.
 *
 * Coordinates: x is the distance from the midline, positive towards the half of the body the
 * pathway serves (the patient's left, for the pathways as written here); the right half's
 * pathways are the mirror image. y runs downwards, in the plate's viewBox units.
 */

export type Side = 'left' | 'right'
export type Point = readonly [x: number, y: number]

export const opposite = (s: Side): Side => (s === 'left' ? 'right' : 'left')

export type LevelId = 'hemisphere' | 'peduncle' | 'pons' | 'medulla' | 'cervical' | 'thoracic' | 'lumbar'

export interface Level {
  id: LevelId
  name: string
  top: number
  bottom: number
}

export const levels: Level[] = [
  { id: 'hemisphere', name: 'Hemisferio', top: 0, bottom: 140 },
  { id: 'peduncle', name: 'Pedúnculo', top: 140, bottom: 190 },
  { id: 'pons', name: 'Protuberancia', top: 190, bottom: 250 },
  { id: 'medulla', name: 'Bulbo', top: 250, bottom: 320 },
  { id: 'cervical', name: 'Médula cervical', top: 320, bottom: 410 },
  { id: 'thoracic', name: 'Médula dorsal', top: 410, bottom: 470 },
  { id: 'lumbar', name: 'Médula lumbar', top: 470, bottom: 540 },
]

export const levelAt = (y: number) => levels.find((l) => y >= l.top && y < l.bottom)

/** Landmarks of the scheme, on the side of the body served. */
export const SITES = {
  ganglion: [58, 508],
  rootEntry: [34, 505],
  posteriorHorn: [14, 512],
  clarke: [10, 492],
  hornAbove: [12, 486],
  anteriorHorn: [18, 525],
  muscle: [60, 534],
  bulbarNuclei: [6, 302],
  /** In the opposite hemisphere: the pathways of one half of the body end or start there. */
  thalamus: [-30, 115],
  capsule: [-58, 100],
  pallidum: [-72, 122],
  redNucleus: [-12, 160],
  pontineNuclei: [-22, 212],
  sensoryCortex: [-130, 50],
  motorCortex: [-80, 22],
  temporalCortex: [-150, 112],
  /** On the side served: the cerebellar hemisphere and its dentate nucleus. */
  cerebellarCortex: [84, 214],
  vermis: [70, 208],
  dentate: [52, 230],
} as const satisfies Record<string, Point>

const S = SITES

export interface Neuron {
  name: string
  /** Where its axon ends. */
  to: string
  points: Point[]
  /** Drawn, but too few fibres for its loss to show: the direct pyramidal fascicle. */
  minor?: boolean
}

export type PathwayId = 'lemniscal' | 'pain' | 'touch' | 'spinocerebellar' | 'pyramidal' | 'cerebellar' | 'striatal'

export interface Pathway {
  id: PathwayId
  kind: 'sensory' | 'motor'
  name: string
  /** What it carries, or what it commands. */
  carries: string
  /** What its interruption produces. */
  loss: string
  /**
   * Alternative routes: the pathway is lost only when every route is interrupted. Light touch
   * goes up by two, which is why a hemisection of the cord spares it.
   */
  routes: Neuron[][]
  /** Testut's pages. */
  p: string
}

/** The third neuron of every conscious sensory pathway: from the thalamus, by the capsule, to the cortex. */
const thalamocortical: Neuron = {
  name: 'Neurona talamocortical',
  to: 'la circunvolución parietal ascendente',
  points: [S.thalamus, S.capsule, [-100, 70], S.sensoryCortex],
}

const ganglionCell = (to: string, end: Point, via: Point[] = []): Neuron => ({
  name: '1.ª neurona: célula del ganglio raquídeo',
  to,
  points: [S.ganglion, S.rootEntry, ...via, end],
})

const lemniscal: Neuron[] = [
  ganglionCell('los núcleos de Goll y de Burdach, en el bulbo', S.bulbarNuclei, [[6, 496]]),
  {
    name: '2.ª neurona: cinta de Reil media',
    to: 'el núcleo externo del tálamo',
    // The pinniform decussation, in the lower medulla, just above the pyramidal one.
    points: [S.bulbarNuclei, [0, 296], [-8, 290], [-8, 150], S.thalamus],
  },
  thalamocortical,
]

/** The final common path of every motor pathway: the cell of the anterior horn and its root. */
const peripheral: Neuron = {
  name: 'Neurona periférica: célula del asta anterior',
  to: 'los músculos',
  points: [S.anteriorHorn, [44, 530], S.muscle],
}

const rubrospinal: Neuron = {
  name: 'Fibra rubroespinal',
  to: 'el asta anterior de la médula',
  // Crosses at once, in Forel's commissure, and goes down in front of the crossed pyramidal fascicle.
  points: [S.redNucleus, [0, 168], [20, 176], [20, 515], S.anteriorHorn],
}

export const pathways: Pathway[] = [
  {
    id: 'lemniscal',
    kind: 'sensory',
    name: 'Cordones posteriores y cinta de Reil',
    carries: 'Sensibilidad profunda consciente: el sentido de las actitudes y la percepción estereognóstica',
    loss: 'pierde el sentido de las actitudes y del reconocimiento de los objetos',
    routes: [lemniscal],
    p: '1115, 1121',
  },
  {
    id: 'pain',
    kind: 'sensory',
    name: 'Vía del dolor y de la temperatura',
    carries: 'Impresiones dolorosas y térmicas, por las fibras cortas de la raíz',
    loss: 'no siente el dolor ni la temperatura',
    routes: [
      [
        ganglionCell('el asta posterior, en el mismo segmento', S.posteriorHorn),
        {
          name: '2.ª neurona: fascículo anterolateral, segmento posterior',
          to: 'el tálamo, tras escalonarse en la sustancia reticular',
          // Crosses at the level where it enters, in front of the central canal.
          points: [S.posteriorHorn, [0, 506], [-16, 500], [-16, 320], [-13, 280], [-13, 150], S.thalamus],
        },
        thalamocortical,
      ],
    ],
    p: '1115–1118, 1120',
  },
  {
    id: 'touch',
    kind: 'sensory',
    name: 'Vía del tacto',
    carries: 'Tacto superficial, por las fibras medias y también por las largas del cordón de Burdach',
    loss: 'pierde el tacto',
    routes: [
      [
        ganglionCell('la sustancia gris, tres o cuatro segmentos más arriba', S.hornAbove),
        {
          name: '2.ª neurona: fascículo anterolateral, segmento anterior',
          to: 'el tálamo',
          points: [S.hornAbove, [0, 481], [-11, 476], [-11, 150], S.thalamus],
        },
        thalamocortical,
      ],
      lemniscal,
    ],
    p: '1120–1121',
  },
  {
    id: 'spinocerebellar',
    kind: 'sensory',
    name: 'Fascículo cerebeloso directo',
    carries: 'Sensibilidad profunda inconsciente, que va al cerebelo sin cruzarse',
    loss: 'pierde la sensibilidad profunda inconsciente: sus movimientos se desordenan',
    routes: [
      [
        ganglionCell('la columna de Clarke', S.clarke),
        {
          name: '2.ª neurona: fascículo cerebeloso directo',
          to: 'la corteza del vermis, por el pedúnculo cerebeloso inferior',
          points: [S.clarke, [28, 482], [28, 300], [34, 255], S.vermis],
        },
      ],
    ],
    p: '1118',
  },
  {
    id: 'pyramidal',
    kind: 'motor',
    name: 'Vía piramidal',
    carries: 'Los movimientos voluntarios',
    loss: 'queda paralizado',
    routes: [
      [
        {
          name: 'Neurona central: célula de Betz',
          to: 'el asta anterior del lado opuesto',
          // Corona, posterior limb of the capsule, the middle three fifths of the pes, the pyramid,
          // and the decussation at the bottom of the medulla.
          points: [S.motorCortex, [-70, 60], [-58, 92], [-58, 128], [-26, 165], [-22, 220], [-14, 282], [0, 312], [23, 330], [23, 515], S.anteriorHorn],
        },
        {
          name: 'Fascículo piramidal directo',
          to: 'el asta anterior, cruzándose al llegar',
          points: [[-14, 282], [-5, 320], [-5, 510], S.anteriorHorn],
          minor: true,
        },
        peripheral,
      ],
    ],
    p: '1124–1131',
  },
  {
    id: 'cerebellar',
    kind: 'motor',
    name: 'Vía motora cerebelosa',
    carries: 'La coordinación de los movimientos voluntarios, de los miembros y del tronco',
    loss: 'pierde la coordinación de sus movimientos',
    routes: [
      [
        {
          name: '1.ª neurona: fascículo de Türck',
          to: 'los núcleos del puente del mismo lado',
          // From the temporal lobe, under the lenticular nucleus, by the outer fifth of the pes.
          points: [S.temporalCortex, [-110, 128], [-70, 138], [-34, 160], [-32, 178], S.pontineNuclei],
        },
        {
          name: '2.ª neurona: fibra pontocerebelosa',
          to: 'la corteza del hemisferio cerebeloso opuesto',
          points: [S.pontineNuclei, [0, 218], [40, 222], S.cerebellarCortex],
        },
        {
          name: '3.ª neurona: de la corteza cerebelosa',
          to: 'el núcleo dentado del mismo lado',
          points: [S.cerebellarCortex, S.dentate],
        },
        {
          name: '4.ª neurona: fibra olivorrúbrica',
          to: 'el núcleo rojo opuesto, cruzando en la decusación de Wernekink',
          points: [S.dentate, [30, 206], [0, 188], S.redNucleus],
        },
        rubrospinal,
        peripheral,
      ],
    ],
    p: '1132–1134',
  },
  {
    id: 'striatal',
    kind: 'motor',
    name: 'Vía estrioespinal',
    carries: 'Los movimientos automáticos y asociados, y el tono muscular',
    loss: 'pierde el automatismo y el tono: aparecen movimientos involuntarios',
    routes: [
      [
        {
          name: 'Fibra palidorrúbrica',
          to: 'el núcleo rojo, por el asa lenticular',
          points: [S.pallidum, [-50, 140], S.redNucleus],
        },
        rubrospinal,
        peripheral,
      ],
    ],
    p: '1134–1136',
  },
]

/** A lesion, drawn on the patient's left (x ≥ 0); on the right it is the mirror image. */
export interface Lesion {
  id: string
  name: string
  level: LevelId
  cx: number
  cy: number
  rx: number
  ry: number
  syndrome: string
  text: string
  p: string
}

export const lesions: Lesion[] = [
  {
    id: 'cortex',
    name: 'Frontal ascendente',
    level: 'hemisphere',
    cx: 80,
    cy: 22,
    rx: 14,
    ry: 12,
    syndrome: 'Parálisis cortical',
    text: 'La destrucción de la zona motora paraliza el lado opuesto, más o menos según su extensión. La motilidad vuelve poco a poco: primero los movimientos simples y groseros; los finos, los que piden habilidad y aprendizaje, como los de la mano, tardan más o no vuelven nunca.',
    p: '1131',
  },
  {
    id: 'capsule',
    name: 'Cápsula interna',
    level: 'hemisphere',
    cx: 58,
    cy: 105,
    rx: 7,
    ry: 16,
    syndrome: 'Hemiplejía y hemianestesia cruzadas',
    text: 'En el brazo posterior de la cápsula, las fibras que suben del tálamo a la corteza van mezcladas con las piramidales: la lesión paraliza y anestesia a la vez toda la mitad opuesta del cuerpo. La anestesia alcanza a todas las modalidades, pero es pasajera mientras el tálamo esté sano.',
    p: '1123',
  },
  {
    id: 'thalamus',
    name: 'Tálamo',
    level: 'hemisphere',
    cx: 30,
    cy: 112,
    rx: 12,
    ry: 10,
    syndrome: 'Síndrome talámico de Dejerine y Roussy',
    text: 'Todas las vías de la sensibilidad consciente se detienen en el núcleo externo del tálamo: su lesión deja una hemianestesia persistente del lado opuesto, con dolores violentos. Si hay hemiplejía, es ligera y pasajera, y no la causa el tálamo, sino la vecindad de la cápsula.',
    p: '1122',
  },
  {
    id: 'peduncle',
    name: 'Pie del pedúnculo',
    level: 'peduncle',
    cx: 28,
    cy: 165,
    rx: 8,
    ry: 12,
    syndrome: 'Hemiplejía peduncular',
    text: 'Por los tres quintos medios del pie pasa el fascículo piramidal, por el quinto externo el de Türck, primera neurona de la vía cerebelosa; la cinta de Reil va detrás, en la calota. Una lesión limitada al pie paraliza el lado opuesto sin anestesiarlo.',
    p: '1126, 1132',
  },
  {
    id: 'cerebellum',
    name: 'Hemisferio cerebeloso',
    level: 'pons',
    cx: 78,
    cy: 222,
    rx: 30,
    ry: 22,
    syndrome: 'Lesión cerebelosa homolateral',
    text: 'La vía motora cerebelosa se cruza en el puente y otra vez en la decusación de Wernekink antes de que el núcleo rojo la envíe, cruzada por tercera vez, a la médula: vuelve así al lado del hemisferio cerebeloso del que partió. Cada mitad del cerebelo gobierna su propio lado del cuerpo, y su lesión desordena los movimientos de ese lado.',
    p: '1133',
  },
  {
    id: 'hemisection',
    name: 'Hemisección cervical',
    level: 'cervical',
    cx: 15,
    cy: 360,
    rx: 15,
    ry: 6,
    syndrome: 'Síndrome de Brown-Séquard',
    text: 'Del lado de la lesión, el miembro se paraliza y pierde la sensibilidad profunda, porque la vía piramidal ya se ha cruzado y la de los cordones posteriores aún no; del lado opuesto se pierden el dolor y la temperatura, que se cruzaron al entrar. El tacto se conserva en los dos lados: sube por dos vías, una de cada lado.',
    p: '1121',
  },
  {
    id: 'anterolateral',
    name: 'Cordón anterolateral',
    level: 'cervical',
    cx: 16,
    cy: 360,
    rx: 3,
    ry: 6,
    syndrome: 'Anestesia cruzada al dolor y a la temperatura',
    text: 'El segmento posterior del fascículo anterolateral lleva el dolor y la temperatura del otro lado, cruzados ya en la médula. Su lesión los suprime en la mitad opuesta, con un límite superior dos a cuatro segmentos por debajo de ella, lo que tardan las fibras en cruzar.',
    p: '1121',
  },
  {
    id: 'posteriorHorn',
    name: 'Asta posterior',
    level: 'lumbar',
    cx: 14,
    cy: 512,
    rx: 5,
    ry: 5,
    syndrome: 'Anestesia radicular homolateral',
    text: 'En el asta posterior terminan, en su mismo segmento, las fibras cortas de la raíz, las del dolor y la temperatura. Su lesión los suprime del mismo lado, en el territorio de las raíces lesionadas; las fibras largas, que suben por el cordón posterior sin detenerse, quedan a salvo.',
    p: '1121',
  },
  {
    id: 'commissure',
    name: 'Comisura gris',
    level: 'lumbar',
    cx: 0,
    cy: 505,
    rx: 5,
    ry: 5,
    syndrome: 'Disociación siringomiélica',
    text: 'Las fibras del dolor y de la temperatura se cruzan en el segmento por el que entran, delante del conducto central. Una lesión pequeña en torno a él, como la cavidad de la siringomielia, las corta en los dos lados y respeta el tacto y la sensibilidad profunda, que suben por otros caminos: la sensibilidad queda disociada.',
    p: '1120',
  },
]

const mirror = (pts: readonly Point[]): Point[] => pts.map(([x, y]) => [-x, y])

/** A pathway's points for one half of the body. */
export const pointsFor = (n: Neuron, body: Side): Point[] => (body === 'left' ? [...n.points] : mirror(n.points))

function inside(l: Lesion, side: Side, [x, y]: Point) {
  const cx = side === 'left' ? l.cx : -l.cx
  return ((x - cx) / l.rx) ** 2 + ((y - l.cy) / l.ry) ** 2 <= 1
}

/** Whether a neuron, in the half of the body it serves, passes through the lesion. */
export function crosses(n: Neuron, body: Side, l: Lesion, side: Side) {
  const pts = pointsFor(n, body)
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

/** A route is lost when one of its neurons that counts is interrupted. */
const routeLost = (route: Neuron[], body: Side, l: Lesion, side: Side) => route.some((n) => !n.minor && crosses(n, body, l, side))

/** Whether a lesion abolishes a pathway in one half of the body: every route must be lost. */
export const lost = (p: Pathway, body: Side, l: Lesion, side: Side) => p.routes.every((r) => routeLost(r, body, l, side))

/** For each pathway, the halves of the body in which a lesion abolishes it. */
export function deficits(l: Lesion | null, side: Side): Record<PathwayId, Side[]> {
  return Object.fromEntries(
    pathways.map((p) => [p.id, l ? (['left', 'right'] as const).filter((b) => lost(p, b, l, side)) : []]),
  ) as Record<PathwayId, Side[]>
}

/** How many times a chain of neurons crosses the midline. */
export function crossings(route: Neuron[]) {
  const xs = route.filter((n) => !n.minor).flatMap((n) => n.points.map(([x]) => x)).filter((x) => x !== 0)
  let count = 0
  for (let i = 1; i < xs.length; i++) if (Math.sign(xs[i]) !== Math.sign(xs[i - 1])) count++
  return count
}

/** The heights at which a chain crosses the midline, from its first neuron to its last. */
export function crossingHeights(route: Neuron[]) {
  return route.filter((n) => !n.minor).flatMap((n) => n.points.filter(([x]) => x === 0).map(([, y]) => y))
}
