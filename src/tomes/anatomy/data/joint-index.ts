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
  /** TA groups whose pieces belong to it (nearest group of each piece). */
  groups?: string[]
  /** Single pieces, without side. */
  pieces?: string[]
  /** Bones it joins, without side. */
  bones: string[]
  view?: JointView
}

export type JointRegion = 'head' | 'spine' | 'thorax' | 'upper-limb' | 'pelvis' | 'lower-limb'

const REGION_LABEL: Record<JointRegion, string> = {
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
const carpals = ['scaphoid', 'lunate', 'triquetrum', 'pisiform', 'trapezium', 'trapezoid', 'capitate', 'hamate'].map((b) => `${b}-bone`)
const metacarpals = ordinals.map((n) => `${n}-metacarpal-bone`)
const handPhalanges = (row: string) => ordinals.filter((n) => row !== 'middle' || n !== 'first').map((n) => `${row}-phalanx-of-${n}-finger-of-hand`)
const tarsals = ['talus', 'calcaneus', 'navicular-bone', 'cuboid-bone', 'medial-cuneiform-bone', 'intermediate-cuneiform-bone', 'lateral-cuneiform-bone']
const metatarsals = ordinals.map((n) => `${n}-metatarsal-bone`)
const footPhalanges = (row: string) => ordinals.filter((n) => row !== 'middle' || n !== 'first').map((n) => `${row}-phalanx-of-${n}-finger-of-foot`)

export const JOINTS: JointDef[] = [
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
  // ---------- Thorax ----------
  {
    key: 'costovertebral',
    es: 'Articulaciones costovertebrales',
    la: 'Articulationes costovertebrales',
    en: 'Costovertebral joints',
    aliases: ['cabeza de la costilla', 'costotransversa'],
    region: 'thorax',
    groups: ['Joint of head of rib', 'Costotransverse joint'],
    bones: [...vertebrae.filter((v) => v.startsWith('vertebra-t')), ...ribs],
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
    aliases: ['mediocarpiana', 'carpo', 'pisiforme'],
    region: 'upper-limb',
    groups: ['Intercarpal joints'],
    bones: carpals,
    view: 'front',
  },
  {
    key: 'carpometacarpal',
    es: 'Articulaciones carpometacarpianas',
    la: 'Articulationes carpometacarpales',
    en: 'Carpometacarpal joints',
    aliases: ['trapeciometacarpiana', 'pulgar'],
    region: 'upper-limb',
    groups: ['Carpometacarpal joints'],
    bones: [...carpals.slice(4), ...metacarpals],
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
  {
    key: 'intertarsal',
    es: 'Articulaciones intertarsianas',
    la: 'Articulationes intertarsales',
    en: 'Intertarsal joints',
    aliases: ['subtalar', 'Chopart', 'talocalcánea', 'calcaneocuboidea', 'tarso'],
    region: 'lower-limb',
    groups: ['Intertarsal joints'],
    bones: tarsals,
    view: 'side',
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
  ({ head: 'Cabeza', spine: 'Columna', thorax: 'Tórax', 'upper-limb': 'Miembro superior', pelvis: 'Pelvis', 'lower-limb': 'Miembro inferior' })[
    joint.region
  ]
