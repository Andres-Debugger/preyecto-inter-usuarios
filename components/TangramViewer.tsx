"use client";

import { useState, useEffect, useCallback } from "react";
import { TANGRAM_FIGURES } from "@/utils/tangrams";

const PIECE_DELAY = 500;       // ms between each piece appearing
const FIGURE_PAUSE = 2000;     // ms pause after figure is complete
const TRANSITION_FADE = 800;   // ms for fade transition between figures

export default function TangramViewer() {
  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);
  const [visiblePieces, setVisiblePieces] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentFigure = TANGRAM_FIGURES[currentFigureIndex];
  const totalPieces = currentFigure.pieces.length;

  const goToNextFigure = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentFigureIndex((prev) => (prev + 1) % TANGRAM_FIGURES.length);
      setVisiblePieces(0);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, TRANSITION_FADE);
  }, []);

  // Main animation loop
  useEffect(() => {
    if (isTransitioning) return;

    if (visiblePieces < totalPieces) {
      // Show next piece after delay
      const timer = setTimeout(() => {
        setVisiblePieces((prev) => prev + 1);
      }, PIECE_DELAY);

      return () => clearTimeout(timer);
    } else {
      // Figure complete - pause then go to next
      const timer = setTimeout(() => {
        goToNextFigure();
      }, FIGURE_PAUSE);

      return () => clearTimeout(timer);
    }
  }, [visiblePieces, totalPieces, isTransitioning, goToNextFigure]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 w-full"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      {/* Figure number */}
      <div
        className="text-[clamp(4rem,15vw,10rem)] font-bold leading-none select-none transition-opacity duration-500"
        style={{
          color: "var(--color-bg)",
          opacity: 0.15,
          fontFamily: "var(--font-title)",
          position: "absolute",
          top: "15%",
          right: "10%",
        }}
      >
        {currentFigure.id}
      </div>

      {/* Tangram container */}
      <div
        className="relative w-[min(80vw,400px)] h-[min(80vw,400px)] transition-opacity duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          backgroundColor: "color-mix(in srgb, var(--color-bg) 10%, transparent)",
        }}
      >
        {currentFigure.pieces.map((piece, index) => (
          <div
            key={`${currentFigure.id}-${piece.id}`}
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{
              clipPath: piece.clipPath,
              backgroundColor: piece.color,
              opacity: index < visiblePieces ? 1 : 0,
              transform: index < visiblePieces ? "scale(1)" : "scale(0.8)",
            }}
          />
        ))}
      </div>

      {/* Figure info */}
      <div className="text-center">
        <p
          className="text-sm tracking-[0.2em] uppercase mb-1 transition-opacity duration-500"
          style={{ color: "var(--color-bg)", opacity: 0.5 }}
        >
          Figure {currentFigureIndex + 1} of {TANGRAM_FIGURES.length}
        </p>
        <p
          className="text-lg font-semibold transition-opacity duration-500"
          style={{ color: "var(--color-bg)", fontFamily: "var(--font-title)" }}
        >
          {currentFigure.name}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {TANGRAM_FIGURES.map((fig, i) => (
          <button
            key={fig.id}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentFigureIndex(i);
                setVisiblePieces(0);
                setTimeout(() => setIsTransitioning(false), 50);
              }, TRANSITION_FADE);
            }}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === currentFigureIndex
                  ? "var(--color-bg)"
                  : "color-mix(in srgb, var(--color-bg) 25%, transparent)",
            }}
            aria-label={`Go to figure ${fig.name}`}
          />
        ))}
      </div>
    </div>
  );
}
