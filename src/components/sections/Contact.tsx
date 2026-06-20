import { TraceSegment } from "@/components/Trace";
import Reveal from "@/components/ui/Reveal";
import BriefForm from "./BriefForm";
import { site, ctaSection, contactSection } from "@/lib/content";

/** CTA + форма брифа + контакты. Магистраль приходит сюда оранжевой, ведёт в кнопку. */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-[var(--header-h)] py-24 md:py-36"
    >
      <TraceSegment enterX={8} exitX={8} thickness={3} tone="accent" index="06" label="Контакт" />

      <div className="shell relative z-10 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal className="tech-label mb-6 flex items-center gap-3">
            <span className="text-accent-soft">06</span>
            <span className="h-px w-8 bg-line" />
            {contactSection.eyebrow}
          </Reveal>
          <Reveal as="div">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.02em]">
              {ctaSection.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 max-w-md text-base leading-relaxed text-muted">
            {contactSection.text}
          </Reveal>

          <div className="mt-12 space-y-6">
            <a
              href={`mailto:${site.email}`}
              data-cursor="focus"
              className="block font-display text-2xl transition-colors hover:text-accent-soft"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone}`}
              className="block font-mono text-lg text-muted transition-colors hover:text-fg"
            >
              {site.phoneDisplay}
            </a>
            <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.14em]">
              <a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-accent-soft">
                Telegram ↗
              </a>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-accent-soft">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <Reveal as="div" className="border border-line bg-bg-elevated p-6 md:p-10">
            <BriefForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
