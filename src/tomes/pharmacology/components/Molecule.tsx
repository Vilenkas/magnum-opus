import { useMemo } from 'react'
import { BOND, drawMolecule, type Label, type Molecule as MoleculeData } from '../data/molecule'
import styles from './Molecule.module.css'

const SUB = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => (n > 1 ? [...String(n)].map((d) => SUB[Number(d)]).join('') : '')

/** Colour family of an element (CSS class), carbon and hydrogen in ink. */
const tone = (el: string) =>
  el === 'N' ? styles.n : el === 'O' ? styles.o : el === 'S' ? styles.s : ['F', 'Cl', 'Br', 'I'].includes(el) ? styles.hal : el === 'P' ? styles.p : ''

/** The molecule in skeletal formula, from PubChem's 2D coordinates. */
export function Molecule({ molecule, title }: { molecule: MoleculeData; title: string }) {
  const drawing = useMemo(() => drawMolecule(molecule), [molecule])
  const { width, height } = drawing
  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${width.toFixed(1)} ${height.toFixed(1)}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={`Estructura de ${title}`}
    >
      <g className={styles.bonds}>
        {drawing.bonds.map((b, i) =>
          b.kind === 'wedge' ? (
            <polygon key={i} points={b.points.map((p) => p.join(',')).join(' ')} className={styles.wedge} />
          ) : (
            b.lines.map((l, j) => (
              <line key={`${i}-${j}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className={b.kind === 'hash' ? styles.hash : undefined} />
            ))
          ),
        )}
      </g>
      {drawing.labels.map((l, i) => (
        <AtomLabel key={i} label={l} />
      ))}
    </svg>
  )
}

/** Label size, and the half width of one letter of it, in pixels. */
const FONT = BOND * 0.5
const HALF_LETTER = FONT * 0.31

function AtomLabel({ label }: { label: Label }) {
  const { x, y, element, h, hFirst, charge } = label
  const hs = h ? `H${sub(h)}` : ''
  const charges = charge ? `${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '−'}` : ''
  // The element centred on the atom; its hydrogens hang off the side free of bonds.
  const half = HALF_LETTER * element.length
  return (
    <g className={`${styles.label} ${tone(element)}`} style={{ fontSize: FONT }}>
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
        {element}
      </text>
      {hs && (
        <text x={hFirst ? x - half : x + half} y={y} textAnchor={hFirst ? 'end' : 'start'} dominantBaseline="central">
          {hs}
        </text>
      )}
      {charges && (
        <text x={x + half + (hs && !hFirst ? HALF_LETTER * 3 : 0)} y={y - FONT * 0.45} className={styles.charge}>
          {charges}
        </text>
      )}
    </g>
  )
}
