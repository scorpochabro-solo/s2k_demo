"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "s2k_preloaded";

/** Прелоадер: только первый визит за сессию, ≤ 2.5 c. Трасса прорисовывается,
 *  счётчик до 100, шторка уходит вверх. reduced-motion / повторный визит — скип. */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduce) return;
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    const DUR = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DUR);
      setPct(Math.round((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem(KEY, "1");
        setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
        }, 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="shell flex w-full items-end justify-between">
            <svg
              width="2"
              height="180"
              viewBox="0 0 2 180"
              className="absolute left-[var(--spacing-gutter)] top-0 hidden h-screen md:block"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line x1="1" y1="0" x2="1" y2="180" stroke="var(--color-line)" />
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="180"
                stroke="var(--color-accent)"
                strokeWidth="2"
                style={{ pathLength: pct / 100 }}
              />
            </svg>
            <span className="font-display text-[12vw] leading-none tracking-tight md:text-[7vw]">
              S<span className="text-accent">2</span>K
            </span>
            <span className="font-mono text-2xl text-muted tnum md:text-4xl">
              {String(pct).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
