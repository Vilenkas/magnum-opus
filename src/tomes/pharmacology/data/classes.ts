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

  // — Families still to be written: roots only, so a drug can already name them.
  {
    id: 'antiepileptics',
    title: 'Antiepilépticos',
    book: 'antiepileptics',
    summary: 'Fármacos que previenen o detienen las crisis epilépticas.',
  },
  {
    id: 'antipsychotics',
    title: 'Antipsicóticos y estabilizadores del ánimo',
    book: 'antipsychotics',
    summary: 'Fármacos para la psicosis y para el trastorno bipolar.',
  },
  {
    id: 'antidepressants',
    title: 'Antidepresivos',
    book: 'antidepressants',
    summary: 'Fármacos para la depresión y, muchos de ellos, para los trastornos de ansiedad.',
  },
]
