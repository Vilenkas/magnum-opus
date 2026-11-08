/**
 * The facial nerve as a line from its nucleus to the face (Testut t. III pp. 126–147), and what a lesion at each
 * point of it takes away. Nothing is listed by hand: a lesion on the trunk cuts every branch that leaves at it or
 * beyond it, but only the fibres the trunk already carries there (the intermediary of Wrisberg, with the taste and
 * the secretory fibres, joins it only after both leave the bulb). Neighbours caught in the same lesion are the
 * VI nucleus inside the genu and the auditory nerve in the internal meatus.
 *
 * The levels are Moore's clinical ones (8.ª ed. pp. 871, 1089–1090): near the geniculate ganglion, motor, taste and
 * autonomic losses; between it and the chorda tympani, the same but the tears; at the stylomastoid foramen, the
 * muscles alone, as Testut's section of the nerve outside the skull. A central lesion spares the upper face, which
 * each hemisphere commands on both sides.
 */

export type Sign = 'forehead' | 'eye' | 'upperLip' | 'lowerLip' | 'neck' | 'tears' | 'hyperacusis' | 'taste' | 'saliva' | 'hearing' | 'gaze'

export const SIGNS: { id: Sign; name: string; lost: string; group: 'face' | 'nerve' | 'neighbour' }[] = [
  { id: 'forehead', name: 'Arrugar la frente', lost: 'No arruga la frente: la ceja cae', group: 'face' },
  { id: 'eye', name: 'Cerrar el ojo', lost: 'No cierra el ojo: al intentarlo, el globo sube (signo de Bell)', group: 'face' },
  { id: 'upperLip', name: 'Elevar el labio y la comisura', lost: 'La comisura cae y el surco nasogeniano se borra', group: 'face' },
  { id: 'lowerLip', name: 'Bajar y tensar el labio inferior', lost: 'El labio inferior no baja; la boca se tuerce hacia el lado sano', group: 'face' },
  { id: 'neck', name: 'Tensar la piel del cuello', lost: 'El cutáneo del cuello no se contrae', group: 'face' },
  { id: 'tears', name: 'Lágrimas', lost: 'Ojo seco: falta la secreción lagrimal', group: 'nerve' },
  { id: 'hyperacusis', name: 'Amortiguar los sonidos', lost: 'Los sonidos fuertes molestan: el músculo del estribo no amortigua', group: 'nerve' },
  { id: 'taste', name: 'Gusto de los dos tercios anteriores de la lengua', lost: 'Falta el gusto en los dos tercios anteriores de la lengua', group: 'nerve' },
  { id: 'saliva', name: 'Saliva submaxilar y sublingual', lost: 'Disminuye la saliva de ese lado', group: 'nerve' },
  { id: 'hearing', name: 'Oído y equilibrio (VIII)', lost: 'Sordera, zumbidos y vértigo: el auditivo va con el facial', group: 'neighbour' },
  { id: 'gaze', name: 'Mirar hacia ese lado (VI)', lost: 'El ojo no se vuelve hacia fuera: el núcleo del VI está dentro de la rodilla', group: 'neighbour' },
]

export type Fibre = 'motor' | 'intermediary'

export interface Branch {
  id: string
  name: string
  /** Position along the nerve where it leaves the trunk. */
  at: number
  fibres: Fibre
  serves: Sign[]
}

/** Positions along the nerve: 1 the nucleus, 2 the emergence, where the intermediary joins, 9 the parotid. */
export const STATIONS = {
  nucleus: 1,
  emergence: 2,
  meatus: 3,
  geniculate: 4,
  tympanic: 5,
  stapedius: 6,
  chorda: 7,
  stylomastoid: 8,
  parotid: 9,
}

/** Where each kind of fibre runs in the trunk: the motor ones from the nucleus, the intermediary's from the emergence. */
export const FIBRES_FROM: Record<Fibre, number> = { motor: STATIONS.nucleus, intermediary: STATIONS.emergence }

export const BRANCHES: Branch[] = [
  { id: 'petrosal', name: 'Nervio petroso superficial mayor', at: STATIONS.geniculate, fibres: 'intermediary', serves: ['tears'] },
  { id: 'stapedius', name: 'Nervio del músculo del estribo', at: STATIONS.stapedius, fibres: 'motor', serves: ['hyperacusis'] },
  { id: 'chorda', name: 'Cuerda del tímpano', at: STATIONS.chorda, fibres: 'intermediary', serves: ['taste', 'saliva'] },
  { id: 'temporofacial', name: 'Rama temporofacial', at: STATIONS.parotid, fibres: 'motor', serves: ['forehead', 'eye', 'upperLip'] },
  { id: 'cervicofacial', name: 'Rama cervicofacial', at: STATIONS.parotid, fibres: 'motor', serves: ['lowerLip', 'neck'] },
]

