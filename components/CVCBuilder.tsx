"use client";

import { useRef, useState, useEffect } from "react";
import { useCVC } from "@/context/CVCContext";
import CVCForm from "./CVCForm";
import CVCPreview from "./CVCPreview";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function CVCBuilder() {
  const { cvData, draftData } = useCVC();
  const cvRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const currentData = draftData || cvData;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min((containerWidth - 32) / A4_WIDTH, 0.55);
        setScale(Math.max(newScale, 0.2));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const downloadPDF = async () => {
    const element = cvRef.current;
    if (!element || typeof window === "undefined") return;

    const html2pdf = (await import("html2pdf.js")).default;

    element.style.transform = "scale(1)";
    element.style.transformOrigin = "top left";

    const opt = {
      margin: 0,
      filename: "Mi_Curriculum.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      element.style.transform = "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CVCForm onDownloadPDF={downloadPDF} />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24" ref={containerRef}>
          <div
            className="border p-4 rounded-lg bg-white"
            style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                CV Preview
              </h3>
              <button
                onClick={downloadPDF}
                className="text-xs px-3 py-1.5 border rounded hover:opacity-80 transition-opacity"
                style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
              >
                Download PDF
              </button>
            </div>

            <div
              className="rounded border overflow-hidden"
              style={{ borderColor: "color-mix(in srgb, var(--color-muted) 20%, transparent)" }}
            >
              <div
                style={{
                  width: `${A4_WIDTH * scale}px`,
                  height: `${A4_HEIGHT * scale}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: `${A4_WIDTH}px`,
                  }}
                >
                  <CVCPreview cvData={currentData} ref={cvRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
