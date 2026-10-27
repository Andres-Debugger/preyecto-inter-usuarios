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

export interface KLMCounts {
  K: number;
  P: number;
  H: number;
  M: number;
  B: number;
  Scrolling: number;
  R: number;
}

export interface KLMDetail {
  action: string;
  data?: string;
  counts: Partial<KLMCounts>;
}

export interface KLMStep {
  step: number;
  action: string;
  data: string;
  details: KLMDetail[];
}

type Device = "mouse" | "keyboard";

interface DetailInput {
  action: string;
  data?: string;
  device?: Device;
  counts: Partial<KLMCounts>;
}

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
    { inst: "Multinacional González", startDate: "2019", endDate: "2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Álvarez y asociados", startDate: "2015", endDate: "2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Industrias Ariova", startDate: "2014", endDate: "2015", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { inst: "Rimberio y asociados", startDate: "2012", endDate: "2014", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
  ],
  education: [
    { title: "Universidad Ensigna - Ingeniería en sistemas", startDate: "2018", endDate: "2023" },
    { title: "Universidad Ensigna - Programación web", startDate: "2012", endDate: "2018" },
  ],
  languages: ["Español", "Portugués", "Inglés"],
  competencies: ["Software 01", "Software 02", "Software 03", "Software 04", "Software 05"],
  skills: ["Liderazgo", "Creatividad", "Análisis crítico", "Eficiencia"],
};

const chars = (s: string) => s.length;

const expTextChars = ALEJANDRO_CV.experience.reduce(
  (total, entry) => total + chars(entry.inst) + chars(entry.desc),
  0
);

const expYearChars = ALEJANDRO_CV.experience.reduce(
  (total, entry) => total + chars(entry.startDate) + chars(entry.endDate),
  0
);

const eduTextChars = ALEJANDRO_CV.education.reduce(
  (total, entry) => total + chars(entry.title),
  0
);

const eduYearChars = ALEJANDRO_CV.education.reduce(
  (total, entry) => total + chars(entry.startDate) + chars(entry.endDate),
  0
);

const langChars = ALEJANDRO_CV.languages.reduce((total, language) => total + chars(language), 0);
const compChars = ALEJANDRO_CV.competencies.reduce((total, competency) => total + chars(competency), 0);
const skillChars = ALEJANDRO_CV.skills.reduce((total, skill) => total + chars(skill), 0);

const personalChars =
  chars(ALEJANDRO_CV.firstName) +
  chars(ALEJANDRO_CV.lastName) +
  chars(ALEJANDRO_CV.title) +
  chars(ALEJANDRO_CV.profile);

const contactChars =
  chars(ALEJANDRO_CV.phone) +
  chars(ALEJANDRO_CV.email) +
  chars(ALEJANDRO_CV.web) +
  chars(ALEJANDRO_CV.location);

const click = (target: string): DetailInput => ({
  action: `Mover el mouse y hacer clic en ${target}`,
  device: "mouse",
  counts: { P: 1, B: 1 },
});

const typeText = (target: string, count: number): DetailInput => ({
  action: `Escribir en ${target}`,
  data: `${count} caracteres`,
  device: "keyboard",
  counts: { K: count },
});

const pressEnter = (target: string): DetailInput => ({
  action: `Presionar Enter para ${target}`,
  device: "keyboard",
  counts: { K: 1 },
});

const think = (target: string): DetailInput => ({
  action: `Pensar en ${target}`,
  counts: { M: 1 },
});

const wait = (target: string): DetailInput => ({
  action: `Esperar ${target}`,
  counts: { R: 1 },
});

const scroll = (target: string, count = 1): DetailInput => ({
  action: `Desplazarse ${target}`,
  device: "mouse",
  counts: { Scrolling: count },
});

function buildDetails(startDevice: Device, actions: DetailInput[]): KLMDetail[] {
  let device = startDevice;
  const details: KLMDetail[] = [];

  for (const action of actions) {
    if (action.device && action.device !== device) {
      details.push({
        action: `Mover la mano al ${action.device === "mouse" ? "mouse" : "teclado"}`,
        counts: { H: 1 },
      });
      device = action.device;
    }

    if (Object.keys(action.counts).length > 0) {
      details.push({
        action: action.action,
        data: action.data,
        counts: action.counts,
      });
    }
  }

  return details;
}

function makeStep(
  step: number,
  action: string,
  data: string,
  startDevice: Device,
  actions: DetailInput[]
): KLMStep {
  return {
    step,
    action,
    data,
    details: buildDetails(startDevice, actions),
  };
}

const personalFields = [
  { label: "First Name", count: chars(ALEJANDRO_CV.firstName) },
  { label: "Last Name", count: chars(ALEJANDRO_CV.lastName) },
  { label: "Professional Title", count: chars(ALEJANDRO_CV.title) },
  { label: "Profile Description", count: chars(ALEJANDRO_CV.profile) },
];

