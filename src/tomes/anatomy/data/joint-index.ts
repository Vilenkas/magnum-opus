import type { JointView } from '../components/skeleton/SkeletonStage'
import { pieceById } from './skeleton'
import { softEntries, softName, type SoftEntry } from './soft-tissues'
import { byName, haystackOf, type IndexEntry, type IndexSection } from './structure-index'

/**
 * The joints of the arthrology viewer: each one gathers its pieces of joints.glb (ligaments,
 * capsules, discs) and the bones it joins, so the viewer can show a whole joint at once. Pieces
 * are matched by their nearest TA group (`groups[0]`), as the model's TA2 classification has them,
 * plus or minus single pieces. Tests check that every piece of the model belongs to one joint.
 */
export interface JointDef {
  key: string
  /** Spanish name, as the chapters call it. */
  es: string
  la: string
  /** TA English: the key of its description. */
  en: string
  aliases?: string[]
  region: JointRegion
  /**
   * Latin names of the rows of Lámina II (`joint-count.ts`) it stands for, besides `la`: a joint the
   * model keeps in one capsule (the elbow) or one series (the interphalangeals) covers several rows.
   */
  covers?: string[]
  /**
   * TA groups whose pieces belong to it (nearest group of each piece). A joint with neither groups nor
   * pieces has no piece of its own in the model (sutures, synchondroses, the ossicles, most of the
   * thorax): the viewer shows the bones it joins.
   */
  groups?: string[]
  /** Single pieces, without side. */
  pieces?: string[]
  /** Bones it joins, without side. */
  bones: string[]
  view?: JointView
}

export type JointRegion = 'skull' | 'head' | 'spine' | 'thorax' | 'upper-limb' | 'pelvis' | 'lower-limb'

const REGION_LABEL: Record<JointRegion, string> = {
  skull: 'Suturas y sincondrosis del cráneo y de la cara',
  head: 'Articulaciones de la cabeza y la laringe',
  spine: 'Articulaciones de la columna',
  thorax: 'Articulaciones del tórax',
  'upper-limb': 'Articulaciones del miembro superior',
  pelvis: 'Articulaciones de la pelvis',
  'lower-limb': 'Articulaciones del miembro inferior',
}

const ordinals = ['first', 'second', 'third', 'fourth', 'fifth']
const ribs = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'].map((n) => `${n}-rib`)
const vertebrae = [
  'atlas-c1',
  'axis-c2',
  ...[3, 4, 5, 6, 7].map((n) => `vertebra-c${n}`),
  ...Array.from({ length: 12 }, (_, i) => `vertebra-t${i + 1}`),
  ...[1, 2, 3, 4, 5].map((n) => `vertebra-l${n}`),
  'sacrum',
  'coccyx',
]
const costalCartilages = ribs.slice(0, 10).map((rib) => `costal-cartilage-of-${rib}`)
const carpals = ['scaphoid', 'lunate', 'triquetrum', 'pisiform', 'trapezium', 'trapezoid', 'capitate', 'hamate'].map((b) => `${b}-bone`)
const metacarpals = ordinals.map((n) => `${n}-metacarpal-bone`)
const handPhalanges = (row: string) => ordinals.filter((n) => row !== 'middle' || n !== 'first').map((n) => `${row}-phalanx-of-${n}-finger-of-hand`)
const tarsals = ['talus', 'calcaneus', 'navicular-bone', 'cuboid-bone', 'medial-cuneiform-bone', 'intermediate-cuneiform-bone', 'lateral-cuneiform-bone']
const metatarsals = ordinals.map((n) => `${n}-metatarsal-bone`)
const footPhalanges = (row: string) => ordinals.filter((n) => row !== 'middle' || n !== 'first').map((n) => `${row}-phalanx-of-${n}-finger-of-foot`)

/** A bone on both sides at once (the two parietals of the sagittal suture). */
const both = (bone: string) => [`${bone}-l`, `${bone}-r`]
const teeth = ['upper', 'lower'].flatMap((jaw) =>
  ['medial-incisor', 'lateral-incisor', 'canine', 'first-premolar', 'second-premolar', 'first-molar-tooth', 'second-molar-tooth'].flatMap((t) =>
    both(`${jaw}-${t}`),
  ),
)

/** The fibrous and cartilaginous joints of the skull: no piece of their own in the model, only the bones they join. */
const skullJoint = (key: string, es: string, la: string, en: string, bones: string[], view: JointView, aliases?: string[]): JointDef => ({
  key,
  es,
  la,
  en,
  aliases,
  region: 'skull',
  bones,
  view,
})

