import { SiteNav } from "./components/site/SiteNav";
import { Hero } from "./components/site/Hero";
import { LogoCloud } from "./components/site/LogoCloud";
import { About } from "./components/site/About";
import { Platforms } from "./components/site/Platforms";
import { Features } from "./components/site/Features";
import { HowItWorks } from "./components/site/HowItWorks";
import { FAQ } from "./components/site/FAQ";
import { CTASection } from "./components/site/CTASection";
import { SiteFooter } from "./components/site/SiteFooter";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <LogoCloud />
      <About />
      <Platforms />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTASection />
      <SiteFooter />
    </main>
  );
}
