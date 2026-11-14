// Fetches every drug's molecule into src/tomes/pharmacology/assets/molecules.json.
//
//   node tools/pharmacology/fetch-molecules.mjs
//
// Drugs are found in src/tomes/pharmacology/data/drugs/*.ts as `id: '…'` followed by
// `cid: N` (PubChem compound id). For each one:
//   - PubChem (public domain): formula, weight, IUPAC name, InChIKey, SMILES, XLogP and the
//     2D depiction (heavy atoms with their hydrogen count, bonds with order and wedges);
//   - Wikidata (CC0): the item id and its ATC codes.
// Runs at development time only; the app reads the JSON and never touches the network.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const drugsDir = join(root, 'src/tomes/pharmacology/data/drugs')
const out = join(root, 'src/tomes/pharmacology/assets/molecules.json')
const UA = 'magnum-opus-tools/0.1 (offline encyclopedia build script)'

const drugs = []
for (const file of readdirSync(drugsDir).filter((f) => f.endsWith('.ts'))) {
  const text = readFileSync(join(drugsDir, file), 'utf8')
  for (const m of text.matchAll(/id: '([a-z0-9-]+)',\s*\n\s*cid: (\d+)/g)) drugs.push({ id: m[1], cid: Number(m[2]) })
}
if (!drugs.length) throw new Error('No drugs found')
console.log(`${drugs.length} drugs`)

async function get(url, accept) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, ...(accept ? { Accept: accept } : {}) } })
    if (res.ok) return res
    if (res.status !== 503 && res.status !== 429) throw new Error(`${res.status} ${url}`)
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
  }
  throw new Error(`Gave up on ${url}`)
}

const PUG = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid'
const chunks = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n))

/** Parses a V2000 molfile into heavy atoms (with H counts and charges) and heavy-atom bonds. */
function parseMolfile(block) {
  const lines = block.split(/\r?\n/)
  const counts = lines[3]
  const nAtoms = Number(counts.slice(0, 3))
  const nBonds = Number(counts.slice(3, 6))
  const all = []
  for (let i = 0; i < nAtoms; i++) {
    const l = lines[4 + i]
    all.push({ x: Number(l.slice(0, 10)), y: Number(l.slice(10, 20)), el: l.slice(31, 34).trim(), h: 0, charge: 0 })
  }
  const rawBonds = []
  for (let i = 0; i < nBonds; i++) {
    const l = lines[4 + nAtoms + i]
    rawBonds.push({ a: Number(l.slice(0, 3)) - 1, b: Number(l.slice(3, 6)) - 1, order: Number(l.slice(6, 9)), stereo: Number(l.slice(9, 12)) })
  }
  for (const l of lines.slice(4 + nAtoms + nBonds)) {
    if (!l.startsWith('M  CHG')) continue
    const f = l.slice(6).trim().split(/\s+/).map(Number)
    for (let k = 1; k < f.length; k += 2) all[f[k] - 1].charge = f[k + 1]
  }
  // Hydrogens become counts on their heavy atom; a wedge drawn to a hydrogen is dropped.
  const index = new Map()
  all.forEach((a, i) => {
    if (a.el !== 'H') index.set(i, index.size)
  })
  const bonds = []
  for (const b of rawBonds) {
    const ha = all[b.a].el === 'H'
    const hb = all[b.b].el === 'H'
    if (ha && !hb) all[b.b].h++
    else if (hb && !ha) all[b.a].h++
    else if (!ha && !hb) {
      const bond = [index.get(b.a), index.get(b.b), b.order]
      if (b.stereo === 1 || b.stereo === 6) bond.push(b.stereo === 1 ? 1 : -1)
      bonds.push(bond)
    }
  }
  const r = (v) => Math.round(v * 1000) / 1000
  const atoms = all
    .filter((a) => a.el !== 'H')
    .map((a) => {
      const atom = [a.el, r(a.x), r(a.y), a.h]
      if (a.charge) atom.push(a.charge)
      return atom
    })
  return { atoms, bonds }
}

const molecules = {}
const byCid = new Map(drugs.map((d) => [d.cid, d.id]))

for (const group of chunks(drugs, 50)) {
  const cids = group.map((d) => d.cid).join(',')
  const props = await (
    await get(`${PUG}/${cids}/property/MolecularFormula,MolecularWeight,IUPACName,InChIKey,ConnectivitySMILES,XLogP/JSON`)
  ).json()
  for (const p of props.PropertyTable.Properties) {
    molecules[byCid.get(p.CID)] = {
      cid: p.CID,
      formula: p.MolecularFormula,
      weight: Number(p.MolecularWeight),
      iupac: p.IUPACName,
      inchikey: p.InChIKey,
      smiles: p.ConnectivitySMILES,
      ...(p.XLogP !== undefined ? { xlogp: p.XLogP } : {}),
      atc: [],
    }
  }
  const sdf = await (await get(`${PUG}/${cids}/SDF?record_type=2d`)).text()
  for (const record of sdf.split('$$$$').filter((r) => r.trim())) {
    const block = record.replace(/^\s*\n/, '')
    const cid = Number(block.split(/\r?\n/)[0].trim())
    const id = byCid.get(cid)
    if (!id) throw new Error(`Unexpected CID ${cid} in SDF`)
    Object.assign(molecules[id], parseMolfile(block))
  }
}

const values = drugs.map((d) => `"${d.cid}"`).join(' ')
const sparql = `SELECT ?item ?cid ?atc WHERE { VALUES ?cid { ${values} } ?item wdt:P662 ?cid . OPTIONAL { ?item wdt:P267 ?atc } }`
const wd = await (
  await get(`https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`, 'application/sparql-results+json')
).json()
for (const b of wd.results.bindings) {
  const m = molecules[byCid.get(Number(b.cid.value))]
  m.wikidata ??= b.item.value.split('/').pop()
  if (b.atc && !m.atc.includes(b.atc.value)) m.atc.push(b.atc.value)
}
for (const m of Object.values(molecules)) m.atc.sort()

const sorted = Object.fromEntries(Object.keys(molecules).sort().map((k) => [k, molecules[k]]))
const missing = drugs.filter((d) => !molecules[d.id]?.atoms)
if (missing.length) throw new Error(`No molecule for ${missing.map((d) => d.id).join(', ')}`)
writeFileSync(out, JSON.stringify(sorted) + '\n')
console.log(`Wrote ${Object.keys(sorted).length} molecules to ${out}`)
