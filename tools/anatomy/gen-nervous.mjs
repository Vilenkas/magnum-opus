// Z-Anatomy nervous system + TA2 -> assets/nervous.json (same shape as vessels.json).
// Usage: node tools/anatomy/gen-nervous.mjs <nervous-meta.json> <TA2.csv> <out.json>
// Generated file: hand corrections go in src/tomes/anatomy/data/nervous-names.ts.
import { readFileSync, writeFileSync } from 'node:fs'
import { loadTa2 } from './ta2.mjs'

const [metaPath, taPath, outPath] = process.argv.slice(2)
const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
const lookup = loadTa2(taPath)

const LOBES = {
  'Frontal lobe': 'frontal',
  'Parietal lobe': 'parietal',
  'Temporal lobe': 'temporal',
  'Occipital lobe': 'occipital',
  'Limbic lobe': 'limbic',
  Insula: 'insula',
}

/** What a piece is, from its TA groups first and its material (Z-Anatomy's colour) second. */
function kindOf(m) {
  const g = new Set(m.groups)
  const mat = m.materials[0] ?? ''
  if (g.has('Sense organs')) return 'sense'
  if (g.has('Meninges')) return 'meninges'
  if (g.has('Peripheral nervous system') || (mat === 'Nerve' || mat.startsWith('Nerve-'))) return 'nerve'
  if (g.has('Spinal cord')) return mat === 'White matter' ? 'cord-white' : 'cord-grey'
  if (mat.startsWith('Nucleus')) return 'nucleus'
  if (g.has('Cerebellum') || mat === 'Cerebellum') return 'cerebellum'
  if (g.has('Brainstem')) return 'brainstem'
  // The white matter mass of each hemisphere (translucent on the plate) apart from the bundles
  // inside it: the corpus callosum (coloured like the frontal lobe in the model), commissures, fornix.
  if (/^White matter of/.test(m.nameEn)) return 'white'
  if (g.has('Commissural fibres of telencephalon') || mat === 'White matter') return 'tract'
  if (LOBES[mat]) return LOBES[mat]
  if (mat === 'Interlobar sulci') return 'sulcus'
  if (mat === 'LCR') return 'csf'
  return 'nucleus'
}

const missing = new Set()
const missingGroups = new Set()
const kinds = {}
const out = meta.map((m) => {
  const names = lookup(m.nameEn)
  if (!names.es) missing.add(m.nameEn)
  const groups = m.groups.map((g) => {
    const t = lookup(g)
    if (!t.es) missingGroups.add(g)
    return { en: g, es: t.es }
  })
  const kind = kindOf(m)
  kinds[kind] = (kinds[kind] ?? 0) + 1
  return { set: 'nervous', id: m.id, kind, side: m.side, en: m.nameEn, la: names.la, es: names.es, groups }
})

writeFileSync(outPath, '[\n' + out.map((o) => JSON.stringify(o)).join(',\n') + '\n]\n')

const names = new Set(out.map((o) => o.en))
console.log('entries', out.length, '· named in TA2', `${names.size - missing.size}/${names.size}`)
console.log('kinds', kinds)
console.log('without TA2 name:', JSON.stringify([...missing]))
console.log('groups without TA2 name:', JSON.stringify([...missingGroups]))
