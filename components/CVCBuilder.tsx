"use client";

import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faTimes, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useCVC } from "@/context/CVCContext";
import CVCForm from "./CVCForm";
import CVCPreview from "./CVCPreview";
import {
  CV_BUILDER_STEPS,
  calculateStepTime,
  calculateTotalTime,
  getTotals,
  formatTime,
  downloadKLMReport,
} from "@/utils/klm";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function CVCBuilder() {
  const { cvData, draftData } = useCVC();
  const cvRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [showKLM, setShowKLM] = useState(false);

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
      filename: "Alejandro_Torres_CV.pdf",
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

  const klmTotal = calculateTotalTime(CV_BUILDER_STEPS);
  const klmTotals = getTotals(CV_BUILDER_STEPS);

  return (
    <>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKLM(true)}
                    className="text-xs px-2.5 py-1.5 border rounded hover:opacity-80 transition-opacity flex items-center gap-1.5"
                    style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  >
                    <FontAwesomeIcon icon={faCalculator} />
                    KLM
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="text-xs px-2.5 py-1.5 border rounded hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  >
                    Download PDF
                  </button>
                </div>
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

      {/* KLM Modal */}
      {showKLM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-[900px] w-full mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">GOMS KLM Analysis</h3>
                <p className="text-xs text-gray-500 mt-0.5">Curriculum: Alejandro Torres - Programador web</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadKLMReport(CV_BUILDER_STEPS)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Descargar Excel
                </button>
                <button
                  onClick={() => setShowKLM(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* KLM Reference Table */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-[var(--color-text)]">Keystroke Level Model - Operadores</h4>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 border font-medium">Operador</th>
                      <th className="text-left p-2 border font-medium">Acción</th>
                      <th className="text-right p-2 border font-medium">Tiempo (seg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border font-medium">K</td><td className="p-2 border">Presionar una tecla</td><td className="p-2 border text-right">0.2</td></tr>
                    <tr><td className="p-2 border font-medium">P</td><td className="p-2 border">Señalar o apuntar con un dispositivo de entrada</td><td className="p-2 border text-right">1.1</td></tr>
                    <tr><td className="p-2 border font-medium">H</td><td className="p-2 border">Mover la mano de un dispositivo de entrada a otro</td><td className="p-2 border text-right">0.4</td></tr>
                    <tr><td className="p-2 border font-medium">M</td><td className="p-2 border">Pensar en qué hacer a continuación</td><td className="p-2 border text-right">1.2</td></tr>
                    <tr><td className="p-2 border font-medium">B</td><td className="p-2 border">Presionar Mouse</td><td className="p-2 border text-right">0.1</td></tr>
                    <tr><td className="p-2 border font-medium">Date-Picker</td><td className="p-2 border">Entrada fecha tipo Date-Picker</td><td className="p-2 border text-right">6.81</td></tr>
                    <tr><td className="p-2 border font-medium">Scrolling</td><td className="p-2 border">Mover scroll</td><td className="p-2 border text-right">3.96</td></tr>
                    <tr><td className="p-2 border font-medium">D</td><td className="p-2 border">Dibujar</td><td className="p-2 border text-right">1.2</td></tr>
                    <tr><td className="p-2 border font-medium">R</td><td className="p-2 border">Tiempo de Respuesta del Sistema</td><td className="p-2 border text-right">t</td></tr>
                  </tbody>
                </table>
              </div>

              {/* CV KLM Steps Table */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-[var(--color-text)]">Cálculo KLM - Creación del Curriculum</h4>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 border font-medium">Operador</th>
                      <th className="text-left p-2 border font-medium">Dato</th>
                      <th className="text-center p-2 border font-medium">K</th>
                      <th className="text-center p-2 border font-medium">P</th>
                      <th className="text-center p-2 border font-medium">H</th>
                      <th className="text-center p-2 border font-medium">M</th>
                      <th className="text-center p-2 border font-medium">B</th>
                      <th className="text-right p-2 border font-medium">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CV_BUILDER_STEPS.map((step) => (
                      <tr key={step.step} className="hover:bg-gray-50">
                        <td className="p-2 border">{step.action}</td>
                        <td className="p-2 border text-gray-500">{step.data}</td>
                        <td className="p-2 border text-center">{step.K || "-"}</td>
                        <td className="p-2 border text-center">{step.P || "-"}</td>
                        <td className="p-2 border text-center">{step.H || "-"}</td>
                        <td className="p-2 border text-center">{step.M || "-"}</td>
                        <td className="p-2 border text-center">{step.B || "-"}</td>
                        <td className="p-2 border text-right font-medium">{calculateStepTime(step).toFixed(1)}s</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="p-2 border" colSpan={2}>TOTAL</td>
                      <td className="p-2 border text-center">{klmTotals.K}</td>
                      <td className="p-2 border text-center">{klmTotals.P}</td>
                      <td className="p-2 border text-center">{klmTotals.H}</td>
                      <td className="p-2 border text-center">{klmTotals.M}</td>
                      <td className="p-2 border text-center">{klmTotals.B}</td>
                      <td className="p-2 border text-right">{formatTime(klmTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2 text-[var(--color-text)]">Resumen</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Keystrokes (K)</span>
                    <p className="font-semibold text-[var(--color-text)]">{klmTotals.K} × 0.2s = {(klmTotals.K * 0.2).toFixed(1)}s</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Pointing (P)</span>
                    <p className="font-semibold text-[var(--color-text)]">{klmTotals.P} × 1.1s = {(klmTotals.P * 1.1).toFixed(1)}s</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Homing (H)</span>
                    <p className="font-semibold text-[var(--color-text)]">{klmTotals.H} × 0.4s = {(klmTotals.H * 0.4).toFixed(1)}s</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Mental (M)</span>
                    <p className="font-semibold text-[var(--color-text)]">{klmTotals.M} × 1.2s = {(klmTotals.M * 1.2).toFixed(1)}s</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Mouse (B)</span>
                    <p className="font-semibold text-[var(--color-text)]">{klmTotals.B} × 0.1s = {(klmTotals.B * 0.1).toFixed(1)}s</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    Tiempo Total Estimado: {formatTime(klmTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
