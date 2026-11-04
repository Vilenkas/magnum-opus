import type { AtlasNode } from './model'

export interface MapPoint {
  node: AtlasNode
  x: number
  y: number
  /** Radians, 0 pointing right, clockwise (SVG y grows downward). */
  angle: number
  parent?: MapPoint
}

/**
 * Radial cluster layout ("dendrogram"): branches sit on rings by depth, every
 * leaf on the outer ring, each subtree getting an arc proportional to its
 * leaves. The first domain is centred at the top.
 */
export function radialLayout(roots: AtlasNode[], ring: number): { points: MapPoint[]; radius: number } {
  const maxDepth = Math.max(1, ...roots.map(function deepest(n: AtlasNode): number {
    return n.children.length ? Math.max(...n.children.map(deepest)) : n.depth
  }))
  const radius = maxDepth * ring
  const leaves = roots.reduce((sum, r) => sum + r.leafCount, 0)
  const step = (2 * Math.PI) / Math.max(1, leaves)
  let cursor = -Math.PI / 2 - ((roots[0]?.leafCount ?? 0) * step) / 2

  const points: MapPoint[] = []
  const place = (node: AtlasNode, parent: MapPoint | undefined): MapPoint => {
    const point: MapPoint = { node, x: 0, y: 0, angle: 0, parent }
    points.push(point)
    let r: number
    if (node.children.length) {
      // Centre of the arc its leaves take, so a branch sits over its subtree.
      const start = cursor
      for (const child of node.children) place(child, point)
      point.angle = (start + cursor) / 2
      r = node.depth * ring
    } else {
      point.angle = cursor + step / 2
      cursor += step
      r = radius
    }
    point.x = Math.cos(point.angle) * r
    point.y = Math.sin(point.angle) * r
    return point
  }
  for (const root of roots) place(root, undefined)
  return { points, radius }
}