const SKULL: JointDef[] = [
  // The vault
  skullJoint('coronal-suture', 'Sutura coronal', 'Sutura coronalis', 'Coronal suture', ['frontal-bone', ...both('parietal-bone')], 'top', ['frontoparietal', 'bregma']),
  skullJoint('sagittal-suture', 'Sutura sagital', 'Sutura sagittalis', 'Sagittal suture', both('parietal-bone'), 'top', ['interparietal', 'obelion']),
  skullJoint('lambdoid-suture', 'Sutura lambdoidea', 'Sutura lambdoidea', 'Lambdoid suture', ['occipital-bone', ...both('parietal-bone')], 'back', ['parietooccipital', 'lambda']),
  skullJoint('squamous-suture', 'Sutura escamosa', 'Sutura squamosa', 'Squamous suture', ['parietal-bone', 'temporal-bone'], 'side', ['temporoparietal']),
  skullJoint('parietomastoid-suture', 'Sutura parietomastoidea', 'Sutura parietomastoidea', 'Parietomastoid suture', ['parietal-bone', 'temporal-bone'], 'side', ['asterion']),
  skullJoint('occipitomastoid-suture', 'Sutura occipitomastoidea', 'Sutura occipitomastoidea', 'Occipitomastoid suture', ['occipital-bone', 'temporal-bone'], 'side', ['asterion']),
  skullJoint('sphenofrontal-suture', 'Sutura esfenofrontal', 'Sutura sphenofrontalis', 'Sphenofrontal suture', ['sphenoid-bone', 'frontal-bone'], 'side', ['pterion']),
  skullJoint('sphenoparietal-suture', 'Sutura esfenoparietal', 'Sutura sphenoparietalis', 'Sphenoparietal suture', ['sphenoid-bone', 'parietal-bone'], 'side', ['pterion']),
  skullJoint('sphenosquamous-suture', 'Sutura esfenoescamosa', 'Sutura sphenosquamosa', 'Sphenosquamous suture', ['sphenoid-bone', 'temporal-bone'], 'side', ['pterion']),
  // The base
  skullJoint('frontoethmoidal-suture', 'Sutura frontoetmoidal', 'Sutura frontoethmoidalis', 'Fronto-ethmoidal suture', ['frontal-bone', 'ethmoid-bone'], 'front', ['agujeros etmoidales']),
  skullJoint('sphenoethmoidal-suture', 'Sutura esfenoetmoidal', 'Sutura sphenoethmoidalis', 'Spheno-ethmoidal suture', ['sphenoid-bone', 'ethmoid-bone'], 'top'),
  skullJoint('spheno-occipital-synchondrosis', 'Sincondrosis esfenooccipital', 'Synchondrosis sphenooccipitalis', 'Spheno-occipital synchondrosis', ['sphenoid-bone', 'occipital-bone'], 'below', ['clivus', 'basioccipital']),
  skullJoint('sphenopetrosal-synchondrosis', 'Sincondrosis esfenopetrosa', 'Synchondrosis sphenopetrosa', 'Sphenopetrosal synchondrosis', ['sphenoid-bone', 'temporal-bone'], 'below', ['agujero rasgado', 'foramen lacerum']),
  skullJoint('petro-occipital-synchondrosis', 'Sincondrosis petrooccipital', 'Synchondrosis petrooccipitalis', 'Petro-occipital synchondrosis', ['temporal-bone', 'occipital-bone'], 'below', ['petrobasilar', 'fisura petrooccipital']),
  // The face with the skull
  skullJoint('frontonasal-suture', 'Sutura frontonasal', 'Sutura frontonasalis', 'Frontonasal suture', ['frontal-bone', ...both('nasal-bone')], 'front', ['nasofrontal', 'nasion']),
  skullJoint('frontomaxillary-suture', 'Sutura frontomaxilar', 'Sutura frontomaxillaris', 'Frontomaxillary suture', ['frontal-bone', 'maxilla'], 'front'),
  skullJoint('frontolacrimal-suture', 'Sutura frontolagrimal', 'Sutura frontolacrimalis', 'Frontolacrimal suture', ['frontal-bone', 'lacrimal-bone'], 'front'),
  skullJoint('frontozygomatic-suture', 'Sutura frontocigomática', 'Sutura frontozygomatica', 'Frontozygomatic suture', ['frontal-bone', 'zygomatic-bone'], 'front', ['frontomalar']),
  skullJoint('sphenozygomatic-suture', 'Sutura esfenocigomática', 'Sutura sphenozygomatica', 'Sphenozygomatic suture', ['sphenoid-bone', 'zygomatic-bone'], 'front', ['esfenomalar']),
  skullJoint('sphenomaxillary-suture', 'Sutura esfenomaxilar', 'Sutura sphenomaxillaris', 'Sphenomaxillary suture', ['sphenoid-bone', 'maxilla'], 'side'),
  skullJoint('temporozygomatic-suture', 'Sutura temporocigomática', 'Sutura temporozygomatica', 'Temporozygomatic suture', ['temporal-bone', 'zygomatic-bone'], 'side', ['arco cigomático']),
  skullJoint('ethmoidomaxillary-suture', 'Sutura etmoidomaxilar', 'Sutura ethmoidomaxillaris', 'Ethmoidomaxillary suture', ['ethmoid-bone', 'maxilla'], 'front'),
  skullJoint('ethmoidolacrimal-suture', 'Sutura etmoidolagrimal', 'Sutura ethmoidolacrimalis', 'Ethmoidolacrimal suture', ['ethmoid-bone', 'lacrimal-bone'], 'front'),
  skullJoint('palato-ethmoidal-suture', 'Sutura palatoetmoidal', 'Sutura palatoethmoidalis', 'Palato-ethmoidal suture', ['palatine-bone', 'ethmoid-bone'], 'side'),
  skullJoint('sphenovomerine-schindylesis', 'Esquindilesis esfenovomeriana', 'Schindylesis sphenovomeriana', 'Sphenovomerine schindylesis', ['sphenoid-bone', 'vomer'], 'below', ['vómer']),
  skullJoint('ethmoidovomerine-synchondrosis', 'Sincondrosis etmoidovomeriana', 'Synchondrosis ethmoidovomeriana', 'Ethmoidovomerine synchondrosis', ['ethmoid-bone', 'vomer'], 'side', ['tabique nasal']),
  // The bones of the face among themselves
  skullJoint('internasal-suture', 'Sutura internasal', 'Sutura internasalis', 'Internasal suture', both('nasal-bone'), 'front'),
  skullJoint('nasomaxillary-suture', 'Sutura nasomaxilar', 'Sutura nasomaxillaris', 'Nasomaxillary suture', ['nasal-bone', 'maxilla'], 'front'),
  skullJoint('lacrimomaxillary-suture', 'Sutura lagrimomaxilar', 'Sutura lacrimomaxillaris', 'Lacrimomaxillary suture', ['lacrimal-bone', 'maxilla'], 'front', ['surco lagrimal']),
  skullJoint('lacrimoconchal-suture', 'Sutura lagrimoconchal', 'Sutura lacrimoconchalis', 'Lacrimoconchal suture', ['lacrimal-bone', 'inferior-nasal-concha-bone'], 'side', ['conducto nasolagrimal']),
  skullJoint('zygomaticomaxillary-suture', 'Sutura cigomaticomaxilar', 'Sutura zygomaticomaxillaris', 'Zygomaticomaxillary suture', ['zygomatic-bone', 'maxilla'], 'front', ['malar']),
  skullJoint('intermaxillary-suture', 'Sutura intermaxilar', 'Sutura intermaxillaris', 'Intermaxillary suture', both('maxilla'), 'front'),
  skullJoint('palatomaxillary-suture', 'Sutura palatomaxilar', 'Sutura palatomaxillaris', 'Palatomaxillary suture', ['palatine-bone', 'maxilla'], 'side'),
  skullJoint('median-palatine-suture', 'Sutura palatina media', 'Sutura palatina mediana', 'Median palatine suture', [...both('maxilla'), ...both('palatine-bone')], 'below', ['paladar', 'agujero incisivo']),
  skullJoint('transverse-palatine-suture', 'Sutura palatina transversa', 'Sutura palatina transversa', 'Transverse palatine suture', ['maxilla', 'palatine-bone'], 'below', ['paladar']),
]

