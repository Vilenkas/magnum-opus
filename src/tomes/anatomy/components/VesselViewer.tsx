import { useCallback, useMemo, useState } from 'react'
import vesselsUrl from '../assets/vessels.glb?url'
import lymphUrl from '../assets/lymph.glb?url'
import {
  indexItemOf,
  sectionLabel,
  sectionOf,
  vesselById,
  vesselIndex,
  type IndexItem,
  type Section,
  type VesselEntry,
} from '../data/vessels'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { IndexedStage } from './skeleton/IndexedStage'
import { SkeletonStage, StageTag, type Focus, type PieceLook, type TissueLayer, type TissueLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './VesselViewer.module.css'

type LayerId = 'bones' | Section

const LAYERS: { id: LayerId; label: string }[] = [
  { id: 'bones', label: 'Huesos' },
  { id: 'heart', label: 'Corazón' },
  { id: 'arteries', label: 'Arterias' },
  { id: 'veins', label: 'Venas' },
  { id: 'lymph', label: 'Linfoides' },
]

const SECTION_COLOR: Record<Section, string | undefined> = {
  heart: undefined,
  arteries: '#b8322a',
  veins: '#3b5a92',
  lymph: '#5f8240',
}

/** The index, in the order of the layers. */
const SECTIONS = (['heart', 'arteries', 'veins', 'lymph'] as const).map((id) => ({
  id,
  label: sectionLabel[id],
  color: SECTION_COLOR[id],
  entries: vesselIndex.filter((item) => item.section === id),
}))

const lookOfKind = (e: VesselEntry): TissueLook =>
  e.kind === 'artery' || e.kind === 'pulmonary-artery'
    ? 'artery'
    : e.kind === 'vein' || e.kind === 'pulmonary-vein'
      ? 'vein'
      : e.kind === 'valve'
        ? 'valve'
        : e.kind === 'node'
          ? 'node'
          : e.kind === 'organ'
            ? 'organ'
            : 'heart'

const sideLabel = { left: 'izquierda', right: 'derecha' } as const

/**
 * Lámina: the heart, the arteries, the veins and the lymphoid organs over a ghosted skeleton,
 * with an index of every structure that finds it on the body.
 */
export function VesselViewer() {
  const [on, setOn] = useState<Record<LayerId, boolean>>({ bones: true, heart: true, arteries: true, veins: true, lymph: false })
  const [lymphMounted, setLymphMounted] = useState(false)
  const [selected, setSelected] = useState<IndexItem | null>(null)
  const [isolate, setIsolate] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })
  const fullscreen = useFullscreen<HTMLElement>()

  const selectedIds = useMemo(() => new Set(selected?.ids ?? []), [selected])
  const hoveredItem = hoveredId ? indexItemOf.get(hoveredId) : undefined

  const showLayer = (id: LayerId) => {
    setOn((prev) => ({ ...prev, [id]: true }))
    if (id === 'lymph') setLymphMounted(true)
  }
  const toggle = (id: LayerId) => {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }))
    if (id === 'lymph') setLymphMounted(true)
  }

  /** From the index: show its layer and fly to it. From the model: just select. */
  const choose = (item: IndexItem | null, fly: boolean) => {
    setSelected(item)
    setIsolate(false)
    if (!item) return
    showLayer(item.section)
    if (fly) setFocus({ kind: 'node', id: item.ids[0], context: 2.5 })
  }

  const boneLook = useCallback((): PieceLook => (on.bones ? 'ghost' : 'hidden'), [on.bones])

  const lookOf = useCallback(
    (id: string): TissueLook => {
      const e = vesselById.get(id)
      if (!e || !on[sectionOf(e)]) return 'hidden'
      if (selectedIds.has(id)) return 'selected'
      if (isolate && selected) return 'faded'
      if (hoveredItem && hoveredItem.ids.includes(id)) return 'hover'
      return lookOfKind(e)
    },
    [on, selectedIds, isolate, selected, hoveredItem],
  )

  const layers = useMemo<TissueLayer[]>(() => {
    const list: TissueLayer[] = [{ id: 'vessels', url: vesselsUrl, lookOf }]
    if (lymphMounted) list.push({ id: 'lymph', url: lymphUrl, lookOf })
    return list
  }, [lookOf, lymphMounted])

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>Lámina IV · El corazón y los vasos</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Capas">
        {LAYERS.map((l) => (
          <button key={l.id} className={plate.chip} data-active={on[l.id]} data-layer={l.id} aria-pressed={on[l.id]} onClick={() => toggle(l.id)}>
            {l.label}
          </button>
        ))}
      </div>

      <IndexedStage
        sections={SECTIONS}
        selectedKey={selected?.key ?? null}
        onChoose={(item) => choose(item, true)}
        storageKey="vessels"
        label="Buscar un vaso"
      >
        <SkeletonStage
          lookOf={boneLook}
          isPickable={() => false}
          layers={layers}
          focus={focus}
          onPick={(id) => choose(id ? (indexItemOf.get(id) ?? null) : null, false)}
          onHoverChange={setHoveredId}
        >
          {hoveredItem && hoveredItem !== selected && <StageTag>{hoveredItem.name}</StageTag>}
        </SkeletonStage>
      </IndexedStage>

      <div className={plate.legend} aria-live="polite">
        {selected ? (
          <SelectionCard
            item={selected}
            isolate={isolate}
            onFocus={() => setFocus({ kind: 'node', id: selected.ids[0], context: 2.5 })}
            onIsolate={() => setIsolate((v) => !v)}
            onClear={() => choose(null, false)}
          />
        ) : (
          <p className={plate.hint}>
            Busca en el índice o haz clic en un vaso · arterias en rojo, venas en azul, ganglios en verde
          </p>
        )}
      </div>
    </figure>
  )
}

function SelectionCard({
  item,
  isolate,
  onFocus,
  onIsolate,
  onClear,
}: {
  item: IndexItem
  isolate: boolean
  onFocus: () => void
  onIsolate: () => void
  onClear: () => void
}) {
  const entries = item.ids.map((id) => vesselById.get(id)!)
  const group = entries[0].groups.find((g) => g.es)?.es
  const sides = entries.map((e) => e.side).filter((s): s is 'left' | 'right' => !!s)
  return (
    <div className={styles.card}>
      <div>
        <p className={plate.kicker}>{[sectionLabel[item.section], group].filter(Boolean).join(' · ')}</p>
        <h3 className={plate.title}>{item.name}</h3>
        <p className={plate.meta}>
          {item.la && (
            <>
              <span className={plate.latin} lang="la">
                {item.la}
              </span>
              {' · '}
            </>
          )}
          <span className={plate.english} lang="en">
            {item.en}
          </span>
          {sides.length === 2 && <> · derecha e izquierda</>}
          {sides.length === 1 && <> · sólo la {sideLabel[sides[0]]}</>}
        </p>
      </div>
      <div className={styles.actions}>
        <button className={plate.button} onClick={onFocus}>
          Enfocar
        </button>
        <button className={plate.button} onClick={onIsolate} aria-pressed={isolate}>
          {isolate ? 'Ver todo' : 'Aislar'}
        </button>
        <button className={plate.button} onClick={onClear}>
          Soltar
        </button>
      </div>
    </div>
  )
}
