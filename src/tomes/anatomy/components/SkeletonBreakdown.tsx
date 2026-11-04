import { useState } from 'react'
import { boneCount, countOf, divisionCount, type CountDivision, type CountNode } from '../data/bone-count'
import { jointCount, jointCountCriterion } from '../data/joint-count'
import styles from './SkeletonBreakdown.module.css'

/** Every branch key of a division, to unfold it all at once. */
const branchKeys = (nodes: CountNode[], prefix: string): string[] =>
  nodes.flatMap((n) => {
    const key = `${prefix}/${n.name}`
    return n.children ? [key, ...branchKeys(n.children, key)] : []
  })

/** Lámina I of Osteología: the 206 bones, axial and appendicular. */
export function SkeletonBreakdown() {
  const total = boneCount.reduce((sum, d) => sum + divisionCount(d), 0)
  return <CountBreakdown caption={`Lámina I · Los ${total} huesos del esqueleto adulto`} divisions={boneCount} label="División del esqueleto" />
}

/** Lámina II of Artrología: every joint, grouped as Testut does. */
export function JointBreakdown() {
  const total = jointCount.reduce((sum, d) => sum + divisionCount(d), 0)
  return (
    <CountBreakdown
      caption={`Lámina II · Las ${total} articulaciones del esqueleto`}
      divisions={jointCount}
      label="Grupos de articulaciones"
      footnote={jointCountCriterion}
    />
  )
}

/** A segmented total over divisions, each unfolding level by level down to single items. */
export function CountBreakdown({
  caption,
  divisions,
  label,
  footnote,
}: {
  caption: string
  divisions: CountDivision[]
  label: string
  footnote?: string
}) {
  const [selected, setSelected] = useState(divisions[0].id)
  const [open, setOpen] = useState<Set<string>>(new Set())
  const active = divisions.find((d) => d.id === selected)!

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (!next.delete(key)) next.add(key)
      return next
    })

  const all = branchKeys(active.regions, active.id)
  const allOpen = all.every((k) => open.has(k))
  const toggleAll = () =>
    setOpen((prev) => {
      const next = new Set(prev)
      for (const k of all) {
        if (allOpen) next.delete(k)
        else next.add(k)
      }
      return next
    })

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>{caption}</figcaption>

      <div className={styles.bar} role="tablist" aria-label={label}>
        {divisions.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === selected}
            onClick={() => setSelected(d.id)}
            className={styles.segment}
            data-active={d.id === selected}
            style={{ flexGrow: divisionCount(d) }}
          >
            <span className={styles.segmentCount}>{divisionCount(d)}</span>
            <span className={styles.segmentName}>{d.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.detail} role="tabpanel">
        <div className={styles.lead}>
          <p className={styles.description}>{active.description}</p>
          <button type="button" className={styles.toggleAll} onClick={toggleAll}>
            {allOpen ? 'Plegar todo' : 'Desplegar todo'}
          </button>
        </div>
        <Rows nodes={active.regions} prefix={active.id} depth={0} open={open} onToggle={toggle} />
        {footnote && <p className={styles.footnote}>{footnote}</p>}
      </div>
    </figure>
  )
}

function Rows({
  nodes,
  prefix,
  depth,
  open,
  onToggle,
}: {
  nodes: CountNode[]
  prefix: string
  depth: number
  open: Set<string>
  onToggle: (key: string) => void
}) {
  return (
    <ul className={styles.rows} data-depth={depth}>
      {nodes.map((node) => {
        const key = `${prefix}/${node.name}`
        const isOpen = open.has(key)
        const line = (
          <>
            <span className={styles.name}>
              {node.name}
              {node.kind && <span className={styles.kind}>{node.kind}</span>}
            </span>
            <span className={styles.dots} aria-hidden />
            <span className={styles.count}>{countOf(node)}</span>
          </>
        )
        return (
          <li key={key}>
            {node.children ? (
              <button type="button" className={styles.row} aria-expanded={isOpen} onClick={() => onToggle(key)}>
                <svg className={styles.chevron} data-open={isOpen} viewBox="0 0 12 12" aria-hidden>
                  <path d="M4 2.5 8 6l-4 3.5" />
                </svg>
                {line}
              </button>
            ) : (
              <div className={styles.row}>
                <span className={styles.chevronSpace} aria-hidden />
                {line}
              </div>
            )}
            {(node.latin || node.note) && (
              <p className={styles.note}>
                {node.latin && (
                  <span className={styles.latin} lang="la">
                    {node.latin}
                  </span>
                )}
                {node.latin && node.note && ' · '}
                {node.note}
              </p>
            )}
            {node.children && (
              // Grid-rows trick animates to the content's height; `inert` keeps folded rows out of the tab order.
              <div className={styles.fold} data-open={isOpen} inert={!isOpen}>
                <div>
                  <Rows nodes={node.children} prefix={key} depth={depth + 1} open={open} onToggle={onToggle} />
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
