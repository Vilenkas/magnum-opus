import { describe, expect, it } from 'vitest'
import nervous from '../../assets/nervous.json'
import soft from '../../assets/soft-tissues.json'
import vessels from '../../assets/vessels.json'
import { JOINTS } from '../joint-index'
import { pieces } from '../skeleton'
import { DESCRIPTION_FILES, descriptionKey, descriptionOf, sourceLabel } from './index'

const known = new Set(
  [...pieces, ...(soft as { en: string }[]), ...(vessels as { en: string }[]), ...(nervous as { en: string }[]), ...JOINTS].map((e) => descriptionKey(e.en)),
)

describe('descriptions', () => {
  it('describe only structures that exist in a viewer’s model', () => {
    for (const [file, entries] of Object.entries(DESCRIPTION_FILES))
      for (const en of Object.keys(entries)) expect(known.has(descriptionKey(en)), `${file}: ${en}`).toBe(true)
  })

  it('are written in paragraphs and cite at least one source, with balanced emphasis marks', () => {
    for (const entries of Object.values(DESCRIPTION_FILES))
      for (const [en, d] of Object.entries(entries)) {
        expect(d.text.length, en).toBeGreaterThan(0)
        expect(d.sources.length, en).toBeGreaterThan(0)
        for (const p of d.text) expect((p.match(/\*\*/g) ?? []).length % 2, en).toBe(0)
      }
  })

  it('describe every bone, joint, joint piece, muscle and nerve of the upper limb, and its main vessels', () => {
    const upper = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'joints' && e.groups?.some((g) => /upper limb|pectoral girdle|of hand/i.test(g.en)),
    )
    for (const e of upper) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const j of JOINTS.filter((j) => j.region === 'upper-limb')) expect(descriptionOf(j.en), j.en).toBeDefined()
    const muscles = (soft as { set: string; kind: string; part?: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) =>
        e.set === 'muscles' &&
        e.kind === 'muscle' &&
        e.part === 'belly' &&
        e.groups?.some((g) => g.en === 'Muscles of upper limb' || /^(Trapezius|Latissimus dorsi|Pectoralis major) muscle$/.test(g.en)),
    )
    expect(muscles.length).toBeGreaterThan(50)
    for (const e of muscles) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of ['Serratus anterior muscle', 'Pectoralis minor muscle', 'Subclavius muscle', 'Rhomboid major muscle', 'Levator scapulae'])
      expect(descriptionOf(en), en).toBeDefined()
    const plexus = (nervous as { en: string; groups?: { en: string }[] }[]).filter((e) => e.groups?.some((g) => g.en === 'Brachial plexus'))
    expect(plexus.length).toBeGreaterThan(50)
    for (const e of plexus) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of ['Axillary artery', 'Brachial artery', 'Radial artery', 'Ulnar artery', 'Superficial palmar arch', 'Deep palmar arch', 'Cephalic vein', 'Basilic vein', 'Axillary vein', 'Apical axillary nodes'])
      expect(descriptionOf(en), en).toBeDefined()
    for (const p of pieces.filter((p) => ['pectoral-girdle', 'arm-forearm', 'carpals', 'metacarpals', 'hand-phalanges'].includes(p.group)))
      expect(descriptionOf(p.en), p.en).toBeDefined()
  })

  it('describe every bone, joint, joint piece, muscle and nerve of the pelvis and the lower limb, and its main vessels', () => {
    const lower = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'joints' && (!e.groups?.length || e.groups.some((g) => /lower limb|pelvic girdle|of foot|ankle/i.test(g.en))),
    )
    expect(lower.length).toBeGreaterThan(80)
    for (const e of lower) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const j of JOINTS.filter((j) => j.region === 'lower-limb' || j.region === 'pelvis')) expect(descriptionOf(j.en), j.en).toBeDefined()
    const muscles = (soft as { set: string; kind: string; part?: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'muscles' && e.kind === 'muscle' && e.part === 'belly' && e.groups?.some((g) => /lower limb/i.test(g.en)),
    )
    expect(muscles.length).toBeGreaterThan(50)
    for (const e of muscles) expect(descriptionOf(e.en), e.en).toBeDefined()
    const plexus = (nervous as { en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.groups?.some((g) => /^(Lumbar|Sacral) plexus$/.test(g.en)) && e.en !== 'Superior subscapular nerve',
    )
    expect(plexus.length).toBeGreaterThan(30)
    for (const e of plexus) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of ['Femoral artery', 'Popliteal artery', 'Anterior tibial artery', 'Posterior tibial artery', 'Dorsalis pedis artery', 'Plantar arch', 'Great saphenous vein', 'Small saphenous vein', 'Femoral vein'])
      expect(descriptionOf(en), en).toBeDefined()
    for (const p of pieces.filter((p) => ['pelvic-girdle', 'thigh-leg', 'tarsals', 'metatarsals', 'foot-phalanges', 'foot-sesamoids'].includes(p.group)))
      expect(descriptionOf(p.en), p.en).toBeDefined()
  })

  it('describe every bone, joint, joint piece, muscle and wall nerve of the trunk, and its parietal vessels and nodes', () => {
    const trunk = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'joints' && e.groups?.some((g) => /^(Joints of vertebral column|Thoracic joints)$/.test(g.en)),
    )
    expect(trunk.length).toBeGreaterThan(50)
    for (const e of trunk) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const j of JOINTS.filter((j) => j.region === 'spine' || j.region === 'thorax')) expect(descriptionOf(j.en), j.en).toBeDefined()
    const muscles = (soft as { set: string; kind: string; part?: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'muscles' && e.kind === 'muscle' && e.groups?.some((g) => /^(Dorsal|Thoracic|Abdominal) part of muscular system$/.test(g.en)),
    )
    expect(muscles.length).toBeGreaterThan(50)
    for (const e of muscles) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of ['Intercostal nerves', 'Anterior root of spinal nerve', 'Posterior root of spinal nerve', 'Spinal ganglion', 'Sympathetic trunk', 'Ganglia of sympathetic trunk', 'Iliohypogastric nerve', 'Ilio-inguinal nerve'])
      expect(descriptionOf(en), en).toBeDefined()
    for (const en of ['Thoracic aorta', 'Posterior intercostal arteries', 'Supreme intercostal artery', 'Subcostal artery', 'Internal thoracic artery', 'Internal thoracic veins', 'Superior vena cava', 'Azygos vein', 'Hemi-azygos vein', 'Accessory hemi-azygos vein', 'Right ascending lumbar vein', 'Left ascending lumbar vein'])
      expect(descriptionOf(en), en).toBeDefined()
    const nodes = (vessels as { en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.groups?.some((g) => g.en === 'Thoracic lymph nodes') && !e.groups.some((g) => g.en === 'Pulmonary lymph nodes'),
    )
    expect(nodes.length).toBeGreaterThan(10)
    for (const e of nodes) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const p of pieces.filter((p) => ['cervical-vertebrae', 'thoracic-vertebrae', 'lumbar-vertebrae', 'sacrum-coccyx', 'sternum', 'ribs', 'costal-cartilages'].includes(p.group)))
      expect(descriptionOf(p.en), p.en).toBeDefined()
  })

  it('describe every bone, tooth, cartilage, joint, muscle and cranial nerve of the head and the neck, and its vessels, sinuses and nodes', () => {
    const joints = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'joints' && e.groups?.some((g) => /^(Joints of skull|Laryngeal joints)$/.test(g.en)),
    )
    expect(joints.length).toBeGreaterThan(10)
    for (const e of joints) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const j of JOINTS.filter((j) => j.region === 'head')) expect(descriptionOf(j.en), j.en).toBeDefined()
    const muscles = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'muscles' && e.groups?.some((g) => /^(Cranial part of muscular system|Cervical part of muscular system|Fasciae of head|Cervical fasciae)$/.test(g.en)),
    )
    expect(muscles.length).toBeGreaterThan(100)
    for (const e of muscles) expect(descriptionOf(e.en), e.en).toBeDefined()
    const nerves = (nervous as { en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.en === 'Accessory nerve (XI)' || e.groups?.some((g) => /^(Cranial nerves|Eye|Ear|Meninges)$/.test(g.en)),
    )
    expect(nerves.length).toBeGreaterThan(40)
    for (const e of nerves) expect(descriptionOf(e.en), e.en).toBeDefined()
    const vascular = (vessels as { en: string; groups?: { en: string }[] }[]).filter((e) =>
      e.groups?.some((g) => /^(Lymph nodes of (head|neck)|Dural venous sinuses|Orbital veins|Cerebral arterial circle|Pharyngeal lymphoid ring)$/.test(g.en)),
    )
    expect(vascular.length).toBeGreaterThan(40)
    for (const e of vascular) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of [
      'Right common carotid artery', 'Left common carotid artery', 'External carotid artery', 'Internal carotid artery', 'Facial artery', 'Maxillary artery',
      'Superficial temporal artery', 'Middle meningeal artery', 'Ophthalmic artery', 'Vertebral artery', 'Basilar artery', 'Anterior cerebral artery',
      'Middle cerebral artery (M1-segment)', 'Posterior cerebral artery', 'Right subclavian artery', 'Left subclavian artery', 'Thyrocervical trunk',
      'Costocervical trunk', 'Internal jugular vein', 'External jugular vein', 'Anterior jugular vein', 'Facial vein', 'Retromandibular vein',
      'Right brachiocephalic vein', 'Left brachiocephalic vein', 'Right subclavian vein', 'Left subclavian vein',
    ])
      expect(descriptionOf(en), en).toBeDefined()
    for (const p of pieces.filter((p) => ['cranium', 'mandible', 'hyoid', 'auditory-ossicles', 'nasal-cartilages', 'teeth', 'laryngeal-cartilages'].includes(p.group)))
      expect(descriptionOf(p.en), p.en).toBeDefined()
  })

  it('are found whatever the case, and missing ones say nothing', () => {
    expect(descriptionOf('right atrium')).toBeDefined()
    expect(descriptionOf('Not a structure')).toBeUndefined()
    expect(descriptionOf(undefined)).toBeUndefined()
  })

  it('print short references with volume and page', () => {
    expect(sourceLabel({ fuente: 'testut-2', p: '39' })).toBe('Testut, t. II, p. 39')
    expect(sourceLabel({ fuente: 'latarjet-ruiz-2', p: '869' })).toBe('Latarjet y Ruiz Liard, t. 2, p. 869')
  })
})
