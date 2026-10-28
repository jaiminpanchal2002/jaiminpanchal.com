import Link from "next/link";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SplitHeading, Reveal } from "@/components/motion/Reveal";
import type { HomePage, Profile } from "@/content/types";

/**
 * The closing scene. A slow horizon glow rises as the section enters; the form itself
 * sits on a solid surface so no effect ever obstructs it.
 */
export function ContactFinale({ home, profile, headingLevel = "h2" }: { home: HomePage; profile: Profile; headingLevel?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="contact-title" className="relative isolate overflow-hidden section-y">
      <Reveal variant="fade" aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[80%]">
        <div className="absolute inset-x-[-20%] bottom-[-55%] aspect-[2/1] rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ice)_14%,transparent),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-[22%] h-px bg-gradient-to-r from-transparent via-ice/50 to-transparent" />
      </Reveal>
      <div className="container-site grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="grid content-start gap-8">
          <SplitHeading as={headingLevel} id="contact-title" text={home.contactHeadline} className="display max-w-[18ch] text-[length:var(--step-4)]" />
          <div className="grid gap-3 text-fg-2">
            <p className="flex items-center gap-3">
              <MapPin className="size-4 text-fg-3" aria-hidden /> {profile.location}
            </p>
            <p className="flex items-center gap-3">
              <Clock className="size-4 text-fg-3" aria-hidden /> India Standard Time (UTC+05:30)
            </p>
          </div>
          {home.collaborationInterests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-fg">Open to</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {home.collaborationInterests.map((i) => (
                  <li key={i} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-2">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-fg underline decoration-accent underline-offset-4">
                {profile.email}
              </a>
            )}
            {profile.socialLinks.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-2 hover:text-fg">
                {s.label} <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ))}
            <Link href={profile.resumeUrl ?? "/resume"} className="inline-flex items-center gap-1 text-fg-2 hover:text-fg">
              Resume <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-line bg-bg-raised p-6 shadow-[0_40px_120px_-40px_hsl(var(--shadow-tint)/0.8)] md:p-10">
          <ContactForm fallbackEmail={profile.email} />
        </div>
      </div>
    </section>
  );
}
