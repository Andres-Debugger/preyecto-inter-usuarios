/**
 * GOMS KLM (Keystroke-Level Model) Calculator
 * Based on exact operator values from reference material.
 */

export const KLM_OPERATORS = {
  K: { name: "Presionar una tecla", time: 0.2, symbol: "K" },
  P: { name: "Señalar o apuntar con un dispositivo de entrada", time: 1.1, symbol: "P" },
  H: { name: "Mover la mano de un dispositivo de entrada a otro", time: 0.4, symbol: "H" },
  M: { name: "Pensar en qué hacer a continuación", time: 1.2, symbol: "M" },
  B: { name: "Presionar Mouse", time: 0.1, symbol: "B" },
  DatePicker: { name: "Entrada fecha tipo Date-Picker", time: 6.81, symbol: "Date-Picker" },
  Scrolling: { name: "Mover scroll", time: 3.96, symbol: "Scrolling" },
  D: { name: "Dibujar", time: 1.2, symbol: "D" },
  R: { name: "Tiempo de Respuesta del Sistema", time: 0, symbol: "R" },
} as const;

export type OperatorType = keyof typeof KLM_OPERATORS;

export interface KLMStep {
  step: number;
  action: string;
  data: string;
  K: number;
  P: number;
  H: number;
  M: number;
  B: number;
}

