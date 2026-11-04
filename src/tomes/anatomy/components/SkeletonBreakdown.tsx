import { useState } from 'react'
import { boneCount, countOf, divisionCount, type CountDivision, type CountNode } from '../data/bone-count'
import styles from './SkeletonBreakdown.module.css'

const grandTotal = boneCount.reduce((sum, d) => sum + divisionCount(d), 0)

/** Every branch key of a division, to unfold it all at once. */
const branchKeys = (nodes: CountNode[], prefix: string): string[] =>
  nodes.flatMap((n) => {
    const key = `${prefix}/${n.name}`
    return n.children ? [key, ...branchKeys(n.children, key)] : []
  })

/** Interactive split of the adult skeleton into its two divisions, each unfolding down to single bones. */
export function SkeletonBreakdown() {
  const [selected, setSelected] = useState<CountDivision['id']>('axial')
  const [open, setOpen] = useState<Set<string>>(new Set())
  const active = boneCount.find((d) => d.id === selected)!

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
      <figcaption className={styles.caption}>Lámina I · Los {grandTotal} huesos del esqueleto adulto</figcaption>

      <div className={styles.bar} role="tablist" aria-label="División del esqueleto">
        {boneCount.map((d) => (
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
            <span className={styles.name}>{node.name}</span>
            <span className={styles.dots} aria-hidden />
            <span className={styles.count}>{countOf(node)}</span>
          </>
        )
        return (
          <li key={key}>
            {node.children ? (
              <button
                type="button"
                className={styles.row}
                aria-expanded={isOpen}
                onClick={() => onToggle(key)}
              >
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
            {node.note && <p className={styles.note}>{node.note}</p>}
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
