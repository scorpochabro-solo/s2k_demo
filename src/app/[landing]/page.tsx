import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { landings, getLanding, getCasesByIds, site } from "@/lib/content";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ landing: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ landing: string }>;
}): Promise<Metadata> {
  const { landing } = await params;
  const l = getLanding(landing);
  if (!l) return {};
  return {
    ...pageMeta({ title: l.meta.title, description: l.meta.description, path: `/${l.slug}` }),
    keywords: l.meta.keywords,
    robots: { index: true, follow: true },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ landing: string }>;
}) {
  const { landing } = await params;
  const l = getLanding(landing);
  if (!l) notFound();
  const related = getCasesByIds(l.relatedCaseIds);

  return (
    <article className="relative pt-[calc(var(--header-h)+3.5rem)]">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: l.h1,
            serviceType: l.breadcrumb,
            provider: { "@id": `${site.url}/#organization` },
            areaServed: "RU",
            description: l.meta.description,
            url: `${site.url}/${l.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: l.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: l.breadcrumb, path: `/${l.slug}` },
          ]),
        ]}
      />

      <div className="shell">
        <nav aria-label="Хлебные крошки" className="tech-label flex items-center gap-2">
          <Link href="/" className="hover:text-fg">
            Главная
          </Link>
          <span className="text-line">/</span>
          <span className="text-accent-soft">{l.breadcrumb}</span>
        </nav>

        <header className="mt-10 max-w-4xl border-b border-line pb-14">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-soft">{l.eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            {l.h1}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{l.lead}</p>
          <Link
            href="/#contact"
            className="mt-9 inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-soft"
          >
            Обсудить проект <span aria-hidden>→</span>
          </Link>
        </header>

        <div className="grid gap-16 py-16 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            {l.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
                {p}
              </p>
            ))}
          </div>
          <aside className="md:col-span-5">
            <h2 className="tech-label mb-6">Что входит</h2>
            <ul className="space-y-3">
              {l.bullets.map((b) => (
                <li key={b} className="flex gap-3 border-b border-line pb-3 text-sm text-fg">
                  <span className="font-mono text-accent-soft">→</span>
                  {b}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="border-t border-line py-16">
            <h2 className="tech-label mb-8">Релевантные работы</h2>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={`/work/${c.id}`}
                  className="group flex flex-col gap-3 bg-bg p-6 transition-colors hover:bg-bg-elevated"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{c.category}</span>
                  <span className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-soft">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-line py-16">
          <h2 className="mb-10 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight">
            Частые вопросы
          </h2>
          <div className="space-y-8">
            {l.faq.map((f, i) => (
              <div key={i} className="max-w-3xl border-b border-line pb-7">
                <h3 className="font-display text-lg font-medium md:text-xl">{f.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
