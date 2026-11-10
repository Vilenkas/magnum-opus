import { useMemo, useState } from 'react'
import { BRACHIAL, LUMBOSACRAL, outcome, reaches, rootsCut, signsOf, type Plexus, type PlexusNode, type Status } from '../data/plexuses'
import plate from './skeleton/plate.module.css'
import styles from './PlexusLesions.module.css'

const W = 600
const H = 380

const MARK: Record<Status, string> = { ok: '·', weak: '◐', lost: '✕' }
const SAY: Record<Status, string> = {
  ok: 'normal',
  weak: 'débil',
  lost: 'paralizado',
}
const SAY_REFLEX: Record<Status, string> = {
  ok: 'normal',
  weak: 'disminuido',
  lost: 'abolido',
}

/** How many roots still feed a node, out of how many feed it intact. */
function feed(p: Plexus, n: PlexusNode, l: Parameters<typeof reaches>[4]) {
  const all = p.roots.filter((r) => reaches(p, r, n.id, 0, null))
  const now = all.filter((r) => reaches(p, r, n.id, 0, l))
  return now.length === all.length ? 'ok' : now.length === 0 ? 'lost' : 'weak'
}

/** A plate where a lesion anywhere along a plexus is read off its graph: muscles, reflexes, skin and signs. */
export function PlexusLesions({ plexus: p }: { plexus: Plexus }) {
  const [id, setId] = useState(p.lesions[0].id)
  const l = p.lesions.find((x) => x.id === id)!
  const o = useMemo(() => outcome(p, l), [p, l])
  const signs = signsOf(p, o)
  const nodes = new Map(p.nodes.map((n) => [n.id, n]))
  const X = (n: PlexusNode) => 20 + n.x * (W - 150)
  const Y = (n: PlexusNode) => 14 + n.y * (H - 28)
  const regions = [...new Set(p.muscles.map((m) => m.region))]
  const roots = rootsCut(p, l)
  const lostSkin = p.skin.filter((a) => o.skin.get(a.id) === 'lost')
  const level = l.at === undefined ? null : [...p.levels].reverse().find((v) => v.at <= l.at!)

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>{p.caption}</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Lugar de la lesión">
        {p.lesions.map((x) => (
          <button key={x.id} className={plate.chip} data-active={x.id === id} onClick={() => setId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.graph} role="img" aria-label={`El plexo de sus raíces a sus nervios, con la lesión: ${l.name}`}>
          {p.nodes.flatMap((n) =>
            n.from.map((f) => {
              const a = nodes.get(f)!
              return <line key={`${f}-${n.id}`} x1={X(a)} y1={Y(a)} x2={X(n)} y2={Y(n)} className={styles.edge} data-status={feed(p, n, l)} />
            }),
          )}
          {p.nodes.map((n) => {
            const st = feed(p, n, l)
            const hit = l.nodes.includes(n.id)
            const labelled = n.kind !== 'division'
            const right = n.kind === 'nerve'
            return (
              <g key={n.id} className={styles.node} data-kind={n.kind} data-status={hit && l.at !== undefined ? 'weak' : st}>
                <title>{n.name}</title>
                <circle cx={X(n)} cy={Y(n)} r={n.kind === 'root' ? 9 : n.kind === 'division' ? 2.5 : 4} />
                {n.kind === 'root' && (
                  <text x={X(n)} y={Y(n) + 3.2} textAnchor="middle" className={styles.rootText}>
                    {n.name}
                  </text>
                )}
                {labelled && n.kind !== 'root' && (
                  <text x={X(n) + (right ? 7 : 0)} y={Y(n) + (right ? 3 : -10)} textAnchor={right ? 'start' : 'middle'} className={styles.label}>
                    {n.name}
                  </text>
                )}
                {hit && (
                  <g transform={`translate(${X(n) + (n.kind === 'root' ? 0 : -1)} ${Y(n)})`} className={styles.lesion}>
                    <circle r={n.kind === 'root' ? 13 : 7} />
                    <path d="M-5 -5 L5 5 M5 -5 L-5 5" />
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        <div className={styles.lists}>
          <section className={styles.muscles}>
            <h4 className={styles.head}>Músculos</h4>
            {regions.map((r) => (
              <div key={r} className={styles.group}>
                <p className={styles.region}>{r}</p>
                <ul className={styles.list}>
                  {p.muscles
                    .filter((m) => m.region === r)
                    .map((m) => {
                      const st = o.muscles.get(m.id)!
                      return (
                        <li key={m.id} data-status={st} title={SAY[st]}>
                          <span className={styles.mark} aria-hidden>
                            {MARK[st]}
                          </span>
                          {m.name}
                          {st !== 'ok' && <span className={styles.say}> · {SAY[st]}</span>}
                        </li>
                      )
                    })}
                </ul>
              </div>
            ))}
          </section>
          <section>
            <h4 className={styles.head}>Reflejos</h4>
            <ul className={styles.list}>
              {p.reflexes.map((r) => {
                const st = o.reflexes.get(r.id)!
                return (
                  <li key={r.id} data-status={st}>
                    <span className={styles.mark} aria-hidden>
                      {MARK[st]}
                    </span>
                    {r.name} ({r.roots.join(', ')}) · {SAY_REFLEX[st]}
                  </li>
                )
              })}
            </ul>
            <h4 className={styles.head}>Anestesia</h4>
            {lostSkin.length ? (
              <ul className={styles.list}>
                {lostSkin.map((a) => (
                  <li key={a.id} data-status="lost">
                    <span className={styles.mark} aria-hidden>
                      ✕
                    </span>
                    {a.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.none}>Ninguna zona de piel queda insensible.</p>
            )}
          </section>
        </div>
      </div>

      <div className={plate.legend} aria-live="polite">
        <p className={plate.kicker}>{roots.length ? 'Lesión radicular' : level ? `Lesión de un nervio · ${level.name}` : 'Lesión del plexo o de un nervio'}</p>
        <p className={plate.title}>{l.name}</p>
        <p className={styles.text}>{l.cause}</p>
        {signs.length > 0 && (
          <ul className={styles.signs}>
            {signs.map((sg) => (
              <li key={sg.id}>
                <strong>{sg.name}.</strong> {sg.text}
              </li>
            ))}
          </ul>
        )}
        <p className={plate.hint}>
          {roots.length
            ? `Cada músculo recibe fibras de varias raíces y cada raíz va a muchos músculos: ${roots.length === 1 ? 'una raíz sola debilita, no paraliza' : 'sólo se paraliza lo que dependía únicamente de estas raíces'}.${lostSkin.length ? '' : ` Tampoco anestesia: las raíces vecinas cubren su piel, y ${roots.length === 1 ? 'su dermatoma sólo pierde' : 'sus dermatomas sólo pierden'} algo de sensibilidad: ${roots.map((r) => `${r}, ${p.dermatomes[r]}`).join('; ')}.`}`
            : 'Se pierde lo que recibía fibras sólo por el lugar cortado; los ramos que salen del nervio antes de la lesión se salvan. Nada de la lista se escribe a mano: sale del grafo.'}
        </p>
      </div>
    </figure>
  )
}

export const BrachialPlexus = () => <PlexusLesions plexus={BRACHIAL} />
export const LumbosacralPlexus = () => <PlexusLesions plexus={LUMBOSACRAL} />
