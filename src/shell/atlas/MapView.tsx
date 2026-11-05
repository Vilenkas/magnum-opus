import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { focusLayout, type MapPoint } from './layout'
import { trailOf, type Atlas, type AtlasNode } from './model'
import { statusText, TomeBanner, Trail } from './parts'

// Wide enough that the centre's title never reaches the first ring.
const RING = 150
/** The outer ring: far enough that first-ring labels fit between the two. */
const OUTER = 345
/** Room around the outer ring for its radial labels. */
const MARGIN = 250
const HALF = OUTER + MARGIN
const TWEEN_MS = 650

const GOLD = 'var(--color-gold)'
const GOLD_DIM = 'var(--color-gold-dim)'
const LINE = 'var(--color-line-strong)'
const FAINT = 'var(--color-faint)'
const INK = 'var(--color-ink)'

const CENTER_KEY = '·center·'

type Pos = { x: number; y: number }
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Moves every keyed point from where it was drawn to its new target. Points that were not
 * on screen start from `seed` (their parent's old place) and fade in. Returns positions and
 * opacities for the current frame.
 */
function useTween(targets: Map<string, Pos>, seed: (key: string) => Pos) {
  const shown = useRef(new Map<string, Pos>())
  const [frame, setFrame] = useState<{ pos: Map<string, Pos>; opacity: Map<string, number> }>(() => ({
    pos: targets,
    opacity: new Map([...targets.keys()].map((k) => [k, 1])),
  }))

  useEffect(() => {
    const from = new Map<string, Pos>()
    const entering = new Set<string>()
    for (const key of targets.keys()) {
      const old = shown.current.get(key)
      if (old) from.set(key, old)
      else {
        from.set(key, seed(key))
        entering.add(key)
      }
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - start) / TWEEN_MS)
      const k = easeInOut(t)
      const pos = new Map<string, Pos>()
      const opacity = new Map<string, number>()
      for (const [key, to] of targets) {
        const a = from.get(key)!
        pos.set(key, { x: a.x + (to.x - a.x) * k, y: a.y + (to.y - a.y) * k })
        opacity.set(key, entering.has(key) ? k : 1)
      }
      shown.current = pos
      setFrame({ pos, opacity })
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // `seed` reads the frame on screen through a ref: only new targets restart the tween.
  }, [targets])

  return frame
}

/**
 * The map as a progressive constellation: the focused area at the centre, its children and
 * grandchildren around it. Clicking a branch re-centres on it; the centre goes back up.
 * The focus lives in the URL (?area=), so the browser's back button walks back too.
 */
