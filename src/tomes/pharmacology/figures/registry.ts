import type { FigureEntry } from './types'

/**
 * Collects every figure folder of the tome: `public/` (committed) and, when it
 * exists on this machine, `private/` (git-ignored, personal use). A folder that
 * is missing simply contributes nothing, so the tome works without it.
 * See docs/assets.md.
 */
const indexes = import.meta.glob<{ figures: FigureEntry[] }>('./*/index.ts', { eager: true })
const files = import.meta.glob<string>('./*/*.{webp,png,jpg,jpeg,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export type FigureFolder = 'public' | 'private'

export interface ResolvedFigure extends FigureEntry {
  folder: FigureFolder
  /** Bundled URL, or undefined if the declared file isn't there. */
  src?: string
}

const folderOf = (path: string) => path.split('/')[1] as FigureFolder

export const figures = new Map<string, ResolvedFigure>()

for (const [path, mod] of Object.entries(indexes)) {
  const folder = folderOf(path)
  for (const entry of mod.figures) {
    // Duplicates are reported by the tests; the first one wins at runtime.
    if (figures.has(entry.id)) continue
    figures.set(entry.id, { ...entry, folder, src: files[`./${folder}/${entry.file}`] })
  }
}

/** First of `ids` that is declared and has its file: lets a private figure fall back to a public one. */
export function resolveFigure(ids: string | string[]): ResolvedFigure | undefined {
  for (const id of Array.isArray(ids) ? ids : [ids]) {
    const figure = figures.get(id)
    if (figure?.src) return figure
  }
}

/** For tests: raw declarations per folder, duplicates included. */
export const declarations = Object.entries(indexes).map(([path, mod]) => ({
  folder: folderOf(path),
  figures: mod.figures,
  files: Object.keys(files)
    .filter((f) => f.startsWith(`./${folderOf(path)}/`))
    .map((f) => f.slice(`./${folderOf(path)}/`.length)),
}))

/** A brand's product photos, when `private/` holds them: the pack and the dosage form. */
export function brandPhotos(drugId: string): { box?: ResolvedFigure; pill?: ResolvedFigure } {
  return { box: resolveFigure(`brand-${drugId}-box`), pill: resolveFigure(`brand-${drugId}-pill`) }
}
