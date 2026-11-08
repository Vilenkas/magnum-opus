import type { Description } from './index'

/** The brachial plexus and its branches (nervous viewer), after Latarjet–Ruiz Liard's chapter 62. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })

const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })
const withMoore = (p: string, desc: Description): Description => ({ ...desc, sources: [...desc.sources, { fuente: 'moore-8', p }] })

/** The three trunks split behind the clavicle; their divisions make the cords. */
const division = (trunk: string, kind: 'anterior' | 'posterior', into: string): Description =>
  d(
    '601–602',
    `División ${kind} del tronco ${trunk} del plexo braquial. Detrás de la clavícula cada tronco se divide en una rama anterior, para los músculos flexores, y una posterior, para los extensores; esta va ${into}.`,
  )

const nerves: Record<string, Description> = {
  // ---------- The plexus ----------
  'Roots of brachial plexus': d(
    '601–602',
    'Los ramos anteriores de **C5, C6, C7, C8 y T1**, que salen entre los músculos intertransversos y pasan entre los escalenos anterior y medio. C5 y C6 se acodan sobre el surco de las apófisis transversas, donde pueden lesionarse por tracción; C8 y T1 rodean el cuello de la primera costilla, detrás de la cúpula pleural.',
  ),
  'Superior trunk of brachial plexus': {
    text: [
      'Tronco formado por la unión de **C5 y C6**, el más alto de los tres, en el desfiladero de los escalenos por encima de la primera costilla. Da el nervio supraescapular y el del subclavio. Un tirón que separa el hombro del cuello lo daña: la parálisis de **Erb-Duchenne**, de los músculos del hombro y del brazo.',
    ],
    sources: [LR('601–602'), { fuente: 'moore-8' as const, p: '200' }],
  },
  'Middle trunk of brachial plexus': d('601–602', 'Tronco formado sólo por el ramo anterior de **C7**, entre el superior y el inferior, detrás del escaleno anterior.'),
  'Inferior trunk of brachial plexus': {
    text: [
      'Tronco formado por **C8 y T1** (que recibe un ramo de T2), apoyado en la primera costilla detrás de la arteria subclavia. Una tracción del brazo hacia arriba lo lesiona: la parálisis de **Klumpke**, mucho menos frecuente, de los músculos cortos de la mano.',
    ],
    sources: [LR('601–602'), { fuente: 'moore-8' as const, p: '200' }],
  },
  'Anterior division of superior trunk of brachial plexus': division('superior', 'anterior', 'con la del medio al fascículo lateral'),
  'Anterior division of middle trunk of brachial plexus': division('medio', 'anterior', 'con la del superior al fascículo lateral'),
  'Anterior division of inferior trunk of brachial plexus': division('inferior', 'anterior', 'sola a formar el fascículo medial'),
  'Posterior division of superior trunk of brachial plexus': division('superior', 'posterior', 'con las de los otros dos troncos al fascículo posterior'),
  'Posterior division of middle trunk of brachial plexus': division('medio', 'posterior', 'con las de los otros dos troncos al fascículo posterior'),
  'Posterior division of inferior trunk of brachial plexus': division('inferior', 'posterior', 'con las de los otros dos troncos al fascículo posterior'),
  'Posterior cord of brachial plexus': d(
    '601–603',
    'Fascículo formado por las tres divisiones posteriores, con fibras de todas las raíces, que en la axila queda siempre **detrás de la arteria axilar**. Da los nervios subescapulares y el toracodorsal, y termina en el **axilar** y el **radial**: los nervios de la cara posterior, extensora, del miembro.',
  ),

  // ---------- Collateral branches ----------
  'Subclavian nerve': d('605', 'Nervio muy delgado del tronco superior (C5–C6) que pasa por delante del plexo hasta el músculo subclavio; a menudo da un ramo al nervio frénico.'),
  'Lateral pectoral nerve': d(
    '605',
    'Nace del fascículo lateral o del tronco superior, pasa por delante de la arteria axilar y atraviesa la fascia clavipectoral con la toracoacromial hasta la cara profunda del **pectoral mayor**. Se une al medial por delante de la arteria: el asa de los pectorales.',
  ),
  'Medial pectoral nerve': d(
    '605',
    'Nace del fascículo medial, pasa entre la arteria y la vena axilares y, por el asa de los pectorales, inerva el **pectoral menor**, que atraviesa, y la parte inferior del mayor.',
  ),
  'Suprascapular nerve': d(
    '605',
    'Nace de C5 (tronco superior) encima de la clavícula, baja bajo el omohioideo y el trapecio y pasa **por debajo** del ligamento transverso superior de la escápula a la fosa supraespinosa; rodea la espina hasta la infraespinosa. Inerva el **supraespinoso** y el **infraespinoso** y da ramos al hombro.',
  ),
  'Dorsal scapular nerve': d('605', 'Nervio de C5 que rodea el escaleno posterior y baja por la cara profunda del **elevador de la escápula** y los **romboides**, a los que inerva, junto a la arteria dorsal de la escápula.'),
  'Superior subscapular nerve': d('605', 'Ramo delgado del fascículo posterior para la parte superior del músculo **subescapular**.'),
  'Inferior subscapular nerve': d('605', 'Ramo del fascículo posterior que baja por la cara anterior del subescapular, inerva sus fascículos medio e inferior y termina en el **redondo mayor**.'),
  'Thoracodorsal nerve': d(
    '606',
    'Ramo del fascículo posterior (C6–C8) que baja por la cara anterior del subescapular, cruza la arteria subescapular y entra en el **dorsal ancho** por su cara anteromedial; un ramo llega al redondo mayor.',
  ),
  'Long thoracic nerve': d(
    '606',
    'Nervio del **serrato anterior**, de C5, C6 y a veces C7. Baja por delante del escaleno medio y por la cara lateral del tórax, sobre el músculo, al que da un ramo por cada digitación. Su lesión despega el borde medial de la escápula (escápula alada).',
  ),
  'Medial brachial cutaneous nerve': d('606', 'Nervio sensitivo delgado del fascículo medial (fibras de T1) que cruza por delante la vena axilar y da la piel de la cara medial del brazo; se comunica con el intercostobraquial.'),

  // ---------- Musculocutaneous ----------
  'Musculocutaneous nerve': d(
    '607–608',
    'Ramo terminal del fascículo lateral (C5–C7). Atraviesa el **coracobraquial** (nervio perforante de Casserius) y baja entre el bíceps y el braquial, a los que inerva con el coracobraquial: es el nervio de los flexores del brazo.',
    'Por encima del codo atraviesa la fascia y sigue, sensitivo, como nervio cutáneo antebraquial lateral.',
  ),
  'Lateral antebrachial cutaneous nerve': d(
    '607–608',
    'La terminación sensitiva del musculocutáneo: se hace superficial por fuera del tendón del bíceps, detrás de la vena cefálica, y da la piel del lado lateral del antebrazo, por delante y por detrás, hasta la raíz del pulgar.',
  ),

  // ---------- Median ----------
  'Median nerve': d(
    '608–613',
    'Nace de dos raíces, lateral y medial, que abrazan la arteria axilar (la horquilla del mediano), con fibras de todas las raíces. Baja con la arteria braquial, que cruza por delante; en el codo pasa entre las cabezas del **pronador redondo** y bajo el arco del flexor superficial, recorre el eje del antebrazo y entra en la palma por el **túnel carpiano**.',
    'Inerva casi todos los flexores y pronadores del antebrazo, los músculos de la eminencia tenar y los dos lumbricales laterales, y la piel de la palma de los tres dedos y medio laterales. En el túnel carpiano está más expuesto: comprimido o cortado, se pierde la pinza y la oposición del pulgar.',
  ),
  'Anterior interosseous nerve of forearm': d(
    '610',
    'Rama profunda del mediano que baja sobre la membrana interósea con la arteria interósea anterior, entre el flexor largo del pulgar y el flexor profundo, a los que inerva (la parte de este para el índice y el medio), y termina en el **pronador cuadrado** y la muñeca.',
  ),
  'Muscular branches of median nerve': d(
    '610, 612',
    'Ramos del mediano para el pronador redondo, el flexor radial del carpo, el palmar largo y el flexor superficial en el antebrazo; en la palma, el ramo tenar (recurrente) para el abductor corto, el oponente y la cabeza superficial del flexor corto del pulgar, y ramos para los lumbricales 1.º y 2.º.',
  ),
  'Palmar branch of median nerve': {
    sources: [LR('610'), { fuente: 'moore-8' as const, p: '253' }],
    text: [
    'Ramo cutáneo que deja el mediano encima del carpo y pasa **por delante** del retináculo flexor para dar la piel de la eminencia tenar y del centro de la palma: por eso esa piel no se adormece cuando el nervio se comprime dentro del túnel.',
    ],
  },
  'Common palmar digital branches of median nerve': d('612', 'Ramos terminales del mediano en la palma, bajo la aponeurosis palmar, que se dividen en la raíz de los dedos en los digitales propios del pulgar, el índice, el medio y la mitad lateral del anular.'),
  'Proper palmar digital branches of median nerve': d(
    '612–613',
    'Nervios colaterales palmares de los tres dedos y medio laterales, con su arteria por fuera de la vaina de los flexores. Cada uno envía un ramo al dorso de las falanges media y distal, que también son territorio del mediano.',
  ),
  '(Communicating branch of median nerve with ulnar nerve)': d(
    '612, 619',
    'Ramo comunicante en la palma entre el último digital del mediano y el ramo superficial del cubital, en el tercer espacio; estas comunicaciones explican las variantes en la inervación de la mano.',
  ),

  // ---------- Ulnar ----------
  'Ulnar nerve': d(
    '613–620',
    'Nervio del fascículo medial (C7–T1). Baja por la cara medial del brazo detrás del tabique intermuscular, pasa **detrás del epicóndilo medial**, superficial (el «hueso de la risa»), entra en el antebrazo entre las cabezas del flexor cubital del carpo y baja junto a él con la arteria cubital. En la muñeca pasa por delante del retináculo flexor, en el conducto de Guyon.',
    'Inerva el flexor cubital del carpo, la mitad medial del flexor profundo y casi todos los músculos cortos de la mano. Su parálisis da la **mano en garra** del anular y el meñique, con la eminencia hipotenar y los espacios interóseos hundidos.',
  ),
  'Muscular branches of ulnar nerve': d(
    '615–616',
    'En el antebrazo, ramos para el flexor cubital del carpo y para los fascículos mediales del flexor profundo; en la mano, por su ramo profundo, para los hipotenares, los interóseos, los lumbricales 3.º y 4.º, el aductor del pulgar y la cabeza profunda del flexor corto.',
  ),
  'Dorsal branch of ulnar nerve': d('615', 'Ramo sensitivo que deja el cubital tres o cuatro traveses de dedo sobre el pisiforme, rodea el cúbito por debajo del flexor cubital del carpo y da la piel del lado medial del dorso de la mano y de los dedos.'),
  'Palmar branch of ulnar nerve': d('615', 'Pequeño ramo cutáneo del cubital para la piel de la eminencia hipotenar.'),
  'Superficial branch of ulnar nerve': d('616', 'Ramo terminal sensitivo del cubital, que baja con la arteria cubital por la eminencia hipotenar, inerva el palmar corto y da los nervios digitales del meñique y de la mitad medial del anular.'),
  'Deep branch of ulnar nerve': d(
    '616',
    'Ramo terminal motor del cubital: entre el abductor y el flexor del meñique, rodea el gancho del ganchoso y cruza la palma con el **arco palmar profundo** hasta el aductor del pulgar, inervando a su paso los hipotenares, los interóseos y los dos lumbricales mediales.',
  ),
  'Common palmar digital branches of ulnar nerve': d('616', 'Ramos del ramo superficial del cubital que se dividen en los digitales propios del meñique y del lado medial del anular.'),
  'Proper palmar digital branches of ulnar nerve': d('616, 628', 'Nervios colaterales palmares del meñique y de la mitad medial del anular, el territorio palmar del cubital.'),
  'Dorsal digital branches of ulnar nerve': d('615, 628', 'Nervios del dorso del meñique, del anular y, en parte, del dedo medio, salidos del ramo dorsal del cubital.'),

  // ---------- Medial antebrachial cutaneous ----------
  'Medial antebrachial cutaneous nerve': d(
    '620–621',
    'Nervio sólo sensitivo del fascículo medial (C8–T1). Baja por dentro de la arteria braquial, se hace superficial con la **vena basílica** y da la piel de la cara medial del antebrazo, por delante y por detrás, hasta el carpo.',
  ),
  'Anterior branch of medial antebrachial cutaneous nerve': d('620–621', 'El mayor de los dos ramos del cutáneo antebraquial medial: pasa por delante y por detrás de las venas del codo y da la piel de la región anteromedial del antebrazo.'),
  'Posterior branch of medial antebrachial cutaneous nerve': d('620', 'Ramo del cutáneo antebraquial medial para la piel de la región posteromedial del antebrazo, del codo al carpo.'),

  // ---------- Axillary ----------
  'Axillary nerve': d(
    '621–623',
    'Ramo del fascículo posterior (C5–C6), el nervio del **deltoides**. Rodea el borde inferior del subescapular y, con la arteria circunfleja humeral posterior, cruza el **espacio axilar lateral** pegado a la cápsula del hombro; rodea por detrás el cuello quirúrgico del húmero.',
    'Por esa posición se lesiona en las luxaciones del hombro y las fracturas del cuello quirúrgico: se pierde la abducción y se adormece la piel del muñón del hombro, lo que orienta el diagnóstico.',
  ),
  'Muscular branches of axillary nerve': d('623', 'Ramos del axilar en abanico para el deltoides, que entran por su cara profunda, y el nervio del redondo menor, que se separa al cruzar el espacio axilar lateral.'),
  'Superior lateral brachial cutaneous nerve': d('623', 'Ramo cutáneo del axilar que rodea el borde posterior del deltoides y da la piel del hombro y de la cara lateral del brazo.'),

  // ---------- Radial ----------
  'Radial nerve': withMoore('155', d(
    '623–627',
    'Continuación del fascículo posterior (C5–C8), el nervio más grueso del plexo. Con la braquial profunda pasa por el espacio axilar inferior y rodea por detrás el húmero en el **surco del nervio radial**, pegado al hueso entre las cabezas del tríceps; atraviesa el tabique lateral y, en el surco bicipital lateral, se divide en un ramo superficial sensitivo y uno profundo motor.',
    'Es el nervio **extensor**: inerva el tríceps, el ancóneo, el braquiorradial y todos los extensores y supinadores. Su parálisis, frecuente en las fracturas de la diáfisis humeral, deja la mano caída sin poder extender la muñeca ni los dedos.',
  )),
  'Muscular branches of radial nerve': d('624–625', 'Ramos del radial en el brazo: para las tres cabezas del tríceps y el ancóneo, y en el surco bicipital lateral para el braquiorradial, el extensor radial largo del carpo y parte del braquial.'),
  'Deep branch of radial nerve': d(
    '625–626',
    'Ramo motor del radial: entra entre los dos planos del **supinador**, rodea el cuello del radio y sale por detrás para inervar todos los extensores del antebrazo. Se continúa como nervio interóseo posterior.',
  ),
  'Posterior interosseous nerve of forearm': d('626', 'La continuación del ramo profundo del radial sobre la cara posterior de la membrana interósea, hasta el dorso del carpo, adonde lleva fibras sensitivas profundas; inerva a su paso los extensores del plano profundo.'),
  'Superficial branch of radial nerve': d(
    '625',
    'Ramo sensitivo del radial: baja bajo el braquiorradial junto a la arteria radial y, en el tercio inferior del antebrazo, pasa al dorso para dar la piel del dorso de la mano, del pulgar y de la falange proximal del índice y el medio.',
  ),
  'Dorsal digital branches of radial nerve': d('625, 628', 'Nervios del dorso del pulgar, del índice y de la mitad lateral del medio, hasta la falange proximal (las otras falanges son del mediano).'),
  'Posterior antebrachial cutaneous nerve': d('624, 627', 'Ramo cutáneo del radial, nacido en el brazo, que da la piel de la cara posterior del antebrazo.'),
  'Inferior lateral brachial cutaneous nerve': d('624', 'Ramo cutáneo del radial, de la parte baja del surco del nervio radial, que atraviesa el tríceps y la fascia hasta la piel de la cara posterolateral del brazo.'),
}

export const upperLimbNerves = nerves
