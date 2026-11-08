import type { Description, DescriptionSource } from './index'

/**
 * The muscles of the hip and the lower limb (myology viewer), after Latarjet–Ruiz Liard's chapters 64–66,
 * with Moore for the clinic. Heads share their muscle's text, led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })

interface Muscle {
  text: string[]
  sources: DescriptionSource[]
  parts?: Record<string, string>
  en?: string
}

const MUSCLES: Muscle[] = [
  // ---------- Hip ----------
  {
    en: 'Gluteus maximus muscle',
    text: [
      'El músculo más voluminoso del cuerpo, que da forma a la nalga: del ilion detrás de la línea glútea posterior, el sacro, el cóccix y el ligamento sacrotuberoso, en dos capas, a la **tuberosidad glútea** del fémur y sobre todo al tracto iliotibial. Lo inerva el **nervio glúteo inferior**.',
      'Es el gran extensor de la cadera, el que trabaja al levantarse de una silla, subir escaleras o correr, y rota el muslo hacia fuera; en la marcha tranquila apenas actúa.',
    ],
    sources: [LR('679–680')],
  },
  {
    en: 'Gluteus medius muscle',
    text: [
      'Músculo ancho y radiado bajo el glúteo mayor, de la cara glútea entre las dos líneas glúteas al **trocánter mayor**. Lo inerva el **nervio glúteo superior**. Abduce la cadera y, sobre todo, al apoyar un solo pie, impide que la pelvis caiga del lado contrario; si se paraliza, la pelvis cae al dar el paso (signo de Trendelenburg).',
    ],
    sources: [LR('680'), MOORE('741')],
  },
  {
    en: 'Gluteus minimus muscle',
    text: [
      'El más profundo de los glúteos, triangular, de la cara glútea por delante de la línea glútea anterior al borde anterior del **trocánter mayor**. Comparte con el medio el nervio glúteo superior y la acción: abduce, rota hacia dentro y estabiliza la pelvis en la marcha.',
    ],
    sources: [LR('680–681'), MOORE('741')],
  },
  {
    en: 'Tensor fasciae latae',
    text: [
      'Músculo aplanado de la espina ilíaca anterosuperior que termina en la fascia lata, formando con ella el **tracto iliotibial**, que baja hasta el tubérculo de Gerdy de la tibia. Lo inerva el **nervio glúteo superior** (L5–S1). Tensa la fascia lata y equilibra el cuerpo de pie, estabilizando la rodilla en extensión.',
    ],
    sources: [LR('681–682')],
  },
  {
    en: 'Piriformis muscle',
    text: [
      'Músculo triangular de la cara anterior del sacro que sale de la pelvis por el **agujero ciático mayor** hasta el borde superior del trocánter mayor. Es la llave de la región glútea: por encima pasan los vasos y el nervio glúteos superiores; por debajo, el **nervio ciático** y los glúteos inferiores. Rota el muslo hacia fuera.',
    ],
    sources: [LR('682–683'), MOORE('585')],
  },
  {
    en: 'Obturator internus',
    text: [
      'De la cara interna de la membrana obturatriz y el hueso vecino; su tendón sale por el **agujero ciático menor**, rodeando el borde del isquion como una polea, y termina en la cara medial del trocánter mayor, entre los dos gemelos. Lo inerva su propio nervio del plexo sacro. Rotador lateral del muslo.',
    ],
    sources: [LR('683–685')],
  },
  {
    en: 'Superior gemellus muscle',
    text: ['Pequeño músculo de la espina ciática que acompaña por arriba al tendón del obturador interno y termina con él en la fosa trocantérica; lo inerva el nervio del obturador interno. Rotador lateral.'],
    sources: [LR('685')],
  },
  {
    en: 'Inferior gemellus muscle',
    text: ['Pequeño músculo de la tuberosidad isquiática que acompaña por abajo al tendón del obturador interno hasta la fosa trocantérica; lo inerva el nervio del cuadrado femoral. Rotador lateral.'],
    sources: [LR('685')],
  },
  {
    en: 'Obturator externus',
    text: [
      'De la cara externa de la membrana obturatriz y del pubis y el isquion alrededor del agujero obturado; pasa bajo la cadera y por detrás de su cuello hasta la **fosa trocantérica**. Lo inerva el **nervio obturador**. Rotador lateral del muslo.',
    ],
    sources: [LR('687')],
  },
  {
    en: 'Quadratus femoris muscle',
    text: [
      'Músculo cuadrilátero de fibras horizontales, del borde lateral de la tuberosidad isquiática a la cresta intertrocantérica, bajo el glúteo mayor y cruzado por el nervio ciático. Lo inerva su propio nervio del plexo sacro. Potente rotador lateral.',
    ],
    sources: [LR('688')],
  },
  {
    en: 'Psoas major',
    text: [
      'Músculo largo de la pared posterior del abdomen, de los cuerpos y discos de T12 a L5 y de las apófisis costales lumbares. Baja junto a la pelvis, pasa bajo el ligamento inguinal y termina con el ilíaco en el **trocánter menor**. Lo inervan ramos directos del **plexo lumbar**. Con el ilíaco forma el **iliopsoas**, el gran flexor de la cadera.',
    ],
    sources: [LR('689–691')],
  },
  {
    en: 'Iliacus muscle',
    text: [
      'Músculo en abanico que llena la **fosa ilíaca** y termina en el tendón del psoas, con el que forma el iliopsoas hasta el trocánter menor. Lo inerva el **nervio femoral**. Flexiona la cadera; con el muslo fijo, flexiona el tronco sobre la pelvis.',
    ],
    sources: [LR('690–691')],
  },

  // ---------- Thigh ----------
  {
    en: 'Sartorius muscle',
    text: [
      'El músculo más largo del cuerpo: cinta de la espina ilíaca anterosuperior que cruza en diagonal la cara anterior y medial del muslo hasta la cara medial de la tibia, en la **pata de ganso** con el grácil y el semitendinoso. Limita por fuera el triángulo femoral. Lo inerva el **nervio femoral**. Flexiona la cadera y la rodilla y rota el muslo hacia fuera.',
    ],
    sources: [LR('707')],
  },
  {
    en: 'Rectus femoris muscle',
    text: [
      'La porción del **cuádriceps** que cruza dos articulaciones: nace de la espina ilíaca anteroinferior y, por su tendón reflejo, del surco encima del acetábulo, y baja por el centro del muslo hasta la rótula. Lo inerva el **nervio femoral**. Extiende la rodilla y flexiona la cadera.',
    ],
    sources: [LR('707, 712')],
  },
  {
    en: 'Vastus lateralis muscle',
    text: [
      'La mayor porción del **cuádriceps**: de la parte alta del fémur y del labio lateral de la línea áspera envuelve la cara lateral del muslo hasta la rótula y su retináculo lateral. Lo inerva el **nervio femoral**. Extiende la rodilla; solo, tiende a desplazar la rótula hacia fuera.',
    ],
    sources: [LR('707, 712')],
  },
  {
    en: 'Vastus medialis muscle',
    text: [
      'Porción medial del **cuádriceps**: del labio medial de la línea áspera a la rótula y su retináculo medial; sus fibras inferiores, casi horizontales, sujetan la rótula contra el desplazamiento lateral. Lo inerva el **nervio femoral**. Extiende la rodilla.',
    ],
    sources: [LR('707, 712')],
  },
  {
    en: 'Vastus intermedius muscle',
    text: [
      'La porción profunda del **cuádriceps**, en los tres cuartos superiores de las caras anterior y lateral del fémur, bajo el recto femoral; sus fibras más bajas forman el músculo articular de la rodilla, que tira de la bolsa suprarrotuliana. Lo inerva el **nervio femoral**. Extiende la rodilla.',
    ],
    sources: [LR('644, 707')],
  },
  {
    en: 'Lateral patellar retinaculum',
    text: ['Expansión del vasto lateral y de la fascia lata a los lados de la rótula y la tibia, que refuerza la rodilla por delante y fuera y ayuda a mantener la rótula en su tróclea.'],
    sources: [LR('698')],
  },
  {
    en: 'Medial patellar retinaculum',
    text: ['Expansión del vasto medial a los lados de la rótula y la tibia, que refuerza la rodilla por delante y dentro y se opone a la luxación lateral de la rótula.'],
    sources: [LR('698')],
  },
  {
    en: 'Pectineus muscle',
    text: [
      'Músculo cuadrilátero de la cresta pectínea del pubis a la línea pectínea del fémur, bajo el trocánter menor; forma el suelo del triángulo femoral con el iliopsoas. Lo inerva el **nervio femoral**. Aduce y flexiona el muslo.',
    ],
    sources: [LR('712')],
  },
  {
    en: 'Adductor longus',
    text: [
      'El más anterior de los aductores: del ángulo del pubis, por un tendón palpable en la ingle, a la parte media de la línea áspera. Limita por dentro el triángulo femoral. Lo inerva el **nervio obturador**. Aduce y flexiona el muslo.',
    ],
    sources: [LR('712–714')],
  },
  {
    en: 'Adductor brevis',
    text: ['El aductor intermedio, detrás del largo: del cuerpo y la rama inferior del pubis a la parte alta de la línea áspera. Entre él y sus vecinos se reparten las ramas del **nervio obturador**, que lo inerva. Aduce el muslo.'],
    sources: [LR('714')],
  },
  {
    en: 'Adductor magnus',
    text: [
      'El mayor de los aductores: de la rama isquiopubiana y la tuberosidad isquiática se abre en abanico hasta toda la línea áspera y, por un tendón, el **tubérculo del aductor** del fémur. Entre ambas inserciones queda el **hiato aductor**, por donde los vasos femorales pasan a la fosa poplítea.',
      'Su parte aductora la inerva el nervio obturador; la parte isquiática, que extiende la cadera como los isquiotibiales, el nervio ciático.',
    ],
    sources: [LR('714–716')],
  },
  {
    en: 'Gracilis muscle',
    text: [
      'Músculo largo y delgado, el más medial del muslo: de la rama isquiopubiana junto a la sínfisis a la cara medial de la tibia, en la **pata de ganso**. Lo inerva el **nervio obturador**. Aduce el muslo y flexiona la rodilla.',
    ],
    sources: [LR('712')],
  },
  {
    text: [
      'Músculo lateral de la cara posterior del muslo, de dos cabezas que terminan en la **cabeza del peroné**. Flexiona la rodilla y, flexionada, rota la pierna hacia fuera.',
    ],
    sources: [LR('717–718, 727')],
    parts: {
      'Long head of biceps femoris': 'Cabeza **larga** del bíceps femoral: nace de la tuberosidad isquiática con el semitendinoso, por lo que también extiende la cadera, como los demás isquiotibiales; la inerva la parte tibial del **nervio ciático**.',
      'Short head of biceps femoris': 'Cabeza **corta** del bíceps femoral: nace del labio lateral de la línea áspera, no cruza la cadera; la inerva la parte fibular común del **nervio ciático**.',
    },
  },
  {
    en: 'Semitendinosus muscle',
    text: [
      'Isquiotibial carnoso arriba y tendinoso abajo: de la tuberosidad isquiática, con la cabeza larga del bíceps, a la cara medial de la tibia, en la **pata de ganso**. Lo inerva el **nervio ciático** (parte tibial). Extiende la cadera, flexiona la rodilla y rota la pierna hacia dentro.',
    ],
    sources: [LR('718–719')],
  },
  {
    en: 'Semimembranosus muscle',
    text: [
      'Isquiotibial de origen membranoso, el más profundo y medial: de la tuberosidad isquiática al cóndilo medial de la tibia, con expansiones a la cápsula de la rodilla (el ligamento poplíteo oblicuo). Lo inerva el **nervio ciático** (parte tibial). Con el bíceps, el flexor más potente de la rodilla; además extiende la cadera.',
    ],
    sources: [LR('719, 727')],
  },

  // ---------- Leg, front and side ----------
  {
    en: 'Tibialis anterior muscle',
    text: [
      'Músculo voluminoso de la cara lateral de la tibia y la membrana interósea, cuyo tendón pasa bajo los retináculos extensores hasta la **cuña medial** y la base del primer metatarsiano. Lo inerva el **nervio fibular profundo**. Flexiona el pie hacia el dorso y lo invierte; si se paraliza, el pie cae.',
    ],
    sources: [LR('744, 767'), MOORE('741')],
  },
  {
    en: 'Extensor digitorum longus',
    text: ['Del cóndilo lateral de la tibia, el peroné y la membrana interósea; su tendón se divide bajo los retináculos en cuatro para los dedos 2.º a 5.º. Lo inerva el **nervio fibular profundo**. Extiende los dedos y flexiona el pie hacia el dorso, con eversión.'],
    sources: [LR('744, 767')],
  },
  {
    en: 'Extensor hallucis longus',
    text: ['Profundo entre el tibial anterior y el extensor de los dedos, del tercio medio del peroné y la membrana interósea a la base de la **falange distal del dedo gordo**. Lo inerva el **nervio fibular profundo**. Extiende el dedo gordo y ayuda a la flexión dorsal del pie.'],
    sources: [LR('744–745')],
  },
  {
    en: 'Fibularis tertius muscle',
    text: ['Músculo inconstante, casi una porción del extensor largo de los dedos: de la mitad inferior del peroné a la base del **quinto metatarsiano**. **Nervio fibular profundo**. Flexiona el pie hacia el dorso y lo evierte; es poco potente.'],
    sources: [LR('745, 767')],
  },
  {
    en: 'Fibularis longus muscle',
    text: [
      'El **peroneo largo**, superficial en la cara lateral de la pierna, de la cabeza y el cuerpo del peroné. Su tendón pasa detrás del maléolo lateral, entra en el surco del cuboides y cruza la planta en diagonal hasta la base del **primer metatarsiano** y la cuña medial. Lo inerva el **nervio fibular superficial**. Flexiona el pie hacia la planta, lo evierte y sostiene el arco transversal.',
    ],
    sources: [LR('746, 767')],
  },
  {
    en: 'Fibularis brevis muscle',
    text: ['El **peroneo corto**, bajo el largo, del tercio medio del peroné a la **tuberosidad del quinto metatarsiano**, pasando detrás del maléolo lateral y por encima de la tróclea fibular del calcáneo. Lo inerva el **nervio fibular superficial**. Evierte el pie.'],
    sources: [LR('746–747, 767')],
  },

  // ---------- Leg, back ----------
  {
    text: [
      'Las dos cabezas superficiales del **tríceps sural**, nacidas de los cóndilos del fémur, que con el sóleo terminan en el **tendón calcáneo**. Lo inerva el **nervio tibial**. Flexiona el pie hacia la planta con fuerza, como al saltar o ponerse de puntillas, y, al cruzar la rodilla, también la flexiona.',
    ],
    sources: [LR('747–749, 767')],
    parts: {
      'Medial head of gastrocnemius': 'Cabeza **medial** del gastrocnemio (gemelo interno), del cóndilo medial del fémur, la mayor de las dos y la que baja más.',
      'Lateral head of gastrocnemius': 'Cabeza **lateral** del gastrocnemio (gemelo externo), del cóndilo lateral del fémur.',
    },
  },
  {
    en: 'Soleus muscle',
    text: [
      'La porción profunda y ancha del **tríceps sural**, bajo el gastrocnemio: de la cabeza del peroné y la línea del sóleo de la tibia al **tendón calcáneo**. No cruza la rodilla. Lo inerva el **nervio tibial**. Flexor plantar sostenido, el que mantiene el equilibrio de pie.',
    ],
    sources: [LR('747–749')],
  },
  {
    en: 'Calcaneal tendon',
    text: [
      'El **tendón de Aquiles**, terminación común del gastrocnemio y el sóleo en la cara posterior del calcáneo, separado de su parte alta por una bolsa. Es el tendón más grueso y resistente del cuerpo, de unos 15 cm. Su rotura, en un esfuerzo brusco, impide ponerse de puntillas.',
    ],
    sources: [LR('658, 747'), MOORE('758, 765–766')],
  },
  {
    en: 'Plantaris muscle',
    text: ['Músculo rudimentario de vientre corto, del cóndilo lateral del fémur, con un tendón largo y delgado que baja entre el gastrocnemio y el sóleo junto al borde medial del tendón calcáneo. Nervio tibial. Acompaña débilmente al tríceps sural.'],
    sources: [LR('749')],
  },
  {
    en: 'Popliteus muscle',
    text: [
      'Músculo corto y triangular del fondo de la fosa poplítea: su tendón nace del cóndilo lateral del fémur, dentro de la cápsula, pasa junto al menisco lateral y bajo el ligamento arqueado, y el vientre se fija en la tibia encima de la línea del sóleo. Lo inerva el **nervio tibial**. Rota la tibia hacia dentro y «desbloquea» la rodilla extendida para que pueda flexionarse.',
    ],
    sources: [LR('749–750, 727')],
  },
  {
    en: 'Flexor digitorum longus',
    text: ['El flexor tibial de Testut: de la cara posterior de la tibia baja detrás del maléolo medial a la planta, donde recibe el cuadrado plantar y da origen a los lumbricales, y termina en las **falanges distales** de los dedos 2.º a 5.º. Lo inerva el **nervio tibial**. Flexiona los dedos y el pie.'],
    sources: [LR('750–751')],
  },
  {
    en: 'Flexor hallucis longus',
    text: ['El flexor fibular de Testut: del peroné y la membrana interósea; su tendón pasa por un surco del astrágalo y bajo el sustentáculo del calcáneo hasta la **falange distal del dedo gordo**. Lo inerva el **nervio tibial**. Flexiona el dedo gordo, el impulso final del paso.'],
    sources: [LR('751')],
  },
  {
    en: 'Tibialis posterior muscle',
    text: [
      'El más profundo de la pantorrilla, entre los dos flexores largos: de la tibia, el peroné y la membrana interósea; su tendón pasa detrás del maléolo medial hasta la **tuberosidad del navicular**, con expansiones a casi todo el tarso. Lo inerva el **nervio tibial**. Flexiona el pie hacia la planta, lo invierte y sostiene el arco longitudinal.',
    ],
    sources: [LR('751–752, 767')],
  },

  // ---------- Foot ----------
  {
    en: 'Extensor digitorum brevis',
    text: ['El **músculo pedio**, el único del dorso del pie: de la cara dorsolateral del calcáneo y el seno del tarso a los tendones del extensor largo de los dedos 2.º a 4.º. Lo inerva el **nervio fibular profundo**. Ayuda a extender los dedos.'],
    sources: [LR('757')],
  },
  {
    en: 'Extensor hallucis brevis',
    text: ['La porción medial del pedio, que termina en la base de la falange proximal del dedo gordo. **Nervio fibular profundo**. Extiende la falange proximal del dedo gordo.'],
    sources: [LR('757')],
  },
  {
    en: 'Abductor hallucis',
    text: ['Músculo superficial del borde medial de la planta: del proceso medial de la tuberosidad del calcáneo, el retináculo flexor y el navicular al sesamoideo medial y la base de la falange proximal del dedo gordo. Lo inerva el **nervio plantar medial**. Separa el dedo gordo y sostiene el arco medial.'],
    sources: [LR('758')],
  },
  {
    text: [
      'Músculo de la planta, profundo al abductor, del cuboides y la cuña medial, que se divide en dos cabezas a los lados del tendón del flexor largo y termina en los sesamoideos y la base de la falange proximal del dedo gordo. Flexiona esa falange.',
    ],
    sources: [LR('759')],
    parts: {
      'Medial head of flexor hallucis brevis': 'Cabeza **medial** del flexor corto del dedo gordo, unida al abductor en el sesamoideo medial; la inerva el **nervio plantar medial**.',
      'Lateral head of flexor hallucis brevis': 'Cabeza **lateral** del flexor corto del dedo gordo, unida al aductor en el sesamoideo lateral; la inerva el **nervio plantar medial**.',
    },
  },
  {
    text: [
      'Homólogo del aductor del pulgar, en el plano profundo de la planta, de dos cabezas que terminan en el sesamoideo lateral y la base de la falange proximal del dedo gordo. Lo inerva el ramo profundo del **nervio plantar lateral**. Lleva el dedo gordo hacia los demás y sostiene el arco transversal.',
    ],
    sources: [LR('759–760')],
    parts: {
      'Oblique head of adductor hallucis': 'Cabeza **oblicua** del aductor del dedo gordo, del cuboides, las bases del 3.er y 4.º metatarsianos y la vaina del peroneo largo.',
      'Transverse head of adductor hallucis': 'Cabeza **transversa** del aductor del dedo gordo, de las cápsulas de las metatarsofalángicas de los dedos laterales.',
    },
  },
  {
    en: 'Abductor digiti minimi of foot',
    text: ['El más superficial y largo del borde lateral de la planta: de los procesos de la tuberosidad del calcáneo a la base de la falange proximal del quinto dedo. Lo inerva el **nervio plantar lateral**. Separa y flexiona el quinto dedo y sostiene el arco lateral.'],
    sources: [LR('760')],
  },
  {
    en: 'Flexor digiti minimi of foot',
    text: ['Músculo del borde lateral de la planta, de la base del quinto metatarsiano y la vaina del peroneo largo a la base de la falange proximal del quinto dedo. **Nervio plantar lateral**. Flexiona esa falange.'],
    sources: [LR('761')],
  },
  {
    en: '(Opponens digiti minimi muscle of foot)',
    text: ['Fascículos inconstantes del flexor corto del quinto dedo que se separan para insertarse en los dos tercios anteriores del quinto metatarsiano. **Nervio plantar lateral**.'],
    sources: [LR('762')],
  },
  {
    en: 'Flexor digitorum brevis',
    text: ['Músculo central de la planta, bajo la aponeurosis plantar: del proceso medial de la tuberosidad del calcáneo a las falanges medias de los cuatro últimos dedos; sus tendones se abren para dejar pasar los del flexor largo, como el flexor superficial de la mano. Lo inerva el **nervio plantar medial**.'],
    sources: [LR('762')],
  },
  {
    en: 'Quadratus plantae muscle',
    text: ['El **flexor accesorio** de Silvio: de dos fascículos del calcáneo al tendón del flexor largo de los dedos, cuya tracción oblicua endereza en el eje del pie. Lo inerva el **nervio plantar lateral**.'],
    sources: [LR('763')],
  },
  {
    en: 'Lumbrical muscles of foot',
    text: ['Cuatro músculos entre los tendones del flexor largo de los dedos, como los de la mano, que terminan en la falange proximal y el tendón extensor de cada dedo. El primero lo inerva el **plantar medial**; los demás, el **plantar lateral**.'],
    sources: [LR('763–764')],
  },
  {
    en: 'Plantar interossei muscles',
    text: ['Tres músculos de los espacios intermetatarsianos laterales, como los palmares de la mano pero ordenados alrededor del **segundo dedo**, el eje del pie: acercan a él los dedos 3.º a 5.º. Los inerva el ramo profundo del **nervio plantar lateral**.'],
    sources: [LR('764')],
  },
  {
    en: 'Dorsal interossei muscles of foot',
    text: ['Cuatro músculos peniformes que llenan los espacios intermetatarsianos y separan los dedos del eje del pie, que pasa por el **segundo dedo** (por eso recibe dos). Los inerva el **nervio plantar lateral**.'],
    sources: [LR('764')],
  },
]

const descriptions: Record<string, Description> = {}
for (const m of MUSCLES) {
  if (m.en) descriptions[m.en] = { text: m.text, sources: m.sources }
  for (const [en, lead] of Object.entries(m.parts ?? {})) descriptions[en] = { text: [lead, ...m.text], sources: m.sources }
}

export const lowerLimbMuscles = descriptions
