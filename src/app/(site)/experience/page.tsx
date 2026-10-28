import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Timeline } from "@/components/home/Timeline";
import { buttonClass } from "@/components/ui/styles";
import { getExperiences, getProfile, isPreviewing } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description: "Professional experience of Jaimin Panchal: PrimeQA Solutions, freelance software engineering and Sapphire Software Solution.",
  path: "/experience",
});

export default async function ExperiencePage() {
  const [experiences, profile, preview] = await Promise.all([getExperiences(), getProfile(), isPreviewing()]);
  return (
    <>
      <PageHeader title="Experience" intro="Roles, responsibilities and the products behind them. Expand any role for detail.">
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={profile.resumeUrl ?? "/resume"} className={buttonClass("primary")}>
            <Download className="size-4" aria-hidden /> Resume
          </Link>
          {profile.socialLinks
            .filter((s) => s.platform === "linkedin" || s.platform === "github")
            .map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
                {s.label} <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ))}
        </div>
      </PageHeader>
      <section className="container-site max-w-5xl pb-[var(--space-section)]">
        <Timeline items={experiences} preview={preview} />
      </section>
    </>
  );
}
