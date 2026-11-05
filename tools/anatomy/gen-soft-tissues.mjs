// Z-Anatomy soft-tissue metadata + Terminologia Anatomica 2 (TA2.csv) -> assets/soft-tissues.json.
// Usage: node tools/anatomy/gen-soft-tissues.mjs <soft-meta.json> <TA2.csv> <out.json>
// Generated file: hand corrections go in data/soft-names.ts, never here.
import { readFileSync, writeFileSync } from 'node:fs'

const [metaPath, taPath, outPath] = process.argv.slice(2)
const meta = JSON.parse(readFileSync(metaPath, 'utf8'))

// TA2.csv: one quoted line per term, ';'-separated: TA2ID;English;Latin;Français;Español;…
const ta = new Map()
for (const line of readFileSync(taPath, 'utf8').replace(/^﻿/, '').split(/\r?\n/).slice(1)) {
  const cols = line.replace(/^"|"$/g, '').split(';')
  if (cols.length < 5 || !cols[1]) continue
  const key = cols[1].trim().toLowerCase()
  if (!ta.has(key)) ta.set(key, { la: cols[2].trim(), es: cols[4].trim() })
}

/** The tome says "peroné" (classical Spanish); TA2 Spanish says "fíbula". */
const spanish = (es) => es && es.replace(/\bfíbula\b/g, 'peroné').replace(/\bFíbula\b/g, 'Peroné')

const lookup = (en) => {
  const hit = ta.get(en.toLowerCase().replace(/^\(|\)$/g, ''))
  return hit ? { la: hit.la, es: spanish(hit.es) } : { la: null, es: null }
}

const bones = new Set(
  [...readFileSync('src/tomes/anatomy/data/bones.ts', 'utf8').matchAll(/id: '([^']+)'/g)].map((m) => m[1]),
)
const bellies = meta.filter((m) => m.set === 'muscles' && m.part === 'belly' && m.kind === 'muscle')
const muscleIds = new Set(bellies.map((m) => m.id))

/**
 * The muscle pieces an insertion belongs to. The model sometimes splits a muscle into its
 * heads or parts ("Long head of biceps brachii") while its insertions name the whole muscle.
 */
/** Muscles the model only has as their components. Tendons and ligaments stay unlinked. */
const COMPOSITE = {
  'quadriceps femoris muscle': ['rectus femoris', 'vastus lateralis', 'vastus medialis', 'vastus intermedius'],
  'triceps surae muscle': ['gastrocnemius', 'soleus'],
  'iliopsoas muscle': ['iliacus', 'psoas major'],
  'erector spinae': ['iliocostalis', 'longissimus', 'spinalis'],
}

function musclePieces(ins) {
  if (muscleIds.has(ins.muscle)) return [ins.muscle]
  const unsided = ins.muscle.replace(/-[lr]$/, '')
  if (muscleIds.has(unsided)) return [unsided]
  const whole = ins.muscleEn.toLowerCase().replace(/^\(|\)$/g, '')
  const keys = COMPOSITE[whole] ?? [whole.replace(/ muscle$/, '')]
  return bellies
    .filter((b) => keys.some((k) => b.nameEn.toLowerCase().includes(k)) && (b.side ?? null) === (ins.side ?? null))
    .map((b) => b.id)
}

const out = []
const missing = { muscles: new Set(), joints: new Set(), insertions: new Set(), groups: new Set() }
const unlinked = { bone: [], muscle: [] }

for (const m of meta) {
  const en = m.set === 'insertions' ? m.muscleEn : m.nameEn
  const names = lookup(en)
  if (!names.es) missing[m.set].add(en)
  const groups = (m.groups ?? []).map((g) => {
    const t = lookup(g)
    if (!t.es) missing.groups.add(g)
    return { en: g, es: t.es }
  })
  let pieces
  if (m.set === 'insertions') {
    pieces = musclePieces(m)
    if (!bones.has(m.bone)) unlinked.bone.push(`${m.id} -> ${m.bone}`)
    if (!pieces.length) unlinked.muscle.push(`${m.id} -> ${m.muscleEn}`)
  }
  out.push({
    ...m,
    verts: undefined,
    en,
    la: names.la,
    es: names.es,
    groups: m.set === 'insertions' ? undefined : groups,
    musclePieces: pieces,
  })
}

// One entry per line: compact, and diffs stay readable.
writeFileSync(outPath, '[\n' + out.map((o) => JSON.stringify(o)).join(',\n') + '\n]\n')

const pct = (set) => {
  const all = new Set(out.filter((o) => o.set === set).map((o) => o.en))
  return `${all.size - missing[set].size}/${all.size}`
}
console.log('entries', out.length)
console.log('named in TA2: muscles', pct('muscles'), '· joints', pct('joints'), '· insertions', pct('insertions'))
console.log('groups without TA2 name:', missing.groups.size, [...missing.groups].slice(0, 12))
console.log('insertions on unknown bones:', unlinked.bone.length, unlinked.bone.slice(0, 6))
console.log('insertions of unexported muscles:', unlinked.muscle.length, unlinked.muscle.slice(0, 6))
