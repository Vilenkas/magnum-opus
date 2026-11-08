import { useMemo, useState } from 'react'
import { BANDS, BLEEDS, HALF, LAYERS, MID, SUTURES, bleedOf, boundaries, type BleedId, type LayerId } from '../data/meninges'
import plate from './skeleton/plate.module.css'
import styles from './Meninges.module.css'

const BOTTOM = 300
const INNER = 14 // the hemispheres start this far from the midline; the falx fills the gap
const STEP = 2
const LABEL_X = 664

type Mode = 'layers' | BleedId

/** Points of one hemisphere, outward from the midline, for side −1 (left) or 1 (right). */
const hemiXs = (side: 1 | -1) => {
  const xs: number[] = []
  for (let d = INNER; d <= HALF; d += STEP) xs.push(MID + side * d)
  return xs
}

const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
const band = (top: [number, number][], bottom: [number, number][]) => `${line(top)}${line([...bottom].reverse()).replace('M', 'L')}Z`

/** Lámina: the meninges in a frontal section of the vault, with the three bleeds they can hold. */
export function Meninges() {
  const [mode, setMode] = useState<Mode>('layers')
  const [today, setToday] = useState(false)
  const [picked, setPicked] = useState<LayerId | null>(null)
  const bleed = mode === 'layers' ? undefined : bleedOf(mode)

  const sides = useMemo(
    () =>
      ([-1, 1] as const).map((side) => {
        const xs = hemiXs(side)
        const rows = xs.map((x) => ({ x, ...boundaries(x, bleed, -1) }))
        const at = (i: number) => rows.map((r) => [r.x, r.ys[i]] as [number, number])
        const bands = BANDS.filter((b) => b.from >= 2).map((b) => {
          // Above a clot, the layer ends where the clot begins.
          const bottom = bleed && b.to === bleed.at && bleed.peak ? rows.map((r) => [r.x, r.bloodTop ?? r.ys[b.to]] as [number, number]) : at(b.to)
          return { ...b, d: band(at(b.from), bottom) }
        })
        const cortex = band(at(5), [
          [xs[0], BOTTOM],
          [xs[xs.length - 1], BOTTOM],
        ])
        let blood: string | null = null
        if (bleed) {
          const top = rows.map((r) => [r.x, r.bloodTop ?? r.ys[bleed.at]] as [number, number])
          const bottom = bleed.peak ? at(bleed.at) : at(5)
          if (rows.some((r) => r.bloodTop !== null && (bleed.peak ? r.ys[bleed.at] - r.bloodTop > 0.2 : true))) blood = band(top, bottom)
        }
        return { side, xs, rows, bands, cortex, blood, pia: line(at(5)), arach: line(at(4)), border: line(at(3)) }
      }),
    [bleed],
  )

  // The bone and the periosteal dura run unbroken over the midline; the sinus opens below them.
  const outer = useMemo(() => {
    const rows: { x: number; ys: number[]; bloodTop: number | null }[] = []
    for (let x = MID - HALF; x <= MID + HALF; x += STEP) rows.push({ x, ...boundaries(x, bleed, -1) })
    const at = (i: number) => rows.map((r) => [r.x, r.ys[i]] as [number, number])
    return [
      { layer: 'bone' as LayerId, d: band(at(0), rows.map((r) => [r.x, bleed?.at === 1 && r.bloodTop !== null ? r.bloodTop : r.ys[1]] as [number, number])) },
      { layer: 'periosteal' as LayerId, d: band(at(1), at(2)) },
    ]
  }, [bleed])
  const yAt = (x: number, i: number) => boundaries(x, bleed, -1).ys[i]
  const y1 = yAt(MID, 2)
  const sinusApex = y1 + 36
  const veinFrom: [number, number] = [MID - 76, yAt(MID - 76, 5) + 2]
  const layer = picked ? LAYERS.find((l) => l.id === picked)! : null
  const nameOf = (id: LayerId) => {
    const l = LAYERS.find((x) => x.id === id)!
    return today && l.today ? l.today : l.testut
  }

  // Labels on the right hemisphere, one per layer, at a crown between two sulci.
  const lx = MID + 236
  const labelRows = useMemo(() => {
    const { ys } = boundaries(lx, undefined)
    const mid = (a: number, b: number) => (ys[a] + ys[b]) / 2
    return [
      { id: 'bone' as LayerId, y: mid(0, 1) },
      { id: 'periosteal' as LayerId, y: mid(1, 2) },
      { id: 'meningeal' as LayerId, y: mid(2, 3) },
      { id: 'border' as LayerId, y: ys[3] },
      { id: 'arachnoid' as LayerId, y: mid(3, 4) },
      { id: 'subarachnoid' as LayerId, y: mid(4, 5) },
      { id: 'pia' as LayerId, y: ys[5] },
      { id: 'cortex' as LayerId, y: ys[5] + 22 },
    ]
  }, [lx])

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina XVIII · Las meninges en un corte de la bóveda</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Vista">
        <button className={plate.chip} data-active={mode === 'layers'} onClick={() => setMode('layers')}>
          Capas
        </button>
        {BLEEDS.map((b) => (
          <button key={b.id} className={plate.chip} data-active={mode === b.id} onClick={() => setMode(b.id)}>
            {b.name}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={today} aria-pressed={today} onClick={() => setToday((t) => !t)}>
          Nombres de hoy
        </button>
      </div>

      <svg viewBox="0 0 880 310" className={styles.schema} role="img" aria-label="Corte frontal de la bóveda craneal con sus meninges">
        {outer.map((b) => (
          <path key={b.layer} d={b.d} className={styles[b.layer]} data-picked={picked === b.layer} onClick={() => setPicked(b.layer)} />
        ))}
        {sides.map((s) => (
          <g key={s.side}>
            <path d={s.cortex} className={styles.cortex} data-picked={picked === 'cortex'} onClick={() => setPicked('cortex')} />
            {s.bands.map((b) => (
              <path key={b.layer} d={b.d} className={styles[b.layer]} data-picked={picked === b.layer} onClick={() => setPicked(b.layer)} />
            ))}
            {s.blood && <path d={s.blood} className={styles.blood} data-kind={bleed?.id} />}
            <path d={s.border} className={styles.borderLine} data-picked={picked === 'border'} onClick={() => setPicked('border')} />
            <path d={s.pia} className={styles.piaLine} data-picked={picked === 'pia'} onClick={() => setPicked('pia')} />
          </g>
        ))}

        {/* Midline: the falx between the hemispheres, the sinus where the dura's leaves part, a granulation in it. */}
        <rect x={MID - INNER} y={y1} width={INNER * 2} height={BOTTOM - y1} className={styles.subarachnoid} />
        <path d={`M${MID - 3} ${sinusApex} L${MID - 3} ${BOTTOM} L${MID + 3} ${BOTTOM} L${MID + 3} ${sinusApex} Z`} className={styles.meningeal} onClick={() => setPicked('meningeal')} />
        <path d={`M${MID - 22} ${y1} L${MID + 22} ${y1} L${MID} ${sinusApex} Z`} className={styles.sinus} />
        <path d={`M${MID - 6} ${sinusApex + 4} L${MID - 6} ${BOTTOM} M${MID + 6} ${sinusApex + 4} L${MID + 6} ${BOTTOM}`} className={styles.arachLine} />
        <g className={styles.granulation}>
          <path d={`M${MID + 4} ${sinusApex - 8} q 7 -6 2 -14 q -7 -2 -8 6 q 0 5 6 8 Z`} />
        </g>
        {SUTURES.flatMap((d) => (d ? [MID - d, MID + d] : [MID])).map((x) => {
          const t = yAt(x, 0)
          const b = yAt(x, 1)
          return <path key={x} d={`M${x} ${t} l3 5 l-6 5 l6 5 l-3 ${Math.max(0, b - t - 15)}`} className={styles.suture} />
        })}
        <path d={`M${veinFrom[0]} ${veinFrom[1]} C ${MID - 60} ${y1 + 8}, ${MID - 30} ${y1 + 22}, ${MID - 15} ${y1 + 12}`} className={styles.vein} data-hot={mode === 'subdural'} />
        {[-1, 1].map((side) => {
          const x = MID + side * 190
          return <circle key={side} cx={x} cy={yAt(x, 1) - 1} r={3.2} className={styles.artery} data-hot={mode === 'extradural' && side < 0} />
        })}

        <text x={MID} y={yAt(MID, 0) - 8} textAnchor="middle" className={styles.tag}>
          seno longitudinal superior
        </text>
        <text x={MID + 10} y={BOTTOM - 6} className={styles.tag}>
          hoz del cerebro
        </text>
        <text x={MID - 190} y={yAt(MID - 190, 0) - 6} textAnchor="middle" className={styles.tag}>
          meníngea media
        </text>
        <text x={veinFrom[0] - 4} y={veinFrom[1] + 16} textAnchor="middle" className={styles.tag}>
          vena cerebral
        </text>

        {mode === 'layers' &&
          labelRows.map((r, i) => (
            <g key={r.id} className={styles.label} data-picked={picked === r.id} onClick={() => setPicked(r.id)}>
              <path d={`M${lx} ${r.y} C ${lx + 50} ${r.y}, ${LABEL_X - 50} ${36 + i * 30}, ${LABEL_X - 4} ${36 + i * 30}`} />
              <text x={LABEL_X} y={40 + i * 30}>
                {nameOf(r.id).split(/[:,]/)[0]}
              </text>
            </g>
          ))}
      </svg>

      <div className={plate.legend} aria-live="polite">
        {bleed ? (
          <>
            <p className={plate.kicker}>{bleed.source}</p>
            <p className={styles.text}>{bleed.text}</p>
          </>
        ) : layer ? (
          <>
            <p className={plate.kicker}>{nameOf(layer.id)}</p>
            {today && layer.today && <p className={styles.alt}>En Testut: {layer.testut}</p>}
            {!today && layer.today && <p className={styles.alt}>Hoy: {layer.today}</p>}
            <p className={styles.text}>{layer.text}</p>
          </>
        ) : (
          <p className={styles.text}>
            Del hueso a la corteza: la duramadre, con sus dos hojas que se separan para formar el seno y la hoz; la aracnoides, que pasa como un puente sobre los surcos;
            el espacio del líquido cefalorraquídeo, y la piamadre, que baja a cada surco. Pulsa una capa para ver qué es; elige una hemorragia para ver dónde se acumula.
          </p>
        )}
        <p className={plate.hint}>
          Esquema a escala libre, sobre las figuras de Testut (figs. 2, 21 y 41). Las hemorragias se dibujan en el hemisferio izquierdo; dónde se detiene cada una se
          deduce de dónde está fija la duramadre: al hueso en las suturas, a la hoz en la línea media.
        </p>
      </div>
    </figure>
  )
}
