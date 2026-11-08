import type { Description } from './index'

/** The bones of the upper limb (skeleton viewer), after Latarjet–Ruiz Liard's chapter 54. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })

const bones: Record<string, Description> = {
  Clavicle: {
    text: [
      'Hueso largo en forma de **S itálica** tendido del esternón al acromion: convexo hacia delante en sus dos tercios mediales, cóncavo en el lateral. Su cara superior es subcutánea y se palpa entera; la inferior lleva, de medial a lateral, la impresión del ligamento costoclavicular, el surco del subclavio y la tuberosidad del ligamento coracoclavicular (tubérculo conoideo y línea trapezoidea).',
      'Por dentro es casi un hueso plano, sin conducto medular definido. Es el primer hueso largo en osificar, en las semanas 5.ª y 6.ª y sobre un esbozo membranoso, y uno de los que más se fracturan, casi siempre en la unión de sus tercios medio y lateral; el esternocleidomastoideo eleva entonces el fragmento medial.',
    ],
    sources: [LR('455–456'), MOORE('153–154')],
  },
  Scapula: {
    text: [
      'Hueso plano y triangular apoyado en la parte posterosuperior del tórax, sobre el que se desliza con gran movilidad. Su cara costal es la **fosa subescapular**; la posterior está dividida por la **espina**, que termina en el **acromion**, en las fosas supraespinosa e infraespinosa, que se comunican por fuera de la espina.',
      'Su ángulo lateral lleva la **cavidad glenoidea**, oval y poco profunda, completada en fresco por el labro, con los tubérculos supraglenoideo (porción larga del bíceps) e infraglenoideo (porción larga del tríceps); encima se acoda el **proceso coracoides**. Bajo la piel se palpan la espina, el acromion, la punta del coracoides, el borde medial y el ángulo inferior.',
    ],
    sources: [LR('456–459')],
  },
  Humerus: {
    text: [
      'Hueso del brazo. Su extremidad superior tiene la **cabeza**, un tercio de esfera orientado hacia dentro, arriba y atrás, limitada por el cuello anatómico; por fuera de ella, los tubérculos **mayor** (supraespinoso, infraespinoso y redondo menor) y **menor** (subescapular), separados por el surco intertubercular de la porción larga del bíceps. El **cuello quirúrgico**, debajo, es lugar frecuente de fracturas.',
      'El cuerpo lleva la tuberosidad deltoidea y, detrás, el surco del nervio radial, que da la falsa impresión de una torsión. La extremidad inferior, el cóndilo, articula la **tróclea** con el cúbito y el **capítulo** con el radio, entre los epicóndilos lateral y medial. Sus fracturas se complican por sus nervios: el axilar arriba, el radial en medio y el cubital detrás del epicóndilo medial.',
    ],
    sources: [LR('459–462'), MOORE('149, 155')],
  },
  Radius: {
    text: [
      'Hueso lateral del antebrazo, más grueso abajo que arriba, al revés que el cúbito. Arriba tiene la **cabeza**, un cilindro de unos 2 cm de diámetro cuya fosita recibe el capítulo y cuya circunferencia gira en la escotadura radial del cúbito; el **cuello** forma con el cuerpo un ángulo que importa en la pronosupinación, y la **tuberosidad** recibe el bíceps.',
      'Su extremidad inferior se articula con el escafoides y el semilunar, termina por fuera en el **proceso estiloides**, que baja más que el del cúbito, y lleva los surcos de los tendones extensores. Es la extremidad que más se fractura; la de **Colles**, en sus 2 cm distales, acorta el radio e invierte la relación entre los dos procesos estiloides.',
    ],
    sources: [LR('462–464, 466'), MOORE('155')],
  },
  Ulna: {
    text: [
      'Hueso medial del antebrazo, el **cúbito** (ulna en la nomenclatura internacional). Su extremidad superior forma un gancho: la **escotadura troclear** abraza la tróclea del húmero entre el **olécranon** detrás, que entra en la fosa olecraniana en la extensión, y el **proceso coronoides** delante, con la tuberosidad del braquial; a su lado, la escotadura radial recibe la cabeza del radio.',
      'Su borde posterior, en S, se palpa de punta a punta. Abajo termina en una pequeña cabeza, separada del carpo por el disco articular, y en el **proceso estiloides cubital**. En la fractura del olécranon el tríceps separa mucho el fragmento superior.',
    ],
    sources: [LR('464–466')],
  },
  'Scaphoid bone': {
    text: [
      'El más lateral de la primera fila del carpo. Se articula con el radio arriba, con el semilunar y el hueso grande por dentro, y con el trapecio y el trapezoide abajo; su cara anterolateral lleva el **tubérculo del escafoides**. Se palpa en el fondo de la **tabaquera anatómica**.',
      'Es el hueso del carpo que más se fractura. Como su parte proximal está mal irrigada, la fractura puede tardar al menos tres meses en consolidar y dejar el fragmento proximal en **necrosis avascular**.',
    ],
    sources: [LR('467–468'), MOORE('156')],
  },
  'Lunate bone': {
    text: [
      'El hueso de la primera fila del carpo situado en medio: se articula con el radio arriba, con el escafoides y el piramidal a los lados, y con el hueso grande y el ganchoso abajo. Su osificación aparece entre los 3 y los 4 años.',
    ],
    sources: [LR('467–468')],
  },
  'Triquetrum bone': {
    text: [
      'Hueso **piramidal** (triquetrum), el medial de la primera fila del carpo. Arriba no toca el cúbito sino el **disco articular** de la radiocubital distal; por delante lleva la carilla del pisiforme, por fuera el semilunar y abajo el ganchoso.',
    ],
    sources: [LR('467')],
  },
  'Pisiform bone': {
    text: [
      'Pequeño hueso con forma de guisante, puesto como una superestructura delante del piramidal, único hueso con el que se articula. Actúa sobre todo como un sesamoideo del **flexor cubital del carpo**, cuya palanca aumenta; los ligamentos pisiganchoso y pisometacarpiano prolongan ese tendón. Es el último hueso del carpo en osificar, entre los 8 y los 10 años, y se palpa en el talón de la mano.',
    ],
    sources: [LR('467–468'), MOORE('279')],
  },
  'Trapezium bone': {
    text: [
      'El lateral de la segunda fila del carpo. Se articula con el escafoides arriba, con el trapezoide por dentro y con el **primer metacarpiano** abajo, por una superficie en silla de montar que permite la oposición del pulgar; con el escafoides y ese metacarpiano forma la columna ósea del pulgar. Su **tubérculo** anterior limita por fuera el canal del carpo.',
    ],
    sources: [LR('467–468'), MOORE('27, 290')],
  },
  'Trapezoid bone': {
    text: [
      'El hueso más profundo del carpo: queda entre el trapecio por fuera, el hueso grande por dentro, el escafoides arriba y el segundo metacarpiano abajo, en cuya base se encaja.',
    ],
    sources: [LR('467')],
  },
  'Capitate bone': {
    text: [
      'El **hueso grande** (capitatum), el mayor del carpo, con forma de tapón de champán: su cabeza se encaja en la concavidad que forman el escafoides y el semilunar, y su cuerpo se articula con el trapezoide, el ganchoso y los metacarpianos segundo, tercero y cuarto. Es el primero del carpo en osificar, desde el nacimiento.',
    ],
    sources: [LR('467–468')],
  },
  'Hamate bone': {
    text: [
      'El **ganchoso** (hamatum), el medial de la segunda fila del carpo, inconfundible por el **gancho** que se levanta en su cara palmar. Se articula con el semilunar y el piramidal arriba, con el hueso grande por fuera y con los metacarpianos cuarto y quinto abajo.',
      'El gancho y el pisiforme limitan por dentro el canal del carpo y el **conducto cubital** (de Guyon), por donde pasan el nervio y la arteria cubitales: una fractura del gancho puede lesionar el nervio.',
    ],
    sources: [LR('467–468'), MOORE('156, 261')],
  },
}

// ---------- Metacarpals: a common text and what tells each one apart ----------

const metacarpal = (own: string): Description => ({
  text: [
    'Hueso largo de la palma: una **base** que se articula con la segunda fila del carpo y con sus vecinos, un cuerpo de cara dorsal plana y caras laterales para los interóseos, y una **cabeza** que se articula con la falange proximal. Osifica por dos puntos, y el cartílago de crecimiento queda en la cabeza.',
    own,
  ],
  sources: [LR('468–470')],
})

Object.assign(bones, {
  'First metacarpal bone': {
    text: [
      'El metacarpiano del **pulgar**, más corto y grueso que los demás y libre de sus vecinos: su base no tiene carillas laterales y se articula sólo con el trapecio, en silla de montar.',
      'Es la excepción del metacarpo: su cartílago de crecimiento queda en la base, como en una falange, y no en la cabeza.',
    ],
    sources: [LR('468–470')],
  },
  'Second metacarpal bone': metacarpal(
    'El segundo tiene la base en forma de V que abraza el trapezoide, con una sola carilla lateral, la medial, para el tercero; recibe al extensor radial largo del carpo por detrás y al flexor radial del carpo por delante.',
  ),
  'Third metacarpal bone': metacarpal(
    'El tercero tiene una carilla a cada lado de la base y un **proceso estiloides** dorsal donde se inserta el extensor radial corto del carpo.',
  ),
  'Fourth metacarpal bone': metacarpal('El cuarto tiene, como el tercero, una carilla a cada lado de la base, pero no tiene proceso estiloides.'),
  'Fifth metacarpal bone': {
    ...metacarpal(
      'El quinto tiene una sola carilla lateral y un tubérculo para el extensor cubital del carpo. Se rompe en la **fractura del boxeador**, al golpear con el puño cerrado.',
    ),
    sources: [LR('468–470'), MOORE('157')],
  },
} satisfies Record<string, Description>)

// ---------- Phalanges: one text per row, shared by the five fingers ----------

const fingers = ['first', 'second', 'third', 'fourth', 'fifth'] as const
const phalanx: Record<'proximal' | 'middle' | 'distal', Description> = {
  proximal: {
    text: [
      'Falange **proximal** (primera falange): hueso largo con un cuerpo semicilíndrico, cóncavo hacia la palma, de bordes marcados donde se fija la vaina de los flexores. Su base tiene una cavidad glenoidea para la cabeza del metacarpiano; su cabeza es una **tróclea** para la falange siguiente. Osifica por dos puntos y su cartílago de crecimiento queda en la base. En la base de la del pulgar hay dos sesamoideos.',
    ],
    sources: [LR('470')],
  },
  middle: {
    text: [
      'Falange **media** (segunda falange), que falta en el pulgar. Muy parecida a la proximal, pero más corta: su base tiene una doble cavidad para la tróclea de la proximal y en sus bordes se inserta el **flexor superficial de los dedos**.',
    ],
    sources: [LR('470')],
  },
  distal: {
    text: [
      'Falange **distal** (tercera falange, la del pulgar es su segunda). La más pequeña: su base se articula con la tróclea de la falange anterior y recibe el **flexor profundo de los dedos**; su extremo libre se ensancha en una tuberosidad en herradura, más marcada en la cara palmar, bajo el pulpejo y la uña.',
    ],
    sources: [LR('470')],
  },
}
for (const row of ['proximal', 'middle', 'distal'] as const)
  for (const finger of fingers) {
    if (row === 'middle' && finger === 'first') continue
    bones[`${row[0].toUpperCase()}${row.slice(1)} phalanx of ${finger} finger of hand`] = phalanx[row]
  }

export const upperLimbBones = bones
