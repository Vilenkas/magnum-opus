import type { Description } from './index'

/** The bones of the lower limb (skeleton viewer), after Latarjet–Ruiz Liard's chapter 63. */

const LR = (p: string) => ({ fuente: 'latarjet-ruiz-1' as const, p })
const MOORE = (p: string) => ({ fuente: 'moore-8' as const, p })

const bones: Record<string, Description> = {
  'Hip bone': {
    text: [
      'Hueso par de la pelvis, formado por tres piezas que se sueldan en el **acetábulo**: el ilion arriba, el isquion abajo y atrás y el pubis delante. Hasta los 12–15 años las separa un cartílago en Y en el fondo del acetábulo.',
      'Por fuera tiene el acetábulo, profundo y escotado abajo, la cara glútea con sus líneas y el agujero obturado; por dentro, la fosa ilíaca, la cara auricular para el sacro y la línea arqueada. Una columna de hueso esponjoso lleva el peso del sacro al **techo del acetábulo**. Se palpan la cresta ilíaca con sus espinas, el tubérculo del pubis y la tuberosidad isquiática, sobre la que nos sentamos.',
    ],
    sources: [LR('633–637')],
  },
  Femur: {
    text: [
      'El hueso del muslo, el más largo del cuerpo. Su extremo superior se acoda en un **cuello** que lleva la **cabeza**, dos tercios de esfera con la fosita del ligamento redondo, al acetábulo; al pie del cuello están los trocánteres mayor y menor. El cuerpo, oblicuo hacia abajo y adentro, tiene detrás una cresta saliente, la **línea áspera**, donde se insertan los vastos, los aductores y el bíceps.',
      'Abajo se ensancha en dos **cóndilos** separados por la fosa intercondílea, con la tróclea delante para la rótula. El cuello, puente entre el tronco y el miembro, es la parte más estrecha y la que más se fractura en los ancianos; su fractura puede dejar la cabeza sin riego (necrosis avascular).',
    ],
    sources: [LR('643–648'), MOORE('685, 827')],
  },
  Patella: {
    text: [
      'La **rótula**: un sesamoideo grande desarrollado en el tendón del **cuádriceps**, triangular, de vértice inferior. Su cara posterior se articula con la tróclea del fémur por dos carillas, la lateral más ancha; la anterior está bajo la piel, separada por la bolsa prepatelar. Se palpa entera y es referencia de la interlínea de la rodilla; sus fracturas abren la articulación.',
    ],
    sources: [LR('648')],
  },
  Tibia: {
    text: [
      'El hueso grueso y medial de la pierna, el que soporta el peso. Su extremo superior, el macizo tibial, ofrece dos superficies para los cóndilos del fémur y delante la **tuberosidad tibial**, donde termina el ligamento rotuliano; a su lado, el tubérculo de Gerdy para la cintilla iliotibial.',
      'Su cara medial y su borde anterior, la **cresta tibial**, están bajo la piel en toda su longitud, lo que la expone a fracturas abiertas. Abajo se articula con el astrágalo y termina por dentro en el **maléolo medial**; detrás pasan los tendones de los flexores.',
    ],
    sources: [LR('648–651')],
  },
  Fibula: {
    text: [
      'El **peroné** (fíbula): hueso largo y delgado, lateral a la tibia, unido a ella por sus dos extremos y por la membrana interósea. No carga peso: sirve a la inserción de músculos y forma con el **maléolo lateral**, más bajo y posterior que el medial, la pared externa de la mortaja del tobillo.',
      'El **nervio fibular común** rodea su cuello bajo la piel, donde puede lesionarse y dejar el pie caído.',
    ],
    sources: [LR('652–653'), MOORE('741')],
  },
  Talus: {
    text: [
      'El **astrágalo** (talus), el hueso más alto del pie y el único del tarso sin inserciones musculares. Su cuerpo, con la **tróclea** arriba, se encaja en la mortaja entre los maléolos; por debajo se apoya en el calcáneo por tres carillas, separadas por el seno del tarso; su cabeza se articula delante con el navicular.',
      'Transmite todo el peso de la pierna al pie. Su tubérculo posterior puede ser un hueso aparte, el trígono.',
    ],
    sources: [LR('654–657')],
  },
  Calcaneus: {
    text: [
      'El **calcáneo**, el hueso mayor del tarso, que forma el talón. Arriba sostiene el astrágalo por tres carillas, la posterior sobre un macizo óseo; delante se articula con el cuboides. Su cara posterior recibe el **tendón calcáneo** (de Aquiles); la inferior apoya en el suelo por los procesos de la tuberosidad.',
      'Por dentro, el **sustentáculo del astrágalo** sostiene la cabeza de este y forma con la tuberosidad el canal por donde los tendones, vasos y nervios de la pierna llegan a la planta; por fuera, la tróclea fibular separa los tendones de los peroneos.',
    ],
    sources: [LR('657–658')],
  },
  'Navicular bone': {
    text: [
      'El **escafoides del pie** (navicular): se articula detrás con la cabeza del astrágalo y delante con los tres cuneiformes. Por dentro forma la **tuberosidad del navicular**, donde termina el tibial posterior: una referencia que se palpa en el borde medial del pie.',
    ],
    sources: [LR('659–660')],
  },
  'Cuboid bone': {
    text: [
      'Hueso del borde lateral del tarso, entre el calcáneo detrás y los metatarsianos cuarto y quinto delante. Su cara plantar tiene una tuberosidad y el surco del tendón del **peroneo largo**, que cruza la planta.',
    ],
    sources: [LR('658–659')],
  },
  'Medial cuneiform bone': {
    text: ['La primera cuña, la mayor, en el borde medial del pie: entre el navicular y la base del primer metatarsiano. Recibe el tendón del **tibial anterior**.'],
    sources: [LR('660')],
  },
  'Intermediate cuneiform bone': {
    text: ['La segunda cuña, la menor y la más retrasada: entre el navicular y la base del segundo metatarsiano, que por eso queda encajado entre las otras dos cuñas.'],
    sources: [LR('660')],
  },
  'Lateral cuneiform bone': {
    text: ['La tercera cuña, entre el navicular, el cuboides y el tercer metatarsiano. Como las otras, tiene la base dorsal y el vértice plantar: juntas dan al tarso su bóveda transversal.'],
    sources: [LR('660')],
  },
  'Sesamoid bones of foot': {
    text: ['Dos pequeños huesos en la cara plantar de la metatarsofalángica del dedo gordo; la cabeza del primer metatarsiano apoya en el suelo a través de ellos.'],
    sources: [LR('661, 664')],
  },
}

