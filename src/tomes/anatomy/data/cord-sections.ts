/**
 * Cross-sections of the spinal cord at four heights (Testut t. II pp. 620, 635–637, figs. 512 and
 * 548): the outline from his table of diameters, the grey matter's H with its regional variations,
 * and the fascicles of the white matter as in his summary. Every shape is a function of a height
 * t from 0 (cervical) to 3 (sacral), so the plate can glide from one level to the next.
 */

type Pt = [number, number]

/** Drawing units per millimetre. */
export const UNITS_PER_MM = 12

export interface CordLevel {
  id: 'cervical' | 'dorsal' | 'lumbar' | 'sacral'
  name: string
  /** Testut's fig. 512 section it follows. */
  segment: string
  /** Half-diameters of the outline, in drawing units. */
  rx: number
  ry: number
  /** Diameters printed on the plate: only those Testut gives (p. 620). */
  diametersMm?: { transverse: number; anteroposterior: number }
  /** Grey matter: half-height of the commissure; anterior horn (head centre, tip, half-width); lateral
   *  horn length; posterior horn (neck, tip, half-width of the head). */
  grey: {
    commissure: number
    anterior: { x: number; tip: number; w: number }
    lateral: number
    posterior: { neck: number; x: number; tip: number; w: number }
  }
  /** Stilling's figures for this level, as Testut quotes them (p. 637), one half of the cord. */
  stilling?: string
  features: string
}

export const levels: CordLevel[] = [
  {
    id: 'cervical',
    name: 'Engrosamiento cervical',
    segment: 'C6',
    rx: 78,
    ry: 54,
    diametersMm: { transverse: 13, anteroposterior: 9 },
    grey: { commissure: 5, anterior: { x: 26, tip: -34, w: 15 }, lateral: 0, posterior: { neck: 13, x: 40, tip: 42, w: 7 } },
    stilling: 'Sustancia gris, 20 mm²; sustancia blanca, 44 mm²: el engrosamiento se debe a las dos.',
    features:
      'El asta anterior, voluminosa, se ha confundido con la lateral, y la formación reticular, menos marcada que en la parte superior, tiende a desaparecer. El cordón posterior se divide en los fascículos de Goll y de Burdach.',
  },
  {
    id: 'dorsal',
    name: 'Región dorsal',
    segment: 'D6',
    rx: 60,
    ry: 48,
    diametersMm: { transverse: 10, anteroposterior: 8 },
    grey: { commissure: 4, anterior: { x: 12, tip: -26, w: 7 }, lateral: 10, posterior: { neck: 8, x: 22, tip: 38, w: 4 } },
    stilling: 'La sustancia gris se reduce a unos 4 mm².',
    features:
      'Las astas, finas y delgadas; el asta lateral, bien limitada. En el lado anterointerno del asta posterior, la columna de Clarke: basta para reconocer un corte de la región dorsal.',
  },
  {
    id: 'lumbar',
    name: 'Engrosamiento lumbar',
    segment: 'L4',
    rx: 72,
    ry: 54,
    diametersMm: { transverse: 12, anteroposterior: 9 },
    grey: { commissure: 6, anterior: { x: 24, tip: -36, w: 18 }, lateral: 0, posterior: { neck: 14, x: 32, tip: 42, w: 14 } },
    stilling: 'La sustancia gris sube a 25 mm²; la blanca apenas aumenta.',
    features:
      'Las dos astas recobran su volumen, y la posterior es casi tan voluminosa como la anterior. El asta lateral ya no existe: el engrosamiento es casi sólo de sustancia gris.',
  },
  {
    id: 'sacral',
    name: 'Cono terminal',
    segment: 'S',
    rx: 50,
    ry: 46,
    grey: { commissure: 9, anterior: { x: 17, tip: -28, w: 14 }, lateral: 0, posterior: { neck: 12, x: 22, tip: 32, w: 13 } },
    features:
      'La sustancia gris, menos voluminosa, predomina sin embargo sobre la blanca, que se reduce a una delgada envoltura. El asta anterior es redondeada; la posterior, un triángulo.',
  },
]

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k

/** The level just below t and how far towards the next one. */
function between(t: number): [CordLevel, CordLevel, number] {
  const i = Math.max(0, Math.min(levels.length - 2, Math.floor(t)))
  return [levels[i], levels[i + 1], Math.max(0, Math.min(1, t - i))]
}

