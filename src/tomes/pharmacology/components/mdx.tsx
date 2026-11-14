import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { AntipsychoticProfiles } from './AntipsychoticProfiles'
import { Cite } from './Citations'
import { ClassShelf } from './ClassShelf'
import { DoseResponse } from './DoseResponse'
import { DurationChart } from './DurationChart'
import { SaturableKinetics } from './SaturableKinetics'
import { SynapseTargets } from './SynapseTargets'
import { DrugLink } from './links'

/** `<Farmaco id="diazepam">el diazepam</Farmaco>`: a link to the drug's card. */
function Farmaco({ id, children }: { id: string; children?: ReactNode }) {
  return <DrugLink id={id}>{children}</DrugLink>
}

/** Components available inside every pharmacology chapter without importing. */
export const mdxComponents: MDXComponents = {
  Cita: Cite,
  Farmaco,
  Familia: ClassShelf,
  DoseResponse,
  DurationChart,
  SynapseTargets,
  SaturableKinetics,
  AntipsychoticProfiles,
}
