// Swappable AI provider abstraction (SERVER-ONLY — never import client-side).
//
// The key lives in AI_PROVIDER_API_KEY and never reaches the browser. When no
// key is configured, `getAIProvider()` returns an unavailable provider and
// callers fall back to their deterministic path. Providers are pluggable:
// set AI_PROVIDER=anthropic|openai and (optionally) AI_MODEL.

export interface AIProvider {
  readonly available: boolean;
  readonly name: string;
  /** Returns the model's text completion, or throws on transport error. */
  generate(system: string, user: string): Promise<string>;
}

class UnavailableProvider implements AIProvider {
  readonly available = false;
  readonly name = "none";
  async generate(): Promise<string> {
    throw new Error("No AI provider configured (set AI_PROVIDER_API_KEY).");
  }
}

class AnthropicProvider implements AIProvider {
  readonly available = true;
  readonly name = "anthropic";
  constructor(
    private key: string,
    private model: string,
  ) {}

  async generate(system: string, user: string): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: user }],
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Anthropic request failed (${res.status}).`);
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    return (data.content ?? [])
      .map((c) => c.text ?? "")
      .join("")
      .trim();
  }
}

class OpenAIProvider implements AIProvider {
  readonly available = true;
  readonly name = "openai";
  constructor(
    private key: string,
    private model: string,
    private baseUrl: string,
  ) {}

  async generate(system: string, user: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 1024,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`OpenAI request failed (${res.status}).`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return (data.choices?.[0]?.message?.content ?? "").trim();
  }
}

let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cached) return cached;

  const key = process.env.AI_PROVIDER_API_KEY;
  if (!key) {
    cached = new UnavailableProvider();
    return cached;
  }

  const provider = (process.env.AI_PROVIDER ?? "anthropic").toLowerCase();
  if (provider === "openai") {
    cached = new OpenAIProvider(
      key,
      process.env.AI_MODEL ?? "gpt-4o-mini",
      process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
    );
  } else {
    cached = new AnthropicProvider(
      key,
      process.env.AI_MODEL ?? "claude-3-5-haiku-latest",
    );
  }
  return cached;
}
