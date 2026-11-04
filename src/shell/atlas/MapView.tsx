import { useMemo, useState, type KeyboardEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { radialLayout, type MapPoint } from './layout'
import type { Atlas, AtlasNode } from './model'
import { statusText, TomeBanner, Trail } from './parts'

const RING = 115
/** Room around the outer ring for the leaf labels. */
const MARGIN = 160

const GOLD = 'var(--color-gold)'
const GOLD_DIM = 'var(--color-gold-dim)'
const LINE = 'var(--color-line-strong)'
const FAINT = 'var(--color-faint)'
const INK = 'var(--color-ink)'

/** The whole map as a radial tree: written tomes glow, the way to them is gilded. */
export function MapView({ atlas }: { atlas: Atlas }) {
  const { points, radius } = useMemo(() => radialLayout(atlas.roots, RING), [atlas])
  const firstTome = atlas.tomes[0] && atlas.homeOf.get(atlas.tomes[0].id)
  const [selected, setSelected] = useState<AtlasNode | undefined>(firstTome)
  const half = radius + MARGIN

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8">
      <div className="overflow-x-auto rounded-sm border border-line bg-ink-sunken">
        <svg
          viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
          className="mx-auto block w-full max-w-[56rem] min-w-[40rem] select-none"
          role="group"
          aria-label="Mapa del saber"
        >
          {points.map((p) => p.parent && <Edge key={`e-${p.node.path}`} point={p} />)}
          <circle r={18} fill={INK} stroke={GOLD} />
          <circle r={7} fill={GOLD} />
          {points.map((p) => (
            <Node
              key={p.node.path}
              point={p}
              radius={radius}
              selected={p.node === selected}
              onSelect={() => setSelected(p.node)}
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
        </ul>
      </div>
    </main>
  )
}

const lit = (node: AtlasNode) => node.status === 'tome' || node.status === 'path'

function Edge({ point }: { point: MapPoint }) {
  const from = point.parent ?? { x: 0, y: 0 }
  const { status } = point.node
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={point.x}
      y2={point.y}
      stroke={lit(point.node) ? GOLD_DIM : status === 'covered' ? GOLD_DIM : LINE}
      strokeOpacity={status === 'covered' ? 0.5 : 1}
      strokeWidth={lit(point.node) ? 1.6 : 1}
    />
  )
}

function Node({
  point,
  radius,
  selected,
  onSelect,
}: {
  point: MapPoint
  radius: number
  selected: boolean
  onSelect: () => void
}) {
  const { node, x, y, angle } = point
  const isLeaf = !node.children.length
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  const dotRadius = node.status === 'tome' ? 9 : node.depth === 1 ? 7 : lit(node) ? 5.5 : 4
  const labelColor = node.status === 'tome' ? GOLD : lit(node) || node.status === 'covered' ? 'var(--color-parchment)' : 'var(--color-muted)'
  const labelFont = node.status === 'tome' || node.depth === 1 ? 'var(--font-display)' : 'var(--font-sans)'
  const labelSize = node.status === 'tome' ? 22 : node.depth === 1 ? 20 : 15

  // Leaves read outward along their ray; flipped on the left half so text is never upside down.
  const degrees = (angle * 180) / Math.PI
  const flip = Math.cos(angle) < 0
  const leafLabel = {
    x: Math.cos(angle) * (radius + 16),
    y: Math.sin(angle) * (radius + 16),
    transform: `rotate(${flip ? degrees + 180 : degrees} ${Math.cos(angle) * (radius + 16)} ${Math.sin(angle) * (radius + 16)})`,
    textAnchor: flip ? ('end' as const) : ('start' as const),
    dominantBaseline: 'middle' as const,
  }
  const branchLabel = { x, y: y + dotRadius + labelSize + 2, textAnchor: 'middle' as const }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${node.title}: ${statusText(node)}`}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={onKey}
      className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-parchment"
    >
      <title>{`${node.title} · ${statusText(node)}`}</title>
      <circle cx={x} cy={y} r={16} fill="transparent" stroke={selected ? 'var(--color-parchment)' : 'transparent'} strokeWidth={1.5} />
      {node.status === 'tome' && <circle cx={x} cy={y} r={16} fill={GOLD} fillOpacity={0.18} />}
      <circle
        cx={x}
        cy={y}
        r={dotRadius}
        fill={node.status === 'tome' ? GOLD : node.status === 'covered' ? GOLD_DIM : INK}
        stroke={node.status === 'tome' || node.status === 'covered' ? 'none' : lit(node) ? GOLD : FAINT}
        strokeWidth={node.depth === 1 ? 2 : 1.2}
      />
      <text
        {...(isLeaf ? leafLabel : branchLabel)}
        fill={labelColor}
        fontFamily={labelFont}
        fontSize={labelSize}
        fontWeight={node.status === 'tome' ? 700 : 400}
        stroke={INK}
        strokeWidth={5}
        paintOrder="stroke"
      >
        {node.status === 'tome' ? node.tomes.map((t) => t.title).join(' · ') : node.title}
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
