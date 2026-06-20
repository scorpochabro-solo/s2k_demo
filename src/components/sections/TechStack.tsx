import { TraceSegment } from "@/components/Trace";
import Reveal from "@/components/ui/Reveal";
import {
  techSection,
  techStack,
  clients,
  clientsSection,
  hackathons,
  hackathonsSection,
} from "@/lib/content";

/** Технологии (marquee реальных техов) + строка доверия (имена клиентов, без логотипов). */
export default function TechStack() {
  const row = [...techStack, ...techStack];
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
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

      {/* Нам доверяют — реальные клиенты логотипами + ссылками. */}
      <div className="shell relative z-10 mt-20">
        <Reveal className="tech-label mb-3">{clientsSection.heading}</Reveal>
        <Reveal className="mb-8 max-w-xl text-sm text-muted">
          {clientsSection.subheading}
        </Reveal>
        <Reveal as="div" className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {clients.map((c) => {
            const inner = (
              <div className="flex h-24 items-center justify-center bg-bg-elevated px-6 transition-colors duration-300 group-hover:bg-bg md:h-28">
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${BASE}${c.logo}`}
                    alt={c.name}
                    className="max-h-10 w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100 md:max-h-12"
                  />
                ) : c.name === "SKIN" ? (
                  <span className="text-center">
                    <span className="block font-sans text-2xl font-semibold tracking-[0.18em] text-[#c2a173]">
                      SKIN
                    </span>
                    <span className="mt-1 block font-mono text-[8px] tracking-[0.22em] text-muted">
                      BY KSENIA BARINOVA
                    </span>
                  </span>
                ) : (
                  <span className="text-center font-display text-lg font-medium tracking-tight text-fg md:text-xl">
                    {c.name}
                  </span>
                )}
              </div>
            );
            return c.url ? (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="focus"
                className="group block"
                aria-label={`${c.name} — открыть сайт`}
              >
                {inner}
              </a>
            ) : (
              <div key={c.name} className="group">
                {inner}
              </div>
            );
          })}
        </Reveal>
      </div>

      {/* Призёры хакатонов — крупные имена как достижения, не как клиенты. */}
      <div className="shell relative z-10 mt-16">
        <Reveal className="tech-label mb-3">{hackathonsSection.heading}</Reveal>
        <Reveal className="mb-7 max-w-xl text-sm text-muted">
          {hackathonsSection.subheading}
        </Reveal>
        <Reveal as="div" className="flex flex-wrap gap-x-8 gap-y-4">
          {hackathons.map((h) => (
            <span
              key={h}
              className="font-display text-xl text-muted transition-colors hover:text-fg md:text-2xl"
            >
              {h}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
