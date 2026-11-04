// One-off generator: Z-Anatomy metadata (English TA names) -> Spanish bones.ts for the anatomy tome.
import { readFileSync, writeFileSync } from 'node:fs'

const [metaPath, outPath] = process.argv.slice(2)
const meta = JSON.parse(readFileSync(metaPath, 'utf8'))

const ORD = { first: 'primer', second: 'segundo', third: 'tercer', fourth: 'cuarto', fifth: 'quinto', sixth: 'sexto',
  seventh: 'séptimo', eighth: 'octavo', ninth: 'noveno', tenth: 'décimo', eleventh: 'undécimo', twelfth: 'duodécimo' }
const ordF = (o) => ({ primer: 'primera', tercer: 'tercera' }[ORD[o]] ?? ORD[o].replace(/o$/, 'a'))
const ordM = (o) => ORD[o]
const cap = (s) => s[0].toUpperCase() + s.slice(1)

// base English name -> [Spanish name, gender of the noun the side adjective agrees with, aliases]
const DICT = {
  'Arytenoid cartilage': ['Cartílago aritenoides', 'm'],
  'Atlas (C1)': ['Atlas (C1)', 'm'],
  'Axis (C2)': ['Axis (C2)', 'm'],
  'Body of sternum': ['Cuerpo del esternón', 'm'],
  Calcaneus: ['Calcáneo', 'm'],
  'Capitate bone': ['Hueso grande', 'm', ['Capitado']],
  Clavicle: ['Clavícula', 'f'],
  Coccyx: ['Cóccix', 'm', ['Coxis']],
  'Corniculate cartilage': ['Cartílago corniculado', 'm'],
  'Cricoid cartilage': ['Cartílago cricoides', 'm'],
  'Cuboid bone': ['Cuboides', 'm'],
  'Ethmoid bone': ['Etmoides', 'm'],
  Femur: ['Fémur', 'm'],
  Fibula: ['Peroné', 'm', ['Fíbula']],
  'Frontal bone': ['Frontal', 'm'],
  'Hamate bone': ['Ganchoso', 'm', ['Hamato', 'Unciforme']],
  'Hip bone': ['Coxal', 'm', ['Hueso ilíaco']],
  Humerus: ['Húmero', 'm'],
  'Hyoid bone': ['Hioides', 'm'],
  Incus: ['Yunque', 'm'],
  'Inferior nasal concha bone': ['Cornete nasal inferior', 'm', ['Concha nasal inferior']],
  'Intermediate cuneiform bone': ['Cuneiforme intermedio', 'm', ['Segundo cuneiforme']],
  'Lacrimal bone': ['Lagrimal', 'm', ['Unguis']],
  'Lateral cuneiform bone': ['Cuneiforme lateral', 'm', ['Tercer cuneiforme']],
  'Lateral process of nasal septal cartilage': ['Apófisis lateral del cartílago del tabique nasal', 'm', ['Cartílago nasal lateral']],
  'Lunate bone': ['Semilunar', 'm', ['Lunatum']],
  'Major alar cartilage': ['Cartílago alar mayor', 'm'],
  Malleus: ['Martillo', 'm'],
  Mandible: ['Mandíbula', 'f', ['Maxilar inferior']],
  'Manubrium of sternum': ['Manubrio del esternón', 'm'],
  Maxilla: ['Maxilar', 'm', ['Maxilar superior']],
  'Medial cuneiform bone': ['Cuneiforme medial', 'm', ['Primer cuneiforme']],
  'Nasal bone': ['Hueso nasal', 'm', ['Nasal', 'Hueso propio de la nariz']],
  'Nasal septal cartilage': ['Cartílago del tabique nasal', 'm', ['Cartílago septal']],
  'Navicular bone': ['Navicular', 'm', ['Escafoides del pie']],
  'Occipital bone': ['Occipital', 'm'],
  'Palatine bone': ['Palatino', 'm'],
  'Parietal bone': ['Parietal', 'm'],
  Patella: ['Rótula', 'f', ['Patela']],
  'Pisiform bone': ['Pisiforme', 'm'],
  Radius: ['Radio', 'm'],
  Sacrum: ['Sacro', 'm'],
  'Scaphoid bone': ['Escafoides', 'm'],
  Scapula: ['Escápula', 'f', ['Omóplato']],
  'Sesamoid bones of foot': ['Sesamoideos del pie', 'm'],
  'Sphenoid bone': ['Esfenoides', 'm'],
  Stapes: ['Estribo', 'm'],
  Talus: ['Astrágalo', 'm', ['Talus']],
  'Temporal bone': ['Temporal', 'm'],
  'Thyroid cartilage': ['Cartílago tiroides', 'm'],
  Tibia: ['Tibia', 'f'],
  'Trapezium bone': ['Trapecio', 'm'],
  'Trapezoid bone': ['Trapezoide', 'm'],
  'Triquetrum bone': ['Piramidal', 'm', ['Triquetro']],
  Ulna: ['Cúbito', 'm', ['Ulna']],
  Vomer: ['Vómer', 'm'],
  'Xiphoid process': ['Apófisis xifoides', 'f', ['Proceso xifoides']],
  'Zygomatic bone': ['Cigomático', 'm', ['Malar']],
}

const TOOTH = { canine: 'canino', 'lateral incisor': 'incisivo lateral', 'medial incisor': 'incisivo central',
  'first molar tooth': 'primer molar', 'second molar tooth': 'segundo molar',
  'first premolar': 'primer premolar', 'second premolar': 'segundo premolar' }

