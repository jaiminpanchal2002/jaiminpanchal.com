/**
 * Central content source for the public portfolio.
 *
 * Everything the landing page renders comes from here. In a later phase this
 * module is swapped for data loaded from the CMS/database (same shape), so the
 * section components never need to change. Do NOT hardcode portfolio copy in
 * the components — add it here.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroContent {
  /** Rendered uppercase via CSS; keep the curly apostrophe. */
  heading: string;
  tagline: string;
  portrait: string;
  contactLabel: string;
}

export interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

export interface ProjectImages {
  col1Top: string;
  col1Bottom: string;
  col2: string;
}

export interface ProjectItem {
  number: string;
  category: string;
  name: string;
  href: string;
  images: ProjectImages;
}

export interface AboutContent {
  heading: string;
  paragraph: string;
  decor: {
    topLeft: string;
    bottomLeft: string;
    topRight: string;
    bottomRight: string;
  };
}

export const nav: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "AI", href: "#ai" },
  { label: "Contact", href: "#contact" },
];

export const hero: HeroContent = {
  heading: "Hi, i’m jaimin",
  tagline:
    "a full-stack & ai engineer crafting cinematic, intelligent digital experiences",
  portrait:
    "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png",
  contactLabel: "Contact Me",
};

export interface ProfileContent {
  firstName: string;
  lastName: string;
  name: string;
  roles: string[];
  tagline: string;
  availability: string;
  email: string;
  resumeUrl: string;
  location: string;
}

export const profile: ProfileContent = {
  firstName: "Jaimin",
  lastName: "Panchal",
  name: "Jaimin Panchal",
  roles: ["Full-Stack Developer", "AI Engineer", "Creative Technologist"],
  tagline:
    "I build intelligent digital experiences — full-stack systems, AI-powered products, and interfaces that move.",
  availability: "Available for select work",
  email: "jaiminpanchal939@gmail.com",
  resumeUrl: "#",
  location: "India · Remote",
};

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "2.5+", label: "Years engineering" },
  { value: "10K+", label: "Orders/month at scale" },
  { value: "5", label: "Platforms shipped" },
  { value: "6", label: "Languages spoken" },
];

export const techStack: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Prisma",
  "OpenAI",
  "LangChain",
  "RAG",
  "Three.js",
  "Framer Motion",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "GraphQL",
  "Redis",
  "Vercel",
];

export interface Social {
  label: string;
  url: string;
}

export const socials: Social[] = [
  { label: "GitHub", url: "https://github.com/jaiminpanchal2002" },
  { label: "LinkedIn", url: "https://linkedin.com/in/jaiminpanchal" },
  { label: "Email", url: "mailto:jaiminpanchal939@gmail.com" },
];

export const contact = {
  heading: "Let’s build something",
  blurb:
    "Have a product to ship, an AI idea to explore, or a role to fill? I’m open to select freelance work and full-time opportunities.",
  email: "jaiminpanchal939@gmail.com",
};

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
}

export const experiences: ExperienceEntry[] = [
  {
    role: "Full-Stack & AI Engineer",
    company: "Independent / Freelance",
    period: "2023 — Present",
    location: "Remote",
    description:
      "Building full-stack and AI-powered products end to end — from data models and APIs to cinematic, motion-rich frontends.",
    achievements: [
      "Shipped an AI recruitment platform (Next.js, Python, PostgreSQL) that cut screening time ~60%.",
      "Designed RAG pipelines and LLM integrations with evaluation and guardrails.",
      "Built a CMS-driven portfolio & job-intelligence platform — this site.",
    ],
    tech: ["Next.js", "TypeScript", "Python", "PostgreSQL", "OpenAI"],
  },
  {
    role: "Full-Stack Developer",
    company: "Client Projects",
    period: "2021 — 2023",
    location: "Remote",
    description:
      "Delivered production web applications for startups and agencies across the stack.",
    achievements: [
      "Built dashboards, storefronts and internal tools with React and Node.js.",
      "Owned database design, REST APIs, auth, and deployment pipelines.",
    ],
    tech: ["React", "Node.js", "MySQL", "Tailwind", "Docker"],
  },
  {
    role: "Software Developer",
    company: "Early Career",
    period: "2019 — 2021",
    location: "On-site",
    description:
      "Started as a developer building features, fixing bugs, and learning to ship reliable software in a team.",
    achievements: [
      "Contributed across frontend and backend on real customer products.",
      "Grew from junior into an engineer who owns features end to end.",
    ],
    tech: ["JavaScript", "PHP", "Laravel", "MySQL"],
  },
];

