/**
 * Katzung's fig. 24-1: where the antiepileptics act on the two synapses. The excitatory
 * (glutamate) synapse is to be damped; the inhibitory (GABA) synapse, reinforced. Each target
 * names the mechanism class that acts on it, so the plate and the classification share one model.
 */

export type SynapseKind = 'excitatory' | 'inhibitory'
/** On the presynaptic terminal, the postsynaptic membrane, or the surrounding glia. */
export type Site = 'pre' | 'post' | 'glia'

export interface Target {
  id: string
  /** Short label of the channel, receptor or transporter. */
  label: string
  synapse: SynapseKind
  site: Site
  /** The class (a child of `antiepileptics`) that acts here. */
  classId: string
  /** What the drugs do at this target, and the effect on transmission. */
  action: string
}

export const targets: Target[] = [
  // Excitatory (glutamate) synapse — to be damped.
  {
    id: 'nav',
    label: 'Canal de Na⁺ (Nav)',
    synapse: 'excitatory',
    site: 'pre',
    classId: 'ae-sodium',
    action: 'Bloquean el canal inactivado: menos descargas rápidas y menos glutamato liberado.',
  },
  {
    id: 'kv7-pre',
    label: 'Canal de K⁺ (Kv7)',
    synapse: 'excitatory',
    site: 'pre',
    classId: 'ae-potassium',
    action: 'Abren el canal: la terminal se repolariza y suelta menos glutamato.',
  },
  {
    id: 'a2d',
    label: 'Subunidad α2δ',
    synapse: 'excitatory',
    site: 'pre',
    classId: 'ae-alpha2delta',
    action: 'Se unen a la subunidad del canal de calcio y reducen la liberación de glutamato.',
  },
  {
    id: 'sv2a',
    label: 'Proteína SV2A',
    synapse: 'excitatory',
    site: 'pre',
    classId: 'ae-sv2a',
    action: 'Se unen a la vesícula sináptica y frenan la liberación en las ráfagas.',
  },
  {
    id: 'ampa',
    label: 'Receptor AMPA',
    synapse: 'excitatory',
    site: 'post',
    classId: 'ae-ampa',
    action: 'Bloquean el receptor del glutamato: menos excitación y menos propagación.',
  },
  {
    id: 'cav-t',
    label: 'Canal de Ca²⁺ tipo T',
    synapse: 'excitatory',
    site: 'post',
    classId: 'ae-calcium-t',
    action: 'Inhiben el canal talamocortical que sostiene las ausencias.',
  },
  // Inhibitory (GABA) synapse — to be reinforced.
  {
    id: 'gaba-a',
    label: 'Receptor GABA-A',
    synapse: 'inhibitory',
    site: 'post',
    classId: 'ae-gaba',
    action: 'Moduladores alostéricos positivos: más inhibición (benzodiacepinas, barbitúricos).',
  },
  {
    id: 'gat1',
    label: 'Transportador GAT-1',
    synapse: 'inhibitory',
    site: 'pre',
    classId: 'ae-gaba',
    action: 'La tiagabina lo bloquea: el GABA liberado actúa más tiempo.',
  },
  {
    id: 'gaba-t',
    label: 'GABA-transaminasa',
    synapse: 'inhibitory',
    site: 'glia',
    classId: 'ae-gaba',
    action: 'La vigabatrina la inhibe: sube el GABA disponible.',
  },
]

/** The classes that have a synaptic target in the figure, in reading order. */
export const synapticClasses = [...new Set(targets.map((t) => t.classId))]

export function targetsOfClass(classId: string): Target[] {
  return targets.filter((t) => t.classId === classId)
}
