"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CVData,
  DEFAULT_CV_DATA,
  EducationItem,
  ExperienceItem,
  generateId,
} from "@/types/cv";

interface CVCContextType {
  cvData: CVData;
  draftData: CVData | null;
  hasDraft: boolean;
  saveCV: (data: CVData) => void;
  updateDraft: (data: Partial<CVData>) => void;
  applyDraft: () => void;
  resetDraft: () => void;
}

const STORAGE_KEY = "cv-data";
const LEGACY_PERIOD_RE = /^\s*(\d{4})\s*-\s*(\d{4}|presente|actual)\s*$/i;

function normalizePeriod(item: Record<string, unknown>): {
  startDate: string;
  endDate: string;
} {
  if (typeof item.startDate === "string" || typeof item.endDate === "string") {
    return {
      startDate: typeof item.startDate === "string" ? item.startDate : "",
      endDate: typeof item.endDate === "string" ? item.endDate : "",
    };
  }

  const legacyDate = typeof item.date === "string" ? item.date.trim() : "";
  const match = legacyDate.match(LEGACY_PERIOD_RE);
  if (!match) return { startDate: "", endDate: "" };

  if (/^(presente|actual)$/i.test(match[2])) {
    return {
      startDate: match[1],
      endDate: String(new Date().getFullYear()),
    };
  }

  return { startDate: match[1], endDate: match[2] };
}

function normalizeExperience(value: unknown): ExperienceItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((raw) => {
    const item =
      raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const period = normalizePeriod(item);

    return {
      id: typeof item.id === "string" && item.id ? item.id : generateId(),
      title: typeof item.title === "string" ? item.title : "",
      startDate: period.startDate,
      endDate: period.endDate,
      description: typeof item.description === "string" ? item.description : "",
    };
  });
}

function normalizeEducation(value: unknown): EducationItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((raw) => {
    const item =
      raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const period = normalizePeriod(item);

    return {
      id: typeof item.id === "string" && item.id ? item.id : generateId(),
      title: typeof item.title === "string" ? item.title : "",
      startDate: period.startDate,
      endDate: period.endDate,
    };
  });
}

function loadCVData(): CVData {
  if (typeof window === "undefined") return DEFAULT_CV_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CV_DATA;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const personal =
        parsed.personal && typeof parsed.personal === "object"
          ? parsed.personal
          : {};
      const contact =
        parsed.contact && typeof parsed.contact === "object"
          ? parsed.contact
          : {};

      return {
        ...DEFAULT_CV_DATA,
        ...parsed,
        personal: { ...DEFAULT_CV_DATA.personal, ...personal },
        contact: { ...DEFAULT_CV_DATA.contact, ...contact },
        experience: normalizeExperience(parsed.experience),
        education: normalizeEducation(parsed.education),
      };
    }
    return DEFAULT_CV_DATA;
  } catch {
    return DEFAULT_CV_DATA;
  }
}

function createDefaultWithSamples(): CVData {
  const data = { ...DEFAULT_CV_DATA };
  data.personal = {
    photo: "",
    firstName: "Alejandro",
    lastName: "Torres",
    title: "Programador web",
    profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue. Consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo.",
  };
  data.contact = {
    phone: "+34-91-1234-567",
    email: "Hola@unsitioincreible.es",
    web: "www.unsitioincreible.es",
    location: "Calle Cualquiera 123, Cualquier Lugar",
  };
  data.experience = [
    { id: generateId(), title: "Multinacional González", startDate: "2019", endDate: "2023", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Álvarez y asociados", startDate: "2015", endDate: "2019", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Industrias Ariova", startDate: "2014", endDate: "2015", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Rimberio y asociados", startDate: "2012", endDate: "2014", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
  ];
  data.education = [
    { id: generateId(), title: "Universidad Ensigna - Ingeniería en sistemas", startDate: "2018", endDate: "2023" },
    { id: generateId(), title: "Universidad Ensigna - Programación web", startDate: "2012", endDate: "2018" },
  ];
  data.languages = [
    { id: generateId(), name: "Español" },
    { id: generateId(), name: "Portugués" },
    { id: generateId(), name: "Inglés" },
  ];
  data.competencies = [
    { id: generateId(), name: "Software 01", level: 5 },
    { id: generateId(), name: "Software 02", level: 4 },
    { id: generateId(), name: "Software 03", level: 3 },
    { id: generateId(), name: "Software 04", level: 4 },
    { id: generateId(), name: "Software 05", level: 3 },
  ];
  data.skills = [
    { id: generateId(), name: "Liderazgo", level: 5 },
    { id: generateId(), name: "Creatividad", level: 3 },
    { id: generateId(), name: "Análisis crítico", level: 4 },
    { id: generateId(), name: "Eficiencia", level: 5 },
  ];
  return data;
}

const CVCContext = createContext<CVCContextType | null>(null);

export function CVCProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCVData] = useState<CVData>(DEFAULT_CV_DATA);
  const [draftData, setDraftData] = useState<CVData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedData = loadCVData();
    const hasData = loadedData.experience.length > 0 || loadedData.education.length > 0 || loadedData.languages.length > 0;
    setCVData(hasData ? loadedData : createDefaultWithSamples());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    }
  }, [cvData, loaded]);

  const saveCV = useCallback((data: CVData) => {
    setCVData(data);
    setDraftData(null);
  }, []);

  const updateDraft = useCallback((partialData: Partial<CVData>) => {
    setDraftData((prev) => {
      const base = prev || cvData;
      return { ...base, ...partialData };
    });
  }, [cvData]);

  const applyDraft = useCallback(() => {
    setDraftData((prev) => {
      if (prev) {
        setCVData(prev);
      }
      return null;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraftData(null);
  }, []);

  return (
    <CVCContext.Provider
      value={{
        cvData,
        draftData,
        hasDraft: draftData !== null,
        saveCV,
        updateDraft,
        applyDraft,
        resetDraft,
      }}
    >
      {children}
    </CVCContext.Provider>
  );
}

export function useCVC() {
  const ctx = useContext(CVCContext);
  if (!ctx) throw new Error("useCVC must be used within CVCProvider");
  return ctx;
}