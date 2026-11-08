import type { GeometryQuestion } from './types'

export const GEOMETRY_QUESTIONS: GeometryQuestion[] = [
  // --- TOPIC: COORDINATES (Cap. I) ---
  {
    id: 'geo-coord-1',
    topic: 'coordinates',
    difficulty: 'basic',
    prompt: 'Calcula la distancia entre los puntos P₁(2, -3) y P₂(-1, 1) en el plano cartesiano.',
    formula: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]',
    options: ['3', '5', '√7', '7'],
    correctIndex: 1,
    explanation:
      'Aplicando el Teorema 2 de Lehmann: d = √[(-1 - 2)² + (1 - (-3))²] = √[(-3)² + 4²] = √(9 + 16) = √25 = 5 unidades.',
    lehmannRef: {
      chapter: 1,
      article: 5,
      title: 'Distancia entre dos puntos dados',
      page: 10,
    },
  },
  {
    id: 'geo-coord-2',
    topic: 'coordinates',
    difficulty: 'basic',
    prompt: 'Encuentra las coordenadas del punto medio del segmento cuyos extremos son A(-4, 6) y B(8, -2).',
    formula: 'x = (x₁ + x₂) / 2,   y = (y₁ + y₂) / 2',
    options: ['(2, 2)', '(4, 4)', '(2, 4)', '(-6, 4)'],
    correctIndex: 0,
    explanation:
      'El punto medio corresponde a una razón r = 1. Así: x = (-4 + 8) / 2 = 4 / 2 = 2; y = (6 + (-2)) / 2 = 4 / 2 = 2. Las coordenadas son (2, 2).',
    lehmannRef: {
      chapter: 1,
      article: 7,
      title: 'División de un segmento en una razón dada (Corolario 1)',
      page: 15,
    },
  },
  {
    id: 'geo-coord-3',
    topic: 'coordinates',
    difficulty: 'intermediate',
    prompt:
      'Determina las coordenadas del punto P(x, y) que divide al segmento dirigido P₁P₂ con extremos P₁(-2, 3) y P₂(3, -2) en la razón r = 2/3.',
    formula: 'x = (x₁ + r x₂) / (1 + r),   y = (y₁ + r y₂) / (1 + r)',
    options: ['(1, 0)', '(0, 1)', '(1/2, 1/2)', '(0, -1)'],
    correctIndex: 1,
    explanation:
      'Sustituyendo r = 2/3: x = [-2 + (2/3)(3)] / [1 + 2/3] = (-2 + 2) / (5/3) = 0. Para y: [3 + (2/3)(-2)] / [1 + 2/3] = (3 - 4/3) / (5/3) = (5/3) / (5/3) = 1. Por tanto, P = (0, 1).',
    lehmannRef: {
      chapter: 1,
      article: 7,
      title: 'División de un segmento en una razón dada',
      page: 14,
    },
  },
  {
    id: 'geo-coord-4',
    topic: 'coordinates',
    difficulty: 'basic',
    prompt:
      'Si un punto P divide a un segmento dirigido P₁P₂ en una razón r = P₁P / PP₂ tal que r < 0 (razón negativa), ¿cuál es la posición geométrica de P?',
    options: [
      'P está situado en el interior del segmento P₁P₂',
      'P coincide exactamente con el punto medio de P₁P₂',
      'P es exterior al segmento P₁P₂, sobre la prolongación de la recta',
      'P coincide con el origen del sistema de coordenadas',
    ],
    correctIndex: 2,
    explanation:
      'Según el Art. 7 de Lehmann: cuando el punto P es exterior al segmento dirigido P₁P₂, los segmentos P₁P y PP₂ tienen sentidos opuestos, por lo que su cociente r es negativo (r < 0, con r ≠ -1).',
    lehmannRef: {
      chapter: 1,
      article: 7,
      title: 'División de un segmento en una razón dada',
      page: 13,
    },
  },
  {
    id: 'geo-coord-5',
    topic: 'coordinates',
    difficulty: 'intermediate',
    prompt: 'Halla el área del triángulo cuyos vértices son los puntos A(0, 0), B(4, 2) y C(2, 6).',
    formula: 'Área = ½ |x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂)|',
    options: ['8', '10', '12', '20'],
    correctIndex: 1,
    explanation:
      'Por la fórmula del área por determinantes de Lehmann: Área = ½ |0·(2 - 6) + 4·(6 - 0) + 2·(0 - 2)| = ½ |0 + 24 - 4| = ½ |20| = 10 unidades cuadradas.',
    lehmannRef: {
      chapter: 1,
      article: 10,
      title: 'Área de un triángulo',
      page: 24,
    },
  },
  {
    id: 'geo-coord-6',
    topic: 'coordinates',
    difficulty: 'basic',
    prompt:
      'En un sistema unidimensional (recta dirigida), el punto A tiene coordenada x₁ = -5 y el punto B tiene coordenada x₂ = 3. ¿Cuál es la longitud dirigida del segmento AB?',
    formula: 'AB = x₂ - x₁',
    options: ['-8', '2', '8', '-2'],
    correctIndex: 2,
    explanation:
      'Por el Teorema 1 de Lehmann: la longitud dirigida AB es la coordenada del punto final menos la del inicial: AB = x₂ - x₁ = 3 - (-5) = 8. (Nótese que BA = -8).',
    lehmannRef: {
      chapter: 1,
      article: 2,
      title: 'Segmento rectilíneo dirigido (Teorema 1)',
      page: 4,
    },
  },

  // --- TOPIC: LINES (Cap. II & III) ---
  {
    id: 'geo-line-1',
    topic: 'lines',
    difficulty: 'basic',
    prompt: 'Determina la pendiente m de la recta que pasa por los puntos (3, -2) y (-1, 6).',
    formula: 'm = (y₂ - y₁) / (x₂ - x₁)',
    options: ['-2', '2', '-1/2', '4'],
    correctIndex: 0,
    explanation:
      'm = [6 - (-2)] / [-1 - 3] = (6 + 2) / (-4) = 8 / (-4) = -2. Como m < 0, la recta forma un ángulo obtuso con el eje X positivo.',
    lehmannRef: {
      chapter: 1,
      article: 13,
      title: 'Pendiente de una recta',
      page: 30,
    },
  },
  {
    id: 'geo-line-2',
    topic: 'lines',
    difficulty: 'basic',
    prompt:
      'Dadas dos rectas no verticales con pendientes m₁ y m₂, ¿cuál es la condición necesaria y suficiente para que sean perpendiculares entre sí?',
    options: ['m₁ = m₂', 'm₁ · m₂ = -1', 'm₁ + m₂ = 0', 'm₁ · m₂ = 1'],
    correctIndex: 1,
    explanation:
      'Por el Teorema 5 de Lehmann (Art. 14): dos rectas son perpendiculares si y sólo si el producto de sus pendientes es igual a -1 (m₁ · m₂ = -1), o recíprocas y de signo contrario (m₂ = -1/m₁).',
    lehmannRef: {
      chapter: 1,
      article: 14,
      title: 'Paralelismo y perpendicularidad de dos rectas (Teorema 5)',
      page: 34,
    },
  },
  {
    id: 'geo-line-3',
    topic: 'lines',
    difficulty: 'intermediate',
    prompt:
      'Calcula el ángulo agudo θ formado por dos rectas cuyas pendientes son m₁ = 2 y m₂ = -3 (medido de la recta 1 hacia la recta 2).',
    formula: 'tan θ = (m₂ - m₁) / (1 + m₁ m₂)',
    options: ['30°', '45°', '60°', '90°'],
    correctIndex: 1,
    explanation:
      'tan θ = (-3 - 2) / [1 + (2)(-3)] = -5 / (1 - 6) = -5 / -5 = 1. Dado que tan θ = 1, el ángulo es θ = arctan(1) = 45° (π/4 rad).',
    lehmannRef: {
      chapter: 1,
      article: 15,
      title: 'Ángulo de dos rectas (Teorema 6)',
      page: 38,
    },
  },
  {
    id: 'geo-line-4',
    topic: 'lines',
    difficulty: 'intermediate',
    prompt:
      'Halla la ecuación general de la recta que pasa por el punto P(4, 1) y tiene pendiente m = -3/4.',
    formula: 'y - y₁ = m(x - x₁)',
    options: [
      '3x + 4y - 16 = 0',
      '3x - 4y - 8 = 0',
      '4x + 3y - 19 = 0',
      '3x + 4y + 16 = 0',
    ],
    correctIndex: 0,
    explanation:
      'Forma punto-pendiente: y - 1 = (-3/4)(x - 4) ⟹ 4(y - 1) = -3(x - 4) ⟹ 4y - 4 = -3x + 12 ⟹ 3x + 4y - 16 = 0.',
    lehmannRef: {
      chapter: 3,
      article: 24,
      title: 'Formas de la ecuación de la recta (Punto-pendiente)',
      page: 63,
    },
  },
  {
    id: 'geo-line-5',
    topic: 'lines',
    difficulty: 'basic',
    prompt:
      'Dada la ecuación general de la recta 2x - 5y + 10 = 0, ¿cuáles son su pendiente m y su ordenada en el origen b?',
    formula: 'y = mx + b',
    options: [
      'm = 2/5,   b = 2',
      'm = -2/5,  b = -2',
      'm = 5/2,   b = 5',
      'm = 2/5,   b = -2',
    ],
    correctIndex: 0,
    explanation:
      'Despejando y en forma pendiente-ordenada al origen: -5y = -2x - 10 ⟹ y = (2/5)x + 2. Por tanto, m = 2/5 y la ordenada en el origen es b = 2.',
    lehmannRef: {
      chapter: 3,
      article: 24,
      title: 'Ecuación de la recta: forma pendiente y ordenada al origen',
      page: 64,
    },
  },
  {
    id: 'geo-line-6',
    topic: 'lines',
    difficulty: 'intermediate',
    prompt: 'Calcula la distancia no dirigida desde el punto P(3, -2) hasta la recta 3x - 4y + 8 = 0.',
    formula: 'd = |A x₁ + B y₁ + C| / √(A² + B²)',
    options: ['3', '4', '5', '25'],
    correctIndex: 2,
    explanation:
      'Aplicando el Teorema 11 de Lehmann: d = |3(3) - 4(-2) + 8| / √[3² + (-4)²] = |9 + 8 + 8| / √(9 + 16) = |25| / √25 = 25 / 5 = 5 unidades.',
    lehmannRef: {
      chapter: 3,
      article: 28,
      title: 'Distancia de un punto a una recta (Teorema 11)',
      page: 81,
    },
  },
  {
    id: 'geo-line-7',
    topic: 'lines',
    difficulty: 'intermediate',
    prompt:
      'Una recta interseca al eje X en a = 3 y al eje Y en b = -5. ¿Cuál es su ecuación general?',
    formula: 'x/a + y/b = 1',
    options: [
      '5x - 3y - 15 = 0',
      '3x - 5y - 15 = 0',
      '5x + 3y + 15 = 0',
      '5x - 3y + 15 = 0',
    ],
    correctIndex: 0,
    explanation:
      'Ecuación simétrica: x/3 + y/(-5) = 1. Multiplicando todo por 15: 5x - 3y = 15 ⟹ 5x - 3y - 15 = 0.',
    lehmannRef: {
      chapter: 3,
      article: 25,
      title: 'Forma simétrica de la ecuación de la recta',
      page: 68,
    },
  },

  // --- TOPIC: CONICS (Cap. IV-VIII) ---
  {
    id: 'geo-conic-1',
    topic: 'conics',
    difficulty: 'intermediate',
    prompt:
      'Halla las coordenadas del centro C(h, k) y la longitud del radio r de la circunferencia x² + y² - 6x + 4y - 12 = 0.',
    formula: '(x - h)² + (y - k)² = r²',
    options: [
      'C(3, -2),   r = 5',
      'C(-3, 2),   r = 5',
      'C(3, -2),   r = 25',
      'C(-6, 4),   r = √12',
    ],
    correctIndex: 0,
    explanation:
      'Completando cuadrados: (x² - 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4 ⟹ (x - 3)² + (y + 2)² = 25 = 5². Centro C(3, -2) y radio r = 5.',
    lehmannRef: {
      chapter: 4,
      article: 36,
      title: 'Ecuación general de la circunferencia',
      page: 110,
    },
  },
  {
    id: 'geo-conic-2',
    topic: 'conics',
    difficulty: 'basic',
    prompt:
      'Dada la parábola con vértice en el origen y ecuación y² = 12x, ¿cuáles son las coordenadas de su foco F y la ecuación de su directriz?',
    formula: 'y² = 4px',
    options: [
      'F(3, 0),    directriz x = -3',
      'F(0, 3),    directriz y = -3',
      'F(12, 0),   directriz x = -12',
      'F(-3, 0),   directriz x = 3',
    ],
    correctIndex: 0,
    explanation:
      'Comparando con y² = 4px: 4p = 12 ⟹ p = 3. Como el término lineal es x con signo positivo, abre a la derecha. El foco es F(p, 0) = F(3, 0) y la directriz es x = -p = -3.',
    lehmannRef: {
      chapter: 5,
      article: 44,
      title: 'Ecuación ordinaria de la parábola con vértice en el origen',
      page: 142,
    },
  },
  {
    id: 'geo-conic-3',
    topic: 'conics',
    difficulty: 'intermediate',
    prompt:
      'Para la elipse con ecuación x²/25 + y²/9 = 1, ¿cuál es el valor de su distancia focal c y de su excentricidad e?',
    formula: 'a² = b² + c²,   e = c/a',
    options: [
      'c = 4,   e = 4/5 (0.8)',
      'c = 16,  e = 16/25',
      'c = 4,   e = 5/4 (1.25)',
      'c = √34, e = √34/5',
    ],
    correctIndex: 0,
    explanation:
      'Como 25 > 9, el eje mayor es horizontal con a² = 25 (a = 5) y b² = 9 (b = 3). Relación fundamental: c = √(a² - b²) = √(25 - 9) = √16 = 4. Excentricidad e = c/a = 4/5 = 0.8 (menor que 1, característico de toda elipse).',
    lehmannRef: {
      chapter: 6,
      article: 53,
      title: 'Ecuación de la elipse de centro en el origen y ejes coincidentes con los coordenados',
      page: 175,
    },
  },
  {
    id: 'geo-conic-4',
    topic: 'conics',
    difficulty: 'intermediate',
    prompt:
      '¿Cuáles son las ecuaciones de las asíntotas de la hipérbola canónica x²/16 - y²/9 = 1?',
    formula: 'y = ± (b/a) x',
    options: [
      'y = ± (3/4)x',
      'y = ± (4/3)x',
      'y = ± (9/16)x',
      'y = ± (16/9)x',
    ],
    correctIndex: 0,
    explanation:
      'Para x²/a² - y²/b² = 1, las asíntotas se obtienen igualando el primer miembro a cero: x²/16 - y²/9 = 0 ⟹ (x/4 - y/3)(x/4 + y/3) = 0 ⟹ y = ±(3/4)x o 3x ± 4y = 0.',
    lehmannRef: {
      chapter: 7,
      article: 62,
      title: 'Asíntotas de la hipérbola (Teorema 3)',
      page: 212,
    },
  },
  {
    id: 'geo-conic-5',
    topic: 'conics',
    difficulty: 'basic',
    prompt:
      'Según la definición cónica unificada por foco y directriz, si la excentricidad de una sección cónica es e > 1, ¿de qué curva se trata?',
    options: ['Una circunferencia', 'Una elipse', 'Una parábola', 'Una hipérbola'],
    correctIndex: 3,
    explanation:
      'Por la clasificación general de cónicas según su excentricidad (Art. 68 de Lehmann): si e = 0 es circunferencia, si 0 < e < 1 es elipse, si e = 1 es parábola, y si e > 1 es hipérbola.',
    lehmannRef: {
      chapter: 7,
      article: 68,
      title: 'Propiedad focal general y excentricidad de las cónicas',
      page: 230,
    },
  },
  {
    id: 'geo-conic-6',
    topic: 'conics',
    difficulty: 'advanced',
    prompt:
      'Dada la ecuación general de segundo grado Ax² + Bxy + Cy² + Dx + Ey + F = 0, ¿qué curva representa cuando el indicador I = B² - 4AC < 0 (y no degenera)?',
    formula: 'Indicador: I = B² - 4AC',
    options: [
      'Tipo elíptico (elipse o circunferencia)',
      'Tipo parabólico (parábola)',
      'Tipo hiperbólico (hipérbola)',
      'Dos rectas paralelas coincidentes',
    ],
    correctIndex: 0,
    explanation:
      'Por el Teorema de clasificación de Lehmann (Art. 72): el indicador I = B² - 4AC es invariante bajo rotación y traslación. Si B² - 4AC < 0, la ecuación es de tipo elíptico (elipse, circunferencia, un punto o conjunto vacío).',
    lehmannRef: {
      chapter: 8,
      article: 72,
      title: 'Clasificación de las ecuaciones de segundo grado (Indicador B² - 4AC)',
      page: 248,
    },
  },
  {
    id: 'geo-conic-7',
    topic: 'conics',
    difficulty: 'intermediate',
    prompt:
      '¿Cuál es la longitud del lado recto (latus rectum) de la elipse x²/a² + y²/b² = 1?',
    formula: 'LR = 2b² / a',
    options: ['2b² / a', '2a² / b', 'b² / 2a', '2c / a'],
    correctIndex: 0,
    explanation:
      'Sustituyendo x = c en la ecuación de la elipse: y = ± (b/a)√(a² - c²) = ± b²/a. La longitud total de la cuerda perpendicular que pasa por el foco es 2|y| = 2b²/a.',
    lehmannRef: {
      chapter: 6,
      article: 53,
      title: 'Elementos de la elipse: lado recto',
      page: 176,
    },
  },
  {
    id: 'geo-conic-8',
    topic: 'conics',
    difficulty: 'basic',
    prompt:
      'La parábola con ecuación x² = -8y tiene su vértice en el origen. ¿Hacia dónde abre su concavidad y cuál es la ordenada de su foco?',
    formula: 'x² = 4py',
    options: [
      'Abre hacia abajo, foco F(0, -2)',
      'Abre hacia arriba, foco F(0, 2)',
      'Abre a la izquierda, foco F(-2, 0)',
      'Abre hacia abajo, foco F(0, -8)',
    ],
    correctIndex: 0,
    explanation:
      'Comparando con x² = 4py: 4p = -8 ⟹ p = -2. Como el término cuadrático es x² y p < 0, la parábola tiene eje vertical y abre hacia abajo. Las coordenadas del foco son F(0, p) = F(0, -2).',
    lehmannRef: {
      chapter: 5,
      article: 44,
      title: 'Ecuación de la parábola con eje coincidente con el eje Y',
      page: 145,
    },
  },
]
