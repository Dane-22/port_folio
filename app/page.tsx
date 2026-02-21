import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HorizontalScroll />
      <Footer />
    </main>
  );
}
