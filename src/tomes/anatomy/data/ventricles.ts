/**
 * The ventricles of the brain seen from the left, as in the plaster cast of Testut's fig. 832, and
 * the course of the cerebrospinal fluid through them (Testut t. II pp. 1003–1034; Netter, lám. S-35).
 * The lateral ventricle has three portions around the thalamus, frontal, occipital and sphenoidal
 * (temporal), meeting at the crossroads; the foramen of Monro opens it into the third ventricle,
 * which the aqueduct of Sylvius joins to the fourth.
 *
 * Cavities are centrelines with a width (px) in a 600 × 360 viewBox, frontal pole on the left, at
 * SCALE px per mm; the aqueduct is drawn to Testut's 15 mm.
 */

export const SCALE = 5

export type CavityId = 'frontal' | 'crossroads' | 'occipital' | 'temporal' | 'monro' | 'third' | 'aqueduct' | 'fourth' | 'canal'

export interface Cavity {
  id: CavityId
  name: string
  modern?: string
  d: string
  width: number
  description: string
}

export const cavities: Cavity[] = [
  {
    id: 'frontal',
    name: 'Porción frontal del ventrículo lateral',
    modern: 'asta frontal y cuerpo del ventrículo lateral',
    d: 'M110 140 C150 105 230 95 340 110',
    width: 26,
    description:
      'Unos 7 cm de largo, del extremo anterior del ventrículo a la parte posterior del tálamo. Su techo es el cuerpo calloso; en su suelo, de fuera adentro, el núcleo caudado, el surco optoestriado, el tálamo óptico y el borde del trígono con los plexos coroideos; por dentro la limita el septum lucidum.',
  },
  {
    id: 'crossroads',
    name: 'Encrucijada ventricular',
    modern: 'atrio del ventrículo lateral',
    d: 'M340 110 C372 118 394 134 400 152',
    width: 34,
    description: 'La región triangular, detrás del tálamo, donde se reúnen las tres porciones del ventrículo. En ella los plexos coroideos forman a menudo un abultamiento, el glomo coroideo.',
  },
  {
    id: 'occipital',
    name: 'Porción occipital',
    modern: 'asta occipital',
    d: 'M400 152 C440 160 482 166 516 186',
    width: 16,
    description:
      'La cavidad digital, que se afila hacia el polo occipital y varía mucho de un individuo a otro. En su pared interna, dos relieves: el bulbo del asta posterior, que hace el fórceps mayor del cuerpo calloso, y el espolón de Morand, que es la cisura calcarina empujando la pared hacia el ventrículo.',
  },
  {
    id: 'temporal',
    name: 'Porción esfenoidal',
    modern: 'asta temporal',
    d: 'M400 152 C405 205 372 246 292 246 C272 246 258 240 250 232',
    width: 20,
    description:
      'Baja hacia delante, abrazando en su curva el pedúnculo cerebral y el tálamo, hasta 14 o 20 mm de la punta del lóbulo temporal. En su suelo, el asta de Ammón, que es el surco del hipocampo empujando la pared, el cuerpo franjeado y el cuerpo abollonado.',
  },
  {
    id: 'monro',
    name: 'Agujero de Monro',
    modern: 'agujero interventricular',
    d: 'M236 148 L232 176',
    width: 8,
    description: 'Entre el extremo anterior del tálamo y el pilar anterior del trígono: comunica cada ventrículo lateral con el medio, y por él pasan los plexos coroideos de un ventrículo a otro, cubiertos por el epéndimo.',
  },
  {
    id: 'third',
    name: 'Ventrículo medio',
    modern: 'tercer ventrículo',
    d: 'M222 196 C254 188 300 188 330 200',
    width: 40,
    description:
      'Una cavidad impar, muy aplanada, en forma de embudo, entre los dos tálamos ópticos, que forman sus paredes. La cruza la comisura gris; su borde anterior lo forman la comisura blanca anterior, la lámina supraóptica y el quiasma, el posterior la epífisis y la comisura blanca posterior, y su vértice se prolonga en el infundíbulo.',
  },
  {
    id: 'aqueduct',
    name: 'Acueducto de Silvio',
    modern: 'acueducto mesencefálico',
    d: 'M332 205 C350 220 368 236 392 252',
    width: 6,
    description: 'Un conducto de 15 mm de largo y 1 o 2 de ancho que une el ventrículo medio al cuarto: el paso más estrecho de todo el sistema. Basta que lo comprima un tumor de la epífisis para que los ventrículos de arriba se dilaten.',
  },
  {
    id: 'fourth',
    name: 'Cuarto ventrículo',
    d: 'M392 252 C406 262 420 278 426 298',
    width: 26,
    description: 'Entre el cerebelo y el bulbo y la protuberancia; se abre en los espacios subaracnoideos por el agujero de Magendie y los dos de Luschka.',
  },
  {
    id: 'canal',
    name: 'Conducto del epéndimo',
    modern: 'conducto central de la médula',
    d: 'M426 298 L430 340',
    width: 3,
    description: 'La continuación del sistema en la médula, casi siempre obstruido a trechos en el adulto.',
  },
]

