/**
 * Katzung's fig. 22-1, schematic: CNS depression against dose for two sedative-hypnotics.
 * Drug A (barbiturates, the old hypnotics) deepens in a straight line, from sedation through
 * anaesthesia to coma; drug B (benzodiazepines, the newer hypnotics with their mechanism) bends
 * away, and needs ever larger increments to go beyond hypnosis.
 */

/** Effect on a 0–100 scale; the stages begin at these levels. */
export const STAGES = [
  { id: 'sedation', title: 'Sedación', from: 20 },
  { id: 'hypnosis', title: 'Hipnosis', from: 40 },
  { id: 'anaesthesia', title: 'Anestesia', from: 68 },
  { id: 'coma', title: 'Coma', from: 88 },
] as const

export type StageId = (typeof STAGES)[number]['id'] | 'none'

/** Dose runs from 0 to 100 (arbitrary units). */
export const MAX_DOSE = 100

export const drugA = (dose: number) => dose
export const drugB = (dose: number) => 52 * (1 - Math.exp(-dose / 22)) + 0.1 * dose

export function stageAt(effect: number): StageId {
  let stage: StageId = 'none'
  for (const s of STAGES) if (effect >= s.from) stage = s.id
  return stage
}
