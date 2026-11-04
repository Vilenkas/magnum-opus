import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
/** The parts of OrbitControls the camera flight needs (drei's impl lives in three-stdlib). */
type OrbitControlsImpl = THREE.EventDispatcher<{ start: object }> & { target: THREE.Vector3; update: () => void }
import skeletonUrl from '../../assets/skeleton.glb?url'
import { pieceById, regionOf, type BonePiece, type RegionId, type Tissue } from '../../data/skeleton'
import styles from './SkeletonStage.module.css'

/** How a piece is painted. The parent decides; the stage just applies it. */
export type PieceLook =
  | 'base'
  | 'hover'
  | 'selected'
  | 'correct'
  | 'wrong'
  /** Barely there: out-of-scope pieces. */
  | 'faded'
  /** Translucent context, so a highlighted piece stays visible even deep inside the skull. */
  | 'ghost'

/** What the camera frames. Pass a new object to re-frame, even on the same target. */
export type Focus =
  | { kind: 'all' }
  | { kind: 'region'; region: RegionId }
  /** `context` > 1 widens the frame so neighbouring bones stay visible. */
  | { kind: 'piece'; id: string; context?: number }

export interface SkeletonStageProps {
  lookOf: (piece: BonePiece, hoveredId: string | null) => PieceLook
  isPickable?: (piece: BonePiece) => boolean
  focus: Focus
  onPick?: (id: string | null) => void
  onHoverChange?: (id: string | null) => void
  /** Overlays drawn on top of the canvas (tags, prompts…). */
  children?: ReactNode
  className?: string
}

const tissueColor: Record<Tissue, string> = {
  bone: '#e6d9bd',
  cartilage: '#c9d3cf',
  tooth: '#f5f0e2',
}

function useMaterials() {
  return useMemo(() => {
    const make = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...extra })
    const base = {} as Record<Tissue, THREE.MeshStandardMaterial>
    for (const t of Object.keys(tissueColor) as Tissue[]) base[t] = make(tissueColor[t])
    return {
      base,
      hover: make('#e9b9a0', { emissive: '#9c3b26', emissiveIntensity: 0.15 }),
      selected: make('#9c3b26', { roughness: 0.55 }),
      correct: make('#6f8f4e', { roughness: 0.55 }),
      wrong: make('#5e1a10', { roughness: 0.55 }),
      faded: make('#bfb39c', { transparent: true, opacity: 0.12, depthWrite: false }),
      ghost: make('#e6d9bd', { transparent: true, opacity: 0.28, depthWrite: false }),
    }
  }, [])
}

const defaultPickable = () => true

// The model faces +Z (anterior view), Y up.
const FRONT = new THREE.Vector3(0, 0.1, 1).normalize()

/**
 * Camera direction that shows a piece from its own side: lateral bones obliquely from
 * their side, posterior ones (scapula, spinous processes) from behind, midline ones
 * from the front.
 */
function viewDirectionFor(center: THREE.Vector3, bodyAxis: THREE.Vector3): THREE.Vector3 {
  const outward = new THREE.Vector3(center.x - bodyAxis.x, 0, center.z - bodyAxis.z)
  if (outward.length() < 0.04) return FRONT
  outward.normalize()
  // Lateral pieces: keep some of the frontal view so the face/anterior landmarks stay readable.
  const facesBack = outward.z < -0.5
  return outward
    .addScaledVector(facesBack ? new THREE.Vector3(0, 0, -1) : FRONT, 0.8)
    .setY(0.15)
    .normalize()
}

const FLIGHT_SECONDS = 0.7
const FRAME_MARGIN = 1.05
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Animated camera framing. Returns `flyTo(box, direction)`: moves the camera so `box`
 * fills the view, looking along -direction. Requests every frame it needs (frameloop is
 * "demand"), keeps OrbitControls' target in sync, and yields to the user if they start
 * dragging mid-flight.
 */
function useCameraFlight() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const invalidate = useThree((s) => s.invalidate)
  const flight = useRef<{
    fromPos: THREE.Vector3
    fromTarget: THREE.Vector3
    toPos: THREE.Vector3
    toTarget: THREE.Vector3
    t: number
  } | null>(null)

  useEffect(() => {
    if (!controls) return
    const cancel = () => (flight.current = null)
    controls.addEventListener('start', cancel)
    return () => controls.removeEventListener('start', cancel)
  }, [controls])

  useFrame((_, delta) => {
    const f = flight.current
    if (!f) return
    // Clamp delta: on-demand rendering can report huge gaps between frames.
    f.t = Math.min(1, f.t + Math.min(delta, 0.1) / FLIGHT_SECONDS)
    const k = easeInOutCubic(f.t)
    const target = new THREE.Vector3().lerpVectors(f.fromTarget, f.toTarget, k)
    camera.position.lerpVectors(f.fromPos, f.toPos, k)
    camera.lookAt(target)
    controls?.target.copy(target)
    if (f.t >= 1) {
      flight.current = null
      controls?.update()
    }
    invalidate()
  })

  return useCallback(
    (box: THREE.Box3, direction: THREE.Vector3) => {
      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const vFov = THREE.MathUtils.degToRad(camera.fov)
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
      const distance = (sphere.radius * FRAME_MARGIN) / Math.sin(Math.min(vFov, hFov) / 2)
      flight.current = {
        fromPos: camera.position.clone(),
        fromTarget: controls?.target.clone() ?? sphere.center.clone(),
        toPos: sphere.center.clone().addScaledVector(direction, distance),
        toTarget: sphere.center.clone(),
        t: 0,
      }
      invalidate()
    },
    [camera, controls, invalidate],
  )
}

