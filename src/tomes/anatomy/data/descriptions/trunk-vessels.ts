import type { Description } from './index'

/**
 * Arteries, veins and lymph nodes of the thoracic wall and the back (vessels viewer), after Latarjet–Ruiz Liard's
 * chapters 81–90 (t. 2), with Rouvière (t. 2) for the thoracic nodes Latarjet–Ruiz only names.
 */

const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })
const ROUV = (p: string) => ({ fuente: 'rouviere-2' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR2(p)] })

const AZYGOS_SYSTEM =
  'El **sistema ácigos** recoge la sangre de la pared del tórax, del dorso y de la columna a ambos lados de las vértebras, y con las venas lumbares ascendentes y los plexos vertebrales forma una larga vía paravertebral entre las dos cavas: si una se obstruye, la sangre vuelve al corazón por ella.'

const arteries: Record<string, Description> = {
  'Aortic arch': d(
    '921–923',
    'La porción curva de la aorta, que sigue a la ascendente detrás del manubrio y se dirige hacia atrás y a la izquierda **por encima de la raíz del pulmón izquierdo** y del bronquio principal, hasta el flanco izquierdo de la columna. De su convexidad nacen el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda, cruzados delante por la vena braquiocefálica izquierda.',
    'El **ligamento arterioso**, resto del conducto arterioso fetal, la une a la arteria pulmonar izquierda; por detrás de él el vago izquierdo da el nervio laríngeo recurrente, que rodea el arco. Más allá de la subclavia puede estrecharse (istmo; coartación de la aorta).',
  ),
  'Brachiocephalic trunk': d(
    '930–931',
    'La primera y mayor rama del arco aórtico, en el mediastino superior: sube oblicua a la derecha delante de la tráquea, cruzada delante por la vena braquiocefálica izquierda, y detrás de la articulación esternoclavicular derecha se divide en **subclavia** y **carótida común derechas**. No suele dar ramas (a veces la tiroidea ima).',
  ),
  'Thoracic aorta': d(
    '848, 923–924',
    'La aorta descendente en el tórax, desde el arco hasta el hiato aórtico del diafragma, delante de T11–T12, en el mediastino posterior: primero a la izquierda de los cuerpos vertebrales, luego delante de ellos. Tiene a la derecha el esófago, el conducto torácico y, más lejos, la vena ácigos; delante el bronquio izquierdo y el pericardio; detrás cruzan las venas hemiácigos.',
    'De su cara posterior nacen las **arterias intercostales posteriores**, que la fijan a la columna; da además ramas bronquiales, esofágicas, mediastínicas, pericárdicas y frénicas superiores.',
  ),
  'Posterior intercostal arteries': d(
    '962–964',
    'Arterias segmentarias de la pared, nacidas por pares de la cara posterior de la aorta torácica para los espacios 3.º a 11.º (las de los dos primeros vienen de la intercostal suprema); las derechas, más largas, cruzan delante de las vértebras detrás del esófago y la ácigos. Al entrar en el espacio dan una **rama dorsal** para los músculos y la piel del dorso, con ramas espinales para la médula.',
    'Luego corren en el **surco costal**, entre la vena arriba y el nervio abajo, entre los intercostales interno e íntimo, y se anastomosan delante con las intercostales anteriores de la torácica interna. En la coartación aórtica se dilatan y erosionan el borde de las costillas.',
  ),
  'Supreme intercostal artery': d(
    '961–962',
    'Rama del **tronco costocervical** de la subclavia, que baja junto al ganglio estrellado, por fuera de la pleura, y da las arterias intercostales posteriores de los dos (a veces tres o cuatro) primeros espacios, donde la aorta no llega.',
  ),
  'First posterior intercostal artery': d(
    '961–962',
    'La arteria del primer espacio intercostal, rama de la **intercostal suprema** (tronco costocervical de la subclavia), no de la aorta. Corre bajo la primera costilla como las demás intercostales y se anastomosa delante con la torácica interna.',
  ),
  'Second posterior intercostal artery': d(
    '961–962',
    'La arteria del segundo espacio intercostal, como la primera rama de la **intercostal suprema**; la tercera es la primera que nace de la aorta.',
  ),
  'Subcostal artery': d(
    '962, 964',
    'La última rama parietal de la aorta torácica, par, homóloga de las intercostales pero situada **bajo la 12.ª costilla**, fuera de todo espacio intercostal. Se distribuye como ellas, en la pared del abdomen.',
  ),
  'Superior phrenic arteries': d(
    '964',
    'Pequeñas ramas de la parte baja de la aorta torácica para la región posterior de la cara superior del diafragma, anastomosadas con las musculofrénicas y las frénicas inferiores.',
  ),
  'Internal thoracic artery': d(
    '957–958',
    'Rama de la cara inferior de la **subclavia**, que entra al tórax detrás del primer cartílago costal y baja paralela al borde del esternón, a unos 15 mm, detrás de los cartílagos y delante del transverso del tórax, con sus venas y los ganglios paraesternales. Da las **intercostales anteriores** de los seis primeros espacios, ramas perforantes (para la mama), mediastínicas, tímicas y la pericardiofrénica, que sigue al nervio frénico.',
    'En el sexto espacio termina en la **musculofrénica** y la **epigástrica superior**, que baja en la vaina del recto al encuentro de la epigástrica inferior: una vía que une la subclavia con la ilíaca externa y que se desarrolla en la coartación aórtica.',
  ),
  'Musculophrenic artery': d(
    '850, 957',
    'Rama terminal lateral de la torácica interna: sigue las inserciones costales del diafragma, al que irriga, y da las arterias intercostales anteriores desde el séptimo espacio.',
  ),
}

