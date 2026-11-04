import type { CountDivision, CountNode } from './bone-count'

/**
 * Every joint of the adult skeleton, counted like the bones: a leaf states how many
 * there are, branches add up. Grouped topographically as Testut–Latarjet (t. I, p. 492).
 * Hand-editable; the counting criterion is in `jointCountCriterion` and the tests.
 *
 * Criterion: paired joints count once; series count level by level (each intervertebral
 * symphysis, each interphalangeal joint); the dentoalveolar gomphosis counts as one type.
 * Ligamentous unions of the vertebral arches and the laryngeal joints are left out.
 */
export const jointCountCriterion =
  'Las articulaciones pares cuentan una vez; las series, nivel por nivel. La gonfosis dentaria cuenta como un tipo. No se cuentan las uniones ligamentosas de los arcos vertebrales ni las articulaciones de la laringe.'

const j = (name: string, latin: string, kind: string, count = 1, note?: string): CountNode => ({ name, latin, kind, count, note })

export const jointCount: CountDivision[] = [
  {
    id: 'spine',
    name: 'Columna vertebral',
    description: 'Las articulaciones de las vértebras entre sí y de la columna con la cabeza.',
    regions: [
      {
        name: 'Columna con la cabeza',
        children: [
          j('Atlantooccipital', 'Articulatio atlantooccipitalis', 'Condilartrosis'),
          j('Atlantoaxial media', 'Articulatio atlantoaxialis mediana', 'Trocoide', 1, 'La apófisis odontoides gira dentro del anillo del atlas.'),
          j('Atlantoaxial lateral', 'Articulatio atlantoaxialis lateralis', 'Artrodia'),
          j('Occipitoaxoidea', 'Membrana tectoria et ligamenta alaria', 'Sindesmosis', 1, 'Unión a distancia del occipital con el axis, sólo por ligamentos.'),
        ],
      },
      {
        name: 'Sínfisis intervertebrales',
        children: [
          j('Cervicales (C2–C3 a C7–T1)', 'Symphysis intervertebralis', 'Anfiartrosis', 6),
          j('Torácicas (T1–T2 a T12–L1)', 'Symphysis intervertebralis', 'Anfiartrosis', 12),
          j('Lumbares (L1–L2 a L5–S1)', 'Symphysis intervertebralis', 'Anfiartrosis', 5, 'La L5–S1 es la articulación lumbosacra.'),
        ],
      },
      {
        name: 'Articulaciones cigapofisarias',
        children: [
          j('Cervicales (C2–C3 a C7–T1)', 'Articulationes zygapophysiales', 'Artrodia', 6),
          j('Torácicas (T1–T2 a T12–L1)', 'Articulationes zygapophysiales', 'Artrodia', 12),
          j('Lumbares (L1–L2 a L5–S1)', 'Articulationes zygapophysiales', 'Artrodia', 5),
        ],
      },
      {
        name: 'Sacro y cóccix',
        children: [
          j('Sacrococcígea', 'Articulatio sacrococcygea', 'Anfiartrosis'),
          j('Intercoccígeas', 'Symphyses intercoccygeae', 'Anfiartrosis', 1, 'Suelen soldarse con la edad.'),
        ],
      },
    ],
  },
  {
    id: 'head',
    name: 'Cabeza',
    description: 'Casi todas inmóviles: las suturas y sincondrosis del cráneo y de la cara, con una sola gran diartrosis, la temporomandibular.',
    regions: [
      {
        name: 'Huesos del cráneo entre sí',
        children: [
          j('Sutura coronal', 'Sutura coronalis', 'Sutura dentada', 1, 'Frontoparietal.'),
          j('Sutura sagital', 'Sutura sagittalis', 'Sutura dentada', 1, 'Biparietal.'),
          j('Sutura lambdoidea', 'Sutura lambdoidea', 'Sutura dentada', 1, 'Parietooccipital.'),
          j('Sutura escamosa', 'Sutura squamosa', 'Sutura escamosa', 1, 'Parietotemporal.'),
          j('Sutura parietomastoidea', 'Sutura parietomastoidea', 'Sutura dentada'),
          j('Sutura occipitomastoidea', 'Sutura occipitomastoidea', 'Sutura dentada'),
          j('Sutura esfenofrontal', 'Sutura sphenofrontalis', 'Sutura'),
          j('Sutura esfenoparietal', 'Sutura sphenoparietalis', 'Sutura'),
          j('Sutura esfenoescamosa', 'Sutura sphenosquamosa', 'Sutura'),
          j('Sutura frontoetmoidal', 'Sutura frontoethmoidalis', 'Sutura'),
          j('Sutura esfenoetmoidal', 'Sutura sphenoethmoidalis', 'Sutura'),
          j('Sincondrosis esfenooccipital', 'Synchondrosis sphenooccipitalis', 'Sincondrosis'),
          j('Sincondrosis esfenopetrosa', 'Synchondrosis sphenopetrosa', 'Sincondrosis'),
          j('Sincondrosis petrooccipital', 'Synchondrosis petrooccipitalis', 'Sincondrosis'),
        ],
      },
      {
        name: 'Huesos de la cara entre sí y con el cráneo',
        children: [
          j('Sutura frontonasal', 'Sutura frontonasalis', 'Sutura'),
          j('Sutura frontomaxilar', 'Sutura frontomaxillaris', 'Sutura'),
          j('Sutura frontolagrimal', 'Sutura frontolacrimalis', 'Sutura'),
          j('Sutura frontocigomática', 'Sutura frontozygomatica', 'Sutura'),
          j('Sutura internasal', 'Sutura internasalis', 'Sutura armónica'),
          j('Sutura nasomaxilar', 'Sutura nasomaxillaris', 'Sutura armónica'),
          j('Sutura lagrimomaxilar', 'Sutura lacrimomaxillaris', 'Sutura armónica'),
          j('Sutura lagrimoconchal', 'Sutura lacrimoconchalis', 'Sutura'),
          j('Sutura etmoidomaxilar', 'Sutura ethmoidomaxillaris', 'Sutura'),
          j('Sutura etmoidolagrimal', 'Sutura ethmoidolacrimalis', 'Sutura'),
          j('Sutura esfenocigomática', 'Sutura sphenozygomatica', 'Sutura'),
          j('Sutura esfenomaxilar', 'Sutura sphenomaxillaris', 'Sutura'),
          j('Sutura temporocigomática', 'Sutura temporozygomatica', 'Sutura'),
          j('Sutura cigomaticomaxilar', 'Sutura zygomaticomaxillaris', 'Sutura'),
          j('Sutura intermaxilar', 'Sutura intermaxillaris', 'Sutura'),
          j('Sutura palatomaxilar', 'Sutura palatomaxillaris', 'Sutura'),
          j('Sutura palatoetmoidal', 'Sutura palatoethmoidalis', 'Sutura'),
          j('Sutura palatina media', 'Sutura palatina mediana', 'Sutura armónica'),
          j('Sutura palatina transversa', 'Sutura palatina transversa', 'Sutura armónica'),
          j('Esquindilesis esfenovomeriana', 'Schindylesis sphenovomeriana', 'Esquindilesis', 1, 'La base del vómer encaja en la cresta del esfenoides.'),
          j('Sincondrosis etmoidovomeriana', 'Synchondrosis ethmoidovomeriana', 'Sincondrosis', 1, 'Lámina perpendicular del etmoides con el vómer.'),
        ],
      },
      {
        name: 'Mandíbula y dientes',
        children: [
          j('Temporomandibular', 'Articulatio temporomandibularis', 'Condilartrosis', 1, 'Con un menisco que la divide en dos cavidades.'),
          j('Gonfosis dentoalveolar', 'Gomphosis (syndesmosis dentoalveolaris)', 'Gonfosis', 1, 'Cada diente en su alvéolo; se cuenta como un tipo.'),
        ],
      },
      {
        name: 'Huesecillos del oído',
        children: [
          j('Incudomaleolar', 'Articulatio incudomallearis', 'Encaje recíproco'),
          j('Incudoestapedia', 'Articulatio incudostapedialis', 'Enartrosis'),
          j('Timpanoestapedia', 'Syndesmosis tympanostapedialis', 'Sindesmosis', 1, 'La base del estribo en la ventana oval.'),
        ],
      },
    ],
  },
  {
    id: 'thorax',
    name: 'Tórax',
    description: 'Las costillas con la columna, con sus cartílagos y con el esternón, y las piezas del esternón entre sí.',
    regions: [
      {
        name: 'Costillas con la columna',
        children: [
          j('Costovertebrales (cabeza de la costilla)', 'Articulationes capitis costae', 'Artrodia', 12, 'Una por costilla.'),
          j('Costotransversas', 'Articulationes costotransversariae', 'Artrodia', 10, 'Las costillas 11.ª y 12.ª no la tienen.'),
        ],
      },
      {
        name: 'Costillas con sus cartílagos',
        children: [j('Costocondrales', 'Articulationes costochondrales', 'Sincondrosis', 10)],
      },
      {
        name: 'Cartílagos con el esternón y entre sí',
        children: [
          j('Esternocostal de la 1.ª costilla', 'Synchondrosis costae primae', 'Sincondrosis'),
          j('Esternocostales (2.ª a 7.ª)', 'Articulationes sternocostales', 'Artrodia', 6),
          j('Intercondrales', 'Articulationes interchondrales', 'Artrodia', 4, 'Entre los cartílagos 6.º a 10.º.'),
        ],
      },
      {
        name: 'Piezas del esternón entre sí',
        children: [
          j('Manubrioesternal', 'Symphysis manubriosternalis', 'Diartroanfiartrosis', 1, 'La articulación esternal superior de Testut.'),
          j('Xifoesternal', 'Synchondrosis xiphosternalis', 'Sincondrosis', 1, 'La articulación esternal inferior.'),
        ],
      },
    ],
  },
  {
    id: 'limbs',
    name: 'Miembros',
    description: 'Las articulaciones del hombro y de la pelvis, que unen los miembros al tronco, y las de los propios miembros.',
    regions: [
      {
        name: 'Miembro superior',
        children: [
          {
            name: 'Hombro',
            children: [
              j('Esternoclavicular', 'Articulatio sternoclavicularis', 'Encaje recíproco'),
              j('Acromioclavicular', 'Articulatio acromioclavicularis', 'Artrodia'),
              j('Coracoclavicular', 'Syndesmosis coracoclavicularis', 'Sindesmosis', 1, 'La clavícula y la apófisis coracoides, unidas a distancia.'),
              j('Escapulohumeral', 'Articulatio humeri (glenohumeralis)', 'Enartrosis'),
            ],
          },
          {
            name: 'Codo',
            children: [
              j('Humerocubital', 'Articulatio humeroulnaris', 'Trocleartrosis'),
              j('Humerorradial', 'Articulatio humeroradialis', 'Enartrosis'),
            ],
          },
          {
            name: 'Antebrazo',
            children: [
              j('Radiocubital proximal', 'Articulatio radioulnaris proximalis', 'Trocoide'),
              j('Radiocubital distal', 'Articulatio radioulnaris distalis', 'Trocoide'),
              j('Membrana interósea del antebrazo', 'Syndesmosis radioulnaris', 'Sindesmosis'),
            ],
          },
          {
            name: 'Muñeca y carpo',
            children: [
              j('Radiocarpiana', 'Articulatio radiocarpalis', 'Condilartrosis'),
              j('Mediocarpiana', 'Articulatio mediocarpalis', 'Condilartrosis', 1, 'Entre las dos filas del carpo.'),
              j('Intercarpianas de la primera fila', 'Articulationes intercarpales', 'Artrodia', 2, 'Escafoides–semilunar y semilunar–piramidal.'),
              j('Intercarpianas de la segunda fila', 'Articulationes intercarpales', 'Artrodia', 3, 'Trapecio–trapezoide, trapezoide–hueso grande y hueso grande–ganchoso.'),
              j('Pisopiramidal', 'Articulatio ossis pisiformis', 'Artrodia'),
            ],
          },
          {
            name: 'Mano',
            children: [
              j('Trapeciometacarpiana', 'Articulatio carpometacarpalis pollicis', 'Encaje recíproco'),
              j('Carpometacarpianas (2.º a 5.º)', 'Articulationes carpometacarpales', 'Artrodia', 4),
              j('Intermetacarpianas', 'Articulationes intermetacarpales', 'Artrodia', 3),
              j('Metacarpofalángicas', 'Articulationes metacarpophalangeae', 'Condilartrosis', 5),
              j('Interfalángica del pulgar', 'Articulatio interphalangea pollicis', 'Trocleartrosis'),
              j('Interfalángicas proximales', 'Articulationes interphalangeae proximales manus', 'Trocleartrosis', 4),
              j('Interfalángicas distales', 'Articulationes interphalangeae distales manus', 'Trocleartrosis', 4),
            ],
          },
        ],
      },
      {
        name: 'Miembro inferior',
        children: [
          {
            name: 'Pelvis',
            children: [
              j('Sacroilíaca', 'Articulatio sacroiliaca', 'Diartroanfiartrosis'),
              j('Sínfisis del pubis', 'Symphysis pubica', 'Diartroanfiartrosis'),
            ],
          },
          { name: 'Cadera', children: [j('Coxofemoral', 'Articulatio coxae', 'Enartrosis')] },
          {
            name: 'Rodilla',
            children: [
              j('Femorotibial', 'Articulatio femorotibialis', 'Condilartrosis', 1, 'Bicondílea, con dos meniscos.'),
              j('Femoropatelar', 'Articulatio femoropatellaris', 'Trocleartrosis'),
            ],
          },
          {
            name: 'Pierna',
            children: [
              j('Tibioperonea proximal', 'Articulatio tibiofibularis', 'Artrodia'),
              j('Tibioperonea distal', 'Syndesmosis tibiofibularis', 'Sindesmosis'),
              j('Membrana interósea de la pierna', 'Membrana interossea cruris', 'Sindesmosis'),
            ],
          },
          { name: 'Tobillo', children: [j('Talocrural', 'Articulatio talocruralis', 'Trocleartrosis', 1, 'La articulación tibiotarsiana o de la garganta del pie.')] },
          {
            name: 'Tarso',
            children: [
              j('Subastragalina', 'Articulatio subtalaris (talocalcanea)', 'Artrodia'),
              j('Astragalocalcaneonavicular', 'Articulatio talocalcaneonavicularis', 'Enartrosis', 1, 'Con la calcaneocuboidea forma la articulación de Chopart.'),
              j('Calcaneocuboidea', 'Articulatio calcaneocuboidea', 'Encaje recíproco'),
              j('Cuneonavicular', 'Articulatio cuneonavicularis', 'Artrodia'),
              j('Cuboideonavicular', 'Articulatio cuboideonavicularis', 'Artrodia'),
              j('Intercuneiformes', 'Articulationes intercuneiformes', 'Artrodia', 2),
              j('Cuneocuboidea', 'Articulatio cuneocuboidea', 'Artrodia'),
            ],
          },
          {
            name: 'Pie',
            children: [
              j('Tarsometatarsianas', 'Articulationes tarsometatarsales', 'Artrodia', 5, 'En conjunto, la articulación de Lisfranc; una por metatarsiano.'),
              j('Intermetatarsianas', 'Articulationes intermetatarsales', 'Artrodia', 3, 'Entre los metatarsianos 2.º a 5.º.'),
              j('Metatarsofalángicas', 'Articulationes metatarsophalangeae', 'Condilartrosis', 5),
              j('Interfalángica del dedo gordo', 'Articulatio interphalangea halucis', 'Trocleartrosis'),
              j('Interfalángicas proximales', 'Articulationes interphalangeae proximales pedis', 'Trocleartrosis', 4),
              j('Interfalángicas distales', 'Articulationes interphalangeae distales pedis', 'Trocleartrosis', 4),
            ],
          },
        ],
      },
    ],
  },
]
