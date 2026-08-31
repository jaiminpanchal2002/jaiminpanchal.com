import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Jaimin OS",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0C0C0C] text-white">
      <Sidebar email={session.email} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
