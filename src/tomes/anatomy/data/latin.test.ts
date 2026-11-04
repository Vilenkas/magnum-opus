import { describe, expect, it } from 'vitest'
import { latinOf } from './latin'
import { landmarks } from './landmarks'
import { pieces } from './skeleton'

describe('Latin names', () => {
  it('names every piece of the model', () => {
    const missing = [...new Set(pieces.map((p) => p.en))].filter((en) => !latinOf(en))
    expect(missing).toEqual([])
  })

  it('names every bony landmark of the model', () => {
    const missing = [...new Set(landmarks.map((l) => l.en))].filter((en) => !latinOf(en))
    expect(missing).toEqual([])
  })

  it.each([
    ['Frontal bone', 'Os frontale'],
    ['Hip bone', 'Os coxae'],
    ['Third rib', 'Costa tertia [III]'],
    ['Twelfth rib', 'Costa duodecima [XII]'],
    ['Costal cartilage of seventh rib', 'Cartilago costalis costae septimae'],
    ['First metacarpal bone', 'Os metacarpi primum [I]'],
    ['Fifth metatarsal bone', 'Os metatarsi quintum [V]'],
    ['Distal phalanx of first finger of hand', 'Phalanx distalis pollicis'],
    ['Middle phalanx of fourth finger of hand', 'Phalanx media digiti anularis'],
    ['Proximal phalanx of first finger of foot', 'Phalanx proximalis halucis'],
    ['Distal phalanx of fifth finger of foot', 'Phalanx distalis digiti minimi pedis'],
    ['Vertebra C3', 'Vertebra cervicalis [C III]'],
    ['Vertebra C7', 'Vertebra prominens [C VII]'],
    ['Vertebra T12', 'Vertebra thoracica [T XII]'],
    ['Vertebra L5', 'Vertebra lumbalis [L V]'],
    ['Upper canine', 'Dens caninus (arcus maxillaris)'],
    ['Lower first molar tooth', 'Dens molaris primus (arcus mandibularis)'],
    ['Opening of frontal sinus', 'Apertura sinus frontalis'],
    ['Greater trochanter', 'Trochanter major'],
  ])('%s → %s', (en, latin) => {
    expect(latinOf(en)).toBe(latin)
  })

  it('returns nothing for names it does not know', () => {
    expect(latinOf('Thirteenth rib')).toBeUndefined()
    expect(latinOf('Upper wisdom tooth')).toBeUndefined()
  })
})
