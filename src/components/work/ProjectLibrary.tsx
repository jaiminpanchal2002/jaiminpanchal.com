"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";

type Sort = "featured" | "newest" | "az";

/**
 * Searchable, filterable project library. Receives server-rendered data; the art for each
 * project is passed in pre-rendered (a server component) so no image logic ships to the client.
 */
export function ProjectLibrary({ projects, art }: { projects: Project[]; art: Record<string, React.ReactNode> }) {
  const { reduceMotion } = useExperience();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tech, setTech] = useState("all");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const options = useMemo(
    () => ({
      categories: [...new Set(projects.map((p) => p.category))].sort(),
      techs: [...new Set(projects.flatMap((p) => p.technologies))].sort(),
      types: [...new Set(projects.map((p) => p.projectType))].sort(),
      years: [...new Set(projects.map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a),
    }),
    [projects],
  );

  const results = useMemo(() => filterProjects(projects, { query, category, tech, type, year, sort }), [projects, query, category, tech, type, year, sort]);
  const active = category !== "all" || tech !== "all" || type !== "all" || year !== "all" || query !== "";

  const select = "h-10 rounded-full border border-line-strong bg-bg px-4 text-sm text-fg focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-80">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-3" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" className={cn(select, "w-full pl-10")} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <label>
            <span className="sr-only">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
              <option value="all">All categories</option>
              {options.categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          {options.techs.length > 0 && (
            <label>
              <span className="sr-only">Technology</span>
              <select value={tech} onChange={(e) => setTech(e.target.value)} className={select}>
                <option value="all">All technologies</option>
                {options.techs.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span className="sr-only">Project type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className={select}>
              <option value="all">All types</option>
              {options.types.map((t) => (
                <option key={t} value={t}>
                  {t.replace("-", " ")}
                </option>
              ))}
            </select>
          </label>
          {options.years.length > 0 && (
            <label>
              <span className="sr-only">Year</span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={select}>
                <option value="all">Any year</option>
                {options.years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={select}>
              <option value="featured">Featured first</option>
              <option value="newest">Newest</option>
              <option value="az">A to Z</option>
            </select>
          </label>
          <div role="group" aria-label="Layout" className="flex rounded-full border border-line-strong p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn("pressable grid size-8 place-items-center rounded-full", view === v ? "bg-accent text-accent-contrast" : "text-fg-2 hover:text-fg")}
              >
                {v === "grid" ? <LayoutGrid className="size-4" aria-hidden /> : <List className="size-4" aria-hidden />}
                <span className="sr-only">{v === "grid" ? "Grid view" : "List view"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-fg-3">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "project" : "projects"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setTech("all");
              setType("all");
              setYear("all");
            }}
            className="inline-flex items-center gap-1 hover:text-fg"
          >
            <X className="size-3.5" aria-hidden /> Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-fg-2">No projects match these filters.</p>
      ) : (
        <motion.ul layout={!reduceMotion} className={cn("mt-10 grid gap-x-8 gap-y-14", view === "grid" ? "md:grid-cols-2" : "grid-cols-1 gap-y-0")}>
          <AnimatePresence initial={false}>
            {results.map((p) => (
              <motion.li
                key={p._id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className={view === "list" ? "border-t border-line last:border-b" : undefined}
              >
                <Link href={`/work/${p.slug}`} className={cn("group", view === "list" ? "grid grid-cols-[6rem_1fr] items-center gap-6 py-5 md:grid-cols-[10rem_1fr_auto]" : "grid gap-5")}>
                  <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-line", view === "list" ? "aspect-[4/3]" : "aspect-[16/10]")}>
                    <div className="h-full transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.04]">{art[p.slug]}</div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-fg-3">
                      <span>{p.category}</span>
                      {p.year && <span>{p.year}</span>}
                      {p.featured && <span className="text-accent">Featured</span>}
                      <VerificationBadge verified={p.verified} />
                    </div>
                    <h2 className="mt-2 font-display text-[length:var(--step-2)] leading-tight tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">{p.title}</h2>
                    {view === "grid" && <p className="mt-2 text-fg-2">{p.summary}</p>}
                  </div>
                  {view === "list" && <p className="hidden text-sm text-fg-3 md:block">{p.technologies.slice(0, 3).join(", ")}</p>}
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

export function filterProjects(
  projects: Project[],
  f: { query: string; category: string; tech: string; type: string; year: string; sort: Sort },
): Project[] {
  const q = f.query.trim().toLowerCase();
  const out = projects.filter(
    (p) =>
      (f.category === "all" || p.category === f.category) &&
      (f.tech === "all" || p.technologies.includes(f.tech)) &&
      (f.type === "all" || p.projectType === f.type) &&
      (f.year === "all" || String(p.year) === f.year) &&
      (!q || [p.title, p.summary, p.category, ...p.technologies].join(" ").toLowerCase().includes(q)),
  );
  return out.sort((a, b) => {
    if (f.sort === "az") return a.title.localeCompare(b.title);
    if (f.sort === "newest") return (b.year ?? 0) - (a.year ?? 0) || a.order - b.order;
    return Number(b.featured) - Number(a.featured) || a.order - b.order;
  });
}
