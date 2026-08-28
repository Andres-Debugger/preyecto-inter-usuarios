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
  date: string;
  description: string;
}

export interface EducationItem {
  id: string;
  title: string;
  date: string;
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