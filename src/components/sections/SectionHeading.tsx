import Reveal from "@/components/ui/Reveal";

/** Нумерованный заголовок секции в инженерном духе: «01 / Услуги» + крупный H2. */
export default function SectionHeading({
  num,
  eyebrow,
  title,
  subtitle,
}: {
  num: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <Reveal className="tech-label mb-6 flex items-center gap-3">
        <span className="text-accent-soft">{num}</span>
        <span className="h-px w-8 bg-line" />
        <span>{eyebrow}</span>
      </Reveal>
      <Reveal as="div">
        <h2 className="max-w-4xl font-display text-[clamp(1.75rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1} className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {subtitle}
        </Reveal>
      )}
    </header>
  );
}
