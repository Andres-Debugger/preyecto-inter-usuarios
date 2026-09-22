"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TangramConfig from "@/components/TangramConfig";

export default function TangramsPage() {
  return (
    <>
      <Header />
      <main
        className="min-h-screen pt-24 pb-16"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-title)" }}
          >
            Tangram Configuration
          </h1>
          <p className="text-sm mb-12" style={{ color: "var(--color-muted)" }}>
            Customize each of the 7 tangram pieces: visibility, dimensions, and shape.
          </p>
          <TangramConfig />
        </div>
      </main>
      <Footer />
    </>
  );
}
