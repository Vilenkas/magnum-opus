import type { Noun } from '../grammar/nouns'

/** A vocabulary noun: the grammar entry plus its meaning and Spanish descendants. */
export interface VocabNoun extends Noun {
  meaning: string
  /** Spanish words derived from it: memory hooks for a Spanish speaker. */
  derivatives?: string[]
}

/** Beginner vocabulary, grouped by declension. Hand-editable. */
export const nouns: VocabNoun[] = [
  // ---------- 1st declension: -a, -ae (mostly feminine) ----------
  { id: 'rosa', lemma: 'rosa', genitive: 'rosae', gender: 'f', declension: 1, meaning: 'rosa', derivatives: ['rosa', 'rosal', 'rosado'] },
  { id: 'puella', lemma: 'puella', genitive: 'puellae', gender: 'f', declension: 1, meaning: 'niña, muchacha' },
  { id: 'aqua', lemma: 'aqua', genitive: 'aquae', gender: 'f', declension: 1, meaning: 'agua', derivatives: ['agua', 'acuático', 'acueducto'] },
  { id: 'terra', lemma: 'terra', genitive: 'terrae', gender: 'f', declension: 1, meaning: 'tierra', derivatives: ['tierra', 'terrestre', 'territorio'] },
  { id: 'vita', lemma: 'vīta', genitive: 'vītae', gender: 'f', declension: 1, meaning: 'vida', derivatives: ['vida', 'vital'] },
  { id: 'via', lemma: 'via', genitive: 'viae', gender: 'f', declension: 1, meaning: 'camino, vía', derivatives: ['vía', 'viaje'] },
  { id: 'stella', lemma: 'stella', genitive: 'stellae', gender: 'f', declension: 1, meaning: 'estrella', derivatives: ['estrella', 'estelar'] },
  { id: 'femina', lemma: 'fēmina', genitive: 'fēminae', gender: 'f', declension: 1, meaning: 'mujer', derivatives: ['femenino'] },
  { id: 'silva', lemma: 'silva', genitive: 'silvae', gender: 'f', declension: 1, meaning: 'bosque', derivatives: ['silvestre'] },
  { id: 'agricola', lemma: 'agricola', genitive: 'agricolae', gender: 'm', declension: 1, meaning: 'agricultor', derivatives: ['agrícola'] },
  { id: 'nauta', lemma: 'nauta', genitive: 'nautae', gender: 'm', declension: 1, meaning: 'marinero', derivatives: ['náutico', 'astronauta'] },

  // ---------- 2nd declension: -us/-er, -ī (masc.) and -um, -ī (neut.) ----------
  { id: 'dominus', lemma: 'dominus', genitive: 'dominī', gender: 'm', declension: 2, meaning: 'señor, amo', derivatives: ['dominio', 'dominar'] },
  { id: 'amicus', lemma: 'amīcus', genitive: 'amīcī', gender: 'm', declension: 2, meaning: 'amigo', derivatives: ['amigo', 'amistad'] },
  { id: 'servus', lemma: 'servus', genitive: 'servī', gender: 'm', declension: 2, meaning: 'esclavo, siervo', derivatives: ['siervo', 'servil'] },
  { id: 'lupus', lemma: 'lupus', genitive: 'lupī', gender: 'm', declension: 2, meaning: 'lobo', derivatives: ['lobo', 'lupino'] },
  { id: 'filius', lemma: 'fīlius', genitive: 'fīliī', gender: 'm', declension: 2, meaning: 'hijo', derivatives: ['filial'] },
  { id: 'puer', lemma: 'puer', genitive: 'puerī', gender: 'm', declension: 2, meaning: 'niño, muchacho', derivatives: ['pueril'] },
  { id: 'ager', lemma: 'ager', genitive: 'agrī', gender: 'm', declension: 2, meaning: 'campo', derivatives: ['agrario', 'agricultura'] },
  { id: 'vir', lemma: 'vir', genitive: 'virī', gender: 'm', declension: 2, meaning: 'hombre, varón', derivatives: ['viril', 'virtud'] },
  { id: 'bellum', lemma: 'bellum', genitive: 'bellī', gender: 'n', declension: 2, meaning: 'guerra', derivatives: ['bélico', 'belicoso'] },
  { id: 'verbum', lemma: 'verbum', genitive: 'verbī', gender: 'n', declension: 2, meaning: 'palabra', derivatives: ['verbo', 'verbal'] },
  { id: 'donum', lemma: 'dōnum', genitive: 'dōnī', gender: 'n', declension: 2, meaning: 'regalo', derivatives: ['don', 'donar'] },
  { id: 'templum', lemma: 'templum', genitive: 'templī', gender: 'n', declension: 2, meaning: 'templo', derivatives: ['templo'] },
  { id: 'caelum', lemma: 'caelum', genitive: 'caelī', gender: 'n', declension: 2, meaning: 'cielo', derivatives: ['cielo', 'celeste'] },

  // ---------- 3rd declension: various nominatives, genitive -is ----------
  { id: 'rex', lemma: 'rēx', genitive: 'rēgis', gender: 'm', declension: 3, meaning: 'rey', derivatives: ['rey', 'regio'] },
  { id: 'lex', lemma: 'lēx', genitive: 'lēgis', gender: 'f', declension: 3, meaning: 'ley', derivatives: ['ley', 'legal'] },
  { id: 'homo', lemma: 'homō', genitive: 'hominis', gender: 'm', declension: 3, meaning: 'ser humano', derivatives: ['homicida', 'homínido'] },
  { id: 'pater', lemma: 'pater', genitive: 'patris', gender: 'm', declension: 3, meaning: 'padre', derivatives: ['paterno', 'patria'] },
  { id: 'mater', lemma: 'māter', genitive: 'mātris', gender: 'f', declension: 3, meaning: 'madre', derivatives: ['materno', 'matriz'] },
  { id: 'miles', lemma: 'mīles', genitive: 'mīlitis', gender: 'm', declension: 3, meaning: 'soldado', derivatives: ['militar', 'milicia'] },
  { id: 'lux', lemma: 'lūx', genitive: 'lūcis', gender: 'f', declension: 3, meaning: 'luz', derivatives: ['luz', 'lúcido'] },
  { id: 'corpus', lemma: 'corpus', genitive: 'corporis', gender: 'n', declension: 3, meaning: 'cuerpo', derivatives: ['cuerpo', 'corporal'] },
  { id: 'nomen', lemma: 'nōmen', genitive: 'nōminis', gender: 'n', declension: 3, meaning: 'nombre', derivatives: ['nombre', 'nominal'] },
  { id: 'tempus', lemma: 'tempus', genitive: 'temporis', gender: 'n', declension: 3, meaning: 'tiempo', derivatives: ['tiempo', 'temporal'] },
  { id: 'civis', lemma: 'cīvis', genitive: 'cīvis', gender: 'm', declension: 3, iStem: true, meaning: 'ciudadano', derivatives: ['civil', 'cívico'] },
  { id: 'urbs', lemma: 'urbs', genitive: 'urbis', gender: 'f', declension: 3, iStem: true, meaning: 'ciudad (Roma)', derivatives: ['urbano'] },
  { id: 'nox', lemma: 'nox', genitive: 'noctis', gender: 'f', declension: 3, iStem: true, meaning: 'noche', derivatives: ['noche', 'nocturno'] },
  { id: 'mare', lemma: 'mare', genitive: 'maris', gender: 'n', declension: 3, iStem: true, meaning: 'mar', derivatives: ['mar', 'marino'] },
  { id: 'animal', lemma: 'animal', genitive: 'animālis', gender: 'n', declension: 3, iStem: true, meaning: 'animal, ser vivo', derivatives: ['animal'] },

  // ---------- 4th declension: -us, -ūs (masc.) and -ū, -ūs (neut.) ----------
  { id: 'manus', lemma: 'manus', genitive: 'manūs', gender: 'f', declension: 4, meaning: 'mano', derivatives: ['mano', 'manual'] },
  { id: 'fructus', lemma: 'frūctus', genitive: 'frūctūs', gender: 'm', declension: 4, meaning: 'fruto', derivatives: ['fruto', 'fructífero'] },
  { id: 'senatus', lemma: 'senātus', genitive: 'senātūs', gender: 'm', declension: 4, meaning: 'senado', derivatives: ['senado', 'senador'] },
  { id: 'exercitus', lemma: 'exercitus', genitive: 'exercitūs', gender: 'm', declension: 4, meaning: 'ejército', derivatives: ['ejército'] },
  { id: 'cornu', lemma: 'cornū', genitive: 'cornūs', gender: 'n', declension: 4, meaning: 'cuerno', derivatives: ['cornamenta', 'córneo'] },
  { id: 'genu', lemma: 'genū', genitive: 'genūs', gender: 'n', declension: 4, meaning: 'rodilla', derivatives: ['genuflexión'] },

  // ---------- 5th declension: -ēs, -eī/-ēī ----------
  { id: 'res', lemma: 'rēs', genitive: 'reī', gender: 'f', declension: 5, meaning: 'cosa, asunto', derivatives: ['república', 'real'] },
  { id: 'dies', lemma: 'diēs', genitive: 'diēī', gender: 'm', declension: 5, meaning: 'día', derivatives: ['diario', 'dieta'] },
  { id: 'spes', lemma: 'spēs', genitive: 'speī', gender: 'f', declension: 5, meaning: 'esperanza' },
  { id: 'fides', lemma: 'fidēs', genitive: 'fideī', gender: 'f', declension: 5, meaning: 'fe, confianza', derivatives: ['fe', 'fidelidad'] },
  { id: 'facies', lemma: 'faciēs', genitive: 'faciēī', gender: 'f', declension: 5, meaning: 'rostro, aspecto', derivatives: ['faz', 'facial'] },
]

export const nounById = new Map(nouns.map((n) => [n.id, n]))
