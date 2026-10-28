import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { ProjectLibrary } from "@/components/work/ProjectLibrary";
import { ProjectArt } from "@/components/work/ProjectArt";
import { buttonClass } from "@/components/ui/styles";
import { getProjects } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Selected products and platforms by Jaimin Panchal, with the role, decisions and verified outcomes behind each.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  const art = Object.fromEntries(projects.map((p) => [p.slug, <ProjectArt key={p.slug} project={p} className="h-full w-full" sizes="(min-width: 768px) 45vw, 100vw" />]));
  return (
    <>
      <PageHeader title="Work" intro="Products and platforms, presented with the problem, my role and what changed as a result." />
      <section className="container-site pb-[var(--space-section)]">
        {projects.length === 0 ? (
          <EmptyState title="Project write-ups are on the way." body="Each project is published only after its details have been verified. Ask me about recent work in the meantime.">
            <Link href="/contact" className={buttonClass("secondary", "md", "justify-self-start")}>
              Let&apos;s connect
            </Link>
          </EmptyState>
        ) : (
          <ProjectLibrary projects={projects} art={art} />
        )}
      </section>
    </>
  );
}
