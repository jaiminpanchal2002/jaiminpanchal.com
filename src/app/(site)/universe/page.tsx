import type { Metadata } from "next";
import { UniverseExperience, type StationInfo } from "@/components/three/UniverseExperience";
import { getProfile } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Enter the universe",
  description: "An optional interactive 3D map of Jaimin Panchal's work, experience and writing. Every destination is also reachable from the standard menu.",
  path: "/universe",
});

export default async function UniversePage() {
  const profile = await getProfile();
  const stations: StationInfo[] = [
    { id: "about", label: "About", href: "/about", summary: profile.shortBio, shape: "ico" },
    { id: "work", label: "Work", href: "/work", summary: "Products and platforms, with the role and decisions behind each.", shape: "box" },
    { id: "experience", label: "Experience", href: "/experience", summary: "The career path from engineering roles to product and delivery ownership.", shape: "torus" },
    { id: "skills", label: "Skills", href: "/skills", summary: "Capabilities across backend, frontend, data, AI-enabled applications and delivery.", shape: "octa" },
    { id: "writing", label: "Articles", href: "/blog", summary: "Notes on architecture, APIs, AI engineering and software delivery.", shape: "knot" },
    { id: "contact", label: "Contact", href: "/contact", summary: "Hiring, product collaboration, consulting or freelance: start a conversation.", shape: "ring" },
  ];
  return <UniverseExperience stations={stations} />;
}
