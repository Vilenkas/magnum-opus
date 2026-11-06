/**
 * The pelvis of man and of woman, after Testut–Latarjet t. I pp. 383–386: the sixteen sexual
 * characters of his table, and a schematic front view whose proportions follow them. One set of
 * parameters per sex; `pelvisShape(t)` draws any point between them (0 = man, 1 = woman).
 */

/** What a character shows on the front view; null when it can only be seen from the side. */
export type PelvisFeature =
  | 'iliac-fossae'
  | 'crests'
  | 'sacrum'
  | 'lesser-pelvis'
  | 'symphysis'
  | 'pubic-body'
  | 'pubic-arch'
  | 'ischiopubic-rami'
  | 'obturator'
  | 'acetabula'
  | 'inlet'

export interface SexualCharacter {
  n: number
  name: string
  woman: string
  man: string
  feature: PelvisFeature | null
}

/** Testut's table (p. 386), paraphrased. */
export const characters: SexualCharacter[] = [
  { n: 1, name: 'Fosas ilíacas internas', woman: 'Más anchas, más extensas y más inclinadas hacia fuera.', man: 'Menos anchas, más excavadas y más verticales.', feature: 'iliac-fossae' },
  { n: 2, name: 'Crestas ilíacas', woman: 'Menos sinuosas.', man: 'Con la S itálica más marcada.', feature: 'crests' },
  { n: 3, name: 'Ángulo sacrovertebral', woman: 'Más pronunciado; el promontorio sobresale más hacia delante.', man: 'Menos pronunciado y menos saliente.', feature: null },
  { n: 4, name: 'Sacro', woman: 'Más bajo y más ancho.', man: 'Más alto y más estrecho.', feature: 'sacrum' },
  { n: 5, name: 'Curvatura del sacro', woman: 'Menos pronunciada.', man: 'Más pronunciada.', feature: null },
  { n: 6, name: 'Pelvis menor', woman: 'Más espaciosa, sobre todo a lo ancho.', man: 'Menos espaciosa.', feature: 'lesser-pelvis' },
  { n: 7, name: 'Sínfisis del pubis', woman: 'Más baja: 45 mm.', man: 'Más alta: 50 mm.', feature: 'symphysis' },
  { n: 8, name: 'Pared anterior de la pelvis menor', woman: 'Más extensa a lo ancho.', man: 'Más extensa a lo alto.', feature: null },
  { n: 9, name: 'Cuerpo del pubis', woman: 'Más ancho; las espinas del pubis, más separadas.', man: 'Más alto; las espinas, más próximas.', feature: 'pubic-body' },
  { n: 10, name: 'Arco del pubis', woman: 'Más abierto: unos 110° en su parte superior.', man: 'Más cerrado: unos 70°.', feature: 'pubic-arch' },
  { n: 11, name: 'Ramas isquiopubianas', woman: 'Su labio interno, muy vuelto hacia fuera.', man: 'Su labio interno, menos vuelto hacia fuera.', feature: 'ischiopubic-rami' },
  { n: 12, name: 'Agujeros obturadores', woman: 'Más bien triangulares, con el ángulo interno más cerrado (70°).', man: 'Más bien ovales, con el ángulo interno más abierto (110°).', feature: 'obturator' },
  { n: 13, name: 'Cavidades cotiloideas', woman: 'Más separadas entre sí: de ahí la mayor oblicuidad de los fémures.', man: 'Más próximas: los fémures, menos oblicuos.', feature: 'acetabula' },
  { n: 14, name: 'Escotaduras ciáticas mayores', woman: 'Más abiertas: diámetro horizontal de 72 mm.', man: 'Más cerradas: 60 mm.', feature: null },
  { n: 15, name: 'Estrecho inferior', woman: 'La punta del cóccix queda por detrás del plano frontal que pasa por los isquiones.', man: 'La punta del cóccix rebasa ese plano hacia delante.', feature: null },
  { n: 16, name: 'Estrecho superior', woman: 'Más ancho en proporción (índice 81,4); su mayor diámetro transverso pasa por delante del cruce de los oblicuos.', man: 'Menos ancho (índice 80); su mayor diámetro transverso pasa por detrás de ese cruce.', feature: 'inlet' },
]

// ---------- Geometry ----------

