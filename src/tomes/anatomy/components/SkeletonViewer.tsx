import { useCallback, useRef, useState } from 'react'
import { groupById, pieceById, regionOf, regions, type BonePiece, type RegionId } from '../data/skeleton'
import { SkeletonStage, StageTag, type Focus } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './SkeletonViewer.module.css'

/** Lámina II: the full skeleton, explorable. */
export function SkeletonViewer() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isolated, setIsolated] = useState<RegionId | null>(null)
  const [focus, setFocus] = useState<Focus>({ kind: 'all' })
  const lastClick = useRef<{ id: string | null; t: number }>({ id: null, t: 0 })

  const selected = selectedId ? pieceById.get(selectedId) : undefined
  const hovered = hoveredId ? pieceById.get(hoveredId) : undefined

  const inScope = useCallback((p: BonePiece) => !isolated || regionOf(p).id === isolated, [isolated])

  const lookOf = useCallback(
    (p: BonePiece, hovered: string | null) => {
      if (p.id === selectedId) return 'selected'
      if (!inScope(p)) return 'faded'
      if (p.id === hovered) return 'hover'
      return 'base'
    },
    [selectedId, inScope],
  )

  const handlePick = (id: string | null) => {
    // A second click on the same piece frames the camera on it.
    const now = performance.now()
    if (id && id === lastClick.current.id && now - lastClick.current.t < 400) setFocus({ kind: 'piece', id })
    lastClick.current = { id, t: now }
    setSelectedId(id)
  }

  const isolate = (region: RegionId | null) => {
    setIsolated(region)
    setFocus(region ? { kind: 'region', region } : { kind: 'all' })
    if (selected && region && regionOf(selected).id !== region) setSelectedId(null)
  }

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina II · El esqueleto humano</figcaption>

      <div className={plate.chipBar} role="toolbar" aria-label="Aislar región">
        <button className={plate.chip} data-active={isolated === null} onClick={() => isolate(null)}>
          Todo
        </button>
        {regions.map((r) => (
          <button key={r.id} className={plate.chip} data-active={isolated === r.id} onClick={() => isolate(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <SkeletonStage
        lookOf={lookOf}
        isPickable={inScope}
        focus={focus}
        onPick={handlePick}
        onHoverChange={setHoveredId}
      >
        {hovered && hovered.id !== selectedId && <StageTag>{hovered.name}</StageTag>}
      </SkeletonStage>

      <div className={plate.legend} aria-live="polite">
        {selected ? (
          <PieceCard piece={selected} onFocus={() => setFocus({ kind: 'piece', id: selected.id })} />
        ) : (
          <p className={plate.hint}>
            Arrastra para girar · rueda para acercar · haz clic en un hueso para identificarlo ·
            doble clic para enfocarlo
          </p>
        )}
      </div>
    </figure>
  )
}

function PieceCard({ piece, onFocus }: { piece: BonePiece; onFocus: () => void }) {
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
      <button className={plate.button} onClick={onFocus}>
        Enfocar
      </button>
    </div>
  )
}
