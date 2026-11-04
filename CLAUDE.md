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
- `src/forge/` — building blocks shared by tomes, extracted only once two tomes needed them:
  `practice.ts` (persisted per-item stats, weighted pick of what you miss, `seededRng` for
  tests) and `text.ts` (normalize, diacritics, levenshtein). Tome-specific logic (anatomy's
  name parsing, Latin morphology) stays in its tome. Visual components are not shared:
  each tome draws its own.
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
`@fontsource`. Desktop app with Tauri 2 (see below).
Everything must work offline: no CDNs, no runtime network requests.

3D: three.js + React Three Fiber + drei, imported only from inside tomes and lazy-loaded.
GLB assets use **meshopt** compression (decoder is bundled; Draco would fetch from a CDN).
Always call `useGLTF(url, false, true)` — Draco off, meshopt on.

## Anatomy tome

- `assets/skeleton.glb` — 269 pieces (210 bones, 31 cartilages, 28 teeth) from Z-Anatomy,
  CC BY-SA: keep attribution visible. Rebuild via `tools/anatomy/README.md`.
- `data/bones.ts` — Spanish names per GLB node id (hand-editable; the user is the domain
  expert).
- `assets/landmarks.json` (generated: 895 landmark points + normals on 79 pieces) and
  `data/landmark-names.ts` (hand-edited Spanish names keyed by TA English). `data/landmarks.ts`
  joins them. Openings (foramina) are marked at the void, not on the surface.
- The quiz works on `QuizItem`s (`quiz/engine.ts`): pieces or landmarks, same engine. `data/skeleton.ts` — types, groups, regions, axial/appendicular division.
- `components/skeleton/SkeletonStage.tsx` — shared canvas + model + camera flight used by
  every 3D plate. Parents drive it declaratively: `lookOf(piece)`, `isPickable`, `focus`.
  It **clones** the cached GLTF scene: an Object3D has one parent, so two plates sharing
  `useGLTF`'s scene would steal it from each other.
- Raycasting goes through drei `<Bvh firstHitOnly={false}>`: without it every pointer move
  tests ~650k triangles. Not first-hit-only, because picking skips ghosted/hidden pieces.
- Camera moves use the stage's own `useCameraFlight` (drei `Bounds` doesn't request frames
  with `frameloop="demand"`, so its animations stall).
- `quiz/` — pure logic (engine, answer checking, weighted stats), unit-tested with Vitest.
  Progress persists via `src/shell/storage.ts` (namespaced localStorage).
- Visual check of WebGL in headless Edge needs real-time waiting (DevTools protocol) and
  only one open tab; `--virtual-time-budget` screenshots render an empty canvas, and
  SwiftShader renders at a few fps, so camera flights need several seconds.

## Latin tome

- The user is a **beginner** here (unlike anatomy): grammar content accuracy is on us, and
  every paradigm must be backed by tests. Pronunciation: classical restored.
- `grammar/nouns.ts` — declension engine: nominative + genitive + gender + declension →
  12 forms with macrons, split into stem/ending. `analyze()` lists every case a form written
  without macrons can be. Reference paradigms in `nouns.test.ts`.
- `data/nouns.ts` — beginner vocabulary (hand-editable) with Spanish derivatives.
- Inscription style: `toInscription()` (U→V, interpuncts), Marcellus + Alegreya fonts,
  marble = SVG turbulence noise inline; exercises sit on a wax tablet (`plates.module.css`).

## Commands

- `pnpm dev` — dev server
- `pnpm build` — typecheck + production build
- `pnpm typecheck`
- `pnpm test` — Vitest (pure logic only; 3D is verified visually)
- `pnpm new-tome <id> "<Título>"` — scaffold a tome from `scripts/templates/tome/`
- `pnpm desktop` — Tauri dev window (runs `pnpm dev` itself)
- `pnpm desktop:build` — release exe + NSIS installer in `src-tauri/target/release/bundle/nsis/`

## Desktop (Tauri 2)

- `src-tauri/` — minimal Rust shell; no custom commands. Identifier `com.magnumopus.desktop`.
- CSP lives in `tauri.conf.json`; `'wasm-unsafe-eval'` is required by the meshopt decoder.
  Any new runtime feature (workers, wasm, blobs) must be allowed there or it fails only in
  the desktop build.
- `src/shell/desktop.ts` — `isDesktop` and wrappers around `@tauri-apps/api`, all no-ops in
  the browser. Each API used needs its permission in `src-tauri/capabilities/default.json`.
- Debugging the built app: set `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9334`
  before launching the exe, then attach via DevTools protocol (page URL `http://tauri.localhost/`).
- Rust is the standalone MSVC install (no rustup) with Visual Studio C++ tools.
- App icon: `src-tauri/icons/source.svg` → `magick … source.png` → `pnpm tauri icon src-tauri/icons/source.png`.

## Notes

- TypeScript 7: `baseUrl` is gone; `paths` entries must be relative (`./src/*`).
- MDX chapters get components via the `components` prop (see
  `src/tomes/anatomy/components/mdx.tsx`), so they can be used without importing.
