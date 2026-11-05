import { useCallback, useMemo, useState } from 'react'
import musclesUrl from '../assets/muscles.glb?url'
import jointsUrl from '../assets/joints.glb?url'
import insertionsUrl from '../assets/insertions.glb?url'
import { latinWithSide } from '../data/latin'
import { pieceById, type BonePiece } from '../data/skeleton'
import { insertionsOf, jointKindLabel, muscleOf, softById, softName, type SoftEntry } from '../data/soft-tissues'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import {
  SkeletonStage,
  StageTag,
  type Focus,
  type PieceLook,
  type TissueLayer,
  type TissueLook,
} from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './TissueViewer.module.css'

type LayerId = 'bones' | 'muscles' | 'joints' | 'insertions'

const LAYERS: { id: LayerId; label: string }[] = [
  { id: 'bones', label: 'Huesos' },
  { id: 'muscles', label: 'Músculos' },
  { id: 'joints', label: 'Ligamentos' },
  { id: 'insertions', label: 'Inserciones' },
]

const sideLabel = { left: 'izquierdo', right: 'derecho' } as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Muscle-layer pieces kept off the plate: small and in the way (bursae, sheaths) or veils (fasciae). */
const QUIET_KINDS = new Set(['bursa', 'sheath', 'fascia'])

/** The selectable thing a node stands for: a muscle (any of its pieces), a joint piece or a bone. */
function targetOf(id: string | null): string | null {
  if (!id) return null
  const soft = softById.get(id)
  if (!soft) return id
  if (soft.set === 'insertions') return soft.musclePieces?.[0] ?? null
  return soft.set === 'muscles' ? (muscleOf(id)?.id ?? id) : id
}

/**
 * Lámina: the skeleton with its soft tissues in layers. Selecting a muscle shows where it
 * arises (red) and where it ends (blue) on the bones. Shared by Miología and Artrología,
 * which differ only in the layers they start with.
 */
export function TissueViewer({ caption, initial }: { caption: string; initial: Partial<Record<LayerId, boolean>> }) {
  const [on, setOn] = useState<Record<LayerId, boolean>>({ bones: true, muscles: false, joints: false, insertions: false, ...initial })
  // A layer's model is fetched the first time it is needed, then kept.
  const [mounted, setMounted] = useState<Set<LayerId>>(() => new Set((Object.keys(on) as LayerId[]).filter((k) => on[k])))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [reveal, setReveal] = useState(false)
  const [removed, setRemoved] = useState<string[]>([])
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })
  const fullscreen = useFullscreen<HTMLElement>()

  const selectedSoft = selectedId ? softById.get(selectedId) : undefined
  const selectedMuscle = selectedSoft?.set === 'muscles' ? selectedSoft : undefined
  const areas = useMemo(() => (selectedMuscle ? (insertionsOf.get(selectedMuscle.id) ?? []) : []), [selectedMuscle])
  const areaIds = useMemo(() => new Set(areas.map((a) => a.id)), [areas])
  const removedSet = useMemo(() => new Set(removed), [removed])
  const hoveredTarget = targetOf(hoveredId)

  const mount = (id: LayerId) => setMounted((prev) => (prev.has(id) ? prev : new Set([...prev, id])))
  const toggle = (id: LayerId) => {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }))
    mount(id)
  }

  const select = (id: string | null) => {
    const target = targetOf(id)
    setSelectedId(target)
    setReveal(false)
    // A muscle's areas live in the insertions model.
    if (target && softById.get(target)?.set === 'muscles') mount('insertions')
  }

  const boneLook = useCallback(
    (p: BonePiece): PieceLook => {
      if (!on.bones || removedSet.has(p.id)) return 'hidden'
      if (p.id === selectedId) return 'selected'
      if (p.id === hoveredTarget) return 'hover'
      return 'base'
    },
    [on.bones, removedSet, selectedId, hoveredTarget],
  )

  const layers = useMemo<TissueLayer[]>(() => {
    const list: TissueLayer[] = []
    if (mounted.has('muscles'))
      list.push({
        id: 'muscles',
        url: musclesUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id)
          const muscle = muscleOf(id)?.id ?? id
          if (!on.muscles || !e || QUIET_KINDS.has(e.kind) || removedSet.has(muscle)) return 'hidden'
          if (muscle === selectedId) return reveal ? 'ghost' : 'selected'
          if (reveal) return 'faded'
          if (muscle === hoveredTarget) return 'hover'
          return e.part === 'tendon' ? 'tendon' : 'muscle'
        },
        isPickable: (id) => !reveal && !QUIET_KINDS.has(softById.get(id)?.kind ?? ''),
      })
    if (mounted.has('joints'))
      list.push({
        id: 'joints',
        url: jointsUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id)
          if (!on.joints || !e || removedSet.has(id)) return 'hidden'
          if (id === selectedId) return 'selected'
          if (id === hoveredTarget) return 'hover'
          return e.kind === 'articular capsule' ? 'capsule' : e.kind === 'ligament' ? 'ligament' : 'cartilage'
        },
      })
    if (mounted.has('insertions'))
      list.push({
        id: 'insertions',
        url: insertionsUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id)
          // All areas with the layer on; otherwise only those of the selected muscle.
          if (!e || !(on.insertions || areaIds.has(id))) return 'hidden'
          return e.kind === 'origin' ? 'origin' : 'insertion'
        },
        isPickable: (id) => on.insertions || areaIds.has(id),
      })
    return list
  }, [mounted, on, removedSet, selectedId, hoveredTarget, reveal, areaIds])

  const remove = (id: string) => {
    setRemoved((prev) => [...prev, id])
    setSelectedId(null)
  }

  const hoveredName = hoveredTarget && hoveredTarget !== selectedId ? nameOf(hoveredTarget) : null

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>{caption}</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Capas">
        {LAYERS.map((l) => (
          <button key={l.id} className={plate.chip} data-active={on[l.id]} aria-pressed={on[l.id]} onClick={() => toggle(l.id)}>
            {l.label}
          </button>
        ))}
      </div>

      <SkeletonStage lookOf={boneLook} layers={layers} focus={focus} onPick={select} onHoverChange={setHoveredId}>
        {hoveredName && <StageTag>{hoveredName}</StageTag>}
        {removed.length > 0 && (
          <div className={styles.removedBar}>
            <span>
              {removed.length} {removed.length === 1 ? 'oculta' : 'ocultas'}
            </span>
            <button className={styles.barButton} onClick={() => setRemoved((prev) => prev.slice(0, -1))}>
              Deshacer
            </button>
            <button className={styles.barButton} onClick={() => setRemoved([])}>
              Restablecer
            </button>
          </div>
        )}
      </SkeletonStage>

      <div className={plate.legend} aria-live="polite">
        {selectedId ? (
          <SelectionCard
            id={selectedId}
            areas={areas}
            reveal={reveal}
            onFocus={() => setFocus({ kind: 'node', id: selectedId })}
            onReveal={() => setReveal((v) => !v)}
            onHide={() => remove(selectedId)}
          />
        ) : (
          <p className={plate.hint}>
            Activa las capas · clic para identificar · en un músculo verás su origen (rojo) y su inserción (azul)
          </p>
        )}
      </div>
    </figure>
  )
}

