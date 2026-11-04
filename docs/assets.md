# Reference material and illustrations

Two rules keep the repository redistributable while the local app can look as rich as we
like: what isn't ours to share never gets committed, and the app never depends on it.

## `library/`: reference material (local only)

PDFs, scans and notes used to write the tomes, one subfolder per tome id
(`library/anatomy/`, `library/latin/`). Everything except `library/README.md` is
git-ignored, so copyrighted books can live here. Nothing in it is bundled into the app.
Content is written *from* these sources (paraphrased, cited), never copied verbatim.

## `src/tomes/<id>/figures/`: illustrations

```
figures/
├─ types.ts        FigureEntry, licences
├─ registry.ts     collects every folder's index.ts and files via import.meta.glob
├─ public/         committed: public domain or open licence only
│  ├─ index.ts     export const figures: FigureEntry[] = [ … ]
│  └─ *.webp|svg…
└─ private/        git-ignored: anything, for personal use
   ├─ index.ts     same shape; license: 'restricted' allowed
   └─ *.webp|svg…
```

- Each folder declares its own figures in its `index.ts`, next to the files. Deleting
  `private/` removes its images and their metadata at once, and nothing else refers to them.
- Chapters use `<Figura id="…" />` (MDX). `id` can be a list: the first available wins, so
  a private plate can fall back to a public one: `<Figura id={['netter-skull', 'gray-skull']} />`.
- A figure that isn't available renders nothing in production and a dashed reminder in dev.
  The app builds and runs with `private/` gone.
- `public/` accepts `public-domain`, `cc0`, `cc-by`, `cc-by-sa`. NC and ND licences, unknown
  licences and copyrighted material go to `private/` as `restricted`.
- Every figure carries `credit` (and `url`, `changes` when it applies): the caption shows
  them, which is what CC licences require.
- `figures.test.ts` checks public licences, unique ids across folders, that each declared file
  exists, and that every figure is credited.

Prefer WebP for scans and SVG for diagrams; keep files reasonably small (they're bundled).
Scans on white paper blend into the tome's paper (`mix-blend-mode: multiply`).

### Starting a private folder

Create `src/tomes/<id>/figures/private/index.ts`:

```ts
import type { FigureEntry } from '../types'

export const figures: FigureEntry[] = [
  {
    id: 'netter-skull',
    file: 'netter-skull.webp',
    title: 'Cráneo, vista anterior',
    credit: 'Netter, Atlas de anatomía humana, lám. 4',
    license: 'restricted',
  },
]
```

## Going public

To distribute the app: delete every `figures/private/` folder (they're not in git anyway)
and build. Chapters keep working; private figures simply disappear or fall back.
