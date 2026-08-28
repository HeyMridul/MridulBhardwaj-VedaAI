"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Folder,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/exams": "Exams",
  "/exams/processing": "Exams",
  "/exams/review": "Exams",
  "/home": "Home",
  "/classroom": "My Classroom",
  "/assignments": "Assignments",
  "/library": "My Library",
  "/settings": "Settings",
};

export function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = TITLES[pathname] ?? "Exams";
  const canGoBack = pathname !== "/exams" && pathname !== "/home";

  return (
    <header className="flex h-[64px] items-center justify-between rounded-2xl border border-white bg-white px-4 shadow-[0_6px_24px_rgba(40,30,20,0.04)]">
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
        <Folder className="size-4 text-muted-foreground" />
        <span className="text-[15px] font-medium text-ink">{title}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <IconButton label="Help">
          <CircleHelp className="size-4" />
        </IconButton>
        <IconButton label="Notifications" dot>
          <Bell className="size-4" />
        </IconButton>
        <IconButton label="AI tools">
          <Sparkles className="size-4 text-coral" />
        </IconButton>
        <Link
          href="/settings"
          className="ml-1 flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#d8c3a5] text-xs font-semibold text-ink">
            MR
          </span>
          <span className="hidden text-sm font-medium text-ink md:inline">Madhur Rastogi</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
  dot,
}: {
  children: React.ReactNode;
  label: string;
  dot?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-ink",
      )}
    >
      {children}
      {dot && (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-coral" />
      )}
    </button>
  );
}
