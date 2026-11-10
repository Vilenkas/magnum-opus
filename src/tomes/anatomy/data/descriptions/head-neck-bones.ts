import type { Description } from './index'

/**
 * The bones of the head and the neck (skeleton viewer): the neurocranium and the face after Latarjet–Ruiz Liard's
 * chapters 9–11 and 17 (t. 1), the ossicles after chapter 48, the teeth, the nasal and the laryngeal cartilages after
 * chapters 91, 92 and 103 (t. 2). Teeth of one kind share their text, led by a line of their own.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })
const d2 = (p: string, ...text: string[]): Description => ({ text, sources: [LR2(p)] })

const cranium: Record<string, Description> = {
  'Frontal bone': d(
    '67–69, 95',
    'Hueso impar de la parte anterior del cráneo. Su **escama**, vertical, forma la frente, con las eminencias frontales y, encima de las órbitas, los arcos superciliares y la glabela entre ellos; termina abajo en el **borde supraorbitario**, con la escotadura o foramen supraorbitario y el proceso cigomático lateral. Su porción horizontal forma el **techo de las órbitas** y, entre ellas, la escotadura etmoidal que recibe la lámina cribosa.',
    'En su espesor, sobre la raíz de la nariz, están los **senos frontales**, que se abren en el meato medio. Se une a los parietales por la sutura coronal y, abajo, a los huesos de la cara; en el niño sus dos mitades están separadas por la sutura metópica.',
  ),
  'Parietal bone': d(
    '69–70',
    'Hueso par, cuadrilátero, que forma la mayor parte de la bóveda y las paredes laterales del cráneo. Su cara externa, convexa, tiene en el centro la **eminencia parietal** y la cruzan las líneas temporales superior e inferior; la interna está surcada por las ramas de la **arteria meníngea media** y, junto al borde superior, por el surco del seno sagital superior y las fositas de las granulaciones aracnoideas.',
    'Se articula con el otro parietal (sutura sagital), el frontal (coronal), el occipital (lambdoidea), el temporal y el ala mayor del esfenoides; en su ángulo anteroinferior está el **pterion**.',
  ),
  'Occipital bone': d(
    '70–72',
    'Hueso impar de la parte posterior e inferior del cráneo, perforado por el **foramen magno**, por donde el encéfalo se continúa con la médula. Detrás, la **escama** lleva la protuberancia occipital externa y las líneas nucales, donde se fijan los músculos de la nuca; por dentro, la eminencia cruciforme y los surcos de los senos transversos y sagital.',
    'A los lados del foramen, los **cóndilos occipitales** se articulan con el atlas; por encima de ellos pasa el conducto del nervio hipogloso. Delante, la **porción basilar** (clivus) sube hasta el cuerpo del esfenoides, con el que se suelda en el adulto.',
  ),
  'Temporal bone': d(
    '72–77',
    'Hueso par de la pared lateral y la base del cráneo, que contiene el **órgano del oído**. Tiene una porción **escamosa**, lámina vertical de la que sale el proceso cigomático y debajo la fosa mandibular de la articulación temporomandibular; una porción **timpánica** que rodea el conducto auditivo externo; y una porción **petrosa** (peñasco), pirámide dirigida hacia dentro y delante en la base del cráneo, con el oído medio e interno, el conducto auditivo interno y el conducto carotídeo.',
    'Detrás del conducto auditivo, la porción mastoidea forma el **proceso mastoideo**, lleno de celdillas que comunican con el antro y la caja del tímpano; de la cara inferior del peñasco baja el proceso estiloides. El nervio facial lo cruza por su conducto y sale por el foramen estilomastoideo.',
  ),
  'Sphenoid bone': d(
    '77–80',
    'Hueso impar en el centro de la base del cráneo, como una cuña entre los demás. Su **cuerpo**, cúbico y hueco (senos esfenoidales), lleva arriba la **silla turca** con la fosa hipofisaria; de él salen a cada lado las **alas menores**, que bordean el conducto óptico, las **alas mayores**, que forman parte de la fosa craneal media, de la órbita y de la fosa temporal, y hacia abajo los **procesos pterigoideos**, con sus láminas medial y lateral.',
    'Entre las alas queda la fisura orbitaria superior; el ala mayor está perforada por los forámenes redondo (nervio maxilar), oval (mandibular) y espinoso (arteria meníngea media).',
  ),
  'Ethmoid bone': d(
    '80–83',
    'Hueso impar, ligero y frágil, entre las órbitas y bajo la parte anterior del cráneo. Una lámina horizontal, la **lámina cribosa**, perforada por los filetes del nervio olfatorio, cierra el techo de las cavidades nasales; sobre ella se alza la crista galli, donde se fija la hoz del cerebro, y bajo ella la **lámina perpendicular** forma la parte alta del tabique nasal.',
    'A cada lado cuelgan los **laberintos etmoidales**, llenos de celdillas, cuya cara lateral (lámina orbitaria) forma la pared medial de la órbita y la medial lleva los **cornetes nasales superior y medio**.',
  ),
  Maxilla: d(
    '84–85',
    'Hueso par, el principal de la cara, que con el del otro lado forma la mandíbula superior. Su cuerpo, hueco, contiene el **seno maxilar**, el mayor de los senos paranasales, que se abre en el meato medio; su cara superior forma el suelo de la órbita y lleva el surco y el conducto infraorbitarios, que terminan en el **foramen infraorbitario**.',
    'Tiene cuatro procesos: frontal (sube a la raíz de la nariz), cigomático, **palatino** (forma con el otro los dos tercios anteriores del paladar óseo) y **alveolar**, que aloja los dientes superiores. Por detrás, la tuberosidad del maxilar mira a la fosa pterigopalatina.',
  ),
  'Zygomatic bone': d(
    '85–86',
    'El hueso del **pómulo**, par: forma el relieve de la mejilla y la parte lateral del reborde y del suelo de la órbita. Se articula con el frontal, el maxilar, el ala mayor del esfenoides y, por su proceso temporal, con el proceso cigomático del temporal, con el que forma el **arco cigomático**, donde se inserta el masetero.',
  ),
  'Nasal bone': d(
    '86',
    'Hueso par, pequeño y rectangular, que con el del otro lado forma el **dorso de la nariz**. Se articula arriba con el frontal, lateralmente con el proceso frontal del maxilar, y su borde inferior libre se continúa con los cartílagos de la nariz.',
  ),
  'Palatine bone': d(
    '87–88',
    'Hueso par, en forma de L, en la parte posterior de las cavidades nasales. Su **lámina horizontal** forma el tercio posterior del paladar óseo; su **lámina perpendicular**, la parte posterior de la pared lateral de la cavidad nasal, y llega por su proceso orbitario hasta la órbita. Por la escotadura esfenopalatina comunica la cavidad nasal con la fosa pterigopalatina.',
  ),
  'Lacrimal bone': d(
    '87',
    'El hueso más pequeño de la cara, par, delgado como una uña, en la pared medial de la órbita. Con el proceso frontal del maxilar forma la **fosa del saco lagrimal**, que continúa abajo el conducto nasolagrimal hasta el meato inferior.',
  ),
  'Inferior nasal concha bone': d(
    '89',
    'Lámina ósea par, independiente, enrollada sobre sí misma y fijada a la pared lateral de la cavidad nasal. Bajo ella queda el **meato inferior**, donde se abre el conducto nasolagrimal.',
  ),
  Vomer: d(
    '89–90',
    'Hueso impar, delgado, que forma la parte posterior e inferior del **tabique nasal**. Su borde superior se ensancha en dos alas que abrazan el cuerpo del esfenoides; delante se une a la lámina perpendicular del etmoides y al cartílago del tabique, y su borde posterior libre separa las dos coanas.',
  ),
  Mandible: d(
    '90–92',
    'El único hueso móvil de la cabeza, impar, en herradura. Su **cuerpo** lleva arriba el proceso alveolar con los dientes inferiores y, por fuera, el foramen mentoniano; por dentro, la línea milohioidea, las espinas mentonianas (geniogloso y genihioideo) y la fosa digástrica. A cada lado se eleva la **rama**, donde se insertan masetero y pterigoideo medial, con el **foramen mandibular** en su cara medial, entrada del nervio y los vasos alveolares inferiores.',
    'La rama termina arriba en el **proceso coronoides**, donde se inserta el temporal, y el **cóndilo**, que se articula con el temporal; entre ambos, la escotadura mandibular. El ángulo de la mandíbula es palpable bajo la oreja.',
  ),
  'Hyoid bone': d(
    '113–114',
    'Hueso impar en herradura, en la parte anterior del cuello, por encima de la laringe y a la altura de C3, que **no se articula con ningún otro hueso**: lo suspenden músculos y ligamentos. Tiene un **cuerpo** y, a cada lado, un asta mayor dirigida atrás y un asta menor, a la que llega el ligamento estilohioideo.',
    'En él se insertan los músculos suprahioideos e infrahioideos, la membrana tirohioidea y músculos de la lengua y de la faringe; es la base de la lengua y se mueve con la deglución.',
  ),
}

const ossicles: Record<string, Description> = {
  Malleus: d(
    '431',
    'El **martillo**, el más voluminoso de los huesecillos del oído: su **mango** está incluido en la membrana timpánica y su **cabeza**, en el receso epitimpánico, se articula con el yunque. En su cuello se inserta el músculo tensor del tímpano. Transmite al yunque las vibraciones de la membrana.',
  ),
  Incus: d(
    '431',
    'El **yunque**, huesecillo intermedio del oído medio: su cuerpo se articula con la cabeza del martillo; su rama corta se apoya en la pared posterior de la caja y su rama larga termina en el proceso lenticular, que se articula con el estribo.',
  ),
  Stapes: d(
    '431–432',
    'El **estribo**, el más pequeño y medial de los huesecillos, y el hueso más pequeño del cuerpo: su cabeza se articula con el yunque y su base (platina) cierra la **ventana vestibular** (oval), por donde pasan las vibraciones al oído interno. En él se inserta el músculo estapedio, que amortigua los sonidos intensos.',
  ),
}

const TOOTH =
  'Los dientes permanentes son 32, que brotan de los 6 a los 12 años (los terceros molares, más tarde) y reemplazan a los 20 de leche. Cada diente tiene una **corona**, cubierta de esmalte, que sobresale de la encía; un **cuello**, y una o varias **raíces** implantadas en un alvéolo del proceso alveolar por el ligamento periodontal. Por dentro tiene dentina y una cavidad con la pulpa, a la que llegan vasos y nervios por el ápice de la raíz: alveolares superiores (del maxilar) para los superiores, alveolar inferior para los inferiores.'
const INCISOR = 'Los **incisivos**, cuatro por arcada, tienen una corona en bisel, de borde cortante, y una sola raíz: cortan los alimentos.'
const CANINE = 'El **canino**, uno por hemiarcada, tiene una corona puntiaguda y la raíz más larga de todos los dientes: desgarra.'
const PREMOLAR = 'Los **premolares**, dos por hemiarcada, tienen una corona con dos cúspides (vestibular y lingual) y una raíz, a veces dividida en los superiores: trituran.'
const MOLAR = 'Los **molares**, tres por hemiarcada (el tercero, inconstante, es la muela del juicio), tienen una corona cuboidea con cuatro o cinco cúspides y varias raíces: tres los superiores (dos vestibulares y una palatina), dos los inferiores (mesial y distal). Muelen.'
const tooth = (lead: string, kind: string): Description => ({ text: [lead, kind, TOOTH], sources: [LR2('1163–1167')] })

const teeth: Record<string, Description> = {
  'Upper medial incisor': tooth('Incisivo **central superior** (11 y 21 en la numeración FDI), el más ancho de los incisivos.', INCISOR),
  'Upper lateral incisor': tooth('Incisivo **lateral superior** (12 y 22), más pequeño que el central.', INCISOR),
  'Upper canine': tooth('**Canino superior** (13 y 23; colmillo), cuya raíz larga levanta la eminencia canina del maxilar.', CANINE),
  'Upper first premolar': tooth('**Primer premolar superior** (14 y 24), con frecuencia de dos raíces.', PREMOLAR),
  'Upper second premolar': tooth('**Segundo premolar superior** (15 y 25).', PREMOLAR),
  'Upper first molar tooth': tooth('**Primer molar superior** (16 y 26), el mayor de los dientes superiores y el primer permanente en brotar, hacia los 6 años; sus raíces se acercan al suelo del seno maxilar.', MOLAR),
  'Upper second molar tooth': tooth('**Segundo molar superior** (17 y 27), de los últimos en brotar, hacia los 12 años.', MOLAR),
  'Lower medial incisor': tooth('Incisivo **central inferior** (31 y 41), el más pequeño de los dientes.', INCISOR),
  'Lower lateral incisor': tooth('Incisivo **lateral inferior** (32 y 42), algo mayor que el central.', INCISOR),
  'Lower canine': tooth('**Canino inferior** (33 y 43), más corto que el superior.', CANINE),
  'Lower first premolar': tooth('**Primer premolar inferior** (34 y 44), de cúspide lingual pequeña.', PREMOLAR),
  'Lower second premolar': tooth('**Segundo premolar inferior** (35 y 45). Bajo él se abre el foramen mentoniano.', PREMOLAR),
  'Lower first molar tooth': tooth('**Primer molar inferior** (36 y 46), de cinco cúspides; con el superior, el primer diente permanente, hacia los 6 años.', MOLAR),
  'Lower second molar tooth': tooth('**Segundo molar inferior** (37 y 47), de cuatro cúspides; brota hacia los 12 años.', MOLAR),
}

const cartilages: Record<string, Description> = {
  'Nasal septal cartilage': d2(
    '1028',
    'Lámina cartilaginosa cuadrilátera, impar, que forma la parte anterior del **tabique nasal**: se encaja detrás entre la lámina perpendicular del etmoides y el vómer, y delante sostiene el dorso de la nariz hasta los cartílagos alares.',
  ),
  'Lateral process of nasal septal cartilage': d2(
    '1028',
    'El **cartílago nasal lateral**: lámina triangular que prolonga a cada lado el cartílago del tabique y forma la parte media de la pared lateral de la nariz, por debajo del hueso nasal.',
  ),
  'Major alar cartilage': d2(
    '1028–1029',
    'Cartílago par, doblado en U, que sostiene la **ala de la nariz** y rodea la narina: su pilar lateral forma la ala, su pilar medial, unido al del otro lado, el subtabique, y la curva entre ambos la punta de la nariz.',
  ),
  'Thyroid cartilage': d2(
    '1043–1046',
    'El mayor cartílago de la laringe, impar, que la protege delante como un escudo: dos láminas cuadriláteras que se unen delante en ángulo, saliente en la **prominencia laríngea** (nuez de Adán), más marcada en el hombre. De sus bordes posteriores suben y bajan las astas superiores (hacia el hioides) e inferiores (articuladas con el cricoides).',
    'En la cara interna del ángulo se fijan las cuerdas vocales; por fuera, la línea oblicua recibe los músculos esternotiroideo, tirohioideo y constrictor inferior.',
  ),
  'Cricoid cartilage': d2(
    '1046–1047',
    'Cartílago impar en anillo de sello, base de la laringe, a la altura de C6: un **arco** estrecho delante y una **lámina** alta detrás. Es el único anillo completo de la vía aérea; sobre su lámina se articulan los aritenoides y, a los lados, las astas inferiores del tiroides. Debajo se continúa con la tráquea.',
  ),
  'Arytenoid cartilage': d2(
    '1048',
    'Cartílago par, pequeño, en pirámide triangular, sobre el borde superior de la lámina del cricoides. Su base tiene un **proceso vocal** delante, donde se fija la cuerda vocal, y un **proceso muscular** lateral, donde se insertan los cricoaritenoideos; al girar y deslizarse abre y cierra la glotis.',
  ),
  'Corniculate cartilage': d2(
    '1048–1049',
    'Pequeño nódulo cartilaginoso par (de Santorini) sobre el vértice de cada aritenoides, en el pliegue aritenoepiglótico.',
  ),
}

export const headNeckBones: Record<string, Description> = { ...cranium, ...ossicles, ...teeth, ...cartilages }
