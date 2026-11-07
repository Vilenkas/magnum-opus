import { circuits } from '../data/nerve-circuits'
import { ImpulseCircuit, type Chain } from './ImpulseCircuit'
import styles from './NerveCircuits.module.css'

/** As in Testut's figs. 471–472: the first neuron of each chain blue, the motor neuron red. */
const COLORS = ['#3b5a92', '#b8322a']

/** Brain (coronal), brainstem and the cord in cross-section, with roots, skin and muscle on the right. */
function backdrop(chain: Chain, stage: Chain['stages'][number]) {
  const voluntary = chain.id === 'voluntary'
  return (
    <>
      <g className={styles.anatomy} data-dim={!voluntary}>
        <path d="M300 34 C230 26 160 48 146 108 C136 152 168 190 214 196 C246 200 270 196 284 200 L284 214 M300 34 C370 26 440 48 454 108 C464 152 432 190 386 196 C354 200 330 196 316 200 L316 214" className={styles.brain} />
        <path d="M300 36 L300 150" className={styles.fissure} />
        <path d="M210 70 C220 84 226 96 226 110 M390 70 C380 84 374 96 374 110" className={styles.cortex} />
        <path d="M284 200 C284 236 288 258 290 290 L292 368 M316 200 C316 236 312 258 310 290 L308 368" className={styles.stem} />
        <text x="300" y="232" className={styles.label}>
          bulbo
        </text>
      </g>
      <circle cx="300" cy="420" r="52" className={styles.cord} />
      <path
        d="M300 404 C292 392 284 380 282 368 M300 404 C308 392 316 380 318 368 M300 404 L300 432 M300 432 C288 436 272 446 270 462 C282 466 294 452 300 442 M300 432 C312 436 328 446 332 462 C318 466 306 452 300 442"
        className={styles.grey}
      />
      <text x="300" y="490" className={styles.label}>
        médula
      </text>
      <path d="M346 394 C362 386 380 380 398 374 M342 452 C360 468 384 480 412 488" className={styles.root} />
      <ellipse cx="406" cy="372" rx="16" ry="10" className={styles.ganglion} />
      <path d="M530 296 C546 290 560 290 570 296 L570 318 C560 312 546 312 530 318 Z" className={styles.skin} data-dim={voluntary} />
      <text x="548" y="286" className={styles.label} data-dim={voluntary}>
        piel
      </text>
      <path d="M528 506 L568 524 L560 548 L520 530 Z" className={styles.muscle} data-active={stage.kind === 'effector'} />
      <text x="560" y="568" className={styles.label}>
        músculo
      </text>
    </>
  )
}

/** Lámina: the neurons of a reflex and of a voluntary movement, with the impulse running through them. */
export function NerveCircuits() {
  return (
    <ImpulseCircuit
      caption="Lámina I · Dos neuronas para un movimiento"
      tabsLabel="Movimiento"
      chains={circuits}
      viewBox="80 20 500 560"
      colors={COLORS}
      backdrop={backdrop}
      ariaLabel={(c) => `Esquema del ${c.name.toLowerCase()}`}
    />
  )
}
