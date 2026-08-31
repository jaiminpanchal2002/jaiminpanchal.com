// Transparent job↔candidate matching. Every number here is explainable from
// the inputs — no arbitrary scores. Used both when ingesting jobs and when
// displaying why a job matches.

export interface Candidate {
  skills: string[];
  titles: string[];
  /** Preferred work modes, e.g. ["remote", "hybrid"]. */
  workModes: string[];
}

export interface MatchReasons {
  skill: number; // 0-100
  role: number; // 0-100
  location: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
}

export interface MatchResult {
  score: number; // 0-100 weighted overall
  reasons: MatchReasons;
}

const WEIGHTS = { skill: 0.5, role: 0.3, location: 0.2 };

function norm(value: string): string {
  return value.toLowerCase().trim();
}

function words(value: string): string[] {
  return norm(value)
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 2);
}

export interface ScorableJob {
  title: string;
  skills?: string[] | null;
  workMode?: string | null;
}

export function scoreJob(job: ScorableJob, candidate: Candidate): MatchResult {
  const jobSkills = (job.skills ?? []).map(norm).filter(Boolean);
  const candidateSkills = new Set(candidate.skills.map(norm));

  const matchedSkills = jobSkills.filter((s) => candidateSkills.has(s));
  const missingSkills = jobSkills.filter((s) => !candidateSkills.has(s));
  const skill = jobSkills.length
    ? matchedSkills.length / jobSkills.length
    : 0.5; // unknown requirements → neutral

  // Role: keyword overlap between the job title and the candidate's titles.
  const candidateTitleWords = new Set(
    candidate.titles.flatMap((t) => words(t)),
  );
  const jobTitleWords = words(job.title);
  const roleHits = jobTitleWords.filter((w) =>
    candidateTitleWords.has(w),
  ).length;
  const role = jobTitleWords.length
    ? Math.min(1, roleHits / Math.max(2, jobTitleWords.length))
    : 0.5;

  // Location: does the work mode match a preference?
  const location = !job.workMode
    ? 0.6
    : candidate.workModes.map(norm).includes(norm(job.workMode))
      ? 1
      : 0.4;

  const score = Math.round(
    (skill * WEIGHTS.skill + role * WEIGHTS.role + location * WEIGHTS.location) *
      100,
  );

  return {
    score,
    reasons: {
      skill: Math.round(skill * 100),
      role: Math.round(role * 100),
      location: Math.round(location * 100),
      matchedSkills: matchedSkills.slice(0, 12),
      missingSkills: missingSkills.slice(0, 12),
    },
  };
}