/** Joints of the head with no piece in the model, outside the sutures: the teeth and the ossicles. */
const HEAD_WITHOUT_PIECES: JointDef[] = [
  {
    key: 'dento-alveolar',
    es: 'Gonfosis dentoalveolar',
    la: 'Gomphosis (syndesmosis dentoalveolaris)',
    en: 'Dento-alveolar syndesmosis',
    aliases: ['gonfosis', 'periodonto', 'ligamento periodontal', 'dientes', 'alveolodentaria'],
    region: 'head',
    bones: [...both('maxilla'), 'mandible', ...teeth],
    view: 'front',
  },
  {
    key: 'incudomallear',
    es: 'Articulación incudomaleolar',
    la: 'Articulatio incudomallearis',
    en: 'Incudomallear joint',
    aliases: ['huesecillos', 'martillo', 'yunque'],
    region: 'head',
    bones: ['malleus', 'incus'],
    view: 'side',
  },
  {
    key: 'incudostapedial',
    es: 'Articulación incudoestapedia',
    la: 'Articulatio incudostapedialis',
    en: 'Incudostapedial joint',
    aliases: ['huesecillos', 'yunque', 'estribo'],
    region: 'head',
    bones: ['incus', 'stapes'],
    view: 'side',
  },
  {
    key: 'tympanostapedial',
    es: 'Sindesmosis timpanoestapedia',
    la: 'Syndesmosis tympanostapedialis',
    en: 'Tympanostapedial syndesmosis',
    aliases: ['ligamento anular del estribo', 'ventana oval', 'ventana vestibular'],
    region: 'head',
    bones: ['stapes', 'temporal-bone'],
    view: 'side',
  },
]

