import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страница не найдена — 404",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden pt-[var(--header-h)]">
      <svg
        aria-hidden
        className="absolute left-[8%] top-0 h-full w-px"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <line x1="1" y1="0" x2="1" y2="48" stroke="var(--color-line)" />
        <line x1="1" y1="52" x2="1" y2="100" stroke="var(--color-line)" />
        <circle cx="1" cy="50" r="1.6" fill="var(--color-accent)" />
      </svg>

      <div className="shell text-center">
        <p className="tech-label mb-6">Обрыв трассы</p>
        <h1 className="font-display text-[clamp(4rem,18vw,12rem)] font-bold leading-none tracking-tight">
          4<span className="text-accent">0</span>4
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          Сигнал не дошёл — такой страницы нет. Вернёмся на магистраль.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-soft"
        >
          На главную <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
