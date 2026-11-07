/**
 * The cerebellar cortex as Cajal described it and Testut sums it up in fig. 678, «the Purkinje
 * cell as a histological cerebellum» (t. II pp. 807–816): every excitation that reaches the cortex
 * converges on the Purkinje cell, which is the only way out. The mossy fibres reach it through
 * the granules and their parallel fibres; the climbing fibres, directly, along its dendrites; the
 * basket cells join it to the parallel fibres that pass by. Its axon goes to the central nuclei.
 *
 * Paths are in the plate's viewBox, drawn in the direction of the impulse (pia at the top).
 */
import type { Circuit, CircuitStage } from './nerve-circuits'

export type LayerId = 'molecular' | 'purkinje' | 'granular' | 'medulla'

export interface Layer {
  id: LayerId
  name: string
  top: number
  bottom: number
}

export const layers: Layer[] = [
  { id: 'molecular', name: 'Capa molecular', top: 30, bottom: 230 },
  { id: 'purkinje', name: 'Capa de las células de Purkinje', top: 230, bottom: 262 },
  { id: 'granular', name: 'Capa granulosa', top: 262, bottom: 420 },
  { id: 'medulla', name: 'Centro medular', top: 420, bottom: 560 },
]

export const layerAt = (y: number) => layers.find((l) => y >= l.top && y < l.bottom)?.id

const COLOR = { mossy: '#5f7f3a', climbing: '#a0661c', granule: '#3b5a92', basket: '#7a4f9a', purkinje: '#b8322a' }

const PURKINJE = { name: 'Célula de Purkinje', role: 'su cilindroeje es la única salida de la corteza', color: COLOR.purkinje }
const GRANULE = { name: 'Grano', role: 'elemento fundamental de la capa granulosa', color: COLOR.granule }

/** The Purkinje cell and its axon to the central nuclei: the end of every chain. */
const TAIL: Omit<CircuitStage, 'neuron'>[] = [
  {
    id: 'purkinje',
    name: 'Célula de Purkinje',
    kind: 'cell',
    d: 'M300 234 C300 240 300 248 300 256',
    description:
      'Una gran célula en forma de pera, de 50 a 60 µm, en una sola hilera entre la capa molecular y la granulosa. A su alrededor converge toda la excitación que llega a la corteza: es, según la expresión clásica, un cerebelo histológico.',
  },
  {
    id: 'purkinje-axon',
    name: 'Cilindroeje de Purkinje',
    kind: 'axon',
    d: 'M300 256 C300 320 302 400 304 520',
    description:
      'Su único cilindroeje, rodeado de mielina, atraviesa la capa granulosa y se pierde en el centro medular; da colaterales recurrentes que vuelven a otras células de Purkinje. Es la sola fibra eferente de la corteza cerebelosa.',
  },
  {
    id: 'nuclei',
    name: 'Núcleos centrales',
    kind: 'effector',
    d: 'M304 520 C304 528 304 534 304 540',
    description:
      'Termina en los núcleos centrales del cerebelo: los del vermis en los núcleos del techo, los de los hemisferios en el núcleo dentado. De allí salen las vías eferentes del cerebelo.',
  },
]

const GRANULE_START: Omit<CircuitStage, 'neuron'>[] = [
  {
    id: 'granule',
    name: 'Grano',
    kind: 'cell',
    d: 'M420 344 C419 340 418 338 418 334',
    description: 'Una célula pequeña, de 4 a 5 µm, casi sin protoplasma; los granos se aprietan por millares en la capa granulosa.',
  },
  {
    id: 'granule-axon',
    name: 'Cilindroeje ascendente',
    kind: 'axon',
    d: 'M418 334 C418 270 416 180 416 120',
    description: 'El cilindroeje del grano sube a la capa molecular y, a una altura variable, se divide en T.',
  },
]

const at = (neuron: number, stages: Omit<CircuitStage, 'neuron'>[]): CircuitStage[] => stages.map((s) => ({ ...s, neuron }))