export const heroTitles: string[] = [
  "Full-Stack Engineer",
  "AI / GenAI Developer",
  "Product Engineer",
  "RAG & LLM Builder",
];

export interface SkillCategoryContent {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategoryContent[] = [
  {
    name: "Frontend",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    name: "Backend",
    skills: [
      "PHP",
      "Laravel",
      "Node.js",
      "REST APIs",
      "Authentication",
      "API Integration",
    ],
  },
  {
    name: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    name: "AI / GenAI",
    skills: [
      "LLMs",
      "Generative AI",
      "Prompt Engineering",
      "RAG",
      "Embeddings",
      "Vector Search",
      "Vector Databases",
      "AI Agents",
      "AI API Integration",
    ],
  },
  {
    name: "Tools",
    skills: ["Git", "GitHub", "Docker", "Postman", "Linux", "VS Code"],
  },
];

export interface BuildItem {
  tag: string;
  title: string;
  description: string;
}

export const whatIBuild: BuildItem[] = [
  {
    tag: "01",
    title: "AI-Powered Applications",
    description:
      "LLM integrations, RAG systems, AI assistants and intelligent workflows that do real work — not demos.",
  },
  {
    tag: "02",
    title: "Full-Stack Products",
    description:
      "Complete web applications from frontend to backend, database, auth and deployment.",
  },
  {
    tag: "03",
    title: "Developer Tools",
    description:
      "Internal tools, dashboards and automation that remove friction from real workflows.",
  },
  {
    tag: "04",
    title: "Career & Productivity Tools",
    description:
      "Job tracking, resume analysis and AI-assisted career workflows — like the system powering this site.",
  },
];

export interface PipelineStep {
  label: string;
  note: string;
}

export interface AiCapability {
  title: string;
  desc: string;
}

export const aiCapabilities: AiCapability[] = [
  {
    title: "RAG Pipelines",
    desc: "Hybrid search — pgvector fused with Postgres full-text via RRF, then cross-encoder reranked.",
  },
  {
    title: "Tool-Calling Agents",
    desc: "LangGraph agents with deterministic policy guardrails enforced in code, not prompts.",
  },
  {
    title: "Evaluation Harnesses",
    desc: "RAGAS & DeepEval — faithfulness, answer relevancy and context precision, wired into CI.",
  },
  {
    title: "Vector Search",
    desc: "pgvector (HNSW cosine) and ChromaDB embeddings, benchmarked against dense-only baselines.",
  },
  {
    title: "Structured Outputs",
    desc: "Schema-validated LLM outputs (Pydantic) with per-field review flags and fallbacks.",
  },
  {
    title: "Multi-Model Serving",
    desc: "OpenAI, Google Gemini and local Ollama for cost-controlled, reliable inference.",
  },
];

export const aiPipeline: PipelineStep[] = [
  { label: "Query", note: "User question" },
  { label: "Embed", note: "Text → vector" },
  { label: "Vector Search", note: "Similarity match" },
  { label: "Retrieve", note: "Top-k context" },
  { label: "Augment", note: "Prompt + context" },
  { label: "LLM", note: "Generate" },
  { label: "Response", note: "Grounded answer" },
];

export interface BuildingItem {
  title: string;
  status: "Planning" | "Building" | "Testing" | "Live";
  progress: number;
  tech: string[];
  description: string;
  link: string;
}

export const currentlyBuilding: BuildingItem[] = [
  {
    title: "Personal Portfolio & Career OS",
    status: "Building",
    progress: 78,
    tech: ["Next.js", "Prisma", "Three.js"],
    description:
      "This site — a CMS-driven portfolio with a built-in job tracker, ATS analyzer and job discovery.",
    link: "#projects",
  },
  {
    title: "AI Job-Match Engine",
    status: "Testing",
    progress: 62,
    tech: ["Python", "OpenAI", "pgvector"],
    description:
      "Scores roles against my profile with a transparent skill / role / location match.",
    link: "#ai",
  },
];

export interface JourneyStep {
  step: string;
  note: string;
}

export const journey: JourneyStep[] = [
  { step: "PHP / Laravel", note: "Where I started shipping real backends" },
  { step: "Full-Stack", note: "Owning features end to end" },
  { step: "React / Next.js", note: "Modern, motion-rich frontends" },
  { step: "APIs & Integrations", note: "Connecting systems reliably" },
  { step: "AI Integration", note: "LLMs inside real products" },
  { step: "RAG & Vectors", note: "Grounded, retrieval-based AI" },
  { step: "GenAI Applications", note: "AI that does useful work" },
  { step: "AI Product Engineering", note: "Where I’m focused now" },
];

export interface EducationEntry {
  degree: string;
  institution: string;
  field: string;
  period: string;
  description: string;
}

export const education: EducationEntry[] = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Indus University, Ahmedabad",
    field: "Computer Science & Engineering",
    period: "2019 — 2023",
    description: "CGPA 8.89 / 10",
  },
];

