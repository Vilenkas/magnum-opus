/**
 * Classification of the joints after Testut–Latarjet (t. I, pp. 474, 488–491):
 * three classes by mobility, each divided into genera, with examples placed on
 * the 3D model. Hand-editable. Descriptions are paraphrased, not quoted.
 */

export type JointClassId = 'diarthrosis' | 'amphiarthrosis' | 'synarthrosis'

export interface JointClass {
  id: JointClassId
  name: string
  /** Old and alternative names. */
  aka: string
  description: string
  page: string
}

export interface JointExample {
  id: string
  name: string
  latin: string
  /** Pieces that form it (GLB ids). The first is painted strongest. */
  pieces: string[]
  /** Landmark the camera centres on; without one, the first piece is framed. */
  anchor?: string
  /** Anatomical view; default: from the joint's own side. */
  view?: 'front' | 'back' | 'side' | 'top' | 'below'
  /** Frame size in model units, when the smallest bone is too long to frame the joint (elbow). */
  frame?: number
}

export interface JointGenus {
  id: string
  class: JointClassId
  name: string
  /** Classical synonyms. */
  aka?: string
  surfaces: string
  ligaments: string
  movements: string
  examples: JointExample[]
  page: string
}

export const jointClasses: JointClass[] = [
  {
    id: 'diarthrosis',
    name: 'Diartrosis',
    aka: 'Articulaciones movibles',
    description:
      'Disfrutan de movimientos extensos. Sus superficies, cubiertas de cartílago articular, quedan separadas por una cavidad bañada de sinovia y rodeada por una cápsula.',
    page: '477',
  },
  {
    id: 'amphiarthrosis',
    name: 'Anfiartrosis',
    aka: 'Articulaciones semimovibles · sínfisis',
    description:
      'Término medio entre las diartrosis y las sinartrosis: muy sólidas y de movimientos limitados. Un disco fibrocartilaginoso, que se adhiere a ambas superficies, las une como un potente ligamento interóseo.',
    page: '489–490',
  },
  {
    id: 'synarthrosis',
    name: 'Sinartrosis',
    aka: 'Articulaciones inmóviles',
    description:
      'Propias del cráneo y de la cara. Las superficies óseas se unen por una sustancia interpuesta, fibrosa (suturas) o cartilaginosa (sincondrosis), sin cavidad articular.',
    page: '490–491',
  },
]

