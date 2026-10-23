"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoAdmin from "@/components/VideoAdmin";
import GalleryAdmin from "@/components/GalleryAdmin";

type AdminTab = "video" | "gallery";

const TABS: { key: AdminTab; label: string }[] = [
  { key: "video", label: "Video" },
  { key: "gallery", label: "Gallery" },
];

const TAB_COPY: Record<AdminTab, { title: string; subtitle: string }> = {
  video: {
    title: "Video Manager",
    subtitle: "Upload films for the home banner: video, poster, subtitles and audio tracks.",
  },
  gallery: {
    title: "Gallery Manager",
    subtitle: "Manage the photo carousel: upload images, crop them to 4:5 and drag to reorder.",
  },
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("video");
  const copy = TAB_COPY[tab];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h1
            className="text-[clamp(2rem,4vw,3.5rem)] mb-2"
            style={{ fontFamily: "var(--font-title)", color: "var(--color-text)" }}
          >
            Content Manager
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
            Configure the home page films and gallery photos.
          </p>

          <div className="flex items-center gap-6 mb-10 border-b" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="text-xs tracking-[0.2em] uppercase pb-3 -mb-px border-b-2 transition-colors"
                  style={{
                    color: isActive ? "var(--color-text)" : "var(--color-muted)",
                    borderColor: isActive ? "var(--color-accent)" : "transparent",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <h2
            className="text-lg font-semibold mb-1"
            style={{ color: "var(--color-text)" }}
          >
            {copy.title}
          </h2>
          <p className="text-sm mb-12" style={{ color: "var(--color-muted)" }}>
            {copy.subtitle}
          </p>

          {tab === "video" ? <VideoAdmin /> : <GalleryAdmin />}
        </div>
      </main>
      <Footer />
    </>
  );
}
