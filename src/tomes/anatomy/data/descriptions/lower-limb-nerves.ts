import type { Description } from './index'

/** The lumbar and sacral plexuses in the lower limb (nervous viewer), after Latarjet–Ruiz Liard's chapter 70. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })

const nerves: Record<string, Description> = {
  // ---------- Lumbar plexus ----------
  'Lateral femoral cutaneous nerve': d(
    '801',
    'Nervio sólo sensitivo de L2 (y L3): atraviesa el psoas, cruza la fosa ilíaca y sale de la pelvis junto a la espina ilíaca anterosuperior, bajo el ligamento inguinal, para dar la piel de la cara **anterolateral del muslo** hasta la rodilla.',
  ),
  'Femoral nerve': d(
    '801–803',
    'El mayor ramo del plexo lumbar (L2–L4). Baja en el surco entre el psoas y el ilíaco y pasa bajo el ligamento inguinal **por fuera de la arteria femoral**; en el triángulo femoral se abre en abanico. Inerva el iliopsoas, el pectíneo, el sartorio y el **cuádriceps**, y la piel de la cara anteromedial del muslo y, por el safeno, de la pierna.',
    'Es la vía del reflejo rotuliano; su lesión impide extender la rodilla y altera mucho la marcha.',
  ),
  'Anterior cutaneous branches of femoral nerve': d('801–802', 'Ramos cutáneos del femoral que atraviesan el sartorio y la fascia lata y dan la piel de las caras anterior y medial del muslo hasta la rodilla.'),
  'Saphenous nerve': {
    text: [
      'El ramo sensitivo más largo del femoral, el único del plexo lumbar que baja más allá de la rodilla. Acompaña a la arteria femoral en el conducto aductor, sale a la cara medial de la rodilla y sigue a la **vena safena mayor** por la cara medial de la pierna hasta el pie, donde puede lesionarse al canalizar esa vena delante del maléolo.',
    ],
    sources: [LR('801–802'), MOORE('700')],
  },
  'Infrapatellar branch of saphenous nerve': d('802', 'Ramo del safeno que atraviesa el sartorio y da la piel de delante de la rodilla, debajo de la rótula.'),
  'Medial crural cutaneous branches of saphenous nerve': d('802', 'Ramos del safeno para la piel de la cara medial de la pierna.'),
  'Obturator nerve': d(
    '803–805',
    'Ramo del plexo lumbar (L2–L4) que baja por la pared lateral de la pelvis y sale por el **conducto obturador** con los vasos obturadores, dividido en un ramo anterior y uno posterior a los lados del aductor corto. Inerva los **aductores**, el grácil y el obturador externo, y la piel de la cara medial del muslo.',
  ),
  'Anterior branch of obturator nerve': d('804', 'Ramo del obturador que baja delante del aductor corto, detrás del pectíneo y el aductor largo: inerva el aductor largo, el corto y el grácil, y da un ramo cutáneo para la cara medial del muslo.'),
  'Posterior branch of obturator nerve': d('804', 'Ramo del obturador que atraviesa el obturador externo y baja entre el aductor corto y el mayor, a los que inerva; da un filete a la rodilla.'),
  'Genitofemoral nerve': d(
    '805',
    'Nervio de L1–L2 que atraviesa el psoas y baja por su cara anterior junto al uréter, por lo que los cólicos renales irradian a la ingle y el escroto. Se divide en un ramo genital y uno femoral.',
  ),
  'Genital branch of genitofemoral nerve': d('805', 'Ramo que entra en el conducto inguinal, inerva el **cremáster** y da la piel del escroto (o de los labios mayores).'),
  'Femoral branch of genitofemoral nerve': d('776, 805', 'Ramo que pasa bajo el ligamento inguinal delante de la arteria femoral y da la piel del triángulo femoral.'),

  // ---------- Sacral plexus ----------
  'Superior gluteal nerve': d('805', 'Nervio de L4–S1 que sale de la pelvis **por encima del piriforme** con los vasos glúteos superiores y pasa entre los glúteos medio y menor hasta el tensor de la fascia lata, los tres músculos que inerva.'),
  'Nerve to piriformis muscle': d('806', 'Ramo corto del plexo sacro (S2) que entra en el piriforme por su cara anterior, dentro de la pelvis.'),
  'Nerve to quadratus femoris muscle': d('806, 809', 'Ramo del plexo sacro que sale bajo el piriforme por delante del ciático, cruza bajo los gemelos y el obturador interno e inerva el gemelo inferior y el cuadrado femoral.'),
  'Posterior femoral cutaneous nerve': d(
    '809',
    'Nervio sensitivo de S1–S3 que sale bajo el piriforme junto al ciático y baja por la cara posterior del muslo, bajo la fascia lata, hasta la fosa poplítea. Da la piel de la nalga baja (nervios clúneos inferiores), del periné y de la cara posterior del muslo y de la pantorrilla.',
  ),
  'Anterior root of posterior femoral cutaneous nerve': d('809', 'Una de las dos raíces con que el cutáneo femoral posterior nace del plexo sacro (S1–S3).'),
  'Posterior root of posterior femoral cutaneous nerve': d('809', 'Una de las dos raíces con que el cutáneo femoral posterior nace del plexo sacro (S1–S3).'),
  'Pudendal nerve': {
    text: ['Nervio del plexo sacro (S2–S4) que sale de la pelvis bajo el piriforme, rodea la espina ciática y entra en el periné con la arteria pudenda interna. Es el nervio principal del periné y el gran nervio sensitivo de los genitales externos.'],
    sources: [MOORE('585')],
  },
  'Sciatic nerve': {
    text: [
      'El nervio más grueso del cuerpo, del tronco lumbosacro y S1–S3. Sale de la pelvis **bajo el piriforme**, baja entre el trocánter mayor y la tuberosidad isquiática, bajo el glúteo mayor, y recorre la cara posterior del muslo hasta la fosa poplítea, donde se divide en **tibial** y **fibular común**.',
      'Inerva los isquiotibiales y, por sus ramas, toda la pierna y el pie. Hay que conocer su trayecto en la nalga para no lesionarlo con las inyecciones intramusculares.',
    ],
    sources: [LR('809–812'), MOORE('585')],
  },

  // ---------- Common fibular ----------
  'Common fibular nerve': d(
    '812–816',
    'Ramo lateral del ciático: sigue el tendón del bíceps femoral, se hace superficial y **rodea el cuello del peroné**, donde se divide en fibular superficial y profundo. Ahí, contra el hueso, lo dañan los golpes, las fracturas o la compresión: el pie cae y la punta arrastra al caminar (marcha en estepaje).',
  ),
  'Sural communicating branch of common fibular nerve': d('813, 817', 'Ramo del fibular común que se une al cutáneo sural medial del tibial para formar el nervio sural.'),
  'Superficial fibular nerve': d(
    '814–815',
    'Rama del fibular común que baja por el compartimento lateral, dentro del peroneo largo; inerva los **peroneos largo y corto** y, en el tercio inferior de la pierna, se hace superficial y da la piel del dorso del pie y de los dedos.',
  ),
  'Medial dorsal cutaneous nerve of foot': d('815', 'Ramo terminal del fibular superficial para el borde medial del dorso del pie y el dedo gordo.'),
  'Intermediate dorsal cutaneous nerve of foot': d('815', 'Ramo terminal del fibular superficial que recorre el tercer espacio y da los lados vecinos del tercer y cuarto dedos.'),
  'Dorsal digital branches of superficial fibular nerve': d('815', 'Nervios del dorso de los dedos del pie salidos del fibular superficial, salvo el primer espacio.'),
  'Deep fibular nerve': d(
    '815–816',
    'Rama del fibular común que atraviesa el extensor largo de los dedos y baja con la arteria tibial anterior sobre la membrana interósea. Inerva los músculos del **compartimento anterior** (tibial anterior y extensores) y el pedio, y da la piel del primer espacio interdigital.',
  ),
  'Muscular branches of deep fibular nerve': d('815', 'Ramos del fibular profundo para el tibial anterior, el extensor largo de los dedos, el extensor largo del dedo gordo, el tercer peroneo y, en el pie, el pedio.'),
  'Dorsal digital branches of deep fibular nerve': d('815', 'Los nervios de los lados vecinos del primer y segundo dedos, el pequeño territorio cutáneo del fibular profundo.'),

  // ---------- Tibial ----------
  'Tibial nerve': d(
    '816–820',
    'Ramo medial y mayor del ciático: forma el eje de la fosa poplítea, pasa bajo el arco del sóleo y baja por la pierna entre el sóleo y los músculos profundos con la arteria tibial posterior. Detrás del maléolo medial entra en el túnel del tarso y se divide en los **plantares**.',
    'Inerva todos los músculos de la pantorrilla y de la planta y la piel de la planta: flexiona el pie y los dedos y mantiene el arco longitudinal. Profundo, rara vez se lesiona salvo en la fosa poplítea.',
  ),
  'Medial sural cutaneous nerve': d('817', 'Ramo cutáneo del tibial en la fosa poplítea que baja con la safena menor; al recibir el ramo comunicante del fibular común se llama nervio sural.'),
  'Sural nerve': d('817', 'Nervio cutáneo formado por el sural medial y el ramo comunicante fibular. Baja con la **safena menor** detrás del maléolo lateral y da la piel del borde lateral del pie y del quinto dedo.'),
  'Medial plantar nerve': d(
    '818',
    'El mayor de los dos plantares: va por el borde medial de la planta con la arteria plantar medial e inerva el abductor del dedo gordo, el flexor corto de los dedos, el flexor corto del dedo gordo y el primer lumbrical. Da la piel de los tres dedos y medio mediales, como el mediano en la mano.',
  ),
  'Common plantar digital branches of medial plantar nerve': d('818', 'Ramos terminales del plantar medial que se dividen en los digitales propios de los dedos 1.º a 4.º.'),
  'Proper plantar digital branches of medial plantar nerve': d('818', 'Nervios colaterales plantares del dedo gordo, el segundo, el tercero y la mitad medial del cuarto.'),
  'Lateral plantar nerve': d(
    '819',
    'El menor de los plantares: cruza la planta con la arteria plantar lateral y se divide en un ramo superficial, sensitivo, y uno profundo, que acompaña al arco plantar. Inerva casi todos los músculos de la planta (cuadrado plantar, músculos del quinto dedo, interóseos, tres lumbricales y aductor del dedo gordo), como el cubital en la mano.',
  ),
  'Common plantar digital branches of lateral plantar nerve': d('819', 'Ramos del plantar lateral que se dividen en los digitales propios del quinto dedo y de la mitad lateral del cuarto.'),
  'Proper plantar digital branches of lateral plantar nerve': d('819', 'Nervios colaterales plantares del quinto dedo y de la mitad lateral del cuarto.'),
}

export const lowerLimbNerves = nerves
