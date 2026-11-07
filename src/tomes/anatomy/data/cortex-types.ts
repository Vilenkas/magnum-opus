/**
 * The six layers of the cerebral cortex and Economo's five structural types (Testut t. II
 * pp. 956–968, figs. 789, 794 and 795). The fundamental type has six layers; three "homotypical"
 * types keep them all (frontal, parietal, polar), while two "heterotypical" ones lose or swell
 * the granular layers: the agranular cortex of the motor area, where pyramids replace the grains,
 * and the granular cortex, or koniocortex, of the sensory areas, where grains invade everything.
 *
 * Thicknesses are in mm; the share of each layer is schematic, read off fig. 795, and only its
 * ordering is meant: how granular each type is, and which layers grow or shrink.
 */

export type LayerId = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'

export interface Layer {
  id: LayerId
  name: string
  latin?: string
  cells: 'sparse' | 'grains' | 'pyramids' | 'spindles'
  description: string
}

export const layers: Layer[] = [
  { id: 'I', name: 'Capa molecular', latin: 'lamina zonalis', cells: 'sparse', description: 'Sobre todo sustancia gris en la que se expanden numerosas fibras nerviosas, de ahí su otro nombre de capa plexiforme; pocas células, entre ellas las células horizontales de Cajal.' },
  { id: 'II', name: 'Capa granular externa', latin: 'lamina granularis externa', cells: 'grains', description: 'Granos pequeños, muy apretados y numerosos.' },
  { id: 'III', name: 'Capa de las células piramidales', latin: 'lamina pyramidalis', cells: 'pyramids', description: 'Más clara que las precedentes; sus células piramidales aumentan de talla de la superficie a la profundidad, y Economo la divide por eso en tres zonas.' },
  { id: 'IV', name: 'Capa granular interna', latin: 'lamina granularis interna', cells: 'grains', description: 'De nuevo células granulares pequeñas y muy numerosas. Es la capa que más cambia de una región a otra: desaparece en la corteza motora y se desdobla en la visual.' },
  { id: 'V', name: 'Capa ganglionar', cells: 'pyramids', description: 'Células piramidales voluminosas y diseminadas; en la frontal ascendente contiene las células gigantes de Betz, el origen de la vía piramidal.' },
  { id: 'VI', name: 'Capa de las células fusiformes', latin: 'lamina multiformis', cells: 'spindles', description: 'Células fusiformes de eje mayor perpendicular a la superficie; conduce a la sustancia blanca, cuyas fibras la atraviesan.' },
]

export type TypeId = 'agranular' | 'frontal' | 'parietal' | 'polar' | 'granular'

export interface CortexType {
  id: TypeId
  number: number
  name: string
  kind: 'homotypical' | 'heterotypical'
  /** Total thickness, mm. */
  thickness: number
  /** Share of each layer in the thickness, in the order of `layers`. */
  shares: Record<LayerId, number>
  /** Relative size of the pyramidal cells (1 = the fundamental type). */
  pyramids: number
  betz: boolean
  where: string
  description: string
}

export const types: CortexType[] = [
  {
    id: 'agranular',
    number: 1,
    name: 'Tipo piramidal agranular',
    kind: 'heterotypical',
    thickness: 4,
    shares: { I: 0.09, II: 0.03, III: 0.37, IV: 0, V: 0.23, VI: 0.28 },
    pyramids: 1.5,
    betz: true,
    where: 'La frontal ascendente (campo 4 de Brodmann, FA de Economo) y el campo frontal agranular que tiene delante (campo 6), con la parte anterior de la circunvolución límbica.',
    description:
      'No tiene capa granular: los granos están reemplazados por células piramidales, una verdadera piramidalización de la corteza. Es la corteza de los centros motores, gruesa, con las células gigantes de Betz en su quinta capa.',
  },
  {
    id: 'frontal',
    number: 2,
    name: 'Tipo frontal o piramidal granular',
    kind: 'homotypical',
    thickness: 3,
    shares: { I: 0.1, II: 0.07, III: 0.33, IV: 0.08, V: 0.17, VI: 0.25 },
    pyramids: 1.2,
    betz: false,
    where: 'La mayor parte del lóbulo frontal, delante de la región precentral, y buena parte de las circunvoluciones temporales.',
    description: 'Seis capas distintas; la corteza es gruesa, las células piramidales de las capas III y V voluminosas y regularmente dispuestas, y las dos capas granulares, manifiestas.',
  },
  {
    id: 'parietal',
    number: 3,
    name: 'Tipo parietal',
    kind: 'homotypical',
    thickness: 2.8,
    shares: { I: 0.1, II: 0.1, III: 0.29, IV: 0.12, V: 0.15, VI: 0.24 },
    pyramids: 0.9,
    betz: false,
    where: 'La mayor parte del lóbulo parietal (el gyrus supramarginalis y el pliegue curvo) y del temporal.',
    description: 'También seis capas, pero las células piramidales son más pequeñas y menos regularmente dispuestas, y las dos capas granulares, más densas.',
  },
  {
    id: 'polar',
    number: 4,
    name: 'Tipo polar',
    kind: 'homotypical',
    thickness: 2.3,
    shares: { I: 0.11, II: 0.12, III: 0.26, IV: 0.14, V: 0.13, VI: 0.24 },
    pyramids: 0.8,
    betz: false,
    where: 'Los polos frontal y occipital.',
    description: 'La corteza es delgada, pero la densidad celular es muy elevada, sobre todo en las capas granulares; parece así mejor estratificada.',
  },
  {
    id: 'granular',
    number: 5,
    name: 'Tipo granuloso o coniocórtex',
    kind: 'heterotypical',
    thickness: 1.8,
    shares: { I: 0.1, II: 0.15, III: 0.2, IV: 0.3, V: 0.07, VI: 0.18 },
    pyramids: 0.6,
    betz: false,
    where: 'Las áreas sensitivas y sensoriales: la vertiente posterior de Rolando, la primera temporal en el fondo de la cisura de Silvio, el surco del hipocampo y, sobre todo, la cisura calcarina, donde la capa granular interna se desdobla y la estría de Gennari se ve a simple vista.',
    description:
      'Las capas granulares no sólo están desarrolladas: invaden las vecinas, la tercera y a veces la quinta y la sexta. Esta granulación da a la corteza un aspecto polvoriento, de ahí su nombre (del griego κόνις, polvo). En la cisura calcarina mide de 1,5 a 2 mm.',
  },
]

/** How granular a type is: the share of its two granular layers. */
export const granularity = (t: CortexType) => t.shares.II + t.shares.IV

/** Thickness of each layer, mm, at a point t between types (0 … 4, in the order of `types`). */
export function layersAt(t: number) {
  const i = Math.max(0, Math.min(types.length - 2, Math.floor(t)))
  const k = Math.max(0, Math.min(1, t - i))
  const [a, b] = [types[i], types[i + 1]]
  const mix = (x: number, y: number) => x + (y - x) * k
  return {
    pyramids: mix(a.pyramids, b.pyramids),
    betz: mix(a.betz ? 1 : 0, b.betz ? 1 : 0),
    layers: layers.map((l) => ({ ...l, mm: mix(a.thickness * a.shares[l.id], b.thickness * b.shares[l.id]) })),
  }
}
