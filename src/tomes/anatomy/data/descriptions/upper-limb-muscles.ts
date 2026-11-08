import type { Description, DescriptionSource } from './index'

/**
 * The muscles of the upper limb and those that tie it to the trunk (myology viewer), after
 * Latarjet–Ruiz Liard's chapters 55–58. The model splits some muscles into heads or parts, each
 * one selectable: they share their muscle's text, led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })

interface Muscle {
  text: string[]
  sources: DescriptionSource[]
  /** The model's heads or parts, each with its own first line; without them the muscle is one piece. */
  parts?: Record<string, string>
  /** The muscle's own name in the model, when it is a single piece. */
  en?: string
}

const MUSCLES: Muscle[] = [
  // ---------- From the trunk to the shoulder girdle ----------
  {
    text: [
      'Gran lámina triangular de la nuca y la espalda, del occipital y el ligamento nucal a las apófisis espinosas de todas las vértebras torácicas, que converge sobre el tercio lateral de la clavícula, el acromion y la espina de la escápula. Lo inerva el **nervio accesorio** (XI), con ramos del plexo cervical.',
      'Sus fibras superiores elevan el hombro, las medias lo llevan atrás y las inferiores lo bajan; superiores e inferiores juntas hacen girar la escápula para que el brazo suba por encima de la horizontal.',
    ],
    sources: [LR('479–480'), MOORE('166')],
    parts: {
      'Descending part of trapezius muscle': 'Porción **descendente** (superior) del trapecio, del occipital y el ligamento nucal al tercio lateral de la clavícula: eleva el hombro.',
      'Transverse part of trapezius muscle': 'Porción **transversa** (media) del trapecio, de fibras horizontales hasta el acromion y la espina de la escápula: lleva la escápula hacia la columna.',
      'Ascending part of trapezius muscle': 'Porción **ascendente** (inferior) del trapecio, de las últimas vértebras torácicas a la espina de la escápula: baja la escápula y la hace girar.',
    },
  },
  {
    en: 'Rhomboid major muscle',
    text: [
      '**Romboides mayor**, la parte inferior del romboides: de las apófisis espinosas de las primeras vértebras torácicas al borde medial de la escápula, entre la espina y el ángulo inferior, bajo el trapecio. Lo inerva el **nervio dorsal de la escápula** (C5). Acerca la escápula a la columna y la eleva, haciéndola girar de modo que la cavidad glenoidea baje.',
    ],
    sources: [LR('480–481')],
  },
  {
    en: 'Rhomboid minor muscle',
    text: [
      '**Romboides menor**, la parte superior del romboides, a veces separada del mayor: de la parte baja del ligamento nucal y la apófisis espinosa de C7 y T1 al borde medial de la escápula a la altura de la espina. Nervio dorsal de la escápula; misma acción que el mayor.',
    ],
    sources: [LR('480–481')],
  },
  {
    en: 'Levator scapulae',
    text: [
      'Músculo estrecho de la parte lateral de la nuca, bajo el trapecio: de las apófisis transversas del atlas y de C2–C4 al ángulo superior de la escápula y su borde medial encima de la espina. Lo inerva el **nervio dorsal de la escápula** con ramos del plexo cervical. Eleva el ángulo superior de la escápula; con el hombro fijo, inclina el cuello.',
    ],
    sources: [LR('481–482')],
  },
  {
    en: 'Serratus anterior muscle',
    text: [
      'Músculo ancho y radiado que aplica la escápula contra el tórax: del labio anterior del borde medial de la escápula, en tres grupos, a las nueve primeras costillas, el inferior el más grueso. Lo inerva el **nervio torácico largo** (C5–C7), que baja por su cara lateral.',
      'Lleva la escápula hacia delante (empujar, dar un puñetazo) y hace girar su ángulo inferior hacia fuera para elevar el brazo. Si se paraliza, el borde medial se despega del tórax: la **escápula alada**.',
    ],
    sources: [LR('482–483'), MOORE('179')],
  },
  {
    en: 'Pectoralis minor muscle',
    text: [
      'Músculo triangular bajo el pectoral mayor, de las costillas 3.ª a 5.ª al borde medial del **proceso coracoides**. Forma parte de la pared anterior de la axila y cruza por delante la arteria axilar, que divide en tres partes. Lo inerva el **nervio pectoral medial**. Baja y lleva hacia delante el hombro; con la escápula fija, eleva las costillas.',
    ],
    sources: [LR('483–484'), MOORE('183')],
  },
  {
    en: 'Subclavius muscle',
    text: [
      'Pequeño músculo fusiforme del primer cartílago costal a la cara inferior de la clavícula, envuelto por la fascia clavipectoral. Su interés es topográfico más que funcional: está entre la clavícula y los vasos subclavios y el plexo braquial. Lo inerva el **nervio del subclavio** (C5–C6). Baja la clavícula y la fija contra el esternón.',
    ],
    sources: [LR('484–485')],
  },
  {
    en: 'Latissimus dorsi muscle',
    text: [
      'Lámina muscular ancha, delgada y triangular de la parte baja de la espalda: nace de la fascia toracolumbar (apófisis espinosas de las últimas seis o siete torácicas y de las lumbares, cresta sacra, cresta ilíaca) y de las últimas costillas, sube por la axila y termina en el fondo del **surco intertubercular** del húmero. Lo inerva el **nervio toracodorsal** (C6–C8).',
      'Aduce, extiende y rota hacia dentro el brazo; tomando apoyo en el húmero levanta el tronco al trepar.',
    ],
    sources: [LR('485–487')],
  },

  // ---------- From the girdle to the humerus ----------
  {
    text: [
      'Semicono muscular que envuelve la articulación del hombro y le da su relieve redondeado: del tercio lateral de la clavícula, el acromion y la espina de la escápula a la **tuberosidad deltoidea** del húmero. Lo inerva el **nervio axilar** (C5–C6), que rodea el cuello quirúrgico.',
      'Su parte media es el gran abductor del brazo una vez iniciado el movimiento; la anterior flexiona y rota hacia dentro, la posterior extiende y rota hacia fuera.',
    ],
    sources: [LR('487–488'), MOORE('181')],
    parts: {
      'Clavicular part of deltoid muscle': 'Porción **clavicular** (anterior) del deltoides, del tercio lateral de la clavícula: flexiona el brazo y lo rota hacia dentro.',
      'Acromial part of deltoid muscle': 'Porción **acromial** (media) del deltoides, multipenniforme, del borde lateral del acromion: es la que abduce el brazo.',
      'Scapular spinal part of deltoid muscle': 'Porción **espinal** (posterior) del deltoides, del borde inferior de la espina de la escápula: extiende el brazo y lo rota hacia fuera.',
    },
  },
  {
    text: [
      'Gran músculo en abanico de la pared anterior del tórax y de la axila, en tres porciones que terminan por un tendón común en la **cresta del tubérculo mayor** del húmero. Lo inervan los **nervios pectorales** lateral y medial.',
      'Aduce el brazo y lo rota hacia dentro; la porción clavicular lo flexiona, la esternocostal lo extiende desde la flexión. Con el brazo fijo, tira del tórax al trepar.',
    ],
    sources: [LR('488–489')],
    parts: {
      'Clavicular head of pectoralis major muscle': 'Porción **clavicular** del pectoral mayor, de los dos tercios mediales del borde anterior de la clavícula; separada del deltoides por el surco deltopectoral, donde corre la vena cefálica.',
      'Sternocostal head of pectoralis major muscle': 'Porción **esternocostal** del pectoral mayor, de la cara anterior del esternón y de las siete primeras costillas y sus cartílagos.',
      '(Abdominal part of pectoralis major muscle)': 'Porción **abdominal** del pectoral mayor, la más baja y delgada, de la hoja anterior de la vaina del recto del abdomen.',
    },
  },
  {
    en: 'Subscapularis muscle',
    text: [
      'Músculo ancho y grueso que ocupa la **fosa subescapular** y termina por un tendón adherido a la cápsula en el **tubérculo menor** del húmero. Es el único rotador interno del manguito de los rotadores y cierra por delante la articulación, sobre el foramen oval de la cápsula. Lo inervan los **nervios subescapulares** superior e inferior.',
    ],
    sources: [LR('489–490'), LR('475')],
  },
  {
    en: 'Supraspinatus muscle',
    text: [
      'Llena la **fosa supraespinosa** y pasa bajo el acromion y el ligamento coracoacromial, pegado a la cápsula, hasta la carilla superior del **tubérculo mayor**. Lo inerva el **nervio supraescapular** (C5). Mantiene la cabeza del húmero contra la cavidad glenoidea e inicia la abducción.',
      'Su tendón, aplicado contra la bóveda acromiocoracoidea y separado de ella sólo por la bolsa subacromial, es el que más se lesiona del manguito de los rotadores.',
    ],
    sources: [LR('490–491'), MOORE('182')],
  },
  {
    en: 'Infraspinatus muscle',
    text: [
      'Músculo triangular que llena los dos tercios mediales de la **fosa infraespinosa** y termina, adherido a la cápsula, en la carilla media del **tubérculo mayor**. Lo inerva el **nervio supraescapular**, que llega rodeando la espina de la escápula. Rota el brazo hacia fuera y, como ligamento activo, aplica la cabeza del húmero contra la cavidad glenoidea.',
    ],
    sources: [LR('491–492')],
  },
  {
    en: 'Teres minor muscle',
    text: [
      'Pequeño músculo del borde lateral de la escápula, bajo el infraespinoso, a la carilla inferior del **tubérculo mayor**. Lo inerva el **nervio axilar**. Rota el brazo hacia fuera y forma parte del manguito de los rotadores; por debajo de él, entre la porción larga del tríceps y el húmero, pasan el nervio axilar y la arteria circunfleja humeral posterior.',
    ],
    sources: [LR('492–493'), LR('478')],
  },
  {
    en: 'Teres major muscle',
    text: [
      'Músculo grueso del ángulo inferior y el tercio inferior del borde lateral de la escápula a la **cresta del tubérculo menor** del húmero, justo detrás del tendón del dorsal ancho. Forma con él la pared posterior de la axila. Lo inerva el **nervio subescapular inferior**. Aduce el brazo y lo rota hacia dentro; no pertenece al manguito de los rotadores.',
    ],
    sources: [LR('493')],
  },
  {
    en: 'Coracobrachialis muscle',
    text: [
      'Del vértice del **proceso coracoides**, por un tendón común con la porción corta del bíceps, al tercio superior de la cara medial del húmero. A lo largo de su borde medial corre el paquete vasculonervioso de la axila, y lo atraviesa el **nervio musculocutáneo**, que lo inerva. Flexiona y aduce el brazo.',
    ],
    sources: [LR('494')],
  },

  // ---------- Arm ----------
  {
    text: [
      'Músculo largo y robusto de la cara anterior del brazo, de dos porciones que se unen en un tendón en la **tuberosidad del radio**, con una expansión (el lacerto fibroso) a la fascia del antebrazo. Lo inerva el **nervio musculocutáneo**.',
      'Es el gran **supinador** del antebrazo y lo flexiona con más fuerza cuanto más supinado está; en pronación casi no actúa. Su porción larga ayuda además a mantener la cabeza del húmero en la cavidad glenoidea al cargar peso.',
    ],
    sources: [LR('508–510, 515')],
    parts: {
      'Long head of biceps brachii': 'Porción **larga** del bíceps: su tendón nace del tubérculo supraglenoideo y del labro, cruza la articulación del hombro por dentro de la cápsula y baja por el surco intertubercular.',
      'Short head of biceps brachii': 'Porción **corta** del bíceps: nace del vértice del proceso coracoides por un tendón común con el coracobraquial.',
    },
  },
  {
    en: 'Brachialis muscle',
    text: [
      'El «flexor corto» del antebrazo: de la mitad inferior de la cara anterior del húmero y los tabiques intermusculares a la **tuberosidad del cúbito**, por debajo del proceso coronoides, bajo el bíceps. Lo inerva el **nervio musculocutáneo**, con un ramo del radial. Flexiona el codo en cualquier posición del antebrazo: es el flexor que trabaja siempre.',
    ],
    sources: [LR('510–511, 515')],
  },
  {
    text: [
      'Único músculo de la cara posterior del brazo, de tres porciones que terminan en un tendón común en el **olécranon**. Lo inerva el **nervio radial**. Es el extensor del codo; la porción medial es la que más trabaja, y la larga además fija la cabeza del húmero contra la cavidad glenoidea en los esfuerzos.',
    ],
    sources: [LR('511–513, 515')],
    parts: {
      'Long head of triceps brachii': 'Porción **larga** del tríceps: nace del tubérculo infraglenoideo de la escápula, por lo que también extiende y aduce el brazo; separa los espacios por donde pasan el nervio axilar y la arteria circunfleja humeral posterior.',
      'Lateral head of triceps brachii': 'Porción **lateral** del tríceps: nace de la cara posterior del húmero por encima del surco del nervio radial y del tabique intermuscular lateral.',
      'Medial head of triceps brachii': 'Porción **medial** del tríceps: nace de la cara posterior del húmero por debajo del surco del nervio radial; la más profunda y la que más actúa en la extensión.',
    },
  },
  {
    en: 'Anconeus muscle',
    text: [
      'Pequeño músculo triangular de la cara posterior del epicóndilo lateral a la cara posterior del cúbito, justo bajo el olécranon. Comparte la inervación del tríceps (nervio radial) y su acción: aporta una quinta parte de la fuerza de la extensión del codo.',
    ],
    sources: [LR('513, 547')],
  },

  // ---------- Forearm, front ----------
  {
    text: [
      'El más lateral de los músculos epicondíleos mediales: de dos fascículos, epicondíleo y coronoideo, cruza en diagonal el antebrazo hasta la cara lateral del radio, en su mitad. Entre sus dos fascículos pasa el **nervio mediano**, que lo inerva. Prona el antebrazo y ayuda a flexionar el codo.',
    ],
    sources: [LR('520–521')],
    parts: {
      'Superficial head of pronator teres': 'Fascículo **humeral** (superficial) del pronador redondo, fuerte y grueso, de la cara anterior del epicóndilo medial.',
      'Deep head of pronator teres': 'Fascículo **cubital** (profundo) del pronador redondo, estrecho y delgado, del proceso coronoides del cúbito.',
    },
  },
  {
    en: 'Pronator quadratus',
    text: [
      'Músculo cuadrilátero y profundo del cuarto inferior del antebrazo, tendido transversalmente del borde anterior del cúbito a la cara anterior del radio, detrás de los tendones flexores (el espacio de Parona los separa). Lo inerva el **nervio interóseo anterior** (del mediano). Es el principal pronador.',
    ],
    sources: [LR('521–522')],
  },
  {
    en: 'Flexor carpi radialis',
    text: [
      'Del epicóndilo medial a la base del **segundo metacarpiano**, por un tendón que pasa por un conducto propio del retináculo flexor, junto al tubérculo del trapecio. Lo inerva el **nervio mediano**. Flexiona la mano y la inclina hacia el radio. Su tendón es la referencia para tomar el pulso radial, que late por fuera de él.',
    ],
    sources: [LR('534–535'), LR('570')],
  },
  {
    en: 'Palmaris longus muscle',
    text: [
      'Músculo delgado del epicóndilo medial, de tendón largo que pasa por delante del retináculo flexor y se expande en la **aponeurosis palmar**. Lo inerva el **nervio mediano**. Es el más débil de los flexores de la mano y tensa la aponeurosis; falta en una parte de las personas.',
    ],
    sources: [LR('535, 570'), MOORE('217')],
  },
  {
    text: [
      'El más medial de los músculos anteriores del antebrazo, de dos fascículos (humeral y cubital) unidos por un arco bajo el que el **nervio cubital** pasa del codo al antebrazo; ese mismo nervio lo inerva. Termina en el **pisiforme** y, a través de él, en el ganchoso y el quinto metacarpiano. Flexiona la mano y la inclina hacia el cúbito.',
    ],
    sources: [LR('535–537'), LR('570')],
    parts: {
      'Humeral head of flexor carpi ulnaris': 'Fascículo **humeral** del flexor cubital del carpo, del vértice del epicóndilo medial.',
      'Ulnar head of flexor carpi ulnaris': 'Fascículo **cubital** del flexor cubital del carpo, del borde medial del olécranon y los dos tercios superiores del borde posterior del cúbito.',
    },
  },
  {
    text: [
      'Músculo potente que ocupa casi todo el ancho del antebrazo y envía cuatro tendones a los dedos 2.º a 5.º, por el túnel carpiano. Cada tendón se abre en dos lengüetas en la falange proximal, deja pasar al del flexor profundo y termina en los bordes de la **falange media**. Lo inerva el **nervio mediano**. Flexiona la falange media, y después la proximal y la mano.',
    ],
    sources: [LR('537–538')],
    parts: {
      'Humero-ulnar head of flexor digitorum superficialis': 'Cabeza **humerocubital** del flexor superficial de los dedos, del epicóndilo medial y del proceso coronoides; entre ella y la radial se tiende el arco bajo el que pasan el nervio mediano y la arteria cubital.',
      'Radial head of flexor digitorum superficialis': 'Cabeza **radial** del flexor superficial de los dedos, del borde anterior del radio por debajo de su tuberosidad.',
    },
  },
  {
    en: 'Flexor digitorum profundus',
    text: [
      'Del cúbito y la membrana interósea a la base de la **falange distal** de los dedos 2.º a 5.º; sus tendones atraviesan los del flexor superficial y dan origen a los lumbricales. Es el único que flexiona la falange distal. Inervación doble: la parte de los dedos índice y medio, el **interóseo anterior** (mediano); la del anular y el meñique, el **nervio cubital**.',
    ],
    sources: [LR('538–541'), MOORE('241')],
  },
  {
    en: 'Flexor pollicis longus',
    text: [
      'De los tres cuartos superiores de la cara anterior del radio y la membrana interósea a la base de la **falange distal del pulgar**, pasando por el túnel carpiano. Lo inerva el **nervio interóseo anterior** (del mediano). Es el único flexor de la falange distal del pulgar.',
    ],
    sources: [LR('541–542')],
  },

  // ---------- Forearm, back and side ----------
  {
    en: 'Brachioradialis muscle',
    text: [
      'Del tercio inferior del borde lateral del húmero a la base del **proceso estiloides del radio**, formando el relieve lateral del antebrazo. Aunque está en el compartimento posterior y lo inerva el **nervio radial**, es flexor del codo, sobre todo con el antebrazo a medio camino entre pronación y supinación y en la flexión rápida o contra resistencia.',
    ],
    sources: [LR('550, 515')],
  },
  {
    en: 'Extensor carpi radialis longus',
    text: [
      'Del borde lateral del húmero, bajo el braquiorradial, a la base dorsal del **segundo metacarpiano**, a la misma altura que el flexor radial del carpo por delante. Lo inerva el **nervio radial**. Extiende la mano y la inclina hacia el radio.',
    ],
    sources: [LR('550, 570')],
  },
  {
    en: 'Extensor carpi radialis brevis',
    text: [
      'De la masa común del epicóndilo lateral y el ligamento colateral radial al proceso estiloides de la base del **tercer metacarpiano**. Lo inerva el ramo profundo del **nervio radial**. Es el extensor más directo de la mano, el que la fija antes de cualquier gesto de prensión.',
    ],
    sources: [LR('550–551, 570')],
  },
  {
    en: 'Extensor digitorum',
    text: [
      'Músculo de la masa epicondílea lateral que envía cuatro tendones a los dedos 2.º a 5.º, bajo el retináculo extensor, unidos entre sí en el dorso de la mano. Cada tendón se abre en una expansión dorsal que recibe los interóseos y lumbricales y termina en las falanges media y distal. Lo inerva el ramo profundo del **nervio radial**. Extiende sobre todo las falanges proximales y, después, la mano.',
    ],
    sources: [LR('545–546')],
  },
  {
    en: 'Extensor digiti minimi',
    text: [
      'Músculo largo y delgado de la masa epicondílea lateral, medial al extensor de los dedos; su tendón pasa por una vaina propia sobre la cabeza del cúbito y se une al tendón que el extensor de los dedos envía al meñique. Nervio radial. Da al meñique una extensión algo independiente.',
    ],
    sources: [LR('546')],
  },
  {
    text: [
      'Del epicóndilo lateral y del borde posterior del cúbito a la base del **quinto metacarpiano**, con su tendón por un compartimento propio detrás de la cabeza del cúbito. Lo inerva el ramo profundo del **nervio radial**. Extiende la mano y la inclina hacia el cúbito.',
    ],
    sources: [LR('547, 570')],
    parts: {
      'Humeral head of extensor carpi ulnaris': 'Fascículo **humeral** del extensor cubital del carpo, de la masa común del epicóndilo lateral.',
      'Ulnar head of extensor carpi ulnaris': 'Fascículo **cubital** del extensor cubital del carpo, de la cara y el borde posterior del cúbito.',
    },
  },
  {
    en: 'Supinator',
    text: [
      'Músculo profundo que se enrolla alrededor del tercio superior del radio: del epicóndilo lateral, el ligamento colateral radial y la cresta del supinador del cúbito a las caras del radio. Entre sus dos planos atraviesa el **ramo profundo del nervio radial**, que lo inerva. Supina el antebrazo, sin la fuerza del bíceps pero en cualquier posición del codo.',
    ],
    sources: [LR('522–523')],
  },
  {
    en: 'Abductor pollicis longus',
    text: [
      'De la cara posterior del cúbito, la membrana interósea y el radio, cruza en diagonal el radio y pasa por el lado del proceso estiloides hasta la base del **primer metacarpiano**. Con el extensor corto forma el borde lateral de la tabaquera anatómica. Lo inerva el **nervio radial**. Abduce el pulgar, llevándolo hacia fuera y algo hacia delante.',
    ],
    sources: [LR('547')],
  },
  {
    en: 'Extensor pollicis brevis',
    text: [
      'Del cúbito, la membrana interósea y el radio, bajo el abductor largo, a la base de la **falange proximal del pulgar**. Forma con el abductor largo el borde lateral de la tabaquera anatómica. Nervio radial. Extiende la falange proximal del pulgar y ayuda a abducirlo.',
    ],
    sources: [LR('547–548')],
  },
  {
    en: 'Extensor pollicis longus',
    text: [
      'De la cara posterior del cúbito y la membrana interósea a la base de la **falange distal del pulgar**; su tendón rodea el tubérculo dorsal del radio por un surco propio y forma el borde medial de la tabaquera anatómica. Nervio radial. Extiende la falange distal del pulgar, sin ayuda de ningún músculo de la mano.',
    ],
    sources: [LR('548')],
  },
  {
    en: 'Extensor indicis',
    text: [
      'El más medial del plano profundo: de la cara posterior del cúbito y la membrana interósea al tendón que el extensor de los dedos envía al índice, con el que se fusiona a la altura de la metacarpofalángica. Nervio radial. Permite extender el índice solo.',
    ],
    sources: [LR('549')],
  },

  // ---------- Hand ----------
  {
    en: 'Abductor pollicis brevis',
    text: [
      'El más superficial de la **eminencia tenar**: del tubérculo del escafoides y el retináculo flexor a la base de la falange proximal del pulgar, por su lado lateral. Lo inerva el ramo recurrente del **nervio mediano**. Lleva el pulgar hacia delante, fuera del plano de la palma.',
    ],
    sources: [LR('553')],
  },
  {
    text: [
      'Músculo tenar de dos cabezas, separadas por el tendón del flexor largo del pulgar, que se unen en el tubérculo lateral de la base de la falange proximal del pulgar y su sesamoideo lateral. Flexiona la falange proximal del pulgar.',
    ],
    sources: [LR('553'), MOORE('253')],
    parts: {
      'Superficial head of flexor pollicis brevis': 'Cabeza **superficial** del flexor corto del pulgar, del tubérculo del trapecio y el retináculo flexor; la inerva el **nervio mediano**.',
      'Deep head of flexor pollicis brevis': 'Cabeza **profunda** del flexor corto del pulgar, del trapezoide y el hueso grande; la inerva el **nervio cubital**.',
    },
  },
  {
    en: 'Opponens pollicis muscle',
    text: [
      'Músculo tenar cuadrangular, bajo el abductor corto: del tubérculo del trapecio y el retináculo flexor a todo el borde lateral del **primer metacarpiano**. Lo inerva el **nervio mediano**. Hace girar y lleva hacia la palma el metacarpiano: la **oposición** que enfrenta el pulgar a los demás dedos.',
    ],
    sources: [LR('553–554')],
  },
  {
    text: [
      'El más profundo y medial de los músculos del pulgar, triangular, de dos cabezas que terminan en el tubérculo medial de la falange proximal del pulgar y su sesamoideo medial. Lo inerva el ramo profundo del **nervio cubital**. Acerca el pulgar a la palma y le da fuerza a la pinza.',
    ],
    sources: [LR('554')],
    parts: {
      'Oblique head of adductor pollicis': 'Cabeza **oblicua** del aductor del pulgar, del hueso grande, el trapezoide y las bases del 2.º y 3.er metacarpianos.',
      'Transverse head of adductor pollicis': 'Cabeza **transversa** del aductor del pulgar, de la cara palmar del tercer metacarpiano.',
    },
  },
  {
    en: 'Abductor digiti minimi of hand',
    text: [
      'El más superficial de la **eminencia hipotenar**: del pisiforme y una expansión del flexor cubital del carpo al lado medial de la base de la falange proximal del meñique, con una expansión a su extensor. Lo inerva el ramo profundo del **nervio cubital**. Separa el meñique.',
    ],
    sources: [LR('557')],
  },
  {
    en: 'Flexor digiti minimi of hand',
    text: [
      'Músculo hipotenar, lateral al abductor: del gancho del ganchoso y el retináculo flexor a la base de la falange proximal del meñique. Ramo profundo del **nervio cubital**, que pasa entre él y el oponente. Flexiona la falange proximal del meñique.',
    ],
    sources: [LR('557')],
  },
  {
    en: 'Opponens digiti minimi muscle of hand',
    text: [
      'El más profundo de los hipotenares: del gancho del ganchoso y el retináculo flexor a todo el borde medial del **quinto metacarpiano**. Ramo profundo del **nervio cubital**. Lleva el quinto metacarpiano hacia delante y lo hace girar, ahuecando la palma.',
    ],
    sources: [LR('557')],
  },
  {
    en: 'Lumbrical muscles of hand',
    text: [
      'Cuatro músculos finos, como lombrices, que nacen de los tendones del **flexor profundo** y terminan en el lado lateral de la expansión dorsal del extensor de cada dedo. Flexionan la metacarpofalángica y extienden las interfalángicas. Los dos laterales los inerva el **nervio mediano**; los dos mediales, el **cubital**.',
    ],
    sources: [LR('559'), MOORE('253')],
  },
  {
    en: 'Palmar interossei muscles',
    text: [
      'Tres músculos de los espacios 2.º a 4.º, cada uno de la cara del metacarpiano que mira al eje de la mano (el tercero) al tendón extensor de su dedo: índice, anular y meñique. Los inerva el ramo profundo del **nervio cubital**. **Aducen** los dedos hacia el eje del medio y, con los lumbricales, flexionan la metacarpofalángica y extienden las interfalángicas.',
    ],
    sources: [LR('559–560')],
  },
  {
    en: 'Dorsal interossei muscles of hand',
    text: [
      'Cuatro músculos peniformes que llenan los espacios intermetacarpianos, de las caras enfrentadas de dos metacarpianos al dedo vecino y su expansión dorsal. Los inerva el ramo profundo del **nervio cubital**. **Separan** los dedos del eje del medio (el medio, que tiene dos, se separa hacia ambos lados) y ayudan a flexionar la metacarpofalángica.',
    ],
    sources: [LR('560')],
  },
]

const descriptions: Record<string, Description> = {}
for (const m of MUSCLES) {
  if (m.en) descriptions[m.en] = { text: m.text, sources: m.sources }
  for (const [en, lead] of Object.entries(m.parts ?? {})) descriptions[en] = { text: [lead, ...m.text], sources: m.sources }
}

export const upperLimbMuscles = descriptions
