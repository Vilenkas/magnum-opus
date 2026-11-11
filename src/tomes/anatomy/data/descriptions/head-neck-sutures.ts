import type { Description, DescriptionSource } from './index'

/**
 * The fibrous and cartilaginous joints of the skull, the teeth and the ossicles (arthrology viewer): joints with no piece
 * of their own in the model, keyed by their `joint-index.ts` `en`. Each suture after the borders of its bones in
 * Rouvière t. 1 (printed = PDF + 1) and Latarjet–Ruiz Liard's chapters 9–12 and 15 (t. 1); the ossicles after
 * chapter 48 (t. 1), the gomphosis after chapter 103 (t. 2).
 */

const R = (p: string): DescriptionSource => ({ fuente: 'rouviere-1', p })
const LR = (p: string): DescriptionSource => ({ fuente: 'latarjet-ruiz-1', p })
const LR2 = (p: string): DescriptionSource => ({ fuente: 'latarjet-ruiz-2', p })
const TESTUT = (p: string): DescriptionSource => ({ fuente: 'testut-1', p })
const desc = (sources: DescriptionSource[], ...text: string[]): Description => ({ text, sources })

const vault: Record<string, Description> = {
  'Coronal suture': desc(
    [R('81, 84'), LR('69, 93, 103')],
    'La unión del **frontal** con los dos **parietales**: cruza la bóveda de un lado a otro, del pterion derecho al izquierdo, entre el borde parietal del frontal y el borde frontal de cada parietal. Es una sutura **dentada**, de dientes finos en lo alto que se adelgazan hacia abajo.',
    'En la línea media la encuentra la sutura sagital en el **bregma**, sitio de la fontanela anterior del recién nacido; donde la cruza la línea temporal está el **estefanión**. Es la última de las grandes suturas de la bóveda en soldarse, entre los 50 y los 70 años.',
  ),
  'Sagittal suture': desc(
    [R('81, 84'), LR('69, 103')],
    'La unión de los dos **parietales** en la línea media, por sus bordes sagitales, gruesos y muy dentados; va del bregma, delante, al **lambda**, detrás. Frente a los agujeros parietales los dientes casi desaparecen y la sutura se hace recta: es el **obelión**.',
    'Bajo ella corre el surco del seno sagital superior. En el niño la continúa hacia delante la sutura metópica, entre las dos mitades del frontal. Se suelda entre los 40 y los 50 años.',
  ),
  'Lambdoid suture': desc(
    [R('80, 83'), LR('69, 103')],
    'La unión de la escama del **occipital** con los dos **parietales**, en forma de λ: desde el lambda, en la línea media, cada rama baja hasta el **asterión**. Sus dientes son los más largos y gruesos de la bóveda.',
    'Es la sutura donde más a menudo aparecen huesos suturales (wormianos). En el lambda se halla la fontanela posterior, que se cierra poco después del nacimiento; la sutura se suelda entre los 40 y los 50 años.',
  ),
  'Squamous suture': desc(
    [R('66, 81'), LR('102')],
    'La unión del borde inferior del **parietal**, cóncavo y tallado en bisel a expensas de su lámina externa, con el borde circunferencial de la escama del **temporal**, que lo recubre como una escama. Es el tipo de la sutura **escamosa**: superficies en bisel que se superponen en vez de engranar.',
    'Describe un arco en la pared lateral del cráneo, desde el pterion hasta la escotadura parietal del temporal, donde la continúa la sutura parietomastoidea.',
  ),
  'Parietomastoid suture': desc(
    [R('81–82')],
    'Sutura corta entre el ángulo mastoideo del **parietal**, truncado, y la porción mastoidea del **temporal**, en el ángulo entrante que ésta forma con la escama. Prolonga hacia atrás la sutura escamosa y termina en el **asterión**, donde se encuentran parietal, occipital y temporal.',
  ),
  'Occipitomastoid suture': desc(
    [R('77, 80'), LR('73, 103')],
    'La unión de los bordes inferiores de la escama del **occipital** y del borde lateral de sus porciones laterales, detrás de la apófisis yugular, con el borde posterior de la porción mastoidea del **temporal**. Sube desde el agujero yugular, que la interrumpe delante, hasta el **asterión**.',
    'Cerca de ella se abre el agujero mastoideo, paso de una vena emisaria hacia el seno sigmoideo.',
  ),
  'Sphenofrontal suture': desc(
    [R('56, 58, 367')],
    'La unión del **esfenoides** con el **frontal**, en dos sitios. Fuera, en el fondo de la fosa temporal, la superficie triangular rugosa del extremo del ala mayor se apoya en el frontal: es la rama anterior del **pterion**. Dentro, el borde anterior del ala menor, tallado en bisel, se une a la porción orbitaria del frontal y cruza el techo de la órbita y el suelo de la fosa craneal anterior.',
  ),
  'Sphenoparietal suture': desc(
    [R('58, 82, 227'), LR('93')],
    'Sutura corta entre el vértice del ala mayor del **esfenoides** y el ángulo esfenoidal del **parietal**: el trazo horizontal de la H que forman las suturas del **pterion**, donde se encuentran frontal, parietal, temporal y esfenoides en el fondo de la fosa temporal.',
    'El hueso es aquí delgado, y por dentro, a la altura del ángulo esfenoidal, pasa la rama frontal de la arteria meníngea media: es el punto clásico de las hemorragias epidurales y de los abordajes de esa arteria.',
  ),
  'Sphenosquamous suture': desc(
    [R('58, 87'), LR('107')],
    'La unión del borde posterior del ala mayor del **esfenoides** con el borde anterior de la escama del **temporal**, en la pared lateral del cráneo y en la base, por delante de la porción petrosa. Sus bordes están tallados en bisel.',
    'Esa superposición permite un cierto juego que aumenta la resistencia de una zona frágil, la fosa temporal, ante los golpes.',
  ),
}