/** Interpolates every number of a level's shape. */
export function levelAt(t: number): Pick<CordLevel, 'rx' | 'ry' | 'grey'> {
  const [a, b, k] = between(t)
  const L = (x: number, y: number) => lerp(x, y, k)
  const ga = a.grey
  const gb = b.grey
  return {
    rx: L(a.rx, b.rx),
    ry: L(a.ry, b.ry),
    grey: {
      commissure: L(ga.commissure, gb.commissure),
      anterior: { x: L(ga.anterior.x, gb.anterior.x), tip: L(ga.anterior.tip, gb.anterior.tip), w: L(ga.anterior.w, gb.anterior.w) },
      lateral: L(ga.lateral, gb.lateral),
      posterior: {
        neck: L(ga.posterior.neck, gb.posterior.neck),
        x: L(ga.posterior.x, gb.posterior.x),
        tip: L(ga.posterior.tip, gb.posterior.tip),
        w: L(ga.posterior.w, gb.posterior.w),
      },
    },
  }
}

/**
 * The grey matter's H as one polygon (anterior up, the cord's centre at 0,0): the right half
 * from the top of the commissure round to its bottom, then the left half mirrored back.
 */
export function greyPolygon(t: number): Pt[] {
  const { grey: g } = levelAt(t)
  const { anterior: a, posterior: p } = g
  const c = g.commissure
  const right: Pt[] = [
    [0, -c],
    [a.x - a.w * 0.6, -c - 2],
    [a.x - a.w, a.tip + a.w * 0.9],
    [a.x - a.w * 0.4, a.tip],
    [a.x + a.w * 0.5, a.tip - 1],
    [a.x + a.w, a.tip + a.w * 0.8],
    [a.x + a.w * 0.9, -c - 2],
    // Lateral horn: collapses onto the anterior horn's side where it doesn't exist.
    [a.x + a.w * 0.9 + g.lateral, -c + 1],
    [a.x + a.w * 0.6, c],
    [p.neck + p.w * 0.6, c + 4],
    [p.x + p.w, p.tip - p.w * 1.2],
    [p.x + p.w * 0.3, p.tip],
    [p.x - p.w * 0.8, p.tip - p.w * 0.2],
    [p.neck - p.w * 0.6, c + 8],
    [0, c],
  ]
  const left = right.slice(1, -1).reverse().map(([x, y]): Pt => [-x, y])
  return [...right, ...left]
}

export const polygonArea = (pts: Pt[]) =>
  Math.abs(pts.reduce((s, [x, y], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length]
    return s + x * ny - nx * y
  }, 0)) / 2

/** A closed curve through the points (Catmull-Rom as cubic Béziers): the grey matter's soft outline. */
export function smoothPath(pts: Pt[], tension = 0.5): string {
  const n = pts.length
  const f = (v: number) => v.toFixed(1)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]]
    const k = tension / 3
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k]
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + ' Z'
}

