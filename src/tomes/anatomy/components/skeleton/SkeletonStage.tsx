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

/** How a node of a soft-tissue layer is painted. */
export type TissueLook =
  | 'muscle'
  | 'tendon'
  | 'fascia'
  | 'ligament'
  | 'capsule'
  | 'cartilage'
  | 'origin'
  | 'insertion'
  | 'artery'
  | 'vein'
  | 'heart'
  | 'valve'
  | 'node'
  | 'organ'
  // Nervous system: each lobe its own colour, as in the atlases.
  | 'frontal'
  | 'parietal'
  | 'temporal'
  | 'occipital'
  | 'limbic'
  | 'insula'
  | 'sulcus'
  | 'nucleus'
  | 'white'
  | 'tract'
  | 'csf'
  | 'cerebellum'
  | 'brainstem'
  | 'cord-white'
  | 'cord-grey'
  | 'nerve'
  | 'meninges'
  | 'sense'
  | 'hover'
  | 'selected'
  | 'ghost'
  | 'faded'
  | 'hidden'

/**
 * An extra model drawn over the skeleton, in its coordinates (muscles, joints, insertions).
 * Loaded on first mount, in its own Suspense, so the skeleton never waits for it.
 */
export interface TissueLayer {
  id: string
  url: string
  lookOf: (nodeId: string, hoveredId: string | null) => TissueLook
  isPickable?: (nodeId: string) => boolean
}

/** What the camera frames. Pass a new object to re-frame, even on the same target. */
export type Focus =
  | { kind: 'all' }
  /** Any node, of the skeleton or of a tissue layer. */
  | { kind: 'node'; id: string; context?: number }
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
  /** Several nodes of any model (a joint's ligaments), framed together from an anatomical view. */
  | { kind: 'nodes'; ids: string[]; view?: JointView }

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
  /** Size multiplier on screen (1 = landmark pin). */
  size?: number
  /** Drawn over the bones, never hidden behind them (points of a lever). */
  onTop?: boolean
}

