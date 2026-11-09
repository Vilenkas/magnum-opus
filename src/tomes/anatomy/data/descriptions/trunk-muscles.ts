import type { Description, DescriptionSource } from './index'

/**
 * The muscles of the trunk (myology viewer): the back's own muscles and the nape after Latarjet–Ruiz Liard's chapters 6–8
 * and 19 (t. 1); the thorax, the diaphragm and the abdominal wall after chapters 74, 75, 102 and 106 (t. 2). Muscles split
 * into regional parts (iliocostal, longissimus…) share their text, led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })

interface Muscle {
  text: string[]
  sources: DescriptionSource[]
  parts?: Record<string, string>
  en?: string
}

const BACK_NERVES = 'Como todos los músculos propios del dorso, lo inervan los **ramos posteriores** de los nervios espinales.'

const MUSCLES: Muscle[] = [
  // ---------- Erector spinae ----------
  {
    text: [
      'El **iliocostal**, la columna más lateral y superficial del **erector de la columna**, la gran masa que llena el surco a cada lado de los procesos espinosos: nace con ella de la región lumbosacra (procesos espinosos lumbares, cresta sacra, espina ilíaca posterosuperior y cresta ilíaca) y sube por tendones escalonados al ángulo de las costillas y a los transversos cervicales.',
      `Extiende la columna; contraído de un solo lado la inclina y gira el tronco hacia su lado. ${BACK_NERVES}`,
    ],
    sources: [LR('54–55, 58, 62')],
    parts: {
      'Iliocostalis lumborum muscle': 'Porción **lumbar** del iliocostal: por seis tendones termina en el ángulo de las seis últimas costillas.',
      'Iliocostalis thoracis muscle': 'Porción **torácica** del iliocostal: de las últimas costillas, por seis tendones, al ángulo de las seis primeras.',
      'Iliocostalis colli muscle': 'Porción **cervical** del iliocostal: de las primeras costillas, por cuatro tendones, a los tubérculos posteriores de los transversos de las cuatro últimas cervicales.',
    },
  },
  {
    text: [
      'El **longísimo**, la columna intermedia del erector de la columna: de los procesos espinosos lumbares y la cresta sacra sube cruzando 17 vértebras y las 12 costillas, con un fascículo para cada nivel, medial a los ángulos costales, hasta los transversos del cuello y la mastoides.',
      `Extiende la columna; contraído de un solo lado la inclina y gira el tronco hacia su lado. ${BACK_NERVES}`,
    ],
    sources: [LR('54–56, 62')],
    parts: {
      'Longissimus thoracis muscle': 'Porción **torácica** del longísimo, la mayor: envía fascículos mediales a los transversos torácicos y a los accesorios lumbares, y laterales a los procesos costales lumbares y a las costillas.',
      'Longissimus colli muscle': 'Porción **cervical** del longísimo: de los transversos de las primeras torácicas a los de las cervicales.',
      'Longissimus capitis muscle': 'Porción **cefálica** del longísimo (complexo menor): lámina estrecha de los tubérculos posteriores de los transversos de las cuatro últimas cervicales al vértice y borde posterior de la **mastoides**, lateral al semiespinoso de la cabeza y profunda a los esplenios. Extiende la cabeza.',
    },
  },
  {
    text: [
      'El **espinoso**, la columna más medial del erector de la columna, pegada a los procesos espinosos: va de unos procesos espinosos a otros, por encima.',
      `Extiende la columna y, de un solo lado, colabora en su inclinación. ${BACK_NERVES}`,
    ],
    sources: [LR('54–56, 62')],
    parts: {
      'Spinalis thoracis muscle': 'Porción **torácica** del espinoso: de los procesos espinosos de las dos primeras lumbares y las dos últimas torácicas a los de las seis u ocho primeras torácicas.',
      'Spinalis colli muscle': 'Porción **cervical** del espinoso, inconstante, entre procesos espinosos de las primeras torácicas y de las cervicales.',
      'Spinalis capitis muscle': 'Porción **cefálica** del espinoso: fascículos que llegan al occipital confundidos con la parte medial del semiespinoso de la cabeza, a veces interrumpida por un tendón intermedio.',
    },
  },
  // ---------- Transversospinal ----------
  {
    text: [
      'El **semiespinoso**, el plano más superficial de los **transversoespinosos**: fascículos oblicuos hacia arriba y adentro, de los procesos transversos a los espinosos de varias vértebras más arriba.',
      `Extiende la columna; de un solo lado gira la cara anterior del tronco hacia el lado opuesto. ${BACK_NERVES}`,
    ],
    sources: [LR('56–57, 62'), LR('122')],
    parts: {
      'Semispinalis thoracis muscle': 'Porción **torácica** del semiespinoso: de los transversos de las seis últimas torácicas a los espinosos de las dos últimas cervicales y las cuatro primeras torácicas.',
      'Semispinalis colli muscle': 'Porción **cervical** del semiespinoso: de los transversos de las cinco primeras torácicas a los espinosos de las cinco últimas cervicales, a veces hasta el axis; cubre a los multífidos del cuello.',
    },
  },
  {
    text: [
      'Los **multífidos**, fascículos cortos e imbricados del plano medio de los transversoespinosos: de cada proceso transverso a la base y al vértice del proceso espinoso de la tercera y la cuarta vértebras de arriba.',
      `Muy potentes por el número y la brevedad de sus fascículos; de un solo lado, giran el tronco hacia el lado opuesto. ${BACK_NERVES}`,
    ],
    sources: [LR('57, 62')],
    parts: {
      'Multifidus lumborum muscle': 'Multífidos de la región **lumbar**.',
      'Multifidus thoracis muscle': 'Multífidos de la región **torácica**.',
      'Multifidus colli muscle': 'Multífidos de la región **cervical**, cubiertos por el semiespinoso del cuello.',
    },
  },
  {
    en: 'Rotatores',
    text: [
      'Los **rotadores**, el plano más profundo de los transversoespinosos, pegado a las láminas: de cada proceso transverso, el **rotador corto** va al borde inferior de la lámina de la vértebra de arriba y el **rotador largo** a la de la segunda vértebra de arriba.',
      `De un solo lado, giran el tronco hacia el lado opuesto. ${BACK_NERVES}`,
    ],
    sources: [LR('57, 62')],
  },
  // ---------- Short muscles ----------
  {
    text: [
      'Los **interespinosos**, pequeñas cintas musculares, una a cada lado del ligamento interespinoso, del borde superior de un proceso espinoso al inferior del de arriba. Bien desarrollados en el cuello y la región lumbar, atrofiados o ausentes en el tórax, la parte menos móvil de la columna.',
      BACK_NERVES,
    ],
    sources: [LR('57–58')],
    parts: {
      'Interspinales colli muscles': 'Interespinosos del **cuello**, bien desarrollados, entre los procesos espinosos bífidos.',
      'Interspinales thoracis muscles': 'Interespinosos del **tórax**, atrofiados o ausentes.',
      'Interspinales lumborum muscles': 'Interespinosos de la región **lumbar**, bien desarrollados.',
    },
  },
  {
    text: [
      'Los **intertransversos lumbares**, pequeños músculos cuadriláteros entre los procesos transversos vecinos: dos por espacio en las regiones cervical y lumbar, una sola lengüeta poco desarrollada en el tórax.',
      'Inclinan la columna hacia su lado; los inervan ramos de los nervios espinales.',
    ],
    sources: [LR('58, 62')],
    parts: {
      'Dorsal parts of lateral intertransversarii lumborum muscles': 'Porción **dorsal** del intertransverso lateral lumbar, la posterior de las dos lengüetas de cada espacio.',
      'Ventral parts of lateral intertransversarii lumborum muscles': 'Porción **ventral** del intertransverso lateral lumbar, entre los procesos costales vecinos.',
    },
  },
  // ---------- Nape ----------
  {
    text: [
      'Los **esplenios**, el plano superficial de la nuca bajo el trapecio y el esternocleidomastoideo: de los procesos espinosos de C7 y las cuatro o cinco primeras torácicas, y del tercio inferior del ligamento nucal, suben en una lámina ancha hacia arriba y afuera.',
      'Extienden la cabeza y el cuello; de un solo lado, los giran hacia su lado. Los inervan los ramos posteriores de los nervios cervicales.',
    ],
    sources: [LR('121, 124, 136')],
    parts: {
      'Splenius capitis muscle': 'El **esplenio de la cabeza**, que termina en la línea nucal superior del occipital y en la cara lateral de la mastoides; con el del otro lado deja ver arriba el semiespinoso de la cabeza.',
      'Splenius colli muscle': 'El **esplenio del cuello**, que termina en los tubérculos posteriores de los transversos del atlas, el axis y C3.',
    },
  },
  {
    en: 'Rectus posterior major capitis muscle',
    text: [
      'Músculo **suboccipital** triangular del proceso espinoso del axis a la mitad lateral de la línea nucal inferior, aplicado sobre las dos primeras vértebras. Extiende la cabeza y la gira hacia su lado. Lo inerva el ramo posterior de C1 (**nervio suboccipital**).',
    ],
    sources: [LR('122, 124, 136'), LR('345')],
  },
  {
    en: 'Rectus posterior minor capitis muscle',
    text: [
      'Músculo **suboccipital** pequeño y triangular del tubérculo posterior del atlas a la mitad medial de la línea nucal inferior, medial y más profundo que el recto mayor, sobre la membrana atlantooccipital posterior. Extiende la cabeza. Lo inerva el **nervio suboccipital** (C1).',
    ],
    sources: [LR('123, 136'), LR('345')],
  },
  {
    en: 'Obliquus inferior capitis muscle',
    text: [
      'El **oblicuo inferior** (mayor) de la cabeza, el único suboccipital que no llega al cráneo: grueso y rectangular, del proceso espinoso del axis al transverso del atlas, al que hace girar con la cabeza hacia su lado. Detrás lo rodea el **nervio occipital mayor** (C2); delante pasa la arteria vertebral. Lo inervan C1 y C2.',
    ],
    sources: [LR('123–124, 136'), LR('345')],
  },
  {
    en: 'Obliquus superior capitis muscle',
    text: [
      'El **oblicuo superior** (menor) de la cabeza, aplanado, del transverso del atlas a la línea nucal inferior, por fuera del recto mayor. Con éste y el oblicuo inferior limita el **triángulo suboccipital**, en cuyo fondo cruza la arteria vertebral y por el que sale el nervio suboccipital. Lo inerva C1.',
    ],
    sources: [LR('124'), LR('345')],
  },
  // ---------- Serratus posterior ----------
  {
    en: 'Serratus posterior superior muscle',
    text: [
      'Lámina delgada de los procesos espinosos de C7 y las tres primeras torácicas a la cara posterolateral de las costillas 2.ª a 5.ª, bajo los romboides y el trapecio y sobre los músculos de los canales vertebrales. Eleva las costillas: es inspirador (respiración forzada). Lo inervan ramos de los nervios intercostales vecinos.',
    ],
    sources: [LR('59'), LR2('1145')],
  },
  {
    en: 'Serratus posterior inferior muscle',
    text: [
      'Lámina de los procesos espinosos de las dos últimas torácicas y las tres primeras lumbares a las cuatro últimas costillas, oculta bajo el dorsal ancho. Baja esas costillas: se le atribuye acción espiratoria. Lo inervan ramos de los nervios intercostales. Una aponeurosis fina lo une al serrato superior.',
    ],
    sources: [LR('59')],
  },
  // ---------- Thorax ----------
  {
    text: [
      'Los **elevadores de las costillas**, pequeños músculos en abanico del vértice de los procesos transversos de C7 y de T1–T11 al borde superior y la cara lateral de la costilla de abajo, junto a la columna. Son inspiradores, poco potentes, y los inervan los nervios intercostales.',
    ],
    sources: [LR2('843, 1145'), { fuente: 'rouviere-2', p: '101' }],
    parts: {
      'Levatores breves costarum': 'Los **elevadores cortos**, que van a la costilla inmediatamente inferior.',
      'Levatores longi costarum': 'Los **elevadores largos**, fascículos de los cortos de los últimos espacios que saltan una costilla y llegan a la segunda de abajo.',
    },
  },
  {
    en: 'External intercostal muscles',
    text: [
      'La capa superficial de cada espacio intercostal: del borde inferior de una costilla al superior de la siguiente, con fibras oblicuas hacia **abajo y adelante**, desde la articulación costotransversa hasta cerca de los cartílagos, donde lo continúa la membrana intercostal externa.',
      'Con el diafragma, es el músculo de la **inspiración normal**: eleva las costillas. Lo inervan los nervios intercostales.',
    ],
    sources: [LR2('842, 1145'), LR('349')],
  },
  {
    en: 'Internal intercostal muscles',
    text: [
      'La capa media del espacio intercostal, bajo el externo: de los bordes de costillas y cartílagos vecinos, con fibras oblicuas hacia **abajo y atrás**, cruzadas en X con las del externo. Ocupa sólo la parte anterior del espacio, desde la línea axilar media hasta el esternón; detrás lo continúa la membrana intercostal interna.',
      'Entre él y el intercostal íntimo corren la vena, la arteria y el nervio intercostales. Lo inervan los nervios intercostales.',
    ],
    sources: [LR2('842'), LR('348–349')],
  },
  {
    en: 'Innermost intercostal muscles',
    text: [
      'La capa profunda del espacio intercostal, del borde medial del surco costal al borde superior de la costilla de abajo, con fibras como las del interno, desde cerca del esternón hasta el ángulo costal. El paquete vasculonervioso intercostal lo separa del intercostal interno; por dentro, la fascia endotorácica y la pleura.',
      'Participa en la **espiración forzada**, con los abdominales. Lo inervan los nervios intercostales.',
    ],
    sources: [LR2('842, 1146'), LR('348')],
  },
  {
    en: 'Transversus thoracis muscle',
    text: [
      'Músculo par en la cara posterior del esternón: de su cuerpo y del xifoides sube en abanico a la cara profunda de los cartílagos 3.º a 6.º. Con los cartílagos encierra a los **vasos torácicos internos**; por detrás tiene los recesos pleurales anteriores. Es un músculo en regresión, de acción mínima, inervado por los nervios intercostales.',
    ],
    sources: [LR2('844')],
  },
  {
    en: 'Diaphragm',
    text: [
      'Tabique musculotendinoso en cúpula entre el tórax y el abdomen. Sus fibras nacen de toda la abertura inferior del tórax: atrás, de las vértebras lumbares por los **pilares** (el derecho hasta L3, el izquierdo hasta L2) y de los ligamentos arqueados sobre el psoas y el cuadrado lumbar; a los lados, de las seis últimas costillas; delante, del xifoides. Todas convergen en el **centro tendinoso**, en trébol, y forman dos cúpulas, la derecha más alta.',
      'Lo atraviesan la vena cava inferior (por un foramen fibroso del centro tendinoso), el esófago con los vagos (hiato muscular, frente a T10) y la aorta con el conducto torácico (entre los pilares, delante de T11–T12). Es el principal **inspirador**: al bajar agranda el tórax en altura y, apoyado en las vísceras, eleva las costillas inferiores. Lo inervan los dos **nervios frénicos** (C3–C5): parálisis de uno, ascenso de su hemidiafragma.',
    ],
    sources: [LR2('845–848, 852, 855, 1146')],
  },
  // ---------- Abdominal wall ----------
  {
    en: 'Rectus abdominis muscle',
    text: [
      'Músculo acintado a cada lado de la línea media, de los cartílagos 5.º a 7.º y el xifoides al cuerpo del **pubis**, cortado por tres o cuatro **intersecciones tendinosas** que se ven bajo la piel en los sujetos musculosos. Lo envuelve la **vaina del recto**, formada por las aponeurosis de los tres músculos anchos, y por dentro de ella suben las arterias epigástricas.',
      'Con los demás abdominales flexiona el tronco. Lo inervan, en segmentos, los seis últimos nervios intercostales y el iliohipogástrico, que entran por su borde lateral: por eso no se lo corta a lo largo de ese borde.',
    ],
    sources: [LR2('1233–1234, 1238'), LR('61')],
  },
  {
    en: 'Pyramidalis muscle',
    text: [
      'Músculo rudimentario e inconstante, delgado y triangular, del cuerpo del pubis a la línea alba, delante de la parte baja del recto del abdomen y dentro de su vaina.',
    ],
    sources: [LR2('1234')],
  },
  {
    en: 'External abdominal oblique muscle',
    text: [
      'El más superficial de los **músculos anchos** del abdomen: de la cara externa de las siete u ocho últimas costillas, en digitaciones que se entrecruzan con las del serrato anterior y el dorsal ancho, se abre en abanico hacia **abajo, adelante y adentro**. Su aponeurosis forma la hoja anterior de la vaina del recto y llega a la línea alba; su borde inferior es el **ligamento inguinal**, y junto al pubis se abre en el anillo inguinal superficial.',
      'Con los demás músculos anchos flexiona el tronco, forma la cincha que sostiene las vísceras y actúa en la espiración forzada. Detrás deja con el dorsal ancho el **triángulo lumbar** (de Petit). Lo inervan los últimos nervios intercostales.',
    ],
    sources: [LR2('1234–1236, 1238, 1146'), LR('61')],
  },
  {
    en: 'Internal abdominal oblique muscle',
    text: [
      'El músculo ancho intermedio, bajo el oblicuo externo, con fibras cruzadas en X con las de éste (hacia **arriba, adelante y adentro**): de la fascia toracolumbar, la cresta ilíaca y el tercio lateral del ligamento inguinal a las tres últimas costillas y, por una aponeurosis que se desdobla alrededor del recto, a la línea alba. Sus fibras más bajas pasan en puente sobre el cordón espermático y dan el **cremáster**.',
      'Con los demás músculos anchos flexiona el tronco, forma la cincha que sostiene las vísceras y actúa en la espiración forzada. Lo inervan los dos últimos intercostales y los nervios iliohipogástrico e ilioinguinal.',
    ],
    sources: [LR2('1236–1238, 1146'), LR('61')],
  },
  {
    en: 'Transversus abdominis muscle',
    text: [
      'El músculo ancho más profundo, de fibras transversales: de la cara interna de las seis últimas costillas (entrecruzado con el diafragma), de los procesos costales lumbares por la fascia toracolumbar, de la cresta ilíaca y del ligamento inguinal. Su aponeurosis, que empieza en la **línea semilunar**, pasa detrás del recto en sus dos tercios superiores y delante en el inferior; abajo forma la **hoz inguinal**.',
      'Es la faja más profunda de la cincha abdominal, que sostiene las vísceras y actúa en la espiración forzada. Por dentro lo tapiza la **fascia transversalis**. Lo inervan los seis últimos intercostales y los nervios iliohipogástrico e ilioinguinal.',
    ],
    sources: [LR2('1237–1238, 1146')],
  },
  {
    en: 'Quadratus lumborum muscle',
    text: [
      'Músculo cuadrilátero de la pared posterior del abdomen, entre la 12.ª costilla, los procesos costales lumbares y la cresta ilíaca, en una vaina formada por las láminas anterior y media de la fascia toracolumbar. Delante, a través de su fascia, se relaciona con el riñón; detrás lo cubren el erector de la columna y el dorsal ancho.',
      'Inclina la columna hacia su lado o eleva la pelvis. Lo inervan el nervio subcostal (T12) y ramos del plexo lumbar.',
    ],
    sources: [LR('59–60')],
  },
  {
    en: 'Linea alba',
    text: [
      'Rafe fibroso de la línea media, del xifoides a la sínfisis del pubis, formado por el entrecruzamiento de las aponeurosis de los tres músculos anchos de ambos lados, entre los dos rectos: ancho hasta el ombligo, que se abre en ella, y lineal por debajo. Es la parte más delgada de la pared, por donde se hacen las laparotomías medianas; en ella aparecen las hernias de la línea alba y, tras varios embarazos, la diástasis de los rectos.',
    ],
    sources: [LR2('1241–1243')],
  },
  {
    en: 'Inguinal ligament',
    text: [
      'El borde inferior de la aponeurosis del oblicuo externo, enrollado en canal, de la **espina ilíaca anterosuperior** a la espina del pubis. Bajo él pasan del abdomen al muslo, por fuera, el iliopsoas y el nervio femoral (laguna muscular) y, por dentro, la arteria y la vena femorales (laguna vascular); medialmente se refleja en el ligamento lacunar.',
      'Por encima corre el conducto inguinal, por debajo y medial a los vasos queda el anillo femoral: allí se producen las hernias inguinales y femorales.',
    ],
    sources: [LR2('1235, 1242–1245')],
  },
]

const fasciae: Record<string, Description> = {
  'Posterior layer of thoracolumbar fascia': {
    text: [
      'La lámina **posterior** o superficial de la fascia toracolumbar: cubre por detrás al erector de la columna y se inserta en los procesos espinosos; une los serratos posteriores y da origen al dorsal ancho. Hacia arriba continúa como fascia de la nuca.',
      'Con las láminas media y anterior encierra los músculos del dorso y el cuadrado lumbar; las tres se reúnen en el borde lateral de éste, donde nacen el oblicuo interno y el transverso.',
    ],
    sources: [LR2('1239–1240'), LR('59')],
  },
  'Middle layer of thoracolumbar fascia': {
    text: [
      'La lámina **media** de la fascia toracolumbar: de los vértices de los procesos costales lumbares, entre el erector de la columna detrás y el cuadrado lumbar delante; la refuerza arriba el ligamento lumbocostal. Lateralmente se confunde con la aponeurosis posterior del transverso del abdomen.',
    ],
    sources: [LR2('1239–1240'), LR('60')],
  },
  'Anterior layer of thoracolumbar fascia': {
    text: [
      'La lámina **anterior** o profunda de la fascia toracolumbar, la más delgada: cubre por delante al cuadrado lumbar y se fija en la cara anterior de los procesos costales, lateral al psoas. La separa del riñón el espacio pararrenal.',
    ],
    sources: [LR2('1240'), LR('60')],
  },
  'Clavipectoral fascia': {
    text: [
      'Lámina fibrosa entre la clavícula, donde envuelve al subclavio, y el borde superior del **pectoral menor**, al que también envuelve; por debajo se continúa hasta la piel de la base de la axila como ligamento suspensorio. La atraviesan la vena cefálica y la arteria toracoacromial.',
    ],
    sources: [LR('483')],
  },
}

const descriptions: Record<string, Description> = { ...fasciae }
for (const m of MUSCLES) {
  if (m.en) descriptions[m.en] = { text: m.text, sources: m.sources }
  for (const [en, lead] of Object.entries(m.parts ?? {})) descriptions[en] = { text: [lead, ...m.text], sources: m.sources }
}

export const trunkMuscles = descriptions
