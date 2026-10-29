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
  draftConfig: TypographyConfig | null;
  config: TypographyConfig;
  savePreset: (name: string, config: TypographyConfig) => void;
  updatePreset: (id: string, name: string, config: TypographyConfig) => void;
  deletePreset: (id: string) => void;
  activatePreset: (id: string) => void;
  searchPresets: (query: string) => TypographyPreset[];
  setPreviewPreset: (preset: TypographyPreset | null) => void;
  updateDraftFont: (type: "title" | "body", name: string, data: string) => void;
  updateDraftSizes: (title: number, subtitle: number, paragraph: number) => void;
  setDraftConfig: (config: TypographyConfig) => void;
  applyDraft: () => void;
  resetDraft: () => void;
  hasDraft: boolean;
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
  name: "Default",
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
  const [draftConfig, setDraftConfig] = useState<TypographyConfig | null>(null);
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

  const savePreset = useCallback((name: string, cfg: TypographyConfig) => {
    const newPreset: TypographyPreset = {
      id: `typography-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      config: { ...cfg },
      createdAt: Date.now(),
    };
    setPresets((prev) => [newPreset, ...prev]);
  }, []);

  const updatePreset = useCallback((id: string, name: string, cfg: TypographyConfig) => {
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name, config: { ...cfg } } : p)));
    setActivePreset((prev) => (prev.id === id ? { ...prev, name, config: { ...cfg } } : prev));
    setPreviewPreset((prev) => (prev?.id === id ? { ...prev, name, config: { ...cfg } } : prev));
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
    setPreviewPreset((prev) => (prev?.id === id ? null : prev));
  }, []);

  const activatePreset = useCallback((id: string) => {
    const found = presets.find((preset) => preset.id === id);
    if (!found) return;
    setActivePreset(found);
    setPreviewPreset(null);
    setDraftConfig(null);
  }, [presets]);

  const searchPresets = useCallback((query: string): TypographyPreset[] => {
    if (!query.trim()) return presets;
    const lower = query.toLowerCase();
    return presets.filter((p) => p.name.toLowerCase().includes(lower));
  }, [presets]);

  const updateDraftFont = useCallback((type: "title" | "body", name: string, data: string) => {
    setDraftConfig((prev) => {
      const base = prev || activePreset.config;
      if (type === "title") {
        return { ...base, titleFontName: name, titleFontData: data };
      }
      return { ...base, bodyFontName: name, bodyFontData: data };
    });
  }, [activePreset.config]);

  const updateDraftSizes = useCallback((title: number, subtitle: number, paragraph: number) => {
    setDraftConfig((prev) => {
      const base = prev || activePreset.config;
      return { ...base, titleSize: title, subtitleSize: subtitle, paragraphSize: paragraph };
    });
  }, [activePreset.config]);

  const applyDraft = useCallback(() => {
    setDraftConfig((prev) => {
      if (prev) {
        setActivePreset((current) => ({ ...current, config: { ...prev } }));
      }
      return null;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraftConfig(null);
  }, []);

  const setDraftConfigValue = useCallback((cfg: TypographyConfig) => {
    setDraftConfig({ ...cfg });
  }, []);

  return (
    <TypographyContext.Provider
      value={{
        presets,
        activePreset,
        previewPreset,
        draftConfig,
        config,
        savePreset,
        updatePreset,
        deletePreset,
        activatePreset,
        searchPresets,
        setPreviewPreset,
        updateDraftFont,
        updateDraftSizes,
        setDraftConfig: setDraftConfigValue,
        applyDraft,
        resetDraft,
        hasDraft: draftConfig !== null,
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
