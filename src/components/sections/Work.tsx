import Link from "next/link";
import { TraceSegment } from "@/components/Trace";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { getCasesByIds, products, portfolioSection } from "@/lib/content";

const FEATURED = ["carburg", "dvor", "po50", "hampton"];

/** Избранные работы. Медиа нет → строим типографикой: паспорт + стек. */
export default function Work() {
  const featured = getCasesByIds(FEATURED);

  return (
    <section id="work" className="relative scroll-mt-[var(--header-h)] py-24 md:py-36">
      <TraceSegment enterX={8} exitX={16} thickness={1.5} index="03" label="Работы" />

      <div className="shell relative z-10">
        <SectionHeading
          num="03"
          eyebrow="Работы"
          title={portfolioSection.heading}
          subtitle={portfolioSection.subheading}
        />

        {/* Крупные проекты */}
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {featured.map((c, i) => (
            <Reveal as="div" key={c.id} delay={(i % 2) * 0.08}>
              <Link
                href={`/work/${c.id}`}
                data-cursor="focus"
                className="group flex h-full flex-col justify-between gap-10 bg-bg p-8 transition-colors duration-300 hover:bg-bg-elevated md:p-12"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-soft">
                    {c.category}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    Смотреть ↗
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-5xl">
                    {c.name}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.stack.map((t) => (
                      <li
                        key={t}
                        className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Собственные AI-продукты */}
        <div className="mt-20">
          <Reveal className="tech-label mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-line" />
            Собственные AI-продукты
          </Reveal>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/work/${p.id}`}
                data-cursor="focus"
                className="group flex flex-col gap-4 bg-bg p-6 transition-colors duration-300 hover:bg-bg-elevated"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {p.category}
                </span>
                <span className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-soft">
                  {p.name}
                </span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {p.stack.slice(0, 3).map((t) => (
                    <span key={t} className="font-mono text-[10px] text-muted">
                      {t}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Reveal className="mt-14">
          <Link
            href="/work"
            data-cursor="focus"
            className="group inline-flex items-center gap-3 font-display text-2xl tracking-tight transition-colors hover:text-accent-soft md:text-3xl"
          >
            Все работы
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
