export interface Source {
  authors?: string
  title: string
  volume?: string
  edition?: string
  place?: string
  publisher?: string
  year?: number
  note?: string
  license?: string
  url?: string
}

export const sources = {
  lehmann: {
    authors: 'Charles H. Lehmann',
    title: 'Geometría analítica',
    edition: '1.ª ed. en español',
    place: 'México',
    publisher: 'Editorial Limusa / John Wiley & Sons',
    year: 1989,
    note: 'Traducción de Rafael García Díaz. Original en inglés: Analytic Geometry (The Cooper Union School of Engineering).',
  },
  descartes: {
    authors: 'René Descartes',
    title: 'La Géométrie',
    edition: 'Edición facsímil y traducción',
    place: 'Leiden / París',
    publisher: 'Jan Maire',
    year: 1637,
    note: 'Apéndice al Discurso del método; fundación de la geometría analítica moderna.',
  },
  euclides: {
    authors: 'Euclides de Alejandría',
    title: 'Elementos de Geometría',
    volume: 'Libros I-XIII',
    place: 'Madrid',
    publisher: 'Gredos',
    year: 1991,
    note: 'Traducción y notas de María Luisa Puertas Castaños.',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

export function shortRef(s: Source): string {
  if (s.authors) return `${s.authors}, ${s.title}`
  return s.title
}
