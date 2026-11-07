import { useState, useRef, useCallback, type MouseEvent } from 'react'
import {
  distance,
  divideSegment,
  inclinationAngle,
  lineFromTwoPoints,
  midpoint,
  slope,
  type Point2D,
} from '../data/analytic-geometry'
import styles from './CartesianPlane.module.css'

const VIEW_SIZE = 400
const COORD_RANGE = 10 // from -10 to 10
const STEP = VIEW_SIZE / (2 * COORD_RANGE)

function toSvgCoord(p: Point2D): { x: number; y: number } {
  return {
    x: VIEW_SIZE / 2 + p.x * STEP,
    y: VIEW_SIZE / 2 - p.y * STEP,
  }
}

function fromSvgCoord(svgX: number, svgY: number): Point2D {
  return {
    x: Math.round(((svgX - VIEW_SIZE / 2) / STEP) * 2) / 2,
    y: Math.round(((VIEW_SIZE / 2 - svgY) / STEP) * 2) / 2,
  }
}

export function CartesianPlane() {
  const [p1, setP1] = useState<Point2D>({ x: -4, y: -2 })
  const [p2, setP2] = useState<Point2D>({ x: 5, y: 4 })
  const [ratio, setRatio] = useState<number>(1)
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const dist = distance(p1, p2)
  const m = slope(p1, p2)
  const angleDeg = (inclinationAngle(p1, p2) * 180) / Math.PI
  const mid = midpoint(p1, p2)
  const divPoint = ratio !== -1 ? divideSegment(p1, p2, ratio) : null
  const line = dist > 1e-6 ? lineFromTwoPoints(p1, p2) : null

  const handlePointerDown = (pointId: 'p1' | 'p2') => {
    setDragging(pointId)
  }

  const handlePointerMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (!dragging || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top
      const scaleX = VIEW_SIZE / rect.width
      const scaleY = VIEW_SIZE / rect.height
      const svgX = clientX * scaleX
      const svgY = clientY * scaleY
      const newCoord = fromSvgCoord(svgX, svgY)

      // Clamp to -COORD_RANGE .. COORD_RANGE
      newCoord.x = Math.max(-COORD_RANGE, Math.min(COORD_RANGE, newCoord.x))
      newCoord.y = Math.max(-COORD_RANGE, Math.min(COORD_RANGE, newCoord.y))

      if (dragging === 'p1') setP1(newCoord)
      else setP2(newCoord)
    },
    [dragging],
  )

  const handlePointerUp = () => {
    setDragging(null)
  }

  const svgP1 = toSvgCoord(p1)
  const svgP2 = toSvgCoord(p2)
  const svgDiv = divPoint ? toSvgCoord(divPoint) : null
  const svgCorner = toSvgCoord({ x: p2.x, y: p1.y })

  // Grid lines
  const gridTicks: number[] = []
  for (let i = -COORD_RANGE; i <= COORD_RANGE; i += 2) {
    if (i !== 0) gridTicks.push(i)
  }

  return (
    <figure className={styles.wrapper}>
      <header className={styles.header}>
        <h3 className={styles.title}>Lámina interactiva: El plano cartesiano y el segmento</h3>
        <p className={styles.subtitle}>
          Arrastra los puntos P₁ y P₂ o ajusta sus valores para ver la distancia, pendiente, ecuación y división del
          segmento (Lehmann, Cap. I y III).
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.svgContainer}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            className={styles.svg}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
          >
            {/* Grid */}
            {gridTicks.map((t) => {
              const pos = VIEW_SIZE / 2 + t * STEP
              return (
                <g key={`grid-${t}`}>
                  <line x1={pos} y1={0} x2={pos} y2={VIEW_SIZE} className={styles.gridLine} />
                  <line x1={0} y1={pos} x2={VIEW_SIZE} y2={pos} className={styles.gridLine} />
                  <text x={pos} y={VIEW_SIZE / 2 + 14} className={styles.axisLabel} textAnchor="middle">
                    {t}
                  </text>
                  <text x={VIEW_SIZE / 2 - 6} y={pos + 4} className={styles.axisLabel} textAnchor="end">
                    {-t}
                  </text>
                </g>
              )
            })}

            {/* Axes */}
            <line x1={0} y1={VIEW_SIZE / 2} x2={VIEW_SIZE} y2={VIEW_SIZE / 2} className={styles.axis} />
            <line x1={VIEW_SIZE / 2} y1={0} x2={VIEW_SIZE} y2={VIEW_SIZE} className={styles.axis} />

            {/* Projections right triangle: Delta x and Delta y */}
            <line x1={svgP1.x} y1={svgP1.y} x2={svgCorner.x} y2={svgCorner.y} className={styles.triangleLeg} />
            <line x1={svgCorner.x} y1={svgCorner.y} x2={svgP2.x} y2={svgP2.y} className={styles.triangleLeg} />

            {/* Segment P1P2 */}
            <line x1={svgP1.x} y1={svgP1.y} x2={svgP2.x} y2={svgP2.y} className={styles.segment} />

            {/* Division point P */}
            {svgDiv && (
              <g>
                <circle cx={svgDiv.x} cy={svgDiv.y} r={5} className={styles.pointDiv} />
                <text x={svgDiv.x + 8} y={svgDiv.y - 8} className={styles.pointLabel}>
                  P(r={ratio})
                </text>
              </g>
            )}

            {/* Point P1 */}
            <g onMouseDown={() => handlePointerDown('p1')}>
              <circle cx={svgP1.x} cy={svgP1.y} r={8} className={styles.pointP1} />
              <text x={svgP1.x - 10} y={svgP1.y - 12} className={styles.pointLabel}>
                P₁({p1.x}, {p1.y})
              </text>
            </g>

            {/* Point P2 */}
            <g onMouseDown={() => handlePointerDown('p2')}>
              <circle cx={svgP2.x} cy={svgP2.y} r={8} className={styles.pointP2} />
              <text x={svgP2.x + 10} y={svgP2.y - 12} className={styles.pointLabel}>
                P₂({p2.x}, {p2.y})
              </text>
            </g>
          </svg>
        </div>

        <div className={styles.controls}>
          <div className={styles.panel}>
            <h4 className={styles.panelTitle}>Coordenadas de los puntos</h4>
            <div className={styles.coordRow}>
              <div className={styles.coordInput}>
                <label>X₁:</label>
                <input
                  type="number"
                  step="0.5"
                  value={p1.x}
                  onChange={(e) => setP1({ ...p1, x: Number(e.target.value) })}
                />
              </div>
              <div className={styles.coordInput}>
                <label>Y₁:</label>
                <input
                  type="number"
                  step="0.5"
                  value={p1.y}
                  onChange={(e) => setP1({ ...p1, y: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className={styles.coordRow}>
              <div className={styles.coordInput}>
                <label>X₂:</label>
                <input
                  type="number"
                  step="0.5"
                  value={p2.x}
                  onChange={(e) => setP2({ ...p2, x: Number(e.target.value) })}
                />
              </div>
              <div className={styles.coordInput}>
                <label>Y₂:</label>
                <input
                  type="number"
                  step="0.5"
                  value={p2.y}
                  onChange={(e) => setP2({ ...p2, y: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabel}>
                <span>Razón de división r = P₁P / PP₂:</span>
                <strong>{ratio}</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className={styles.panel}>
            <h4 className={styles.panelTitle}>Resultados analíticos (Lehmann)</h4>
            <div className={styles.statsList}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Distancia d(P₁, P₂):</span>
                <span className={styles.statValue}>{dist.toFixed(3)} u</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Δx = x₂ - x₁:</span>
                <span className={styles.statValue}>{(p2.x - p1.x).toFixed(1)}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Δy = y₂ - y₁:</span>
                <span className={styles.statValue}>{(p2.y - p1.y).toFixed(1)}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Pendiente m:</span>
                <span className={styles.statValue}>{m === null ? '∞ (Vertical)' : m.toFixed(3)}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Ángulo de inclinación α:</span>
                <span className={styles.statValue}>{angleDeg.toFixed(1)}°</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>Punto medio M (r = 1):</span>
                <span className={styles.statValue}>
                  ({mid.x.toFixed(2)}, {mid.y.toFixed(2)})
                </span>
              </div>
              {divPoint && (
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Punto de división P(r):</span>
                  <span className={styles.statValue}>
                    ({divPoint.x.toFixed(2)}, {divPoint.y.toFixed(2)})
                  </span>
                </div>
              )}
              {line && (
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Ecuación general:</span>
                  <span className={styles.statValue}>
                    {line.a.toFixed(2)}x {line.b >= 0 ? '+' : '-'} {Math.abs(line.b).toFixed(2)}y{' '}
                    {line.c >= 0 ? '+' : '-'} {Math.abs(line.c).toFixed(2)} = 0
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
