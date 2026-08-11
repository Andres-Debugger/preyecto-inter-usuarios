"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Palette {
  id: string;
  name: string;
  colors: [string, string, string, string, string];
  mode: "light" | "dark";
  createdAt: number;
}

interface PaletteContextType {
  palettes: Palette[];
  activePalette: Palette;
  previewPalette: Palette | null;
  setPreviewPalette: (p: Palette | null) => void;
  savePalette: (name: string, colors: [string, string, string, string, string], mode?: "light" | "dark") => void;
  deletePalette: (id: string) => void;
  activatePalette: (id: string) => void;
  searchPalettes: (query: string) => Palette[];
}

const DEFAULT_PALETTE: Palette = {
  id: "default",
  name: "Brillo & Co Default",
  colors: ["#F5F0E8", "#1C1917", "#B8956A", "#E8E2D8", "#78716C"],
  mode: "light",
  createdAt: Date.now(),
};

const PALETTE_ROLES = ["background", "text", "accent", "surface", "muted"] as const;
export type PaletteRole = typeof PALETTE_ROLES[number];

export function getPaletteColor(palette: Palette, role: PaletteRole): string {
  const index = PALETTE_ROLES.indexOf(role);
  return palette.colors[index];
}

const STORAGE_KEY = "celestique-palettes";
const ACTIVE_KEY = "celestique-active-palette";

function loadPalettes(): Palette[] {
  if (typeof window === "undefined") return [DEFAULT_PALETTE];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_PALETTE];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_PALETTE];
  } catch {
    return [DEFAULT_PALETTE];
  }
}

function loadActivePalette(palettes: Palette[]): Palette {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (!id) return palettes[0];
    return palettes.find((p) => p.id === id) || palettes[0];
  } catch {
    return palettes[0];
  }
}

const PaletteContext = createContext<PaletteContextType | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palettes, setPalettes] = useState<Palette[]>([DEFAULT_PALETTE]);
  const [activePalette, setActivePalette] = useState<Palette>(DEFAULT_PALETTE);
  const [previewPalette, setPreviewPalette] = useState<Palette | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadPalettes();
    setPalettes(p);
    setActivePalette(loadActivePalette(p));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    }
  }, [palettes, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(ACTIVE_KEY, activePalette.id);
    }
  }, [activePalette, loaded]);

  const savePalette = useCallback((name: string, colors: [string, string, string, string, string], mode: "light" | "dark" = "light") => {
    const newPalette: Palette = {
      id: `palette-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      colors,
      mode,
      createdAt: Date.now(),
    };
    setPalettes((prev) => [newPalette, ...prev]);
  }, []);

  const deletePalette = useCallback((id: string) => {
    if (id === "default") return;
    setPalettes((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next.length > 0 ? next : [DEFAULT_PALETTE];
    });
    setActivePalette((prev) => (prev.id === id ? DEFAULT_PALETTE : prev));
  }, []);

  const activatePalette = useCallback((id: string) => {
    const found = palettes.find((p) => p.id === id);
    if (found) setActivePalette(found);
  }, [palettes]);

  const searchPalettes = useCallback((query: string): Palette[] => {
    if (!query.trim()) return palettes;
    const lower = query.toLowerCase();
    return palettes.filter((p) => p.name.toLowerCase().includes(lower));
  }, [palettes]);

  if (!loaded) return null;

  return (
    <PaletteContext.Provider
      value={{
        palettes,
        activePalette,
        previewPalette,
        setPreviewPalette,
        savePalette,
        deletePalette,
        activatePalette,
        searchPalettes,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
}

export { PALETTE_ROLES };
