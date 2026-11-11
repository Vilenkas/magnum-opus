/**
 * The aerodigestive crossroads (Testut t. IV pp. 108–110, 120–129; Moore 8 p. 1041, the three phases of swallowing).
 *
 * In the pharynx the air and the food cross like an X: the air comes from the nose, in front of the food, and goes
 * to the larynx, in front of the oesophagus; the food comes from the mouth and goes behind to the oesophagus. Each
 * passage between two chambers has a gate. Breathing and each phase of swallowing are only a set of open and shut
 * gates, and where the bolus or the air goes is reachability through the open ones: nothing is written per disorder.
 *
 * The bolus falls along the downward passages; it is driven up only in the pharyngeal phase, when the constrictors
 * squeeze it. A failure keeps one gate from doing its job (open when it should shut, or the reverse), and the plate
 * reads off where the bolus ends: in the nose (nasal regurgitation), in the larynx (aspiration, before, during or after
 * the swallow) or left in the pharynx.
 */

export type ChamberId = 'nose' | 'mouth' | 'nasopharynx' | 'oropharynx' | 'laryngopharynx' | 'larynx' | 'oesophagus'

export interface Chamber {
  id: ChamberId
  name: string
  /** Testut's other name, if any. */
  alt?: string
}

export const CHAMBERS: Chamber[] = [
  { id: 'nose', name: 'Fosas nasales' },
  { id: 'mouth', name: 'Boca' },
  { id: 'nasopharynx', name: 'Rinofaringe', alt: 'cávum, faringe nasal' },
  { id: 'oropharynx', name: 'Orofaringe', alt: 'faringe bucal' },
  { id: 'laryngopharynx', name: 'Laringofaringe', alt: 'faringe laríngea' },
  { id: 'larynx', name: 'Laringe y tráquea' },
  { id: 'oesophagus', name: 'Esófago' },
]

export type GateId = 'velum' | 'fauces' | 'larynx' | 'ues'

export interface Gate {
  id: GateId
  name: string
  /** What shuts it. */
  by: string
}

export const GATES: Gate[] = [
  { id: 'velum', name: 'Istmo nasofaríngeo', by: 'el velo del paladar elevado y los pilares posteriores' },
  { id: 'fauces', name: 'Istmo de las fauces', by: 'la base de la lengua y los pilares anteriores' },
  { id: 'larynx', name: 'Entrada de la laringe', by: 'la laringe elevada bajo la base de la lengua, la epiglotis y la glotis cerrada' },
  { id: 'ues', name: 'Boca del esófago', by: 'las fibras cricoideas del constrictor inferior (el cricofaríngeo)' },
]

export const gate = (id: GateId) => GATES.find((g) => g.id === id)!

export interface Passage {
  from: ChamberId
  to: ChamberId
  /** No gate: always open (the choanae, the continuity of the pharynx). */
  gate?: GateId
  /** Down the way the bolus falls; the reverse only under the constrictors' pressure. */
  down: boolean
}

/** Each passage once, written in the direction the bolus falls. */
export const PASSAGES: Passage[] = [
  { from: 'nose', to: 'nasopharynx', down: true },
  { from: 'nasopharynx', to: 'oropharynx', gate: 'velum', down: true },
  { from: 'mouth', to: 'oropharynx', gate: 'fauces', down: true },
  { from: 'oropharynx', to: 'laryngopharynx', down: true },
  { from: 'laryngopharynx', to: 'larynx', gate: 'larynx', down: true },
  { from: 'laryngopharynx', to: 'oesophagus', gate: 'ues', down: true },
]

export type PhaseId = 'breathing' | 'oral' | 'pharyngeal' | 'oesophageal'

export interface Phase {
  id: PhaseId
  name: string
  /** Gates shut in this phase when everything works. */
  shut: GateId[]
  /** Where the bolus is put at the start of the phase (the tongue throws it from the mouth to the pharynx). */
  bolusFrom?: ChamberId[]
  /** The constrictors squeeze: the bolus can be driven up as well as down. */
  pressure?: boolean
  text: string
}

export const PHASES: Phase[] = [
  {
    id: 'breathing',
    name: 'Respiración',
    shut: ['ues'],
    text: 'El velo cuelga, la laringe está abierta y la boca del esófago cerrada: el aire va de la nariz a la laringe cruzando la faringe por delante.',
  },
  {
    id: 'oral',
    name: '1 · Fase bucal',
    shut: ['fauces', 'ues'],
    bolusFrom: ['mouth'],
    text: 'Voluntaria. El bolo, masticado e insalivado, queda en la boca sobre el dorso de la lengua; el istmo de las fauces está cerrado y se sigue respirando por la nariz. Luego la lengua lo aprieta contra el paladar y lo lanza hacia atrás.',
  },
  {
    id: 'pharyngeal',
    name: '2 · Fase faríngea',
    shut: ['fauces', 'velum', 'larynx'],
    bolusFrom: ['oropharynx'],
    pressure: true,
    text: 'Refleja y rapidísima. El velo se eleva y cierra la rinofaringe, la base de la lengua cierra la boca por detrás, la laringe sube bajo la epiglotis, la respiración se detiene, y los constrictores empujan el bolo hacia la boca del esófago, que se abre.',
  },
  {
    id: 'oesophageal',
    name: '3 · Fase esofágica',
    shut: ['ues'],
    text: 'La boca del esófago se cierra detrás del bolo, que una onda peristáltica lleva al estómago; todo lo demás se abre y se vuelve a respirar.',
  },
]

export const phase = (id: PhaseId) => PHASES.find((p) => p.id === id)!

/** The swallowing sequence, after the breathing it interrupts. */
export const SEQUENCE: PhaseId[] = ['oral', 'pharyngeal', 'oesophageal']

