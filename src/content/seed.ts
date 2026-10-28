/**
 * Local seed content.
 *
 * Used when Sanity is not configured, and as the source for `npm run seed:export`
 * (which writes an NDJSON file for `sanity dataset import`).
 *
 * RULE: only facts supplied by the site owner are marked `verified: true`.
 * Everything else is a clearly-labelled draft with `verificationTasks`, and is
 * hidden in production. See CONTENT_CHECKLIST.md.
 */
import { pt, readingMinutes } from "./pt";
import type {
  CaseStudy,
  Certification,
  Education,
  Experience,
  HomePage,
  Metric,
  NowPage,
  Post,
  Profile,
  Project,
  SiteSettings,
  Skill,
  SkillCategory,
} from "./types";

export const siteSettings: SiteSettings = {
  siteName: "JAIMIN / BEYOND CODE",
  tagline: "I build digital products. I think beyond code.",
  description:
    "Jaimin Panchal is an AI Full Stack Developer and Project Manager in Ahmedabad, India, working across engineering, AI-enabled applications and product delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jaiminpanchal.com",
  mainNav: [
    { label: "Work", href: "/work", visible: true },
    { label: "Experience", href: "/experience", visible: true },
    { label: "About", href: "/about", visible: true },
    { label: "Writing", href: "/blog", visible: true },
  ],
  footerNav: [
    { label: "Case studies", href: "/case-studies", visible: true },
    { label: "Skills", href: "/skills", visible: true },
    { label: "Now", href: "/now", visible: true },
    { label: "Resume", href: "/resume", visible: true },
    { label: "Enter the universe", href: "/universe", visible: true },
  ],
  defaultTheme: "dark",
  animationPreset: "cinematic",
  introEnabled: true,
};

export const profile: Profile = {
  name: "Jaimin Panchal",
  title: "AI Full Stack Developer / Project Manager",
  headline: "I build digital products. I think beyond code.",
  shortBio:
    "AI Full Stack Developer / Project Manager focused on engineering, product thinking, and meaningful digital experiences.",
  bio: pt(`
I work at the point where engineering meets product decisions. My background is in building web applications with **PHP, Laravel, JavaScript, Vue.js and React**, backed by **MySQL and PostgreSQL**, and connected through REST APIs.

Today, as an AI Full Stack Developer and Project Manager at PrimeQA Solutions, my work spans writing code, shaping how systems are put together, and coordinating the delivery of the products those systems serve.

I care about software that is reliable first and impressive second, and about the decisions behind it: what to build, what to leave out, and how to keep a product maintainable after launch.
`),
  location: "Ahmedabad, Gujarat, India",
  timezone: "Asia/Kolkata",
  email: undefined, // add a public contact address in the CMS
  availability: undefined,
  resumeUrl: undefined, // upload a PDF in the CMS
  // GitHub provided by the owner (repository jaiminpanchal2002/jaiminpanchal.com). Add LinkedIn in the CMS.
  socialLinks: [{ platform: "github", label: "GitHub", url: "https://github.com/jaiminpanchal2002" }],
  interests: ["Backend architecture", "AI-enabled applications", "API design", "Product thinking", "Software delivery", "Developer productivity"],
  principles: [
    { title: "Understand before building", body: "Most expensive bugs start as misunderstood requirements. Time spent on the problem is rarely wasted." },
    { title: "Prefer boring, reliable systems", body: "Choose proven tools for the core and spend novelty where it creates real value for users." },
    { title: "Make progress visible", body: "Small, demonstrable increments keep teams aligned and surface risks while they are still cheap." },
    { title: "Own the outcome, not just the ticket", body: "Shipping is a milestone. A product that keeps working and keeps improving is the goal." },
  ],
  philosophy:
    "Good engineering is a series of well-reasoned decisions. Code is how those decisions become real, so it should be clear enough that the next person can understand why.",
  currentFocus: "Engineering and delivering AI-enabled products at PrimeQA Solutions.",
};

