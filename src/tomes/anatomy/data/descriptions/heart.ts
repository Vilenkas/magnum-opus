import type { Description } from './index'

/** The heart and its vessels in the vessels viewer (Angiología, «El corazón por dentro»). */
export const heart: Record<string, Description> = {
  'Right atrium': {
    text: [
      'Cavidad de paredes delgadas que recibe la sangre venosa del cuerpo por las dos **venas cavas** y la del propio corazón por el **seno coronario**. Su pared lateral lleva la **cresta terminal**, que separa el seno liso de las cavas de la parte anterior, surcada por los músculos pectíneos y prolongada por la orejuela; en lo alto de la cresta está el nódulo sinusal.',
      'En su tabique se hunde la **fosa oval**, rodeada por el anillo de Vieussens, resto del agujero oval del feto. El orificio de la cava inferior tiene la válvula de Eustaquio; el del seno coronario, la de Tebesio, y cerca de él se esconde el nódulo auriculoventricular. Testut la llamaba aurícula; hoy es el **atrio** derecho.',
    ],
    sources: [
      { fuente: 'testut-2', p: '62' },
      { fuente: 'latarjet-ruiz-2', p: '868–869' },
    ],
  },
  'Left atrium': {
    text: [
      'Cavidad de eje transversal que forma casi toda la base del corazón, detrás de la aurícula derecha. En sus cuatro ángulos desembocan las cuatro **venas pulmonares**, sin válvulas, y se abre en el ventrículo izquierdo por el orificio mitral.',
      'Detrás tiene el **esófago**: cuando la mitral se estrecha, la aurícula se dilata, lo empuja y ensancha la sombra del corazón en la radiografía. Su orejuela, estrecha y llena de celdas donde pueden formarse coágulos, es la vía del cirujano hacia la mitral.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '872–873' }],
  },
  'Right ventricle': {
    text: [
      'Pirámide triangular de paredes más delgadas que las del izquierdo, cuyo vértice no llega a la punta del corazón. Su orificio auriculoventricular, con la **tricúspide**, mide unos 120 mm de circunferencia en el hombre y 105 en la mujer.',
      'La sangre entra por una cámara posterior, erizada de pilares y trabéculas, y sale por el **infundíbulo** o cono arterioso, más liso, hacia la arteria pulmonar; las dos forman casi un ángulo recto, separadas por la cresta supraventricular y la trabécula septomarginal.',
    ],
    sources: [
      { fuente: 'testut-2', p: '37–39' },
      { fuente: 'latarjet-ruiz-2', p: '869–871' },
    ],
  },
  'Left ventricle': {
    text: [
      'Cono de paredes gruesas, circular en un corte, que forma la punta del corazón y lanza la sangre a la **aorta**. Su entrada y su salida están muy próximas, separadas sólo por la valva mayor de la mitral.',
      'El orificio mitral mide unos 110 mm de circunferencia en el hombre y 90 en la mujer. La pared septal es lisa y deja ver bajo el endocardio las estrías de la rama izquierda del fascículo de His; las otras paredes llevan los dos pilares, anterior y posterior, y una red de trabéculas en la punta.',
    ],
    sources: [
      { fuente: 'testut-2', p: '48–51' },
      { fuente: 'latarjet-ruiz-2', p: '873' },
    ],
  },
  'Septal leaflet of right atrioventricular valve': {
    text: [
      'Valva interna de la **tricúspide**, pequeña, insertada en el tabique interventricular a la altura de la porción membranosa. Sus cuerdas la atan al músculo papilar septal; por encima y detrás de su inserción corre el fascículo de His, que el cirujano debe respetar al reparar la válvula.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '870, 879' }],
  },
  'Inferior leaflet of right atrioventricular valve': {
    text: [
      'Valva posterior o inferior de la **tricúspide**, sobre la pared diafragmática del ventrículo derecho. Recibe las cuerdas del músculo papilar posterior. Cerradas, las tres valvas se juntan en una línea en forma de Y.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '869–870' }],
  },
  'Posterior leaflet of left atrioventricular valve': {
    text: [
      'Valva menor o externa de la **mitral**, cuadrilátera, de solo 10 a 12 mm de altura, insertada en la parte posterior del anillo. Su cara ventricular recibe cuerdas de primero, segundo y tercer orden, que a menudo suben hasta el anillo.',
    ],
    sources: [
      { fuente: 'testut-2', p: '51' },
      { fuente: 'latarjet-ruiz-2', p: '874–875' },
    ],
  },
  'Right coronary leaflet': {
    text: [
      'Una de las tres **sigmoideas aórticas**. Como sus compañeras, es un repliegue en nido de paloma con un nódulo de Arancio en medio del borde libre. Encima de ella, la aorta forma el seno de Valsalva derecho, de donde nace la **arteria coronaria derecha**.',
    ],
    sources: [
      { fuente: 'testut-2', p: '33' },
      { fuente: 'latarjet-ruiz-2', p: '875' },
    ],
  },
  'Left coronary leaflet': {
    text: [
      'Sigmoidea aórtica izquierda. Encima de ella, en el seno de Valsalva izquierdo, nace la **arteria coronaria izquierda**, a la altura de su borde libre.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '875, 880' }],
  },
  'Non-coronary leaflet': {
    text: [
      'Sigmoidea aórtica posterior, la única cuyo seno de Valsalva no da origen a una coronaria. Entre ella y la sigmoidea derecha, la pared que sube hacia el conducto aórtico es la porción membranosa del tabique.',
    ],
    sources: [
      { fuente: 'testut-2', p: '50' },
      { fuente: 'latarjet-ruiz-2', p: '875' },
    ],
  },
  'Anterior semilunar leaflet of pulmonary valve': {
    text: [
      'La sigmoidea anterior de la **válvula pulmonar**, de las tres la única delantera. Durante la sístole se aplica contra la pared de la arteria; en la diástole cae hacia el eje y se junta con las otras dos, ayudada por el nódulo de Morgagni de su borde libre.',
    ],
    sources: [
      { fuente: 'testut-2', p: '33' },
      { fuente: 'latarjet-ruiz-2', p: '871' },
    ],
  },
  'Left semilunar leaflet of pulmonary valve': {
    text: ['Sigmoidea posterior izquierda de la **válvula pulmonar**, a la salida del infundíbulo del ventrículo derecho. Es más delgada que sus homólogas aórticas.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '871' }],
  },
  'Right semilunar leaflet of pulmonary valve': {
    text: ['Sigmoidea posterior derecha de la **válvula pulmonar**. Con las otras dos forma el «piso sigmoideo» que impide el reflujo de la sangre hacia el ventrículo durante la diástole.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '871' }],
  },
  'Anterior papillary muscle of right ventricle': {
    text: [
      'El mayor pilar del ventrículo derecho, en la parte baja de la pared anterior. Sus cuerdas van sobre todo a la valva anterior de la tricúspide, y a su base llega la **trabécula septomarginal** con la rama derecha del fascículo de His. Por eso el cirujano no incide la pared anterior por debajo de la mitad de la distancia entre el surco coronario y la punta.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '869, 879' }],
  },
  'Inferior papillary muscle of right ventricle': {
    text: ['Pilar posterior del ventrículo derecho, en la pared diafragmática, a menudo doble y menos desarrollado que el anterior. Envía sus cuerdas a la valva posterior de la tricúspide.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '869' }],
  },
  'Septal papillary muscle of right ventricle': {
    text: ['Pequeños pilares del tabique, el **músculo papilar de Luschka**, cerca del orificio pulmonar. Atan con sus cuerdas la valva septal de la tricúspide.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '869' }],
  },
  'Inferior papillary muscle of left ventricle': {
    text: [
      'Pilar posterior del ventrículo izquierdo, cóncavo, en la pared diafragmática. Con el anterior, que se le adosa en la sístole, reparte sus cuerdas entre las dos valvas de la mitral; el embudo valvular queda siempre al menos 2 cm por encima de sus vértices.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '875' }],
  },
  'Left coronary artery': {
    text: [
      'Nace de la aorta en el seno de Valsalva izquierdo, con 3 a 4 mm de calibre. Pasa detrás del tronco pulmonar, oculta por la orejuela izquierda, y tras un trayecto corto se divide en la **interventricular anterior** y la **circunfleja**.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '880' }],
  },
  'Anterior interventricular artery': {
    text: [
      'Rama de la coronaria izquierda que baja, sinuosa, por el surco interventricular anterior, junto a la vena cardíaca magna; rodea el borde inferior a 1,5 cm de la punta y se agota en la cara diafragmática. Da ramas a los dos ventrículos y una decena de **ramas septales**, que riegan los dos tercios anteriores del tabique y las ramas del fascículo de His.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '879–880' }],
  },
  'Septal branches of anterior interventricular artery': {
    text: ['Una decena de ramas que se hunden en el tabique interventricular desde la interventricular anterior y convergen hacia su centro. Riegan sus dos tercios anteriores y las ramas derecha e izquierda del fascículo de His.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '879–880' }],
  },
  'Circumflex artery of heart': {
    text: [
      'Rama de la coronaria izquierda que recorre la parte izquierda del surco coronario, junto al anillo mitral, con la vena cardíaca magna. Da ramas a la aurícula izquierda, a veces la del nódulo sinusal, y ramas ventriculares, la mayor de ellas la marginal izquierda; suele terminar sin alcanzar el surco interventricular posterior.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '880–881' }],
  },
  'Right coronary artery': {
    text: [
      'Nace de la aorta en el seno de Valsalva derecho, de calibre parecido al de la izquierda. Baja hacia la derecha, recorre la parte derecha del surco coronario y termina en la **interventricular posterior**. Da ramas a la aurícula derecha, entre ellas en la mitad de los casos la del nódulo sinusal, y riega el nódulo auriculoventricular y el fascículo de His.',
    ],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '879, 881' }],
  },
  'Right inferolateral branch of right coronary artery': {
    text: ['Rama ventricular de la coronaria derecha que baja por el borde derecho del corazón hacia su cara diafragmática; es la que Latarjet y Ruiz Liard llaman marginal derecha.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '881' }],
  },
  'Coronary sinus': {
    text: ['Tronco venoso del surco coronario posterior que recoge casi todas las venas del corazón, continuando a la vena cardíaca magna, y se abre en la aurícula derecha por un orificio con la válvula de Tebesio, sin pasar por las venas cavas.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '859, 869' }],
  },
  'Ascending aorta': {
    text: ['Primer tramo de la aorta, desde el orificio aórtico del ventrículo izquierdo. Al nacer se dilata en los tres **senos de Valsalva**, encima de las sigmoideas, y de los senos derecho e izquierdo salen las arterias coronarias.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '875' }],
  },
  'Pulmonary trunk': {
    text: ['Arteria que sale del infundíbulo del ventrículo derecho y lleva la sangre venosa a los pulmones. Su orificio, delante y a la izquierda del aórtico, se cierra con tres sigmoideas, una anterior y dos posteriores.'],
    sources: [{ fuente: 'latarjet-ruiz-2', p: '871' }],
  },
}
