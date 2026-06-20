import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import TechStack from "@/components/sections/TechStack";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import { JsonLd } from "@/lib/seo";
import { faq } from "@/lib/content";

function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Work />
      <Process />
      <TechStack />
      <Faq />
      <Contact />
    </>
  );
}
