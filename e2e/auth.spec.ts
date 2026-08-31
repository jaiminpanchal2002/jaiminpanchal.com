import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Authentication", () => {
  test("redirects unauthenticated users to the login page", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page).toHaveURL(/redirect=%2Fadmin/);
  });

  test("protects a deep admin route", async ({ page }) => {
    await page.goto("/admin/applications");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("logs in with valid credentials and reaches the dashboard", async ({
    page,
  }) => {
    await login(page);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@jaiminpanchal.com");
    await page.fill('input[name="password"]', "wrong-password");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("logs out and returns to login", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
