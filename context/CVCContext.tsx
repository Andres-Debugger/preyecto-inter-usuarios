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
  data.competencies = [
    { id: generateId(), name: "HTML / CSS", level: 5 },
    { id: generateId(), name: "JavaScript", level: 4 },
    { id: generateId(), name: "React", level: 4 },
    { id: generateId(), name: "Node.js", level: 3 },
    { id: generateId(), name: "Git", level: 5 },
  ];
  data.skills = [
    { id: generateId(), name: "Liderazgo", level: 5 },
    { id: generateId(), name: "Comunicación", level: 4 },
    { id: generateId(), name: "Resolución de problemas", level: 5 },
  ];
  data.experience = [
    { id: generateId(), title: "Desarrollador Web", date: "2022 - Presente", description: "Desarrollo de aplicaciones web modernas usando React, TypeScript y Node.js. Colaboración en equipo ágil." },
  ];
  data.education = [
    { id: generateId(), title: "Ingeniería Informática", date: "2018 - 2022" },
  ];
  data.languages = [
    { id: generateId(), name: "Español (Nativo)" },
    { id: generateId(), name: "Inglés (Avanzado)" },
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