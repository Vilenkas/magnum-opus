export interface Source {
  authors?: string
  title: string
  edition?: string
  place?: string
  publisher?: string
  year?: number
  note?: string
}

export const sources = {
  katzung: {
    authors: 'Bertram G. Katzung (ed.)',
    title: 'Farmacología básica y clínica',
    edition: '14.ª ed.',
    place: 'México',
    publisher: 'McGraw-Hill Interamericana',
    year: 2019,
  },
  goodman: {
    authors: 'Laurence L. Brunton, Randa Hilal-Dandan y Björn C. Knollmann (eds.)',
    title: 'Goodman & Gilman. Las bases farmacológicas de la terapéutica',
    edition: '13.ª ed.',
    place: 'México',
    publisher: 'McGraw-Hill Interamericana',
    year: 2019,
  },
  pubchem: {
    authors: 'National Center for Biotechnology Information',
    title: 'PubChem',
    note: 'Fórmula, masa molar, nombre IUPAC y estructura 2D de cada molécula (dominio público).',
  },
  wikidata: {
    title: 'Wikidata',
    note: 'Códigos ATC de cada principio activo (CC0).',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

/** A page (or pages) of a source backing a statement. */
export interface Ref {
  source: SourceId
  p?: string
}

export function shortRef(s: Source): string {
  return s.authors ? `${s.authors}, ${s.title}` : s.title
}
