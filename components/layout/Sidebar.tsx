"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FileText,
  House,
  PanelLeft,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { VedaLogo } from "@/components/layout/Logo";
import { useAssessmentStore } from "@/lib/assessment-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/home", label: "Home", icon: House },
  { href: "/classroom", label: "My Classroom", icon: Users },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/exams", label: "Exams", icon: ClipboardList },
  { href: "/library", label: "My Library", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAssessmentStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAssessmentStore((state) => state.toggleSidebar);
  const closeMobile = useAssessmentStore((state) => state.setMobileNavOpen);

  return (
    <aside
      className={cn(
        "flex h-full flex-col rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_10px_40px_rgba(40,30,20,0.04)]",
        collapsed ? "w-[88px]" : "w-[272px]",
      )}
    >
      <div className={cn("mb-5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        <Link href="/exams" className="flex items-center gap-2.5" onClick={() => closeMobile(false)}>
          <VedaLogo />
          {!collapsed && (
            <span className="text-[22px] font-semibold tracking-tight text-ink">VedaAI</span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "hidden rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-ink lg:inline-flex",
            collapsed && "mt-3",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      <div
        className={cn(
          "mb-6 flex items-center gap-2 rounded-full border border-coral/40 bg-ink px-3 py-2 text-white shadow-sm",
          collapsed && "justify-center px-2",
        )}
      >
        <Sparkles className="size-4 text-coral" />
        {!collapsed && (
          <span className="text-[13px] font-medium tracking-tight">AI Teacher&apos;s Toolkit</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {NAV.map((item) => {
          const active = item.href === "/exams" ? pathname.startsWith("/exams") : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => closeMobile(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors",
                collapsed && "justify-center px-2",
                active
                  ? "bg-[#f3f2ee] text-ink"
                  : "hover:bg-muted/80 hover:text-ink",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-[18px]" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        onClick={() => closeMobile(false)}
        className={cn(
          "mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-ink",
          collapsed && "justify-center px-2",
        )}
      >
        <Settings className="size-[18px]" />
        {!collapsed && "Settings"}
      </Link>

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border bg-[#faf8f4] p-3",
          collapsed && "justify-center p-2",
        )}
      >
        <SchoolCrest />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Delhi Public School</p>
            <p className="truncate text-xs text-muted-foreground">Bokaro Steel City</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function SchoolCrest() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <path d="M18 3 32 10v10c0 8-6.2 13.4-14 16C10.2 33.4 4 28 4 20V10L18 3Z" fill="#1F3D2B" />
      <path d="M18 8 27 12.5V20c0 5.2-3.8 8.8-9 10.6C12.8 28.8 9 25.2 9 20v-7.5L18 8Z" fill="#F4E7C5" />
      <path d="M18 13v12" stroke="#1F3D2B" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2.2" fill="#E85D3A" />
    </svg>
  );
}
