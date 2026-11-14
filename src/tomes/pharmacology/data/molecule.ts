/**
 * A molecule as drawn in skeletal formula: carbons are bare vertices, every other atom (and a
 * charged carbon) is a label carrying its hydrogens. Pure geometry, tested; the component only
 * paints what this returns.
 */

/** [element, x, y, hydrogens, charge?] in PubChem's 2D units (bond length ≈ 1, y up). */
export type Atom = [string, number, number, number, number?]
/** [atom a, atom b, order, wedge?]: wedge 1 = solid towards b, -1 = hashed towards b. */
export type Bond = [number, number, number, number?]

export interface Molecule {
  cid: number
  formula: string
  weight: number
  iupac: string
  inchikey: string
  smiles: string
  xlogp?: number
  atc: string[]
  wikidata?: string
  atoms: Atom[]
  bonds: Bond[]
}

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type BondShape =
  | { kind: 'lines'; lines: Line[] }
  | { kind: 'wedge'; points: [number, number][] }
  | { kind: 'hash'; lines: Line[] }

export interface Label {
  x: number
  y: number
  element: string
  /** Hydrogens written after (or, when the bonds leave to the right, before) the element. */
  h: number
  hFirst: boolean
  charge: number
}

export interface Drawing {
  width: number
  height: number
  bonds: BondShape[]
  labels: Label[]
}

/** Pixels per bond length. */
export const BOND = 28
/** How far a bond stops short of a labelled atom, in bond lengths. */
const LABEL_GAP = 0.3
/** Distance between the lines of a multiple bond, in bond lengths. */
const SPACING = 0.18
const PAD = 0.7

const isLabelled = (a: Atom) => a[0] !== 'C' || Boolean(a[4])

/** Hill-system formula of the drawn atoms (C, H, then alphabetical). */
export function formulaOf(atoms: Atom[]): string {
  const count = new Map<string, number>()
  for (const [el, , , h] of atoms) {
    count.set(el, (count.get(el) ?? 0) + 1)
    if (h) count.set('H', (count.get('H') ?? 0) + h)
  }
  const order = [...count.keys()].sort((a, b) => {
    const rank = (e: string) => (e === 'C' ? 0 : e === 'H' ? 1 : 2)
    return rank(a) - rank(b) || a.localeCompare(b)
  })
  return order.map((el) => `${el}${count.get(el)! > 1 ? count.get(el) : ''}`).join('')
}

