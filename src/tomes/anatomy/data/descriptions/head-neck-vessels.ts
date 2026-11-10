import type { Description } from './index'

/**
 * Arteries, veins and lymph nodes of the head and the neck (vessels viewer): the carotids, the subclavians' cervical
 * branches and the veins of the neck after Latarjet–Ruiz Liard's chapters 83–84 and 87 (t. 2); the brain's arteries,
 * the dural sinuses and the orbit's vessels after chapters 25–26 and 45 (t. 1); the nodes after chapter 90 (t. 2) and
 * Rouvière (t. 1), who names the facial ones. Both sides of a vessel the model keeps apart share their text.
 */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })
const ROUV = (p: string) => ({ fuente: 'rouviere-1' as const, p })
const d = (p: string, ...text: string[]): Description => ({ text, sources: [LR(p)] })
const d2 = (p: string, ...text: string[]): Description => ({ text, sources: [LR2(p)] })
const nodes = (p: string, rp: string, ...text: string[]): Description => ({ text, sources: [LR2(p), ROUV(rp)] })

const COMMON_CAROTID = (side: string, origin: string): Description => ({
  text: [
    `La **carótida común ${side}**: ${origin} Sube por el cuello sin dar ramas, en la vaina carotídea con la vena yugular interna, lateral, y el nervio vago, detrás entre ambas, cubierta por el esternocleidomastoideo; detrás tiene los transversos cervicales (se comprime contra el tubérculo carotídeo de C6).`,
    'A la altura del borde superior del cartílago tiroides (C4) se divide en **carótida externa** e **interna**; en la bifurcación están el **seno carotídeo**, presorreceptor, y el **glomo carotídeo**, quimiorreceptor, inervados por el glosofaríngeo.',
  ],
  sources: [LR2('933–935')],
})

const SUBCLAVIAN = (side: string, origin: string): Description => ({
  text: [
    `La **subclavia ${side}**: ${origin} Describe un arco sobre la cúpula de la pleura y la primera costilla y pasa detrás del **escaleno anterior**, con el plexo braquial, por el desfiladero de los escalenos; en el borde lateral de la primera costilla se continúa como arteria axilar.`,
    'Antes del escaleno da la **vertebral**, la **torácica interna** y el **tronco tirocervical**; detrás de él, el **tronco costocervical**; a veces, más allá, la dorsal de la escápula. Irriga así el encéfalo, el cuello, la pared del tórax y el miembro superior.',
  ],
  sources: [LR2('951–958')],
})

const BRACHIOCEPHALIC_VEIN = (side: string, course: string): Description => ({
  text: [
    `La **vena braquiocefálica ${side}**: nace detrás de la articulación esternoclavicular de la unión de la yugular interna y la subclavia (**ángulo venoso**, donde termina ${side === 'izquierda' ? 'el conducto torácico' : 'el conducto linfático derecho'}). ${course}`,
    'Recibe las venas vertebral, torácica interna, tiroideas inferiores y, la izquierda, la intercostal superior izquierda; las dos se unen detrás del primer cartílago costal derecho para formar la **vena cava superior**. No tienen válvulas.',
  ],
  sources: [LR2('986–989')],
})

const SUBCLAVIAN_VEIN = (side: string): Description => ({
  text: [
    `La **vena subclavia ${side}**, continuación de la axilar desde el borde lateral de la primera costilla: pasa por **delante del escaleno anterior**, que la separa de la arteria, por detrás de la clavícula y del músculo subclavio, a cuya fascia se adhiere y que la mantiene abierta.`,
    'Detrás de la articulación esternoclavicular se une a la yugular interna para formar la braquiocefálica. Su posición fija y su calibre la hacen vía para los catéteres venosos centrales.',
  ],
  sources: [LR2('984–986')],
})

const MCA =
  'La **cerebral media** (silviana), la más voluminosa de las cerebrales y la continuación directa de la carótida interna: va lateralmente por la fosa lateral del cerebro hasta la ínsula, donde se divide en ramas superiores (frontoparietales) e inferiores (temporales), que salen del surco lateral y se reparten por la **cara lateral del hemisferio**: las áreas motora y sensitiva de la cara y el miembro superior y, en el hemisferio dominante, las del lenguaje.'
const mca = (lead: string, p = '216–217'): Description => ({ text: [lead, MCA], sources: [LR(p)] })

const ACA =
  'La **cerebral anterior** nace de la carótida interna, pasa sobre el nervio óptico hacia la fisura longitudinal, donde la comunicante anterior la une a la del otro lado, y rodea la rodilla del cuerpo calloso hasta el esplenio. Irriga la cara medial del hemisferio, del lóbulo frontal a la cuña, con el lobulillo paracentral (área motora y sensitiva del miembro inferior), y el borde superior de la cara lateral.'
const aca = (lead: string): Description => ({ text: [lead, ACA], sources: [LR('215–216')] })

const PCA =
  'La **cerebral posterior**, rama terminal de la basilar en la fosa interpeduncular, rodea el pedúnculo cerebral y llega a la cara medial e inferior del hemisferio: lóbulo occipital, con la **corteza visual** de la cisura calcarina, y cara inferior del lóbulo temporal. Su oclusión da una hemianopsia homónima contralateral.'
const pca = (lead: string): Description => ({ text: [lead, PCA], sources: [LR('218–219')] })

const OPHTHALMIC =
  'Es rama de la **arteria oftálmica**, la primera colateral de la carótida interna, que entra en la órbita por el conducto óptico bajo el nervio óptico y la recorre de atrás adelante dando ramas al ojo, a los músculos, a los párpados, a la frente y a la nariz.'
const oph = (p: string, lead: string): Description => ({ text: [lead, OPHTHALMIC], sources: [LR(p)] })

const MAXILLARY =
  'Es rama de la **arteria maxilar**, la terminal mayor de la carótida externa, que nace en la parótida detrás del cuello de la mandíbula y atraviesa la fosa infratemporal hasta la pterigopalatina.'
const max = (p: string, lead: string): Description => ({ text: [lead, MAXILLARY], sources: [LR2(p)] })

const SINUSES =
  'Los **senos de la duramadre** son conductos venosos sin válvulas abiertos entre las dos hojas de la duramadre, de paredes rígidas que no se colapsan: recogen la sangre del encéfalo, de las meninges y del diploe, y la llevan a las venas yugulares internas.'
const sinus = (p: string, lead: string): Description => ({ text: [lead, SINUSES], sources: [LR(p)] })

