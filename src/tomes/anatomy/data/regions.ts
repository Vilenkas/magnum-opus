import type { JointView } from '../components/skeleton/SkeletonStage'
import type { DescriptionSource } from './descriptions/index'

/**
 * The regions the muscles bound (Miología, Lámina IV): the axilla, the canals and fossae of the limbs and the inguinal
 * canal, each as walls of named pieces of the models (muscles, fasciae, bones, ligaments) and a content of named vessels,
 * nerves and tendons, after Moore 8.ª and Latarjet–Ruiz Liard. A region whose content can be compressed names the
 * plexus lesion it stands for (`plexuses.ts`), so what is lost is read off the same engine as Neurología's plates.
 * Names are TA English as the models carry them, without side: the viewer shows the right side.
 */

export interface WallPart {
  es: string
  /** Pieces of muscles.glb (muscles, fasciae, ligaments of the muscle model). */
  muscles?: string[]
  /** Pieces of skeleton.glb, without side. */
  bones?: string[]
  /** Pieces of joints.glb. */
  joints?: string[]
}

export interface Wall {
  role: string
  parts: WallPart[]
}

export type ContentKind = 'artery' | 'vein' | 'nerve' | 'tendon'

export interface Content {
  es: string
  kind: ContentKind
  /** Vessels and nerves: TA English of vessels.glb / nervous.glb. Tendons: muscles.glb. */
  names: string[]
}

export interface Region {
  key: string
  es: string
  limb: 'upper' | 'lower' | 'trunk'
  view: JointView
  /** What the camera frames, when the whole walls would be too much (long muscles): muscle names or bone ids. */
  frame?: string[]
  walls: Wall[]
  contents: Content[]
  /** The lesion of `plexuses.ts` that compressing its content stands for. */
  compression?: { plexus: 'brachial' | 'lumbosacral'; lesion: string; es: string }
  note: string
  sources: DescriptionSource[]
}

const MOORE = (p: string): DescriptionSource => ({ fuente: 'moore-8', p })
const LR = (p: string): DescriptionSource => ({ fuente: 'latarjet-ruiz-1', p })

const flexorTendons: Content[] = [
  {
    es: 'Tendones del flexor superficial de los dedos',
    kind: 'tendon',
    names: ['Humero-ulnar head of flexor digitorum superficialis', 'Radial head of flexor digitorum superficialis'],
  },
  { es: 'Tendones del flexor profundo de los dedos', kind: 'tendon', names: ['Flexor digitorum profundus'] },
  { es: 'Tendón del flexor largo del pulgar', kind: 'tendon', names: ['Flexor pollicis longus'] },
]

