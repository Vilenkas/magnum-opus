import nervousUrl from '../assets/nervous.glb?url'
import { nervous, nervousSectionLabel as label, type NervousKind, type NervousSection } from '../data/nervous'
import type { SystemEntry } from '../data/system-model'
import type { TissueLook } from './skeleton/SkeletonStage'
import { SystemViewer, type SystemSection } from './SystemViewer'

const SECTIONS: SystemSection<NervousSection>[] = [
  { id: 'cerebrum', label: label.cerebrum, color: '#b9785c', on: true },
  { id: 'deep', label: label.deep, color: '#b8655a', on: false },
  { id: 'cerebellum', label: label.cerebellum, color: '#a8806f', on: true },
  { id: 'brainstem', label: label.brainstem, color: '#a88b6c', on: true },
  { id: 'cord', label: label.cord, color: '#8a7a6c', on: true },
  { id: 'nerves', label: label.nerves, color: '#b8962a', on: true },
  { id: 'meninges', label: label.meninges, on: false },
  { id: 'sense', label: label.sense, color: '#6f8aa6', on: false },
]

// Every kind has a look of the same name; `satisfies` makes the compiler check each one exists.
const LOOK = {
  frontal: 'frontal',
  parietal: 'parietal',
  temporal: 'temporal',
  occipital: 'occipital',
  limbic: 'limbic',
  insula: 'insula',
  sulcus: 'sulcus',
  nucleus: 'nucleus',
  white: 'white',
  tract: 'tract',
  csf: 'csf',
  cerebellum: 'cerebellum',
  brainstem: 'brainstem',
  'cord-white': 'cord-white',
  'cord-grey': 'cord-grey',
  nerve: 'nerve',
  meninges: 'meninges',
  sense: 'sense',
} satisfies Record<NervousKind, TissueLook>
const lookOf = (e: SystemEntry): TissueLook => LOOK[e.kind as NervousKind] ?? 'nucleus'

/** Lámina II of Neurología: the brain, the cord, the nerves and the sense organs on the skeleton. */
export function NervousViewer() {
  return (
    <SystemViewer
      caption="Lámina II · El sistema nervioso"
      model={nervous}
      urls={{ nervous: nervousUrl }}
      sections={SECTIONS}
      lookOf={lookOf}
      storageKey="nervous"
      searchLabel="Buscar en el sistema nervioso"
      hint="Busca en el índice o haz clic · cada lóbulo de un color · apaga la corteza para ver el interior del cerebro, u oculta piezas una a una"
    />
  )
}
