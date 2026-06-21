import type { Metadata } from "next";
import { site } from "./content";

export const metadataBase = new URL(site.url);

/** Базовые метаданные страницы с canonical и OG/Twitter. */
export function pageMeta({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = new URL(path, site.url).toString();
  // Шаблон layout добавляет « | S2K Studio» — срезаем зашитый бренд, чтобы тайтл не дублировался.
  const cleanTitle = title.replace(/\s*\|\s*S2K Studio\s*$/i, "");
  // og-картинку отдаёт файловая конвенция opengraph-image (корневая, наследуется).
  return {
    title: cleanTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ----------------------------- JSON-LD ---------------------------- */

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    areaServed: "RU",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locationCity,
      addressCountry: "RU",
    },
    sameAs: [site.social.telegram, site.social.github],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "ru-RU",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).toString(),
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // JSON-LD безопасен: сериализуем сами, без пользовательского ввода.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(arr) }}
    />
  );
}
