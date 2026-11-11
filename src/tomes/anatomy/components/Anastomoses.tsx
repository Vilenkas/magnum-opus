import { useState } from 'react'
import { anastomoses } from '../data/anastomoses'
import plate from './skeleton/plate.module.css'
import styles from './Anastomoses.module.css'

/** Lámina: Testut's fig. 118, each kind of anastomosis with its flow, and a thread to tie one artery. */
export function Anastomoses() {
  const [kindId, setKindId] = useState(anastomoses[0].id)
  const [ligated, setLigated] = useState(false)
  const kind = anastomoses.find((k) => k.id === kindId)!
  const { x, y, angle } = kind.ligature

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina III · Las anastomosis arteriales</figcaption>

      <div className={plate.chipBar} role="tablist" aria-label="Variedades de anastomosis">
        {anastomoses.map((k) => (
          <button
            key={k.id}
            role="tab"
            aria-selected={k.id === kind.id}
            className={plate.chip}
            data-active={k.id === kind.id}
            onClick={() => {
              setKindId(k.id)
              setLigated(false)
            }}
          >
            {k.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg key={kind.id} viewBox="0 0 240 200" className={styles.svg} role="img" aria-label={`Anastomosis ${kind.name.toLowerCase()}`}>
          {kind.vessels.map((v, i) => {
            const flow = ligated ? v.ligated : v.normal
            return (
              <g key={i} data-flow={flow}>
                <path d={v.d} className={styles.vessel} strokeWidth={v.width} />
                {flow !== 'none' && (
                  <path d={v.d} className={styles.flow} data-reverse={flow === 'reverse'} strokeWidth={Math.max(1.5, v.width / 3.5)} />
                )}
              </g>
            )
          })}
          <g className={styles.ligature} data-on={ligated} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <path d="M0 -12 L0 12" />
            <path d="M-3 -12 C-8 -18 -14 -16 -16 -22 M3 -12 C8 -18 14 -16 16 -22" />
          </g>
        </svg>

        <div className={styles.text} aria-live="polite">
          <p className={plate.kicker}>Anastomosis</p>
          <p className={plate.title}>{kind.name}</p>
          <p>{kind.description}</p>
          {kind.example && (
            <p className={styles.example}>
              <span className={styles.label}>Ejemplo.</span> {kind.example}
            </p>
          )}
          <button className={ligated ? plate.button : plate.buttonSolid} onClick={() => setLigated((l) => !l)}>
            {ligated ? 'Quitar la ligadura' : 'Ligar una arteria'}
          </button>
          {ligated && <p className={styles.note}>{kind.ligatureNote}</p>}
        </div>
      </div>
    </figure>
  )
}