const arteries: Record<string, Description> = {
  // ---------- Common carotid and external carotid ----------
  'Right common carotid artery': COMMON_CAROTID('derecha', 'nace del **tronco braquiocefálico** detrás de la articulación esternoclavicular, por lo que sólo tiene porción cervical.'),
  'Left common carotid artery': COMMON_CAROTID('izquierda', 'nace directamente del **arco aórtico**, por lo que es más larga y tiene una porción torácica, en el mediastino superior, antes de entrar en el cuello detrás de la articulación esternoclavicular.'),
  'External carotid artery': d2(
    '936–937, 945',
    'La **carótida externa**, arteria de la cara y del cuello: nace en la bifurcación carotídea, primero medial y luego lateral a la interna, y sube por el triángulo carotídeo, cubierta por el esternocleidomastoideo, y luego en la parótida, donde se divide detrás del cuello de la mandíbula en sus terminales, **temporal superficial** y **maxilar**.',
    'Sus colaterales son la tiroidea superior, la lingual, la facial, la faríngea ascendente, la occipital y la auricular posterior. Sus territorios se anastomosan mucho con los del otro lado, por lo que se puede ligar sin riesgo, aunque con eficacia incompleta.',
  ),
  'Facial artery': d2(
    '937–941',
    'La **arteria facial**, colateral de la carótida externa: nace sobre el asta mayor del hioides, sube en asa por la cara profunda de la glándula submandibular y cruza el borde inferior de la mandíbula por delante del masetero, donde se palpa su pulso. En la cara asciende muy sinuosa hacia el ángulo medial del ojo, por delante de la vena facial, entre los músculos superficiales y el buccinador.',
    'Da en el cuello la palatina ascendente, la tonsilar y la submentoniana; en la cara, las labiales superior e inferior, y termina como **arteria angular**. Se anastomosa con la del otro lado por los labios y con la oftálmica en el ángulo del ojo.',
  ),
  'Submental artery': d2('939', 'La **arteria submentoniana**, rama cervical de la facial: va adelante sobre el milohioideo, bajo el borde de la mandíbula, junto a la glándula submandibular, y llega al mentón; irriga los músculos suprahioideos, la glándula y la piel del mentón y del labio inferior.'),
  'Superior labial artery': d2('941', 'La **arteria labial superior**, rama de la facial cerca de la comisura: recorre el labio superior entre el orbicular y la mucosa, cerca del borde libre, y se anastomosa con la del otro lado formando el círculo arterial de los labios. Da una rama para el tabique de la nariz.'),
  'Inferior labial artery': d2('941', 'La **arteria labial inferior**, rama de la facial por debajo de la comisura: recorre el labio inferior bajo el orbicular, cerca del borde libre, y se anastomosa con la del otro lado; por eso, en una herida del labio sangran los dos extremos.'),
  'Angular artery': d2('941', 'La **arteria angular**, rama terminal de la facial: sube a lo largo de la nariz hasta el ángulo medial del ojo, donde se anastomosa con la arteria dorsal de la nariz, de la oftálmica: une así el territorio de la carótida externa con el de la interna.'),
  'Ascending pharyngeal artery': d2('941', 'La **arteria faríngea ascendente**, la más delgada de las colaterales de la carótida externa: nace cerca de la bifurcación y sube vertical junto a la pared de la faringe hasta la base del cráneo. Irriga la faringe, el velo del paladar, la tonsila, la trompa auditiva y, por ramas meníngeas, la duramadre de la fosa posterior.'),
  'Occipital artery': d2('941–942', 'La **arteria occipital**, colateral posterior de la carótida externa: va atrás bajo el vientre posterior del digástrico, cruzada por el hipogloso, ocupa el surco occipital de la mastoides y, en la nuca, perfora el trapecio para repartirse por el cuero cabelludo de la región occipital, con el nervio occipital mayor. Da ramas al esternocleidomastoideo y a los músculos de la nuca.'),
  'Superficial temporal artery': d2('943', 'La **arteria temporal superficial**, terminal de la carótida externa: nace en la parótida detrás del cuello de la mandíbula, sube delante del trago, donde se palpa su pulso, y cruza la raíz del arco cigomático. Se divide en una rama frontal y otra parietal para el cuero cabelludo; da antes la arteria facial transversa. En el anciano se vuelve sinuosa y visible; la inflama la arteritis temporal.'),
  'Frontal branch of superficial temporal artery': d2('943', 'La **rama frontal** de la temporal superficial: sube flexuosa hacia la frente y se anastomosa con las supraorbitaria y supratroclear, de la oftálmica. Irriga la piel y los músculos de la frente.'),
  'Transverse facial artery': d2('943', 'La **arteria facial transversa**, rama de la temporal superficial en la parótida: va adelante por la cara lateral del masetero, entre el arco cigomático y el conducto parotídeo, e irriga la parótida, el masetero y la piel de la mejilla.'),
  'Maxillary artery': d2(
    '943–945',
    'La **arteria maxilar**, la terminal mayor de la carótida externa: nace en la parótida detrás del cuello de la mandíbula, pasa entre éste y el ligamento esfenomandibular y atraviesa la fosa infratemporal, superficial o profunda al pterigoideo lateral, hasta la **fosa pterigopalatina**, donde termina como arteria esfenopalatina.',
    'Irriga las estructuras profundas de la cara: por sus ramas mandibulares, la meníngea media y la alveolar inferior; por las pterigoideas, los músculos masticadores y el buccinador; por las pterigopalatinas, los dientes superiores, el paladar, la cavidad nasal y la órbita.',
  ),
  'Inferior alveolar artery': max('944', 'La **arteria alveolar inferior**: baja con el nervio homónimo hasta el foramen mandibular y recorre el conducto mandibular dando ramas a los dientes inferiores y a la mandíbula; antes da la rama milohioidea, y termina como rama mentoniana.'),
  'Mental branch of inferior alveolar artery': max('944', 'La **rama mentoniana** de la alveolar inferior: sale por el foramen mentoniano con el nervio homónimo e irriga la piel del mentón y del labio inferior, anastomosada con la labial inferior y la submentoniana.'),
  'Mylohyoid branch of inferior alveolar artery': max('944', 'La **rama milohioidea** de la alveolar inferior: nace antes del foramen mandibular y baja con el nervio milohioideo por el surco de la cara medial de la mandíbula hasta el milohioideo.'),
  'Middle meningeal artery': {
    text: [
      'La **arteria meníngea media**, la mayor de las meníngeas y la única de interés práctico: rama de la maxilar, sube entre las dos raíces del nervio auriculotemporal y entra en el cráneo por el **foramen espinoso**. Se ramifica por fuera de la duramadre, en surcos de la cara interna del temporal y del parietal, en una rama frontal y otra parietal.',
      'Su rama frontal pasa bajo el **pterion**, donde el hueso es delgado: un golpe en la sien la desgarra y la sangre despega la duramadre (**hematoma epidural**), con un intervalo lúcido antes del coma.',
    ],
    sources: [LR2('944'), LR('205')],
  },
  'Accessory branch of middle meningeal artery': max('944', 'La **rama accesoria** de la meníngea media (arteria pterigomeníngea): sube hacia el foramen oval, por el que puede entrar en el cráneo; irriga los músculos pterigoideos, el tensor del velo del paladar, la trompa auditiva y el ganglio trigeminal.'),
  'Anterior deep temporal artery': max('945', 'La **arteria temporal profunda anterior**: sube entre el temporal y el hueso de la fosa temporal e irriga la parte anterior del músculo temporal; se anastomosa con la lagrimal.'),
  'Posterior deep temporal artery': max('945', 'La **arteria temporal profunda posterior**: sube entre el temporal y el hueso e irriga la parte posterior del músculo temporal.'),
  'Buccal artery': max('945', 'La **arteria bucal**: baja oblicua adelante con el nervio bucal sobre la cara lateral del buccinador e irriga el músculo, la piel y la mucosa de la mejilla.'),
  'Posterior superior alveolar artery': max('945', 'La **arteria alveolar superior posterior**: nace al entrar la maxilar en la fosa pterigopalatina y desciende por la tuberosidad del maxilar, cuyos forámenes penetra, para los molares y premolares superiores, la encía y el seno maxilar.'),
  'Infra-orbital artery': max('945', 'La **arteria infraorbitaria**: entra en la órbita por la fisura orbitaria inferior, recorre el surco y el conducto infraorbitarios con el nervio y sale a la cara por el **foramen infraorbitario**; da las alveolares superiores anteriores (incisivos y caninos) y se reparte por el párpado inferior, la mejilla y el labio superior.'),
  'Descending palatine artery': max('945', 'La **arteria palatina descendente**: baja por el conducto palatino mayor y se divide en la **palatina mayor**, para el paladar duro, y las palatinas menores, para el velo del paladar y la tonsila.'),
  'Greater palatine artery': max('945', 'La **arteria palatina mayor**: continuación de la palatina descendente, sale por el foramen palatino mayor, junto al último molar, y corre adelante por el paladar duro, junto al proceso alveolar, hasta el conducto incisivo, por donde se anastomosa con la esfenopalatina.'),
  'Artery of pterygoid canal': max('945', 'La **arteria del conducto pterigoideo** (vidiana): nace en la fosa pterigopalatina y va atrás por el conducto pterigoideo con el nervio, hacia la faringe, la trompa auditiva y la caja del tímpano.'),
  'Posterior lateral nasal branches of sphenopalatine artery.': max('945', 'Las **ramas nasales posteriores laterales** de la arteria esfenopalatina, que entra en la cavidad nasal por el foramen esfenopalatino: irrigan los cornetes y los meatos de la pared lateral y los senos paranasales.'),
  'Posterior septal branches of sphenopalatine artery': max('945', 'Las **ramas septales posteriores** de la arteria esfenopalatina: cruzan el techo de la cavidad nasal y bajan por el tabique hasta el conducto incisivo; en la parte anterior del tabique se anastomosan con las etmoidales y la labial superior (área de Kiesselbach), de donde vienen la mayoría de las epistaxis.'),
  // ---------- Internal carotid and the orbit ----------
  'Internal carotid artery': {
    text: [
      'La **carótida interna**, arteria del encéfalo y del ojo: nace en la bifurcación carotídea y sube **sin dar ramas en el cuello**, primero lateral y luego medial a la externa, en el espacio retroestíleo junto a la faringe, con la yugular interna y los últimos nervios craneales, hasta el conducto carotídeo del peñasco.',
      'Recorre el conducto, sale sobre el foramen lacerado y atraviesa el **seno cavernoso** dibujando una S (sifón carotídeo), con el abducens a su lado. Medial a la clinoides anterior da la **oftálmica** y termina dando la cerebral anterior, la cerebral media, la comunicante posterior y la coroidea anterior.',
    ],
    sources: [LR2('945–949'), LR('211–212')],
  },
  'Ophthalmic artery': d(
    '415–418',
    'La **arteria oftálmica**, primera rama de la carótida interna al salir del seno cavernoso: entra en la órbita por el conducto óptico, bajo y lateral al nervio óptico, lo cruza por encima y avanza por la pared medial hasta el ángulo medial del ojo, donde termina en la arteria dorsal de la nariz y la supratroclear.',
    'Sus ramas van al ojo (central de la retina, ciliares), a la glándula lagrimal, a los músculos, a los párpados, a la frente (supraorbitaria) y a las cavidades nasales (etmoidales). Por la angular se anastomosa con la carótida externa.',
  ),
  'Central retinal artery': oph('415–416', 'La **arteria central de la retina**: nace cerca del conducto óptico, penetra en el nervio óptico a 1 cm del globo y llega por su eje a la papila, donde se divide en las ramas de la retina. Es terminal: su oclusión deja ciega la retina en segundos.'),
  'Lacrimal artery': oph('416', 'La **arteria lagrimal**: sigue el borde superior del recto lateral con el nervio lagrimal hasta la glándula lagrimal, que irriga, y termina en los párpados (arterias palpebrales laterales); se anastomosa con la meníngea media.'),
  'Long posterior ciliary arteries': oph('416', 'Las **arterias ciliares posteriores largas**, dos: perforan la esclera junto al nervio óptico y corren hacia delante entre esclera y coroides hasta el cuerpo ciliar, donde forman con las ciliares anteriores el círculo arterial mayor del iris.'),
  'Short posterior ciliary arteries': oph('416', 'Las **arterias ciliares posteriores cortas**, numerosas: perforan la esclera alrededor del nervio óptico e irrigan la **coroides**, de la que se nutren las capas externas de la retina, y la cabeza del nervio.'),
  'Supra-orbital artery': oph('416–417', 'La **arteria supraorbitaria**: corre bajo el techo de la órbita sobre el elevador del párpado con el nervio frontal y sale por la escotadura supraorbitaria a la frente, donde irriga el cuero cabelludo y se anastomosa con la temporal superficial.'),
  'Supratrochlear artery': oph('418', 'La **arteria supratroclear** (frontal medial), rama terminal de la oftálmica: sale de la órbita por su ángulo superomedial, sobre la tróclea, y sube por la frente junto a la línea media.'),
  'Anterior ethmoidal artery': oph('417', 'La **arteria etmoidal anterior**: pasa por el conducto etmoidal anterior a la fosa craneal anterior, sobre la lámina cribosa, y baja por ella a la cavidad nasal; irriga las celdillas etmoidales anteriores, el seno frontal, la duramadre y la parte anterior de las paredes nasales.'),
  'Anterior septal branches of anterior ethmoidal artery': oph('417', 'Las **ramas septales anteriores** de la etmoidal anterior: bajan por la parte anterosuperior del tabique nasal y concurren con la esfenopalatina y la labial superior en el área de Kiesselbach.'),
  'Posterior ethmoidal artery': oph('417', 'La **arteria etmoidal posterior**, más pequeña: pasa por el conducto etmoidal posterior e irriga las celdillas etmoidales posteriores, el seno esfenoidal, la duramadre vecina y la parte alta de la cavidad nasal.'),
  'Septal branches of posterior ethmoidal artery': oph('417', 'Las **ramas septales** de la etmoidal posterior, para la parte superior y posterior del tabique nasal, bajo la lámina cribosa.'),
  // ---------- Arteries of the brain ----------
  'Anterior cerebral artery': aca('La **arteria cerebral anterior**, rama terminal medial de la carótida interna.'),
  'Anterior communicating artery': d('214–215', 'La **arteria comunicante anterior**: corta, transversal, une las dos cerebrales anteriores delante del quiasma óptico y cierra por delante el **círculo arterial cerebral** (de Willis). Si es suficiente, una carótida puede irrigar los dos hemisferios. Es el lugar más frecuente de los aneurismas cerebrales.'),
  'Posterior communicating artery': d('212, 214', 'La **arteria comunicante posterior**: nace de la cara posterior de la carótida interna y va atrás, sobre el nervio oculomotor, hasta la cerebral posterior; forma el lado del círculo arterial cerebral y une el sistema carotídeo al vertebrobasilar. Un aneurisma en su origen comprime el oculomotor.'),
  'Orbitofrontal branches of anterior cerebral artery': aca('Las **ramas orbitofrontales** de la cerebral anterior, sus primeras ramas corticales: irrigan la parte medial de la cara orbitaria del lóbulo frontal y el bulbo y el tracto olfatorios.'),
  'Callosomarginal artery': aca('La **arteria callosomarginal**: nace de la cerebral anterior, corre por el surco del cíngulo y llega a la parte anterior del lobulillo paracentral y, cruzando el borde del hemisferio, a la parte alta del giro precentral (área motora del miembro inferior).'),
  'Frontal branches of callosomarginal artery': aca('Las **ramas frontales** de la callosomarginal (frontal anteromedial, intermediomedial y posteromedial): suben por la cara medial del giro frontal superior y la desbordan por el borde del hemisferio.'),
  'Pericallosal artery': aca('La **arteria pericallosa**, terminación de la cerebral anterior: corre sobre el cuerpo calloso hasta el esplenio, al que irriga junto con el precúneo, y se anastomosa allí con la cerebral posterior.'),
  'Middle cerebral artery (M1-segment)': mca('El **segmento M1** (esfenoidal) de la arteria cerebral media: tronco horizontal desde la bifurcación de la carótida interna hasta el limen de la ínsula. De él nacen las **arterias estriadas laterales**, que penetran por la sustancia perforada anterior.'),
  'Insular branches of middle cerebral artery (M2)': mca('El **segmento M2** (insular) de la cerebral media: sus ramas recorren la ínsula, cuya corteza irrigan antes de llegar a la cápsula extrema, y suben a los bordes del surco lateral.'),
  'Insular branches of middle cerebral artery (M2-segment)': mca('Las **ramas insulares** de la cerebral media (segmento M2): finas arterias del tronco o de sus ramas que irrigan la corteza de la ínsula y terminan en la cápsula extrema.'),
  'Middle cerebral artery (M3 segment)': mca('El **segmento M3** (opercular) de la cerebral media: sus ramas se acodan en los opérculos frontal, parietal y temporal para salir a la cara lateral del hemisferio.'),
  'Middle cerebral artery (M3-segment)': mca('Las **ramas del segmento M3** (opercular) de la cerebral media, que salen por el surco lateral hacia la convexidad del hemisferio.'),
  'Lateral frontobasal artery': mca('La **arteria frontobasal lateral** (orbitofrontal lateral), la primera rama superior de la cerebral media: va adelante y se divide en ramas para la parte lateral de la cara orbitaria del lóbulo frontal.'),
  'Prefrontal artery': mca('La **arteria prefrontal**, rama superior de la cerebral media: nace en la porción opercular del giro frontal inferior (área de Broca) y sube hasta el surco frontal superior.'),
  'Artery of precentral sulcus': mca('La **arteria del surco precentral**, rama superior de la cerebral media: sale de la ínsula al pie del giro precentral y recorre el surco precentral sin llegar al borde superior del hemisferio.'),
  'Artery of central sulcus': mca('La **arteria del surco central** (rolándica), rama superior de la cerebral media: aparece al pie de los giros precentral y poscentral y recorre el surco central; irriga las áreas motora y sensitiva de la cara y el miembro superior.'),
  'Postcentral arterial branch': mca('La **arteria del surco poscentral**, rama superior de la cerebral media: emerge al pie del giro poscentral y sigue el surco intraparietal con sus dos ramas.'),
  'Posterior parietal artery': mca('La **arteria parietal posterior**, rama superior de la cerebral media: sale por la parte posterior del surco lateral, rodea el giro supramarginal y sube hacia atrás por el lobulillo parietal inferior.'),
  'Branch to angular gyrus': mca('La **arteria del giro angular**, rama terminal de la cerebral media: llega por el final del surco lateral al giro angular y al lóbulo occipital, donde se anastomosa con la cerebral posterior.'),
  'Parietal branches of middle cerebral artery': mca('Las **ramas parietales** de la cerebral media (de los surcos central y poscentral, parietal posterior y del giro angular): irrigan la región sensitiva y el lóbulo parietal en la cara lateral.'),
  'Temporal branches of middle cerebral artery': mca('Las **ramas temporales** de la cerebral media (ramas inferiores: del polo temporal, temporal anterior, media y posterior): cruzan el opérculo temporal y los giros del lóbulo temporal, incluida el área auditiva, sin penetrar en sus surcos.'),
  'Anterior temporal branch': mca('La **rama temporal anterior** de la cerebral media: sale por la parte anterior del surco lateral hacia el giro temporal superior y llega hasta el surco temporal inferior.'),
  'Posterior temporal branch': mca('La **rama temporal posterior** de la cerebral media: va atrás y abajo cruzando los giros temporales hasta el surco temporal inferior o el borde inferior del hemisferio.'),
  'Temporo-occipital branch': mca('La **rama temporooccipital** de la cerebral media: la más posterior de las ramas inferiores, para la parte posterior del lóbulo temporal y la unión con el occipital.'),
  'Proximal lateral striate branches': {
    text: [
      'Las **arterias estriadas laterales proximales**, del segmento M1 de la cerebral media: penetran por la sustancia perforada anterior y suben por el núcleo lentiforme y la **cápsula interna**. Son terminales y finas: su rotura o su oclusión, frecuentes en el hipertenso, es la causa clásica de la hemiplejía capsular (Charcot llamó a una de ellas «arteria de la hemorragia cerebral»).',
    ],
    sources: [LR('219')],
  },
  'Distal lateral striate branches': {
    text: [
      'Las **arterias estriadas laterales distales**, más externas, del final del segmento M1 de la cerebral media: suben por el putamen y la cápsula interna hasta el núcleo caudado. Como las proximales, son arterias terminales.',
    ],
    sources: [LR('219')],
  },
  'Posterior cerebral artery': pca('La **arteria cerebral posterior**, rama terminal de la basilar.'),
  'Lateral occipital artery': pca('La **arteria occipital lateral**, rama terminal de la cerebral posterior: se reparte por la cara inferior del lóbulo temporal (ramas temporales) y la parte lateral del occipital.'),
  'Medial occipital artery': pca('La **arteria occipital medial**, rama terminal de la cerebral posterior: da las ramas **calcarina**, para la corteza visual, y parietooccipital, y una rama para el esplenio del cuerpo calloso.'),
  'Parieto-occipital artery': pca('La **rama parietooccipital** de la cerebral posterior: sube por el surco parietooccipital hacia el precúneo y la cuña.'),
  'Basilar artery': d('212–214', 'La **arteria basilar**, impar: nace de la unión de las dos vertebrales en el surco bulbopontino y sube por el surco basilar del puente, detrás del clivus, hasta el borde superior del puente, donde se divide en las dos **cerebrales posteriores**. Da las ramas pontinas, la laberíntica, la cerebelosa anteroinferior y la superior; su oclusión es grave (tronco encefálico).'),
  'Medial pontine branches of basilar artery': d('212', 'Las **ramas pontinas mediales** (paramedianas) de la basilar: numerosas, delgadas y cortas, nacen de su cara posterior y penetran en el puente junto a la línea media.'),
  'Lateral pontine branches of basilar artery': d('213', 'Las **ramas pontinas laterales** (circunferenciales cortas) de la basilar: rodean el puente e irrigan su cara anterolateral, el pedúnculo cerebeloso medio y la emergencia de los nervios trigémino, facial y vestibulococlear.'),
  'Superior cerebellar artery': d('214', 'La **arteria cerebelosa superior**: nace de la basilar justo antes de su terminación, rodea el pedúnculo cerebral por debajo del oculomotor y por encima del trigémino, e irriga la cara superior del cerebelo, el vermis superior y el mesencéfalo. Separa el oculomotor de la cerebral posterior, que pasa por encima.'),
  'Anterior inferior cerebellar artery': d('214', 'La **arteria cerebelosa anteroinferior**: nace del tercio inferior de la basilar, se dirige al flóculo en asa, junto a los nervios facial y vestibulococlear (a menudo da la arteria laberíntica, del oído interno), e irriga la parte anterior de la cara inferior del cerebelo y el puente.'),
  'Posterior inferior cerebellar artery': d('213–214', 'La **arteria cerebelosa posteroinferior**, la mayor rama de la vertebral: rodea la médula oblongada, muy sinuosa, entre las raíces del hipogloso, vago y accesorio, y se reparte por la cara inferior del hemisferio cerebeloso y el vermis inferior. Su oclusión da el síndrome bulbar lateral (de Wallenberg).'),
  'Anterior spinal artery': d('212, 143', 'La **arteria espinal anterior**, formada por la unión de dos ramas de las vertebrales delante de la médula oblongada: baja por la fisura media anterior de la médula hasta el cono, reforzada por las arterias radiculares, e irriga los dos tercios anteriores de la médula.'),
  'Vertebral artery': {
    text: [
      'La **arteria vertebral**, primera rama de la subclavia: sube detrás del escaleno anterior y entra en el **foramen transverso de C6**; recorre los forámenes transversos hasta el atlas, rodea por detrás su masa lateral en el surco del arco posterior y perfora la membrana atlantooccipital y la duramadre.',
      'Entra en el cráneo por el **foramen magno**, rodea la médula oblongada y se une a la del otro lado en el surco bulbopontino para formar la **basilar**. Da ramas espinales, la espinal anterior y la cerebelosa posteroinferior.',
    ],
    sources: [LR2('955–957'), LR('212')],
  },
  // ---------- Subclavian ----------
  'Right subclavian artery': SUBCLAVIAN('derecha', 'nace del **tronco braquiocefálico** detrás de la articulación esternoclavicular derecha, y sólo tiene porción cervical.'),
  'Left subclavian artery': SUBCLAVIAN('izquierda', 'nace directamente del **arco aórtico**, por detrás de la carótida común, y sube por el mediastino superior antes de entrar en el cuello, por lo que es más larga.'),
  'Thyrocervical trunk': d2('958', 'El **tronco tirocervical**, corto, de la cara anterior de la subclavia en el borde medial del escaleno anterior: da la **tiroidea inferior**, la cervical ascendente, la supraescapular y la cervical transversa (que a menudo nacen de él).'),
  'Inferior thyroid artery': {
    text: [
      'La **arteria tiroidea inferior**, rama del tronco tirocervical: sube delante del escaleno anterior, hace un arco a la altura del tubérculo carotídeo de C6, detrás de la vaina carotídea y delante de la vertebral, y baja al polo inferior del lóbulo tiroideo. Junto a la glándula se cruza con el **nervio laríngeo recurrente**, que hay que respetar al ligarla.',
      'Irriga la tiroides, las paratiroides, la laringe (laríngea inferior), la tráquea y el esófago; da la cervical ascendente.',
    ],
    sources: [LR2('958, 1588'), LR('83')],
  },
  'Transverse cervical artery': d2('958–959', 'La **arteria cervical transversa**, del tronco tirocervical: cruza el triángulo posterior del cuello por delante del escaleno y del plexo braquial hasta el borde anterior del trapecio, donde se divide en una rama superficial y otra profunda.'),
  '(Superficial branch of transverse cervical artery)': d2('958–959', 'La **rama superficial** de la cervical transversa (arteria cervical superficial): sube bajo el trapecio con el nervio accesorio e irriga el trapecio y los músculos vecinos.'),
  '(Deep branch of transverse cervical artery)': d2('958–959', 'La **rama profunda** de la cervical transversa (arteria dorsal de la escápula): baja a lo largo del borde medial de la escápula con el nervio dorsal de la escápula, bajo el elevador y los romboides, a los que irriga; se anastomosa con las arterias de la escápula. A menudo nace directamente de la subclavia.'),
  'Costocervical trunk': d2('961', 'El **tronco costocervical**, de la cara posterior de la subclavia detrás del escaleno anterior: va atrás sobre la cúpula pleural hasta el cuello de la primera costilla, donde se divide en **intercostal suprema**, para los dos primeros espacios, y **cervical profunda**.'),
  'Deep cervical artery': d2('961', 'La **arteria cervical profunda**, rama del tronco costocervical: pasa entre el transverso de C7 y la primera costilla y sube por la nuca entre el semiespinoso de la cabeza y el del cuello, anastomosada con la occipital y la vertebral.'),
}

