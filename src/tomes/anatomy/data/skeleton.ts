import { bonePieces } from './bones'

export type Side = 'left' | 'right'
export type Tissue = 'bone' | 'cartilage' | 'tooth'
export type Division = 'axial' | 'appendicular'

export type RegionId = 'head' | 'neck' | 'spine' | 'thorax' | 'upper-limb' | 'lower-limb'

export type GroupId =
  | 'cranium'
  | 'mandible'
  | 'hyoid'
  | 'auditory-ossicles'
  | 'nasal-cartilages'
  | 'teeth'
  | 'laryngeal-cartilages'
  | 'cervical-vertebrae'
  | 'thoracic-vertebrae'
  | 'lumbar-vertebrae'
  | 'sacrum-coccyx'
  | 'sternum'
  | 'ribs'
  | 'costal-cartilages'
  | 'pectoral-girdle'
  | 'arm-forearm'
  | 'carpals'
  | 'metacarpals'
  | 'hand-phalanges'
  | 'pelvic-girdle'
  | 'thigh-leg'
  | 'tarsals'
  | 'metatarsals'
  | 'foot-phalanges'
  | 'foot-sesamoids'

/** One selectable piece of the 3D skeleton (a node in assets/skeleton.glb). */
export interface BonePiece {
  /** Node name in the GLB. English kebab-case, `-l` / `-r` suffix for paired pieces. */
  id: string
  /** Full display name, side included and gender-agreed ("Clavícula derecha"). */
  name: string
  /** Name without side ("Clavícula"); shared by both sides, useful for quizzes. */
  base: string
  /** Accepted synonyms (classical vs. international nomenclature). */
  aliases?: string[]
  side?: Side
  group: GroupId
  /** Defaults to 'bone'. */
  tissue?: Tissue
  /** Terminologia Anatomica English name, as in the source model. */
  en: string
}

export interface Region {
  id: RegionId
  name: string
  division: Division
}

export interface Group {
  id: GroupId
  name: string
  region: RegionId
}

export const regions: Region[] = [
  { id: 'head', name: 'Cabeza', division: 'axial' },
  { id: 'neck', name: 'Cuello', division: 'axial' },
  { id: 'spine', name: 'Columna vertebral', division: 'axial' },
  { id: 'thorax', name: 'Tórax', division: 'axial' },
  { id: 'upper-limb', name: 'Miembro superior', division: 'appendicular' },
  { id: 'lower-limb', name: 'Miembro inferior', division: 'appendicular' },
]

export const groups: Group[] = [
  { id: 'cranium', name: 'Huesos del cráneo', region: 'head' },
  { id: 'mandible', name: 'Mandíbula', region: 'head' },
  { id: 'auditory-ossicles', name: 'Huesecillos del oído', region: 'head' },
  { id: 'teeth', name: 'Dientes', region: 'head' },
  { id: 'nasal-cartilages', name: 'Cartílagos nasales', region: 'head' },
  { id: 'hyoid', name: 'Hioides', region: 'neck' },
  { id: 'laryngeal-cartilages', name: 'Cartílagos laríngeos', region: 'neck' },
  { id: 'cervical-vertebrae', name: 'Vértebras cervicales', region: 'spine' },
  { id: 'thoracic-vertebrae', name: 'Vértebras torácicas', region: 'spine' },
  { id: 'lumbar-vertebrae', name: 'Vértebras lumbares', region: 'spine' },
  { id: 'sacrum-coccyx', name: 'Sacro y cóccix', region: 'spine' },
  { id: 'sternum', name: 'Esternón', region: 'thorax' },
  { id: 'ribs', name: 'Costillas', region: 'thorax' },
  { id: 'costal-cartilages', name: 'Cartílagos costales', region: 'thorax' },
  { id: 'pectoral-girdle', name: 'Cintura escapular', region: 'upper-limb' },
  { id: 'arm-forearm', name: 'Brazo y antebrazo', region: 'upper-limb' },
  { id: 'carpals', name: 'Huesos del carpo', region: 'upper-limb' },
  { id: 'metacarpals', name: 'Metacarpianos', region: 'upper-limb' },
  { id: 'hand-phalanges', name: 'Falanges de la mano', region: 'upper-limb' },
  { id: 'pelvic-girdle', name: 'Cintura pélvica', region: 'lower-limb' },
  { id: 'thigh-leg', name: 'Muslo y pierna', region: 'lower-limb' },
  { id: 'tarsals', name: 'Huesos del tarso', region: 'lower-limb' },
  { id: 'metatarsals', name: 'Metatarsianos', region: 'lower-limb' },
  { id: 'foot-phalanges', name: 'Falanges del pie', region: 'lower-limb' },
  { id: 'foot-sesamoids', name: 'Sesamoideos del pie', region: 'lower-limb' },
]

export const pieces = bonePieces
export const pieceById = new Map(bonePieces.map((p) => [p.id, p]))
export const groupById = new Map(groups.map((g) => [g.id, g]))
export const regionById = new Map(regions.map((r) => [r.id, r]))

export const regionOf = (piece: BonePiece) => regionById.get(groupById.get(piece.group)!.region)!
