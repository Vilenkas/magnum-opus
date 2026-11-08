/**
 * Licences a figure in `public/` may carry: free to commit and redistribute.
 * `restricted` (copyrighted, NC, ND, unknown) is only allowed in `private/`.
 */
export type OpenLicense = 'public-domain' | 'cc0' | 'cc-by' | 'cc-by-sa'
export type License = OpenLicense | 'restricted'

export const licenseLabel: Record<License, string> = {
  'public-domain': 'Dominio público',
  cc0: 'CC0',
  'cc-by': 'CC BY',
  'cc-by-sa': 'CC BY-SA',
  restricted: 'Uso personal',
}

/**
 * One illustration. Declared in the `index.ts` of the folder that holds its
 * file, so deleting `private/` deletes its figures and their metadata together.
 */
export interface FigureEntry {
  /** Referenced from MDX: <Figura id="…" />. Unique across folders. */
  id: string
  /** File name inside the same folder (webp, png, jpg, avif or svg). */
  file: string
  /** Spanish caption. */
  title: string
  /** Spanish alt text when the caption isn't enough to picture it. */
  alt?: string
  /** Key to the numbers or letters drawn on the figure: "1, diáfisis. — 2, epífisis…". */
  legend?: string
  /** Credit as it should read: "Henry Gray, Anatomy of the Human Body (1918), fig. 188". */
  credit: string
  license: License
  /** Licence version when it matters ("4.0"). */
  licenseVersion?: string
  /** Where the original lives. */
  url?: string
  /** What was changed, as CC licences require: "Recortada y entintada". */
  changes?: string
  /** The bibliography entry the figure comes from (`data/sources.ts`): a figure cites its work. */
  source?: string
  /** Where in that work: "fig. 12", "lám. S-120". Listed under the source at the end of the book. */
  ref?: string
}
