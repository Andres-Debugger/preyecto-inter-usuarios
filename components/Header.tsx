"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Rings", href: "/rings" },
    { label: "Earrings", href: "/earrings" },
    { label: "Necklaces", href: "/necklaces" },
    { label: "Bracelets", href: "/bracelets" },
    { label: "About", href: "/#about" },
    { label: "Settings", href: "/settings" },
  ];

  const textColor = scrolled ? "var(--color-text)" : "white";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 transition-all duration-500"
        style={{
          zIndex: 70,
          backgroundColor: scrolled ? "color-mix(in srgb, var(--color-bg) 95%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.05)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:opacity-70"
            style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: textColor }}
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="0" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                MENU
              </>
            )}
          </button>

          <div className="flex items-center gap-4">
            {!menuOpen && (
              <>
                <ThemeToggle />
                <button className="transition-colors duration-300 hover:opacity-70" style={{ color: textColor }} aria-label="Carrito">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>
                <button className="transition-colors duration-300 hover:opacity-70" style={{ color: textColor }} aria-label="Cuenta">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-500"
        style={{
          zIndex: 60,
          backgroundColor: "var(--color-bg)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegacion"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="tracking-[0.15em] transition-all duration-300 hover:opacity-60"
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "var(--size-title)",
                  color: isActive ? "var(--color-accent)" : "var(--color-text)",
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
