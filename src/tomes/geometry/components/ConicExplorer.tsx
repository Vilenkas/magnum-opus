import { useState } from 'react'
import styles from './ConicExplorer.module.css'

type ConicType = 'parabola' | 'ellipse' | 'hyperbola' | 'circle'

const VIEW_SIZE = 400
const RANGE = 8
const SCALE = VIEW_SIZE / (2 * RANGE)

function toSvg(x: number, y: number): { x: number; y: number } {
  return {
    x: VIEW_SIZE / 2 + x * SCALE,
    y: VIEW_SIZE / 2 - y * SCALE,
  }
}

export function ConicExplorer() {
  const [conic, setConic] = useState<ConicType>('parabola')
  const [paramA, setParamA] = useState<number>(4) // a for ellipse/hyperbola, p for parabola, r for circle
  const [paramB, setParamB] = useState<number>(2.5) // b for ellipse/hyperbola

  const p = paramA // for parabola
  const a = paramA
  const b = paramB
  const r = paramA // for circle

  // Grid ticks
  const ticks = [-6, -4, -2, 2, 4, 6]

  return (
    <figure className={styles.wrapper}>
      <header className={styles.header}>
        <h3 className={styles.title}>Lámina interactiva: Las secciones cónicas (Lehmann, Cap. IV al VIII)</h3>
        <p className={styles.subtitle}>
          Explora la definición geométrica y analítica de cada cónica a partir de sus parámetros, focos, directrices y
          excentricidad.
        </p>
      </header>

      <nav className={styles.tabs} aria-label="Selección de cónica">
        <button
          className={`${styles.tab} ${conic === 'parabola' ? styles.tabActive : ''}`}
          onClick={() => setConic('parabola')}
        >
          Parábola (e = 1)
        </button>
        <button
          className={`${styles.tab} ${conic === 'ellipse' ? styles.tabActive : ''}`}
          onClick={() => setConic('ellipse')}
        >
          Elipse (e &lt; 1)
        </button>
        <button
          className={`${styles.tab} ${conic === 'hyperbola' ? styles.tabActive : ''}`}
          onClick={() => setConic('hyperbola')}
        >
          Hipérbola (e &gt; 1)
        </button>
        <button
          className={`${styles.tab} ${conic === 'circle' ? styles.tabActive : ''}`}
          onClick={() => setConic('circle')}
        >
          Circunferencia (e = 0)
        </button>
      </nav>

      <div className={styles.layout}>
        <div className={styles.svgContainer}>
          <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className={styles.svg}>
            {/* Grid */}
            {ticks.map((t) => {
              const pos = VIEW_SIZE / 2 + t * SCALE
              return (
                <g key={`t-${t}`}>
                  <line x1={pos} y1={0} x2={pos} y2={VIEW_SIZE} className={styles.gridLine} />
                  <line x1={0} y1={pos} x2={VIEW_SIZE} y2={pos} className={styles.gridLine} />
                </g>
              )
            })}

            {/* Axes */}
            <line x1={0} y1={VIEW_SIZE / 2} x2={VIEW_SIZE} y2={VIEW_SIZE / 2} className={styles.axis} />
            <line x1={VIEW_SIZE / 2} y1={0} x2={VIEW_SIZE} y2={VIEW_SIZE} className={styles.axis} />

            {/* Render selected conic */}
            {conic === 'parabola' && <ParabolaSvg p={p} />}
            {conic === 'ellipse' && <EllipseSvg a={a} b={b} />}
            {conic === 'hyperbola' && <HyperbolaSvg a={a} b={b} />}
            {conic === 'circle' && <CircleSvg r={r} />}
          </svg>
        </div>

        <div className={styles.panel}>
          {conic === 'parabola' && (
            <>
              <div className={styles.equationBox}>
                y² = {4 * p}x
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Parámetro p (distancia vértice-foco):</span>
                  <span>{p.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.25"
                  value={p}
                  onChange={(e) => setParamA(Number(e.target.value))}
                />
              </div>
              <div className={styles.propertiesList}>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Vértice V:</span>
                  <span className={styles.propVal}>(0, 0)</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Foco F:</span>
                  <span className={styles.propVal}>({p.toFixed(2)}, 0)</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Directriz D:</span>
                  <span className={styles.propVal}>x = -{p.toFixed(2)}</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Lado recto (4p):</span>
                  <span className={styles.propVal}>{(4 * p).toFixed(2)} u</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Excentricidad e:</span>
                  <span className={styles.propVal}>1</span>
                </div>
              </div>
            </>
          )}

          {conic === 'ellipse' && (
            <>
              <div className={styles.equationBox}>
                x² / {Math.pow(a, 2).toFixed(1)} + y² / {Math.pow(b, 2).toFixed(1)} = 1
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Semieje mayor a:</span>
                  <span>{a.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="0.25"
                  value={a}
                  onChange={(e) => {
                    const newA = Number(e.target.value)
                    setParamA(newA)
                    if (b >= newA) setParamB(newA - 0.5)
                  }}
                />
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Semieje menor b:</span>
                  <span>{b.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={Math.max(1.5, a - 0.25)}
                  step="0.25"
                  value={b}
                  onChange={(e) => setParamB(Number(e.target.value))}
                />
              </div>
              {(() => {
                const c = Math.sqrt(Math.max(0, a * a - b * b))
                const e = c / a
                const lr = (2 * b * b) / a
                return (
                  <div className={styles.propertiesList}>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Semidistancia focal c:</span>
                      <span className={styles.propVal}>{c.toFixed(2)}</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Focos F₁, F₂:</span>
                      <span className={styles.propVal}>(±{c.toFixed(2)}, 0)</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Excentricidad e = c/a:</span>
                      <span className={styles.propVal}>{e.toFixed(3)} (&lt; 1)</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Lado recto 2b²/a:</span>
                      <span className={styles.propVal}>{lr.toFixed(2)} u</span>
                    </div>
                  </div>
                )
              })()}
            </>
          )}

          {conic === 'hyperbola' && (
            <>
              <div className={styles.equationBox}>
                x² / {Math.pow(a, 2).toFixed(1)} - y² / {Math.pow(b, 2).toFixed(1)} = 1
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Semieje real a:</span>
                  <span>{a.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5"
                  step="0.25"
                  value={a}
                  onChange={(e) => setParamA(Number(e.target.value))}
                />
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Semieje imaginario b:</span>
                  <span>{b.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.25"
                  value={b}
                  onChange={(e) => setParamB(Number(e.target.value))}
                />
              </div>
              {(() => {
                const c = Math.sqrt(a * a + b * b)
                const e = c / a
                const slopeAsymp = b / a
                return (
                  <div className={styles.propertiesList}>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Semidistancia focal c:</span>
                      <span className={styles.propVal}>{c.toFixed(2)}</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Focos F₁, F₂:</span>
                      <span className={styles.propVal}>(±{c.toFixed(2)}, 0)</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Excentricidad e = c/a:</span>
                      <span className={styles.propVal}>{e.toFixed(3)} (&gt; 1)</span>
                    </div>
                    <div className={styles.propRow}>
                      <span className={styles.propName}>Asíntotas y = ±(b/a)x:</span>
                      <span className={styles.propVal}>y = ±{slopeAsymp.toFixed(2)}x</span>
                    </div>
                  </div>
                )
              })()}
            </>
          )}

          {conic === 'circle' && (
            <>
              <div className={styles.equationBox}>
                x² + y² = {Math.pow(r, 2).toFixed(1)}
              </div>
              <div className={styles.controlGroup}>
                <div className={styles.controlLabel}>
                  <span>Radio r:</span>
                  <span>{r.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.25"
                  value={r}
                  onChange={(e) => setParamA(Number(e.target.value))}
                />
              </div>
              <div className={styles.propertiesList}>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Centro C:</span>
                  <span className={styles.propVal}>(0, 0)</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Radio r:</span>
                  <span className={styles.propVal}>{r.toFixed(2)} u</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Perímetro 2πr:</span>
                  <span className={styles.propVal}>{(2 * Math.PI * r).toFixed(2)} u</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Área πr²:</span>
                  <span className={styles.propVal}>{(Math.PI * r * r).toFixed(2)} u²</span>
                </div>
                <div className={styles.propRow}>
                  <span className={styles.propName}>Excentricidad e:</span>
                  <span className={styles.propVal}>0</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </figure>
  )
}

function ParabolaSvg({ p }: { p: number }) {
  // y^2 = 4px -> x = y^2 / (4p)
  const points: string[] = []
  for (let y = -RANGE; y <= RANGE; y += 0.25) {
    const x = (y * y) / (4 * p)
    if (x <= RANGE) {
      const svgPt = toSvg(x, y)
      points.push(`${svgPt.x},${svgPt.y}`)
    }
  }

  const focusSvg = toSvg(p, 0)
  const vertexSvg = toSvg(0, 0)
  const directrixSvgX = toSvg(-p, 0).x

  return (
    <g>
      {/* Directrix */}
      <line x1={directrixSvgX} y1={0} x2={directrixSvgX} y2={VIEW_SIZE} className={styles.directrix} />
      <text x={directrixSvgX + 4} y={20} className={styles.label} fill="#dc2626">
        x = -{p}
      </text>

      {/* Curve */}
      <polyline points={points.join(' ')} className={styles.curve} />

      {/* Focus & Vertex */}
      <circle cx={focusSvg.x} cy={focusSvg.y} r={5} className={styles.focus} />
      <text x={focusSvg.x + 6} y={focusSvg.y - 6} className={styles.label}>
        F({p}, 0)
      </text>

      <circle cx={vertexSvg.x} cy={vertexSvg.y} r={4} className={styles.vertex} />
      <text x={vertexSvg.x - 14} y={vertexSvg.y + 14} className={styles.label}>
        V(0,0)
      </text>
    </g>
  )
}

function EllipseSvg({ a, b }: { a: number; b: number }) {
  const centerSvg = toSvg(0, 0)
  const rx = a * SCALE
  const ry = b * SCALE
  const c = Math.sqrt(Math.max(0, a * a - b * b))
  const f1Svg = toSvg(c, 0)
  const f2Svg = toSvg(-c, 0)

  return (
    <g>
      <ellipse cx={centerSvg.x} cy={centerSvg.y} rx={rx} ry={ry} className={styles.curve} />
      {/* Foci */}
      <circle cx={f1Svg.x} cy={f1Svg.y} r={5} className={styles.focus} />
      <text x={f1Svg.x - 8} y={f1Svg.y - 8} className={styles.label}>
        F₁
      </text>
      <circle cx={f2Svg.x} cy={f2Svg.y} r={5} className={styles.focus} />
      <text x={f2Svg.x - 8} y={f2Svg.y - 8} className={styles.label}>
        F₂
      </text>
    </g>
  )
}

function HyperbolaSvg({ a, b }: { a: number; b: number }) {
  const c = Math.sqrt(a * a + b * b)
  const f1Svg = toSvg(c, 0)
  const f2Svg = toSvg(-c, 0)

  // Asymptotes y = +- (b/a) x
  const xEnd = RANGE
  const yEnd = (b / a) * xEnd
  const asymp1Start = toSvg(-xEnd, -yEnd)
  const asymp1End = toSvg(xEnd, yEnd)
  const asymp2Start = toSvg(-xEnd, yEnd)
  const asymp2End = toSvg(xEnd, -yEnd)

  // Hyperbola branches: x = a * cosh(t), y = b * sinh(t)
  const rightBranch: string[] = []
  const leftBranch: string[] = []
  for (let t = -2.2; t <= 2.2; t += 0.1) {
    const x = a * Math.cosh(t)
    const y = b * Math.sinh(t)
    if (x <= RANGE && Math.abs(y) <= RANGE) {
      const pRight = toSvg(x, y)
      const pLeft = toSvg(-x, y)
      rightBranch.push(`${pRight.x},${pRight.y}`)
      leftBranch.push(`${pLeft.x},${pLeft.y}`)
    }
  }

  return (
    <g>
      {/* Asymptotes */}
      <line
        x1={asymp1Start.x}
        y1={asymp1Start.y}
        x2={asymp1End.x}
        y2={asymp1End.y}
        className={styles.asymptote}
      />
      <line
        x1={asymp2Start.x}
        y1={asymp2Start.y}
        x2={asymp2End.x}
        y2={asymp2End.y}
        className={styles.asymptote}
      />

      {/* Branches */}
      {rightBranch.length > 0 && <polyline points={rightBranch.join(' ')} className={styles.curve} />}
      {leftBranch.length > 0 && <polyline points={leftBranch.join(' ')} className={styles.curve} />}

      {/* Foci */}
      <circle cx={f1Svg.x} cy={f1Svg.y} r={5} className={styles.focus} />
      <text x={f1Svg.x + 6} y={f1Svg.y - 6} className={styles.label}>
        F₁
      </text>
      <circle cx={f2Svg.x} cy={f2Svg.y} r={5} className={styles.focus} />
      <text x={f2Svg.x - 18} y={f2Svg.y - 6} className={styles.label}>
        F₂
      </text>
    </g>
  )
}

function CircleSvg({ r }: { r: number }) {
  const centerSvg = toSvg(0, 0)
  const radiusSvg = r * SCALE

  return (
    <g>
      <circle cx={centerSvg.x} cy={centerSvg.y} r={radiusSvg} className={styles.curve} />
      <circle cx={centerSvg.x} cy={centerSvg.y} r={4} className={styles.vertex} />
      <text x={centerSvg.x + 6} y={centerSvg.y - 6} className={styles.label}>
        C(0,0)
      </text>
      {/* Radius line */}
      <line
        x1={centerSvg.x}
        y1={centerSvg.y}
        x2={centerSvg.x + radiusSvg}
        y2={centerSvg.y}
        stroke="#1d4ed8"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <text x={centerSvg.x + radiusSvg / 2} y={centerSvg.y - 6} className={styles.label} fill="#1d4ed8">
        r = {r}
      </text>
    </g>
  )
}
