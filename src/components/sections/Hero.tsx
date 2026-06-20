import { TraceSegment } from "@/components/Trace";
import MagneticButton from "@/components/ui/MagneticButton";
import { site } from "@/lib/content";

/** Hero. Манифест построчно через CSS mask-reveal (LCP-критично — без JS/observer). */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-[var(--header-h)]"
    >
      <TraceSegment enterX={6} exitX={6} thickness={3} tone="accent" noNode />

      <div className="shell relative z-10 pb-16 pt-10 md:pb-24">
        <p
          className="reveal-fade tech-label mb-8 flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ animationDelay: "0.1s" }}
        >
          <span>Разработка цифровых продуктов</span>
          <span className="text-line">/</span>
          <span>{site.locationCity}</span>
          <span className="text-line">/</span>
          <span>по всей России</span>
        </p>

        <h1 className="font-display text-[clamp(2.5rem,8vw,9rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          <span className="reveal-line" style={{ "--dur-3": "0.9s" } as React.CSSProperties}>
            <span style={{ animationDelay: "0.12s" }}>Превращаем процессы</span>
          </span>
          <span className="reveal-line">
            <span style={{ animationDelay: "0.24s" }}>в продукты, а продукты —</span>
          </span>
          <span className="reveal-line">
            <span style={{ animationDelay: "0.36s" }}>
              в <span className="text-accent">выручку</span>.
            </span>
          </span>
        </h1>

        <div
          className="reveal-fade mt-10 flex flex-col items-start gap-8 md:mt-14 md:flex-row md:items-center"
          style={{ animationDelay: "0.6s" }}
        >
          <MagneticButton href="/#contact" className="trace-cta-charge">
            Обсудить проект
          </MagneticButton>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Автоматизируем процессы, убираем рутину и помогаем зарабатывать больше.
            Сайты, веб-приложения, AI и Telegram-сервисы — инструменты, а не самоцель.
          </p>
        </div>
      </div>

      <div className="shell relative z-10 flex items-center justify-between border-t border-line py-5">
        <span className="tech-label">Листайте вниз</span>
        <span aria-hidden className="font-mono text-xs text-muted">
          ↓
        </span>
      </div>
    </section>
  );
}
