"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CVData, DEFAULT_CV_DATA, generateId } from "@/types/cv";

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

function loadCVData(): CVData {
  if (typeof window === "undefined") return DEFAULT_CV_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CV_DATA;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_CV_DATA, ...parsed };
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
    { id: generateId(), title: "Multinacional González", date: "2019 - 2023", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Álvarez y asociados", date: "2015 - 2019", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Industrias Ariova", date: "2014 - 2015", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
    { id: generateId(), title: "Rimberio y asociados", date: "2012 - 2014", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue." },
  ];
  data.education = [
    { id: generateId(), title: "Universidad Ensigna - Ingeniería en sistemas", date: "2018 - 2023" },
    { id: generateId(), title: "Universidad Ensigna - Programación web", date: "2012 - 2018" },
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