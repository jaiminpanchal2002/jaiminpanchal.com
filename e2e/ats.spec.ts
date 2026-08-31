import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("ATS analyzer", () => {
  test("analyzes a pasted resume against a job description", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/admin/ats");

    await page.fill(
      'textarea[name="resumeText"]',
      [
        "Jane Developer — jane@example.com",
        "SKILLS: React, TypeScript, Node.js.",
        "EXPERIENCE: Built React apps and improved performance by 40%.",
        "EDUCATION: BS in Computer Science.",
      ].join("\n"),
    );
    await page.fill('input[name="jobTitle"]', "Frontend Engineer");
    await page.fill(
      'textarea[name="jobText"]',
      "We need a React and TypeScript and Python engineer to build UIs.",
    );

    await page.getByRole("button", { name: /analyze resume/i }).click();

    // The result card shows the ATS ring + sub-scores.
    await expect(page.getByText(/keyword match/i)).toBeVisible();
    await expect(page.getByText(/skills match/i)).toBeVisible();
    // Python is required but missing → should show up as a gap.
    await expect(
      page.getByText("Skill gaps", { exact: true }),
    ).toBeVisible();
  });
});
