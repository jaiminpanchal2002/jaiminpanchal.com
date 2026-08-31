import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const GH = "https://github.com/jaiminpanchal2002";

async function main() {
  // ---- Admin ----
  const email = (process.env.ADMIN_EMAIL ?? "admin@jaiminpanchal.com")
    .toLowerCase()
    .trim();
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Admin123!change",
    10,
  );
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Jaimin Panchal", role: "admin" },
  });
  console.log(`✓ admin: ${email}`);

  // ---- Profile + socials ----
  if ((await prisma.profile.count()) === 0) {
    await prisma.profile.create({
      data: {
        name: "Jaimin Panchal",
        title: "AI Engineer · LLM, RAG & Agents · Python/FastAPI",
        roles: JSON.stringify([
          "AI Engineer",
          "LLM / RAG Builder",
          "Full-Stack Engineer",
          "Python · FastAPI Dev",
        ]),
        tagline:
          "I build production LLM systems — RAG pipelines, tool-calling agents and evaluation harnesses — on a foundation of 2.5+ years shipping backend software at scale.",
        bio: "AI engineer focused on making LLM applications reliable — retrieval quality, deterministic guardrails and measurable evaluation, not demos.",
        location: "Ahmedabad, India · Remote",
        email: "jaiminmpanchal02@gmail.com",
        availability: "open",
        resumeUrl: "/Jaimin_Panchal_AI_Resume.pdf",
        socials: {
          create: [
            { platform: "GitHub", url: GH, order: 0 },
            { platform: "LinkedIn", url: "https://linkedin.com/in/jaiminpanchal2002", order: 1 },
            { platform: "Email", url: "mailto:jaiminmpanchal02@gmail.com", order: 2 },
          ],
        },
      },
    });
    console.log("✓ profile");
  }

  // ---- Experience ----
  if ((await prisma.experience.count()) === 0) {
    const experience = [
      {
        position: "AI / LLM & Backend Engineer",
        company: "Freelance",
        period: "Sep 2025 — Present",
        location: "Remote",
        current: true,
        description:
          "Independent AI/LLM and full-stack engagements — production RAG pipelines, tool-calling agents and evaluation harnesses.",
        achievements: [
          "Ship AI/LLM work with Python/FastAPI, LangChain/LangGraph, pgvector/ChromaDB and OpenAI/Gemini — production RAG pipelines, tool-calling agents and evaluation harnesses.",
          "Built the Laravel + MySQL backend and REST APIs for Spot It Now, a cross-platform wildlife-sighting app — geospatial feeds, photo uploads, OTP auth and push notifications for Android & iOS, plus a moderation admin panel.",
        ],
        tech: ["Python", "FastAPI", "LangGraph", "pgvector", "Laravel"],
      },
      {
        position: "Software Engineer (Backend Focus)",
        company: "Sapphire Software Solution",
        period: "Jul 2023 — Aug 2025",
        location: "Ahmedabad, India",
        current: false,
        description:
          "Delivered client platforms end-to-end across SaaS, e-commerce, fintech and social products.",
        achievements: [
          "Delivered five client platforms end-to-end (Laravel, MySQL) — all five remain live in production.",
          "Moved order fulfilment into queued background workers for a Shopify backend sustaining 10,000+ orders/month; optimized MySQL via indexing and query restructuring.",
          "Engineered event-driven Laravel backends (queues, events, secure webhooks) powering live bid broadcasting, a transactional wallet ledger and automated revenue-split payouts.",
          "Employee of the Quarter (2025) · Emerging Star Award (2024).",
        ],
        tech: ["Laravel", "PHP", "MySQL", "Redis", "Docker"],
      },
    ];
    for (let i = 0; i < experience.length; i++) {
      const e = experience[i];
      await prisma.experience.create({
        data: {
          position: e.position,
          company: e.company,
          period: e.period,
          location: e.location,
          current: e.current,
          description: e.description,
          achievements: JSON.stringify(e.achievements),
          technologies: JSON.stringify(e.tech),
          order: i,
        },
      });
    }
    console.log("✓ experience");
  }

  // ---- Projects ----
  if ((await prisma.project.count()) === 0) {
    const ai = await prisma.projectCategory.create({ data: { name: "AI / LLM", slug: "ai" } });
    const fs = await prisma.projectCategory.create({ data: { name: "Full-Stack", slug: "full-stack" } });
    const be = await prisma.projectCategory.create({ data: { name: "Backend", slug: "backend" } });
    const projects = [
      { slug: "docintel", name: "DocIntel", cat: ai.id, featured: true, aiP: true, tech: ["Python", "FastAPI", "Gemini / GPT-4o", "Pydantic", "Docker"], repo: "docintel-ai",
        summary: "Multimodal document-intelligence API — extracts schema-validated fields from PDFs and images with a vision LLM, per-field review flags and rules-based validation." },
      { slug: "documind-ai", name: "DocuMind AI", cat: ai.id, featured: true, aiP: true, tech: ["Python", "FastAPI", "pgvector", "Celery", "Stripe"], repo: "documind-ai",
        summary: "Production document-Q&A SaaS — FastAPI, pgvector RAG, JWT auth, Stripe billing, async Celery workers and Langfuse tracing." },
      { slug: "resolve-ai", name: "ResolveAI", cat: ai.id, featured: false, aiP: true, tech: ["Python", "LangGraph", "FastAPI", "pgvector", "Redis"], repo: "resolve-ai-agent",
        summary: "LangGraph support agent that resolves cases via tool calling and hybrid retrieval — pgvector (HNSW) fused with Postgres full-text via RRF, cross-encoder reranked, with deterministic policy guardrails." },
      { slug: "shopsense", name: "ShopSense", cat: fs.id, featured: false, aiP: true, tech: ["NestJS", "TypeScript", "pgvector", "Prisma", "Stripe"], repo: "shopsense-node",
        summary: "E-commerce API with natural-language product search and an LLM shopping assistant — pgvector semantic search, function calling, Stripe checkout and Socket.io real-time updates." },
      { slug: "feedbackiq", name: "FeedbackIQ", cat: fs.id, featured: false, aiP: false, tech: ["Laravel 11", "PHP 8.2", "MySQL", "Redis", "Docker"], repo: "feedbackiq-laravel",
        summary: "Multi-tenant Laravel SaaS API that ingests feedback and classifies sentiment, themes and urgency via an LLM dispatched to queued Redis workers — OpenAPI, Pest tests and Dockerized CI." },
      { slug: "ordermesh", name: "OrderMesh", cat: be.id, featured: false, aiP: false, tech: ["Java", "Spring Boot", "Kafka"], repo: "ordermesh-java",
        summary: "Event-driven order-fulfilment platform using Spring Boot, Kafka and the Saga orchestration pattern." },
    ];
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await prisma.project.create({
        data: {
          slug: p.slug, name: p.name, summary: p.summary,
          technologies: JSON.stringify(p.tech),
          githubUrl: `${GH}/${p.repo}`,
          categoryId: p.cat, featured: p.featured, isAiProject: p.aiP,
          published: true, order: i, date: new Date(),
        },
      });
    }
    console.log("✓ projects");
  }

  // ---- Skills ----
  if ((await prisma.skillCategory.count()) === 0) {
    const groups: [string, string[]][] = [
      ["AI / LLM", ["RAG", "Hybrid Search", "LangChain", "LangGraph", "AI Agents", "Tool Calling", "pgvector", "ChromaDB", "Embeddings", "Prompt Engineering", "RAGAS", "DeepEval", "OpenAI", "Gemini", "Ollama"]],
      ["Languages", ["Python", "PHP", "JavaScript", "TypeScript", "SQL"]],
      ["Backend & Serving", ["FastAPI", "Laravel", "Node.js", "NestJS", "Streamlit", "REST APIs", "Event-Driven", "Redis Queues", "WebSockets", "JWT / OAuth 2.0"]],
      ["Databases", ["PostgreSQL", "pgvector", "MySQL", "MongoDB", "Redis", "ChromaDB"]],
      ["Cloud & DevOps", ["Docker", "AWS (EC2, S3)", "GitHub Actions", "CI/CD", "Git", "Linux", "Nginx"]],
      ["Testing", ["pytest", "RAGAS", "DeepEval", "Pest", "Jest"]],
    ];
    for (let i = 0; i < groups.length; i++) {
      const [name, skills] = groups[i];
      const c = await prisma.skillCategory.create({ data: { name, order: i } });
      for (let j = 0; j < skills.length; j++)
        await prisma.skill.create({ data: { name: skills[j], order: j, categoryId: c.id } });
    }
    console.log("✓ skills");
  }

  // ---- Education ----
  if ((await prisma.education.count()) === 0) {
    await prisma.education.create({
      data: {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "Indus University, Ahmedabad",
        field: "Computer Science & Engineering",
        period: "2019 — 2023",
        description: "CGPA 8.89 / 10",
        order: 0,
      },
    });
    console.log("✓ education");
  }

  // ---- Achievements ----
  if ((await prisma.achievement.count()) === 0) {
    const A: [string, string][] = [
      ["Employee of the Quarter", "Sapphire Software Solution · 2025"],
      ["Emerging Star Award", "Sapphire Software Solution · 2024"],
      ["Generative AI Mastermind", "Outskill · 2026"],
      ["IBM Project Manager — Professional Certificate", "Coursera · 2026"],
    ];
    for (let i = 0; i < A.length; i++)
      await prisma.achievement.create({ data: { title: A[i][0], description: A[i][1], order: i } });
    console.log("✓ achievements");
  }

  // ---- Currently building ----
  if ((await prisma.building.count()) === 0) {
    await prisma.building.create({ data: { title: "Personal Portfolio & Career OS", status: "Building", progress: 78, tech: JSON.stringify(["Next.js", "Prisma", "Three.js"]), description: "This site — a CMS-driven portfolio with a built-in job tracker, ATS analyzer and job discovery.", link: "#projects", order: 0 } });
    await prisma.building.create({ data: { title: "AI Job-Match Engine", status: "Testing", progress: 62, tech: JSON.stringify(["Python", "OpenAI", "pgvector"]), description: "Scores roles against my profile with a transparent skill / role / location match.", link: "#ai", order: 1 } });
    console.log("✓ currently building");
  }

  // ---- Journey ----
  if ((await prisma.journeyStep.count()) === 0) {
    const J: [string, string][] = [
      ["PHP / Laravel", "Where I started shipping real backends"],
      ["Full-Stack", "Owning features end to end"],
      ["React / Next.js", "Modern, motion-rich frontends"],
      ["APIs & Integrations", "Connecting systems reliably"],
      ["AI Integration", "LLMs inside real products"],
      ["RAG & Vectors", "Grounded, retrieval-based AI"],
      ["GenAI Applications", "AI that does useful work"],
      ["AI Product Engineering", "Where I’m focused now"],
    ];
    for (let i = 0; i < J.length; i++)
      await prisma.journeyStep.create({ data: { step: J[i][0], note: J[i][1], order: i } });
    console.log("✓ journey");
  }

  // ---- Resume version (for ATS) ----
  if ((await prisma.resume.count()) === 0) {
    await prisma.resume.create({
      data: {
        name: "AI Engineer Resume",
        version: "2026",
        targetRole: "AI Engineer",
        status: "active",
        fileUrl: "/Jaimin_Panchal_AI_Resume.pdf",
        summary: "AI engineer building production LLM systems on 2.5+ years of backend engineering.",
        skills: JSON.stringify(["Python", "FastAPI", "RAG", "LangGraph", "pgvector", "OpenAI"]),
      },
    });
    console.log("✓ resume");
  }

  // ---- Site settings ----
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Jaimin Panchal",
      seoTitle: "Jaimin Panchal — AI & Full-Stack Engineer",
      seoDescription:
        "Jaimin Panchal — AI engineer building production LLM systems, RAG pipelines and full-stack products.",
    },
  });
  console.log("✓ settings");
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
