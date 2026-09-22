"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TangramViewer from "@/components/TangramViewer";
import { usePalette } from "@/context/PaletteContext";

const MIN_VISIBLE_MS = 6500;
const FADE_MS = 500;

export default function PageTransition() {
  const pathname = usePathname();
  const { activePalette } = usePalette();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setVisible(true);
    setFading(false);

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setFading(true);
      hideTimer = setTimeout(() => setVisible(false), FADE_MS);
    }, MIN_VISIBLE_MS);

    return () => {
      clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

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
        <TangramViewer autoPlay />
      </div>
    </div>
  );
}