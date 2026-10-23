import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import GalleryCarousel from "@/components/GalleryCarousel";
import About from "@/components/About";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VideoShowcase />
        <GalleryCarousel />
        <About />
        <Categories />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}
