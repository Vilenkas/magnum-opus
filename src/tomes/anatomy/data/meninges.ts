/**
 * The meninges in a frontal section of the vault (Testut t. III pp. 1–44, figs. 2, 21, 41; Moore 8.ª pp. 880–885).
 *
 * The section is drawn flat-ish: x runs across the head (MID is the midline, where the falx and the superior
 * sagittal sinus are), and every boundary between two layers is a function of x. A bleed opens one interface
 * and pushes everything below it inwards by its own thickness, so its shape and its mass effect come from the
 * same function. Where a bleed may spread follows from where the dura is attached: to the bone at the sutures
 * (Testut p. 6–7), so an extradural clot cannot cross them; to the falx at the midline, so a subdural one stays
 * on its side.
 */

export const MID = 320
export const HALF = 296
export const TOP = 34
/** Base thickness of each layer, outside in (the subarachnoid space is the minimum over a gyrus). */
export const THICK = { bone: 30, periosteal: 8, meningeal: 8, arachnoid: 5, subarachnoid: 9 } as const

export type LayerId = 'bone' | 'periosteal' | 'meningeal' | 'border' | 'arachnoid' | 'subarachnoid' | 'pia' | 'cortex'

export interface Layer {
  id: LayerId
  /** Testut's name, and today's when it differs. */
  testut: string
  today?: string
  text: string
}

/** Outside in. 'border' and 'pia' have no thickness here: one is an interface, the other a skin on the cortex. */
export const LAYERS: Layer[] = [
  { id: 'bone', testut: 'Bóveda craneal', text: 'El hueso de la bóveda. La duramadre se le pega poco, salvo en las suturas; en la base, mucho.' },
  {
    id: 'periosteal',
    testut: 'Hoja externa o perióstica de la duramadre',
    today: 'Capa perióstica de la duramadre',
    text: 'Periostio interno del cráneo: gruesa, amarillenta, lleva la arteria meníngea media y sus venas.',
  },
  {
    id: 'meningeal',
    testut: 'Duramadre propiamente dicha',
    today: 'Capa meníngea de la duramadre',
    text: 'Más delgada y menos vascular. De ella salen la hoz del cerebro, la tienda del cerebelo, la hoz del cerebelo y la tienda de la hipófisis; donde se separa de la otra hoja deja los senos.',
  },
  {
    id: 'border',
    testut: 'Espacio subdural, casi virtual',
    today: 'Interfase duramadre-aracnoides: ningún espacio natural',
    text: 'Para Testut, una hendidura estrecha entre la meninge dura y la blanda. Hoy, una débil capa de células que sólo se abre cuando la sangre la diseca.',
  },
  {
    id: 'arachnoid',
    testut: 'Aracnoides',
    text: 'La hoja externa de la meninge blanda, aplicada contra la duramadre por la presión del líquido. Pasa como un puente sobre los surcos.',
  },
  {
    id: 'subarachnoid',
    testut: 'Espacio subaracnoideo o aracnoideo',
    text: 'Lleno de líquido cefalorraquídeo y cruzado por trabéculas, arterias y venas. Estrecho sobre las circunvoluciones, se ensancha en los surcos y, en la base, en las cisternas.',
  },
  {
    id: 'pia',
    testut: 'Piamadre',
    text: 'La hoja profunda de la meninge blanda: se aplica a la corteza, baja al fondo de cada surco y lleva los vasos, que la arrastran consigo al penetrar.',
  },
  { id: 'cortex', testut: 'Corteza cerebral', text: 'La sustancia gris de los hemisferios.' },
]

export type BleedId = 'extradural' | 'subdural' | 'subarachnoid'

export interface Bleed {
  id: BleedId
  name: string
  /** The interface it opens: the boundary index it sits on (see `boundaries`). */
  at: 1 | 3 | 4
  source: string
  /** Where it may spread, as limits of |x − MID|. */
  span: [number, number]
  /** Peak thickness and where it is (|x − MID|); 0 for a bleed that only fills an existing space. */
  peak: number
  peakAt: number
  /** One hemisphere only? */
  oneSide: boolean
  text: string
}

/** Where the dura is fixed to the bone on a frontal cut of the vault: the sagittal suture and the squamous ones. */
export const SUTURES = [0, 262]