export type LesionId = 'central' | 'nucleus' | 'meatus' | 'geniculate' | 'tympanic' | 'mastoid' | 'stylomastoid' | 'temporofacial' | 'cervicofacial'

export interface Lesion {
  id: LesionId
  name: string
  /** A point on the trunk, a single terminal branch, or above the nucleus. */
  kind: 'central' | 'trunk' | 'branch'
  at: number
  /** Structures caught alongside. */
  neighbours?: Sign[]
  cause: string
}

export const LESIONS: Lesion[] = [
  { id: 'central', name: 'Corteza o cápsula', kind: 'central', at: 0, cause: 'Un reblandecimiento o una hemorragia del hemisferio opuesto, con hemiplejía del mismo lado que la parálisis facial.' },
  { id: 'nucleus', name: 'Núcleo y rodilla', kind: 'trunk', at: STATIONS.nucleus, neighbours: ['gaze'], cause: 'Una lesión de la calota protuberancial bajo la eminencia teres, donde la rodilla del facial abraza el núcleo del motor ocular externo.' },
  { id: 'meatus', name: 'Conducto auditivo interno', kind: 'trunk', at: STATIONS.meatus, neighbours: ['hearing'], cause: 'Un tumor del ángulo pontocerebeloso o del conducto, como el neurinoma del acústico, o una fractura del peñasco.' },
  { id: 'geniculate', name: 'Ganglio geniculado', kind: 'trunk', at: STATIONS.geniculate, cause: 'Una fractura del peñasco, que lo lesiona a menudo, o una infección por el virus del herpes.' },
  { id: 'tympanic', name: 'Porción timpánica', kind: 'trunk', at: STATIONS.tympanic, cause: 'Una otitis media o la cirugía del oído: el nervio corre por la pared interna de la caja, tras una hojilla ósea muy delgada.' },
  { id: 'mastoid', name: 'Porción mastoidea, sobre la cuerda', kind: 'trunk', at: (STATIONS.stapedius + STATIONS.chorda) / 2, cause: 'Una mastoiditis o su operación: el nervio baja a 1,5 cm de profundidad por delante de las celdas.' },
  { id: 'stylomastoid', name: 'Agujero estilomastoideo', kind: 'trunk', at: STATIONS.stylomastoid, cause: 'La parálisis «a frigore» o de Bell, el nervio inflamado en la salida de su conducto.' },
  { id: 'temporofacial', name: 'Rama temporofacial', kind: 'branch', at: STATIONS.parotid, cause: 'Una herida o la cirugía de la parótida, en cuyo espesor se divide el nervio.' },
  { id: 'cervicofacial', name: 'Rama cervicofacial', kind: 'branch', at: STATIONS.parotid, cause: 'Una herida o la cirugía de la parótida, o una incisión bajo el ángulo de la mandíbula.' },
]

export const lesion = (id: LesionId) => LESIONS.find((l) => l.id === id)!

/** The upper face (frontal and orbicular of the lids): commanded from both hemispheres (Moore p. 1090). */
export const UPPER_FACE: Sign[] = ['forehead', 'eye']

/** Branches cut by a lesion. */
export function cutBranches(l: Lesion): Branch[] {
  if (l.kind === 'central') return []
  if (l.kind === 'branch') return BRANCHES.filter((b) => b.id === l.id)
  return BRANCHES.filter((b) => b.at >= l.at && FIBRES_FROM[b.fibres] <= l.at)
}

/** What is lost, on the side of the lesion (or, if central, on the opposite side). */
export function deficits(l: Lesion): Set<Sign> {
  if (l.kind === 'central') {
    const face = BRANCHES.filter((b) => b.fibres === 'motor').flatMap((b) => b.serves)
    return new Set(face.filter((s) => SIGNS.find((x) => x.id === s)!.group === 'face' && !UPPER_FACE.includes(s)))
  }
  return new Set([...cutBranches(l).flatMap((b) => b.serves), ...(l.neighbours ?? [])])
}
