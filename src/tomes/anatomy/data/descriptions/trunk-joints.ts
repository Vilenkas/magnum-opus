import type { Description } from './index'

/**
 * The joints of the vertebral column and the thorax and their pieces (arthrology viewer). Whole joints are keyed by their
 * `joint-index.ts` `en`. After Latarjet–Ruiz Liard's chapter 5 (t. 1) and chapter 72 (t. 2). Discs and nuclei are written
 * per region of the column, led by a line about their level.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })
const d2 = (p: string, ...text: string[]): Description => ({ text, sources: [LR2(p)] })

const joints: Record<string, Description> = {
  // ---------- Vertebral column ----------
  'Intervertebral symphysis': d(
    '47–48, 50–51',
    'La unión de los cuerpos vertebrales: articulaciones cartilaginosas (sínfisis) en las que cada **disco intervertebral** se adhiere a las caras de las dos vértebras, envuelto en un estuche fibroso reforzado delante y detrás por los ligamentos longitudinales.',
    'El disco es más alto cuanto más móvil es la región: 2/5 de la altura del cuerpo en el cuello, 1/5 en el tórax, 1/3 en la región lumbar. Junto con la forma de las vértebras, su espesor desigual (mayor delante en cuello y lumbar, detrás en el tórax) dibuja las curvaturas de la columna.',
  ),
  'Fibrous joints of vertebral column': d(
    '48–50',
    'Los **ligamentos de la columna**, que unen las vértebras a distancia de sus superficies: los longitudinales anterior y posterior a lo largo de los cuerpos; los **amarillos** entre las láminas; los interespinosos y el supraespinoso (en el cuello, el **ligamento nucal**) entre los procesos espinosos, y los intertransversos entre los transversos.',
    'Los posteriores se tensan en la flexión y la frenan; la extensión la limita el choque de los procesos articulares, por eso es más corta.',
  ),
  'Anterior longitudinal ligament': d(
    '48',
    'Cinta fibrosa larga sobre la cara anterior de los cuerpos y los discos, a los que se adhiere en toda su extensión, desde la porción basilar del occipital hasta la segunda vértebra sacra. Estrecho en el cuello, entre los músculos largos, se ensancha hacia abajo; limita la extensión de la columna.',
  ),
  'Posterior longitudinal ligament': d(
    '48',
    'Cinta fibrosa sobre la cara posterior de los cuerpos y los discos, en la pared anterior del conducto vertebral, desde el foramen magno (donde se une a la duramadre) hasta el cóccix. Sus bordes forman festones que se ensanchan sobre cada disco. Detrás de él está la médula, a la que alcanzan las hernias discales que salen hacia atrás.',
  ),
  'Ligamenta flava': d(
    '49, 51',
    'Los **ligamentos amarillos**, uno a cada lado en cada espacio entre láminas, de la cara anterior de la lámina de arriba al borde superior de la de abajo. Hechos de fibras elásticas, muy resistentes, son más altos y gruesos cuanto más bajos; su cara anterior da al espacio epidural y refuerza por dentro la cápsula de las articulaciones cigapofisarias.',
  ),
  'Interspinous ligaments': d(
    '40, 49, 51',
    'Láminas fibrosas que llenan el espacio entre dos procesos espinosos, de su borde inferior al superior del siguiente, desde los ligamentos amarillos delante hasta la punta del proceso detrás. En la región lumbar los espacios interespinosos son verticales y anchos: por ellos se hace la punción lumbar.',
  ),
  'Supraspinous ligament': d(
    '50',
    'Cordón fibroso impar que une las puntas de los procesos espinosos a lo largo de la columna torácica y lumbar, engrosamiento del borde posterior de los interespinosos; en él se insertan el trapecio y el dorsal ancho. En el cuello continúa como **ligamento nucal**.',
  ),
  'Nuchal ligament': d(
    '50',
    'La continuación cervical del supraespinoso, convertida en un tabique fibroelástico mediano: de la protuberancia occipital externa al proceso espinoso de C7, unido en profundidad a los espinosos cervicales. Separa los músculos de la nuca de ambos lados y, como el peso de la cabeza cae delante, ayuda a sostenerla.',
  ),
  'Intertransverse ligaments': d(
    '50',
    'Fascículos entre los procesos transversos vecinos: delgados en el tórax, más fuertes en la región lumbar (donde van de proceso accesorio a proceso accesorio), y en el cuello reemplazados por los músculos intertransversos.',
  ),
  'Intercornual ligament': d(
    '52',
    'Ligamento corto que une las **astas del sacro** con las del cóccix a cada lado, parte de los medios de unión de la articulación sacrococcígea (ligamento sacrococcígeo posterior superficial, que se apoya en las astas).',
  ),
  'Sacrococcygeal symphysis': d(
    '52–53',
    'La unión del vértice del sacro, convexo, con la base del cóccix, algo cóncava: una sínfisis cuyo disco es aquí sólo fibroso, rodeada de ligamentos sacrococcígeos anterior, posteriores y laterales; no hay articulaciones posteriores. Apenas se mueve, salvo en el parto, cuando la cabeza fetal empuja el cóccix hacia atrás y agranda el estrecho inferior de la pelvis.',
  ),

  'Sacrococcygeal joint': d(
    '52–53',
    'La unión del **sacro** con el **cóccix**: una sínfisis entre el vértice del sacro, convexo, y la base del cóccix, algo cóncava, con un disco sólo fibroso (el ligamento sacrococcígeo posterior profundo) y ligamentos sacrococcígeos anterior, posterior superficial y laterales; las astas de los dos huesos se unen por los ligamentos intercornuales.',
    'Las piezas del cóccix se unen entre sí del mismo modo, por **sínfisis intercoccígeas** que suelen soldarse con la edad. El conjunto apenas se mueve, salvo en el parto, cuando el cóccix retrocede y agranda el estrecho inferior de la pelvis.',
  ),
  'Zygapophysial joints': d(
    '48, 51',
    'Las articulaciones de los **procesos articulares** de cada vértebra con los de la siguiente, a uno y otro lado del arco: la carilla inferior de la vértebra de arriba sobre la superior de la de abajo. Son **sinoviales planas** en el cuello y el tórax y **trocoides** en la región lumbar, donde la vértebra superior encaja su carilla convexa en la cóncava de la inferior.',
    'Su orientación regula lo que permite cada región: casi planas y oblicuas en el cuello, las más verticales en el tórax, en segmentos de cilindro en la región lumbar. La cápsula es delgada y laxa en el cuello, más firme en el tórax y más resistente aún en la región lumbar; la refuerzan por dentro los ligamentos amarillos y, en las dos últimas regiones, un ligamento posterior. Su pequeña sinovial cuenta mucho en la patología de la columna.',
  ),
  'Atlanto-occipital joint': d(
    '117–119',
    'La articulación de la cabeza con la columna: los dos **cóndilos del occipital**, alargados, oblicuos hacia delante y medialmente y convexos en todos los sentidos, sobre las **carillas articulares superiores del atlas**, cóncavas, que miran arriba y medialmente. Es una sinovial **condílea** doble, derecha e izquierda.',
    'Cada cápsula es gruesa delante, detrás y a los lados y delgada por dentro; las completan las membranas atlantooccipitales anterior y posterior, esta última entre el foramen magno y el arco posterior del atlas, atravesada por la arteria vertebral y el primer nervio cervical. En ella se hace la flexión y la extensión de la cabeza (el gesto de decir sí) y una ligera inclinación lateral. Sus sinoviales son lo bastante amplias para enfermar (mal de Pott suboccipital).',
  ),
  'Median atlanto-axial joint': d(
    '117–119',
    'El pivote de la cabeza: el **diente del axis** gira dentro de un anillo osteofibroso formado delante por el arco anterior del atlas, con su fosita del diente, y detrás por el **ligamento transverso del atlas**, tendido de una masa lateral a la otra. Con sus fascículos longitudinales, que suben al foramen magno y bajan al cuerpo del axis, el transverso forma el ligamento cruciforme. Es una **trocoide** con dos cavidades, delante y detrás del diente.',
    'Con las dos laterales hace la rotación de la cabeza (el gesto de decir no). El diente rodea el paso del bulbo a la médula: su fractura o la rotura del ligamento transverso son graves por la cercanía de esos centros vitales.',
  ),
  'Lateral atlanto-axial joint': d(
    '117–118',
    'Las dos articulaciones de las **masas laterales del atlas**, por sus carillas inferiores, que miran abajo y medialmente, con las **carillas superiores del axis**, a los lados del diente. Reproducen las cigapofisarias de más abajo y son **sinoviales planas**, pero su cartílago las vuelve convexas, sobre todo de delante atrás, lo que favorece que el atlas gire sobre el axis.',
    'Las unen los ligamentos atlantoaxoideos anterior, del arco anterior del atlas al cuerpo del axis, y posterior, del arco posterior a las láminas del axis, equivalente a los ligamentos amarillos.',
  ),
  'Tectorial membrane and alar ligaments': d(
    '117, 119',
    'Los ligamentos que unen el **occipital** al **axis** sin contacto articular entre ellos, dentro del conducto vertebral: la **membrana tectoria**, que baja del borde anterior del foramen magno a la cara posterior del cuerpo del axis pasando por detrás del diente y del ligamento transverso, con dos fascículos laterales accesorios; y los ligamentos que sujetan el diente al foramen magno.',
    'Éstos son el **ligamento del vértice del diente**, corto y medio, y los dos **ligamentos alares**, cortos y poderosos, de la cara medial de los cóndilos a los lados del vértice del diente, que frenan la rotación. Detrás de la membrana tectoria se continúa el ligamento longitudinal posterior.',
  ),

  // ---------- Thorax ----------
  'Joints of head of rib': d2(
    '833–834',
    'Cada **cabeza costal** se articula con los cuerpos de dos vértebras vecinas y con el disco entre ellos: dos carillas de la cabeza, separadas por una cresta, sobre las fositas costales de las dos vértebras. Es una sinovial plana; un ligamento intraarticular, de la cresta al disco, la divide a menudo en dos cavidades, y la refuerzan el ligamento radiado delante y un ligamento posterior.',
    'Las costillas 1.ª, 11.ª y 12.ª tocan una sola vértebra y tienen una sola cavidad, con un ligamento interóseo rudimentario o ausente. Por pequeños que sean sus movimientos, de ellas y de las costotransversas depende toda la mecánica del tórax.',
  ),
  'Costotransverse joints': d2(
    '834–835',
    'La articulación del **tubérculo costal**, por su carilla oval y algo convexa, con la fosita costal del **proceso transverso** de la vértebra de su mismo número: una sinovial plana, de cápsula pequeña y sinovial rudimentaria, que falta en las costillas 11.ª y 12.ª. Las costillas medias e inferiores quedan algo por encima de su proceso, tanto más cuanto más bajas.',
    'La unen el ligamento costotransverso, corto y potente, del cuello costal a la cara anterior del proceso, el superior, que sube al proceso de arriba, el lateral, del tubérculo al vértice del proceso, y el costolaminar. Sus arterias vienen de las ramas dorsales de las intercostales; sus nervios, de los ramos posteriores torácicos.',
  ),
  'Costochondral joints': d2(
    '836',
    'La unión de cada una de las diez primeras **costillas** con su **cartílago costal**: el extremo anterior de la costilla tiene una fosita elipsoidea donde encaja el extremo del cartílago, configurado a la inversa, y el periostio se continúa con el pericondrio. La unión es absoluta, sin cavidad ni movimiento propio; los cartílagos de las costillas 11.ª y 12.ª terminan libres.',
  ),
  'Synchondrosis of first rib': d2(
    '836',
    'La unión del **primer cartílago costal** con el **manubrio**: superficies planas y, sólo rara vez, una cavidad; casi siempre el cartílago se continúa con el esternón en una **sincondrosis**. En su borde superior, dos pequeños ligamentos, anterior y posterior, dejan entre ellos una depresión para la clavícula: así participa en la articulación esternoclavicular.',
  ),
  'Sternocostal joints': d2(
    '835–836',
    'La articulación de los cartílagos 2.º a 7.º con las **incisuras costales** del borde del esternón: cada cartílago termina en una cuña con dos carillas, superior e inferior, que entra en una escotadura de dos carillas, abierta en la línea de soldadura de dos piezas del esternón; las incisuras están más cerca entre sí cuanto más abajo. Son **sinoviales planas**, como las costovertebrales; el 2.º cartílago llega a la unión del manubrio con el cuerpo.',
    'Las une una pequeña cápsula, continuación del pericondrio con el periostio, reforzada por los **ligamentos radiados** anterior y posterior, en abanico, y por un ligamento intraarticular, de la arista del cartílago al fondo de la escotadura, que las divide en una o dos sinoviales. Los radiados anteriores se entrecruzan formando la membrana esternal; la 7.ª añade el ligamento costoxifoideo. Los cartílagos 8.º a 10.º no llegan al esternón: se unen al 7.º.',
  ),
  'Interchondral joints': d2(
    '836',
    'Las uniones de los cartílagos costales entre sí, de la 5.ª a la 10.ª costilla: en los bordes que se tocan, cada cartílago tiene un pequeño ensanchamiento con una carilla oval. El 7.º se articula con el 6.º y el 8.º; el 9.º y el 10.º, incurvados hacia arriba, se unen al de encima y cierran el **arco costal**. Las mantiene el pericondrio, reforzado delante y detrás por fascículos fibrosos.',
  ),
  'Manubriosternal joint': {
    text: [
      'La unión del **manubrio** con el **cuerpo del esternón** por un fibrocartílago muy denso: una sínfisis, que con la edad suele osificarse. Forma un ángulo saliente hacia delante, el **ángulo esternal** (de Louis), que se palpa bajo la piel a la altura de los segundos cartílagos costales: es el punto de partida para contar las costillas.',
    ],
    sources: [LR2('827–828, 836')],
  },
  'Xiphisternal joint': d2(
    '836, 846',
    'La unión del cuerpo del **esternón** con el **proceso xifoides** por una lámina cartilaginosa, que desaparece con la edad al osificarse. Delante de ella se fija el ligamento costoxifoideo del 7.º cartílago; detrás se insertan los fascículos esternales del diafragma.',
  ),
  'Radiate ligament of head of rib': d2('834', 'Ligamento en abanico de la cara anterior de la cabeza costal: su vértice en la cabeza y su base en las dos vértebras vecinas y en el disco intervertebral.'),
  'Intra-articular ligament of head of rib': d2(
    '834',
    'Fascículo corto de la cresta de la cabeza costal a la cara lateral del disco intervertebral, que divide la articulación en dos cavidades sinoviales; falta en las costillas 1.ª, 11.ª y 12.ª, que tocan una sola vértebra.',
  ),
  'Costotransverse ligament': d2(
    '835',
    'Ligamento corto y potente del cuello de la costilla a la cara anterior del proceso transverso, el principal medio de unión de la articulación costotransversa; lo acompañan los ligamentos superior, lateral y costolaminar.',
  ),
  'Fibrous joints of thorax': d2(
    '842–843',
    'Las **membranas intercostales**, que completan los espacios donde falta músculo: la externa delante, donde el intercostal externo se termina cerca de los cartílagos; la interna detrás, donde el intercostal interno, que sólo ocupa la parte anterior del espacio, no llega.',
  ),
  'External intercostal membrane': d2(
    '832, 842',
    'Lámina fibrosa que continúa al músculo intercostal externo hacia delante, entre los cartílagos costales, hasta el esternón, con fibras de la misma dirección (abajo y adelante).',
  ),
  'Internal intercostal membrane': d2(
    '842–843',
    'Lámina fibrosa que ocupa la parte posterior del espacio intercostal, hasta la columna, en el plano del músculo intercostal interno, que no llega tan atrás; detrás de ella corren los vasos intercostales al entrar en el espacio.',
  ),
}

// ---------- Discs and nuclei, by level ----------

const DISC =
  'Lente biconvexa adherida a las caras de los dos cuerpos: un **anillo fibroso** periférico de laminillas cruzadas, duro y elástico, rodea un centro blando, el **núcleo pulposo**, algo más cerca del borde posterior. El disco reparte las presiones y permite el movimiento; con la edad se deshidrata y la columna pierde altura y flexibilidad.'
const NUCLEUS =
  'El **núcleo pulposo**, centro gelatinoso del disco, transparente en el joven y amarillento y seco con los años, poco irrigado. Reparte en todas direcciones la presión que recibe y se desplaza en los movimientos, dentro de lo que permite el anillo fibroso; si el anillo se rompe, sale hacia atrás o atrás y afuera (**hernia discal**) y puede comprimir las raíces espinales.'

const LEVEL: Record<string, string> = {
  cervical: 'disco cervical, relativamente alto (2/5 del cuerpo vertebral) y más grueso delante; a sus lados, las articulaciones uncovertebrales. Sus hernias dan neuralgias cervicobraquiales.',
  thoracic: 'disco torácico, delgado (1/5 del cuerpo), más grueso detrás, en una región de poca movilidad; la cabeza de las costillas se apoya en él.',
  lumbar: 'disco lumbar, el más grueso (1/3 del cuerpo) y más alto delante; región móvil y cargada, asiento de las hernias que dan lumbociáticas.',
}

function levelOf(a: string): keyof typeof LEVEL {
  return a.startsWith('C') ? 'cervical' : a.startsWith('T') ? 'thoracic' : 'lumbar'
}

const LEVELS = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1']

const SPECIAL: Record<string, string> = {
  'C7-T1': 'Disco de la charnela cervicotorácica, entre C7 y T1.',
  'T12-L1': 'Disco de la charnela toracolumbar, entre T12 y L1.',
  'L5-S1':
    'Disco de la **charnela lumbosacra**, el más grueso de todos y cuneiforme, mucho más alto delante: llena el ángulo entre L5 y el sacro inclinado y frena el deslizamiento de L5 hacia delante. Asiento frecuente de hernias.',
}

const discs: Record<string, Description> = {}
for (let i = 0; i < LEVELS.length - 1; i++) {
  const [a, b] = [LEVELS[i], LEVELS[i + 1]]
  const pair = `${a}-${b}`
  const lead = SPECIAL[pair] ?? `Disco entre ${a} y ${b}: ${LEVEL[levelOf(a)]}`
  const pages = pair === 'L5-S1' ? '47–48, 51' : '47–48, 50–51'
  discs[`Intervertebral disc ${pair}`] = { text: [lead, DISC], sources: [LR(pages)] }
  discs[`Nucleus pulposus ${pair}`] = { text: [`Núcleo pulposo del disco ${a}–${b}.`, NUCLEUS], sources: [LR('47–48, 63')] }
}

export const trunkJoints: Record<string, Description> = { ...joints, ...discs }
