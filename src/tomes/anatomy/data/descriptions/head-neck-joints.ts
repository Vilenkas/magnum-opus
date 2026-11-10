import type { Description } from './index'

/**
 * The joints of the head and the larynx and their pieces (arthrology viewer). Whole joints are keyed by their
 * `joint-index.ts` `en`. The temporomandibular joint and its accessory ligaments after Latarjet–Ruiz Liard's chapter 103
 * (t. 2), the larynx after chapter 92 (t. 2).
 */

const LR2 = (p: string) => ({ fuente: 'latarjet-ruiz-2' as const, p })
const d2 = (p: string, ...text: string[]): Description => ({ text, sources: [LR2(p)] })

const TMJ_CAPSULE =
  'La **cápsula** de la articulación temporomandibular: manguito laxo que arriba se fija alrededor de la superficie del temporal (de la fisura petrotimpánica, detrás, al borde anterior del tubérculo articular, y medialmente hasta la espina del esfenoides) y abajo en el cuello de la mandíbula. Por dentro se adhiere al contorno del disco, que la divide en dos sinoviales, supradiscal e infradiscal; la refuerzan a los lados los ligamentos lateral y medial.'
const TMJ_DISC =
  'El **disco articular** (menisco) de la articulación temporomandibular: lámina fibrocartilaginosa oval que adapta dos superficies convexas, el cóndilo y el tubérculo articular. Su cara superior es cóncava delante y convexa detrás, frente a la fosa mandibular; la inferior, cóncava, cubre el cóndilo; el borde posterior es más grueso. Fijado a los polos del cóndilo, lo acompaña en sus movimientos, y en él se inserta parte del pterigoideo lateral, que lo tira hacia delante al abrir la boca.'

