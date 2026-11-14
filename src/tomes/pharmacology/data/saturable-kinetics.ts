/**
 * Phenytoin's saturable (Michaelis–Menten) elimination, after Katzung fig. 24-4. At steady
 * state, what the liver clears equals the dose rate D: Vmax·Css / (Km + Css) = D, so
 * Css = D·Km / (Vmax − D). As the dose nears Vmax the curve bends up and runs away — small
 * increases in dose then bring large jumps in concentration. A first-order drug would rise in a
 * straight line (Css = D / CL). Parameters are schematic, in arbitrary units.
 */

export const VMAX = 100
export const KM = 40

/** Steady-state concentration of phenytoin at dose rate `d` (d < VMAX). */
export function cssSaturable(d: number): number {
  if (d >= VMAX) return Infinity
  return (d * KM) / (VMAX - d)
}

/** Clearance of the comparison first-order drug, set so both lines coincide at a low dose. */
export const CL = 20 / cssSaturable(20)

/** Steady-state concentration of a first-order drug at dose rate `d`. */
export function cssLinear(d: number): number {
  return d / CL
}

/** The therapeutic window, in the same concentration units. */
export const THERAPEUTIC = { low: 40, high: 80 }
