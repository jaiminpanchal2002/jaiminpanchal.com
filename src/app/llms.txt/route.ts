import { getExperiences, getPosts, getProfile, getProjects, getSkills } from "@/content/api";
import { absoluteUrl } from "@/lib/utils";

/**
 * llms.txt (https://llmstxt.org): a plain-markdown summary that AI assistants can read
 * to answer "who is Jaimin Panchal?" accurately. Built from the same verified content
 * as the site, so it never says more than the pages do.
 */
export async function GET() {
  const [profile, experiences, projects, posts, { skills }] = await Promise.all([getProfile(), getExperiences(), getProjects(), getPosts(), getSkills()]);
  const verifiedSkills = skills.filter((s) => s.verified).map((s) => s.name);
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.name} is an ${profile.title} at PrimeQA Solutions, based in ${profile.location}. ${profile.headline}`,
    "",
    profile.shortBio,
    "",
    "## Profile",
    `- Role: ${profile.title}`,
    "- Current organisation: PrimeQA Solutions",
    `- Location: ${profile.location}`,
    "- Education: B.Tech in Computer Science and Engineering, Indus University",
    `- Skills: ${verifiedSkills.join(", ")}`,
    ...profile.socialLinks.map((s) => `- ${s.label}: ${s.url}`),
    "",
    "## Experience",
    ...experiences.filter((e) => e.verified).map((e) => `- ${e.role}, ${e.company}${e.current ? " (current)" : ""}`),
    "",
    "## Pages",
    `- [About](${absoluteUrl("/about")}): background, principles, education`,
    `- [Experience](${absoluteUrl("/experience")}): roles and responsibilities`,
    `- [Work](${absoluteUrl("/work")}): projects`,
    `- [Skills](${absoluteUrl("/skills")}): capabilities by area`,
    `- [Writing](${absoluteUrl("/blog")}): articles`,
    `- [Resume](${absoluteUrl("/resume")}): printable resume`,
    `- [Contact](${absoluteUrl("/contact")}): hiring, collaboration and consulting enquiries`,
    ...(projects.some((p) => p.verified) ? ["", "## Projects", ...projects.filter((p) => p.verified).map((p) => `- [${p.title}](${absoluteUrl(`/work/${p.slug}`)}): ${p.summary}`)] : []),
    ...(posts.some((p) => p.verified) ? ["", "## Articles", ...posts.filter((p) => p.verified).map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`)] : []),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
