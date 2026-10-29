/**
 * Site-wide SEO constants. Facts here must stay true: role, employer, location and
 * education come from the owner; nothing is added to rank for things he doesn't do.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jaiminpanchal.com").replace(/\/$/, "");

export const PERSON = {
  name: "Jaimin Panchal",
  givenName: "Jaimin",
  familyName: "Panchal",
  jobTitle: "AI Full Stack Developer / Project Manager",
  employer: "PrimeQA Solutions",
  alumniOf: "Indus University",
  city: "Ahmedabad",
  region: "Gujarat",
  country: "IN",
} as const;

/** Default title: name first (what people search), then role and place. */
export const DEFAULT_TITLE = "Jaimin Panchal | AI Full Stack Developer & Project Manager, Ahmedabad";

export const DEFAULT_DESCRIPTION =
  "Jaimin Panchal is an AI Full Stack Developer and backend engineer in Ahmedabad, India. He builds Laravel, Node.js and Python systems: REST APIs, multi-tenant SaaS, fintech integrations, real-time platforms and AI agents.";

/**
 * Search phrases this site should be the answer to. Search engines largely ignore the
 * keywords meta tag; these mainly document intent and feed metadata + JSON-LD knowsAbout.
 */
export const KEYWORDS = [
  // Name and brand
  "Jaimin Panchal",
  "Jaimin Panchal developer",
  "Jaimin Panchal portfolio",
  "Jaimin Panchal Laravel",
  "Jaimin Panchal PrimeQA Solutions",
  "Jaimin Panchal Ahmedabad",
  "Jaimin Panchal Indus University",
  "jaiminpanchal2002",
  // Roles
  "AI Full Stack Developer",
  "AI Full Stack Developer Ahmedabad",
  "Backend Software Engineer",
  "Backend developer Ahmedabad",
  "Full Stack Developer Ahmedabad",
  "Full Stack Developer India",
  "Laravel developer Ahmedabad",
  "Laravel developer India",
  "PHP Laravel developer",
  "Freelance Laravel developer",
  "Hire Laravel developer India",
  "Node.js developer Ahmedabad",
  "Python FastAPI developer",
  // Services and specialities
  "REST API development",
  "Multi-tenant SaaS development",
  "AI integration developer",
  "LLM RAG developer",
  "AI agent developer",
  "Flutter app backend developer",
  "Stripe PayPal integration developer",
  "Fintech API integration",
  "Real-time WebSocket development",
  "Docker CI/CD GitHub Actions",
  "Software developer Gujarat",
];

export const KNOWS_ABOUT = [
  "Backend development",
  "Full stack web development",
  "REST API design",
  "Multi-tenant SaaS architecture",
  "AI-enabled applications",
  "Retrieval-augmented generation (RAG)",
  "AI agents and tool calling",
  "PHP",
  "Laravel",
  "Node.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "FastAPI",
  "Vue.js",
  "MySQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "GitHub Actions",
  "AWS",
  "Stripe",
  "WebSockets",
  "Project management",
];
