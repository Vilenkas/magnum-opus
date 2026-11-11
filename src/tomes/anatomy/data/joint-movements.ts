import type { DescriptionSource } from './descriptions/index'

/**
 * The movements of the great joints and the muscles that produce them: Lámina III of Artrología (by joint) and
 * Miología's plate of actions (by muscle). Each movement names its prime movers and the muscles that assist,
 * as Moore's tables (9th ed., English pagination) and Latarjet–Ruiz Liard's functional anatomy (t. 1) give them.
 * Ranges are only those a source states: a movement without one has `degrees` undefined and says why in `range`.
 * A motor is a Spanish label over the pieces of muscles.glb it stands for (TA English, without side); tests
 * check every piece exists, so the plate's muscles are the model's.
 */

export interface Motor {
  /** Spanish, as the chapters name it. */
  es: string
  /** Pieces of the muscle model (TA English). */
  pieces: string[]
}

export interface Movement {
  id: string
  es: string
  /** Degrees from the neutral position, when a source gives them. */
  degrees?: number
  /** The range as the sources state it. */
  range?: string
  prime: Motor[]
  assist?: Motor[]
  note?: string
}

export type Plane = 'sagittal' | 'frontal' | 'transverse'

/** Two opposite movements about one axis; a few movements have no opposite of their own (opposition). */
export interface MovementPair {
  plane: Plane
  a: Movement
  b?: Movement
  /** The range of the whole pair, when the sources only give that. */
  total?: string
}

export interface JointMotion {
  key: string
  es: string
  /** Its joint in the arthrology viewer (`joint-index.ts`), when it has one. */
  joint?: string
  genus: string
  pairs: MovementPair[]
  note?: string
  sources: DescriptionSource[]
}

const m = (es: string, ...pieces: string[]): Motor => ({ es, pieces })
const LR = (p: string): DescriptionSource => ({ fuente: 'latarjet-ruiz-1', p })
const MOORE = (p: string): DescriptionSource => ({ fuente: 'moore', p })

