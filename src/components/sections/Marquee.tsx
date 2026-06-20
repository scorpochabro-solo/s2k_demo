import { marquee } from "@/lib/content";

/** Бесконечная лента услуг. Медленная, пауза на hover (CSS, без JS). */
export default function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <section
      aria-hidden
      className="marquee relative overflow-hidden border-y border-line bg-bg-elevated py-6"
      style={{ "--marquee-dur": "55s" } as React.CSSProperties}
    >
      <div className="marquee-track">
        {items.map((m, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-display text-2xl text-muted md:text-4xl">{m}</span>
            <span className="text-accent">✳</span>
          </span>
        ))}
      </div>
    </section>
  );
}
