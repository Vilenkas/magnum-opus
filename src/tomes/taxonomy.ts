/**
 * The map of knowledge: where every tome lives. Pure data, no imports, so the
 * shell, tests and `scripts/new-tome.ts` can all read it.
 *
 * Classify by discipline (the method, the question asked), never by object:
 * the heart is studied by anatomy, physiology, pharmacology and imaging alike,
 * so "cardiovascular" is a facet, not a node. See docs/taxonomy.md.
 *
 * Ids are English kebab-case and form paths ('health/basic-sciences/anatomy');
 * titles are Spanish content. Nodes may exist with no tome yet: reshaping the
 * tree is cheap, renaming a path that tomes point to is not.
 */

export interface TaxonomyNode {
  id: string
  /** Spanish display title. */
  title: string
  children?: TaxonomyNode[]
}

const leaves = (entries: [id: string, title: string][]): TaxonomyNode[] =>
  entries.map(([id, title]) => ({ id, title }))

export const taxonomy: TaxonomyNode[] = [
  {
    id: 'health',
    title: 'Ciencias de la salud',
    children: [
      {
        // How the body is built and works, before disease.
        id: 'basic-sciences',
        title: 'Ciencias básicas',
        children: [
          {
            id: 'anatomy',
            title: 'Anatomía',
            children: leaves([
              ['osteology', 'Osteología'],
              ['arthrology', 'Artrología'],
              ['myology', 'Miología'],
              ['angiology', 'Angiología'],
              ['neurology', 'Neurología'],
              ['splanchnology', 'Esplacnología'],
              ['esthesiology', 'Estesiología'],
            ]),
          },
          ...leaves([
            ['embryology', 'Embriología'],
            ['histology', 'Histología'],
            ['cell-biology', 'Biología celular'],
            ['biochemistry', 'Bioquímica'],
            ['genetics', 'Genética'],
            ['physiology', 'Fisiología'],
            ['immunology', 'Inmunología'],
          ]),
          {
            id: 'microbiology',
            title: 'Microbiología',
            children: leaves([
              ['bacteriology', 'Bacteriología'],
              ['virology', 'Virología'],
              ['mycology', 'Micología'],
              ['parasitology', 'Parasitología'],
            ]),
          },
          {
            id: 'pathology',
            title: 'Patología',
            children: leaves([
              ['physiopathology', 'Fisiopatología'],
              ['pathological-anatomy', 'Anatomía patológica'],
            ]),
          },
          {
            id: 'pharmacology',
            title: 'Farmacología',
            children: leaves([
              ['general-pharmacology', 'Farmacología general'],
              ['posology', 'Posología'],
              ['clinical-pharmacology', 'Farmacología clínica'],
              ['toxicology', 'Toxicología'],
            ]),
          },
        ],
      },
      {
        // The methods for finding out what the patient has.
        id: 'diagnostics',
        title: 'Ciencias diagnósticas',
        children: [
          {
            id: 'imaging',
            title: 'Imagenología',
            children: leaves([
              ['radiology', 'Radiología'],
              ['ultrasound', 'Ecografía'],
              ['computed-tomography', 'Tomografía computarizada'],
              ['magnetic-resonance', 'Resonancia magnética'],
              ['nuclear-medicine', 'Medicina nuclear'],
            ]),
          },
          {
            id: 'laboratory',
            title: 'Laboratorio clínico',
            children: leaves([
              ['clinical-biochemistry', 'Bioquímica clínica'],
              ['clinical-hematology', 'Hematología de laboratorio'],
              ['clinical-microbiology', 'Microbiología clínica'],
            ]),
          },
          { id: 'electrodiagnosis', title: 'Electrodiagnóstico' },
        ],
      },
      {
        // Medical practice: specialties grouped by how they treat (medically, surgically…).
        id: 'clinical',
        title: 'Medicina clínica',
        children: [
          // The clinical method itself: history and examination, before any specialty.
          { id: 'semiology', title: 'Semiología' },
          {
            id: 'internal-medicine',
            title: 'Medicina interna',
            children: leaves([
              ['cardiology', 'Cardiología'],
              ['pulmonology', 'Neumonología'],
              ['nephrology', 'Nefrología'],
              ['gastroenterology', 'Gastroenterología'],
              ['hepatology', 'Hepatología'],
              ['endocrinology', 'Endocrinología'],
              ['hematology', 'Hematología'],
              ['infectious-diseases', 'Infectología'],
              ['rheumatology', 'Reumatología'],
              ['neurology', 'Neurología clínica'],
              ['oncology', 'Oncología'],
              ['clinical-immunology', 'Inmunología clínica'],
              ['allergology', 'Alergología'],
              ['geriatrics', 'Geriatría'],
            ]),
          },
          {
            id: 'surgery',
            title: 'Cirugía',
            children: leaves([
              ['general-surgery', 'Cirugía general'],
              ['traumatology', 'Traumatología y ortopedia'],
              ['neurosurgery', 'Neurocirugía'],
              ['cardiothoracic-surgery', 'Cirugía cardiotorácica'],
              ['vascular-surgery', 'Cirugía vascular'],
              ['plastic-surgery', 'Cirugía plástica'],
              ['urology', 'Urología'],
            ]),
          },
          {
            id: 'medical-surgical',
            title: 'Especialidades medicoquirúrgicas',
            children: leaves([
              ['ophthalmology', 'Oftalmología'],
              ['otorhinolaryngology', 'Otorrinolaringología'],
              ['dermatology', 'Dermatología'],
            ]),
          },
          {
            id: 'maternal-child',
            title: 'Salud maternoinfantil',
            children: leaves([
              ['obstetrics-gynecology', 'Ginecología y obstetricia'],
              ['pediatrics', 'Pediatría'],
              ['neonatology', 'Neonatología'],
            ]),
          },
          { id: 'psychiatry', title: 'Psiquiatría' },
          {
            id: 'critical-care',
            title: 'Urgencias y cuidados críticos',
            children: leaves([
              ['emergency-medicine', 'Medicina de urgencias'],
              ['intensive-care', 'Medicina intensiva'],
              ['anesthesiology', 'Anestesiología'],
            ]),
          },
          { id: 'rehabilitation', title: 'Medicina física y rehabilitación' },
        ],
      },
      {
        // Health of populations rather than of the patient.
        id: 'public-health',
        title: 'Salud pública',
        children: leaves([
          ['epidemiology', 'Epidemiología'],
          ['biostatistics', 'Bioestadística'],
          ['preventive-medicine', 'Medicina preventiva'],
          ['occupational-health', 'Salud ocupacional'],
        ]),
      },
      {
        // Health disciplines with their own method and practice beside medicine.
        id: 'health-professions',
        title: 'Otras ciencias de la salud',
        children: leaves([
          ['dentistry', 'Odontología'],
          ['nursing', 'Enfermería'],
          ['nutrition', 'Nutrición y dietética'],
          ['physiotherapy', 'Fisioterapia'],
          ['pharmacy', 'Farmacia'],
          ['psychology', 'Psicología de la salud'],
        ]),
      },
      {
        // Medicine seen from history, ethics and law.
        id: 'medical-humanities',
        title: 'Humanidades médicas',
        children: leaves([
          ['history-of-medicine', 'Historia de la medicina'],
          ['bioethics', 'Bioética'],
          ['forensic-medicine', 'Medicina legal y forense'],
          ['medical-terminology', 'Terminología médica'],
        ]),
      },
    ],
  },
  {
    // A formal science: it studies abstract structures, not nature.
    id: 'mathematics',
    title: 'Matemáticas',
    children: [
      {
        id: 'foundations',
        title: 'Fundamentos',
        children: leaves([
          ['mathematical-logic', 'Lógica matemática'],
          ['set-theory', 'Teoría de conjuntos'],
        ]),
      },
      {
        id: 'number-theory',
        title: 'Aritmética y teoría de números',
        children: leaves([
          ['arithmetic', 'Aritmética'],
          ['elementary-number-theory', 'Teoría elemental de números'],
          ['analytic-number-theory', 'Teoría analítica de números'],
        ]),
      },
      {
        id: 'algebra',
        title: 'Álgebra',
        children: [
          ...leaves([
            ['elementary-algebra', 'Álgebra elemental'],
            ['linear-algebra', 'Álgebra lineal'],
          ]),
          {
            id: 'abstract-algebra',
            title: 'Álgebra abstracta',
            children: leaves([
              ['group-theory', 'Teoría de grupos'],
              ['rings-and-fields', 'Anillos y cuerpos'],
              ['galois-theory', 'Teoría de Galois'],
            ]),
          },
        ],
      },
      {
        id: 'geometry',
        title: 'Geometría',
        children: leaves([
          ['euclidean-geometry', 'Geometría euclidiana'],
          ['trigonometry', 'Trigonometría'],
          ['analytic-geometry', 'Geometría analítica'],
          ['non-euclidean-geometry', 'Geometrías no euclidianas'],
          ['differential-geometry', 'Geometría diferencial'],
          ['topology', 'Topología'],
        ]),
      },
      {
        id: 'analysis',
        title: 'Análisis',
        children: [
          {
            id: 'calculus',
            title: 'Cálculo',
            children: leaves([
              ['limits', 'Límites'],
              ['derivatives', 'Derivadas'],
              ['integrals', 'Integrales'],
              ['series', 'Series'],
              ['multivariable-calculus', 'Cálculo multivariable'],
              ['vector-calculus', 'Cálculo vectorial'],
            ]),
          },
          {
            id: 'differential-equations',
            title: 'Ecuaciones diferenciales',
            children: leaves([
              ['ordinary-differential-equations', 'Ecuaciones diferenciales ordinarias'],
              ['partial-differential-equations', 'Ecuaciones en derivadas parciales'],
            ]),
          },
          ...leaves([
            ['real-analysis', 'Análisis real'],
            ['complex-analysis', 'Análisis complejo'],
            ['functional-analysis', 'Análisis funcional'],
          ]),
        ],
      },
      {
        id: 'discrete-mathematics',
        title: 'Matemática discreta',
        children: leaves([
          ['combinatorics', 'Combinatoria'],
          ['graph-theory', 'Teoría de grafos'],
        ]),
      },
      {
        id: 'probability-statistics',
        title: 'Probabilidad y estadística',
        children: leaves([
          ['probability', 'Probabilidad'],
          ['statistics', 'Estadística'],
          ['stochastic-processes', 'Procesos estocásticos'],
        ]),
      },
      {
        id: 'applied-mathematics',
        title: 'Matemática aplicada',
        children: leaves([
          ['numerical-analysis', 'Análisis numérico'],
          ['optimization', 'Optimización'],
          ['game-theory', 'Teoría de juegos'],
        ]),
      },
    ],
  },
  {
    // Sciences of nature, by their method. Biology, geology or astronomy will join here.
    id: 'natural-sciences',
    title: 'Ciencias naturales',
    children: [
      {
        id: 'physics',
        title: 'Física',
        children: [
          {
            id: 'classical-mechanics',
            title: 'Mecánica clásica',
            children: leaves([
              ['kinematics', 'Cinemática'],
              ['dynamics', 'Dinámica'],
              ['statics', 'Estática'],
              ['gravitation', 'Gravitación'],
              ['analytical-mechanics', 'Mecánica analítica'],
            ]),
          },
          { id: 'fluid-mechanics', title: 'Mecánica de fluidos' },
          {
            id: 'thermal-physics',
            title: 'Termodinámica y física estadística',
            children: leaves([
              ['thermodynamics', 'Termodinámica'],
              ['statistical-mechanics', 'Mecánica estadística'],
            ]),
          },
          {
            id: 'electromagnetism',
            title: 'Electromagnetismo',
            children: leaves([
              ['electrostatics', 'Electrostática'],
              ['magnetism', 'Magnetismo'],
              ['electric-circuits', 'Circuitos eléctricos'],
              ['electromagnetic-waves', 'Ondas electromagnéticas'],
            ]),
          },
          {
            id: 'waves-optics',
            title: 'Ondas y óptica',
            children: leaves([
              ['mechanical-waves', 'Ondas mecánicas'],
              ['acoustics', 'Acústica'],
              ['geometrical-optics', 'Óptica geométrica'],
              ['physical-optics', 'Óptica física'],
            ]),
          },
          {
            id: 'modern-physics',
            title: 'Física moderna',
            children: leaves([
              ['special-relativity', 'Relatividad especial'],
              ['general-relativity', 'Relatividad general'],
              ['quantum-mechanics', 'Mecánica cuántica'],
              ['atomic-physics', 'Física atómica'],
              ['nuclear-physics', 'Física nuclear'],
              ['particle-physics', 'Física de partículas'],
            ]),
          },
          { id: 'condensed-matter', title: 'Física de la materia condensada' },
          { id: 'astrophysics', title: 'Astrofísica y cosmología' },
          {
            id: 'applied-physics',
            title: 'Física aplicada',
            children: leaves([
              ['biophysics', 'Biofísica'],
              ['medical-physics', 'Física médica'],
              ['geophysics', 'Geofísica'],
            ]),
          },
        ],
      },
      {
        id: 'chemistry',
        title: 'Química',
        children: [
          {
            id: 'general-chemistry',
            title: 'Química general',
            children: leaves([
              ['atomic-structure', 'Estructura atómica'],
              ['periodic-table', 'Tabla periódica'],
              ['chemical-bonding', 'Enlace químico'],
              ['stoichiometry', 'Estequiometría'],
              ['solutions', 'Disoluciones'],
            ]),
          },
          { id: 'inorganic-chemistry', title: 'Química inorgánica' },
          {
            id: 'organic-chemistry',
            title: 'Química orgánica',
            children: leaves([
              ['hydrocarbons', 'Hidrocarburos'],
              ['functional-groups', 'Grupos funcionales'],
              ['stereochemistry', 'Estereoquímica'],
              ['organic-reactions', 'Reacciones orgánicas'],
            ]),
          },
          {
            id: 'physical-chemistry',
            title: 'Fisicoquímica',
            children: leaves([
              ['thermochemistry', 'Termoquímica'],
              ['chemical-kinetics', 'Cinética química'],
              ['chemical-equilibrium', 'Equilibrio químico'],
              ['electrochemistry', 'Electroquímica'],
              ['quantum-chemistry', 'Química cuántica'],
            ]),
          },
          {
            id: 'analytical-chemistry',
            title: 'Química analítica',
            children: leaves([
              ['qualitative-analysis', 'Análisis cualitativo'],
              ['quantitative-analysis', 'Análisis cuantitativo'],
              ['instrumental-analysis', 'Análisis instrumental'],
            ]),
          },
          ...leaves([
            ['polymer-chemistry', 'Química de polímeros'],
            ['environmental-chemistry', 'Química ambiental'],
            ['nuclear-chemistry', 'Química nuclear'],
          ]),
        ],
      },
    ],
  },
  {
    id: 'languages',
    title: 'Lenguas',
    children: [
      {
        id: 'classical',
        title: 'Lenguas clásicas',
        children: leaves([
          ['latin', 'Latín'],
          ['ancient-greek', 'Griego antiguo'],
        ]),
      },
    ],
  },
]

