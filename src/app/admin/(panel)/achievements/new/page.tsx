import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { createAchievement } from "../actions";

export default function NewAchievementPage() {
  return (
    <div className="px-8 py-8">
      <Link
        href="/admin/achievements"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-white">
        New achievement
      </h1>
      <AchievementForm action={createAchievement} />
    </div>
  );
}