function nameOf(id: string): string {
  const soft = softById.get(id)
  if (soft) return capitalize(softName(soft)) + (soft.side ? ` ${sideLabel[soft.side]}` : '')
  return pieceById.get(id)?.name ?? id
}

function SelectionCard({
  id,
  areas,
  reveal,
  onFocus,
  onReveal,
  onHide,
}: {
  id: string
  areas: SoftEntry[]
  reveal: boolean
  onFocus: () => void
  onReveal: () => void
  onHide: () => void
}) {
  const soft = softById.get(id)
  const bone = pieceById.get(id)
  const kicker = soft
    ? [soft.set === 'joints' ? (jointKindLabel[soft.kind] ?? 'Articulación') : 'Músculo', soft.groups?.[0]?.es ?? soft.groups?.[0]?.en]
        .filter(Boolean)
        .join(' · ')
    : 'Hueso'
  const latin = soft ? soft.la : bone ? latinWithSide(bone.en, bone.side) : undefined
  const en = soft?.en ?? bone?.en

  const bonesOf = (kind: 'origin' | 'insertion') => {
    const names = areas.filter((a) => a.kind === kind).map((a) => pieceById.get(a.bone!)?.base ?? a.bone!)
    return [...new Set(names)]
  }
  const origins = bonesOf('origin')
  const insertions = bonesOf('insertion')

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <p className={plate.kicker}>{kicker}</p>
          <h3 className={plate.title}>{nameOf(id)}</h3>
          <p className={plate.meta}>
            {latin && (
              <>
                <span className={plate.latin} lang="la">
                  {latin}
                </span>
                {' · '}
              </>
            )}
            <span className={plate.english} lang="en">
              {en}
            </span>
          </p>
        </div>
        <div className={styles.actions}>
          <button className={plate.button} onClick={onFocus}>
            Enfocar
          </button>
          {areas.length > 0 && (
            <button className={plate.button} onClick={onReveal} aria-pressed={reveal}>
              {reveal ? 'Ver el músculo' : 'Ver en el hueso'}
            </button>
          )}
          <button className={plate.button} onClick={onHide}>
            Ocultar
          </button>
        </div>
      </div>
      {areas.length > 0 && (
        <dl className={styles.areas}>
          {origins.length > 0 && (
            <>
              <dt>
                <span className={styles.swatch} data-kind="origin" aria-hidden /> Origen
              </dt>
              <dd>{origins.join(' · ')}</dd>
            </>
          )}
          {insertions.length > 0 && (
            <>
              <dt>
                <span className={styles.swatch} data-kind="insertion" aria-hidden /> Inserción
              </dt>
              <dd>{insertions.join(' · ')}</dd>
            </>
          )}
        </dl>
      )}
    </div>
  )
}