export interface AchievementEntry {
  title: string;
  context: string;
}

export const achievements: AchievementEntry[] = [
  {
    title: "Employee of the Quarter",
    context: "Sapphire Software Solution · 2025",
  },
  { title: "Emerging Star Award", context: "Sapphire Software Solution · 2024" },
  { title: "Generative AI Mastermind", context: "Outskill · 2026" },
  {
    title: "IBM Project Manager — Professional Certificate",
    context: "Coursera · 2026",
  },
];

export interface BlogPostPreview {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  href: string;
}

export const blogPosts: BlogPostPreview[] = [
  {
    title: "Shipping RAG that actually answers",
    excerpt:
      "Retrieval, chunking, and evaluation choices that decide whether your RAG app is useful or just confident.",
    date: "2026-06-14",
    readingTime: "8 min",
    tag: "AI Engineering",
    href: "#",
  },
  {
    title: "Cinematic on the web, without the jank",
    excerpt:
      "How to layer WebGL, scroll animation and reduced-motion so a site feels alive and still scores 90+ on Lighthouse.",
    date: "2026-04-02",
    readingTime: "6 min",
    tag: "Creative Dev",
    href: "#",
  },
  {
    title: "A pragmatic full-stack architecture",
    excerpt:
      "Prisma, server actions and a thin service layer — the setup I reach for to move fast without painting into a corner.",
    date: "2026-02-20",
    readingTime: "7 min",
    tag: "Full-Stack",
    href: "#",
  },
];

export const about: AboutContent = {
  heading: "About me",
  paragraph:
    "I build intelligent digital experiences — full-stack systems, AI-powered products, and interfaces that move. With a focus on engineering that ships and design that feels alive, i partner with teams and clients who want to stand out and prove what modern software can be. Let’s build something incredible together!",
  decor: {
    topLeft:
      "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    bottomLeft:
      "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    topRight:
      "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    bottomRight:
      "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
  },
};

export const services: ServiceItem[] = [
  {
    number: "01",
    name: "Full-Stack Development",
    description:
      "End-to-end product engineering — typed APIs, relational data models, and clean React/Next.js frontends built to ship and scale.",
  },
  {
    number: "02",
    name: "AI Engineering",
    description:
      "LLM applications, RAG pipelines, and AI agents wired into real products — from retrieval and prompting to evaluation and guardrails.",
  },
  {
    number: "03",
    name: "Creative Development",
    description:
      "Motion systems, 3D, and scroll-driven storytelling that make interfaces feel cinematic without sacrificing performance.",
  },
  {
    number: "04",
    name: "Product & UX",
    description:
      "Turning fuzzy ideas into coherent products — information architecture, interaction design, and the details that make software feel premium.",
  },
  {
    number: "05",
    name: "Web Experiences",
    description:
      "Fast, accessible, conversion-focused websites with strong typography, layout, and interaction — measured, not decorated.",
  },
];

export const projects: ProjectItem[] = [
  {
    number: "01",
    category: "Client",
    name: "AI Recruitment Platform",
    href: "#",
    images: {
      col1Top:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      col1Bottom:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      col2:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    },
  },
  {
    number: "02",
    category: "Personal",
    name: "Portfolio Operating System",
    href: "#",
    images: {
      col1Top:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      col1Bottom:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      col2:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    },
  },
  {
    number: "03",
    category: "Client",
    name: "Solaris Analytics",
    href: "#",
    images: {
      col1Top:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      col1Bottom:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      col2:
        "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    },
  },
];

/** Marquee row images (abstract product previews, swappable via CMS). */
export const marqueeRow1: string[] = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

export const marqueeRow2: string[] = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];
