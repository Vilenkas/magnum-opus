import { lazy, Suspense, type ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import { Cite } from './Citations'
import { Figure } from './Figure'
import { Loading } from './Loading'
import { MarginNote } from './MarginNote'
import { JointBreakdown, SkeletonBreakdown } from './SkeletonBreakdown'

/** three.js is heavy: 3D plates are only fetched when a chapter actually renders them. */
function lazyPlate(load: () => Promise<ComponentType>) {
  const Lazy = lazy(async () => ({ default: await load() }))
  return function Plate() {
    return (
      <Suspense fallback={<Loading label="Preparando la lámina…" />}>
        <Lazy />
      </Suspense>
    )
  }
}

/** Components available inside every anatomy MDX chapter without importing. */
export const mdxComponents: MDXComponents = {
  // Spanish name in MDX, like the rest of the chapter's content.
  Figura: Figure,
  Cita: Cite,
  MarginNote,
  SkeletonBreakdown,
  JointBreakdown,
  SkeletonViewer: lazyPlate(() => import('./SkeletonViewer').then((m) => m.SkeletonViewer)),
  SkeletonQuiz: lazyPlate(() => import('./SkeletonQuiz').then((m) => m.SkeletonQuiz)),
  JointTypes: lazyPlate(() => import('./JointTypes').then((m) => m.JointTypes)),
  JointMotions: lazyPlate(() => import('./JointMotions').then((m) => m.JointMotions)),
  MuscleActions: lazyPlate(() => import('./JointMotions').then((m) => m.MuscleActions)),
  LeverTypes: lazyPlate(() => import('./LeverTypes').then((m) => m.LeverTypes)),
  NerveCircuits: lazyPlate(() => import('./NerveCircuits').then((m) => m.NerveCircuits)),
  PelvisDimorphism: lazyPlate(() => import('./PelvisDimorphism').then((m) => m.PelvisDimorphism)),
  // Angiology's plates are SVG, but stay lazy so other books don't fetch them.
  Circulation: lazyPlate(() => import('./Circulation').then((m) => m.Circulation)),
  Anastomoses: lazyPlate(() => import('./Anastomoses').then((m) => m.Anastomoses)),
  VenousValves: lazyPlate(() => import('./VenousValves').then((m) => m.VenousValves)),
  VenousReturn: lazyPlate(() => import('./VenousReturn').then((m) => m.VenousReturn)),
  ArterialLigation: lazyPlate(() => import('./ArterialLigation').then((m) => m.ArterialLigation)),
  RegionViewer: lazyPlate(() => import('./RegionViewer').then((m) => m.RegionViewer)),
  LymphDrainage: lazyPlate(() => import('./LymphDrainage').then((m) => m.LymphDrainage)),
  CordSections: lazyPlate(() => import('./CordSections').then((m) => m.CordSections)),
  BulbColumns: lazyPlate(() => import('./BulbColumns').then((m) => m.BulbColumns)),
  Hemiplegia: lazyPlate(() => import('./Hemiplegia').then((m) => m.Hemiplegia)),
  CerebellarCortex: lazyPlate(() => import('./CerebellarCortex').then((m) => m.CerebellarCortex)),
  VentricleFloor: lazyPlate(() => import('./VentricleFloor').then((m) => m.VentricleFloor)),
  MidbrainSections: lazyPlate(() => import('./MidbrainSections').then((m) => m.MidbrainSections)),
  Gyri: lazyPlate(() => import('./Gyri').then((m) => m.Gyri)),
  CortexTypes: lazyPlate(() => import('./CortexTypes').then((m) => m.CortexTypes)),
  Ventricles: lazyPlate(() => import('./Ventricles').then((m) => m.Ventricles)),
  InternalCapsule: lazyPlate(() => import('./InternalCapsule').then((m) => m.InternalCapsule)),
  Pathways: lazyPlate(() => import('./Pathways').then((m) => m.Pathways)),
  VisualFields: lazyPlate(() => import('./VisualFields').then((m) => m.VisualFields)),
  BoneGrowth: lazyPlate(() => import('./BoneGrowth').then((m) => m.BoneGrowth)),
  SpinalReflexes: lazyPlate(() => import('./SpinalReflexes').then((m) => m.SpinalReflexes)),
  CranialTopography: lazyPlate(() => import('./CranialTopography').then((m) => m.CranialTopography)),
  WillisCircle: lazyPlate(() => import('./WillisCircle').then((m) => m.WillisCircle)),
  Meninges: lazyPlate(() => import('./Meninges').then((m) => m.Meninges)),
  EyeNerves: lazyPlate(() => import('./EyeNerves').then((m) => m.EyeNerves)),
  CranialNuclei: lazyPlate(() => import('./CranialNuclei').then((m) => m.CranialNuclei)),
  FacialPalsy: lazyPlate(() => import('./FacialPalsy').then((m) => m.FacialPalsy)),
  BrachialPlexus: lazyPlate(() => import('./PlexusLesions').then((m) => m.BrachialPlexus)),
  LumbosacralPlexus: lazyPlate(() => import('./PlexusLesions').then((m) => m.LumbosacralPlexus)),
  AutonomicSystem: lazyPlate(() => import('./AutonomicSystem').then((m) => m.AutonomicSystem)),
  NervousViewer: lazyPlate(() => import('./NervousViewer').then((m) => m.NervousViewer)),
  VesselViewer: lazyPlate(() => import('./VesselViewer').then((m) => m.VesselViewer)),
  // Two presets of the same layered plate: muscles first in Miología, ligaments in Artrología.
  MuscleViewer: lazyPlate(() =>
    import('./TissueViewer').then(({ TissueViewer }) => () => (
      <TissueViewer caption="Lámina III · Los músculos sobre el esqueleto" initial={{ muscles: true }} storageKey="muscles" />
    )),
  ),
  LigamentViewer: lazyPlate(() =>
    import('./TissueViewer').then(({ TissueViewer }) => () => (
      <TissueViewer caption="Lámina II · Los ligamentos" initial={{ joints: true }} storageKey="ligaments" joints />
    )),
  ),
}