export const REGIONS: Region[] = [
  {
    key: 'axilla',
    es: 'Axila',
    limb: 'upper',
    view: 'front',
    frame: ['Pectoralis minor muscle', 'Coracobrachialis muscle', 'Teres major muscle'],
    walls: [
      { role: 'Pared anterior', parts: [{ es: 'Pectorales mayor y menor', muscles: ['Clavicular head of pectoralis major muscle', 'Sternocostal head of pectoralis major muscle', 'Pectoralis minor muscle'] }] },
      {
        role: 'Pared posterior',
        parts: [
          { es: 'Subescapular, sobre la escápula', muscles: ['Subscapularis muscle'], bones: ['scapula'] },
          { es: 'Redondo mayor y dorsal ancho', muscles: ['Teres major muscle', 'Latissimus dorsi muscle'] },
        ],
      },
      { role: 'Pared medial', parts: [{ es: 'Serrato anterior, sobre las costillas', muscles: ['Serratus anterior muscle'] }] },
      {
        role: 'Pared lateral',
        parts: [{ es: 'Surco intertubercular del húmero, coracobraquial y cabeza corta del bíceps', muscles: ['Coracobrachialis muscle', 'Short head of biceps brachii'], bones: ['humerus'] }],
      },
      { role: 'Vértice', parts: [{ es: 'Conducto cervicoaxilar, entre la clavícula, la 1.ª costilla y el borde superior de la escápula', bones: ['clavicle', 'first-rib'] }] },
    ],
    contents: [
      { es: 'Arteria axilar', kind: 'artery', names: ['Axillary artery'] },
      { es: 'Vena axilar', kind: 'vein', names: ['Axillary vein'] },
      { es: 'Fascículos y ramos del plexo braquial', kind: 'nerve', names: ['Posterior cord of brachial plexus', 'Axillary nerve', 'Radial nerve', 'Median nerve', 'Ulnar nerve', 'Musculocutaneous nerve'] },
    ],
    compression: { plexus: 'brachial', lesion: 'posteriorCord', es: 'Una muleta mal apoyada comprime el fascículo posterior' },
    note: 'Un espacio piramidal entre el brazo y el tórax, con un vértice, una base de piel y fascia axilar, y cuatro paredes, tres de ellas musculares. Es el centro de distribución de los vasos y nervios del miembro superior, protegido por el brazo aducido; con el brazo en abducción completa casi desaparece y su contenido queda expuesto.',
    sources: [MOORE('177–178, 183')],
  },
  {
    key: 'quadrangular-space',
    es: 'Espacio cuadrangular',
    limb: 'upper',
    view: 'back',
    frame: ['Teres minor muscle', 'Teres major muscle'],
    walls: [
      { role: 'Arriba', parts: [{ es: 'Redondo menor (y subescapular por delante)', muscles: ['Teres minor muscle', 'Subscapularis muscle'] }] },
      { role: 'Abajo', parts: [{ es: 'Redondo mayor', muscles: ['Teres major muscle'] }] },
      { role: 'Medial', parts: [{ es: 'Cabeza larga del tríceps braquial', muscles: ['Long head of triceps brachii'] }] },
      { role: 'Lateral', parts: [{ es: 'Cuello quirúrgico del húmero', bones: ['humerus'] }] },
    ],
    contents: [
      { es: 'Nervio axilar', kind: 'nerve', names: ['Axillary nerve'] },
      { es: 'Arteria y vena circunflejas humerales posteriores', kind: 'artery', names: ['Posterior circumflex humeral artery'] },
      { es: 'Vena circunfleja humeral posterior', kind: 'vein', names: ['Posterior circumflex humeral vein'] },
    ],
    compression: { plexus: 'brachial', lesion: 'axillary', es: 'La luxación del hombro o la fractura del cuello quirúrgico estira o comprime el nervio axilar' },
    note: 'La puerta de la axila hacia atrás, a la región escapular: por ella el nervio axilar rodea el cuello quirúrgico del húmero, contra el hueso, para llegar al deltoides y al redondo menor.',
    sources: [MOORE('177, 208')],
  },
  {
    key: 'cubital-fossa',
    es: 'Fosa del codo',
    limb: 'upper',
    view: 'front',
    frame: ['Superficial head of pronator teres', 'Supinator'],
    walls: [
      { role: 'Arriba', parts: [{ es: 'La línea que une los dos epicóndilos', bones: ['humerus'] }] },
      { role: 'Medial', parts: [{ es: 'Pronador redondo (masa de los flexores)', muscles: ['Superficial head of pronator teres', 'Deep head of pronator teres'] }] },
      { role: 'Lateral', parts: [{ es: 'Braquiorradial (masa de los extensores)', muscles: ['Brachioradialis muscle'] }] },
      { role: 'Suelo', parts: [{ es: 'Braquial y supinador', muscles: ['Brachialis muscle', 'Supinator'] }] },
    ],
    contents: [
      { es: 'Tendón del bíceps braquial', kind: 'tendon', names: ['Long head of biceps brachii', 'Short head of biceps brachii'] },
      { es: 'Arteria braquial, que se divide en radial y ulnar', kind: 'artery', names: ['Brachial artery', 'Radial artery', 'Ulnar artery'] },
      { es: 'Venas satélites', kind: 'vein', names: ['Brachial veins'] },
      { es: 'Nervio mediano', kind: 'nerve', names: ['Median nerve'] },
      { es: 'Nervio radial, en lo profundo del borde lateral', kind: 'nerve', names: ['Radial nerve', 'Deep branch of radial nerve', 'Superficial branch of radial nerve'] },
    ],
    compression: { plexus: 'brachial', lesion: 'medianElbow', es: 'Una fractura supracondílea o una herida del pliegue del codo alcanza el mediano' },
    note: 'Un triángulo delante del codo. De lateral a medial pasan el tendón del bíceps, la arteria braquial y el nervio mediano; el radial va escondido entre el braquiorradial y el braquial. En el techo, la vena mediana del codo es la de las punciones.',
    sources: [MOORE('209')],
  },
  {
    key: 'carpal-tunnel',
    es: 'Túnel carpiano',
    limb: 'upper',
    view: 'front',
    walls: [
      { role: 'Suelo y paredes', parts: [{ es: 'El canal del carpo, cóncavo hacia delante', bones: ['scaphoid-bone', 'lunate-bone', 'triquetrum-bone', 'pisiform-bone', 'trapezium-bone', 'trapezoid-bone', 'capitate-bone', 'hamate-bone'] }] },
      { role: 'Techo', parts: [{ es: 'Retináculo de los músculos flexores, entre los huesos más externos del carpo', muscles: ['Flexor retinaculum of wrist'] }] },
    ],
    contents: [{ es: 'Nervio mediano', kind: 'nerve', names: ['Median nerve'] }, ...flexorTendons],
    compression: { plexus: 'brachial', lesion: 'medianWrist', es: 'El síndrome del túnel carpiano comprime el mediano bajo el retináculo' },
    note: 'Un conducto osteofibroso: el retináculo flexor convierte en túnel la concavidad del carpo. Pasan el mediano y nueve tendones, los cuatro del flexor superficial y los cuatro del profundo en una vaina común, y el del flexor largo del pulgar. La rama palmar del mediano nace por encima y pasa por delante del retináculo: en el síndrome del túnel, la palma conserva su sensibilidad.',
    sources: [MOORE('159, 220'), LR('529')],
  },
  {
    key: 'guyon',
    es: 'Conducto ulnar (de Guyon)',
    limb: 'upper',
    view: 'front',
    walls: [
      { role: 'Paredes', parts: [{ es: 'Pisiforme y gancho del ganchoso', bones: ['pisiform-bone', 'hamate-bone'] }] },
      { role: 'Suelo', parts: [{ es: 'Ligamento pisoganchoso', joints: ['Pisohamate ligament'] }] },
      { role: 'Techo', parts: [{ es: 'Una banda fibrosa del retináculo flexor', muscles: ['Flexor retinaculum of wrist'] }] },
    ],
    contents: [
      { es: 'Nervio ulnar', kind: 'nerve', names: ['Ulnar nerve'] },
      { es: 'Arteria ulnar', kind: 'artery', names: ['Ulnar artery'] },
    ],
    compression: { plexus: 'brachial', lesion: 'ulnarWrist', es: 'Una herida de la muñeca o la compresión junto al pisiforme alcanza el ulnar' },
    note: 'Un pequeño conducto junto al pisiforme, por delante del retináculo flexor y no por dentro del túnel carpiano: el nervio y la arteria ulnares entran por él en la mano.',
    sources: [MOORE('233')],
  },
  {
    key: 'snuffbox',
    es: 'Tabaquera anatómica',
    limb: 'upper',
    view: 'side',
    walls: [
      { role: 'Lado anterior (lateral)', parts: [{ es: 'Tendones del abductor largo y del extensor corto del pulgar', muscles: ['Abductor pollicis longus', 'Extensor pollicis brevis'] }] },
      { role: 'Lado posterior (medial)', parts: [{ es: 'Tendón del extensor largo del pulgar', muscles: ['Extensor pollicis longus'] }] },
      { role: 'Suelo', parts: [{ es: 'Escafoides y trapecio, entre la estiloides del radio y el 1.er metacarpiano', bones: ['scaphoid-bone', 'trapezium-bone', 'radius', 'first-metacarpal-bone'] }] },
    ],
    contents: [{ es: 'Arteria radial, que cruza el suelo hacia el dorso de la mano', kind: 'artery', names: ['Radial artery'] }],
    note: 'La depresión triangular que aparece con el pulgar en extensión completa. En su fondo se palpan el escafoides, cuya fractura duele aquí, y el pulso de la arteria radial.',
    sources: [MOORE('227')],
  },
  {
    key: 'inguinal-canal',
    es: 'Conducto inguinal',
    limb: 'trunk',
    view: 'front',
    frame: ['Inguinal ligament'],
    walls: [
      { role: 'Pared anterior', parts: [{ es: 'Aponeurosis del oblicuo externo, reforzada lateralmente por el oblicuo interno', muscles: ['External abdominal oblique muscle', 'Internal abdominal oblique muscle'] }] },
      { role: 'Pared posterior', parts: [{ es: 'Fascia transversal, reforzada medialmente por la hoz inguinal (oblicuo interno y transverso)', muscles: ['Transversus abdominis muscle'] }] },
      { role: 'Techo', parts: [{ es: 'Arcos del oblicuo interno y del transverso', muscles: ['Internal abdominal oblique muscle', 'Transversus abdominis muscle'] }] },
      { role: 'Suelo', parts: [{ es: 'Ligamento inguinal', muscles: ['Inguinal ligament'], bones: ['hip-bone'] }] },
    ],
    contents: [
      { es: 'Nervio ilioinguinal', kind: 'nerve', names: ['Ilio-inguinal nerve'] },
      { es: 'Rama genital del nervio genitofemoral', kind: 'nerve', names: ['Genital branch of genitofemoral nerve'] },
    ],
    note: 'Un paso oblicuo de unos 4 cm por la parte baja de la pared del abdomen, encima de la mitad medial del ligamento inguinal, del anillo profundo (en la fascia transversal) al superficial (en la aponeurosis del oblicuo externo). Lleva el funículo espermático en el hombre y el ligamento redondo del útero en la mujer, que el modelo no tiene. Por él salen las hernias inguinales.',
    sources: [MOORE('425–426')],
  },
  {
    key: 'femoral-triangle',
    es: 'Triángulo femoral',
    limb: 'lower',
    view: 'front',
    frame: ['Inguinal ligament', 'Pectineus muscle'],
    walls: [
      { role: 'Base (arriba)', parts: [{ es: 'Ligamento inguinal', muscles: ['Inguinal ligament'] }] },
      { role: 'Lateral', parts: [{ es: 'Sartorio', muscles: ['Sartorius muscle'] }] },
      { role: 'Medial', parts: [{ es: 'Aductor largo', muscles: ['Adductor longus'] }] },
      { role: 'Suelo', parts: [{ es: 'Iliopsoas y pectíneo', muscles: ['Iliacus muscle', 'Psoas major', 'Pectineus muscle'] }] },
    ],
    contents: [
      { es: 'Nervio femoral, el más lateral', kind: 'nerve', names: ['Femoral nerve'] },
      { es: 'Arteria femoral', kind: 'artery', names: ['Femoral artery'] },
      { es: 'Vena femoral, medial a la arteria', kind: 'vein', names: ['Femoral vein'] },
      { es: 'Nervio safeno', kind: 'nerve', names: ['Saphenous nerve'] },
    ],
    compression: { plexus: 'lumbosacral', lesion: 'femoral', es: 'Una herida de la ingle alcanza el nervio femoral bajo el ligamento inguinal' },
    note: 'Un espacio bajo la fascia en el tercio superior del muslo. De lateral a medial: nervio, arteria y vena femorales, y el conducto femoral. Los vasos lo atraviesan para seguir por el conducto aductor; por el conducto femoral salen las hernias femorales.',
    sources: [MOORE('710–712')],
  },
  {
    key: 'adductor-canal',
    es: 'Conducto aductor (de Hunter)',
    limb: 'lower',
    view: 'front',
    frame: ['Vastus medialis muscle'],
    walls: [
      { role: 'Lateral', parts: [{ es: 'Vasto medial', muscles: ['Vastus medialis muscle'] }] },
      { role: 'Posteromedial', parts: [{ es: 'Aductores largo y mayor', muscles: ['Adductor longus', 'Adductor magnus'] }] },
      { role: 'Anterior', parts: [{ es: 'Sartorio y el tabique vastoaductor', muscles: ['Sartorius muscle'] }] },
    ],
    contents: [
      { es: 'Arteria femoral', kind: 'artery', names: ['Femoral artery'] },
      { es: 'Vena femoral', kind: 'vein', names: ['Femoral vein'] },
      { es: 'Nervio safeno', kind: 'nerve', names: ['Saphenous nerve'] },
    ],
    note: 'Un conducto de unos cuatro traveses de dedo en el tercio medio del muslo, del vértice del triángulo femoral al hiato aductor, por donde los vasos pasan detrás de la rodilla y se hacen poplíteos.',
    sources: [LR('725'), MOORE('711–712')],
  },
  {
    key: 'popliteal-fossa',
    es: 'Fosa poplítea',
    limb: 'lower',
    view: 'back',
    frame: ['Popliteus muscle', 'Medial head of gastrocnemius', 'Lateral head of gastrocnemius'],
    walls: [
      { role: 'Arriba y lateral', parts: [{ es: 'Bíceps femoral', muscles: ['Long head of biceps femoris', 'Short head of biceps femoris'] }] },
      { role: 'Arriba y medial', parts: [{ es: 'Semimembranoso y semitendinoso', muscles: ['Semimembranosus muscle', 'Semitendinosus muscle'] }] },
      { role: 'Abajo', parts: [{ es: 'Las dos cabezas del gastrocnemio', muscles: ['Medial head of gastrocnemius', 'Lateral head of gastrocnemius'] }] },
      { role: 'Suelo', parts: [{ es: 'Cara poplítea del fémur, cápsula de la rodilla y poplíteo', muscles: ['Popliteus muscle'], bones: ['femur'] }] },
    ],
    contents: [
      { es: 'Nervio tibial', kind: 'nerve', names: ['Tibial nerve'] },
      { es: 'Nervio fibular común', kind: 'nerve', names: ['Common fibular nerve'] },
      { es: 'Arteria poplítea, la más profunda', kind: 'artery', names: ['Popliteal artery'] },
      { es: 'Vena poplítea y terminación de la safena menor', kind: 'vein', names: ['Popliteal vein', 'Small saphenous vein'] },
    ],
    compression: { plexus: 'lumbosacral', lesion: 'tibial', es: 'Una herida profunda o la luxación de la rodilla alcanza el nervio tibial' },
    note: 'Un rombo detrás de la rodilla, lleno de grasa, mucho mayor en profundidad de lo que parece: las cabezas del gastrocnemio cubren su mitad inferior. De lo superficial a lo profundo, los nervios, la vena y la arteria, aplicada al fémur.',
    sources: [MOORE('743–744')],
  },
]
