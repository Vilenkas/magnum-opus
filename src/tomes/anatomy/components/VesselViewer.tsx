import vesselsUrl from '../assets/vessels.glb?url'
import lymphUrl from '../assets/lymph.glb?url'
import type { SystemEntry } from '../data/system-model'
import { sectionLabel, vessels, type Section } from '../data/vessels'
import type { TissueLook } from './skeleton/SkeletonStage'
import { SystemViewer, type SystemSection } from './SystemViewer'

const SECTIONS: SystemSection<Section>[] = [
  { id: 'heart', label: sectionLabel.heart, on: true },
  { id: 'arteries', label: 'Arterias', color: '#b8322a', on: true },
  { id: 'veins', label: 'Venas', color: '#3b5a92', on: true },
  { id: 'lymph', label: 'Linfoides', color: '#5f8240', on: false },
]

const LOOK: Record<string, TissueLook> = {
  artery: 'artery',
  'pulmonary-artery': 'artery',
  vein: 'vein',
  'pulmonary-vein': 'vein',
  valve: 'valve',
  node: 'node',
  organ: 'organ',
}
const lookOf = (e: SystemEntry): TissueLook => LOOK[e.kind] ?? 'heart'

/** Lámina IV of Angiología: the heart, the arteries, the veins and the lymphoid organs. */
export function VesselViewer() {
  return (
    <SystemViewer
      caption="Lámina IV · El corazón y los vasos"
      model={vessels}
      urls={{ vessels: vesselsUrl, lymph: lymphUrl }}
      sections={SECTIONS}
      lookOf={lookOf}
      storageKey="vessels"
      searchLabel="Buscar un vaso"
      hint="Busca en el índice o haz clic en un vaso · arterias en rojo, venas en azul, ganglios en verde"
    />
  )
}
