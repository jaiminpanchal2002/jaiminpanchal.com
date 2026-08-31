import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/ui/ContactForm";
import { contact } from "@/content/portfolio";
import type { PublicProfile } from "@/lib/queries";

export function ContactSection({ profile }: { profile: PublicProfile }) {
  const socials = profile.socials;
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0C0C0C] px-6 pb-14 pt-28 sm:px-8 sm:pt-32 md:px-10"
    >
      <div
        className="orb -top-10 left-1/4 h-[360px] w-[360px]"
        style={{ background: "rgba(200,31,180,0.22)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={20}>
          <p className="eyebrow mb-5">{"// let’s talk"}</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left — pitch + info */}
          <div>
            <FadeIn
              as="h2"
              y={30}
              className="hero-heading font-black uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
            >
              {contact.heading}
            </FadeIn>
            <FadeIn y={20} delay={0.1}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
                {contact.blurb}
              </p>
            </FadeIn>

            <FadeIn y={20} delay={0.2}>
              <div className="mt-8 flex flex-col gap-3 font-mono text-sm text-white/60">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Mail size={15} className="text-[#C81FB4]" />
                  {profile.email}
                </a>
                <span className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#C81FB4]" />
                  {profile.location}
                </span>
              </div>
            </FadeIn>

            <FadeIn y={20} delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target={social.url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — form */}
          <FadeIn y={30} delay={0.15}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mx-auto mt-24 max-w-6xl border-t border-white/10 pt-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 font-mono text-sm font-bold text-white">
              JP
            </span>
            <div>
              <p className="font-semibold text-white">{profile.name}</p>
              <p className="text-sm text-white/40">
                Building useful things with code and AI.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider text-white/50 transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-white/30">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js ·
          Prisma · Three.js
        </p>
      </div>
    </section>
  );
}