export const toPath = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`

// ---------- Fascicles (fig. 548) ----------

export type Pathway = 'motor' | 'sensory' | 'cerebellar' | 'association'

export interface Fascicle {
  id: string
  name: string
  pathway: Pathway
  funiculus: 'anterior' | 'lateral' | 'posterior'
  role: string
  /** Sector of the outline, in degrees from the anterior midline round to the posterior (0–180),
   *  and its depth as fractions of the radius (0 centre, 1 surface). */
  from: number
  to: number
  inner: number
  outer: number
  /** How much of it each level has, cervical to sacral: 0 absent, 1 full. */
  presence: [number, number, number, number]
}

export const pathwayName: Record<Pathway, string> = {
  motor: 'Vía motriz',
  sensory: 'Vía sensitiva',
  cerebellar: 'Vía cerebelosa',
  association: 'Asociación',
}

export const fascicles: Fascicle[] = [
  {
    id: 'direct-pyramidal',
    name: 'Fascículo piramidal directo',
    pathway: 'motor',
    funiculus: 'anterior',
    role: 'Fibras motoras voluntarias que no se cruzaron en el bulbo; bordea el surco medio anterior y sólo baja hasta la región dorsal.',
    from: 3,
    to: 16,
    inner: 0.55,
    outer: 1,
    presence: [1, 0.45, 0, 0],
  },
  {
    id: 'crossed-pyramidal',
    name: 'Fascículo piramidal cruzado',
    pathway: 'motor',
    funiculus: 'lateral',
    role: 'La vía motora voluntaria cruzada en el bulbo; abandona fibras a las astas anteriores de cada segmento y se atenúa de arriba abajo.',
    from: 108,
    to: 140,
    inner: 0.5,
    outer: 0.86,
    presence: [1, 0.75, 0.4, 0.2],
  },
  {
    id: 'direct-cerebellar',
    name: 'Fascículo cerebeloso directo',
    pathway: 'cerebellar',
    funiculus: 'lateral',
    role: 'Nace en la columna de Clarke y sube por la periferia del cordón lateral al cerebelo: sensibilidad profunda inconsciente.',
    from: 100,
    to: 142,
    inner: 0.88,
    outer: 1,
    presence: [1, 1, 0, 0],
  },
  {
    id: 'gowers',
    name: 'Fascículo de Gowers',
    pathway: 'cerebellar',
    funiculus: 'lateral',
    role: 'Por delante del cerebeloso directo, en la periferia del cordón lateral; también lleva al cerebelo la sensibilidad profunda inconsciente.',
    from: 58,
    to: 100,
    inner: 0.86,
    outer: 1,
    presence: [1, 1, 0.6, 0],
  },
  {
    id: 'anterolateral',
    name: 'Fascículo anterolateral',
    pathway: 'sensory',
    funiculus: 'lateral',
    role: 'El fascículo restante del cordón anterolateral (de Déjerine), vía sensitiva ascendente: el dolor y la temperatura, y parte del tacto.',
    from: 22,
    to: 100,
    inner: 0.6,
    outer: 0.86,
    presence: [1, 1, 1, 0.6],
  },
  {
    id: 'lateral-deep',
    name: 'Fascículo lateral profundo',
    pathway: 'association',
    funiculus: 'lateral',
    role: 'En contacto con la sustancia gris, formado por fibras comisurales o de asociación muy cortas entre segmentos vecinos.',
    from: 60,
    to: 112,
    inner: 0.42,
    outer: 0.6,
    presence: [1, 1, 1, 1],
  },
  {
    id: 'burdach',
    name: 'Fascículo de Burdach',
    pathway: 'sensory',
    funiculus: 'posterior',
    role: 'La parte externa del cordón posterior, separada del Goll por el tabique paramedio en la médula cervical: sensibilidad profunda consciente y tacto.',
    from: 150,
    to: 167,
    inner: 0.3,
    outer: 1,
    presence: [1, 0, 0, 0],
  },
  {
    id: 'goll',
    name: 'Fascículo de Goll',
    pathway: 'sensory',
    funiculus: 'posterior',
    role: 'Junto al tabique medio posterior; sus fibras, de las raíces posteriores de abajo, suben hasta los núcleos del bulbo: sensibilidad profunda consciente.',
    from: 167,
    to: 179,
    inner: 0.25,
    outer: 1,
    presence: [1, 1, 1, 1],
  },
]

/** Where the cord's outline is at an angle (0 anterior, 180 posterior, right side), scaled. */
export function onOutline(rx: number, ry: number, deg: number, k: number): Pt {
  const a = (deg * Math.PI) / 180
  return [rx * k * Math.sin(a), -ry * k * Math.cos(a)]
}

export function presenceAt(f: Fascicle, t: number): number {
  const i = Math.max(0, Math.min(2, Math.floor(t)))
  return lerp(f.presence[i], f.presence[i + 1], Math.max(0, Math.min(1, t - i)))
}

/**
 * A fascicle's sector on the right half (the plate mirrors it). A fading fascicle thins towards
 * its outer edge, so the crossed pyramidal shrinks downwards as Testut describes.
 */
export function fasciclePolygon(f: Fascicle, t: number): Pt[] {
  const { rx, ry } = levelAt(t)
  const presence = presenceAt(f, t)
  const outer = f.outer
  const inner = lerp(outer, f.inner, presence)
  // Below the cervical cord the Burdach is no longer marked off: the Goll fills the posterior funiculus.
  const from = f.id === 'goll' ? lerp(f.from, 150, Math.min(1, t)) : f.from
  const to = f.to
  const steps = 10
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) pts.push(onOutline(rx, ry, lerp(from, to, i / steps), outer))
  for (let i = steps; i >= 0; i--) pts.push(onOutline(rx, ry, lerp(from, to, i / steps), inner))
  return pts
}

export const mirrorPts = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [-x, y])