const veins: Record<string, Description> = {
  'Superior vena cava': d(
    '989–990',
    'Tronco venoso corto y ancho (6–8 cm, 2 cm de calibre) formado detrás del primer cartílago costal derecho por la unión de las dos **venas braquiocefálicas**; baja a la derecha de la aorta ascendente, pasa delante de la raíz del pulmón derecho y termina en el atrio derecho, sin válvula. Su tercio inferior está dentro del pericardio.',
    'Recoge la sangre de la cabeza, el cuello y los miembros superiores y, por la **vena ácigos**, que llega a su cara posterior, la de la pared torácica. Lateralmente la sigue el nervio frénico derecho.',
  ),
  'Inferior vena cava (thoracic part)': d(
    '998, 1000',
    'El tramo final de la vena cava inferior, de apenas unos centímetros: atraviesa el centro tendinoso del diafragma por su propio foramen, al que se adhiere, junto con el ramo abdominal del frénico derecho, y sube adelante y a la izquierda, rodeada ya por el pericardio, hasta la cara inferior del atrio derecho.',
  ),
  'Internal thoracic veins': d(
    '988',
    'Satélites de la arteria torácica interna, una o dos a cada lado, detrás de los cartílagos costales: reciben las venas intercostales anteriores y terminan en la vena braquiocefálica de su lado. Unidas abajo a las epigástricas, forman una vía entre las dos cavas por la pared anterior.',
  ),
  'Musculophrenic veins': d('850, 988', 'Satélites de la arteria musculofrénica, a lo largo de las inserciones costales del diafragma; terminan en las venas torácicas internas.'),
  'Azygos vein': {
    text: [
      'La gran vena de la pared torácica derecha: nace en el abdomen de la unión de la **lumbar ascendente** y la **subcostal** derechas (a veces también de la cava inferior), entra al tórax por el diafragma y sube a la derecha de los cuerpos vertebrales, detrás del esófago, hasta T4. Allí forma un **arco** sobre la raíz del pulmón derecho y desemboca en la cara posterior de la cava superior.',
      'Recibe las intercostales posteriores derechas, la intercostal superior derecha, las hemiácigos y venas bronquiales, esofágicas, pericárdicas y frénicas superiores. ' + AZYGOS_SYSTEM,
    ],
    sources: [LR2('1004–1007')],
  },
  'Hemi-azygos vein': {
    text: [
      'La vena ácigos menor del lado izquierdo: nace de la lumbar ascendente y la subcostal izquierdas, y a menudo de la vena renal izquierda; atraviesa el pilar izquierdo del diafragma y sube a la izquierda de la columna, recogiendo las últimas intercostales posteriores izquierdas. Hacia T8 cruza la línea media **por detrás de la aorta** y del conducto torácico y termina en la ácigos.',
      AZYGOS_SYSTEM,
    ],
    sources: [LR2('850, 1005–1006')],
  },
  'Accessory hemi-azygos vein': {
    text: [
      'Vena del lado izquierdo de la columna que recoge las intercostales posteriores izquierdas de la parte media (hasta las primeras, cuando no forman tronco aparte), baja delante de las arterias intercostales y cruza detrás de la aorta para terminar en la ácigos o en la hemiácigos. Su disposición es muy variable.',
      AZYGOS_SYSTEM,
    ],
    sources: [LR2('923, 1006')],
  },
  'Right superior intercostal vein': d(
    '1005',
    'Tronco que reúne las venas intercostales posteriores de los tres o cuatro primeros espacios derechos y desemboca en el comienzo del arco de la ácigos.',
  ),
  'Left superior intercostal vein': d(
    '988, 1006',
    'Tronco que reúne las primeras venas intercostales posteriores izquierdas (vena de Braine), cruza la cara izquierda del arco aórtico y desemboca en la **vena braquiocefálica izquierda**.',
  ),
  'Right subcostal vein': d('1004', 'Satélite de la arteria subcostal derecha, bajo la 12.ª costilla; se une a la lumbar ascendente para formar la raíz lateral de la **vena ácigos**.'),
  'Left subcostal vein': d('1005', 'Satélite de la arteria subcostal izquierda, bajo la 12.ª costilla; con la lumbar ascendente forma la raíz lateral de la **vena hemiácigos**.'),
  'Right superior phrenic vein': d('989, 1005', 'Pequeña vena de la cara superior del diafragma derecho que drena en el sistema de la vena ácigos y de la cava superior.'),
  'Right ascending lumbar vein': d(
    '1003–1004, 1007',
    'Vena longitudinal a cada lado de la columna lumbar, entre los planos del psoas, delante de las raíces del plexo lumbar, que une la **vena ilíaca común** con la subcostal y recibe las venas lumbares. Entra al tórax bajo el ligamento arqueado medial y, a la derecha, origina la ácigos: es el primer eslabón de la vía paravertebral entre las cavas.',
  ),
  'Left ascending lumbar vein': d(
    '1003–1005, 1007',
    'Vena longitudinal a cada lado de la columna lumbar, entre los planos del psoas, que une la vena ilíaca común con la subcostal y recibe las venas lumbares. Entra al tórax bajo el ligamento arqueado medial y, a la izquierda, origina la **hemiácigos**.',
  ),
}

