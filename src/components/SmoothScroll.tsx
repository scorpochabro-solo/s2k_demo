"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type LenisCtx = { scrollTo: (target: string | HTMLElement) => void };

const SmoothScrollContext = createContext<LenisCtx>({ scrollTo: () => {} });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

function headerOffset() {
  if (typeof window === "undefined") return -72;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const h = parseInt(raw, 10);
  return -(Number.isFinite(h) ? h : 72) - 12;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // линия и страница статичны — Lenis не нужен

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Урок Lenis: нативный прыжок по #-якорю перетирается — ведём через scrollTo.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      const samePage =
        url.pathname === window.location.pathname && url.hash.length > 1;
      if (!samePage) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToTarget(el as HTMLElement);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function scrollToTarget(target: string | HTMLElement) {
    const lenis = lenisRef.current;
    const offset = headerOffset();
    if (lenis) {
      lenis.scrollTo(target, { offset });
    } else {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (el)
        window.scrollTo({
          top: (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset,
          behavior: "auto",
        });
    }
  }

  return (
    <SmoothScrollContext.Provider value={{ scrollTo: scrollToTarget }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
