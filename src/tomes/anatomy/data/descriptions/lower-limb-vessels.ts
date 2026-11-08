import type { Description } from './index'

/** Arteries, veins and lymph nodes of the lower limb (vessels viewer), after Latarjet–Ruiz Liard's chapters 67–69. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })

const satellite = (artery: string, p: string, more = ''): Description =>
  d(p, `Venas satélites de la ${artery}: por debajo de la rodilla cada arteria lleva dos, unidas entre sí por anastomosis, con válvulas que dirigen la sangre hacia arriba.${more}`)

const vessels: Record<string, Description> = {
  // ---------- From the pelvis ----------
  'External iliac artery': d('772, 775', 'La rama de la ilíaca común que continúa el eje principal del miembro inferior: bordea la pelvis y, al pasar bajo el ligamento inguinal, se convierte en la **arteria femoral**.'),
  'External iliac vein': d('791', 'Continuación de la vena femoral por encima del ligamento inguinal; recoge toda la sangre profunda del miembro y la lleva a la ilíaca común.'),
  'Superior gluteal artery': d(
    '772–773',
    'La mayor rama de la ilíaca interna para el miembro: sale de la pelvis **por encima del piriforme**, por el agujero ciático mayor, con el nervio glúteo superior, e irriga los glúteos y el tensor de la fascia lata. Su emergencia se proyecta en la línea del trocánter mayor a la espina ilíaca posterosuperior.',
  ),
  'Inferior gluteal artery': d(
    '773–774',
    'Rama de la ilíaca interna que sale **por debajo del piriforme**, con el nervio ciático, e irriga el glúteo mayor y la parte alta del muslo. Es el resto de la arteria principal del miembro en el feto, y por sus anastomosis con la femoral puede suplirla.',
  ),
  'Obturator artery': d(
    '774–775',
    'Rama de la ilíaca interna que sigue la pared de la pelvis hasta el **conducto obturador** y se divide en dos ramas que rodean el agujero obturado. Irriga los aductores y, por la rama acetabular, el ligamento redondo y la cabeza del fémur.',
  ),
  'Internal pudendal artery': d('772', 'Rama de la ilíaca interna que sale de la pelvis bajo el piriforme, rodea la espina ciática y entra en el periné: es la arteria de los órganos genitales externos y el periné.'),
  'Superior gluteal veins': satellite('arteria glútea superior', '791', ' Llevan la sangre de los glúteos a la ilíaca interna.'),
  'Inferior gluteal veins': satellite('arteria glútea inferior', '791', ' Entran en la pelvis bajo el piriforme y reciben las venas perforantes del muslo.'),
  'Internal pudendal vein': d('791', 'Vena satélite de la arteria pudenda interna, del periné a la ilíaca interna.'),
  'Superficial external pudendal artery': d('779', 'Pequeña rama de la femoral bajo el ligamento inguinal para la piel del pubis y los genitales externos.'),
  'Deep external pudendal artery': d('779', 'Rama de la femoral que cruza por detrás de la vena femoral hacia los genitales externos.'),
  'External pudendal veins': d('776, 794', 'Venas de los genitales externos y el pubis que desembocan en el cayado de la safena mayor.'),

  // ---------- Thigh ----------
  'Femoral artery': d(
    '775–780',
    'Continúa a la ilíaca externa bajo la mitad del ligamento inguinal y recorre el muslo hasta el **hiato aductor**, donde pasa a llamarse poplítea. Arriba, en el **triángulo femoral**, es superficial y late bajo la piel; se puede comprimir contra la cabeza del fémur. Más abajo baja por el conducto aductor, cubierta por el sartorio.',
    'A 4–5 cm de su origen da la **femoral profunda**, la gran vía de suplencia si se obstruye.',
  ),
  'Deep femoral artery': d(
    '779–780',
    'La rama mayor de la femoral: se separa hacia atrás en el triángulo femoral y baja entre los aductores. Da las circunflejas femorales y las **arterias perforantes**, que atraviesan los aductores hacia los músculos posteriores. Es la principal vía de suplencia cuando la femoral se obstruye.',
  ),
  'Lateral circumflex femoral artery': d('779–780', 'Rama de la femoral profunda que pasa por fuera, bajo el recto femoral, rodea el fémur por delante y riega el cuádriceps y la cadera.'),
  'Descending branch of lateral circumflex femoral artery': d('779', 'La «arteria del cuádriceps»: rama gruesa de la circunfleja lateral que baja por el vasto lateral hasta la red de la rodilla.'),
  'Medial circumflex femoral artery': d('780', 'Rama de la femoral profunda que pasa por dentro, entre el pectíneo y el iliopsoas, rodea el cuello del fémur por detrás y da ramas a la cabeza del fémur.'),
  'Perforating femoral arteries': d('780', 'Tres o cuatro ramas de la femoral profunda que atraviesan los aductores cerca de la línea áspera y riegan los músculos posteriores del muslo; anastomosadas entre sí y con la glútea inferior y las circunflejas, forman una cadena de suplencia.'),
  'Femoral vein': d(
    '791',
    'Una sola vena, satélite de la arteria femoral del hiato aductor al ligamento inguinal: abajo detrás de la arteria, arriba por dentro de ella. Recibe la femoral profunda y, en el triángulo femoral, la **safena mayor**; continúa como ilíaca externa.',
  ),
  'Deep femoral vein': satellite('arteria femoral profunda', '791', ' Muy voluminosa, recibe las venas perforantes y termina en la vena femoral.'),
  'Lateral circumflex femoral veins': satellite('arteria circunfleja femoral lateral', '791'),
  'Medial circumflex femoral veins': satellite('arteria circunfleja femoral medial', '791'),
  'Perforating veins': d('791, 794', 'Venas que siguen a las arterias perforantes a través de los aductores, y venas comunicantes que atraviesan la fascia entre las redes superficial y profunda; sus válvulas dejan pasar la sangre sólo hacia la profunda.'),

  // ---------- Knee ----------
  'Popliteal artery': d(
    '781–784',
    'Continuación de la femoral desde el hiato aductor hasta el arco del sóleo, donde se divide en tibiales anterior y posterior. Es la más profunda del eje poplíteo: de la profundidad a la superficie se escalonan la arteria, la vena y el nervio tibial. Está pegada al fémur y a la cápsula, por lo que se lesiona en fracturas y luxaciones de la rodilla.',
    'Sus ramas geniculares forman la red de la rodilla, demasiado pobre para suplirla si se obstruye.',
  ),
  'Superior medial genicular artery': d('783–784', 'Rama de la poplítea que rodea el fémur por dentro, encima del cóndilo medial, hacia la red articular de la rodilla.'),
  'Superior lateral genicular artery': d('783–784', 'Rama de la poplítea que rodea el fémur por fuera, encima del cóndilo lateral, hacia la red de la rodilla.'),
  'Middle genicular artery': d('784', 'Rama de la poplítea que atraviesa la cápsula por detrás e irriga los ligamentos cruzados y la sinovial.'),
  'Inferior medial genicular artery': d('784', 'Rama de la poplítea que rodea la tibia bajo el cóndilo medial, entre el ligamento colateral tibial y el hueso.'),
  'Inferior lateral genicular artery': d('784', 'Rama de la poplítea que rodea la rodilla por fuera, sobre la cabeza del peroné, bajo el ligamento colateral fibular.'),
  'Popliteal vein': d('791', 'Nace en el arco del sóleo de la unión de las tibiales anteriores y posteriores, sube por detrás y por fuera de la arteria poplítea y, al cruzar el hiato aductor, se llama femoral. Recibe la **safena menor**.'),
  'Genicular veins': d('791', 'Venas satélites de las arterias geniculares, que forman alrededor de la rodilla una red y desembocan en la poplítea.'),

  // ---------- Leg ----------
  'Anterior tibial artery': d(
    '784–785',
    'Rama de la poplítea que pasa por encima de la membrana interósea al compartimento anterior y baja sobre ella, con el **nervio fibular profundo**, entre el tibial anterior y los extensores. Delante del tobillo se continúa como **arteria dorsal del pie**.',
  ),
  'Posterior tibial artery': d(
    '787–789',
    'La rama mayor de la poplítea: baja bajo el tríceps sural, con el **nervio tibial**, y detrás del maléolo medial entra en el túnel del tarso, donde se divide en plantares medial y lateral. Su pulso, entre el maléolo medial y el tendón calcáneo, es muy valioso para valorar la circulación del pie.',
  ),
  'Fibular artery': d(
    '787',
    'Rama de la tibial posterior que baja junto al peroné, bajo el flexor largo del dedo gordo, hasta el tobillo. Arteria sólo nutricia de la pierna, con una rama perforante al dorso del tobillo y ramas maleolares y calcáneas.',
  ),
  'Calcaneal branches of fibular artery': d('787', 'Ramas terminales de la arteria fibular para la cara lateral del talón.'),
  'Calcaneal branches of posterior tibial artery': d('789', 'Ramas de la tibial posterior, nacidas a menudo en el túnel del tarso, para la cara medial del talón.'),
  'Anterior tibial veins': satellite('arteria tibial anterior', '791', ' Con las tibiales posteriores forman la vena poplítea.'),
  'Posterior tibial veins': satellite('arteria tibial posterior', '791', ' Reciben las grandes venas de los músculos de la pantorrilla, cuya contracción empuja la sangre hacia arriba.'),
  'Fibular veins': satellite('arteria fibular', '791', ' Desembocan en las tibiales posteriores.'),

  // ---------- Foot ----------
  'Dorsalis pedis artery': d(
    '785–787',
    'La **pedia**: continúa a la tibial anterior bajo el retináculo extensor y va por el dorso del pie, entre el tendón del extensor largo del dedo gordo y el pedio, hasta el primer espacio, donde se hunde y se une a la plantar lateral. Se palpa ahí con facilidad; su ausencia orienta hacia una obstrucción arterial.',
  ),
  'Lateral tarsal artery': d('786', 'Rama de la pedia que va bajo el pedio hacia el borde lateral del pie, donde se une a ramas de la plantar lateral.'),
  'Arcuate artery': d('786', 'Rama de la pedia que cruza el dorso del pie sobre las bases de los metatarsianos y da las arterias metatarsianas dorsales.'),
  'Deep plantar artery': d('786–787, 790', 'La rama terminal de la pedia que atraviesa el primer espacio intermetatarsiano y cierra con la plantar lateral el arco plantar.'),
  'Dorsal metatarsal arteries': d('786', 'Las arterias de los espacios intermetatarsianos por el dorso, nacidas de la arteria arqueada; se dividen en las digitales dorsales.'),
  'Dorsal digital arteries of foot': d('786', 'Ramas de las metatarsianas dorsales para el dorso de los dedos.'),
  'Medial plantar artery': d('789–790', 'La menor de las ramas terminales de la tibial posterior: va hacia delante bajo el abductor del dedo gordo, con el nervio plantar medial, hacia el borde medial de la planta.'),
  'Superficial branch of medial plantar artery': d('790', 'Rama superficial de la plantar medial para el borde medial de la planta y el dedo gordo.'),
  'Lateral plantar artery': d('790', 'La mayor rama terminal de la tibial posterior: cruza la planta entre el cuadrado plantar y el flexor corto de los dedos y se curva hacia dentro formando el **arco plantar**.'),
  'Plantar arch': d('790', 'Arco profundo de la planta formado por la plantar lateral y cerrado por la rama de la pedia en el primer espacio. Da las metatarsianas plantares y ramas perforantes al dorso.'),
  'Plantar metatarsal arteries': d('790', 'Ramas del arco plantar, una por espacio, que se continúan en las digitales plantares comunes.'),
  'Perforating branches of plantar metatarsal arteries': d('790', 'Ramas que suben del arco plantar por los espacios intermetatarsianos hasta las metatarsianas dorsales.'),
  'Common plantar digital arteries': d('790', 'Prolongación de las metatarsianas plantares que se divide en las digitales propias de dos dedos vecinos.'),
  'Proper plantar digital arteries': d('790', 'Las arterias colaterales de cada dedo del pie, medial y lateral, como en la mano.'),

  // ---------- Superficial veins ----------
  'Great saphenous vein': d(
    '793–795',
    'La **safena mayor** (interna): nace delante del maléolo medial y sube por la cara medial de la pierna, detrás del borde de la tibia, de la rodilla y del muslo hasta el triángulo femoral, donde atraviesa la fascia cribiforme y forma su **cayado** en la vena femoral. Recibe ahí venas en estrella (pudendas, epigástrica, circunfleja ilíaca superficiales).',
    'Se comunica con las profundas por venas perforantes. Es la vena de las várices, y la que se extrae para hacer puentes coronarios.',
  ),
  'Small saphenous vein': d('793', 'La **safena menor** (externa): nace en el borde lateral del pie, pasa detrás del maléolo lateral junto al tendón calcáneo, sube por la pantorrilla entre las cabezas del gastrocnemio y desemboca en la **vena poplítea**. Tiene de 8 a 15 válvulas.'),
  'Dorsal venous arch of foot': d('792–794', 'Arco venoso del dorso del pie que recibe las venas de los dedos; de su extremo medial nace la safena mayor y del lateral la menor.'),
  'Dorsal metatarsal veins': d('791–792', 'Venas de los espacios intermetatarsianos por el dorso, que van al arco venoso dorsal.'),
  'Dorsal digital veins of foot': d('792', 'Venas del dorso de los dedos del pie, que forman el arco venoso dorsal.'),
  'Intercapitular veins of foot': d('791–792', 'Venas entre las cabezas de los metatarsianos que unen las redes plantar y dorsal.'),
  'Plantar venous arch': d('791–792', 'Arco venoso profundo de la planta, satélite del arco plantar; la red plantar superficial, comprimida al caminar, empuja la sangre hacia los bordes del pie.'),
  'Plantar metatarsal veins': d('791', 'Venas satélites de las metatarsianas plantares, que van al arco venoso plantar.'),
  'Plantar digital veins': d('791–792', 'Venas finas de la planta de los dedos, que drenan hacia el dorso por las comisuras.'),
  'Medial plantar veins': satellite('arteria plantar medial', '791'),
  'Lateral plantar veins': satellite('arteria plantar lateral', '791', ' Con las mediales forman las tibiales posteriores.'),

  // ---------- Lymph nodes ----------
  'Superomedial superficial inguinal nodes': d('797–798', 'Nodos inguinales superficiales por encima y por dentro del cayado de la safena mayor: reciben la linfa de la pared abdominal baja, el periné y los genitales externos.'),
  'Superolateral superficial inguinal nodes': d('797–798', 'Nodos inguinales superficiales por encima y por fuera del cayado de la safena: reciben la linfa de la región glútea y de la pared abdominal.'),
  'Inferior superficial inguinal nodes': d('797–798', 'Nodos inguinales superficiales dispuestos verticalmente por debajo del cayado de la safena mayor, a lo largo de ella: reciben casi toda la linfa superficial del miembro inferior.'),
  '(Proximal deep inguinal node)': d('776, 799', 'El nodo de **Cloquet**, el mayor de los inguinales profundos, en el anillo femoral, por dentro de la vena femoral. Recoge la linfa de los inguinales y la lleva a los ilíacos externos.'),
  '(Intermediate deep inguinal node)': d('799', 'Uno de los dos o tres nodos inguinales profundos, por dentro de la vena femoral, en el conducto femoral.'),
  'Superficial popliteal nodes': d('798', 'Nodo sural, junto al final de la safena menor en la fosa poplítea, que recibe los linfáticos superficiales posterolaterales de la pierna.'),
  'Deep popliteal nodes': d('798–799', 'Cuatro a seis pequeños nodos alrededor de los vasos poplíteos, que reciben los linfáticos profundos de la pierna y se vacían en los nodos inguinales profundos.'),
  '(Anterior tibial node)': d('785', 'Pequeño nodo inconstante junto a la arteria tibial anterior, en el borde superior de la membrana interósea.'),
}

export const lowerLimbVessels = vessels