/**
 * Facets cut across the tree: they describe what a tome is about, while its
 * `home` says which discipline it belongs to. Add a facet only when it groups
 * tomes that live in different branches.
 */
export const facets = {
  system: {
    title: 'Sistema corporal',
    values: {
      skeletal: 'Esquelético',
      articular: 'Articular',
      muscular: 'Muscular',
      cardiovascular: 'Cardiovascular',
      lymphatic: 'Linfático',
      respiratory: 'Respiratorio',
      digestive: 'Digestivo',
      urinary: 'Urinario',
      reproductive: 'Reproductor',
      nervous: 'Nervioso',
      endocrine: 'Endocrino',
      integumentary: 'Tegumentario',
      sensory: 'Órganos de los sentidos',
    },
  },
} as const

export type FacetId = keyof typeof facets
export type FacetValue<F extends FacetId> = keyof (typeof facets)[F]['values']
export type TomeFacets = { [F in FacetId]?: FacetValue<F>[] }

/** Every node, keyed by its full path. */
const byPath = new Map<string, TaxonomyNode>()
const walk = (nodes: TaxonomyNode[], prefix: string) => {
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.id}` : node.id
    if (byPath.has(path)) throw new Error(`Duplicate taxonomy path "${path}"`)
    byPath.set(path, node)
    if (node.children) walk(node.children, path)
  }
}
walk(taxonomy, '')

export const taxonomyPaths = (): string[] => [...byPath.keys()]

export const nodeAt = (path: string): TaxonomyNode | undefined => byPath.get(path)

/** The nodes from the root down to `path` (breadcrumb), or [] if unknown. */
export const trail = (path: string): TaxonomyNode[] => {
  if (!byPath.has(path)) return []
  const parts = path.split('/')
  return parts.map((_, i) => byPath.get(parts.slice(0, i + 1).join('/'))!)
}

/** Whether `path` is `ancestor` or lies beneath it. */
export const isWithin = (path: string, ancestor: string): boolean =>
  path === ancestor || path.startsWith(`${ancestor}/`)

/**
 * Where-it-lives fields of a tome manifest, checked against the map. Returns
 * human-readable problems; empty means valid.
 */
export const placementProblems = (
  tome: { id: string; home: string; facets?: Record<string, readonly string[] | undefined>; related?: string[]; prereqs?: string[] },
  knownTomeIds: ReadonlySet<string>,
): string[] => {
  const problems: string[] = []
  if (!byPath.has(tome.home)) problems.push(`home "${tome.home}" is not a taxonomy path`)
  for (const [facet, values] of Object.entries(tome.facets ?? {})) {
    const def = (facets as Record<string, { values: Record<string, string> }>)[facet]
    if (!def) {
      problems.push(`unknown facet "${facet}"`)
      continue
    }
    for (const value of values ?? []) {
      if (!(value in def.values)) problems.push(`unknown value "${value}" for facet "${facet}"`)
    }
  }
  for (const field of ['related', 'prereqs'] as const) {
    for (const id of tome[field] ?? []) {
      if (id === tome.id) problems.push(`${field} lists the tome itself`)
      else if (!knownTomeIds.has(id)) problems.push(`${field} points to unknown tome "${id}"`)
    }
  }
  return problems
}
