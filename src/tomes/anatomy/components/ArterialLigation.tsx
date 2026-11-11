import { useMemo, useState } from 'react'
import { LIGATURES, NETWORKS, PULSES, SEGMENTS, flows, openNetworks, segmentById, type Limb } from '../data/arterial-ligation'
import plate from './skeleton/plate.module.css'
import styles from './ArterialLigation.module.css'

const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')
const mid = (pts: [number, number][]): [number, number] => {
  const [a, b] = [pts[0], pts[pts.length - 1]]
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

const END: Record<Limb, { id: string; es: string }> = {
  upper: { id: 'palmar-arches', es: 'la mano' },
  lower: { id: 'posterior-tibial', es: 'el pie' },
}

/** Lámina IV of Angiología: pulses, points of compression and the ligatures the collateral networks make safe or not. */
export function ArterialLigation() {
  const [tied, setTied] = useState<string[]>(['axillary-proximal'])
  const flow = useMemo(() => flows(tied), [tied])
  const networks = useMemo(() => new Set(openNetworks(tied).map((n) => n.id)), [tied])
  const preset = LIGATURES.find((l) => tied.length === 1 && l.segment === tied[0])

  const toggle = (id: string) => setTied((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const verdict = (limb: Limb) => {
    const f = flow.get(END[limb].id)
    const tiedHere = tied.some((t) => segmentById.get(t)!.limb === limb)
    if (!tiedHere) return null
    if (f === 'main') return `${END[limb].es} sigue irrigada por las arterias principales`
    if (f === 'collateral') return `${END[limb].es} vive por la circulación colateral, aunque sus pulsos desaparecen`
    return `${END[limb].es} queda sin sangre`
  }

  const panel = (limb: Limb) => (
    <svg viewBox="0 0 200 460" className={styles.scheme} role="img" aria-label={limb === 'upper' ? 'Arterias del miembro superior' : 'Arterias del miembro inferior'}>
      <text x={100} y={456} textAnchor="middle" className={styles.limbName}>
        {limb === 'upper' ? 'miembro superior' : 'miembro inferior'}
      </text>
      {NETWORKS.filter((n) => n.limb === limb).map((n) => (
        <g key={n.id} className={styles.network} data-open={networks.has(n.id)}>
          {n.anchors.map(([x, y], i) => (
            <path key={i} d={`M ${n.control[0]} ${n.control[1]} Q ${(n.control[0] + x) / 2} ${n.control[1]} ${x} ${y}`} />
          ))}
          <circle cx={n.control[0]} cy={n.control[1]} r={3.5} />
          <title>{`${n.es}: ${n.via}`}</title>
        </g>
      ))}
      {SEGMENTS.filter((s) => s.limb === limb).map((s) => {
        const [mx, my] = mid(s.path)
        return (
          <g key={s.id} className={styles.segment} data-flow={flow.get(s.id)} data-tied={tied.includes(s.id)} onClick={() => toggle(s.id)}>
            <path d={line(s.path)} className={styles.hit} />
            <path d={line(s.path)} className={styles.artery} />
            {tied.includes(s.id) && (
              <g className={styles.tie}>
                <line x1={mx - 8} y1={my - 3} x2={mx + 8} y2={my + 3} />
                <line x1={mx - 8} y1={my + 3} x2={mx + 8} y2={my - 3} />
              </g>
            )}
            <title>{s.es}</title>
          </g>
        )
      })}
      {PULSES.filter((p) => segmentById.get(p.segment)!.limb === limb).map((p) => (
        <g key={p.id} className={styles.pulse} data-felt={flow.get(p.segment) === 'main'} data-compression={!!p.compression}>
          <circle cx={p.at[0]} cy={p.at[1]} r={5.5} />
          <title>{`Pulso ${p.es.toLowerCase()}: ${p.where}`}</title>
        </g>
      ))}
    </svg>
  )

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina IV · Pulsos, compresiones y ligaduras</figcaption>
      <div className={plate.chipBar} role="group" aria-label="Ligaduras">
        <button className={plate.chip} data-active={tied.length === 0} onClick={() => setTied([])}>
          Ninguna
        </button>
        {LIGATURES.map((l) => (
          <button key={l.id} className={plate.chip} data-active={preset?.id === l.id} aria-pressed={preset?.id === l.id} onClick={() => setTied([l.segment])}>
            {l.es}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.panels}>
          {panel('upper')}
          {panel('lower')}
        </div>
        <div className={styles.side} aria-live="polite">
          <p className={plate.kicker}>{tied.length ? tied.map((t) => segmentById.get(t)!.es).join(' · ') : 'Sin ligadura'}</p>
          {(['upper', 'lower'] as Limb[]).map((limb) => {
            const v = verdict(limb)
            return v && <p key={limb} className={styles.verdict} data-flow={flow.get(END[limb].id)}>{v.charAt(0).toUpperCase() + v.slice(1)}.</p>
          })}
          {[...networks].map((id) => {
            const n = NETWORKS.find((x) => x.id === id)!
            return (
              <p key={id} className={styles.networkText}>
                <strong>{n.es}:</strong> {n.via}.
              </p>
            )
          })}
          <h4 className={styles.heading}>Pulsos</h4>
          <ul className={styles.pulses}>
            {PULSES.map((p) => (
              <li key={p.id} data-felt={flow.get(p.segment) === 'main'}>
                <span className={styles.pulseName}>
                  {p.es}
                  {p.compression && <span className={styles.badge}>compresión</span>}
                </span>
                <span className={styles.where}>{p.where}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={plate.legend}>
        <p className={plate.hint}>
          Haz clic en una arteria para ligarla o soltarla. En rojo lleno, la sangre llega por las arterias principales y el pulso se siente; en trazo
          discontinuo, sólo llega por una red anastomótica: el tejido vive, pero no hay pulso; en gris, no llega. Las redes que se abren se resaltan. Los
          puntos con anillo son sitios de compresión contra el hueso. Según Moore 8.ª, pp. 196–198, 213, 241, 716–721, 762–768, 784, 1004.
        </p>
      </div>
    </figure>
  )
}
