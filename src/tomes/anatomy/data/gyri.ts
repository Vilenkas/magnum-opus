/**
 * The convolutions of the cerebral hemisphere on its outer and inner faces, drawn after Testut's
 * schemes (t. II figs. 767 and 777, pp. 914–953), with today's names from Netter (láms. S-31 and
 * S-32) and some of the synonyms Testut gathers in his table (pp. 951–953).
 *
 * Both faces are drawn with the frontal pole on the left for the outer face and on the right for
 * the inner one, as in Testut's figures of the left hemisphere. Coordinates in a 600 × 380 viewBox.
 */

export type Pt = [number, number]
export type Face = 'lateral' | 'medial'
export type Area = 'motor' | 'sensory' | 'visual' | 'auditory' | 'language' | 'association' | 'olfactory'

export const areaName: Record<Area, string> = {
  motor: 'Zona motora',
  sensory: 'Zona sensitiva',
  visual: 'Visión',
  auditory: 'Audición',
  language: 'Lenguaje',
  association: 'Asociación',
  olfactory: 'Olfacción',
}

export type Lobe = 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'limbic'

export const lobeName: Record<Lobe, string> = {
  frontal: 'Lóbulo frontal',
  parietal: 'Lóbulo parietal',
  temporal: 'Lóbulo temporal',
  occipital: 'Lóbulo occipital',
  limbic: 'Lóbulo límbico',
}

export interface Gyrus {
  id: string
  face: Face
  lobe: Lobe
  /** Testut's name and abbreviation (as in his figures). */
  name: string
  abbr: string
  /** Today's name, after Netter. */
  modern?: string
  synonyms: string
  description: string
  /** What Testut's localizations place on it (pp. 977–986). */
  localization?: { area: Area; text: string }
  shape: Pt[]
}

export const outlines: Record<Face, Pt[]> = {
  lateral: [
    [30, 190], [45, 120], [95, 65], [170, 35], [260, 25], [350, 30], [440, 50], [515, 95], [560, 150], [575, 210],
    [560, 260], [520, 300], [450, 335], [360, 350], [280, 340], [215, 310], [185, 275], [200, 250], [165, 245],
    [110, 250], [60, 235],
  ],
  medial: [
    [30, 195], [40, 140], [80, 85], [150, 45], [240, 25], [330, 22], [420, 32], [500, 65], [550, 115], [575, 175],
    [570, 230], [540, 270], [470, 300], [380, 318], [280, 325], [190, 318], [120, 300], [70, 270], [40, 235],
  ],
}

/** Half ring around the corpus callosum: the gyrus of the corpus callosum on the inner face. */
const CC = { cx: 305, cy: 195 }
const arc = (rx: number, ry: number, from: number, to: number, n = 18): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180
    return [Math.round(CC.cx + rx * Math.cos(a)), Math.round(CC.cy + ry * Math.sin(a))] as Pt
  })

export const corpusCallosum: Pt[] = [...arc(130, 75, 180, 360), ...arc(108, 56, 360, 180)]
const cingulate: Pt[] = [...arc(165, 105, 180, 360), ...arc(130, 75, 360, 180)]

/** The great fissures, as lines to draw over the gyri. */
export const fissures: Record<Face, { id: string; name: string; points: Pt[] }[]> = {
  lateral: [
    { id: 'rolando', name: 'Cisura de Rolando', points: [[330, 29], [295, 120], [258, 212]] },
    { id: 'sylvius', name: 'Cisura de Silvio', points: [[200, 248], [292, 223], [390, 197], [412, 176]] },
    { id: 'perpendicular', name: 'Cisura perpendicular externa', points: [[470, 69], [472, 92]] },
  ],
  medial: [
    { id: 'callosomarginal', name: 'Cisura callosomarginal', points: [...arc(165, 105, 360, 250), [262, 28]] },
    { id: 'perpendicular', name: 'Cisura perpendicular interna', points: [[155, 47], [158, 150]] },
    { id: 'calcarine', name: 'Cisura calcarina', points: [[32, 194], [158, 151], [182, 214]] },
  ],
}