function translate(en) {
  if (DICT[en]) { const [name, g, aliases = [], plural = false] = DICT[en]; return { name, g, aliases, plural } }
  let m
  if ((m = en.match(/^Costal cartilage of (\w+) rib$/)))
    return { name: `Cartílago costal de la ${ordF(m[1])} costilla`, g: 'f' }
  if ((m = en.match(/^(\w+) rib$/))) return { name: `${cap(ordF(m[1].toLowerCase()))} costilla`, g: 'f' }
  if ((m = en.match(/^(\w+) metacarpal bone$/))) return { name: `${cap(ordM(m[1].toLowerCase()))} metacarpiano`, g: 'm' }
  if ((m = en.match(/^(\w+) metatarsal bone$/))) return { name: `${cap(ordM(m[1].toLowerCase()))} metatarsiano`, g: 'm' }
  if ((m = en.match(/^(Distal|Middle|Proximal) phalanx of (\w+) finger of (hand|foot)$/))) {
    const pos = { Distal: 'distal', Middle: 'media', Proximal: 'proximal' }[m[1]]
    const ord = ordM(m[2]) === 'primer' ? 'primer' : ordM(m[2])
    return m[3] === 'hand'
      ? { name: `Falange ${pos} del ${ord} dedo de la mano`, g: 'f' }
      : { name: `Falange ${pos} del ${ord} dedo del pie`, g: 'm' }
  }
  if ((m = en.match(/^Vertebra ([CTL]\d+)$/))) return { name: `Vértebra ${m[1]}`, g: 'f' }
  if ((m = en.match(/^(Upper|Lower) (.+)$/)) && TOOTH[m[2]]) {
    const t = TOOTH[m[2]]
    return { name: `${cap(t)} ${m[1] === 'Upper' ? 'superior' : 'inferior'}`, g: 'm' }
  }
  throw new Error('No translation for ' + en)
}

const sideWord = (side, g, plural) => {
  const base = side === 'left' ? (g === 'f' ? 'izquierda' : 'izquierdo') : g === 'f' ? 'derecha' : 'derecho'
  return plural ? base + 's' : base
}

const CARPALS = ['Scaphoid bone', 'Lunate bone', 'Triquetrum bone', 'Pisiform bone', 'Trapezium bone', 'Trapezoid bone', 'Capitate bone', 'Hamate bone']

function groupOf(m) {
  const en = m.nameEn
  switch (m.group) {
    case 'Bones of cranium': return 'cranium'
    case 'Extracranial bones of head': return en === 'Hyoid bone' ? 'hyoid' : 'mandible'
    case 'Auditory ossicles': return 'auditory-ossicles'
    case 'Nasal cartilages': return 'nasal-cartilages'
    case 'Anterior teeth': case 'Posterior teeth': return 'teeth'
    case 'Laryngeal cartilages': return 'laryngeal-cartilages'
    case 'Cervical vertebrae': return 'cervical-vertebrae'
    case 'Thoracic vertebrae': return 'thoracic-vertebrae'
    case 'Lumbar vertebrae': return 'lumbar-vertebrae'
    case 'Vertebral column': return 'sacrum-coccyx'
    case 'Sternum': return 'sternum'
    case 'True ribs': case 'False ribs': case 'Floating ribs': return 'ribs'
    case 'Costal cartilages': return 'costal-cartilages'
    case 'Bones of pectoral girdle': return 'pectoral-girdle'
    case 'Bones of free part of upper limb':
      if (CARPALS.includes(en)) return 'carpals'
      if (/metacarpal/.test(en)) return 'metacarpals'
      if (/phalanx/.test(en)) return 'hand-phalanges'
      return 'arm-forearm'
    case 'Bones of pelvic girdle': return 'pelvic-girdle'
    case 'Bones of free part of lower limb': return 'thigh-leg'
    case 'Tarsal bones': return 'tarsals'
    case 'Metatarsal bones': return 'metatarsals'
    case 'Phalanges of foot': return 'foot-phalanges'
    case 'Bones of foot': return 'foot-sesamoids'
  }
  throw new Error('No group for ' + m.group)
}

const entries = meta.map((m) => {
  const t = translate(m.nameEn)
  const name = m.side ? `${t.name} ${sideWord(m.side, t.g, t.plural)}` : t.name
  const tissue = /cartilage/i.test(m.nameEn) ? 'cartilage' : m.tissue
  return { id: m.id, name, base: t.name, aliases: t.aliases ?? [], side: m.side, group: groupOf(m), tissue, en: m.nameEn }
})

const q = (s) => `'${s.replace(/'/g, "\\'")}'`
const lines = entries.map((e) => {
  const parts = [`id: ${q(e.id)}`, `name: ${q(e.name)}`, `base: ${q(e.base)}`]
  if (e.aliases.length) parts.push(`aliases: [${e.aliases.map(q).join(', ')}]`)
  if (e.side) parts.push(`side: ${q(e.side)}`)
  parts.push(`group: ${q(e.group)}`)
  if (e.tissue !== 'bone') parts.push(`tissue: ${q(e.tissue)}`)
  parts.push(`en: ${q(e.en)}`)
  return `  { ${parts.join(', ')} },`
})

writeFileSync(outPath, `// Generated from Z-Anatomy (CC BY-SA 4.0) metadata by tools/anatomy, then hand-editable.
// \`id\` must match the node name in assets/skeleton.glb. \`en\` is the Terminologia Anatomica English name.
import type { BonePiece } from './skeleton'

export const bonePieces: BonePiece[] = [
${lines.join('\n')}
]
`)
console.log('wrote', entries.length, 'entries; tissues:', entries.reduce((a, e) => ((a[e.tissue] = (a[e.tissue] || 0) + 1), a), {}))
