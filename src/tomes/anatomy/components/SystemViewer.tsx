import { useCallback, useMemo, useState } from 'react'
import type { SystemEntry, SystemItem, SystemModel } from '../data/system-model'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { IndexedStage } from './skeleton/IndexedStage'
import { SkeletonStage, StageTag, type Focus, type PieceLook, type TissueLayer, type TissueLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './SystemViewer.module.css'

export interface SystemSection<S extends string> {
  id: S
  label: string
  /** Chip and index heading colour. */
  color?: string
  /** Shown when the plate opens. */
  on: boolean
}

export interface SystemViewerProps<S extends string> {
  caption: string
  model: SystemModel<S>
  /** One .glb per set; a model is fetched the first time one of its sections is shown. */
  urls: Record<string, string>
  /** Layer chips and index sections, in order. */
  sections: SystemSection<S>[]
  lookOf: (e: SystemEntry) => TissueLook
  storageKey: string
  searchLabel: string
  hint: string
}

/**
 * Lámina: one body system over a ghosted skeleton, in layers, with an index of every structure
 * that finds it on the body. Shared by the vessels and the nervous system.
 */
export function SystemViewer<S extends string>({ caption, model, urls, sections, lookOf: lookOfEntry, storageKey, searchLabel, hint }: SystemViewerProps<S>) {
  const [bones, setBones] = useState(true)
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map((s) => [s.id, s.on])))
  const setsOf = useCallback(
    (section: S) => new Set(model.entries.filter((e) => model.sectionOf(e) === section).map((e) => e.set)),
    [model],
  )
  const [mounted, setMounted] = useState<Set<string>>(() => new Set(sections.filter((s) => s.on).flatMap((s) => [...setsOf(s.id)])))
  const [selected, setSelected] = useState<SystemItem<S> | null>(null)
  const [isolate, setIsolate] = useState(false)
  // One undo step per structure put away (both sides of a pair together).
  const [removed, setRemoved] = useState<string[][]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })
  const fullscreen = useFullscreen<HTMLElement>()

  const selectedIds = useMemo(() => new Set(selected?.ids ?? []), [selected])
  const removedIds = useMemo(() => new Set(removed.flat()), [removed])
  const hoveredItem = hoveredId ? model.itemOf.get(hoveredId) : undefined

  const show = (id: S, value: boolean) => {
    setOn((prev) => ({ ...prev, [id]: value }))
    if (value) setMounted((prev) => new Set([...prev, ...setsOf(id)]))
  }

  /** From the index: show its layer, bring it back if it was put away, and fly to it. */
  const choose = (item: SystemItem<S> | null, fly: boolean) => {
    setSelected(item)
    setIsolate(false)
    if (!item) return
    show(item.section, true)
    setRemoved((prev) => prev.filter((group) => !group.some((id) => item.ids.includes(id))))
    if (fly) setFocus({ kind: 'node', id: item.ids[0], context: 2.5 })
  }

  const hide = () => {
    if (!selected) return
    setRemoved((prev) => [...prev, selected.ids])
    choose(null, false)
  }

  const boneLook = useCallback((): PieceLook => (bones ? 'ghost' : 'hidden'), [bones])

  const lookOf = useCallback(
    (id: string): TissueLook => {
      const e = model.byId.get(id)
      if (!e || !on[model.sectionOf(e)] || removedIds.has(id)) return 'hidden'
      if (selectedIds.has(id)) return 'selected'
      if (isolate && selected) return 'faded'
      if (hoveredItem && hoveredItem.ids.includes(id)) return 'hover'
      return lookOfEntry(e)
    },
    [model, on, removedIds, selectedIds, isolate, selected, hoveredItem, lookOfEntry],
  )

  const layers = useMemo<TissueLayer[]>(
    () => Object.entries(urls).filter(([set]) => mounted.has(set)).map(([set, url]) => ({ id: set, url, lookOf })),
    [urls, mounted, lookOf],
  )

  const indexSections = useMemo(
    () => sections.map((s) => ({ id: s.id, label: s.label, color: s.color, entries: model.index.filter((i) => i.section === s.id) })),
    [sections, model],
  )
  const labelOf = (id: S) => sections.find((s) => s.id === id)!.label

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>{caption}</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Capas">
        <button className={plate.chip} data-active={bones} aria-pressed={bones} onClick={() => setBones((b) => !b)}>
          Huesos
        </button>
        {sections.map((s) => (
          <button
            key={s.id}
            className={plate.chip}
            data-active={on[s.id]}
            aria-pressed={on[s.id]}
            style={on[s.id] && s.color ? { background: s.color, borderColor: s.color } : undefined}
            onClick={() => show(s.id, !on[s.id])}
          >
            {s.label}
          </button>
        ))}
      </div>

      <IndexedStage sections={indexSections} selectedKey={selected?.key ?? null} onChoose={(item) => choose(item, true)} storageKey={storageKey} label={searchLabel}>
        <SkeletonStage
          lookOf={boneLook}
          isPickable={() => false}
          layers={layers}
          focus={focus}
          onPick={(id) => choose(id ? (model.itemOf.get(id) ?? null) : null, false)}
          onHoverChange={setHoveredId}
        >
          {hoveredItem && hoveredItem !== selected && <StageTag>{hoveredItem.name}</StageTag>}
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
      </IndexedStage>

      <div className={plate.legend} aria-live="polite">
        {selected ? (
          <SelectionCard
            item={selected}
            model={model}
            sectionLabel={labelOf(selected.section)}
            isolate={isolate}
            onFocus={() => setFocus({ kind: 'node', id: selected.ids[0], context: 2.5 })}
            onIsolate={() => setIsolate((v) => !v)}
            onHide={hide}
            onClear={() => choose(null, false)}
          />
        ) : (
          <p className={plate.hint}>{hint}</p>
        )}
      </div>
    </figure>
  )
}

function SelectionCard<S extends string>({
  item,
  model,
  sectionLabel,
  isolate,
  onFocus,
  onIsolate,
  onHide,
  onClear,
}: {
  item: SystemItem<S>
  model: SystemModel<S>
  sectionLabel: string
  isolate: boolean
  onFocus: () => void
  onIsolate: () => void
  onHide: () => void
  onClear: () => void
}) {
  const entries = item.ids.map((id) => model.byId.get(id)!)
  const group = entries[0].groups.find((g) => g.es)?.es
  const sides = entries.map((e) => e.side).filter((s): s is 'left' | 'right' => !!s)
  return (
    <div className={styles.card}>
      <div>
        <p className={plate.kicker}>{[sectionLabel, group].filter(Boolean).join(' · ')}</p>
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
          {sides.length === 2 && <> · lados derecho e izquierdo</>}
          {sides.length === 1 && <> · sólo el lado {sides[0] === 'left' ? 'izquierdo' : 'derecho'}</>}
        </p>
      </div>
      <div className={styles.actions}>
        <button className={plate.button} onClick={onFocus}>
          Enfocar
        </button>
        <button className={plate.button} onClick={onIsolate} aria-pressed={isolate}>
          {isolate ? 'Ver todo' : 'Aislar'}
        </button>
        <button className={plate.button} onClick={onHide}>
          Ocultar
        </button>
        <button className={plate.button} onClick={onClear}>
          Soltar
        </button>
      </div>
    </div>
  )
}
