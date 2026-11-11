import { useState } from 'react'
import { LYMPH_GROUPS, PEDICLES, supply, territory, VESSELS, ZONES, zone, type Supply, type ZoneId } from '../data/stomach-vessels'
import plate from './skeleton/plate.module.css'
import styles from './StomachVessels.module.css'

const OUTLINE =
  'M214 72 C220 40 270 34 300 46 C345 60 360 110 352 160 C344 230 310 288 250 296 C190 302 140 262 124 214 L118 190 C140 186 170 196 184 188 C200 176 204 130 200 78 Z'

/** The zones as polygons, clipped to the outline (the cardia is a disc on top). */
const ZONE_SHAPES: Record<Exclude<ZoneId, 'cardia'>, string> = {
  lesserUpper: '150,70 214,70 250,120 250,200 150,200',
  lesserLower: '90,170 190,170 250,200 220,222 90,222',
  greaterLeft: '250,120 420,120 420,240 290,240 250,200',
  greaterRight: '90,222 220,222 250,200 290,240 420,240 420,330 90,330',
  fundus: '200,0 420,0 420,120 250,120 214,100',
}

const SUPPLY_TEXT: Record<Supply, string> = {
  direct: 'irrigada por su propia arteria',
  collateral: 'irrigada por anastomosis',
  wall: 'irrigada sólo por la red de la pared',
  lost: 'sin sangre',
}

const PRESETS: { name: string; tied: string[] }[] = [
  { name: 'Ninguna ligadura', tied: [] },
  { name: 'Coronaria estomáquica', tied: ['leftGastric'] },
  { name: 'Tronco celíaco', tied: ['celiacTrunk'] },
  { name: 'Las dos gastroepiploicas', tied: ['leftGastroepiploic', 'rightGastroepiploic'] },
  { name: 'Todos los pedículos', tied: PEDICLES },
]

const mid = (path: [number, number][]) => {
  const i = Math.floor((path.length - 1) / 2)
  const [a, b] = [path[i], path[i + 1]]
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const
}