const base: Record<string, Description> = {
  'Fronto-ethmoidal suture': desc(
    [R('45, 47, 368')],
    'La unión del **etmoides** con el **frontal**: la lámina cribosa ocupa la escotadura etmoidal del frontal y la cara superior de los laberintos se articula con la superficie etmoidal que la rodea en herradura, de modo que las celdillas etmoidales se cierran con las frontales. Delante, el borde anterior de la lámina perpendicular se une a la espina nasal del frontal.',
    'En la pared medial de la órbita sigue su ángulo superomedial; en ella se abren los **agujeros etmoidales** anterior (a 1 cm de su extremo anterior) y posterior (en su extremo posterior), paso de las arterias y los nervios del mismo nombre.',
  ),
  'Spheno-ethmoidal suture': desc(
    [R('45, 53–54')],
    'La unión del **esfenoides** con el **etmoides**: la apófisis etmoidal del yugo esfenoidal con el borde posterior de la lámina cribosa, en el suelo de la fosa craneal anterior; la cara anterior del cuerpo del esfenoides con la cara posterior de los laberintos, que cierran las celdillas etmoidales posteriores; y la cresta esfenoidal con el borde posterior de la lámina perpendicular, en el tabique nasal.',
  ),
  'Spheno-occipital synchondrosis': desc(
    [R('54'), TESTUT('491')],
    'La unión del cuerpo del **esfenoides**, por su cara posterior, cuadrilátera, con la porción basilar del **occipital**: una lámina de **cartílago hialino**, resto del condrocráneo, que es el principal cartílago de crecimiento de la base del cráneo y alarga el clivus.',
    'Los dos huesos se sueldan pronto, al terminar el crecimiento: en el adulto no suele quedar rastro de la articulación y forman una sola pieza, el hueso basilar.',
  ),
  'Sphenopetrosal synchondrosis': desc(
    [R('87'), TESTUT('491')],
    'La unión del borde posterior del ala mayor del **esfenoides** con el borde anterior de la porción petrosa del **temporal**, en la base del cráneo, por un **fibrocartílago**. A lo largo de ella corre el surco de la porción cartilaginosa de la trompa auditiva y se abre el conducto musculotubárico; en su extremo medial queda el **agujero rasgado**, cerrado en el vivo por fibrocartílago.',
  ),
  'Petro-occipital synchondrosis': desc(
    [R('71, 75, 87')],
    'La unión del borde posterior de la porción petrosa del **temporal** con el borde lateral de la porción basilar del **occipital**, por un **fibrocartílago**. Por su cara endocraneal corre el surco del seno petroso inferior; detrás la interrumpe el **agujero yugular**.',
  ),
}

