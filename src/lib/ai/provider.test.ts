import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ENV_KEYS = ["AI_PROVIDER_API_KEY", "AI_PROVIDER", "AI_MODEL"];
const saved: Record<string, string | undefined> = {};

describe("getAIProvider factory", () => {
  beforeEach(() => {
    for (const k of ENV_KEYS) saved[k] = process.env[k];
    for (const k of ENV_KEYS) delete process.env[k];
    vi.resetModules(); // clear the module-level provider cache
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("is unavailable without an API key", async () => {
    const { getAIProvider } = await import("./provider");
    const provider = getAIProvider();
    expect(provider.available).toBe(false);
    expect(provider.name).toBe("none");
    await expect(provider.generate("s", "u")).rejects.toThrow();
  });

  it("selects Anthropic by default when a key is present", async () => {
    process.env.AI_PROVIDER_API_KEY = "test-key";
    const { getAIProvider } = await import("./provider");
    const provider = getAIProvider();
    expect(provider.available).toBe(true);
    expect(provider.name).toBe("anthropic");
  });

  it("selects OpenAI when AI_PROVIDER=openai", async () => {
    process.env.AI_PROVIDER_API_KEY = "test-key";
    process.env.AI_PROVIDER = "openai";
    const { getAIProvider } = await import("./provider");
    expect(getAIProvider().name).toBe("openai");
  });

  it("caches the provider across calls", async () => {
    process.env.AI_PROVIDER_API_KEY = "test-key";
    const { getAIProvider } = await import("./provider");
    expect(getAIProvider()).toBe(getAIProvider());
  });
});
