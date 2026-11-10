import type { Description } from './index'

/**
 * The cranial nerves and their branches, the eye, the ear and the dural folds (nervous viewer), after Latarjet–Ruiz
 * Liard's chapters 25 and 36 (cranial nerves) and 43–49 (senses), t. 1. Branches of a nerve share its lead text.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })

const MANDIBULAR =
  'El **nervio mandibular** (V3), el mayor ramo del trigémino y el único mixto: sale del cráneo por el **foramen oval** a la fosa infratemporal, donde se une a la raíz motora y se divide enseguida en un tronco anterior, casi solo motor, y otro posterior, casi solo sensitivo. Inerva los músculos masticadores y la piel y las mucosas del tercio inferior de la cara: mandíbula, dientes inferiores, labio inferior, mentón, mejilla, dos tercios anteriores de la lengua y sien.'
const v3 = (p: string, lead: string): Description => ({ text: [lead, MANDIBULAR], sources: [LR(p)] })

const EYEBALL =
  'El **globo ocular**, esfera de unos 24 mm alojada en la parte anterior de la órbita, tiene tres capas: una fibrosa externa (esclera y córnea), una vascular media (coroides, cuerpo ciliar e iris) y una nerviosa interna (retina), que rodean los medios transparentes: humor acuoso, lente y cuerpo vítreo.'
const eye = (p: string, ...text: string[]): Description => ({ text: [...text, EYEBALL], sources: [LR(p)] })

const LACRIMAL =
  'El **aparato lagrimal** produce las lágrimas en la glándula lagrimal, en el ángulo superolateral de la órbita; el parpadeo las extiende sobre el ojo hacia el ángulo medial, donde los **puntos lagrimales** las recogen y los canalículos, el saco y el conducto nasolagrimal las llevan al meato inferior de la nariz.'
const tear = (p: string, lead: string): Description => ({ text: [lead, LACRIMAL], sources: [LR(p)] })

const nerves: Record<string, Description> = {
  'Olfactory nerve (I)': d(
    '294',
    'El **nervio olfatorio** (I), sensorial: no es un tronco sino unos veinte **filetes olfatorios**, prolongaciones de las neuronas de la mucosa olfatoria, en el techo de la cavidad nasal, que atraviesan la **lámina cribosa** del etmoides y terminan en el bulbo olfatorio. Una fractura de la base anterior del cráneo puede arrancarlos (anosmia, salida de líquido cerebroespinal por la nariz).',
  ),
  'Optic nerve (II)': d(
    '294, 419',
    'El **nervio óptico** (II), sensorial: lo forman los axones de las células ganglionares de la retina, que salen del globo por el disco óptico. Recorre la órbita en S, dentro del cono de los músculos rectos, con la arteria central de la retina en su eje los últimos milímetros; pasa por el **conducto óptico** con la arteria oftálmica y se une al del otro lado en el **quiasma óptico**, sobre la silla turca.',
    'No es un nervio periférico sino una prolongación del encéfalo: lo envuelven las meninges hasta el globo, por eso el aumento de presión intracraneal hincha el disco óptico (edema de papila).',
  ),
  'Oculomotor nerve (III)': d(
    '294, 298, 404',
    'El **nervio oculomotor** (III), motor: sale del mesencéfalo por la fosa interpeduncular, pasa entre las arterias cerebral posterior y cerebelosa superior, corre en la pared lateral del **seno cavernoso** y entra en la órbita por la fisura orbitaria superior, dentro del anillo tendinoso común, dividido en dos ramos.',
    'Inerva el elevador del párpado, los rectos superior, medial e inferior y el oblicuo inferior, y lleva al ganglio ciliar las fibras parasimpáticas del **esfínter de la pupila** y del músculo ciliar. Su parálisis deja el ojo abajo y afuera, con ptosis y pupila dilatada.',
  ),
  'Trochlear nerve (IV)': d(
    '294, 298, 404',
    'El **nervio troclear** (IV), motor, el más delgado de los craneales y el único que sale por la **cara posterior** del tronco encefálico, bajo los colículos inferiores, tras cruzarse con el del otro lado. Rodea el pedúnculo cerebral, corre en la pared lateral del seno cavernoso y entra en la órbita por la fisura orbitaria superior, por fuera del anillo tendinoso.',
    'Inerva sólo el **oblicuo superior**: su parálisis da visión doble al mirar abajo, sobre todo al bajar escaleras, y el enfermo inclina la cabeza hacia el lado sano.',
  ),
  'Trigeminal nerve (V)': d(
    '294–299',
    'El **nervio trigémino** (V), el mayor de los craneales, mixto: emerge de la cara anterolateral del puente por una gruesa raíz sensitiva y una fina raíz motora, que van adelante hasta el vértice del peñasco. Allí la sensitiva se ensancha en el **ganglio trigeminal** (de Gasser), en una celda de la duramadre (cavum trigeminal), del que salen sus tres ramos: oftálmico, maxilar y mandibular.',
    'Es el nervio sensitivo de la cara, de la mitad anterior del cuero cabelludo, de los dientes, de las mucosas nasal y oral y de la duramadre, y el motor de los músculos masticadores. Su dolor en descargas es la neuralgia del trigémino.',
  ),
  'Sensory root of trigeminal nerve': d('297', 'La **raíz sensitiva** del trigémino, gruesa: une el ganglio trigeminal al puente y lleva a los núcleos del trigémino la sensibilidad de la cara; entra por la cara anterolateral del puente, lateral a la raíz motora.'),
  'Motor root of trigeminal nerve': d('297, 301', 'La **raíz motora** del trigémino, fina: sale del puente medial a la sensitiva, pasa bajo el ganglio trigeminal sin entrar en él y se une al nervio mandibular al salir por el foramen oval. Inerva los músculos masticadores, el milohioideo, el vientre anterior del digástrico, el tensor del velo del paladar y el tensor del tímpano.'),
  'Ophthalmic nerve': d(
    '299–303',
    'El **nervio oftálmico** (V1), el menor y el más alto de los ramos del trigémino, sensitivo: va adelante en la pared lateral del **seno cavernoso** y, antes de la fisura orbitaria superior, se divide en sus tres ramos: **lagrimal**, **frontal** y **nasociliar**.',
    'Inerva el globo ocular (la córnea, por los nervios ciliares; de ahí el reflejo corneal), la conjuntiva, la glándula lagrimal, el párpado superior, la frente y el cuero cabelludo hasta el vértice, el dorso de la nariz y parte de la mucosa nasal y de los senos. El herpes zóster oftálmico sigue su territorio.',
  ),
  'Maxillary nerve': d(
    '300, 303–305',
    'El **nervio maxilar** (V2), sensitivo: sale del cráneo por el **foramen redondo** a la fosa pterigopalatina, donde da ramos al ganglio pterigopalatino y el nervio cigomático; entra en la órbita por la fisura orbitaria inferior y continúa como **nervio infraorbitario** por el surco y el conducto del suelo de la órbita hasta el foramen infraorbitario.',
    'Inerva el tercio medio de la cara (párpado inferior, mejilla, ala de la nariz, labio superior), los dientes y la encía superiores (nervios alveolares superiores), el seno maxilar, el paladar y la parte posterior de la cavidad nasal.',
  ),
  'Meningeal branch of maxillary nerve': d('300', 'El **ramo meníngeo** del nervio maxilar: nace antes del foramen redondo y se distribuye por la duramadre de la fosa craneal media, con la rama frontal de la meníngea media.'),
  'Anterior division of mandibular nerve': v3('305–306', 'El **tronco anterior** del nervio mandibular, el menor: casi solo motor, da los nervios **maseterino**, **temporales profundos** y **pterigoideo lateral**, para los músculos masticadores, y un solo ramo sensitivo, el nervio bucal.'),
  'Posterior division of mandibular nerve': v3('307–310', 'El **tronco posterior** del nervio mandibular, el mayor: casi solo sensitivo, da el nervio **auriculotemporal**, que rodea la arteria meníngea media, y termina en el **lingual** y el **alveolar inferior**; éste lleva las únicas fibras motoras del tronco, las del nervio milohioideo.'),
  'Buccal nerve': v3('306', 'El **nervio bucal**, sensitivo: pasa entre las dos cabezas del pterigoideo lateral y baja por la cara lateral del buccinador, que perfora, para la piel y la mucosa de la mejilla y la encía vestibular de los molares inferiores. No inerva el buccinador, que es del facial.'),
  'Lingual nerve': v3(
    '308–309',
    'El **nervio lingual**, ramo terminal del mandibular: baja entre los dos pterigoideos, delante del alveolar inferior, donde recibe la **cuerda del tímpano**; pasa junto al tercer molar inferior, bajo la mucosa (peligro en su extracción), cruza el conducto submandibular y llega a la lengua. Lleva la sensibilidad general de los dos tercios anteriores de la lengua, del suelo de la boca y de la encía lingual, y con la cuerda del tímpano el gusto y las fibras secretoras de las glándulas submandibular y sublingual, que se relevan en el ganglio submandibular, suspendido de él.',
  ),
  'Inferior alveolar nerve': v3('309–310', 'El **nervio alveolar inferior**, ramo terminal del mandibular, el mayor: baja entre el ligamento esfenomandibular y la rama de la mandíbula, entra con la arteria en el **foramen mandibular** y recorre el conducto mandibular, dando los ramos de los dientes inferiores y de la encía. Termina en el foramen mentoniano como nervio mentoniano. Se anestesia en la espina de Spix para operar los dientes inferiores.'),
  'Nerve to mylohyoid muscle': v3('310', 'El **nervio milohioideo**, la única rama motora del alveolar inferior: nace antes del foramen mandibular, recorre el surco milohioideo y, bajo el milohioideo, inerva este músculo y el **vientre anterior del digástrico**.'),
  'Mental nerve': v3('310', 'El **nervio mentoniano**, rama terminal del alveolar inferior: sale por el **foramen mentoniano**, bajo el segundo premolar inferior, y se abre en ramos para la piel del mentón, la piel y la mucosa del labio inferior y la encía vestibular anterior.'),
  'Abducens nerve (VI)': d(
    '311, 404',
    'El **nervio abducens** (VI), motor: sale del surco bulbopontino, sube por el clivus, se acoda sobre el vértice del peñasco y atraviesa el **seno cavernoso** junto a la carótida interna (no en su pared, como los otros); entra en la órbita por la fisura orbitaria superior, dentro del anillo tendinoso.',
    'Inerva sólo el **recto lateral**. Por su largo trayecto intracraneal se lesiona a menudo, incluso por la hipertensión intracraneal: el ojo se desvía hacia dentro y no puede abducir.',
  ),
  'Facial nerve (VII)': d(
    '311–317',
    'El **nervio facial** (VII), mixto: sale del surco bulbopontino con el **nervio intermedio** (su raíz sensitiva y parasimpática) y entra con el vestibulococlear en el conducto auditivo interno. Recorre el **conducto facial** del peñasco con un codo, el ganglio geniculado, donde da el petroso mayor (glándula lagrimal y nasales); baja detrás de la caja del tímpano, inerva el estapedio y da la cuerda del tímpano, y sale por el **foramen estilomastoideo**.',
    'Fuera del cráneo da ramos al digástrico posterior, al estilohioideo y a los músculos auriculares y occipital, entra en la parótida y se divide en ramos temporales, cigomáticos, bucales, marginal de la mandíbula y cervical para **todos los músculos de la expresión**. Su parálisis periférica paraliza toda la hemicara; la central respeta la frente.',
  ),
  'Chorda tympani': d('315–317, 76', 'La **cuerda del tímpano**: nace del facial poco antes del foramen estilomastoideo, sube por un conductillo a la **caja del tímpano**, que cruza bajo la mucosa entre el yunque y el martillo, y sale por la fisura petrotimpánica para unirse al **nervio lingual**. Lleva el gusto de los dos tercios anteriores de la lengua y las fibras parasimpáticas de las glándulas submandibular y sublingual.'),
  'Vestibulocochlear nerve (VIII)': d(
    '313–314, 322',
    'El **nervio vestibulocochlear** (VIII), sensorial: dos nervios unidos, el **coclear**, de la audición, y el **vestibular**, del equilibrio, que salen del oído interno por el fondo del conducto auditivo interno, junto al facial, y entran en el tronco encefálico en el surco bulbopontino, por fuera del facial.',
    'El neurinoma del acústico, en el conducto, empieza con sordera unilateral y acúfenos, y al crecer comprime el facial y el trigémino.',
  ),
  'Cochlear nerve': d('314, 322, 439', 'El **nervio coclear**, porción auditiva del VIII: lo forman las prolongaciones centrales de las neuronas del **ganglio espiral**, en el modiolo de la cóclea, que reciben las células ciliadas del órgano espiral; sale por el área coclear del fondo del conducto auditivo interno y termina en los núcleos cocleares del tronco encefálico.'),
  'Vestibular nerve': d('314, 322', 'El **nervio vestibular**, porción del equilibrio del VIII: lo forman las neuronas del **ganglio vestibular** (de Scarpa), en el fondo del conducto auditivo interno, que reciben las crestas de los conductos semicirculares y las máculas del utrículo y del sáculo; termina en los núcleos vestibulares.'),
  'Glossopharyngeal nerve (IX)': d(
    '322–326',
    'El **nervio glosofaríngeo** (IX), mixto: sale del surco retroolivar de la médula oblongada y del cráneo por el **foramen yugular**, con el vago y el accesorio, con dos ganglios sensitivos; baja entre la carótida interna y la yugular interna, rodea el estilofaríngeo y llega a la base de la lengua.',
    'Inerva el **estilofaríngeo**; lleva la sensibilidad y el gusto del **tercio posterior de la lengua**, la sensibilidad de la faringe y la tonsila (arco aferente del reflejo nauseoso), de la caja del tímpano y la trompa, y las del seno y el glomo carotídeos; por el nervio timpánico y el ganglio ótico, las fibras secretoras de la **parótida**.',
  ),
  'Vagus nerve (X)': d(
    '326–333',
    'El **nervio vago** (X), mixto, el de trayecto más largo: sale del surco retroolivar y del cráneo por el **foramen yugular**, con dos ganglios sensitivos, y baja por el cuello en la vaina carotídea, detrás entre la carótida y la yugular interna. Atraviesa el tórax detrás de la raíz del pulmón —el derecho por delante de la subclavia, el izquierdo por delante del arco aórtico—, forma el plexo esofágico y entra en el abdomen con el esófago.',
    'En el cuello da los ramos faríngeos (músculos de la faringe y del velo), el **laríngeo superior** y el **recurrente** (todos los músculos de la laringe), y ramos cardíacos; en el tórax y el abdomen, es el parasimpático del corazón, de los pulmones y del tubo digestivo hasta el ángulo izquierdo del colon.',
  ),
  'Accessory nerve (XI)': d(
    '333–336',
    'El **nervio accesorio** (XI), motor: su raíz espinal nace de la médula cervical alta (C1–C5), sube por el conducto vertebral y entra en el cráneo por el foramen magno; se une a la raíz craneal y sale por el **foramen yugular**. Su ramo interno, la raíz craneal, se une al vago; el externo baja por detrás del vientre posterior del digástrico.',
    'El ramo externo atraviesa el **esternocleidomastoideo**, cruza el triángulo posterior del cuello, muy superficial (se lesiona en las biopsias de nodos), y termina en el **trapecio**. Su lesión hace caer el hombro e impide elevar el brazo por encima de la horizontal.',
  ),
  'Hypoglossal nerve (XII)': d(
    '336–338',
    'El **nervio hipogloso** (XII), motor: sale del surco preolivar por varias raíces y del cráneo por el **conducto del hipogloso**; baja entre la carótida interna y la yugular interna, se hace anterior, cruza por fuera las carótidas y, por encima del asta mayor del hioides, avanza sobre el hiogloso hasta la lengua.',
    'Inerva **todos los músculos de la lengua** salvo el palatogloso. Lo acompañan fibras de C1 que forman la raíz superior del asa cervical e inervan el tirohioideo y el genihioideo. Si se lesiona, la lengua se atrofia de ese lado y, sacada, se desvía hacia la lesión.',
  ),
  // ---------- Eye ----------
  'Sclera': eye('392–393', 'La **esclera** (esclerótica): la capa fibrosa blanca, gruesa y resistente, que forma los cinco sextos posteriores del globo y le da su forma; delante se continúa con la córnea en el limbo, donde está el seno venoso de la esclera (conducto de Schlemm), y detrás la perfora el nervio óptico por la lámina cribosa. En ella se insertan los músculos del ojo.'),
  'Cornea': eye('392–393', 'La **córnea**: la parte anterior, transparente y más curva de la capa fibrosa, como un vidrio de reloj engastado en la esclera. Sin vasos, se nutre del humor acuoso y de las lágrimas; muy inervada por los nervios ciliares (oftálmico), su roce provoca el parpadeo (reflejo corneal). Es la lente más potente del ojo.'),
  'Iris': eye('394', 'El **iris**: diafragma circular de la capa vascular, delante de la lente, perforado por la **pupila**; da el color del ojo. Su esfínter (parasimpático, por el oculomotor) estrecha la pupila con la luz y en la acomodación; su dilatador (simpático) la ensancha. Separa la cámara anterior de la posterior.'),
  'Retina': eye('396', 'La **retina**: la capa nerviosa interna, que tapiza la coroides hasta la ora serrata. Sus fotorreceptores (conos y bastones) transmiten a las células bipolares y ganglionares, cuyos axones forman el nervio óptico en el **disco óptico** (punto ciego); en el eje visual, la **mácula** con la fóvea es el lugar de visión más fina. La nutren la arteria central de la retina (capas internas) y la coroides (externas).'),
  'Lens': eye('397', 'La **lente** (cristalino): lente biconvexa, transparente y elástica, detrás del iris, envuelta en su cápsula y suspendida por la zónula ciliar. Al contraerse el músculo ciliar la zónula se relaja y la lente se abomba para ver de cerca (**acomodación**); con la edad se endurece (presbicia) o se opacifica (catarata).'),
  'Vitreous body': eye('397', 'El **cuerpo vítreo**: gel transparente que llena la cámara vítrea, los cuatro quintos posteriores del globo, entre la lente y la retina, a la que mantiene aplicada; lo recorre el conducto hialoideo, resto de una arteria fetal.'),
  'Anterior chamber of eyeball': eye('397', 'La **cámara anterior**, entre la córnea y el iris, llena de **humor acuoso**: éste, producido por los procesos ciliares en la cámara posterior, pasa por la pupila y sale en el ángulo iridocorneal por el seno venoso de la esclera. Si su salida se obstruye sube la presión del ojo (glaucoma).'),
  'Anterior segment of eyeball': eye('391–392, 397', 'El **segmento anterior** del globo: lo que está por delante del cuerpo vítreo, es decir la córnea, las cámaras anterior y posterior con el humor acuoso, el iris, el cuerpo ciliar y la lente.'),
  'Posterior segment of eyeball': eye('391–392, 397', 'El **segmento posterior** del globo: la cámara vítrea con el cuerpo vítreo y las capas que la rodean, retina, coroides y esclera, con el disco óptico y la mácula.'),
  'Zonular fibres': eye('398', 'Las **fibras zonulares** (zónula ciliar): finísimos filamentos que van de los procesos ciliares al ecuador de la cápsula de la lente y la mantienen suspendida y tensa; cuando el músculo ciliar se contrae se relajan y la lente se abomba (acomodación).'),
  'Suspensory ligament of eyeball': {
    text: [
      'El **ligamento suspensorio del globo** (de Lockwood): engrosamiento de la vaina del globo ocular bajo el ojo, una hamaca entre las expansiones del recto inferior y el oblicuo inferior que se fija a los lados en los huesos lagrimal y cigomático; sostiene el globo aunque falte el suelo de la órbita.',
    ],
    sources: [LR('403–404')],
  },
  'Lacrimal gland': tear('414–415', 'La **glándula lagrimal**, en la fosa lagrimal del frontal, en el ángulo superolateral de la órbita: el tendón del elevador del párpado la divide en una porción orbitaria y otra palpebral, cuyos conductillos se abren en el fórnix superior de la conjuntiva. Sus fibras secretoras vienen del facial (petroso mayor, ganglio pterigopalatino) por el nervio lagrimal.'),
  'Lacrimal canaliculus': tear('415', 'Los **canalículos lagrimales**, superior e inferior: nacen en el **punto lagrimal** de cada párpado, cerca del ángulo medial, bajan o suben un poco (ampolla) y van horizontales, rodeados por el orbicular, hasta el saco lagrimal.'),
  'Ampulla of lacrimal canaliculus': tear('415', 'La **ampolla del canalículo lagrimal**: la dilatación en el codo entre el corto trayecto vertical del canalículo, desde el punto lagrimal, y el horizontal hasta el saco.'),
  'Lacrimal sac': tear('415', 'El **saco lagrimal**, extremo superior dilatado y ciego de la vía lagrimal, en la fosa del saco lagrimal, detrás del ligamento palpebral medial: recibe los canalículos y se continúa abajo con el conducto nasolagrimal. La porción lagrimal del orbicular lo dilata y aspira las lágrimas al parpadear.'),
  'Nasolacrimal duct': tear('415', 'El **conducto nasolagrimal**: continúa el saco lagrimal por un conducto óseo del maxilar, el lagrimal y el cornete inferior, y se abre en el **meato inferior** de la cavidad nasal, bajo un pliegue de mucosa: por eso al llorar se moquea.'),
  // ---------- Ear ----------
  'Tympanic membrane': d('428–429', 'La **membrana timpánica**: membrana circular, delgada y transparente, de 1 cm, que cierra el fondo del conducto auditivo externo y lo separa de la caja del tímpano; oblicua, mira afuera, abajo y adelante. El mango del martillo, incluido en ella, la tira hacia dentro (ombligo); su parte superior es fláccida y el resto, tensa. Vibra con el sonido y lo transmite a los huesecillos.'),
  'Auditory tube': d('434–435', 'La **trompa auditiva** (de Eustaquio): conducto de 3,5–4 cm que une la caja del tímpano con la **nasofaringe**, ósea en su tercio posterior y cartilaginosa en los dos anteriores, dirigida adelante, abajo y adentro. Se abre al deglutir y bostezar por el tensor y el elevador del velo del paladar, e iguala la presión del aire a ambos lados del tímpano. En el niño, más corta y horizontal, lleva las infecciones de la faringe al oído (otitis).'),
  Vestibule: d('437', 'El **vestíbulo**: cavidad central del laberinto óseo, entre la caja del tímpano, a la que da la ventana vestibular cerrada por el estribo, y el conducto auditivo interno. Delante se abre a la cóclea, detrás a los conductos semicirculares; contiene el **utrículo** y el **sáculo**, cuyas máculas sienten la posición de la cabeza y la aceleración lineal.'),
  Cochlea: d('438–439', 'La **cóclea** (caracol): parte anterior del laberinto óseo, un conducto enrollado dos vueltas y media alrededor de un eje, el **modiolo**. La lámina espiral y el conducto coclear lo dividen en las rampas vestibular y timpánica, que se comunican en el vértice (helicotrema); sobre la membrana basilar del conducto coclear descansa el **órgano espiral** (de Corti), receptor de la audición.'),
  // ---------- Dural folds ----------
  'Falx cerebri': d('197–199', 'La **hoz del cerebro**: tabique vertical de duramadre en la fisura longitudinal, entre los dos hemisferios, en forma de hoz: de la crista galli, delante, a la protuberancia occipital interna, donde se une a la tienda del cerebelo. Su borde adherente contiene el seno sagital superior; el libre, sobre el cuerpo calloso, el sagital inferior, y su unión con la tienda, el seno recto.'),
  'Tentorium cerebelli': d('198–200', 'La **tienda del cerebelo** (tentorio): tabique horizontal de duramadre entre los lóbulos occipitales y el cerebelo, en forma de tienda de campaña. Su borde adherente sigue los surcos de los senos transversos y el borde superior del peñasco (seno petroso superior) hasta las clinoides; su borde libre limita la **incisura tentorial**, por la que pasa el mesencéfalo y por la que se hernia el uncus del lóbulo temporal en los aumentos de presión, comprimiendo el oculomotor.'),
  'Choroid plexus': d('209, 158–159', 'Los **plexos coroideos**: franjas de capilares cubiertas de epitelio ependimario que hacen relieve en los ventrículos, a partir de las telas coroideas de la piamadre (ventrículos laterales, tercero y cuarto). Secretan la mayor parte del **líquido cerebroespinal**, que sale del cuarto ventrículo al espacio subaracnoideo por sus aberturas mediana y laterales.'),
}

export const headNeckNerves = nerves
