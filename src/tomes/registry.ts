import { lazy, type LazyExoticComponent } from 'react'
import { placementProblems } from './taxonomy'
import type { TomeComponent, TomeManifest } from './types'

/**
 * Tomes register themselves by existing: any folder in src/tomes/ with a
 * manifest.ts and a Tome.tsx is picked up automatically. Manifests are loaded
 * eagerly (they're tiny); Tome.tsx is code-split so a tome's heavy
 * dependencies (three.js, fonts, assets) only load when it is opened.
 */
const manifestModules = import.meta.glob<{ default: TomeManifest }>('./*/manifest.ts', {
  eager: true,
})
const tomeModules = import.meta.glob<{ default: TomeComponent }>('./*/Tome.tsx')

const folderOf = (path: string) => path.split('/')[1]

export interface RegisteredTome {
  manifest: TomeManifest
  Component: LazyExoticComponent<TomeComponent>
}

const tomes = new Map<string, RegisteredTome>()

for (const [path, mod] of Object.entries(manifestModules)) {
  const folder = folderOf(path)
  const manifest = mod.default
  if (manifest.id !== folder) {
    throw new Error(`Tome manifest id "${manifest.id}" must match its folder "${folder}"`)
  }
  const loader = tomeModules[`./${folder}/Tome.tsx`]
  if (!loader) {
    throw new Error(`Tome "${folder}" has a manifest.ts but no Tome.tsx`)
  }
  tomes.set(manifest.id, { manifest, Component: lazy(loader) })
}

// Fail fast on a misplaced tome: a typo in `home` would silently hide it from the map.
const ids = new Set(tomes.keys())
for (const { manifest } of tomes.values()) {
  const problems = placementProblems(manifest, ids)
  if (problems.length) throw new Error(`Tome "${manifest.id}": ${problems.join('; ')}`)
}

export const getTome = (id: string) => tomes.get(id)

export const listTomes = () =>
  [...tomes.values()]
    .map((t) => t.manifest)
    .sort((a, b) => a.title.localeCompare(b.title, 'es'))