export const chains: (Omit<Circuit, 'id'> & { id: 'mossy' | 'climbing' | 'basket' })[] = [
  {
    id: 'mossy',
    name: 'Fibra musgosa',
    figure: 'figs. 669, 676 y 678',
    neurons: [{ name: 'Fibra musgosa', role: 'aferente, llega por los pedúnculos', color: COLOR.mossy }, GRANULE, PURKINJE],
    stages: [
      ...at(0, [
        {
          id: 'mossy',
          name: 'Fibra musgosa',
          kind: 'axon',
          d: 'M470 556 C470 490 456 420 440 372',
          description:
            'Una fibra gruesa, con mielina en la sustancia blanca y desnuda en la corteza, erizada de trecho en trecho de rosetas, como el musgo que cubre el tronco de los árboles. Termina en la capa granulosa.',
        },
      ]),
      ...at(1, [
        {
          id: 'glomerulus',
          name: 'Glomérulo cerebeloso',
          kind: 'synapse',
          d: 'M440 372 C436 366 432 362 428 358',
          description:
            'Las rosetas de la fibra musgosa se articulan con las dendritas de los granos y con las ramificaciones de las células de Golgi, sin confundirse: forman los glomérulos de la capa granulosa.',
        },
        {
          id: 'granule-dendrite',
          name: 'Dendrita del grano',
          kind: 'dendrite',
          d: 'M428 358 C424 352 422 348 420 344',
          description: 'De cuatro a seis prolongaciones cortas, que terminan en una pequeña garra en el glomérulo.',
        },
        ...GRANULE_START,
        {
          id: 'parallel',
          name: 'Fibra paralela',
          kind: 'axon',
          d: 'M416 120 C380 120 340 120 312 120',
          description:
            'Las dos ramas de la T corren a lo largo de la laminilla: son las fibras paralelas de Cajal. Perpendiculares al abanico de las dendritas de Purkinje, cruzan las de toda una serie de células, como los hilos del telégrafo pasan por los aisladores.',
        },
      ]),
      ...at(2, [
        {
          id: 'spines',
          name: 'Espinas de las dendritas',
          kind: 'synapse',
          d: 'M312 120 C308 120 304 120 300 122',
          description: 'La fibra paralela se apoya sobre las espinas de las ramitas dendríticas; cada grano actúa así sobre todas las células de Purkinje que encuentra en su camino.',
        },
        {
          id: 'purkinje-dendrite',
          name: 'Árbol dendrítico',
          kind: 'dendrite',
          d: 'M300 122 C300 160 300 200 300 234',
          description:
            'Las dendritas de Purkinje se despliegan en la capa molecular en un abanico aplanado, como un frutal en espaldera, orientado de través a la laminilla. Llevan la excitación hacia la célula.',
        },
        ...TAIL,
      ]),
    ],
  },
  {
    id: 'climbing',
    name: 'Fibra trepadora',
    figure: 'figs. 669, 677 y 678',
    neurons: [{ name: 'Fibra trepadora', role: 'aferente; hoy se sabe que nace en la oliva bulbar', color: COLOR.climbing }, PURKINJE],
    stages: [
      ...at(0, [
        {
          id: 'climbing',
          name: 'Fibra trepadora',
          kind: 'axon',
          d: 'M200 556 C212 460 258 330 288 262',
          description: 'Atraviesa la capa granulosa sin detenerse y llega a la célula de Purkinje, a la altura de su cuerpo.',
        },
      ]),
      ...at(1, [
        {
          id: 'tendrils',
          name: 'Trepa por las dendritas',
          kind: 'synapse',
          d: 'M288 262 C282 244 294 226 290 208 C286 190 296 174 292 156 C290 150 292 144 292 140',
          description:
            'Sus ramificaciones suben, varicosas y en zigzag, a lo largo de los tallos dendríticos, como los bejucos por las ramas de los árboles de los trópicos, en las palabras de Cajal. Es un contacto directo, sin intermediario.',
        },
        {
          id: 'climbed-dendrite',
          name: 'Árbol dendrítico',
          kind: 'dendrite',
          d: 'M292 140 C296 170 300 200 300 234',
          description: 'Por las dendritas que ha abrazado, la excitación de la fibra trepadora baja a la célula.',
        },
        ...TAIL,
      ]),
    ],
  },
  {
    id: 'basket',
    name: 'Célula en cesta',
    figure: 'figs. 670, 672 y 678',
    neurons: [GRANULE, { name: 'Célula en cesta', role: 'gran célula estrellada de la capa molecular', color: COLOR.basket }, PURKINJE],
    stages: [
      ...at(0, [
        ...GRANULE_START,
        {
          id: 'parallel-left',
          name: 'Fibra paralela',
          kind: 'axon',
          d: 'M416 120 C330 120 240 120 176 120',
          description: 'La fibra paralela sigue su camino a lo largo de la laminilla y pasa entre las dendritas de las células estrelladas de la capa molecular.',
        },
      ]),
      ...at(1, [
        {
          id: 'basket-synapse',
          name: 'Contacto',
          kind: 'synapse',
          d: 'M176 120 C174 126 172 130 172 136',
          description: 'Las prolongaciones protoplasmáticas de la célula en cesta se extienden en la capa molecular, entre las fibras paralelas.',
        },
        {
          id: 'basket-dendrite',
          name: 'Dendritas',
          kind: 'dendrite',
          d: 'M172 136 C171 150 170 160 170 172',
          description: 'Llevan la excitación al cuerpo de la célula.',
        },
        {
          id: 'basket-cell',
          name: 'Célula en cesta',
          kind: 'cell',
          d: 'M170 172 C170 176 171 180 172 184',
          description: 'Una gran célula estrellada, de 9 a 18 µm, en los dos tercios internos de la capa molecular.',
        },
        {
          id: 'basket-axon',
          name: 'Cilindroeje',
          kind: 'axon',
          d: 'M172 184 C210 196 256 214 286 230',
          description:
            'Su cilindroeje, muy largo, corre de través a la laminilla, paralelo a la superficie, y da colaterales descendentes a una larga serie de células de Purkinje: cada célula en cesta tiene muchas bajo su dependencia.',
        },
      ]),
      ...at(2, [
        {
          id: 'basket-ending',
          name: 'El cesto',
          kind: 'synapse',
          d: 'M286 230 C292 226 298 228 300 234',
          description:
            'Las colaterales envuelven el cuerpo de la célula de Purkinje en una red, el cesto terminal, y bajan hasta el origen de su cilindroeje formando un pincel. Hoy se sabe que esta acción es inhibidora.',
        },
        ...TAIL,
      ]),
    ],
  },
]
