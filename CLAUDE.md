# Magnum Opus

A personal, offline, interactive encyclopedia. Each topic ("tome") is a bespoke
experience with its own design, effects and organisation — not a generic article template.

## Language convention

- **English**: code, identifiers, file and folder names, comments, docs, commit messages.
- **Spanish**: the encyclopedia's content only — UI copy shown to the reader, MDX chapters,
  manifest titles/descriptions, quiz questions.

## Architecture

Three layers:

- `src/shell/` — the app shell (Atlas home, tome loading, routing chrome). Knows only that
  tomes exist and how to open them; never styles a tome's interior.
- `src/forge/` — reusable building blocks (quiz engine, flashcards, 3D scene wrapper…).
  *Not created yet on purpose*: extract pieces here only once two different tomes need them.
- `src/tomes/<id>/` — one self-contained folder per tome:
  - `manifest.ts` — eager, lightweight metadata (`TomeManifest` in `src/tomes/types.ts`).
    `id` must equal the folder name.
  - `Tome.tsx` — default-exported entry component, code-split. Receives `{ manifest, path }`
    where `path` is the URL remainder after `/tomes/<id>/`, so each tome owns its internal nav.
  - Styles are CSS Modules scoped under the tome's root class; nothing leaks out.
  - Heavy deps (three.js, fonts, assets) must be imported from inside the tome, never the shell.

Tomes register automatically via `import.meta.glob` in `src/tomes/registry.ts`.

Tiers (`manifest.tier`): `scroll` (MDX + palette) → `codex` (custom layout, 3D, quizzes) →
`grimoire` (fully bespoke). Displayed in Spanish as Pergamino / Códice / Grimorio.

## Stack

Vite 8 · React 19 · TypeScript 7 · TanStack Router (hash history, code-based routes) ·
MDX (`@mdx-js/rollup` + remark-gfm) · Tailwind v4 (shell only) · self-hosted fonts via
`@fontsource`. Desktop packaging with Tauri 2 is planned (not set up yet).
Everything must work offline: no CDNs, no runtime network requests.

3D: three.js + React Three Fiber + drei, imported only from inside tomes and lazy-loaded.
GLB assets use **meshopt** compression (decoder is bundled; Draco would fetch from a CDN).
Always call `useGLTF(url, false, true)` — Draco off, meshopt on.

## Anatomy tome

- `assets/skeleton.glb` — 269 pieces (210 bones, 31 cartilages, 28 teeth) from Z-Anatomy,
  CC BY-SA: keep attribution visible. Rebuild via `tools/anatomy/README.md`.
- `data/bones.ts` — Spanish names per GLB node id (hand-editable; the user is the domain
  expert). `data/skeleton.ts` — types, groups, regions, axial/appendicular division.
- Visual check of WebGL in headless Edge needs real-time waiting (DevTools protocol);
  `--virtual-time-budget` screenshots render an empty canvas.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — typecheck + production build
- `pnpm typecheck`
- `pnpm new-tome <id> "<Título>"` — scaffold a tome from `scripts/templates/tome/`

## Notes

- TypeScript 7: `baseUrl` is gone; `paths` entries must be relative (`./src/*`).
- MDX chapters get components via the `components` prop (see
  `src/tomes/anatomy/components/mdx.tsx`), so they can be used without importing.
