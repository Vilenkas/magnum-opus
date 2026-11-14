import { useId, useMemo, useState } from 'react'
import { childrenOf, classById, drugById } from '../data/catalog'
import { bindingOf, bindings, expectedEffects, gradeWord, RECEPTORS, TRANSPORTERS, type Target } from '../data/antidepressant-binding'
import { DrugLink } from './links'
import { Plate } from './Plate'
import styles from './MonoamineSynapse.module.css'

const W = 520
const H = 300

/** Drugs of the table grouped by their class, in the classification's order. */
function useGroups() {
  return useMemo(() => {
    const ids = bindings.flatMap((b) => b.ids)
    const leaves = (id: string): string[] => {
      const kids = childrenOf(id)
      return kids.length ? kids.flatMap((k) => leaves(k.id)) : [id]
    }
    return leaves('antidepressants')
      .map((cls) => ({ cls, ids: ids.filter((d) => drugById.get(d)!.classes[0] === cls) }))
      .filter((g) => g.ids.length)
  }, [])
}

/** Dots of transmitter in the cleft: a baseline, more the more its transporter is blocked. */
function cleftDots(level: number | null, seed: number, x0: number, x1: number) {
  const n = 4 + Math.round((level ?? 0) * 4)
  return Array.from({ length: n }, (_, i) => {
    const r = Math.sin(seed * 97 + i * 12.9898) * 43758.5453
    const f = r - Math.floor(r)
    const g = Math.sin(seed * 31 + i * 78.233) * 12345.678
    return { x: x0 + (x1 - x0) * f, y: 132 + 36 * (g - Math.floor(g)) }
  })
}

/** Lámina: a serotonin–noradrenaline synapse; pick an antidepressant and see what it blocks. */
export function MonoamineSynapse({ numeral = 'I' }: { numeral?: string }) {
  const groups = useGroups()
  const [id, setId] = useState('fluoxetine')
  const selectId = useId()
  const b = bindingOf(id)!
  const lv = (t: Target) => b.levels[t]
  const effects = expectedEffects(b)
  const block = (t: Target) => (lv(t) ?? 0) / 3

  return (
    <Plate
      numeral={numeral}
      title="Qué bloquea cada antidepresivo"
      caption="Esquema de una sinapsis monoaminérgica con las afinidades del cuadro 30-2 de Katzung (0 a +++). Bloquear los transportadores acumula serotonina o noradrenalina en la hendidura: es el efecto antidepresivo. Bloquear los receptores de abajo explica casi todos los efectos adversos."
    >
      <label htmlFor={selectId} className={styles.label}>
        Antidepresivo
      </label>
      <select id={selectId} className={styles.select} value={id} onChange={(e) => setId(e.target.value)}>
        {groups.map((g) => (
          <optgroup key={g.cls} label={classById.get(g.cls)!.title}>
            {g.ids.map((d) => (
              <option key={d} value={d}>
                {drugById.get(d)!.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={`Sinapsis con ${drugById.get(id)!.name}`}>
        {/* Presynaptic terminal */}
        <path d="M60 20 h400 v70 q0 30 -30 30 h-340 q-30 0 -30 -30 Z" className={styles.pre} />
        <text x={260} y={42} textAnchor="middle" className={styles.part}>
          Terminal presináptica
        </text>
        {/* Transporters: SERT left, NET right, a plug growing with the block */}
        {TRANSPORTERS.map((t, i) => {
          const x = i === 0 ? 170 : 350
          return (
            <g key={t.id}>
              <rect x={x - 16} y={98} width={32} height={26} rx={6} className={i === 0 ? styles.sert : styles.net} />
              <circle cx={x} cy={111} r={4 + 9 * block(t.id)} className={styles.plug} opacity={block(t.id) ? 0.85 : 0} />
              <text x={x} y={88} textAnchor="middle" className={styles.tLabel}>
                {i === 0 ? 'SERT' : 'NET'} · {gradeWord(lv(t.id))}
              </text>
            </g>
          )
        })}
        {/* Transmitter in the cleft */}
        {cleftDots(lv('sert'), 1, 90, 250).map((p, i) => (
          <circle key={`s${i}`} cx={p.x} cy={p.y} r={4} className={styles.serotonin} />
        ))}
        {cleftDots(lv('net'), 2, 270, 430).map((p, i) => (
          <circle key={`n${i}`} cx={p.x} cy={p.y} r={4} className={styles.noradrenaline} />
        ))}
        {/* Postsynaptic membrane with the four receptors */}
        <rect x={60} y={182} width={400} height={18} rx={4} className={styles.post} />
        <text x={260} y={248} textAnchor="middle" className={styles.part}>
          Membrana postsináptica y otros receptores
        </text>
        {RECEPTORS.map((r, i) => {
          const x = 110 + i * 100
          const v = lv(r.id)
          return (
            <g key={r.id}>
              <rect x={x - 18} y={176} width={36} height={30} rx={5} className={styles.receptor} style={{ ['--b' as string]: (v ?? 0) / 3 }} />
              <text x={x} y={195} textAnchor="middle" className={styles.rText}>
                {r.id === 'm' ? 'M' : r.id === 'a1' ? 'α1' : r.id === 'h1' ? 'H1' : '5-HT2'}
              </text>
              <text x={x} y={222} textAnchor="middle" className={styles.grade}>
                {gradeWord(v)}
              </text>
            </g>
          )
        })}
        <g className={styles.key}>
          <circle cx={90} cy={280} r={4} className={styles.serotonin} />
          <text x={100} y={284}>serotonina</text>
          <circle cx={190} cy={280} r={4} className={styles.noradrenaline} />
          <text x={200} y={284}>noradrenalina</text>
          <circle cx={310} cy={280} r={6} className={styles.plug} />
          <text x={322} y={284}>bloqueo</text>
        </g>
      </svg>

      <div className={styles.readout} aria-live="polite">
        <p className={styles.drugLine}>
          <DrugLink id={id} /> · {classById.get(drugById.get(id)!.classes[0])!.title}
        </p>
        {effects.length ? (
          <ul className={styles.effects}>
            {effects.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.none}>No bloquea de forma apreciable los receptores de los efectos antimuscarínicos, hipotensores ni sedantes.</p>
        )}
      </div>
    </Plate>
  )
}
