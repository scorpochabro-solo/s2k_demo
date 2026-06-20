"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "./SectionHeading";
import { processSection, processSteps } from "@/lib/content";

/** Pin-секция: этапы листаются горизонтально при скролле внутри закреплённого экрана. */
export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const n = processSteps.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(n - 1) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return (
      <section id="process" className="scroll-mt-[var(--header-h)] py-24">
        <div className="shell">
          <SectionHeading num="04" eyebrow="Процесс" title={processSection.heading} subtitle={processSection.subheading} />
          <ol className="grid gap-px border border-line bg-line md:grid-cols-2">
            {processSteps.map((s, i) => (
              <li key={s.title} className="bg-bg p-8">
                <span className="font-mono text-xs text-accent-soft">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted">{s.description}</p>
                <span className="mt-4 block font-mono text-xs text-muted">{s.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="process"
      className="relative scroll-mt-[var(--header-h)]"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <div className="shell w-full">
          <SectionHeading num="04" eyebrow="Процесс" title={processSection.heading} />
        </div>

        <div className="shell w-full overflow-hidden">
          <motion.div style={{ x }} className="flex">
            {processSteps.map((s, i) => (
              <article
                key={s.title}
                className="flex w-full shrink-0 flex-col gap-6 pr-8 md:w-full"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-[clamp(4rem,14vw,11rem)] font-bold leading-none outline-num" aria-hidden>
                    0{i + 1}
                  </span>
                  <div className="max-w-xl">
                    <h3 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
                      {s.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted">{s.description}</p>
                    <span className="mt-5 inline-block border border-line px-3 py-1.5 font-mono text-xs text-accent-soft">
                      {s.duration}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Прогресс этапов = трасса */}
        <div className="shell mt-12 w-full">
          <div className="relative h-px w-full bg-line">
            <motion.div className="absolute left-0 top-0 h-px bg-accent" style={{ width: bar }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[11px] text-muted">
            {processSteps.map((s, i) => (
              <span key={i}>0{i + 1}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
