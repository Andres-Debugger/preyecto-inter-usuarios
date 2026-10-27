"use client";

import { useEffect, useState } from "react";
import {
  isPageLoaderEnabled,
  setPageLoaderEnabled,
} from "@/utils/loaderPreference";

export default function LoaderToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const current = isPageLoaderEnabled();
    setEnabled(current);
    document.documentElement.dataset.pageLoader = current ? "on" : "off";
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setPageLoaderEnabled(next);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p
          className="text-[10px] tracking-[0.15em] uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          Page loader
        </p>
        <p
          className="text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--color-text)" }}
        >
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Page loader"
        onClick={toggle}
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{
          backgroundColor: enabled
            ? "var(--color-accent)"
            : "color-mix(in srgb, var(--color-muted) 40%, transparent)",
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ left: enabled ? "22px" : "2px" }}
        />
      </button>
    </div>
  );
}
