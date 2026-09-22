"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { TangramConfig, TangramPieceConfig } from "@/types/tangram";
import { DEFAULT_CONFIG } from "@/types/tangram";

interface TangramContextType {
  config: TangramConfig;
  updatePiece: (id: number, updates: Partial<TangramPieceConfig>) => void;
  togglePiece: (id: number) => void;
  resetConfig: () => void;
  resetPiece: (id: number) => void;
}

const STORAGE_KEY = "celestique-tangram-config";

function loadConfig(): TangramConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.pieces) && parsed.pieces.length === 7) return parsed;
    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

const TangramContext = createContext<TangramContextType | null>(null);

export function TangramProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TangramConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setConfig(loadConfig());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, loaded]);

  const updatePiece = useCallback((id: number, updates: Partial<TangramPieceConfig>) => {
    setConfig((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const togglePiece = useCallback((id: number) => {
    setConfig((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)),
    }));
  }, []);

  const resetPiece = useCallback((id: number) => {
    const original = DEFAULT_CONFIG.pieces.find((p) => p.id === id);
    if (!original) return;
    setConfig((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...original } : p)),
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  if (!loaded) return null;

  return (
    <TangramContext.Provider
      value={{ config, updatePiece, togglePiece, resetConfig, resetPiece }}
    >
      {children}
    </TangramContext.Provider>
  );
}

export function useTangram() {
  const ctx = useContext(TangramContext);
  if (!ctx) throw new Error("useTangram must be used within TangramProvider");
  return ctx;
}
