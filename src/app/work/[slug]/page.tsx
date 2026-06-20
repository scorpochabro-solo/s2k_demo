import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCases, products, site } from "@/lib/content";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = allCases.find((x) => x.id === slug);
  if (!c) return {};
  return {
    ...pageMeta({
      title: `${c.name} — ${c.category}`,
      description: c.description.slice(0, 200),
      path: `/work/${c.id}`,
    }),
    robots: { index: true, follow: true },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = allCases.findIndex((x) => x.id === slug);
  if (idx === -1) notFound();
  const c = allCases[idx];
  const isProduct = products.some((p) => p.id === c.id);
  const next = allCases[(idx + 1) % allCases.length];

  return (
    <article className="relative pt-[calc(var(--header-h)+3rem)]">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: c.name,
            about: c.category,
            description: c.description,
            keywords: c.stack.join(", "),
            creator: { "@id": `${site.url}/#organization` },
            url: `${site.url}/work/${c.id}`,
          },
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: "Работы", path: "/work" },
            { name: c.name, path: `/work/${c.id}` },
          ]),
        ]}
      />

      <div className="shell">
        <Link href="/work" className="tech-label inline-flex items-center gap-2 hover:text-fg">
          ← Все работы
        </Link>

        <header className="mt-10 border-b border-line pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-soft">
            {isProduct ? "Собственный продукт" : "Клиентский проект"} · {c.category}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            {c.name}
          </h1>
        </header>

        {/* Паспорт */}
        <div className="grid gap-px border-b border-line bg-line md:grid-cols-3">
          <Cell label="Тип" value={isProduct ? "AI-продукт" : "Проект"} />
          <Cell label="Направление" value={c.category} />
          <Cell label="Стек" value={c.stack.join(" · ")} />
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="tech-label mb-6">Задача и решение</h2>
            <p className="font-display text-2xl leading-[1.3] tracking-tight text-fg md:text-3xl">
              {c.description}
            </p>
          </div>
          <aside className="md:col-span-4">
            <h2 className="tech-label mb-6">Технологии</h2>
            <ul className="flex flex-wrap gap-2">
              {c.stack.map((t) => (
                <li key={t} className="border border-line px-3 py-1.5 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Медиа-герой пока недоступен — честная заглушка-схема трассы, не сток */}
        <div className="relative grid aspect-[16/7] place-items-center overflow-hidden border border-line bg-bg-elevated">
          <svg aria-hidden className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path d="M0 30 L30 30 Q34 30 34 26 L34 12 Q34 8 38 8 L100 8" fill="none" stroke="var(--color-line)" strokeWidth="0.4" />
            <circle cx="34" cy="20" r="0.8" fill="var(--color-accent)" />
          </svg>
          <span className="tech-label relative">Медиа кейса — по готовности материалов</span>
        </div>
      </div>

      {/* Следующий проект */}
      <Link
        href={`/work/${next.id}`}
        data-cursor="focus"
        className="group mt-24 block border-t border-line py-16 transition-colors hover:bg-bg-elevated md:py-24"
      >
        <div className="shell flex items-end justify-between gap-6">
          <div>
            <span className="tech-label">Следующий проект</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-7xl">
              {next.name}
            </h2>
          </div>
          <span aria-hidden className="font-display text-4xl text-accent transition-transform duration-300 group-hover:translate-x-2 md:text-6xl">
            →
          </span>
        </div>
      </Link>

      <div className="shell py-20 text-center">
        <p className="font-display text-2xl tracking-tight md:text-4xl">
          Похожая задача в вашем бизнесе?
        </p>
        <Link
          href="/#contact"
          className="mt-8 inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-soft"
        >
          Обсудить проект <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg p-6">
      <div className="tech-label mb-2">{label}</div>
      <div className="text-sm text-fg">{value}</div>
    </div>
  );
}
