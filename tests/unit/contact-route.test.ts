import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let reqHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => reqHeaders }));

const { POST } = await import("@/app/api/contact/route");
const { __resetRateLimit } = await import("@/lib/rate-limit");

const body = (over: Record<string, unknown> = {}) => ({
  name: "Priya Shah",
  email: "priya@example.com",
  inquiryType: "consulting",
  subject: "API architecture review",
  message: "We would like an external review of our API architecture next month.",
  consent: true,
  website: "",
  startedAt: Date.now() - 10_000,
  ...over,
});

const post = (data: unknown, origin = "http://localhost:3000") => {
  reqHeaders = new Headers({ origin, host: "localhost:3000", "x-forwarded-for": "203.0.113.7" });
  return POST(new Request("http://localhost:3000/api/contact", { method: "POST", body: JSON.stringify(data), headers: { "content-type": "application/json" } }));
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    __resetRateLimit();
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("SANITY_API_WRITE_TOKEN", "");
    vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => vi.unstubAllEnvs());

  it("rejects cross-origin requests (CSRF)", async () => {
    const res = await post(body(), "https://evil.example");
    expect(res.status).toBe(403);
  });

  it("returns field errors for invalid input", async () => {
    const res = await post(body({ email: "nope" }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.fieldErrors.email).toBeTruthy();
  });

  it("silently accepts but drops bot submissions (instant submit)", async () => {
    const res = await post(body({ startedAt: Date.now() }));
    expect(res.status).toBe(200);
    expect(console.info).not.toHaveBeenCalled();
  });

  it("accepts in development without delivery configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await post(body());
    expect(res.status).toBe(200);
    expect((await res.json()).dev).toBe(true);
  });

  it("refuses in production when no delivery channel is configured (never pretends to deliver)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await post(body());
    expect(res.status).toBe(503);
  });

  it("rate-limits repeated submissions from one address", async () => {
    vi.stubEnv("NODE_ENV", "development");
    for (let i = 0; i < 5; i++) expect((await post(body())).status).toBe(200);
    const res = await post(body());
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });
});
