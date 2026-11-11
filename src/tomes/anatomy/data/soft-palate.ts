/**
 * The soft palate and its five pairs of muscles (Testut t. IV pp. 33–49; Moore 8 pp. 943–946, tabla 8-14;
 * the curtain sign, p. 1090).
 *
 * The velum is a bridge hung from the base of the skull by four muscular ropes (the two peristaphylines of each
 * side) and resting on four pillars (the palatoglossus and palatopharyngeus of each side). It does two jobs:
 * rising, it shuts the nasopharynx while swallowing and speaking; lowering on the tongue with its anterior pillars,
 * it shuts the mouth from the pharynx while sucking.
 *
 * Nothing here is written per lesion. Each muscle says what its contraction does; an act contracts some muscles;
 * a palsy removes the muscles of a nerve. The rise of the velum, its deviation, the closure of each isthmus and the
 * opening of each tube are summed from what is left, and the signs are read off that outcome.
 */

export type Side = 'right' | 'left'
export const SIDES: Side[] = ['right', 'left']

export type MuscleId = 'levator' | 'tensor' | 'uvulae' | 'palatoglossus' | 'palatopharyngeus'
export type Nerve = 'X' | 'V3'

export interface Muscle {
  id: MuscleId
  /** Testut's name, and the ones he gives as synonyms. */
  testut: string
  synonyms: string[]
  /** Today's name (Terminologia Anatomica, as Moore and Latarjet–Ruiz use it). */
  today: string
  /** Motor nerve, as taught today: the pharyngeal plexus of the vagus, or the mandibular nerve for the tensor. */
  nerve: Nerve
  /** Where it runs, in one line. */
  course: string
  /** What it does, in one line. */
  action: string
  /** Its share in raising the velum (each side), out of 1 for the whole velum. */
  lift: number
  /** It shortens and raises the uvula. */
  uvula?: boolean
  /** It brings its pillar towards the midline, closing the isthmus that pillar bounds. */
  pillar?: 'anterior' | 'posterior'
  /** It opens the auditory tube of its side when swallowing. */
  opensTube?: boolean
}

export const MUSCLES: Muscle[] = [
  {
    id: 'levator',
    testut: 'Peristafilino interno',
    synonyms: ['petrostafilino', 'petrosalpingostafilino'],
    today: 'Elevador del velo del paladar',
    nerve: 'X',
    course: 'De la cara inferior del peñasco y de la trompa, por dentro de la faringe, abanicado en la cara posterior del velo.',
    action: 'Eleva el velo: es la cincha que lo suspende.',
    lift: 0.4,
  },
  {
    id: 'tensor',
    testut: 'Peristafilino externo',
    synonyms: ['esfenostafilino', 'esfenosalpingostafilino'],
    today: 'Tensor del velo del paladar',
    nerve: 'V3',
    course:
      'De la fosita escafoidea, del ala mayor y de la trompa, por fuera de la faringe; su tendón se refleja en el gancho del ala interna de la pterigoides y se abre en la aponeurosis del velo.',
    action: 'Tensa el velo y abre la trompa de Eustaquio al tragar.',
    lift: 0.1,
    opensTube: true,
  },
  {
    id: 'uvulae',
    testut: 'Palatostafilino',
    synonyms: ['ácigos de la úvula'],
    today: 'Músculo de la úvula',
    nerve: 'X',
    course: 'De la aponeurosis, tras la espina nasal posterior, a la punta de la úvula, junto a su homónimo.',
    action: 'Acorta la úvula y la levanta.',
    lift: 0,
    uvula: true,
  },
  {
    id: 'palatoglossus',
    testut: 'Glosostafilino',
    synonyms: ['palatogloso'],
    today: 'Palatogloso',
    nerve: 'X',
    course: 'De la base de la lengua al velo, en el espesor del pilar anterior.',
    action: 'Acerca los pilares anteriores como dos cortinas y baja el velo sobre la lengua: cierra el istmo de las fauces.',
    lift: 0,
    pillar: 'anterior',
  },
  {
    id: 'palatopharyngeus',
    testut: 'Faringostafilino',
    synonyms: ['palatofaríngeo'],
    today: 'Palatofaríngeo',
    nerve: 'X',
    course: 'Del velo a la pared lateral de la faringe y al cartílago tiroides, en el espesor del pilar posterior.',
    action: 'Acerca los pilares posteriores y cierra el paso faringonasal; eleva la faringe y la laringe al tragar.',
    lift: 0,
    pillar: 'posterior',
  },
]

export const muscle = (id: MuscleId) => MUSCLES.find((m) => m.id === id)!

export type ActId = 'rest' | 'phonation' | 'swallowing' | 'sucking'

export interface Act {
  id: ActId
  name: string
  /** The muscles that contract, on both sides. */
  muscles: MuscleId[]
  /** The isthmus the act needs shut, if any. */
  needs?: 'nasal' | 'oral'
  text: string
}

export const ACTS: Act[] = [
  {
    id: 'rest',
    name: 'Reposo',
    muscles: [],
    text: 'El velo cuelga hacia la base de la lengua; la boca y la nariz comunican libremente con la faringe.',
  },
  {
    id: 'phonation',
    name: 'Decir «a»',
    muscles: ['levator', 'tensor', 'uvulae'],
    needs: 'nasal',
    text: 'El velo se eleva y se tensa: separa la faringe nasal de la bucal, y la voz sale por la boca.',
  },
  {
    id: 'swallowing',
    name: 'Deglución',
    muscles: ['levator', 'tensor', 'uvulae', 'palatopharyngeus'],
    needs: 'nasal',
    text: 'El velo se levanta hasta hacerse horizontal y los pilares posteriores se cierran detrás de él: el bolo no puede subir a la nariz. Al mismo tiempo se abren las trompas.',
  },
  {
    id: 'sucking',
    name: 'Succión',
    muscles: ['palatoglossus'],
    needs: 'oral',
    text: 'El velo baja sobre la lengua y los pilares anteriores se acercan: la boca queda cerrada por detrás, y el niño respira por la nariz mientras mama.',
  },
]

