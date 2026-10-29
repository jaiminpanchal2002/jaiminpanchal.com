import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/about", "/services", "/services/laravel-php-development", "/experience", "/work", "/case-studies", "/skills", "/blog", "/now", "/contact", "/resume", "/universe"];

// Skip the intro for most tests (it plays once per session on the home page), and use the
// 3D off (poster still): headless Chrome renders WebGL in software, which starves the main thread.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("jp-intro-seen", "1");
    if (!localStorage.getItem("jp-experience")) localStorage.setItem("jp-experience", JSON.stringify({ motion: "system", quality: "off", sound: false, smoothScroll: false }));
  });
});

test("hero mounts the WebGL lattice on capable desktops", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones get the static artwork by design");
  await page.addInitScript(() => localStorage.setItem("jp-experience", JSON.stringify({ motion: "system", quality: "high", sound: false, smoothScroll: false })));
  await page.goto("/");
  await expect(page.locator("section[aria-labelledby=hero-title] canvas")).toBeAttached({ timeout: 20_000 });
});

test.describe("routes", () => {
  for (const route of routes) {
    test(`${route} renders with a single h1, title and description`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Jaimin|Beyond Code/i);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }

  test("unknown routes return 404 with recovery links", async ({ page }) => {
    const res = await page.goto("/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "Back home" })).toBeVisible();
  });

  test("project, article and case study templates render", async ({ page }) => {
    await page.goto("/work/spot-it-now");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Spot It Now");
    await expect(page.getByRole("heading", { name: "Key features" })).toBeVisible();
    await expect(page.getByText("OTP authentication").first()).toBeVisible();
    await page.goto("/blog/template-sample-article");
    await expect(page.getByRole("button", { name: /copy code/i })).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
    await page.goto("/case-studies/template-engineering-case-study");
    await expect(page.getByRole("navigation", { name: "Contents" })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("full-screen menu is keyboard operable and reaches every page", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    for (const label of ["Work", "Experience", "About", "Writing", "Case studies", "Skills", "Now", "Resume", "Contact"]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Skills", exact: true }).click();
    await expect(page).toHaveURL(/\/skills$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("skip link moves focus to main content", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("contact form", () => {
  test("shows inline validation errors and keeps the form usable", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  });

  test("handles a server response (delivery not configured in test env)", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("Priya Shah");
    await page.getByLabel("Email", { exact: true }).fill("priya@example.com");
    await page.getByLabel("Subject").fill("Role on our platform team");
    await page.getByLabel("Message", { exact: true }).fill("Hello Jaimin, we'd like to talk about a senior role on our platform team.");
    await page.getByLabel(/I agree/).check();
    await page.waitForTimeout(2600); // anti-bot minimum fill time
    await page.getByRole("button", { name: /send message/i }).click();
    // Production build without Resend/Sanity configured must NOT pretend delivery succeeded.
    await expect(page.getByRole("alert").filter({ hasText: /temporarily unavailable|received/i })).toBeVisible();
  });
});

test.describe("experience settings", () => {
  test("theme toggle switches to light and persists", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /display, motion and sound settings/i }).click();
    await page.getByText("Light", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("reduced motion setting is applied to the document", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /display, motion and sound settings/i }).click();
    await page.getByText("Reduced", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  });
});

test.describe("intro", () => {
  test("plays on first visit, can be skipped, and does not replay in the session", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem("jp-experience", JSON.stringify({ motion: "system", quality: "off", sound: false, smoothScroll: false })));
    await page.goto("/");
    const skip = page.getByRole("button", { name: "Skip intro" });
    await expect(skip).toBeVisible();
    // Skip receives focus when the intro opens, so keyboard users can dismiss it immediately.
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Intro animation" })).toBeHidden();
    await page.reload();
    await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
    await ctx.close();
  });

  test("never plays under reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
    await ctx.close();
  });
});

test.describe("layout and accessibility", () => {
  for (const route of ["/", "/work", "/blog/template-sample-article", "/contact"]) {
    test(`${route} has no horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  for (const route of ["/", "/about", "/contact", "/blog/template-sample-article"]) {
    test(`${route} has no serious automated a11y violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).exclude("canvas").analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    });
  }

  test("pages remain readable without JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("I build digital products");
    await expect(page.getByText("More than code.")).toBeVisible();
    await ctx.close();
  });
});

test.describe("SEO endpoints", () => {
  test("sitemap, robots and RSS are served", async ({ request }) => {
    expect((await request.get("/sitemap.xml")).ok()).toBe(true);
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
    const rss = await request.get("/feed.xml");
    expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  });

  test("unverified pages are marked noindex", async ({ page }) => {
    await page.goto("/blog/template-sample-article");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("service pages carry Service structured data and link to proof projects", async ({ page }) => {
    await page.goto("/services/ai-llm-integration");
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((t) => t.includes("\"@type\":\"Service\""))).toBe(true);
    await expect(page.getByRole("link", { name: /Resolve AI/ })).toBeVisible();
  });

  test("verified projects are indexable and listed in the sitemap", async ({ page, request }) => {
    await page.goto("/work/feedbackiq");
    expect(await page.locator('meta[name="robots"]').count()).toBe(0);
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/work/feedbackiq");
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});
