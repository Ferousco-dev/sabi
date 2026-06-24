import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { CoreFeatures } from "./components/CoreFeatures";
import { PersonaCards } from "./components/PersonaCards";
import { Roadmap } from "./components/Roadmap";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <CoreFeatures />
      <PersonaCards />
      <Roadmap />
      <CTA />
      <Footer />
    </main>
  );
}
