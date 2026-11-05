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
 * Progressive constellation: only two levels around the focus. Children sit on the first
 * ring, grandchildren on the second; each child gets an arc proportional to its own
 * children, so a busy branch has room and a lone leaf still has a slot. The first child is
 * centred at the top. Whatever lies deeper is counted, not drawn.
 */
export function focusLayout(children: AtlasNode[], ring: number): MapPoint[] {
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
    const point: MapPoint = {
      node: child,
      x: Math.cos(angle) * ring,
      y: Math.sin(angle) * ring,
      angle,
      ring: 1,
      hidden: 0,
    }
    points.push(point)
    child.children.forEach((grandchild, i) => {
      const a = start + (i + 0.5) * step
      points.push({
        node: grandchild,
        x: Math.cos(a) * ring * 2,
        y: Math.sin(a) * ring * 2,
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
