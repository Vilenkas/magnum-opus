import type { Description } from './index'

/** Arteries, veins and lymph nodes of the upper limb (vessels viewer), after Latarjet–Ruiz Liard's chapters 59–61. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })

const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })

/** Deep veins: two satellites of each artery, named and laid out like it. */
const satellite = (artery: string, p: string, more = ''): Description =>
  d(
    p,
    `Venas satélites de la ${artery}: como casi todas las arterias del miembro superior, la acompañan dos venas unidas entre sí por anastomosis alrededor de ella, que reciben afluentes con los nombres de sus ramas.${more}`,
  )

const vessels: Record<string, Description> = {
  // ---------- Arteries ----------
  'Axillary artery': d(
    '577–581',
    'Continuación de la subclavia desde la mitad de la clavícula hasta el borde inferior del pectoral mayor, donde pasa a llamarse **braquial**. Mide 8 a 10 mm de diámetro y es el eje de la fosa axilar, con la vena axilar por dentro y los fascículos del plexo braquial alrededor.',
    'El **pectoral menor**, que la cruza por delante, la divide en tres porciones: por encima, por detrás y por debajo del músculo. Da la torácica superior, la toracoacromial, la torácica lateral, la subescapular y las dos circunflejas humerales; sus anastomosis alrededor de la escápula pueden suplirla si se liga, aunque a menudo de forma precaria.',
  ),
  'Thoraco-acromial artery': d(
    '579',
    'Rama corta de la cara anterior de la axilar, por encima o detrás del pectoral menor. Atraviesa la fascia clavipectoral y se abre en ramas pectorales, una rama acromial y una rama deltoidea, que baja por el surco deltopectoral junto a la vena cefálica.',
  ),
  'Pectoral branches of thoraco-acromial artery': d(
    '579',
    'Ramas de la toracoacromial que se reparten entre los dos pectorales y se anastomosan con la primera intercostal y con ramas de la torácica interna.',
  ),
  'Lateral thoracic artery': d(
    '579',
    'Rama de la axilar nacida detrás del pectoral menor, que baja por la pared medial de la axila sobre el serrato anterior. Irriga ese músculo, los nodos axilares del grupo pectoral, la piel y la **glándula mamaria**, y se anastomosa con las intercostales.',
  ),
  'Subscapular artery': d(
    '579',
    'La rama más gruesa de la axilar, nacida a la altura del borde inferior del subescapular. Baja junto al nervio toracodorsal y se divide en la **toracodorsal** y la **circunfleja escapular**, que la unen a las arterias de la escápula venidas de la subclavia.',
  ),
  'Thoracodorsal artery': d(
    '579',
    'Rama terminal de la subescapular que baja entre el serrato anterior y el dorsal ancho, con el nervio toracodorsal, y riega esos músculos, el redondo mayor y la piel anterolateral del tórax.',
  ),
  'Circumflex scapular artery': d(
    '579, 581',
    'Rama terminal de la subescapular que pasa hacia atrás por el **espacio axilar medial** (el triángulo entre los redondos y la porción larga del tríceps) hasta el borde lateral de la escápula. Sus ramas se anastomosan en la fosa infraespinosa con la supraescapular y la dorsal de la escápula: un circuito que puede suplir a la axilar.',
  ),
  'Anterior circumflex humeral artery': d(
    '580',
    'Rama de la axilar que rodea por delante el cuello quirúrgico del húmero, bajo el coracobraquial y la porción corta del bíceps. Una rama sube por el surco intertubercular hacia la cabeza y la cápsula; la otra se une a la circunfleja posterior.',
  ),
  'Posterior circumflex humeral artery': d(
    '580–581',
    'Rama de la cara posterior de la axilar, más gruesa que la anterior. Con el **nervio axilar** cruza el espacio axilar lateral (el cuadrilátero entre los redondos, la porción larga del tríceps y el húmero), rodea por detrás el cuello quirúrgico e irriga el deltoides; se anastomosa con la circunfleja anterior.',
  ),
  'Suprascapular artery': d(
    '473, 478',
    'Arteria de la escápula venida del cuello: pasa **por encima** del ligamento transverso superior de la escápula (el nervio va por debajo) hacia la fosa supraespinosa y rodea la espina hasta la infraespinosa. Riega los músculos de las dos fosas y el hombro y se anastomosa con la circunfleja escapular.',
  ),
  'Brachial artery': d(
    '581–584',
    'Continúa a la axilar desde el borde inferior del pectoral mayor y baja por la cara medial del brazo, en el surco del bíceps, con dos venas satélites y el **nervio mediano**, que la cruza por delante de fuera adentro. En la fosa del codo, bajo la aponeurosis del bíceps, se divide en **radial** y **cubital** unos 4 cm por debajo de la interlínea.',
    'Se palpa en todo su trayecto; en el codo es donde se ausculta para medir la presión arterial. Sus ramas colaterales forman con las recurrentes del antebrazo la red anastomótica del codo.',
  ),
  'Deep brachial artery': d(
    '582',
    'La principal rama de la braquial: con el **nervio radial** pasa por el espacio axilar inferior y rodea por detrás el húmero en el surco del nervio radial, irrigando el tríceps. Encima del epicóndilo lateral se divide en las colaterales media y radial.',
  ),
  'Radial collateral artery': d(
    '582, 589',
    'Rama terminal anterior de la braquial profunda: baja con el nervio radial hasta el surco bicipital lateral y se anastomosa delante del epicóndilo lateral con la recurrente radial.',
  ),
  'Superior ulnar collateral artery': d(
    '583',
    'Rama alta de la braquial que atraviesa el tabique intermuscular medial y acompaña al **nervio cubital** por detrás de él hasta el codo, donde se une a la rama posterior de la recurrente cubital.',
  ),
  'Inferior ulnar collateral artery': d(
    '583–584',
    'Rama de la braquial nacida dos o tres traveses de dedo sobre la fosa del codo. Encima del epicóndilo medial se divide y se anastomosa por delante y por detrás con las ramas de la recurrente cubital.',
  ),
  'Radial artery': d(
    '584–586',
    'Rama lateral de la división de la braquial. Baja por el antebrazo bajo el braquiorradial y, en su tercio inferior, queda superficial entre los tendones del braquiorradial y del flexor radial del carpo, sobre el radio: es el **canal del pulso**, donde se toma el pulso.',
    'Rodea después el proceso estiloides por la tabaquera anatómica, atraviesa el primer espacio interóseo y llega a la palma, donde forma con la cubital el **arco palmar profundo**. Sus anastomosis permiten ligarla a cualquier altura.',
  ),
  'Palmar carpal branch of radial artery': d(
    '585',
    'Pequeña rama de la radial que sigue el borde inferior del pronador cuadrado y se une en la línea media con su homóloga de la cubital, delante del carpo.',
  ),
  'Ulnar artery': d(
    '586–589',
    'Rama medial de la división de la braquial, más profunda que la radial: pasa bajo el pronador redondo y el arco del flexor superficial, cruzando por detrás el nervio mediano, y baja con el **nervio cubital** junto al flexor cubital del carpo.',
    'En la muñeca pasa por delante del retináculo flexor, al lado del pisiforme (conducto de Guyon), y forma en la palma el **arco palmar superficial**. No se le percibe el pulso en ningún punto.',
  ),
  '(Ulnar recurrent artery)': d(
    '588–589',
    'Rama de la cubital, nacida encima del arco del flexor superficial, que se divide en dos: la anterior sube delante del epicóndilo medial hacia la colateral cubital inferior; la posterior, entre las cabezas del flexor cubital del carpo, sube con el nervio cubital detrás del epicóndilo hacia la colateral cubital superior.',
  ),
  'Common interosseous artery': d(
    '588',
    'Tronco corto de la cubital que llega al borde superior de la membrana interósea y se divide en las interóseas anterior y posterior.',
  ),
  'Posterior interosseous artery': d(
    '589',
    'Rama de la interósea común que pasa por encima de la membrana interósea al compartimento posterior y baja entre sus planos musculares con el ramo profundo del nervio radial, hasta anastomosarse en el carpo con la red dorsal.',
  ),
  'Recurrent interosseous artery': d(
    '589',
    'Rama de la interósea posterior que sube por detrás del epicóndilo lateral y se anastomosa con la colateral media de la braquial profunda.',
  ),
  'Dorsal carpal branch of ulnar artery': d(
    '589',
    'Rama de la cubital que rodea la cara medial del cúbito bajo el tendón del flexor cubital del carpo y se une en el dorso del carpo a la rama de la radial: el arco dorsal del carpo.',
  ),
  'Dorsal carpal anastomosis': d(
    '585, 591',
    'Red dorsal del carpo, formada por las ramas dorsales de la radial y la cubital y las interóseas, contra la primera fila del carpo, bajo los tendones extensores. De ella salen las arterias metacarpianas dorsales de los espacios 2.º a 4.º.',
  ),
  'Superficial palmar arch': d(
    '589–590',
    'Arco formado por la **cubital** y la rama palmar superficial de la radial, bajo la aponeurosis palmar y por delante de los tendones flexores, entre los pliegues palmares primero y segundo. Da las cuatro arterias digitales palmares comunes. Si la rama de la radial es pequeña, el arco puede no cerrarse.',
  ),
  'Deep palmar arch': d(
    '590',
    'Arco formado por la **radial** y la rama palmar profunda de la cubital, en la celda palmar profunda, sobre las bases de los metacarpianos y los interóseos, con el ramo profundo del nervio cubital. Más alto que el superficial, da las metacarpianas palmares y ramas perforantes al dorso.',
  ),
  'Common palmar digital arteries': d(
    '590',
    'Las ramas del arco palmar superficial que bajan hacia los espacios interdigitales y se dividen, algo más abajo de las metacarpofalángicas, en las digitales propias de los dos dedos vecinos.',
  ),
  'Proper palmar digital arteries': d(
    '590–591',
    'Arterias colaterales de cada dedo, una a cada lado, con su nervio por fuera de la vaina de los flexores. En la falange distal se unen en un arco que irriga ricamente el pulpejo: por eso las heridas de los dedos sangran tanto, y su espasmo da el síndrome de Raynaud.',
  ),
  'Palmar metacarpal arteries': d(
    '590',
    'Ramas del arco palmar profundo, una por espacio interóseo, que bajan sobre los interóseos y se unen a las digitales; la del primer espacio, más gruesa, irriga el pulgar y parte del índice.',
  ),
  'Dorsal metacarpal arteries': d(
    '585–586, 591',
    'Arterias de los espacios interóseos por el dorso de la mano, nacidas de la red dorsal del carpo (la del primer espacio, de la radial). Reciben las perforantes del arco profundo y se dividen en las digitales dorsales.',
  ),
  'Dorsal digital arteries of hand': d(
    '586',
    'Ramas de las metacarpianas dorsales para el dorso de los dedos, que pueden llegar hasta la falange media o la distal.',
  ),

  // ---------- Veins ----------
  'Axillary vein': d(
    '595–596',
    'Recoge todo el retorno venoso del miembro: nace de la unión de las venas braquiales (o de una braquial con la basílica) y sigue a la arteria axilar por dentro y algo por debajo, con afluentes que llevan los nombres de sus ramas. Cerca de la clavícula recibe la **cefálica** y continúa como subclavia.',
    'Sus anastomosis con las venas del tórax hacen que su trombosis sea a menudo bien tolerada.',
  ),
  'Cephalic vein': d(
    '594–595',
    'Vena superficial del borde lateral del miembro: nace en el dorso de la mano, sube por el lado radial del antebrazo y el borde lateral del bíceps, y por el **surco deltopectoral** llega al triángulo bajo la clavícula, donde atraviesa la fascia clavipectoral para terminar en la vena axilar.',
  ),
  'Basilic vein': d(
    '594–595',
    'Vena superficial del borde medial del miembro: nace en el dorso de la mano, sube por el lado cubital del antebrazo, recibe en el codo la mediana del codo y, en la mitad del brazo, atraviesa la fascia para unirse a las venas braquiales.',
  ),
  'Median cubital vein': d(
    '595',
    'La vena de la flexura del codo que une en diagonal la cefálica con la basílica, parte de la «M venosa» del codo; recibe una perforante de las venas profundas. Superficial y fija, es la vena que se usa para las extracciones de sangre.',
  ),
  'Median antebrachial vein': d(
    '595',
    'Vena superficial de la cara anterior del antebrazo, que sube por su línea media y se abre en el codo en las venas medianas cefálica y basílica.',
  ),
  'Brachial veins': satellite(
    'arteria braquial',
    '594',
    ' Nacen en el codo de la unión de las radiales y las cubitales y en lo alto del brazo forman la vena axilar; reciben la basílica.',
  ),
  'Radial veins': satellite('arteria radial', '594'),
  'Ulnar veins': satellite('arteria cubital', '594', ' Son las mayores del antebrazo: reciben las venas de la palma y del dorso de la mano.'),
  'Subscapular vein': satellite('arteria subescapular', '595', ' Alrededor de su desembocadura se agrupan los nodos axilares laterales.'),
  'Thoracodorsal vein': satellite('arteria toracodorsal', '595'),
  'Circumflex scapular vein': satellite('arteria circunfleja escapular', '595'),
  'Lateral thoracic vein': satellite(
    'arteria torácica lateral',
    '595–596',
    ' Une la axilar con las venas de la pared del tórax y del abdomen, una vía colateral si se obstruye la cava superior.',
  ),
  'Anterior circumflex humeral vein': satellite('arteria circunfleja humeral anterior', '595'),
  'Posterior circumflex humeral vein': satellite('arteria circunfleja humeral posterior', '595'),
  'Suprascapular vein': d('473', 'Vena satélite de la arteria supraescapular, que pasa con el nervio por debajo del ligamento transverso superior de la escápula.'),
  'Dorsal venous network of hand': d(
    '594',
    'Plexo superficial muy variable del dorso de la mano, encima de los nervios, adonde llegan las venas de los dedos. Por fuera da origen a la **cefálica** y por dentro a la **basílica**: en la mano dominan las venas superficiales.',
  ),
  'Dorsal digital veins of hand': d(
    '594',
    'Las dos venas colaterales del dorso de cada dedo, nacidas de un arco alrededor de la uña y de la red del pulpejo, que desembocan en la red dorsal de la mano.',
  ),
  'Palmar digital veins': d('594', 'Venas finas de la cara palmar de los dedos, que drenan sobre todo hacia el dorso, en la red venosa dorsal.'),
  'Superficial venous palmar arch': d('594', 'Arco venoso satélite del arco palmar superficial, formado por las venas que acompañan a sus ramas.'),
  'Deep venous palmar arch': d('594', 'Arco venoso satélite del arco palmar profundo, que drena en las venas radiales y cubitales.'),

  // ---------- Lymph nodes ----------
  'Lateral axillary nodes': d(
    '599',
    'El grupo **braquial** de los nodos axilares, por dentro y debajo de la vena axilar: recibe casi toda la linfa del miembro superior y la lleva a los nodos centrales o directamente a los supraclaviculares.',
  ),
  'Anterior axillary nodes': d(
    '599',
    'El grupo **pectoral** de los nodos axilares, a lo largo de los vasos torácicos laterales sobre el serrato anterior, de la 2.ª a la 6.ª costilla. Reciben la linfa de la pared del tórax y sobre todo de la **mama**: son los primeros en invadirse en su cáncer.',
  ),
  'Posterior axillary nodes': d(
    '599',
    'El grupo **subescapular**, alrededor de los vasos subescapulares, entre el dorsal ancho y el subescapular, abrazado por el nervio toracodorsal. Recibe la linfa de la espalda, la nuca y la parte posterior del hombro.',
  ),
  'Central axillary nodes': d(
    '599',
    'Una decena de nodos hundidos en la grasa de la axila, cruzados por el nervio intercostobraquial, que reciben los eferentes de los grupos braquial, pectoral y subescapular y drenan hacia los apicales.',
  ),
  'Apical axillary nodes': d(
    '599',
    'El último relevo de la axila, en su vértice, detrás de la fascia clavipectoral y por dentro de la vena axilar, junto a la desembocadura de la cefálica. Difíciles de alcanzar, recogen toda la linfa axilar y la llevan a la base del cuello.',
  ),
  'Infraclavicular nodes': d(
    '598',
    'Los nodos **deltopectorales**, en lo alto del surco deltopectoral, junto a la vena cefálica: reciben los linfáticos superficiales que siguen esa vena y drenan, a través de la fascia clavipectoral, a la axila.',
  ),
  'Interpectoral nodes': d('599', 'Pequeños nodos entre el pectoral mayor y el menor, en el camino de la linfa de la mama hacia los nodos apicales.'),
  'Brachial nodes': d('598–599', 'Nodos profundos a lo largo de las venas braquiales, que reciben los vasos linfáticos profundos del brazo y del antebrazo y drenan en el grupo braquial de la axila.'),
  'Cubital nodes': d('599', 'Pequeños nodos profundos de la fosa del codo, en el trayecto de los linfáticos que acompañan a los vasos del antebrazo.'),
  'Supratrochlear nodes': d(
    '598, 600',
    'Nodos superficiales 3 o 4 cm encima del epicóndilo medial, junto a la vena basílica. Con los axilares, se hinchan y duelen en las infecciones de los dedos y de la mano.',
  ),
}

export const upperLimbVessels = vessels
