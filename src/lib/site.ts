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
  "Jaimin Panchal is an AI Full Stack Developer and Project Manager at PrimeQA Solutions in Ahmedabad, India, building web products with Laravel, PHP, Vue.js, React, TypeScript, MySQL and PostgreSQL.";

/**
 * Search phrases this site should be the answer to. Search engines largely ignore the
 * keywords meta tag; these mainly document intent and feed metadata + JSON-LD knowsAbout.
 */
export const KEYWORDS = [
  "Jaimin Panchal",
  "Jaimin Panchal developer",
  "Jaimin Panchal portfolio",
  "Jaimin Panchal PrimeQA Solutions",
  "Jaimin Panchal Ahmedabad",
  "AI Full Stack Developer",
  "AI Full Stack Developer Ahmedabad",
  "Full Stack Developer Ahmedabad",
  "Full Stack Developer India",
  "Project Manager Ahmedabad",
  "Laravel developer Ahmedabad",
  "PHP Laravel developer India",
  "Vue.js developer",
  "React developer",
  "TypeScript developer",
  "REST API developer",
  "MySQL PostgreSQL developer",
  "AI-enabled web applications",
  "Indus University Computer Science",
];

export const KNOWS_ABOUT = [
  "Full stack web development",
  "AI-enabled applications",
  "Project management",
  "PHP",
  "Laravel",
  "JavaScript",
  "TypeScript",
  "Vue.js",
  "React",
  "Python",
  "REST APIs",
  "MySQL",
  "PostgreSQL",
  "Software delivery",
];
