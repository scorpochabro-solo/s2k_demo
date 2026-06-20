"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Услуги", href: "/#services" },
  { label: "Работы", href: "/#work" },
  { label: "Процесс", href: "/#process" },
  { label: "О студии", href: "/#about" },
  { label: "Контакты", href: "/#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight"
          aria-label="S2K Studio — на главную"
        >
          S<span className="text-accent">2</span>K
          <span className="ml-2 align-middle font-mono text-[10px] tracking-[0.3em] text-muted">
            STUDIO
          </span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent-soft sm:inline-block"
          >
            Обсудить проект
          </Link>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center lg:hidden"
          >
            <span
              className={cn(
                "absolute h-px w-6 bg-fg transition-all duration-300",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-6 bg-fg transition-all duration-300",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[var(--header-h)] z-40 bg-bg lg:hidden"
          >
            <nav
              aria-label="Мобильная навигация"
              className="shell flex flex-col gap-2 py-10"
            >
              {nav.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-5 font-display text-3xl"
                  >
                    <span className="mr-4 font-mono text-sm text-accent-soft">
                      0{i + 1}
                    </span>
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="mt-6 bg-accent px-6 py-5 text-center font-mono text-sm uppercase tracking-[0.14em] text-white"
              >
                Обсудить проект
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