const faceWithSkull: Record<string, Description> = {
  'Frontonasal suture': desc(
    [R('104'), LR('86, 103')],
    'La unión del borde superior de los **huesos nasales**, grueso y dentado, con el borde nasal del **frontal**, medial a la apófisis frontal del maxilar; detrás, los nasales se apoyan en la espina nasal del frontal. En su punto medio, en el fondo del ángulo de la raíz de la nariz, está el **nasión**.',
  ),
  'Frontomaxillary suture': desc(
    [R('95, 368')],
    'La unión del borde superior de la apófisis frontal del **maxilar**, estrecho y dentado, con la parte lateral del borde nasal del **frontal**. Sigue después por el ángulo superomedial de la órbita, donde el frontal se une sucesivamente al maxilar, al lagrimal y al etmoides.',
  ),
  'Frontolacrimal suture': desc(
    [R('97, 368'), LR('103')],
    'La unión del borde superior del **lagrimal** con la apófisis orbitaria medial del **frontal**, en la pared medial de la órbita. Donde se le juntan las suturas frontomaxilar y lagrimomaxilar, formando una T, está el punto craneométrico **dacrion**.',
  ),
  'Frontozygomatic suture': desc(
    [R('107, 384')],
    'La unión del ángulo superior del **cigomático**, dentado, con la apófisis cigomática del **frontal**, en el reborde lateral de la órbita, donde se palpa bajo la piel. A su altura se fija en la pared lateral de la órbita el fascículo lateral del tendón del elevador del párpado.',
  ),
  'Sphenozygomatic suture': desc(
    [R('57, 368')],
    'La unión del borde cigomático del ala mayor del **esfenoides**, vertical, con el borde posterior de la apófisis frontal del **cigomático**. Divide la pared lateral de la órbita en su tercio anterior, cigomático, y sus dos tercios posteriores, esfenoidales.',
  ),
  'Sphenomaxillary suture': desc(
    [R('101')],
    'Contacto inconstante entre la apófisis pterigoides del **esfenoides** y la tuberosidad del **maxilar**, en el fondo de la fosa infratemporal: casi siempre se interpone entre ellos la apófisis piramidal del palatino, que se articula delante con la tuberosidad y detrás encaja en la escotadura pterigoidea.',
  ),
  'Temporozygomatic suture': desc(
    [R('64, 107'), LR('98, 102')],
    'La unión del extremo anterior de la apófisis cigomática del **temporal**, dentado y cortado en bisel, con el ángulo posterior del **cigomático**: cierra el **arco cigomático**. Latarjet y Ruiz Liard la toman como modelo de sutura dentada entre la cara y el cráneo.',
  ),
  'Ethmoidomaxillary suture': desc(
    [R('51, 95, 369')],
    'La unión del borde superior del **maxilar**, delgado e irregular, con la lámina orbitaria del **etmoides**, en el ángulo inferomedial de la órbita, detrás del lagrimal. En la pared de las cavidades nasales, la cara medial del maxilar se corresponde con los laberintos etmoidales, que completan sus hemiceldillas, y la apófisis unciforme cruza el hiato maxilar.',
  ),
  'Ethmoidolacrimal suture': desc(
    [R('97, 367')],
    'La unión del borde posterior del **lagrimal** con el borde anterior de la lámina orbitaria del **etmoides**: una de las suturas verticales de la pared medial de la órbita, detrás de la cresta lagrimal posterior.',
  ),
  'Palato-ethmoidal suture': desc(
    [R('99')],
    'La unión de la apófisis orbitaria del **palatino**, por su carilla anterosuperior, con el laberinto del **etmoides**, cuyas celdillas posteriores cierra. Asoma en el vértice posterior del suelo de la órbita.',
  ),
  'Sphenovomerine schindylesis': desc(
    [R('54'), LR('90, 102')],
    'La unión del borde superior del **vómer** con el cuerpo del **esfenoides**: la cresta y el pico esfenoidales, en su cara inferior, encajan en el canal que dejan entre sí las dos alas del vómer. Es el ejemplo clásico de **esquindilesis**, una cresta metida en una ranura.',
    'El ajuste no es perfecto: en la línea media queda un conducto esfenovomeriano por el que pasa una arteriola para el cuerpo del esfenoides y el tabique nasal.',
  ),
  'Ethmoidovomerine synchondrosis': desc(
    [R('45'), TESTUT('491')],
    'La unión del borde posteroinferior de la lámina perpendicular del **etmoides** con el borde anterior del **vómer**, en el tabique nasal óseo; en el ángulo que dejan delante se fija el cartílago del tabique. Testut la cuenta entre las sincondrosis, porque los dos huesos se unen por cartílago antes de soldarse.',
  ),
}