export const homePage: HomePage = {
  heroKicker: "Engineering × AI × Product Thinking",
  heroGreeting: "Hello, I'm Jaimin.",
  heroHeadline: ["I build digital products.", "I think beyond code."],
  heroSupporting:
    "AI Full Stack Developer / Project Manager focused on engineering, product thinking, and meaningful digital experiences.",
  primaryCta: { label: "Explore my work", href: "/work" },
  secondaryCta: { label: "Let's connect", href: "/contact" },
  heroVariant: "lattice",
  storyHeadline: "More than code. It's about what we create.",
  storyBeats: [
    { title: "An engineering foundation", body: "A background in building web applications with PHP, Laravel, JavaScript and modern front-end frameworks, on top of relational databases." },
    { title: "Systems that hold up", body: "An interest in how software behaves at scale: clean data models, predictable APIs, and code a team can keep changing." },
    { title: "AI, applied with judgement", body: "Bringing AI capabilities into real products where they solve a concrete problem, not as a feature for its own sake." },
    { title: "Product and people", body: "Working across roles to turn requirements into a plan, a plan into releases, and releases into something users rely on." },
  ],
  processSteps: [
    { title: "Understand the problem", body: "Clarify who it is for, what success looks like, and which constraints are real." },
    { title: "Define the solution", body: "Shape scope, trade-offs and a delivery plan before the first line of code." },
    { title: "Architect the system", body: "Data model, boundaries and integrations chosen for clarity and room to grow." },
    { title: "Build and iterate", body: "Ship in small increments, review often, and let feedback steer the next step." },
    { title: "Validate and deliver", body: "Test against the original goal, release with care, and keep improving after launch." },
  ],
  contactHeadline: "Let's turn an ambitious idea into something real.",
  collaborationInterests: ["Hiring opportunities", "Product collaboration", "Engineering consulting", "Freelance projects"],
  sections: [
    { key: "story", visible: true },
    { key: "experience", visible: true },
    { key: "work", visible: true },
    { key: "process", visible: true },
    { key: "capabilities", visible: true },
    { key: "impact", visible: true },
    { key: "writing", visible: true },
    { key: "contact", visible: true },
  ],
  featuredProjectSlugs: ["spot-it-now", "feedbackiq", "nexcart", "federal-forecasting-app"],
};

export const experiences: Experience[] = [
  {
    _id: "exp-primeqa",
    company: "PrimeQA Solutions",
    role: "AI Full Stack Developer / Project Manager",
    employmentType: "full-time",
    location: "Ahmedabad, India",
    current: true,
    summary: "Full stack engineering on AI-enabled applications, combined with project management and delivery responsibilities.",
    responsibilities: [],
    achievements: [],
    technologies: [],
    projectSlugs: [],
    verified: true,
    verificationNotes: "Add start date, employment type confirmation, responsibilities, achievements and related projects.",
    order: 1,
  },
  {
    _id: "exp-freelance",
    company: "Independent",
    role: "Freelance Software Engineer",
    employmentType: "freelance",
    summary: "Independent software engineering engagements.",
    responsibilities: [],
    achievements: [],
    technologies: [],
    projectSlugs: [],
    verified: true,
    verificationNotes: "Add dates (may overlap with other roles), engagement types and verified projects.",
    order: 2,
  },
  {
    _id: "exp-sapphire",
    company: "Sapphire Software Solution",
    role: "Software Engineer",
    employmentType: "full-time",
    summary: "Software engineering role building web applications.",
    responsibilities: [],
    achievements: [],
    technologies: [],
    projectSlugs: [],
    verified: true,
    verificationNotes: "Add dates, location, responsibilities, technologies and achievements.",
    order: 3,
  },
];

export const education: Education[] = [
  {
    _id: "edu-indus",
    institution: "Indus University",
    degree: "B.Tech",
    field: "Computer Science and Engineering",
    verified: true,
  },
];

export const certifications: Certification[] = [];

export const skillCategories: SkillCategory[] = [
  { _id: "sc-backend", title: "Backend engineering", slug: "backend", description: "Server-side applications, business logic and APIs.", order: 1 },
  { _id: "sc-frontend", title: "Frontend engineering", slug: "frontend", description: "Interactive interfaces for the web.", order: 2 },
  { _id: "sc-apis", title: "APIs and integrations", slug: "apis", description: "Connecting systems through well-defined contracts.", order: 3 },
  { _id: "sc-data", title: "Data and databases", slug: "data", description: "Relational data modelling and querying.", order: 4 },
  { _id: "sc-ai", title: "AI-enabled applications", slug: "ai", description: "Applying AI capabilities inside real products.", order: 5 },
  { _id: "sc-tools", title: "Engineering practice", slug: "tools", description: "The tools and habits that keep software shippable.", order: 6 },
  { _id: "sc-delivery", title: "Delivery and coordination", slug: "delivery", description: "Turning requirements into planned, shipped work.", order: 7 },
];

