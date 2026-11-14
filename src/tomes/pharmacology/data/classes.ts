import type { DrugClass } from './types'

const K = (p: string) => ({ source: 'katzung' as const, p })
const G = (p: string) => ({ source: 'goodman' as const, p })

/** Benzodiazepines by elimination half-life (with active metabolites), after Goodman & Gilman. */
export const BZD_DURATION = { short: 6, long: 24 } as const

export const classes: DrugClass[] = [
  // — Ansiolíticos y sedantes-hipnóticos (Katzung cap. 22; G&G caps. 15 y 19)
  {
    id: 'sedative-hypnotics',
    title: 'Ansiolíticos y sedantes-hipnóticos',
    book: 'sedative-hypnotics',
    summary:
      'Fármacos que calman la ansiedad (sedación) o inducen y mantienen el sueño (hipnosis). Los reúne el uso clínico, no la estructura química.',
    adverse: [
      'Somnolencia, juicio alterado y torpeza motora, con riesgo al conducir',
      'Depresión del SNC que se suma a la del alcohol y otros depresores',
      'Tolerancia y dependencia con el uso prolongado; abstinencia al suspenderlos bruscamente',
      'Más sensibilidad en ancianos: bastan dosis de la mitad',
    ],
    refs: [K('381'), K('389-390'), K('392')],
  },
  {
    id: 'benzodiazepines',
    parent: 'sedative-hypnotics',
    title: 'Benzodiacepinas',
    summary:
      'Un anillo de benceno fundido a uno de diacepina de siete miembros, con un arilo en la posición 5. Ansiolíticas, hipnóticas, anticonvulsivas y relajantes musculares en distinto grado.',
    mechanism:
      'Se unen al sitio BZ del receptor GABA-A, entre una subunidad α y la γ, y aumentan su afinidad por el GABA: el canal de cloruro se abre con más frecuencia. No lo abren por sí mismas, sino que dependen del GABA liberado, y de ahí su amplio margen de seguridad.',
    adverse: [
      'Amnesia anterógrada dependiente de la dosis',
      'Reacciones paradójicas raras: desinhibición, agitación, agresividad',
      'Abstinencia con ansiedad e insomnio de rebote; con semividas cortas, incluso entre dosis',
    ],
    refs: [G('340-341'), K('386-387'), G('344'), K('389-390')],
  },
  {
    id: 'bzd-short',
    parent: 'benzodiazepines',
    title: 'De acción corta',
    summary: `Semivida menor de ${BZD_DURATION.short} horas. Hipnóticos e inductores de sedación para procedimientos.`,
    refs: [G('342')],
  },
  {
    id: 'bzd-intermediate',
    parent: 'benzodiazepines',
    title: 'De acción intermedia',
    summary: `Semivida de ${BZD_DURATION.short} a ${BZD_DURATION.long} horas.`,
    refs: [G('342')],
  },
  {
    id: 'bzd-long',
    parent: 'benzodiazepines',
    title: 'De acción prolongada',
    summary: `Semivida mayor de ${BZD_DURATION.long} horas, casi siempre por metabolitos activos como el desmetildiazepam. Se acumulan con dosis repetidas.`,
    refs: [G('342'), K('384')],
  },
  {
    id: 'bzd-antagonists',
    parent: 'sedative-hypnotics',
    title: 'Antagonistas de las benzodiacepinas',
    summary: 'Ocupan el sitio BZ sin modular el receptor y desplazan de él a los agonistas.',
    refs: [K('390')],
  },
  {
    id: 'barbiturates',
    parent: 'sedative-hypnotics',
    title: 'Barbitúricos',
    summary:
      'Derivados del ácido barbitúrico con grupos alquilo o arilo en la posición 5. Desplazados por las benzodiacepinas, quedan para usos especiales: epilepsia y anestesia.',
    mechanism:
      'Se unen al receptor GABA-A en un sitio propio y prolongan cada apertura del canal de cloruro. A concentraciones altas lo abren sin GABA y además bloquean los receptores AMPA del glutamato: por eso pueden llevar a la anestesia y al coma, y su margen de seguridad es estrecho.',
    adverse: [
      'Margen de seguridad estrecho: diez veces la dosis hipnótica puede ser mortal',
      'Inducción de las enzimas hepáticas, con muchas interacciones (anticonceptivos orales, entre otros)',
      'Contraindicados en la porfiria aguda intermitente y la porfiria variegata',
      'Excitación paradójica, sobre todo en ancianos',
    ],
    refs: [G('346-349'), K('387'), K('393')],
  },
  {
    id: 'barbiturates-ultrashort',
    parent: 'barbiturates',
    title: 'De acción ultracorta',
    summary:
      'Muy liposolubles, entran en el cerebro en segundos y se usan para inducir la anestesia. Su efecto acaba por redistribución a músculo y grasa, no por eliminación.',
    refs: [G('346'), K('388')],
  },
  {
    id: 'barbiturates-intermediate',
    parent: 'barbiturates',
    title: 'De acción corta e intermedia',
    summary:
      'Los antiguos hipnóticos. Una dosis duerme unas horas, pero su semivida pasa del día y se acumulan con dosis repetidas.',
    refs: [G('346-347')],
  },
  {
    id: 'barbiturates-long',
    parent: 'barbiturates',
    title: 'De acción prolongada',
    summary: 'Con un fenilo en la posición 5, tienen una acción anticonvulsiva selectiva.',
    refs: [G('348')],
  },
  {
    id: 'z-drugs',
    parent: 'sedative-hypnotics',
    title: 'Fármacos Z',
    summary:
      'Hipnóticos que no son benzodiacepinas por estructura (imidazopiridina, pirazolopirimidina, ciclopirrolona) pero actúan en el mismo sitio. Inducen el sueño sin ser anticonvulsivos ni relajantes musculares.',
    mechanism:
      'Agonistas del sitio BZ solo en los receptores GABA-A con subunidad α1, la que media la sedación y la amnesia. El flumazenil revierte su efecto.',
    adverse: [
      'Conductas complejas durante el sueño sin recuerdo, como conducir dormido',
      'Insomnio de rebote con dosis altas; abstinencia más leve que con las benzodiacepinas',
    ],
    refs: [K('382'), K('386-389'), K('392'), G('345')],
  },
  {
    id: 'melatonin-agonists',
    parent: 'sedative-hypnotics',
    title: 'Agonistas de la melatonina',
    summary: 'Imitan a la melatonina, la señal nocturna del reloj biológico.',
    mechanism:
      'Agonistas de los receptores MT1 (que inicia el sueño) y MT2 (que ajusta el ritmo circadiano) del núcleo supraquiasmático. No actúan sobre el receptor GABA-A.',
    refs: [K('384'), G('346')],
  },
  {
    id: 'orexin-antagonists',
    parent: 'sedative-hypnotics',
    title: 'Antagonistas de la orexina',
    summary:
      'Las orexinas A y B, péptidos del hipotálamo lateral, mantienen la vigilia: aumentan de día y callan durante el sueño. Bloquearlas facilita dormir.',
    mechanism: 'Antagonistas de los receptores de orexina OX1 y OX2.',
    refs: [K('390'), G('350')],
  },
  {
    id: 'azapirones',
    parent: 'sedative-hypnotics',
    title: 'Agonistas parciales 5-HT1A',
    summary:
      'Ansiolíticos sin sedación, sin efecto anticonvulsivo ni relajante y casi sin dependencia, que tardan semanas en actuar.',
    mechanism: 'Agonistas parciales de los receptores 5-HT1A de la serotonina; no actúan sobre el sistema GABA.',
    refs: [K('385')],
  },
  {
    id: 'older-sedatives',
    parent: 'sedative-hypnotics',
    title: 'Otros sedantes-hipnóticos antiguos',
    summary:
      'Estructuras diversas que se comportan como los barbitúricos: hipnosis profunda, índice terapéutico bajo, tolerancia y dependencia.',
    mechanism:
      'Deprimen el SNC de forma dependiente de la dosis, como los barbitúricos: de la sedación a la hipnosis profunda, con poca o ninguna analgesia.',
    refs: [K('381'), G('349')],
  },
  {
    id: 'sedating-antihistamines',
    parent: 'sedative-hypnotics',
    title: 'Antihistamínicos sedantes',
    summary:
      'Antagonistas H1 de primera generación que cruzan al encéfalo. Algunos se venden sin receta como ayuda para dormir.',
    mechanism: 'Bloquean los receptores H1 de la histamina en el encéfalo; muchos bloquean también los muscarínicos.',
    adverse: ['Somnolencia residual por la mañana', 'Efectos sobre el sistema nervioso autónomo periférico'],
    refs: [K('382-383'), G('350')],
  },

  // — Antiepilépticos (Katzung cap. 24), by molecular target as in its cuadro 24-2
  {
    id: 'antiepileptics',
    title: 'Antiepilépticos',
    book: 'antiepileptics',
    summary:
      'Fármacos que previenen las crisis epilépticas, tomados a diario y durante años, o que detienen una crisis en curso. Se eligen por el tipo de crisis.',
    mechanism:
      'Inclinan hacia la inhibición el equilibrio entre la excitación del glutamato y la inhibición del GABA: reducen la capacidad de las neuronas de disparar a alta frecuencia y en sincronía, refuerzan la inhibición GABAérgica o frenan la excitación glutamatérgica.',
    adverse: [
      'Ninguno es del todo seguro en el embarazo; el valproato, el fenobarbital y el topiramato son los de más riesgo',
      'Suspenderlos de golpe puede traer de vuelta las crisis e incluso un estado epiléptico',
      'Alerta de la FDA (2008) por ideas y conductas suicidas, sin prueba firme de un efecto de clase',
    ],
    refs: [K('409-411'), K('434')],
  },
  {
    id: 'ae-sodium',
    parent: 'antiepileptics',
    title: 'Bloqueadores de los canales de sodio',
    summary:
      'El grupo más usado para las crisis focales. La mayoría salieron de la prueba del electrochoque máximo en roedores.',
    mechanism:
      'Se unen al canal de sodio dependiente de voltaje cuando está inactivado y lo retienen en ese estado. Como en una ráfaga los canales pasan una y otra vez por la inactivación, el bloqueo se acumula: frenan las descargas rápidas de una crisis y apenas tocan el disparo normal (bloqueo dependiente del uso y del voltaje).',
    adverse: [
      'Mareo, visión doble y ataxia, dependientes de la dosis',
      'Pueden empeorar las ausencias y las mioclonías de las epilepsias generalizadas idiopáticas',
      'Contraindicados en el síndrome de Dravet por mutación de SCN1A',
    ],
    refs: [K('409-410'), K('413-415'), K('430')],
  },
  {
    id: 'ae-calcium-t',
    parent: 'antiepileptics',
    title: 'Bloqueadores de los canales de calcio T',
    summary: 'Los fármacos de las crisis de ausencia.',
    mechanism:
      'Inhiben los canales de calcio de tipo T, activados por bajo voltaje, de las neuronas talamocorticales, que sostienen las descargas de punta-onda a 3 Hz de las ausencias.',
    refs: [K('428-429')],
  },
  {
    id: 'ae-alpha2delta',
    parent: 'antiepileptics',
    title: 'Ligandos de α2δ (gabapentinoides)',
    summary:
      'Nacieron como análogos del GABA, pero no actúan sobre él. Más usados para el dolor neuropático y la ansiedad que para la epilepsia.',
    mechanism:
      'Se unen con avidez a α2δ, una subunidad auxiliar de los canales de calcio dependientes de voltaje; probablemente reducen así la liberación de glutamato. No actúan sobre los receptores ni el metabolismo del GABA.',
    adverse: ['Somnolencia, mareo y ataxia, sobre todo al empezar', 'Aumento de peso y edema periférico'],
    refs: [K('420')],
  },
  {
    id: 'ae-gaba',
    parent: 'antiepileptics',
    title: 'Potenciadores del GABA',
    summary: 'Refuerzan la inhibición: unos modulan el receptor GABA-A, otros dejan más GABA en la sinapsis.',
    mechanism:
      'Las benzodiacepinas, los barbitúricos y la primidona son moduladores alostéricos positivos del receptor GABA-A. La vigabatrina impide que se degrade el GABA (inhibe la GABA-transaminasa) y la tiagabina, que se recapte (bloquea el transportador GAT-1).',
    refs: [K('411-413'), K('431')],
  },
  {
    id: 'ae-potassium',
    parent: 'antiepileptics',
    title: 'Abridores de los canales de potasio Kv7',
    summary: 'Refuerzan un freno natural de la excitabilidad neuronal.',
    mechanism:
      'Abren los canales de potasio KCNQ (Kv7.2-Kv7.5) de axones y terminales; en las presinápticas, eso reduce la liberación de glutamato.',
    refs: [K('411'), K('421')],
  },
  {
    id: 'ae-sv2a',
    parent: 'antiepileptics',
    title: 'Ligandos de SV2A',
    summary: 'Actúan sobre la maquinaria que libera el neurotransmisor.',
    mechanism:
      'Se unen a SV2A, una proteína de las vesículas sinápticas, y reducen la liberación de glutamato durante las ráfagas de alta frecuencia.',
    refs: [K('423')],
  },
  {
    id: 'ae-ampa',
    parent: 'antiepileptics',
    title: 'Antagonistas del receptor AMPA',
    summary: 'Bloquean el principal receptor de la excitación sináptica.',
    mechanism:
      'Antagonistas no competitivos del receptor AMPA del glutamato, que media la excitación local en el foco y su propagación a distancia.',
    refs: [K('423')],
  },
  {
    id: 'ae-multiple',
    parent: 'antiepileptics',
    title: 'De mecanismo múltiple o desconocido',
    summary: 'Varios blancos a la vez, o ninguno identificado con certeza. Suelen ser de amplio espectro.',
    mechanism:
      'No hay consenso sobre su blanco: actúan sobre varios (canales de sodio, receptores GABA-A, receptores del glutamato) o sobre alguno aún no identificado.',
    refs: [K('413')],
  },
  {
    id: 'ae-carbonic-anhydrase',
    parent: 'antiepileptics',
    title: 'Inhibidores de la anhidrasa carbónica',
    summary: 'Anticonvulsivos de amplio espectro a los que la tolerancia llega en semanas.',
    mechanism:
      'Durante una crisis, el bicarbonato que sale por los receptores GABA-A despolariza la neurona. Inhibir la anhidrasa carbónica impide reponerlo y quita esa influencia excitadora.',
    refs: [K('432')],
  },
  // — Antipsicóticos y estabilizadores del ánimo (Katzung cap. 29)
  {
    id: 'antipsychotics',
    title: 'Antipsicóticos y estabilizadores del ánimo',
    book: 'antipsychotics',
    summary:
      'Fármacos que reducen los síntomas psicóticos (esquizofrenia, manía, depresión psicótica) y fármacos que estabilizan el ánimo en el trastorno bipolar.',
    mechanism:
      'Todos los antipsicóticos eficaces bloquean, en algún grado, los receptores D2 de la dopamina, sobre todo en la vía mesolímbica. Sus efectos adversos dependen de qué otros receptores bloquean (α1, muscarínicos, H1, 5-HT2).',
    refs: [K('511'), K('516-517')],
  },
  {
    id: 'ap-typical',
    parent: 'antipsychotics',
    title: 'Antipsicóticos típicos (primera generación)',
    summary:
      'Los neurolépticos clásicos, desde la clorpromazina. Alivian los síntomas positivos tanto como los atípicos, pero producen más efectos extrapiramidales.',
    mechanism:
      'Antagonistas de los receptores D2: su afinidad por D2 se correlaciona con su potencia antipsicótica y extrapiramidal. Para tratar hace falta ocupar al menos el 60 % de los D2 del estriado; por encima del 80 % aparecen los efectos extrapiramidales.',
    adverse: [
      'Efectos extrapiramidales tempranos: parkinsonismo, acatisia y distonías agudas',
      'Discinesia tardía con el uso crónico, el efecto adverso más importante',
      'Hiperprolactinemia: amenorrea-galactorrea, infertilidad, impotencia',
      'Síndrome neuroléptico maligno, raro pero grave: rigidez, fiebre, inestabilidad autonómica',
    ],
    refs: [K('514'), K('517'), K('522-523')],
  },
  {
    id: 'ap-phenothiazines',
    parent: 'ap-typical',
    title: 'Fenotiazinas',
    summary:
      'Tres subfamilias según la cadena lateral: las alifáticas y las piperidinas, poco potentes, sedantes y con muchos efectos autonómicos; las piperazinas, potentes y más selectivas.',
    refs: [K('514')],
  },
  {
    id: 'ap-thioxanthenes',
    parent: 'ap-typical',
    title: 'Tioxantenos',
    summary: 'Parientes estructurales de las fenotiazinas, con menos sedación y menos efecto antimuscarínico.',
    refs: [K('514'), K('529')],
  },
  {
    id: 'ap-butyrophenones',
    parent: 'ap-typical',
    title: 'Butirofenonas y afines',
    summary:
      'Estructura muy distinta de las fenotiazinas: más potentes, con menos efectos autonómicos y más efectos extrapiramidales.',
    refs: [K('515')],
  },
  {
    id: 'ap-other-typical',
    parent: 'ap-typical',
    title: 'Otros típicos',
    summary: 'Antipsicóticos de primera generación de otras estructuras, de eficacia comparable.',
    refs: [K('515'), K('520')],
  },
  {
    id: 'ap-atypical',
    parent: 'antipsychotics',
    title: 'Antipsicóticos atípicos (segunda generación)',
    summary:
      'Desde la clozapina (1959): antipsicóticos con pocos efectos extrapiramidales a dosis eficaces. Hoy son los más usados.',
    mechanism:
      'Bloquean más el receptor 5-HT2A de la serotonina (como agonistas inversos) que el D2. Eso permite tratar con menos ocupación de D2 (30-50 % en la clozapina y la olanzapina) y protege del bloqueo extrapiramidal. Muchos son además agonistas parciales 5-HT1A.',
    adverse: [
      'Síndrome metabólico: aumento de peso y de lípidos, diabetes; máximo con la clozapina y la olanzapina, mínimo con la ziprasidona',
      'Menos efectos extrapiramidales y menos discinesia tardía que los típicos',
      'Más mortalidad en pacientes ancianos con demencia',
    ],
    refs: [K('511-513'), K('515'), K('517-520')],
  },
  {
    id: 'ap-partial-agonists',
    parent: 'antipsychotics',
    title: 'Agonistas parciales D2',
    summary:
      'Atípicos que no bloquean del todo el receptor D2, sino que lo estimulan a medias: ocupan casi todos los D2 sin producir efectos extrapiramidales.',
    mechanism:
      'Agonistas parciales del receptor D2: donde sobra dopamina actúan como antagonistas, y donde falta, como agonistas débiles. Antagonizan además el 5-HT2A.',
    adverse: ['Aumento de peso y de lípidos pequeño', 'Apenas elevan la prolactina'],
    refs: [K('512'), K('517-518')],
  },
  {
    id: 'ap-5ht2a',
    parent: 'antipsychotics',
    title: 'Agonistas inversos 5-HT2A selectivos',
    summary: 'Antipsicóticos sin acción sobre la dopamina, pensados para la psicosis del Parkinson.',
    mechanism: 'Agonistas inversos selectivos del receptor 5-HT2A; no antagonizan la dopamina ni causan efectos extrapiramidales.',
    refs: [K('519')],
  },
  {
    id: 'ms-lithium',
    parent: 'antipsychotics',
    title: 'Litio',
    summary:
      'El primer estabilizador del ánimo que no era un antipsicótico (Cade, 1949). Previene tanto la manía como la depresión.',
    mechanism:
      'No se conoce del todo. Agota el inositol al inhibir la inositol monofosfatasa, con lo que se reduce la señal de IP3 y DAG, e inhibe la glucógeno sintasa cinasa-3 (GSK-3). No bloquea receptores autonómicos ni seda.',
    refs: [K('524-526')],
  },
  {
    id: 'ms-anticonvulsants',
    parent: 'antipsychotics',
    title: 'Estabilizadores anticonvulsivos',
    summary:
      'Antiepilépticos que también estabilizan el ánimo, hoy más usados que el litio: el valproato y la carbamazepina en la manía, la lamotrigina en la prevención de la depresión bipolar.',
    mechanism:
      'Su acción en el trastorno bipolar no está clara. El valproato, como el litio, agota el inositol y reduce indirectamente la GSK-3; la carbamazepina no actúa sobre la GSK-3.',
    refs: [K('524-525'), K('528')],
  },
  // — Antidepresivos (Katzung cap. 30)
  {
    id: 'antidepressants',
    title: 'Antidepresivos',
    book: 'antidepressants',
    summary:
      'Fármacos para la depresión mayor y, muchos de ellos, para los trastornos de ansiedad, el dolor crónico y otras afecciones.',
    mechanism:
      'Todos aumentan la disponibilidad de monoaminas (serotonina, noradrenalina o dopamina) en la sinapsis: inhiben su recaptación, su degradación por la MAO o actúan sobre sus receptores. El efecto pleno tarda semanas, quizá lo que tarda en sintetizarse el factor neurotrófico BDNF.',
    adverse: [
      'Más ideas e intentos de suicidio en menores de 25 años (advertencia de la FDA), sin aumento en los mayores',
      'Pueden precipitar la manía o acelerar los ciclos en el trastorno bipolar',
    ],
    refs: [K('534-536'), K('541'), K('544'), K('546')],
  },
  {
    id: 'ad-ssri',
    parent: 'antidepressants',
    title: 'Inhibidores selectivos de la recaptación de serotonina (ISRS)',
    summary:
      'Los antidepresivos más usados: fáciles de manejar, bien tolerados y seguros en sobredosis. Nacieron de buscar la acción de los tricíclicos sin su bloqueo de receptores.',
    mechanism:
      'Inhiben de forma alostérica y selectiva el transportador de serotonina (SERT): a dosis terapéuticas bloquean el 80 % de su actividad. Apenas tocan el transportador de noradrenalina y los receptores histamínicos, muscarínicos o α.',
    adverse: [
      'Náuseas y molestias digestivas, sobre todo la primera semana',
      'Disfunción sexual en el 30-40 %: menos libido, orgasmo retardado',
      'Cefalea, insomnio o hipersomnia',
      'Síndrome de discontinuación (mareo, parestesias) al suspender los de semivida corta',
      'Síndrome serotoninérgico si se combinan con un IMAO',
    ],
    refs: [K('536'), K('541-542'), K('546'), K('549')],
  },
  {
    id: 'ad-snri',
    parent: 'antidepressants',
    title: 'Inhibidores de la recaptación de serotonina y noradrenalina (IRSN)',
    summary: 'Útiles también en el dolor crónico, la fibromialgia y los síntomas vasomotores de la menopausia.',
    mechanism:
      'Inhiben los transportadores de serotonina y de noradrenalina, casi siempre con más afinidad por el primero, pero sin el bloqueo antihistamínico, α y anticolinérgico de los tricíclicos.',
    adverse: [
      'Los de los ISRS',
      'Efectos noradrenérgicos: subida de la presión arterial y de la frecuencia cardiaca, insomnio, ansiedad, agitación',
      'Síndrome de discontinuación',
    ],
    refs: [K('537'), K('542'), K('547')],
  },
  {
    id: 'ad-tca',
    parent: 'antidepressants',
    title: 'Antidepresivos tricíclicos',
    summary:
      'La clase dominante hasta los ISRS. Eficaces, pero peor tolerados y letales en sobredosis: hoy quedan para la depresión que no responde y para el dolor.',
    mechanism:
      'Inhiben la recaptación de serotonina y noradrenalina, en proporción variable según el fármaco. Bloquean además los receptores muscarínicos, H1 y α1, de donde vienen casi todos sus efectos adversos.',
    adverse: [
      'Antimuscarínicos: boca seca, estreñimiento, retención urinaria, visión borrosa, confusión',
      'Hipotensión ortostática, por el bloqueo α',
      'Sedación y aumento de peso, por el bloqueo H1',
      'Arritmias: son antiarrítmicos de clase IA; la sobredosis puede ser mortal',
    ],
    refs: [K('537-538'), K('542'), K('547-548')],
  },
  {
    id: 'ad-tca-tertiary',
    parent: 'ad-tca',
    title: 'Aminas terciarias',
    summary: 'Más serotoninérgicas y más anticolinérgicas.',
    refs: [K('542'), K('547')],
  },
  {
    id: 'ad-tca-secondary',
    parent: 'ad-tca',
    title: 'Aminas secundarias',
    summary: 'Más selectivas por la noradrenalina, menos anticolinérgicas, sin metabolitos activos y de cinética casi lineal.',
    refs: [K('540'), K('542'), K('547')],
  },
  {
    id: 'ad-5ht',
    parent: 'antidepressants',
    title: 'Moduladores de la serotonina',
    summary: 'Actúan sobre todo en los receptores de la serotonina más que en su transportador.',
    mechanism:
      'La trazodona y la nefazodona bloquean el receptor 5-HT2A, y solo débilmente el transportador; la vortioxetina actúa sobre varios receptores 5-HT además de inhibir el SERT.',
    adverse: ['Sedación (sobre todo la trazodona) y molestias digestivas', 'Pocos efectos sexuales'],
    refs: [K('538'), K('543'), K('547')],
  },
  {
    id: 'ad-atypical',
    parent: 'antidepressants',
    title: 'Tetracíclicos y unicíclicos',
    summary: 'Antidepresivos que no encajan en las otras clases, cada uno con su mecanismo.',
    mechanism:
      'Mecanismos diversos: liberación de catecolaminas (bupropión), bloqueo de los autorreceptores α2 (mirtazapina), inhibición de la recaptación de noradrenalina (amoxapina, maprotilina) o de serotonina con agonismo 5-HT1A (vilazodona).',
    refs: [K('538-539'), K('543')],
  },
  {
    id: 'ad-maoi',
    parent: 'antidepressants',
    title: 'Inhibidores de la monoaminooxidasa (IMAO)',
    summary:
      'La primera clase moderna de antidepresivos (años cincuenta). Hoy se usan poco por su toxicidad y sus interacciones, a veces mortales, con alimentos y fármacos.',
    mechanism:
      'Inhiben la monoaminooxidasa, que degrada las monoaminas: la MAO-A, sobre todo noradrenalina, adrenalina y serotonina; la MAO-B, sobre todo dopamina y tiramina. Unos lo hacen de forma irreversible y no selectiva; otros, selectiva o reversible.',
    adverse: [
      'Hipotensión ortostática y aumento de peso',
      'Los efectos sexuales más altos de todos los antidepresivos',
      'Crisis hipertensiva con alimentos ricos en tiramina (quesos curados, embutidos secos) o simpaticomiméticos',
      'Síndrome serotoninérgico con ISRS, IRSN, tricíclicos o meperidina',
    ],
    refs: [K('539'), K('543'), K('547'), K('549')],
  },
]