export const JOINTS: JointDef[] = [
  ...SKULL,
  ...HEAD_WITHOUT_PIECES,
  // ---------- Head and larynx ----------
  {
    key: 'temporomandibular',
    es: 'Articulación temporomandibular',
    la: 'Articulatio temporomandibularis',
    en: 'Temporomandibular joint',
    aliases: ['ATM', 'temporomaxilar'],
    region: 'head',
    groups: ['Temporomandibular joint'],
    bones: ['temporal-bone', 'mandible'],
    view: 'side',
  },
  {
    key: 'cranial-syndesmoses',
    es: 'Sindesmosis craneales',
    la: 'Syndesmoses cranii',
    en: 'Cranial syndesmoses',
    aliases: ['ligamentos accesorios de la mandíbula', 'estilohioideo', 'esfenomandibular', 'estilomandibular'],
    region: 'head',
    groups: ['Cranial syndesmoses'],
    bones: ['temporal-bone', 'sphenoid-bone', 'mandible', 'hyoid-bone'],
    view: 'side',
  },
  {
    key: 'larynx',
    es: 'Articulaciones y membranas de la laringe',
    la: 'Articulationes laryngis',
    en: 'Laryngeal joints',
    aliases: ['membrana tirohioidea', 'cricotiroideo', 'cricoaritenoidea'],
    region: 'head',
    groups: ['Crico-arytenoid joint', 'Thyrohyoid membrane', 'Fibrous joints of larynx', 'Fibro-elastic membrane of larynx'],
    bones: ['hyoid-bone', 'thyroid-cartilage', 'cricoid-cartilage', 'arytenoid-cartilage', 'corniculate-cartilage'],
    view: 'side',
  },
  // ---------- Spine ----------
  {
    key: 'intervertebral-symphyses',
    es: 'Discos intervertebrales',
    la: 'Symphysis intervertebralis',
    en: 'Intervertebral symphysis',
    aliases: ['sínfisis intervertebral', 'núcleo pulposo', 'anillo fibroso'],
    region: 'spine',
    groups: ['Intervertebral symphysis'],
    bones: vertebrae,
    view: 'side',
  },
  {
    key: 'vertebral-ligaments',
    es: 'Ligamentos de la columna vertebral',
    la: 'Syndesmoses columnae vertebralis',
    en: 'Fibrous joints of vertebral column',
    aliases: ['ligamento longitudinal', 'ligamentos amarillos', 'ligamento nucal', 'supraespinoso', 'interespinosos'],
    region: 'spine',
    groups: ['Fibrous joints of vertebral column'],
    bones: vertebrae,
    view: 'side',
  },
  {
    key: 'atlanto-occipital',
    es: 'Articulación atlantooccipital',
    la: 'Articulatio atlantooccipitalis',
    en: 'Atlanto-occipital joint',
    aliases: ['occipitoatloidea', 'cóndilos occipitales', 'charnela craneovertebral'],
    region: 'spine',
    bones: ['occipital-bone', 'atlas-c1'],
    view: 'front',
  },
  {
    key: 'median-atlanto-axial',
    es: 'Articulación atlantoaxoidea media',
    la: 'Articulatio atlantoaxialis mediana',
    en: 'Median atlanto-axial joint',
    aliases: ['atloidoodontoidea', 'diente del axis', 'odontoides', 'ligamento transverso', 'ligamento cruciforme'],
    region: 'spine',
    bones: ['atlas-c1', 'axis-c2'],
    view: 'top',
  },
  {
    key: 'lateral-atlanto-axial',
    es: 'Articulación atlantoaxoidea lateral',
    la: 'Articulatio atlantoaxialis lateralis',
    en: 'Lateral atlanto-axial joint',
    aliases: ['atloidoaxoidea'],
    region: 'spine',
    bones: ['atlas-c1', 'axis-c2'],
    view: 'front',
  },
  {
    key: 'occipito-axial',
    es: 'Ligamentos occipitoaxoideos',
    la: 'Membrana tectoria et ligamenta alaria',
    en: 'Tectorial membrane and alar ligaments',
    aliases: ['membrana tectoria', 'ligamentos alares', 'ligamento del vértice del diente', 'occipitoaxoidea'],
    region: 'spine',
    bones: ['occipital-bone', 'atlas-c1', 'axis-c2'],
    view: 'back',
  },
  {
    key: 'zygapophysial',
    es: 'Articulaciones cigapofisarias',
    la: 'Articulationes zygapophysiales',
    en: 'Zygapophysial joints',
    aliases: ['interapofisarias', 'facetarias', 'procesos articulares', 'apófisis articulares'],
    region: 'spine',
    bones: vertebrae.slice(1, -1),
    view: 'back',
  },
  {
    key: 'sacrococcygeal',
    es: 'Articulación sacrococcígea',
    la: 'Articulatio sacrococcygea',
    en: 'Sacrococcygeal joint',
    covers: ['Symphyses intercoccygeae'],
    aliases: ['sínfisis sacrococcígea', 'intercoccígeas', 'ligamento intercornual', 'cóccix'],
    region: 'spine',
    pieces: ['sacrococcygeal-symphysis', 'intercornual-ligament'],
    bones: ['sacrum', 'coccyx'],
    view: 'side',
  },
  // ---------- Thorax ----------
  {
    key: 'head-of-rib',
    es: 'Articulaciones de la cabeza de la costilla',
    la: 'Articulationes capitis costae',
    en: 'Joints of head of rib',
    aliases: ['costovertebrales', 'costocorporales', 'cabeza de la costilla', 'ligamento radiado'],
    region: 'thorax',
    groups: ['Joint of head of rib'],
    bones: [...vertebrae.filter((v) => v.startsWith('vertebra-t')), ...ribs],
    view: 'side',
  },
  {
    key: 'costotransverse',
    es: 'Articulaciones costotransversas',
    la: 'Articulationes costotransversariae',
    en: 'Costotransverse joints',
    aliases: ['costovertebrales', 'tubérculo de la costilla', 'proceso transverso', 'costolaminar'],
    region: 'thorax',
    groups: ['Costotransverse joint'],
    bones: [...vertebrae.filter((v) => v.startsWith('vertebra-t')).slice(0, 10), ...ribs.slice(0, 10)],
    view: 'back',
  },
  {
    key: 'intercostal-membranes',
    es: 'Membranas intercostales',
    la: 'Syndesmoses thoracis',
    en: 'Fibrous joints of thorax',
    region: 'thorax',
    groups: ['Fibrous joints of thorax'],
    bones: ribs,
  },
  {
    key: 'costochondral',
    es: 'Articulaciones costocondrales',
    la: 'Articulationes costochondrales',
    en: 'Costochondral joints',
    aliases: ['condrocostales', 'cartílagos costales'],
    region: 'thorax',
    bones: [...ribs.slice(0, 10), ...costalCartilages],
    view: 'front',
  },
  {
    key: 'first-rib-synchondrosis',
    es: 'Sincondrosis de la primera costilla',
    la: 'Synchondrosis costae primae',
    en: 'Synchondrosis of first rib',
    aliases: ['esternocostal de la primera costilla', 'primer cartílago costal'],
    region: 'thorax',
    bones: ['manubrium-of-sternum', costalCartilages[0], 'first-rib'],
    view: 'front',
  },
  {
    key: 'sternocostal',
    es: 'Articulaciones esternocostales',
    la: 'Articulationes sternocostales',
    en: 'Sternocostal joints',
    aliases: ['condroesternales', 'ligamentos radiados', 'membrana esternal', 'costoxifoideo'],
    region: 'thorax',
    bones: ['manubrium-of-sternum', 'body-of-sternum', ...costalCartilages.slice(1, 7)],
    view: 'front',
  },
  {
    key: 'interchondral',
    es: 'Articulaciones intercondrales',
    la: 'Articulationes interchondrales',
    en: 'Interchondral joints',
    aliases: ['arco costal', 'reborde costal'],
    region: 'thorax',
    bones: costalCartilages.slice(4, 10),
    view: 'front',
  },
  {
    key: 'manubriosternal',
    es: 'Sínfisis manubrioesternal',
    la: 'Symphysis manubriosternalis',
    en: 'Manubriosternal joint',
    aliases: ['ángulo esternal', 'ángulo de Louis', 'manubrio'],
    region: 'thorax',
    bones: ['manubrium-of-sternum', 'body-of-sternum'],
    view: 'front',
  },
  {
    key: 'xiphisternal',
    es: 'Sincondrosis xifoesternal',
    la: 'Synchondrosis xiphosternalis',
    en: 'Xiphisternal joint',
    aliases: ['xifoides', 'apófisis xifoides'],
    region: 'thorax',
    bones: ['body-of-sternum', 'xiphoid-process'],
    view: 'front',
  },
  // ---------- Upper limb ----------
  {
    key: 'sternoclavicular',
    es: 'Articulación esternoclavicular',
    la: 'Articulatio sternoclavicularis',
    en: 'Sternoclavicular joint',
    region: 'upper-limb',
    groups: ['Sternoclavicular joint'],
    bones: ['manubrium-of-sternum', 'clavicle', 'first-rib', 'costal-cartilage-of-first-rib'],
    view: 'front',
  },
  {
    key: 'acromioclavicular',
    es: 'Articulación acromioclavicular',
    la: 'Articulatio acromioclavicularis',
    en: 'Acromioclavicular joint',
    covers: ['Syndesmosis coracoclavicularis'],
    aliases: ['coracoclavicular', 'conoide', 'trapezoide'],
    region: 'upper-limb',
    groups: ['Acromioclavicular joint'],
    bones: ['clavicle', 'scapula'],
    view: 'top',
  },
  {
    key: 'scapular-ligaments',
    es: 'Ligamentos propios de la escápula',
    la: 'Syndesmoses cinguli pectoralis',
    en: 'Fibrous joints of pectoral girdle',
    aliases: ['coracoacromial', 'transverso de la escápula', 'omóplato'],
    region: 'upper-limb',
    groups: ['Fibrous joints of pectoral girdle'],
    bones: ['scapula'],
    view: 'back',
  },
  {
    key: 'glenohumeral',
    es: 'Articulación del hombro',
    la: 'Articulatio humeri',
    covers: ['Articulatio humeri (glenohumeralis)'],
    en: 'Glenohumeral joint',
    aliases: ['glenohumeral', 'escapulohumeral'],
    region: 'upper-limb',
    groups: ['Glenohumeral joint'],
    bones: ['scapula', 'humerus'],
    view: 'front',
  },
  {
    key: 'elbow',
    es: 'Articulación del codo',
    la: 'Articulatio cubiti',
    covers: ['Articulatio humeroulnaris', 'Articulatio humeroradialis', 'Articulatio radioulnaris proximalis'],
    en: 'Elbow joint',
    aliases: ['humeroulnar', 'humerorradial', 'radioulnar proximal', 'radiocubital superior'],
    region: 'upper-limb',
    groups: ['Elbow joint'],
    bones: ['humerus', 'radius', 'ulna'],
    view: 'front',
  },
  {
    key: 'radio-ulnar-syndesmosis',
    es: 'Membrana interósea del antebrazo',
    la: 'Syndesmosis radioulnaris',
    en: 'Radio-ulnar syndesmoses',
    aliases: ['sindesmosis radioulnar', 'cuerda oblicua'],
    region: 'upper-limb',
    groups: ['Radio-ulnar syndesmoses'],
    bones: ['radius', 'ulna'],
    view: 'front',
  },
  {
    key: 'distal-radio-ulnar',
    es: 'Articulación radioulnar distal',
    la: 'Articulatio radioulnaris distalis',
    en: 'Distal radio-ulnar joint',
    aliases: ['radiocubital inferior', 'ligamento triangular'],
    region: 'upper-limb',
    groups: ['Distal radio-ulnar joint'],
    bones: ['radius', 'ulna'],
    view: 'front',
  },
  {
    key: 'radiocarpal',
    es: 'Articulación radiocarpiana',
    la: 'Articulatio radiocarpalis',
    en: 'Radiocarpal joint',
    aliases: ['muñeca'],
    region: 'upper-limb',
    groups: ['Radiocarpal joint'],
    bones: ['radius', 'ulna', 'scaphoid-bone', 'lunate-bone', 'triquetrum-bone', 'pisiform-bone'],
    view: 'front',
  },
  {
    key: 'intercarpal',
    es: 'Articulaciones intercarpianas',
    la: 'Articulationes intercarpales',
    en: 'Intercarpal joints',
    aliases: ['carpo', 'primera fila', 'segunda fila', 'escafolunar', 'lunopiramidal'],
    region: 'upper-limb',
    groups: ['Intercarpal joints'],
    bones: carpals,
    view: 'front',
  },
  {
    key: 'mediocarpal',
    es: 'Articulación mediocarpiana',
    la: 'Articulatio mediocarpalis',
    en: 'Midcarpal joint',
    aliases: ['mediocarpiana', 'entre las dos filas del carpo', 'ligamento radiado del carpo'],
    region: 'upper-limb',
    pieces: [
      'radiate-carpal-ligament',
      'scaphocapitate-ligament',
      'triquetrocapitate-ligament',
      'triquetrohamate-ligament',
      'scaphotrapeziotrapezoidal-ligament',
      'dorsal-intercarpal-ligaments',
      'palmar-scaphotriquetral-ligament',
      'dorsal-scaphotriquetral-ligament',
    ],
    bones: carpals.filter((b) => b !== 'pisiform-bone'),
    view: 'front',
  },
  {
    key: 'pisiform',
    es: 'Articulación del pisiforme',
    la: 'Articulatio ossis pisiformis',
    en: 'Pisiform joint',
    aliases: ['pisipiramidal', 'pisopiramidal', 'pisiforme'],
    region: 'upper-limb',
    pieces: ['pisotriquetral-ligament', 'pisohamate-ligament', 'pisometacarpal-ligament'],
    bones: ['pisiform-bone', 'triquetrum-bone', 'hamate-bone', 'fifth-metacarpal-bone'],
    view: 'front',
  },
  {
    key: 'carpometacarpal',
    es: 'Articulaciones carpometacarpianas',
    la: 'Articulationes carpometacarpales',
    en: 'Carpometacarpal joints',
    region: 'upper-limb',
    groups: ['Carpometacarpal joints'],
    bones: [...carpals.slice(5), ...metacarpals.slice(1)],
    view: 'front',
  },
  {
    key: 'thumb-carpometacarpal',
    es: 'Articulación trapeciometacarpiana',
    la: 'Articulatio carpometacarpalis pollicis',
    en: 'Carpometacarpal joint of thumb',
    aliases: ['carpometacarpiana del pulgar', 'pulgar', 'oposición', 'rizartrosis', 'silla de montar'],
    region: 'upper-limb',
    bones: ['trapezium-bone', 'first-metacarpal-bone'],
    view: 'front',
  },
  {
    key: 'intermetacarpal',
    es: 'Articulaciones intermetacarpianas',
    la: 'Articulationes intermetacarpales',
    en: 'Intermetacarpal joints',
    region: 'upper-limb',
    groups: ['Intermetacarpal joints'],
    bones: metacarpals.slice(1),
    view: 'front',
  },
  {
    key: 'metacarpophalangeal',
    es: 'Articulaciones metacarpofalángicas',
    la: 'Articulationes metacarpophalangeae',
    en: 'Metacarpophalangeal joints',
    region: 'upper-limb',
    groups: ['Metacarpophalangeal joints'],
    bones: [...metacarpals, ...handPhalanges('proximal')],
    view: 'front',
  },
  {
    key: 'hand-interphalangeal',
    es: 'Articulaciones interfalángicas de la mano',
    la: 'Articulationes interphalangeae manus',
    covers: ['Articulatio interphalangea pollicis', 'Articulationes interphalangeae proximales manus', 'Articulationes interphalangeae distales manus'],
    en: 'Interphalangeal joints of hand',
    aliases: ['dedos'],
    region: 'upper-limb',
    groups: ['Interphalangeal joints of hand'],
    bones: [...handPhalanges('proximal'), ...handPhalanges('middle'), ...handPhalanges('distal')],
    view: 'front',
  },
  // ---------- Pelvis ----------
  {
    key: 'sacro-iliac',
    es: 'Articulación sacroilíaca',
    la: 'Articulatio sacroiliaca',
    en: 'Sacro-iliac joint',
    region: 'pelvis',
    groups: ['Sacro-iliac joint'],
    bones: ['sacrum', 'hip-bone'],
    view: 'back',
  },
  {
    key: 'pubic-symphysis',
    es: 'Sínfisis del pubis',
    la: 'Symphysis pubica',
    en: 'Pubic symphysis',
    aliases: ['disco interpúbico'],
    region: 'pelvis',
    pieces: ['pubic-symphysis', 'interpubic-disc', 'superior-pubic-ligament', 'inferior-pubic-ligament'],
    bones: ['hip-bone'],
    view: 'front',
  },
  {
    key: 'pelvic-ligaments',
    es: 'Ligamentos a distancia de la pelvis',
    la: 'Syndesmoses cinguli pelvici',
    en: 'Fibrous joints of pelvic girdle',
    aliases: ['sacrociático', 'sacrotuberoso', 'sacroespinoso', 'iliolumbar', 'membrana obturatriz'],
    region: 'pelvis',
    groups: ['Fibrous joints of pelvic girdle'],
    bones: ['hip-bone', 'sacrum', 'vertebra-l5'],
    view: 'back',
  },
  // ---------- Lower limb ----------
  {
    key: 'hip',
    es: 'Articulación de la cadera',
    la: 'Articulatio coxae',
    en: 'Hip joint',
    aliases: ['coxofemoral'],
    region: 'lower-limb',
    groups: ['Hip joint'],
    // The triradiate cartilage is the acetabulum's growth plate, kept with the hip.
    pieces: ['triradiate-cartilage'],
    bones: ['hip-bone', 'femur'],
    view: 'front',
  },
  {
    key: 'knee',
    es: 'Articulación de la rodilla',
    la: 'Articulatio genus',
    covers: ['Articulatio femorotibialis', 'Articulatio femoropatellaris'],
    en: 'Knee joint',
    aliases: ['meniscos', 'cruzados', 'femorotibial', 'femoropatelar'],
    region: 'lower-limb',
    groups: ['Knee joint'],
    bones: ['femur', 'tibia', 'fibula', 'patella'],
    view: 'front',
  },
  {
    key: 'superior-tibiofibular',
    es: 'Articulación tibiofibular proximal',
    la: 'Articulatio tibiofibularis',
    en: 'Superior tibiofibular joint',
    aliases: ['tibioperonea superior'],
    region: 'lower-limb',
    groups: ['Superior tibiofibular joint'],
    bones: ['tibia', 'fibula'],
    view: 'side',
  },
  {
    key: 'tibiofibular-syndesmosis',
    es: 'Sindesmosis tibiofibular y membrana interósea',
    la: 'Syndesmosis tibiofibularis',
    covers: ['Membrana interossea cruris'],
    en: 'Tibiofibular syndesmosis',
    aliases: ['tibioperonea inferior', 'membrana interósea de la pierna'],
    region: 'lower-limb',
    groups: ['Tibiofibular syndesmosis', 'Fibrous joints of free lower limb'],
    bones: ['tibia', 'fibula'],
    view: 'front',
  },
  {
    key: 'ankle',
    es: 'Articulación del tobillo',
    la: 'Articulatio talocruralis',
    en: 'Ankle joint',
    aliases: ['talocrural', 'tibiotarsiana', 'deltoideo'],
    region: 'lower-limb',
    groups: ['Lateral collateral ligament of ankle', 'Medial collateral ligament of ankle'],
    bones: ['tibia', 'fibula', 'talus', 'calcaneus', 'navicular-bone'],
    view: 'front',
  },
  // The intertarsal joints one by one: the model's group splits cleanly by ligament.
  {
    key: 'subtalar',
    es: 'Articulación subastragalina',
    la: 'Articulatio subtalaris',
    en: 'Subtalar joint',
    covers: ['Articulatio subtalaris (talocalcanea)'],
    aliases: ['subtalar', 'talocalcánea', 'astragalocalcánea', 'seno del tarso', 'inversión', 'eversión', 'tarso'],
    region: 'lower-limb',
    pieces: [
      'talocalcaneal-interosseous-ligament',
      'lateral-talocalcaneal-ligament',
      'medial-talocalcaneal-ligament',
      'posterior-talocalcaneal-ligament',
      'anterior-talocalcaneal-ligament',
    ],
    bones: ['talus', 'calcaneus'],
    view: 'side',
  },
  {
    key: 'talocalcaneonavicular',
    es: 'Articulación astragalocalcaneonavicular',
    la: 'Articulatio talocalcaneonavicularis',
    en: 'Talocalcaneonavicular joint',
    aliases: ['talocalcaneonavicular', 'Chopart', 'transversa del tarso', 'mediotarsiana', 'ligamento en muelle', 'ligamento bifurcado', 'tarso'],
    region: 'lower-limb',
    pieces: ['talonavicular-ligament', 'plantar-calcaneonavicular-ligament', 'calcaneonavicular-ligament'],
    bones: ['talus', 'calcaneus', 'navicular-bone'],
    view: 'side',
  },
  {
    key: 'calcaneocuboid',
    es: 'Articulación calcaneocuboidea',
    la: 'Articulatio calcaneocuboidea',
    en: 'Calcaneocuboid joint',
    aliases: ['Chopart', 'transversa del tarso', 'ligamento plantar largo', 'ligamento bifurcado', 'tarso'],
    region: 'lower-limb',
    pieces: ['calcaneocuboid-ligament', 'dorsal-calcaneocuboid-ligament', 'plantar-calcaneocuboid-ligament', 'long-plantar-ligament'],
    bones: ['calcaneus', 'cuboid-bone'],
    view: 'side',
  },
  {
    key: 'cuneonavicular',
    es: 'Articulación cuneonavicular',
    la: 'Articulatio cuneonavicularis',
    en: 'Cuneonavicular joint',
    aliases: ['escafocuneal', 'navicular', 'cuneiformes', 'tarso'],
    region: 'lower-limb',
    pieces: ['dorsal-cuneonavicular-ligaments', 'plantar-cuneonavicular-ligaments'],
    bones: ['navicular-bone', 'medial-cuneiform-bone', 'intermediate-cuneiform-bone', 'lateral-cuneiform-bone'],
    view: 'top',
  },
  {
    key: 'cuboideonavicular',
    es: 'Articulación cuboideonavicular',
    la: 'Articulatio cuboideonavicularis',
    en: 'Cuboideonavicular joint',
    aliases: ['cubonavicular', 'escafocuboidea', 'tarso'],
    region: 'lower-limb',
    pieces: ['dorsal-cuboideonavicular-ligament', 'plantar-cuboideonavicular-ligament'],
    bones: ['navicular-bone', 'cuboid-bone'],
    view: 'top',
  },
  {
    key: 'intercuneiform',
    es: 'Articulaciones intercuneiformes',
    la: 'Articulationes intercuneiformes',
    en: 'Intercuneiform joints',
    aliases: ['cuneiformes', 'tarso'],
    region: 'lower-limb',
    pieces: ['dorsal-intercuneiform-ligaments', 'plantar-intercuneiform-ligaments', 'intercuneiform-interosseous-ligaments'],
    bones: ['medial-cuneiform-bone', 'intermediate-cuneiform-bone', 'lateral-cuneiform-bone'],
    view: 'top',
  },
  {
    key: 'cuneocuboid',
    es: 'Articulación cuneocuboidea',
    la: 'Articulatio cuneocuboidea',
    en: 'Cuneocuboid joint',
    aliases: ['cuboides', 'cuneiforme lateral', 'tarso'],
    region: 'lower-limb',
    pieces: ['dorsal-cuneocuboid-ligament', 'plantar-cuneocuboid-ligament', 'cuneocuboid-interosseous-ligament'],
    bones: ['lateral-cuneiform-bone', 'cuboid-bone'],
    view: 'top',
  },
  {
    key: 'tarsometatarsal',
    es: 'Articulaciones tarsometatarsianas',
    la: 'Articulationes tarsometatarsales',
    en: 'Tarsometatarsal joints',
    aliases: ['Lisfranc'],
    region: 'lower-limb',
    groups: ['Tarsometatarsal joints'],
    bones: [...tarsals.slice(3), ...metatarsals],
    view: 'top',
  },
  {
    key: 'intermetatarsal',
    es: 'Articulaciones intermetatarsianas',
    la: 'Articulationes intermetatarsales',
    en: 'Intermetatarsal joints',
    region: 'lower-limb',
    groups: ['Intermetatarsal joints'],
    bones: [...metatarsals, 'sesamoid-bones-of-foot'],
    view: 'top',
  },
  {
    key: 'metatarsophalangeal',
    es: 'Articulaciones metatarsofalángicas',
    la: 'Articulationes metatarsophalangeae',
    en: 'Metatarsophalangeal joints',
    region: 'lower-limb',
    groups: ['Metatarsophalangeal joints'],
    bones: [...metatarsals, ...footPhalanges('proximal'), 'sesamoid-bones-of-foot'],
    view: 'top',
  },
  {
    key: 'foot-interphalangeal',
    es: 'Articulaciones interfalángicas del pie',
    la: 'Articulationes interphalangeae pedis',
    covers: ['Articulatio interphalangea halucis', 'Articulationes interphalangeae proximales pedis', 'Articulationes interphalangeae distales pedis'],
    en: 'Interphalangeal joints of foot',
    aliases: ['dedos del pie'],
    region: 'lower-limb',
    groups: ['Interphalangeal joints of foot'],
    bones: [...footPhalanges('proximal'), ...footPhalanges('middle'), ...footPhalanges('distal')],
    view: 'top',
  },
]

