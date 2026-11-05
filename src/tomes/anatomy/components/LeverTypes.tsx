import { useCallback, useMemo, useState } from 'react'
import { landmarkById } from '../data/landmarks'
import { levers, roleLetter, roleName, type Lever, type LeverPointRole } from '../data/levers'
import type { BonePiece } from '../data/skeleton'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { SkeletonStage, StageTag, type Focus, type Marker, type PieceLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './LeverTypes.module.css'

/** Marker looks double as the colour code: gold fulcrum, green effort, red load. */
const markerLook: Record<LeverPointRole, Marker['look']> = { fulcrum: 'normal', effort: 'correct', load: 'wrong' }

/** Frame the three points with room around them. */
function focusOn(lever: Lever): Focus {
  const positions = lever.points.map((p) => landmarkById.get(p.landmark)!.position)
  const center = positions.reduce((c, p) => c.map((v, i) => v + p[i] / positions.length) as typeof p, [0, 0, 0] as typeof positions[0])
  const spread = Math.max(...positions.map((p) => Math.hypot(p[0] - center[0], p[1] - center[1], p[2] - center[2])))
  return { kind: 'joint', position: center, pieceIds: lever.pieces, view: lever.view, frame: Math.max(spread * 2.6, 0.12) }
}

/** Lámina: the three kinds of lever, each on the skeleton with its fulcrum, effort and load. */
export function LeverTypes() {
  const [leverId, setLeverId] = useState(levers[0].id)
  const fullscreen = useFullscreen<HTMLElement>()
  const lever = levers.find((l) => l.id === leverId)!
  const focus = useMemo(() => focusOn(lever), [lever])

  const markers = useMemo<Marker[]>(
    () =>
      lever.points.map((p) => {
        const l = landmarkById.get(p.landmark)!
        return { id: p.landmark, pieceId: l.pieceId, position: l.position, normal: l.normal, look: markerLook[p.role], size: 2.4, onTop: true }
      }),
    [lever],
  )

  const lookOf = useCallback(
    // A light tint on the lever's bones; everything else steps back.
    (p: BonePiece): PieceLook => (lever.pieces.includes(p.id) ? 'hover' : 'ghost'),
    [lever],
  )

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>Lámina I · Las tres palancas del cuerpo</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={styles.tabs} role="tablist" aria-label="Géneros de palanca">
        {levers.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === lever.id}
            className={styles.tab}
            data-active={l.id === lever.id}
            onClick={() => setLeverId(l.id)}
          >
            <span className={styles.tabName}>{l.name}</span>
            <span className={styles.tabAka}>{l.aka}</span>
          </button>
        ))}
      </div>

      <div className={styles.schema}>
        <LeverSchema order={lever.order} />
        <p className={styles.description}>{lever.description}</p>
      </div>

      <SkeletonStage lookOf={lookOf} isPickable={() => false} focus={focus} markers={markers}>
        <StageTag>{lever.name}</StageTag>
      </SkeletonStage>

      <div className={plate.legend} aria-live="polite">
        <p className={styles.example}>{lever.example}</p>
        <ul className={styles.points}>
          {lever.order.map((role) => {
            const point = lever.points.find((p) => p.role === role)!
            return (
              <li key={role}>
                <span className={styles.dot} data-role={role} aria-hidden />
                <span className={styles.pointRole}>
                  {roleName[role]} <span className={styles.letter}>({roleLetter[role]})</span>
                </span>
                <span>{point.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </figure>
  )
}

/** The lever as in Testut's fig. 743: a bar, the fulcrum as a wedge, effort up and load down. */
function LeverSchema({ order }: { order: Lever['order'] }) {
  const x = (role: LeverPointRole) => 40 + order.indexOf(role) * 120
  return (
    <svg viewBox="0 0 320 96" className={styles.svg} role="img" aria-label={`Orden: ${order.map((r) => roleName[r]).join(', ')}`}>
      <line x1="20" y1="48" x2="300" y2="48" className={styles.bar} />
      <path d={`M${x('fulcrum')} 50 l-11 18 h22 z`} className={styles.fulcrum} />
      <path d={`M${x('effort')} 46 V14 m-6 9 l6 -9 l6 9`} className={styles.effort} />
      <path d={`M${x('load')} 50 V82 m-6 -9 l6 9 l6 -9`} className={styles.load} />
      {(['fulcrum', 'effort', 'load'] as const).map((role) => (
        <text key={role} x={x(role) + 9} y={role === 'effort' ? 22 : role === 'load' ? 80 : 92} className={styles.schemaLetter}>
          {roleLetter[role]}
        </text>
      ))}
    </svg>
  )
}
