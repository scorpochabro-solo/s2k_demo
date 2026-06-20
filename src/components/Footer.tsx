import Link from "next/link";
import { site, footer } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-elevated">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
            S<span className="text-accent">2</span>K
            <span className="ml-2 font-mono text-[10px] tracking-[0.3em] text-muted">
              STUDIO
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{footer.about}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block font-display text-xl text-fg transition-colors hover:text-accent-soft"
          >
            {site.email}
          </a>
          <div className="mt-1 font-mono text-sm text-muted">{site.phoneDisplay}</div>
        </div>

        <nav aria-label="Услуги" className="md:col-span-3">
          <h3 className="tech-label mb-5">Услуги</h3>
          <ul className="space-y-3">
            {footer.servicesLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Студия" className="md:col-span-2">
          <h3 className="tech-label mb-5">Студия</h3>
          <ul className="space-y-3">
            {footer.companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h3 className="tech-label mb-5">Связь</h3>
          <ul className="space-y-3 font-mono text-sm">
            <li>
              <a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-accent-soft">
                Telegram ↗
              </a>
            </li>
            <li>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-accent-soft">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-accent-soft">
                Instagram* ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line py-8 font-mono text-xs text-muted md:flex-row md:items-center md:justify-between">
        <span>{footer.copyright}</span>
        <span className="max-w-xl text-[10px] leading-relaxed opacity-70">{site.metaNote}</span>
        <Link href={footer.privacy.href} className="transition-colors hover:text-fg">
          {footer.privacy.label}
        </Link>
      </div>
    </footer>
  );
}