export const act = (id: ActId) => ACTS.find((a) => a.id === id)!

export type LesionId = 'none' | 'X-right' | 'X-left' | 'X-both' | 'V3-right' | 'V3-left'

export interface Lesion {
  id: LesionId
  name: string
  nerve?: Nerve
  sides: Side[]
}

export const LESIONS: Lesion[] = [
  { id: 'none', name: 'Sin lesión', sides: [] },
  { id: 'X-right', name: 'Vago derecho', nerve: 'X', sides: ['right'] },
  { id: 'X-left', name: 'Vago izquierdo', nerve: 'X', sides: ['left'] },
  { id: 'X-both', name: 'Los dos vagos', nerve: 'X', sides: ['right', 'left'] },
  { id: 'V3-right', name: 'Mandibular derecho', nerve: 'V3', sides: ['right'] },
  { id: 'V3-left', name: 'Mandibular izquierdo', nerve: 'V3', sides: ['left'] },
]

export const lesion = (id: LesionId) => LESIONS.find((l) => l.id === id)!

export const isParalysed = (m: Muscle, side: Side, l: Lesion) => l.nerve === m.nerve && l.sides.includes(side)

/** Whether a muscle contracts on one side in an act with a lesion. */
export const contracts = (m: Muscle, side: Side, a: Act, l: Lesion) => a.muscles.includes(m.id) && !isParalysed(m, side, l)

export type Closure = 'closed' | 'incomplete' | 'open'

export interface Outcome {
  /** How far the velum rises, 0 hanging … 1 horizontal against the pharynx. */
  lift: number
  /** Each side's pull upwards. */
  liftBySide: Record<Side, number>
  /** Where the raphe and uvula go: −1 fully to the right, +1 fully to the left. */
  deviation: number
  /** How much the uvula is shortened, 0…1. */
  uvula: number
  /** How far each pillar is drawn to the midline, 0…1. */
  pillars: Record<'anterior' | 'posterior', Record<Side, number>>
  /** The passage between nasopharynx and oropharynx. */
  nasal: Closure
  /** The isthmus of the fauces, between mouth and pharynx. */
  oral: Closure
  /** Each auditory tube opens when swallowing. */
  tube: Record<Side, boolean>
}

/** The velum must rise this far to meet the posterior wall of the pharynx. */
export const SEAL = 0.8

export function outcome(actId: ActId, lesionId: LesionId): Outcome {
  const a = act(actId)
  const l = lesion(lesionId)
  const liftBySide = { right: 0, left: 0 } as Record<Side, number>
  const pillars = {
    anterior: { right: 0, left: 0 },
    posterior: { right: 0, left: 0 },
  } as Outcome['pillars']
  const tube = { right: false, left: false } as Record<Side, boolean>
  let uvula = 0
  for (const m of MUSCLES)
    for (const side of SIDES) {
      if (!contracts(m, side, a, l)) continue
      liftBySide[side] += m.lift
      if (m.uvula) uvula += 0.5
      if (m.pillar) pillars[m.pillar][side] = 1
      if (m.opensTube && actId === 'swallowing') tube[side] = true
    }
  const lift = liftBySide.right + liftBySide.left
  // A velum pulled up by one side only is drawn towards that side: the levators are the strong pull.
  const deviation = lift > 0 ? (liftBySide.left - liftBySide.right) / lift : 0
  const nasal: Closure = a.needs !== 'nasal' ? 'open' : lift >= SEAL ? 'closed' : lift > SEAL / 2 ? 'incomplete' : 'open'
  const front = pillars.anterior.right + pillars.anterior.left
  const oral: Closure = a.needs !== 'oral' ? 'open' : front === 2 ? 'closed' : front === 1 ? 'incomplete' : 'open'
  return { lift, liftBySide, deviation, uvula, pillars, nasal, oral, tube }
}

/** Below this the deviation is too slight to be seen (the tensor's share). */
export const DEVIATES = 0.2

const SIDE_NAME: Record<Side, string> = { right: 'derecho', left: 'izquierdo' }

/** What is seen and heard, read off the outcome of the act. */
export function signs(actId: ActId, lesionId: LesionId): string[] {
  const o = outcome(actId, lesionId)
  const normal = outcome(actId, 'none')
  const out: string[] = []
  if (Math.abs(o.deviation) > DEVIATES) {
    const towards: Side = o.deviation > 0 ? 'left' : 'right'
    out.push(`El velo y la úvula se desvían hacia el lado ${SIDE_NAME[towards]}, el sano: el «signo de la cortina».`)
  }
  if (actId === 'phonation' && o.nasal !== 'closed')
    out.push(o.nasal === 'open' ? 'El velo no se eleva: voz nasal (rinolalia abierta).' : 'El paso nasal queda entreabierto: la voz se nasaliza.')
  if (actId === 'swallowing' && o.nasal !== 'closed') out.push('Los líquidos refluyen por la nariz al tragar.')
  if (actId === 'sucking' && o.oral !== 'closed') out.push('El istmo de las fauces no se cierra: la succión pierde fuerza.')
  for (const side of SIDES)
    if (normal.tube[side] && !o.tube[side])
      out.push(`La trompa ${side === 'right' ? 'derecha' : 'izquierda'} no se abre al tragar: el oído medio de ese lado queda sin ventilar.`)
  return out
}