// ---------- Muscles used more than once ----------
const deltoidClavicular = m('Deltoides, porción clavicular', 'Clavicular part of deltoid muscle')
const deltoidAcromial = m('Deltoides, porción acromial', 'Acromial part of deltoid muscle')
const deltoidSpinal = m('Deltoides, porción espinal', 'Scapular spinal part of deltoid muscle')
const pectoralisClavicular = m('Pectoral mayor, cabeza clavicular', 'Clavicular head of pectoralis major muscle')
const pectoralisMajor = m('Pectoral mayor', 'Clavicular head of pectoralis major muscle', 'Sternocostal head of pectoralis major muscle')
const pectoralisMinor = m('Pectoral menor', 'Pectoralis minor muscle')
const latissimus = m('Dorsal ancho', 'Latissimus dorsi muscle')
const teresMajor = m('Redondo mayor', 'Teres major muscle')
const tricepsLong = m('Tríceps braquial, cabeza larga', 'Long head of triceps brachii')
const biceps = m('Bíceps braquial', 'Long head of biceps brachii', 'Short head of biceps brachii')
const coracobrachialis = m('Coracobraquial', 'Coracobrachialis muscle')
const trapeziusDescending = m('Trapecio, porción descendente', 'Descending part of trapezius muscle')
const trapeziusTransverse = m('Trapecio, porción transversa', 'Transverse part of trapezius muscle')
const trapeziusAscending = m('Trapecio, porción ascendente', 'Ascending part of trapezius muscle')
const levatorScapulae = m('Elevador de la escápula', 'Levator scapulae')
const rhomboids = m('Romboides', 'Rhomboid major muscle', 'Rhomboid minor muscle')
const serratusAnterior = m('Serrato anterior', 'Serratus anterior muscle')
const pronatorTeres = m('Pronador redondo', 'Superficial head of pronator teres', 'Deep head of pronator teres')
const brachioradialis = m('Braquiorradial', 'Brachioradialis muscle')
const flexorCarpiRadialis = m('Flexor radial del carpo', 'Flexor carpi radialis')
const flexorCarpiUlnaris = m('Flexor ulnar del carpo', 'Humeral head of flexor carpi ulnaris', 'Ulnar head of flexor carpi ulnaris')
const palmarisLongus = m('Palmar largo', 'Palmaris longus muscle')
const extensorCarpiRadialisLongus = m('Extensor radial largo del carpo', 'Extensor carpi radialis longus')
const extensorCarpiRadialisBrevis = m('Extensor radial corto del carpo', 'Extensor carpi radialis brevis')
const extensorCarpiUlnaris = m('Extensor ulnar del carpo', 'Humeral head of extensor carpi ulnaris', 'Ulnar head of extensor carpi ulnaris')
const abductorPollicisLongus = m('Abductor largo del pulgar', 'Abductor pollicis longus')
const extensorPollicisLongus = m('Extensor largo del pulgar', 'Extensor pollicis longus')
const abductorPollicisBrevis = m('Abductor corto del pulgar', 'Abductor pollicis brevis')
const iliopsoas = m('Iliopsoas', 'Iliacus muscle', 'Psoas major')
const tensorFasciaeLatae = m('Tensor de la fascia lata', 'Tensor fasciae latae')
const sartorius = m('Sartorio', 'Sartorius muscle')
const gracilis = m('Grácil', 'Gracilis muscle')
const pectineus = m('Pectíneo', 'Pectineus muscle')
const adductorLongus = m('Aductor largo', 'Adductor longus')
const adductorBrevis = m('Aductor corto', 'Adductor brevis')
const adductorMagnus = m('Aductor mayor', 'Adductor magnus')
const gluteusMaximus = m('Glúteo mayor', 'Gluteus maximus muscle')
const gluteusMedius = m('Glúteo medio', 'Gluteus medius muscle')
const gluteusMinimus = m('Glúteo menor', 'Gluteus minimus muscle')
const semitendinosus = m('Semitendinoso', 'Semitendinosus muscle')
const semimembranosus = m('Semimembranoso', 'Semimembranosus muscle')
const bicepsFemorisLong = m('Bíceps femoral, cabeza larga', 'Long head of biceps femoris')
const bicepsFemorisShort = m('Bíceps femoral, cabeza corta', 'Short head of biceps femoris')
const rectusFemoris = m('Recto femoral', 'Rectus femoris muscle')
const gastrocnemius = m('Gastrocnemio', 'Medial head of gastrocnemius', 'Lateral head of gastrocnemius')
const soleus = m('Sóleo', 'Soleus muscle')
const popliteus = m('Poplíteo', 'Popliteus muscle')
const plantaris = m('Plantar', 'Plantaris muscle')
const tibialisAnterior = m('Tibial anterior', 'Tibialis anterior muscle')
const tibialisPosterior = m('Tibial posterior', 'Tibialis posterior muscle')
const extensorDigitorumLongus = m('Extensor largo de los dedos', 'Extensor digitorum longus')
const fibularisLongus = m('Fibular largo', 'Fibularis longus muscle')
const fibularisBrevis = m('Fibular corto', 'Fibularis brevis muscle')
const fibularisTertius = m('Fibular tercero', 'Fibularis tertius muscle')

