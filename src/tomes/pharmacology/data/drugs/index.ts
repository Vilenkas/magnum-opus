import type { Drug } from '../types'
import { antidepressants } from './antidepressants'
import { antiepileptics } from './antiepileptics'
import { antipsychotics } from './antipsychotics'
import { sedativeHypnotics } from './sedative-hypnotics'

/** Every drug of the bank, one file per family. */
export const drugs: Drug[] = [...sedativeHypnotics, ...antiepileptics, ...antipsychotics, ...antidepressants]