export const BLEEDS: Bleed[] = [
  {
    id: 'extradural',
    name: 'Hematoma extradural',
    at: 1,
    source: 'Arteria meníngea media',
    span: [118, 252],
    peak: 26,
    peakAt: 190,
    oneSide: true,
    text: 'Sangre arterial, casi siempre de la meníngea media desgarrada por una fractura, que despega la duramadre del hueso en la zona despegable de Marchant. La duramadre, fija en las suturas, no la deja pasar de una a otra: el coágulo queda corto y abombado. Tras una breve pérdida de conciencia suele haber un intervalo lúcido de algunas horas antes del coma.',
  },
  {
    id: 'subdural',
    name: 'Hematoma «subdural»',
    at: 3,
    source: 'Venas cerebrales superiores, al entrar en el seno',
    span: [16, 292],
    peak: 11,
    peakAt: 120,
    oneSide: true,
    text: 'Sangre venosa, de una vena cerebral desgarrada al entrar en el seno longitudinal superior cuando el encéfalo se sacude dentro del cráneo; el golpe puede ser trivial. Abre la interfase entre duramadre y aracnoides y se extiende por encima de las suturas, porque nada la fija ahí; sólo la hoz la detiene en la línea media. Por eso es larga y delgada.',
  },
  {
    id: 'subarachnoid',
    name: 'Hemorragia subaracnoidea',
    at: 4,
    source: 'Casi siempre la rotura de un aneurisma',
    span: [10, 296],
    peak: 0,
    peakAt: 0,
    oneSide: false,
    text: 'Sangre, habitualmente arterial, en el espacio que ocupa el líquido cefalorraquídeo: no forma un coágulo aparte, sino que se mezcla con el líquido, llena los surcos y las cisternas y pasa de un lado a otro. Irrita las meninges: cefalea intensa y rigidez de nuca.',
  },
]

export const bleedOf = (id: BleedId) => BLEEDS.find((b) => b.id === id)!

/** The bleed's own thickness at x (0 outside it). The extradural and subdural ones bulge in the middle. */
export function bleedThickness(b: Bleed, x: number, side: 1 | -1 = -1): number {
  if (!b.peak) return 0
  const d = Math.abs(x - MID)
  if (b.oneSide && Math.sign(x - MID) !== side) return 0
  const [a, z] = b.span
  if (d <= a || d >= z) return 0
  const t = d <= b.peakAt ? (d - a) / (b.peakAt - a) : (z - d) / (z - b.peakAt)
  return b.peak * Math.sqrt(t)
}

/** Gentle curve of the vault: the sides drop. */
const vault = (x: number) => 26 * ((x - MID) / HALF) ** 2

/** Sulci: [|x − MID|, depth]. Fixed so the section always looks the same. */
export const SULCI: [number, number][] = [
  [52, 46],
  [104, 58],
  [158, 40],
  [212, 54],
  [262, 44],
]

/** Depth of the pia below the arachnoid at x: the minimum space plus a dip at each sulcus. */
export function sulcusDip(x: number): number {
  const d = Math.abs(x - MID)
  let dip = 0
  for (const [c, depth] of SULCI) dip = Math.max(dip, depth * Math.max(0, 1 - Math.abs(d - c) / 7))
  return dip
}

/**
 * The y of each boundary at x, outside in:
 * 0 scalp side of the bone · 1 bone | periosteal dura (extradural interface) · 2 periosteal | meningeal ·
 * 3 meningeal dura | arachnoid (dural border) · 4 arachnoid | subarachnoid space · 5 pia on the cortex.
 */
export function boundaries(x: number, bleed?: Bleed, side: 1 | -1 = -1): { ys: number[]; bloodTop: number | null } {
  const y0 = TOP + vault(x)
  const t = [THICK.bone, THICK.periosteal, THICK.meningeal, THICK.arachnoid, THICK.subarachnoid + sulcusDip(x)]
  const ys = [y0]
  for (const th of t) ys.push(ys[ys.length - 1] + th)
  if (!bleed) return { ys, bloodTop: null }
  if (!bleed.peak) return { ys, bloodTop: ys[bleed.at] }
  // The clot opens the interface: what lies above stays, what lies below is pushed in by its thickness.
  const push = bleedThickness(bleed, x, side)
  const bloodTop = ys[bleed.at]
  for (let i = bleed.at; i < ys.length; i++) ys[i] += push
  return { ys, bloodTop: push ? bloodTop : null }
}

/** Layers between consecutive boundaries, for drawing and picking. */
export const BANDS: { layer: LayerId; from: number; to: number }[] = [
  { layer: 'bone', from: 0, to: 1 },
  { layer: 'periosteal', from: 1, to: 2 },
  { layer: 'meningeal', from: 2, to: 3 },
  { layer: 'arachnoid', from: 3, to: 4 },
  { layer: 'subarachnoid', from: 4, to: 5 },
]
