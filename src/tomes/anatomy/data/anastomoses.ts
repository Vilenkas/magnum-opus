/**
 * The five kinds of arterial anastomosis in Testut's fig. 118 (t. II, pp. 161–162), drawn as
 * vessels with a flow, and what happens to that flow when one of them is tied off.
 */
export type Flow = 'forward' | 'reverse' | 'none'

export interface Vessel {
  /** SVG path in a 240×200 viewBox, drawn in the direction of the normal flow. */
  d: string
  /** Stroke width: trunks are thicker than the anastomotic branch. */
  width: number
  normal: Flow
  ligated: Flow
}

export interface AnastomosisKind {
  id: string
  name: string
  description: string
  example?: string
  /** What the ligature shows. */
  ligatureNote: string
  /** Where the thread is tied, and the direction of the vessel there (degrees). */
  ligature: { x: number; y: number; angle: number }
  vessels: Vessel[]
}

const TRUNK = 9
const BRANCH = 6
const TWIG = 3.5

export const anastomoses: AnastomosisKind[] = [
  {
    id: 'inosculation',
    name: 'Por inosculación',
    description: 'Dos arterias van una al encuentro de la otra y se unen boca a boca, formando un arco.',
    example:
      'Las dos gastroepiploicas, a lo largo de la curvatura mayor del estómago; la facial con la nasal, la cubital con la radiopalmar, las coronarias de los labios.',
    ligatureNote: 'Ligada una de las dos, la otra llena todo el arco y riega también el territorio de la primera.',
    ligature: { x: 200, y: 44, angle: 90 },
    vessels: [
      { d: 'M40 14 C40 120 70 168 120 168', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M200 14 L200 44', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M200 44 C200 120 170 168 120 168', width: TRUNK, normal: 'forward', ligated: 'reverse' },
      { d: 'M64 150 L50 190', width: TWIG, normal: 'forward', ligated: 'forward' },
      { d: 'M100 166 L96 194', width: TWIG, normal: 'forward', ligated: 'forward' },
      { d: 'M140 166 L144 194', width: TWIG, normal: 'forward', ligated: 'forward' },
      { d: 'M176 150 L190 190', width: TWIG, normal: 'forward', ligated: 'forward' },
    ],
  },
  {
    id: 'transverse',
    name: 'Transversal',
    description:
      'Un vaso corto une dos arterias casi paralelas, implantado más o menos perpendicularmente sobre cada una de ellas.',
    example: 'La comunicante anterior, que une las dos cerebrales anteriores bajo la rodilla del cuerpo calloso.',
    ligatureNote:
      'Ligada una de las dos por debajo de la anastomosis, la otra le envía sangre a través del vaso transversal.',
    ligature: { x: 80, y: 150, angle: 90 },
    vessels: [
      { d: 'M80 194 L80 150', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M80 150 L80 100', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M80 100 L80 8', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M160 194 L160 100', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M160 100 L160 8', width: TRUNK, normal: 'forward', ligated: 'forward' },
      // Drawn right to left: in the intact state pressures balance and nothing crosses.
      { d: 'M160 100 L80 100', width: BRANCH, normal: 'none', ligated: 'forward' },
    ],
  },
  {
    id: 'convergence',
    name: 'Por convergencia',
    description: 'Dos arterias marchan oblicuamente la una hacia la otra y se unen para formar un solo tronco.',
    example: 'Las dos vertebrales, que se fusionan al entrar en el cráneo para formar el tronco basilar.',
    ligatureNote: 'Ligada una de las dos, el tronco común sigue recibiendo sangre de la otra.',
    ligature: { x: 63, y: 158, angle: 80 },
    vessels: [
      { d: 'M60 194 L63 158', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M63 158 C70 124 120 124 120 96', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M180 194 C177 140 120 124 120 96', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M120 96 L120 8', width: TRUNK + 2, normal: 'forward', ligated: 'forward' },
    ],
  },
  {
    id: 'longitudinal',
    name: 'Longitudinal',
    description:
      'Una arteria se divide en dos ramas que siguen un trayecto casi paralelo y se vuelven a unir, encerrando un espacio elíptico u oval.',
    ligatureNote: 'Ligada una de las dos ramas, la otra basta para reconstituir el tronco.',
    ligature: { x: 82, y: 100, angle: 90 },
    vessels: [
      { d: 'M120 196 L120 154', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M120 154 C86 140 82 120 82 100', width: BRANCH, normal: 'forward', ligated: 'none' },
      { d: 'M82 100 C82 80 86 60 120 46', width: BRANCH, normal: 'forward', ligated: 'none' },
      { d: 'M120 154 C154 140 158 120 158 100 C158 80 154 60 120 46', width: BRANCH, normal: 'forward', ligated: 'forward' },
      { d: 'M120 46 L120 4', width: TRUNK, normal: 'forward', ligated: 'forward' },
    ],
  },
  {
    id: 'vas-aberrans',
    name: 'Vas aberrans',
    description:
      'Una de las ramas, mucho más pequeña que la otra, parece una simple colateral, pero en vez de distribuirse vuelve al tronco o a una de sus ramas: es una «arteria desviada».',
    example: 'Un vas aberrans que nace de la humeral y va a terminar en la radial.',
    ligatureNote:
      'Ligada la humeral por debajo de su origen, el vas aberrans lleva la sangre a la radial, y por ella, a contracorriente, a la cubital.',
    ligature: { x: 120, y: 120, angle: 90 },
    vessels: [
      { d: 'M120 196 L120 166', width: TRUNK, normal: 'forward', ligated: 'forward' },
      { d: 'M120 166 L120 120', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M120 120 L120 76', width: TRUNK, normal: 'forward', ligated: 'none' },
      { d: 'M120 76 C110 56 92 44 78 34', width: BRANCH + 1, normal: 'forward', ligated: 'reverse' },
      { d: 'M78 34 L64 6', width: BRANCH + 1, normal: 'forward', ligated: 'forward' },
      { d: 'M120 76 C132 56 156 40 170 6', width: BRANCH + 1, normal: 'forward', ligated: 'forward' },
      { d: 'M120 166 C40 160 36 70 78 34', width: TWIG, normal: 'forward', ligated: 'forward' },
    ],
  },
]
