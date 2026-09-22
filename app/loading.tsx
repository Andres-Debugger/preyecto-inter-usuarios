"use client";

import { useState, useEffect, useCallback } from "react";
import TangramViewer from "@/components/TangramViewer";
import { usePalette } from "@/context/PaletteContext";

const MIN_VISIBLE_MS = 18000;
const FADE_MS = 800;

export default function Loading() {
  const { activePalette } = usePalette();
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [startTime] = useState(() => Date.now());

  const handleCycleComplete = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    setTimeout(() => {
      setFading(true);
      setTimeout(() => setHidden(true), FADE_MS);
    }, remaining);
  }, [startTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setHidden(true), FADE_MS);
    }, MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: activePalette.mode === "dark" ? "#1C1917" : "#F5F0E8",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div className="w-full max-w-xl px-8">
        <TangramViewer autoPlay onCycleComplete={handleCycleComplete} />
      </div>
    </div>
  );
}