/** Proportions of one sex, in the units of a 400 × 300 front view (midline at x = 200). */
export interface PelvisParams {
  /** Half-width of the iliac crests at their outermost point, and the crests' highest point. */
  crestX: number
  crestTopY: number
  /** Depth of the crest's S curve. */
  crestS: number
  /** Anterior superior iliac spine, half-width. */
  asisX: number
  /** Sacrum: half-width of its base, height of its base and of its apex. */
  sacHalf: number
  sacTopY: number
  sacApexY: number
  /** How far the promontory juts into the inlet: a heart-shaped inlet in man. */
  promontory: number
  /** Half-width of the inlet (pelvic brim). */
  inletRx: number
  /** Acetabulum: half the distance between centres, and their height. */
  acetX: number
  acetY: number
  /** Pubic symphysis: top and height (40 units = 50 mm). */
  symTop: number
  symH: number
  /** Pubic tubercle (the "spine" of the pubis), half-width. */
  pubTubX: number
  /** Subpubic angle, degrees. */
  archDeg: number
  /** Height of the ischial tuberosities. */
  tuberY: number
  /** Obturator foramen: 1 = oval, 0 = triangular. */
  obturatorRound: number
}

export const MAN: PelvisParams = {
  crestX: 146, crestTopY: 30, crestS: 12, asisX: 136,
  sacHalf: 44, sacTopY: 102, sacApexY: 196, promontory: 16, inletRx: 60,
  acetX: 104, acetY: 190, symTop: 176, symH: 40, pubTubX: 24,
  archDeg: 70, tuberY: 272, obturatorRound: 1,
}

export const WOMAN: PelvisParams = {
  crestX: 162, crestTopY: 46, crestS: 4, asisX: 156,
  sacHalf: 56, sacTopY: 110, sacApexY: 186, promontory: 6, inletRx: 74,
  acetX: 120, acetY: 190, symTop: 178, symH: 36, pubTubX: 34,
  archDeg: 110, tuberY: 272, obturatorRound: 0.4,
}

/** mm per drawing unit, from the symphysis (50 mm in man). */
export const MM_PER_UNIT = 50 / MAN.symH

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function paramsAt(t: number): PelvisParams {
  const out = {} as PelvisParams
  for (const k of Object.keys(MAN) as (keyof PelvisParams)[]) out[k] = lerp(MAN[k], WOMAN[k], t)
  return out
}

type Pt = [number, number]

const CX = 200
const f = (n: number) => Math.round(n * 10) / 10
const pt = ([x, y]: Pt) => `${f(x)} ${f(y)}`
/** Mirror of a point across the midline. */
export const mirror = ([x, y]: Pt): Pt => [2 * CX - x, y]

export interface PelvisShape {
  /** Right hip bone (reader's right) with its obturator foramen as a hole (evenodd). */
  hipBone: string
  acetabulum: { x: number; y: number; r: number }
  sacrum: string
  sacralForamina: { x: number; y: number }[]
  /** The whole pelvic brim (both sides and the sacral base). */
  inlet: string
  /** Right iliac fossa, crest and obturator foramen, for highlighting. */
  fossa: string
  crest: string
  obturator: string
  /** Right inferior ramus, symphysis to tuberosity. */
  ramus: [Pt, Pt]
  symphysis: { x: number; y: number; w: number; h: number }
  /** Apex of the subpubic arch and its two arms' ends. */
  arch: { apex: Pt; right: Pt }
  pubicTubercle: Pt
  /** Widest transverse diameter of the inlet: its two ends. */
  inletWidest: [Pt, Pt]
}

/** Point on a triangle's boundary seen from `c` in direction `a` (ray–segment intersection). */
function triangleRay(c: Pt, tri: Pt[], a: number): Pt {
  const d: Pt = [Math.cos(a), Math.sin(a)]
  let best = Infinity
  for (let i = 0; i < 3; i++) {
    const p = tri[i]
    const q = tri[(i + 1) % 3]
    const e: Pt = [q[0] - p[0], q[1] - p[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const w: Pt = [p[0] - c[0], p[1] - c[1]]
    const s = (w[0] * e[1] - w[1] * e[0]) / den
    const u = (w[0] * d[1] - w[1] * d[0]) / den
    if (s > 0 && u >= 0 && u <= 1) best = Math.min(best, s)
  }
  return [c[0] + d[0] * best, c[1] + d[1] * best]
}

/** The obturator foramen: a blend between a triangle and the ellipse inscribed in it. */
function obturatorPath(tri: Pt[], round: number): string {
  const c: Pt = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3]
  const xs = tri.map((p) => p[0])
  const ys = tri.map((p) => p[1])
  const rx = ((Math.max(...xs) - Math.min(...xs)) / 2) * 0.62
  const ry = ((Math.max(...ys) - Math.min(...ys)) / 2) * 0.62
  const pts: Pt[] = []
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const tp = triangleRay(c, tri, a)
    // Pull the triangle in a little so its corners stay inside the bone.
    const tri85: Pt = [c[0] + (tp[0] - c[0]) * 0.82, c[1] + (tp[1] - c[1]) * 0.82]
    const ep: Pt = [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry]
    pts.push([lerp(tri85[0], ep[0], round), lerp(tri85[1], ep[1], round)])
  }
  return `M${pts.map(pt).join(' L')} Z`
}