const veins: Record<string, Description> = {
  // ---------- Neck ----------
  'Internal jugular vein': d2(
    '976–980',
    'La **yugular interna**, la gran vena del encéfalo y del cuello: continúa el seno sigmoideo en el **foramen yugular**, donde forma un bulbo, y baja por el cuello en la vaina carotídea, lateral a la carótida interna y luego a la común, con el vago detrás entre ambas, cubierta por el esternocleidomastoideo. Detrás de la articulación esternoclavicular se une a la subclavia para formar la braquiocefálica.',
    'Recibe el seno petroso inferior, el tronco tirolinguofacial (facial, lingual y tiroidea superior), las faríngeas y la tiroidea media. A lo largo de ella se escalonan los nodos cervicales profundos.',
  ),
  'External jugular vein': d2('981–982', 'La **yugular externa**: nace en la parótida, bajo la oreja, de la unión de la retromandibular y la auricular posterior, y baja oblicua sobre el **esternocleidomastoideo**, bajo el platisma, visible bajo la piel cuando se esfuerza la voz o en la insuficiencia cardíaca; perfora la fascia sobre la clavícula y termina en la subclavia. Recibe la yugular anterior y las cervicales transversa y supraescapular.'),
  'Anterior jugular vein': d2('983', 'La **yugular anterior**, pequeña: nace bajo el mentón y baja cerca de la línea media; por encima del esternón se une a la del otro lado por el **arco venoso yugular**, en el espacio supraesternal, y luego va lateral bajo el esternocleidomastoideo hasta la yugular externa o la subclavia. Se encuentra en la traqueotomía.'),
  'Facial vein': d2('980', 'La **vena facial**: continúa la angular desde el ángulo del ojo y baja en línea recta, detrás de la arteria facial, profunda a los cigomáticos, hasta el borde inferior de la mandíbula delante del masetero; en el cuello pasa sobre la glándula submandibular y se une a la retromandibular. Sin válvulas eficaces, comunica por la oftálmica y la profunda de la cara con el seno cavernoso: las infecciones del labio superior y la nariz pueden llegar a él.'),
  'Common facial vein': d2('980–981', 'La **vena facial común**: tronco corto de la unión de la facial con la rama anterior de la retromandibular, bajo el ángulo de la mandíbula; recibe a menudo la lingual y la tiroidea superior (tronco tirolinguofacial) y desemboca en la yugular interna a la altura del hioides.'),
  'Angular vein': d2('980', 'La **vena angular**, origen de la facial en el ángulo medial del ojo, por la unión de las venas supratroclear y supraorbitaria: se anastomosa con la vena oftálmica superior y comunica así la cara con el seno cavernoso.'),
  'Superior labial vein': d2('980', 'La **vena labial superior**, satélite de la arteria: recoge la sangre del labio superior y la lleva a la vena facial.'),
  'Inferior labial veins': d2('980', 'Las **venas labiales inferiores**, satélites de la arteria: recogen la sangre del labio inferior y la llevan a la vena facial.'),
  'Submental vein': d2('980', 'La **vena submentoniana**, satélite de la arteria, sobre el milohioideo: recoge la sangre del mentón y del suelo de la boca y termina en la facial; se anastomosa con la yugular anterior.'),
  'Lingual vein': d2('980–981', 'La **vena lingual**: recoge la sangre de la lengua por la vena profunda, visible bajo su cara inferior, y la dorsal; acompaña al hipogloso y termina en la yugular interna o en el tronco tirolinguofacial.'),
  'Superior thyroid vein': d2('981', 'La **vena tiroidea superior**, satélite de la arteria: sale del polo superior del lóbulo tiroideo, recibe venas laríngeas y termina en la yugular interna o en el tronco tirolinguofacial.'),
  'Retromandibular vein': d2('982', 'La **vena retromandibular**: vertical en la celda parotídea, detrás de la rama de la mandíbula, nace de la unión de las temporales superficiales y las maxilares y baja lateral a la carótida externa, cruzada por el nervio facial. En el ángulo de la mandíbula se divide en una rama anterior, hacia la facial, y otra posterior, hacia la yugular externa.'),
  'Anterior division of retromandibular vein': d2('982', 'La **rama anterior** de la vena retromandibular: va adelante bajo el ángulo de la mandíbula y se une a la facial para formar la facial común.'),
  'Posterior division of retromandibular vein': d2('982', 'La **rama posterior** de la vena retromandibular: se une a la auricular posterior para formar la yugular externa.'),
  'Superficial temporal veins': d2('982', 'Las **venas temporales superficiales**, satélites de la arteria, delante del trago: recogen la sangre del cuero cabelludo de la sien y forman con las maxilares la vena retromandibular.'),
  'Maxillary veins': d2('982', 'Las **venas maxilares**: troncos cortos que salen del **plexo pterigoideo**, en la fosa infratemporal, y van atrás con la arteria maxilar hasta la parótida, donde forman la retromandibular. El plexo comunica con el seno cavernoso y con la vena facial.'),
  'Posterior auricular vein': d2('982', 'La **vena auricular posterior**: recoge la sangre de la región detrás de la oreja y forma, con la rama posterior de la retromandibular, la yugular externa.'),
  'Occipital vein': d2('982', 'La **vena occipital**: recoge la sangre del cuero cabelludo de la región occipital y termina en el plexo venoso suboccipital o en la yugular externa; comunica con el seno transverso por la vena emisaria mastoidea.'),
  'Vertebral vein': d2('984', 'La **vena vertebral**: nace del plexo venoso suboccipital, baja por los forámenes transversos alrededor de la arteria vertebral, como un plexo, y sale por el de C6 (o C7) para terminar en la **braquiocefálica**. Recibe los plexos vertebrales.'),
  'Right brachiocephalic vein': BRACHIOCEPHALIC_VEIN('derecha', 'Corta, de no más de 3 cm, baja casi vertical a la derecha del tronco braquiocefálico.'),
  'Left brachiocephalic vein': BRACHIOCEPHALIC_VEIN('izquierda', 'Larga, de unos 5 cm y algo más gruesa, cruza casi horizontal por detrás del manubrio, por **delante de las tres ramas del arco aórtico**, hacia la derecha.'),
  'Right subclavian vein': SUBCLAVIAN_VEIN('derecha'),
  'Left subclavian vein': SUBCLAVIAN_VEIN('izquierda'),
  // ---------- Dural sinuses and orbit ----------
  'Superior sagittal sinus': sinus('200–201, 203', 'El **seno sagital superior**, impar, en el borde adherente de la **hoz del cerebro**, a lo largo de la línea media de la bóveda, del foramen ciego a la protuberancia occipital interna, donde forma la confluencia de los senos. Triangular, recibe las venas cerebrales superiores y, en sus lagunas laterales, las **granulaciones aracnoideas**, por donde vuelve el líquido cerebroespinal a la sangre.'),
  'Inferior sagittal sinus': sinus('201', 'El **seno sagital inferior**, delgado, en el borde libre de la hoz del cerebro, sobre el cuerpo calloso: recibe venas de la hoz y del cerebro y se une a la vena cerebral magna para formar el seno recto.'),
  'Straight sinus': sinus('200–201', 'El **seno recto**, impar, en la unión de la hoz del cerebro con la tienda del cerebelo: continúa el seno sagital inferior y la **vena cerebral magna** (de Galeno), que drena el interior del cerebro, y baja hasta la confluencia de los senos.'),
  'Transverse sinus': sinus('203', 'El **seno transverso**, par, en el borde adherente de la **tienda del cerebelo**: de la confluencia de los senos va lateralmente por el surco del occipital y del parietal hasta la base del peñasco, donde se continúa con el sigmoideo. Suele ser mayor el derecho, que continúa el sagital superior.'),
  'Sigmoid sinus': sinus('203', 'El **seno sigmoideo**, par, continuación del transverso: baja en S por el surco de la cara interna de la mastoides hasta el **foramen yugular**, donde se continúa con la yugular interna. Sólo una lámina ósea lo separa de las celdillas mastoideas: una mastoiditis puede trombosarlo.'),
  'Occipital sinus': sinus('201', 'El **seno occipital**, pequeño e impar, en el borde adherente de la hoz del cerebelo: une la confluencia de los senos con los plexos venosos del foramen magno.'),
  'Cavernous sinus': sinus('201–203', 'El **seno cavernoso**, par, a cada lado de la silla turca y del cuerpo del esfenoides, de la fisura orbitaria superior al vértice del peñasco: un espacio venoso tabicado por trabéculas que **atraviesan la carótida interna**, con el abducens junto a ella; en su pared lateral corren el oculomotor, el troclear, el oftálmico y el maxilar. Recibe las venas oftálmicas y comunica con el plexo pterigoideo y la vena facial; drena en los petrosos.'),
  'Anterior intercavernous sinus': sinus('202–203', 'El **seno intercavernoso anterior**: une los dos senos cavernosos por delante de la hipófisis, en el diafragma selar; con el posterior forma un anillo venoso alrededor de ella.'),
  'Posterior intercavernous sinus': sinus('202–203', 'El **seno intercavernoso posterior**: une los dos senos cavernosos por detrás de la hipófisis, en el diafragma selar.'),
  'Superior petrosal sinus': sinus('203', 'El **seno petroso superior**, par, en el borde superior del peñasco, en la inserción de la tienda del cerebelo: une el seno cavernoso al final del transverso.'),
  'Inferior petrosal sinus': sinus('203', 'El **seno petroso inferior**, par, en el surco entre el peñasco y el occipital: une el seno cavernoso al bulbo de la yugular interna, a la que llega por la parte anterior del foramen yugular.'),
  'Basilar venous plexus': sinus('203', 'El **plexo basilar**: red venosa sobre el clivus, detrás del dorso de la silla, entre las dos hojas de la duramadre: une los senos cavernosos y petrosos inferiores con los plexos vertebrales internos por el foramen magno.'),
  'Superior ophthalmic vein': d('418, 201', 'La **vena oftálmica superior**: nace en el ángulo medial del ojo de la anastomosis con la angular, recorre la órbita bajo el techo con la arteria y sale por la fisura orbitaria superior al **seno cavernoso**. Sin válvulas, une la cara con el seno.'),
  'Inferior ophthalmic vein': d('418', 'La **vena oftálmica inferior**: nace de una red en el suelo de la órbita, se une a la superior o termina directamente en el seno cavernoso, y comunica con el plexo pterigoideo por la fisura orbitaria inferior.'),
}

