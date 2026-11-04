import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Bvh, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
/** The parts of OrbitControls the camera flight needs (drei's impl lives in three-stdlib). */
type OrbitControlsImpl = THREE.EventDispatcher<{ start: object }> & { target: THREE.Vector3; update: () => void }
import skeletonUrl from '../../assets/skeleton.glb?url'
import { pieceById, regionOf, type BonePiece, type GroupId, type RegionId, type Tissue } from '../../data/skeleton'
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
  /** Not drawn and not pickable. */
  | 'hidden'

/** What the camera frames. Pass a new object to re-frame, even on the same target. */
export type Focus =
  | { kind: 'all' }
  | { kind: 'region'; region: RegionId }
  | { kind: 'group'; group: GroupId }
  /** `context` > 1 widens the frame so neighbouring bones stay visible. */
  | { kind: 'piece'; id: string; context?: number }
  /** A point on a piece (a landmark), looked at along its surface normal. */
  | { kind: 'point'; pieceId: string; position: Vec3; normal: Vec3 }
  /**
   * A joint: a frame around `position` sized from the smallest of its pieces (or `frame`,
   * in model units), seen from an anatomical view (default: the joint's own side).
   */
  | { kind: 'joint'; position: Vec3; pieceIds: string[]; view?: JointView; frame?: number }

type Vec3 = [number, number, number]

export type JointView = 'front' | 'back' | 'side' | 'top' | 'below'

/** A pin on the model (a bony landmark). */
export interface Marker {
  id: string
  /** Piece it sits on: sizes the pin relative to the bone. */
  pieceId: string
  position: Vec3
  normal: Vec3
  look: 'normal' | 'active' | 'correct' | 'wrong'
  /** Openings (foramina…) are drawn as rings around the void instead of dots. */
  opening?: boolean
}

export interface SkeletonStageProps {
  lookOf: (piece: BonePiece, hoveredId: string | null) => PieceLook
  isPickable?: (piece: BonePiece) => boolean
  focus: Focus
  onPick?: (id: string | null) => void
  onHoverChange?: (id: string | null) => void
  markers?: Marker[]
  onMarkerHover?: (id: string | null) => void
  onMarkerPick?: (id: string) => void
  /**
   * Called with the clicked point on a pickable piece, in model space.
   * Lets a parent test "click near this landmark" without pins.
   */
  onSurfacePick?: (pieceId: string, point: Vec3) => void
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

/** Anatomical views for joints; 'side' looks from the joint's own side of the body. */
function jointViewDirection(view: JointView | undefined, center: THREE.Vector3, bodyAxis: THREE.Vector3): THREE.Vector3 {
  const lateral = Math.sign(center.x - bodyAxis.x) || 1
  switch (view) {
    case 'front':
      return FRONT.clone()
    case 'back':
      return new THREE.Vector3(0, 0.1, -1).normalize()
    case 'side':
      return new THREE.Vector3(lateral, 0.1, 0.25).normalize()
    // Never straight up or down: the camera's up vector is +Y.
    case 'top':
      return new THREE.Vector3(0, 1, 0.3).normalize()
    case 'below':
      return new THREE.Vector3(0, -1, 0.3).normalize()
    default:
      return viewDirectionFor(center, bodyAxis)
  }
}

const FLIGHT_SECONDS = 0.7
/** Breathing room around whatever is framed (1 = touching the edges). */
const FRAME_MARGIN = 1.12
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
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      // Fit the box's height to the vertical FOV and its widest horizontal side to the
      // horizontal FOV (a tall skeleton in a wide canvas is height-bound), then step back
      // half the depth so the near face isn't clipped.
      const vHalf = THREE.MathUtils.degToRad(camera.fov) / 2
      const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect)
      const horizontal = Math.max(size.x, size.z)
      const fit = Math.max(size.y / 2 / Math.tan(vHalf), horizontal / 2 / Math.tan(hHalf))
      const distance = fit * FRAME_MARGIN + horizontal / 2
      flight.current = {
        fromPos: camera.position.clone(),
        fromTarget: controls?.target.clone() ?? center.clone(),
        toPos: center.clone().addScaledVector(direction, distance),
        toTarget: center,
        t: 0,
      }
      invalidate()
    },
    [camera, controls, invalidate],
  )
}

const MARKER_COLORS: Record<Marker['look'], string> = {
  normal: '#e0a526',
  active: '#fff6dc',
  correct: '#8fbf5a',
  wrong: '#d4452c',
}

const Z_AXIS = new THREE.Vector3(0, 0, 1)

/** Pin radius on screen, in CSS pixels, whatever the zoom. */
const MARKER_PX = 5

/**
 * Landmark pins. Unit-sized geometry scaled every frame to a constant size on screen, so
 * they read as well on the whole skeleton as in a close-up of an ossicle.
 */
function Markers({
  markers,
  onHover,
  onPick,
}: {
  markers: Marker[]
  onHover?: (id: string | null) => void
  onPick?: (id: string) => void
}) {
  const invalidate = useThree((s) => s.invalidate)
  const group = useRef<THREE.Group>(null)
  useEffect(() => invalidate(), [markers, invalidate])

  useFrame(({ camera, size }) => {
    const cam = camera as THREE.PerspectiveCamera
    const perPixel = (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)) / size.height
    for (const child of group.current?.children ?? []) {
      const factor = (child.userData.scale as number) ?? 1
      child.scale.setScalar(cam.position.distanceTo(child.position) * perPixel * MARKER_PX * factor)
    }
  })

  return (
    <group ref={group}>
      {markers.map((m) => {
        const color = MARKER_COLORS[m.look]
        const common = {
          position: m.position,
          renderOrder: 2,
          userData: { scale: m.look === 'active' ? 1.6 : 1 },
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            onHover?.(m.id)
          },
          onPointerOut: () => onHover?.(null),
          onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            if (e.delta <= 4) onPick?.(m.id)
          },
        }
        if (m.opening) {
          // A ring facing outwards along the normal, around the hole.
          const q = new THREE.Quaternion().setFromUnitVectors(Z_AXIS, new THREE.Vector3(...m.normal).normalize())
          return (
            <mesh key={m.id} quaternion={q} {...common}>
              <torusGeometry args={[1.8, 0.45, 8, 24]} />
              <meshBasicMaterial color={color} />
            </mesh>
          )
        }
        return (
          <mesh key={m.id} {...common}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
        )
      })}
    </group>
  )
}