function SkeletonModel({
  lookOf,
  isPickable = defaultPickable,
  focus,
  onPick,
  hoveredId,
  setHoveredId,
}: Omit<SkeletonStageProps, 'children' | 'className' | 'onHoverChange'> & {
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}) {
  // Meshopt on, Draco off: Draco would fetch its decoder from a CDN, which breaks offline use.
  const gltf = useGLTF(skeletonUrl, false, true)
  // useGLTF caches one scene for every caller, and an Object3D can only have one parent:
  // without a clone, a second plate on the page would steal the skeleton from the first
  // (and both would fight over its materials). Clones share geometry, so this is cheap.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const materials = useMaterials()
  const invalidate = useThree((s) => s.invalidate)
  const flyTo = useCameraFlight()

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

  useEffect(() => {
    for (const [id, mesh] of meshes) {
      const piece = pieceById.get(id)!
      const look = lookOf(piece, hoveredId)
      mesh.material = look === 'base' ? materials.base[piece.tissue ?? 'bone'] : materials[look]
      // Ghosts draw after solids so they never hide them.
      mesh.renderOrder = look === 'faded' || look === 'ghost' ? 1 : 0
    }
    invalidate()
  }, [meshes, materials, lookOf, hoveredId, invalidate])

  // The body's vertical axis (x/z of the whole skeleton's centre).
  const bodyAxis = useMemo(() => new THREE.Box3().setFromObject(scene).getCenter(new THREE.Vector3()), [scene])

  useEffect(() => {
    const box = new THREE.Box3()
    let direction = FRONT
    if (focus.kind === 'piece' && meshes.has(focus.id)) {
      box.setFromObject(meshes.get(focus.id)!)
      const center = box.getCenter(new THREE.Vector3())
      const context = focus.context ?? 1
      if (context !== 1) {
        const size = box.getSize(new THREE.Vector3())
        // Small bones (carpals, ossicles) need a minimum frame to show where they are.
        const side = Math.max(size.x, size.y, size.z, 0.08) * context
        box.setFromCenterAndSize(center, new THREE.Vector3(side, side, side))
      }
      direction = viewDirectionFor(center, bodyAxis)
    } else if (focus.kind === 'region') {
      for (const [id, mesh] of meshes) {
        if (regionOf(pieceById.get(id)!).id === focus.region) box.expandByObject(mesh)
      }
    } else {
      box.setFromObject(scene)
    }
    flyTo(box, direction)
  }, [focus, meshes, scene, bodyAxis, flyTo])

  // Nearest pickable piece under the pointer; faded "ghosts" let the ray through.
  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation()
    const hit = e.intersections.find(({ object }) => {
      const piece = pieceById.get(object.name)
      return piece && isPickable(piece)
    })
    return hit?.object.name ?? null
  }

  return (
    <primitive
      object={scene}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => setHoveredId(pick(e))}
      onPointerLeave={() => setHoveredId(null)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const id = pick(e)
        // Ignore clicks that were really the end of an orbit drag.
        if (e.delta <= 4) onPick?.(id)
      }}
    />
  )
}

/** Canvas + lights + the skeleton model + camera framing. Shared by the viewer and the quiz. */
export function SkeletonStage({ children, className, onHoverChange, onPick, ...modelProps }: SkeletonStageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => onHoverChange?.(hoveredId), [hoveredId, onHoverChange])

  return (
    <div className={`${styles.stage} ${className ?? ''}`}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [0, 1, 3], fov: 35, near: 0.01, far: 50 }}
        onPointerMissed={() => onPick?.(null)}
      >
        <hemisphereLight args={['#fff8ec', '#6b5843', 1.4]} />
        <directionalLight position={[2, 3, 2]} intensity={1.6} />
        <directionalLight position={[-2, 1, -2]} intensity={0.5} />
        <Suspense fallback={null}>
          <SkeletonModel {...modelProps} onPick={onPick} hoveredId={hoveredId} setHoveredId={setHoveredId} />
        </Suspense>
        <OrbitControls makeDefault enablePan enableDamping={false} />
      </Canvas>
      <LoadingOverlay />
      {children}
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

/** Small overlay label centred at the top of the stage. */
export function StageTag({ children }: { children: ReactNode }) {
  return <div className={styles.tag}>{children}</div>
}
