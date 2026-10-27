export interface CVData {
  personal: PersonalInfo;
  contact: ContactInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  competencies: CompetencyItem[];
  skills: SkillItem[];
}

export interface PersonalInfo {
  photo: string;
  firstName: string;
  lastName: string;
  title: string;
  profile: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  web: string;
  location: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface LanguageItem {
  id: string;
  name: string;
}

export interface CompetencyItem {
  id: string;
  name: string;
  level: number;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
}

const DEFAULT_CV_PHOTO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#E8E2D8"/><circle cx="120" cy="92" r="42" fill="#B9AD9C"/><path d="M120 128c-12 0-22 10-22 22v18h44v-18c0-12-10-22-22-22z" fill="#B9AD9C"/><path d="M34 240c0-47.5 38.5-86 86-86s86 38.5 86 86H34z" fill="#B9AD9C"/></svg>`;

export const DEFAULT_CV_PHOTO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  DEFAULT_CV_PHOTO_SVG
)}`;

export const DEFAULT_CV_DATA: CVData = {
  personal: {
    photo: "",
    firstName: "",
    lastName: "",
    title: "",
    profile: "",
  },
  contact: {
    phone: "",
    email: "",
    web: "",
    location: "",
  },
  experience: [],
  education: [],
  languages: [],
  competencies: [],
  skills: [],
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatNameOnInput(value: string, cursorPos: number): { formatted: string; newCursor: number } {
  const formatted = capitalizeWords(value);
  return { formatted, newCursor: cursorPos };
}

export function sanitizeYearInput(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, 4);
}

export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "";
  if (startDate && endDate) return `${startDate} - ${endDate}`;
  return startDate || endDate;
}

// --- Validation System ---

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const URL_RE = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)*\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const YEAR_RE = /^\d{4}$/;
const MIN_YEAR = 1900;

export const VALIDATION_RULES: Record<string, ValidationRule> = {
  "personal.firstName": { required: true, minLength: 2, maxLength: 50 },
  "personal.lastName":  { required: true, minLength: 2, maxLength: 50 },
  "personal.title":     { required: true, minLength: 3, maxLength: 80 },
  "personal.profile":   { maxLength: 500 },
  "contact.email":      { required: true, pattern: EMAIL_RE },
  "contact.phone":      { pattern: PHONE_RE },
  "contact.web":        { pattern: URL_RE },
  "contact.location":   { maxLength: 100 },
  "experience.title":   { required: true, minLength: 3, maxLength: 100 },
  "experience.description": { maxLength: 500 },
  "education.title":    { required: true, minLength: 3, maxLength: 100 },
  "languages.name":     { required: true, minLength: 2, maxLength: 50 },
  "competencies.name":  { required: true, minLength: 2, maxLength: 50 },
  "skills.name":        { required: true, minLength: 2, maxLength: 50 },
};

const ERROR_MESSAGES: Record<string, string> = {
  "personal.firstName": "First name is required (2-50 characters)",
  "personal.lastName":  "Last name is required (2-50 characters)",
  "personal.title":     "Professional title is required (3-80 characters)",
  "personal.profile":   "Profile must be 500 characters or less",
  "contact.email":      "Please enter a valid email address",
  "contact.phone":      "Please enter a valid phone number",
  "contact.web":        "Please enter a valid URL",
  "contact.location":   "Location must be 100 characters or less",
  "experience.title":   "Position/institution is required (3-100 characters)",
  "experience.description": "Description must be 500 characters or less",
  "education.title":    "Degree/institution is required (3-100 characters)",
  "languages.name":     "Language name is required (2-50 characters)",
  "competencies.name":  "Competency name is required (2-50 characters)",
  "skills.name":        "Skill name is required (2-50 characters)",
};

export interface DateRangeErrors {
  startDate?: string;
  endDate?: string;
}

export function validateDateRange(startDate: string, endDate: string): DateRangeErrors {
  const start = startDate.trim();
  const end = endDate.trim();
  const maxYear = new Date().getFullYear();
  const errors: DateRangeErrors = {};

  if (!start) {
    errors.startDate = "Start year is required";
  } else if (!YEAR_RE.test(start)) {
    errors.startDate = "Start year must have 4 digits";
  } else if (Number(start) < MIN_YEAR || Number(start) > maxYear) {
    errors.startDate = `Start year must be between ${MIN_YEAR} and ${maxYear}`;
  }

  if (!end) {
    errors.endDate = "End year is required";
  } else if (!YEAR_RE.test(end)) {
    errors.endDate = "End year must have 4 digits";
  } else if (Number(end) < MIN_YEAR || Number(end) > maxYear) {
    errors.endDate = `End year must be between ${MIN_YEAR} and ${maxYear}`;
  }

  if (!errors.startDate && !errors.endDate && Number(end) <= Number(start)) {
    errors.endDate = "End year must be after the start year";
  }

  return errors;
}

export function validateField(ruleKey: string, value: string): string | null {
  const rule = VALIDATION_RULES[ruleKey];
  if (!rule) return null;

  const trimmed = value.trim();

  if (rule.required && !trimmed) {
    return ERROR_MESSAGES[ruleKey] || "This field is required";
  }

  if (trimmed && rule.minLength && trimmed.length < rule.minLength) {
    return ERROR_MESSAGES[ruleKey] || `Minimum ${rule.minLength} characters`;
  }

  if (trimmed && rule.maxLength && trimmed.length > rule.maxLength) {
    return ERROR_MESSAGES[ruleKey] || `Maximum ${rule.maxLength} characters`;
  }

  if (trimmed && rule.pattern && !rule.pattern.test(trimmed)) {
    return ERROR_MESSAGES[ruleKey] || "Invalid format";
  }

  if (trimmed && rule.custom) {
    return rule.custom(trimmed);
  }

  return null;
}

export function validateCV(data: CVData): Record<string, string> {
  const errors: Record<string, string> = {};

  // Personal fields
  for (const field of ["firstName", "lastName", "title", "profile"] as const) {
    const err = validateField(`personal.${field}`, data.personal[field]);
    if (err) errors[`personal.${field}`] = err;
  }

  // Contact fields
  for (const field of ["email", "phone", "web", "location"] as const) {
    const err = validateField(`contact.${field}`, data.contact[field]);
    if (err) errors[`contact.${field}`] = err;
  }

  // Dynamic sections
  data.experience.forEach((item, i) => {
    const titleErr = validateField("experience.title", item.title);
    const dateErrors = validateDateRange(item.startDate, item.endDate);
    const descErr = validateField("experience.description", item.description);
    if (titleErr) errors[`experience[${i}].title`] = titleErr;
    if (dateErrors.startDate) errors[`experience[${i}].startDate`] = dateErrors.startDate;
    if (dateErrors.endDate) errors[`experience[${i}].endDate`] = dateErrors.endDate;
    if (descErr) errors[`experience[${i}].description`] = descErr;
  });

  data.education.forEach((item, i) => {
    const titleErr = validateField("education.title", item.title);
    const dateErrors = validateDateRange(item.startDate, item.endDate);
    if (titleErr) errors[`education[${i}].title`] = titleErr;
    if (dateErrors.startDate) errors[`education[${i}].startDate`] = dateErrors.startDate;
    if (dateErrors.endDate) errors[`education[${i}].endDate`] = dateErrors.endDate;
  });

  data.languages.forEach((item, i) => {
    const err = validateField("languages.name", item.name);
    if (err) errors[`languages[${i}].name`] = err;
  });

  data.competencies.forEach((item, i) => {
    const err = validateField("competencies.name", item.name);
    if (err) errors[`competencies[${i}].name`] = err;
  });

  data.skills.forEach((item, i) => {
    const err = validateField("skills.name", item.name);
    if (err) errors[`skills[${i}].name`] = err;
  });

  return errors;
}