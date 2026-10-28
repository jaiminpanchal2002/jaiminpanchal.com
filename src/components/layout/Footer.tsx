import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import type { NavItem, Profile } from "@/content/types";
import { cacheLife } from "next/cache";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer({ main, secondary, profile }: { main: NavItem[]; secondary: NavItem[]; profile: Profile }) {
  return (
    <footer className="no-print relative border-t border-line">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <Wordmark withName />
          <p className="max-w-sm text-sm text-fg-2">{profile.headline}</p>
          <p className="text-sm text-fg-3">{profile.location}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-2.5 text-sm">
            {[...main, { label: "Contact", href: "/contact", visible: true }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-fg-2 hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-2.5 text-sm">
          {secondary.map((n) => (
            <Link key={n.href} href={n.href} className="text-fg-2 hover:text-fg">
              {n.label}
            </Link>
          ))}
          {profile.socialLinks.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-2 hover:text-fg">
              {s.label} <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          ))}
        </div>
      </div>
      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-xs text-fg-3 sm:flex-row sm:justify-between">
        <p>
          © <CopyrightYear /> {profile.name}
        </p>
        <p>
          <Link href="/feed.xml" className="hover:text-fg">RSS</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link href="/sitemap.xml" className="hover:text-fg">Sitemap</Link>
        </p>
      </div>
    </footer>
  );
}
