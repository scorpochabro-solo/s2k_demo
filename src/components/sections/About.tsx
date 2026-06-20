import { TraceSegment } from "@/components/Trace";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { about, stats } from "@/lib/content";

/** О студии + статистика (count-up). */
export default function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-[var(--header-h)] border-t border-line bg-bg-elevated py-24 md:py-36"
    >
      <TraceSegment enterX={14} exitX={8} thickness={1.5} index="02" label="О студии" />

      <div className="shell relative z-10">
        <SectionHeading num="02" eyebrow="О студии" title={about.heading} />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-7">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05} className="max-w-2xl text-base leading-relaxed text-muted">
                {p}
              </Reveal>
            ))}
            <Reveal className="inline-flex items-center gap-3 pt-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {about.badge}
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-px self-start border border-line bg-line md:col-span-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg-elevated p-6 md:p-8">
                <div className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                  {s.value === null ? (
                    <span className="tnum">{s.display}</span>
                  ) : (
                    <CountUp value={s.value} suffix={s.suffix} />
                  )}
                </div>
                <div className="mt-3 text-xs leading-snug text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
