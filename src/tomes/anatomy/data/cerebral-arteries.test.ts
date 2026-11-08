import { describe, expect, it } from 'vitest'
import { lostGyri, softened, territoryOfGyrus, vessels, type Artery } from './cerebral-arteries'
import { gyri } from './gyri'

const state = (occluded: string[] = [], communicating = true) => ({ occluded: new Set(occluded), communicating })
const lost = (occluded: string[], communicating = true, side: 'left' | 'right' = 'left') => [...softened(state(occluded, communicating), side)].sort()
const byId = (id: string) => gyri.find((g) => g.id === id)!

describe('the circle of Willis', () => {
  it('perfuses everything when intact', () => {
    expect(lost([])).toEqual([])
    expect(lost([], false)).toEqual([])
  })

  it('makes up for a closed carotid when its communicating arteries are open (Lefort’s ligatures)', () => {
    expect(lost(['carotid-left'])).toEqual([])
    expect(lost(['carotid-left'], false)).toEqual(['aca', 'acha', 'mca'])
  })

  it('feeds the posterior cerebrals from the carotids when the basilar trunk is closed', () => {
    expect(lost(['basilar'])).toEqual([])
    expect(lost(['basilar'], false)).toEqual(['pca'])
    expect(lost(['basilar'], false, 'right')).toEqual(['pca'])
  })

  it('needs only one vertebral', () => {
    expect(lost(['vertebral-left'], false)).toEqual([])
    expect(lost(['vertebral-left', 'vertebral-right'], false)).toEqual(['pca'])
  })

  it('carries the other side’s blood through the anterior communicating', () => {
    expect(lost(['a1-left'])).toEqual([])
    expect(lost(['a1-left'], false)).toEqual(['aca'])
  })

  it('cannot help an artery closed beyond it', () => {
    for (const a of ['aca', 'mca', 'pca', 'acha'] as Artery[]) expect(lost([`${a}-left`])).toEqual([a])
  })

  it('has a terminal artery of each kind on each side', () => {
    const terminals = vessels.filter((v) => v.kind === 'terminal')
    expect(terminals).toHaveLength(8)
  })
})

describe('the cortical territories (figs. 1009–1010)', () => {
  it('gives the anterior cerebral the first frontal, the paracentral lobule and the precuneus', () => {
    for (const id of ['f1', 'paracentral', 'precuneus', 'fi']) expect(territoryOfGyrus(byId(id))).toBe('aca')
  })

  it('gives the middle cerebral the third frontal, the Rolandic gyri, the inferior parietal and the first temporal', () => {
    for (const id of ['f3', 'fa', 'pa', 'p2', 't1', 't2']) expect(territoryOfGyrus(byId(id))).toBe('mca')
  })

  it('gives the posterior cerebral the cuneus and the lingual and fusiform lobules', () => {
    for (const id of ['cuneus', 'lingual', 'fusiform']) expect(territoryOfGyrus(byId(id))).toBe('pca')
  })

  it('derives the anterior cerebral’s crural hemiplegia: the leg’s centres, not the hand’s or the face’s', () => {
    const areas = lostGyri(new Set(['aca'])).map((g) => g.id)
    expect(areas).toContain('paracentral')
    expect(areas).not.toContain('fa')
    expect(areas).not.toContain('f3')
  })

  it('derives the silvian syndrome: motor area, Broca, Wernicke and the angular gyrus', () => {
    const areas = lostGyri(new Set(['mca'])).map((g) => g.localization?.area)
    expect(areas).toEqual(expect.arrayContaining(['motor', 'sensory', 'language', 'auditory']))
  })

  it('derives the hemianopia of the posterior cerebral from the calcarine area alone', () => {
    const areas = lostGyri(new Set(['pca']))
    expect(areas.some((g) => g.localization?.area === 'visual' && g.face === 'medial')).toBe(true)
    expect(areas.every((g) => g.localization?.area !== 'motor')).toBe(true)
  })
})
