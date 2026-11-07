/**
 * The two chains of neurons Testut draws in figs. 471 and 472 (t. II pp. 594–596): a voluntary
 * movement (a pyramidal cell of the motor cortex and a radicular cell of the anterior horn) and a
 * reflex (a sensory cell of the spinal ganglion and the same motor cell). Each stretch is a part of
 * one neuron, or the synapse between two, in the order the impulse runs through it.
 */
export type CircuitId = 'reflex' | 'voluntary'
export type PartKind = 'receptor' | 'dendrite' | 'cell' | 'axon' | 'synapse' | 'effector'

export interface NeuronInfo {
  name: string
  role: string
  /** Its colour in the plate, when the plate doesn't give one per position. */
  color?: string
}

export interface CircuitStage {
  id: string
  name: string
  kind: PartKind
  /** Index into the circuit's neurons; the synapse belongs to the neuron it reaches. */
  neuron: number
  /** SVG path in the plate's 600 × 600 viewBox, drawn in the direction of the impulse. */
  d: string
  description: string
}

export interface Circuit {
  id: CircuitId
  name: string
  figure: string
  neurons: NeuronInfo[]
  stages: CircuitStage[]
}

/** Shared: the anterior horn cell and its axon to the muscle, the final common path. */
const MOTOR_CELL = 'M332 448 C336 452 336 456 334 460'
const MOTOR_AXON = 'M334 460 C356 476 384 484 412 488 C462 496 506 506 536 516'
const MUSCLE = 'M536 516 C548 520 556 526 562 534'

export const circuits: Circuit[] = [
  {
    id: 'reflex',
    name: 'Movimiento reflejo',
    figure: 'fig. 472',
    neurons: [
      { name: 'Neurona sensitiva', role: 'célula del ganglio raquídeo' },
      { name: 'Neurona motora', role: 'célula radicular del asta anterior' },
    ],
    stages: [
      {
        id: 'skin',
        name: 'La piel',
        kind: 'receptor',
        neuron: 0,
        d: 'M552 300 C548 304 544 308 540 312',
        description: 'Una impresión llega a la piel: es el punto de partida del reflejo.',
      },
      {
        id: 'sensory-dendrite',
        name: 'Prolongación periférica',
        kind: 'dendrite',
        neuron: 0,
        d: 'M540 312 C500 330 460 352 420 368',
        description:
          'La fibra sensitiva lleva la impresión de la periferia hacia su célula: aunque parece un cilindroeje, por el sentido de la corriente es una prolongación protoplasmática.',
      },
      {
        id: 'ganglion',
        name: 'Célula del ganglio raquídeo',
        kind: 'cell',
        neuron: 0,
        d: 'M420 368 C410 370 404 372 398 374',
        description: 'El cuerpo de la neurona sensitiva, en el ganglio de la raíz posterior: una célula en T, primitivamente bipolar.',
      },
      {
        id: 'sensory-axon',
        name: 'Raíz posterior',
        kind: 'axon',
        neuron: 0,
        d: 'M398 374 C376 380 356 384 336 396 C330 400 326 404 324 410',
        description: 'La prolongación central entra en la médula por la raíz posterior y se resuelve en un ramillete de fibrillas libres.',
      },
      {
        id: 'reflex-synapse',
        name: 'Articulación',
        kind: 'synapse',
        neuron: 1,
        d: 'M324 410 C326 422 330 436 332 448',
        description:
          'Esas fibrillas rodean la célula motora y se articulan con sus dendritas, sin continuidad: por contacto, la vibración pasa de una neurona a otra y la impresión sensitiva se transforma en incitación motriz.',
      },
      { id: 'reflex-motor-cell', name: 'Célula del asta anterior', kind: 'cell', neuron: 1, d: MOTOR_CELL, description: 'La neurona motora recibe la excitación y la refleja hacia la periferia.' },
      { id: 'reflex-motor-axon', name: 'Raíz anterior', kind: 'axon', neuron: 1, d: MOTOR_AXON, description: 'Su cilindroeje sale por la raíz anterior y llega al músculo.' },
      { id: 'reflex-muscle', name: 'El músculo se contrae', kind: 'effector', neuron: 1, d: MUSCLE, description: 'El cilindroeje termina en la placa motriz y el músculo se contrae, sin que haya intervenido la voluntad.' },
    ],
  },
  {
    id: 'voluntary',
    name: 'Movimiento voluntario',
    figure: 'fig. 471',
    neurons: [
      { name: 'Neurona central', role: 'célula piramidal de la corteza motriz' },
      { name: 'Neurona periférica', role: 'célula radicular del asta anterior' },
    ],
    stages: [
      {
        id: 'pyramidal',
        name: 'Célula piramidal',
        kind: 'cell',
        neuron: 0,
        d: 'M222 92 C223 98 224 104 226 110',
        description: 'Una incitación motriz nace en una célula piramidal de la corteza cerebral motora.',
      },
      {
        id: 'pyramidal-axon',
        name: 'Vía piramidal',
        kind: 'axon',
        neuron: 0,
        d: 'M226 110 C236 158 270 196 286 232 L292 256',
        description: 'Su cilindroeje desciende por el cerebro y el tronco del encéfalo hacia la médula.',
      },
      {
        id: 'decussation',
        name: 'Entrecruzamiento',
        kind: 'axon',
        neuron: 0,
        d: 'M292 256 C298 268 306 276 314 286',
        description: 'En el bulbo la vía cruza la línea media: la corteza de un lado gobierna los músculos del lado opuesto.',
      },
      {
        id: 'cord-descent',
        name: 'Cordón lateral',
        kind: 'axon',
        neuron: 0,
        d: 'M314 286 L320 372 C322 388 334 400 340 414',
        description: 'Desciende por la médula hasta el segmento que mueve el músculo, y allí termina en un ramillete de fibrillas.',
      },
      {
        id: 'voluntary-synapse',
        name: 'Articulación',
        kind: 'synapse',
        neuron: 1,
        d: 'M340 414 C338 426 334 438 332 448',
        description: 'Las fibrillas terminales se ponen en contacto con las dendritas de una célula del asta anterior y le transmiten la excitación.',
      },
      { id: 'voluntary-motor-cell', name: 'Célula del asta anterior', kind: 'cell', neuron: 1, d: MOTOR_CELL, description: 'Puesta en actividad, la segunda neurona remite la incitación hacia el músculo.' },
      { id: 'voluntary-motor-axon', name: 'Raíz anterior', kind: 'axon', neuron: 1, d: MOTOR_AXON, description: 'Su cilindroeje sale por la raíz anterior.' },
      { id: 'voluntary-muscle', name: 'El músculo se contrae', kind: 'effector', neuron: 1, d: MUSCLE, description: 'La incitación llega a la placa motriz y el músculo, que la ha recibido de la voluntad, se contrae.' },
    ],
  },
]

export const kindLabel: Record<PartKind, string> = {
  receptor: 'Receptor',
  dendrite: 'Dendrita',
  cell: 'Cuerpo celular',
  axon: 'Cilindroeje',
  synapse: 'Sinapsis',
  effector: 'Efector',
}

/** Start and end of an SVG path made of absolute commands. */
export function pathEnds(d: string): { start: [number, number]; end: [number, number] } {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return { start: [n[0], n[1]], end: [n[n.length - 2], n[n.length - 1]] }
}

/** Every x coordinate of a path (control points included): enough to tell its side of the midline. */
export const pathXs = (d: string) => d.match(/-?\d+(\.\d+)?/g)!.map(Number).filter((_, i) => i % 2 === 0)
