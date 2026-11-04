/**
 * Classical count of the 206 bones of the adult skeleton, as a tree that the
 * breakdown plate unfolds level by level. Hand-editable: a leaf states its own
 * count (paired bones count both sides); every branch is the sum of its leaves.
 * Names follow data/bones.ts. Totals are checked in bone-count.test.ts.
 */
export interface CountNode {
  name: string
  /** Leaves only. */
  count?: number
  /** A short clarification shown under the name. */
  note?: string
  children?: CountNode[]
}

export interface CountDivision {
  id: 'axial' | 'appendicular'
  name: string
  description: string
  regions: CountNode[]
}

const pair = (name: string, note?: string): CountNode => ({ name, count: 2, note })
const one = (name: string, note?: string): CountNode => ({ name, count: 1, note })

export const boneCount: CountDivision[] = [
  {
    id: 'axial',
    name: 'Esqueleto axial',
    description: 'El eje central del cuerpo: protege el encéfalo, la médula y las vísceras torácicas.',
    regions: [
      {
        name: 'Cráneo',
        children: [
          {
            name: 'Neurocráneo',
            children: [one('Frontal'), pair('Parietal'), pair('Temporal'), one('Occipital'), one('Esfenoides'), one('Etmoides')],
          },
          {
            name: 'Viscerocráneo',
            children: [
              pair('Maxilar'),
              pair('Cigomático'),
              pair('Hueso nasal'),
              pair('Lagrimal'),
              pair('Palatino'),
              pair('Cornete nasal inferior'),
              one('Vómer'),
              one('Mandíbula'),
            ],
          },
        ],
      },
      { name: 'Huesecillos del oído', children: [pair('Martillo'), pair('Yunque'), pair('Estribo')] },
      one('Hioides'),
      {
        name: 'Columna vertebral',
        children: [
          {
            name: 'Vértebras cervicales',
            children: [one('Atlas (C1)'), one('Axis (C2)'), { name: 'Vértebras C3–C7', count: 5 }],
          },
          { name: 'Vértebras torácicas', count: 12 },
          { name: 'Vértebras lumbares', count: 5 },
          one('Sacro', 'Cinco vértebras sacras fusionadas.'),
          one('Cóccix', 'De tres a cinco vértebras coccígeas fusionadas.'),
        ],
      },
      {
        name: 'Tórax (esternón y costillas)',
        children: [
          one('Esternón', 'Manubrio, cuerpo y apófisis xifoides; se cuenta como un hueso.'),
          {
            name: 'Costillas',
            children: [
              { name: 'Verdaderas (1.ª–7.ª)', count: 14, note: 'Se unen al esternón por su propio cartílago.' },
              { name: 'Falsas (8.ª–10.ª)', count: 6, note: 'Se unen al cartílago de la costilla superior.' },
              { name: 'Flotantes (11.ª–12.ª)', count: 4, note: 'Sin unión anterior.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'appendicular',
    name: 'Esqueleto apendicular',
    description: 'Los miembros y las cinturas que los unen al eje: el esqueleto del movimiento.',
    regions: [
      { name: 'Cintura escapular', children: [pair('Clavícula'), pair('Escápula')] },
      {
        name: 'Miembros superiores',
        children: [
          { name: 'Brazo', children: [pair('Húmero')] },
          { name: 'Antebrazo', children: [pair('Radio'), pair('Cúbito')] },
          {
            name: 'Carpo',
            children: [
              { name: 'Fila proximal', children: [pair('Escafoides'), pair('Semilunar'), pair('Piramidal'), pair('Pisiforme')] },
              { name: 'Fila distal', children: [pair('Trapecio'), pair('Trapezoide'), pair('Hueso grande'), pair('Ganchoso')] },
            ],
          },
          { name: 'Metacarpianos', count: 10 },
          {
            name: 'Falanges de la mano',
            children: [
              { name: 'Proximales', count: 10 },
              { name: 'Medias', count: 8, note: 'El pulgar no tiene falange media.' },
              { name: 'Distales', count: 10 },
            ],
          },
        ],
      },
      { name: 'Cintura pélvica', children: [pair('Coxal', 'Ilion, isquion y pubis fusionados.')] },
      {
        name: 'Miembros inferiores',
        children: [
          { name: 'Muslo', children: [pair('Fémur')] },
          pair('Rótula'),
          { name: 'Pierna', children: [pair('Tibia'), pair('Peroné')] },
          {
            name: 'Tarso',
            children: [
              { name: 'Fila posterior', children: [pair('Astrágalo'), pair('Calcáneo')] },
              {
                name: 'Fila anterior',
                children: [
                  pair('Navicular'),
                  pair('Cuboides'),
                  pair('Cuneiforme medial'),
                  pair('Cuneiforme intermedio'),
                  pair('Cuneiforme lateral'),
                ],
              },
            ],
          },
          { name: 'Metatarsianos', count: 10 },
          {
            name: 'Falanges del pie',
            children: [
              { name: 'Proximales', count: 10 },
              { name: 'Medias', count: 8, note: 'El primer dedo no tiene falange media.' },
              { name: 'Distales', count: 10 },
            ],
          },
        ],
      },
    ],
  },
]

/** A leaf's own count, or the sum of a branch's leaves. */
export const countOf = (node: CountNode): number =>
  node.children ? node.children.reduce((sum, c) => sum + countOf(c), 0) : (node.count ?? 0)

export const divisionCount = (d: CountDivision) => d.regions.reduce((sum, r) => sum + countOf(r), 0)