export const jointGenera: JointGenus[] = [
  // ---------- Diarthroses: six genera by the shape of their surfaces ----------
  {
    id: 'enarthrosis',
    class: 'diarthrosis',
    name: 'Enartrosis',
    surfaces: 'Una cabeza esférica y una cavidad que le corresponde, casi siempre agrandada por un rodete marginal.',
    ligaments: 'Una cápsula fibrosa, reforzada por cintillas más o menos individualizadas.',
    movements: 'En todos los sentidos: flexión, extensión, aducción, abducción, circunducción y rotación.',
    examples: [
      { id: 'hip', view: 'front', name: 'Articulación coxofemoral', latin: 'Articulatio coxae', pieces: ['femur-r', 'hip-bone-r'], anchor: 'head-of-femur--femur-r' },
      { id: 'shoulder', view: 'front', name: 'Articulación escapulohumeral', latin: 'Articulatio humeri', pieces: ['humerus-r', 'scapula-r'], anchor: 'head-of-humerus--humerus-r' },
    ],
    page: '488',
  },
  {
    id: 'condylarthrosis',
    class: 'diarthrosis',
    name: 'Condilartrosis',
    aka: 'Articulaciones condíleas',
    surfaces: 'Una cabeza alargada (cóndilo) y una cavidad elíptica, la cavidad glenoidea.',
    ligaments: 'Ligamentos periféricos: anteriores, posteriores y laterales.',
    movements: 'Todos los de las enartrosis, menos la rotación.',
    examples: [
      {
        id: 'radiocarpal', view: 'front',
        name: 'Articulación radiocarpiana',
        latin: 'Articulatio radiocarpalis',
        pieces: ['radius-r', 'scaphoid-bone-r', 'lunate-bone-r', 'triquetrum-bone-r'],
        anchor: 'carpal-articular-surface--radius-r',
      },
      {
        id: 'metacarpophalangeal', view: 'side',
        name: 'Articulación metacarpofalángica',
        latin: 'Articulatio metacarpophalangea',
        pieces: ['third-metacarpal-bone-r', 'proximal-phalanx-of-third-finger-of-hand-r'],
        anchor: 'head-of-metacarpal-bone--third-metacarpal-bone-r',
      },
    ],
    page: '488',
  },
  {
    id: 'saddle',
    class: 'diarthrosis',
    name: 'Encaje recíproco',
    aka: 'Articulación en silla de montar',
    surfaces: 'Cóncavas en un sentido y convexas en el otro, a la inversa en cada hueso: encajan como un jinete en su silla.',
    ligaments: 'Una cápsula fibrosa.',
    movements: 'Todos, excepto la rotación.',
    examples: [
      {
        id: 'trapeziometacarpal', view: 'front',
        name: 'Articulación trapeciometacarpiana',
        latin: 'Articulatio carpometacarpalis pollicis',
        pieces: ['first-metacarpal-bone-r', 'trapezium-bone-r'],
        anchor: 'tubercle-of-trapezium-bone--trapezium-bone-r',
      },
      {
        id: 'sternoclavicular', view: 'front',
        name: 'Articulación esternoclavicular',
        latin: 'Articulatio sternoclavicularis',
        pieces: ['clavicle-r', 'manubrium-of-sternum'],
        anchor: 'sternal-end--clavicle-r',
      },
    ],
    page: '488',
  },
  {
    id: 'trochlear',
    class: 'diarthrosis',
    name: 'Trocleartrosis',
    aka: 'Articulaciones trocleares · gínglimo angular',
    surfaces: 'Una polea o tróclea de un lado; del otro, una cresta para su garganta y dos carillas para sus vertientes.',
    ligaments: 'Cuatro ligamentos, dos de ellos laterales y muy fuertes.',
    movements: 'Flexión y extensión, con algunos movimientos de lateralidad siempre muy escasos.',
    examples: [
      { id: 'humeroulnar', view: 'front', frame: 0.14, name: 'Articulación humerocubital', latin: 'Articulatio humeroulnaris', pieces: ['ulna-r', 'humerus-r'], anchor: 'trochlea-of-humerus--humerus-r' },
      {
        id: 'interphalangeal', view: 'side',
        name: 'Articulación interfalángica',
        latin: 'Articulatio interphalangea manus',
        pieces: ['middle-phalanx-of-third-finger-of-hand-r', 'proximal-phalanx-of-third-finger-of-hand-r'],
        anchor: 'trochlea-of-phalanx-of-hand--proximal-phalanx-of-third-finger-of-hand-r',
      },
    ],
    page: '489',
  },
  {
    id: 'trochoid',
    class: 'diarthrosis',
    name: 'Trocoide',
    aka: 'Gínglimo lateral',
    surfaces: 'Un cilindro óseo que gira sobre su eje dentro de un anillo osteofibroso.',
    ligaments: 'Un ligamento semilunar que mantiene el cilindro en su cavidad.',
    movements: 'Sólo la rotación.',
    examples: [
      { id: 'radioulnar', view: 'front', frame: 0.14, name: 'Articulación radiocubital proximal', latin: 'Articulatio radioulnaris proximalis', pieces: ['radius-r', 'ulna-r'], anchor: 'head-of-radius--radius-r' },
      { id: 'atlantoaxial', view: 'top', name: 'Articulación atloidoodontoidea', latin: 'Articulatio atlantoaxialis mediana', pieces: ['axis-c2', 'atlas-c1'], anchor: 'dens-axis--axis-c2' },
    ],
    page: '489',
  },
  {
    id: 'arthrodia',
    class: 'diarthrosis',
    name: 'Artrodia',
    surfaces: 'Planas o casi planas.',
    ligaments: 'Dispuestos irregularmente alrededor de la articulación.',
    movements: 'Únicamente el deslizamiento.',
    examples: [
      { id: 'acromioclavicular', view: 'top', name: 'Articulación acromioclavicular', latin: 'Articulatio acromioclavicularis', pieces: ['clavicle-r', 'scapula-r'], anchor: 'acromial-end--clavicle-r' },
    ],
    page: '489',
  },

  // ---------- Amphiarthroses ----------
  {
    id: 'true-amphiarthrosis',
    class: 'amphiarthrosis',
    name: 'Anfiartrosis verdadera',
    aka: 'Anfiartrosis típica',
    surfaces: 'Planas o algo excavadas, cubiertas de cartílago hialino y unidas por un disco fibrocartilaginoso, sin cavidad ni sinovial.',
    ligaments: 'El disco, que actúa como ligamento interóseo, y ligamentos periféricos más débiles.',
    movements: 'Muy limitados.',
    examples: [
      { id: 'intervertebral', view: 'side', name: 'Articulación de los cuerpos vertebrales', latin: 'Symphysis intervertebralis', pieces: ['vertebra-l3', 'vertebra-l4'], anchor: 'vertebral-body--vertebra-l3' },
    ],
    page: '489',
  },
  {
    id: 'diarthroamphiarthrosis',
    class: 'amphiarthrosis',
    name: 'Diartroanfiartrosis',
    surfaces: 'Como en la anfiartrosis, pero el disco presenta en su espesor una hendidura, una verdadera cavidad articular, a veces con una sinovial rudimentaria.',
    ligaments: 'Disco interóseo con su hendidura central y ligamentos periféricos.',
    movements: 'Muy poco extensos, como en las anfiartrosis.',
    examples: [
      { id: 'pubic-symphysis', view: 'front', name: 'Sínfisis del pubis', latin: 'Symphysis pubica', pieces: ['hip-bone-r', 'hip-bone-l'], anchor: 'symphysial-surface-of-pubis--hip-bone-r' },
      { id: 'sacroiliac', view: 'front', name: 'Articulación sacroilíaca', latin: 'Articulatio sacroiliaca', pieces: ['sacrum', 'hip-bone-r'], anchor: 'auricular-surface-of-ilium--hip-bone-r' },
    ],
    page: '490',
  },

  // ---------- Synarthroses ----------
  {
    id: 'serrate-suture',
    class: 'synarthrosis',
    name: 'Sutura dentada',
    surfaces: 'Bordes cubiertos de asperezas, a veces armados de verdaderos dientes que engranan entre sí.',
    ligaments: 'Membrana sutural fibrosa.',
    movements: 'Ninguno.',
    examples: [
      { id: 'sagittal', view: 'top', name: 'Sutura biparietal (sagital)', latin: 'Sutura sagittalis', pieces: ['parietal-bone-r', 'parietal-bone-l'], anchor: 'sagittal-border-of-parietal-bone--parietal-bone-r' },
    ],
    page: '491',
  },
  {
    id: 'squamous-suture',
    class: 'synarthrosis',
    name: 'Sutura escamosa',
    surfaces: 'Los dos huesos, cortados a bisel, se superponen en su contacto.',
    ligaments: 'Membrana sutural fibrosa.',
    movements: 'Ninguno.',
    examples: [
      {
        id: 'parietotemporal', view: 'side',
        name: 'Sutura parietotemporal',
        latin: 'Sutura squamosa',
        pieces: ['temporal-bone-r', 'parietal-bone-r'],
        anchor: 'squamosal-border-of-parietal-bone--parietal-bone-r',
      },
    ],
    page: '491',
  },
  {
    id: 'plane-suture',
    class: 'synarthrosis',
    name: 'Sutura armónica',
    surfaces: 'Bordes regularmente lisos, que simplemente se ponen en contacto.',
    ligaments: 'Membrana sutural fibrosa.',
    movements: 'Ninguno.',
    examples: [{ id: 'internasal', view: 'front', name: 'Sutura internasal', latin: 'Sutura internasalis', pieces: ['nasal-bone-r', 'nasal-bone-l'] }],
    page: '491',
  },
  {
    id: 'schindylesis',
    class: 'synarthrosis',
    name: 'Esquindilesis',
    surfaces: 'Una ranura de un lado y, del otro, una cresta que se encaja en ella.',
    ligaments: 'Membrana sutural fibrosa.',
    movements: 'Ninguno.',
    examples: [
      { id: 'vomerosphenoid', view: 'side', name: 'Articulación del vómer con el esfenoides', latin: 'Schindylesis', pieces: ['vomer', 'sphenoid-bone'], anchor: 'sphenoidal-crest--sphenoid-bone' },
    ],
    page: '491',
  },
  {
    id: 'synchondrosis',
    class: 'synarthrosis',
    name: 'Sincondrosis',
    surfaces: 'Dos superficies óseas unidas por un cartílago, que se continúa con el periostio y suele desaparecer al osificarse.',
    ligaments: 'El propio cartílago interpuesto.',
    movements: 'Ninguno.',
    examples: [
      {
        id: 'sphenooccipital', view: 'below',
        name: 'Sincondrosis esfenooccipital',
        latin: 'Synchondrosis sphenooccipitalis',
        pieces: ['occipital-bone', 'sphenoid-bone'],
        anchor: 'basilar-part-of-occipital-bone--occipital-bone',
      },
    ],
    page: '491',
  },
]
