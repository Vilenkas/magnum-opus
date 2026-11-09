import type { Description } from './index'

/**
 * The bones of the trunk (skeleton viewer): vertebrae, sacrum and coccyx after Latarjet–Ruiz Liard's chapter 4 (t. 1),
 * sternum, ribs and costal cartilages after chapter 71 (t. 2). Vertebrae and ribs that share a type share their text,
 * led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })

const CERVICAL =
  'Vértebra **cervical**: cuerpo pequeño, alargado de lado a lado, con dos **procesos unciformes** en su cara superior; procesos transversos con el **foramen transverso**, por donde sube la arteria vertebral, y terminados en dos tubérculos; proceso espinoso corto y bífido. El foramen vertebral, ancho y triangular, aloja la intumescencia cervical de la médula. Carillas articulares poco encajadas: es la región más móvil de la columna.'
const THORACIC =
  'Vértebra **torácica**: cuerpo redondeado, más grueso cuanto más abajo, con dos **fositas costales** a cada lado para la cabeza de las costillas; procesos transversos con una fosita para el tubérculo costal; proceso espinoso largo e inclinado hacia abajo; las láminas se imbrican como tejas. Foramen vertebral pequeño y circular. Unida a las costillas, es la región más fija de la columna.'
const LUMBAR =
  'Vértebra **lumbar**: la más voluminosa, de cuerpo más ancho que profundo; sin foramen transverso ni fositas costales. Sus «transversos» son **procesos costales**, restos de costilla, con un proceso accesorio en la base y un proceso mamilar junto a la carilla superior; el proceso espinoso es una lámina cuadrilátera horizontal. Las carillas articulares, verticales y curvas, encajan como segmentos de cilindro y limitan la rotación. Desde L2 el conducto sólo contiene raíces.'

const vertebra = (lead: string, base: string, p: string): Description => ({ text: [lead, base], sources: [LR(p)] })

const vertebrae: Record<string, Description> = {
  'Atlas (C1)': {
    text: [
      'La primera vértebra cervical, sin cuerpo: un anillo de dos **masas laterales** unidas por un arco anterior y otro posterior. Arriba, las masas tienen dos carillas en suela de zapato para los cóndilos del occipital (asentimiento); abajo, dos carillas para el axis (rotación). El arco anterior lleva detrás la fosita para el **diente del axis**, que ocupa el lugar del cuerpo que le falta.',
      'Sobre el arco posterior pasan la arteria vertebral y el primer nervio cervical. Sus procesos transversos son los más salientes del cuello. A veces está soldado al occipital (occipitalización).',
    ],
    sources: [LR('33–35')],
  },
  'Axis (C2)': {
    text: [
      'La segunda vértebra cervical, pivote de la cabeza: de su cuerpo se eleva el **diente** (apófisis odontoides), que se articula delante con el arco del atlas y detrás con el ligamento transverso. A los lados, dos carillas casi planas para las masas laterales del atlas; sobre ellas gira la cabeza en la rotación.',
      'Su proceso espinoso es grueso y bífido; en él se insertan el recto posterior mayor y el oblicuo inferior de la cabeza.',
    ],
    sources: [LR('35–36')],
  },
  'Vertebra C3': vertebra('Tercera vértebra cervical, la primera de forma típica.', CERVICAL, '30–32'),
  'Vertebra C4': vertebra('Cuarta vértebra cervical, de forma típica.', CERVICAL, '30–32'),
  'Vertebra C5': vertebra('Quinta vértebra cervical, de forma típica.', CERVICAL, '30–32'),
  'Vertebra C6': vertebra(
    'Sexta vértebra cervical: el tubérculo anterior de su proceso transverso, grueso y palpable, es el **tubérculo carotídeo** (de Chassaignac), contra el que se comprime la carótida común.',
    CERVICAL,
    '30–32, 36',
  ),
  'Vertebra C7': {
    text: [
      'La **vértebra prominente**: séptima cervical, de transición, con un cuerpo más grueso y un proceso espinoso largo, no bífido, que forma el primer relieve claro de la nuca y sirve para contar las vértebras. Sus procesos transversos son largos y de un solo tubérculo; el foramen transverso es pequeño y no lo atraviesa la arteria vertebral. En ella termina el ligamento nucal.',
    ],
    sources: [LR('36, 40, 50')],
  },
  'Vertebra T1': vertebra(
    'Primera vértebra torácica, de transición con el cuello: cuerpo más ancho que profundo y, a cada lado, una fosita costal completa para la **primera costilla** (que puede compartir con C7).',
    THORACIC,
    '32, 36',
  ),
  'Vertebra T2': { text: ['Segunda vértebra torácica; el borde superior del esternón se proyecta a su altura.', THORACIC], sources: [LR('32'), LR2('828')] },
  'Vertebra T3': vertebra('Tercera vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T4': { text: ['Cuarta vértebra torácica, de forma típica; a su altura la vena ácigos se acoda hacia delante para formar su arco.', THORACIC], sources: [LR('32'), LR2('1004')] },
  'Vertebra T5': vertebra('Quinta vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T6': vertebra('Sexta vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T7': vertebra('Séptima vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T8': vertebra('Octava vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T9': vertebra('Novena vértebra torácica, de forma típica.', THORACIC, '32'),
  'Vertebra T10': vertebra(
    'Décima vértebra torácica, donde empieza la transición hacia las lumbares: tiene una sola fosita costal, la superior, para la décima costilla, y su proceso espinoso es menos oblicuo.',
    THORACIC,
    '32, 36',
  ),
  'Vertebra T11': vertebra(
    'Undécima vértebra torácica: una sola carilla, a caballo entre cuerpo y pedículo, para la undécima costilla; procesos transversos cortos, sin fosita, y carillas articulares que empiezan a mirar afuera.',
    THORACIC,
    '32, 36',
  ),
  'Vertebra T12': vertebra(
    'Duodécima vértebra torácica, la de la **charnela toracolumbar**: una carilla en el pedículo para la duodécima costilla, transversos cortos sin fosita y carillas inferiores ya lumbares, convexas y laterales.',
    THORACIC,
    '32, 36',
  ),
  'Vertebra L1': vertebra('Primera vértebra lumbar, de procesos costales más cortos que los demás; frente a su disco con L2 termina habitualmente la médula espinal (cono medular).', LUMBAR, '32–33, 36, 143'),
  'Vertebra L2': vertebra('Segunda vértebra lumbar, de forma típica.', LUMBAR, '32–33'),
  'Vertebra L3': vertebra('Tercera vértebra lumbar, de forma típica.', LUMBAR, '32–33'),
  'Vertebra L4': { text: ['Cuarta vértebra lumbar, de forma típica; frente a su cuerpo se bifurca la aorta.', LUMBAR], sources: [LR('32–33'), LR2('924')] },
  'Vertebra L5': {
    text: [
      'Quinta vértebra lumbar, la de la **charnela lumbosacra**: su cuerpo es cuneiforme, más alto delante, para asentarse en la cara inclinada del sacro; los procesos costales son cortos, macizos y piramidales, unidos al ala del sacro por el ligamento iliolumbar.',
      'Tiende a deslizarse hacia delante sobre el sacro: si el istmo de su arco se rompe (espondilólisis), resbala (espondilolistesis).',
    ],
    sources: [LR('36, 51–52')],
  },
}

const ribText = (lead: string, kind: string) => [
  lead,
  `Costilla ${kind}. Como todas, es un arco curvado y torcido: atrás, la **cabeza**, con dos carillas para dos vértebras, el **cuello** y el **tubérculo**, que se articula con el proceso transverso; luego el **ángulo costal** y el cuerpo, que por su cara medial lleva el **surco costal** con el paquete vasculonervioso intercostal (vena, arteria y nervio, de arriba abajo). Adelante continúa en su cartílago.`,
]
const rib = (lead: string, kind: string): Description => ({ text: ribText(lead, kind), sources: [LR2('828–831')] })
const TRUE = '**verdadera**, unida al esternón por su propio cartílago'
const FALSE = '**falsa**, cuyo cartílago se une al de la costilla de encima y forma el arco costal'

const ribs: Record<string, Description> = {
  'First rib': {
    text: [
      'La primera costilla, corta, ancha y plana, casi horizontal, con una cara superior y otra inferior. En la superior, el **tubérculo del escaleno anterior** separa dos surcos: delante, el de la vena subclavia; detrás, el de la arteria subclavia y el tronco inferior del plexo braquial. Su cabeza toca sólo T1 y su cuello se apoya sobre el ganglio estrellado.',
      'Limita la abertura superior del tórax y sostiene la cúpula pleural y el vértice del pulmón; oculta por la clavícula y los músculos, casi no se palpa.',
    ],
    sources: [LR2('830–831')],
  },
  'Second rib': {
    text: [
      'Más larga que la primera y poco torcida; su cara superior, que mira arriba y afuera, lleva una tuberosidad para el serrato anterior. Se articula con el esternón a la altura del **ángulo esternal**, por eso es la referencia para empezar a contar costillas en el vivo; se palpa bajo el pectoral mayor y en la axila.',
    ],
    sources: [LR2('829, 831')],
  },
  'Third rib': rib('La tercera costilla.', TRUE),
  'Fourth rib': rib('La cuarta costilla.', TRUE),
  'Fifth rib': rib('La quinta costilla.', TRUE),
  'Sixth rib': rib('La sexta costilla, de las más anchas.', TRUE),
  'Seventh rib': rib('La séptima costilla, la última verdadera y la más larga de la serie (la longitud crece de la 1.ª a la 7.ª y luego disminuye).', TRUE),
  'Eighth rib': rib('La octava costilla, la primera falsa y de las más anchas.', FALSE),
  'Ninth rib': rib('La novena costilla.', FALSE),
  'Tenth rib': rib('La décima costilla, la última del arco costal; su cabeza sólo toca una vértebra, T10.', FALSE),
  'Eleventh rib': {
    text: [
      'La undécima costilla, **flotante**: su extremo anterior queda libre entre los músculos de la pared abdominal, sin cartílago unido al esternón. Se articula con una sola vértebra (T11) y no tiene tubérculo ni articulación costotransversa.',
    ],
    sources: [LR2('828, 831')],
  },
  'Twelfth rib': {
    text: [
      'La duodécima costilla, flotante y la más corta; a veces se reduce a pocos centímetros, lo que confunde al contar costillas en una radiografía. Se articula sólo con T12, sin tubérculo. En ella se insertan el cuadrado lumbar y el diafragma (ligamento arqueado lateral); por debajo corren los vasos y el nervio subcostales, y es referencia del abordaje lumbar del riñón.',
    ],
    sources: [LR2('831, 962'), LR('59–60')],
  },
}

const CARTILAGE =
  'Barra de cartílago hialino que prolonga la costilla hasta el esternón o el arco costal, unida a ella sin articulación móvil (costocondral). Blando y elástico en el joven, se calcifica con la edad y vuelve rígido el tórax; sólo así se ve en las radiografías.'
const cartilage = (lead: string): Description => ({ text: [lead, CARTILAGE], sources: [LR2('832, 836')] })

const cartilages: Record<string, Description> = {
  'Costal cartilage of first rib': cartilage(
    'El primer cartílago costal, corto y grueso: se suelda al manubrio sin cavidad articular (sincondrosis) y se relaciona arriba con la clavícula y el ligamento costoclavicular.',
  ),
  'Costal cartilage of second rib': cartilage('El segundo cartílago costal, que llega al esternón en el **ángulo esternal**, entre manubrio y cuerpo.'),
  'Costal cartilage of third rib': cartilage('El tercer cartílago costal, horizontal; los seis primeros se alargan de arriba abajo.'),
  'Costal cartilage of fourth rib': cartilage('El cuarto cartílago costal, horizontal.'),
  'Costal cartilage of fifth rib': cartilage('El quinto cartílago costal, en cuyo borde inferior se inserta la lengüeta más alta del recto del abdomen.'),
  'Costal cartilage of sixth rib': cartilage('El sexto cartílago costal, el último horizontal; a la altura del espacio que lo sigue termina la arteria torácica interna.'),
  'Costal cartilage of seventh rib': cartilage(
    'El séptimo cartílago costal, largo y oblicuo hacia arriba y adentro: llega a la última escotadura del esternón y recibe los cartílagos 8.º a 10.º. Un ligamento propio, el costoxifoideo, lo une al proceso xifoides.',
  ),
  'Costal cartilage of eighth rib': cartilage('El octavo cartílago costal, que no llega al esternón: se une al séptimo y forma con él el **arco costal**, borde entre el tórax y el abdomen.'),
  'Costal cartilage of ninth rib': cartilage('El noveno cartílago costal, curvado hacia arriba hasta el octavo, dentro del **arco costal**.'),
  'Costal cartilage of tenth rib': cartilage('El décimo cartílago costal, el último del **arco costal**; por debajo, las costillas flotantes no tienen cartílago unido.'),
}

const STERNUM =
  'El **esternón**, hueso plano e impar de 15–20 cm en la parte anterior del tórax, tiene tres piezas que en el adulto suelen estar soldadas: manubrio, cuerpo y proceso xifoides. Bajo dos láminas compactas guarda hueso esponjoso con médula roja, que se extrae por punción esternal; todo él se palpa bajo la piel.'

const sternum: Record<string, Description> = {
  'Manubrium of sternum': {
    text: [
      'El **manubrio**, la pieza superior y más ancha: arriba la escotadura yugular, a sus lados las escotaduras claviculares y, en los bordes, las del primer cartílago y el comienzo del segundo. Su unión con el cuerpo forma el **ángulo esternal** (de Louis), saliente palpable a la altura del segundo cartílago; su borde superior está frente a T2.',
      STERNUM,
    ],
    sources: [LR2('827–828')],
  },
  'Body of sternum': {
    text: [
      'El **cuerpo** del esternón, largo y estrecho, marcado por líneas transversales que son las soldaduras de sus piezas primitivas (esternebras), fundidas progresivamente desde los 3 años. En sus bordes se articulan los cartílagos 2.º a 7.º. La esternotomía lo abre de arriba abajo para llegar al corazón y al mediastino anterior.',
      STERNUM,
    ],
    sources: [LR2('827–828')],
  },
  'Xiphoid process': {
    text: [
      'El **proceso xifoides**, punta inferior del esternón, de forma muy variable (triangular, bífida, perforada) y cartilaginoso mucho tiempo. En su cara posterior se inserta la porción esternal del diafragma; delante, el ligamento costoxifoideo. Su vértice se proyecta a la altura del disco T10–T11.',
      STERNUM,
    ],
    sources: [LR2('827–828, 836')],
  },
}

const pelvicSpine: Record<string, Description> = {
  Sacrum: {
    text: [
      'Cinco vértebras soldadas entre los 18 y 25 años en un hueso triangular, encajado como una cuña entre los dos coxales, al que pasa el peso de la columna. Su cara pélvica es cóncava, con cuatro pares de **forámenes sacros anteriores**; la dorsal, convexa, con la cresta sacra mediana y los forámenes posteriores. El borde anterior de su base es el **promontorio**.',
      'A los lados, la **carilla auricular** se articula con el ilion. El conducto sacro prolonga el vertebral y se abre abajo en el **hiato sacro**, entre las astas, por donde se llega al espacio epidural.',
    ],
    sources: [LR('37–39, 40')],
  },
  Coccyx: {
    text: [
      'Cuatro o cinco vértebras atrofiadas y soldadas en una pieza triangular, la cola del esqueleto. Su base se articula con el vértice del sacro y sus **astas** con las del sacro; en él se inserta el glúteo mayor. En el parto, sus ligamentos ceden y la cabeza fetal lo empuja hacia atrás.',
    ],
    sources: [LR('39, 52–53')],
  },
}

export const trunkBones: Record<string, Description> = { ...vertebrae, ...pelvicSpine, ...sternum, ...ribs, ...cartilages }