export const jointByKey = new Map(JOINTS.map((j) => [j.key, j]))

const unsided = (id: string) => id.replace(/-[lr]$/, '')

/** Pieces of joints.glb that belong to each joint, both sides. */
export const jointPieces = new Map<string, SoftEntry[]>(JOINTS.map((j) => [j.key, []]))
/** The joint each piece of joints.glb belongs to. */
export const jointOfPiece = new Map<string, JointDef>()
for (const e of softEntries) {
  if (e.set !== 'joints') continue
  const joint =
    JOINTS.find((j) => j.pieces?.includes(unsided(e.id))) ?? JOINTS.find((j) => e.groups?.[0] && j.groups?.includes(e.groups[0].en))
  if (!joint) continue
  jointPieces.get(joint.key)!.push(e)
  jointOfPiece.set(e.id, joint)
}

export type JointSide = 'left' | 'right'

/** A bone id on one side, or the bone itself when it is unpaired. */
const sidedBone = (bone: string, side: JointSide) => {
  const sided = `${bone}-${side === 'left' ? 'l' : 'r'}`
  return pieceById.has(sided) ? sided : bone
}

/** What the viewer shows of a joint on one side: its pieces and its bones (unpaired ones, whole). */
export function jointParts(joint: JointDef, side: JointSide = 'right'): { pieces: SoftEntry[]; bones: string[] } {
  return {
    pieces: jointPieces.get(joint.key)!.filter((e) => !e.side || e.side === side),
    bones: [...new Set(joint.bones.map((b) => sidedBone(b, side)))],
  }
}

