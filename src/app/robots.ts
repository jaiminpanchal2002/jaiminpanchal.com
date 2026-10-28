import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// AI search / answer engines that cite sources. Allowed explicitly so the profile can be
// quoted in AI answers (GEO); private paths stay blocked for everyone.
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"];
const PRIVATE = ["/studio", "/api/"];

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
  return {
    // Preview deployments are never indexed.
    rules: isProd
      ? [
          { userAgent: "*", allow: "/", disallow: PRIVATE },
          { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