const metatarsal = (own: string): Description => ({
  text: [
    'Hueso largo del antepié, con una **base** articulada con el tarso y los metatarsianos vecinos, un cuerpo triangular y una **cabeza** que apoya en el suelo de pie y se articula con la falange proximal. Osifica por dos puntos; el cartílago de crecimiento queda en la cabeza.',
    own,
  ],
  sources: [LR('661–663')],
})

Object.assign(bones, {
  'First metatarsal bone': {
    text: [
      'El metatarsiano del dedo gordo, el más corto y el más grueso. Su base, con una tuberosidad plantar para el **peroneo largo**, se articula con la primera cuña; bajo su cabeza están los dos sesamoideos. Es el pilar anterior y medial de la bóveda plantar.',
    ],
    sources: [LR('661')],
  },
  'Second metatarsal bone': metatarsal('El segundo se articula con la cuña intermedia y, por los lados, con las otras dos, entre las que queda encajado.'),
  'Third metatarsal bone': metatarsal('El tercero se articula con la tercera cuña.'),
  'Fourth metatarsal bone': metatarsal('El cuarto se articula con el cuboides y con los metatarsianos vecinos.'),
  'Fifth metatarsal bone': metatarsal(
    'El quinto, el más delgado, tiene en la base la **tuberosidad** donde termina el peroneo corto, que se palpa en el borde lateral del pie.',
  ),
} satisfies Record<string, Description>)

const toes = ['first', 'second', 'third', 'fourth', 'fifth'] as const
const phalanx: Record<'proximal' | 'middle' | 'distal', Description> = {
  proximal: {
    text: ['Falange **proximal** de un dedo del pie. Como las de la mano pero mucho más cortas, con los extremos casi en contacto; el dedo gordo sólo tiene proximal y distal.'],
    sources: [LR('664')],
  },
  middle: {
    text: ['Falange **media** de un dedo del pie, muy corta; falta en el dedo gordo.'],
    sources: [LR('664')],
  },
  distal: {
    text: ['Falange **distal** de un dedo del pie, la más pequeña, que lleva la uña.'],
    sources: [LR('664')],
  },
}
for (const row of ['proximal', 'middle', 'distal'] as const)
  for (const toe of toes) {
    if (row === 'middle' && toe === 'first') continue
    bones[`${row[0].toUpperCase()}${row.slice(1)} phalanx of ${toe} finger of foot`] = phalanx[row]
  }

export const lowerLimbBones = bones
