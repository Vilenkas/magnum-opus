import type { AtlasNode } from './model'

export interface MapPoint {
  node: AtlasNode
  x: number
  y: number
  /** Radians, 0 pointing right, clockwise (SVG y grows downward). */
  angle: number
  /** 1: a child of the focus; 2: a grandchild. */
  ring: 1 | 2
  parent?: MapPoint
  /** Descendants not drawn (below the second ring), shown as "+N". */
  hidden: number
}

/** Every node below `node`. */
export const descendantCount = (node: AtlasNode): number =>
  node.children.reduce((sum, c) => sum + 1 + descendantCount(c), 0)

/**
 * Progressive constellation: only two levels around the focus. Children with children of
 * their own sit on the inner ring, grandchildren on the outer one; a child that is a leaf
 * goes straight to the outer ring, where its label has room. Each child gets an arc
 * proportional to its own children, so a busy branch has room and a lone leaf still has a
 * slot. The first child is centred at the top. Whatever lies deeper is counted, not drawn.
 */
export function focusLayout(children: AtlasNode[], ring: number, outer = ring * 2): MapPoint[] {
  const weight = (n: AtlasNode) => Math.max(1, n.children.length)
  const total = children.reduce((sum, c) => sum + weight(c), 0)
  if (!total) return []
  const step = (2 * Math.PI) / total
  let cursor = -Math.PI / 2 - (weight(children[0]) * step) / 2

  const points: MapPoint[] = []
  for (const child of children) {
    const start = cursor
    const span = weight(child) * step
    const angle = start + span / 2
    const r = child.children.length ? ring : outer
    const point: MapPoint = {
      node: child,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      angle,
      ring: 1,
      hidden: 0,
    }
    points.push(point)
    child.children.forEach((grandchild, i) => {
      const a = start + (i + 0.5) * step
      points.push({
        node: grandchild,
        x: Math.cos(a) * outer,
        y: Math.sin(a) * outer,
        angle: a,
        ring: 2,
        parent: point,
        hidden: descendantCount(grandchild),
      })
    })
    cursor += span
  }
  return points
}
