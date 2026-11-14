import { useState } from 'react'
import { classById } from '../data/catalog'
import { synapticClasses, targets, type Target } from '../data/synapse-targets'
import { ClassLink } from './links'
import { Plate } from './Plate'
import styles from './SynapseTargets.module.css'

const W = 520
const H = 300

// Mark position, plus where its short label sits (anchored to clear its neighbours).
type Spot = { x: number; y: number; text: string; lx: number; ly: number; a: 'start' | 'middle' | 'end' }
const POS: Record<string, Spot> = {
  sv2a: { x: 118, y: 96, text: 'SV2A', lx: 118, ly: 80, a: 'middle' },
  nav: { x: 118, y: 150, text: 'Canal Na⁺', lx: 106, ly: 150, a: 'end' },
  a2d: { x: 118, y: 204, text: 'α2δ', lx: 118, ly: 222, a: 'middle' },
  'kv7-pre': { x: 72, y: 124, text: 'Kv7', lx: 72, ly: 108, a: 'middle' },
  ampa: { x: 237, y: 116, text: 'Receptor AMPA', lx: 237, ly: 100, a: 'middle' },
  'cav-t': { x: 237, y: 188, text: 'Canal Ca²⁺ T', lx: 237, ly: 206, a: 'middle' },
  'gaba-a': { x: 358, y: 128, text: 'Receptor GABA-A', lx: 340, ly: 128, a: 'end' },
  gat1: { x: 392, y: 150, text: 'GAT-1', lx: 392, ly: 170, a: 'middle' },
  'gaba-t': { x: 410, y: 92, text: 'GABA-T', lx: 410, ly: 76, a: 'middle' },
}

/** Lámina: the molecular targets of the antiepileptics on the two synapses (Katzung fig. 24-1). */
export function SynapseTargets({ numeral = 'I' }: { numeral?: string }) {
  const [active, setActive] = useState<string | null>(null)
  const lit = (t: Target) => active === null || t.classId === active
  const shown = active ? targets.filter((t) => t.classId === active) : []

  return (
    <Plate
      numeral={numeral}
      title="Dónde actúan los antiepilépticos"
      caption="Esquema de la sinapsis excitadora (glutamato, izquierda) y la inhibidora (GABA, derecha), según Katzung fig. 24-1. Elige una familia para ver sus dianas."
    >
      <div className={styles.legend}>
        <button type="button" className={`${styles.chip} ${active === null ? styles.on : ''}`} onClick={() => setActive(null)}>
          Todas
        </button>
        {synapticClasses.map((id) => (
          <button
            key={id}
            type="button"
            className={`${styles.chip} ${active === id ? styles.on : ''}`}
            onClick={() => setActive(active === id ? null : id)}
          >
            {classById.get(id)?.title}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="Dianas moleculares de los antiepilépticos">
        {/* Excitatory: presynaptic bouton (left) and postsynaptic membrane. */}
        <g className={styles.exc}>
          <path d="M40 70 h90 v50 a40 40 0 0 1 0 60 v50 h-90 Z" className={styles.bouton} />
          <rect x={230} y={70} width={14} height={160} className={styles.postMem} />
          <text x={95} y={255} className={styles.synLabel} textAnchor="middle">
            Excitadora (glutamato)
          </text>
        </g>
        {/* Inhibitory: presynaptic bouton (right) and postsynaptic membrane. */}
        <g className={styles.inh}>
          <path d="M480 70 h-90 v50 a40 40 0 0 0 0 60 v50 h90 Z" className={styles.boutonInh} />
          <rect x={344} y={70} width={14} height={160} className={styles.postMemInh} />
          <text x={425} y={255} className={styles.synLabel} textAnchor="middle">
            Inhibidora (GABA)
          </text>
        </g>

        {targets.map((t) => {
          const p = POS[t.id]
          return (
            <g key={t.id} className={styles.target} opacity={lit(t) ? 1 : 0.22}>
              <circle cx={p.x} cy={p.y} r={8} className={t.synapse === 'excitatory' ? styles.markExc : styles.markInh} />
              <text x={p.lx} y={p.ly} className={styles.markLabel} textAnchor={p.a} dominantBaseline="central">
                {p.text}
              </text>
            </g>
          )
        })}
      </svg>

      {active && (
        <div className={styles.detail} aria-live="polite">
          <p className={styles.detailTitle}>
            <ClassLink id={active}>{classById.get(active)?.title}</ClassLink>
          </p>
          <ul className={styles.actions}>
            {shown.map((t) => (
              <li key={t.id}>
                <strong>{t.label}.</strong> {t.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Plate>
  )
}
