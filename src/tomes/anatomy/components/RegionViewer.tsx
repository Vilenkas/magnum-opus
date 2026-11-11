import { useCallback, useMemo, useState } from 'react'
import musclesUrl from '../assets/muscles.glb?url'
import jointsUrl from '../assets/joints.glb?url'
import vesselsUrl from '../assets/vessels.glb?url'
import nervousUrl from '../assets/nervous.glb?url'
import nervous from '../assets/nervous.json'
import vessels from '../assets/vessels.json'
import { PLEXUSES, outcome, signsOf } from '../data/plexuses'
import { REGIONS, type ContentKind, type Region } from '../data/regions'
import { pieceById, type BonePiece } from '../data/skeleton'
import { softById, softEntries } from '../data/soft-tissues'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { SkeletonStage, StageTag, type PieceLook, type TissueLayer, type TissueLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './RegionViewer.module.css'

type Node = { id: string; en: string; side: string | null; es?: string | null }
const SIDE = 'right'

/** Ids of the right-side (or unpaired) nodes with these names, in a list of model nodes. */
const idsOf = (nodes: Node[], names: string[]) => {
  const wanted = new Set(names)
  return nodes.filter((n) => wanted.has(n.en) && (!n.side || n.side === SIDE)).map((n) => n.id)
}
const muscleNodes = softEntries.filter((e) => e.set === 'muscles') as Node[]
const jointNodes = softEntries.filter((e) => e.set === 'joints') as Node[]
const boneId = (b: string) => (pieceById.has(`${b}-r`) ? `${b}-r` : b)
const nameOf = new Map<string, string>(
  [...softEntries, ...(vessels as Node[]), ...(nervous as Node[])].map((e) => [e.id, (e as Node).es ?? e.en]),
)
for (const p of pieceById.values()) nameOf.set(p.id, p.name)

interface Resolved {
  walls: Set<string>
  bones: Set<string>
  contents: Map<string, ContentKind>
  /** Each list item's ids, to highlight it on hover. */
  items: Map<string, string[]>
  /** What the camera frames. */
  frame: string[]
}

function resolve(region: Region): Resolved {
  const walls = new Set<string>()
  const bones = new Set<string>()
  const contents = new Map<string, ContentKind>()
  const items = new Map<string, string[]>()
  region.walls.forEach((w, i) =>
    w.parts.forEach((part, j) => {
      const ids = [...idsOf(muscleNodes, part.muscles ?? []), ...idsOf(jointNodes, part.joints ?? [])]
      const b = (part.bones ?? []).map(boneId)
      ids.forEach((id) => walls.add(id))
      b.forEach((id) => bones.add(id))
      items.set(`w${i}-${j}`, [...ids, ...b])
    }),
  )
  region.contents.forEach((c, i) => {
    const pool = c.kind === 'nerve' ? (nervous as Node[]) : c.kind === 'tendon' ? muscleNodes : (vessels as Node[])
    const ids = idsOf(pool, c.names)
    ids.forEach((id) => contents.set(id, c.kind))
    items.set(`c${i}`, ids)
  })
  const frame = region.frame
    ? [...idsOf(muscleNodes, region.frame), ...region.frame.filter((f) => pieceById.has(boneId(f))).map(boneId)]
    : [...walls, ...bones].filter((id) => softById.get(id)?.kind !== 'fascia')
  return { walls, bones, contents, items, frame }
}

const KIND_LOOK: Record<ContentKind, TissueLook> = { artery: 'artery', vein: 'vein', nerve: 'nerve', tendon: 'tendon' }
const KIND_ES: Record<ContentKind, string> = { artery: 'arteria', vein: 'vena', nerve: 'nervio', tendon: 'tendón' }

/** Lámina IV of Miología: the regions the muscles bound, their walls and what runs through them. */
export function RegionViewer() {
  const [key, setKey] = useState(REGIONS[0].key)
  const [hoverItem, setHoverItem] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [compressed, setCompressed] = useState(false)
  const fullscreen = useFullscreen<HTMLElement>()
  const region = REGIONS.find((r) => r.key === key)!
  const res = useMemo(() => resolve(region), [region])
  const lit = useMemo(() => new Set(hoverItem ? (res.items.get(hoverItem) ?? []) : []), [hoverItem, res])
  const needsJoints = region.walls.some((w) => w.parts.some((p) => p.joints?.length))
  const focus = useMemo(
    () => ({ kind: 'nodes' as const, ids: res.frame, view: region.view }),
    [res, region],
  )

  const boneLook = useCallback(
    (p: BonePiece): PieceLook => (lit.has(p.id) ? 'selected' : res.bones.has(p.id) ? 'base' : 'ghost'),
    [lit, res],
  )

  const layers = useMemo<TissueLayer[]>(() => {
    const look = (id: string, base: TissueLook | null): TissueLook => (base === null ? 'hidden' : lit.has(id) ? 'selected' : id === hoveredId ? 'hover' : base)
    const list: TissueLayer[] = [
      {
        id: 'muscles',
        url: musclesUrl,
        lookOf: (id) => {
          const e = softById.get(id)
          if (res.contents.has(id)) return look(id, 'tendon')
          if (!res.walls.has(id) || !e) return 'hidden'
          return look(id, e.kind === 'fascia' ? 'fascia' : e.part === 'tendon' ? 'tendon' : 'muscle')
        },
        isPickable: (id) => res.walls.has(id) || res.contents.has(id),
      },
      { id: 'vessels', url: vesselsUrl, lookOf: (id) => look(id, res.contents.has(id) ? KIND_LOOK[res.contents.get(id)!] : null), isPickable: (id) => res.contents.has(id) },
      { id: 'nervous', url: nervousUrl, lookOf: (id) => look(id, res.contents.has(id) ? 'nerve' : null), isPickable: (id) => res.contents.has(id) },
    ]
    if (needsJoints) list.push({ id: 'joints', url: jointsUrl, lookOf: (id) => look(id, res.walls.has(id) ? 'ligament' : null) })
    return list
  }, [res, lit, hoveredId, needsJoints])

  const lesion = useMemo(() => {
    if (!compressed || !region.compression) return null
    const p = PLEXUSES[region.compression.plexus]
    const l = p.lesions.find((x) => x.id === region.compression!.lesion)!
    const o = outcome(p, l)
    const names = (m: Map<string, string>, status: string, list: { id: string; name: string }[]) =>
      list.filter((x) => m.get(x.id) === status).map((x) => x.name)
    return {
      name: l.name,
      lost: names(o.muscles, 'lost', p.muscles),
      weak: names(o.muscles, 'weak', p.muscles),
      skin: names(o.skin, 'lost', p.skin),
      signs: signsOf(p, o).map((s) => s.name),
    }
  }, [compressed, region])

  const choose = (k: string) => {
    setKey(k)
    setCompressed(false)
    setHoverItem(null)
  }

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>Lámina IV · Las regiones que limitan los músculos</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}
      <div className={plate.chipBar} role="group" aria-label="Región">
        {REGIONS.map((r) => (
          <button key={r.key} className={plate.chip} data-active={r.key === key} aria-pressed={r.key === key} onClick={() => choose(r.key)}>
            {r.es}
          </button>
        ))}
      </div>

      <div className={styles.body} data-stage-body>
        <SkeletonStage lookOf={boneLook} isPickable={() => false} layers={layers} focus={focus} onHoverChange={setHoveredId}>
          {hoveredId && <StageTag>{nameOf.get(hoveredId) ?? hoveredId}</StageTag>}
        </SkeletonStage>

        <div className={styles.panel}>
          <p className={styles.note}>{region.note}</p>
          <h4 className={styles.heading}>Límites</h4>
          <dl className={styles.walls}>
            {region.walls.map((w, i) => (
              <div key={w.role}>
                <dt>{w.role}</dt>
                {w.parts.map((p, j) => (
                  <dd key={p.es} onMouseEnter={() => setHoverItem(`w${i}-${j}`)} onMouseLeave={() => setHoverItem(null)} data-lit={hoverItem === `w${i}-${j}`}>
                    {p.es}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          <h4 className={styles.heading}>Contenido</h4>
          <ul className={styles.contents}>
            {region.contents.map((c, i) => (
              <li
                key={c.es}
                data-kind={c.kind}
                data-lit={hoverItem === `c${i}`}
                onMouseEnter={() => setHoverItem(`c${i}`)}
                onMouseLeave={() => setHoverItem(null)}
                title={KIND_ES[c.kind]}
              >
                {c.es}
              </li>
            ))}
          </ul>
          {region.compression && (
            <div className={styles.compression}>
              <button className={plate.button} aria-pressed={compressed} data-active={compressed} onClick={() => setCompressed((v) => !v)}>
                {compressed ? 'Quitar la compresión' : 'Comprimir'}
              </button>
              <p className={styles.cause}>{region.compression.es}.</p>
              {lesion && (
                <div aria-live="polite">
                  <p className={plate.kicker}>{lesion.name}</p>
                  {lesion.lost.length > 0 && (
                    <p>
                      <strong>Paralizados:</strong> {lesion.lost.join(', ')}
                    </p>
                  )}
                  {lesion.weak.length > 0 && (
                    <p>
                      <strong>Débiles:</strong> {lesion.weak.join(', ')}
                    </p>
                  )}
                  {lesion.skin.length > 0 && (
                    <p>
                      <strong>Sin sensibilidad:</strong> {lesion.skin.join(', ')}
                    </p>
                  )}
                  {lesion.signs.length > 0 && <p className={styles.signs}>{lesion.signs.join(' · ')}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={plate.legend}>
        <p className={plate.hint}>
          Pasa el ratón por un límite o por una estructura para verla en el modelo; el lado derecho. Lo que se pierde al comprimir sale del mismo modelo de
          los plexos que las Láminas XXII y XXIII de Neurología. Según{' '}
          {region.sources.map((s) => `${s.fuente === 'moore-8' ? 'Moore 8.ª' : 'Latarjet y Ruiz Liard, t. 1'}, p. ${s.p}`).join('; ')}.
        </p>
      </div>
    </figure>
  )
}
