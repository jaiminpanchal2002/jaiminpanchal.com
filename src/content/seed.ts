/**
 * Seed content.
 *
 * Source of truth for the initial CMS import (`npm run seed:push`) and the fallback
 * used when Sanity is not configured.
 *
 * Facts come from the owner: his resume (JAIMIN_PANCHAL_BACKEND.pdf, Oct 2026) and his
 * public GitHub profile (github.com/jaiminpanchal2002). Those records are `verified: true`.
 * Anything not backed by either stays an unpublished draft.
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
  Service,
  SiteSettings,
  Skill,
  SkillCategory,
} from "./types";

const GH = "https://github.com/jaiminpanchal2002";

export const siteSettings: SiteSettings = {
  siteName: "JAIMIN / BEYOND CODE",
  tagline: "I build digital products. I think beyond code.",
  description:
    "Jaimin Panchal is an AI Full Stack Developer and backend engineer in Ahmedabad, India, building Laravel, Node.js and Python systems: multi-tenant SaaS, fintech integrations and AI agents.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jaiminpanchal.com",
  mainNav: [
    { label: "Work", href: "/work", visible: true },
    { label: "Services", href: "/services", visible: true },
    { label: "Experience", href: "/experience", visible: true },
    { label: "About", href: "/about", visible: true },
    { label: "Writing", href: "/blog", visible: true },
  ],
  footerNav: [
    { label: "Skills", href: "/skills", visible: true },
    { label: "Case studies", href: "/case-studies", visible: true },
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
    "AI Full Stack Developer and backend engineer building production Laravel, Node.js and Python systems: multi-tenant SaaS, fintech integrations, real-time platforms and AI agents.",
  bio: pt(`
I'm a backend-focused full stack engineer in Ahmedabad. Since July 2023 I've designed and shipped production backends across **fintech, e-commerce, SaaS, social networking and real-time auction** platforms, mostly with **Laravel, MySQL, Vue.js and REST APIs**.

At Sapphire Software Solution I built order-processing systems handling **10,000+ monthly orders** with Redis queues, scheduled tasks and event-driven workflows, secured REST APIs for Flutter apps, and integrated Stripe, PayPal, Twilio, Firebase, Accord Fintech, Kite and KYC services. That work earned me **Employee of the Quarter (2025)** and the **Emerging Star Award (2024)**.

As a freelancer I built RESTful APIs for mobile and web apps, including geospatial feeds, OTP authentication and notifications, and set up Docker environments with GitHub Actions CI/CD. Today, as an AI Full Stack Developer at **PrimeQA Solutions**, I work on AI-enabled web applications, backend integrations and API-driven workflows.

Outside client work I build in the open: multi-tenant SaaS in TypeScript and Laravel, RAG pipelines and AI agents in Python, and event-driven systems in Java. I hold a B.Tech in Computer Science and Engineering from Indus University (CGPA 8.89/10) and the IBM Project Manager Professional Certificate.
`),
  location: "Ahmedabad, Gujarat, India",
  timezone: "Asia/Kolkata",
  email: "jaiminmpanchal02@gmail.com",
  availability: "Open to backend, full stack and AI engineering roles and projects.",
  // Fallback when the CMS has no portrait; the CMS copy is uploaded by scripts/set-profile-media.ts
  portrait: { _type: "image", asset: { url: "/images/jaimin-panchal.png", metadata: { dimensions: { width: 400, height: 400 } } }, alt: "Portrait of Jaimin Panchal" },
  resumeUrl: undefined, // upload the PDF in the CMS (Personal profile > Resume)
  socialLinks: [
    { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/jaiminpanchal2002/" },
    { platform: "github", label: "GitHub", url: GH },
  ],
  interests: ["Backend architecture", "Multi-tenant SaaS", "AI agents and RAG", "API design", "Event-driven systems", "Payments and fintech", "Developer productivity"],
  principles: [
    { title: "Understand before building", body: "Most expensive bugs start as misunderstood requirements. Time spent on the problem is rarely wasted." },
    { title: "Prefer boring, reliable systems", body: "Proven tools for the core, queues for anything slow, and novelty only where it creates real value." },
    { title: "Make progress visible", body: "Small, demonstrable increments keep teams aligned and surface risks while they are still cheap." },
    { title: "Own the outcome, not just the ticket", body: "Shipping is a milestone. A product that keeps working, and keeps improving, is the goal." },
  ],
  philosophy:
    "Good engineering is a series of well-reasoned decisions. Code is how those decisions become real, so it should be clear enough that the next person can understand why.",
  currentFocus: "AI-enabled web applications, backend integrations and API-driven workflows at PrimeQA Solutions.",
};

export const homePage: HomePage = {
  heroKicker: "Engineering × AI × Product Thinking",
  heroGreeting: "Hello, I'm Jaimin.",
  heroHeadline: ["I build digital products.", "I think beyond code."],
  heroSupporting:
    "AI Full Stack Developer and backend engineer: Laravel, Node.js and Python systems, from multi-tenant SaaS to AI agents.",
  primaryCta: { label: "Explore my work", href: "/work" },
  secondaryCta: { label: "Let's connect", href: "/contact" },
  heroVariant: "lattice",
  storyHeadline: "More than code. It's about what we create.",
  storyBeats: [
    { title: "Production backends since 2023", body: "Laravel and MySQL systems for fintech, e-commerce, SaaS, social and real-time auction platforms." },
    { title: "Systems that hold up", body: "Queues, scheduled jobs, indexing and event-driven workflows for order volumes of 10,000+ a month." },
    { title: "AI, applied with judgement", body: "LLM classification, RAG pipelines and tool-calling agents, built with evaluation and guardrails." },
    { title: "Product and people", body: "Agile delivery, code reviews and cross-functional work, backed by IBM project management training." },
  ],
  processSteps: [
    { title: "Understand the problem", body: "Clarify who it is for, what success looks like, and which constraints are real." },
    { title: "Define the solution", body: "Shape scope, trade-offs and a delivery plan before the first line of code." },
    { title: "Architect the system", body: "Data model, boundaries and integrations chosen for clarity and room to grow." },
    { title: "Build and iterate", body: "Ship in small increments, review often, and let feedback steer the next step." },
    { title: "Validate and deliver", body: "Test against the original goal, release with care, and keep improving after launch." },
  ],
  contactHeadline: "Let's turn an ambitious idea into something real.",
  collaborationInterests: ["Hiring opportunities", "Backend and API projects", "AI integration", "Engineering consulting"],
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
  featuredProjectSlugs: ["feedbackiq", "qa-management-platform", "resolve-ai", "hiral-international-courier"],
};

export const experiences: Experience[] = [
  {
    _id: "exp-primeqa",
    company: "PrimeQA Solutions",
    role: "AI Full Stack Developer",
    employmentType: "full-time",
    location: "Ahmedabad, India",
    startDate: "2026-09",
    current: true,
    summary: "AI-enabled web applications, backend integrations and API-driven workflows using modern full stack engineering practices.",
    responsibilities: [
      "Contributing to AI-enabled web applications, backend integrations, and API-driven workflows.",
      "Applying REST API development, authentication, relational databases, and modular architecture to build maintainable application components.",
    ],
    achievements: [],
    technologies: ["TypeScript", "Node.js", "Next.js", "PostgreSQL", "REST APIs", "LLM integration"],
    projectSlugs: [],
    verified: true,
    order: 1,
  },
  {
    _id: "exp-freelance",
    company: "Independent",
    role: "Freelance Software Engineer (Backend / Full Stack)",
    employmentType: "freelance",
    location: "Remote",
    startDate: "2025-09",
    endDate: "2026-08",
    summary: "Backend and full stack engagements for mobile and web applications.",
    responsibilities: [
      "Designed and implemented RESTful APIs using Laravel and MySQL for mobile and web applications, including geospatial feeds, media uploads, and administrative workflows.",
      "Developed secure authentication, OTP verification, notification systems, third-party API integrations, and reusable backend services.",
      "Containerized application environments using Docker and configured GitHub Actions for automated CI/CD workflows.",
    ],
    achievements: [],
    technologies: ["Laravel", "PHP", "MySQL", "Docker", "GitHub Actions", "REST APIs"],
    projectSlugs: ["spot-it-now", "kind-act"],
    verified: true,
    order: 2,
  },
  {
    _id: "exp-sapphire",
    company: "Sapphire Software Solution",
    role: "Software Engineer (PHP / Laravel)",
    employmentType: "full-time",
    location: "Ahmedabad, India",
    startDate: "2023-07",
    endDate: "2025-08",
    summary: "Production backend applications across fintech, e-commerce, SaaS, social networking and real-time auction platforms.",
    responsibilities: [
      "Designed, developed, and maintained production backend applications using Laravel, MySQL, Vue.js, and REST APIs.",
      "Engineered secure REST APIs for Flutter Android/iOS applications, including authentication, payment processing, notifications, content management, and user-specific workflows.",
      "Integrated Stripe, PayPal, Twilio, Firebase, Accord Fintech, Kite, and KYC APIs for payments, stock-market data, identity verification, and external services.",
      "Developed reusable service-layer components, role-based access control, input validation, and secure API workflows.",
      "Implemented real-time features using WebSockets, events, and queued notifications for bidding, transaction updates, and communication workflows.",
      "Collaborated with cross-functional teams on application delivery, production debugging, code improvements, and API integrations.",
    ],
    achievements: [
      "Implemented asynchronous job processing, Redis queues, scheduled tasks, and event-driven workflows for commerce systems handling 10,000+ monthly orders.",
      "Resolved database bottlenecks by optimizing SQL queries, indexing strategies, and data access patterns, improving backend responsiveness.",
      "Received Employee of the Quarter (2025) and the Emerging Star Award (2024).",
    ],
    technologies: ["Laravel", "PHP", "MySQL", "Redis", "Vue.js", "WebSockets", "Stripe", "Twilio", "Firebase"],
    projectSlugs: ["federal-forecasting-app", "stock-saathi", "fastest-finger-first", "madigital", "beauty-inkstitute", "auction-platform"],
    verified: true,
    order: 3,
  },
];

export const education: Education[] = [
  {
    _id: "edu-indus",
    institution: "Indus University",
    degree: "B.Tech",
    field: "Computer Science and Engineering",
    startYear: 2019,
    endYear: 2023,
    notes: "CGPA 8.89/10",
    verified: true,
  },
];

export const certifications: Certification[] = [
  { _id: "cert-ibm-pm", name: "IBM Project Manager Professional Certificate", issuer: "IBM via Coursera (Agile/Scrum, SDLC, project delivery)", issued: "2026", verified: true },
  { _id: "cert-genai", name: "Generative AI Mastermind", issuer: "Outskill (LLM applications, prompt engineering)", issued: "2026", verified: true },
];

export const skillCategories: SkillCategory[] = [
  { _id: "sc-backend", title: "Backend engineering", slug: "backend", description: "Server-side applications, APIs, queues and integrations.", order: 1 },
  { _id: "sc-languages", title: "Languages", slug: "languages", description: "The languages I ship production code in.", order: 2 },
  { _id: "sc-data", title: "Databases and ORMs", slug: "data", description: "Relational data, caching and query performance.", order: 3 },
  { _id: "sc-architecture", title: "Architecture and security", slug: "architecture", description: "Structuring systems that stay secure and maintainable.", order: 4 },
  { _id: "sc-ai", title: "AI engineering", slug: "ai", description: "LLMs inside real products, with evaluation and guardrails.", order: 5 },
  { _id: "sc-cloud", title: "Cloud and DevOps", slug: "cloud", description: "Shipping and running software reliably.", order: 6 },
  { _id: "sc-testing", title: "Testing", slug: "testing", description: "Automated tests that protect behaviour as code changes.", order: 7 },
  { _id: "sc-delivery", title: "Delivery and practices", slug: "delivery", description: "How the work gets planned, reviewed and shipped.", order: 8 },
];

const skill = (name: string, category: string, description: string, order: number, projectSlugs: string[] = []): Skill => ({
  _id: `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  name,
  category,
  description,
  order,
  projectSlugs,
  visible: true,
  verified: true,
});

export const skills: Skill[] = [
  skill("Laravel", "backend", "Production APIs, queues, events and scheduled jobs with Laravel (through Laravel 11).", 1, ["feedbackiq", "flowboard", "stock-saathi"]),
  skill("Node.js", "backend", "TypeScript services and server APIs on the Node.js runtime.", 2, ["qa-management-platform"]),
  skill("Next.js server APIs", "backend", "Route handlers and server-side APIs in Next.js apps.", 3, ["hiral-international-courier"]),
  skill("RESTful APIs", "backend", "Resource-oriented APIs for web and Flutter mobile apps.", 4),
  skill("API integrations and webhooks", "backend", "Stripe, PayPal, Twilio, Firebase, Accord Fintech, Kite and KYC providers.", 5, ["stock-saathi", "madigital"]),
  skill("Background jobs and queues", "backend", "Redis queues and async workers that keep endpoints fast.", 6, ["feedbackiq"]),
  skill("FastAPI", "backend", "Async Python APIs with background workers.", 7, ["documind-ai", "flowledger"]),
  skill("PHP", "languages", "Primary backend language since 2023.", 1),
  skill("TypeScript", "languages", "Typed full stack code across Node.js and Next.js.", 2, ["qa-management-platform"]),
  skill("JavaScript", "languages", "Front-end and tooling work, including Vue.js.", 3),
  skill("Python", "languages", "AI agents, RAG pipelines and FastAPI services.", 4, ["resolve-ai", "documind-ai"]),
  skill("SQL", "languages", "Hand-tuned queries, indexing and data access patterns.", 5),
  skill("MySQL", "data", "Schema design and SQL optimization for high-volume apps.", 1),
  skill("PostgreSQL", "data", "Relational data for multi-tenant SaaS, including pgvector.", 2, ["qa-management-platform", "documind-ai"]),
  skill("Redis", "data", "Queues and caching for asynchronous workloads.", 3),
  skill("Prisma, Drizzle and Eloquent ORMs", "data", "ORMs across TypeScript and Laravel codebases.", 4),
  skill("Multi-tenancy", "architecture", "Tenant isolation for SaaS backends.", 1, ["qa-management-platform", "feedbackiq"]),
  skill("RBAC and authentication", "architecture", "Role-based access, JWT, OAuth 2.0 and Laravel Sanctum.", 2),
  skill("Event-driven architecture", "architecture", "Events, outbox patterns and asynchronous workflows.", 3, ["ordermesh"]),
  skill("MVC, modular and repository patterns", "architecture", "Structuring code for maintainability.", 4),
  skill("LLM integration", "ai", "Classification and generation inside product workflows.", 1, ["feedbackiq"]),
  skill("RAG", "ai", "Retrieval-augmented generation with vector stores.", 2, ["documind-ai", "production-rag-eval"]),
  skill("AI agents and tool calling", "ai", "Agents with tools, guardrails and human-in-the-loop review.", 3, ["resolve-ai"]),
  skill("LLM evaluation", "ai", "Evaluation harnesses that measure agent and RAG quality.", 4, ["resolve-ai", "production-rag-eval"]),
  skill("Docker", "cloud", "Containerized development and deployment environments.", 1),
  skill("GitHub Actions CI/CD", "cloud", "Automated pipelines, including DevSecOps scanning.", 2, ["expense-manager"]),
  skill("AWS EC2 and S3", "cloud", "Compute and storage on AWS.", 3),
  skill("Linux and Vercel", "cloud", "Server administration and serverless deployments.", 4),
  skill("PHPUnit and Pest", "testing", "Feature and unit tests for Laravel apps.", 1, ["flowboard", "feedbackiq"]),
  skill("Vitest and Playwright", "testing", "Unit, integration and end-to-end tests for TypeScript apps.", 2, ["qa-management-platform"]),
  skill("Postman", "testing", "API exploration and contract checks.", 3),
  skill("Agile/Scrum and SDLC", "delivery", "Iterative delivery, backed by the IBM Project Manager certificate.", 1),
  skill("Code reviews", "delivery", "Reviewing for correctness, clarity and maintainability.", 2),
  skill("Performance optimization", "delivery", "Finding and removing bottlenecks in queries and code paths.", 3),
  skill("Cross-functional collaboration", "delivery", "Working with mobile, product and QA teams to ship.", 4),
];

export const metrics: Metric[] = [
  {
    _id: "m-years",
    value: 3,
    suffix: "+",
    label: "Years shipping production backends",
    explanation: "Building and maintaining production Laravel, PHP and API systems since July 2023.",
    context: "Sapphire Software Solution, freelance work and PrimeQA Solutions",
    verified: true,
  },
  {
    _id: "m-orders",
    value: 10000,
    suffix: "+",
    label: "Monthly orders processed",
    explanation: "Commerce systems built on Redis queues, scheduled tasks and event-driven workflows.",
    context: "Sapphire Software Solution",
    verified: true,
  },
  {
    _id: "m-integrations",
    value: 7,
    label: "Payment and data providers integrated",
    explanation: "Stripe, PayPal, Twilio, Firebase, Accord Fintech, Kite and KYC APIs.",
    context: "Sapphire Software Solution",
    verified: true,
  },
];

type P = Partial<Project> & Pick<Project, "title" | "slug" | "summary" | "category">;
const proj = (p: P, order: number): Project => ({
  _id: `project-${p.slug}`,
  projectType: "client",
  featured: false,
  technologies: [],
  objectives: [],
  features: [],
  challenges: [],
  outcomes: [],
  gallery: [],
  videos: [],
  accent: (["blue", "cyan", "violet"] as const)[order % 3],
  verified: true,
  verificationTasks: [],
  ...p,
  order,
});

export const projects: Project[] = [
  // Selected backend and AI projects (resume)
  proj(
    {
      title: "FeedbackIQ",
      slug: "feedbackiq",
      category: "AI and LLM apps",
      projectType: "personal",
      featured: true,
      summary: "AI-powered multi-tenant SaaS API that ingests feedback and classifies sentiment, themes and urgency with an LLM in background jobs.",
      role: "Designer and sole developer",
      technologies: ["Laravel 11", "PHP", "MySQL", "Redis", "Gemini API", "Docker", "Pest"],
      problem: "Classifying feedback with an LLM is slow; doing it inside the request would make ingestion endpoints slow and fragile.",
      solution: "Multi-tenant REST APIs with Sanctum authentication accept feedback and return HTTP 202 immediately, while queued Redis workers run asynchronous LLM sentiment classification.",
      features: ["Multi-tenant REST APIs with Laravel Sanctum authentication", "Asynchronous LLM classification of sentiment, themes and urgency", "Redis queue workers keep the ingest endpoint fast (HTTP 202)", "Pest test coverage and OpenAPI documentation", "Dockerized environment with CI"],
      repoUrl: `${GH}/feedbackiq-laravel`,
    },
    1,
  ),
  proj(
    {
      title: "QA Management Platform",
      slug: "qa-management-platform",
      category: "Multi-tenant SaaS",
      projectType: "personal",
      featured: true,
      summary: "Modular multi-tenant QA management backend with REST APIs, tenant isolation, RBAC, audit logging and automated tests.",
      role: "Architect and developer",
      technologies: ["TypeScript", "Node.js", "Next.js", "PostgreSQL", "Drizzle ORM", "Vitest", "Playwright"],
      architecture: "Modular backend with PostgreSQL repositories behind REST APIs. Every request is tenant-scoped, permissions are enforced through RBAC, and sensitive actions are written to an audit log.",
      features: ["Modular multi-tenant architecture with tenant isolation", "REST APIs over PostgreSQL repositories (Drizzle ORM)", "Role-based access control", "Audit logging", "Automated unit and integration tests (Vitest, Playwright)"],
      repoUrl: `${GH}/QA_MANAGEMENT_PLATFORM`,
      demoUrl: "https://qamanagement-one.vercel.app",
    },
    2,
  ),
  proj(
    {
      title: "Resolve AI",
      slug: "resolve-ai",
      category: "AI and LLM apps",
      projectType: "personal",
      featured: true,
      summary: "Evaluation-driven AI customer operations agent using tool calling, hybrid RAG, policy guardrails and human-in-the-loop workflows.",
      role: "Designer and developer",
      technologies: ["Python", "RAG", "LLMs", "Tool calling", "AI evaluation"],
      features: ["Retrieval-augmented generation (hybrid RAG)", "Tool calling for customer operations tasks", "Policy guardrails", "Human-in-the-loop review workflows", "Automated LLM evaluation"],
      repoUrl: `${GH}/resolve-ai-agent`,
    },
    3,
  ),
  proj(
    {
      title: "Hiral International Courier",
      slug: "hiral-international-courier",
      category: "Logistics",
      featured: true,
      summary: "Shipment platform with AWB-based tracking, administrative management and JWT-secured server-side APIs.",
      role: "Full stack developer",
      technologies: ["Next.js", "TypeScript", "Prisma ORM", "SQLite", "JWT"],
      features: ["Shipment-tracking workflows", "AWB-based shipment lookup", "Administrative management", "JWT authentication", "Server-side API routes"],
      demoUrl: "https://hiralinternationalcourier-com.vercel.app",
    },
    4,
  ),
  // Additional professional projects (resume)
  proj(
    {
      title: "Federal Forecasting App",
      slug: "federal-forecasting-app",
      category: "Mobile app backends",
      summary: "REST APIs supporting government contracting forecasts, document discovery, downloads and mobile/web data access.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Flutter"],
      features: ["Government contracting forecast APIs", "Document discovery and downloads", "Data access for mobile and web clients"],
    },
    5,
  ),
  proj(
    {
      title: "Stock Saathi",
      slug: "stock-saathi",
      category: "Fintech",
      summary: "Stock market analytics backend: real-time market data, Option Chain, Strategy Builder, Screener, IPO Tracker and Kite trading.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Accord Fintech API", "Kite API"],
      features: ["Real-time market data integration (Accord Fintech)", "Option Chain and Strategy Builder", "Stock screener and IPO tracker", "Kite trading integration", "Administration workflows"],
    },
    6,
  ),
  proj(
    {
      title: "Fastest Finger First",
      slug: "fastest-finger-first",
      category: "Real-time platforms",
      summary: "Real-time competition platform: API development and backend workflows for an interactive game.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "REST APIs"],
      features: ["Competition and game workflow APIs", "Backend workflows for interactive rounds"],
    },
    7,
  ),
  proj(
    {
      title: "MaDigital",
      slug: "madigital",
      category: "Mobile app backends",
      summary: "Multilingual music collaboration platform APIs with KYC, wallets, subscriptions and revenue sharing.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Flutter"],
      features: ["Multilingual music platform APIs", "KYC verification", "Wallets, subscriptions and payments", "Revenue sharing", "RBAC and administrative workflows"],
    },
    8,
  ),
  proj(
    {
      title: "Beauty Inkstitute",
      slug: "beauty-inkstitute",
      category: "Mobile app backends",
      summary: "E-learning mobile app backend: learning management, subscriptions, video content and instructor dashboards.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Flutter", "Stripe"],
      features: ["Learning-management APIs", "Subscription workflows with Stripe", "Video content delivery", "Instructor dashboards"],
    },
    9,
  ),
  proj(
    {
      title: "Spot It Now",
      slug: "spot-it-now",
      category: "Mobile app backends",
      summary: "Wildlife sighting app backend with location-based feeds, OTP authentication, media uploads and push notifications.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Flutter", "Firebase"],
      features: ["Location-based REST APIs and sightings feeds", "OTP authentication", "Media uploads", "Push notifications (Firebase)", "Admin moderation"],
    },
    10,
  ),
  proj(
    {
      title: "Kind Act",
      slug: "kind-act",
      category: "Mobile app backends",
      summary: "Social impact mobile app backend for donations, product orders, payments, notifications and CMS content.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Flutter", "Firebase"],
      features: ["Donation and order APIs", "Payments", "Notifications", "CMS content", "Administrative management"],
    },
    11,
  ),
  proj(
    {
      title: "Auction Platform",
      slug: "auction-platform",
      category: "Real-time platforms",
      summary: "Real-time vehicle number-plate auctions with live bidding, dashboards, transaction history and SMS/2FA.",
      role: "Backend developer",
      technologies: ["Laravel", "MySQL", "Vue.js", "Twilio", "WebSockets"],
      features: ["Number-plate auction workflows", "Real-time bidding", "User dashboards and transaction history", "SMS and two-factor authentication (Twilio)"],
    },
    12,
  ),
  proj(
    {
      title: "FlowBoard",
      slug: "flowboard",
      category: "Real-time platforms",
      projectType: "personal",
      summary: "Real-time Kanban task management with RBAC, queued notifications, WebSocket updates and 30 Pest feature tests.",
      role: "Designer and developer",
      technologies: ["Laravel", "Vue.js", "MySQL", "Sanctum", "WebSockets", "Pest"],
      features: ["Task-management REST APIs", "Role-based access control", "Queued notifications", "Live WebSocket updates", "30 Pest feature tests"],
      repoUrl: `${GH}/flowboard-laravel-vue`,
    },
    13,
  ),
  // Open-source builds (GitHub)
  proj(
    {
      title: "DocuMind AI",
      slug: "documind-ai",
      category: "AI and LLM apps",
      projectType: "open-source",
      summary: "Document Q&A SaaS built on FastAPI and pgvector RAG, with JWT auth, Stripe billing, async Celery ingestion and Langfuse observability.",
      technologies: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Celery", "Stripe", "Langfuse"],
      features: ["RAG over uploaded documents with pgvector", "JWT authentication", "Stripe billing", "Asynchronous ingestion with Celery", "LLM observability with Langfuse"],
      repoUrl: `${GH}/documind-ai`,
    },
    14,
  ),
  proj(
    {
      title: "FlowLedger",
      slug: "flowledger",
      category: "Fintech",
      projectType: "open-source",
      summary: "Async payment reconciliation and double-entry ledger platform with idempotent webhook processing.",
      technologies: ["Python", "FastAPI", "PostgreSQL", "Redis"],
      features: ["Double-entry ledger", "Asynchronous payment reconciliation", "Background workers", "Idempotent webhook processing"],
      repoUrl: `${GH}/flowledger-python`,
    },
    15,
  ),
  proj(
    {
      title: "OrderMesh",
      slug: "ordermesh",
      category: "E-commerce",
      projectType: "open-source",
      summary: "Event-driven order fulfilment platform using Spring Boot, Kafka, Saga orchestration and the transactional outbox pattern.",
      technologies: ["Java", "Spring Boot", "Kafka", "Redis"],
      features: ["Event-driven microservices", "Saga orchestration", "Transactional outbox", "Resilient service communication"],
      repoUrl: `${GH}/ordermesh-java`,
    },
    16,
  ),
  proj(
    {
      title: "DevLaunch IDP",
      slug: "devlaunch-idp",
      category: "Platform engineering",
      projectType: "open-source",
      summary: "Internal developer platform on Backstage that automates self-service scaffolding and deployment with GitOps.",
      technologies: ["TypeScript", "Backstage", "Kubernetes", "Argo CD", "Helm", "Docker", "Prometheus", "Grafana"],
      features: ["Self-service software templates", "GitOps deployments with Argo CD", "Kubernetes and Helm", "Monitoring with Prometheus and Grafana"],
      repoUrl: `${GH}/DevLaunch-IDP`,
    },
    17,
  ),
  proj(
    {
      title: "Production RAG Eval",
      slug: "production-rag-eval",
      category: "AI and LLM apps",
      projectType: "open-source",
      summary: "RAG chatbot with an evaluation harness, built with LangChain, ChromaDB, Ollama and Phi-3.",
      technologies: ["Python", "LangChain", "ChromaDB", "Ollama", "Streamlit"],
      features: ["Retrieval-augmented chatbot", "Evaluation harness for answer quality", "Local models via Ollama (Phi-3)"],
      repoUrl: `${GH}/production-rag-eval`,
    },
    18,
  ),
  proj(
    {
      title: "Expense Manager",
      slug: "expense-manager",
      category: "Platform engineering",
      projectType: "open-source",
      summary: "Secure Spring Boot expense manager with an end-to-end DevSecOps pipeline: Gitleaks, Trivy, Snyk, Cosign and OWASP ZAP.",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "GitHub Actions", "Docker"],
      features: ["Full stack expense management", "Secret scanning (Gitleaks) and dependency scanning (Snyk)", "Container scanning (Trivy) and image signing (Cosign)", "Dynamic security testing (OWASP ZAP)"],
      repoUrl: `${GH}/expense-manager`,
      demoUrl: "https://expense-manager-nnor.onrender.com/dashboard",
    },
    19,
  ),
  proj(
    {
      title: "NexCart",
      slug: "nexcart",
      category: "E-commerce",
      projectType: "open-source",
      summary: "React 19 and Next.js 16 e-commerce platform with Stripe and PayPal server-side capture, Google OAuth and an admin analytics panel.",
      technologies: ["TypeScript", "Next.js", "React", "Stripe", "PayPal", "OAuth 2.0"],
      features: ["Stripe and PayPal payments with server-side capture", "Google OAuth 2.0 sign-in", "Client-side AI curation assistant", "PDF report generation", "Admin analytics panel"],
      repoUrl: `${GH}/NexCart-e-commerce`,
    },
    20,
  ),
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
  updatedAt: "2026-10-29",
  intro: "What currently has my attention. This page is updated by hand.",
  items: [
    { label: "Work", body: "AI Full Stack Developer at PrimeQA Solutions in Ahmedabad, since September 2026." },
    { label: "Focus", body: "AI-enabled web applications, backend integrations and API-driven workflows." },
    { label: "Building", body: "Multi-tenant SaaS, RAG pipelines and AI agents in the open on GitHub." },
    { label: "Learning", body: "Project delivery (IBM Project Manager certificate) and LLM application patterns." },
  ],
  verified: true,
};

const svc = (s: Omit<Service, "_id" | "order">, order: number): Service => ({ _id: `service-${s.slug}`, order, ...s });

/** Services, each backed by real roles and projects above. */
export const services: Service[] = [
  svc(
    {
      title: "Laravel and PHP backend development",
      slug: "laravel-php-development",
      summary: "Production Laravel backends: clean domain logic, queues, scheduled jobs, events and well-tested APIs.",
      description:
        "I have built and maintained production Laravel and PHP backends since 2023 for fintech, e-commerce, SaaS, social and real-time auction products. I structure code with service layers, the repository pattern and role-based access control, move slow work onto Redis queues, and cover behaviour with PHPUnit and Pest tests.",
      deliverables: ["Laravel application architecture (MVC, service layer, repository pattern)", "Queues, scheduled tasks and event-driven workflows with Redis", "Authentication with Laravel Sanctum, JWT or OAuth 2.0", "SQL optimization and indexing for slow endpoints", "PHPUnit and Pest test suites"],
      technologies: ["Laravel", "PHP", "MySQL", "Redis", "Sanctum", "Pest", "PHPUnit"],
      projectSlugs: ["feedbackiq", "flowboard", "stock-saathi", "auction-platform"],
    },
    1,
  ),
  svc(
    {
      title: "REST API development and integrations",
      slug: "rest-api-development",
      summary: "Secure, documented REST APIs for web and mobile apps, plus third-party integrations and webhooks.",
      description:
        "I design resource-oriented REST APIs with authentication, validation and consistent error handling, and connect them to the services a product depends on: payments, SMS, push notifications, market data and identity verification. Webhooks are handled idempotently so retries never double-process.",
      deliverables: ["API design, versioning and OpenAPI documentation", "Authentication, OTP verification and RBAC", "Third-party integrations: Stripe, PayPal, Twilio, Firebase, KYC", "Idempotent webhook handling", "Postman collections and automated API tests"],
      technologies: ["REST", "Laravel", "Node.js", "FastAPI", "Webhooks", "OpenAPI"],
      projectSlugs: ["federal-forecasting-app", "spot-it-now", "flowledger"],
    },
    2,
  ),
  svc(
    {
      title: "Multi-tenant SaaS development",
      slug: "saas-development",
      summary: "SaaS backends with tenant isolation, RBAC, audit logging and billing, built to grow.",
      description:
        "I build multi-tenant SaaS backends where every request is tenant-scoped, permissions are enforced centrally, and sensitive actions are audited. I have done this in TypeScript (Node.js, Next.js, Drizzle, PostgreSQL) and in Laravel 11, with automated unit and integration tests.",
      deliverables: ["Tenant isolation strategy and data model", "Role-based access control and audit logging", "Subscription billing with Stripe", "Modular architecture that scales with the team", "Unit, integration and end-to-end tests"],
      technologies: ["TypeScript", "Node.js", "Next.js", "PostgreSQL", "Drizzle ORM", "Laravel 11"],
      projectSlugs: ["qa-management-platform", "feedbackiq", "documind-ai"],
    },
    3,
  ),
  svc(
    {
      title: "AI and LLM integration",
      slug: "ai-llm-integration",
      summary: "LLM features that work in production: classification, RAG search and tool-calling agents, with evaluation.",
      description:
        "I add AI to products where it solves a concrete problem. That includes asynchronous LLM classification behind fast APIs, retrieval-augmented generation over your documents, and customer-operations agents with tool calling, policy guardrails and human-in-the-loop review. Every AI feature ships with an evaluation harness so quality is measured, not assumed.",
      deliverables: ["LLM integration (Gemini and other providers)", "RAG pipelines with pgvector or ChromaDB", "AI agents with tool calling and guardrails", "LLM evaluation and observability (Langfuse)", "Background processing so AI never slows the API"],
      technologies: ["Python", "FastAPI", "LangChain", "pgvector", "Gemini API", "Langfuse"],
      projectSlugs: ["resolve-ai", "documind-ai", "feedbackiq", "production-rag-eval"],
    },
    4,
  ),
  svc(
    {
      title: "Backends for Flutter mobile apps",
      slug: "mobile-app-backend",
      summary: "APIs for Android and iOS apps: auth, OTP, payments, media uploads, push notifications and admin panels.",
      description:
        "I have engineered secure REST APIs for many Flutter apps on Android and iOS, covering authentication and OTP, payments and subscriptions, location-based feeds, media uploads, push notifications through Firebase, and the admin and moderation tools teams need to run them.",
      deliverables: ["Mobile-ready REST APIs", "OTP authentication and user management", "Payments, wallets and subscriptions", "Push notifications with Firebase", "Admin and moderation dashboards"],
      technologies: ["Laravel", "MySQL", "Firebase", "Stripe", "Flutter (client)"],
      projectSlugs: ["spot-it-now", "madigital", "beauty-inkstitute", "kind-act"],
    },
    5,
  ),
  svc(
    {
      title: "Payment and fintech integrations",
      slug: "payment-fintech-integration",
      summary: "Stripe, PayPal, market-data and KYC integrations, plus ledgers and reconciliation done correctly.",
      description:
        "I have integrated Stripe, PayPal, Accord Fintech, Kite and KYC providers for payments, stock-market data, trading and identity verification, and built a double-entry ledger with asynchronous reconciliation and idempotent webhooks.",
      deliverables: ["Stripe and PayPal payments, including server-side capture", "Subscriptions, wallets and revenue sharing", "Market data and trading APIs (Accord Fintech, Kite)", "KYC and identity verification", "Ledgers, reconciliation and idempotent webhooks"],
      technologies: ["Stripe", "PayPal", "Accord Fintech", "Kite", "FastAPI", "Laravel"],
      projectSlugs: ["stock-saathi", "flowledger", "nexcart", "madigital"],
    },
    6,
  ),
  svc(
    {
      title: "Real-time features",
      slug: "real-time-features",
      summary: "Live bidding, dashboards and notifications with WebSockets, events and queued jobs.",
      description:
        "I build real-time features with WebSockets, events and queued notifications: live auction bidding, transaction updates, Kanban boards that update for every user, and competition platforms where timing matters.",
      deliverables: ["WebSocket channels and event broadcasting", "Queued notifications (email, SMS, push)", "Live dashboards and activity feeds", "Concurrency-safe bidding and updates"],
      technologies: ["Laravel", "WebSockets", "Redis", "Vue.js", "Twilio"],
      projectSlugs: ["auction-platform", "flowboard", "fastest-finger-first"],
    },
    7,
  ),
  svc(
    {
      title: "Docker, CI/CD and deployment",
      slug: "devops-ci-cd",
      summary: "Containerized environments and automated pipelines with testing and security scanning built in.",
      description:
        "I containerize applications with Docker and set up GitHub Actions pipelines that test, scan and deploy automatically, including DevSecOps checks (secret, dependency and container scanning, image signing and dynamic testing). I deploy to AWS (EC2, S3), Vercel and Linux servers.",
      deliverables: ["Dockerized development and production environments", "GitHub Actions CI/CD pipelines", "Security scanning: Gitleaks, Snyk, Trivy, OWASP ZAP", "Deployments to AWS EC2/S3, Vercel and Linux"],
      technologies: ["Docker", "GitHub Actions", "AWS", "Vercel", "Linux", "Kubernetes"],
      projectSlugs: ["expense-manager", "devlaunch-idp", "feedbackiq"],
    },
    8,
  ),
];
