import { describe, it, expect } from "vitest";
import { analyzeAts, enrichAtsWithAI } from "./ats";

const shortResume =
  "Jane Dev jane@example.com. Experience: built React apps. Skills: React, TypeScript. Education: BS in CS.";

const goodResume = `
Jane Developer — jane@example.com
SUMMARY: Senior engineer with 6 years of experience.
SKILLS: React, TypeScript, Python, PostgreSQL, Node.js, Docker.
EXPERIENCE: Built React and TypeScript apps; improved performance by 40% and cut costs by $10k.
Led a team of 5 and shipped 12 features. Migrated services to Python and PostgreSQL.
EDUCATION: BS in Computer Science from a good university.
${"Delivered measurable impact across many production systems. ".repeat(20)}
`;

describe("analyzeAts", () => {
  it("detects matched and missing skills", () => {
    const result = analyzeAts({
      resumeText: shortResume,
      jobText: "We need a React, TypeScript and Python engineer.",
      jobTitle: "Frontend Engineer",
      jobSkills: ["React", "TypeScript", "Python"],
    });
    expect(result.matchedSkills).toContain("react");
    expect(result.matchedSkills).toContain("typescript");
    expect(result.missingSkills).toContain("python");
    expect(result.skillsMatch).toBe(67); // 2 of 3
  });

  it("recommends adding a missing skill by name", () => {
    const result = analyzeAts({
      resumeText: shortResume,
      jobText: "React TypeScript Python role",
      jobSkills: ["React", "TypeScript", "Python"],
    });
    expect(
      result.recommendations.some((r) => r.toLowerCase().includes("python")),
    ).toBe(true);
  });

  it("flags formatting problems on a weak resume", () => {
    const result = analyzeAts({
      resumeText: "Just a name and nothing else here.",
      jobText: "React engineer needed",
      jobSkills: ["React"],
    });
    expect(result.formattingIssues.length).toBeGreaterThan(0);
    expect(
      result.formattingIssues.some((i) => /email/i.test(i)),
    ).toBe(true);
  });

  it("produces a score in range and a threshold summary", () => {
    const result = analyzeAts({
      resumeText: goodResume,
      jobText:
        "Looking for a React, TypeScript, Python and PostgreSQL engineer with Docker experience.",
      jobTitle: "Full-Stack Engineer",
      jobSkills: ["React", "TypeScript", "Python", "PostgreSQL", "Docker"],
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(typeof result.summary).toBe("string");
    expect(result.aiPowered).toBe(false);
  });

  it("gives a neutral-ish result when the job has no extractable skills", () => {
    const result = analyzeAts({
      resumeText: goodResume,
      jobText: "aaa bbb ccc",
    });
    expect(result.missingSkills).toEqual([]);
  });
});

describe("enrichAtsWithAI", () => {
  it("returns the deterministic result when no provider is configured", async () => {
    const base = analyzeAts({
      resumeText: shortResume,
      jobText: "React role",
      jobSkills: ["React"],
    });
    const enriched = await enrichAtsWithAI(base, {
      resumeText: shortResume,
      jobText: "React role",
      jobSkills: ["React"],
    });
    expect(enriched.aiPowered).toBe(false);
    expect(enriched.score).toBe(base.score);
  });
});
