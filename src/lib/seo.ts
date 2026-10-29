import type { Metadata } from "next";
import type { Post, Profile, Seo, Service } from "@/content/types";
import { imageUrl } from "@/sanity/image";
import { absoluteUrl } from "./utils";
import { DEFAULT_DESCRIPTION, KNOWS_ABOUT, PERSON } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  seo,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  seo?: Seo;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const t = seo?.title ?? title;
  const d = seo?.description ?? description;
  const og = imageUrl(seo?.ogImage, 1200);
  return {
    title: t,
    description: d,
    alternates: { canonical: seo?.canonical ?? path },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: t,
      description: d,
      url: path,
      type,
      ...(og ? { images: [{ url: og, width: 1200, height: 630 }] } : {}),
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: t, description: d },
  };
}

const PERSON_ID = () => absoluteUrl("/#person");

/** Profile photo for search engines: the CMS portrait (absolute URL), falling back to the social card. */
function portraitImage(p: Profile) {
  const url = imageUrl(p.portrait, 800);
  if (!url) return absoluteUrl("/opengraph-image");
  const abs = url.startsWith("http") ? url : absoluteUrl(url);
  const dim = p.portrait?.asset?.metadata?.dimensions;
  return { "@type": "ImageObject", url: abs, contentUrl: abs, caption: p.portrait?.alt ?? p.name, ...(dim ? { width: dim.width, height: dim.height } : {}) };
}
const WEBSITE_ID = () => absoluteUrl("/#website");

/** The Person entity every page refers to (one @id, so search engines merge it into a single profile). */
export function personNode(p: Profile) {
  return {
    "@type": "Person",
    "@id": PERSON_ID(),
    name: p.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    jobTitle: p.title,
    description: p.shortBio,
    url: absoluteUrl("/"),
    image: portraitImage(p),
    ...(p.email ? { email: `mailto:${p.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: PERSON.city, addressRegion: PERSON.region, addressCountry: PERSON.country },
    homeLocation: { "@type": "Place", name: `${PERSON.city}, ${PERSON.region}, India` },
    worksFor: { "@type": "Organization", name: PERSON.employer },
    alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.alumniOf },
    hasOccupation: {
      "@type": "Occupation",
      name: p.title,
      occupationLocation: { "@type": "City", name: PERSON.city },
      skills: KNOWS_ABOUT.join(", "),
    },
    knowsAbout: KNOWS_ABOUT,
    award: ["Employee of the Quarter (2025), Sapphire Software Solution", "Emerging Star Award (2024), Sapphire Software Solution"],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "B.Tech in Computer Science and Engineering", credentialCategory: "degree", recognizedBy: { "@type": "CollegeOrUniversity", name: PERSON.alumniOf } },
      { "@type": "EducationalOccupationalCredential", name: "IBM Project Manager Professional Certificate", credentialCategory: "certificate", recognizedBy: { "@type": "Organization", name: "IBM" } },
      { "@type": "EducationalOccupationalCredential", name: "Generative AI Mastermind", credentialCategory: "certificate", recognizedBy: { "@type": "Organization", name: "Outskill" } },
    ],
    sameAs: p.socialLinks.map((s) => s.url),
  };
}

/** Site-wide graph: WebSite + Person. Rendered on the home page. */
export function siteJsonLd(p: Profile) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID(),
        name: p.name,
        alternateName: ["JAIMIN / BEYOND CODE", `${p.name} Portfolio`],
        url: absoluteUrl("/"),
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID() },
      },
      personNode(p),
    ],
  };
}

/** /about is the canonical profile page for the person. */
export function profilePageJsonLd(p: Profile) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/about#profile"),
        url: absoluteUrl("/about"),
        name: `About ${p.name}`,
        isPartOf: { "@id": WEBSITE_ID() },
        mainEntity: { "@id": PERSON_ID() },
        inLanguage: "en",
      },
      personNode(p),
    ],
  };
}

const AREA_SERVED = [
  { "@type": "City", name: "Ahmedabad" },
  { "@type": "Country", name: "India" },
  { "@type": "Place", name: "Worldwide (remote)" },
];

function serviceNode(s: Service) {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`/services/${s.slug}#service`),
    name: s.title,
    serviceType: s.title,
    description: s.summary,
    url: absoluteUrl(`/services/${s.slug}`),
    provider: { "@id": PERSON_ID() },
    areaServed: AREA_SERVED,
    availableChannel: { "@type": "ServiceChannel", serviceUrl: absoluteUrl("/contact") },
  };
}

/** /services: the catalogue of services offered by the person. */
export function servicesJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Software development services by ${PERSON.name}`,
    url: absoluteUrl("/services"),
    provider: { "@id": PERSON_ID() },
    itemListElement: services.map((s, i) => ({ "@type": "Offer", position: i + 1, itemOffered: serviceNode(s) })),
  };
}

export function serviceJsonLd(s: Service) {
  return { "@context": "https://schema.org", ...serviceNode(s) };
}

export function articleJsonLd(post: Post, author: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", "@id": PERSON_ID(), name: author, url: absoluteUrl("/about") },
    publisher: { "@id": PERSON_ID() },
    isPartOf: { "@id": WEBSITE_ID() },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Serialise JSON-LD safely (escape `<` so content can never close the script tag). */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
