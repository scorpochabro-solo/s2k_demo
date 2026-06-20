"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { TraceSegment } from "@/components/Trace";
import SectionHeading from "./SectionHeading";
import { services, servicesSection } from "@/lib/content";

/** Услуги — таблица во всю ширину. Строка = услуга. Hover подсвечивает и тянет стек. */
export default function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" className="relative scroll-mt-[var(--header-h)] py-24 md:py-36">
      <TraceSegment enterX={6} exitX={14} thickness={1.5} index="01" label="Услуги" />

      <div className="shell relative z-10">
        <SectionHeading
          num="01"
          eyebrow="Услуги"
          title={servicesSection.heading}
          subtitle={servicesSection.subheading}
        />

        <div className="border-t border-line">
          {services.map((s, i) => {
            const isLink = s.href.startsWith("/") && !s.href.startsWith("/#");
            const Row = (
              <motion.div
                onHoverStart={() => setActive(i)}
                onHoverEnd={() => setActive(null)}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-7 transition-colors md:py-9"
                style={{ color: active === i ? "var(--color-fg)" : undefined }}
              >
                <span className="col-span-12 flex items-baseline gap-4 md:col-span-6">
                  <span className="font-mono text-xs text-accent-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                    {s.title}
                  </span>
                </span>
                <span className="col-span-7 hidden font-mono text-xs text-muted md:col-span-4 md:block">
                  {s.stack}
                </span>
                <span className="col-span-5 hidden items-center justify-end gap-3 text-right text-sm text-muted md:col-span-2 md:flex">
                  {s.description}
                  <span
                    aria-hidden
                    className="text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </span>
                <span className="col-span-12 font-mono text-[11px] text-muted md:hidden">
                  {s.stack}
                </span>
              </motion.div>
            );
            return isLink ? (
              <Link key={s.title} href={s.href} className="block" data-cursor="focus">
                {Row}
              </Link>
            ) : (
              <div key={s.title}>{Row}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
