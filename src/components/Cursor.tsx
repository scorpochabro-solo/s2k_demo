"use client";

import { useEffect, useRef, useState } from "react";

/** Кастомный курсор-перекрестие. Только десктоп с мышью; touch/reduced — выкл. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);

    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      setFocus(Boolean(t?.closest?.('a,button,[data-cursor="focus"]')));
    };
    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (dot.current)
        dot.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      style={{ transition: "none" }}
    >
      <div
        className="relative grid place-items-center transition-all duration-200"
        style={{ width: focus ? 44 : 22, height: focus ? 44 : 22 }}
      >
        <span className="absolute h-px w-full bg-[#fff]" />
        <span className="absolute h-full w-px bg-[#fff]" />
      </div>
    </div>
  );
}
