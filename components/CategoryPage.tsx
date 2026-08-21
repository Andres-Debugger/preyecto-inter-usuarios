"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface CategoryPageProps {
  title: string;
  subtitle: string;
  heroImage: string;
  products: Product[];
}

export default function CategoryPage({ title, subtitle, heroImage, products }: CategoryPageProps) {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: "var(--color-bg)" }}>
        {/* Hero */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-end">
          <div className="absolute inset-0">
            <Image src={heroImage} alt={title} fill className="object-cover object-center" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, var(--color-bg), transparent)` }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pb-12 md:pb-16 w-full">
            <FadeIn>
              <p className="tracking-[0.25em] uppercase mb-3" style={{ fontSize: "var(--size-paragraph)", color: "var(--color-muted)" }}>{subtitle}</p>
              <h1 className="font-serif leading-[0.9]" style={{ fontSize: "var(--size-title)", color: "var(--color-text)" }}>{title}</h1>
            </FadeIn>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={i * 80}>
                  <div className="product-card group">
                    <div className="product-card-image aspect-square relative overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
                      <Image src={product.image} alt={product.name} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                    <div className="pt-4 pb-2">
                      <h3 className="product-name mb-1">{product.name}</h3>
                      <p className="mb-1.5 font-sans" style={{ fontSize: "var(--size-paragraph)", color: "var(--color-muted)" }}>{product.description}</p>
                      <p className="font-medium font-sans" style={{ fontSize: "var(--size-subtitle)", color: "var(--color-text)" }}>{product.price}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
