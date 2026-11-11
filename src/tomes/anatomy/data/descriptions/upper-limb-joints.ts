import type { Description } from './index'

/**
 * The joints of the upper limb and their pieces (arthrology viewer). Whole joints are keyed by
 * their TA group, as `joint-index.ts` names them; pieces by their own TA name. After Latarjet–Ruiz
 * Liard's chapters 55–58, with Moore for the clinic.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })

const joints: Record<string, Description> = {
  // ---------- Sternoclavicular ----------
  'Sternoclavicular joint': {
    text: [
      'Une la clavícula al manubrio del esternón y al primer cartílago costal: es la única unión ósea del miembro superior con el tronco. Es una articulación sinovial **en silla de montar**, de superficies poco concordantes, por lo que un **disco articular** se interpone entre ellas y divide la cavidad en dos.',
      'La cápsula es delgada y laxa; el verdadero medio de unión es el **ligamento costoclavicular**, a distancia, sobre el que gira la clavícula: cuando su extremo medial baja, el lateral sube. Movimientos pequeños y un ligamento muy fuerte explican que rara vez se luxe; el golpe en el hombro suele romper antes la clavícula.',
    ],
    sources: [LR('471–472'), MOORE('282')],
  },
  'Articular capsule of sternoclavicular joint': {
    text: ['Manguito fibroso delgado y laxo, insertado alrededor de las superficies articulares de la clavícula, el manubrio y el primer cartílago costal, y reforzado delante y detrás por los ligamentos esternoclaviculares.'],
    sources: [LR('471')],
  },
  'Articular disc of sternoclavicular joint': {
    text: ['Lente fibrocartilaginosa, más gruesa en la periferia que en el centro, que a veces está perforado. Se fija arriba a la clavícula y abajo al primer cartílago costal, corrige la falta de concordancia de las superficies y divide la articulación en dos cavidades sinoviales, clavicular y esternal.'],
    sources: [LR('471–472')],
  },
  'Anterior sternoclavicular ligament': {
    text: ['Refuerzo anterior de la cápsula, de la parte anterosuperior de la clavícula al manubrio y al primer cartílago costal. Tiene poca importancia mecánica.'],
    sources: [LR('471')],
  },
  'Posterior sternoclavicular ligament': {
    text: ['Refuerzo posterior de la cápsula, de la cara posterosuperior de la clavícula al manubrio. Detrás de él, con los músculos esternohioideo y esternotiroideo, quedan el confluente venoso yugulosubclavio, el tronco braquiocefálico a la derecha y la carótida común a la izquierda.'],
    sources: [LR('471–472')],
  },
  'Interclavicular ligament': {
    text: ['Fibras que pasan por encima de la escotadura yugular de una clavícula a la otra; las más cortas acaban en el borde del manubrio.'],
    sources: [LR('471')],
  },
  'Costoclavicular ligament': {
    text: [
      'El **verdadero ligamento** de la esternoclavicular, aunque está por fuera de ella: romboidal, sube oblicuo desde el primer cartílago costal (y a menudo la primera costilla) hasta la cara inferior de la clavícula, donde deja una impresión rugosa. Tiene dos planos, el anterior continuando la vaina del subclavio. Es el eje de los movimientos de la clavícula.',
    ],
    sources: [LR('471–472'), LR('455')],
  },

  // ---------- Acromioclavicular ----------
  'Acromioclavicular joint': {
    text: [
      'Articulación sinovial **plana** entre el extremo lateral de la clavícula y el borde medial del acromion; la clavícula se apoya sobre el acromion. Tiene un disco, casi siempre incompleto, en un tercio de los casos. Su cápsula, gruesa, está reforzada arriba y abajo por los ligamentos acromioclaviculares.',
      'Pero la unión entre clavícula y escápula la aseguran sobre todo los ligamentos **coracoclaviculares**, conoide y trapezoide, a distancia. Cuando un esfuerzo los rompe se produce la luxación acromioclavicular, frecuente en deportes de choque como el rugby.',
    ],
    sources: [LR('472–473')],
  },
  'Articular capsule of acromioclavicular joint': {
    text: ['Cápsula muy gruesa insertada alrededor de las dos pequeñas superficies, tapizadas de fibrocartílago. Su cara superior es subcutánea; sobre ella se insertan el trapecio por dentro y el deltoides por fuera.'],
    sources: [LR('472–473')],
  },
  'Acromioclavicular ligament': {
    text: ['Refuerzo de la cápsula acromioclavicular. Hay uno superior, potente, y otro inferior, delgado, tendidos entre la clavícula y el acromion.'],
    sources: [LR('472')],
  },
  'Articular disc of acromioclavicular joint': {
    text: ['Disco fibrocartilaginoso que sólo existe en un tercio de los casos y casi siempre es incompleto, por lo que tabica la sinovial en parte.'],
    sources: [LR('472–473')],
  },
  'Conoid ligament': {
    text: ['Ligamento coracoclavicular posterior y medial: triangular, nace por su vértice en la base del proceso coracoides, detrás del trapezoide, y se abre en abanico hasta el **tubérculo conoideo** de la clavícula. Con el trapezoide mantiene el ángulo entre clavícula y escápula.'],
    sources: [LR('472')],
  },
  'Trapezoid ligament': {
    text: ['Ligamento coracoclavicular anterior y lateral: de la mitad posterior del borde medial del coracoides sube oblicuo hasta la **línea trapezoidea** de la clavícula. Su rotura, con la del conoide, deja que la clavícula suba sobre el acromion.'],
    sources: [LR('472–473')],
  },

  // ---------- Scapula ----------
  'Fibrous joints of pectoral girdle': {
    text: ['Los **ligamentos propios de la escápula**: cintas fibrosas tendidas de una parte a otra del mismo hueso, el coracoacromial y los transversos superior e inferior. No unen huesos distintos, pero cierran una bóveda y dos pasos osteofibrosos para los vasos y el nervio supraescapulares.'],
    sources: [LR('473')],
  },
  'Coraco-acromial ligament': {
    text: [
      'Cinta triangular del vértice del acromion al borde lateral del proceso coracoides. Con esas dos salientes forma la **bóveda acromiocoracoidea** sobre la articulación del hombro; entre ella y el tendón del supraespinoso se interpone la bolsa subacromial.',
    ],
    sources: [LR('473, 478')],
  },
  'Superior transverse scapular ligament': {
    text: ['Pequeña cinta que cierra la escotadura de la escápula y la convierte en un agujero: la **arteria supraescapular** pasa por encima del ligamento, la vena y el **nervio supraescapular** por debajo.'],
    sources: [LR('473')],
  },
  'Inferior transverse scapular ligament': {
    text: ['Ligamento espinoglenoideo: del borde lateral de la espina de la escápula al borde posterior de la cavidad glenoidea. Cierra el paso entre las fosas supraespinosa e infraespinosa por donde bajan el nervio y los vasos supraescapulares.'],
    sources: [LR('473')],
  },

  // ---------- Shoulder ----------
  'Glenohumeral joint': {
    text: [
      'La articulación del hombro: sinovial **esferoidea** entre la cabeza del húmero y la cavidad glenoidea, agrandada por el labro. La cabeza excede la cavidad en todos los sentidos, de modo que el contacto es siempre pequeño, y la cápsula es tan laxa que deja separar las superficies unos 2 cm. Toda su anatomía sirve a la movilidad.',
      'Su firmeza la ponen los músculos más que los ligamentos: el **manguito de los rotadores** (subescapular, supraespinoso, infraespinoso y redondo menor) se funde con la cápsula. Por eso es la articulación que más se luxa, casi siempre hacia delante y abajo, con tendencia a repetirse; el nervio axilar, pegado a la parte baja de la cápsula, puede lesionarse.',
    ],
    sources: [LR('473–479'), MOORE('284')],
  },
  'Articular capsule of glenohumeral joint': {
    text: [
      'Se inserta en el contorno de la cavidad glenoidea y en el labro; arriba cubre el origen de la porción larga del bíceps, que queda dentro de la articulación, y en el húmero sigue el cuello anatómico salvo abajo y por dentro, donde baja más, lo que favorece la abducción. Es delgada y laxa; sus refuerzos anteriores son los ligamentos glenohumerales y el coracohumeral.',
      'Entre los ligamentos glenohumerales superior y medio queda su punto más débil, el **foramen oval** de Weitbrecht, por donde la sinovial comunica con la bolsa del subescapular.',
    ],
    sources: [LR('475–476')],
  },
  'Glenoid labrum': {
    text: ['Anillo fibrocartilaginoso, triangular en un corte, fijado al borde de la cavidad glenoidea, salvo arriba, donde lo separa un surco. Agranda y profundiza la cavidad, y en su cara externa se fija la mayor parte de la cápsula. Sus desgarros se asocian a la inestabilidad del hombro.'],
    sources: [LR('474'), MOORE('284')],
  },
  'Coracohumeral ligament': {
    text: ['Lámina ancha y fuerte de la base y el borde lateral del coracoides a los dos tubérculos del húmero, fundida con la parte superior de la cápsula. Con el supraespinoso sostiene el húmero cuando el brazo cuelga; se considera el resto de un fascículo humeral del pectoral menor.'],
    sources: [LR('475')],
  },
  'Superior glenohumeral ligament': {
    text: ['El superior de los tres refuerzos anteriores de la cápsula descritos por Farabeuf: del labro, junto al tubérculo supraglenoideo, al cuello anatómico, entre la cabeza y el tubérculo menor.'],
    sources: [LR('475')],
  },
  'Middle glenohumeral ligament': {
    text: ['Refuerzo anterior medio de la cápsula: del labro, a la altura del superior o algo por debajo, al tubérculo menor, donde se confunde con el tendón del subescapular. Encima de él queda el foramen oval.'],
    sources: [LR('475')],
  },
  'Inferior glenohumeral ligament': {
    text: ['El más largo, ancho y fuerte de los ligamentos glenohumerales: de toda la parte anterior del labro por debajo del coracoides a la parte anteroinferior del cuello quirúrgico. Aun así, ninguno de ellos basta para impedir la luxación anterior.'],
    sources: [LR('475–476')],
  },
  'Transverse humeral ligament': {
    text: ['Fibras transversales que pasan como un puente sobre el **surco intertubercular**, del tubérculo mayor al menor, y mantienen en él el tendón de la porción larga del bíceps.'],
    sources: [LR('475')],
  },

  // ---------- Elbow ----------
  'Elbow joint': {
    text: [
      'Une el húmero a los dos huesos del antebrazo en una sola cápsula: la **humerocubital** (tróclea con la escotadura troclear, un gínglimo que sólo flexiona y extiende), la **humerorradial** (capítulo con la fosita del radio) y la **radiocubital proximal**. Las fosas coronoidea, radial y olecraniana reciben los salientes de los huesos al final de cada movimiento.',
      'La cápsula es delgada delante y detrás y fuerte a los lados por los ligamentos colaterales: deja la flexión y se opone a la lateralidad. En extensión, los epicóndilos y el olécranon están en una línea; en flexión, forman un triángulo, lo que distingue una luxación de una fractura. Todos los nervios y vasos del miembro pasan junto a ella.',
    ],
    sources: [LR('501–506')],
  },
  'Articular capsule of elbow joint': {
    text: ['Manguito fibroso insertado en el húmero por encima de sus tres fosas, en el cúbito alrededor de las escotaduras troclear y radial y en el cuello del radio. Envuelve a la vez el codo y la radiocubital proximal, con una sola sinovial. Es delgada y laxa, más delante y detrás; la refuerzan los ligamentos anterior, posterior y colaterales.'],
    sources: [LR('502–503')],
  },
  'Radial collateral ligament': {
    text: ['Ligamento lateral del codo, confundido con el origen de los músculos epicondíleos laterales. Del epicóndilo lateral baja en tres fascículos: el anterior y el medio rodean la cabeza del radio por delante y por detrás, mezclándose con el ligamento anular, y el posterior va al olécranon, bajo el ancóneo.'],
    sources: [LR('503')],
  },
  'Ulnar collateral ligament': {
    text: ['Ligamento medial del codo, grueso, que se abre en abanico del epicóndilo medial al cúbito en tres fascículos: anterior y medio al proceso coronoides, posterior al olécranon (Bardinet). Fibras arqueadas (Cooper) unen sus inserciones en el cúbito. Detrás de él pasa el nervio cubital.'],
    sources: [LR('503, 505')],
  },
  'Annular ligament of radius': {
    text: [
      'Anillo fibroso de 1 cm de alto, fijado en los bordes anterior y posterior de la escotadura radial del cúbito, que rodea la **cabeza del radio** sin insertarse en ella; su cara interna está tapizada de fibrocartílago. Con la escotadura forma el anillo en el que gira el radio.',
      'En los niños pequeños, un tirón de la mano puede sacar la cabeza del radio parcialmente del anillo (subluxación de la cabeza del radio).',
    ],
    sources: [LR('517'), MOORE('287')],
  },
  'Quadrate ligament': {
    text: ['Ligamento de Denucé: lámina cuadrilátera de 1 cm de lado, tendida horizontalmente del borde inferior de la escotadura radial del cúbito al cuello del radio, bajo la cápsula. Limita la pronosupinación.'],
    sources: [LR('517')],
  },

  // ---------- Forearm ----------
  'Radio-ulnar syndesmoses': {
    text: [
      'La **membrana interósea** del antebrazo, tendida del borde interóseo del radio al del cúbito, y la cuerda oblicua. Sus fibras bajan oblicuas del radio al cúbito; empieza bajo la tuberosidad del radio, donde la cruza por encima la arteria interósea posterior, y llega a la radiocubital distal. Separa los compartimentos anterior y posterior del antebrazo y da origen a sus músculos profundos.',
    ],
    sources: [LR('519')],
  },
  'Interosseous membrane of forearm': {
    text: ['Membrana delgada del borde interóseo del radio al del cúbito, de fibras oblicuas hacia abajo y hacia dentro, más gruesa en sus tres cuartos superiores, donde se inserta el flexor profundo de los dedos. Divide el antebrazo en sus regiones anterior y posterior.'],
    sources: [LR('519')],
  },
  'Oblique cord': {
    text: ['Cuerda oblicua de Weitbrecht: cinta fibrosa, a veces doble, de la base del proceso coronoides a la cara anterior del radio bajo su tuberosidad, por encima del borde superior de la membrana interósea.'],
    sources: [LR('519')],
  },
  'Distal radio-ulnar joint': {
    text: [
      'Trocoide como la proximal, pero invertida: la superficie cóncava es la escotadura cubital del radio y la convexa la **cabeza del cúbito**. En la pronosupinación es el radio el que gira alrededor de esa cabeza.',
      'Su pieza esencial es el **disco articular** (ligamento triangular), que la separa del carpo; los ligamentos radiocubitales palmar y dorsal, mal diferenciados, refuerzan la cápsula. Su interlínea se palpa por detrás, medial a los tendones extensores del meñique.',
    ],
    sources: [LR('518–519')],
  },
  'Articular disc of distal radio-ulnar joint': {
    text: ['El **ligamento triangular**: lámina fibrosa cubierta de cartílago en sus dos caras, con la base en el borde inferior de la escotadura cubital del radio y el vértice en la fosita entre la cabeza del cúbito y su proceso estiloides. Encima se mueve la cabeza del cúbito; debajo se apoyan el semilunar y el piramidal. Adelgazado en el centro, a veces perforado, deja entonces comunicar la radiocubital distal con la radiocarpiana.'],
    sources: [LR('519, 528')],
  },
  'Palmar radio-ulnar ligament': {
    text: ['Refuerzo anterior, mal diferenciado, de la cápsula de la radiocubital distal: fibras del extremo anterior de la escotadura cubital del radio a la cabeza del cúbito.'],
    sources: [LR('519')],
  },
  'Dorsal radio-ulnar ligament': {
    text: ['Refuerzo posterior de la cápsula de la radiocubital distal, tendido transversalmente del borde posterior de la escotadura cubital del radio a la cabeza del cúbito y su proceso estiloides.'],
    sources: [LR('519')],
  },

  // ---------- Wrist ----------
  'Radiocarpal joint': {
    text: [
      'La articulación de la muñeca: sinovial **elipsoidea** entre una cavidad formada por el radio y el disco articular y un **cóndilo carpiano** formado por el escafoides, el semilunar y el piramidal. El cúbito no participa directamente: lo separa el disco.',
      'Es superficial por detrás, bajo los tendones extensores, y profunda por delante, donde se relaciona con el **túnel carpiano**. El proceso estiloides del radio baja más que el del cúbito; en las fracturas del extremo inferior del radio quedan al mismo nivel.',
    ],
    sources: [LR('526–529')],
  },
  'Articular capsule of radiocarpal joint': {
    text: ['Membrana fibrosa insertada justo alrededor de las superficies: los bordes de la superficie del radio y del disco articular arriba, el contorno del escafoides, el semilunar y el piramidal abajo. Por las zonas débiles de su cara dorsal salen los quistes sinoviales de la muñeca.'],
    sources: [LR('527, 529')],
  },
  'Dorsal radiocarpal ligament': {
    text: ['Ligamento posterior de la muñeca, menos grueso que los palmares: del borde posterior del radio, oblicuo hacia abajo y adentro, a la cara dorsal del piramidal, con algunas fibras al semilunar.'],
    sources: [LR('527')],
  },
  'Radioscaphocapitate ligament': {
    text: ['Fascículo lateral del ligamento radiocarpiano palmar: del proceso estiloides del radio cruza delante del escafoides hasta la cara anterior del hueso grande.'],
    sources: [LR('527')],
  },
  'Radiocapitate ligament': {
    text: ['Parte del ligamento radiocarpiano palmar que va del borde anterior del radio al hueso grande, convergiendo con los fascículos cubitocarpianos.'],
    sources: [LR('527')],
  },
  'Ulnolunate ligament': {
    text: ['Fascículo del ligamento cubitocarpiano palmar que baja, oblicuo hacia fuera, desde la región de la cabeza y el estiloides del cúbito y el disco hasta la cara anterior del semilunar.'],
    sources: [LR('527')],
  },
  'Ulnotriquetral ligament': {
    text: ['Fascículo del ligamento cubitocarpiano palmar que va desde el cúbito y el disco articular a la cara anterior del piramidal.'],
    sources: [LR('527')],
  },
  'Ulnocapitate ligament': {
    text: ['El fascículo más largo del ligamento cubitocarpiano palmar: del cúbito, entre su cabeza y su proceso estiloides, al hueso grande, donde converge con el radiocarpiano palmar.'],
    sources: [LR('527')],
  },
  'Ulnopisiform ligament': {
    text: ['Fascículo anterior del ligamento colateral cubital de la muñeca: del proceso estiloides del cúbito al pisiforme.'],
    sources: [LR('527, 529')],
  },
  'Ulnar collateral ligament of wrist joint': {
    text: ['Ligamento potente y elástico que nace en el vértice del proceso estiloides del cúbito y se abre hacia abajo en dos fascículos: al pisiforme y a la cara dorsal del piramidal. Hace relieve bajo la piel con la mano inclinada hacia el radio.'],
    sources: [LR('527, 529')],
  },
  'Radial collateral ligament of wrist joint': {
    text: ['Ligamento sólido y elástico del vértice del proceso estiloides del radio a la cara anterolateral del escafoides. Por fuera de él queda la tabaquera anatómica, con la arteria radial.'],
    sources: [LR('527, 529')],
  },

  // ---------- Carpus ----------
  'Intercarpal joints': {
    text: [
      'Las uniones de los huesos del carpo dentro de cada fila: en la primera, del escafoides con el semilunar y de éste con el piramidal; en la segunda, del trapecio con el trapezoide, de éste con el grande y del grande con el ganchoso. Son **planas**, de superficies cubiertas de cartílago, con cápsulas propias reforzadas por ligamentos palmares, dorsales e **interóseos**, éstos cerca del borde superior de cada hueso.',
      'Sus cavidades son prolongaciones de la mediocarpiana: hacia arriba entre los huesos de la primera fila, hacia abajo entre los de la segunda y hasta las carpometacarpianas. Las superficies, oblicuas, dan al macizo del carpo su forma cóncava hacia delante, el canal del carpo.',
    ],
    sources: [LR('529–530')],
  },
  'Midcarpal joint': {
    text: [
      'La articulación entre las **dos filas del carpo**: arriba el escafoides, el semilunar y el piramidal (no el pisiforme) forman una cavidad; abajo el trapezoide, el grande y el ganchoso, un cóndilo, con la cabeza del grande metida en el hueco del escafoides y el semilunar. Es una sinovial **bicondílea**, que puede tomarse por elipsoidea; la unión del escafoides con el trapecio pertenece a la columna del pulgar.',
      'Las dos filas se unen por ligamentos palmares, que convergen en el hueso grande (ligamento radiado), por ligamentos dorsales cortos, que unen hueso a hueso, y por un ligamento colateral medial, del piramidal al gancho del ganchoso. Su cavidad es la única gran sinovial del carpo. Se mueve junto con la radiocarpiana en la flexión y la extensión de la mano.',
    ],
    sources: [LR('530')],
  },
  'Pisiform joint': {
    text: [
      'La articulación del **pisiforme** con la cara palmar del **piramidal**: una pequeña sinovial plana, sin ligamento interóseo y con su propia cavidad, que a veces comunica con la radiocarpiana. El pisiforme es un sesamoideo en el tendón del flexor ulnar del carpo, cuyas expansiones refuerzan la cápsula.',
      'Lo fijan un ligamento superior a la estiloides ulnar, uno dorsal al piramidal y dos inferiores, fuertes, que prolongan el tendón: el **pisoganchoso**, al gancho del ganchoso, y el **pisometacarpiano**, a la base del quinto metacarpiano.',
    ],
    sources: [LR('529')],
  },
  'Pisotriquetral ligament': {
    text: ['Refuerzo de la pequeña articulación pisipiramidal, la única del carpo con sinovial propia, entre el pisiforme y el piramidal.'],
    sources: [LR('529')],
  },
  'Pisohamate ligament': {
    text: ['Ligamento fuerte del pisiforme al gancho del ganchoso. Prolonga el tendón del flexor cubital del carpo y convierte el paso entre los dos huesos en el conducto cubital (de Guyon), donde puede comprimirse el nervio cubital.'],
    sources: [LR('529'), MOORE('261, 279')],
  },
  'Pisometacarpal ligament': {
    text: ['Ligamento fuerte del pisiforme a la base del quinto metacarpiano. Sustituye al ligamento carpometacarpiano palmar propio, que este metacarpiano no tiene, y prolonga el flexor cubital del carpo.'],
    sources: [LR('529, 531')],
  },
  'Radiate carpal ligament': {
    text: ['Abanico de fibras palmares que convergen sobre el **hueso grande** desde los huesos vecinos de las dos filas, uniendo la primera fila con la segunda.'],
    sources: [LR('530')],
  },

  // ---------- Hand ----------
  'Carpometacarpal joints': {
    text: [
      'Unen la segunda fila del carpo con la base de los metacarpianos 2.º a 5.º (la del pulgar, la trapeciometacarpiana, es aparte). Son **planas** y apenas se mueven: el segundo metacarpiano se encaja como una cuña entre el trapecio, el trapezoide y el grande; el tercero se apoya en el grande, y el cuarto en el ganchoso y un poco en el grande.',
      'Sólo el quinto, en silla de montar con el ganchoso, tiene algo más de juego, frenado por su unión con el cuarto. Las cápsulas, poco elásticas, se refuerzan con ligamentos palmares y dorsales, más fuertes éstos; sus sinoviales comunican con la mediocarpiana.',
    ],
    sources: [LR('531'), MOORE('290')],
  },
  'Carpometacarpal joint of thumb': {
    text: [
      'La articulación del **trapecio** con la base del **primer metacarpiano**, la más importante de la mano para la **oposición** del pulgar. Es **en silla de montar**: la superficie del trapecio es convexa de dorsal a palmar y cóncava de lado a lado, y la del metacarpiano, configurada a la inversa, se moldea sobre ella como un jinete que puede moverse en todos los sentidos.',
      'Su cápsula, inserta en el contorno de las dos superficies, es notablemente ancha y laxa, más gruesa detrás que delante, y su sinovial es independiente de la gran sinovial del carpo. Es superficial detrás y lateralmente, en el fondo de la tabaquera anatómica, donde la cruza la arteria radial; delante la cubre la eminencia tenar.',
    ],
    sources: [LR('531'), MOORE('290')],
  },
  'Palmar carpometacarpal ligaments': {
    text: ['Ligamentos de la cara palmar de las carpometacarpianas del segundo al cuarto dedo: del trapecio y el hueso grande al segundo y tercer metacarpianos, y del ganchoso al cuarto. El quinto no tiene: lo sustituye el pisometacarpiano.'],
    sources: [LR('531')],
  },
  'Dorsal carpometacarpal ligaments': {
    text: ['Más fuertes que los palmares: dos unen el segundo metacarpiano al trapezoide, dos el tercero al hueso grande, y uno cada uno el cuarto y el quinto al ganchoso.'],
    sources: [LR('531')],
  },
  'Intermetacarpal joints': {
    text: ['Pequeñas articulaciones planas entre las bases de los metacarpianos segundo a quinto, unidas por ligamentos interóseos, palmares y dorsales; el primero queda libre. Sus sinoviales prolongan las de las carpometacarpianas.'],
    sources: [LR('532')],
  },
  'Interosseous metacarpal ligaments': {
    text: ['Ligamentos muy cortos entre las caras enfrentadas de las bases de dos metacarpianos vecinos, del segundo al quinto.'],
    sources: [LR('532')],
  },
  'Palmar metacarpal ligaments': {
    text: ['Tres ligamentos transversales en la cara palmar de las bases de los metacarpianos: del segundo al tercero, del tercero al cuarto y del cuarto al quinto.'],
    sources: [LR('532')],
  },
  'Dorsal metacarpal ligaments': {
    text: ['Tres ligamentos en la cara dorsal de las bases de los metacarpianos, del segundo al quinto, homólogos de los palmares.'],
    sources: [LR('532')],
  },
  'Metacarpophalangeal joints': {
    text: [
      'Articulaciones **elipsoideas** entre la cabeza de cada metacarpiano y la base de la falange proximal: flexión, extensión y lateralidad. Su superficie falángica se agranda por delante con un **fibrocartílago** palmar (la placa palmar), al que se une el ligamento metacarpiano transverso profundo.',
      'Los ligamentos colaterales, triangulares, se tensan al máximo en flexión. En el pulgar, el fibrocartílago lleva dos sesamoideos y la rotura de su colateral cubital da el **pulgar del esquiador**.',
    ],
    sources: [LR('532–533'), MOORE('288')],
  },
  'Articular capsules of metacarpophalangeal joints': {
    text: ['Cápsulas delgadas y laxas, insertadas en el límite de las superficies, engrosadas por delante por el fibrocartílago palmar y reforzadas por los colaterales. Cada una tiene su sinovial, sin recesos.'],
    sources: [LR('533')],
  },
  'Collateral metacarpophalangeal ligaments': {
    text: ['Ligamentos triangulares a cada lado de la articulación, del tubérculo de la cabeza del metacarpiano a la base de la falange y al fibrocartílago palmar. Se tensan en la flexión: por eso los dedos no se separan con el puño cerrado.'],
    sources: [LR('533')],
  },
  'Deep transverse metacarpal ligament': {
    text: ['Cinta que une por la palma las placas palmares de las cuatro últimas metacarpofalángicas y mantiene juntas las cabezas de esos metacarpianos; el pulgar queda libre. Por delante pasan los lumbricales, por detrás los interóseos.'],
    sources: [LR('532–533')],
  },
  'Interphalangeal joints of hand': {
    text: [
      'Gínglimos entre la cabeza en polea de una falange y la base de la siguiente: sólo flexión y extensión. El pulgar tiene una, los demás dedos dos (proximal y distal). Un fibrocartílago palmar agranda la base y dos colaterales triangulares refuerzan la cápsula.',
      'Son tan pequeñas que la menor deformación de sus superficies o la rigidez de sus ligamentos tras una inmovilización larga altera mucho su función.',
    ],
    sources: [LR('533–534')],
  },
  'Articular capsules of proximal interphalangeal joints': {
    text: ['Cápsulas de las articulaciones entre las falanges proximal y media, insertadas a cierta distancia del cartílago, lo que favorece la movilidad, y engrosadas por delante por el fibrocartílago palmar.'],
    sources: [LR('534')],
  },
  'Articular capsules of distal interphalangeal joints': {
    text: ['Cápsulas de las articulaciones entre las falanges media y distal (en el pulgar, entre la proximal y la distal); como las proximales, con un fibrocartílago palmar y dos colaterales.'],
    sources: [LR('534')],
  },
  'Collateral interphalangeal ligaments of hand': {
    text: ['Ligamentos triangulares a los lados de cada interfalángica, como los de las metacarpofalángicas, que impiden la lateralidad.'],
    sources: [LR('534')],
  },
  'Palmar interphalangeal ligaments': {
    text: ['Las **placas palmares** de las interfalángicas: fibrocartílagos fijados a la base de la falange distal de cada articulación, que agrandan su superficie y engrosan la cápsula por delante.'],
    sources: [LR('534')],
  },
}

// ---------- The small ligaments of the carpus: what each kind does ----------

const carpal = (kind: 'interosseous' | 'palmar' | 'dorsal', bones: string): Description => ({
  text: [
    kind === 'interosseous'
      ? `Ligamento **interóseo** entre ${bones}: fibras cortas entre sus caras enfrentadas, cerca de su parte superior, que mantienen unidos los huesos de una misma fila del carpo.`
      : `Ligamento ${kind === 'palmar' ? '**palmar**' : '**dorsal**'} entre ${bones}, uno de los que refuerzan las cápsulas propias de las articulaciones planas del carpo${kind === 'palmar' ? ' por delante, en el fondo del canal del carpo' : ' por detrás, bajo los tendones extensores'}.`,
  ],
  sources: [LR('529–530')],
})

Object.assign(joints, {
  'Scapholunate interosseous ligament': {
    text: ['Ligamento **interóseo** entre el escafoides y el semilunar, cerca de su parte superior, que mantiene juntos los dos huesos mayores de la primera fila.'],
    sources: [LR('529–530')],
  },
  'Lunotriquetral interosseous ligament': carpal('interosseous', 'el semilunar y el piramidal'),
  'Palmar lunotriquetral ligament': carpal('palmar', 'el semilunar y el piramidal'),
  'Palmar scaphotriquetral ligament': carpal('palmar', 'el escafoides y el piramidal, por delante del semilunar'),
  'Dorsal scaphotriquetral ligament': carpal('dorsal', 'el escafoides y el piramidal, por detrás del semilunar'),
  'Trapeziotrapezoidal interosseous ligament': carpal('interosseous', 'el trapecio y el trapezoide'),
  'Trapezoideocapitate interosseous ligament': carpal('interosseous', 'el trapezoide y el hueso grande'),
  'Palmar trapezoideocapitate ligament': carpal('palmar', 'el trapezoide y el hueso grande'),
  'Capitohamate interosseous ligament': carpal('interosseous', 'el hueso grande y el ganchoso'),
  'Palmar capitohamate ligament': carpal('palmar', 'el hueso grande y el ganchoso'),
  'Scaphocapitate ligament': carpal('palmar', 'el escafoides y el hueso grande, de una fila a la otra'),
  'Scaphotrapeziotrapezoidal ligament': carpal('palmar', 'el escafoides, el trapecio y el trapezoide, de una fila a la otra'),
  'Triquetrocapitate ligament': carpal('palmar', 'el piramidal y el hueso grande, de una fila a la otra'),
  'Triquetrohamate ligament': {
    text: ['El ligamento **colateral medial** de la mediocarpiana: del vértice del piramidal al ganchoso, por el lado cubital del carpo.'],
    sources: [LR('530')],
  },
  'Dorsal intercarpal ligaments': {
    text: ['Ligamentos cortos de la cara dorsal del carpo que unen cada hueso con sus vecinos, en cada fila y de una fila a la otra; son superficiales, bajo los tendones extensores.'],
    sources: [LR('529–530')],
  },
  'Dorsal ulnocarpal ligament': {
    text: ['Fibras dorsales que unen el cúbito al piramidal, junto al fascículo posterior del ligamento colateral cubital de la muñeca.'],
    sources: [LR('527')],
  },
} satisfies Record<string, Description>)

export const upperLimbJoints = joints