export type FailureId = 'none' | 'velum' | 'fauces' | 'larynx' | 'ues'

export interface Failure {
  id: FailureId
  name: string
  /** The gate that no longer works. */
  gate?: GateId
  /** The gate stays open when it should shut, or shut when it should open. */
  stuck?: 'open' | 'shut'
  cause: string
}

export const FAILURES: Failure[] = [
  { id: 'none', name: 'Deglución normal', cause: '' },
  { id: 'velum', name: 'El velo no cierra', gate: 'velum', stuck: 'open', cause: 'parálisis del velo (los vagos), fisura del paladar' },
  { id: 'fauces', name: 'La lengua no retiene', gate: 'fauces', stuck: 'open', cause: 'debilidad de la lengua y de los pilares anteriores' },
  {
    id: 'larynx',
    name: 'La laringe no se cierra',
    gate: 'larynx',
    stuck: 'open',
    cause: 'laringe que no sube, epiglotis o glotis que no cierran, mucosa anestesiada',
  },
  { id: 'ues', name: 'El esófago no se abre', gate: 'ues', stuck: 'shut', cause: 'cricofaríngeo que no se relaja' },
]

export const failure = (id: FailureId) => FAILURES.find((f) => f.id === id)!

/** Whether a gate is shut in a phase, given the failure. */
export function isShut(g: GateId, p: Phase, f: Failure): boolean {
  if (f.gate === g) return f.stuck === 'shut'
  if (g === 'ues') return !(p.id === 'pharyngeal')
  return p.shut.includes(g)
}

const isOpen = (pa: Passage, p: Phase, f: Failure) => !pa.gate || !isShut(pa.gate, p, f)

/** Everything the bolus reaches from where it is, in one phase. */
export function spread(from: Iterable<ChamberId>, p: Phase, f: Failure): Set<ChamberId> {
  const seen = new Set<ChamberId>(from)
  const queue = [...seen]
  while (queue.length) {
    const c = queue.shift()!
    for (const pa of PASSAGES) {
      if (!isOpen(pa, p, f)) continue
      const next = pa.from === c ? pa.to : p.pressure && pa.to === c ? pa.from : null
      if (next && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return seen
}

/** Where the air goes from the nose (and the mouth, if open) in a phase. Air moves both ways. */
export function airway(p: Phase, f: Failure): Set<ChamberId> {
  const seen = new Set<ChamberId>(['nose'])
  const queue: ChamberId[] = ['nose']
  while (queue.length) {
    const c = queue.shift()!
    for (const pa of PASSAGES) {
      if (!isOpen(pa, p, f)) continue
      const next = pa.from === c ? pa.to : pa.to === c ? pa.from : null
      if (next && next !== 'oesophagus' && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return seen
}

export interface Step {
  phase: PhaseId
  /** Chambers the bolus touches during the phase. */
  bolus: ChamberId[]
  /** Where the bolus is left when the phase ends (what went on to the stomach is gone). */
  left: ChamberId[]
  /** The air reaches the lungs in this phase. */
  breathes: boolean
}

export type Outcome = 'swallowed' | 'nasal-regurgitation' | 'aspiration-before' | 'aspiration-during' | 'aspiration-after' | 'residue'

/** Run the swallow through its three phases. */
export function swallow(failureId: FailureId): { steps: Step[]; outcomes: Outcome[] } {
  const f = failure(failureId)
  const steps: Step[] = []
  const outcomes: Outcome[] = []
  let left: ChamberId[] = []
  for (const id of SEQUENCE) {
    const p = phase(id)
    // The tongue throws whatever is still in the mouth into the pharynx when the pharyngeal phase starts.
    const start = p.bolusFrom ? [...new Set([...p.bolusFrom, ...left.filter((c) => c !== 'mouth')])] : left
    const reached = spread(start, p, f)
    const bolus = CHAMBERS.map((c) => c.id).filter((c) => reached.has(c))
    // What reaches the oesophagus goes on with the peristaltic wave; what reaches the nose or the larynx is out of the way.
    // When the constrictors can empty the pharynx into the oesophagus, they do: nothing is left behind.
    left = p.pressure && reached.has('oesophagus') ? [] : bolus.filter((c) => c !== 'oesophagus' && c !== 'nose' && c !== 'larynx')
    const breathes = airway(p, f).has('larynx')
    steps.push({ phase: id, bolus, left, breathes })
    if (reached.has('larynx')) outcomes.push(id === 'oral' ? 'aspiration-before' : id === 'pharyngeal' ? 'aspiration-during' : 'aspiration-after')
    if (reached.has('nose') && !outcomes.includes('nasal-regurgitation')) outcomes.push('nasal-regurgitation')
  }
  if (left.some((c) => c !== 'larynx' && c !== 'nose')) outcomes.push('residue')
  if (!outcomes.length) outcomes.push('swallowed')
  return { steps, outcomes }
}

export const OUTCOME_TEXT: Record<Outcome, string> = {
  swallowed: 'El bolo llega entero al esófago sin tocar la nariz ni la laringe.',
  'nasal-regurgitation': 'El bolo sube a la rinofaringe y sale por la nariz: regurgitación nasal.',
  'aspiration-before': 'El bolo cae en la faringe antes de que la laringe se cierre y entra en ella: aspiración antes de tragar.',
  'aspiration-during': 'Mientras los constrictores empujan, el bolo entra en la laringe abierta: aspiración durante la deglución.',
  'aspiration-after':
    'Lo que quedó en la laringofaringe, en los senos piriformes, cae en la laringe cuando ésta se abre para respirar: aspiración después de tragar.',
  residue: 'Queda bolo en la faringe al terminar.',
}
