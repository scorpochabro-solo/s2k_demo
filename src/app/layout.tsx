import type { Metadata, Viewport } from "next";
import { Geologica, Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { metadataBase, organizationLd, websiteLd, JsonLd } from "@/lib/seo";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
  preload: true,
});
const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
  preload: false,
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "S2K Studio — цифровые продукты, которые двигают бизнес вперёд",
    template: "%s | S2K Studio",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "разработка сайтов нижний новгород",
    "веб-приложения на заказ",
    "внедрение ии для бизнеса",
    "telegram mini app",
    "мобильные приложения на заказ",
  ],
  authors: [{ name: site.name }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${geologica.variable} ${onest.variable} ${jetbrains.variable}`}
    >
      <body>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-white"
        >
          К основному содержанию
        </a>
        <Preloader />
        <Cursor />
        <Header />
        <SmoothScroll>
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