export const JOINT_MOTIONS: JointMotion[] = [
  {
    key: 'scapula',
    es: 'Cintura escapular',
    genus: 'Escápula sobre el tórax (sisarcosis)',
    note: 'La escápula se desliza sobre el tórax entre dos planos de deslizamiento, a un lado y otro del serrato anterior; no hay superficies articulares, sino músculos. Casi todos los movimientos del brazo la arrastran.',
    pairs: [
      {
        plane: 'frontal',
        a: {
          id: 'scapula-elevation',
          es: 'Elevación',
          range: '10–12 cm',
          prime: [trapeziusDescending, levatorScapulae],
          assist: [rhomboids],
          note: 'Sin esfuerzo (encoger los hombros) trabaja el trapecio solo; con una carga, todos.',
        },
        b: {
          id: 'scapula-depression',
          es: 'Descenso',
          prime: [pectoralisMinor, trapeziusAscending],
          assist: [m('Pectoral mayor, cabeza esternocostal inferior', 'Sternocostal head of pectoralis major muscle'), latissimus, serratusAnterior],
          note: 'De pie, el peso del miembro basta: la gravedad es el motor.',
        },
      },
      {
        plane: 'transverse',
        total: '40–45°; unos 15 cm',
        a: {
          id: 'scapula-protraction',
          es: 'Protracción',
          prime: [serratusAnterior],
          assist: [pectoralisMajor, pectoralisMinor],
          note: 'La escápula se aleja de la columna y el serrato la mantiene aplicada al tórax.',
        },
        b: {
          id: 'scapula-retraction',
          es: 'Retracción',
          prime: [trapeziusTransverse, rhomboids],
          assist: [latissimus],
        },
      },
      {
        plane: 'frontal',
        total: '60°',
        a: {
          id: 'scapula-upward-rotation',
          es: 'Rotación superior',
          degrees: 60,
          range: '60°: el ángulo inferior recorre 10–12 cm',
          prime: [trapeziusDescending, trapeziusAscending, serratusAnterior],
          note: 'La cavidad glenoidea mira arriba: acompaña a la abducción del brazo.',
        },
        b: {
          id: 'scapula-downward-rotation',
          es: 'Rotación inferior',
          prime: [levatorScapulae, rhomboids],
          assist: [latissimus, pectoralisMinor, m('Pectoral mayor, cabeza esternocostal inferior', 'Sternocostal head of pectoralis major muscle')],
          note: 'Vuelve a su sitio sobre todo por la gravedad.',
        },
      },
    ],
    sources: [MOORE('176–177'), LR('497')],
  },
  {
    key: 'shoulder',
    es: 'Hombro',
    joint: 'glenohumeral',
    genus: 'Esferoidea (enartrosis)',
    note: 'La articulación más móvil del cuerpo. Al llevar el brazo a la vertical, de los 180° unos 120° se hacen en la propia articulación y 60° por la rotación de la escápula: la escápula gira 1° por cada 3° que se eleva el brazo (ritmo escapulohumeral).',
    pairs: [
      {
        plane: 'sagittal',
        a: {
          id: 'shoulder-flexion',
          es: 'Flexión',
          range: 'Sin la escápula no pasa de unos 50°; con ella, hasta la vertical',
          prime: [pectoralisClavicular, deltoidClavicular],
          assist: [coracobrachialis, biceps],
        },
        b: {
          id: 'shoulder-extension',
          es: 'Extensión',
          prime: [deltoidSpinal],
          assist: [teresMajor, latissimus, tricepsLong],
        },
      },
      {
        plane: 'frontal',
        a: {
          id: 'shoulder-abduction',
          es: 'Abducción',
          degrees: 120,
          range: 'Unos 120° en la articulación, hasta 180° con la escápula',
          prime: [deltoidAcromial],
          assist: [m('Supraespinoso', 'Supraspinatus muscle'), deltoidClavicular, deltoidSpinal],
          note: 'El supraespinoso inicia el movimiento. Para Latarjet y Ruiz Liard, la articulación sola no pasa de la horizontal: el tubérculo mayor choca con el rodete y el resto lo da la escápula.',
        },
        b: {
          id: 'shoulder-adduction',
          es: 'Aducción',
          range: 'Hasta el tórax, o por delante o detrás de él',
          prime: [pectoralisMajor, latissimus],
          assist: [teresMajor, tricepsLong],
          note: 'De pie y sin resistencia, la gravedad es el motor principal.',
        },
      },
      {
        plane: 'transverse',
        total: 'Más de 180° de la rotación lateral extrema a la medial',
        a: {
          id: 'shoulder-medial-rotation',
          es: 'Rotación medial',
          prime: [m('Subescapular', 'Subscapularis muscle')],
          assist: [pectoralisMajor, deltoidClavicular, latissimus, teresMajor],
        },
        b: {
          id: 'shoulder-lateral-rotation',
          es: 'Rotación lateral',
          prime: [m('Infraespinoso', 'Infraspinatus muscle')],
          assist: [m('Redondo menor', 'Teres minor muscle'), deltoidSpinal],
          note: 'Los rotadores laterales son relativamente poco potentes.',
        },
      },
    ],
    sources: [MOORE('269, 275'), LR('497–498')],
  },
  {
    key: 'elbow',
    es: 'Codo',
    joint: 'elbow',
    genus: 'Troclear (gínglimo)',
    note: 'Sólo flexión y extensión; la lateralidad es nula en extensión. Flexores y extensores se contraen siempre a la vez: precisión en los movimientos lentos, freno en los rápidos.',
    pairs: [
      {
        plane: 'sagittal',
        a: {
          id: 'elbow-flexion',
          es: 'Flexión',
          degrees: 140,
          range: '135–140°',
          prime: [m('Braquial', 'Brachialis muscle'), biceps],
          assist: [brachioradialis, pronatorTeres],
          note: 'El braquial flexiona en cualquier posición del antebrazo: es el flexor por excelencia. El bíceps es potente en supinación y casi inactivo en pronación; el braquiorradial, en la flexión rápida.',
        },
        b: {
          id: 'elbow-extension',
          es: 'Extensión',
          degrees: 0,
          range: 'Hasta la prolongación del brazo; algunas personas hiperextienden',
          prime: [m('Tríceps braquial, cabezas medial y lateral', 'Medial head of triceps brachii', 'Lateral head of triceps brachii')],
          assist: [tricepsLong, m('Ancóneo', 'Anconeus muscle')],
          note: 'La cabeza larga sujeta además la cabeza del húmero contra la glenoides en la extensión con fuerza.',
        },
      },
    ],
    sources: [LR('514–515'), MOORE('278')],
  },
  {
    key: 'radio-ulnar',
    es: 'Pronosupinación',
    joint: 'distal-radio-ulnar',
    genus: 'Dos trocoides (radioulnares proximal y distal)',
    note: 'El radio gira alrededor de la ulna «como una bandera alrededor de su asta», sobre un eje que va del capítulo humeral a la cabeza de la ulna. Con el hombro y la muñeca, la mano llega a girar 360°.',
    pairs: [
      {
        plane: 'transverse',
        total: '113–151° en las radioulnares solas, según la posición del codo',
        a: {
          id: 'supination',
          es: 'Supinación',
          prime: [m('Supinador', 'Supinator'), biceps],
          assist: [extensorPollicisLongus, extensorCarpiRadialisLongus],
          note: 'Sin resistencia trabaja el supinador; el bíceps se suma cuando hace falta fuerza (atornillar).',
        },
        b: {
          id: 'pronation',
          es: 'Pronación',
          prime: [m('Pronador cuadrado', 'Pronator quadratus'), pronatorTeres],
          assist: [flexorCarpiRadialis, palmarisLongus, brachioradialis],
          note: 'El pronador cuadrado inicia; el redondo se suma con velocidad o fuerza.',
        },
      },
    ],
    sources: [LR('523–524'), MOORE('282')],
  },
  {
    key: 'wrist',
    es: 'Muñeca',
    joint: 'radiocarpal',
    genus: 'Condílea (radiocarpiana y mediocarpiana)',
    note: 'Los movimientos se reparten entre la radiocarpiana y la mediocarpiana, alrededor de ejes que pasan por la cabeza del hueso grande. Los músculos «carpianos» van por las cuatro esquinas: ninguno flexiona o extiende en línea recta solo.',
    pairs: [
      {
        plane: 'sagittal',
        total: '180° de la flexión máxima a la extensión máxima',
        a: {
          id: 'wrist-flexion',
          es: 'Flexión',
          range: 'Mayor que la extensión',
          prime: [flexorCarpiRadialis, flexorCarpiUlnaris],
          assist: [
            palmarisLongus,
            abductorPollicisLongus,
            m('Flexor superficial de los dedos', 'Humero-ulnar head of flexor digitorum superficialis', 'Radial head of flexor digitorum superficialis'),
            m('Flexor profundo de los dedos', 'Flexor digitorum profundus'),
            m('Flexor largo del pulgar', 'Flexor pollicis longus'),
          ],
        },
        b: {
          id: 'wrist-extension',
          es: 'Extensión',
          prime: [extensorCarpiRadialisBrevis, extensorCarpiRadialisLongus, extensorCarpiUlnaris],
          assist: [m('Extensor de los dedos', 'Extensor digitorum'), m('Extensor del índice', 'Extensor indicis'), m('Extensor del meñique', 'Extensor digiti minimi'), extensorPollicisLongus],
          note: 'El extensor radial corto es el más directo. Apretar el puño exige extender algo la muñeca: es la posición más estable.',
        },
      },
      {
        plane: 'frontal',
        a: {
          id: 'wrist-abduction',
          es: 'Abducción (inclinación radial)',
          degrees: 15,
          range: 'Unos 15°: la frena la estiloides del radio',
          prime: [abductorPollicisLongus, flexorCarpiRadialis, extensorCarpiRadialisLongus, extensorCarpiRadialisBrevis],
        },
        b: {
          id: 'wrist-adduction',
          es: 'Aducción (inclinación ulnar)',
          range: 'Mayor que la abducción',
          prime: [extensorCarpiUlnaris, flexorCarpiUlnaris],
          note: 'Por la contracción simultánea de los dos músculos ulnares.',
        },
      },
    ],
    sources: [LR('568–570'), MOORE('284–285')],
  },
  {
    key: 'thumb',
    es: 'Pulgar (trapeciometacarpiana)',
    joint: 'thumb-carpometacarpal',
    genus: 'En silla de montar',
    note: 'La independencia del pulgar está en esta articulación: el metacarpiano, como un jinete, se mueve en todos los sentidos sobre la silla del trapecio.',
    pairs: [
      {
        plane: 'frontal',
        a: {
          id: 'thumb-abduction',
          es: 'Abducción',
          prime: [abductorPollicisLongus, abductorPollicisBrevis],
          assist: [m('Extensor corto del pulgar', 'Extensor pollicis brevis'), extensorPollicisLongus],
          note: 'En el plano de la mano, el abductor largo; fuera de ese plano, el abductor corto.',
        },
        b: {
          id: 'thumb-adduction',
          es: 'Aducción',
          prime: [m('Aductor del pulgar', 'Oblique head of adductor pollicis', 'Transverse head of adductor pollicis')],
          note: 'En cualquier plano.',
        },
      },
      {
        plane: 'transverse',
        a: {
          id: 'thumb-opposition',
          es: 'Oposición',
          prime: [m('Oponente del pulgar', 'Opponens pollicis muscle')],
          assist: [abductorPollicisBrevis, m('Flexor corto del pulgar', 'Superficial head of flexor pollicis brevis', 'Deep head of flexor pollicis brevis')],
          note: 'El abductor corto lleva el pulgar delante; el flexor corto y sobre todo el oponente lo hacen girar frente a los otros dedos. Asocia aducción y flexión.',
        },
      },
    ],
    sources: [LR('570')],
  },
  {
    key: 'hip',
    es: 'Cadera',
    joint: 'hip',
    genus: 'Esferoidea (enartrosis)',
    note: 'Los mismos movimientos se hacen sobre el fémur fijo, moviendo la pelvis y el tronco: así se sostiene la postura, con el tono a la vez de flexores y extensores, de aductores y abductores.',
    pairs: [
      {
        plane: 'sagittal',
        a: {
          id: 'hip-flexion',
          es: 'Flexión',
          range: 'Con la rodilla flexionada, hasta casi tocar el abdomen; menos con la rodilla extendida',
          prime: [iliopsoas],
          assist: [tensorFasciaeLatae, rectusFemoris, sartorius, pectineus, adductorLongus, adductorBrevis, gracilis],
          note: 'La limitan los isquiotibiales tensos: por eso se flexiona menos con la pierna extendida.',
        },
        b: {
          id: 'hip-extension',
          es: 'Extensión',
          // Drawn at the middle of the range the source gives.
          degrees: 15,
          range: '10–20° más allá de la vertical: la frena el ligamento iliofemoral',
          prime: [gluteusMaximus],
          assist: [semitendinosus, semimembranosus, bicepsFemorisLong, adductorMagnus, m('Glúteo medio, parte posterior', 'Gluteus medius muscle')],
          note: 'El glúteo mayor extiende desde la flexión hasta la posición de pie; más atrás, sobre todo los isquiotibiales.',
        },
      },
      {
        plane: 'frontal',
        a: {
          id: 'hip-abduction',
          es: 'Abducción',
          degrees: 60,
          range: 'Unos 60° con el muslo extendido; más en flexión',
          prime: [gluteusMedius, gluteusMinimus],
          assist: [sartorius],
          note: 'Con el pie de ese lado en el suelo, mantienen la pelvis horizontal: si fallan, la pelvis cae del otro lado al andar.',
        },
        b: {
          id: 'hip-adduction',
          es: 'Aducción',
          range: 'Menor que la abducción; puede cruzar delante o detrás del otro miembro',
          prime: [adductorLongus, adductorBrevis, adductorMagnus, pectineus],
          assist: [gracilis],
        },
      },
      {
        plane: 'transverse',
        a: {
          id: 'hip-lateral-rotation',
          es: 'Rotación lateral',
          range: 'Más amplia y mucho más potente que la medial',
          prime: [
            m(
              'Pelvitrocantéreos',
              'Piriformis muscle',
              'Obturator internus',
              'Obturator externus',
              'Superior gemellus muscle',
              'Inferior gemellus muscle',
              'Quadratus femoris muscle',
            ),
          ],
          assist: [iliopsoas, gluteusMaximus, sartorius],
        },
        b: {
          id: 'hip-medial-rotation',
          es: 'Rotación medial',
          prime: [m('Glúteos medio y menor, fascículos anteriores', 'Gluteus medius muscle', 'Gluteus minimus muscle')],
          assist: [adductorMagnus],
        },
      },
    ],
    sources: [LR('693'), MOORE('715–718, 734, 740, 800–803')],
  },
  {
    key: 'knee',
    es: 'Rodilla',
    joint: 'knee',
    genus: 'Bicondílea, con la femoropatelar',
    note: 'La flexión se acompaña de rotación medial de la tibia y la extensión, de rotación lateral. La rotación es casi nula con la rodilla extendida; la lateralidad, inexistente.',
    pairs: [
      {
        plane: 'sagittal',
        a: {
          id: 'knee-flexion',
          es: 'Flexión',
          degrees: 140,
          range: '120° con la cadera extendida, 140° con la cadera flexionada, 160° pasiva',
          prime: [semitendinosus, semimembranosus, bicepsFemorisLong, bicepsFemorisShort],
          assist: [gracilis, sartorius, gastrocnemius, popliteus, plantaris],
          note: 'Con la cadera extendida los isquiotibiales no pueden acortarse más: no se flexiona del todo.',
        },
        b: {
          id: 'knee-extension',
          es: 'Extensión',
          degrees: 0,
          range: 'Hasta 0°, los ejes de fémur y tibia en línea',
          prime: [m('Cuádriceps femoral', 'Rectus femoris muscle', 'Vastus lateralis muscle', 'Vastus medialis muscle', 'Vastus intermedius muscle')],
          assist: [tensorFasciaeLatae],
          note: 'El cuádriceps es más eficaz con la cadera extendida.',
        },
      },
      {
        plane: 'transverse',
        a: {
          id: 'knee-medial-rotation',
          es: 'Rotación medial',
          degrees: 10,
          range: '10° con la rodilla flexionada; 5° extendida',
          prime: [semitendinosus, semimembranosus, popliteus],
          assist: [gracilis, sartorius],
          note: 'Con la rodilla extendida y en carga, el poplíteo gira el fémur afuera y la «desbloquea».',
        },
        b: {
          id: 'knee-lateral-rotation',
          es: 'Rotación lateral',
          degrees: 35,
          range: '30–40° con la rodilla flexionada a 90°',
          prime: [bicepsFemorisLong, bicepsFemorisShort],
          assist: [tensorFasciaeLatae],
        },
      },
    ],
    sources: [MOORE('813'), LR('725–727')],
  },
  {
    key: 'ankle',
    es: 'Tobillo (talocrural)',
    joint: 'ankle',
    genus: 'Troclear',
    note: 'Los músculos llamados «extensores» flexionan dorsalmente el pie, y viceversa: por eso se habla de flexión dorsal y flexión plantar.',
    pairs: [
      {
        plane: 'sagittal',
        a: {
          id: 'dorsiflexion',
          es: 'Flexión dorsal',
          degrees: 20,
          range: 'Unos 20°',
          prime: [tibialisAnterior],
          assist: [extensorDigitorumLongus, m('Extensor largo del dedo gordo', 'Extensor hallucis longus'), fibularisTertius],
          note: 'Movimiento débil, una cuarta parte de la flexión plantar; levanta la punta del pie al dar el paso.',
        },
        b: {
          id: 'plantarflexion',
          es: 'Flexión plantar',
          degrees: 50,
          range: 'Unos 50°',
          prime: [gastrocnemius, soleus],
          assist: [plantaris, tibialisPosterior, fibularisLongus, fibularisBrevis, m('Flexor largo del dedo gordo', 'Flexor hallucis longus'), m('Flexor largo de los dedos', 'Flexor digitorum longus')],
          note: 'El gastrocnemio rinde más con la rodilla extendida; el sóleo trabaja en cualquier posición y sostiene la postura de pie.',
        },
      },
    ],
    sources: [LR('766–767'), MOORE('760, 765–766, 769, 819')],
  },
  {
    key: 'subtalar',
    es: 'Pie (subastragalina y transversa del tarso)',
    joint: 'subtalar',
    genus: 'Trocoide y articulaciones del tarso',
    note: 'La inversión asocia aducción y rotación medial (pie varo); la eversión, abducción y rotación lateral (pie valgo). Se reparten entre la subastragalina y la transversa del tarso.',
    pairs: [
      {
        plane: 'frontal',
        a: {
          id: 'inversion',
          es: 'Inversión',
          prime: [tibialisPosterior, tibialisAnterior],
          assist: [gastrocnemius, soleus],
        },
        b: {
          id: 'eversion',
          es: 'Eversión',
          prime: [fibularisLongus, fibularisBrevis],
          assist: [fibularisTertius, extensorDigitorumLongus],
        },
      },
    ],
    sources: [LR('767'), MOORE('759, 766, 769')],
  },
]

export const jointMotionByKey = new Map(JOINT_MOTIONS.map((j) => [j.key, j]))

/** Every movement of a joint, in order. */
export const movementsOf = (joint: JointMotion): Movement[] => joint.pairs.flatMap((p) => (p.b ? [p.a, p.b] : [p.a]))

export interface Action {
  joint: JointMotion
  movement: Movement
  role: 'prime' | 'assist'
}

/** What each piece of the muscle model does, joint by joint. */
export const actionsOfPiece = new Map<string, Action[]>()
for (const joint of JOINT_MOTIONS)
  for (const movement of movementsOf(joint))
    for (const role of ['prime', 'assist'] as const)
      for (const motor of movement[role] ?? [])
        for (const piece of motor.pieces) {
          const list = actionsOfPiece.get(piece) ?? []
          if (!list.some((a) => a.movement === movement)) list.push({ joint, movement, role })
          actionsOfPiece.set(piece, list)
        }

/** The joints a piece acts on. */
export const jointsOfPiece = (piece: string): string[] => [...new Set((actionsOfPiece.get(piece) ?? []).map((a) => a.joint.key))]

/** A piece that acts on more than one joint of the same limb segment chain. */
export const isPolyarticular = (piece: string) => jointsOfPiece(piece).length > 1