export interface FlowStage {
  id: string
  name: string
  /** The cavity the fluid runs through, or null once it has left the ventricles. */
  cavity: CavityId | null
  d: string
  description: string
}

/** The course of the fluid, from where it is made to where it leaves the ventricles. */
export const flow: FlowStage[] = [
  {
    id: 'plexus',
    name: 'Los plexos coroideos',
    cavity: 'crossroads',
    d: 'M384 132 C364 120 334 112 300 112',
    description:
      'Los plexos coroideos, cordones vasculares que la piamadre empuja hacia el ventrículo sin perforar el epéndimo, producen el líquido: desde Faivre se tiene a su epitelio por un epitelio secretor. Los de los ventrículos laterales son los más voluminosos.',
  },
  {
    id: 'lateral',
    name: 'El ventrículo lateral',
    cavity: 'frontal',
    d: 'M300 112 C272 114 246 128 236 148',
    description: 'El líquido llena las tres porciones del ventrículo lateral y avanza por su porción frontal hacia el agujero de Monro.',
  },
  {
    id: 'monro',
    name: 'El agujero de Monro',
    cavity: 'monro',
    d: 'M236 148 L232 176',
    description: 'Por el agujero de Monro pasa al ventrículo medio. Los dos ventrículos laterales no se comunican entre sí más que a través de él: una inyección en uno llega al otro por el ventrículo medio.',
  },
  {
    id: 'third',
    name: 'El ventrículo medio',
    cavity: 'third',
    d: 'M232 176 C258 192 300 192 332 205',
    description: 'En el ventrículo medio se le suma el líquido de los plexos de su techo, que corren a lo largo de la tela coroidea superior.',
  },
  {
    id: 'aqueduct',
    name: 'El acueducto',
    cavity: 'aqueduct',
    d: 'M332 205 C350 220 368 236 392 252',
    description: 'El paso más estrecho: si el acueducto se cierra, el líquido se acumula por encima y dilata los ventrículos, la hidrocefalia.',
  },
  {
    id: 'fourth',
    name: 'El cuarto ventrículo',
    cavity: 'fourth',
    d: 'M392 252 C406 262 418 278 424 294',
    description: 'El cuarto ventrículo recibe aún el líquido de sus propios plexos.',
  },
  {
    id: 'apertures',
    name: 'Las aberturas',
    cavity: null,
    d: 'M424 294 C434 304 452 310 480 312 C510 314 540 300 560 270',
    description:
      'Por el agujero de Magendie y los de Luschka el líquido sale a los espacios subaracnoideos, la cisterna magna primero, y rodea el encéfalo y la médula. Testut dudaba aún de que estos orificios existieran; hoy son la vía conocida, y el líquido se reabsorbe en las granulaciones aracnoideas del seno sagital superior.',
  },
]

/** Start and end of a path of absolute commands. */
export function ends(d: string): { start: [number, number]; end: [number, number] } {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  return { start: [n[0], n[1]], end: [n[n.length - 2], n[n.length - 1]] }
}
