"use client";

import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { useCVC } from "@/context/CVCContext";
import CVCForm from "./CVCForm";
import CVCPreview from "./CVCPreview";

export default function CVCBuilder() {
  const { cvData, draftData } = useCVC();
  const cvRef = useRef<HTMLDivElement>(null);

  const currentData = draftData || cvData;

  const downloadPDF = async () => {
    const element = cvRef.current;
    if (!element) return;

    element.style.transform = "scale(1)";
    element.style.transformOrigin = "top center";

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
    <div
      className="cvc-builder"
      style={{
        display: "flex",
        width: "100%",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <CVCForm onDownloadPDF={downloadPDF} />
      <div
        className="preview-section"
        style={{
          flex: 1,
          backgroundColor: "var(--color-bg)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflowY: "auto",
          padding: "2rem",
        }}
      >
        <CVCPreview cvData={currentData} ref={cvRef} />
      </div>
    </div>
  );
}