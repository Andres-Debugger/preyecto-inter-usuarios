"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface TypographyConfig {
  titleFontName: string;
  titleFontData: string;
  bodyFontName: string;
  bodyFontData: string;
  titleSize: number;
  subtitleSize: number;
  paragraphSize: number;
}

export interface TypographyPreset {
  id: string;
  name: string;
  config: TypographyConfig;
  createdAt: number;
}

interface TypographyContextType {
  presets: TypographyPreset[];
  activePreset: TypographyPreset;
  previewPreset: TypographyPreset | null;
  config: TypographyConfig;
  savePreset: (name: string, config: TypographyConfig) => void;
  deletePreset: (id: string) => void;
  activatePreset: (id: string) => void;
  searchPresets: (query: string) => TypographyPreset[];
  setPreviewPreset: (preset: TypographyPreset | null) => void;
  updateTitleFont: (name: string, data: string) => void;
  updateBodyFont: (name: string, data: string) => void;
  updateSizes: (title: number, subtitle: number, paragraph: number) => void;
}

const DEFAULT_CONFIG: TypographyConfig = {
  titleFontName: "",
  titleFontData: "",
  bodyFontName: "",
  bodyFontData: "",
  titleSize: 48,
  subtitleSize: 18,
  paragraphSize: 14,
};

const DEFAULT_PRESET: TypographyPreset = {
  id: "default",
  name: "Configuración por Defecto",
  config: DEFAULT_CONFIG,
  createdAt: Date.now(),
};

const PRESETS_STORAGE_KEY = "celestique-typography-presets";
const ACTIVE_PRESET_KEY = "celestique-typography-active";

function loadPresets(): TypographyPreset[] {
  if (typeof window === "undefined") return [DEFAULT_PRESET];
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return [DEFAULT_PRESET];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_PRESET];
  } catch {
    return [DEFAULT_PRESET];
  }
}

function loadActivePreset(presets: TypographyPreset[]): TypographyPreset {
  if (typeof window === "undefined") return presets[0];
  try {
    const activeId = localStorage.getItem(ACTIVE_PRESET_KEY);
    if (activeId) {
      const found = presets.find((p) => p.id === activeId);
      if (found) return found;
    }
  } catch {}
  return presets[0];
}

const TypographyContext = createContext<TypographyContextType | null>(null);

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [presets, setPresets] = useState<TypographyPreset[]>([DEFAULT_PRESET]);
  const [activePreset, setActivePreset] = useState<TypographyPreset>(DEFAULT_PRESET);
  const [previewPreset, setPreviewPreset] = useState<TypographyPreset | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedPresets = loadPresets();
    setPresets(loadedPresets);
    setActivePreset(loadActivePreset(loadedPresets));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    }
  }, [presets, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(ACTIVE_PRESET_KEY, activePreset.id);
    }
  }, [activePreset.id, loaded]);

  const config = previewPreset?.config || activePreset.config;

  const savePreset = useCallback((name: string, config: TypographyConfig) => {
    const newPreset: TypographyPreset = {
      id: `typography-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      config: { ...config },
      createdAt: Date.now(),
    };
    setPresets((prev) => [newPreset, ...prev]);
  }, []);

  const deletePreset = useCallback((id: string) => {
    if (id === "default") return;
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next.length > 0 ? next : [DEFAULT_PRESET];
    });
    setActivePreset((prev) => {
      if (prev.id === id) return DEFAULT_PRESET;
      return prev;
    });
  }, []);

  const activatePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) {
        setActivePreset(found);
        setPreviewPreset(null);
      }
      return prev;
    });
  }, []);

  const searchPresets = useCallback((query: string): TypographyPreset[] => {
    if (!query.trim()) return presets;
    const lower = query.toLowerCase();
    return presets.filter((p) => p.name.toLowerCase().includes(lower));
  }, [presets]);

  const updateTitleFont = useCallback((name: string, data: string) => {
    setActivePreset((prev) => ({
      ...prev,
      config: { ...prev.config, titleFontName: name, titleFontData: data },
    }));
  }, []);

  const updateBodyFont = useCallback((name: string, data: string) => {
    setActivePreset((prev) => ({
      ...prev,
      config: { ...prev.config, bodyFontName: name, bodyFontData: data },
    }));
  }, []);

  const updateSizes = useCallback((title: number, subtitle: number, paragraph: number) => {
    setActivePreset((prev) => ({
      ...prev,
      config: { ...prev.config, titleSize: title, subtitleSize: subtitle, paragraphSize: paragraph },
    }));
  }, []);

  return (
    <TypographyContext.Provider
      value={{
        presets,
        activePreset,
        previewPreset,
        config,
        savePreset,
        deletePreset,
        activatePreset,
        searchPresets,
        setPreviewPreset,
        updateTitleFont,
        updateBodyFont,
        updateSizes,
      }}
    >
      {children}
    </TypographyContext.Provider>
  );
}

export function useTypography() {
  const ctx = useContext(TypographyContext);
  if (!ctx) throw new Error("useTypography must be used within TypographyProvider");
  return ctx;
}
