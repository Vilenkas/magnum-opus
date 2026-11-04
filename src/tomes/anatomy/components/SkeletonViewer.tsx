import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { Bounds, OrbitControls, useBounds, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import skeletonUrl from '../assets/skeleton.glb?url'
import {
  groupById,
  pieceById,
  regionOf,
  regions,
  type BonePiece,
  type RegionId,
  type Tissue,
} from '../data/skeleton'
import styles from './SkeletonViewer.module.css'

const ACCENT = '#9c3b26'

const tissueColor: Record<Tissue, string> = {
  bone: '#e6d9bd',
  cartilage: '#c9d3cf',
  tooth: '#f5f0e2',
}

/** One material per (tissue × visual state), shared across meshes. */
function useMaterials() {
  return useMemo(() => {
    const make = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...extra })
    const base = {} as Record<Tissue, THREE.MeshStandardMaterial>
    for (const t of Object.keys(tissueColor) as Tissue[]) base[t] = make(tissueColor[t])
    return {
      base,
      hover: make('#e9b9a0', { emissive: ACCENT, emissiveIntensity: 0.15 }),
      selected: make(ACCENT, { roughness: 0.55 }),
      faded: make('#bfb39c', { transparent: true, opacity: 0.12, depthWrite: false }),
    }
  }, [])
}

type Materials = ReturnType<typeof useMaterials>

interface ModelProps {
  hoveredId: string | null
  selectedId: string | null
  isolated: RegionId | null
  focusId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
}

function SkeletonModel({ hoveredId, selectedId, isolated, focusId, onHover, onSelect }: ModelProps) {
  // Meshopt on, Draco off: Draco would fetch its decoder from a CDN, which breaks offline use.
  const { scene } = useGLTF(skeletonUrl, false, true)
  const materials = useMaterials()
  const invalidate = useThree((s) => s.invalidate)
  const bounds = useBounds()

  const meshes = useMemo(() => {
    const map = new Map<string, THREE.Mesh>()
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && pieceById.has(o.name)) map.set(o.name, o as THREE.Mesh)
    })
    if (import.meta.env.DEV && map.size !== pieceById.size) {
      const missing = [...pieceById.keys()].filter((id) => !map.has(id))
      console.warn(`[anatomy] ${missing.length} pieces not found as meshes in skeleton.glb:`, missing)
    }
    return map
  }, [scene])

  // Repaint materials whenever the interaction state changes.
  useEffect(() => {
    for (const [id, mesh] of meshes) {
      mesh.material = materialFor(pieceById.get(id)!, materials, { hoveredId, selectedId, isolated })
      mesh.renderOrder = mesh.material === materials.faded ? 1 : 0
    }
    invalidate()
  }, [meshes, materials, hoveredId, selectedId, isolated, invalidate])

  // Frame the camera on a piece, a region, or the whole skeleton.
  useEffect(() => {
    if (focusId && meshes.has(focusId)) {
      bounds.refresh(meshes.get(focusId)!).fit()
    } else if (isolated) {
      const box = new THREE.Box3()
      for (const [id, mesh] of meshes) if (regionOf(pieceById.get(id)!).id === isolated) box.expandByObject(mesh)
      bounds.refresh(box).fit()
    } else {
      bounds.refresh(scene).fit()
    }
  }, [focusId, isolated, meshes, scene, bounds])

  // Nearest piece under the pointer. Faded pieces are transparent "ghosts":
  // the ray passes through them to whatever is behind.
  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation()
    const hit = e.intersections.find(({ object }) => {
      const piece = pieceById.get(object.name)
      return piece && (!isolated || regionOf(piece).id === isolated)
    })
    return hit?.object.name ?? null
  }

  return (
    <primitive
      object={scene}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => onHover(pick(e))}
      onPointerLeave={() => onHover(null)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const id = pick(e)
        // Ignore clicks that were really the end of an orbit drag.
        if (e.delta <= 4) onSelect(id)
      }}
    />
  )
}

function materialFor(
  piece: BonePiece,
  m: Materials,
  s: { hoveredId: string | null; selectedId: string | null; isolated: RegionId | null },
) {
  if (piece.id === s.selectedId) return m.selected
  if (s.isolated && regionOf(piece).id !== s.isolated) return m.faded
  if (piece.id === s.hoveredId) return m.hover
  return m.base[piece.tissue ?? 'bone']
}

/** Lámina II: the full skeleton, explorable. */
export function SkeletonViewer() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isolated, setIsolated] = useState<RegionId | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const lastClick = useRef<{ id: string | null; t: number }>({ id: null, t: 0 })

  const selected = selectedId ? pieceById.get(selectedId) : undefined
  const hovered = hoveredId ? pieceById.get(hoveredId) : undefined

  const handleSelect = (id: string | null) => {
    // A second click on the same piece focuses the camera on it.
    const now = performance.now()
    if (id && id === lastClick.current.id && now - lastClick.current.t < 400) setFocusId(id)
    lastClick.current = { id, t: now }
    setSelectedId(id)
  }

  const isolate = (region: RegionId | null) => {
    setIsolated(region)
    setFocusId(null)
    if (selected && region && regionOf(selected).id !== region) setSelectedId(null)
  }

  return (
    <figure className={styles.plate}>
      <figcaption className={styles.caption}>Lámina II · El esqueleto humano</figcaption>

      <div className={styles.regionBar} role="toolbar" aria-label="Aislar región">
        <button className={styles.chip} data-active={isolated === null} onClick={() => isolate(null)}>
          Todo
        </button>
        {regions.map((r) => (
          <button key={r.id} className={styles.chip} data-active={isolated === r.id} onClick={() => isolate(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 1, 3], fov: 35, near: 0.01, far: 50 }}
          onPointerMissed={() => setSelectedId(null)}
        >
          <hemisphereLight args={['#fff8ec', '#6b5843', 1.4]} />
          <directionalLight position={[2, 3, 2]} intensity={1.6} />
          <directionalLight position={[-2, 1, -2]} intensity={0.5} />
          <Suspense fallback={null}>
            <Bounds margin={1.15} maxDuration={0.6}>
              <SkeletonModel
                hoveredId={hoveredId}
                selectedId={selectedId}
                isolated={isolated}
                focusId={focusId}
                onHover={setHoveredId}
                onSelect={handleSelect}
              />
            </Bounds>
          </Suspense>
          <OrbitControls makeDefault enablePan enableDamping={false} />
        </Canvas>

        <LoadingOverlay />

        {hovered && hovered.id !== selectedId && <div className={styles.hoverTag}>{hovered.name}</div>}
      </div>

      <div className={styles.legend} aria-live="polite">
        {selected ? (
          <PieceCard piece={selected} onFocus={() => setFocusId(selected.id)} />
        ) : (
          <p className={styles.hint}>
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
        <p className={styles.cardKicker}>
          {region.division === 'axial' ? 'Esqueleto axial' : 'Esqueleto apendicular'} · {region.name} · {group.name}
        </p>
        <h3 className={styles.cardTitle}>{piece.name}</h3>
        <p className={styles.cardMeta}>
          <span className={styles.latin}>{piece.en}</span>
          {piece.aliases && piece.aliases.length > 0 && <> · También: {piece.aliases.join(', ')}</>}
        </p>
      </div>
      <button className={styles.focusButton} onClick={onFocus}>
        Enfocar
      </button>
    </div>
  )
}

function LoadingOverlay() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div className={styles.loading}>
      <span>Preparando la lámina… {Math.round(progress)}%</span>
    </div>
  )
}
