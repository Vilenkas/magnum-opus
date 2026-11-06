/**
 * Spanish names for the nervous-system pieces TA2 doesn't name: the cranial nerves (the model writes
 * them with their numeral) and the finer gyri and sulci of Z-Anatomy's brain, keyed by the model's
 * English name. Hand-edited, they win over TA2; nervous.test.ts fails if a piece has no Spanish name.
 */
export const nervousNames: Record<string, string> = {
  // The twelve pairs, with their classical numeral.
  'Olfactory nerve (I)': 'Nervio olfatorio (I)',
  'Optic nerve (II)': 'Nervio óptico (II)',
  'Oculomotor nerve (III)': 'Nervio oculomotor (III)',
  'Trochlear nerve (IV)': 'Nervio troclear (IV)',
  'Trigeminal nerve (V)': 'Nervio trigémino (V)',
  'Abducens nerve (VI)': 'Nervio abducens (VI)',
  'Facial nerve (VII)': 'Nervio facial (VII)',
  'Vestibulocochlear nerve (VIII)': 'Nervio vestibulococlear (VIII)',
  'Glossopharyngeal nerve (IX)': 'Nervio glosofaríngeo (IX)',
  'Vagus nerve (X)': 'Nervio vago (X)',
  'Accessory nerve (XI)': 'Nervio accesorio (XI)',
  'Hypoglossal nerve (XII)': 'Nervio hipogloso (XII)',

  // Gyri and sulci.
  'Anterior occipital sulcus*': 'Surco occipital anterior',
  'Cingulate gyrus and sulcus (Middle anterior part)': 'Giro y surco del cíngulo (parte media anterior)',
  'Cingulate gyrus and sulcus (Middle posterior part)': 'Giro y surco del cíngulo (parte media posterior)',
  'Cingulate gyrus and sulcus (Posterior dorsal part)': 'Giro y surco del cíngulo (parte posterior dorsal)',
  'Cingulate gyrus (Posteroventral part*)': 'Giro del cíngulo (parte posteroventral)',
  'Cingulate sulcus (Marginal part*)': 'Surco del cíngulo (parte marginal)',
  'Inferior occipital gyrus and sulcus*': 'Giro y surco occipitales inferiores',
  'Insula (Subcentral gyrus and ant. and post. sulci*)': 'Giro subcentral y surcos subcentrales anterior y posterior',
  'Lat_Fis-ant-Horizont': 'Rama anterior horizontal del surco lateral',
  'Lat_Fis-ant-Vertical': 'Rama anterior ascendente del surco lateral',
  'Lat_Fis-post': 'Rama posterior del surco lateral',
  'Lateral occipital gyrus (Middle occipital gyrus*)': 'Giro occipital lateral (medio)',
  'Medial occipitotemporal gyrus (Parahippocampal*)': 'Giro occipitotemporal medial (parahipocampal)',
  'Occipitotemporal sulcus (Lateral part*)': 'Surco occipitotemporal (parte lateral)',
  'Orbital gyri (Frontomarginal gyrus and sulcus*)': 'Giro y surco frontomarginales',
  'Orbital part of  inferior frontal gyrus': 'Porción orbitaria del giro frontal inferior',
  'Orbital sulci (H-shaped orbital sulci*)': 'Surcos orbitarios (en H)',
  'Orbital sulci (Lateral Orbital sulcus*)': 'Surco orbitario lateral',
  'Paracentral gyrus and sulcus*': 'Lobulillo y surco paracentrales',
  ' Posterior transverse collateral sulcus': 'Surco colateral transverso posterior',
  'Precentral sulcus (inferior part)*': 'Surco precentral (parte inferior)',
  'Precentral sulcus (Superior part)*': 'Surco precentral (parte superior)',
  'Straight gyrus (Gyrus rectus)': 'Giro recto',
  'Sulcus interm_prim-Jensen': 'Surco intermedio primario (de Jensen)',
  'Superior temporal gyrus (Lateral part)': 'Giro temporal superior (parte lateral)',
  'Transverse frontopolar gyrus and sulcus*': 'Giro y surco frontopolares transversos',

  // Other.
  "Central canal'": 'Conducto central de la médula',

  // Groups.
  'Nervous system & Sense organs': 'Sistema nervioso y órganos de los sentidos',
  'Sense organs': 'Órganos de los sentidos',
}
