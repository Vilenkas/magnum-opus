/**
 * The double circulation as Testut draws it in his fig. 1 (t. II, pp. 1–2): a figure of
 * eight with the heart at the crossing, the lungs above and the rest of the body below.
 * Each stage is one stretch of the drop's path, in the order the blood runs through it.
 */
export type Blood = 'arterial' | 'venous'
export type Circuit = 'major' | 'minor'
export type StageKind = 'chamber' | 'artery' | 'capillaries' | 'vein'

export interface CirculationStage {
  id: string
  name: string
  kind: StageKind
  /** The circuit this stretch belongs to: the major runs from the left ventricle to the right atrium. */
  circuit: Circuit
  /** Blood entering and leaving the stretch: only the capillaries change it. */
  bloodIn: Blood
  bloodOut: Blood
  /** SVG path in the plate's 600×600 viewBox, drawn in the direction of the flow. */
  d: string
  description: string
}

export const stages: CirculationStage[] = [
  {
    id: 'lv',
    name: 'Ventrículo izquierdo',
    kind: 'chamber',
    circuit: 'major',
    bloodIn: 'arterial',
    bloodOut: 'arterial',
    d: 'M342 300 C350 322 362 318 380 314',
    description: 'Se contrae y expulsa la sangre arterial a la aorta: aquí empieza la circulación mayor.',
  },
  {
    id: 'aorta',
    name: 'Aorta',
    kind: 'artery',
    circuit: 'major',
    bloodIn: 'arterial',
    bloodOut: 'arterial',
    d: 'M380 314 C460 314 520 326 520 384 L520 470 C520 505 490 522 450 522',
    description: 'Una gruesa arteria que reparte la sangre arterial por todas las partes del cuerpo.',
  },
  {
    id: 'body-capillaries',
    name: 'Capilares generales',
    kind: 'capillaries',
    circuit: 'major',
    bloodIn: 'arterial',
    bloodOut: 'venous',
    d: 'M450 522 C415 492 375 552 335 522 S265 492 225 522 S175 540 150 522',
    description:
      'En contacto con los tejidos, la sangre les cede lo que necesitan para nutrirse y funcionar, y recibe a cambio los productos de su desasimilación: se vuelve venosa.',
  },
  {
    id: 'venae-cavae',
    name: 'Venas cavas',
    kind: 'vein',
    circuit: 'major',
    bloodIn: 'venous',
    bloodOut: 'venous',
    d: 'M150 522 C110 522 80 505 80 470 L80 262 C80 240 92 234 120 234 L222 234',
    description: 'Devuelven la sangre venosa de todo el cuerpo a la aurícula derecha, donde termina la circulación mayor.',
  },
  {
    id: 'ra',
    name: 'Aurícula derecha',
    kind: 'chamber',
    circuit: 'major',
    bloodIn: 'venous',
    bloodOut: 'venous',
    d: 'M222 234 L258 234 L258 300',
    description: 'Recibe las venas cavas y pasa la sangre al ventrículo derecho por el orificio auriculoventricular.',
  },
  {
    id: 'rv',
    name: 'Ventrículo derecho',
    kind: 'chamber',
    circuit: 'minor',
    bloodIn: 'venous',
    bloodOut: 'venous',
    d: 'M258 300 C262 328 296 326 300 290',
    description: 'Impulsa la sangre venosa a la arteria pulmonar: aquí empieza la circulación menor.',
  },
  {
    id: 'pulmonary-artery',
    name: 'Arteria pulmonar',
    kind: 'artery',
    circuit: 'minor',
    bloodIn: 'venous',
    bloodOut: 'venous',
    d: 'M300 290 L300 186 C300 140 180 148 180 92',
    description:
      'Arterial por su origen, su estructura y su modo de dividirse, lleva sin embargo sangre venosa: los antiguos la llamaban «vena arterial».',
  },
  {
    id: 'lung-capillaries',
    name: 'Capilares pulmonares',
    kind: 'capillaries',
    circuit: 'minor',
    bloodIn: 'venous',
    bloodOut: 'arterial',
    d: 'M180 92 C210 62 250 122 290 92 S350 62 380 92 S410 110 420 92',
    description:
      'Junto a los alvéolos, en contacto con el aire de cada inspiración, la sangre se despoja del ácido carbónico y se carga de oxígeno: es la hematosis.',
  },
  {
    id: 'pulmonary-veins',
    name: 'Venas pulmonares',
    kind: 'vein',
    circuit: 'minor',
    bloodIn: 'arterial',
    bloodOut: 'arterial',
    d: 'M420 92 C466 92 486 118 486 170 L486 210 C486 228 476 234 456 234 L378 234',
    description: 'Cuatro venas, dos por pulmón, que llevan la sangre ya arterial a la aurícula izquierda.',
  },
  {
    id: 'la',
    name: 'Aurícula izquierda',
    kind: 'chamber',
    circuit: 'minor',
    bloodIn: 'arterial',
    bloodOut: 'arterial',
    d: 'M378 234 L342 234 L342 300',
    description:
      'Termina la circulación menor y pasa la sangre al ventrículo izquierdo, su punto de partida: la revolución está completa.',
  },
]

export const circuitName: Record<Circuit, string> = {
  major: 'Circulación mayor o general',
  minor: 'Circulación menor o pulmonar',
}

export const bloodName: Record<Blood, string> = { arterial: 'Sangre arterial', venous: 'Sangre venosa' }

/** Start and end of an SVG path made of absolute commands: enough to check the loop closes. */
export function pathEnds(d: string): { start: [number, number]; end: [number, number] } {
  const numbers = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return { start: [numbers[0], numbers[1]], end: [numbers[numbers.length - 2], numbers[numbers.length - 1]] }
}
