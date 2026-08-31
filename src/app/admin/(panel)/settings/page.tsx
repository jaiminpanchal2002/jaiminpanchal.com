import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Site Settings"
        subtitle="SEO metadata used across the public site."
      />
      <SettingsForm
        action={saveSettings}
        settings={
          settings
            ? {
                siteName: settings.siteName,
                seoTitle: settings.seoTitle,
                seoDescription: settings.seoDescription,
                ogImageUrl: settings.ogImageUrl,
              }
            : undefined
        }
      />
    </div>
  );
}
