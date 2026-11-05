# Anatomy asset pipeline

Rebuilds `src/tomes/anatomy/assets/skeleton.glb` and `src/tomes/anatomy/data/bones.ts`
from the Z-Anatomy Blender template.

## Source

- Z-Anatomy, CC BY-SA 4.0 — https://github.com/Z-Anatomy/Models-of-human-anatomy
  (`Z-Anatomy.zip` → `Z-Anatomy/Startup.blend`, ~300 MB). Kept in the git-ignored local library:
  **`library/anatomy/z-anatomy/Z-Anatomy/Startup.blend`**, next to `TA2.csv` (Terminologia Anatomica 2:
  English, Latin, Spanish…, from the same repository) and `License.txt`.
- Derived from BodyParts3D, The Database Center for Life Science, CC BY-SA 2.1 Japan.

Derived assets in this repo (`skeleton.glb`) inherit **CC BY-SA**: keep the attribution
visible wherever the model is shown.

## Steps

Requires Blender 5.1+ and Node 22+. `BLEND=library/anatomy/z-anatomy/Z-Anatomy/Startup.blend`.

```sh
# 1. Export whole bones (no landmarks) from the "1: Skeletal system" collection.
#    --disable-autoexec: the .blend ships Python scripts; never run them.
blender -b --factory-startup --disable-autoexec path/to/Startup.blend \
  --python tools/anatomy/export_skeleton.py -- <out-dir>
# → <out-dir>/skeleton-raw.glb (~8.5 MB), <out-dir>/skeleton-meta.json

# 2. Quantize + meshopt-compress (~2 MB). Meshopt decodes without a CDN, unlike Draco.
pnpm dlx @gltf-transform/cli optimize <out-dir>/skeleton-raw.glb src/tomes/anatomy/assets/skeleton.glb \
  --compress meshopt --texture-compress false --simplify false --join false --instance false --flatten false

# 3. Regenerate Spanish names. WARNING: overwrites manual edits to bones.ts.
node tools/anatomy/gen-bones.mjs <out-dir>/skeleton-meta.json src/tomes/anatomy/data/bones.ts
```

## Bony landmarks

```sh
# 4. Export landmark points + smoothed surface normals (right side, mirrored to the left).
blender -b --factory-startup --disable-autoexec path/to/Startup.blend \
  --python tools/anatomy/export_landmarks.py -- <out-dir>
# → <out-dir>/landmarks.json (rejects whole-group labels; keeps openings off-surface)

# 5. Clean names, drop whole-bone labels, check translations → assets/landmarks.json.
#    Fails if a landmark lacks a Spanish name in data/landmark-names.ts or sits on an unknown piece.
node tools/anatomy/gen-landmarks.mjs <out-dir>/landmarks.json
```

Spanish names live in `src/tomes/anatomy/data/landmark-names.ts` (hand-edited, never
generated), so re-exporting positions never loses corrections.

## Notes on the source model

- Names are Terminologia Anatomica (English); paired pieces end in `.l` / `.r`.
- Objects ending in `.i` / `.j` are 2-vertex label leader lines, not geometry. One end sits on
  the anatomical landmark (acromion, greater trochanter…): a future source for quiz pins.
- `.g` objects are text labels that act as group parents (e.g. `True ribs.g`).

## Soft tissues: muscles, joints and muscular insertions

```sh
# 6. Export "4: Muscular system" (muscle bellies and tendons as separate pieces, fasciae, bursae),
#    "3: Joints" (ligaments, capsules, discs) and "2: Muscular insertions" (origin/insertion
#    areas on the bones, subdivision removed), in the skeleton's coordinates.
blender -b --factory-startup --disable-autoexec $BLEND   --python tools/anatomy/export_soft_tissues.py -- <out-dir>
# → muscles-raw.glb, joints-raw.glb, insertions-raw.glb, soft-meta.json

# 7. Compress. Muscles are simplified (~1M vertices otherwise); the rest keeps its geometry.
for n in joints insertions; do
  pnpm dlx @gltf-transform/cli optimize <out-dir>/$n-raw.glb src/tomes/anatomy/assets/$n.glb     --compress meshopt --texture-compress false --simplify false --join false --instance false --flatten false
done
pnpm dlx @gltf-transform/cli optimize <out-dir>/muscles-raw.glb src/tomes/anatomy/assets/muscles.glb   --compress meshopt --texture-compress false --simplify true --simplify-ratio 0.5 --simplify-error 0.0005   --join false --instance false --flatten false

# 8. Names from TA2 (Latin + Spanish, "fíbula" → "peroné") and links insertion → bone and
#    insertion → muscle pieces (heads, composite muscles) → assets/soft-tissues.json.
node tools/anatomy/gen-soft-tissues.mjs <out-dir>/soft-meta.json library/anatomy/z-anatomy/TA2.csv   src/tomes/anatomy/assets/soft-tissues.json
```

`data/soft-tissues.test.ts` checks the three .glb against `soft-tissues.json` node by node.
