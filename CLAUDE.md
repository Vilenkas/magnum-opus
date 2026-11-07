# Magnum Opus

A personal, offline, interactive encyclopedia. Each topic ("tome") is a bespoke
experience with its own design, effects and organisation — not a generic article template.

## Language convention

- **English**: code, identifiers, file and folder names, comments, docs, commit messages.
- **Spanish**: the encyclopedia's content only — UI copy shown to the reader, MDX chapters,
  manifest titles/descriptions, quiz questions.

## Architecture

Three layers:

- `src/shell/` — the app shell (Atlas home, tome loading, routing chrome). Knows tomes'
  manifests and the map of knowledge, and how to open tomes; never styles a tome's interior.
  `shell/atlas/` is the home: three switchable views of the same `buildAtlas()` model
  (Estantes, Índice, Mapa; `?view=` in the URL, last one remembered). The Ctrl+K search over
  tomes, areas and facets lives in `GlobalSearch.tsx`, wrapping every route (also inside tomes;
  `useGlobalSearch()` gives the atlas and `open`). Tomes get one chrome pill: Atlas + search. The Mapa is a progressive constellation
  (`focusLayout`: the focused area at the centre, two rings around it, deeper levels counted as
  "+N"; `?area=` holds the focus, clicks re-centre with a tween). Pure logic (`model.ts`,
  `search.ts`, `layout.ts`) is tested.
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

## Organising knowledge

Full rule in `docs/taxonomy.md`. In short:

- `src/tomes/taxonomy.ts` is the map of knowledge: a tree of disciplines (any depth, pure
  data, English path ids, Spanish titles). Each tome sets one `home` path in its manifest.
- Classify by **discipline** (method), not object: anatomy, physiology, pharmacology and
  imaging are nodes; "cardiovascular" is a facet (`facets.system`). Clinical specialties are
  nodes under `health/clinical`.
- A tome covers its node's subtree until a more specific tome claims a child. Split a topic
  into its own tome only when it needs its own design or outgrows its parent tome.
- Order is not in the tree: `prereqs` form suggested routes; `related` is see-also; `tags`
  are search keywords only.
- The registry throws on an invalid `home`/facet/reference; `taxonomy.test.ts` checks all
  manifests.

Tiers (`manifest.tier`): `scroll` (MDX + palette) → `codex` (custom layout, 3D, quizzes) →
`grimoire` (fully bespoke). Displayed in Spanish as Pergamino / Códice / Grimorio.

## Reference material and illustrations

Full rules in `docs/assets.md`. In short:

- `library/<tome>/` — the user's reference PDFs, git-ignored. Read them to write content;
  paraphrase and cite, never copy. Nothing there is bundled.
- `src/tomes/<id>/figures/public/` (committed, open licences only) and `figures/private/`
  (git-ignored, personal use). Each folder's `index.ts` declares its own figures, so deleting
  `private/` leaves nothing dangling. MDX: `<Figura id="…" />`; a list of ids falls back.
  Missing figures render nothing in production: the app must always work without `private/`.

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
- `data/sources.ts` — bibliography. Chapters cite with `<Cita fuente="testut-1" p="12" />`; each book
  lists its sources at the end automatically (`components/Citations.tsx`). Testut–Latarjet t. I is
  in `library/anatomy/` (scanned: render pages with Ghostscript, see `testut-notes.md` there).
- `assets/muscles.glb` (5.6 MB), `joints.glb`, `insertions.glb` + generated `soft-tissues.json`
  (Latin/Spanish from TA2, insertion → bone and → muscle pieces; area kind from the material,
  a head inherits the whole muscle's areas only for the kind it lacks). `components/TissueViewer.tsx`
  shows them as layers over the skeleton (`SkeletonStage` `layers`, each lazily loaded with its own
  BVH); presets `<MuscleViewer>` (Miología) and `<LigamentViewer>` (Artrología).
  Source blend and TA2.csv live in `library/anatomy/z-anatomy/` (see `tools/anatomy/README.md`).
- `data/bones.ts` — Spanish names per GLB node id (hand-editable; the user is the domain
  expert).
- `data/latin.ts` + `data/landmark-latin.ts` — Latin TA names keyed by TA English (`latinOf(en)`);
  numbered series (ribs, phalanges, vertebrae, teeth) come from patterns; the quiz accepts them
  as typed answers (Latin ordinals and digits are parsed). Shown in the viewer
  next to the English (Latin first, English quieter); tests require every piece and landmark to have one.
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
- `data/joints.ts` + `components/JointTypes.tsx` — Libro II's classification plate (Testut's classes
  and genera, each shown on real joints). The stage's `{ kind: 'joint' }` focus frames a landmark
  with an anatomical view (`front`/`side`/`top`…); size from the smallest bone or `frame`.
- `data/levers.ts` + `components/LeverTypes.tsx` — Libro III's plate: Testut's three levers, each
  with fulcrum/effort/load on landmarks (markers with `size` and `onTop`, drawn over the bones).
