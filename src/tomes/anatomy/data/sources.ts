/**
 * Bibliography of the anatomy tome. Chapters cite with <Cita fuente="id" p="12" />
 * and each book lists what it cited at its end. Citing copyrighted works is fine;
 * their text is paraphrased, never copied (docs/assets.md).
 */
export interface Source {
  /** "L. Testut y A. Latarjet"; omitted for works known by their title (a dataset). */
  authors?: string
  title: string
  /** "Tomo I: Osteología, Artrología, Miología" */
  volume?: string
  edition?: string
  place?: string
  publisher?: string
  year?: number
  /** One short clarifying sentence, Spanish: "Modelo 3D del esqueleto." */
  note?: string
  /** For reused material whose licence requires attribution: "CC BY-SA 4.0". */
  license?: string
  url?: string
}

export const sources = {
  'testut-1': {
    authors: 'L. Testut y A. Latarjet',
    title: 'Tratado de anatomía humana',
    volume: 'Tomo I: Osteología, Artrología, Miología',
    edition: '9.ª ed.',
    place: 'Barcelona',
    publisher: 'Salvat',
    year: 1975,
  },
  'testut-2': {
    authors: 'L. Testut y A. Latarjet',
    title: 'Tratado de anatomía humana',
    volume: 'Tomo II: Angiología, Sistema nervioso central',
    edition: '9.ª ed.',
    place: 'Barcelona',
    publisher: 'Salvat',
    year: 1975,
  },
  'testut-3': {
    authors: 'L. Testut y A. Latarjet',
    title: 'Tratado de anatomía humana',
    volume: 'Tomo III: Meninges, Sistema nervioso periférico, Órganos de los sentidos, Aparato de la respiración y de la fonación, Glándulas de secreción interna',
    edition: '9.ª ed.',
    place: 'Barcelona',
    publisher: 'Salvat',
    year: 1975,
  },
  'testut-4': {
    authors: 'L. Testut y A. Latarjet',
    title: 'Tratado de anatomía humana',
    volume: 'Tomo IV: Aparato de la digestión, Peritoneo, Aparato urogenital',
    edition: '9.ª ed.',
    place: 'Barcelona',
    publisher: 'Salvat',
    year: 1975,
  },
  'latarjet-ruiz-1': {
    authors: 'M. Latarjet y A. Ruiz Liard',
    title: 'Anatomía humana',
    volume: 'Tomo 1',
    edition: '5.ª ed.',
    place: 'Buenos Aires',
    publisher: 'Médica Panamericana',
    year: 2019,
  },
  'latarjet-ruiz-2': {
    authors: 'M. Latarjet y A. Ruiz Liard',
    title: 'Anatomía humana',
    volume: 'Tomo 2',
    edition: '5.ª ed.',
    place: 'Buenos Aires',
    publisher: 'Médica Panamericana',
    year: 2019,
  },
  'rouviere-1': {
    authors: 'H. Rouvière y A. Delmas',
    title: 'Anatomía humana descriptiva, topográfica y funcional',
    volume: 'Tomo 1: Cabeza y cuello',
    edition: '11.ª ed.',
    place: 'Barcelona',
    publisher: 'Masson',
    year: 2005,
  },
  'rouviere-2': {
    authors: 'H. Rouvière y A. Delmas',
    title: 'Anatomía humana descriptiva, topográfica y funcional',
    volume: 'Tomo 2: Tronco',
    edition: '11.ª ed.',
    place: 'Barcelona',
    publisher: 'Masson',
    year: 2005,
  },
  'rouviere-3': {
    authors: 'H. Rouvière y A. Delmas',
    title: 'Anatomía humana descriptiva, topográfica y funcional',
    volume: 'Tomo 3: Miembros',
    edition: '11.ª ed.',
    place: 'Barcelona',
    publisher: 'Masson',
    year: 2005,
  },
  'rouviere-4': {
    authors: 'H. Rouvière y A. Delmas',
    title: 'Anatomía humana descriptiva, topográfica y funcional',
    volume: 'Tomo 4: Sistema nervioso central, vías y centros nerviosos',
    edition: '11.ª ed.',
    place: 'Barcelona',
    publisher: 'Masson',
    year: 2005,
  },
  moore: {
    authors: 'A. F. Dalley y A. M. R. Agur',
    title: 'Moore. Anatomía con orientación clínica',
    edition: '9.ª ed.',
    publisher: 'Wolters Kluwer',
    year: 2023,
    note: 'Se cita con la paginación del original inglés (Moore’s Clinically Oriented Anatomy, 9th ed.); sólo para lo que no recoge la 8.ª edición en español.',
  },
  'moore-8': {
    authors: 'K. L. Moore, A. F. Dalley y A. M. R. Agur',
    title: 'Moore. Anatomía con orientación clínica',
    edition: '8.ª ed.',
    place: 'Barcelona',
    publisher: 'Wolters Kluwer',
    year: 2017,
  },
  pro: {
    authors: 'E. A. Pró',
    title: 'Anatomía clínica',
    edition: '2.ª ed.',
    place: 'Buenos Aires',
    publisher: 'Médica Panamericana',
    year: 2014,
  },
  netter: {
    authors: 'F. H. Netter',
    title: 'Atlas de anatomía humana. Abordaje por sistemas',
    edition: '8.ª ed.',
    place: 'Barcelona',
    publisher: 'Elsevier',
    year: 2023,
  },
  'z-anatomy': {
    title: 'Z-Anatomy',
    note: 'Atlas anatómico 3D de código abierto; origen del modelo del esqueleto de este tomo, derivado de BodyParts3D.',
    license: 'CC BY-SA 4.0',
    url: 'https://www.z-anatomy.com',
  },
  bodyparts3d: {
    authors: 'The Database Center for Life Science (DBCLS)',
    title: 'BodyParts3D',
    note: 'Base de datos de modelos anatómicos 3D.',
    license: 'CC BY-SA 2.1 Japón',
    url: 'https://lifesciencedb.jp/bp3d/',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

/** Short form used in the tooltip of a citation mark. */
export const shortRef = (s: Source) =>
  [s.authors?.replace(/\b\p{Lu}\. /gu, '') ?? s.title, s.year].filter(Boolean).join(', ')
