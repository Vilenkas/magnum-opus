import { describe, expect, it } from 'vitest'
import { LYMPH_GROUPS, PEDICLES, supply, TERRITORIES, VESSELS, ZONES } from './stomach-vessels'

const tie = (...ids: string[]) => supply(new Set(ids))

describe('the arterial circle of the stomach (Testut pp. 218–225; Moore 8 p. 460)', () => {
  it('feeds every zone directly when nothing is tied', () => {
    expect(Object.values(tie()).every((s) => s === 'direct')).toBe(true)
  })

  it('a tied left gastric is replaced along the lesser curvature by the right gastric', () => {
    const s = tie('leftGastric')
    expect(s.lesserUpper).toBe('collateral')
    expect(s.cardia).toBe('direct')
  })

  it('a stopped coeliac trunk is bypassed through the pancreaticoduodenal arcades', () => {
    const s = tie('celiacTrunk')
    expect(s.greaterRight).toBe('collateral')
    expect(s.lesserUpper).toBe('collateral')
    expect(Object.values(s)).not.toContain('lost')
  })

  it('with both gastroepiploics tied, the greater curvature lives on the wall network', () => {
    const s = tie('leftGastroepiploic', 'rightGastroepiploic')
    expect(s.greaterLeft).toBe('wall')
    expect(s.greaterRight).toBe('wall')
  })

  it('tying all its pedicles does not kill the stomach (Testut p. 251)', () => {
    const s = tie(...PEDICLES)
    expect(Object.values(s)).not.toContain('lost')
  })

  it('only the anastomoses cannot be tied', () => {
    expect(
      VESSELS.filter((v) => v.anastomosis)
        .map((v) => v.id)
        .sort(),
    ).toEqual(['cardioesophageal', 'greaterArc', 'lesserArc', 'pancreaticoduodenal'])
  })
})

describe('the lymphatic territories (Testut fig. 244)', () => {
  it('give every zone one territory, and every territory a chain ending in the coeliac nodes', () => {
    const groups = new Set(LYMPH_GROUPS.map((g) => g.id))
    for (const t of TERRITORIES) {
      expect(t.chain.at(-1)).toBe('celiac')
      for (const g of t.chain) expect(groups.has(g)).toBe(true)
      expect(ZONES.some((z) => z.territory === t.id)).toBe(true)
    }
  })

  it('drain the pylorus’ lower border towards the liver, and the fundus towards the spleen', () => {
    const chainOf = (id: string) => TERRITORIES.find((t) => t.id === ZONES.find((z) => z.id === id)!.territory)!.chain
    expect(chainOf('greaterRight')).toContain('hepatic')
    expect(chainOf('fundus')).toContain('splenicHilum')
    expect(chainOf('lesserUpper')).toContain('coronary')
  })
})