export function MapView({ atlas, area }: { atlas: Atlas; area?: string }) {
  const navigate = useNavigate()
  const focus = area ? atlas.byPath.get(area) : undefined
  const children = focus ? focus.children : atlas.roots
  const points = useMemo(() => focusLayout(children, RING, OUTER), [children])
  const firstTome = atlas.tomes[0] && atlas.homeOf.get(atlas.tomes[0].id)
  const [selected, setSelected] = useState<AtlasNode | undefined>(focus ?? firstTome)

  useEffect(() => setSelected(focus ?? firstTome), [focus, firstTome])

  const centerKey = focus?.path ?? CENTER_KEY
  const targets = useMemo(() => {
    const map = new Map<string, Pos>([[centerKey, { x: 0, y: 0 }]])
    for (const p of points) map.set(p.node.path, { x: p.x, y: p.y })
    return map
  }, [points, centerKey])

  const parentOf = useMemo(() => new Map(points.map((p) => [p.node.path, p.parent?.node.path ?? centerKey])), [points, centerKey])
  const { pos, opacity } = useTween(targets, (key) => {
    // New points grow out of their parent, wherever it was drawn; else from the centre.
    const parent = parentOf.get(key)
    return (parent ? frameRef.current.get(parent) : undefined) ?? { x: 0, y: 0 }
  })
  const frameRef = useRef(pos)
  frameRef.current = pos

  const goTo = (node?: AtlasNode) => navigate({ to: '/', search: node ? { view: 'map', area: node.path } : { view: 'map' } })

  const activate = (node: AtlasNode) => {
    setSelected(node)
    if (node.children.length) goTo(node)
  }

  const at = (key: string) => pos.get(key) ?? targets.get(key)!

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-8">
      <nav aria-label="Ruta en el mapa" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <button type="button" onClick={() => goTo()} className={focus ? 'text-muted hover:text-gold' : 'text-gold'}>
          Biblioteca
        </button>
        {focus &&
          trailOf(focus).map((n) => (
            <span key={n.path} className="flex items-center gap-2">
              <span className="text-faint" aria-hidden="true">
                ›
              </span>
              <button type="button" onClick={() => goTo(n)} className={n === focus ? 'text-gold' : 'text-muted hover:text-gold'}>
                {n.title}
              </button>
            </span>
          ))}
      </nav>

      <div className="overflow-x-auto rounded-sm border border-line bg-ink-sunken">
        <svg
          viewBox={`${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`}
          className="mx-auto block w-full max-w-[60rem] min-w-[40rem] select-none"
          role="group"
          aria-label="Mapa del saber"
        >
          {points.map((p) => {
            const from = at(p.parent?.node.path ?? centerKey)
            const to = at(p.node.path)
            return <Edge key={`e-${p.node.path}`} node={p.node} from={from} to={to} opacity={opacity.get(p.node.path) ?? 1} />
          })}

          <Center
            focus={focus}
            pos={at(centerKey)}
            onUp={() => (focus ? goTo(focus.parent) : undefined)}
            selected={selected === focus && !!focus}
          />

          {points.map((p) => (
            <Node
              key={p.node.path}
              point={p}
              pos={at(p.node.path)}
              opacity={opacity.get(p.node.path) ?? 1}
              selected={p.node === selected}
              onActivate={() => activate(p.node)}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-stretch gap-6">
        <div className="min-w-0 flex-[999_1_35rem]">{selected && <Selection atlas={atlas} node={selected} />}</div>
        <ul className="flex flex-[1_1_15rem] flex-col justify-center gap-2.5 rounded-sm border border-line px-5 py-4 text-sm text-muted">
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="size-3 rounded-full bg-gold shadow-[0_0_10px_var(--color-gold)]" />
            Tomo escrito
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2.5 rounded-full border border-gold" />
            Camino hacia un tomo
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 rounded-full bg-gold-dim" />
            Cubierto por un tomo
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 rounded-full border border-faint" />
            Por escribir
          </li>
          <li className="flex items-center gap-3 text-xs">
            <span aria-hidden="true" className="font-semibold text-gold">
              +N
            </span>
            Áreas por debajo: pulsa para desplegarlas
          </li>
        </ul>
      </div>
    </main>
  )
}

const lit = (node: AtlasNode) => node.status === 'tome' || node.status === 'path'

function Edge({ node, from, to, opacity }: { node: AtlasNode; from: Pos; to: Pos; opacity: number }) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={lit(node) || node.status === 'covered' ? GOLD_DIM : LINE}
      strokeOpacity={(node.status === 'covered' ? 0.5 : 1) * opacity}
      strokeWidth={lit(node) ? 1.6 : 1}
    />
  )
}

const onEnter = (action: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    action()
  }
}

/** The focused area (or the whole library) at the centre; clicking it goes one level up. */
function Center({ focus, pos, onUp, selected }: { focus?: AtlasNode; pos: Pos; onUp: () => void; selected: boolean }) {
  const title = focus ? focus.tomes.map((t) => t.title).join(' · ') || focus.title : 'Biblioteca'
  const isTome = focus?.status === 'tome'
  return (
    <g
      role={focus ? 'button' : undefined}
      tabIndex={focus ? 0 : undefined}
      aria-label={focus ? `${focus.title}: subir un nivel` : 'Biblioteca'}
      onClick={focus ? onUp : undefined}
      onKeyDown={focus ? onEnter(onUp) : undefined}
      className={focus ? 'cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-parchment' : ''}
    >
      {focus && <title>{`${focus.title} · pulsa para subir un nivel`}</title>}
      <circle cx={pos.x} cy={pos.y} r={30} fill={INK} stroke={selected ? 'var(--color-parchment)' : GOLD} strokeWidth={1.4} />
      {isTome && <circle cx={pos.x} cy={pos.y} r={30} fill={GOLD} fillOpacity={0.15} />}
      <circle cx={pos.x} cy={pos.y} r={isTome ? 11 : 8} fill={GOLD} />
      <text
        x={pos.x}
        y={pos.y + 52}
        textAnchor="middle"
        fill={GOLD}
        fontFamily="var(--font-display)"
        fontSize={22}
        fontWeight={700}
        stroke={INK}
        strokeWidth={6}
        paintOrder="stroke"
      >
        {title}
      </text>
      {focus && (
        <text x={pos.x} y={pos.y + 72} textAnchor="middle" fill="var(--color-muted)" fontSize={12} letterSpacing="0.15em">
          ↑ SUBIR
        </text>
      )}
    </g>
  )
}

