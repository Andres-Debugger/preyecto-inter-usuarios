"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTangram } from "@/context/TangramContext";
import { usePalette } from "@/context/PaletteContext";

const HOLD_MS = 2500;
const MORPH_MS = 1200;

const CANVAS_W = 400;
const CANVAS_H = 400;

interface TangramViewerProps {
  autoPlay?: boolean;
}

export default function TangramViewer({ autoPlay = false }: TangramViewerProps) {
  const { config } = useTangram();
  const { activePalette } = usePalette();
  const [figIdx, setFigIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { pieces, figures } = config;
  const figure = figures[figIdx];

  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => {
      setFigIdx((p) => (p + 1) % figures.length);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [autoPlay, figIdx, figures.length]);

  useEffect(() => {
    const updateScale = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const sx = rect.width / CANVAS_W;
      const sy = rect.height / CANVAS_H;
      setScale(Math.min(sx, sy));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const colors = useMemo(() => {
    const c = activePalette.colors;
    return [c[0], c[1], c[2], c[3], c[4], c[0], c[1]];
  }, [activePalette.colors]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full" style={{ minHeight: autoPlay ? "100vh" : "calc(100vh - 200px)" }}>
      {!autoPlay && (
        <div className="select-none absolute pointer-events-none" style={{ color: colors[0], opacity: 0.12, fontFamily: "var(--font-title)", fontSize: "clamp(4rem, 15vw, 10rem)", fontWeight: 700, lineHeight: 1, top: "15%", right: "10%" }}>
          {figure.id}
        </div>
      )}

      <div ref={wrapperRef} className="relative w-full" style={{ maxWidth: autoPlay ? "min(70vw, 500px)" : "min(80vw, 600px)", aspectRatio: "1 / 1" }}>
        <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {pieces.map((piece, i) => {
            if (!piece.visible) return null;
            const pos = figure.place[i];
            if (!pos) return null;

            const [left, top, rotate] = pos;
            const size = figure.sizes?.[i];
            const w = size ? size[0] : piece.w;
            const h = size ? size[1] : piece.h;

            return (
              <div
                key={piece.id}
                style={{
                  position: "absolute",
                  width: w,
                  height: h,
                  left,
                  top,
                  clipPath: piece.clipPath,
                  backgroundColor: colors[i],
                  transform: `rotate(${rotate}deg)`,
                  transformOrigin: "center center",
                  transition: `left ${MORPH_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1), top ${MORPH_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1), transform ${MORPH_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1), width ${MORPH_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1), height ${MORPH_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {!autoPlay && (
        <>
          <div className="text-center">
            <p className="text-sm tracking-[0.2em] uppercase mb-1" style={{ color: colors[1], opacity: 0.5 }}>
              Figure {figIdx + 1} of {figures.length}
            </p>
            <p className="text-lg font-semibold" style={{ color: colors[1], fontFamily: "var(--font-title)" }}>
              {figure.name}
            </p>
          </div>

          <div className="flex gap-2">
            {figures.map((fig, i) => (
              <button
                key={fig.id}
                onClick={() => setFigIdx(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: i === figIdx ? colors[1] : `${colors[1]}40` }}
                aria-label={`Go to figure ${fig.name}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}