const contactFields = [
  { label: "Phone", count: chars(ALEJANDRO_CV.phone) },
  { label: "Email", count: chars(ALEJANDRO_CV.email) },
  { label: "Website", count: chars(ALEJANDRO_CV.web) },
  { label: "Location", count: chars(ALEJANDRO_CV.location) },
];

const experienceActions: DetailInput[] = [think("los datos de experiencia")];
ALEJANDRO_CV.experience.forEach((entry, index) => {
  const label = `experiencia ${index + 1}`;
  experienceActions.push(
    click(`Add Experience (${label})`),
    click(`Position & Institution (${label})`),
    typeText(`Position & Institution (${label})`, chars(entry.inst)),
    click(`From (${label})`),
    typeText(`From (${label})`, chars(entry.startDate)),
    click(`To (${label})`),
    typeText(`To (${label})`, chars(entry.endDate)),
    click(`Description (${label})`),
    typeText(`Description (${label})`, chars(entry.desc))
  );
});

const educationActions: DetailInput[] = [think("los datos de formación")];
ALEJANDRO_CV.education.forEach((entry, index) => {
  const label = `formación ${index + 1}`;
  educationActions.push(
    click(`Add Education (${label})`),
    click(`Degree & Institution (${label})`),
    typeText(`Degree & Institution (${label})`, chars(entry.title)),
    click(`From (${label})`),
    typeText(`From (${label})`, chars(entry.startDate)),
    click(`To (${label})`),
    typeText(`To (${label})`, chars(entry.endDate))
  );
});

const languageActions: DetailInput[] = [
  think("los idiomas"),
  scroll("hasta la sección de idiomas"),
];
ALEJANDRO_CV.languages.forEach((language, index) => {
  const label = `idioma ${index + 1}`;
  languageActions.push(
    click(`Add Language (${label})`),
    click(`Language (${label})`),
    typeText(`Language (${label})`, chars(language))
  );
});

const competencyActions: DetailInput[] = [think("los software y sus niveles")];
ALEJANDRO_CV.competencies.forEach((competency, index) => {
  const label = `software ${index + 1}`;
  competencyActions.push(
    click(`Add Competency (${label})`),
    click(`Software (${label})`),
    typeText(`Software (${label})`, chars(competency)),
    click(`Level slider (${label})`)
  );
});

const skillActions: DetailInput[] = [think("las habilidades y sus niveles")];
ALEJANDRO_CV.skills.forEach((skill, index) => {
  const label = `habilidad ${index + 1}`;
  skillActions.push(
    click(`Add Skill (${label})`),
    click(`Skill (${label})`),
    typeText(`Skill (${label})`, chars(skill)),
    click(`Level slider (${label})`)
  );
});

export const CV_BUILDER_STEPS: KLMStep[] = [
  makeStep(1, "Ir a Configuración CV", "MENU → Settings → scroll (2)", "mouse", [
    think("ubicar la sección de CV"),
    click("MENU"),
    click("Settings"),
    wait("la carga de Settings"),
    scroll("hasta CV Builder", 2),
  ]),
  makeStep(2, "Configurar foto de perfil", "Upload photo → archivo → Enter", "mouse", [
    think("elegir la foto"),
    click("Upload photo"),
    wait("abrir el diálogo de archivo"),
    click("archivo de imagen"),
    pressEnter("confirmar la selección"),
    wait("procesar la imagen"),
  ]),
  makeStep(3, "Ingresar datos personales", `4 campos (${personalChars} caracteres)`, "keyboard", [
    think("completar los datos personales"),
    ...personalFields.flatMap((field) => [
      click(`campo ${field.label}`),
      typeText(field.label, field.count),
    ]),
  ]),
  makeStep(4, "Ingresar datos de contacto", `4 campos (${contactChars} caracteres)`, "keyboard", [
    think("completar los datos de contacto"),
    ...contactFields.flatMap((field) => [
      click(`campo ${field.label}`),
      typeText(field.label, field.count),
    ]),
  ]),
  makeStep(
    5,
    "Ingresar experiencia laboral",
    `${ALEJANDRO_CV.experience.length} entradas (${expTextChars} caracteres + ${expYearChars} dígitos)`,
    "keyboard",
    experienceActions
  ),
  makeStep(
    6,
    "Ingresar formación académica",
    `${ALEJANDRO_CV.education.length} entradas (${eduTextChars} caracteres + ${eduYearChars} dígitos)`,
    "keyboard",
    educationActions
  ),
  makeStep(7, "Ingresar idiomas", `${ALEJANDRO_CV.languages.length} idiomas (${langChars} caracteres)`, "keyboard", languageActions),
  makeStep(8, "Ingresar competencias", `${ALEJANDRO_CV.competencies.length} software (${compChars} caracteres + ${ALEJANDRO_CV.competencies.length} sliders)`, "keyboard", competencyActions),
  makeStep(9, "Ingresar habilidades", `${ALEJANDRO_CV.skills.length} skills (${skillChars} caracteres + ${ALEJANDRO_CV.skills.length} sliders)`, "mouse", skillActions),
  makeStep(10, "Revisar y exportar PDF", "Apply + Download", "mouse", [
    think("revisar el CV"),
    scroll("hasta las acciones"),
    click("Apply Changes"),
    wait("la validación"),
    think("confirmar la descarga"),
    click("Download PDF"),
    wait("generar y descargar el PDF"),
  ]),
];