function SkeletonModel({
  lookOf,
  isPickable = defaultPickable,
  focus,
  onPick,
  hoveredId,
  setHoveredId,
  markers,
  onMarkerHover,
  onMarkerPick,
  onSurfacePick,
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
  const canvasWidth = useThree((s) => s.size.width)
  const canvasHeight = useThree((s) => s.size.height)
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
      mesh.visible = look !== 'hidden'
      if (look === 'hidden') continue
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
    } else if (focus.kind === 'point') {
      const center = new THREE.Vector3(...focus.position)
      // Frame a neighbourhood proportional to the bone: a hand's width around a femoral
      // landmark, a few millimetres around an ossicle's.
      const mesh = meshes.get(focus.pieceId)
      const boneSize = mesh ? new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3()).length() : 0.2
      const side = THREE.MathUtils.clamp(boneSize * 0.35, 0.015, 0.12)
      box.setFromCenterAndSize(center, new THREE.Vector3(side, side, side))
      // Look along the surface normal, nudged outwards from the body and slightly from above:
      // normals on borders and edges can point sideways, the nudge keeps the view readable.
      const outward = viewDirectionFor(center, bodyAxis)
      direction = new THREE.Vector3(...focus.normal).normalize().addScaledVector(outward, 0.35)
      direction.y += 0.15
      direction.normalize()
    } else if (focus.kind === 'joint') {
      const center = new THREE.Vector3(...focus.position)
      const largest = (id: string) => {
        const mesh = meshes.get(id)
        const size = mesh ? new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3()) : undefined
        return size ? Math.max(size.x, size.y, size.z) : Infinity
      }
      // The smallest bone sets the scale: a hip shows the whole acetabulum, a finger joint two phalanges.
      const smallest = Math.min(...focus.pieceIds.map(largest))
      const side = focus.frame ?? THREE.MathUtils.clamp(Number.isFinite(smallest) ? smallest * 1.1 : 0.15, 0.06, 0.3)
      box.setFromCenterAndSize(center, new THREE.Vector3(side, side, side))
      direction = jointViewDirection(focus.view, center, bodyAxis)
    } else if (focus.kind === 'region' || focus.kind === 'group') {
      for (const [id, mesh] of meshes) {
        const piece = pieceById.get(id)!
        const inFocus = focus.kind === 'region' ? regionOf(piece).id === focus.region : piece.group === focus.group
        if (inFocus) box.expandByObject(mesh)
      }
      // Tiny groups (ossicles) still get a frame wide enough to show where they sit.
      const minSide = 0.12
      const size = box.getSize(new THREE.Vector3()).max(new THREE.Vector3(minSide, minSide, minSide))
      box.setFromCenterAndSize(box.getCenter(new THREE.Vector3()), size)
    } else {
      box.setFromObject(scene)
    }
    flyTo(box, direction)
    // Re-frame when the canvas is resized (e.g. entering fullscreen).
  }, [focus, meshes, scene, bodyAxis, flyTo, canvasWidth, canvasHeight])

  // Nearest pickable piece under the pointer. Faded, ghosted or hidden pieces let the
  // ray through (raycasting ignores `visible`, so hidden ones must be skipped here).
  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation()
    const hit = e.intersections.find(({ object }) => {
      const piece = pieceById.get(object.name)
      return piece && object.visible && isPickable(piece)
    })
    return hit?.object.name ?? null
  }

  return (
    <>
      <primitive
        object={scene}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => setHoveredId(pick(e))}
        onPointerLeave={() => setHoveredId(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          // Ignore clicks that were really the end of an orbit drag.
          if (e.delta > 4) return
          e.stopPropagation()
          const hit = e.intersections.find(({ object }) => {
            const piece = pieceById.get(object.name)
            return piece && object.visible && isPickable(piece)
          })
          const id = hit?.object.name ?? null
          onPick?.(id)
          if (hit && id) onSurfacePick?.(id, hit.point.toArray() as Vec3)
        }}
      />
      {markers && markers.length > 0 && (
        <Markers markers={markers} onHover={onMarkerHover} onPick={onMarkerPick} />
      )}
    </>
  )
}

/** Canvas + lights + the skeleton model + camera framing. Shared by the viewer and the quiz. */
export function SkeletonStage({ children, className, onHoverChange, onPick, ...modelProps }: SkeletonStageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => onHoverChange?.(hoveredId), [hoveredId, onHoverChange])

  return (
    <div className={`${styles.stage} ${className ?? ''}`} data-stage>
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
          {/* BVH-accelerated raycasting: hover/click test a few hundred triangles instead of
              all ~650k. Not first-hit-only: picking needs to see through ghosted pieces. */}
          <Bvh firstHitOnly={false}>
            <SkeletonModel {...modelProps} onPick={onPick} hoveredId={hoveredId} setHoveredId={setHoveredId} />
          </Bvh>
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
