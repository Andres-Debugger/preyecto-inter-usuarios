"use client";

import Link from "next/link";

const footerLinks = {
  shop: ["Rings", "Earrings", "Necklaces", "Bracelets"],
  company: ["Our Story", "Materials", "Sustainability", "Shipping & Returns", "Contact Us"],
  legal: ["Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-20">
        {/* Top: Brand + Social */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
          <Link href="/" className="text-3xl md:text-4xl tracking-[0.12em] select-none" style={{ fontFamily: "var(--font-title)", color: "var(--color-bg)" }}>
            B<span className="relative inline-block">R<span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">✦</span></span>ILLO &amp; C<span className="relative inline-block">O<span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">✦</span></span>
          </Link>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors duration-300 hover:opacity-70" style={{ color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" className="transition-colors duration-300 hover:opacity-70" style={{ color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }} aria-label="Pinterest">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 21c1-3 2-6 2.5-8.5.5-2.5-.5-4 1-5.5s4-.5 4 1.5c0 3-2 5-2 5s1 3-.5 4.5" />
              </svg>
            </a>
            <a href="#" className="transition-colors duration-300 hover:opacity-70" style={{ color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }} aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <ul className="flex flex-col gap-3">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70"
                    style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/[\s&]+/g, "-")}`}
                    className="text-xs tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70"
                    style={{ color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70"
                    style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t pt-8" style={{ borderColor: "color-mix(in srgb, var(--color-bg) 10%, transparent)" }}>
          <p className="text-center tracking-wide" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "color-mix(in srgb, var(--color-bg) 40%, transparent)" }}>
            &copy; 2025 Brillo &amp; Co Jewelry. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