// Alejandro Torres CV - exact data from reference image
const ALEJANDRO_CV = {
  firstName: "Alejandro",
  lastName: "Torres",
  title: "Programador web",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue. Consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo.",
  phone: "+34-91-1234-567",
  email: "Hola@unsitioincreible.es",
  web: "www.unsitioincreible.es",
  location: "Calle Cualquiera 123, Cualquier Lugar",
  experience: [
    { inst: "Multinacional González", period: "2019 - 2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Álvarez y asociados", period: "2015 - 2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Industrias Ariova", period: "2014 - 2015", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Rimberio y asociados", period: "2012 - 2014", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
  ],
  education: [
    { inst: "Universidad Ensigna", period: "2018 - 2023", degree: "Ingeniería en sistemas" },
    { inst: "Universidad Ensigna", period: "2012 - 2018", degree: "Programación web" },
  ],
  languages: ["Español", "Portugués", "Inglés"],
  competencies: ["Software 01", "Software 02", "Software 03", "Software 04", "Software 05"],
  skills: ["Liderazgo", "Creatividad", "Análisis crítico", "Eficiencia"],
};

// Helper: count chars in a string
const chars = (s: string) => s.length;

// Helper: total chars for experience entries
const expChars = ALEJANDRO_CV.experience.reduce(
  (acc, e) => ({
    inst: acc.inst + chars(e.inst),
    period: acc.period + chars(e.period),
    desc: acc.desc + chars(e.desc),
  }),
  { inst: 0, period: 0, desc: 0 }
);

// Helper: total chars for education entries
const eduChars = ALEJANDRO_CV.education.reduce(
  (acc, e) => ({
    inst: acc.inst + chars(e.inst),
    period: acc.period + chars(e.period),
    degree: acc.degree + chars(e.degree),
  }),
  { inst: 0, period: 0, degree: 0 }
);

// Helper: total chars for languages
const langChars = ALEJANDRO_CV.languages.reduce((acc, l) => acc + chars(l), 0);

// Helper: total chars for competencies
const compChars = ALEJANDRO_CV.competencies.reduce((acc, c) => acc + chars(c), 0);

// Helper: total chars for skills
const skillChars = ALEJANDRO_CV.skills.reduce((acc, s) => acc + chars(s), 0);

// Total personal data chars
const personalChars = chars(ALEJANDRO_CV.firstName) + chars(ALEJANDRO_CV.lastName) + chars(ALEJANDRO_CV.title) + chars(ALEJANDRO_CV.profile);

// Total contact chars
const contactChars = chars(ALEJANDRO_CV.phone) + chars(ALEJANDRO_CV.email) + chars(ALEJANDRO_CV.web) + chars(ALEJANDRO_CV.location);

/**
 * KLM Steps for creating Alejandro Torres' CV.
 * Each step groups high-level actions with aggregated operator counts.
 *
 * K = keystrokes (characters typed)
 * P = pointing/clicking actions
 * H = homing (keyboard↔mouse transitions)
 * M = mental preparation
 * B = mouse button presses
 */
export const CV_BUILDER_STEPS: KLMStep[] = [
  {
    step: 1,
    action: "Ir a Configuración CV",
    data: "Navegación",
    K: 0, P: 1, H: 0, M: 1, B: 1,
  },
  {
    step: 2,
    action: "Configurar foto de perfil",
    data: "Foto URL",
    K: 0, P: 1, H: 0, M: 0, B: 0,
  },
  {
    step: 3,
    action: "Ingresar datos personales",
    data: `${ALEJANDRO_CV.firstName} ${ALEJANDRO_CV.lastName}, ${ALEJANDRO_CV.title}, Perfil (${chars(ALEJANDRO_CV.profile)} chars)`,
    K: personalChars, P: 1, H: 3, M: 0, B: 1,
  },
  {
    step: 4,
    action: "Ingresar datos de contacto",
    data: `Tel, Email, Web, Dirección (${contactChars} chars)`,
    K: contactChars, P: 1, H: 3, M: 0, B: 1,
  },
  {
    step: 5,
    action: "Ingresar experiencia laboral",
    data: `${ALEJANDRO_CV.experience.length} entradas (${expChars.inst + expChars.period + expChars.desc} chars)`,
    K: expChars.inst + expChars.period + expChars.desc,
    P: ALEJANDRO_CV.experience.length * 2,  // Add button + slider for each
    H: ALEJANDRO_CV.experience.length * 2,
    M: 0,
    B: ALEJANDRO_CV.experience.length,
  },
  {
    step: 6,
    action: "Ingresar formación académica",
    data: `${ALEJANDRO_CV.education.length} entradas (${eduChars.inst + eduChars.period + eduChars.degree} chars)`,
    K: eduChars.inst + eduChars.period + eduChars.degree,
    P: ALEJANDRO_CV.education.length * 2,
    H: ALEJANDRO_CV.education.length * 2,
    M: 0,
    B: ALEJANDRO_CV.education.length,
  },
  {
    step: 7,
    action: "Ingresar idiomas",
    data: `${ALEJANDRO_CV.languages.length} idiomas (${langChars} chars)`,
    K: langChars,
    P: ALEJANDRO_CV.languages.length,
    H: 0,
    M: 0,
    B: ALEJANDRO_CV.languages.length,
  },
  {
    step: 8,
    action: "Ingresar competencias",
    data: `${ALEJANDRO_CV.competencies.length} software + nivel (${compChars} chars)`,
    K: compChars,
    P: ALEJANDRO_CV.competencies.length * 3, // Add + type + slider
    H: 0,
    M: 0,
    B: ALEJANDRO_CV.competencies.length,
  },
  {
    step: 9,
    action: "Ingresar habilidades",
    data: `${ALEJANDRO_CV.skills.length} skills + nivel (${skillChars} chars)`,
    K: skillChars,
    P: ALEJANDRO_CV.skills.length * 3, // Add + type + slider
    H: 0,
    M: 0,
    B: ALEJANDRO_CV.skills.length,
  },
  {
    step: 10,
    action: "Revisar y exportar PDF",
    data: "Apply + Download",
    K: 0, P: 2, H: 0, M: 2, B: 1,
  },
];

// --- Calculation Functions ---

export function calculateStepTime(step: KLMStep): number {
  return (
    step.K * KLM_OPERATORS.K.time +
    step.P * KLM_OPERATORS.P.time +
    step.H * KLM_OPERATORS.H.time +
    step.M * KLM_OPERATORS.M.time +
    step.B * KLM_OPERATORS.B.time
  );
}

export function calculateTotalTime(steps: KLMStep[]): number {
  return steps.reduce((total, step) => total + calculateStepTime(step), 0);
}

export function getTotals(steps: KLMStep[]) {
  return steps.reduce(
    (acc, step) => ({
      K: acc.K + step.K,
      P: acc.P + step.P,
      H: acc.H + step.H,
      M: acc.M + step.M,
      B: acc.B + step.B,
    }),
    { K: 0, P: 0, H: 0, M: 0, B: 0 }
  );
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}m ${secs}s`;
}

// --- Excel Export (Format from Image 2) ---

export function generateKLMReport(steps: KLMStep[]): string {
  const totals = getTotals(steps);
  const totalTime = calculateTotalTime(steps);

  const lines: string[] = [];

  // Headers (exact format from Image 2)
  lines.push("Operador,Dato,K,P,H,M,B");

  // Data rows
  for (const step of steps) {
    const row = [
      step.action,
      step.data,
      step.K || "-",
      step.P || "-",
      step.H || "-",
      step.M || "-",
      step.B || "-",
    ];
    lines.push(row.join(","));
  }

  // Totals row
  lines.push("");
  lines.push(`TOTAL,,${totals.K},${totals.P},${totals.H},${totals.M},${totals.B}`);
  lines.push(`Tiempo Total (segundos),,${totalTime.toFixed(2)}`);
  lines.push(`Tiempo Total (formateado),,${formatTime(totalTime)}`);

  // Operator reference
  lines.push("");
  lines.push("Referencia de Operadores");
  lines.push("Operador,Acción,Tiempo (seg)");
  for (const [key, op] of Object.entries(KLM_OPERATORS)) {
    lines.push(`${key},${op.name},${op.time}`);
  }

  return lines.join("\n");
}

export function downloadKLMReport(steps: KLMStep[], filename: string = "klm-curriculum-alejandro-torres.csv") {
  const csv = generateKLMReport(steps);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
