// Shared content model. Mirrors the Sanity schemas in src/sanity/schemaTypes.
// Every factual record carries `verified`: unverified records never render in
// production unless CONTENT_PREVIEW_UNVERIFIED=true (see src/content/visibility.ts).

export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

export type SanityImage = {
  _type: "image";
  asset?: { _ref?: string; _id?: string; url?: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export type Seo = {
  title?: string;
  description?: string;
  noIndex?: boolean;
  canonical?: string;
  ogImage?: SanityImage;
};

export type SocialLink = { platform: string; label: string; url: string };

export type Profile = {
  name: string;
  title: string;
  headline: string;
  shortBio: string;
  bio?: PortableTextBlock[];
  location: string;
  timezone: string;
  email?: string;
  availability?: string;
  portrait?: SanityImage;
  resumeUrl?: string;
  socialLinks: SocialLink[];
  interests: string[];
  principles: { title: string; body: string }[];
  philosophy?: string;
  currentFocus?: string;
};

export type Experience = {
  _id: string;
  company: string;
  role: string;
  employmentType: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  location?: string;
  startDate?: string; // ISO yyyy-mm
  endDate?: string;
  current?: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  projectSlugs: string[];
  verified: boolean;
  verificationNotes?: string;
  order: number;
};

export type Education = {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear?: number;
  endYear?: number;
  notes?: string;
  verified: boolean;
};

export type Certification = {
  _id: string;
  name: string;
  issuer: string;
  issued?: string;
  url?: string;
  verified: boolean;
};

export type SkillCategory = { _id: string; title: string; slug: string; description: string; order: number };

export type Skill = {
  _id: string;
  name: string;
  category: string; // SkillCategory slug
  description: string;
  proficiency?: "Working knowledge" | "Proficient" | "Advanced" | "Expert";
  projectSlugs: string[];
  order: number;
  visible: boolean;
  verified: boolean;
};

export type Metric = {
  _id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  explanation: string;
  context: string; // role or project the metric belongs to
  verified: boolean;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  projectType: "client" | "product" | "internal" | "personal" | "open-source";
  year?: number;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  order: number;
  role?: string;
  contribution?: string;
  technologies: string[];
  problem?: string;
  objectives: string[];
  solution?: string;
  architecture?: string;
  features: string[];
  challenges: { title: string; body: string }[];
  outcomes: { label: string; value: string; verified: boolean }[];
  lessons?: string;
  body?: PortableTextBlock[];
  heroImage?: SanityImage;
  thumbnail?: SanityImage;
  gallery: SanityImage[];
  videos: { url: string; title: string }[];
  demoUrl?: string;
  repoUrl?: string;
  accent?: "blue" | "cyan" | "violet";
  verified: boolean;
  verificationTasks: string[];
  seo?: Seo;
};

export type CaseStudy = {
  _id: string;
  title: string;
  slug: string;
  template: "engineering" | "product-delivery";
  projectSlug?: string;
  excerpt: string;
  publishedAt?: string;
  role?: string;
  team?: string;
  sections: { _key: string; heading: string; kind: CaseSectionKind; body: PortableTextBlock[] }[];
  evidence: { label: string; value: string }[];
  pullQuote?: string;
  comparison?: { before?: SanityImage; after?: SanityImage; caption?: string };
  coverImage?: SanityImage;
  verified: boolean;
  seo?: Seo;
};

export type CaseSectionKind =
  | "context"
  | "problem"
  | "constraints"
  | "discovery"
  | "decisions"
  | "implementation"
  | "challenges"
  | "alternatives"
  | "tradeoffs"
  | "outcome"
  | "retrospective";

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: SanityImage;
  category: string;
  tags: string[];
  body: PortableTextBlock[];
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  readingMinutes: number;
  canonicalUrl?: string;
  verified: boolean; // "approved by author"
  seo?: Seo;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  projectSlugs: string[];
  order: number;
  seo?: Seo;
};

export type NowPage = {
  updatedAt: string;
  intro: string;
  items: { label: string; body: string }[];
  verified: boolean;
};

export type HomeSectionKey = "story" | "experience" | "work" | "process" | "capabilities" | "impact" | "writing" | "contact";

export type HomePage = {
  heroKicker: string;
  heroGreeting: string;
  heroHeadline: string[]; // rendered one line each
  heroSupporting: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroVariant: "lattice" | "minimal";
  storyHeadline: string;
  storyBeats: { title: string; body: string }[];
  processSteps: { title: string; body: string }[];
  contactHeadline: string;
  collaborationInterests: string[];
  sections: { key: HomeSectionKey; visible: boolean }[];
  featuredProjectSlugs: string[];
};

export type NavItem = { label: string; href: string; visible: boolean };

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  url: string;
  mainNav: NavItem[];
  footerNav: NavItem[];
  defaultTheme: "dark" | "light" | "system";
  animationPreset: "cinematic" | "calm";
  introEnabled: boolean;
};
