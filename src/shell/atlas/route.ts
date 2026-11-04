import { loadJSON, saveJSON } from '@/shell/storage'

export const atlasViews = ['shelves', 'index', 'map'] as const
export type AtlasView = (typeof atlasViews)[number]

/** URL state of the Atlas: `/?view=index&area=health/basic-sciences`. */
export interface AtlasSearch {
  view?: AtlasView
  /** Taxonomy path shown by the index view. */
  area?: string
  /** Body-system facet value shown by the index view (instead of an area). */
  system?: string
}

const isView = (value: unknown): value is AtlasView => atlasViews.includes(value as AtlasView)

export function parseAtlasSearch(search: Record<string, unknown>): AtlasSearch {
  return {
    view: isView(search.view) ? search.view : undefined,
    area: typeof search.area === 'string' ? search.area : undefined,
    system: typeof search.system === 'string' ? search.system : undefined,
  }
}

const VIEW_KEY = 'atlas:view'

/** The view in the URL, else the last one used, so "← Atlas" returns to it. */
export function resolveView(fromUrl: AtlasView | undefined): AtlasView {
  if (fromUrl) return fromUrl
  const stored = loadJSON<unknown>(VIEW_KEY, 'shelves')
  return isView(stored) ? stored : 'shelves'
}

export const rememberView = (view: AtlasView) => saveJSON(VIEW_KEY, view)
