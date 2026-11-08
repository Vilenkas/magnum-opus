import { chains, layers } from '../data/cerebellar-cortex'
import { ImpulseCircuit } from './ImpulseCircuit'
import styles from './CerebellarCortex.module.css'

/** The Purkinje cell's fan, drawn whole behind the chains (the chains run along its trunk). */
const DENDRITES = [
  'M300 234 C300 200 300 170 300 140',
  'M300 214 C282 196 264 168 252 128 M300 214 C318 196 336 168 348 128',
  'M252 128 C244 108 238 84 236 50 M252 128 C258 104 262 80 262 46 M252 128 C236 116 220 100 210 74',
  'M348 128 C356 108 362 84 364 50 M348 128 C342 104 338 80 338 46 M348 128 C364 116 380 100 390 74',
  'M300 140 C290 112 284 84 282 44 M300 140 C310 112 316 84 318 44 M300 140 C300 110 300 80 300 40',
  'M210 74 C204 62 200 52 198 42 M210 74 C214 60 216 50 216 40 M390 74 C396 62 400 52 402 42 M390 74 C386 60 384 50 384 40',
  'M282 180 C272 170 266 160 262 150 M318 180 C328 170 334 160 338 150 M236 50 C230 44 226 40 224 36 M364 50 C370 44 374 40 376 36',
]

/** Granules scattered through the granular layer, from a fixed seed so the drawing never changes. */
const GRANULES = (() => {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: 140 }, () => ({ x: 50 + rnd() * 520, y: 270 + rnd() * 144, r: 2.2 + rnd() * 1.6 }))
})()

function backdrop() {
  return (
    <>
      {layers.map((l) => (
        <g key={l.id}>
          <rect x="40" y={l.top} width="540" height={l.bottom - l.top} className={styles.layer} data-layer={l.id} />
          <text x="48" y={l.top + 14} className={styles.layerName}>
            {l.name}
          </text>
        </g>
      ))}
      <line x1="40" y1="30" x2="580" y2="30" className={styles.pia} />
      <text x="572" y="24" className={styles.layerName} textAnchor="end">
        piamadre
      </text>

      {/* Other parallel fibres, seen along the folium. */}
      {[70, 90, 150, 170, 196].map((y) => (
        <line key={y} x1="40" y1={y} x2="580" y2={y} className={styles.parallel} />
      ))}
      {GRANULES.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={g.r} className={styles.granule} />
      ))}

      {/* A neighbouring Purkinje cell, faded: the parallel fibres cross it too. */}
      <g className={styles.neighbour}>
        <path d="M530 234 C530 190 530 150 530 110 M530 180 C518 150 510 120 508 80 M530 180 C542 150 550 120 552 80 M530 120 C528 90 528 70 530 50" className={styles.dendrite} />
        <ellipse cx="530" cy="245" rx="10" ry="13" className={styles.purkinje} />
        <path d="M530 258 L532 420" className={styles.axon} />
      </g>

      {DENDRITES.map((d, i) => (
        <path key={i} d={d} className={styles.dendrite} />
      ))}
      <ellipse cx="300" cy="245" rx="11" ry="14" className={styles.purkinje} />

      <ellipse cx="304" cy="542" rx="46" ry="12" className={styles.nucleus} />
      <text x="360" y="546" className={styles.layerName}>
        núcleo dentado
      </text>
    </>
  )
}

/** Lámina: what reaches the cerebellar cortex, and how it all converges on the Purkinje cell (Testut, fig. 678). */
export function CerebellarCortex() {
  return (
    <ImpulseCircuit
      caption="Lámina VII · El cerebelo histológico"
      tabsLabel="Vía"
      chains={chains}
      viewBox="40 10 540 560"
      colors={['#3b5a92']}
      backdrop={backdrop}
      ariaLabel={(c) => `Corteza del cerebelo: ${c.name.toLowerCase()}`}
    />
  )
}
