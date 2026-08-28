"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CircleHelp, Folder, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIconLink, UserChip } from "@/components/layout/HeaderActions";
import { unreadCount, useAppStore } from "@/lib/app-store";

const TITLES: Record<string, string> = {
  "/exams": "Exams",
  "/exams/processing": "Exams",
  "/exams/review": "Exams",
  "/home": "Home",
  "/classroom": "My Classroom",
  "/assignments": "Assignments",
  "/library": "My Library",
  "/settings": "Settings",
  "/help": "Help",
  "/notifications": "Notifications",
};

export function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const notifications = useAppStore((state) => state.notifications);
  const title = TITLES[pathname] ?? "Exams";
  const sectionHref = pathname.startsWith("/exams") ? "/exams" : (pathname || "/exams");
  const canGoBack = pathname !== "/exams" && pathname !== "/home";

  return (
    <header className="flex h-16 items-center justify-between rounded-2xl border border-white bg-white px-4 shadow-[0_6px_24px_rgba(40,30,20,0.04)]">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => (canGoBack ? router.back() : router.push("/exams"))}
          className="size-9 rounded-full text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Link
          href={sectionHref}
          className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-muted"
        >
          <Folder className="size-4 text-muted-foreground" />
          <span className="text-[15px] font-medium text-ink">{title}</span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <HeaderIconLink href="/help" label="Help">
          <CircleHelp className="size-4" />
        </HeaderIconLink>
        <HeaderIconLink
          href="/notifications"
          label="Notifications"
          dot={unreadCount(notifications) > 0}
        >
          <Bell className="size-4" />
        </HeaderIconLink>
        <HeaderIconLink href="/exams" label="AI Teacher's Toolkit">
          <Sparkles className="size-4 text-coral" />
        </HeaderIconLink>
        <UserChip />
      </div>
    </header>
  );
}
