"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTangram } from "@/context/TangramContext";
import { usePalette } from "@/context/PaletteContext";

const MORPH_MS = 3000;
const HOLD_MS = 6000;

const SVG_W = 400;
const SVG_H = 200;

interface TangramViewerProps {
  /** When true, auto-cycles through figures (for loader use) */
  autoPlay?: boolean;
  /** Callback when a full cycle completes (for loader use) */
  onCycleComplete?: () => void;
}

export default function TangramViewer({ autoPlay = false, onCycleComplete }: TangramViewerProps) {
  const { config } = useTangram();
  const { activePalette } = usePalette();
  const [figIdx, setFigIdx] = useState(0);
  const [isHolding, setIsHolding] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { pieces, figures } = config;
  const figure = figures[figIdx];

  const goNext = useCallback(() => {
    setFigIdx((p) => {
      const next = (p + 1) % figures.length;
      if (next === 0 && onCycleComplete) {
        setTimeout(() => onCycleComplete(), 0);
      }
      return next;
    });
    setIsHolding(false);
    setTimeout(() => setIsHolding(true), MORPH_MS);
  }, [figures.length, onCycleComplete]);

  useEffect(() => {
    if (!isHolding || !autoPlay) return;
    const t = setTimeout(goNext, HOLD_MS);
    return () => clearTimeout(t);
  }, [isHolding, goNext, autoPlay]);

  useEffect(() => {
    const updateScale = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const sx = rect.width / SVG_W;
      const sy = rect.height / SVG_H;
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
    <div
      className="flex flex-col items-center justify-center gap-8 w-full"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      {!autoPlay && (
        <div
          className="select-none absolute pointer-events-none"
          style={{
            color: colors[0],
            opacity: 0.12,
            fontFamily: "var(--font-title)",
            fontSize: "clamp(4rem, 15vw, 10rem)",
            fontWeight: 700,
            lineHeight: 1,
            top: "15%",
            right: "10%",
          }}
        >
          {figure.id}
        </div>
      )}

      <div
        ref={wrapperRef}
        className="relative w-full"
        style={{ maxWidth: "min(80vw, 600px)", aspectRatio: "2 / 1" }}
      >
        <div
          style={{
            position: "absolute",
            width: SVG_W,
            height: SVG_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {pieces.map((piece, i) => {
            if (!piece.visible) return null;
            const pos = figure.place[i];
            if (!pos) return null;

            return (
              <div
                key={piece.id}
                style={{
                  position: "absolute",
                  width: piece.w,
                  height: piece.h,
                  left: pos[0],
                  top: pos[1],
                  clipPath: piece.clipPath,
                  backgroundColor: colors[i],
                  transition: `left ${MORPH_MS}ms ease-in-out, top ${MORPH_MS}ms ease-in-out, background-color ${MORPH_MS}ms ease-in-out`,
                }}
              />
            );
          })}
        </div>
      </div>

      {!autoPlay && (
        <>
          <div className="text-center">
            <p
              className="text-sm tracking-[0.2em] uppercase mb-1"
              style={{ color: colors[1], opacity: 0.5 }}
            >
              Figure {figIdx + 1} of {figures.length}
            </p>
            <p
              className="text-lg font-semibold"
              style={{ color: colors[1], fontFamily: "var(--font-title)" }}
            >
              {figure.name}
            </p>
          </div>

          <div className="flex gap-2">
            {figures.map((fig, i) => (
              <button
                key={fig.id}
                onClick={() => {
                  setFigIdx(i);
                  setIsHolding(false);
                  setTimeout(() => setIsHolding(true), MORPH_MS);
                }}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i === figIdx ? colors[1] : `${colors[1]}40`,
                }}
                aria-label={`Go to figure ${fig.name}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
