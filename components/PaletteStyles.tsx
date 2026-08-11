"use client";

import { usePalette, getPaletteColor } from "@/context/PaletteContext";
import { useEffect, useState } from "react";

export default function PaletteStyles() {
  const { activePalette, previewPalette } = usePalette();
  const palette = previewPalette || activePalette;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const bg = dark ? "#1A1A1A" : getPaletteColor(palette, "background");
  const text = dark ? "#F0EBE1" : getPaletteColor(palette, "text");
  const accent = dark ? "#D4AF37" : getPaletteColor(palette, "accent");
  const surface = dark ? "#2A2A2A" : getPaletteColor(palette, "surface");
  const muted = dark ? "#888888" : getPaletteColor(palette, "muted");

  return (
    <style>{`
      :root {
        --color-bg: ${bg};
        --color-text: ${text};
        --color-accent: ${accent};
        --color-surface: ${surface};
        --color-muted: ${muted};
      }
      body {
        background-color: var(--color-bg);
        color: var(--color-text);
      }
    `}</style>
  );
}