export function pelvisShape(t: number): PelvisShape {
  const p = paramsAt(t)
  const symBottom = p.symTop + p.symH
  const half = (p.archDeg / 2) * (Math.PI / 180)
  const archApex: Pt = [CX, symBottom]
  // The inferior ramus runs from under the symphysis to the tuberosity at the arch's half-angle.
  const tuberInner: Pt = [CX + (p.tuberY - symBottom) * Math.tan(half), p.tuberY]
  const inletCY = (p.sacTopY + p.symTop) / 2 + 4
  const sacroiliac: Pt = [CX + p.sacHalf - 4, p.sacTopY - 4]
  const brimWidest: Pt = [CX + p.inletRx, inletCY]
  const tubercle: Pt = [CX + p.pubTubX, p.symTop - 2]

  const crestTop: Pt = [CX + p.crestX * 0.5, p.crestTopY]
  const crestOuter: Pt = [CX + p.crestX, p.crestTopY + 34]
  const asis: Pt = [CX + p.asisX, 120]
  const acetRim: Pt = [CX + p.acetX + 30, p.acetY - 8]
  const tuberOuter: Pt = [tuberInner[0] + 22, p.tuberY - 6]

  // Brim (inner edge of the hip bone), pubic tubercle back up to the sacroiliac joint.
  const brim = `C${pt([CX + p.inletRx * 0.7, p.symTop - 6])} ${pt([brimWidest[0], inletCY + 18])} ${pt(brimWidest)} C${pt([brimWidest[0], inletCY - 22])} ${pt([sacroiliac[0] + 14, p.sacTopY + 6])} ${pt(sacroiliac)}`

  const outer =
    `M${pt(sacroiliac)}` +
    // The crest: an S, deeper in man.
    ` C${pt([sacroiliac[0] + 4, p.crestTopY + 10 + p.crestS])} ${pt([crestTop[0] - 20, p.crestTopY - p.crestS * 0.3])} ${pt(crestTop)}` +
    ` C${pt([crestTop[0] + 26, p.crestTopY + p.crestS * 0.4])} ${pt([crestOuter[0] - 6, crestOuter[1] - 20 - p.crestS])} ${pt(crestOuter)}` +
    ` C${pt([crestOuter[0] + 4, crestOuter[1] + 16])} ${pt([asis[0] + 6, asis[1] - 14])} ${pt(asis)}` +
    // Notch under the spine, then the acetabular rim and the ischium down to the tuberosity.
    ` C${pt([asis[0] - 10, asis[1] + 6])} ${pt([asis[0] - 8, asis[1] + 18])} ${pt([asis[0] - 6, asis[1] + 26])}` +
    ` C${pt([acetRim[0] + 6, acetRim[1] - 22])} ${pt([acetRim[0] + 4, acetRim[1] - 6])} ${pt(acetRim)}` +
    ` C${pt([acetRim[0] - 2, acetRim[1] + 34])} ${pt([tuberOuter[0] + 6, tuberOuter[1] - 26])} ${pt(tuberOuter)}` +
    ` C${pt([tuberOuter[0] - 2, p.tuberY + 6])} ${pt([tuberInner[0] + 4, p.tuberY + 6])} ${pt(tuberInner)}` +
    // The inferior ramus up to the symphysis: one side of the subpubic arch.
    ` L${pt([CX + 4, symBottom])} L${pt([CX + 4, p.symTop])}` +
    ` C${pt([CX + 10, p.symTop - 6])} ${pt([tubercle[0] - 8, tubercle[1]])} ${pt(tubercle)} ${brim} Z`

  // Obturator foramen: under the acetabulum, beside the pubis, above the ramus.
  const tri: Pt[] = [
    [CX + p.acetX - 4, p.acetY + 20],
    [CX + p.pubTubX + 10, p.symTop + 12],
    [lerp(CX + 4, tuberInner[0], 0.6) + 4, lerp(symBottom, p.tuberY, 0.6) - 14],
  ]
  const obturator = obturatorPath(tri, p.obturatorRound)

  const sacrumRight = `C${pt([CX + p.sacHalf + 2, p.sacTopY + 40])} ${pt([CX + 16, p.sacApexY - 30])} ${pt([CX + 9, p.sacApexY])}`
  const sacrum =
    `M${pt([CX - p.sacHalf, p.sacTopY])} Q${pt([CX, p.sacTopY + p.promontory * 2])} ${pt([CX + p.sacHalf, p.sacTopY])} ${sacrumRight}` +
    ` L${pt([CX + 4, p.sacApexY + 16])} L${pt([CX - 4, p.sacApexY + 16])} L${pt([CX - 9, p.sacApexY])}` +
    ` C${pt([CX - 16, p.sacApexY - 30])} ${pt([CX - p.sacHalf - 2, p.sacTopY + 40])} ${pt([CX - p.sacHalf, p.sacTopY])} Z`
  const sacralForamina = [0, 1, 2, 3].flatMap((i) => {
    const y = lerp(p.sacTopY + 20, p.sacApexY - 20, i / 3)
    const x = lerp(p.sacHalf * 0.45, p.sacHalf * 0.2, i / 3)
    return [{ x: CX - x, y }, { x: CX + x, y }]
  })

  // The brim, both sides, closed by the sacral base and its promontory.
  const brimRightUp = brim
  const leftBrimPts = [
    [CX + p.inletRx * 0.7, p.symTop - 6], [brimWidest[0], inletCY + 18], brimWidest,
    [brimWidest[0], inletCY - 22], [sacroiliac[0] + 14, p.sacTopY + 6], sacroiliac,
  ].map((q) => mirror(q as Pt))
  const inlet =
    `M${pt(tubercle)} ${brimRightUp}` +
    ` Q${pt([CX, p.sacTopY + p.promontory * 2])} ${pt(mirror(sacroiliac))}` +
    ` C${pt(leftBrimPts[4])} ${pt(leftBrimPts[3])} ${pt(leftBrimPts[2])}` +
    ` C${pt(leftBrimPts[1])} ${pt(leftBrimPts[0])} ${pt(mirror(tubercle))} Z`

  const fossa =
    `M${pt(sacroiliac)} C${pt([sacroiliac[0] + 4, p.crestTopY + 10 + p.crestS])} ${pt([crestTop[0] - 20, p.crestTopY - p.crestS * 0.3])} ${pt(crestTop)}` +
    ` C${pt([crestTop[0] + 26, p.crestTopY + p.crestS * 0.4])} ${pt([crestOuter[0] - 6, crestOuter[1] - 20 - p.crestS])} ${pt(crestOuter)}` +
    ` C${pt([crestOuter[0] + 4, crestOuter[1] + 16])} ${pt([asis[0] + 6, asis[1] - 14])} ${pt(asis)}` +
    ` C${pt([asis[0] - 30, asis[1] + 4])} ${pt([brimWidest[0] + 10, inletCY - 4])} ${pt(brimWidest)}` +
    ` C${pt([brimWidest[0], inletCY - 22])} ${pt([sacroiliac[0] + 14, p.sacTopY + 6])} ${pt(sacroiliac)} Z`
  const crest =
    `M${pt(sacroiliac)} C${pt([sacroiliac[0] + 4, p.crestTopY + 10 + p.crestS])} ${pt([crestTop[0] - 20, p.crestTopY - p.crestS * 0.3])} ${pt(crestTop)}` +
    ` C${pt([crestTop[0] + 26, p.crestTopY + p.crestS * 0.4])} ${pt([crestOuter[0] - 6, crestOuter[1] - 20 - p.crestS])} ${pt(crestOuter)}` +
    ` C${pt([crestOuter[0] + 4, crestOuter[1] + 16])} ${pt([asis[0] + 6, asis[1] - 14])} ${pt(asis)}`

  return {
    hipBone: `${outer} ${obturator}`,
    acetabulum: { x: CX + p.acetX, y: p.acetY, r: 24 },
    sacrum,
    sacralForamina,
    inlet,
    fossa,
    crest,
    obturator,
    ramus: [[CX + 4, symBottom], tuberInner],
    symphysis: { x: CX - 6, y: p.symTop, w: 12, h: p.symH },
    arch: { apex: archApex, right: tuberInner },
    pubicTubercle: tubercle,
    inletWidest: [mirror(brimWidest), brimWidest],
  }
}

/**
 * What the plate measures. Only Testut's own figures are printed (the arch, the symphysis, the
 * inlet index); the schematic isn't to scale, so the other spans are compared, not quoted.
 */
export function measures(t: number) {
  const s = pelvisShape(t)
  const p = paramsAt(t)
  const [ax, ay] = s.arch.apex
  const [rx, ry] = s.arch.right
  return {
    archDeg: Math.round((2 * Math.atan2(rx - ax, ry - ay) * 180) / Math.PI),
    symphysisMm: Math.round(s.symphysis.h * MM_PER_UNIT),
    /** Sacro-suprapubic over transverse diameter of the inlet, ×100 (Testut: 80 in man, 81.4 in woman). */
    inletIndex: Math.round(lerp(80, 81.4, t) * 10) / 10,
    acetabula: 2 * p.acetX,
    pubicTubercles: 2 * p.pubTubX,
    sacrumWidth: 2 * p.sacHalf,
    sacrumHeight: p.sacApexY + 16 - p.sacTopY,
    inletWidth: s.inletWidest[1][0] - s.inletWidest[0][0],
  }
}
