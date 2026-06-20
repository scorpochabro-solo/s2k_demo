import { TraceSegment } from "@/components/Trace";
import Reveal from "@/components/ui/Reveal";
import { techSection, techStack, clients, clientsSection } from "@/lib/content";

/** Технологии (marquee реальных техов) + строка доверия (имена клиентов, без логотипов). */
export default function TechStack() {
  const row = [...techStack, ...techStack];
  return (
    <section className="relative border-y border-line bg-bg-elevated py-24 md:py-32">
      <TraceSegment enterX={16} exitX={8} thickness={1.5} index="05" label="Технологии" />

      <div className="shell relative z-10">
        <Reveal className="tech-label mb-6 flex items-center gap-3">
          <span className="text-accent-soft">05</span>
          <span className="h-px w-8 bg-line" />
          Стек
        </Reveal>
        <Reveal as="div">
          <h2 className="max-w-4xl font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.02em]">
            {techSection.heading}
          </h2>
        </Reveal>
      </div>

      <div
        className="marquee relative mt-14 overflow-hidden"
        style={{ "--marquee-dur": "45s" } as React.CSSProperties}
      >
        <div className="marquee-track" aria-hidden>
          {row.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 font-display text-xl text-fg md:text-3xl">{t.name}</span>
              <span className="font-mono text-[10px] text-accent-soft">{t.category}</span>
              <span className="px-6 text-line">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="shell relative z-10 mt-20">
        <Reveal className="tech-label mb-8">{clientsSection.heading}</Reveal>
        <Reveal as="div" className="flex flex-wrap gap-x-10 gap-y-5">
          {clients.map((c) => (
            <span key={c.name} className="font-display text-2xl text-muted transition-colors hover:text-fg md:text-3xl">
              {c.name}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
