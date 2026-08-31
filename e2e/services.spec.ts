import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Services CMS → public site", () => {
  test("creates a service, sees it on the public site, then deletes it", async ({
    page,
  }) => {
    const unique = `E2E Service ${Date.now()}`;
    await login(page);

    // Create
    await page.goto("/admin/services/new");
    await page.fill('input[name="name"]', unique);
    await page.fill(
      'textarea[name="description"]',
      "Created by the Playwright end-to-end test.",
    );
    await page.getByRole("button", { name: /save service/i }).click();
    await page.waitForURL("**/admin/services");
    await expect(page.getByText(unique)).toBeVisible();

    // Appears on the public site (CMS drives the page)
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: new RegExp(unique, "i") }),
    ).toBeVisible();

    // Clean up: delete it
    page.on("dialog", (d) => d.accept());
    await page.goto("/admin/services");
    const row = page.locator("li", { hasText: unique });
    await row.getByRole("button").click();
    await expect(page.getByText(unique)).toHaveCount(0);
  });
});
