import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { groupById, pieceById, regionOf, type BonePiece, type GroupId, type RegionId } from '../data/skeleton'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { SkeletonStage, StageTag, type Focus, type PieceLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './SkeletonViewer.module.css'

/** What the viewer isolates: nothing, a body region, or a single group of pieces. */
type Scope = { kind: 'region'; id: RegionId } | { kind: 'group'; id: GroupId }

const SCOPES: { label: string; scope: Scope | null }[] = [
  { label: 'Todo', scope: null },
  { label: 'Cabeza', scope: { kind: 'region', id: 'head' } },
  // Tiny and buried in the temporal bone: nearly unreachable without their own scope.
  { label: 'Huesecillos del oído', scope: { kind: 'group', id: 'auditory-ossicles' } },
  { label: 'Cuello', scope: { kind: 'region', id: 'neck' } },
  { label: 'Columna vertebral', scope: { kind: 'region', id: 'spine' } },
  { label: 'Tórax', scope: { kind: 'region', id: 'thorax' } },
  { label: 'Miembro superior', scope: { kind: 'region', id: 'upper-limb' } },
  { label: 'Miembro inferior', scope: { kind: 'region', id: 'lower-limb' } },
]

const sameScope = (a: Scope | null, b: Scope | null) => a?.kind === b?.kind && a?.id === b?.id

const focusFor = (scope: Scope | null): Focus =>
  !scope ? { kind: 'all' } : scope.kind === 'region' ? { kind: 'region', region: scope.id } : { kind: 'group', group: scope.id }

/** Pieces the user has taken out of the way, to see what's behind them. */
type Removal = 'hidden' | 'dimmed'

/** Lámina II: the full skeleton, explorable. */
export function SkeletonViewer() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scope, setScope] = useState<Scope | null>(null)
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })
  const [removed, setRemoved] = useState<Map<string, Removal>>(new Map())
  // Undo stack: each entry is the piece removed by that step.
  const [history, setHistory] = useState<string[]>([])
  const lastClick = useRef<{ id: string | null; t: number }>({ id: null, t: 0 })
  const fullscreen = useFullscreen<HTMLElement>()

  const selected = selectedId ? pieceById.get(selectedId) : undefined
  const hovered = hoveredId ? pieceById.get(hoveredId) : undefined

  const inScope = useCallback(
    (p: BonePiece) =>
      !scope || (scope.kind === 'region' ? regionOf(p).id === scope.id : p.group === scope.id),
    [scope],
  )

  const lookOf = useCallback(
    (p: BonePiece, hovered: string | null): PieceLook => {
      const removal = removed.get(p.id)
      if (removal === 'hidden') return 'hidden'
      if (p.id === selectedId) return 'selected'
      if (removal === 'dimmed') return 'ghost'
      if (!inScope(p)) return 'faded'
      if (p.id === hovered) return 'hover'
      return 'base'
    },
    [selectedId, inScope, removed],
  )

  // Dimmed and hidden pieces let clicks through, so what's behind them can be picked.
  const isPickable = useCallback((p: BonePiece) => inScope(p) && !removed.has(p.id), [inScope, removed])

  const handlePick = (id: string | null) => {
    // A second click on the same piece frames the camera on it.
    const now = performance.now()
    if (id && id === lastClick.current.id && now - lastClick.current.t < 400) setFocus({ kind: 'piece', id })
    lastClick.current = { id, t: now }
    setSelectedId(id)
  }

  const isolate = (next: Scope | null) => {
    setScope(next)
    setFocus(focusFor(next))
    if (selected && next && !(next.kind === 'region' ? regionOf(selected).id === next.id : selected.group === next.id)) {
      setSelectedId(null)
    }
  }

  const remove = (id: string, how: Removal) => {
    setRemoved((prev) => new Map(prev).set(id, how))
    setHistory((prev) => [...prev, id])
    setSelectedId(null)
  }

  const undo = () => {
    const id = history[history.length - 1]
    if (!id) return
    setRemoved((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
    setHistory((prev) => prev.slice(0, -1))
  }

  const reset = () => {
    setRemoved(new Map())
    setHistory([])
    setSelectedId(null)
    setScope(null)
    setFocus({ kind: 'all' })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      undo()
    } else if (e.key === 'Escape' && selectedId) {
      setSelectedId(null)
    } else if (selectedId && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key.toLowerCase() === 'o') remove(selectedId, 'hidden')
      if (e.key.toLowerCase() === 'a') remove(selectedId, 'dimmed')
    }
  }

  const hiddenCount = [...removed.values()].filter((r) => r === 'hidden').length
  const dimmedCount = removed.size - hiddenCount

  return (
    // tabIndex lets the plate take focus when the canvas is clicked, for keyboard shortcuts.
    <figure className={plate.plate} ref={fullscreen.ref} tabIndex={-1} onKeyDown={onKeyDown}>
      <figcaption className={plate.caption}>Lámina II · El esqueleto humano</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Aislar región">
        {SCOPES.map(({ label, scope: s }) => (
          <button key={label} className={plate.chip} data-active={sameScope(scope, s)} onClick={() => isolate(s)}>
            {label}
          </button>
        ))}
      </div>

      <SkeletonStage
        lookOf={lookOf}
        isPickable={isPickable}
        focus={focus}
        onPick={handlePick}
        onHoverChange={setHoveredId}
      >
        {hovered && hovered.id !== selectedId && <StageTag>{hovered.name}</StageTag>}
        {removed.size > 0 && (
          <div className={styles.removedBar}>
            <span>
              {hiddenCount > 0 && `${hiddenCount} ${hiddenCount === 1 ? 'oculta' : 'ocultas'}`}
              {hiddenCount > 0 && dimmedCount > 0 && ' · '}
              {dimmedCount > 0 && `${dimmedCount} ${dimmedCount === 1 ? 'atenuada' : 'atenuadas'}`}
            </span>
            <button className={styles.barButton} onClick={undo} title="Deshacer (Ctrl+Z)">
              Deshacer
            </button>
            <button className={styles.barButton} onClick={reset}>
              Restablecer modelo
            </button>
          </div>
        )}
      </SkeletonStage>

      <div className={plate.legend} aria-live="polite">
        {selected ? (
          <PieceCard
            piece={selected}
            onFocus={() => setFocus({ kind: 'piece', id: selected.id })}
            onDim={() => remove(selected.id, 'dimmed')}
            onHide={() => remove(selected.id, 'hidden')}
          />
        ) : (
          <p className={plate.hint}>
            Arrastra para girar · rueda para acercar · clic para identificar · doble clic para enfocar ·
            selecciona y pulsa O para ocultar o A para atenuar
          </p>
        )}
      </div>
    </figure>
  )
}

function PieceCard({
  piece,
  onFocus,
  onDim,
  onHide,
}: {
  piece: BonePiece
  onFocus: () => void
  onDim: () => void
  onHide: () => void
}) {
  const group = groupById.get(piece.group)!
  const region = regionOf(piece)
  return (
    <div className={styles.card}>
      <div>
        <p className={plate.kicker}>
          {region.division === 'axial' ? 'Esqueleto axial' : 'Esqueleto apendicular'} · {region.name} · {group.name}
        </p>
        <h3 className={plate.title}>{piece.name}</h3>
        <p className={plate.meta}>
          <span className={plate.latin}>{piece.en}</span>
          {piece.aliases && piece.aliases.length > 0 && <> · También: {piece.aliases.join(', ')}</>}
        </p>
      </div>
      <div className={styles.actions}>
        <button className={plate.button} onClick={onFocus}>
          Enfocar
        </button>
        <button className={plate.button} onClick={onDim} title="Atenuar (A)">
          Atenuar
        </button>
        <button className={plate.button} onClick={onHide} title="Ocultar (O)">
          Ocultar
        </button>
      </div>
    </div>
  )
}