/** Lámina: the arterial circle of the stomach with its ligatures, and its lymphatic territories. */
export function StomachVessels() {
  const [mode, setMode] = useState<'arteries' | 'lymph'>('arteries')
  const [tied, setTied] = useState<Set<string>>(new Set())
  const [picked, setPicked] = useState<ZoneId>('greaterRight')
  const [today, setToday] = useState(false)
  const state = supply(tied)
  const terr = territory(zone(picked).territory)
  const chain = terr.chain.map((id) => LYMPH_GROUPS.find((g) => g.id === id)!)
  const toggle = (id: string) =>
    setTied((t) => {
      const n = new Set(t)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const clip = 'stomach-vessels-clip'
  const fill = (z: ZoneId) => (mode === 'arteries' ? state[z] : zone(z).territory === terr.id ? 'territory' : 'none')

  return (
    <figure className={plate.plate}>
      <figcaption className={plate.caption}>Lámina VI · Las arterias y los linfáticos del estómago</figcaption>

      <div className={plate.chipBar} role="group" aria-label="Qué mostrar">
        <button className={plate.chip} data-active={mode === 'arteries'} onClick={() => setMode('arteries')}>
          Arterias y ligaduras
        </button>
        <button className={plate.chip} data-active={mode === 'lymph'} onClick={() => setMode('lymph')}>
          Territorios linfáticos
        </button>
        <span className={styles.divider} aria-hidden />
        <button className={plate.chip} data-active={today} aria-pressed={today} onClick={() => setToday((x) => !x)}>
          Nombres de hoy
        </button>
      </div>
      {mode === 'arteries' && (
        <div className={plate.chipBar} role="group" aria-label="Ligaduras">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              className={plate.chip}
              data-active={p.tied.length === tied.size && p.tied.every((id) => tied.has(id))}
              onClick={() => setTied(new Set(p.tied))}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className={styles.body}>
        <svg viewBox="0 0 420 330" className={styles.scheme} role="img" aria-label="El estómago visto por delante con sus arterias">
          <defs>
            <clipPath id={clip}>
              <path d={OUTLINE} />
            </clipPath>
          </defs>
          <ellipse cx={398} cy={104} rx={16} ry={42} className={styles.spleen} />
          <text x={398} y={156} textAnchor="middle" className={styles.small}>
            bazo
          </text>
          <path d="M205 0 L207 74" className={styles.oesophagus} />
          <path d="M118 202 L60 206" className={styles.duodenum} />
          <g clipPath={`url(#${clip})`}>
            {(Object.keys(ZONE_SHAPES) as (keyof typeof ZONE_SHAPES)[]).map((z) => (
              <polygon key={z} points={ZONE_SHAPES[z]} className={styles.zone} data-fill={fill(z)} onClick={() => setPicked(z)} />
            ))}
            <circle cx={210} cy={82} r={20} className={styles.zone} data-fill={fill('cardia')} onClick={() => setPicked('cardia')} />
          </g>
          <path d={OUTLINE} className={styles.outline} />
          {mode === 'lymph' && <circle cx={zone(picked).at[0]} cy={zone(picked).at[1]} r={6} className={styles.tumour} />}

          {/* The aorta's two stubs, the sources. */}
          <line x1={150} x2={150} y1={20} y2={330} className={styles.aorta} />
          <text x={156} y={326} className={styles.small}>
            aorta abdominal
          </text>
          <text x={232} y={10} className={styles.small}>
            aorta torácica
          </text>

          {VESSELS.map((v) => {
            const d = `M${v.path.map(([x, y]) => `${x} ${y}`).join(' L')}`
            const isTied = tied.has(v.id)
            const [mx, my] = mid(v.path)
            return (
              <g key={v.id} className={styles.vessel} data-anastomosis={!!v.anastomosis} data-dim={mode === 'lymph'}>
                <path d={d} className={styles.artery} data-tied={isTied} />
                {!v.anastomosis && mode === 'arteries' && (
                  <path d={d} className={styles.hit} onClick={() => toggle(v.id)} role="button" aria-label={`Ligar ${v.name}`}>
                    <title>{today && v.today ? `Arteria ${v.today}` : v.name}</title>
                  </path>
                )}
                {isTied && mode === 'arteries' && (
                  <rect x={mx - 6} y={my - 2.5} width={12} height={5} rx={1.5} className={styles.tie} transform={`rotate(-30 ${mx} ${my})`} />
                )}
              </g>
            )
          })}

          {mode === 'lymph' && (
            <g>
              <path d={`M${zone(picked).at.join(' ')} L${chain.map((g) => g.at.join(' ')).join(' L')}`} className={styles.chain} />
              {LYMPH_GROUPS.map((g) => (
                <circle key={g.id} cx={g.at[0]} cy={g.at[1]} r={5} className={styles.node} data-on={terr.chain.includes(g.id)}>
                  <title>{today && g.today ? `Nódulos ${g.today}` : g.name}</title>
                </circle>
              ))}
            </g>
          )}
        </svg>

        <div className={styles.read}>
          {mode === 'arteries' ? (
            <>
              <ul className={styles.zones}>
                {ZONES.map((z) => (
                  <li key={z.id}>
                    <span className={styles.swatch} data-fill={state[z.id]} />
                    <span>
                      <strong>{z.name}</strong> · {SUPPLY_TEXT[state[z.id]]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.hint}>
                {tied.size === 0
                  ? 'Haz clic en una arteria para ligarla.'
                  : `Ligadas: ${VESSELS.filter((v) => tied.has(v.id))
                      .map((v) => (today && v.today ? v.today : v.name.replace('Arteria ', '')))
                      .join(', ')}.`}
              </p>
            </>
          ) : (
            <>
              <p className={plate.kicker}>
                {zone(picked).name} · {terr.name.toLowerCase()}
              </p>
              <p className={styles.text}>{terr.text}</p>
              <ol className={styles.chainList}>
                {chain.map((g) => (
                  <li key={g.id}>{today && g.today ? `Nódulos ${g.today}` : g.name}</li>
                ))}
              </ol>
              <p className={styles.hint}>
                Haz clic en una zona del estómago para seguir su linfa. En sus bordes, los territorios se comunican: nunca son del todo independientes.
              </p>
            </>
          )}
        </div>
      </div>
    </figure>
  )
}
