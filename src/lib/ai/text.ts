// Lightweight text analysis for the ATS engine — deterministic, no network.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
  "has", "this", "that", "from", "who", "what", "when", "where", "how", "all",
  "can", "not", "but", "they", "their", "them", "was", "were", "been", "being",
  "into", "out", "over", "under", "than", "then", "there", "here", "such",
  "role", "team", "work", "working", "job", "years", "year", "experience",
  "including", "etc", "able", "using", "use", "used", "within", "across",
  "strong", "good", "great", "well", "new", "must", "should", "would", "could",
  "we", "a", "an", "in", "on", "of", "to", "is", "as", "at", "by", "or", "be",
  "it", "its", "per", "via", "any", "may", "one", "two", "three", "plus",
]);

/** A curated tech-skill dictionary (matched case-insensitively as phrases). */
export const SKILL_DICTIONARY = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#",
  "PHP", "Ruby", "Swift", "Kotlin", "Scala", "SQL", "HTML", "CSS",
  "React", "Next.js", "Vue", "Nuxt", "Svelte", "Angular", "Node.js", "Express",
  "Nest.js", "Django", "Flask", "FastAPI", "Laravel", "Spring", "Rails",
  "Tailwind", "Redux", "GraphQL", "REST", "gRPC", "WebSockets",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "ClickHouse",
  "Prisma", "Drizzle", "Elasticsearch", "Kafka", "RabbitMQ",
  "Docker", "Kubernetes", "Terraform", "AWS", "GCP", "Azure", "Vercel",
  "CI/CD", "Git", "GitHub", "GitLab", "Linux", "Nginx",
  "OpenAI", "LangChain", "RAG", "LLM", "LLMs", "Embeddings", "Vector Database",
  "Prompt Engineering", "AI Agents", "Hugging Face", "PyTorch", "TensorFlow",
  "Three.js", "React Three Fiber", "GSAP", "Framer Motion", "WebGL",
  "Jest", "Playwright", "Vitest", "Cypress", "Testing",
  "Agile", "Scrum", "Microservices", "Serverless",
];

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function tokenSet(text: string): Set<string> {
  return new Set(tokenize(text));
}

/** Top keywords in a text by frequency (excluding stopwords). */
export function extractKeywords(text: string, limit = 25): string[] {
  const counts = new Map<string, number>();
  for (const t of tokenize(text)) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

/** Detect known skills present in free text (phrase-aware). */
export function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const skill of SKILL_DICTIONARY) {
    if (lower.includes(skill.toLowerCase())) found.push(skill);
  }
  return found;
}

export function hasSkill(text: string, skill: string): boolean {
  return text.toLowerCase().includes(skill.toLowerCase());
}
