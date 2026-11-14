import { describe, expect, it } from 'vitest'
import { drugById, isWithin } from './catalog'
import { profiles, sortedBy } from './antipsychotic-profiles'

const lvl = (id: string) => profiles.find((p) => p.id === id)!.levels

describe('antipsychotic profiles (Katzung cuadro 29-1)', () => {
  it('name antipsychotics of the bank, on a 0-4 scale', () => {
    for (const p of profiles) {
      const drug = drugById.get(p.id)
      expect(drug, p.id).toBeDefined()
      expect(isWithin(drug!.classes[0], 'antipsychotics')).toBe(true)
      for (const v of Object.values(p.levels)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(4)
      }
    }
  })

  it('show the typicals with more extrapyramidal toxicity than every atypical', () => {
    const typical = profiles.filter((p) => isWithin(drugById.get(p.id)!.classes[0], 'ap-typical'))
    const atypical = profiles.filter((p) => !isWithin(drugById.get(p.id)!.classes[0], 'ap-typical'))
    const minTypical = Math.min(...typical.map((p) => p.levels.eps))
    const maxAtypical = Math.max(...atypical.map((p) => p.levels.eps))
    expect(minTypical).toBeGreaterThan(maxAtypical)
  })

  it('tie extrapyramidal toxicity to preferring D2 over 5-HT2A, except for the partial agonist', () => {
    // Every drug with a low D2/5-HT2A ratio has low extrapyramidal toxicity.
    for (const p of profiles) if (p.levels.ratio <= 1) expect(p.levels.eps, p.id).toBeLessThanOrEqual(1)
    // Aripiprazole prefers D2 as much as haloperidol, but as a partial agonist spares the motor system.
    expect(lvl('aripiprazole').ratio).toBe(lvl('haloperidol').ratio)
    expect(lvl('aripiprazole').eps).toBe(0)
    expect(lvl('haloperidol').eps).toBe(4)
  })

  it('make the low-potency phenothiazine the sedating, hypotensive one', () => {
    expect(sortedBy('sedation')[0].id).toBe('chlorpromazine')
    expect(sortedBy('hypotension')[0].id).toBe('chlorpromazine')
    expect(lvl('chlorpromazine').potency).toBeLessThan(lvl('fluphenazine').potency)
  })
})