const skill = (
  name: string,
  category: string,
  description: string,
  order: number,
  verified = true,
): Skill => ({ _id: `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name, category, description, order, projectSlugs: [], visible: true, verified });

export const skills: Skill[] = [
  skill("PHP", "backend", "Server-side programming for web applications.", 1),
  skill("Laravel", "backend", "Building web applications and APIs with the Laravel framework.", 2),
  skill("Python", "backend", "Scripting, services and AI-related tooling.", 3),
  skill("JavaScript", "frontend", "The language of the browser, used across front-end and tooling work.", 1),
  skill("TypeScript", "frontend", "Typed JavaScript for safer, more maintainable codebases.", 2),
  skill("Vue.js", "frontend", "Component-based interfaces with the Vue ecosystem.", 3),
  skill("React.js", "frontend", "Component-based interfaces with React.", 4),
  skill("REST APIs", "apis", "Designing and consuming resource-oriented HTTP APIs.", 1),
  skill("Application development", "apis", "End-to-end application work, from data layer to interface.", 2),
  skill("MySQL", "data", "Relational schema design and SQL querying.", 1),
  skill("PostgreSQL", "data", "Relational data with PostgreSQL.", 2),
  skill("AI-related engineering", "ai", "Integrating AI capabilities into applications.", 1),
  skill("Git", "tools", "Version control and collaborative workflows.", 1),
  skill("Testing", "tools", "Automated tests that protect behaviour as code changes.", 2),
  skill("CI/CD", "tools", "Automated build and deployment pipelines.", 3, false),
  skill("Docker", "tools", "Containerised development and deployment.", 4, false),
  skill("Requirements understanding", "delivery", "Turning stakeholder needs into clear, buildable scope.", 1),
  skill("Project coordination", "delivery", "Planning, sequencing and tracking delivery across a team.", 2),
  skill("Software delivery", "delivery", "Getting working software into users' hands reliably.", 3),
  skill("Technical planning", "delivery", "Estimating, de-risking and sequencing technical work.", 4),
];

export const metrics: Metric[] = [
  { _id: "m-platforms", value: 5, label: "Live platforms", explanation: "Production platforms contributed to.", context: "Assign to the correct role or projects before publishing.", verified: false },
  { _id: "m-orders", value: 10000, suffix: "+", label: "Monthly orders", explanation: "Orders handled per month by a platform worked on.", context: "Name the platform and your role before publishing.", verified: false },
  { _id: "m-coverage", value: 85, suffix: "%", label: "Test coverage", explanation: "Automated test coverage reached on a project.", context: "Name the project and how coverage was measured.", verified: false },
];

const draftProject = (title: string, slug: string, order: number, featured: boolean, accent: Project["accent"]): Project => ({
  _id: `project-${slug}`,
  title,
  slug,
  summary: "Project summary awaiting verification by the site owner.",
  category: "Unclassified",
  projectType: "product",
  featured,
  order,
  technologies: [],
  objectives: [],
  features: [],
  challenges: [],
  outcomes: [],
  gallery: [],
  videos: [],
  accent,
  verified: false,
  verificationTasks: [
    "Confirm the project name and public status",
    "Write a one-sentence summary and category",
    "Confirm your role and team contribution",
    "List technologies actually used",
    "Add screenshots or video (no confidential data)",
    "Add live demo / public repository links only if public",
    "Add verified outcomes, or leave empty",
  ],
});

export const projects: Project[] = [
  draftProject("Spot It Now", "spot-it-now", 1, true, "blue"),
  draftProject("FeedbackIQ", "feedbackiq", 2, true, "cyan"),
  draftProject("NexCart", "nexcart", 3, true, "violet"),
  draftProject("Federal Forecasting App", "federal-forecasting-app", 4, true, "blue"),
  draftProject("Stock Saathi", "stock-saathi", 5, false, "cyan"),
  draftProject("Fastest Finger First", "fastest-finger-first", 6, false, "violet"),
];

const templateNotice =
  ":::warning\nThis is template content that shows how the layout handles each block type. Replace it with a real article written and approved by the author before publishing.\n:::";

const samplePostBody = pt(`
${templateNotice}

## What this template supports

Articles are written in the CMS as structured rich text. Headings become the table of contents, and every block below renders with consistent typography.

### Inline formatting

Text can include **strong emphasis** and inline \`code\` references.

> Pull quotes give a single idea room to breathe.

## Code blocks

\`\`\`ts
export async function getPublishedPosts() {
  return client.fetch(postsQuery, {}, { next: { tags: ["post"] } });
}
\`\`\`

:::note
Callouts highlight context the reader should not miss.
:::

- Lists keep related points scannable
- Each item stays short
- Markers use the accent colour
`);

export const posts: Post[] = [
  {
    _id: "post-template",
    title: "Template sample: how articles render",
    slug: "template-sample-article",
    excerpt: "A layout sample covering headings, code, callouts and lists. Replace with a real article before publishing.",
    category: "Template",
    tags: ["template"],
    body: samplePostBody,
    publishedAt: "2026-10-28",
    featured: true,
    readingMinutes: readingMinutes(samplePostBody),
    verified: false,
  },
];

const cs = (heading: string, kind: CaseStudy["sections"][number]["kind"], text: string) => ({
  _key: kind,
  heading,
  kind,
  body: pt(text),
});

export const caseStudies: CaseStudy[] = [
  {
    _id: "case-template-engineering",
    title: "Template sample: engineering case study",
    slug: "template-engineering-case-study",
    template: "engineering",
    excerpt: "The structure an engineering case study follows. Replace every section with real, approved content.",
    role: "Your role on the project",
    team: "Team size and composition",
    sections: [
      cs("Business context", "context", `${templateNotice}\n\nDescribe the organisation, product and why the work mattered.`),
      cs("Problem statement", "problem", "State the problem in one or two sentences a non-engineer would understand."),
      cs("Constraints", "constraints", "- Time, budget or team limits\n- Legacy systems or data\n- Compliance or security requirements"),
      cs("Architecture decisions", "decisions", "Explain the key decisions and the reasoning behind each."),
      cs("Alternatives considered", "alternatives", "What else was evaluated, and why it was not chosen."),
      cs("Implementation", "implementation", "How the solution was built and shipped."),
      cs("Trade-offs", "tradeoffs", "What was given up, and why that was acceptable."),
      cs("Outcome", "outcome", "Results, backed by evidence the owner can stand behind."),
      cs("Retrospective", "retrospective", "What you would repeat, and what you would change."),
    ],
    evidence: [],
    verified: false,
  },
  {
    _id: "case-template-delivery",
    title: "Template sample: product delivery case study",
    slug: "template-product-delivery-case-study",
    template: "product-delivery",
    excerpt: "The structure a product-delivery case study follows: discovery, planning, coordination and results.",
    sections: [
      cs("Context", "context", `${templateNotice}\n\nWho the product served and what the delivery goal was.`),
      cs("Discovery", "discovery", "How requirements were gathered and validated."),
      cs("Delivery plan", "decisions", "Scope, milestones and how risk was managed."),
      cs("Execution", "implementation", "How the team coordinated, and how progress was made visible."),
      cs("Challenges", "challenges", "What went wrong and how it was handled."),
      cs("Outcome", "outcome", "Verified results."),
      cs("Retrospective", "retrospective", "Lessons for the next delivery."),
    ],
    evidence: [],
    verified: false,
  },
];

export const nowPage: NowPage = {
  updatedAt: "2026-10-28",
  intro: "What currently has my attention. This page is updated by hand.",
  items: [
    { label: "Work", body: "AI Full Stack Developer / Project Manager at PrimeQA Solutions in Ahmedabad." },
    { label: "Focus", body: "Engineering AI-enabled applications and coordinating how they are delivered." },
    { label: "Building", body: "This site: JAIMIN / BEYOND CODE, a CMS-driven portfolio with a WebGL hero." },
  ],
  verified: true,
};