const face: Record<string, Description> = {
  'Internasal suture': desc(
    [R('104'), LR('86')],
    'La unión de los dos **huesos nasales** en la línea media, por sus bordes mediales, gruesos y rugosos. Es una sutura **armónica**: bordes lisos que sólo se tocan. Por detrás los nasales descansan en la espina nasal del frontal y en la lámina perpendicular del etmoides.',
  ),
  'Nasomaxillary suture': desc(
    [R('95, 104')],
    'La unión del borde lateral del **hueso nasal** con el borde anterior de la apófisis frontal del **maxilar**, en el dorso de la nariz. Es armónica, como la internasal.',
  ),
  'Lacrimomaxillary suture': desc(
    [R('95, 97, 367')],
    'La unión del borde anterior del **lagrimal** con el borde posterior de la apófisis frontal del **maxilar**, que recorre de arriba abajo el fondo del surco lagrimal. Abajo, el gancho lagrimal encaja en una escotadura del borde superior del maxilar. Los surcos de los dos huesos forman juntos la fosa del saco lagrimal y la mayor parte del conducto nasolagrimal.',
  ),
  'Lacrimoconchal suture': desc(
    [R('97, 103')],
    'La unión del borde inferior del **lagrimal** con la apófisis lagrimal del **cornete nasal inferior**, que sube a su encuentro. Juntos completan la pared medial del conducto nasolagrimal, que se abre en el meato inferior.',
  ),
  'Zygomaticomaxillary suture': desc(
    [R('93, 107, 367')],
    'La unión de la apófisis cigomática del **maxilar**, de vértice truncado, con el **cigomático**: baja desde el reborde infraorbitario, lateral al agujero infraorbitario, hasta la cresta cigomaticoalveolar. Sigue también por el suelo de la órbita, en la parte lateral.',
  ),
  'Intermaxillary suture': desc(
    [R('94, 96'), LR('85, 99')],
    'La unión de los dos **maxilares** en la línea media de la cara, por debajo de la abertura piriforme: va de la espina nasal anterior al borde alveolar, entre los incisivos centrales. En el paladar la continúa la sutura palatina media.',
    'Cada maxilar nace de dos centros, el posmaxilar y el premaxilar, unidos por la sutura incisiva; si ésta no se cierra queda una fisura palatina, a veces con labio leporino.',
  ),
  'Palatomaxillary suture': desc(
    [R('95, 99, 101')],
    'La unión de la lámina perpendicular del **palatino**, por su segmento maxilar, con la parte posterior de la cara medial del **maxilar**. Entre los dos cierran el conducto palatino mayor, y la apófisis maxilar del palatino se hunde en la fisura palatina, a la entrada del seno maxilar.',
  ),
  'Median palatine suture': desc(
    [R('94, 105, 114'), LR('89')],
    'La sutura media de la **bóveda palatina**: une delante las apófisis palatinas de los dos **maxilares** y detrás las láminas horizontales de los dos **palatinos**, y con la palatina transversa dibuja una cruz. En su extremo anterior se abre el agujero incisivo; atrás termina en la espina nasal posterior.',
    'Por su cara nasal se levanta la cresta nasal, sobre la que se apoya el borde inferior del vómer.',
  ),
  'Transverse palatine suture': desc(
    [R('114, 350')],
    'La unión del borde posterior de la apófisis palatina del **maxilar** con el borde anterior de la lámina horizontal del **palatino**, que cruza el paladar a cada lado de la sutura media. En su extremo lateral, entre maxilar y palatino, se abre el agujero palatino mayor.',
  ),
}

const others: Record<string, Description> = {
  'Dento-alveolar syndesmosis': desc(
    [LR2('1167'), LR('14')],
    'La **gonfosis**, la articulación de cada raíz del diente con su alvéolo en el borde de los maxilares y de la mandíbula: una clavija encajada en un hueco y mantenida por fibras cortas. Las fibras del **ligamento periodontal** (desmodonto) van del cemento de la raíz a la pared del alvéolo, dispuestas en pirámide alrededor del ápice.',
    'Entre el vértice de la raíz y el fondo del alvéolo queda un espacio con tejido conjuntivo condensado, el cojinete apical, que amortigua la presión de la masticación y protege los vasos y nervios que entran por el ápice. Perdido el diente, el alvéolo se reabsorbe.',
  ),
  'Incudomallear joint': desc(
    [LR('432')],
    'La articulación de la cabeza del **martillo** con el cuerpo del **yunque**, en el receso epitimpánico: una sinovial en **silla de montar**, de dos caras inversamente configuradas y cubiertas de cartílago, con una pequeña cápsula, un menisco y una sinovial.',
    'El ligamento anterior del martillo y el posterior del yunque forman el eje sobre el que los dos huesecillos basculan juntos con las vibraciones de la membrana timpánica.',
  ),
  'Incudostapedial joint': desc(
    [LR('432')],
    'La articulación de la apófisis lenticular del **yunque**, convexa, con la cara cóncava de la cabeza del **estribo**: una pequeña **esferoidea**, con su cápsula fibrosa y su sinovial. Por ella pasa la vibración de la cadena al estribo, cuyo músculo propio, el estapedio, se inserta junto a ella.',
  ),
  'Tympanostapedial syndesmosis': desc(
    [LR('432')],
    'La unión de la base del **estribo** con el contorno de la ventana vestibular (oval) de la pared medial de la caja del tímpano, por el **ligamento anular del estribo**. Ese anillo fibroso deja que la base entre y salga de la ventana como un pistón y transmita la vibración a la perilinfa del vestíbulo.',
  ),
}

export const headNeckSutures: Record<string, Description> = { ...vault, ...base, ...faceWithSkull, ...face, ...others }
