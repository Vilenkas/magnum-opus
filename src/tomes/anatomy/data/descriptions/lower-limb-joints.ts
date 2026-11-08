import type { Description } from './index'

/**
 * The joints of the pelvic girdle and the lower limb and their pieces (arthrology viewer). Whole joints
 * are keyed by their `joint-index.ts` `en`. After Latarjet–Ruiz Liard's chapters 64–66, with Moore for the clinic.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })
const withMoore = (p: string, desc: Description): Description => ({ ...desc, sources: [...desc.sources, MOORE(p)] })

const joints: Record<string, Description> = {
  // ---------- Pelvic girdle ----------
  'Sacro-iliac joint': d(
    '666–668',
    'Une la cara auricular del sacro con la del coxal: sinovial plana, de superficies tan encajadas que casi no se mueve. El sacro, tallado en cuña, se apoya en los coxales y transmite el peso de la columna a los isquiones (sentado) o a las cabezas femorales (de pie).',
    'Su firmeza la dan los ligamentos posteriores e interóseos, los más fuertes; su único movimiento es un pequeño balanceo del sacro (nutación y contranutación), algo mayor en el parto.',
  ),
  'Anterior sacro-iliac ligament': d('666', 'Fibras delgadas de la cara anterior de la base del sacro a la fosa ilíaca y la línea arqueada, por delante de la articulación.'),
  'Interosseous sacro-iliac ligament': d(
    '666',
    'Fibras cortas y muy fuertes que llenan la excavación entre la tuberosidad ilíaca y la del sacro, por detrás de la articulación: el principal medio de unión del sacro.',
  ),
  'Posterior sacro-iliac ligament': d(
    '666–667',
    'Plano superficial de fascículos de la cresta y las espinas ilíacas posteriores a las crestas del sacro; los largos se continúan con el ligamento sacrotuberoso. Soportan los mayores esfuerzos de la articulación.',
  ),
  'Pubic symphysis': d(
    '669–670',
    'La unión de los dos pubis en la línea media: un **disco interpúbico** fibrocartilaginoso rodeado de ligamentos (superior, inferior y anterior, reforzado por los tendones de los rectos y los aductores). Casi no se mueve, ni siquiera en el parto, y sólo se luxa con traumatismos violentos, a menudo con lesión de la uretra.',
  ),
  'Interpubic disc': d('669', 'Fibrocartílago que llena el espacio entre los dos pubis, adherido a sus caras, más ancho delante que detrás; a menudo tiene una pequeña cavidad central.'),
  'Superior pubic ligament': d('669', 'Refuerzo superior de la sínfisis, tendido de un tubérculo del pubis al otro.'),
  'Inferior pubic ligament': d('670', 'Ligamento arqueado del borde inferior de la sínfisis: grueso, de borde cóncavo hacia abajo, forma el vértice del arco púbico, por donde se desprende la cabeza del feto.'),
  'Fibrous joints of pelvic girdle': d(
    '666–667',
    'Los **ligamentos a distancia** de la pelvis: el iliolumbar, el sacrotuberoso y el sacroespinoso, que atan el sacro y la columna a los coxales, y la membrana obturatriz. Los dos sacrociáticos convierten las escotaduras ciáticas en los agujeros ciáticos mayor y menor.',
  ),
  'Iliolumbar ligament': d('666–667', 'Fascículo potente de la apófisis transversa de L5 a la cresta ilíaca, que cierra el ángulo entre la columna y el hueso coxal.'),
  'Sacrotuberous ligament': d(
    '666–667',
    'Lámina larga y gruesa de las espinas ilíacas posteriores y el borde lateral del sacro y el cóccix a la **tuberosidad isquiática**. Con el sacroespinoso cierra los agujeros ciáticos.',
  ),
  'Sacrospinous ligament': d(
    '666–667',
    'Lámina triangular, delante del sacrotuberoso, del borde del sacro y el cóccix a la **espina ciática**. Separa el agujero ciático mayor, encima, del menor, debajo.',
  ),
  'Obturator membrane': d('634', 'Membrana fibrosa que cierra el agujero obturado, salvo arriba, donde deja el conducto obturador para el nervio y los vasos obturadores.'),
  'Triradiate cartilage': d('636–637', 'El cartílago en Y que separa en el niño el ilion, el isquion y el pubis en el fondo del acetábulo; desaparece entre los 12 y los 15 años.'),

  // ---------- Hip ----------
  'Hip joint': {
    text: [
      'La **coxofemoral**: sinovial esferoidea entre la cabeza del fémur y el acetábulo, agrandado por el labro hasta cubrir más de media esfera. Es sólida y estable para cargar el peso y, a la vez, muy móvil. El peso baja por el techo del acetábulo a la cabeza y el cuello del fémur.',
      'Es profunda, rodeada de músculos gruesos, con el triángulo femoral y sus vasos delante y el nervio ciático detrás. Sus vasos del cuello explican que la fractura de este pueda dejar la cabeza sin riego.',
    ],
    sources: [LR('670–676'), MOORE('827')],
  },
  'Articular capsule of hip joint': d(
    '672',
    'Se inserta en el borde del acetábulo y el labro, y en el fémur a distancia de la cabeza: delante en la línea intertrocantérica, detrás a mitad del cuello, de modo que parte del cuello queda dentro de la articulación. Sus fibras circulares forman la zona orbicular; la refuerzan tres ligamentos.',
  ),
  'Acetabular labrum': d(
    '672',
    'Anillo fibrocartilaginoso triangular fijado al borde del acetábulo, que llena sus escotaduras y salta sobre la acetabular como ligamento transverso. Agranda la cavidad más allá de media esfera y retiene la cabeza del fémur.',
  ),
  'Transverse acetabular ligament': d('672', 'La parte del labro que salta como un puente sobre la escotadura acetabular y la convierte en un agujero por donde entran los vasos del ligamento redondo.'),
  'Transverse part of iliofemoral ligament': d(
    '672',
    'Fascículo superior del ligamento iliofemoral (de Bertin): corto y muy fuerte, de la espina ilíaca anteroinferior al borde anterior del trocánter mayor.',
  ),
  'Descending part of iliofemoral ligament': {
    text: [
      'Fascículo inferior del ligamento iliofemoral: de la espina ilíaca anteroinferior baja casi vertical hasta la parte inferior de la línea intertrocantérica. Con el transverso forma el robusto ligamento en Y que refuerza la cadera por delante.',
    ],
    sources: [LR('672'), MOORE('787')],
  },
  'Pubofemoral ligament': {
    text: ['Ligamento de la eminencia iliopúbica y la rama superior del pubis, oblicuo hasta la parte inferomedial de la cápsula y el fémur encima del trocánter menor; evita la abducción excesiva.'],
    sources: [LR('672'), MOORE('787')],
  },
  'Ischiofemoral ligament': d('672–673', 'Ligamento de la parte posterior: del isquion, junto al acetábulo, sube oblicuo hasta delante de la fosa trocantérica; parte de sus fibras se pierden en la zona orbicular.'),
  'Zona orbicularis': d('673', 'Fibras circulares de la cápsula que rodean el cuello del fémur como un anillo y ayudan a retener la cabeza.'),
  'Frenula capsulae': d('674', 'Pliegues de la sinovial que, desde la inserción de la cápsula, suben por el cuello del fémur hasta la cabeza llevando sus vasos.'),
  'Ligament of head of femur': d(
    '673–675',
    'El **ligamento redondo**: cinta aplanada dentro de la articulación, de la fosita de la cabeza del fémur a la escotadura acetabular y el ligamento transverso, envainada por la sinovial. Lleva una pequeña arteria a la cabeza; mecánicamente apenas sujeta.',
  ),

  // ---------- Knee ----------
  'Knee joint': {
    text: [
      'La mayor articulación del cuerpo, que une fémur, tibia y rótula: una **femorotibial** bicondílea y una **femoropatelar** troclear en una sola cavidad. Los cóndilos del fémur, muy convexos, apoyan en una tibia casi plana: los **meniscos** corrigen esa falta de concordancia.',
      'La sujetan los ligamentos colaterales a los lados, los **cruzados** en el centro y los músculos alrededor. Los desgarros de los meniscos suelen ir junto con los del colateral tibial o el cruzado anterior.',
    ],
    sources: [LR('695–700'), MOORE('820')],
  },
  'Articular capsule of knee joint': d(
    '697–698',
    'Manguito amplio insertado en el fémur lejos del cartílago, en los bordes de los meniscos (porciones femoromeniscal y meniscotibial) y en la tibia. Delante la sustituyen la rótula y su ligamento; arriba se abre en el receso bajo el cuádriceps.',
  ),
  'Medial meniscus': {
    text: [
      'Fibrocartílago en forma de **C**, más ancho detrás, adherido en toda su periferia a la cápsula y al ligamento colateral tibial; sus cuernos se fijan en las áreas intercondíleas. Por esa unión se desgarra a menudo junto con el colateral tibial. Casi sin vasos, sus desgarros no cicatrizan.',
    ],
    sources: [LR('696–697'), MOORE('795, 820')],
  },
  'Lateral meniscus': d(
    '696–697',
    'Fibrocartílago en forma de **O** casi cerrada, sobre el cóndilo lateral de la tibia. Adherido a la cápsula salvo detrás, donde lo separa el tendón del poplíteo, es más móvil que el medial.',
  ),
  'Transverse ligament of knee': d('696', 'Cinta que une por delante los dos meniscos, junto a la base del cuerpo adiposo infrarrotuliano.'),
  'Meniscopatellar ligament': d('696', 'Tractos fibrosos de la cara lateral de los meniscos a los bordes inferiores de la rótula, que arrastran los meniscos hacia delante en la extensión.'),
  'Anterior meniscotibial ligament (Medial meniscus)': d('696, 698', 'Fijación del cuerno anterior del menisco medial al área intercondílea anterior de la tibia, por delante del cruzado anterior.'),
  'Posterior meniscotibial ligament (Medial meniscus)': d('696, 698', 'Fijación del cuerno posterior del menisco medial al área intercondílea posterior de la tibia.'),
  'Anterior meniscotibial ligament (Lateral meniscus)': d('696, 698', 'Fijación del cuerno anterior del menisco lateral al área intercondílea anterior, junto a la inserción del cruzado anterior.'),
  'Posterior meniscotibial ligament (Lateral meniscus)': d('696, 698', 'Fijación del cuerno posterior del menisco lateral al área intercondílea, por delante del cuerno posterior del medial.'),
  'Infrapatellar fat pad': d('648, 696', 'Cuerpo adiposo detrás del ligamento rotuliano y debajo de la rótula, que llena el espacio delante de los cóndilos y se amolda a los movimientos.'),
  'Superficial part of tibial collateral ligament': d(
    '699',
    'El **ligamento colateral tibial** (lateral interno): banda ancha del epicóndilo medial a la cara medial de la tibia, oblicua hacia abajo y adelante, que pasa sobre el tendón reflejo del semimembranoso. Impide que la rodilla se abra por dentro.',
  ),
  'Deep part of tibial collateral ligament': d('699', 'Fibras profundas del colateral tibial que se adhieren al menisco medial: la razón de que ambos se lesionen juntos.'),
  'Fibular collateral ligament': d(
    '699',
    'Cordón delgado y resistente, separable de la cápsula, del epicóndilo lateral a la **cabeza del peroné**, bajo el tendón del bíceps. Entre él y el menisco lateral pasa el tendón del poplíteo.',
  ),
  'Anterior cruciate ligament': {
    text: [
      'Del área intercondílea anterior de la tibia sube hacia atrás y afuera hasta la cara medial del cóndilo lateral del fémur. Impide que la tibia se deslice hacia delante bajo el fémur y hace de pivote en las rotaciones. Se rompe en los giros con la rodilla flexionada, frecuentes en el baloncesto o el fútbol.',
    ],
    sources: [LR('699'), MOORE('820')],
  },
  'Posterior cruciate ligament': {
    text: [
      'Del área intercondílea posterior y el borde posterior de la tibia sube hacia delante y adentro hasta la cara lateral del cóndilo medial, cruzando por detrás al anterior. Impide que la tibia se vaya hacia atrás; es el más resistente de los dos.',
    ],
    sources: [LR('699'), MOORE('800')],
  },
  'Oblique popliteal ligament': d('699', 'Expansión del tendón del semimembranoso que cruza en diagonal hacia arriba y afuera la cara posterior de la cápsula y la refuerza.'),
  'Arcuate popliteal ligament': d('699', 'Arco fibroso de la cara posterolateral, de la cabeza del peroné a la cápsula, bajo el que el tendón del poplíteo entra en la articulación.'),
  'Popliteofibular ligament': d('699', 'Fascículo del tendón del poplíteo a la cabeza del peroné, parte del refuerzo posterolateral de la rodilla.'),

  // ---------- Leg ----------
  'Superior tibiofibular joint': d(
    '728–729',
    'Articulación plana entre la cabeza del peroné y el cóndilo lateral de la tibia, con ligamentos anterior y posterior. Casi inmóvil; junto a ella el nervio fibular común rodea el cuello del peroné.',
  ),
  'Articular capsule of superior tibiofibular joint': d('728', 'Cápsula de la tibiofibular proximal, insertada alrededor de las dos carillas; su sinovial rara vez comunica con la de la rodilla.'),
  'Anterior ligament of fibular head': d('728', 'Fascículos resistentes de delante de la carilla tibial, oblicuos hacia abajo y afuera, hasta la cabeza del peroné.'),
  'Posterior ligament of fibular head': d('728', 'Refuerzo posterior de la tibiofibular proximal, cubierto por el tendón del poplíteo.'),
  'Tibiofibular syndesmosis': d(
    '729–731',
    'La unión fibrosa de los extremos inferiores de la tibia y el peroné, por los ligamentos tibiofibulares anterior, posterior e interóseo, prolongada hacia arriba por la membrana interósea. Mantiene juntos los maléolos como una **pinza** sobre el astrágalo; el peroné puede subir un poco en la flexión dorsal.',
  ),
  'Anterior tibiofibular ligament': d('729', 'Ligamento muy potente de delante de la escotadura fibular de la tibia al maléolo lateral, oblicuo hacia abajo y afuera.'),
  'Posterior tibiofibular ligament': d('729', 'Ligamento robusto del borde posterior de la tibia al maléolo lateral; cierra la pinza maleolar por detrás.'),
  'Transverse tibiofibular ligament': d('729', 'Las fibras inferiores del tibiofibular posterior, cortas y horizontales, que bajan más que la tibia y forman parte de la superficie que recibe el astrágalo.'),
  'Interosseous membrane of leg': d('730–731', 'Membrana de fibras oblicuas del borde lateral de la tibia al borde interóseo del peroné. No llega arriba hasta la articulación: deja pasar los vasos tibiales anteriores. Separa los músculos anteriores de los posteriores.'),

  // ---------- Ankle ----------
  'Ankle joint': {
    text: [
      'La **talocrural**: la tróclea del astrágalo encajada en la **mortaja** que forman la tibia y los dos maléolos. Sus movimientos son sobre todo de flexión dorsal y plantar; la cápsula es laxa delante y detrás y fuerte a los lados.',
      'El ligamento colateral lateral es mucho más débil que el medial (deltoideo): por eso el esguince de tobillo, casi siempre por inversión, lo daña a él.',
    ],
    sources: [LR('731–736'), MOORE('820')],
  },
  'Anterior talofibular ligament': {
    text: ['Fascículo anterior del colateral lateral del tobillo: plano y delgado, del borde anterior del maléolo lateral al cuello del astrágalo. Es el primero, y a menudo el único, que se rompe en el esguince por inversión.'],
    sources: [LR('732'), MOORE('820')],
  },
  'Calcaneofibular ligament': d('732', 'Fascículo medio del colateral lateral: cordón del vértice del maléolo lateral, hacia abajo y atrás, a la cara lateral del calcáneo, bajo los tendones de los peroneos.'),
  'Posterior talofibular ligament': d('732', 'El fascículo más fuerte del colateral lateral: casi horizontal, de la fosa del maléolo lateral al tubérculo posterior del astrágalo.'),
  'Tibionavicular ligament': d('732–733', 'Porción anterior del ligamento deltoideo: del maléolo medial a la cara dorsal del navicular.'),
  'Tibiocalcaneal ligament': d('732–733', 'Porción media del ligamento deltoideo: del maléolo medial, vertical, al sustentáculo del astrágalo.'),
  'Posterior tibiotalar ligament': d('732–733', 'Porción posterior del ligamento deltoideo: del maléolo medial al tubérculo medial del astrágalo; es la más profunda y gruesa.'),

  // ---------- Tarsus ----------
  'Intertarsal joints': d(
    '736–740',
    'Las articulaciones del tarso: la **subastragalina** (astrágalo y calcáneo, unidos en el seno del tarso por el ligamento interóseo), la **transversa del tarso** de Chopart (calcaneocuboidea y talocalcaneonavicular, cuya llave es el ligamento bifurcado) y las del tarso anterior (cuneiformes, navicular y cuboides).',
    'Permiten la inversión y la eversión del pie y, sobre todo, mantienen la bóveda plantar con sus ligamentos plantares.',
  ),
  'Talocalcaneal interosseous ligament': d('736', 'Ligamento firme y fuerte que ocupa el seno del tarso entre el astrágalo y el calcáneo, en dos planos: la principal unión de la subastragalina.'),
  'Lateral talocalcaneal ligament': d('736', 'Fascículo débil de la cara lateral del astrágalo a la del calcáneo, bajo el calcaneofibular.'),
  'Medial talocalcaneal ligament': d('736', 'Fascículo de la cara medial del astrágalo al sustentáculo del calcáneo.'),
  'Posterior talocalcaneal ligament': d('736', 'Ligamento aplanado del tubérculo posterior del astrágalo a la cara superior del calcáneo.'),
  'Anterior talocalcaneal ligament': d('736', 'Fibras delante de la articulación subastragalina posterior, en el seno del tarso.'),
  'Talonavicular ligament': d('737', 'Ligamento dorsal de la talocalcaneonavicular: del cuello del astrágalo al borde superior del navicular.'),
  'Plantar calcaneonavicular ligament': withMoore('816', d(
    '737',
    'El **ligamento de resorte**: fibrocartílago del sustentáculo del astrágalo al navicular, que completa por debajo la cavidad para la cabeza del astrágalo y la sostiene. Pieza clave del arco longitudinal medial.',
  )),
  'Calcaneonavicular ligament': d('738', 'Rama medial del **ligamento bifurcado** de Chopart, del calcáneo al navicular. El bifurcado es la llave de la desarticulación mediotarsiana.'),
  'Calcaneocuboid ligament': d('738', 'Rama lateral del ligamento bifurcado, del calcáneo a la cara dorsal del cuboides.'),
  'Dorsal calcaneocuboid ligament': d('737', 'Refuerzo dorsal, débil, de la calcaneocuboidea.'),
  'Plantar calcaneocuboid ligament': d('737–738', 'La lámina profunda y corta del ligamento plantar: de la cara inferior del calcáneo al cuboides.'),
  'Long plantar ligament': d(
    '737–738',
    'Lámina superficial del ligamento calcaneocuboideo plantar, el más fuerte de la planta: de la cara inferior del calcáneo pasa como un puente sobre el surco del peroneo largo hasta las bases de los últimos metatarsianos. Sostiene el arco lateral.',
  ),
  'Dorsal cuboideonavicular ligament': d('739', 'Ligamento dorsal del navicular al cuboides.'),
  'Plantar cuboideonavicular ligament': d('739', 'Ligamento plantar del navicular al cuboides.'),
  'Dorsal cuneonavicular ligaments': d('739', 'Tres ligamentos del borde superior del navicular a cada una de las tres cuñas.'),
  'Plantar cuneonavicular ligaments': d('739', 'El medial, ancho y fuerte, de la tuberosidad del navicular a la primera cuña; los otros dos, débiles, a las cuñas intermedia y lateral.'),
  'Dorsal intercuneiform ligaments': d('739', 'Dos ligamentos transversales del dorso: de la primera cuña a la segunda y de la segunda a la tercera.'),
  'Plantar intercuneiform ligaments': d('739', 'Ligamento plantar fuerte de la primera cuña a la segunda; no existe entre la segunda y la tercera.'),
  'Intercuneiform interosseous ligaments': d('739', 'Fibras interóseas entre las caras enfrentadas de las tres cuñas, que las mantienen en su bóveda transversal.'),
  'Dorsal cuneocuboid ligament': d('739', 'Ligamento dorsal de la tercera cuña al cuboides.'),
  'Plantar cuneocuboid ligament': d('739', 'Ligamento plantar de la tercera cuña al cuboides.'),
  'Cuneocuboid interosseous ligament': d('739', 'Ligamento interóseo entre la tercera cuña y el cuboides.'),

  // ---------- Metatarsus and toes ----------
  'Tarsometatarsal joints': d(
    '740–741',
    'La **articulación de Lisfranc**: planas, entre las cuñas y el cuboides y las bases de los metatarsianos, en una línea oblicua del medio del borde medial al del lateral. La base del segundo metatarsiano, encajada entre las tres cuñas, es su llave.',
  ),
  'Dorsal tarsometatarsal ligaments': d('740–741', 'Siete ligamentos del dorso entre la segunda fila del tarso y las bases de los metatarsianos; el segundo recibe tres, uno de cada cuña.'),
  'Plantar tarsometatarsal ligaments': d('740–741', 'Ligamentos plantares de la Lisfranc, reforzados por las expansiones del ligamento plantar largo y del tibial posterior.'),
  'Cuneometatarsal interosseous ligaments': d(
    '740',
    'Tres ligamentos interóseos; el medial, de la primera cuña a la base del segundo metatarsiano, es el más fuerte (el ligamento de Lisfranc).',
  ),
  'Intermetatarsal joints': d('741–742', 'Articulaciones planas entre las bases de los cuatro últimos metatarsianos, prolongación de la tarsometatarsiana; el primero queda independiente. Las cabezas se unen por el ligamento transverso profundo.'),
  'Metatarsal interosseous ligaments': d('742', 'Ligamentos interóseos entre las bases de los metatarsianos segundo a quinto, adonde llegan las sinoviales de la tarsometatarsiana.'),
  'Dorsal metatarsal ligaments': d('742', 'Ligamentos dorsales entre las bases de los metatarsianos vecinos.'),
  'Plantar metatarsal ligaments': d('742', 'Ligamentos plantares entre las bases de los metatarsianos vecinos.'),
  'Deep transverse metatarsal ligament': d('742', 'Cinta plantar que une entre sí las cabezas de los metatarsianos, separadas unas de otras.'),
  'Metatarsophalangeal joints': d(
    '742',
    'Articulaciones elipsoideas entre las cabezas de los metatarsianos y las falanges proximales, muy móviles sobre todo en extensión, la posición del pie al despegar del suelo. En la del dedo gordo, el fibrocartílago plantar lleva dos sesamoideos.',
  ),
  'Articular capsules of metatarsophalangeal joints': d('742', 'Cápsulas laxas, sobre todo por arriba, del lado de la extensión, engrosadas por debajo por la placa plantar.'),
  'Collateral metatarsophalangeal ligaments': d('742', 'Ligamentos a cada lado de las metatarsofalángicas, como los de la mano.'),
  'Plantar metatarsophalangeal ligaments': d('742', 'Las placas plantares: fibrocartílagos que agrandan por debajo la cavidad de la falange.'),
  'Intersesamoid ligament': d('742', 'Fibras que unen los dos sesamoideos de la metatarsofalángica del dedo gordo.'),
  'Interphalangeal joints of foot': d(
    '742',
    'Gínglimos como los de la mano: sólo flexión y extensión. En reposo están en ligera flexión, salvo en quien camina descalzo.',
  ),
  'Articular capsule of interphalangeal joint of great toe': d('742', 'Cápsula de la única interfalángica del dedo gordo, reforzada por los colaterales y la placa plantar.'),
  'Articular capsules of proximal interphalangeal joints of foot': d('742', 'Cápsulas de las interfalángicas proximales de los cuatro últimos dedos.'),
  'Articular capsules of distal interphalangeal joints of foot': d('742', 'Cápsulas de las interfalángicas distales de los cuatro últimos dedos.'),
  'Collateral interphalangeal ligaments of foot': d('742', 'Ligamentos a los lados de cada interfalángica del pie, que impiden la lateralidad.'),
  'Plantar interphalangeal ligaments': d('742', 'Placas plantares de las interfalángicas del pie.'),
}

export const lowerLimbJoints = joints