- `data/pelvis-dimorphism.ts` + `components/PelvisDimorphism.tsx` — Osteología's sex plate: Testut's 16
  characters (t. I p. 386) on a parametric SVG pelvis that morphs man → woman (`pelvisShape(t)`); only
  Testut's own figures are printed (arch, symphysis, inlet index), tests read them off the geometry.
  The 3D models are male only (BodyParts3D; Z-Anatomy's female collections are empty): sex differences
  get dedicated plates rather than a model toggle.
- Libro IV (Angiología) is written from Testut t. II (`testut-2`; figures `testut2-fig-N`, since its
  numbering restarts). Its plates are SVG, no 3D: `Circulation` (the double circulation as a closed
  loop of stages in `data/circulation.ts`, tested), `Anastomoses` (fig. 118's five kinds, with a
  ligature that reroutes the flow) and `VenousValves` (valves closing, Bardeleben's distance D).
- `assets/vessels.glb` (heart + ~630 arteries and veins as tubes) and `lymph.glb` (node groups,
  thymus, spleen), named in generated `vessels.json` + hand-edited `data/vessel-names.ts` (wins over
  TA2). `components/VesselViewer.tsx` (Lámina IV of Angiología): layers over a ghosted skeleton and
  a searchable index that joins both sides of a paired vessel (`data/vessels.ts`, tested).
- `components/SystemViewer.tsx` shows any body system over a ghosted skeleton (layers = index
  sections, Aislar/Ocultar/Deshacer); `VesselViewer` and `NervousViewer` are configurations of it.
  Data: `data/system-model.ts` (`buildSystem`: hand names win over TA2, both sides joined) +
  `vessels.ts` / `nervous.ts`. `assets/nervous.glb` (581 pieces, 2.7 MB) + `nervous.json`; each
  kind (lobe, nucleus, nerve…) has a `TissueLook` of the same name, checked with `satisfies`.
- Every 3D viewer (skeleton, tissues, vessels) sits in `skeleton/IndexedStage.tsx`: the stage plus a
  searchable, foldable index (folded state remembered per plate), fullscreen-aware. Index data is
  pure: `data/structure-index.ts` (search), `data/viewer-indexes.ts` (bones by region; muscles and
  ligaments with both sides on one line), `data/vessels.ts`. Viewers offer «Aislar» (the rest fades).
- Libro V (Neurología) starts with Testut t. II's general anatomy (pp. 565–615). `data/nerve-circuits.ts`
  + `components/NerveCircuits.tsx`: the reflex and the voluntary movement (figs. 471–472) as chains
  of neuron parts the impulse runs through; tests check dynamic polarization and the decussation.
- `components/ImpulseCircuit.tsx`: shared plate for chains of neurons with an impulse running through
  them (stages typed in `data/nerve-circuits.ts`; each plate brings its backdrop and colours).
  `NerveCircuits` and `CerebellarCortex` are configurations of it.
- `data/cerebellar-cortex.ts` + `components/CerebellarCortex.tsx`: the cerebellum's plate (fig. 678):
  mossy fibre, climbing fibre and basket cell, all ending in the Purkinje cell; tests check the layers.
- `data/ventricle-floor.ts` + `components/VentricleFloor.tsx`: the floor of the fourth ventricle
  (figs. 694, 700). Shapes are `[u, y]`, u a fraction of the rhombus' half width at that height, so
  they always stay inside; tests check the motor zone inside the sulcus limitans and the rest outside.
- `data/midbrain-sections.ts` + `components/MidbrainSections.tsx`: the midbrain at the two colliculi;
  the pes and the substantia nigra are arcs of one ring, the pes split in fifths after Testut or today.
- `data/cord-sections.ts` + `components/CordSections.tsx`: the spinal cord in section, gliding from
  C6 to the conus (fig. 512) with the fascicles of fig. 548; every shape is a function of the height,
  and tests check Testut's diameters and Stilling's ordering of grey matter.
- `data/bulb-columns.ts` + `components/BulbColumns.tsx`: the cord's grey column becoming the medulla's
  four columns in four stages (fig. 589: decussations behead the horns, the fourth ventricle opens);
  tests check the beheading, the opening and the final floor/deep positions.
- `data/hemiplegia.ts` + `components/Hemiplegia.tsx`: the pons' plate. The motor pathway of both
  hemispheres to III, VII, XII and the limbs; a lesion at a level paralyses `paralysis(y, side)`:
  nuclei at its level on its side, uncrossed contingents on the other (fig. 634). Tests check the
  common and the three alternate hemiplegias.
- Netter's atlas (8.ª ed., `netter` source) is in `library/anatomy/` with a plate index
  (`netter-index.tsv`); its crops go to `figures/private` as `netter-s-N`.
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
- `pnpm new-tome <id> "<Título>" <home>` — scaffold a tome from `scripts/templates/tome/`
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