const emptyCounts = (): KLMCounts => ({
  K: 0,
  P: 0,
  H: 0,
  M: 0,
  B: 0,
  Scrolling: 0,
  R: 0,
});

export function getStepTotals(step: KLMStep): KLMCounts {
  return step.details.reduce((totals, detail) => {
    (Object.keys(totals) as (keyof KLMCounts)[]).forEach((operator) => {
      totals[operator] += detail.counts[operator] ?? 0;
    });
    return totals;
  }, emptyCounts());
}

export function calculateStepTime(step: KLMStep): number {
  const totals = getStepTotals(step);

  return (
    totals.K * KLM_OPERATORS.K.time +
    totals.P * KLM_OPERATORS.P.time +
    totals.H * KLM_OPERATORS.H.time +
    totals.M * KLM_OPERATORS.M.time +
    totals.B * KLM_OPERATORS.B.time +
    totals.Scrolling * KLM_OPERATORS.Scrolling.time +
    totals.R * KLM_OPERATORS.R.time
  );
}

export function calculateTotalTime(steps: KLMStep[]): number {
  return steps.reduce((total, step) => total + calculateStepTime(step), 0);
}

export function getTotals(steps: KLMStep[]): KLMCounts {
  return steps.reduce((totals, step) => {
    const stepTotals = getStepTotals(step);
    (Object.keys(totals) as (keyof KLMCounts)[]).forEach((operator) => {
      totals[operator] += stepTotals[operator];
    });
    return totals;
  }, emptyCounts());
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}m ${secs}s`;
}

function escapeCsv(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvRow(values: (string | number)[]): string {
  return values.map(escapeCsv).join(",");
}

function displayCount(value: number | undefined): string | number {
  return value && value > 0 ? value : "-";
}

export function generateKLMReport(steps: KLMStep[]): string {
  const totals = getTotals(steps);
  const totalTime = calculateTotalTime(steps);
  const lines: string[] = [];

  lines.push(csvRow(["Operador", "Dato", "K", "P", "H", "M", "B", "Scrolling", "R"]));

  for (const step of steps) {
    const stepTotals = getStepTotals(step);
    lines.push(
      csvRow([
        step.action,
        step.data,
        displayCount(stepTotals.K),
        displayCount(stepTotals.P),
        displayCount(stepTotals.H),
        displayCount(stepTotals.M),
        displayCount(stepTotals.B),
        displayCount(stepTotals.Scrolling),
        displayCount(stepTotals.R),
      ])
    );
  }

  lines.push("");
  lines.push(csvRow(["TOTAL", "", totals.K, totals.P, totals.H, totals.M, totals.B, totals.Scrolling, totals.R]));
  lines.push(csvRow(["Tiempo Total (segundos)", "", totalTime.toFixed(2)]));
  lines.push(csvRow(["Tiempo Total (formateado)", "", formatTime(totalTime)]));

  lines.push("");
  lines.push(csvRow(["Detalle de subacciones"]));
  lines.push(csvRow(["Paso", "Acción", "Dato", "K", "P", "H", "M", "B", "Scrolling", "R"]));

  for (const step of steps) {
    for (const detail of step.details) {
      lines.push(
        csvRow([
          step.step,
          detail.action,
          detail.data ?? "",
          displayCount(detail.counts.K),
          displayCount(detail.counts.P),
          displayCount(detail.counts.H),
          displayCount(detail.counts.M),
          displayCount(detail.counts.B),
          displayCount(detail.counts.Scrolling),
          displayCount(detail.counts.R),
        ])
      );
    }
  }

  lines.push("");
  lines.push(csvRow(["Referencia de Operadores"]));
  lines.push(csvRow(["Operador", "Acción", "Tiempo (seg)"]));

  for (const [key, operator] of Object.entries(KLM_OPERATORS)) {
    lines.push(csvRow([key, operator.name, key === "R" ? "t" : operator.time]));
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
