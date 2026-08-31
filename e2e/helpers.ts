import { Page, expect } from "@playwright/test";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "admin@jaiminpanchal.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123!change";

/** Logs in via the real login form and waits for the dashboard. */
export async function login(page: Page) {
  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin");
  await expect(
    page.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
}
