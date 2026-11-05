// Z-Anatomy heart, vessels and lymphoid organs + TA2 -> assets/vessels.json.
// Usage: node tools/anatomy/gen-vessels.mjs <vessels-meta.json> <TA2.csv> <out.json>
// Generated file: never edit by hand.
import { readFileSync, writeFileSync } from 'node:fs'
import { loadTa2 } from './ta2.mjs'

const [metaPath, taPath, outPath] = process.argv.slice(2)
const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
const lookup = loadTa2(taPath)

const missing = new Set()
const missingGroups = new Set()
const out = meta.map((m) => {
  const names = lookup(m.nameEn)
  if (!names.es) missing.add(m.nameEn)
  const groups = m.groups.map((g) => {
    const t = lookup(g)
    if (!t.es) missingGroups.add(g)
    return { en: g, es: t.es }
  })
  // Meshes such as the pulmonary trunk carry no vessel material: their TA group decides.
  const kind =
    m.set === 'vessels' && m.kind === 'organ'
      ? m.groups.includes('Arterial system')
        ? m.groups.includes('Pulmonary arteries') ? 'pulmonary-artery' : 'artery'
        : m.groups.includes('Venous system') ? 'vein' : m.kind
      : m.kind
  return { set: m.set, id: m.id, kind, side: m.side, en: m.nameEn, la: names.la, es: names.es, groups }
})

writeFileSync(outPath, '[\n' + out.map((o) => JSON.stringify(o)).join(',\n') + '\n]\n')

const names = new Set(out.map((o) => o.en))
console.log('entries', out.length, '· named in TA2', `${names.size - missing.size}/${names.size}`)
console.log('without TA2 name:', [...missing].slice(0, 40))
console.log('groups without TA2 name:', [...missingGroups])
