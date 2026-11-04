import { landmarkLatin } from './landmark-latin'

/**
 * Official Latin names (Terminologia Anatomica, successor of the Nomina Anatomica),
 * keyed by the TA English name used by the model (`BonePiece.en`, `Landmark.en`).
 * Hand-editable: an entry in `latinNames` always wins over the patterns below.
 *
 * Names follow TA without side (TA has no left/right terms). Numbered series
 * (ribs, phalanges, vertebrae, metacarpals, teeth) are built from patterns so
 * their Latin agreement stays consistent.
 */
export const latinNames: Record<string, string> = {
  // ---------- Skull ----------
  'Frontal bone': 'Os frontale',
  'Parietal bone': 'Os parietale',
  'Temporal bone': 'Os temporale',
  'Occipital bone': 'Os occipitale',
  'Sphenoid bone': 'Os sphenoidale',
  'Ethmoid bone': 'Os ethmoidale',
  Maxilla: 'Maxilla',
  'Zygomatic bone': 'Os zygomaticum',
  'Nasal bone': 'Os nasale',
  'Lacrimal bone': 'Os lacrimale',
  'Palatine bone': 'Os palatinum',
  'Inferior nasal concha bone': 'Concha nasalis inferior',
  Vomer: 'Vomer',
  Mandible: 'Mandibula',
  Malleus: 'Malleus',
  Incus: 'Incus',
  Stapes: 'Stapes',

  // ---------- Neck ----------
  'Hyoid bone': 'Os hyoideum',
  'Thyroid cartilage': 'Cartilago thyroidea',
  'Cricoid cartilage': 'Cartilago cricoidea',
  'Arytenoid cartilage': 'Cartilago arytenoidea',
  'Corniculate cartilage': 'Cartilago corniculata',

  // ---------- Nose ----------
  'Nasal septal cartilage': 'Cartilago septi nasi',
  'Lateral process of nasal septal cartilage': 'Processus lateralis cartilaginis septi nasi',
  'Major alar cartilage': 'Cartilago alaris major',

  // ---------- Spine and thorax ----------
  'Atlas (C1)': 'Atlas [C I]',
  'Axis (C2)': 'Axis [C II]',
  Sacrum: 'Os sacrum',
  Coccyx: 'Os coccygis',
  'Manubrium of sternum': 'Manubrium sterni',
  'Body of sternum': 'Corpus sterni',
  'Xiphoid process': 'Processus xiphoideus',

  // ---------- Upper limb ----------
  Clavicle: 'Clavicula',
  Scapula: 'Scapula',
  Humerus: 'Humerus',
  Radius: 'Radius',
  Ulna: 'Ulna',
  'Scaphoid bone': 'Os scaphoideum',
  'Lunate bone': 'Os lunatum',
  'Triquetrum bone': 'Os triquetrum',
  'Pisiform bone': 'Os pisiforme',
  'Trapezium bone': 'Os trapezium',
  'Trapezoid bone': 'Os trapezoideum',
  'Capitate bone': 'Os capitatum',
  'Hamate bone': 'Os hamatum',

  // ---------- Lower limb ----------
  'Hip bone': 'Os coxae',
  Femur: 'Femur',
  Patella: 'Patella',
  Tibia: 'Tibia',
  Fibula: 'Fibula',
  Talus: 'Talus',
  Calcaneus: 'Calcaneus',
  'Navicular bone': 'Os naviculare',
  'Cuboid bone': 'Os cuboideum',
  'Medial cuneiform bone': 'Os cuneiforme mediale',
  'Intermediate cuneiform bone': 'Os cuneiforme intermedium',
  'Lateral cuneiform bone': 'Os cuneiforme laterale',
  'Sesamoid bones of foot': 'Ossa sesamoidea pedis',
}

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth']
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
/** Latin ordinals: feminine nominative (costa prima) and genitive (costae primae), neuter (os primum). */
const FEM = ['prima', 'secunda', 'tertia', 'quarta', 'quinta', 'sexta', 'septima', 'octava', 'nona', 'decima', 'undecima', 'duodecima']
const FEM_GEN = ['primae', 'secundae', 'tertiae', 'quartae', 'quintae', 'sextae', 'septimae', 'octavae', 'nonae', 'decimae', 'undecimae', 'duodecimae']
const NEUT = ['primum', 'secundum', 'tertium', 'quartum', 'quintum']

