import raw from '../assets/landmarks.json'
import { landmarkNames } from './landmark-names'

type Vec3 = [number, number, number]

interface RawLandmark {
  id: string
  en: string
  pieceId: string
  p: number[]
  n: number[]
  inconstant?: boolean
  opening?: boolean
}

/** A bony landmark (acromion, greater trochanter…) at a point on a piece's surface. */
export interface Landmark {
  /** `<english-slug>--<pieceId>`, unique per side. */
  id: string
  pieceId: string
  /** Spanish name, from landmark-names.ts. */
  name: string
  aliases: string[]
  /** Terminologia Anatomica English name. */
  en: string
  /** Point in model space (glTF, metres, Y up). For openings, the centre of the void. */
  position: Vec3
  /** Smoothed outward surface normal, used to look at the landmark head-on. */
  normal: Vec3
  /** Inconstant structure (in parentheses in the TA), e.g. the third trochanter. */
  inconstant: boolean
  /** A hole or notch (foramen, hiatus): the point marks the void, not the surface. */
  opening: boolean
}

export const landmarks: Landmark[] = (raw as RawLandmark[]).map((l) => {
  const entry = landmarkNames[l.en]
  const [name, ...aliases] = Array.isArray(entry) ? entry : [entry ?? l.en]
  return {
    id: l.id,
    pieceId: l.pieceId,
    name,
    aliases,
    en: l.en,
    position: l.p as Vec3,
    normal: l.n as Vec3,
    inconstant: !!l.inconstant,
    opening: !!l.opening,
  }
})

export const landmarkById = new Map(landmarks.map((l) => [l.id, l]))

export const landmarksByPiece = new Map<string, Landmark[]>()
for (const l of landmarks) {
  const list = landmarksByPiece.get(l.pieceId) ?? []
  list.push(l)
  landmarksByPiece.set(l.pieceId, list)
}
for (const list of landmarksByPiece.values()) list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