export function drawMolecule(mol: Pick<Molecule, 'atoms' | 'bonds'>): Drawing {
  const { atoms, bonds } = mol
  const xs = atoms.map((a) => a[1])
  const ys = atoms.map((a) => a[2])
  const minX = Math.min(...xs) - PAD
  const maxY = Math.max(...ys) + PAD
  // To pixels, y down.
  const P = (i: number): [number, number] => [(atoms[i][1] - minX) * BOND, (maxY - atoms[i][2]) * BOND]

  const neighbours = atoms.map(() => [] as number[])
  for (const [a, b] of bonds) {
    neighbours[a].push(b)
    neighbours[b].push(a)
  }

  const shapes: BondShape[] = []
  for (const [a, b, order, wedge] of bonds) {
    let [x1, y1] = P(a)
    let [x2, y2] = P(b)
    const len = Math.hypot(x2 - x1, y2 - y1)
    const ux = (x2 - x1) / len
    const uy = (y2 - y1) / len
    // Normal, pointing left of a→b.
    const nx = -uy
    const ny = ux
    const gap = LABEL_GAP * BOND
    if (isLabelled(atoms[a])) {
      x1 += ux * gap
      y1 += uy * gap
    }
    if (isLabelled(atoms[b])) {
      x2 -= ux * gap
      y2 -= uy * gap
    }

    if (wedge === 1) {
      const w = 0.12 * BOND
      shapes.push({ kind: 'wedge', points: [[x1, y1], [x2 + nx * w, y2 + ny * w], [x2 - nx * w, y2 - ny * w]] })
      continue
    }
    if (wedge === -1) {
      const lines: Line[] = []
      const n = 6
      for (let k = 1; k <= n; k++) {
        const t = k / n
        const w = 0.12 * BOND * t
        const cx = x1 + (x2 - x1) * t
        const cy = y1 + (y2 - y1) * t
        lines.push({ x1: cx + nx * w, y1: cy + ny * w, x2: cx - nx * w, y2: cy - ny * w })
      }
      shapes.push({ kind: 'hash', lines })
      continue
    }

    const main: Line = { x1, y1, x2, y2 }
    const s = SPACING * BOND
    if (order === 1) {
      shapes.push({ kind: 'lines', lines: [main] })
    } else if (order === 3) {
      shapes.push({ kind: 'lines', lines: [main, offset(main, nx, ny, s), offset(main, nx, ny, -s)] })
    } else {
      const side = ringSide(a, b)
      if (side === 0) {
        // Nothing on either side (C=O, C=C in a chain): two lines astride the axis.
        shapes.push({ kind: 'lines', lines: [offset(main, nx, ny, s / 2), offset(main, nx, ny, -s / 2)] })
      } else {
        // The second line inside the ring, a little shorter.
        const inner = offset(main, nx, ny, side * s)
        const trim = 0.14 * BOND
        const shortened: Line = {
          x1: inner.x1 + (isLabelled(atoms[a]) ? 0 : ux * trim),
          y1: inner.y1 + (isLabelled(atoms[a]) ? 0 : uy * trim),
          x2: inner.x2 - (isLabelled(atoms[b]) ? 0 : ux * trim),
          y2: inner.y2 - (isLabelled(atoms[b]) ? 0 : uy * trim),
        }
        shapes.push({ kind: 'lines', lines: [main, shortened] })
      }
    }
  }

  /**
   * Where the other neighbours of a and b lie: +1 on the side the normal (-uy, ux) points to,
   * -1 on the other, 0 balanced. In screen pixels the cross product (b−a)×(p−a) is positive
   * exactly on the normal's side.
   */
  function ringSide(a: number, b: number): number {
    const [ax, ay] = P(a)
    const [bx, by] = P(b)
    const sideOf = (px: number, py: number) => (bx - ax) * (py - ay) - (by - ay) * (px - ax)
    // In a ring, towards the centre of the smallest ring holding the bond.
    const ring = smallestRing(a, b)
    if (ring) {
      const cx = ring.reduce((s, i) => s + P(i)[0], 0) / ring.length
      const cy = ring.reduce((s, i) => s + P(i)[1], 0) / ring.length
      return sideOf(cx, cy) > 0 ? 1 : -1
    }
    let along = 0
    let against = 0
    for (const n of [...neighbours[a].filter((n) => n !== b), ...neighbours[b].filter((n) => n !== a)]) {
      const cross = sideOf(...P(n))
      if (cross > 1e-6) along++
      else if (cross < -1e-6) against++
    }
    if (along === against) return 0
    return along > against ? 1 : -1
  }

  /** The atoms of the smallest ring (up to 8) through bond a–b, or undefined if it is in none. */
  function smallestRing(a: number, b: number): number[] | undefined {
    // Breadth-first from a to b without crossing the bond itself.
    const prev = new Map<number, number>([[a, -1]])
    let frontier = [a]
    for (let depth = 0; depth < 7 && frontier.length; depth++) {
      const next: number[] = []
      for (const u of frontier) {
        for (const v of neighbours[u]) {
          if ((u === a && v === b) || prev.has(v)) continue
          prev.set(v, u)
          if (v === b) {
            const path = [b]
            for (let w = u; w !== -1; w = prev.get(w)!) path.push(w)
            return path
          }
          next.push(v)
        }
      }
      frontier = next
    }
    return undefined
  }

  const labels: Label[] = []
  atoms.forEach((atom, i) => {
    if (!isLabelled(atom)) return
    const [x, y] = P(i)
    // Hydrogens go on the side free of bonds.
    const dx = neighbours[i].reduce((sum, n) => sum + (P(n)[0] - x), 0)
    labels.push({ x, y, element: atom[0], h: atom[3], hFirst: dx > 0.01 * BOND, charge: atom[4] ?? 0 })
  })

  const maxX = Math.max(...xs) + PAD
  const minY = Math.min(...ys) - PAD
  return { width: (maxX - minX) * BOND, height: (maxY - minY) * BOND, bonds: shapes, labels }
}

function offset(l: Line, nx: number, ny: number, d: number): Line {
  return { x1: l.x1 + nx * d, y1: l.y1 + ny * d, x2: l.x2 + nx * d, y2: l.y2 + ny * d }
}
