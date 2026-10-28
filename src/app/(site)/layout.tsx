import { Suspense } from "react";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getProfile, getSiteSettings } from "@/content/api";

async function DraftModeTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <>
      <VisualEditing />
      <a
        href="/api/draft-mode/disable"
        className="fixed bottom-4 left-4 z-[var(--z-menu)] rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-contrast shadow-lg"
      >
        Exit preview
      </a>
    </>
  );
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, profile] = await Promise.all([getSiteSettings(), getProfile()]);
  const allLinks = [
    { label: "Home", href: "/", visible: true },
    ...settings.mainNav,
    ...settings.footerNav,
    { label: "Contact", href: "/contact", visible: true },
  ];

  return (
    <Providers defaultTheme={settings.defaultTheme}>
      <div className="grain min-h-[100dvh]">
        <div aria-hidden className="column-rules no-print">
          <div>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-intro)] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-contrast"
        >
          Skip to content
        </a>
        <Header nav={settings.mainNav} allLinks={allLinks} socials={profile.socialLinks} email={profile.email} />
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
          {children}
        </main>
        <Footer main={settings.mainNav} secondary={settings.footerNav} profile={profile} />
      </div>
      <Suspense fallback={null}>
        <DraftModeTools />
      </Suspense>
    </Providers>
  );
}
