"use client";

import { usePalette, getPaletteColor } from "@/context/PaletteContext";
import { useTypography } from "@/context/TypographyContext";
import { useEffect, useState } from "react";

export default function PaletteStyles() {
  const { activePalette, previewPalette } = usePalette();
  const { config } = useTypography();
  const palette = previewPalette || activePalette;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isDarkMode = palette.mode === "dark" || dark;

  const bg = isDarkMode ? "#1A1A1A" : getPaletteColor(palette, "background");
  const text = isDarkMode ? "#F0EBE1" : getPaletteColor(palette, "text");
  const accent = isDarkMode ? "#D4AF37" : getPaletteColor(palette, "accent");
  const surface = isDarkMode ? "#2A2A2A" : getPaletteColor(palette, "surface");
  const muted = isDarkMode ? "#888888" : getPaletteColor(palette, "muted");

  const titleFontFace = config.titleFontData
    ? `@font-face { font-family: 'CustomTitle'; src: url(${config.titleFontData}) format('truetype'); font-weight: normal; font-style: normal; }`
    : "";
  const bodyFontFace = config.bodyFontData
    ? `@font-face { font-family: 'CustomBody'; src: url(${config.bodyFontData}) format('truetype'); font-weight: normal; font-style: normal; }`
    : "";

  const titleFont = config.titleFontData ? "'CustomTitle', serif" : "var(--font-serif)";
  const bodyFont = config.bodyFontData ? "'CustomBody', sans-serif" : "var(--font-sans)";

  return (
    <style>{`
      ${titleFontFace}
      ${bodyFontFace}
      :root {
        --color-bg: ${bg};
        --color-text: ${text};
        --color-accent: ${accent};
        --color-surface: ${surface};
        --color-muted: ${muted};
        --font-title: ${titleFont};
        --font-body: ${bodyFont};
        --size-title: ${config.titleSize}px;
        --size-subtitle: ${config.subtitleSize}px;
        --size-paragraph: ${config.paragraphSize}px;
      }
      body {
        background-color: var(--color-bg);
        color: var(--color-text);
      }
    `}</style>
  );
}
