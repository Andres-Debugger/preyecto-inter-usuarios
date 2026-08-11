"use client";

import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <FadeIn>
          <h2 className="section-title-editorial mb-12 md:mb-20">
            ABOUT<br />US
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <FadeIn delay={100}>
            <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
              <Image
                src="https://images.unsplash.com/photo-1673131158657-4404fd1f041a?q=80&w=1074&auto=format&fit=crop"
                alt="Woman wearing gold jewelry"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          <FadeIn delay={200} className="flex flex-col gap-7 pt-0 md:pt-8">
            <p className="leading-[1.8]" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
              At Brillo &amp; Co, we believe that jewelry is more than just an
              accessory, it&apos;s a timeless expression of elegance and a
              connection to life&apos;s most treasured moments. With a legacy
              spanning over decades, our brand has become synonymous with
              exceptional craftsmanship and sophistication.
            </p>

            <p className="leading-[1.9]" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>
              We carefully select the finest materials—precious metals,
              sparkling gemstones, and luminous pearls—to create each piece with
              precision and passion. Our skilled artisans ensure that every item
              is not only beautiful but built to last.
            </p>

            <p className="leading-[1.9]" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>
              Our commitment to excellence is reflected in every detail, from the
              design process to the final product. At Brillo &amp; Co, we are dedicated
              to creating jewelry that transcends trends and becomes a cherished
              heirloom for generations.
            </p>

            <p className="leading-[1.9]" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>
              Whether you&apos;re celebrating love, marking a special occasion, or
              simply treating yourself, we invite you to explore our collections
              and experience the celestial elegance that defines us.
            </p>

            <div className="pt-4">
              <a href="#more" className="btn-outline">
                MORE ABOUT US
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
