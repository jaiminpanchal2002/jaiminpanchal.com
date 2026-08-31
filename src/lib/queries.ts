// Public-site data access. Reads from the DB and maps to the shapes the
// landing-page components already use. Falls back to the static content in
// portfolio.ts when the DB is empty, so the public site is never broken.
import { prisma } from "./db";
import { parseStringArray } from "./json";
import {
  services as staticServices,
  projects as staticProjects,
  experiences as staticExperiences,
  skillCategories as staticSkills,
  currentlyBuilding as staticBuilding,
  journey as staticJourney,
  education as staticEducation,
  achievements as staticAchievements,
  profile as staticProfile,
  socials as staticSocials,
  heroTitles as staticHeroTitles,
  type ServiceItem,
  type ProjectItem,
  type ExperienceEntry,
  type SkillCategoryContent,
  type BuildingItem,
  type JourneyStep,
  type EducationEntry,
  type AchievementEntry,
} from "@/content/portfolio";

export interface PublicProfile {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  roles: string[];
  tagline: string;
  availability: string;
  email: string;
  resumeUrl: string;
  location: string;
  socials: { label: string; url: string }[];
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
}

const AVAILABILITY_LABEL: Record<string, string> = {
  open: "Available for select work",
  available: "Actively looking",
  unavailable: "Not available",
};

function availabilityLabel(value: string | null): string {
  if (!value) return staticProfile.availability;
  return AVAILABILITY_LABEL[value] ?? value;
}

export async function getPublicProfile(): Promise<PublicProfile> {
  const row = await prisma.profile
    .findFirst({ include: { socials: { orderBy: { order: "asc" } } } })
    .catch(() => null);

  if (!row) {
    return {
      name: staticProfile.name,
      firstName: staticProfile.firstName,
      lastName: staticProfile.lastName,
      title: "Full-Stack & AI Engineer",
      roles: staticHeroTitles,
      tagline: staticProfile.tagline,
      availability: staticProfile.availability,
      email: staticProfile.email,
      resumeUrl: staticProfile.resumeUrl,
      location: staticProfile.location,
      socials: staticSocials,
    };
  }

  const { firstName, lastName } = splitName(row.name);
  const roles = parseStringArray(row.roles);
  const socials = row.socials.map((s) => ({ label: s.platform, url: s.url }));

  return {
    name: row.name,
    firstName,
    lastName,
    title: row.title,
    roles: roles.length ? roles : staticHeroTitles,
    tagline: row.tagline ?? staticProfile.tagline,
    availability: availabilityLabel(row.availability),
    email: row.email ?? staticProfile.email,
    resumeUrl: row.resumeUrl ?? "#",
    location: row.location ?? staticProfile.location,
    socials: socials.length ? socials : staticSocials,
  };
}

function yearOf(d: Date | null): string {
  return d ? String(d.getFullYear()) : "";
}

export async function getPublicExperiences(): Promise<ExperienceEntry[]> {
  const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticExperiences;
  return rows.map((r) => ({
    role: r.position,
    company: r.company,
    period:
      r.period ||
      [yearOf(r.startDate), r.current ? "Present" : yearOf(r.endDate)]
        .filter(Boolean)
        .join(" — "),
    location: r.location ?? "",
    description: r.description ?? "",
    achievements: parseStringArray(r.achievements),
    tech: parseStringArray(r.technologies),
  }));
}

export async function getPublicSkills(): Promise<SkillCategoryContent[]> {
  const cats = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
  if (cats.length === 0) return staticSkills;
  return cats.map((c) => ({ name: c.name, skills: c.skills.map((s) => s.name) }));
}

export async function getPublicBuilding(): Promise<BuildingItem[]> {
  const rows = await prisma.building.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticBuilding;
  return rows.map((r) => ({
    title: r.title,
    status: r.status as BuildingItem["status"],
    progress: r.progress,
    tech: parseStringArray(r.tech),
    description: r.description ?? "",
    link: r.link || "#",
  }));
}

export async function getPublicJourney(): Promise<JourneyStep[]> {
  const rows = await prisma.journeyStep.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticJourney;
  return rows.map((r) => ({ step: r.step, note: r.note ?? "" }));
}

export async function getPublicEducation(): Promise<EducationEntry[]> {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticEducation;
  return rows.map((r) => ({
    degree: r.degree,
    institution: r.institution,
    field: r.field ?? "",
    period: r.period ?? "",
    description: r.description ?? "",
  }));
}

export async function getPublicAchievements(): Promise<AchievementEntry[]> {
  const rows = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticAchievements;
  return rows.map((r) => ({ title: r.title, context: r.description ?? "" }));
}

export async function getPublicServices(): Promise<ServiceItem[]> {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return staticServices;
  return rows.map((r) => ({
    number: r.number,
    name: r.name,
    description: r.description,
  }));
}

export interface PublicProject {
  number: string;
  name: string;
  category: string;
  summary: string;
  tech: string[];
  cover: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  isAiProject: boolean;
}

/** Richer project shape for the grid listing. */
export async function getPublicProjectsFull(): Promise<PublicProject[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { category: true },
  });

  if (rows.length === 0) {
    return staticProjects.map((p, i) => ({
      number: p.number,
      name: p.name,
      category: p.category,
      summary: "",
      tech: [],
      cover: p.images.col2,
      liveUrl: p.href === "#" ? null : p.href,
      githubUrl: null,
      featured: i < 2,
      isAiProject: false,
    }));
  }

  return rows.map((r, i) => {
    const images = parseStringArray(r.images);
    return {
      number: String(i + 1).padStart(2, "0"),
      name: r.name,
      category: r.category?.name ?? (r.isAiProject ? "AI Project" : "Project"),
      summary: r.summary ?? "",
      tech: parseStringArray(r.technologies),
      cover: r.coverUrl || images[0] || null,
      liveUrl: r.liveUrl,
      githubUrl: r.githubUrl,
      featured: r.featured,
      isAiProject: r.isAiProject,
    };
  });
}

export async function getPublicProjects(): Promise<ProjectItem[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { category: true },
  });
  if (rows.length === 0) return staticProjects;

  return rows.map((r, i) => {
    const images = parseStringArray(r.images);
    const fallback = staticProjects[i % staticProjects.length].images;
    return {
      number: String(i + 1).padStart(2, "0"),
      category: r.category?.name ?? (r.isAiProject ? "AI Project" : "Project"),
      name: r.name,
      href: r.liveUrl || r.githubUrl || "#",
      images: {
        col1Top: images[0] ?? fallback.col1Top,
        col1Bottom: images[1] ?? fallback.col1Bottom,
        col2: images[2] ?? fallback.col2,
      },
    };
  });
}
