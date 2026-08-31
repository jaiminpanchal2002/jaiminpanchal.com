// Server-only Apify integration. The token NEVER reaches the browser — this
// module is only imported by server actions. Without a token it throws
// ApifyNotConfiguredError, which callers surface as a friendly message.
//
// Default actor: valig/indeed-jobs-scraper (id TrtlecxAsNRbKl1na).
// Input schema: { country, title, location, limit, datePosted }.

export interface NormalizedJob {
  title: string;
  company: string;
  location: string | null;
  workMode: string | null;
  url: string | null;
  description: string | null;
  salary: string | null;
  skills: string[];
  source: string;
  postedAt: Date | null;
}

export class ApifyNotConfiguredError extends Error {
  constructor() {
    super("APIFY_API_TOKEN is not configured.");
    this.name = "ApifyNotConfiguredError";
  }
}

export interface JobQuery {
  query: string;
  location?: string;
  limit?: number;
  country?: string;
  datePosted?: string; // days: "1" | "7" | "14" | "30"
}

function inferWorkMode(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("remote")) return "remote";
  if (t.includes("hybrid")) return "hybrid";
  if (t.includes("on-site") || t.includes("onsite") || t.includes("in office"))
    return "onsite";
  return null;
}

interface IndeedLocation {
  city?: string;
  admin1Code?: string;
  countryName?: string;
}
interface IndeedSalary {
  min?: number | null;
  max?: number | null;
  unitOfWork?: string | null;
  currencyCode?: string | null;
}
interface IndeedItem {
  title?: string;
  url?: string;
  jobUrl?: string;
  datePublished?: string;
  location?: IndeedLocation;
  employer?: { name?: string };
  attributes?: Record<string, string>;
  baseSalary?: IndeedSalary;
  description?: { text?: string };
}

function buildLocation(loc?: IndeedLocation): string | null {
  if (!loc) return null;
  const parts = [loc.city, loc.countryName].filter(
    (p): p is string => !!p && p.trim() !== "",
  );
  return parts.length ? parts.join(", ") : loc.admin1Code || null;
}

function buildSalary(bs?: IndeedSalary): string | null {
  if (!bs || (bs.min == null && bs.max == null)) return null;
  const cur = bs.currencyCode ? `${bs.currencyCode} ` : "";
  const unit = bs.unitOfWork ? ` / ${bs.unitOfWork}` : "";
  if (bs.min != null && bs.max != null)
    return `${cur}${bs.min}–${bs.max}${unit}`.trim();
  return `${cur}${bs.min ?? bs.max}${unit}`.trim();
}

function normalize(item: IndeedItem): NormalizedJob {
  const desc = item.description?.text ?? null;
  const title = item.title?.trim() || "Untitled role";
  const posted = item.datePublished ? new Date(item.datePublished) : null;
  return {
    title,
    company: item.employer?.name?.trim() || "Unknown company",
    location: buildLocation(item.location),
    workMode: inferWorkMode(`${title} ${desc ?? ""}`),
    url: item.url || item.jobUrl || null,
    description: desc,
    salary: buildSalary(item.baseSalary),
    // Indeed's `attributes` map values are exactly the skill / keyword tags.
    skills: Object.values(item.attributes ?? {})
      .map(String)
      .filter(Boolean),
    source: "apify:indeed",
    postedAt: posted && !Number.isNaN(posted.getTime()) ? posted : null,
  };
}

export async function fetchJobsFromApify(
  params: JobQuery,
): Promise<NormalizedJob[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new ApifyNotConfiguredError();

  const actor = process.env.APIFY_JOBS_ACTOR ?? "TrtlecxAsNRbKl1na";
  const endpoint = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${encodeURIComponent(
    token,
  )}`;

  const input = {
    country: (params.country || "in").toLowerCase(),
    title: params.query,
    location: params.location ?? "",
    limit: Math.min(params.limit ?? 20, 50),
    datePosted: params.datePosted ?? "7",
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Apify request failed (${res.status}).`);
  }

  const items = (await res.json()) as IndeedItem[];
  return (Array.isArray(items) ? items : []).map(normalize);
}
