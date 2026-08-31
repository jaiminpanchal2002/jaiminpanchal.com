"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  FileText,
  Award,
  Hammer,
  Route,
  MessageSquare,
  Search,
  KanbanSquare,
  BarChart3,
  ScanSearch,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/admin/auth-actions";

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  soon?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Skills", href: "/admin/skills", icon: Sparkles },
      { label: "Currently Building", href: "/admin/building", icon: Hammer },
      { label: "Journey", href: "/admin/journey", icon: Route },
      { label: "Education", href: "/admin/education", icon: GraduationCap },
      { label: "Achievements", href: "/admin/achievements", icon: Award },
      { label: "Resumes", href: "/admin/resumes", icon: FileText },
      { label: "Profile", href: "/admin/profile", icon: User },
    ],
  },
  {
    title: "Career",
    items: [
      { label: "Job Discovery", href: "/admin/jobs", icon: Search },
      { label: "Applications", href: "/admin/applications", icon: KanbanSquare },
      { label: "ATS Analyzer", href: "/admin/ats", icon: ScanSearch },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-[#0C0C0C]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 font-mono text-sm font-bold text-white">
          JP
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Jaimin OS</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
            command center
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[0.65rem] uppercase tracking-[0.25em] text-white/30">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href
                  ? item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                  : false;
                const Icon = item.icon;

                if (item.soon || !item.href) {
                  return (
                    <li
                      key={item.label}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/30"
                      title="Coming in a later phase"
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={17} />
                        {item.label}
                      </span>
                      <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-white/30">
                        Soon
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <p className="truncate px-3 pb-2 text-xs text-white/40">{email}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
