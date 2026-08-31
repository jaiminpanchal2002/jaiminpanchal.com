import { describe, it, expect } from "vitest";
import { tokenize, detectSkills, extractKeywords, hasSkill } from "./text";

describe("tokenize", () => {
  it("drops stopwords and short tokens, keeps tech tokens", () => {
    const tokens = tokenize("We are looking for a React and Node.js engineer");
    expect(tokens).toContain("react");
    expect(tokens).toContain("node.js");
    expect(tokens).not.toContain("and");
    expect(tokens).not.toContain("we");
  });
});

describe("detectSkills", () => {
  it("finds phrase-based skills like C++ and Next.js", () => {
    const skills = detectSkills("We use C++, Next.js and React Three Fiber.");
    expect(skills).toContain("C++");
    expect(skills).toContain("Next.js");
    expect(skills).toContain("React Three Fiber");
  });

  it("returns nothing for skill-free text", () => {
    expect(detectSkills("the quick brown fox")).toEqual([]);
  });
});

describe("extractKeywords", () => {
  it("ranks by frequency", () => {
    const kws = extractKeywords("react react react node node python");
    expect(kws[0]).toBe("react");
    expect(kws).toContain("node");
  });
});

describe("hasSkill", () => {
  it("is case-insensitive", () => {
    expect(hasSkill("I know typescript well", "TypeScript")).toBe(true);
    expect(hasSkill("no match here", "Rust")).toBe(false);
  });
});