/** Digits in the genitive, by their TA names: pollex, index…; hallux… */
const HAND_DIGITS = ['pollicis', 'indicis', 'digiti medii', 'digiti anularis', 'digiti minimi manus']
const FOOT_DIGITS = ['halucis', 'digiti secundi pedis', 'digiti tertii pedis', 'digiti quarti pedis', 'digiti minimi pedis']

const PHALANX: Record<string, string> = { Proximal: 'proximalis', Middle: 'media', Distal: 'distalis' }
const VERTEBRA: Record<string, string> = { C: 'cervicalis', T: 'thoracica', L: 'lumbalis' }
const TOOTH: Record<string, string> = {
  'medial incisor': 'Dens incisivus medialis',
  'lateral incisor': 'Dens incisivus lateralis',
  canine: 'Dens caninus',
  'first premolar': 'Dens premolaris primus',
  'second premolar': 'Dens premolaris secundus',
  'first molar tooth': 'Dens molaris primus',
  'second molar tooth': 'Dens molaris secundus',
  'third molar tooth': 'Dens molaris tertius',
}

const ordinal = (word: string) => ORDINALS.indexOf(word.toLowerCase())

const patterns: [RegExp, (m: RegExpMatchArray) => string | undefined][] = [
  [/^(\w+) rib$/, (m) => (ordinal(m[1]) >= 0 ? `Costa ${FEM[ordinal(m[1])]} [${ROMAN[ordinal(m[1])]}]` : undefined)],
  [/^Costal cartilage of (\w+) rib$/, (m) => (ordinal(m[1]) >= 0 ? `Cartilago costalis costae ${FEM_GEN[ordinal(m[1])]}` : undefined)],
  [/^(\w+) metacarpal bone$/, (m) => (ordinal(m[1]) >= 0 ? `Os metacarpi ${NEUT[ordinal(m[1])]} [${ROMAN[ordinal(m[1])]}]` : undefined)],
  [/^(\w+) metatarsal bone$/, (m) => (ordinal(m[1]) >= 0 ? `Os metatarsi ${NEUT[ordinal(m[1])]} [${ROMAN[ordinal(m[1])]}]` : undefined)],
  [
    /^(Proximal|Middle|Distal) phalanx of (\w+) finger of (hand|foot)$/,
    (m) => {
      const i = ordinal(m[2])
      const digit = (m[3] === 'hand' ? HAND_DIGITS : FOOT_DIGITS)[i]
      return digit ? `Phalanx ${PHALANX[m[1]]} ${digit}` : undefined
    },
  ],
  [
    /^Vertebra ([CTL])(\d+)$/,
    (m) => (m[1] === 'C' && m[2] === '7' ? 'Vertebra prominens [C VII]' : `Vertebra ${VERTEBRA[m[1]]} [${m[1]} ${ROMAN[+m[2] - 1]}]`),
  ],
  [
    /^(Upper|Lower) (.+)$/,
    (m) => (TOOTH[m[2]] ? `${TOOTH[m[2]]} (arcus ${m[1] === 'Upper' ? 'maxillaris' : 'mandibularis'})` : undefined),
  ],
]

/** The Latin TA name for a TA English name, or undefined if not yet written. */
export function latinOf(en: string): string | undefined {
  if (latinNames[en]) return latinNames[en]
  if (landmarkLatin[en]) return landmarkLatin[en]
  for (const [re, build] of patterns) {
    const m = en.match(re)
    if (m) {
      const latin = build(m)
      if (latin) return latin
    }
  }
}
