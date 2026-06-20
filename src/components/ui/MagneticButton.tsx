"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

/** Магнитная кнопка: лёгкое смещение к курсору (десктоп, ≤ 8px). */
export default function MagneticButton({
  href,
  children,
  variant = "solid",
  className,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: React.MouseEvent) {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${Math.max(-8, Math.min(8, mx * 0.25))}px, ${Math.max(-8, Math.min(8, my * 0.3))}px)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor="focus"
      className={cn(
        "group relative inline-flex items-center gap-3 px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 will-change-transform",
        variant === "solid"
          ? "bg-accent text-white hover:bg-accent-soft"
          : "border border-line text-fg hover:border-accent-soft hover:text-accent-soft",
        className,
      )}
      style={{ transitionProperty: "transform, background-color, color, border-color" }}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
