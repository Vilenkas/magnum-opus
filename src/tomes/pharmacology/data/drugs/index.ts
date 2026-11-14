import type { Drug } from '../types'
import { antiepileptics } from './antiepileptics'
import { sedativeHypnotics } from './sedative-hypnotics'

/** Every drug of the bank, one file per family. */
export const drugs: Drug[] = [...sedativeHypnotics, ...antiepileptics]