const nodes: Record<string, Description> = {
  'Intercostal nodes': {
    text: [
      'Ganglios parietales del extremo posterior de los espacios intercostales, junto a la columna, a lo largo del paquete vasculonervioso. Reciben la linfa de los músculos intercostales, la pared posterolateral del tórax y la pleura parietal; los de los primeros espacios drenan hacia el cuello, los demás en el **conducto torácico**.',
    ],
    sources: [LR2('1015'), ROUV('263')],
  },
  'Parasternal nodes': {
    text: [
      'Cadena de seis a ocho ganglios a lo largo de los **vasos torácicos internos**, del xifoides al primer cartílago. Reciben la linfa de la parte anterior de los espacios intercostales, la piel de la pared anterior, la parte alta de la vaina del recto y sobre todo del **tercio medial de la mama**; drenan en la confluencia yugulosubclavia o en los conductos linfáticos.',
    ],
    sources: [LR2('1016'), ROUV('262')],
  },
  'Superior diaphragmatic nodes': {
    text: [
      'Ganglios sobre la cara torácica del diafragma, alrededor de la base del pericardio: anteriores (retroxifoideos), intermedios (junto a la terminación de los frénicos) y posteriores (detrás de los pilares). Reciben el diafragma, la pleura diafragmática y parte del hígado, y drenan en los paraesternales y en los mediastínicos.',
    ],
    sources: [LR2('1016'), ROUV('262')],
  },
  'Prepericardial nodes': {
    text: [
      'Ganglios frénicos superiores anteriores, delante del pericardio: uno medio detrás del xifoides y dos laterales detrás del extremo anterior de la 7.ª costilla. Reciben linfa del diafragma y de la cara superior del hígado, y la pasan a los paraesternales.',
    ],
    sources: [ROUV('262')],
  },
  'Lateral pericardial nodes': {
    text: [
      'Ganglios frénicos superiores a los lados de la base del pericardio: a la izquierda junto al nervio frénico, a la derecha alrededor de la vena cava inferior. Drenan el diafragma y el pericardio hacia los mediastínicos anteriores, siguiendo a las arterias pericardiofrénicas.',
    ],
    sources: [ROUV('262')],
  },
  'Prevertebral nodes': {
    text: [
      'Ganglios parietales posteriores intercalados en los eferentes de los ganglios intercostales, delante y a los lados de los cuerpos vertebrales, en el plano de las arterias intercostales y del conducto torácico.',
    ],
    sources: [ROUV('263')],
  },
  'Brachiocephalic nodes': {
    text: [
      'Los ganglios **mediastínicos anteriores**, prevasculares, en el mediastino superior: una cadena derecha a lo largo de la cava superior y la braquiocefálica derecha, una izquierda delante del arco aórtico y la carótida común, y una transversal a lo largo de la braquiocefálica izquierda. Reciben la linfa del timo, el pericardio, el corazón, la pleura y el pulmón, y drenan en los confluentes venosos de la base del cuello.',
    ],
    sources: [LR2('1016'), ROUV('263')],
  },
  'Paratracheal thoracic nodes': {
    text: [
      'Ganglios a los lados de la tráquea en el tórax: a la derecha un grupo retrocava por encima del arco de la ácigos; a la izquierda, la cadena del **nervio laríngeo recurrente**. A los derechos llega la mayor parte de la linfa del tórax; drenan en la confluencia yugulosubclavia de su lado.',
    ],
    sources: [LR2('1016'), ROUV('263–265')],
  },
  'Node of arch of azygos vein': {
    text: [
      'El ganglio más bajo y más voluminoso del grupo paratraqueal derecho, en contacto con el **arco de la vena ácigos**; a él converge la mayor parte de la linfa del pulmón derecho y de la parte inferior del izquierdo.',
    ],
    sources: [ROUV('264'), LR2('1015')],
  },
  'Node of ligamentum arteriosum': {
    text: [
      'Ganglio de la fosita subaórtica, entre el arco aórtico y la arteria pulmonar izquierda, junto al **ligamento arterioso** (ganglio de Engel); inicia la cadena prearterial izquierda que sube a lo largo del vago izquierdo.',
    ],
    sources: [LR2('923, 1016')],
  },
  'Superior tracheobronchial nodes': {
    text: [
      'Ganglios en el ángulo entre la tráquea y cada bronquio principal, a uno y otro lado, en el camino de la linfa del pulmón hacia los paratraqueales.',
    ],
    sources: [LR2('1016–1017'), ROUV('264')],
  },
  'Inferior tracheobronchial nodes': {
    text: [
      'El grupo más importante del mediastino: diez a doce ganglios bajo la bifurcación de la tráquea (subcarinales), detrás y encima del pericardio, delante del esófago. Reciben sobre todo la linfa de los pulmones y también del esófago y el corazón, y la pasan a los paratraqueales.',
    ],
    sources: [LR2('1016'), ROUV('264–265')],
  },
  'Juxta-oesophageal nodes': {
    text: [
      'Ganglios mediastínicos posteriores escalonados a lo largo del esófago, entre la cara posterior del pericardio y la columna, la mayoría delante del esófago y otros detrás, junto a la aorta y el conducto torácico. Reciben la linfa del esófago y del diafragma.',
    ],
    sources: [LR2('1017')],
  },
}

export const trunkVessels: Record<string, Description> = { ...arteries, ...veins, ...nodes }