const joints: Record<string, Description> = {
  'Temporomandibular joint': d2(
    '1168–1171',
    'La articulación de la mandíbula con la base del cráneo, a cada lado delante del conducto auditivo externo: el **cóndilo de la mandíbula** con la superficie del temporal, que tiene detrás la **fosa mandibular**, cóncava, y delante el **tubérculo articular**, convexo. Un **disco** fibrocartilaginoso la divide en dos cavidades; la unen la cápsula, sus ligamentos lateral y medial y tres ligamentos accesorios a distancia (esfenomandibular, estilomandibular y rafe pterigomandibular).',
    'Las dos articulaciones trabajan siempre juntas. En la cavidad inferior el cóndilo **gira** (apertura pequeña); en la superior, cóndilo y disco **se deslizan** hacia el tubérculo (apertura amplia y propulsión). Si sólo avanza un cóndilo, la mandíbula se desvía al lado contrario (diducción, masticación). Es superficial: se palpa delante del trago al abrir la boca.',
  ),
  'Articular capsule of temporomandibular joint': d2('1169–1170', TMJ_CAPSULE),
  'Articular disc of temporomandibular joint': d2('1169', TMJ_DISC),
  'Lateral temporomandibular ligament': d2(
    '1170',
    'El **ligamento lateral** de la articulación temporomandibular, el refuerzo principal de su cápsula: del tubérculo de la raíz del proceso cigomático baja oblicuo hacia atrás al borde posterolateral del cuello de la mandíbula. Impide que el cóndilo se desplace atrás y abajo.',
  ),
  'Cranial syndesmoses': d2(
    '1170',
    'Los **ligamentos accesorios** de la mandíbula y del hioides, a distancia de la articulación: el esfenomandibular, el estilomandibular y el estilohioideo, además del pterigoespinoso entre dos partes del esfenoides. Son cintas fibrosas que guían o limitan los movimientos de la mandíbula, o suspenden el hioides de la base del cráneo.',
  ),
  'Sphenomandibular ligament': d2(
    '1170',
    'Cinta fibrosa de la **espina del esfenoides** a la **língula** de la mandíbula, en la entrada del foramen mandibular: es la parte posterior engrosada de la fascia interpterigoidea. Entre ella y el cuello de la mandíbula pasan la arteria maxilar y el nervio auriculotemporal (ojal retrocondíleo); a su lado bajan el nervio y los vasos alveolares inferiores.',
  ),
  'Stylomandibular ligament': d2(
    '1170',
    'Ligamento del vértice del **proceso estiloides** al ángulo y borde posterior de la **rama de la mandíbula**, entre la parótida y la glándula submandibular. Según Rouvière y Olivier es la regresión de un fascículo del estilogloso; limita la propulsión de la mandíbula.',
  ),
  'Stylohyoid ligament': d2(
    '1182, 1043',
    'Cordón fibroso del vértice del **proceso estiloides** al **asta menor del hioides**, que suspende el hioides de la base del cráneo; puede osificarse en parte y alargar el estiloides. Es un resto del segundo arco faríngeo; a él llegan fibras del estilogloso y del constrictor medio de la faringe.',
  ),
  'Pterygospinous ligament': d2(
    '1170–1171',
    'Ligamento de la **espina del esfenoides** al borde posterior de la lámina lateral del proceso pterigoides, en la fascia interpterigoidea. Cuando se osifica (proceso pterigoespinoso) forma un foramen por donde pasan ramos del nervio mandibular hacia los músculos masticadores.',
  ),
  // ---------- Larynx ----------
  'Laryngeal joints': d2(
    '1052–1054',
    'Las uniones del esqueleto de la laringe. Dos articulaciones sinoviales, a cada lado: la **cricotiroidea** (asta inferior del tiroides con el cricoides), en la que el tiroides se inclina sobre el cricoides y tensa las cuerdas vocales, y la **cricoaritenoidea**, en la que el aritenoides gira y se desliza sobre la lámina del cricoides para abrir y cerrar la glotis.',
    'Las demás son membranas y ligamentos: la **membrana tirohioidea**, que suspende la laringe del hioides; la membrana fibroelástica, cuya parte alta (membrana cuadrangular) llega al pliegue vestibular y la baja (cono elástico) termina en el ligamento vocal; el ligamento cricotiroideo y la membrana cricotraqueal.',
  ),
  'Median thyrohyoid ligament': d2(
    '1053',
    'La parte media engrosada de la **membrana tirohioidea**, que va del borde superior del cartílago tiroides, en la escotadura, al borde posterosuperior del cuerpo del hioides; entre ella y el hioides queda una bolsa serosa. A los lados, más finas, las partes laterales de la membrana están perforadas por la arteria laríngea superior y el ramo interno del nervio laríngeo superior.',
  ),
  'Lateral thyrohyoid ligament': d2(
    '1053, 1055',
    'El borde posterior engrosado de la **membrana tirohioidea**, cordón del asta superior del tiroides al extremo del asta mayor del hioides, que contiene a menudo un nódulo, el cartílago tritíceo.',
  ),
  'Median cricothyroid ligament': d2(
    '1053–1054',
    'Lámina fibroelástica triangular entre el borde inferior del tiroides y el arco del cricoides, delante: es la parte media, engrosada, del **cono elástico**. Superficial y palpable bajo la piel, se secciona en la **coniotomía** (cricotirotomía) para dar aire en una obstrucción por encima de la glotis.',
  ),
  'Quadrangular membrane': d2(
    '1052–1053',
    'La parte superior de la membrana fibroelástica de la laringe, entre el borde lateral de la epiglotis y el aritenoides con el corniculado: forma la pared del vestíbulo laríngeo. Su borde superior libre está en el **pliegue aritenoepiglótico**; el inferior, engrosado, es el ligamento vestibular de la **cuerda vocal falsa**.',
  ),
  'Cricopharyngeal ligament': d2(
    '1051',
    'El **ligamento cricofaríngeo** (yugal), entre los dos aritenoides: abajo se fija en el borde superior y la cara posterior de la lámina del cricoides y en la mucosa de la faringe; arriba se bifurca en Y hacia cada cartílago corniculado, a veces con un pequeño cartílago interaritenoideo en la bifurcación. Une la laringe a la pared de la laringofaringe.',
  ),
}

export const headNeckJoints = joints