export const gyri: Gyrus[] = [
  // ---------- Outer face ----------
  {
    id: 'f1',
    face: 'lateral',
    lobe: 'frontal',
    name: 'Primera circunvolución frontal',
    abbr: 'F¹',
    modern: 'Giro frontal superior',
    synonyms: 'gyrus frontalis superior (Ecker), piso frontal superior (Gratiolet)',
    localization: { area: 'association', text: 'Región prefrontal y psicomotora: interviene en la coordinación de los movimientos voluntarios y en la atención; su lesión extensa produce la apraxia frontal, con pérdida de la iniciativa.' },
    description: 'Encima del surco frontal superior, a lo largo del borde superior del hemisferio. Nace por detrás de la frontal ascendente, rodea por delante el extremo del cerebro y se continúa en la cara interna y en el lóbulo orbitario.',
    shape: [[80, 100], [95, 68], [170, 38], [260, 28], [292, 31], [275, 78]],
  },
  {
    id: 'f2',
    face: 'lateral',
    lobe: 'frontal',
    name: 'Segunda circunvolución frontal',
    abbr: 'F²',
    modern: 'Giro frontal medio',
    synonyms: 'gyrus frontalis medius (Ecker), piso frontal medio (Gratiolet)',
    localization: { area: 'association', text: 'Zona psicomotora. En la teoría clásica, su pie sería el centro de las imágenes gráficas, cuya lesión produce la agrafia; en el ángulo con el surco prerrolándico, un centro de los movimientos de lateralidad de la cabeza y de los ojos.' },
    description: 'Entre los dos surcos frontales; la más voluminosa de las tres, a menudo dividida por un surco longitudinal en dos pisos.',
    shape: [[80, 100], [275, 78], [262, 108], [250, 140], [55, 168], [50, 130]],
  },
  {
    id: 'f3',
    face: 'lateral',
    lobe: 'frontal',
    name: 'Tercera circunvolución frontal',
    abbr: 'F³',
    modern: 'Giro frontal inferior (porciones opercular, triangular y orbitaria)',
    synonyms: 'circunvolución de Broca, gyrus frontalis inferior (Ecker)',
    localization: { area: 'language', text: 'El centro del lenguaje articulado, que Broca situó en el pie de la tercera frontal izquierda: su lesión produce la afasia motriz. En su vecindad, el centro de los músculos de la laringe y de la faringe.' },
    description:
      'Debajo del surco frontal inferior, sobre la cisura de Silvio, cuyas ramas anterior y ascendente la dividen en una cabeza, un cabo y un pie. En su pie, en el hemisferio izquierdo, localizó Broca la función del lenguaje articulado.',
    shape: [[55, 168], [250, 140], [236, 180], [222, 224], [200, 246], [160, 242], [110, 246], [62, 231], [38, 192]],
  },
  {
    id: 'fa',
    face: 'lateral',
    lobe: 'frontal',
    name: 'Circunvolución frontal ascendente',
    abbr: 'Fa',
    modern: 'Giro precentral',
    synonyms: 'circunvolución prerrolándica (Broca), gyrus centralis anterior (Ecker)',
    localization: { area: 'motor', text: 'La zona motora (campo 4 de Brodmann), punto de partida de la vía piramidal. Sus centros se escalonan de arriba abajo como una figura humana con la cabeza abajo: el pie y la pierna junto al borde del hemisferio, la mano, que ocupa una gran extensión, en el medio, y la cara, los labios y la laringe abajo, cerca de la cisura de Silvio.' },
    description: 'Costea por delante la cisura de Rolando, con su misma inclinación y sus flexuosidades; la limita por delante el surco prerrolándico. Une a las demás frontales por su pie y por su cabeza.',
    shape: [[292, 31], [330, 29], [295, 120], [258, 212], [250, 228], [222, 224], [236, 180], [250, 140], [262, 108], [275, 78]],
  },
  {
    id: 'pa',
    face: 'lateral',
    lobe: 'parietal',
    name: 'Circunvolución parietal ascendente',
    abbr: 'Pa',
    modern: 'Giro poscentral',
    synonyms: 'circunvolución posrolándica (Broca), gyrus centralis posterior (Ecker)',
    localization: { area: 'sensory', text: 'La última estación de la vía de la sensibilidad general: junto a la cisura de Rolando tiene una corteza sensitiva típica, un coniocórtex.' },
    description: 'Bordea por detrás la cisura de Rolando. Se une a la frontal ascendente por arriba, en el lobulillo paracentral, y por abajo, en el opérculo rolándico: las dos circunvoluciones rolándicas forman juntas un óvalo cuyo centro es la cisura.',
    shape: [[330, 29], [368, 37], [333, 122], [300, 205], [292, 220], [258, 212], [295, 120]],
  },
  {
    id: 'p1',
    face: 'lateral',
    lobe: 'parietal',
    name: 'Circunvolución parietal superior',
    abbr: 'P¹',
    modern: 'Lobulillo parietal superior',
    synonyms: 'lóbulo parietal superior (Ecker), primera parietal (Broca)',
    localization: { area: 'association', text: 'Un campo cuya función Testut declaraba desconocida. Con las áreas que rodean la región poscentral, el lóbulo parietal participa en el reconocimiento de los objetos por el tacto (estereognosia).' },
    description: 'Entre el borde superior del hemisferio y el surco interparietal; por detrás se une al lóbulo occipital por el pliegue de paso parietooccipital superior, y en la cara interna se continúa con el lóbulo cuadrilátero.',
    shape: [[368, 37], [440, 52], [471, 72], [470, 108], [338, 107]],
  },
  {
    id: 'p2',
    face: 'lateral',
    lobe: 'parietal',
    name: 'Circunvolución parietal inferior',
    abbr: 'P²',
    modern: 'Lobulillo parietal inferior (giros supramarginal y angular)',
    synonyms: 'lobulillo del pliegue curvo, gyrus supramarginalis y gyrus angularis',
    localization: { area: 'language', text: 'En el gyrus supramarginalis, la gnosia táctil y el sentido muscular; en el pliegue curvo, el centro de las imágenes visuales de las palabras, cuya lesión produce la ceguera verbal: el enfermo ve, pero no reconoce lo que lee.' },
    description:
      'Debajo del surco interparietal. Por delante rodea el extremo de la cisura de Silvio (gyrus supramarginalis); por detrás forma el pliegue curvo alrededor del surco paralelo. Con el tercio posterior de la primera temporal forma la zona de Wernicke, que tiene un papel principal en el lenguaje interior.',
    shape: [[338, 107], [470, 108], [477, 215], [440, 214], [410, 178], [390, 196], [292, 222], [300, 205], [333, 122]],
  },
  {
    id: 't1',
    face: 'lateral',
    lobe: 'temporal',
    name: 'Primera circunvolución temporal',
    abbr: 'T¹',
    modern: 'Giro temporal superior',
    synonyms: 'gyrus temporalis superior (Ecker), pliegue marginal inferior (Gratiolet)',
    localization: { area: 'auditory', text: 'En su cara superior, oculta en el fondo de la cisura de Silvio (campos 41 y 42), el centro de la audición: su supresión bilateral produce la sordera cortical. Su parte posterior, con el pliegue curvo, forma la zona de Wernicke: su lesión produce la sordera verbal.' },
    description: 'Labio inferior de la cisura de Silvio, del polo temporal hasta el extremo de la cisura, donde se continúa con el lóbulo parietal. Su cara superior, oculta en el valle silviano, lleva las circunvoluciones temporales transversas de Heschl.',
    shape: [[200, 250], [292, 224], [390, 198], [410, 180], [440, 216], [440, 224], [222, 276], [188, 272]],
  },
  {
    id: 't2',
    face: 'lateral',
    lobe: 'temporal',
    name: 'Segunda circunvolución temporal',
    abbr: 'T²',
    modern: 'Giro temporal medio',
    synonyms: 'gyrus temporalis medius (Ecker)',
    localization: { area: 'association', text: 'El origen de las fibras temporopontinas (campo TE de Economo): su destrucción produce ataxia y trastornos de los movimientos de los ojos.' },
    description: 'Entre los dos surcos temporales; por detrás se une al pliegue curvo.',
    shape: [[188, 274], [222, 278], [440, 226], [477, 218], [478, 262], [260, 312], [210, 300]],
  },
  {
    id: 't3',
    face: 'lateral',
    lobe: 'temporal',
    name: 'Tercera circunvolución temporal',
    abbr: 'T³',
    modern: 'Giro temporal inferior',
    synonyms: 'gyrus temporalis inferior (Ecker)',
    description: 'Debajo del surco temporal inferior, a lo largo del borde externo del hemisferio, cuya cara inferior invade en parte. Por detrás se continúa con la tercera occipital.',
    shape: [[210, 302], [260, 314], [478, 264], [480, 317], [450, 331], [360, 346], [282, 337]],
  },
  {
    id: 'o1',
    face: 'lateral',
    lobe: 'occipital',
    name: 'Primera circunvolución occipital',
    abbr: 'O¹',
    synonyms: 'gyrus occipitalis superior (Wagner), primer pliegue de paso (Gratiolet)',
    localization: { area: 'visual', text: 'Área visopsíquica (campos 18 y 19 de Brodmann), alrededor del área estriada: su destrucción suprime la facultad de identificar lo que se ve, la ceguera psíquica.' },
    description: 'Encima del surco occipital superior, a lo largo del borde del hemisferio; se une a la parietal superior y se continúa en la cara interna.',
    shape: [[471, 72], [512, 96], [553, 151], [568, 186], [474, 150], [470, 108]],
  },
  {
    id: 'o2',
    face: 'lateral',
    lobe: 'occipital',
    name: 'Segunda circunvolución occipital',
    abbr: 'O²',
    synonyms: 'gyrus occipitalis medius (Wagner), segundo pliegue de paso externo (Gratiolet)',
    localization: { area: 'visual', text: 'Área visopsíquica, como la primera occipital.' },
    description: 'Entre los dos surcos occipitales, continuación de la parietal inferior. Los surcos occipitales son poco profundos y las circunvoluciones de este lóbulo, muy variables, son la parte peor sistematizada de la corteza.',
    shape: [[474, 150], [568, 186], [568, 224], [477, 238]],
  },
  {
    id: 'o3',
    face: 'lateral',
    lobe: 'occipital',
    name: 'Tercera circunvolución occipital',
    abbr: 'O³',
    synonyms: 'gyrus occipitalis inferior (Wagner)',
    localization: { area: 'visual', text: 'Área visopsíquica, como las otras occipitales.' },
    description: 'Debajo del surco occipital inferior, a lo largo del borde externo; por delante se continúa con la tercera temporal, a veces separada de ella por la incisura preoccipital.',
    shape: [[477, 238], [568, 224], [554, 262], [515, 300], [480, 317], [478, 264]],
  },
  // ---------- Inner face ----------
  {
    id: 'fi',
    face: 'medial',
    lobe: 'frontal',
    name: 'Circunvolución frontal interna',
    abbr: 'F. i.',
    modern: 'Giro frontal medial',
    synonyms: 'gyrus marginalis (Henle), primera circunvolución frontal interna (Pozzi)',
    localization: { area: 'association', text: 'La parte interna de la región prefrontal.' },
    description: 'La parte interna de la primera frontal, entre el borde superior del hemisferio y la cisura callosomarginal; por delante se encorva hasta el pico del cuerpo calloso.',
    shape: [[361, 96], [370, 30], [420, 35], [500, 67], [548, 116], [571, 175], [566, 226], [500, 230], [470, 195], [464, 168], [448, 142], [422, 121], [387, 104]],
  },
  {
    id: 'paracentral',
    face: 'medial',
    lobe: 'frontal',
    name: 'Lobulillo paracentral',
    abbr: 'L. Pc.',
    modern: 'Lobulillo paracentral',
    synonyms: 'lobulillo oval (Pozzi, Broca)',
    localization: { area: 'motor', text: 'La parte superior de la zona motora: los centros del miembro inferior y, según Sherrington, un centro de la contracción de la vejiga.' },
    description: 'La parte posterior de la frontal interna, aislada por la incisura preoval; en ella termina la cisura de Rolando y se unen las dos circunvoluciones rolándicas, la frontal y la parietal ascendentes.',
    shape: [[262, 28], [370, 30], [361, 96], [334, 92], [305, 90], [276, 92]],
  },
  {
    id: 'precuneus',
    face: 'medial',
    lobe: 'parietal',
    name: 'Lóbulo cuadrilátero',
    abbr: 'L. Q.',
    modern: 'Precuña',
    synonyms: 'precuneus (Ecker), lobulillo parietal interno',
    description: 'Entre el lobulillo paracentral, por delante, y la cisura perpendicular interna, por detrás. Corresponde a la parietal superior de la cara externa.',
    shape: [[155, 50], [262, 28], [276, 92], [249, 96], [222, 104], [188, 121], [158, 150]],
  },
  {
    id: 'cuneus',
    face: 'medial',
    lobe: 'occipital',
    name: 'Cuña',
    abbr: 'C.',
    modern: 'Cuña',
    synonyms: 'cuneus (Ecker), lobulillo triangular (Broca)',
    localization: { area: 'visual', text: 'El labio superior de la cisura calcarina, el área estriada (campo 17 de Brodmann): el centro de la visión. Recibe las fibras de la mitad superior de las dos retinas.' },
    description: 'Un lobulillo triangular entre la cisura perpendicular interna y la calcarina, cuyo vértice se hunde en el ángulo que forman las dos. Los labios de la calcarina son el área cortical de la visión.',
    shape: [[155, 50], [158, 150], [36, 192], [43, 142], [82, 88], [145, 52]],
  },
  {
    id: 'cingulate',
    face: 'medial',
    lobe: 'limbic',
    name: 'Circunvolución del cuerpo calloso',
    abbr: 'C. C.',
    modern: 'Giro del cíngulo',
    synonyms: 'gyrus cinguli (Burdach), gyrus fornicatus (Arnold), circunvolución crestada',
    localization: { area: 'olfactory', text: 'Los centros secundarios de la olfacción, en la parte posterior, junto al rodete: una corteza granulosa, propia de un área sensorial, muy desarrollada en los animales de olfato fino.' },
    description: 'Rodea el cuerpo calloso, del que la separa el seno del cuerpo calloso, y la limita por fuera la cisura callosomarginal. Por detrás del rodete se continúa, por un istmo estrecho, con la circunvolución del hipocampo: juntas forman el gran lóbulo límbico de Broca.',
    shape: cingulate,
  },
  {
    id: 'lingual',
    face: 'medial',
    lobe: 'occipital',
    name: 'Lobulillo lingual',
    abbr: 'TO²',
    modern: 'Giro lingual',
    synonyms: 'lobulillo lingual (Huschke), porción posterior de la segunda temporooccipital',
    localization: { area: 'visual', text: 'El labio inferior de la cisura calcarina, también área estriada: recibe las fibras de la mitad inferior de las retinas.' },
    description: 'Debajo de la cisura calcarina, que lo separa de la cuña: es la porción posterior de la segunda circunvolución temporooccipital.',
    shape: [[36, 194], [158, 152], [182, 214], [170, 258], [118, 296], [72, 266], [42, 233]],
  },
  {
    id: 'hippocampus',
    face: 'medial',
    lobe: 'limbic',
    name: 'Circunvolución del hipocampo',
    abbr: 'H.',
    modern: 'Giro parahipocampal',
    synonyms: 'gyrus hippocampi (Ecker), quinta temporal, circunvolución límbica inferior',
    localization: { area: 'olfactory', text: 'El centro primario de la olfacción, en el gancho del hipocampo, y quizá una esfera gustativa en su parte media; Testut advierte que son hipótesis que la experimentación no ha confirmado.' },
    description: 'La porción anterior de la segunda temporooccipital. Termina por delante en un gancho, el uncus, y por detrás se une con la circunvolución del cuerpo calloso. Su superficie es más pálida que las demás, cubierta por la sustancia blanca reticulada de Arnold.',
    shape: [[182, 214], [230, 240], [300, 252], [380, 250], [425, 240], [420, 262], [390, 280], [300, 288], [205, 280], [170, 258]],
  },
  {
    id: 'fusiform',
    face: 'medial',
    lobe: 'temporal',
    name: 'Primera circunvolución temporooccipital',
    abbr: 'TO¹',
    modern: 'Giro occipitotemporal lateral (fusiforme)',
    synonyms: 'lóbulo fusiforme (Huschke), cuarta temporal',
    description: 'En la cara inferior, entre los dos surcos temporooccipitales; más ancha en su medio que en sus extremos, como un huso.',
    shape: [[170, 258], [205, 282], [300, 290], [390, 282], [445, 272], [468, 297], [380, 314], [280, 321], [192, 314], [122, 298]],
  },
]

/** Where the thalamus and the cut brainstem lie, under the corpus callosum: not cortex. */
export const diencephalon = { cx: 305, cy: 218, rx: 95, ry: 24 }

export const onFace = (face: Face) => gyri.filter((g) => g.face === face)

export function centroid(pts: Pt[]): Pt {
  let a = 0
  let x = 0
  let y = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    const f = x0 * y1 - x1 * y0
    a += f
    x += (x0 + x1) * f
    y += (y0 + y1) * f
  }
  return [x / (3 * a), y / (3 * a)]
}

export function inside([x, y]: Pt, poly: Pt[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** x of a polyline at height y (for fissures running up and down). */
export function lineXAt(points: Pt[], y: number) {
  for (let i = 1; i < points.length; i++) {
    const [[x0, y0], [x1, y1]] = [points[i - 1], points[i]]
    if ((y - y0) * (y - y1) <= 0 && y0 !== y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0)
  }
  return null
}

/** y of a polyline at x (for fissures running front to back). */
export function lineYAt(points: Pt[], x: number) {
  for (let i = 1; i < points.length; i++) {
    const [[x0, y0], [x1, y1]] = [points[i - 1], points[i]]
    if ((x - x0) * (x - x1) <= 0 && x0 !== x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return null
}