const lymph: Record<string, Description> = {
  'Occipital nodes': nodes('1014', '267', 'Los **nodos occipitales**, en la parte posterior del anillo linfático pericraneocervical: superficiales a la altura de la línea nucal superior, subfasciales y bajo el esplenio. Drenan el cuero cabelludo occipital y la nuca y vierten en la cadena del nervio accesorio.'),
  'Mastoid nodes': nodes('1014', '267', 'Los **nodos mastoideos** (retroauriculares), tres o cuatro, inconstantes, sobre la inserción del esternocleidomastoideo en la mastoides: drenan la región parietal, la cara posterior de la oreja y el conducto auditivo externo.'),
  'Superficial parotid nodes': nodes('1014', '267–268', 'Los **nodos parotídeos superficiales**, dos o tres, sobre la parótida, delante del trago: drenan la región frontotemporal, los párpados y la oreja.'),
  'Pre-auricular nodes': nodes('1014', '267–268', 'Los **nodos preauriculares**, delante del trago, sobre o bajo la fascia parotídea: drenan los párpados, la región temporal y el pabellón de la oreja.'),
  'Infra-auricular nodes': nodes('1014', '267–268', 'Los **nodos infraauriculares**, bajo el lóbulo de la oreja, alrededor de la yugular externa a su salida de la parótida: drenan la oreja y la mejilla.'),
  'Intraglandular parotid nodes': nodes('1014', '267–268', 'Los **nodos parotídeos intraglandulares**, en el espesor de la glándula, junto a la vena retromandibular: reciben la linfa de la glándula, de la nariz, del oído medio y de los nodos superficiales, y la llevan a los cervicales profundos.'),
  'Submandibular nodes': nodes('1014', '268', 'Los **nodos submandibulares**, tres a seis, bajo el borde inferior de la mandíbula, junto a los vasos faciales (pre y retrovasculares): drenan la cara, la nariz, los labios, las encías, los dientes y los bordes de la lengua, y los nodos faciales y submentonianos. Llevan su linfa a los yugulares internos; se agrandan en las infecciones dentarias.'),
  'Submental nodes': nodes('1014', '268', 'Los **nodos submentonianos**, dos o tres, sobre el milohioideo entre los vientres anteriores de los dos digástricos: drenan el mentón, la parte media del labio inferior, la encía inferior, el suelo de la boca y la punta de la lengua.'),
  'Mandibular node': nodes('1014', '268', 'El **nodo mandibular**, uno de los nodos faciales, inconstante: sobre la mandíbula, en el ángulo anteroinferior del masetero, junto a los vasos faciales. Lleva la linfa de la cara a los submandibulares.'),
  'Bucinator node': nodes('1014', '268', 'El **nodo buccinador**, uno de los nodos faciales, inconstante: sobre la cara lateral del buccinador, junto a la vena facial. Recibe linfa de la mejilla y los labios y la lleva a los submandibulares.'),
  'Nasolabial node': nodes('1014', '268', 'El **nodo nasolabial** (infraorbitario), uno de los nodos faciales, inconstante: en el surco nasolabial, junto a la vena facial. Recibe linfa de la nariz y los párpados.'),
  'Retropharyngeal nodes': nodes('1014', '270', 'Los **nodos retrofaríngeos**, generalmente dos a cada lado, delante de la lámina prevertebral frente a las masas laterales del atlas, en el borde de la pared posterior de la faringe: drenan las cavidades nasales, la nasofaringe y la trompa auditiva. En el niño pueden supurar (absceso retrofaríngeo).'),
  'Superficial anterior cervical nodes': nodes('1014', '268', 'Los **nodos cervicales anteriores superficiales**, pequeños, a lo largo de la vena yugular anterior: forman una vía que termina en los yugulares internos o en los transversos del cuello.'),
  'Thyroid nodes': nodes('1014–1015', '271', 'Los **nodos tiroideos**, nodos cervicales anteriores profundos delante del istmo y los lóbulos de la glándula tiroides: reciben su linfa y la llevan a los pretraqueales y a los yugulares.'),
  'Pretracheal nodes': nodes('1015', '271', 'Los **nodos pretraqueales**, delante de la tráquea, bajo el istmo tiroideo: reciben la linfa de la tiroides y de la tráquea y la llevan a los paratraqueales o a los yugulares internos.'),
  'Paratracheal cervical nodes': nodes('1015', '271', 'Los **nodos paratraqueales cervicales** (recurrenciales), pequeños, escalonados a lo largo del nervio laríngeo recurrente a los lados de la tráquea: drenan la laringe, la tráquea, el esófago y la tiroides.'),
  'Superficial lateral cervical nodes': nodes('1015', '268–269', 'Los **nodos cervicales laterales superficiales**, uno a cuatro, a lo largo de la vena yugular externa sobre el esternocleidomastoideo: recogen la linfa de la oreja y de la parte baja de la parótida y la llevan a los yugulares internos.'),
  'Jugulodigastric node': nodes('1014–1015', '270', 'El **nodo yugulodigástrico**, el más alto y voluminoso de los cervicales profundos: en el cruce de la vena yugular interna con el vientre posterior del digástrico, bajo el ángulo de la mandíbula. Recibe la linfa de la **tonsila palatina**, la faringe y la lengua: es el que se agranda en las amigdalitis.'),
  'Lateral superior jugular node': nodes('1015', '270', 'Los **nodos yugulares laterales superiores**, del grupo cervical profundo superior: se escalonan a lo largo del borde lateral de la vena yugular interna, bajo el esternocleidomastoideo.'),
  'Inferior deep lateral cervical nodes': nodes('1015', '270', 'Los **nodos cervicales laterales profundos inferiores**, a lo largo de la parte baja de la yugular interna, desde el omohioideo (nodo yuguloomohioideo, que drena la lengua) hasta la base del cuello. Reciben la linfa de los superiores y de los grupos de la cabeza; sus eferentes forman el **tronco yugular**.'),
  'Anterior inferior jugular nodes': nodes('1015', '270', 'Los **nodos yugulares anteriores inferiores**, delante de la parte baja de la vena yugular interna, entre el omohioideo y la base del cuello; drenan en el tronco yugular.'),
  'Supraclavicular nodes': nodes('1015', '270', 'Los **nodos supraclaviculares**, de la cadena transversa del cuello, a lo largo de la arteria cervical transversa sobre la clavícula, cerca del confluente yugulosubclavio. El agrandado del lado izquierdo (de Virchow o Troisier) puede ser la primera señal de un cáncer abdominal, por su vecindad con la terminación del conducto torácico.'),
  'Palatine tonsil': {
    text: [
      'La **tonsila palatina** (amígdala), órgano linfoide par en la fosa tonsilar de la orofaringe, entre los arcos palatogloso y palatofaríngeo: su cara medial, libre, tiene criptas; la lateral está separada del constrictor superior por una cápsula. Forma con la faríngea y la lingual el **anillo linfático de la faringe** (de Waldeyer).',
      'La irriga sobre todo la rama tonsilar de la facial; su linfa va al nodo yugulodigástrico. Está a 1–2 cm de la carótida interna, por fuera de la pared faríngea.',
    ],
    sources: [LR2('1191, 1210')],
  },
}

export const headNeckVessels: Record<string, Description> = { ...arteries, ...veins, ...lymph }
