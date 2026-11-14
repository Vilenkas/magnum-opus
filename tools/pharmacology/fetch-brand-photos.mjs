// Fetches product photos of each drug's brand into src/tomes/pharmacology/figures/private/
// (git-ignored, personal use) and writes the folder's index.ts.
//
//   node tools/pharmacology/fetch-brand-photos.mjs
//
// For every card with a `brand`:
//   1. CIMA (Spain's AEMPS): the first presentation named after the brand that has photos —
//      the pack (`materialas`) and the dosage form (`formafarmac`). Oral forms first.
//   2. Otherwise DailyMed (US NLM): the first label image of the brand whose file name says it is
//      the carton or the package label (other images are charts or formulas).
// Brands sold under another name in both countries get no photo. Needs ImageMagick (`magick`).
// The app never depends on these files: without the folder, the brand is plain text.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const drugsDir = join(root, 'src/tomes/pharmacology/data/drugs')
const out = join(root, 'src/tomes/pharmacology/figures/private')
const tmp = join(out, '.tmp')
const UA = 'magnum-opus-tools/0.1 (offline encyclopedia build script)'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(url, as = 'json') {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.ok) return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer())
    if (res.status === 404) return null
    await sleep(1500 * (attempt + 1))
  }
  return null
}

// Cards with a brand: each object starts with `id: '…'` and may carry `brand: '…'`.
const drugs = []
for (const file of readdirSync(drugsDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const text = readFileSync(join(drugsDir, file), 'utf8')
  for (const chunk of text.split(/\n {4}id: '/).slice(1)) {
    const id = chunk.slice(0, chunk.indexOf("'"))
    const brand = chunk.match(/\n {4}brand: '([^']+)'/)?.[1]
    if (brand) drugs.push({ id, brand })
  }
}
console.log(`${drugs.length} brands`)

const ORAL = /COMPRIMIDO|CAPSULA|CÁPSULA|GRAGEA/i
const startsWithBrand = (name, brand) => name.toUpperCase().startsWith(brand.toUpperCase() + ' ')

async function fromCima(brand) {
  const data = await get(`https://cima.aemps.es/cima/rest/medicamentos?nombre=${encodeURIComponent(brand)}`)
  const hits = (data?.resultados ?? []).filter((r) => r.fotos?.length && startsWithBrand(r.nombre, brand))
  hits.sort((a, b) => Number(ORAL.test(b.nombre)) - Number(ORAL.test(a.nombre)))
  const hit = hits[0]
  if (!hit) return null
  const photo = (tipo) => hit.fotos.find((f) => f.tipo === tipo)?.url
  return {
    box: photo('materialas'),
    pill: photo('formafarmac'),
    credit: `CIMA, Agencia Española de Medicamentos y Productos Sanitarios: ${hit.nombre}`,
    url: `https://cima.aemps.es/cima/publico/detalle.html?nregistro=${hit.nregistro}`,
    where: 'España',
  }
}

/**
 * The image of the label's «package label, principal display panel» section (LOINC 51945-4):
 * the carton or bottle as sold. Falls back to an image whose file name says so.
 */
async function packImage(setid, media) {
  const xml = await get(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`, 'buffer')
  if (xml) {
    const text = xml.toString('utf8')
    for (const at of [...text.matchAll(/code="51945-4"/g)].map((m) => m.index)) {
      const end = text.indexOf('</section>', at)
      const ref = text.slice(at, end).match(/<reference value="([^"]+\.(?:jpe?g|png|gif))"/i)?.[1]
      const image = ref && media.find((m) => m.name === ref)
      if (image) return image
    }
  }
  return media.find((m) => /carton|package|label|pdp|principal|container|bottle/i.test(m.name))
}

// Labels of repackagers and relabelers, not of the brand's maker: last resort.
const REPACKAGER =
  /PHYSICIANS TOTAL CARE|A-S MEDICATION|BRYANT RANCH|HARKINS|DISPENSING SOLUTIONS|REMEDYREPACK|PROFICIENT RX|QUALITY CARE|DIRECT[_ ]?RX|NUCARE|PD-RX|AIDAREX|STAT RX|LAKE ERIE|CARDINAL|AMERICAN HEALTH PACKAGING|PREFERRED PHARMACEUTICALS|RXCHANGE|UNIT DOSE SERVICES|REBEL DISTRIBUTORS|DENTON|HENRY SCHEIN|MCKESSON|PACKAGING|REPACK|NORTHWIND|ST\. MARY|MEDSOURCE|CLINICAL SOLUTIONS|TYA PHARMACEUTICALS|H2-PHARMA/i
const ORAL_EN = /TABLET|CAPSULE/i

/** A label's title names every product in it: keep the first («ZYPREXA (OLANZAPINE) TABLET»). */
function firstProduct(title, brand) {
  const t = title.replace(/\s+\[.*$/, '')
  const again = t.toUpperCase().indexOf(' ' + brand.toUpperCase(), 1)
  return again > 0 ? t.slice(0, again) : t
}

async function fromDailyMed(brand) {
  const list = await get(
    `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(brand)}&pagesize=50`,
  )
  // The maker's own label first, oral forms before injections.
  const score = (t) => (REPACKAGER.test(t) ? -2 : 0) + (ORAL_EN.test(t) ? 1 : 0)
  const spls = (list?.data ?? [])
    .filter((s) => startsWithBrand(s.title, brand))
    .sort((a, b) => score(b.title) - score(a.title))
  for (const spl of spls.slice(0, 8)) {
    const media = await get(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${spl.setid}/media.json`)
    const images = (media?.data?.media ?? []).filter((m) => m.mime_type.startsWith('image/'))
    const image = images.length ? await packImage(spl.setid, images) : undefined
    if (image) {
      return {
        box: image.url,
        credit: `DailyMed, National Library of Medicine: ${firstProduct(spl.title, brand)}`,
        url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${spl.setid}`,
        where: 'Estados Unidos',
      }
    }
    await sleep(250)
  }
  return null
}

/** Downloads an image and stores it as WebP, at most 640 px on its long side. */
async function save(url, name) {
  const buf = await get(url, 'buffer')
  if (!buf) return false
  const raw = join(tmp, name + '.src')
  writeFileSync(raw, buf)
  execFileSync('magick', [raw, '-resize', '640x640>', '-quality', '82', join(out, name)])
  return true
}

rmSync(out, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })

const entries = []
for (const { id, brand } of drugs) {
  const found = (await fromCima(brand)) ?? (await fromDailyMed(brand))
  await sleep(300)
  if (!found) {
    console.log(`  ·  ${brand} (${id}): no photo`)
    continue
  }
  const kinds = [
    ['box', found.box, 'envase'],
    ['pill', found.pill, 'forma farmacéutica'],
  ]
  const got = []
  for (const [kind, url, label] of kinds) {
    if (!url) continue
    const file = `brand-${id}-${kind}.webp`
    if (await save(url, file)) {
      got.push(kind)
      entries.push({
        id: `brand-${id}-${kind}`,
        file,
        title: `${brand}®, ${label} (${found.where})`,
        credit: found.credit,
        license: 'restricted',
        url: found.url,
      })
    }
  }
  console.log(`  ✓  ${brand} (${id}): ${got.join(' + ')} · ${found.where}`)
}

rmSync(tmp, { recursive: true, force: true })
const index = `import type { FigureEntry } from '../types'

// Generated by tools/pharmacology/fetch-brand-photos.mjs: product photos for personal use only.
export const figures: FigureEntry[] = ${JSON.stringify(entries, null, 2)}
`
writeFileSync(join(out, 'index.ts'), index)
console.log(`${entries.length} photos for ${new Set(entries.map((e) => e.id.replace(/-(box|pill)$/, ''))).size} brands`)