/** A joint's pieces in the order of its card: capsule first, then ligaments, then cartilages, by name. */
export function jointPieceList(joint: JointDef, side: JointSide = 'right'): SoftEntry[] {
  const rank = (e: SoftEntry) => (e.kind === 'articular capsule' ? 0 : e.kind === 'ligament' ? 1 : 2)
  return jointParts(joint, side).pieces.sort((a, b) => rank(a) - rank(b) || softName(a).localeCompare(softName(b), 'es'))
}

export interface JointIndexEntry extends IndexEntry {
  joint: JointDef
}

export const jointIndexKey = (joint: JointDef) => `joint:${joint.key}`

/** The index's sections of joints, one per region, in the body's order. */
export const jointIndex: IndexSection<JointIndexEntry>[] = (Object.keys(REGION_LABEL) as JointRegion[]).map((region) => ({
  id: `joints-${region}`,
  label: REGION_LABEL[region],
  entries: JOINTS.filter((j) => j.region === region)
    .map((joint) => ({
      key: jointIndexKey(joint),
      joint,
      name: joint.es,
      title: joint.la,
      haystack: haystackOf(joint.es, joint.la, joint.en, ...(joint.aliases ?? []), ...jointPieces.get(joint.key)!.map(softName)),
    }))
    .sort(byName),
}))

/** The region a joint's card names above its title. */
export const jointKicker = (joint: JointDef) =>
  ({ skull: 'Cráneo', head: 'Cabeza', spine: 'Columna', thorax: 'Tórax', 'upper-limb': 'Miembro superior', pelvis: 'Pelvis', 'lower-limb': 'Miembro inferior' })[
    joint.region
  ]
