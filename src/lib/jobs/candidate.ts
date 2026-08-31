// Builds the matching "candidate" from real portfolio data in the DB, so match
// scores reflect the actual skills/titles the site presents.
import { prisma } from "../db";
import { parseStringArray } from "../json";
import type { Candidate } from "../matching";

export async function buildCandidate(): Promise<Candidate> {
  const [projects, profile, skills, resumes] = await Promise.all([
    prisma.project.findMany({ select: { technologies: true } }),
    prisma.profile.findFirst({ select: { title: true } }),
    prisma.skill.findMany({ select: { name: true } }),
    prisma.resume.findMany({ select: { targetRole: true, skills: true } }),
  ]);

  const skillSet = new Set<string>();
  for (const p of projects) {
    for (const t of parseStringArray(p.technologies)) skillSet.add(t);
  }
  for (const s of skills) skillSet.add(s.name);
  for (const r of resumes) {
    for (const t of parseStringArray(r.skills)) skillSet.add(t);
  }

  const titles = [
    profile?.title ?? "",
    ...resumes.map((r) => r.targetRole ?? ""),
  ].filter(Boolean);

  return {
    skills: Array.from(skillSet),
    titles: titles.length ? titles : ["Full-Stack Engineer"],
    workModes: ["remote", "hybrid"],
  };
}
