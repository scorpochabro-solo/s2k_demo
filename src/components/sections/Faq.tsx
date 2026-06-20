"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { faq, faqSection } from "@/lib/content";

/** FAQ — доступный аккордеон. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-[var(--header-h)] py-24 md:py-36">
      <div className="shell">
        <SectionHeading num="—" eyebrow="Вопросы" title={faqSection.heading} subtitle={faqSection.subheading} />

        <ul className="border-t border-line">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-accent-soft"
                  >
                    <span className="font-display text-lg font-medium md:text-2xl">{item.question}</span>
                    <span
                      aria-hidden
                      className="shrink-0 font-mono text-accent transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-sm leading-relaxed text-muted md:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
