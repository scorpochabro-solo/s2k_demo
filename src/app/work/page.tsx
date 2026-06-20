import type { Metadata } from "next";
import WorkExplorer from "@/components/work/WorkExplorer";
import { allCases } from "@/lib/content";
import { site } from "@/lib/content";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Работы — продукты и проекты",
    description:
      "Собственные AI-продукты и клиентские проекты S2K Studio: что это и какую задачу бизнеса закрывает. Веб, AI, мобильные приложения, Telegram-сервисы.",
    path: "/work",
  }),
  robots: { index: true, follow: true },
};

function itemListLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: allCases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${site.url}/work/${c.id}`,
    })),
  };
}

export default function WorkPage() {
  return (
    <section className="relative pt-[calc(var(--header-h)+4rem)]">
      <JsonLd
        data={[
          itemListLd(),
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: "Работы", path: "/work" },
          ]),
        ]}
      />
      <div className="shell pb-28">
        <p className="tech-label mb-6">Портфолио</p>
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          Продукты и проекты, которые{" "}
          <span className="text-accent">уже работают</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          Часть — наши собственные AI-продукты, часть — то, что мы запустили и поддерживаем
          для клиентов. Коротко по каждому: что это и какую задачу закрывает.
        </p>

        <div className="mt-16">
          <WorkExplorer />
        </div>
      </div>
    </section>
  );
}
