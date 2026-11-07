/**
 * Why a lesion of the brainstem paralyses the face on one side and the limbs on the other
 * (Testut t. II pp. 765–767, fig. 634). The motor pathway of each hemisphere carries two
 * contingents: the corticospinal fibres, which cross at the pyramidal decussation, at the bottom
 * of the medulla, and the corticonuclear fibres, each of which crosses just above the nucleus it
 * goes to. A lesion above a nucleus finds its fibres still uncrossed and paralyses the opposite
 * side; a lesion at the nucleus destroys it, or its root, on its own side. Since the limbs' fibres
 * only cross below the whole brainstem, a lesion anywhere in it paralyses the opposite limbs.
 *
 * Heights run downwards, in the plate's viewBox units (0 at the top of the hemispheres).
 */

export type Side = 'left' | 'right'
export type NerveId = 'III' | 'VII' | 'XII'
export type LevelId = 'hemisphere' | 'peduncle' | 'pons' | 'medulla'
export type Target = NerveId | 'limbs'

export interface Level {
  id: LevelId
  name: string
  /** Vertical extent in the plate. */
  top: number
  bottom: number
}

export const levels: Level[] = [
  { id: 'hemisphere', name: 'Hemisferio cerebral', top: 0, bottom: 104 },
  { id: 'peduncle', name: 'Pedúnculo cerebral', top: 104, bottom: 176 },
  { id: 'pons', name: 'Protuberancia', top: 176, bottom: 276 },
  { id: 'medulla', name: 'Bulbo', top: 276, bottom: 356 },
]

/** The pyramidal decussation, at the lower end of the medulla: the limbs' fibres cross here. */
export const DECUSSATION_Y = 366

export interface Nerve {
  id: NerveId
  name: string
  /** What its paralysis looks like. */
  muscles: string
  level: LevelId
  /** Height of the nucleus, and of the crossing of its corticonuclear fibres just above it. */
  nucleusY: number
  crossY: number
  /** Distance of the nucleus from the midline. */
  dx: number
  /**
   * Its nucleus receives fibres from both hemispheres, so a lesion above it, on one side, does
   * not paralyse it (current knowledge, not in Testut's scheme).
   */
  bilateral?: boolean
}

export const nerves: Nerve[] = [
  {
    id: 'III',
    name: 'Motor ocular común',
    muscles: 'el párpado caído y el ojo desviado hacia fuera, con la pupila dilatada',
    level: 'peduncle',
    nucleusY: 150,
    crossY: 132,
    dx: 14,
    bilateral: true,
  },
  {
    id: 'VII',
    name: 'Facial',
    muscles: 'la mitad de la cara inmóvil, la comisura de la boca caída',
    level: 'pons',
    nucleusY: 246,
    crossY: 226,
    dx: 30,
  },
  {
    id: 'XII',
    name: 'Hipogloso mayor',
    muscles: 'la mitad de la lengua paralizada: al sacarla, la punta se desvía hacia ese lado',
    level: 'medulla',
    nucleusY: 326,
    crossY: 308,
    dx: 12,
  },
]

export interface Lesion {
  id: string
  /** The lesion's height: inside the level it names. */
  y: number
  level: LevelId
  name: string
  syndrome: string
  /** The classical eponym of the syndrome, when it has one. */
  eponym?: string
  text: string
}

export const lesions: Lesion[] = [
  {
    id: 'capsule',
    y: 92,
    level: 'hemisphere',
    name: 'Cápsula interna',
    syndrome: 'Hemiplejía cruzada',
    text: 'Por encima del tronco del encéfalo, ninguna fibra motora se ha cruzado todavía: la lesión paraliza la cara, la lengua y los miembros del lado opuesto, todos del mismo lado entre sí. Es la hemiplejía común.',
  },
  {
    id: 'peduncle',
    y: 152,
    level: 'peduncle',
    name: 'Pedúnculo cerebral',
    syndrome: 'Hemiplejía alterna peduncular',
    eponym: 'síndrome de Weber',
    text: 'La lesión alcanza el motor ocular común en su propio lado, cuando sus fibras ya han salido del núcleo, y la vía piramidal antes de todos sus cruces: el ojo se paraliza del lado de la lesión; la cara, la lengua y los miembros, del lado opuesto.',
  },
  {
    id: 'pons',
    y: 248,
    level: 'pons',
    name: 'Protuberancia',
    syndrome: 'Hemiplejía alterna protuberancial',
    eponym: 'síndrome de Millard-Gubler',
    text: 'En la parte baja del puente, las fibras del facial ya se han cruzado y la lesión destruye el núcleo o su raíz: la cara se paraliza del lado de la lesión, y los miembros del opuesto.',
  },
  {
    id: 'medulla',
    y: 328,
    level: 'medulla',
    name: 'Bulbo',
    syndrome: 'Hemiplejía alterna bulbar',
    eponym: 'síndrome de Jackson',
    text: 'En el bulbo sólo quedan por encima de la decusación las fibras de los miembros y de los últimos nervios craneales: la lengua se paraliza del lado de la lesión, los miembros del opuesto, y la cara queda indemne.',
  },
]

export interface Paralysis {
  side: Side
  /** Central: the nucleus has lost its pathway; peripheral: the nucleus or its root is destroyed. */
  kind: 'central' | 'peripheral'
}

export const opposite = (s: Side): Side => (s === 'left' ? 'right' : 'left')

/** What a lesion at height y, on one side, paralyses. */
export function paralysis(y: number, side: Side = 'left'): Record<Target, Paralysis | null> {
  const level = levels.find((l) => y >= l.top && y < l.bottom)?.id
  const out = { limbs: y < DECUSSATION_Y ? { side: opposite(side), kind: 'central' } : { side, kind: 'central' } } as Record<Target, Paralysis | null>
  for (const n of nerves) {
    if (level === n.level && y >= n.crossY) out[n.id] = { side, kind: 'peripheral' }
    else if (y < n.crossY && !n.bilateral) out[n.id] = { side: opposite(side), kind: 'central' }
    else out[n.id] = null
  }
  return out
}

/** A hemiplegia is alternate when a cranial nerve is paralysed on one side and the limbs on the other. */
export function isAlternate(p: Record<Target, Paralysis | null>) {
  return nerves.some((n) => p[n.id] && p.limbs && p[n.id]!.side !== p.limbs.side)
}

/**
 * Which fibres of the injured side's hemisphere lose their continuity below the lesion: the
 * corticospinal ones always, and the corticonuclear ones that had not yet crossed.
 */
export function interrupted(y: number) {
  return {
    spinal: y < DECUSSATION_Y,
    nuclear: Object.fromEntries(nerves.map((n) => [n.id, y < n.crossY])) as Record<NerveId, boolean>,
  }
}
