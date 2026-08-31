import { describe, it, expect } from "vitest";
import { scoreJob, type Candidate } from "./matching";

const candidate: Candidate = {
  skills: ["React", "Node.js", "TypeScript", "Python", "OpenAI", "Next.js"],
  titles: ["Full-Stack & AI Engineer"],
  workModes: ["remote", "hybrid"],
};

describe("scoreJob", () => {
  it("scores a perfect match at 100", () => {
    const perfectCandidate: Candidate = {
      skills: ["React", "TypeScript"],
      titles: ["Senior Frontend Engineer"],
      workModes: ["remote"],
    };
    const result = scoreJob(
      {
        title: "Senior Frontend Engineer",
        skills: ["React", "TypeScript"],
        workMode: "remote",
      },
      perfectCandidate,
    );
    expect(result.score).toBe(100);
    expect(result.reasons.skill).toBe(100);
    expect(result.reasons.role).toBe(100);
    expect(result.reasons.location).toBe(100);
    expect(result.reasons.missingSkills).toEqual([]);
  });

  it("computes a transparent partial match (60% case)", () => {
    const result = scoreJob(
      {
        title: "Senior AI Engineer",
        skills: ["Python", "OpenAI", "Rust", "Kubernetes"],
        workMode: "remote",
      },
      candidate,
    );
    expect(result.reasons.skill).toBe(50); // 2 of 4
    expect(result.reasons.role).toBe(50); // "engineer" overlaps
    expect(result.reasons.location).toBe(100); // remote preferred
    expect(result.score).toBe(60); // 50*.5 + 50*.3 + 100*.2
    expect(result.reasons.matchedSkills).toEqual(["python", "openai"]);
    expect(result.reasons.missingSkills).toEqual(["rust", "kubernetes"]);
  });

  it("uses a neutral skill score when the job lists no skills", () => {
    const result = scoreJob(
      { title: "Engineer", skills: [], workMode: "remote" },
      candidate,
    );
    expect(result.reasons.skill).toBe(50);
  });

  it("rewards preferred work modes and penalizes others", () => {
    const remote = scoreJob(
      { title: "Engineer", skills: ["React"], workMode: "remote" },
      candidate,
    );
    const onsite = scoreJob(
      { title: "Engineer", skills: ["React"], workMode: "onsite" },
      candidate,
    );
    const unknown = scoreJob(
      { title: "Engineer", skills: ["React"], workMode: null },
      candidate,
    );
    expect(remote.reasons.location).toBe(100);
    expect(onsite.reasons.location).toBe(40);
    expect(unknown.reasons.location).toBe(60);
  });

  it("caps role score at 100 and keeps score within 0-100", () => {
    const result = scoreJob(
      { title: "Full Stack AI Engineer Developer", skills: ["React"] },
      candidate,
    );
    expect(result.reasons.role).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
