import type { Description, DescriptionSource } from './index'

/**
 * The muscles of the head and the neck (myology viewer): the facial muscles after Latarjet–Ruiz Liard's chapter 36 (t. 1),
 * the eye's after chapters 44–45, the neck's after chapters 19–20; the masticatory muscles, the tongue, the soft palate and
 * the pharynx after chapter 103 and the larynx after chapter 92 (t. 2). Muscles split into parts or bellies share their
 * text, led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })

interface Muscle {
  text: string[]
  sources: DescriptionSource[]
  parts?: Record<string, string>
  en?: string
}

const FACIAL = 'Como todos los músculos cutáneos de la cara, lo inerva el **nervio facial** (VII).'
const EYE = 'Nace en el fondo de la órbita del **anillo tendinoso común** (de Zinn) y avanza, envuelto por la vaina del globo ocular, hasta insertarse en la esclera por delante del ecuador.'
const RECURRENT = 'Lo inerva el **nervio laríngeo recurrente**, rama del vago, como a todos los músculos de la laringe salvo el cricotiroideo.'
const PHARYNX = 'Los tres constrictores se imbrican de abajo arriba como cucuruchos encajados y se unen detrás en el **rafe faríngeo**; se contraen en sucesión durante la deglución y empujan el bolo hacia el esófago. Los inerva el **plexo faríngeo** (glosofaríngeo y vago).'
const INFRAHYOID = 'Los infrahioideos bajan el hioides y la laringe tras la deglución y fijan el hioides para que actúen los suprahioideos; los inerva el **asa cervical** (C1–C3).'

const MUSCLES: Muscle[] = [
  // ---------- Epicranius and the eyelids ----------
  {
    text: [
      'El **occipitofrontal**, músculo digástrico de la bóveda: sus dos vientres están unidos por la **aponeurosis epicraneal** (galea), lámina tendinosa que se desliza sobre el periostio de la calvaria. El vientre frontal nace en la piel de las cejas y la glabela; el occipital, en la línea nucal superior y la mastoides.',
      `El frontal eleva las cejas y arruga la frente en sentido transversal; el occipital tira del cuero cabelludo hacia atrás. ${FACIAL}`,
    ],
    sources: [LR('317')],
    parts: {
      'Frontalis muscle': 'El **vientre frontal** del occipitofrontal, ancho y delgado, de la piel de las cejas y la glabela a la galea: eleva las cejas y arruga la frente (ramos temporales del facial).',
      'Occipitalis muscle': 'El **vientre occipital** del occipitofrontal, de la línea nucal superior y la mastoides a la galea: tira del cuero cabelludo hacia atrás (nervio auricular posterior).',
      'Epicranial aponeurosis': 'La **aponeurosis epicraneal** o galea aponeurótica: lámina tendinosa que une los vientres frontal y occipital y se desliza sobre el periostio, separada de él por tejido laxo; lateralmente se une al arco cigomático. Por ese plano se despega el cuero cabelludo en los arrancamientos.',
    },
  },
  {
    en: 'Temporoparietalis muscle',
    text: [
      'Delgada lámina inconstante sobre la fascia temporal, del cartílago de la oreja a la galea aponeurótica, entre los vientres del occipitofrontal y los músculos auriculares; es uno de los músculos epicraneales. ' + FACIAL,
    ],
    sources: [LR('317')],
  },
  {
    text: [
      'El **orbicular del ojo**, esfínter de los párpados que rodea el borde de la órbita. Nace en el lado medial, del ligamento palpebral medial, el proceso frontal del maxilar y el lagrimal; su porción **palpebral**, en los párpados, los cierra suavemente (parpadeo), y la **orbitaria**, por fuera, los aprieta con fuerza. Una porción lagrimal profunda (de Horner), detrás del saco lagrimal, ayuda al drenaje de las lágrimas.',
      `Cierra la hendidura palpebral y protege el ojo; su parálisis impide cerrarlo (lagoftalmos). ${FACIAL}`,
    ],
    sources: [LR('317–318')],
    parts: {
      'Orbital part of orbicularis oculi': 'Porción **orbitaria** del orbicular del ojo, periférica, sobre el reborde de la órbita y más allá: cierra con fuerza los párpados y frunce la piel alrededor del ojo.',
      'Palpebral part of orbicularis oculi': 'Porción **palpebral** del orbicular del ojo, delgada, en el espesor de los párpados, del ligamento palpebral medial al lateral: cierra suavemente el ojo en el parpadeo. Su fascículo ciliar ocupa el borde libre, entre las pestañas.',
    },
  },
  {
    en: 'Corrugator supercilii',
    text: [`Pequeño músculo profundo de la ceja, de la porción nasal del frontal a la piel de la ceja: la lleva abajo y adentro y dibuja los pliegues verticales del entrecejo. ${FACIAL}`],
    sources: [LR('318')],
  },
  // ---------- Nose ----------
  {
    en: 'Procerus muscle',
    text: [`El **prócer**, sobre el dorso de la nariz, de los huesos y cartílagos nasales a la piel entre las cejas: tira de ella hacia abajo y forma los pliegues transversales de la raíz de la nariz, contra el vientre frontal. ${FACIAL}`],
    sources: [LR('318')],
  },
  {
    en: 'Nasalis muscle',
    text: [`El **músculo nasal**, de la fosa canina del maxilar: su porción transversa sube sobre el dorso de la nariz y estrecha la narina; su porción alar, en el ala, la dilata. ${FACIAL}`],
    sources: [LR('318')],
  },
  {
    en: 'Depressor septi nasi',
    text: [`Pequeño músculo radiado bajo las narinas, de la pared alveolar sobre el incisivo central superior al subtabique y el ala de la nariz: baja la punta de la nariz y dilata las narinas. ${FACIAL}`],
    sources: [LR('318')],
  },
  // ---------- Mouth ----------
  {
    en: 'Levator nasolabialis',
    text: [`El **elevador del labio superior y del ala de la nariz**, la más medial de las lengüetas del labio superior: del proceso frontal del maxilar baja junto a la nariz a la piel del ala y del labio, y los eleva. ${FACIAL}`],
    sources: [LR('319')],
  },
  {
    en: 'Levator labii superioris',
    text: [`El **elevador del labio superior**, del borde infraorbitario, por encima del foramen infraorbitario, a la piel del labio superior: lo eleva y lo evierte. ${FACIAL}`],
    sources: [LR('319')],
  },
  {
    en: 'Levator anguli oris',
    text: [`El **elevador del ángulo de la boca**, por debajo y más profundo que los anteriores: de la fosa canina, bajo el foramen infraorbitario, a la comisura, donde se mezcla con el orbicular. Eleva el ángulo de la boca. ${FACIAL}`],
    sources: [LR('319')],
  },
  {
    en: 'Zygomaticus major muscle',
    text: [`El **cigomático mayor**, del hueso cigomático, por detrás del menor, a la comisura labial, cruzando por delante los vasos faciales: lleva el ángulo de la boca arriba y afuera. Es el músculo de la sonrisa. ${FACIAL}`],
    sources: [LR('319')],
  },
  {
    en: 'Zygomaticus minor muscle',
    text: [`El **cigomático menor**, del hueso cigomático, delante del mayor, a la piel del labio superior junto a la comisura: eleva el labio y profundiza el surco nasolabial. ${FACIAL}`],
    sources: [LR('319')],
  },
  {
    en: 'Risorius muscle',
    text: [`El **risorio**, delgado y horizontal, de la fascia parotídea y la piel de la mejilla al ángulo de la boca: tira de la comisura hacia fuera. ${FACIAL}`],
    sources: [LR('319–320')],
  },
  {
    en: 'Orbicularis oris muscle',
    text: [
      'El **orbicular de la boca**, el único impar de los músculos de la cara: esfínter que rodea la hendidura oral en el espesor de los labios, con una porción **marginal**, bajo el rojo del labio, y otra **labial**, periférica. A él llegan los demás músculos de la boca; detrás se continúa con el buccinador.',
      'Cierra y frunce los labios (silbar, besar, succionar). Lo inervan a cada lado los ramos bucales y marginal de la mandíbula del facial, de modo que cada mitad funciona aparte.',
    ],
    sources: [LR('318–319')],
  },
  {
    en: 'Bucinator',
    text: [
      'El **buccinador**, músculo cuadrilátero que forma la pared de la mejilla: nace detrás del **rafe pterigomandibular**, que lo separa del constrictor superior de la faringe, y de los procesos alveolares del maxilar y la mandíbula a la altura de los molares; avanza hasta la comisura, donde sus fibras se cruzan y continúan en el orbicular. Lo perfora el conducto parotídeo frente al segundo molar superior.',
      `Aprieta las mejillas contra los dientes: devuelve el alimento bajo los molares al masticar y expulsa el aire al soplar. ${FACIAL}`,
    ],
    sources: [LR2('1153–1154'), LR('319')],
  },
  {
    en: 'Depressor anguli oris',
    text: [`El **depresor del ángulo de la boca**, triangular, de la línea oblicua de la mandíbula a la comisura, donde se cruza con el elevador del ángulo y el cigomático mayor (modiolo): baja la comisura (tristeza, disgusto). Lo inerva el ramo marginal de la mandíbula del facial.`],
    sources: [LR('319–320')],
  },
  {
    en: 'Depressor labii inferioris',
    text: [`El **depresor del labio inferior**, cuadrangular, profundo al depresor del ángulo: de la línea oblicua de la mandíbula sube a la piel del labio inferior, que baja y evierte. Lo inerva el ramo marginal de la mandíbula del facial.`],
    sources: [LR('320')],
  },
  {
    en: 'Mentalis muscle',
    text: [`El **mentoniano**, par, de la mandíbula bajo los alvéolos de los incisivos inferiores a la piel del mentón: la eleva y arruga, y proyecta el labio inferior hacia delante. Lo inerva el ramo marginal de la mandíbula del facial.`],
    sources: [LR('320')],
  },
  // ---------- Eye ----------
  {
    en: 'Superior rectus muscle',
    text: [`El **recto superior**, el más largo de los rectos: ${EYE.charAt(0).toLowerCase() + EYE.slice(1)} Bajo el elevador del párpado, mira el ojo arriba (elevación) y, por su trayecto oblicuo, lo lleva adentro y lo rota hacia dentro. Lo inerva el **oculomotor** (III).`],
    sources: [LR('400–402, 407')],
  },
  {
    en: 'Inferior rectus muscle',
    text: [`El **recto inferior**, en el suelo de la órbita: ${EYE.charAt(0).toLowerCase() + EYE.slice(1)} Baja la mirada y, por su trayecto oblicuo, la lleva adentro y rota el ojo hacia fuera. Lo inerva el **oculomotor** (III).`],
    sources: [LR('400–402, 407')],
  },
  {
    en: 'Medial rectus muscle',
    text: [`El **recto medial**, el más grueso de los rectos, junto a la pared medial de la órbita: ${EYE.charAt(0).toLowerCase() + EYE.slice(1)} Lleva la mirada hacia dentro (aducción). Lo inerva el **oculomotor** (III).`],
    sources: [LR('400–402, 407')],
  },
  {
    en: 'Lateral rectus muscle',
    text: [`El **recto lateral**, junto a la pared lateral de la órbita: ${EYE.charAt(0).toLowerCase() + EYE.slice(1)} Lleva la mirada hacia fuera (abducción). Lo inerva el **abducens** (VI); su parálisis desvía el ojo hacia dentro.`],
    sources: [LR('400–402, 407')],
  },
  {
    en: 'Common tendinous ring',
    text: [
      'El **anillo tendinoso común** (de Zinn): anillo fibroso en el vértice de la órbita, alrededor del conducto óptico y la parte medial de la fisura orbitaria superior, del que nacen los cuatro músculos rectos. Por dentro de él entran en el cono muscular el nervio óptico y la arteria oftálmica, el oculomotor, el nasociliar y el abducens; el troclear, el frontal y el lagrimal pasan por fuera.',
    ],
    sources: [LR('400, 404, 410')],
  },
  {
    en: 'Superior oblique muscle',
    text: [
      'El **oblicuo superior**, el más largo de los músculos del ojo: nace en el cuerpo del esfenoides, encima del anillo tendinoso, avanza por el ángulo superomedial de la órbita y su tendón se refleja en la **tróclea** hacia atrás y afuera, para insertarse en la esclera detrás del ecuador, en el cuadrante posterolateral superior.',
      'Rota el ojo hacia dentro, lo baja y lo lleva afuera; es el que baja la mirada cuando el ojo está en aducción (leer, bajar escaleras). Lo inerva el **troclear** (IV).',
    ],
    sources: [LR('402–403, 407')],
  },
  {
    en: 'Trochlea of superior oblique muscle',
    text: [
      'La **tróclea**: anillo fibrocartilaginoso fijado en la fosita troclear del frontal, en el ángulo superomedial de la órbita, por el que se desliza el tendón del oblicuo superior dentro de una vaina sinovial y cambia de dirección hacia atrás y afuera. Es la polea funcional del músculo.',
    ],
    sources: [LR('402')],
  },
  {
    en: 'Inferior oblique muscle',
    text: [
      'El **oblicuo inferior**, el único músculo del ojo que no nace en el fondo de la órbita: de la cara orbitaria del maxilar, junto al conducto nasolagrimal, va atrás y afuera bajo el recto inferior y se inserta en la esclera detrás del ecuador, en el cuadrante posterolateral inferior.',
      'Rota el ojo hacia fuera, lo eleva y lo lleva afuera; eleva la mirada en aducción. Lo inerva el **oculomotor** (III).',
    ],
    sources: [LR('403, 407')],
  },
  {
    en: 'Levator palpebrae superioris',
    text: [
      'El **elevador del párpado superior**: nace en el ala menor del esfenoides, sobre el anillo tendinoso, y avanza sobre el recto superior hasta el párpado, donde se abre en una aponeurosis que llega a la cara anterior del tarso superior y a la piel del párpado. Un plano de fibras lisas (músculo tarsal superior, simpático) va al borde del tarso.',
      'Abre el ojo, antagonista del orbicular. Lo inerva el **oculomotor** (III): su parálisis deja caer el párpado (ptosis); la del simpático da una ptosis leve (Horner).',
    ],
    sources: [LR('414, 412')],
  },
  {
    en: 'Superior tarsus',
    text: [
      'El **tarso superior**: lámina de tejido conectivo denso, semilunar, de 1 cm de alto, que da firmeza al párpado superior; en él están las glándulas tarsales y en su borde y su cara anterior terminan el elevador del párpado y el músculo tarsal. Lo fijan a los rebordes de la órbita los ligamentos palpebrales medial y lateral y el tabique orbitario.',
    ],
    sources: [LR('412')],
  },
  {
    en: 'Inferior tarsus',
    text: [
      'El **tarso inferior**: lámina fibrosa más estrecha que la del párpado superior, que da forma al párpado inferior y contiene sus glándulas tarsales; la unen a los rebordes de la órbita los ligamentos palpebrales y el tabique orbitario.',
    ],
    sources: [LR('412')],
  },
  // ---------- Mastication ----------
  {
    en: 'Temporalis muscle',
    text: [
      'El **temporal**, en abanico en la fosa temporal: nace de toda la fosa, hasta la línea temporal inferior, y de la cara profunda de la fascia temporal; sus fibras convergen por debajo del arco cigomático en un tendón fuerte que abraza el **proceso coronoides** y baja por el borde anterior de la rama de la mandíbula.',
      'Eleva la mandíbula (cierra la boca) y, por sus fibras posteriores horizontales, la lleva atrás. Lo inervan los nervios temporales profundos, del mandibular (V3).',
    ],
    sources: [LR2('1171–1173')],
  },
  {
    text: [
      'El **masetero**, músculo grueso y cuadrilátero sobre la cara lateral de la rama de la mandíbula: del arco cigomático baja al ángulo y a la cara lateral de la rama. Lo cubre la fascia maseterina, con la parótida detrás y el conducto parotídeo por delante.',
      'Eleva la mandíbula con fuerza (se palpa al apretar los dientes). Lo inerva el nervio maseterino, del mandibular, que lo aborda por la escotadura mandibular entre sus dos planos.',
    ],
    sources: [LR2('1173–1174')],
    parts: {
      'Superficial part of masseter': 'El **plano superficial** del masetero, el mayor: del borde inferior de los dos tercios anteriores del arco cigomático y del hueso cigomático, sus fibras bajan oblicuas atrás hasta el ángulo de la mandíbula y la parte baja de la rama.',
      'Deep part of masseter': 'El **plano profundo** del masetero, medial al superficial y más atrás: del borde inferior y la cara medial del arco cigomático, sus fibras bajan verticales a la parte alta de la rama, hasta el coronoides.',
    },
  },
  {
    en: 'Medial pterygoid muscle',
    text: [
      'El **pterigoideo medial**, simétrico del masetero por la cara medial de la rama: nace en la **fosa pterigoidea**, entre las dos láminas del proceso pterigoides, y en la tuberosidad del maxilar, y baja oblicuo atrás y afuera hasta la cara medial del ángulo de la mandíbula. Con el masetero forma una cincha en la que cuelga el ángulo.',
      'Eleva la mandíbula y, con el pterigoideo lateral, la lleva al lado opuesto. Lo inerva el nervio pterigoideo medial, del mandibular.',
    ],
    sources: [LR2('1174–1175')],
  },
  {
    text: [
      'El **pterigoideo lateral**, horizontal en la fosa infratemporal: de sus dos cabezas, anteriores, va atrás y afuera hasta la fosita pterigoidea del cuello del cóndilo, la cápsula y el **disco** de la articulación temporomandibular.',
      'Tira del cóndilo y del disco hacia delante hasta el tubérculo articular: abre la boca y lleva la mandíbula adelante; uno solo la lleva al lado opuesto (masticación). Lo inerva el nervio pterigoideo lateral, del mandibular. Entre sus cabezas pasa la arteria maxilar.',
    ],
    sources: [LR2('1176–1177')],
    parts: {
      'Superior head of lateral pterygoid muscle': 'La **cabeza superior** (esfenoidal) del pterigoideo lateral, casi horizontal: de la cara infratemporal del ala mayor del esfenoides, hasta su cresta, a la cápsula y el disco articular.',
      'Inferior head of lateral pterygoid muscle': 'La **cabeza inferior** (pterigoidea) del pterigoideo lateral, ascendente: de la cara lateral de la lámina lateral del pterigoides y del palatino al cuello del cóndilo.',
    },
  },
  // ---------- Tongue, soft palate and pharynx ----------
  {
    en: 'Genioglossus muscle',
    text: [
      'El **geniogloso**, el mayor músculo de la lengua, a cada lado del tabique medio: de la espina mentoniana superior de la mandíbula sus fibras se abren en abanico hacia toda la longitud del dorso de la lengua, de la punta a la base, y las inferiores al hioides.',
      'Proyecta la lengua fuera de la boca y la deprime en el centro. Lo inerva el **hipogloso** (XII): si uno está paralizado, la lengua sacada se desvía hacia el lado de la lesión.',
    ],
    sources: [LR2('1181')],
  },
  {
    en: 'Hyoglossus muscle',
    text: [
      'El **hiogloso**, lámina cuadrilátera de la cara lateral de la lengua: del cuerpo y el asta mayor del hioides sube al borde de la lengua, mezclándose con el estilogloso. Sobre su cara lateral pasan el nervio hipogloso y el lingual con el ganglio submandibular; por su cara medial, la arteria lingual.',
      'Baja y retrae los bordes de la lengua. Lo inerva el **hipogloso** (XII).',
    ],
    sources: [LR2('1182'), LR2('937')],
  },
  {
    en: 'Palatopharyngeus muscle',
    text: [
      'El **palatofaríngeo**, en el arco palatofaríngeo, detrás de la tonsila palatina: de la aponeurosis del velo del paladar baja por la pared de la faringe hasta el borde posterior del cartílago tiroides y la mucosa de la laringofaringe.',
      'Acerca los arcos palatofaríngeos y eleva la faringe y la laringe en la deglución. Lo inerva el **plexo faríngeo** (vago).',
    ],
    sources: [LR2('1157–1158, 1207')],
  },
  {
    en: 'Superior pharyngeal constrictor',
    text: [
      'El **constrictor superior de la faringe**, cuadrilátero, en la pared de la nasofaringe y la orofaringe: nace del gancho pterigoideo, el **rafe pterigomandibular** (donde se continúa con el buccinador), la línea milohioidea y el borde de la lengua, y rodea la faringe hasta el rafe faríngeo y el tubérculo faríngeo del occipital. Por encima de él queda la fascia faringobasilar.',
      PHARYNX,
    ],
    sources: [LR2('1205–1207')],
  },
  {
    en: 'Middle pharyngeal constrictor',
    text: [
      'El **constrictor medio de la faringe**, en abanico: nace de las astas mayor y menor del hioides y del ligamento estilohioideo, y sus fibras divergen alrededor de la orofaringe hasta el rafe faríngeo, cubriendo por fuera la parte baja del constrictor superior.',
      PHARYNX,
    ],
    sources: [LR2('1205–1207')],
  },
  {
    en: 'Inferior pharyngeal constrictor',
    text: [
      'El **constrictor inferior de la faringe**, el más grueso: nace de la línea oblicua del cartílago tiroides y del cricoides, y rodea la laringofaringe hasta el rafe. Su porción cricofaríngea, horizontal, funciona como esfínter superior del esófago; por encima de ella queda un punto débil donde se forman los divertículos de Zenker. Bajo su borde inferior entra en la laringe el nervio laríngeo recurrente.',
      PHARYNX,
    ],
    sources: [LR2('1205–1207, 1066')],
  },
  {
    en: 'Stylopharyngeus muscle',
    text: [
      'El **estilofaríngeo**, largo y delgado: de la cara medial de la base del proceso estiloides baja entre los constrictores superior y medio y termina en la pared de la faringe y el borde del cartílago tiroides.',
      'Eleva la faringe y la laringe en la deglución. Es el único músculo que inerva el **glosofaríngeo** (IX), que lo rodea.',
    ],
    sources: [LR2('1207'), LR('323')],
  },
  // ---------- Larynx ----------
  {
    text: [
      'El **cricotiroideo**, el único músculo de la laringe que está por fuera de sus cartílagos: triangular, del arco del cricoides, delante, se abre hacia el borde inferior y el asta inferior del tiroides.',
      'Bascula el tiroides hacia delante sobre el cricoides: alarga y **tensa las cuerdas vocales** (tono agudo). Lo inerva el ramo externo del **nervio laríngeo superior**, a diferencia de los demás músculos de la laringe.',
    ],
    sources: [LR2('1054')],
    parts: {
      'Straight part of cricothyroid muscle': 'Porción **recta** del cricotiroideo, anterior, de fibras casi verticales hasta el borde inferior de la lámina del tiroides.',
      'Oblique part of cricothyroid muscle': 'Porción **oblicua** del cricotiroideo, posterior, de fibras oblicuas atrás hasta el asta inferior del tiroides.',
    },
  },
  {
    en: 'Posterior crico-arytenoid muscle',
    text: [
      'El **cricoaritenoideo posterior**, en la cara posterior de la lámina del cricoides: sus fibras convergen arriba y afuera al **proceso muscular** del aritenoides, al que hacen girar llevando afuera el proceso vocal.',
      `Es el **único dilatador de la glotis**: abre la vía aérea en la inspiración. Su parálisis bilateral deja la glotis cerrada y asfixia. ${RECURRENT}`,
    ],
    sources: [LR2('1054–1055')],
  },
  {
    en: 'Lateral crico-arytenoid muscle',
    text: [
      'El **cricoaritenoideo lateral**, a cada lado bajo la lámina del tiroides: del borde superior del arco del cricoides va atrás y arriba al proceso muscular del aritenoides, al que gira en sentido contrario al posterior.',
      `Acerca los procesos vocales: **cierra la glotis** para la fonación. ${RECURRENT}`,
    ],
    sources: [LR2('1056')],
  },
  {
    en: 'Transverse arytenoid muscle',
    text: [
      'El **aritenoideo transverso**, impar y mediano: fascículo transversal entre las caras posteriores de los dos aritenoides.',
      `Acerca los aritenoides y cierra la parte posterior de la glotis. ${RECURRENT}`,
    ],
    sources: [LR2('1055')],
  },
  {
    en: 'Ary-epiglottic part of oblique arytenoid muscle',
    text: [
      'El **aritenoideo oblicuo**: fascículos que se cruzan en X detrás del transverso, del proceso muscular de un aritenoides al vértice del otro; algunos siguen como **porción aritenoepiglótica** en el pliegue aritenoepiglótico hasta el borde de la epiglotis.',
      `Cierra el aditus de la laringe en la deglución, como un esfínter, a la vez que la glotis. ${RECURRENT}`,
    ],
    sources: [LR2('1055–1056')],
  },
  {
    text: [
      'El **tiroaritenoideo**, uno de los músculos esenciales de la laringe: del ángulo interno del cartílago tiroides va atrás, por fuera del cono elástico, al aritenoides. Su parte profunda, junto al ligamento vocal, es el **músculo vocal**, que forma el cuerpo de la cuerda vocal.',
      `Acorta y relaja las cuerdas vocales y cierra la glotis; el vocal regula finamente su tensión. ${RECURRENT}`,
    ],
    sources: [LR2('1056')],
    parts: {
      'External part of thyro-arytenoid muscle': 'Porción **externa** del tiroaritenoideo, lateral al músculo vocal, del ángulo del tiroides al borde lateral del aritenoides.',
      'Thyro-epiglottic part of thyro-arytenoid muscle': 'Porción **tiroepiglótica** del tiroaritenoideo: fibras que suben por la pared de la laringe hasta el pliegue aritenoepiglótico y la epiglotis, y ensanchan el vestíbulo.',
    },
  },
  // ---------- Neck ----------
  {
    en: 'Platysma',
    text: [
      'El **platisma** (cutáneo del cuello), lámina muscular delgada bajo la piel de la parte anterolateral del cuello: de la piel de la región infraclavicular y deltoidea sube por encima de la clavícula, cruza la mandíbula y termina en la piel de la parte baja de la cara y la comisura, mezclado con los depresores de la boca.',
      'Tensa la piel del cuello y baja la comisura y la mandíbula (expresión de horror). Lo inerva el ramo cervical del **facial**.',
    ],
    sources: [LR('124–125')],
  },
  {
    en: 'Sternocleidomastoid muscle',
    text: [
      'El **esternocleidomastoideo**, el gran relieve oblicuo del cuello: nace abajo por dos cabezas, la esternal, tendinosa, en el manubrio, y la clavicular, carnosa, en el tercio medial de la clavícula (entre ambas, la fosita supraclavicular menor), y sube atrás al **proceso mastoideo** y la línea nucal superior. Divide el cuello en triángulos anterior y posterior y cubre el paquete vasculonervioso (carótida, yugular interna y vago).',
      'Uno solo inclina la cabeza hacia su lado y la gira al lado opuesto; los dos la flexionan, o la extienden si la cabeza ya está atrás, y elevan el tórax en la inspiración forzada. Lo inervan el **nervio accesorio** (XI) y ramos de C2–C3; su contractura es el tortícolis.',
    ],
    sources: [LR('124–126')],
  },
  {
    en: 'Scalenus anterior muscle',
    text: [
      'El **escaleno anterior**: de los tubérculos anteriores de los transversos de C3–C6 baja al **tubérculo del escaleno anterior** de la primera costilla. Separa la vena subclavia, que pasa delante, de la arteria subclavia y el plexo braquial, que pasan detrás por el **desfiladero de los escalenos**; el nervio frénico baja sobre su cara anterior.',
      'Eleva la primera costilla (inspiración) o inclina el cuello hacia su lado. Lo inervan ramos anteriores de C4–C6.',
    ],
    sources: [LR('126–127')],
  },
  {
    en: 'Scalenus medius muscle',
    text: [
      'El **escaleno medio**, el mayor de los tres: de los tubérculos posteriores de los transversos de C2–C7 a la cara superior de la primera costilla, detrás del surco de la arteria subclavia. Con el anterior limita el desfiladero por donde salen la arteria subclavia y el plexo braquial.',
      'Eleva la primera costilla o inclina el cuello. Lo inervan ramos anteriores de los nervios cervicales.',
    ],
    sources: [LR('126–127')],
  },
  {
    en: 'Scalenus posterior muscle',
    text: [
      'El **escaleno posterior**, el más pequeño y profundo: de los tubérculos posteriores de C4–C6 a la cara externa de la **segunda costilla**.',
      'Eleva la segunda costilla o inclina el cuello. Lo inervan ramos anteriores de C6–C8.',
    ],
    sources: [LR('126–127')],
  },
  {
    en: 'Rectus lateralis capitis muscle',
    text: [
      'El **recto lateral de la cabeza**, corto: del proceso transverso del atlas sube al proceso yugular del occipital, por detrás del foramen yugular; equivale a un intertransverso. Inclina la cabeza hacia su lado. Lo inerva el ramo anterior de C1.',
    ],
    sources: [LR('127')],
  },
  {
    en: 'Longus capitis muscle',
    text: [
      'El **largo de la cabeza** (recto anterior mayor), el más superficial de los músculos prevertebrales: de los tubérculos anteriores de los transversos de C3–C6 sube a la cara inferior de la porción basilar del occipital. Detrás de la faringe, cubierto por la lámina prevertebral de la fascia cervical.',
      'Flexiona la cabeza y la parte alta del cuello. Lo inervan ramos anteriores de C1–C3.',
    ],
    sources: [LR('128')],
  },
  {
    en: 'Rectus anterior capitis muscle',
    text: [
      'El **recto anterior de la cabeza** (recto anterior menor), corto y profundo al largo de la cabeza: de la masa lateral del atlas a la porción basilar del occipital, delante del cóndilo. Flexiona la cabeza sobre el atlas. Lo inerva el ramo anterior de C1.',
    ],
    sources: [LR('128')],
  },
  {
    en: 'Longus colli muscle',
    text: [
      'El **largo del cuello**, el más profundo de los prevertebrales, aplicado sobre los cuerpos vertebrales de C1 a T3: tiene una porción vertical, entre los cuerpos, y dos oblicuas, que suben de los cuerpos torácicos a los transversos cervicales y de éstos al tubérculo anterior del atlas.',
      'Flexiona el cuello y lo inclina hacia su lado. Lo inervan ramos anteriores de C2–C6.',
    ],
    sources: [LR('129')],
  },
  {
    en: 'Sternohyoid muscle',
    text: [
      'El **esternohioideo**, cinta delgada y superficial: de la cara posterior del manubrio y de la clavícula sube junto a la línea media al borde inferior del cuerpo del hioides, cubriendo la laringe y la glándula tiroides.',
      INFRAHYOID,
    ],
    sources: [LR('129–130')],
  },
  {
    en: 'Sternothyroid muscle',
    text: [
      'El **esternotiroideo**, ancho, profundo al esternohioideo: de la cara posterior del manubrio y el primer cartílago costal a la línea oblicua del cartílago tiroides. Cubre la glándula tiroides.',
      INFRAHYOID,
    ],
    sources: [LR('130')],
  },
  {
    en: 'Thyrohyoid muscle',
    text: [
      'El **tirohioideo**, corto, que prolonga arriba el esternotiroideo: de la línea oblicua del tiroides al asta mayor del hioides, sobre la membrana tirohioidea. Baja el hioides o, fijo éste, eleva la laringe. Lo inervan fibras de C1 que acompañan al hipogloso.',
    ],
    sources: [LR('130')],
  },
  {
    en: 'Omohyoid muscle',
    text: [
      'El **omohioideo**, digástrico: su vientre inferior nace del borde superior de la escápula, junto a la escotadura, cruza oblicuo el triángulo posterior del cuello; un tendón intermedio, sujeto a la clavícula por la fascia, pasa sobre la vena yugular interna, y el vientre superior sube al cuerpo del hioides.',
      INFRAHYOID + ' Tensa la lámina pretraqueal de la fascia cervical.',
    ],
    sources: [LR('130–131')],
  },
  {
    text: [
      'El **digástrico**, con dos vientres unidos por un tendón: el posterior nace en la escotadura mastoidea del temporal y baja adelante; el tendón intermedio atraviesa el estilohioideo y se fija al hioides por una polea fibrosa; el anterior sube hasta la fosa digástrica de la mandíbula, junto a la línea media. Delimita con la mandíbula el triángulo submandibular.',
      'Baja la mandíbula (abre la boca) o eleva el hioides. Su doble origen embrionario se ve en su inervación: el vientre anterior, por el nervio milohioideo (trigémino); el posterior, por el **facial**.',
    ],
    sources: [LR('131')],
    parts: {
      'Anterior belly of digastric muscle': 'El **vientre anterior** del digástrico, bajo el mentón, del tendón intermedio a la fosa digástrica de la mandíbula. Lo inerva el nervio milohioideo, del trigémino.',
      'Posterior belly of digastric muscle': 'El **vientre posterior** del digástrico, de la escotadura mastoidea al tendón intermedio, por delante del paquete vasculonervioso y cruzado por el hipogloso. Lo inerva el **facial**.',
      'Intermediate tendon of digastric muscle': 'El **tendón intermedio** del digástrico: atraviesa el estilohioideo y se fija al cuerpo y asta mayor del hioides por una polea fibrosa, que hace del músculo una palanca angulada.',
    },
  },
  {
    en: 'Stylohyoid muscle',
    text: [
      'El **estilohioideo**, delgado, junto al vientre posterior del digástrico: de la base del proceso estiloides baja al cuerpo del hioides, donde se abre en dos para dejar pasar el tendón del digástrico. Eleva y lleva atrás el hioides en la deglución. Lo inerva el **facial**.',
    ],
    sources: [LR('131–132')],
  },
  {
    en: 'Mylohyoid muscle',
    text: [
      'El **milohioideo**, lámina cuadrilátera que forma con el del otro lado el **suelo de la boca** (diafragma oral): de la línea milohioidea de la mandíbula, sus fibras van a un rafe mediano y al cuerpo del hioides. Por encima quedan la glándula sublingual y la lengua; por debajo, el vientre anterior del digástrico, y la submandibular rodea su borde posterior.',
      'Eleva el suelo de la boca y la lengua al comenzar la deglución, o baja la mandíbula. Lo inerva el nervio milohioideo, del trigémino.',
    ],
    sources: [LR('132')],
  },
  {
    en: 'Geniohyoid muscle',
    text: [
      'El **genihioideo**, cilíndrico, sobre el milohioideo junto a la línea media: de la espina mentoniana inferior de la mandíbula al cuerpo del hioides. Lleva el hioides adelante y arriba o baja la mandíbula. Lo inervan fibras de C1 que acompañan al hipogloso.',
    ],
    sources: [LR('132')],
  },
]

const fasciae: Record<string, Description> = {
  'Superficial layer of temporal fascia': {
    text: [
      'La **fascia temporal**, hoja fibrosa nacarada y resistente que cubre el temporal: se fija en todo el contorno de la fosa temporal, hasta la línea temporal superior, y abajo se divide en una hoja superficial y otra profunda que se insertan en los dos labios del arco cigomático, con grasa entre ellas. La **hoja superficial** termina en el borde superior y la cara lateral del arco; sobre ella corren la arteria temporal superficial y ramos del facial y del auriculotemporal.',
    ],
    sources: [LR2('1173')],
  },
  'Masseteric fascia': {
    text: [
      'Lámina fibrosa que cubre la cara lateral del masetero, fijada al arco cigomático y al borde de la rama de la mandíbula: continúa detrás la fascia parotídea y forma con ella la celda de la parótida. Por encima de ella pasan el conducto parotídeo y los ramos del facial.',
    ],
    sources: [LR2('1154, 1173–1174')],
  },
  'Superficial investing cervical fascia': {
    text: [
      'La **lámina superficial de la fascia cervical**, que envuelve todo el cuello bajo el platisma: se fija arriba en la mandíbula, la mastoides y la línea nucal superior, abajo en el manubrio, la clavícula y la escápula, y detrás en el ligamento nucal. Se desdobla para envolver al **esternocleidomastoideo** y al **trapecio**, y arriba a la glándula submandibular y la parótida.',
      'Por encima del esternón forma, con su desdoblamiento, el espacio supraesternal, donde corre el arco venoso yugular.',
    ],
    sources: [LR('133')],
  },
}

const descriptions: Record<string, Description> = { ...fasciae }
for (const m of MUSCLES) {
  if (m.en) descriptions[m.en] = { text: m.text, sources: m.sources }
  for (const [en, lead] of Object.entries(m.parts ?? {})) descriptions[en] = { text: [lead, ...m.text], sources: m.sources }
}

export const headNeckMuscles = descriptions
