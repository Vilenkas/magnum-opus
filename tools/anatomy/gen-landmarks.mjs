// Z-Anatomy landmark export (export_landmarks.py) → src/tomes/anatomy/assets/landmarks.json.
// Cleans source typos, drops labels that name a whole bone, and checks that every landmark
// has a Spanish name in src/tomes/anatomy/data/landmark-names.ts.
// Usage: node tools/anatomy/gen-landmarks.mjs <out-dir>/landmarks.json
import { readFileSync, writeFileSync } from 'node:fs'
import { landmarkNames } from '../../src/tomes/anatomy/data/landmark-names.ts'
import { bonePieces } from '../../src/tomes/anatomy/data/bones.ts'

const [inPath] = process.argv.slice(2)
const outPath = new URL('../../src/tomes/anatomy/assets/landmarks.json', import.meta.url)

// Typos in the source model.
const FIXES = {
  'Lateral lip of linea apera': 'Lateral lip of linea aspera',
  'Medial lip of linea apera': 'Medial lip of linea aspera',
  'Supercilliary arch': 'Superciliary arch',
}

// Labels that name the bone itself rather than a landmark on it.
const WHOLE_BONE = new Set([
  'Atlas', 'Axis (C2', 'Cervical vertebra', 'Coccyx', 'Femur', 'Fibula', 'Fifth metatarsal bone',
  'First metatarsal bone', 'Hip bone', 'Humerus', 'Manubrium of sternum', 'Radius', 'Rib', 'Sacrum',
  'Scapula', 'Stapes', 'Thoracic vertebra', 'Tibia', 'Ulna', 'Vertebra', 'Xiphoid process',
])

// Sinus meshes are not exported (they sit inside their bone): attach to the bone.
const PIECE_REMAP = { 'sinus-of-frontal-bone': 'frontal-bone', 'sinus-of-sphenoid-bone': 'sphenoid-bone' }
const pieceIds = new Set(bonePieces.map((p) => p.id))

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const raw = JSON.parse(readFileSync(inPath, 'utf8'))
const out = []
const missing = new Set()

for (const l of raw) {
  let en = l.nameEn.trim().replace(/^\[(.*)\]$/, '$1')
  en = FIXES[en] ?? en
  if (WHOLE_BONE.has(en)) continue
  if (!landmarkNames[en]) missing.add(en)
  const pieceId = PIECE_REMAP[l.pieceId] ?? l.pieceId
  if (!pieceIds.has(pieceId)) throw new Error(`Landmark ${en} sits on unknown piece ${pieceId}`)
  out.push({
    id: `${slug(en)}--${pieceId}`,
    en,
    pieceId,
    p: l.point,
    n: l.normal.map((v) => Math.round(v * 1000) / 1000),
    ...(l.inconstant ? { inconstant: true } : {}),
    ...(l.opening ? { opening: true } : {}),
  })
}

out.sort((a, b) => a.id.localeCompare(b.id))
const usedNames = new Set(out.map((l) => l.en))
const unused = Object.keys(landmarkNames).filter((k) => !usedNames.has(k))

if (missing.size) {
  console.error(`Missing Spanish names (${missing.size}):\n  ` + [...missing].sort().join('\n  '))
  process.exit(1)
}
if (unused.length) console.warn(`Unused entries in landmark-names.ts (${unused.length}): ${unused.join(', ')}`)

writeFileSync(outPath, JSON.stringify(out))
console.log(`wrote ${out.length} landmarks (${usedNames.size} names) on ${new Set(out.map((l) => l.pieceId)).size} pieces`)
