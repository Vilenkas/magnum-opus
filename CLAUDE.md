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
  `useGlobalSearch()` gives the atlas and `open`). Tomes get one chrome pill: Atlas, the tome's
  front page (only when deeper inside it, e.g. a book) and search. The Mapa is a progressive constellation
  (`focusLayout`: the focused area at the centre, two rings around it, deeper levels counted as
  "+N"; `?area=` holds the focus, clicks re-centre with a tween). Pure logic (`model.ts`,
  `search.ts`, `layout.ts`) is tested.
- `src/forge/` — building blocks shared by tomes, extracted only once two tomes needed them:
  `practice.ts` (persisted per-item stats, weighted pick of what you miss, `seededRng` for
  tests), `text.ts` (normalize, diacritics, levenshtein) and `outline.ts` + `useOutline.ts` (a book's
  index: ids for its h2/h3, the section being read, open state; each tome draws its own `BookIndex`
  under the chrome pill). Tome-specific logic (anatomy's
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
- `data/sources.ts` — bibliography. A figure with `source`/`ref` (the private helpers set them) lists its work and
  figure or plate number among the book's sources by itself (`useFigureSource`). Chapters cite with `<Cita fuente="testut-1" p="12" />`; each book
  lists its sources at the end automatically (`components/Citations.tsx`). Testut–Latarjet t. I is
  in `library/anatomy/` (scanned: render pages with Ghostscript, see `testut-notes.md` there).
- `assets/muscles.glb` (5.6 MB), `joints.glb`, `insertions.glb` + generated `soft-tissues.json`
  (Latin/Spanish from TA2, insertion → bone and → muscle pieces; area kind from the material,
  a head inherits the whole muscle's areas only for the kind it lacks). `components/TissueViewer.tsx`
  shows them as layers over the skeleton (`SkeletonStage` `layers`, each lazily loaded with its own
  BVH); presets `<MuscleViewer>` (Miología) and `<LigamentViewer>` (Artrología).
- `data/joint-index.ts`: every piece of `joints.glb` belongs to one joint (by its nearest TA group, plus single
  pieces); each joint names its bones. `<LigamentViewer>` indexes whole joints first: choosing one shows its
  bones and pieces on one side (the rest ghosted, the stage's `{ kind: 'nodes' }` focus frames them), and its
  card lists the pieces. Tests check no piece is left without a joint.
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
- `data/bone-growth.ts` + `components/BoneGrowth.tsx` (Osteología, Lámina III): the building of a long bone after
  Testut fig. 21, from the cartilage model to the adult. One inequality (the fertile end grows twice as much)
  yields the nutrient canal's slant, Bérard's order of fusion and Duhamel–Hunter's nails; tests check all three.
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
- `data/gyri.ts` + `components/Gyri.tsx`: the convolutions of the outer and inner faces as polygons
  after Testut's schemes (figs. 767, 777), with Testut's names, today's (Netter) and synonyms; tests
  check the lobes against the fissures of Rolando, Sylvius and the calcarine. Each gyrus may carry
  Testut's `localization` (motor, sensory, visual…), shown in the plate's «Localizaciones» mode.
- `data/cortex-types.ts` + `components/CortexTypes.tsx`: the six layers gliding through Economo's
  five types (fig. 795); layer shares are schematic, tests check only their ordering.
- `data/ventricles.ts` + `components/Ventricles.tsx`: the ventricular cast (fig. 832) as stroked
  centrelines, and the CSF's course through it (Netter S-35); tests check the order of cavities,
  the aqueduct as the narrowest passage and its 15 mm.
- `data/internal-capsule.ts` + `components/InternalCapsule.tsx`: Flechsig's horizontal cut, the
  capsule's segments with their fibres and the effect of lesioning each; tests check the geometry
  (angle open laterally, genu medial) and the somatotopy (head, upper limb, lower limb).
- `data/pathways.ts` + `components/Pathways.tsx`: the great pathways end to end (Testut pp. 1114–1137) as
  chains of neurons on a frontal scheme, x signed towards the half of the body served (the other half
  mirrored). A lesion is an ellipse; `deficits()` derives what is lost and on which side only from the
  geometry, never by hand. Tests check the crossings and the syndromes (capsule, thalamus, Brown-Séquard,
  syringomyelia, cerebellar). Alternative `routes` (touch) are lost only together; `minor` neurons don't count.
- `data/visual-fields.ts` + `components/VisualFields.tsx`: the optic pathway on the base of the brain seen
  from above, one bundle per retinal quadrant (ganglion cell → geniculocalcarine neuron, the ventral ones
  round Meyer's loop). Same lesion-as-ellipse idea as `pathways.ts`; `fieldOf` inverts retina → field.
  Tests check the semidecussation and each defect (monocular, bitemporal, homonymous, quadrantanopias).
- `data/cranial-topography.ts` + `components/CranialTopography.tsx`: the head in profile in cm (x back from the
  nasion, y up from the zygomatic arch). The skull is drawn to average measures (lambda from Testut's 6–7 cm above
  the inion); every construction (Poirier, Lucas-Championnière, Chipault, Testut and Jacob, Marie–Foix–Bertrand)
  is computed from it with the authors' distances. Tests check independent methods against each other.
- `data/cerebral-arteries.ts` + `components/WillisCircle.tsx`: the circle of Willis as a graph (carotids and
  vertebrals in, terminal arteries out); an occluded vessel is removed and perfusion is reachability, in any
  direction, with the communicating arteries optionally threadlike. Cortical territories are polygons on the faces
  of `gyri.ts` (figs. 1009–1010); lost gyri come from their centroids. Tests check Lefort's carotid, the basilar
  fed by the carotids, and each syndrome's centres.
- `data/spinal-reflexes.ts` + `components/SpinalReflexes.tsx` (Lámina IV of Neurología): Dejerine's reflex centres
  (fig. 566) on the segments C1–S5; a transverse lesion abolishes what it takes whole, weakens what it takes in part,
  and below it the shock, then the automatism. «Niveles de hoy» swaps in Moore's and Pró's levels and the pyramidal
  signs (abdominal reflexes lost, Babinski). Neurology plates are numbered in order of appearance: inserting one
  means renumbering the captions after it.
- Neurología grows in parts: `chapters/neurology.mdx` ends by rendering `chapters/neurology/*.mdx` (passing
  `props.components` down, since there is no MDX provider). `neurology/meninges.mdx` is Testut t. III pp. 1–44
  (`testut-3`; figures `testut3-fig-N`). `data/meninges.ts` + `components/Meninges.tsx` (Lámina XVIII): a frontal
  section of the vault where every boundary is a function of x; a bleed opens one interface and pushes what lies
  below by its own thickness. Where it stops follows from where the dura is fixed (bone at the sutures, falx at the
  midline); tests check the order of the layers and each bleed's limits.
- `neurology/cranial-nerves-1.mdx`: nerves in general and cranial nerves I–VI (Testut t. III pp. 45–126).
  `data/eye-nerves.ts` + `components/EyeNerves.tsx` (Lámina XIX): each muscle of the eye with Testut's nerve and
  Moore's pull (abduction, elevation, intorsion). A palsy is derived: at rest the eye drifts by minus the paralysed
  muscles' pulls; in each of the nine gazes it fails where the one muscle that moves it there is lost, and the eyes
  see double there or where a marked drift persists. Tests check the VI, III, IV and Horner pictures.
- `neurology/cranial-nerves-2.mdx`: the nuclei of the cranial nerves (t. II pp. 719–724) and nerves VII–XII (t. III
  pp. 126–196). `data/cranial-nuclei.ts` + `components/CranialNuclei.tsx` (Lámina XX): every nucleus III–XII on a dorsal
  view (mm), with Testut's columns (bases and heads of the horns, lateral horn) and today's functional ones (Latarjet–Ruiz);
  tests check the two map onto each other (only the mesencephalic V changes sides), the medial→lateral order on the floor
  and Testut's heights. `data/facial-palsy.ts` + `components/FacialPalsy.tsx` (Lámina XXI): the facial as a line of
  stations; a trunk lesion cuts the branches leaving at or beyond it, only for fibres already in the trunk (the intermediary
  joins at the emergence); central lesions spare the upper face. Tests check Moore's levels. The bulb's own nuclei and its
  vessels (Foix–Hillemand, t. II pp. 724–753) are in `neurology.mdx`.
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
- Every 3D viewer's selection card has a «Descripción» button (`skeleton/Description.tsx`): the text comes from
  `data/descriptions/<region>.ts`, keyed by the structure's TA English name without side, registered in
  `data/descriptions/index.ts`; structures without one say so. Written region by region for all five books at once
  (`upper-limb-*.ts`, `lower-limb-*.ts`, `trunk-*.ts`: bones, joints, muscles, vessels, nerves; after Latarjet–Ruiz t. 1, PDF page = printed + 20,
  and t. 2, printed ≈ PDF + 823…828); a whole
  joint is keyed by its `joint-index.ts` `en`, a muscle's heads share its text led by a line of their own. Tests check
  every key exists in some model and that each finished region is fully covered.
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
