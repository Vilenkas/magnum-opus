/**
 * Spanish names for the vessels and node groups that TA2 doesn't name or names wrongly (Latin in
 * its Spanish column), keyed by the model's English name. They win over TA2. Hand-edited:
 * tools/anatomy/gen-vessels.mjs never writes here, and vessels.test.ts fails if a structure is
 * left without a Spanish name.
 */
export const vesselNames: Record<string, string> = {
  'Anterior temporal branch': 'Rama temporal anterior de la arteria cerebral media',
  'Artery of central sulcus': 'Arteria del surco central',
  'Artery of precentral sulcus': 'Arteria del surco precentral',
  'Branch to angular gyrus': 'Rama del giro angular',
  'Distal lateral striate branches': 'Ramas estriadas laterales distales',
  "Inferior vein of left ventricle (//Posterior '')": 'Vena inferior del ventrículo izquierdo',
  'Inferior vena cava (abdominal part)': 'Vena cava inferior, porción abdominal',
  'Inferior vena cava (thoracic part)': 'Vena cava inferior, porción torácica',
  'Insular branches of middle cerebral artery (M2)': 'Ramas insulares de la arteria cerebral media (M2)',
  'Insular branches of middle cerebral artery (M2-segment)': 'Ramas insulares de la arteria cerebral media (segmento M2)',
  'Lateral frontobasal artery': 'Arteria frontobasal lateral',
  'Middle cerebral artery (M1-segment)': 'Arteria cerebral media (segmento M1)',
  'Middle cerebral artery (M3 segment)': 'Arteria cerebral media (segmento M3)',
  'Middle cerebral artery (M3-segment)': 'Arteria cerebral media (segmento M3, ramas)',
  'Middle genicular artery': 'Arteria genicular media',
  'Posterior lateral nasal branches of sphenopalatine artery.': 'Ramas nasales posteriores laterales de la arteria esfenopalatina',
  'Posterior parietal artery': 'Arteria parietal posterior',
  'Posterior temporal branch': 'Rama temporal posterior de la arteria cerebral media',
  'Prefrontal artery': 'Arteria prefrontal',
  'Proximal lateral striate branches': 'Ramas estriadas laterales proximales',
  'Temporo-occipital branch': 'Rama temporooccipital',
  'Pre-aortic nodes': 'Ganglios preaórticos',
  'Retro-aortic nodes': 'Ganglios retroaórticos',
  // Group
  'Superior deep lateral nodes': 'Ganglios cervicales laterales profundos superiores',
}