export interface SkeletonStageProps {
  lookOf: (piece: BonePiece, hoveredId: string | null) => PieceLook
  /** Soft-tissue models over the skeleton. Ids are unique across bones and layers. */
  layers?: TissueLayer[]
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

/** Soft tissues: muscle red, pearly tendon; origins red and insertions blue, as in the atlases. */
function useTissueMaterials() {
  return useMemo(() => {
    const make = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0, ...extra })
    // Areas sit on the bone surface: pull them forward so they never z-fight with it.
    const onBone = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }
    const materials: Record<Exclude<TissueLook, 'hidden'>, THREE.Material> = {
      muscle: make('#a8473c', { roughness: 0.62 }),
      tendon: make('#ece4d0', { roughness: 0.45 }),
      fascia: make('#d8c7b4', { transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
      ligament: make('#d9cfae', { roughness: 0.5 }),
      capsule: make('#cfc6a8', { transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }),
      cartilage: make('#c9d3cf', { roughness: 0.5 }),
      origin: make('#c0392b', { roughness: 0.5, ...onBone }),
      insertion: make('#2f6ea5', { roughness: 0.5, ...onBone }),
      // Angiology: red arteries, blue veins and green lymph nodes, as in the atlases.
      artery: make('#b8322a', { roughness: 0.45 }),
      vein: make('#3b5a92', { roughness: 0.45 }),
      heart: make('#a8473c', { roughness: 0.55 }),
      valve: make('#efe3c8', { roughness: 0.45 }),
      node: make('#5fae3a', { roughness: 0.5, emissive: '#2f6a14', emissiveIntensity: 0.35 }),
      organ: make('#8c4a5a', { roughness: 0.6 }),
      frontal: make('#d69a7c', { roughness: 0.75 }),
      parietal: make('#d9c27e', { roughness: 0.75 }),
      temporal: make('#9fbb80', { roughness: 0.75 }),
      occipital: make('#8eaacb', { roughness: 0.75 }),
      limbic: make('#c49ab6', { roughness: 0.75 }),
      insula: make('#d8a65e', { roughness: 0.75 }),
      sulcus: make('#8a7462', { roughness: 0.8 }),
      nucleus: make('#b8655a', { roughness: 0.6 }),
      // The white matter is a mould around the deep nuclei: translucent, so they show through it.
      white: make('#efe6d2', { transparent: true, opacity: 0.22, depthWrite: false }),
      tract: make('#ece2cb', { roughness: 0.6 }),
      csf: make('#7db4cb', { roughness: 0.3, transparent: true, opacity: 0.8 }),
      cerebellum: make('#c39a8c', { roughness: 0.75 }),
      brainstem: make('#d2b393', { roughness: 0.7 }),
      'cord-white': make('#ebe0c9', { roughness: 0.7 }),
      'cord-grey': make('#a8988a', { roughness: 0.7 }),
      nerve: make('#e5c34f', { roughness: 0.5 }),
      meninges: make('#c9b39f', { transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }),
      sense: make('#a7bdd0', { roughness: 0.5 }),
      hover: make('#e9b9a0', { emissive: '#9c3b26', emissiveIntensity: 0.2 }),
      selected: make('#e0a526', { roughness: 0.5, emissive: '#6b4a08', emissiveIntensity: 0.25 }),
      ghost: make('#d9b8a8', { transparent: true, opacity: 0.18, depthWrite: false }),
      faded: make('#bfb39c', { transparent: true, opacity: 0.08, depthWrite: false }),
    }
    return materials
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
/**
 * Zoom limits, in metres from the target (the model is life-size). Close enough to read a tooth or an
 * ossicle, far enough to see the whole body with room around it; flights obey them too, so the
 * controls never jump when the reader takes over. Wheel and pinch zoom are slowed for laptops.
 */
export const MIN_DISTANCE = 0.06
export const MAX_DISTANCE = 3.5
const ZOOM_SPEED = 0.6

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
      const distance = THREE.MathUtils.clamp(fit * FRAME_MARGIN + horizontal / 2, MIN_DISTANCE, MAX_DISTANCE)
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
          renderOrder: m.onTop ? 3 : 2,
          userData: { scale: (m.look === 'active' ? 1.6 : 1) * (m.size ?? 1) },
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
              <meshBasicMaterial color={color} depthTest={!m.onTop} />
            </mesh>
          )
        }
        return (
          <mesh key={m.id} {...common}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color={color} depthTest={!m.onTop} />
          </mesh>
        )
      })}
    </group>
  )
}

