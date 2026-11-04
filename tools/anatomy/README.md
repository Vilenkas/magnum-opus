# Anatomy asset pipeline

Rebuilds `src/tomes/anatomy/assets/skeleton.glb` and `src/tomes/anatomy/data/bones.ts`
from the Z-Anatomy Blender template.

## Source

- Z-Anatomy, CC BY-SA 4.0 — https://github.com/Z-Anatomy/Models-of-human-anatomy
  (`Z-Anatomy.zip` → `Z-Anatomy/Startup.blend`, ~300 MB)
- Derived from BodyParts3D, The Database Center for Life Science, CC BY-SA 2.1 Japan.

Derived assets in this repo (`skeleton.glb`) inherit **CC BY-SA**: keep the attribution
visible wherever the model is shown.

## Steps

Requires Blender 5.1+ and Node 22+. Keep the downloaded file outside the repo.

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

## Notes on the source model

- Names are Terminologia Anatomica (English); paired pieces end in `.l` / `.r`.
- Objects ending in `.i` / `.j` are 2-vertex label leader lines, not geometry. One end sits on
  the anatomical landmark (acromion, greater trochanter…): a future source for quiz pins.
- `.g` objects are text labels that act as group parents (e.g. `True ribs.g`).
