import type { Metadata } from "next";
import { ContactFinale } from "@/components/home/ContactFinale";
import { getHomePage, getProfile } from "@/content/api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Jaimin Panchal about hiring, product collaboration, engineering consulting or freelance projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const [home, profile] = await Promise.all([getHomePage(), getProfile()]);
  return (
    <div className="pt-16">
      <ContactFinale home={home} profile={profile} headingLevel="h1" />
    </div>
  );
}