function Node({
  point,
  pos,
  opacity,
  selected,
  onActivate,
}: {
  point: MapPoint
  pos: Pos
  opacity: number
  selected: boolean
  onActivate: () => void
}) {
  const { node, angle, ring, hidden } = point
  const { x, y } = pos

  const branch = ring === 1 && node.children.length > 0
  const dotRadius = node.status === 'tome' ? 9 : ring === 1 && node.children.length ? 7 : lit(node) ? 5.5 : 4
  const labelColor = node.status === 'tome' ? GOLD : lit(node) || node.status === 'covered' ? 'var(--color-parchment)' : 'var(--color-muted)'
  const labelFont = node.status === 'tome' || branch ? 'var(--font-display)' : 'var(--font-sans)'
  const labelSize = node.status === 'tome' ? 19 : branch ? 16 : 14
  const title = node.status === 'tome' ? node.tomes.map((t) => t.title).join(' · ') : node.title
  const more = hidden > 0 ? `+${hidden}` : ''
  // Branches of the first ring keep a centred label; leaves (and the outer ring) read along
  // their ray, which stays clear because nothing grows beyond a leaf.
  const radialLabel = ring === 2 || !node.children.length

  // The outer ring reads outward along its ray, flipped on the left half so text is never upside down.
  const degrees = (angle * 180) / Math.PI
  const flip = Math.cos(angle) < 0
  const r = Math.hypot(x, y) + 16
  const lx = Math.cos(angle) * r
  const ly = Math.sin(angle) * r
  const radial = {
    x: lx,
    y: ly,
    transform: `rotate(${flip ? degrees + 180 : degrees} ${lx} ${ly})`,
    textAnchor: flip ? ('end' as const) : ('start' as const),
    dominantBaseline: 'middle' as const,
  }
  // First-ring branches: a level label set off away from the centre, so it never reaches
  // the centre's title (right of a node on the right, above one at the top…).
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  const off = dotRadius + 10
  const below = {
    x: x + ux * off,
    y: y + uy * off + (uy > 0.35 ? labelSize * 0.8 : uy < -0.35 ? -4 : labelSize * 0.35),
    textAnchor: Math.abs(ux) < 0.35 ? ('middle' as const) : ux > 0 ? ('start' as const) : ('end' as const),
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${node.title}: ${statusText(node)}${node.children.length ? ', desplegar' : ''}`}
      aria-pressed={selected}
      onClick={onActivate}
      onKeyDown={onEnter(onActivate)}
      opacity={opacity}
      className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-parchment"
    >
      <title>{`${node.title} · ${statusText(node)}${node.children.length ? ' · pulsa para desplegar' : ''}`}</title>
      <circle cx={x} cy={y} r={16} fill="transparent" stroke={selected ? 'var(--color-parchment)' : 'transparent'} strokeWidth={1.5} />
      {node.status === 'tome' && <circle cx={x} cy={y} r={16} fill={GOLD} fillOpacity={0.18} />}
      <circle
        cx={x}
        cy={y}
        r={dotRadius}
        fill={node.status === 'tome' ? GOLD : node.status === 'covered' ? GOLD_DIM : INK}
        stroke={node.status === 'tome' || node.status === 'covered' ? 'none' : lit(node) ? GOLD : FAINT}
        strokeWidth={ring === 1 ? 2 : 1.2}
      />
      <text
        {...(radialLabel ? radial : below)}
        fill={labelColor}
        fontFamily={labelFont}
        fontSize={labelSize}
        fontWeight={node.status === 'tome' ? 700 : 400}
        stroke={INK}
        strokeWidth={5}
        paintOrder="stroke"
      >
        {flip && more && <tspan fill={GOLD} fontSize={12} fontWeight={600}>{`${more}  `}</tspan>}
        {title}
        {!flip && more && <tspan fill={GOLD} fontSize={12} fontWeight={600}>{`  ${more}`}</tspan>}
      </text>
    </g>
  )
}

function Selection({ atlas, node }: { atlas: Atlas; node: AtlasNode }) {
  if (node.tomes.length)
    return (
      <div className="flex flex-col gap-3">
        {node.tomes.map((tome) => (
          <TomeBanner key={tome.id} tome={tome} node={node} />
        ))}
      </div>
    )
  return (
    <div className="flex h-full flex-wrap items-center justify-between gap-4 rounded-sm border border-line-strong bg-ink-raised px-6 py-5">
      <div className="flex flex-col gap-1">
        <Trail node={node} />
        <p className="font-display text-2xl text-parchment">{node.title}</p>
        <p className="text-sm text-muted">{statusText(node)}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {node.coveredBy && (
          <Link
            to="/tomes/$tomeId"
            params={{ tomeId: node.coveredBy.id }}
            className="inline-flex h-11 items-center rounded bg-gold px-5 text-sm font-semibold text-ink"
          >
            Abrir {atlas.homeOf.get(node.coveredBy.id)?.title ?? node.coveredBy.title}
          </Link>
        )}
        <Link
          to="/"
          search={{ view: 'index', area: node.path }}
          className="inline-flex h-11 items-center rounded border border-gold-dim px-5 text-sm text-gold hover:border-gold"
        >
          Ver en el índice
        </Link>
      </div>
    </div>
  )
}
