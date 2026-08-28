"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { VedaLogo } from "@/components/layout/Logo";
import { useAssessmentStore } from "@/lib/assessment-store";

export function MobileHeader() {
  const setMobileNavOpen = useAssessmentStore((state) => state.setMobileNavOpen);

  return (
    <header className="flex h-14 items-center justify-between rounded-2xl border border-white bg-white px-3 shadow-[0_6px_24px_rgba(40,30,20,0.04)]">
      <Link href="/exams" className="flex items-center gap-2">
        <VedaLogo size={30} />
        <span className="text-lg font-semibold tracking-tight">VedaAI</span>
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-coral" />
        </button>
        <span className="flex size-8 items-center justify-center rounded-full bg-[#d8c3a5] text-[11px] font-semibold">
          MR
        </span>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-full text-ink"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