function SkeletonModel({
  lookOf,
  isPickable = defaultPickable,
  layers,
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

  // Meshes of the tissue layers, by node id, filled in as each layer loads.
  const layerMeshes = useRef(new Map<string, { layer: string; mesh: THREE.Mesh }>())
  const [layersLoaded, setLayersLoaded] = useState(0)
  const register = useCallback((layer: string, nodes: Map<string, THREE.Mesh>) => {
    for (const [id, mesh] of nodes) layerMeshes.current.set(id, { layer, mesh })
    setLayersLoaded((n) => n + 1)
  }, [])

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
    const nodeMesh = focus.kind === 'node' ? (meshes.get(focus.id) ?? layerMeshes.current.get(focus.id)?.mesh) : undefined
    if (focus.kind === 'node' && nodeMesh) {
      box.setFromObject(nodeMesh)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const side = Math.max(size.x, size.y, size.z, 0.06) * (focus.context ?? 1.3)
      box.setFromCenterAndSize(center, new THREE.Vector3(side, side, side))
      direction = viewDirectionFor(center, bodyAxis)
    } else if (focus.kind === 'piece' && meshes.has(focus.id)) {
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
    } else if (focus.kind === 'nodes') {
      for (const id of focus.ids) {
        const mesh = meshes.get(id) ?? layerMeshes.current.get(id)?.mesh
        if (mesh) box.expandByObject(mesh)
      }
      if (box.isEmpty()) box.setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      // A finger's ligaments still get a frame wide enough to show the bones they join.
      const size = box.getSize(new THREE.Vector3()).max(new THREE.Vector3(0.07, 0.07, 0.07))
      box.setFromCenterAndSize(center, size)
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
    // layersLoaded: a node of a layer can only be framed once its model is in.
  }, [focus, meshes, scene, bodyAxis, flyTo, canvasWidth, canvasHeight, layersLoaded])

  // Nearest pickable piece under the pointer. Faded, ghosted or hidden pieces let the
  // ray through (raycasting ignores `visible`, so hidden ones must be skipped here).
  const pickable = (object: THREE.Object3D) => {
    if (!object.visible) return false
    const piece = pieceById.get(object.name)
    if (piece) return isPickable(piece)
    const node = layerMeshes.current.get(object.name)
    if (!node) return false
    const layer = layers?.find((l) => l.id === node.layer)
    return layer ? (layer.isPickable?.(object.name) ?? true) : false
  }
  const firstHit = (e: ThreeEvent<PointerEvent | MouseEvent>) => e.intersections.find(({ object }) => pickable(object))
  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation()
    return firstHit(e)?.object.name ?? null
  }

  return (
    <>
      {/* One handler for bones and tissues: the nearest visible, pickable node wins. */}
      <group
        onPointerMove={(e: ThreeEvent<PointerEvent>) => setHoveredId(pick(e))}
        onPointerLeave={() => setHoveredId(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          // Ignore clicks that were really the end of an orbit drag.
          if (e.delta > 4) return
          e.stopPropagation()
          const hit = firstHit(e)
          const id = hit?.object.name ?? null
          onPick?.(id)
          if (hit && id && pieceById.has(id)) onSurfacePick?.(id, hit.point.toArray() as Vec3)
        }}
      >
        <primitive object={scene} />
        {layers?.map((layer) => (
          // Each layer loads on its own and gets its own BVH once it is in.
          <Suspense key={layer.id} fallback={null}>
            <Bvh firstHitOnly={false}>
              <TissueLayerModel layer={layer} hoveredId={hoveredId} onLoad={register} />
            </Bvh>
          </Suspense>
        ))}
      </group>
      {markers && markers.length > 0 && (
        <Markers markers={markers} onHover={onMarkerHover} onPick={onMarkerPick} />
      )}
    </>
  )
}

function TissueLayerModel({
  layer,
  hoveredId,
  onLoad,
}: {
  layer: TissueLayer
  hoveredId: string | null
  onLoad: (layer: string, meshes: Map<string, THREE.Mesh>) => void
}) {
  const gltf = useGLTF(layer.url, false, true)
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const materials = useTissueMaterials()
  const invalidate = useThree((s) => s.invalidate)

  const meshes = useMemo(() => {
    const map = new Map<string, THREE.Mesh>()
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) map.set(o.name, o as THREE.Mesh)
    })
    return map
  }, [scene])

  useEffect(() => onLoad(layer.id, meshes), [layer.id, meshes, onLoad])

  useEffect(() => {
    for (const [id, mesh] of meshes) {
      const look = layer.lookOf(id, hoveredId)
      mesh.visible = look !== 'hidden'
      if (look === 'hidden') continue
      mesh.material = materials[look]
      // Translucent pieces draw after solids; areas on the bone after the bone.
      const translucent = look === 'ghost' || look === 'faded' || look === 'fascia' || look === 'capsule' || look === 'meninges' || look === 'csf' || look === 'white'
      mesh.renderOrder = translucent ? 2 : look === 'origin' || look === 'insertion' ? 1 : 0
    }
    invalidate()
  }, [meshes, materials, layer, hoveredId, invalidate])

  return <primitive object={scene} />
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
        <OrbitControls makeDefault enablePan enableDamping={false} minDistance={MIN_DISTANCE} maxDistance={MAX_DISTANCE} zoomSpeed={ZOOM_SPEED} />
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
