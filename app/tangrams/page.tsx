"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TangramViewer from "@/components/TangramViewer";

export default function TangramsPage() {
  return (
    <>
      <Header />
      <main
        className="min-h-screen pt-24 pb-16 flex items-center justify-center"
        style={{ backgroundColor: "var(--color-text)" }}
      >
        <div className="w-full max-w-5xl mx-auto px-8 md:px-16">
          <TangramViewer />
        </div>
      </main>
      <Footer />
    </>
  );
}
